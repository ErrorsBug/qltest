import React from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import ImgBar from './component/img-bar';
import Progress from './component/progress';
import ShowImage from './component/show-image';
import InputLabel from './component/input-label';
import Detect from 'components/detect';
import {fillParams} from 'components/url-utils';
import OperationLabel from './component/operation-label';
import {getWxConfig} from 'common_actions/common';
import { pushImage, saveActiveImage, addAudio, computeTotalSecond, addText, uploadData } from '../../actions/short-knowledge';

const reducer = state => ({
    initData: state.shortKnowledge.initData,
    resourceList: state.shortKnowledge.resourceList,
    textContent: state.shortKnowledge.textContent,
    audioList: state.shortKnowledge.audioList
})

const actions = {
    pushImage,
    saveActiveImage,
    addAudio,
    computeTotalSecond,
    addText,
    uploadData,
    getWxConfig
}

class PPTEdit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            play: false,
            showDeleteDialog: false,
            showAddImageOutside: '', // N，Y
        }
    }

    componentWillMount(){
        // 发布之后的编辑页面
        if((this.props.location.query.id || this.props.location.query.knowledgeId)){
            let { initData } = this.props
            let audioList = {}
            let totalSecond = 0
            let textContent = {}
            if(Array.isArray(initData.resourceList) && initData.resourceList.length > 0){
                // 将图片列表存入store
                this.props.pushImage(initData.resourceList, true)
                initData.resourceList.forEach(i => {
                    if(i.type === 'image'){
                        if(Array.isArray(i.list)){
                            let arr = []
                            i.list.forEach(l => {
                                if(l.type === 'audio'){
                                    arr.push(l)
                                    // 秒数累加
                                    totalSecond += l.duration
                                }
                                if(l.type === 'text'){
                                    textContent[i.id] = l
                                }
                            })
                            audioList[i.id] = arr
                        }
                    }
                })
                this.props.addAudio(audioList, true)
                // 计算秒数
                this.props.computeTotalSecond(totalSecond, true)
                // 初始化文字描述
                this.props.addText(textContent, true)
            }
        // 创建过程防止刷新导致数据丢失
        }else {
            if(sessionStorage.getItem('resourceList')){
                this.props.pushImage(JSON.parse(sessionStorage.getItem('resourceList')), true)
            }
            if(sessionStorage.getItem('audioList')){
                this.props.addAudio(JSON.parse(sessionStorage.getItem('audioList')), true)
            }
            if(sessionStorage.getItem('textContent')){
                this.props.addText(JSON.parse(sessionStorage.getItem('textContent')), true)
            }
            if(sessionStorage.getItem('totalSecond')){
                this.props.computeTotalSecond(JSON.parse(sessionStorage.getItem('totalSecond')), true)
            }
        }
        
    }

    async componentDidMount(){
        try {
            if((Detect.os.phone || Detect.os.tablet) && Detect.os.weixin) {
                if(!this.autoReady){
                    this.autoReady = true
                    wx.ready(() => {
                        wx.startRecord({
                            success: () => {
                                setTimeout(_=>{
                                    this.autoReady = false
                                    wx.stopRecord()
                                },1000)
                            }
                        });
                    })
                }
            }
        }catch(err){
            console.log(err)
        }
    }

    deleteImage = (success = () => {}) =>{
        this.setState({showDeleteDialog: true})
        this.success = () => {
            success()
            this.hideDialog()
            this.whereShowAddImageBtn()
        }
    }

    hideDialog = () => {
        this.setState({showDeleteDialog: false})
    }

     // 在哪里显示增加图片按钮
     whereShowAddImageBtn = () => {
        let timeout = setTimeout(_=>{
            let container = document.querySelector('.img-list')
            if(container){
                this.setState({showAddImageOutside: container.scrollHeight > container.offsetHeight ? 'Y' : 'N'})
            }
            clearTimeout(timeout)
        },0)
    }

    // 清除有声PPT页面和发布页面创建的session缓存
    clearStroge = () => {
        let strogeList = ['resourceList', 'totalSecond', 'audioList', 'initData', 'textContent']
        strogeList.forEach(i => {
            sessionStorage.removeItem(i)
        })
    }

    // 下一步
    nextStep = async() => {
        // 停止当前播放的音频
        this.stopPlay()
        this.clearStroge()
        let { resourceList, textContent, audioList } = this.props
        if(resourceList.length < 1){
            window.toast('当前ppt不存在内容！')
            return
        }
        resourceList = resourceList.map((i,d) => {
            let list = []
            if(Array.isArray(audioList[i.id])){
                list = list.concat(audioList[i.id])
            }
            if(textContent[i.id]){
                list.push(textContent[i.id])
            }
            return {...i, list}
        })
        let id = (this.props.location.query.id || this.props.location.query.knowledgeId)
        let uploadData = {
            ...this.props.initData,
            liveId: this.props.location.query.liveId || '',
            type: 'ppt',
            coverImage: this.props.initData.coverImage || this.props.resourceList[0].content || '',
            resourceList
        }
        // 存草稿之后的编辑不传wxlocalId和resourceId
        if(!id){
            uploadData.wxlocalId = this.props.resourceList[0].wxlocalId || ''
            uploadData.resourceId = this.props.resourceList[0].resourceId || ''
        }
        let liveId = this.props.location.query.liveId
        this.props.uploadData(uploadData)
        let businessId = this.props.location.query.businessId;
        let businessType = this.props.location.query.businessType;
        let url = fillParams({liveId, id, businessId, businessType}, '/wechat/page/short-knowledge/publish')
        this.props.router.push(url)
    }

    // 停止播放
    stopPlay = () => {
        this.showImageEle.getWrappedInstance() 
        && this.showImageEle.getWrappedInstance().stopPlay 
        && this.showImageEle.getWrappedInstance().stopPlay()
    }

    render(){
        return (
            <Page title="有声PPT" className="a-ppt-what-has-sound">
                <div className="ppt-content">
                    <ImgBar 
                        showAddImageOutside = {this.state.showAddImageOutside}
                        whereShowAddImageBtn = {this.whereShowAddImageBtn}
                    />
                    <ShowImage 
                        afterPublish = {(this.props.location.query.id || this.props.location.query.knowledgeId) ? true : false}
                        ref = {el => this.showImageEle = el}
                    />
                </div>
                <Progress />
                <div className="ppt-operation">
                    <InputLabel stopPlay = {this.stopPlay}/>
                    <OperationLabel 
                        deleteImage = {this.deleteImage}
                        nextStep = {this.nextStep}
                    />
                </div>
                {
                    this.state.showDeleteDialog ? 
                    <div className="delete-dialog">
                        <div className="bg" onClick={this.hideDialog}></div>
                        <div className="delete-dialog-container">
                            <div className="content">确认删除图片</div>
                            <div className="btn-group">
                                <span className="btn confirm" onClick={this.success}>确认</span>
                                <span className="btn cancel" onClick={this.hideDialog}>取消</span>
                            </div>
                        </div>
                    </div> : null
                }
            </Page>
        )
    }
}

export default connect(reducer, actions)(PPTEdit)

