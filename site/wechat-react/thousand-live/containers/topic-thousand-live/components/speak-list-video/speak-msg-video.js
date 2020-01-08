import React, { Component, PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import SpeakMsgContainer from './speak-msg-container';
import Detect from 'components/detect';

class VideoItem extends Component {

    state = {
        videoUrl: '',
        isAndroid: false,
        outerStyle: {},
        ifmStyle: {},
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.content != this.props.content || nextProps.likesNum != this.props.likesNum || this.state !== nextState;
    }

    componentDidMount() {
        if(/(qq\.com)|(youku\.com)/.test(this.props.content)) {
            this.setState({
                videoUrl: this.props.content
            });
        }

        if (Detect.os.android) {
            this.setState({
                isAndroid: true,
            });
        }

        this.fixScaleFrame();

    }

    /**
     * 修正iframe缩放大小
     * @return {[type]} [description]
     */
    fixScaleFrame() {
        let dpr = window.dpr;
        const ifm = findDOMNode(this.refs.ifm);

        // ifm.style.transform = `scale(${dpr})`;

        const outerWidth = ifm.clientWidth * dpr;
        const outerHeight = ifm.clientHeight * dpr;
        // 屏幕真实宽度
        const screenRealWidth = document.body.offsetWidth / dpr;

        // 针对iphone
        if (screenRealWidth <= 375 && dpr <= 2 && dpr > 1) {
            dpr = 1.7;
        }

        if (screenRealWidth <= 320 && dpr <= 2 && dpr > 1) {
            dpr = 1.6;
        }

        // 针对android
        if (screenRealWidth <= 400 && dpr <= 1) {
            dpr = 0.9;
        }

        if (screenRealWidth <= 350 && dpr <= 1) {
            dpr = 0.8;
        }

        this.setState({
            outerStyle: {
                width: outerWidth,
                height: outerHeight,
            },
            ifmStyle: {
                transform: `scale(${dpr})`
            },
        });

        setTimeout(() => {
            const ifm1 = findDOMNode(this.refs.ifm);
            console.log(ifm1, ifm1.style, ifm1.width);
            this.setState({
                ifmBorderStyle: {
                    width: (ifm1.clientWidth - 4) * dpr,
                    height: (ifm1.clientHeight - 4) * dpr,
                }
            })
        }, 100);
    }

    @autobind
    onOpenClick() {
        this.props.onOpenVideoPlayer(this.state.videoUrl);
    }

    render() {
        return (
            <SpeakMsgContainer
                {...this.props}
            >
                <div className='video-item-container' style={this.state.outerStyle}>
                    <div className="if-border" style={this.state.ifmBorderStyle}/>
                    <iframe ref='ifm' id='ifm' style={this.state.ifmStyle} frameBorder="0" src={this.state.videoUrl.replace(/(http:\/\/)/,"https://")} allowFullScreen={true} ></iframe>

                    {
                        this.state.isAndroid &&
                            <div className="play-video on-log"
                                onClick={this.onOpenClick}
                                data-log-region="speak-list"
                                data-log-pos="video-play-btn"
                                >
                            </div>
                    }
                </div>
            </SpeakMsgContainer>
        );
    }
}

VideoItem.propTypes = {
    onOpenVideoPlayer: PropTypes.func,
};

export default VideoItem;
