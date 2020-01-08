import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';

import Detect from 'components/detect';
import { WxRecorder } from 'components/recorder/wx';
import { FlashRecorder } from 'components/recorder/flash';

import BottomDialog from 'components/dialog/bottom-dialog';
import { locationTo, } from 'components/util'

import {
    uploadRec,
} from 'thousand_live_actions/common';

@autobind
class BottomRecorder extends Component {
    state = {
        // 是否能点击
        isCanClick: true,
        /*录音相关*/
        isSendRecord : false,
        //录音状态
        recordingStatus:'ready',
        //录音秒数
        recSecond : 0 ,
        //试听录音
        playingRecTemp : false,
        //60秒是否自动继续录音
        autoRec: false,
        // 判断是否在微信里面
        isWeixin : true,
    }

    componentDidMount() {
        this.initRecord();
    }

    //防止暴力点击
    clickTooFast(callback){
        if(this.state.isCanClick){
                this.setState({
                    isCanClick:false
                })
                setTimeout(()=>{
                this.setState({
                        isCanClick:true
                    })
                },500);
                callback();
        }
    }


    // 录音初始化
    initRecord(){

        wx.ready(() => {
            wx.onVoicePlayEnd({
                success: (res) => {
                   this.pauseRec();
                }
            });
        });
        if (!Detect.os.weixin) {
            this.setState({
                isWeixin : false
            })
        }
        if ((Detect.os.phone || Detect.os.tablet) && Detect.os.weixin) {
            this.recorder = new WxRecorder({
                startRec:this.setRecStart,
                stopRec:this.stopRecHandle,
                sendRec:this.wxSendRecHandle,
                recClock:this.recClock,
                resetRec:this.resetRecording,
                wxUploadHandle:this.wxUploadHandle,
                autoRec:typeof(this.props.autoRec != 'undefined') ? this.props.autoRec : this.state.autoRec,
            });
        } else {
            this.recorder = new FlashRecorder({
                startRec:this.setRecStart,
                stopRec:this.stopRecHandle,
                sendRec:this.pcSendRecHandle,
                recClock:this.recClock,
                uploadRec:this.uploadRec,
                resetRec: this.resetRecording,
                isShowProgressTips: Detect.os.ios?0:1,
                autoRec:typeof(this.props.autoRec != 'undefined') ? this.props.autoRec : this.state.autoRec,
            });
        }
    }




    // 录音状态切换
    setRecStart(){
        this.setState({
            recordingStatus : 'start'
        })
        if (this.props.setRecStatus) {
            this.props.setRecStatus('start');
        }
    }

    setRecStop(){
        this.setState({
            recordingStatus : 'stop'
        })
        if (this.props.setRecStatus) {
            this.props.setRecStatus('stop');
        }
    }

    setRecReady(){
        this.setState({
            recordingStatus : 'ready'
        })
        if (this.props.setRecStatus) {
            this.props.setRecStatus('ready');
        }
    }
    // 开始录音
    startRec = (e) => {
        if (!Detect.os.phone && !Detect.os.tablet && Detect.os.weixin) {
            window.toast("请使用手机端或者谷歌浏览器录音", 3000);
            return;
        }
        // this.props.pauseAudio();
        this.clickTooFast(()=>{
            this.recorder.startRecording();
        });
    }

    // 暂停录音
    stopRec = (e) => {
        this.clickTooFast(()=>{this.recorder.stopRecording();});
    }

    // 暂停录音处理
    stopRecHandle(res = {}){
        this.setRecStop();
        if(res){
            this.setState({
                recLocalId : res.localId
            })
        }
    }

    // 发送录音
    sendRec = (e) => {
        this.clickTooFast(() => {
            this.pauseRec();
            if (Number(this.state.recSecond) < 1) {
                window.toast('录音时间太短');
                return;
            }
            this.recorder.sendRecording();
        });
    }

    wxUploadHandle = async ({ recLocalId = '', second, serverId } = {}) => {
        let sendResult;
        if (this.props.wxUploadHandle) {
            sendResult = await this.props.wxUploadHandle({recLocalId,second,serverId});
        }
        return sendResult;
        
    }

    // PC上传录音处理
    async uploadRec(file){
        let sendResult = await this.props.uploadRec(file, "audio");
        return sendResult;
    }
    // PC发送录音处理
    async pcSendRecHandle(url, second = 0) {
        let sendResult = 'reset';
        if (this.props.pcSendRecHandle) {
            sendResult = await this.props.pcSendRecHandle({url,second});
            if(sendResult.state.code === 0){
                this.resetRecording();
            }
        } else {
            this.resetRecording();
            
        }
        return sendResult;
    }
    // WX发送录音处理
    async wxSendRecHandle(serverId,second,isAuto = false){
        let sendResult = 'reset';
        if (this.props.wxSendRecHandle) {
            sendResult = await this.props.wxSendRecHandle({serverId,second});
            if(sendResult.state.code === 0){
                this.resetRecording();
            }
        } else {
            this.resetRecording();
        }
        return sendResult;
    }

    // 录音计时器处理
    recClock(second){
        this.setState({
            recSecond: second
        })
    }

    // 重置录音
    resetRecording() {
        window.loading(false);
        this.setState({
            recordingStatus : 'ready',
            playingRecTemp : false,
            recSecond : 0,
            isSendRecord : false
        })
        this.setRecReady();
        this.pauseRec();
    }

