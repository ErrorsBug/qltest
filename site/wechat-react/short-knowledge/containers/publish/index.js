import React, { Component } from 'react';
import { showWinPhoneAuth } from 'components/phone-auth';
import { uploadImage, getStsAuth } from '../../actions/common';
import { connect } from 'react-redux';
import Page from 'components/page';
import { getUserInfo, getLiveTag } from '../../actions/common';
import { getAgreementVersion, getAgreementStatus, assignAgreement } from 'common_actions/common';
import {getVal} from 'components/util';
import { normalFilter } from 'components/util';
import ProtocolPage from 'components/protocol-page';
import {MiddleDialog, BottomDialog} from "components/dialog";
import { request } from 'common_actions/common';
import { uploadData } from '../../actions/short-knowledge';

class Publish extends Component {
    state = {
        agree: false,
        editCover: '',
        textareaValue: '',
        wordCount: 0,
        introValue: '',
        wordIntroCount: 0,
        showProtocol: false,
        // 是否同意过该版本的协议，如果同意过就不显示
        agreeStatus: '',
        // 当前协议的版本
        agreementVersion: '',
        showMusicDialog: false,
        // 音乐列表
        musicList: [],
        // 选中的音乐对象
        selectMusic: {},
        // 播放的音乐链接
        musicUrl: '',
        // 播放状态
        playStatus: false,
        // 发布页面类型
        type: '',
        // 审核状态
        auditStatus: '',
        mobile: '',
        // 微信上传的封面id
        resourceId: ''
    }

    data = {
        imageFormatsAllow: ['jpeg', 'jpg', 'png', 'bmp', 'gif'], //上传图片的格式
    }

    componentWillMount(){
        
        let initData
        let auditStatus = ''
        // 创建的时候防止数据丢失
        if(!(this.props.location.query.id || this.props.location.query.knowledgeId)){
            if(sessionStorage.getItem('initData')){
                initData = JSON.parse(sessionStorage.getItem('initData'))
                this.props.uploadData(initData)
            }
        }else {
            initData = this.props.initData
            auditStatus = this.props.initData.auditStatus
        }
        this.setState({
            textareaValue: getVal(initData, 'name', ''),
            wordCount: getVal(initData, 'name', '').length,
            introValue: getVal(initData, 'introduction', ''),
            wordIntroCount: getVal(initData, 'introduction', '').length,
            type: getVal(initData, 'type', ''),
            editCover: getVal(initData, 'coverImage', '') || getVal(initData, 'wxlocalId', ''),
            resourceId: getVal(initData, 'resourceId', ''),
            auditStatus,
        })
    }

    componentDidMount(){
        console.log("this.props.initData",this.props.initData);
        this.initStsInfo()
        this.getAgreementStatus()
        // ppt类型的发布页面才能选择音乐
        if(this.state.type === 'ppt'){
            this.getMusic()
        }
        this.getUserInfo()
        setTimeout(() => {
            // 发布之后回退到发布页面，会提示重新上传
            if(!Array.isArray(this.props.initData.resourceList) || this.props.initData.resourceList.length < 1){
                window.toast('上传数据为空，请重新上传！')
                let id = (this.props.location.query.id || this.props.location.query.knowledgeId)
                setTimeout(_=>{
                    window.location.href = '/wechat/page/short-knowledge/create' + (id ? `?knowledgeId=${id}` : '')
                },1500)
                return
            }
        }, 1500);
        
    }

    // drawWater(){
    //     /**  水印图片  */
    //     let canvas = document.createElement('canvas');
            
    //     let ctx = canvas.getContext("2d");
    //     this.water = new Image();
    //     this.editCover = new Image();
        
