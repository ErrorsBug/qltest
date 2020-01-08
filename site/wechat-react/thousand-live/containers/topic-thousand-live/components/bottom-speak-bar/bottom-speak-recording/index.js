import React, { Component,PureComponent } from 'react';
import PropTypes from 'prop-types';
import Detect from 'components/detect';
import { WxRecorder } from 'components/recorder/wx';
import { FlashRecorder } from 'components/recorder/flash';
import { locationTo } from 'components/util';
import { autobind } from 'core-decorators';
import { eventLog } from 'components/log-util';

@autobind
class SpeakRecording extends PureComponent {
    state = {

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

    data = {
        sendTyping : false,
    }

    async componentDidMount() {
        this.initRecord(); //录音初始化


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
                isWeixin: false
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
        this.props.pauseAudio();
        this.props.clickTooFast(()=>{
            this.recorder.startRecording();
        });
    }

    // 暂停录音
    stopRec = (e) => {
        this.props.clickTooFast(()=>{this.recorder.stopRecording();});
    }

    // 暂停录音处理
    stopRecHandle(res = {}){
        this.setRecStop();
        this.data.sendTyping = false;
        this.imTyping('N');
        if(res){
            this.setState({
                recLocalId : res.localId
            })
        }
    }

    // 发送录音
    sendRec = (e) => {
        this.props.clickTooFast(() => {
            this.pauseRec();
            if (Number(this.state.recSecond) < 1) {
                window.toast('录音时间太短');
                return;
            }
            this.recorder.sendRecording();
        });
    }

    wxUploadHandle = async ({recLocalId='',second,serverId} = {}) =>{
        if (this.props.power.allowSpeak) {
            let createTime = Date.now();
            if (serverId) {
                let sendAudio = {
                    serverId : serverId ,
                    id : recLocalId ,
                }
                if (this.props.updateTopicListMsg) {
                    this.props.updateTopicListMsg(sendAudio,'id');
                }
            } else if (recLocalId) {
                let sendAudio = {
                    type : "sending-audio",
                    localId : recLocalId,
                    createTime : createTime ,
                    id : recLocalId ,
                    second : second,
                    isFail : false,
                    createBy : this.props.userInfo.userId,
                    speakCreateByHeadImgUrl : this.props.userInfo.headImgUrl,
                    speakCreateByName : this.props.userInfo.name,

                }
                try {
                    await this.props.loadLastMsg(false);
                    
                } catch (error) {
                    console.log(error);
                }
                if (this.props.addTopicListMsg){
                    this.props.addTopicListMsg([sendAudio],true);
                }
                this.recorder.resetRecording();
                this.setRecReady();
            }
        }


    }

    // PC上传录音处理
    async uploadRec(file){
        let sendResult = await this.props.uploadRec(file,"audio");
        return sendResult;
    }
    // PC发送录音处理
    async pcSendRecHandle(url,second = 0){
        let type = 'pcAudioUrl';
        if (this.props.isOnMic) {
            type = 'mic-pcAudioUrl';
        }
        let sendResult = await this.props.addForumSpeak(type,url,second);
        if(sendResult.state.code === 0){
            this.resetRecording();
        }
        return sendResult;
    }
    // WX发送录音处理
    async wxSendRecHandle(serverId,second,isAuto = false){
        let type = 'audioId';
        if (this.props.isOnMic) {
            type = 'mic-audio';
        }
        let sendResult = await this.props.addForumSpeak(type, serverId, second, !isAuto);
        if (sendResult.state && sendResult.state.code === 0) {
            let sendAudio = {
                serverId : serverId ,
            }
            if (this.props.power.allowSpeak && this.props.delTopicListMsg) {
                this.props.delTopicListMsg(sendAudio, 'serverId');
            }
        }else if(!sendResult || !sendResult.state || sendResult.state.code != 0){
            let sendAudio = {
                serverId : serverId ,
                isFail : true,
            }
            if (this.props.power.allowSpeak && this.props.updateTopicListMsg) {
                this.props.updateTopicListMsg(sendAudio, 'serverId');
            }
        }
        return sendResult;
    }

    // 录音计时器处理
    recClock(second){
        this.setState({
            recSecond: second
        })
        if (second != 0) {
            this.imTyping('Y');
        }
    }

    // 重置录音
    resetRecording() {
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
            recordingPlayerTemp.addEventListener('playing',(e)=>{
                // 打印试听日志
                eventLog({
                    category: 'record-listen-test',
                    action: 'success',
                    type: 'pc',
                });
            });
            recordingPlayerTemp.addEventListener('error',(e)=>{
                // 打印试听日志
                eventLog({
                    category: 'record-listen-test',
                    action: 'failed',
                    type: 'pc',
                });
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
        this.props.clickTooFast(()=>{
            wx.playVoice({
                localId: this.state.recLocalId,
                success: () => {
                    // 打印试听日志
                    eventLog({
                        category: 'record-listen-test',
                        action: 'success',
                        recLocalId: this.state.recLocalId,
                    });
                },
                fail: () => {
                    // 打印试听日志
                    eventLog({
                        category: 'record-listen-test',
                        action: 'failed',
                        recLocalId: this.state.recLocalId,
                    });
                }
            });
            this.setState({
                playingRecTemp : true,
            })

        });
    }

    // 暂停微信播放录音
    pauseRecordingWx(){
        this.props.clickTooFast(()=>{
            wx.stopVoice({localId: this.state.recLocalId });
            this.setState({
                playingRecTemp : false,
            })

        });
    }


    imTyping(status) {
		if(!this.data.sendTyping && this.props.power.allowSpeak && !/(audio|video)/.test(this.props.topicStyle)){
			this.data.sendTyping = true;
			setTimeout(()=>{
				this.data.sendTyping = false;
			},10000);
			this.props.changeSpeaker(this.props.topicId,this.props.userInfo.name,status);
		};
	};


    render() {
        return (
            <div className={`recording-container ${!this.props.isShow?'hide':''}`}>
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
                <div className="recording-main">
                    {
                       60 - this.state.recSecond >= 10 ?  
                       <div className="recording-tips-one">录音中，再录<var>{60 - this.state.recSecond}s</var>将可发送，点击可暂停</div> :
                       <div className="recording-tips-one"><var>{60 - this.state.recSecond}s</var>后将自动发送，并自动录下一条</div>
                    }
                    <div className="btn-stop-rec on-log"
                        onClick = {this.stopRec}
                        data-log-region="recording-box"
                        data-log-pos="stop-rec-btn"
                        >
                    </div>
                </div>
                :this.state.recordingStatus === 'stop'?
                <div className="recording-main">
                    <div className="recording-tips-one">本次录音共
                        <var>{this.state.recSecond}s</var>
                        {
                            this.state.playingRecTemp?
                            <span className="btn-play-rec on-log"
                                onClick = {this.pauseRec}
                                data-log-region="recording-box"
                                data-log-pos="pause-rec-btn"
                                >
                                暂停
                            </span>
                            :<span className="btn-play-rec on-log"
                                onClick = {this.playRec}
                                data-log-region="recording-box"
                                data-log-pos="play-rec-btn"
                                >
                                试听
                            </span>
                        }
                        <span className="btn-reset-recording on-log"
                            onClick = {this.resetRec}
                            data-log-region="recording-box"
                            data-log-pos="reset-rec-btn"
                            >
                            重录
                        </span>
                    </div>
                    <div className="btn-send-rec on-log"
                        onClick = {this.sendRec}
                        data-log-region="recording-box"
                        data-log-pos="send-rec-btn"
                        >
                        发送
                    </div>
                </div>
                :
                <div className="recording-main">
                    <div className="recording-tips-two">{this.props.feedbackTarget?'回复：'+ this.props.feedbackTarget.name :'点击开始录音'}</div>
                    <div className="btn-start-rec on-log"
                        onClick = {this.startRec}
                        data-log-region="recording-box"
                        data-log-pos="start-rec-btn"
                        >
                    </div>
                    <div className="tab-bar">
                        <div className="tab-item on">单击</div>
                        <div className="app-link" onClick={()=>{locationTo('http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live')}}>APP高清录音</div>
                    </div>
                </div>

            }
            </div>
        );
    }
}

SpeakRecording.propTypes = {

};

export default SpeakRecording;
