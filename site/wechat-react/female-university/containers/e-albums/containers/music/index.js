import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss'
import musicOn from '../../img/musicOn.png'
import musicOff from '../../img/musicOff.png'
import { AudioPlayer } from 'components/audio-player';
import $ from 'jquery';


class Music extends Component {
    state = {
        music: true,
        isPlay: false
    }
    audioPlayer = null
    componentDidMount(){
        this.initAudio();
        window.addEventListener('touchstart', () => {
            !this.state.isPlay && this.audioPlayer.play('https://media.qlchat.com/qlLive/activity/video/59U99LRJ-I2SB-LIE3-1577708071185-28DEUXKSJLKD.mp3')
        })
    }
    initAudio(){
        this.audioPlayer = new AudioPlayer();
		this.audioPlayer.on('ended', () => {
            this.audioPlayer.resume()
        });
        this.audioPlayer.on('error', () => {
            this.audioPlayer.pause()
            this.setState({
                music: false,
                isPlay: flase
            })
        })
        this.audioPlayer.on('playing', this.audioPlaying)
        this.audioPlayer.play('https://media.qlchat.com/qlLive/activity/video/59U99LRJ-I2SB-LIE3-1577708071185-28DEUXKSJLKD.mp3')
    }
    audioPlaying = () => {
        this.setState({
            isPlay: true
        })
    }
    Open = (music) => {
        music = !music
        if(!music) {
            this.audioPlayer.pause();
        } else {
            this.audioPlayer.resume();
        }
        this.setState({
            music
        })
    }
    render() {
        const { music } = this.state
        return <div className='music' onClick={this.Open.bind(this, music)}>
            <img src={music ? musicOn : musicOff} />
        </div>
    }
}

export default Music