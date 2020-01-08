import Detect from '../../detect';

/**
 * 微信录音组件
 */
export class WxRecorder {
    constructor({
            startRec = () => {} ,
            stopRec = () => {} ,
            sendRec = () => {} ,
            recClock = () => {} ,
            resetRec = () => {} ,
            wxUploadHandle = () => {} ,
            autoRec = false,
            isShowProgressTips = 0,
        } = {}) {
        this.recordingSecond = 0; // 录音时长
        this.isSendingRecord = false; // 是否发送录音中
        this.startRecCallback = startRec; // 开始录音处理
        this.stopRecCallback = stopRec; // 停止录音处理
        this.sendRecCallback = sendRec; // 发送录音处理
        this.resetRecCallback = resetRec; // 重置录音配置
        this.clockCallback = recClock; // 录音计时器
        this.autoRec = autoRec; // 录音计时器
        this.wxUploadHandle = wxUploadHandle; // 录音计时器
        this.isShowProgressTips = isShowProgressTips; // 录音计时器

        var _self = this;
        wx.ready(() => {
            wx.onVoiceRecordEnd({
                complete: (res) => {
                    if(_self.recordingSecond<58 && Detect.os.ios ){
                        _self.stopRecCallback(res);
                        _self.recLocalId = res.localId;
                        clearInterval(_self.recordingTimer);
                        window.confirmDialog(
                            '微信自动结束录音',
                            () => {
                                _self.resetRecording();
                            }
                        );
                    }else{
                        // _self.startRecCallback();
                        _self.stopRecCallback(res);
                        clearInterval(_self.recordingTimer);
                    };
                }
            });
        });
    }

    //WX计时器
    wxRecClock(){
        var _self = this;
        _self.recordingSecond = _self.recordingSecond + 1;
        _self.clockCallback(_self.recordingSecond);
        if(_self.recordingSecond >= 60){
            _self.recordingSecond = 60;
            _self.clockCallback(_self.recordingSecond);
            _self.stopRecording(this.autoRec);
        };
    }


    // WX开始录音
    startRecording(){
        var _self = this;
        try {
            wx.startRecord({
                success: (res) => {
                    _self.startRecCallback();
                    _self.recordingTimer = setInterval(() => {_self.wxRecClock();},960);
                },
                fail: (res) => {
                    _self.resetRecording();

                }
            });

        } catch (error) {
            console.log(error);
        }

    }

    //WX暂停录音
    stopRecording(isAuto = false){
        var _self = this;
        if(_self.recordingSecond < 1){
            window.toast("录音时间太短");
        }else{
            wx.stopRecord({
                success: (res) => {
                    _self.stopRecCallback(res);
                    _self.recLocalId = res.localId;
                    clearInterval(_self.recordingTimer);
                    if ( isAuto ) {
                        _self.sendRecording( isAuto );
                    }
                },
                fail: (res) => {
                    clearInterval(_self.recordingTimer);
                    window.toast(res.errMsg);
                },
                complete: (res) => {
                }
            });

        };
    }

    // 重置状态
    resetRecording(){
        var _self = this;
        _self.recordingSecond = 0;
        clearInterval(_self.recordingTimer);
        _self.resetRecCallback();
        wx.stopRecord({
            complete:(res)=>{
            }
        });
    }


    //WX发送录音
    async sendRecording(isAuto = false){
        var _self = this;
        if(!_self.isSendingRecord){
            _self.isSendRecord = true;
            if (!isAuto) {
                window.loading(true);
            }
            let second = _self.recordingSecond;
            await this.wxUploadHandle({recLocalId:_self.recLocalId , second : second});

            // 500毫秒后自动录下一条
            setTimeout(()=>{
                if (isAuto) {
                    _self.resetRecording();
                    _self.startRecording();
                }
            },600)
            setTimeout(()=>{
                wx.uploadVoice({
                    localId: _self.recLocalId,
                    isShowProgressTips: _self.isShowProgressTips,
                    success: async  (res) =>  {
                        var serverId = res.serverId;
                        await this.wxUploadHandle({recLocalId:_self.recLocalId ,second : second, serverId : res.serverId});
                        var sendResult = await _self.sendRecCallback(res.serverId,second,isAuto);
                            _self.isSendRecord = false;
	                    if (!isAuto) {
		                    window.loading(false);
	                    }
                        if(sendResult === 'reset' || (!isAuto && sendResult.state.code === 0)){
                            _self.resetRecording();
                        }

                    },
                    fail: (res) => {
                        window.toast("发送失败");
                        window.loading(false);
                        _self.resetRecording();
                        if (typeof _qla != 'undefined') {

                            _qla('event', {
                                category: 'wxRecFail',
                                action:'failed',
                                // 错误信息
                                error_msg: res,
                            });
                        }
                    },
                    complete: (res) => {
                    },
                    cancel: (res) => {
                        window.loading(false);
                        _self.resetRecording();
                    }
                });
            },200)
        }
    }
}
