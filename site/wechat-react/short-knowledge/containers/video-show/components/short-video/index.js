import React, { Component } from 'react';
import { connect } from 'react-redux';

import CanvasVideo from './components/canvas-video';
import {  imgUrlFormat, digitFormat } from "components/util";

class ShortVideo extends Component {
    state = {
        resourceList: this.props.resourceList || [],
        playing: false,
        resourceData: {},
    }

    componentDidMount(){
        this.initResourceData();
        
    }

    onStartPlay(event){
        event.preventDefault();
        event.stopPropagation();
        this.canvasVideoPlayer && this.canvasVideoPlayer.onClickVideo();
        if(!this.playNumClicked){
            this.props.setStatNum('playNum')
            this.playNumClicked = true;
        }
    }
    onClickVideo(playingStatus){
        this.setState({
            playing: !this.state.playing,
        });
    }


    async initResourceData(){
        const resourceList = this.props.resourceList||[];
        if(resourceList[0]){
            const parentData = resourceList[0].list;
            const ele = {
                textList:[],
                content: resourceList[0].mediaMap && resourceList[0].mediaMap.video && resourceList[0].mediaMap.video[0].playUrl,
            }
            parentData.forEach(element => {
                
                if(element.type === 'text'){
                    ele.textList.push(element);
                }else if(element.type === 'audio'){
                    ele.audioList.push(element);
                }
                
            });
            this.setState({
                resourceData: ele,
            });
        };
        
    }



    render() {
        const { resourceData} = this.state;
        const videoInfo = resourceData||{};
        return (
            <div className="short-video-part">
                { videoInfo.content && <CanvasVideo ref = {(el)=>{this.canvasVideoPlayer=el}} 
                    onClickVideo = {this.onClickVideo.bind(this)}
                    showGoods = {this.props.showGoods.bind(this)}
                    src = {videoInfo.content||''} 
                    coverImage ={this.props.coverImage} 
                    onx5videoenterfullscreen={this.props.onx5videoenterfullscreen}
                    onx5videoexitfullscreen={this.props.onx5videoexitfullscreen}
                />}
                <div className="top-bar">
                    <div className="view-count">
                        <span className="count">{digitFormat(this.props.playNum,10000,["千","w"])}次观看</span>
                        <div className="pic">
                            {
                                this.props.watchList && this.props.watchList.map((item, index)=>{
                                    return <span key={index}><img src={imgUrlFormat(item.headImage||"https://img.qlchat.com/qlLive/liveCommon/normalLogo.png")}/></span>
                                })
                            }
                        </div>
                    </div>
                </div>
                
                {
                    !this.state.playing && <div className="start-bg" onClick={this.onStartPlay.bind(this)}></div>
                }
                <div className="play-progress-bar"><div className="red-bar"></div></div>
            </div>
        );
    }
}

function msp(state) {
    return {
    }
}

const map = {
}

export default connect(msp, map)(ShortVideo);
