import React, { Component, Fragment } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal, normalFilter, imgUrlFormat,isFromLiveCenter } from 'components/util';
import CommonTextarea from 'components/common-textarea';
import MiddleDialog from '../dialog/middle-dialog';
import { autobind } from 'core-decorators';
import { campCheckInListModel, campUserInfoModel } from '../../model';
import AudioItem from '../audio-item';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ImgUpload from '../img-upload';
import BottomRecorder from '../bottom-recorder';
import { mockableApiFactory } from '../../utils/api';
import AchievementCard from '../achievement-card'
import { requestCheckInHeadList } from '../../model/camp-user-list/actions';

const checkInPublishApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/checkInPublish',
    method: 'POST'
});

const getQrCodeApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/getQrCode',
    method: 'POST',
})

const { 
    requestDeleteCommentCheckInNews, 
    prependCheckInList
} = campCheckInListModel;
const { setCampUserInfo } = campUserInfoModel;

const PAGE_TYPE = {
    qrCode: "QRCODE",
    checkIn: "CHECKINPAGE",
    acheveCard: "ACHEVECARD"
}

@autobind
export class CheckInPage extends Component {
    static propTypes = {
        isShow: PropTypes.bool,
        close: PropTypes.func,
        liveId: PropTypes.string,
        campId: PropTypes.string,
        campName: PropTypes.string,
        onChecked: PropTypes.func,
    }

    state = {
        content: '',
        // sortNum	number	排序
        // imageUrl	string	作业图片链接PC端录音前端之前上传到阿里云
        // imageId	string	微信端录音使用，上传一个资源ID
        imageList: [],
        // audioId	string	语音微信资源ID微信端录音使用，上传一个资源ID
        // audioUrl	string	作业语音链接PC端录音前端之前上传到阿里云
        // duration	number	音频时长时长
        audioList: [],
        showRecord: false,
        wordLength: 0,
        showQRCard: false,
        showCheckIn: true,
        showAcheveCard: false,

        shareData: {
            userName: '',
            campName: '',
            daysNum: 0,
            headImgUrl: '',
            shareUrl: '',
            receiveDayNum: 0,
        },
        qrUrl: '',
        currentPlayingIndex: null,
        
    }

    onTextContentChange(e) {
        this.setState({
            content: e.target.value,
            wordLength:e.target.value.length
        });
    }

    componentDidMount = () => {
        this.audioItem = [];
        this.clickIndex = null;
        window.onpopstate = () => {
            if (!/checkInPage/.test(location.hash)) { 
                this.props.close();
            }
        }
        this.initAudio();
    }
    

    componentWillReceiveProps = (nextProps) => {
        if (!this.props.isShow && nextProps.isShow) {
            if (!/checkInPage/.test(location.hash)) {
                window.history.pushState(null, null, location.href + '#checkInPage=true');
            }
        }
    }
    

    uploadHandle(imgs) {
        if (imgs.length + this.state.imageList.length > 9) {
            window.toast("不能超过9张图片");
            return
        }
        const newImgList = imgs.map((item, index) => {
            if (item.type === 'image') {
                return {
                    imageUrl: item.url,
                }
            } else {
                return {
                    localId: item.localId,
                    imageId: item.serverId,
                }
            }
        })

        this.setState({ imageList: [...this.state.imageList, ...newImgList]});
    }

    // pc录音发送处理
    pcSendRecHandle(audioItem) {
        let { url, second } = audioItem;
        const newAudio = {
            audioUrl: url,
            duration: second,
            isWx: false,
        }

        this.setState({
            audioList: [...this.state.audioList , newAudio],
            showRecord:false,
        })
        return {
            state: {
                code:0
            }
        }
    }
    
    // 微信录音处理
    wxUploadHandle(audioItem) {
        let { recLocalId, second, serverId } = audioItem;
        const newAudio = {
            audioId: serverId,
            audioUrl: null,
            duration: second,
            recLocalId,
            isWx: true
        }
        

        if (serverId) {
            this.setState({
                audioList: [...this.state.audioList , newAudio],
                showRecord:false,
            })
            return {
                state: {
                    code:0
                }
            }
        }
    }