    //     this.editCover.onload = async ()=>{
    //         canvas.width = 200;
    //         canvas.height = 200;
    //         ctx.drawImage(this.editCover, 0 , 0, 200, 200);
    //         this.water.onload = async ()=>{
    //             ctx.drawImage(this.water, 0 , 0, 200, 200);
    //             let resultFileWater = dataURLtoBlob(canvas.toDataURL('image/jpeg', 0.5));
    //             resultFileWater = new File([resultFileWater], 'temp.jpg', {
    //                 type: 'image/jpeg',
    //             });
    //             let waterImgUpload = await this.props.uploadImage({file: resultFileWater ,needTip: false, needLoading: false});
    //             this.waterImage = waterImgUpload;
    //             console.log(waterImgUpload)
    //         }
    //         this.water.src = this.imageProxyFunc('https://img.qlchat.com/qlLive/short/video-water.png?v=423423');
    //     }
    //     console.log(this.state.editCover)
    //     this.editCover.src = this.imageProxyFunc(this.state.editCover);
        
    //     /**  水印图片  */
    // }

    getUserInfo = async() =>{
        // 发布前先验证手机号
        const result = await this.props.getUserInfo();
        this.setState({
            mobile: getVal(result, 'data.user.mobile', '')
        })
    }

    // 获取讲师协议状态
    getAgreementStatus = async()=> {
        // 获取讲师协议版本
        await getAgreementVersion().then(async(version) => {
            this.setState({agreementVersion: version})
            // 如果没有直播间，则一定要勾选协议
            if(!this.liveId){
                this.setState({
                    agreeStatus: 'N',
                })
                return
            }
            // 获取讲师协议同意状态
            const res = await getAgreementStatus({liveId: this.liveId,version})
            if(res.state.code === 0){
                let status = res.data && res.data.status
                if(status == 'Y'){
                    this.setState({
                        agreeStatus: 'Y',
                    })
                }else {
                    this.setState({
                        agreeStatus: 'N',
                    })
                }
            }
        },reject => {
            console.error(reject)
        })
    }

    get liveId(){
        return this.props.location.query.liveId || ''
    }

    // oss上传
	initStsInfo() {
		this.props.getStsAuth();
		const script = document.createElement('script');
		script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
		document.body.appendChild(script);
	}

    textareaChange = (e) => {
        let value = (e.target.value || '').trim()
        this.setState({textareaValue: value, wordCount: value.length})
    }
    introChange = (e) => {
        let value = (e.target.value || '').trim()
        this.setState({introValue: value, wordIntroCount: value.length})
    }

    agreeProtocal = () => {
        this.setState({agree: !this.state.agree})
    }

    // 图片选择之后的处理
    editCoverHandler = async(e) => {
        let imageUrl = await this.props.uploadImage({file: e.target.files[0]})
        this.setState({editCover: imageUrl})
    }

    // 更新上传的数据
    updateData = (status) => {
        let initData = this.props.initData
        let id = (this.props.location.query.id || this.props.location.query.knowledgeId)
        // PPT创建过程封面是微信上传的，即拿的是第一张图片的封面，需要传一个resourceId
        if(!id && this.state.editCover.indexOf('http') < 0){
            initData.resourceId = this.state.resourceId
        // 视频编辑发布或者PPT编辑发布的时候就传coverImage
        }else{
            initData.coverImage = this.state.editCover
            // initData.watermarkImg = this.waterImage || this.state.editCover;
        }
        initData.name = this.state.textareaValue
        initData.introduction = this.state.introValue
        initData.bgMusicId = this.state.selectMusic.id
        initData.status = status
        if(!Array.isArray(initData.resourceList) || initData.resourceList.length < 1){
            window.toast('上传数据为空，请重新上传！')
            setTimeout(_=>{
                window.location.href = '/wechat/page/short-knowledge/create' + (id ? `?knowledgeId=${id}` : '')
            },1500)
            return false
        }
        // 过滤非法字符
        let resourceList = initData.resourceList.map(i => {
            if(i.type === 'image'){
                let list = Array.isArray(i.list) ? i.list.map(l => {
                    if(l.type === 'text'){
                        return {...l, content: normalFilter(l.content)}
                    }else {return l}
                }) : i.list
                return {...i, list}
            }else {return i}
        })
        initData.resourceList = resourceList

        // 首次发布要传auditStatus=noAudit
        if(!(this.props.location.query.id || this.props.location.query.knowledgeId)){
            initData.auditStatus = 'noAudit'
        }
        if(!this.state.editCover){
            window.toast('未选择封面')
            return false
        }
        if(!initData.name){
            window.toast('未填写标题')
            return false
        }
        if(initData.name.length > 30){
            window.toast('标题长度不能超过30个字符')
            return false
        }
        return initData
    }

