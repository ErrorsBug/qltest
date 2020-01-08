import React, { Component,PureComponent } from 'react';
import PropTypes from 'prop-types';
import Detect from 'components/detect';
import { WxRecorder } from 'components/recorder/wx';
import { FlashRecorder } from 'components/recorder/flash';
import { QlRecorder } from 'components/recorder/qlchat';
import { autobind } from 'core-decorators';
import { isQlchat } from 'components/envi';

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
        // 判断是否pc
        isPC : false,
        // 是否千聊客户端
        isQlchat: false,
        // 是否android环境
        isAndroid: false,
    }

    data = {
        sendTyping : false,
    }

    async componentDidMount() {
        this.initState();

        //录音初始化
        this.initRecord();
    }

    initState() {
        if (!Detect.os.phone) {
            this.setState({
                isPc : true,
            });
        }

        if (Detect.os.android) {
            this.setState({
                isAndroid: true,
            });
        } else {
            this.setState({
                isAndroid: false,
            });
        }

        if (isQlchat()) {
            this.setState({
                isQlchat: true,
            });
        } else {
            this.setState({
                isQlchat: false,
            });
        }
    }

    // 录音初始化
    initRecord(){
        if (isQlchat()) {
            qlchat.ready(() => {
                qlchat.onAudioPlayCompletion({
                    success: (res) => {
                       this.pauseRec();
                    }
                });
            });

            this.recorder = new QlRecorder({
                startRec:this.setRecStart,
                stopRec:this.stopRecHandle,
                sendRec:this.qlchatSendRecHandle,
                recClock:this.recClock,
                resetRec:this.resetRecording,
                // wxUploadHandle:this.wxUploadHandle,
                // autoRec:false,
            });
        } else if (Detect.os.phone) {
            wx.ready(() => {
                wx.onVoicePlayEnd({
                    success: (res) => {
                       this.pauseRec();
                    }
                });
            });

            this.recorder = new WxRecorder({
                startRec:this.setRecStart,
                stopRec:this.stopRecHandle,
                sendRec:this.wxSendRecHandle,
                recClock:this.recClock,
                resetRec:this.resetRecording,
                wxUploadHandle:this.wxUploadHandle,
                autoRec:false,
            });
        } else if (!(Detect.os.phone && Detect.os.weixin)) {
            this.recorder = new FlashRecorder({
                startRec:this.setRecStart,
                stopRec:this.stopRecHandle,
                sendRec:this.pcSendRecHandle,
                recClock:this.recClock,
                uploadRec:this.uploadRec,
                resetRec:this.resetRecording,
	            autoRec:false,
            });
        }

    }


    // 录音状态切换
    setRecStart(){
        this.setState({
            recordingStatus : 'start'
        })
    }

    setRecStop(){
        this.setState({
            recordingStatus : 'stop'
        })
    }

    setRecReady(){
        this.setState({
            recordingStatus : 'ready'
        })
    }
    // 开始录音
    startRec = (e) => {
        if(this.props.onStartRec) this.props.onStartRec();
        this.clickTooFast(()=>{this.recorder.startRecording();});
    }

    // 暂停录音
    stopRec = (e) => {
        this.clickTooFast(()=>{this.recorder.stopRecording();});
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
        if(this.state.playingRecTemp) this.pauseRec();
        this.clickTooFast(()=>{this.recorder.sendRecording();});
    }

    wxUploadHandle = async ({recLocalId='',second,serverId} = {}) =>{

    };

    // PC上传录音处理
    async uploadRec(file){
        let sendResult = await this.props.uploadRec(file,"audio");
        return sendResult;
    }
    // PC发送录音处理
    async pcSendRecHandle(url,second = 0){
	    this.resetRecording();
	    if(this.props.onPCRecUploadSuccess) this.props.onPCRecUploadSuccess(url, second);
    }
    // WX发送录音处理
    async wxSendRecHandle(serverId,second,isAuto){
        this.resetRecording();
	    if(this.props.onWXRecUploadSuccess) this.props.onWXRecUploadSuccess(serverId, second, this.state.recLocalId);
        return 'reset';

    }

    // 千聊app发送录音处理
    async qlchatSendRecHandle(url, second, isAuto) {
        this.resetRecording();
        // 这里使用pc的发送成功处理方式
	    this.props.onPCRecUploadSuccess(url, second);
        return 'reset';
    }

    // 录音计时器处理
    recClock(second){
        this.setState({
            recSecond: second
        });
        if (second != 0) {
            this.imTyping('Y');
        }
    }

    // 重置录音
    resetRecording(){
        this.setState({
            recordingStatus : 'ready',
            playingRecTemp : false,
            recSecond : 0,
            isSendRecord : false
        })
    }



    // 播放录音
    playRec = (e) => {
        if (isQlchat()) {
            this.playRecordingQlchat();
        } else if (Detect.os.phone) {
            this.playRecordingWx();
        } else {
            this.playRecordingPc();
        }
    }
    // 暂停播放
    pauseRec = (e) => {
        if (isQlchat()) {
            this.pauseRecordingQlchat();
        } else if (Detect.os.phone) {
            this.pauseRecordingWx();
        } else {
            this.pauseRecordingPc();
        }
    }

    // 重置录音
    resetRec = async (e) => {
    	if(this.state.recordingStatus !== 'ready'){
    		if(await window.confirmDialogPromise('确定取消录音吗？')){
			    if(this.state.playingRecTemp){
				    this.pauseRec();
			    }
			    this.recorder.resetRecording();
		    }else{
    			return Promise.reject();
		    }
	    }
    };


    //PC试听录音
    playRecordingPc(){
        let recordingPlayerTemp = document.getElementById("recordingPlayerTemp");
        if(!recordingPlayerTemp){
            recordingPlayerTemp = document.createElement("audio");
            recordingPlayerTemp.setAttribute('id','recordingPlayerTemp');
            recordingPlayerTemp.setAttribute('preload','auto');
            recordingPlayerTemp.volume = 1;

            document.body.appendChild(recordingPlayerTemp);
            document.getElementById("recordingPlayerTemp").addEventListener('ended',(e)=>{
                this.pauseRecordingPc();
            })
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
            wx.playVoice({localId: this.state.recLocalId });
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

    // 千聊播放语音（试听）
    playRecordingQlchat(){
        this.clickTooFast(()=>{
            qlchat.playAudio({localId: this.state.recLocalId });
            this.setState({
                playingRecTemp : true,
            })
        });
    }

    // 千聊暂停播放
    pauseRecordingQlchat(){
        this.clickTooFast(()=>{
            qlchat.stopAudio({localId: this.state.recLocalId });
            this.setState({
                playingRecTemp : false,
            })

        });
    }

    imTyping(status){

    };

	clickTooFast(cb){
	    if(!cb.disable){
		    cb.disable = true;
		    setTimeout(() => {
			    cb.disable = false;
		    },1000);
		    cb();
	    }
    }


    render() {
        return (
            <div className={`${this.props.className || 'recording-container'}`}>
                {
                    this.state.isPc && <div id="save-button" className="save-button">
                        <div id="flashcontent">
                        <p><a href="http://get.adobe.com/cn/flashplayer/">如未安装Flash，请点击此处下载</a></p>
                        </div>
                    </div>||null
                }
            {
                this.state.recordingStatus === 'start'?
                <div className="recording-main">
                    <div className="recording-tips"><span className="current-second">{this.state.recSecond}s</span>/60s</div>
                    <div className="rec-btn playing" onClick = {this.stopRec}></div>
                </div>
                :this.state.recordingStatus === 'stop'?
                <div className="recording-main">
                    <div className="recording-tips">{this.state.recSecond}s</div>
                    <div className="rec-btn finished" onClick = {this.sendRec}></div>
                    {
                        this.state.isQlchat && this.state.isAndroid ? null: (
                            <div className={`audition-btn${this.state.playingRecTemp ? ' playing' : ''}`} onClick={this.state.playingRecTemp ? this.pauseRec : this.playRec}>
        		                {this.state.playingRecTemp ? '暂停' : '试听'}
        	                </div>
                        )
                    }
	                <div className="delete-btn" onClick = {this.resetRec}>删除</div>
                </div>
                :
                <div className="recording-main">
                    <div className="recording-tips">点击开始录音</div>
                    <div className="rec-btn" onClick = {this.startRec}></div>
                </div>
            }
            </div>
        );
    }
}

SpeakRecording.propTypes = {

};

export default SpeakRecording;
