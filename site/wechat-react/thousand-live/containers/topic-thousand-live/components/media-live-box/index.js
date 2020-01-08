import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Detect from 'components/detect';
// import StackBlur from 'components/stack-blur';
import { imgUrlFormat} from 'components/util';
import { autobind } from 'core-decorators';
import Video from './video';
import Audio from './audio';

class MeadiaBox extends Component {

    getMeadiaEl() {
        let { style } = this.props.topicInfo;

        // style = 'audio';
        switch(style) {
            case 'videoLive':
                return <Video {...this.props}/>
            case 'audioLive':
                return (
                    <Audio {...this.props}/>
                );
        }
    }

    render() {
        return (
            <div className={`meadia-live-box${this.props.topicInfo.style === 'videoLive' ? ' video' : ''}`}>
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
