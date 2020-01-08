import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Detect from 'components/detect';
import { imgUrlFormat } from "components/util";

class CanvasVideo extends Component {

    state ={
        videoWidth: 0,
        videoHeight: 0,
        showCoverImage: true,
        // ios不支持同层播放器，所以用canvas播放器
        userCanvas: false,
    }
    data={
        playing: false,
        
    }

    componentDidMount(){
        this.videoPlayer = document.getElementById('ql-video-player');
        this.redBar = document.getElementsByClassName('red-bar')[0];
        
        this.videoPlayer.oncanplay = ()=>{
            if(this.state.userCanvas){
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = this.videoPlayer.videoWidth;
                this.canvas.height = this.videoPlayer.videoHeight;
            }
            
            this.setState({
                videoWidth: this.videoPlayer.videoWidth,
                videoHeight: this.videoPlayer.videoHeight,
            });
        }
        this.videoPlayer.ontimeupdate = ()=>{
            this.redBar.style.width = (this.videoPlayer.currentTime / this.videoPlayer.duration*100) +'%';
        }

        this.videoPlayer.addEventListener('x5videoenterfullscreen', () => {
            this.props.onx5videoenterfullscreen && this.props.onx5videoenterfullscreen();
        })

        this.videoPlayer.addEventListener('x5videoexitfullscreen', () => {
            this.props.onx5videoexitfullscreen && this.props.onx5videoexitfullscreen();
        })

        this.loopPlay();
    }

    

    onClickVideo(){
        // 点击播放15秒后弹出绑定的课程卡片
        if (!this._timerShowGoods) {
            this._timerShowGoods = setTimeout(() => {
                this.props.showGoods && this.props.showGoods();
            }, 15000)
        }

        if(this.data.playing){
            this.data.playing = !this.data.playing;
            this.pause();
        }else{
            this.data.playing = !this.data.playing;
            this.play();
        }
        this.props.onClickVideo && this.props.onClickVideo(this.data.playing);
        this.setState({
            showCoverImage: false,
        });
    }

    pause(){
        this.videoPlayer.pause();
        if(this.state.userCanvas){
            this.stopCanvas();
        }
    }

    play(){
        this.videoPlayer.play();
        if(this.state.userCanvas){
            this.playCanvas();
        }
    }

    // 循环播放
    loopPlay(){
        this.videoPlayer.onended = ()=>{
            
            this.playAgain();
            this.setState({
                showCoverImage: false,
            });
            this.props.showGoods && this.props.showGoods();
        };
        this.videoPlayer.src = this.props.src;
        this.videoPlayer.currentTime = 0.1;
    }

    playAgain () {
        this.videoPlayer.currentTime = 0.1;
        this.play();
    }

    stopCanvas(){
        clearInterval(this.timer);
    }

    playCanvas(){
        clearInterval(this.timer);
        this.timer = setInterval(this.draw.bind(this),100)
        
    }

    draw(){
        this.canvas.width = this.videoPlayer.videoWidth;
        this.canvas.height = this.videoPlayer.videoHeight;
        this.ctx.drawImage(this.videoPlayer, 0 ,0 ,this.canvas.width, this.canvas.height)

    }

    render() {
        return (
            <div className="canvas-video-box" onClick={this.onClickVideo.bind(this)}>
                {
                    this.state.userCanvas ? <canvas className="el-canvas" ref={el => (this.canvas = el)}></canvas> : null
                }
                <video id='ql-video-player'
                        // src={this.props.src}
                        preload="auto"
                        webkit-playsinline="true"
                        x5-playsinline="true"
                        playsInline={true}
                        x5-video-player-type="h5"
                        x5-video-player-fullscreen="true"
                        x-webkit-airplay="true"
                        crossOrigin="anonymous"
                        hidden = {this.state.userCanvas || this.state.showCoverImage }
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                ></video>
                {
                    this.state.showCoverImage && this.props.coverImage!='' && 
                    <div className="coverImage">
                        <img src={imgUrlFormat(this.props.coverImage,'?x-oss-process=image/resize,limit_0,w_720')} />
                    </div>
                } 
            </div>
        );
    }
}

CanvasVideo.propTypes = {
    src: PropTypes.string.isRequired,
    coverImage: PropTypes.string,
    showGoods: PropTypes.func,
};

export default CanvasVideo;