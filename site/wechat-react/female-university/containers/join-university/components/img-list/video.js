import React, { Component } from 'react';
import { isQlchat } from 'components/envi'

class Video extends Component{
    state = {
        playStatus: false
    }
    player = null;
    componentDidMount() {
        this.initData();
    }
    componentWillReceiveProps(nextProps){
        if(this.props.url !== nextProps.url){
            this.player.pause();
            this.initData();
        }
    } 
    initData(){
        if(this.player && isQlchat()){
            this.fullScreen();
            this.player.addEventListener('playing', () => {
                this.player.play();
                this.setState({
                    playStatus: true
                })
                this.fullScreen();
            })
            this.player.addEventListener("canplaythrough", () => {
                // this.player.play();
            })
            this.player.addEventListener('ended', () => {
                this.player.play();
                this.setState({
                    playStatus: false
                })
            })
            this.player.addEventListener("emptied", (err) => {
            })
        }
    }
    fullScreen(){
        if(this.player){
            // 视频退出全屏，暂停视频，兼容旧版本ios
            const fullscreenchangeHandler = () => {
                const isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement;
                if (!isFullScreen) {
                    // 退出全屏
                    this.player.pause();
                    this.setState({
                        playStatus: false
                    })
                } else {
                    // 进入全屏
                    this.setState({
                        playStatus: true
                    })
                }
            }
            this.player.addEventListener('fullscreenchange', fullscreenchangeHandler);
            this.player.addEventListener('webkitfullscreenchange', fullscreenchangeHandler);
            this.player.addEventListener('mozfullscreenchange', fullscreenchangeHandler);
            this.player.addEventListener('webkitendfullscreen', fullscreenchangeHandler);
            this.player.addEventListener("x5videoexitfullscreen", () => {
                // 退出全屏
                this.player.pause();
                this.setState({
                    playStatus: false
                })
            })
            this.player.addEventListener("x5videoenterfullscreen", () => {
                this.setState({
                    playStatus: true
                })
            })
        }
    }
    componentWillUnmount() {
        this.player.pause();
    }
    render(){
        const { playStatus } = this.state;
        return (
            <div className={ `un-video-box ${ playStatus ? "maxWidth" : "" }` }>
                <video  
                    ref={ r => this.player = r }
                    // webkit-playsinline="true"
                    // x5-playsinline="true"
                    // x5-video-player-type="h5"
                    // x-webkit-airplay="true"
                    crossOrigin="anonymous"
                    // x5-video-player-fullscreen={ isQlchat() ? 'true' : 'false' }
                    src={this.props.url} 
                    controls 
                    />
            </div>
            
        )
    }
}

export default Video