    hideRecode() {
        this.setState({ showRecord: false});
    }

    showRecode() {
        if(this.state.audioList.length >=5 ){
            window.toast("动态语音不能超多5条");
            return false;
        }
        this.setState({ showRecord: true});
    }

    deleteImg(index) {
        const newImageList = this.state.imageList.filter((item, idx) => idx !== index);
        this.setState({ imageList: newImageList})
    }

    /*** 微信音频 */

    deleteAudio(index) {
        // 如果正在播放，删除之前先停止播放
        this.disableAudio(this.state.currentPlayingIndex);
        let audioList = this.state.audioList;
        audioList.splice(index,1);
        this.setState({ audioList: audioList})
    }

    initAudio() {
        this.enableControl = true;
        wx.ready(() => {
            wx.onVoicePlayEnd({
                success: (res) => {
                   this.disableAudio(this.state.currentPlayingIndex);
                },
                fail: () => {
                    console.log("onVoicePlayEnd","false");
                }
            });
        });
    }

    controlPlayingAudio(index){
        if(!this.enableControl){
            return false;
        }
        this.enableControl = false;
        this.clickIndex = index;
        const currentPlayingIndex = this.state.currentPlayingIndex;
        if(currentPlayingIndex!=null && this.clickIndex != currentPlayingIndex){
            this.disableAudio(this.state.currentPlayingIndex,()=>{
                const clickAudio = this.audioItem[this.clickIndex];
                if(clickAudio && clickAudio.props.active){
                    this.stopWxAudio(clickAudio.props.audioId);
                }else{
                    this.playWxAudio(clickAudio.props.audioId);
                }
            }); 
        }else{
            const clickAudio = this.audioItem[this.clickIndex];
            if(clickAudio && clickAudio.props.active){
                this.stopWxAudio(clickAudio.props.audioId);
            }else{
                this.playWxAudio(clickAudio.props.audioId);
            }
        }
        
    }

    async disableAudio(index,callback) {
        const audioItem = this.audioItem[index];
        if ( audioItem && audioItem.props.active ) {
            //暂停上一条语音，用的延时装置。停止上一条时才会有callback
            (typeof callback !== 'function')?
            this.stopWxAudio(audioItem.props.audioId)
            :
            this.stopWxAudio(audioItem.props.audioId,()=>{
                setTimeout(()=>{
                    callback();
                    this.overAudio();
                },200);
            });
        }else{
            callback && callback();
        }
    }

    playWxAudio(audioId){
        // 添加延时,等待正在播放的语音停止播放后再播放
        setTimeout(() => {
            wx.playVoice({
                localId: audioId,
                success: () => {
                    this.setState({
                        currentPlayingIndex: this.clickIndex,
                    },()=>{
                        this.enableControl = true;
                    })
                    
                },
                fail: () => {}
            });
        }, 300);
        
    }

    stopWxAudio(audioId,callback){
        wx.stopVoice({
            localId: audioId,
            success: () => {
                callback && callback();
                (typeof callback !== 'function') && this.overAudio();
            },
            fail: () => {}
        });
    }

    overAudio(){
        this.setState({
            currentPlayingIndex: null,
        },()=>{
            this.enableControl = true;
        });
    }


