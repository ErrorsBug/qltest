import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind, throttle } from 'core-decorators';

@autobind
class ItemAudio extends Component {

    state = {
    }
    
    delAudio() {
        if (!this.props.edit) {
            return false;
        }
        window.confirmDialog('确定删除该音频吗？', () => {
            this.props.delItem(this.props.item.id,'audio')
        }, ()=> {});
       
    }
    
    @throttle(1500)
    playAudio() {
        this.props.playAudio(this.props.item.type, this.props.item.id);
    }
    @throttle(1500)
    stopAudio() {
        this.props.stopAudio(this.props.item.type);
    }

    @throttle(1500)
    onClickAudio() {
        if (this.props.edit) {
            this.props.addTextItem(this.props.item.id);
            this.props.imFocus(this.props.item.id) 
        } else if(this.props.playStatus == 'play') {
            this.stopAudio();
        } else {
            this.playAudio();
        }
       
    }
    render() {
        return (
            <div className={`item-audio ${this.props.edit?'editing':''}`} >
                <span className="main">
                    <div
                        className={`audio-bar ${this.props.focusId == this.props.item.id ? 'i-m-focus' : ''}`}
                        onClick={this.onClickAudio}
                    >
                        {
                            this.props.playStatus == 'play' &&  this.props.audioMsgId == this.props.item.id?
                            <span className="btn-play" onClick={this.stopAudio}>
                                <img src={require('./img/icon-audio-playing.gif')} />
                            </span>  
                            :    
                            <span className="btn-play" onClick={this.playAudio}>
                                <img src={require('./img/icon-audio-play.png')} />
                            </span>  
                                
                        }   
                        <span className="tips">{this.props.playStatus == 'play'  &&  this.props.audioMsgId == this.props.item.id ? '点击暂停' : '点击收听'}</span>
                        <span className="second">{this.props.item.second || 0}S</span>
                    </div>
                    {
                        this.props.edit?
                        <span className="btn-del icon_cross" onClick={this.delAudio}></span>
                        :null    
                    }
                </span>    
            </div>
        );
    }

    
}

ItemAudio.propTypes = {

};

export default ItemAudio;