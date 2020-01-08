import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-swipe';
import "./style.scss";


import { isPc } from 'components/envi';
import { AudioPlayer } from 'components/audio-player';
import {  imgUrlFormat } from "components/util";

class PptSwiper extends Component {
    state = {
        allDuration: 0,
        playing: false,
        resourceData: [],
        startSlide: 0,
        audioUrl: '',
    }
    data = {
        thisSlide: 0,
        thisTouches:null,
        swiping: false,
        currentIndex: 0,
        currentAudioIndex: 0,
        isBegin: true,
        playingAudio : '',

        audioCurrentTime: 0,
        currentTime: 0,

        nextIndex:0,
        audioArray:[],
    }
    componentDidMount(){
        this.initResourceData();
        this.initAudio();

    }

    async initResourceData(){
        let duration = 0;
        const resourceList = this.props.resourceList||[];
        const resourceData = [];
        await resourceList.forEach(item => {
            const parentData = item.list;
            const ele = {
                textList:[],
                audioList:[],
                content: item.content,
            }
            parentData.forEach(element => {
                
                if(element.type === 'text'){
                    ele.textList.push(element);
                    
                }else if(element.type === 'audio'){
                    this.data.audioArray.push(element);
                    ele.audioList.push(element);
                    duration += element.duration;
                    this.hasAudio = true;
                }
                
            });
            resourceData.push(ele);
        });
        this.setState({
            resourceData,
            allDuration: duration,
        });

        
    }

    initAudio(){
        this.audio = new AudioPlayer();
        this.audio.volume = 1;//图片语音音量
        if(this.props.musicUrl){
            this.bgAudio = new AudioPlayer();
            if(this.hasAudio ){
                if( isPc){
                    this.bgAudio.volume = 0.2;//背景音乐音量
                }else{
                    this.bgAudio.volume = 0.01;//背景音乐音量
                }
                
            }else{
                this.bgAudio.volume = 1;//背景音乐音量
            }
            
            
        }
        this.preLoad();
        this.audio.on('ended',this.audioEnded.bind(this));
        this.audio.on('pause',()=>{
            this.data.audioCurrentTime = this.audio.currentTime+0.1;
        });

        
        if(this.props.musicUrl){
            this.bgAudio.on('ended',()=>{
                this.bgAudio.resume();
            });
            this.bgAudio.on('pause',()=>{
                this.data.currentTime = this.bgAudio.currentTime+0.1;
            });
            
        }
    }

