import Detect from '../../detect';
import { flashRecMain, configureMicrophone ,microphonePermission} from '../../flash-rec';

/**
 * pc flash录音组件
 */
export class FlashRecorder {
    constructor (
        {   startRec = () => {} ,
            stopRec = () => {} ,
            sendRec = () => {},
            recClock = () => {} ,
            resetRec = () => {},
            uploadRec = () => { },
            autoRec = false ,
        } = {}) {
        this.recordingSecond = 0; // 录音时长
        this.isSendingRecord = false; // 是否发送录音中
        this.startRecCallback = startRec; // 开始录音处理
        this.stopRecCallback = stopRec; // 停止录音处理
        this.sendRecCallback = sendRec; // 发送录音处理
        this.resetRecCallback = resetRec; // 重置录音配置
        this.uploadRecCallback = uploadRec; // 上传阿里云
        this.clockCallback = recClock; // 录音计时器
	    this.autoRec = autoRec; // 是否自动录音


        let swfjs_1 = document.createElement("script"),
            swfjs_2 = document.createElement("script"),
            swfjs_3 = document.createElement("script"),
            swfcss_1 = document.createElement("link");

            swfjs_1.src = "//cache1.qlchat.com/scripts/flashWavRecorder/swfobject.js";
            swfjs_2.src = "//cache1.qlchat.com/scripts/flashWavRecorder/recorder.js";
            swfjs_3.src = "//cache1.qlchat.com/scripts/wtwap/jquery-1.11.2.ql.min.js";
            swfcss_1.href = "//cache1.qlchat.com/styles/flashWavRecorder/css/style.css";

            document.body.appendChild(swfcss_1);
            document.body.appendChild(swfjs_1);
            document.body.appendChild(swfjs_2);
            document.body.appendChild(swfjs_3);

            swfjs_1.onload = () => {
                window.fwr_event_handler = flashRecMain( () => {this.pcRecClock()}, () => {this.startRecCallback()}, () => {this.stopRecCallback()});

                window.microphonePermission = microphonePermission;
                window.configureMicrophone = configureMicrophone;
            }
    }

    //PC计时器
    pcRecClock(){
        var _self = this;
        _self.recordingSecond = FWRecorder.duration('audio').toFixed(0);
        _self.clockCallback(_self.recordingSecond);
        if ( _self.recordingSecond > 60 ) {
            _self.recordingSecond = 60 ;
            _self.clockCallback(_self.recordingSecond);
            _self.stopRecording(this.autoRec);
        };
    }



    // PC开始录音
    startRecording(){
        window.configureMicrophone();
        FWRecorder.observeLevel();
        FWRecorder.record('audio', 'audio.wav');

    }

    //PC暂停录音
    stopRecording(isAuto = false){
        var _self = this;
        if ( _self.recordingSecond < 2 ) {
            window.toast("录音时间太短");
        } else {
            FWRecorder.stopObservingLevel();
            FWRecorder.stopRecording('audio');
            if (isAuto) {
                _self.sendRecording();
            }

        };
    }

    // 重置状态
    resetRecording(){
        var _self = this;
        _self.stopRecording();
        _self.recordingSecond = 0;
        clearInterval(_self.recordingTimer);
        _self.resetRecCallback();
    }


    //PC发送录音
    async sendRecording(){
        var _self = this;
        const file = new File([FWRecorder.getBlob('audio')],"pcRec.wav");
        try {
            const filePath = await _self.uploadRecCallback(file);
            if (filePath) {
                var sendResult = await _self.sendRecCallback(filePath, _self.recordingSecond);
                _self.recordingSecond = 0;
            }


        } catch (error) {
            console.log(error);
        }
    }
}
