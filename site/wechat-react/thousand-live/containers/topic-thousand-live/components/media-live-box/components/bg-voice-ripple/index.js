import React, { Component } from 'react';
import PropTypes from 'prop-types';

class VoiceRipple extends Component {
    state = {
        voiceItem:[],
        // 总共生成多少个
        sum: 80,
        // 每个的宽度
        itemWidth: 9,
        // 总宽度
        svgWidth: 0,
        stopAnime:true,
    }
    componentDidMount() {
        this.createRipple();
    }
    componentDidUpdate(preProps, preState) {
        if (preProps.pushLiveStatus != this.props.pushLiveStatus ||preProps.isAudioPlay != this.props.isAudioPlay) {
            this.toggleAnime();
        }
    }

    async createRipple() {

        if (typeof document == undefined) {
            return false;
        }
        let bodyWidth = document.body.offsetWidth;
        let num = 0;
        let voiceItem = [];
        while (num < this.state.sum) {
            let beginTime = Math.random().toFixed(3);
            let durTime = 0.4+ Number(Math.random().toFixed(3));
            await voiceItem.push({ beginTime: beginTime, durTime });
            num++;
        }
        this.setState({
            voiceItem,
            svgWidth: bodyWidth,
            itemWidth: Math.ceil(bodyWidth / this.state.sum),
        })
        
        
    }

    toggleAnime() {
        if ((this.props.liveStatus == 'beginning' && this.props.pushLiveStatus == 1 && this.props.isAudioPlay) ||
            (this.props.liveStatus == 'ended' && this.props.isAudioPlay)
        ) {
            this.playAnime();
        } else {
            this.stopAnime();
        }
    }

    stopAnime() {
        this.setState({
            stopAnime: true,
        })
    }
    playAnime() {
        this.setState({
            stopAnime: false,
        })
    }

    
    render() {
        return (
            <div className='bg-voice-ripple'>
                <svg version="1.1" id="Layer_1" x="0px" y="0px"
                    width={this.state.svgWidth} viewBox={`0 0 ${this.state.svgWidth} ${this.state.svgWidth*10}`} >
                    {
                        this.state.voiceItem.map((item,index) => {
                            return <rect className={`${this.state.stopAnime?'on':''}`} key={`rp-${index}`} x={`${index * this.state.itemWidth}`} y="0" width={Math.ceil(this.state.itemWidth / 2)} height={this.state.stopAnime?"1":this.state.itemWidth*1.5} fill="#231F20">
                                {
                                    !this.state.stopAnime?
                                    <animateTransform attributeType="xml"
                                    attributeName="transform"
                                    type="scale"
                                    values="1,0; 1,3; 1,0"
                                    begin={item.beginTime + "s"} dur={item.durTime + "s"} repeatCount="indefinite" />       
                                    :null
                                }
                            </rect>
                        })
                    }
                </svg>
            </div>
        );
    }
}

VoiceRipple.propTypes = {

};

export default VoiceRipple;