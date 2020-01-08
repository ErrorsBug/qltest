import React, { Component, PureComponent } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import Detect from "components/detect";
import ReactDOM from "react-dom";

import SpeakMsgContainer from "./speak-msg-container";

@autobind
class VideoMp4Item extends Component {
    state = {
        videoUrl: ""
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.content != this.props.content ||
            nextProps.likesNum != this.props.likesNum ||
            this.state !== nextState
        );
    }

    componentDidMount() {}

    onOpenClick() {
        this.setState({
            openClickDialog: true
        })
    }

    render() {
        return (
            <SpeakMsgContainer {...this.props}>
                <div className="video-mp4-item-container">
                    {Detect.os.android ? (
                        <div
                            className="video-poster"
                            style={{
                                backgroundImage: `url(${
                                    this.props.topicVideoHeadImage
                                })`
                            }}
                        >
                            <img src={require("./img/icon-video-play.svg")} />
                        </div>
                    ) : (
                        <video
                            controls
                            preload="metadata"
                            src={this.props.content}
                            poster={this.props.topicVideoHeadImage}
                        />
                    )}
                    {Detect.os.android && (
                        <div
                            className="play-video on-log"
                            onClick={this.onOpenClick}
                            data-log-region="speak-list"
                            data-log-pos="video-play-btn"
                        />
                    )}
                </div>
                {this.state.openClickDialog
                    ? ReactDOM.createPortal(
                          <div
                              className="play-video-mask_FDGDFD"
                              onClick={() => {
                                  this.setState({
                                      openClickDialog: false
                                  });
                              }}
                          >
                              <div
                                  className="video-wrap"
                                  onClick={e => e.stopPropagation()}
                              >
                                  <video
                                        id="video-mp4-player"
                                      controls
                                      preload="metadata"
                                      src={this.props.content}
                                      poster={this.props.topicVideoHeadImage}
                                      x5-video-player-type="h5"
                                      x5-video-player-fullscreen='true'
                                      style={{
                                          objectFit: 'fill'
                                      }}
                                      autoPlay="autoplay"
                                  />
                              </div>
                          </div>,
                          document.querySelector(".portal-low")
                      )
                    : null}
            </SpeakMsgContainer>
        );
    }
}

VideoMp4Item.propTypes = {
    onOpenVideoPlayer: PropTypes.func
};

export default VideoMp4Item;