    // 存草稿，上传
    save = async (type) => {
        // 正在审核中的不允许提交
        if(this.state.auditStatus == 'auditing'){
            window.toast('正在审核中，无法修改！')
            return
        }
        let shortKnowledgeDto = this.updateData(type)
        if(!shortKnowledgeDto){
            return
        }
        // 发布前勾选协议
        if(this.state.agreeStatus == 'N' && !this.state.agree){
            return window.toast('请务必先确认勾选协议');
        }
        // 没验证手机的先进行手机验证
        if (!this.state.mobile) {
            await showWinPhoneAuth({
                close: true, 
                onSuccess: ({mobile})=>{
                    this.nextStep(shortKnowledgeDto, type, mobile)
                }
            });
        }else {
            this.nextStep(shortKnowledgeDto, type, this.state.mobile )
        }
    }

    nextStep = async(shortKnowledgeDto, type, mobile = '') => {
        if(this.lock){
            return
        }
        this.lock = true
        // 没有直播间的要先创建直播间
        let liveId = this.liveId || await this.createLive(mobile)
        if(!liveId){
            this.lock = false
            return
        }
        shortKnowledgeDto.liveId = liveId
        // 同意讲师协议
        if(this.state.agreeStatus == 'N'){
            await assignAgreement({liveId,version: this.state.agreementVersion})
            this.setState({agreeStatus: 'Y'})
        }
        window.loading(true);
        // 创建接口
        let url = '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/addKnowledge'
        // 编辑接口
        if((this.props.location.query.id || this.props.location.query.knowledgeId)||this.props.initData.knowledgeId){
            url = '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/updateKnowledge'
        }
        let businessId = this.props.location.query.businessId;
        let businessType = this.props.location.query.businessType;
        shortKnowledgeDto.businessId = businessId;
        shortKnowledgeDto.businessType = businessType;
        request.post({
            url,
            body: { shortKnowledgeDto }
        }).then(res => {
            if(res.state.code !== 0){
                throw new Error(res.state.msg)
            }
            if(type == 'draft'){
                window.toast('存草稿成功')
                setTimeout(_=>{
                    window.location.href = `/wechat/page/short-knowledge/video-list?knowledgeId=${getVal(res, 'data.shortKnowledgeDto.id', '')}&liveId=${liveId}`;
                    this.lock = false
                }, 1000)
            }else {
                window.toast('发布成功')
                setTimeout(()=>{
                    window.location.href = `/wechat/page/short-knowledge/video-show?knowledgeId=${getVal(res, 'data.shortKnowledgeDto.id', '')}&liveId=${liveId}`;
                    this.lock = false
                },1000);
            }
            
        }).catch(err => {
            window.toast(err.message);
            this.lock = false;
        }).then(() => {
            window.loading(false);
        })
    }
    

    // 获取音乐列表
    getMusic = async() => {
        request.post({
            url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/getMusicList',
            body: { 
                page: {
                    page: 1,
                    size: 100
                }
            }
        }).then(res => {
            if(res.state.code !== 0){ throw new Error(res.state.msg)}
            if(res.data && Array.isArray(res.data.musicList) && res.data.musicList.length > 0){
                let musicList = []
                let selectMusic = {}
                let musicId = getVal(this.props, 'initData.bgMusicId')
                musicList = res.data.musicList.map(i => {
                    if(musicId && musicId == i.id){
                        selectMusic = i
                        return {...i, select: true}
                    }
                    return {...i, select: false}
                })
                this.setState({
                    selectMusic,
                    musicList
                })
            }
        }).catch(err => {
            window.toast(err.message);
        }).then(() => {
            window.loading(false);
        })
    }

