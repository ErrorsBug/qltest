import React from 'react';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { createPortal } from 'react-dom';
import { moveAudio, deleteAudio } from '../../../../actions/short-knowledge';
import { AudioPlayer } from 'components/audio-player';


const reducer = state => {
    return {
        activeImage: state.shortKnowledge.activeImage,
        resourceList: state.shortKnowledge.resourceList,
        textContent: state.shortKnowledge.textContent,
        audioList: state.shortKnowledge.audioList,
    }
}

const actions = {
    moveAudio,
    deleteAudio
}

class ShowImage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showMenuIndex: -1,
            listLength: 0,
            left: 0,
            top: 0,
            playUrl: '',
            localId: '',
        }
    }

    data = {
        time: 0,
        // 当前像素和75px的比例
        pxRatio: Number(document.querySelector('html').style.fontSize.split('px')[0]) / 75
    }

    componentDidMount(){
        this.initEvent()
    }

    componentWillReceiveProps(nextProps){
        // 切换图片暂停语音播放
        if(nextProps.activeImage && this.props.activeImage && nextProps.activeImage.id !== this.props.activeImage.id){
            this.stopPlay()
        }
    }

    stopPlay = ()=> {
        if(this.state.playUrl){
            this.audioPlayer && this.audioPlayer.pause()
            this.setState({playUrl: ''})
        }
        if(this.state.localId){
            wx.stopVoice({
                localId: this.state.localId
            });
            this.setState({localId: ''})
        }
    }

    initEvent = () => {
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.on('ended', _=>{this.setState({playUrl: ''})});
        wx.ready(() => {
            wx.onVoicePlayEnd({
                success: (res) => {
                    this.setState({localId: ''})
                }
            });
        });
    }

    audioTouchStartHandler = (e, index, listLength) => {
        this.data.time = 0
        if(this.timeout){
            clearInterval(this.timeout)
        }
        this.timeout = setInterval(_=>{
            this.data.time += 30
            if(this.data.time > 500) {
                this.data.time = 0
                clearInterval(this.timeout)
                let position = document.querySelectorAll('.audio-item')[index].getBoundingClientRect()
                this.setState({
                    showMenuIndex: index,
                    listLength,
                    left: position.x + 30 * this.data.pxRatio,
                    top: position.y - 80 * this.data.pxRatio
                })
            }
        },30)
    }

    audioTouchEndHandler = e => {
        this.data.time = 0
        clearInterval(this.timeout)
    }

    // 音频上移
    shiftUp = () => {
        this.props.moveAudio('up', this.state.showMenuIndex)
    }

    // 音频下移
    shiftDown = () => {
        this.props.moveAudio('down', this.state.showMenuIndex)
    }

    // 音频删除
    delete = (e) => {
        this.props.deleteAudio(this.state.showMenuIndex)
    }

    // 音频播放
    audioItemClick = async(i) => {
        if(i.content){
            // 存在正在播放的临时录音要停掉
            if(this.state.localId){
                await wx.stopVoice({
                    localId: this.state.localId
                });
                this.setState({localId: ''})
            }
            // 正在播放且点击的是同一条
            if(this.state.playUrl && this.state.playUrl == i.content){
                this.setState({playUrl: ''},_=>{
                    this.audioPlayer.pause();
                })
            }else{
                this.audioPlayer.pause();
                this.setState({playUrl: i.content},_=>{
                    this.audioPlayer.play(this.state.playUrl)
                })
            }
        }else if (i.localId){
            // 存在正在播放的audio录音要停掉
            if(this.state.playUrl){
                this.setState({playUrl: ''})
                this.audioPlayer.pause();
            }
            // 正在播放且点击的是同一条
            if(this.state.localId && this.state.localId == i.localId){
                this.setState({localId: ''})
                wx.stopVoice({
                    localId: i.localId
                });
            }else {
                await wx.stopVoice({
                    localId: this.state.localId
                });
                this.setState({localId: i.localId},()=>{
                    wx.playVoice({
                        localId: i.localId
                    });
                })
            }
        }
    }

    // 之所以用touchend事件是因为click事件在touchend之后，长按音频的时候touchend事件出现操作栏之后，
    // 会直接触发操作栏蒙层的click事件，从而隐藏掉了操作栏
    MenuBgClick = e =>{
        let target = e.target
        this.setState({
            showMenuIndex: -1
        })
        if(target.id === 'delete'){
            this.delete()
        }else if (target.id === 'shift-up' && !target.classList.contains('disabled')){
            this.shiftUp()
        }else if (target.id === 'shift-down' && !target.classList.contains('disabled')){
            this.shiftDown()
        }
    }

    render(){
        let { listLength, showMenuIndex, left, top, playUrl, localId } = this.state
        let { activeImage, audioList, textContent } = this.props
        let currentList = audioList[activeImage.id]
        let text = textContent[activeImage.id]

        return (
            <div className="show-image-container">
                <img className="show-image" src={activeImage.content || activeImage.wxlocalId} alt=""/>
                <div className="audio-container">
                    {
                        currentList && Array.isArray(currentList) && currentList.length > 0 && currentList.map((i, d) => {
                            if(i.type === 'audio'){
                                return (
                                    <div 
                                        className={`audio-item`} 
                                        key={`list-${d}`} 
                                        style={{width: `${i.duration / 20 * 100 }%`}} 
                                        onTouchStart = {e => this.audioTouchStartHandler(e, d, currentList.length)}
                                        onTouchEnd = {e => this.audioTouchEndHandler(e, d, currentList.length)}
                                        onClick = {()=>{this.audioItemClick(i)}}
                                    >
                                        <span className={`sound${((i.localId && localId == i.localId) || (i.content && playUrl == i.content)) ? ' playing' : ''}`}></span>
                                        <span className="second">{i.duration + '`'}</span>
                                    </div>
                                )
                            }
                        })
                    }
                    { text && text.content && <div className="text-item">{text.content}</div>}
                </div>
                {
                    showMenuIndex > -1 ? 
                    createPortal(
                        <div className="short-knowledge-menu-container" onTouchEnd={this.MenuBgClick}>
                            <div className="menu-container" style={{left: `${left}px`, top: `${top}px`}}>
                                <span id="delete" className="delete"
                                data-log-region="ppt-edit"
                                data-log-pos="audio-delete"
                                data-log-name="语音删除">删除</span>
                                <span id="shift-up on-log" className={`shift-up${(listLength === 1 || showMenuIndex === 0) ? ' disabled' : ''}`}
                                data-log-region="ppt-edit"
                                data-log-pos="audio-up"
                                data-log-name="语音上移">上移</span>
                                <span id="shift-down on-log" className={`shif-down${(listLength === 1 || showMenuIndex === listLength - 1) ? ' disabled' : ''}`}
                                data-log-region="ppt-edit"
                                data-log-pos="audio-down"
                                data-log-name="语音下移">下移</span>
                            </div>
                        </div>,
                        document.querySelector('#app>div')
                    ) : null
                }
            </div>
        )
    }
}

export default connect(reducer, actions, null, { withRef: true })(ShowImage)

