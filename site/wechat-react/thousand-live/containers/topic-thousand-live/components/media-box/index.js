import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { findDOMNode } from 'react-dom';
// import Detect from 'components/detect';
// import StackBlur from 'components/stack-blur';
// import { imgUrlFormat} from 'components/util';
// import { autobind } from 'core-decorators';
import Video from './video';
import Audio from './audio2';

class MeadiaBox extends Component {

    getMeadiaEl() {
        let { style } = this.props.topicInfo;

        // style = 'audio';
        switch(style) {
            case 'video':
                return (
                    <Video {...this.props}/>
                );
            case 'audio':
                return (
                    <Audio {...this.props} ref={r => this.refAudioPlayer = r}/>
                );
        }
    }

    pause() {
        this.refAudioPlayer && this.refAudioPlayer.handlePauseBtnClick();
    }

    /* 更改播放速率 */
    changePlaybackRate(rate) {
        if (this.refAudioPlayer) {
            this.refAudioPlayer.changePlaybackRate(rate);
        }
    }

    render() {
        return (
            <div className={`media-box${this.props.topicInfo.style === 'audio' ? ' audio' : ''}`}>
                <div className="meadia-wrap">
                {
                    this.getMeadiaEl()
                }
                </div>
            </div>
        );
    }
}

MeadiaBox.propTypes = {
    topicInfo: PropTypes.object,
};

export default MeadiaBox;