    /*** 微信音频 */

    
    async onPublish() {
        if (!this.state.content.length && !this.state.imageList.length && !this.state.audioList.length) {
            window.toast('发布内容不能为空');
            return false;
        }
        if (this.state.content.length > 800) {
            window.toast("打卡字数不能超过800");
            return false;
        }
        window.loading(true);
        this.disableAudio(this.state.currentPlayingIndex);
        
        let imageList = this.state.imageList.map((item,idx) => {
            return {...item,sortNum:idx}
        })

        const params = {
            liveId: this.props.liveId,
            campId: this.props.campId,
            campName: this.props.campName,
            content: normalFilter(this.state.content),
            imageList: imageList,
            audioList: this.state.audioList,
        }
        const res = await checkInPublishApi({params, mock:false})
        // const res = { state: {code: 0}, data:{ isFllowThird: 'N'}}

        window.loading(false);
        if (res.state.code === 0) {
            requestCheckInHeadList({campId: this.props.campId});
            prependCheckInList({checkInList:[res.data.affairDto], firstTimeStamp: res.data.affairDto.createTimeStamp})
            
            const { isFllowThird, affairDto } = res.data;
            const qrCodeRes = await this.getQrCode(isFllowThird);
            const qrUrl = qrCodeRes.data.qrUrl;
            // const qrUrl = 'http://www.liantu.com/meihua/resource/image/thumbnail/default.png';
            const shareData = {
                userName: affairDto.nickName || '',
                campName: this.props.campName || '',
                daysNum: affairDto.affairCount || 0,
                headImgUrl: affairDto.headImage || '',
                shareUrl: qrCodeRes.data.qrUrl || '',
                receiveDayNum: this.props.receiveDayNum || 0,
            }
            
            setCampUserInfo({affairStatus: 'Y'});
            // const shareData = {
            //     userName: 'asdfasdfasdf',
            //     campName: '阿是的发生大发速度发斯蒂芬' || '',
            //     daysNum: 999,
            //     headImgUrl: 'https://img.qlchat.com/qlLive/userHeadImg/6D51F2DC-F71C-4281-A4EE-893807667A52-IXHEP00XWL.jpg' || '',
            //     shareUrl: 'http://www.liantu.com/meihua/resource/image/thumbnail/default.png' || ''
            // }
            
            if (isFllowThird === 'N') {
                this.setState({ qrUrl } )
                this.setPageShow(PAGE_TYPE.qrCode);
            } else {
                this.setState({ shareData } )
                this.setPageShow(PAGE_TYPE.acheveCard);
            }
            window.toast("打卡成功");
            this.props.onChecked && this.props.onChecked();
            
        } else {
            window.toast(res.state.msg);
        }
        // this.closeCheckInPage();
    }

    closeCheckInPage() {
        this.initPageShow();
        this.props.close();
        if (window.history.length > 1) {
            window.history.back();
        }
    }

    async getQrCode(isFllowThird) {
        const { campId, liveId } = this.props;
        let channel = ''
        switch (isFllowThird) {
            // 未绑定三方
            case 'NOSF':
            // 用户已关注三方
            case 'Y':
                channel = 'campAffairAchievement';
                break;
            // 用户未关注三方
            case 'N':
                channel = 'campAffairFollow'
            default:
                break;
        }


        const params = { campId, liveId, channel,isCenter:isFromLiveCenter(),}
        this.setState({
            qrcodeChannel:channel,
        });
        const qrRes = await getQrCodeApi({params, mock:false});
        return qrRes;
    }


    setPageShow(pageType) {
        this.setState({
            showQRCard: pageType === PAGE_TYPE.qrCode,
            showCheckIn: pageType === PAGE_TYPE.checkIn,
            showAcheveCard: pageType === PAGE_TYPE.acheveCard,
        })
    }

    initPageShow() {
        this.setState({
            showQRCard: false,
            showCheckIn: true,
            showAcheveCard: false,
        })
    }