    // 外部调用
    outResetRecording() {
        this.recorder.resetRecording();
    }




    // 播放录音
    playRec = (e) => {
        if((Detect.os.phone || Detect.os.tablet) && Detect.os.weixin){
            this.playRecordingWx();
        }else{
            this.playRecordingPc();
        }
    }
    // 暂停播放
    pauseRec = (e) => {
        if((Detect.os.phone || Detect.os.tablet) && Detect.os.weixin){
            this.pauseRecordingWx();
        }else{
            this.pauseRecordingPc();
        }
    }

    // 重置录音
    resetRec = (e) => {
        window.confirmDialog(
        '确定取消录音吗？',
            () => {this.recorder.resetRecording();}
        );
    }


    //PC试听录音
    playRecordingPc(){
        let recordingPlayerTemp = document.getElementById("recordingPlayerTemp");
        if(!recordingPlayerTemp){
            recordingPlayerTemp = document.createElement("audio");
            recordingPlayerTemp.setAttribute('id','recordingPlayerTemp');
            recordingPlayerTemp.setAttribute('preload','auto');
            recordingPlayerTemp.volume = 1;

            document.body.appendChild(recordingPlayerTemp);
            recordingPlayerTemp.addEventListener('ended',(e)=>{
                this.pauseRecordingPc();
            });
        }

        let audioObj= new File([FWRecorder.getBlob('audio')],"pcRec.wav");

        let tempAudioUrl = URL.createObjectURL(audioObj);
        recordingPlayerTemp.setAttribute("src", tempAudioUrl);
        recordingPlayerTemp.play();
        this.setState({
            playingRecTemp : true,
        })
    }
    // PC暂停试听
    pauseRecordingPc(){
        let recordingPlayerTemp = document.getElementById("recordingPlayerTemp");
        this.setState({
            playingRecTemp : false,
        })
        if(recordingPlayerTemp){
            recordingPlayerTemp.pause();
        }
    }

    //WX播放录音
    playRecordingWx(){
        this.clickTooFast(()=>{
            wx.playVoice({
                localId: this.state.recLocalId,
                success: () => {
                },
                fail: () => {
                }
            });
            this.setState({
                playingRecTemp : true,
            })

        });
    }

    // 暂停微信播放录音
    pauseRecordingWx(){
        this.clickTooFast(()=>{
            wx.stopVoice({localId: this.state.recLocalId });
            this.setState({
                playingRecTemp : false,
            })

        });
    }

    closeDialog() {
        if (this.state.recordingStatus != 'ready') {
            window.confirmDialog(
                '确定取消录音吗？',
                () => {
                    this.recorder.resetRecording();
                    this.props.onClose();
            });
        } else {
            this.props.onClose();
        }
    }


    render() {
        if (typeof (document) == 'undefined') {
            return false;
        }
        const portalBody = document.querySelector(".portal-low");
        if (!portalBody) return null

        return createPortal(
            <div className={ `bottom-recorder ${this.props.show?'':'hide'}`} >
                <BottomDialog 
                    className='bottom-recorder'
                    show={true}
                    theme="empty"
                    bghide={true}
                    onClose={this.closeDialog}
                >
                    
                    <div className="main">
                        {   
                        !this.state.isWeixin && <span id="save-button">
                            <span id="flashcontent">
                                <p>
                                    <a className="on-log"
                                        href="javascript:void(0);"
                                        onClick={e => locationTo('http://get.adobe.com/cn/flashplayer/')}
                                        data-log-region="recording-box"
                                        data-log-pos="flash-link"
                                        >如未安装Flash，请点击此处下载
                                    </a>
                                </p>
                            </span>
                        </span>||null
                        }    
                        
                        {
                            this.state.recordingStatus === 'start'?
                            <div className="recording">
                                <span className="btn-rec-stop" onClick = {this.stopRec} ></span>
                                <span className="tips-bar"><i>{this.state.recSecond}s</i>/60s</span>
                            </div>
                            :this.state.recordingStatus === 'stop'?    
                            <div className="sending">
                                <span className="btn-rec-send" onClick = {this.sendRec} >确定</span>
                                <span className="tips-bar">{this.state.recSecond}s</span>
                                {
                                    this.state.playingRecTemp?
                                    <span className="btn-play-rec btn-pause"
                                        onClick = {this.pauseRec}
                                        >
                                        暂停
                                    </span>
                                    :<span className="btn-play-rec btn-play"
                                        onClick = {this.playRec}
                                        >
                                        试听
                                    </span>
                                }

                                <span className="btn-reset-recording"
                                    onClick = {this.resetRec}
                                    >
                                    重新录制
                                </span>
                            </div>
                            :        
                            <div className="ready">
                                <span className="btn-rec-start" onClick = {this.startRec} ></span>
                                <span className="tips-bar">点击开始录音</span>
                            </div>
                        }    

                    </div>
                </BottomDialog>
            </div>    
            ,
            portalBody
        );
        
    }
}

function mapStateToProps (state) {
    return {
        
    }
}

const mapActionToProps = {
    uploadRec,
}

export default connect(mapStateToProps, mapActionToProps)(BottomRecorder);