    // 打开音乐列表弹窗
    openMusicListDialog = () => {
        if(this.state.musicList.length == 0){
            window.toast('暂无可选择的音乐')
            return
        }
        this.setState({
            showMusicDialog: true
        })
    }

    toggleProtocol = () => {
        this.setState({
            showProtocol: !this.state.showProtocol
        });
    }

    hideMusicDialog = ()=>{
        this.musicAudio.pause()
        this.setState({showMusicDialog: false, playStatus: false})
    }

    // 音乐列表弹窗选中音乐
    selectMusic = (item) => {
        let { musicList} = this.state
        // 点击选中的就取消选中，
        if(item.select){
            musicList = musicList.map(i => ({...i, select: false}))
            this.musicAudio.pause()
            this.setState({playStatus: false, musicUrl: ''})
        }else {
            musicList = musicList.map(i => ({...i, select: item.id === i.id ? true : false}))
            this.musicAudio.pause()
            this.setState({
                musicUrl: item.musicUrl,
                playStatus: true
            }, _=>{
                this.musicAudio.play()
            })
        }
        this.setState({musicList})
    }

    // 点击音乐列表弹窗底部按钮
    selectBtnClick = () => {
        let { musicList } = this.state
        let selectMusic = musicList.find(i => i.select === true) || {}
        this.musicAudio.pause()
        this.setState({ selectMusic, showMusicDialog: false, playStatus: false})
    }

    // 暂停音频
    audioPause = () => {
        this.musicAudio.pause()
        this.setState({playStatus: false})
    }

    // 播放音频
    audioPlay = () => {
        this.musicAudio.play()
        this.setState({playStatus: true})
    }

    // 创建直播间
    createLive = async (phoneNum)=> {
        return new Promise(resolve => {
            this.props.getLiveTag().then(result => {
                if(result && result.data && Array.isArray(result.data.dataList)){
                    let id = result.data.dataList[0].id
                    request.post({
                        url: '/api/wechat/transfer/h5/live/create',
                        body: { 
                            id,
                            phoneNum,
                            createrDuty: 'audience',
                            ch: '',
                            hasOfficialAccount: 'N',
                            ch: 'short_knowledge',
                            wechatAccount: "-1",
                            agreementVersion: this.state.agreementVersion,
                            officialAccount: ''
                        }
                    }).then(res => {
                        if(res.state.code !== 0){
                            throw new Error(res.state.msg)
                        }
                        let liveId = getVal(res, 'data.live.liveEntityView.id', '')
                        resolve(liveId)
                    }).catch(err => {
                        window.toast(err.message);
                        resolve('')
                    })
                }else {
                    resolve('')
                }
            })
        })
    }

    onBlur(){
        // 解决iOS系统下收起键盘后页面被截断的问题
        window.scroll(0, 0);
    }

