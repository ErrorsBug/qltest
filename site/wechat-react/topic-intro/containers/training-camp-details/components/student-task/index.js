import React, { Component } from 'react';
import errorCatch from 'components/error-boundary/index';
import { autobind } from 'core-decorators';
import AudioController from '../audio-controller';
import Picture from 'ql-react-picture';
import VideoController from '../../../training/components/video-controller';
import {
    formatDate,
	dangerHtml
} from 'components/util';

@errorCatch
@autobind
class StudentTask extends Component {
    
	data = {
		audioControllerList: [],
        videoControllerList: []
	};

    state = {
        isFabulous: false
    }
    
	singleImgOnLoadHandle(ref, wrapperRef){
		let img = this.refs[ref],
			imgWrap = this.refs[wrapperRef];
		if(img.height > img.width){
            imgWrap.style.height = 300 + 'px';
            img.style.maxHeight = '100%';
		}else{
            imgWrap.style.width = 300 + 'px';
            img.style.maxWidth = '100%';
		}

    }
    
	showOriginImg(url, imgList){
		let imgUrlList;
		imgUrlList = imgList.map((img) => {
			return img.url;
		});
		window.showImageViewer(url, imgUrlList);
    }
    
	pushAudioControllerList(audioController){
		if(audioController && this.data.audioControllerList.indexOf(audioController) < 0){
			this.data.audioControllerList.push(audioController)
		}
    }
    
	audioOnPlay(target){
		this.data.audioControllerList.forEach((audioController) => {
			if(audioController !== target && audioController.state.playStatus === 'play'){
				audioController.pauseAudio();
			}
		});
    }

    pushVideoControllerList (videoController) {
		if(videoController && this.data.videoControllerList.indexOf(videoController) < 0){
			this.data.videoControllerList.push(videoController)
		}
    }
    
	videoOnPlay(target){
		this.data.videoControllerList.forEach((videoController) => {
			if(videoController !== target && videoController.canvasVideoPlayer.state.isPlaying){
				videoController.canvasVideoPlayer.pause();
			}
		});
		this.data.audioControllerList.forEach((audioController) => {
			if(audioController.state.playStatus === 'play'){
				audioController.pauseAudio();
			}
		});
    }

	render(){
        return (
            <div className="student-task-list">
                {
                    this.props.data.map((answer, index) => (
                        <div 
                            key={`student-task-item-${index}`} 
                            className="student-task-item">

                            <div className="item-user-info">
                                <div className="user-poster">
                                    <Picture src={`${answer.userHeadImg}?x-oss-process=image/resize,m_fill,h_60,w_60`} alt=""/>
                                </div>
                                <div className="user-info">
                                    <p className="user-name">{answer.prime === 'Y' && <span className="item-hot">精华</span>}{answer.userName}</p>
                                    <p className="user-class">{answer.periodName}</p>
                                </div>
                            </div>

                            <div className="item-content">
                                {
                                    !!answer.content && <TextContent text={answer.content} />
                                }
                                {
                                    !!answer.videoList && !!answer.videoList.length && (
                                        <div className="video-list">
                                            {
                                                answer.videoList.map((video, index) => (
                                                    <div
                                                        key={`video-wrapper_${index}`} 
                                                        className="video-wrapper">
                                                        <VideoController
                                                            ref={(videoController) => this.pushVideoControllerList(videoController)}
                                                            onPlay={this.videoOnPlay}
                                                            poster={video.poster || ''}
                                                            duration={video.second || 0}
                                                            videoId={video.resourceId || ''} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                                {
                                    answer.audioList && answer.audioList.map((audio, i) => {
                                        if(!audio.audioUrl) return null;
                                        return (
                                            <div className="audio-wrap" key={i}>
                                                <AudioController
                                                    ref={(audioController) => this.pushAudioControllerList(audioController)}
                                                    currentAudioUrl={audio.audioUrl}
                                                    second={audio.second}
                                                    onPlay={this.audioOnPlay}
                                                />
                                            </div>
                                        )
                                    })
                                }
                                {
                                    answer.imageList && !!answer.imageList.length &&
                                    (
                                        answer.imageList.length === 1 ?
                                        answer.imageList.map((img, imgIndex) => {
                                            return <div className="img-sigle" key={imgIndex} ref={`imgWrapper-${index}-${imgIndex}`}>
                                            <img ref={`img-${index}-${imgIndex}`} src={img.url + '?x-oss-process=image/resize,s_425'} onLoad={this.singleImgOnLoadHandle.bind(this, `img-${index}-${imgIndex}`, `imgWrapper-${index}-${imgIndex}`)} onClick={this.showOriginImg.bind(this, img.url, answer.imageList)} />
                                        </div>
                                        })
                                        :
                                        <div className={`img-list${answer.imageList.length === 4 ? ' sp' : ''}`}>
                                        {
                                            answer.imageList.map((img, imgIndex) => {
                                                return (
                                                    answer.imageList.length === 1 ?
                                                        null:
                                                        <div className="img-item" key={imgIndex} style={{backgroundImage: `url(${img.url.replace(/\@.*/,'')}?x-oss-process=image/resize,s_170)`}} onClick={this.showOriginImg.bind(this, img.url, answer.imageList)}></div>
                                                )
                                            })
                                        }
                                        </div>
                                    )
                                }

                            </div>

                            <p className="task-ascription">{answer.homeworkTitle}</p>

                            <div className="item-footer">
                                <p className="time-str">{formatDate(answer.createTime, 'yyyy-MM-dd hh:mm')}</p>
                                <div 
                                    className={`fabulous-btn ${answer.liked === 'Y' ? 'choose' : ''}`}
                                    onClick={ () => { this.props.toggleFabulous(answer, index) }}
                                    >{answer.upvoteCount}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
}

@errorCatch
@autobind
class TextContent extends Component {
    state = {
        isHandle: false,
        isShrink: false,
        isOpen: false,
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.text !== nextProps.text) {
            this.setState({
                isHandle: false,
                isShrink: false,
                isOpen: false,
            })
        }
    }

    ellipsis (dom, type) {
        if (type === 'content') {
            this.contentDom = dom
        }
        if (type === 'box') {
            this.boxDom = dom
        }

        if (this.boxDom && this.contentDom && !this.state.isHandle) {
            if (this.contentDom.offsetHeight > this.boxDom.offsetHeight) {
                this.setState({
                    isShrink: this.contentDom.offsetHeight > this.boxDom.offsetHeight,
                    isHandle: true
                })
            } else {
                this.setState({
                    isHandle: true
                })
            }
        }
    }

    toggleOpen () {
        const isOpen = !this.state.isOpen
        this.setState({
            isOpen
        })
    }

    render () {
        const { text } = this.props
        const {
            isHandle,
            isShrink,
            isOpen
        } = this.state
        return (
            <div className="speak-content-box">
                <div 
                    className={`speak-content ${isHandle ? (isShrink ? (isOpen ? '' : 'ellipsis') : '') : 'normal'}`} 
                    ref={ dom => this.ellipsis(dom, 'box') }>
                    <div ref={ dom => this.ellipsis(dom, 'content') } dangerouslySetInnerHTML={dangerHtml(text.replace(/\n/g,'<br/>'))}></div>
                </div>  
                {
                    isShrink && (
                        isOpen ? <span className="shrink" onClick={this.toggleOpen}>收起</span> : <span className="shrink" onClick={this.toggleOpen}>展开</span>
                    )
                }
            </div>
        )
    }
}

export default StudentTask;