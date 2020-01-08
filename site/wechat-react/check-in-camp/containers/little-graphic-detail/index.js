import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import { share } from 'components/wx-utils';

import Page from 'components/page';
import cookie from 'cookie'
import {validLegal, getVal, formatDate, locationTo, getCookie} from 'components/util';
import Detect from 'components/detect';
import { AudioPlayer } from 'components/audio-player';


import TopicTitle from '../little-graphic-create/components/topic-intro-list/title';
import ItemText from '../little-graphic-create/components/topic-intro-list/item-text';
import ItemImage from '../little-graphic-create/components/topic-intro-list/item-image';
import ItemAudio from '../little-graphic-create/components/topic-intro-list/item-audio';
import BottomEditMenu from './components/bottom-edit-menu';

import { 
    campAuthInfoModel,
    campUserInfoModel,
    campBasicInfoModel,
} from '../../model';

import {
    addPageUv,
} from 'thousand_live_actions/thousand-live-common';

import { uploadTaskPoint } from 'common_actions/common'

const { fetchAuthInfo } = campAuthInfoModel;
const { requestCampUserInfo } = campUserInfoModel;
const { fetchCampBasicInfo } = campBasicInfoModel;



@autobind
class LittleGraphicPage extends Component {
    state = {
        // 播放状态
        playStatus: 'pause',
        // 播放中的url
        audioUrl: '',
        // 播放中的id
        audioMsgId:'',
    }

    componentDidMount() {
        this.initState();
        // 上传初始化
        this.initAudio();
        this.initShare();

        this.props.addPageUv(this.props.location.query.topicId, this.props.liveId, ['topicOnline', 'liveUv'], this.props.location.query.pro_cl || getCookie('channelNo') || '', this.props.location.query.shareKey ||'');

        setTimeout(() => {
            this.fixImgSize();
        }, 0);
    }

    /**
     * 
     * 初始化状态
     * @memberof LittleGraphicPage
     */
    async initState() {
        const cookieData = cookie.parse(document.cookie);
        let userId = cookieData.userId
        requestCampUserInfo({ campId: this.props.campId,shareUserId: userId});
        fetchCampBasicInfo({ campId: this.props.campId });
    }

     /**
     * 
     * 图片尺寸修正
     * @memberof LittleGraphicCreate
     */
    fixImgSize() {
        let imgs = document.querySelectorAll('.intro-image');

        Array.prototype.map.call(imgs, (item) => {
            if (item.complete) {
                item.style.width = item.width >= 800 ? '100%' : (item.width*window.dpr + 'px');
            }
        });

    }

    initedShare = false
    /**
     *
     * 初始化分享
     *
     * @memberof 
     */
    initShare() {
        if (this.initedShare) { return }
        this.initedShare = true
        let wxqltitle = this.props.topicName;
        let descript = '坚持提升自己，优秀就是一种习惯';
        let wxqlimgurl = "https://img.qlchat.com/qlLive/liveCommon/little-graphic-topic.jpg";
        let friendstr = wxqltitle;
        let shareUrl = window.location.href + "&pro_cl=link";

        let onShareComplete = () => {
            console.log('share completed!') 

            // 学分任务达成触发点
            uploadTaskPoint({
                assignmentPoint: 'grow_share_course',
            })
        }

        share({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            timelineDesc: friendstr, // 分享到朋友圈单独定制
            imgUrl: wxqlimgurl,
            shareUrl: shareUrl,
            successFn: onShareComplete,
        });
    }



    /**
     * 播放器初始化监听
     *
     *
     * @memberOf ThousandLive
     */
    initAudio(){
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.playWav();
        this.audioPlayer.on('ended',this.audioEnded);
        this.audioPlayer.on('pause',this.audioPause);
        this.audioPlayer.on('playing',this.audioPlaying);


        wx.ready(() => {
            wx.onVoicePlayEnd({
                success: (res) => {
                   this.audioEnded();
                }
            });
        });
    }

    audioPlaying(e){

        this.setState({
            playStatus:'play',
            audioLoading : false,
        })
    }

    audioPause(e){
        this.setState({
            playStatus:'pause',
        })
    }

    audioEnded(e){

        this.setState({
            playStatus:'ready',
            audioLoading:false,
            audioUrl:'',
            audioMsgId:''
        })


    }


    /**
     * 播放音频总控
     * 
     * @param {any} type 
     * @param {any} id 
     * @memberof LittleGraphicPage
     */
    playAudio(type,id) {
        if (type == 'audio') {
            this.playAudioPc(id);
        } else {
            this.playAudioWx(id);
        }
    }
    /**
     * 暂停音频总控
     * 
     * @param {any} type 
     * @param {any} id 
     * @memberof LittleGraphicPage
     */
    stopAudio(type) {
        if (type == 'audio') {
            this.pauseAudioPc();
        } else {
            this.pauseAudioWx();
        }
    }