    render(){
        let imageAcceptArr = this.data.imageFormatsAllow.map(format => `image/${format}`).join(',')
        let { agree, agreeStatus, selectMusic, musicList, musicUrl, playStatus, editCover } = this.state
        return(
            <Page title="发布" className="short-knowledge-publish">
                <div className="edit-content">
                    <div className="text-content">
                        <div className="text-type">设置标题 <span className="count">{this.state.wordCount}/30</span></div>
                        <textarea 
                            onChange = {this.textareaChange}
                            className = {`edit-textarea`}
                            placeholder = {`请输入标题，吸引用户点击链接~`}
                            value = {this.state.textareaValue}
                            onBlur ={this.onBlur}
                        />
                    </div>
                    <div className="image-content on-log"
                        data-log-region="short-publish"
                        data-log-pos={this.state.type == 'ppt'?"ppt-cover":"video-cover"}
                        data-log-name="修改封面"
                    >
                        <img src={editCover} alt=""/>
                        <div className="edit">修改封面</div>
                        <input type="file" accept="image/*" onChange = {this.editCoverHandler}/>
                    </div>
                </div>
                <div className="edit-content">
                    <div className="text-content">
                        <div className="text-type">设置简介 <span className="count">{this.state.wordIntroCount}/30</span> </div>
                        <textarea 
                            onChange = {this.introChange}
                            className = {`edit-textarea`}
                            placeholder = {`请输入短知识简介，会展示在分享链接上~`}
                            value = {this.state.introValue}
                            onBlur ={this.onBlur}
                        />
                        
                    </div>
                </div>
                {
                    this.state.type == 'ppt' ? 
                    <div className="add-music on-log"
                    data-log-region="short-publish"
                    data-log-pos="ppt-music"
                    data-log-name="背景音乐" onClick={this.openMusicListDialog}>
                        <div>
                            <div className="label">{ selectMusic.name || '添加音乐' }</div>
                            <span className="icon-enter"></span>
                        </div>
                    </div> : null
                }
                <div className="bottom">
                    {
                        agreeStatus === 'N' ? 
                        <div className="agree-protocal">
                            <span className={`icon${agree ? ' agree' : ''}`} onClick={this.agreeProtocal}></span>
                            本人已阅读并同意<em onClick={this.toggleProtocol}>《千聊平台讲师服务协议》</em>
                        </div> : null
                    }
                    <div className={`btn-group${agreeStatus === 'Y' || agree ? ' agree' : ''}`}>
                        <div className="btn save on-log"
                        data-log-region="short-publish"
                        data-log-pos={this.state.type == 'ppt'?"ppt-draft":"video-draft"}
                        data-log-name="存草稿" 
                        onClick={()=>{this.save('draft')}}>存草稿</div>
                        <div className="btn push on-log"
                        data-log-region="short-publish"
                        data-log-pos={this.state.type == 'ppt'?"ppt-publish":"video-publish"}
                        data-log-name="发布"  onClick={()=>{this.save('publish')}}>发布</div>
                    </div>
                </div>
                {/* 讲师协议 */}
                <MiddleDialog
                    className="protocol-dialog"
                    show={this.state.showProtocol}
                    theme="empty"
                    onClose={this.toggleProtocol}
                    close={true}
                >
                    <div className="main">
                        <ProtocolPage />
                    </div>
                </MiddleDialog>
                <BottomDialog
                    show = {this.state.showMusicDialog}
                    bghide = {true}
                    theme="empty"
                    onClose = {this.hideMusicDialog}
                    className = "music-dialog-container"
                >
                    <div className="header">选择背景音乐<span className="icon_delete" onClick={this.hideMusicDialog}></span></div>
                    <div className="music-list">
                        {
                            musicList.length > 0 ? musicList.map((i, d) => {
                                return (
                                    <div className="item">
                                        <div className="icon">
                                            {
                                                i.select ? 
                                                (playStatus ? <span className="pause" onClick={this.audioPause}></span> : <span className="play" onClick={this.audioPlay}></span>) :
                                                <span className="index">{d+1}</span>
                                            }
                                        </div>
                                        <span className="name" onClick={()=>{this.selectMusic(i)}}>{i.name}</span>
                                        <span className={`select${i.select ? ' check': ' uncheck'}`} onClick={()=>{this.selectMusic(i)}}></span>
                                    </div>
                                )
                            }) : null 
                        }
                    </div>
                    <div className="music-dialog-bottom">
                        <div className="btn" onClick={this.selectBtnClick}>选好了</div>
                    </div>
                </BottomDialog>
                <audio className={`music-audio`} src={musicUrl} ref={el => this.musicAudio = el}></audio>
            </Page>
        )
    }
}

export default connect(state=>({
    uploadVideoData: state.shortKnowledge.uploadVideoData,
    initData: state.shortKnowledge.initData,
}),{
    getUserInfo,
    uploadImage,
    getStsAuth,
    uploadData,
    getLiveTag
})(Publish)
