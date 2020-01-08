import React from 'react';
import { connect } from 'react-redux';
import { WxRecorder } from 'components/recorder/wx';
import { getVal } from 'components/util';
import Detect from 'components/detect';
import { normalFilter } from 'components/util';
import { createPortal } from 'react-dom';
import { addAudio, computeTotalSecond, addText } from '../../../../actions/short-knowledge';

const reducer = state => {
    return {
        audioList: state.shortKnowledge.audioList,
        activeImage: state.shortKnowledge.activeImage,
        totalSecond: state.shortKnowledge.totalSecond,
        textContent: state.shortKnowledge.textContent,
    }
}

const actions = {
    addAudio,
    computeTotalSecond,
    addText
}

class InputLabel extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            canSpeak: true,
            touching: false,
            textareaValue: '',
            textCount: 0,
            showSendBtn: false,
            isWeixin: (Detect.os.phone || Detect.os.tablet) && Detect.os.weixin
        }
    }

    componentWillMount(){
        let {activeImage, textContent} = this.props
        if(activeImage && textContent && textContent[activeImage.id]){
            let content = getVal(textContent[activeImage.id], 'content')
            this.setState({
                textareaValue: content,
                textCount: content.length
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.activeImage.id && nextProps.activeImage.id !== this.props.activeImage.id){
            let content = getVal(nextProps.textContent[nextProps.activeImage.id], 'content', '')
            this.setState({
                textareaValue: content || '',
                textCount: content.length || 0
            })
        }
    }

    componentDidMount(){
        this.initRecord()
    }

    data = {
        touchTime: 0,
        recLocalId: '',
        recSecond: 0,
    }

    // 录音初始化
    initRecord = () => {
        if (this.state.isWeixin) {
            this.recorder = new WxRecorder({
                startRec:this.setRecStart,
                stopRec:this.stopRecHandle,
                sendRec:this.wxSendRecHandle,
                recClock:this.recClock,
                // resetRec:this.resetRecording,
                wxUploadHandle:this.wxUploadHandle,
                autoRec:typeof(this.props.autoRec != 'undefined') ? this.props.autoRec : this.state.autoRec,
            });
        }
    }

    // 录音计时器处理
    recClock = (second) => {
        this.data.recSecond = second
        if(this.props.totalSecond > 0 && this.props.totalSecond + second >= 60 || this.props.totalSecond == 0 && second >= 58){
            this.stopRecording()
            this.touchEndHandlerFail = true
        }
        if (second >= 58){
            this.onlyOneSentence = true
        }
    }

    // 判断是否可以录音
    isCanSpeak = () => {
        let { activeImage, audioList } = this.props
        if(!activeImage.id){
            window.toast('当前未选中图片！')
            return false
        }
        if(this.props.totalSecond > 59){
            window.toast('语音总秒数已经达到60秒！')
            return false
        }
        let currentList = audioList[activeImage.id]
        if(audioList && Array.isArray(currentList) && currentList.length >= 3){
            window.toast('每张图片最多可以有三条语音！')
            return false
        }
        return true
    }

    touchStartHandler = (e) => {
        e.preventDefault()
        // 暂停正在播放的录音
        this.props.stopPlay()
        if(!this.isCanSpeak()){
            return
        }
        this.time = Date.now()
        this.recordTimer = setTimeout(_=>{
            console.log("startRecording");
            this.recorder.startRecording()
        }, 300)
    }

    // 开始录音的回调
    setRecStart = () => {
        this.setState({touching: true})
    }

    touchEndHandler = (e) => {
        if(Date.now() < this.time + 300){
            clearTimeout(this.recordTimer)
            return
        }
        if(this.touchEndHandlerFail){
            this.touchEndHandlerFail = false
            return
        }
        if(!this.isCanSpeak()){
            return
        }
        this.stopRecording()
    }

    touchCancelHandler = e => {
        this.stopRecording()
    }

    // 暂停录音处理的回调
    stopRecHandle = (res = {}) => {     
        if(res){
            this.data.recLocalId = res.localId
        }
        if (Number(this.data.recSecond) < 1) {
            window.toast('录音时间太短');
            return;
        }
        // 发送录音
        this.recorder.sendRecording();
    }

    // 停止录音操作
    stopRecording = () => {
        this.setState({touching: false})
        // // 停止录音
        this.recorder.stopRecording();
    }

    // 微信语音上传
    wxUploadHandle = async ({ recLocalId = '', second, serverId } = {}) => {
        if(!serverId){
            return
        }
        // 存储当前录音列表
        this.props.addAudio({
            localId: recLocalId,
            duration: this.onlyOneSentence ? 60 : this.data.recSecond,
            audioId: serverId,
            type: 'audio',
            resourceId: serverId,
        })
        // 计算总秒数
        this.props.computeTotalSecond(this.onlyOneSentence ? 60 : this.data.recSecond || 0)
    }

    // WX发送录音处理
    async wxSendRecHandle(serverId,second,isAuto = false){
        return 'reset';
    }

    toggleCanSpeak = () => {
        this.setState({canSpeak: !this.state.canSpeak}, _=>{
            if(!this.state.canSpeak){
                let ele = document.querySelector('.write-textarea')
                ele.focus()
                setTimeout(_=>{
                    ele.scrollIntoView()
                    this.setState({showSendBtn: true})
                }, 50)
            }else {
                this.setState({showSendBtn: false})
            }
        })
    }

    textareaChange = e => {
        let activeImageId = this.props.activeImage.id || ''
        if(!activeImageId){
            window.toast('当前未选中图片！')
            return
        }
        let value = e.target.value
        this.setState({
            textareaValue: value,
            textCount: value.length
        })
    }

    // 发送文字到图片上
    sendText = () => {
        let activeImageId = this.props.activeImage.id || ''
        if(!activeImageId){
            window.toast('当前未选中图片！')
            return
        }
        if(this.state.textareaValue.length > 32){
            window.toast('文字描述长度不能超过32个字符！')
            return
        }
        this.props.addText({
            content: this.state.textareaValue,
            sort: 10000,
            type: 'text'
        })
        this.setState({
            showSendBtn: false,
            canSpeak: true
        })
        document.body.scrollIntoView()
    }

    textareaFocus = () => {
        let ele = document.querySelector('.operation-label-container')
        if(ele){
            ele.classList.add('hide')
        }
    }

    textareaBlur = () => {
        document.body.scrollIntoView()
        let ele = document.querySelector('.operation-label-container')
        if(ele){
            ele.classList.remove('hide')
        }
    }

    render(){
        let { touching, canSpeak, isWeixin } = this.state
        return (
            <div className="input-label-container">
                {
                    canSpeak ? 
                    <React.Fragment>
                        <span className="icon speak" onClick={this.toggleCanSpeak}></span>
                        {
                            isWeixin ? 
                            <div 
                                id="touch-ele" 
                                className={`speak-label${touching ? ' touch' : ''}`}
                                onTouchStart = {this.touchStartHandler}
                                onTouchEnd = {this.touchEndHandler}
                                onTouchCancel = {this.touchCancelHandler}
                            >{touching ? '松开 结束' : '按住 说话'}</div>
                            : <div className="speak-label disabled">PC暂不支持录音，请用手机端微信</div>
                        }
                    </React.Fragment>:
                    <React.Fragment>
                        <span className="icon write" onClick={this.toggleCanSpeak}></span>
                        <div className="write-label">
                            <textarea 
                                onChange = {e => this.textareaChange(e)}
                                className = {`write-textarea`}
                                value = {this.state.textareaValue} 
                                onBlur = {this.textareaBlur}
                                onFocus = {this.textareaFocus}
                            />
                            <span className="count">{this.state.textCount}/32</span>
                        </div>
                        {
                            this.state.showSendBtn ? 
                            <div className="send on-log" onClick={this.sendText} 
                            data-log-region="ppt-edit"
                            data-log-pos="send"
                            data-log-name="发送">发送</div> : null
                        }
                    </React.Fragment>
                }
                { touching ? <Speaking /> : null }
            </div>
        )
    }
}

const Speaking = ({}) => createPortal(
        <div className="speaking-portal-dialog">
            <div class="microphone"></div>
        </div>,
        document.querySelector('#app>div')
    )

export default connect(reducer, actions)(InputLabel)

