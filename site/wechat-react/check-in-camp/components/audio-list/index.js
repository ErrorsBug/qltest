import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import AudioItem from '../audio-item';



@autobind
export class AudioList extends Component {

    constructor(props) {
        super(props)

        this.audioItem = [];
        
    }

    state = {
        currentPlayingIndex:null,
        audioList: this.props.audioList,
    }

    componentDidMount = () => {
        this.initAudio();
    }
    initAudio() {
        wx.ready(() => {
            wx.onVoicePlayEnd({
                success: (res) => {
                   this.disableAudio(this.state.currentPlayingIndex);
                }
            });
        });
    }

    stopPlayingAudio(index){
        // const audioItem = this.audioItem[index];
        const currentPlayingIndex = this.state.currentPlayingIndex;
        console.log("index:",index,",this.state.currentPlayingIndex:",currentPlayingIndex);
        if(currentPlayingIndex !== index && currentPlayingIndex!=null && this.audioItem[currentPlayingIndex].state.active ){
            this.disableAudio(currentPlayingIndex,()=>{
                this.setState({
                    currentPlayingIndex: index
                })
            });
        }else if(currentPlayingIndex !== index){
            this.setState({
                currentPlayingIndex: index
            })
        }
        
    }

    disableAudio(index,callback) {
        console.log("disableAudio",index);
        const audioItem = this.audioItem[index];
        console.log(this.audioItem);
        if ( audioItem && audioItem.state.active ) {
            console.log("disableAudio  handleAudioPlay &&&&&&");
            audioItem.handleAudioPlay();
            callback && callback();
        }
    }

    playWxAudio(audioId,callback){
        wx.playVoice({
            localId: audioId,
            success: () => {
                callback&& callback();
            },
            fail: () => {}
        });
    }

    stopWxAudio(audioId,callback){
        wx.stopVoice({
            localId: audioId,
            success: () => {
                console.log("stop *****************");
                callback&& callback();
            },
            fail: () => {
            }
        });
    }

    render() {
        console.log("audioList",this.props.audioList)
        return <div className="audio-area">
            {
                this.props.audioList.map((item, index) => {
                    return <div className="audio-li" key={`audio-li-${index}`}>
                    <div className="audio" onClick={()=>this.stopPlayingAudio(index)}>
                        <AudioItem                                                       
                            ref={ dom => dom && (this.audioItem[index] = dom.getWrappedInstance()) }
                            key={index} 
                            src={item.audioUrl} 
                            audioLength={Number(item.duration)} 
                            audioId={item.isWx ? item.recLocalId : null}
                            playWxAudio = {this.playWxAudio}
                            stopWxAudio = {this.stopWxAudio}
                            active = {this.state.currentPlayingIndex === index}
                            isList = {true}
                        />
                    </div>
                    <div className="delete" onClick={() => this.props.deleteAudio(index)}>删除</div>
                    </div>
                })
            }
        </div>
    }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioList)