    /**
     * 
     * 播放音频PC
     * @param {any} id 
     * @returns 
     * @memberof LittleGraphicPage
     */
    playAudioPc(id) {
        this.pauseAudioWx();

        // 获取要播放的音频所在总列表下标
        let audioIndex = this.props.contentList.findIndex((item, index, arr) => {
            return item.id == id;
        });
        // 获取音频消息
        let audioMsg = this.props.contentList[audioIndex];
        // 获取音频路径
        let url = audioMsg.content;

        


        if (this.state.audioMsgId != id) {
            this.setState({
                audioUrl:url,
                playStatus: 'play',
                audioMsgId: audioMsg.id,
                audioLoading : true,
            })
            this.audioPlayer.volume = 1;
            try {
                this.audioPlayer.pause();
            } catch (error) {
                console.log(error);
            }
            // console.log('ssssss:',url)
            this.audioPlayer.play(url);
    
        } else {
            this.setState({
                playStatus: 'play',
                audioMsgId: audioMsg.id,
            })
            this.audioPlayer.resume();
        }
    }

    pauseAudioPc() {
        this.audioPlayer.pause();
    }

    /**
     * 播放微信录音
     * 
     * @memberof LittleGraphicPage
     */
    @throttle(1500)
    async playAudioWx(id) {
        this.pauseAudioPc();
        this.pauseAudioWx();
        // 获取要播放的音频所在总列表下标
        let audioIndex = this.props.contentList.findIndex((item, index, arr) => {
            return item.id == id;
        });
        // 获取音频消息
        let audioMsg = this.props.contentList[audioIndex];
        // 获取音频路径
        let url = audioMsg.recLocalId;

        setTimeout(() => {
            wx.playVoice({
                localId: url,
                success: () => {
                    this.setState({
                        audioUrl: url,
                        playStatus: 'play',
                        audioMsgId: audioMsg.id,
                    })
                },
                fail: () => {
                }
            });
        },300)

    }

    pauseAudioWx() {
        wx.stopVoice({
            localId: this.state.audioUrl,
            success: () => {
            },
            fail: () => {
            }
        });
        this.setState({
            audioUrl: '',
            playStatus: 'stop',
            audioMsgId: '',
        })
        
    }



    changeTitle(e) {
        updateLittleGraphicBaseInfo({topicName:e.target.value})
    }

    changeData(e,idx) {
        updateLittleGraphicContent({index:idx,content:e.target.value})
    }






    



    render() {
        return (
            <Page title={this.props.topicName} className="little-graphic-page flex-body">
                <div className="flex-main-s">
                    <div className="topic-intro-list">
                        <TopicTitle
                            title = {this.props.topicName}
                        />
                        <div className="topic-info">
                            <span className="date">{formatDate(this.props.createTimeTamp,'yyyy年MM月dd日')}</span>
                            <span className="name" onClick={() => {
                                locationTo(`/wechat/page/live/${this.props.liveId}`);
                            }}>{this.props.liveName}</span>
                        </div>
                        {
                            this.props.contentList.map((item, index) => {
                                switch(item.type){
                                    case 'text':
                                        return <ItemText
                                            key={`intro-${index}`}    
                                            item={item}
                                            index={index}
                                            />;
                                    case 'image':
                                    case 'imageId':
                                            return <ItemImage
                                            key={`intro-${index}`}    
                                            item={item}
                                            index={index}
                                            />;
                                            case 'audio':
                                            case 'audioId':
                                            return <ItemAudio
                                            key={`intro-${index}`}    
                                            item={item}
                                            index={index}
                                            playAudio={this.playAudio}
                                            stopAudio={this.stopAudio}
                                            playStatus={this.state.playStatus}
                                            audioMsgId={this.state.audioMsgId}
                                        />;
                                    default : return null;
                                        
                                }
                            })
                        }
                    </div>    
                </div>
                <div className="flex-other">
                    <BottomEditMenu
                        liveId={this.props.liveId}
                        topicId={this.props.location.query.topicId}
                        campId={this.props.campId}
                        allowMGLive={this.props.allowMGLive}
                        affairStatus={this.props.affairStatus}
                    
                    />    
                </div>
            </Page>
        );
    }
}

LittleGraphicPage.propTypes = {

};

function mapStateToProps(state) {
    return {
        topicName: getVal(state, 'littleGraphic.topicName',''),
        liveName: getVal(state, 'littleGraphic.liveName',''),
        liveId: getVal(state, 'littleGraphic.liveId',''),
        campId: getVal(state, 'littleGraphic.campId',''),
        allowMGLive: getVal(state, 'campAuthInfo.allowMGLive',''),
        createTimeTamp: getVal(state, 'littleGraphic.createTimeTamp',''),
        affairStatus: getVal(state, 'campUserInfo.affairStatus',''),
        contentList : getVal(state, 'littleGraphic.contentList',[{   
            id:String(Date.now()),
            type: 'text',
            content:'',
        }]),

    }
}

const mapActionToProps = {
    addPageUv
}

export default connect(mapStateToProps, mapActionToProps)(LittleGraphicPage);