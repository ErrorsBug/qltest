import React, { Component, PureComponent } from 'react';
import { autobind, throttle } from 'core-decorators';
import Detect from 'components/detect';
import PropTypes from 'prop-types';
import CanvasVideoPlayer from 'components/canvas-video-player';
import { request } from 'common_actions/common';


@autobind
class VideoController extends PureComponent {

	state = {
		videoUrl: '',
		videoDuration: ''
	}

	isLoading = false
	
	async init () {
        try {
			console.log('初始化')
			if (this.isLoading) return
			this.isLoading = true
			const result = await request({
				url: '/api/wechat/homework/getVideoPlayInfo',
				method: 'POST',
				body: {
					resourceId: this.props.videoId
				}
			})
			if (result.state.code == 0) {
				const videoData = result.data.video
				const video = videoData && videoData.length && videoData.find(item => item.definition === 'LD')
				if (video) {
					this.setState({
						videoUrl: video.playUrl,
						videoDuration: video.duration
					}, () => {
						if (this.canvasVideoPlayer) {

							this.canvasVideoPlayer.on('requestfullscreen', () => {
								// ios的浏览器和mac的safari浏览器，元素就算fixed了也会受最外层祖元素的overflow:hidden影响
								if(Detect.os.ios || Detect.browser.safari){
									const appWrap = document.querySelector('#app');
									if(appWrap){
										appWrap.style['overflow-x'] = 'visible';
									}
								}
								if (Detect.os.android) {
									this.setState({
										isfullScreen: true
									})
								}
							});
				
							this.canvasVideoPlayer.on('exitfullscreen', () => {
								// ios的浏览器和mac的safari浏览器，元素就算fixed了也会受最外层祖元素的overflow:hidden影响
								if(Detect.os.ios || Detect.browser.safari){
									const appWrap = document.querySelector('#app');
									if(appWrap){
										appWrap.style['overflow-x'] = 'hidden';
									}
								}
								if (Detect.os.android) {
									this.setState({
										isfullScreen: false
									})
								}
							});
				
							this.canvasVideoPlayer.on('play', _ => this.props.onPlay && this.props.onPlay(this))
						}
					})
				}
			}
			this.context.lazyVideo.remove(this.props.videoId);
			this.isLoading = false
        } catch (error) {
            console.error(error);
		}
	}
	
    componentDidMount() {
		console.log(`videoId: ${this.props.videoId}`)
		this.context.lazyVideo.push({
			id: this.props.videoId,
			ref: this.refs[this.props.videoId],
			init: () => {
				this.init()
			}
		});
    }

    componentWillUnmount() {
        this.context.lazyVideo.remove(this.props.videoId);
    }

    render() {
        return (
			<div 
				ref={this.props.videoId}
				className={`video-controller-player${this.state.isfullScreen ? ' video-full' : ''}`}
				>
                <CanvasVideoPlayer className="video-box" poster={this.props.poster} hidePlaybackRate={true} duration={this.props.duration} ref={ref => this.canvasVideoPlayer = ref} src={this.state.videoUrl} />
            </div>
        )
    };
}

VideoController.contextTypes = {
	lazyVideo: PropTypes.object,
};

export default VideoController

