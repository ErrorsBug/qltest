import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

class VideoPlayer extends PureComponent {
    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <div className='video-player-container' >
                <aside className='video-player-bg' onClick={this.props.onCloseVideoPlayer}></aside>
                <main className='video-content'>
                    <iframe 
                        frameBorder="0" 
                        src={this.props.videoUrl} 
                        allowFullScreen={true} >
                    </iframe>
                </main>
            </div>
        );
    }
}

VideoPlayer.propTypes = {
    show: PropTypes.bool,
    // 视频的播放链接
    videoUrl: PropTypes.string.isRequired,
    // 关闭弹层
    onCloseVideoPlayer: PropTypes.func,
};

export default VideoPlayer;