    onStartPlay(event){
        event.preventDefault();
        event.stopPropagation();
        if(this.playing){return false}
        this.setState({
            playing: true,
        });
        this.playing = true;
        if(this.data.isBegin){
            this.data.nextIndex = 1;
            this.preLoad();
            this.data.isBegin = false;
            this.data.currentIndex = 0;
            this.data.currentAudioIndex = 0;
            if(this.bgAudio){
                this.bgAudio.play(this.props.musicUrl);
                this.bgAudio.seek(1);
            }
            this.initCurrentInfo(); 
        }else{
            if(this.bgAudio){
                this.bgAudio.resume();
            }
            //没有音频的ppt帧的逻辑,默认播放4秒
            if(this.state.currentMediaInfo.audioList.length<=0){
                //没有音频的ppt帧的逻辑,默认播放4秒
                this.timer && clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    this.changeSlide();
                },4000);
                
            }
            this.audio.resume();
        }
        
        
        
        if(!this.playNumClicked){
            this.props.setStatNum('playNum')
            this.playNumClicked = true;
        }
        
    };

    preLoad(){
        if (this.data.audioArray[this.data.nextIndex] && this.data.audioArray[this.data.nextIndex].content) {
            this.audio.preLoad(this.data.audioArray[this.data.nextIndex].content)  //预加载
        }else if(this.data.audioArray[0] && this.data.audioArray[0].content){
            this.data.nextIndex = 0;
            this.audio.preLoad(this.data.audioArray[this.data.nextIndex].content)  //预加载
        }
        
        
    }

    audioEnded(){
        this.data.currentAudioIndex++;
        this.data.nextIndex++;
        this.preLoad();
        this.data.playingAudio = (this.state.resourceData[this.data.currentIndex] && this.state.resourceData[this.data.currentIndex].audioList[this.data.currentAudioIndex]&& this.state.resourceData[this.data.currentIndex].audioList[this.data.currentAudioIndex].content)||'';
        if(this.data.playingAudio){
            this.startPlay(this.data.playingAudio);
        }else{
            this.changeSlide();
        }
    }

    

    initCurrentInfo(){
        const currentMediaInfo = this.state.resourceData[this.data.currentIndex];
        this.setState({
            currentMediaInfo,
        },()=>{
            if(currentMediaInfo.audioList.length<=0){
                //没有音频的ppt帧的逻辑,默认播放4秒
                this.timer && clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    this.changeSlide();
                },4000);
                
            }else {
                //有音频的ppt帧的逻辑
                this.data.playingAudio = (currentMediaInfo.audioList[this.data.currentAudioIndex] && currentMediaInfo.audioList[this.data.currentAudioIndex].content)||'';
                if(this.data.playingAudio){
                    this.startPlay(this.data.playingAudio);
                }
            }
            
        });
    };

    stopPpt(event){
        event.preventDefault();
        event.stopPropagation();
        if(!this.playing){return false}
        this.setState({
            playing: false,
        });
        this.playing = false;
        this.timer && clearTimeout(this.timer);
        this.bgAudio && this.bgAudio.pause();
        this.audio.pause();

    }

    changeSlide(){
        this.data.currentIndex++;
        if(!this.state.resourceData[this.data.currentIndex]){ 
            this.data.isBegin = true;

            if(this.bgAudio){
                this.bgAudio.resume();
            }

            this.audio.currentTime = 0;
            this.data.audioCurrentTime = 0;

            this.data.currentIndex = 0;
            this.data.currentAudioIndex = 0;
            if(this.state.resourceData[0] && this.state.resourceData[0].audioList[0]&&this.state.resourceData[0].audioList[0].content){
                this.data.playingAudio = this.state.resourceData[0].audioList[0].content||'';
                this.startPlay(this.data.playingAudio);
            }
            this.initCurrentInfo();
            
            this.swiperEl.slide(this.data.currentIndex);
            
            return false;
        }
        this.data.currentAudioIndex=0;
        this.data.audioCurrentTime = 0;
        this.initCurrentInfo();
        this.swiperEl.slide(this.data.currentIndex);
        
    }
    
    onSwiped(){
        this.props.swiperFun && this.props.swiperFun();
    }

    startPlay(src){
        this.audio.play(src);
        this.audio.seek(this.data.audioCurrentTime||0);
        
        
    };

    render() {
        const { resourceData, currentMediaInfo } = this.state;
        return (
            <div className="ppt-pic-list" ref={r => this.swiperBox = r} onClick={this.stopPpt.bind(this)}>
            
            {
                currentMediaInfo && currentMediaInfo.textList &&
                <div className="text">
                {
                    currentMediaInfo.textList.map((item,index)=>{
                        if(item.type === 'text' ){
                            return <div key={`text-${index}`} dangerouslySetInnerHTML={this.props.dangerHtml(item.content)} ></div>;
                        }else return null
                    })
                }
                </div>
            }
            {
                resourceData.length>0 && 
                <Swiper ref={r => this.swiperEl = r}
                    swipeOptions={{
                        startSlide: this.state.startSlide,
                        auto: 0,
                        callback: this.onSwiped.bind(this),
                        stopPropagation: false,
                        disableScroll: true
                    }}  
                    
                    className="pic-list" >
                    {
                        resourceData.length>0 && resourceData.map((item,index)=>{
                            return <div key={`pic-${index}`}><img src={imgUrlFormat(item.content,'?x-oss-process=image/resize,limit_0,w_720')} /></div>
                        })
                    }
                </Swiper>
            }
            {
                this.props.transcodStatus === 'transcoding'?
                <div className="transcoding-bg">合成中</div>
                :
                ( resourceData.length>0 && !this.state.playing && <div className="start-bg" onClick={this.onStartPlay.bind(this)}></div>)
            }
            </div>
        );
    }
}

PptSwiper.propTypes = {
    resourceList: PropTypes.array.isRequired,
    musicUrl: PropTypes.string,
};

export default PptSwiper;