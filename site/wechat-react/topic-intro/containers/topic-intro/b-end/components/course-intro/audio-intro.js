import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { AudioPlayer } from 'components/audio-player';

@autobind
class AudioIntro extends Component {
    state = {
        duration: 0,
        playStatus: 'stop',
        playingUrl:'',
    }

    componentDidMount() {
        this.initDuration();
        this.initAudio();
    }

    initDuration() {
        let duration = this.props.audioProfile.reduce((pre, cur, idx) => {
            return pre + (Number(cur.time) || 0);
        }, 0);
        this.setState({
            duration
        })
        
    }

    /**
     * 播放器初始化监听
     *
     *
     * @memberOf ThousandLive
     */
    async initAudio(){
        this.audioPlayer = new AudioPlayer();

        this.audioPlayer.on('ended',this.audioEnded);
        this.audioPlayer.on('pause',this.audioPause);
        this.audioPlayer.on('playing',this.audioPlaying);

    }

    audioEnded(e){


        if (this.props.audioProfile.length > 1 && this.props.audioProfile[1].url != this.state.playingUrl) {
            this.setState({
                playingUrl:this.props.audioProfile[1].url,
            })
            this.audioPlayer.play(this.props.audioProfile[1].url);
        } else {
            this.setState({
                playStatus: 'stop',
                playingUrl:'',
            })
        }


    }

    audioPause() {
        this.setState({
            playStatus: 'stop',
        })
    }
    audioPlaying() {
        this.setState({
            playStatus: 'playing',
        })
    }

    stopAudio() {
        this.setState({
            playStatus: 'stop',
            playingUrl:'',
        })
        this.audioPlayer.pause();
    }

    playAudio() {
        this.setState({
            playStatus: 'playing',
            playingUrl:this.props.audioProfile[0].url,
        })
        this.audioPlayer.play(this.props.audioProfile[0].url);
    }

    render() {
        return (
            <div className='audio-intro'>
                {
                    this.state.playStatus == 'stop' ?
                    <span className="btn-play" onClick={this.playAudio}>
                        <img src={require('./img/icon-audio-play.png')} />
                    </span>  
                    :    
                    <span className="btn-play" onClick={this.stopAudio}>
                        <img src={require('./img/icon-audio-playing.gif')} />
                    </span>  
                        
                }    
                <span className='content'>{this.props.topicInfo.topic}</span>
                <span className="second">{this.state.duration}s</span>
            </div>
        );
    }
}

AudioIntro.propTypes = {

};

export default AudioIntro;