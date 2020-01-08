import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PlayTips extends Component {


    render() {
        if (this.props.clicked || this.props.isAudioPlay) {
            return null
        } else if (this.props.liveStatus == 'beginning' && this.props.pushLiveStatus == 1) {
            /* 
                1.已开播
                2.有数据流
                3.没点击开始
                4.还没点击过开始
            */
           return <div className="play-tips" onClick={this.props.handlePlayBtnClick}>上课了，点击开始上课</div>
        } else if (this.props.liveStatus == 'ended' && this.props.conversion) {
            /* 
                1.已结束
                2.转码中
            */
           return <div className="play-tips" onClick={this.props.handlePlayBtnClick}>直播已结束，音频转码中稍后可回听</div>
        } else if (this.props.liveStatus == 'ended' && !this.props.conversion) {
            /* 
                1.已结束
            */
           return <div className="play-tips" onClick={this.props.handlePlayBtnClick}>直播已结束，点击可回听</div>
            
        }else{
            return null

        }


    }
}

PlayTips.propTypes = {

};

export default PlayTips;