import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import AudioPlayer from '../audio-player';

@autobind
export class AudioItem extends Component {
    static propTypes = {
        src: PropTypes.string,
        audioLength: PropTypes.number,
    }

    constructor(props) {
        super(props)
        
        this.state = {
            countDownTimes: props.audioLength || 0,
            active: false,
            playProcessWidth: 0,
        }
    }

    componentDidMount = () => {
       this.initAudio();
    }

    componentDidUpdate(preProps){
        if(this.props.active != preProps.active){
            this.setState({
                active: this.props.active,
                playProcessWidth: 0,
            },()=>{
                // this.handleAudioPlay();
                this.currentTimeWx = 0;
                if(this.props.audioId){
                    if(this.props.active){
                        
                        this.playtimer && clearInterval(this.playtimer);
                        this.playtimer = setInterval(()=>{
                            this.currentTimeWx = this.currentTimeWx +1;
                            this.setState({
                                playProcessWidth: ( this.currentTimeWx/this.props.audioLength*100>100? 100 : this.currentTimeWx/this.props.audioLength*100 ),
                            },()=>{
                                if(this.state.playProcessWidth >=100){
                                    this.disableAudio();
                                    this.props.overAudio && this.props.overAudio();
                                }
                            });
                        },1000);
                    }else{
                        this.disableAudio();
                        
                    }
                }
            });
        }
    }
    
    initAudio() {
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.on('pause', ()=>{
            this.setState({active: false, playProcessWidth: 0});
            this.playtimer && clearInterval(this.playtimer);
        });
        
        // if(!this.props.isList){
        //     wx.ready(() => {
        //         wx.onVoicePlayEnd({
        //             success: (res) => {
        //                this.disableAudio();
        //             }
        //         });
        //     });
        // }
    }
    disableAudio() {
        this.audioPlayer.pause();
        this.setState({active: false, playProcessWidth: 0});
        this.playtimer && clearInterval(this.playtimer);
    }

    activeAudio() {
        // this.disableAudio();
        this.audioPlayer.play(this.props.src)
        this.audioPlayer.currentTime = 0 ;
        // 临时兼容添加延时
        setTimeout(() => this.setState({active: true, playProcessWidth: 1},()=>{
            this.playtimer && clearInterval(this.playtimer);
            this.playtimer = setInterval(()=>{
                this.setState({
                    playProcessWidth: ( this.audioPlayer.currentTime/this.props.audioLength*100>100? 100 : this.audioPlayer.currentTime/this.props.audioLength*100 ),
                },()=>{
                    if(this.state.playProcessWidth >=100){
                        this.disableAudio();
                    }
                });
            },1000);
        }), 300)
        
    }

    handleAudioPlay() {
        if (this.props.audioId) {
            //微信的播放被抽到外面了，更新组件中的active属性来控制播放和暂停
            // if (this.state.active) {
                // this.props.stopWxAudio && this.props.stopWxAudio(this.props.audioId,()=>{
                    // this.setState({active: false, playProcessWidth: 0});
                    // this.playtimer && clearInterval(this.playtimer);
                // })
            // }else{
                // this.props.playWxAudio && this.props.playWxAudio(this.props.audioId,()=>{
                    // 临时兼容添加延时
                    // this.currentTimeWx = 0;
                    // setTimeout(() => this.setState({active: true, playProcessWidth: 1},()=>{
                        
                            // this.playtimer && clearInterval(this.playtimer);
                            // this.playtimer = setInterval(()=>{
                            //     console.log("setInterval",this.currentTimeWx);
                            //     this.currentTimeWx = this.currentTimeWx +1;
                            //     this.setState({
                            //         playProcessWidth: ( this.currentTimeWx/this.props.audioLength*100>100? 100 : this.currentTimeWx/this.props.audioLength*100 ),
                            //     },()=>{
                            //         if(this.state.playProcessWidth >=100){
                            //             console.log("&2");
                            //             this.disableAudio();
                            //         }
                            //     });
                            // },1000);
                    // }), 200)
                // });
            // }
        }else{
            if (this.state.active) {
                this.disableAudio();
            }else{
                this.activeAudio();
            }
        }
    }
    get audioWidth(){
        let width = 0;
        if(this.props.audioLength/60*100 <=33){
            width = 33;
        }else if(this.props.audioLength/60*100 <=66){
            width = 66;
        }else{
            width = 100;
        }
        return width;
    }

    render() {
        return (
            <div className="components-audio-item-container" style={{ width : `${this.audioWidth}%`}} onClick={this.handleAudioPlay}>
                <div className="left">
                    <span className={`audio ${this.state.active ? 'audio-playing' : 'audio-pause'}`}></span>
                </div>
                <div className={`process ${this.state.active ? 'playing' : ''}`}><div style={{width: `${this.state.playProcessWidth}%`}}></div></div>
                <div className="right">
                    {
                        this.props.audioLength ?
                        <span className="count-down">{this.props.audioLength}<span>"</span></span> :
                        null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AudioItem)