    render() {
        if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-high");
        if (!portalBody) return null

        return ( 
            ReactDOM.createPortal(
                <ReactCSSTransitionGroup
                    transitionName="check-in-page-content"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >  
                    {
                        this.props.isShow ?
                        <Fragment >
                            {
                                this.state.showCheckIn ?
                                <div className="check-in-page-container">
                                    <div className="flex-main">
                                        <div className="content-area">
                                            <CommonTextarea 
                                                className = "check-in-textarea"
                                                placeholder = "写下您今天的收获或感想吧"
                                                value={this.state.content}
                                                onChange = {this.onTextContentChange}
                                                autoFocus = {false}
                                                />
                                                <span className='word-left-length'><span>{this.state.wordLength}</span>/800</span>    
                                        </div>
                                        {
                                            this.state.imageList.length > 0 ?
                                            <div className="img-area">
                                                {
                                                    this.state.imageList.map((item, index) => {
                                                        return (
                                                            <div key={index} className="image" >
                                                                <img
                                                                    src={item.localId ? item.localId : `${imgUrlFormat(item.imageUrl, '?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200')}` }
                                                                />    
                                                                <div className="delete icon_cross" onClick={() => this.deleteImg(index)}></div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div> : 
                                            null
                                        }
                                        {
                                            // this.state.audioList.length >0 ? <AudioList audioList = {this.state.audioList} deleteAudio ={this.deleteAudio} />: null
                                        }
                                        <div className="audio-area">
                                            {
                                                this.state.audioList.map((item, index) => {
                                                    return <div className="audio-li" key={`audio-li-${index}`}>
                                                    <div className="audio" onClick={()=>this.controlPlayingAudio(index)}>
                                                        <AudioItem                                                       
                                                            ref={ dom => dom && (this.audioItem[index] = dom.getWrappedInstance()) }
                                                            key={index} 
                                                            src={item.audioUrl} 
                                                            audioLength={Number(item.duration)} 
                                                            audioId={item.isWx ? item.recLocalId : null}
                                                            playWxAudio = {this.playWxAudio}
                                                            stopWxAudio = {this.stopWxAudio}
                                                            active = {this.state.currentPlayingIndex === index}
                                                            isList = {true}
                                                            overAudio = {this.overAudio}
                                                        />
                                                    </div>
                                                    <div className="delete" onClick={() => this.deleteAudio(index)}>删除</div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                        <div className="operation-area">
                                            <div className="oper-box">
                                                <span className="icon add-img"></span>
                                                <span>图片</span>
                                                <ImgUpload
                                                    multiple = "multiple"
                                                    uploadHandle = {this.uploadHandle}
                                                    count={9 - this.state.imageList.length}
                                                /> 
                                            </div>
                                            <div className="oper-box" onClick={this.showRecode}>
                                                <span className="icon add-audio"></span>
                                                <span>语音</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="publish-btn-box">
                                        <div className="btn-publish" onClick={this.onPublish}>发布</div>
                                    </div>

                                    <BottomRecorder
                                        show={this.state.showRecord}    
                                        pcSendRecHandle = {this.pcSendRecHandle}
                                        wxUploadHandle = {this.wxUploadHandle}
                                        onClose={this.hideRecode}
                                    />
                                </div>:
                                null
                            }
                            <MiddleDialog
                                show={this.state.showQRCard}
                                onClose={this.closeCheckInPage}
                                showCloseBtn={true}
                                className="checked-qrUrl"
                            >
                                <div className="qrcode-card-container">
                                    <div className="icon-checked"></div>
                                    <div className="success-text">发布成功</div>
                                    <div className="tips">长按识别二维码</div>
                                    <img className="qr-code on-visible" src={this.state.qrUrl}
                                        data-log-name="训练营成就卡"
                                        data-log-region="visible-camp"
                                        data-log-pos={this.state.qrcodeChannel} />
                                    <div className="costom-close-btn" onClick={this.closeCheckInPage}>关闭</div>
                                </div>
                            </MiddleDialog>

                            <AchievementCard 
                                show={this.state.showAcheveCard}
                                shareData={this.state.shareData}
                                onClose={this.closeCheckInPage}
                                liveHeadImage={this.props.liveHeadImage}
                                qrcodeChannel = {this.state.qrcodeChannel}
                                // onLoad={this.onAchieveCardLoad}
                            />
                        </Fragment> :
                        null
                    }
                </ReactCSSTransitionGroup>,
            portalBody)
        )
    }
}

const mapStateToProps = (state) => ({
    campId: getVal(state, 'campBasicInfo.campId'),
    liveId:  getVal(state, 'campBasicInfo.liveId'),
    campName: getVal(state, 'campBasicInfo.name'),
    liveHeadImage: getVal(state, 'campBasicInfo.liveHeadImage'),
    receiveDayNum: getVal(state, 'campBasicInfo.receiveDayNum'),
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInPage)
