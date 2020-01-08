/**
 * Created by dylanssg on 2017/6/15.
 */
import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { AudioPlayer } from 'components/audio-player';
import XiumiEditorH5 from "components/xiumi-editor-h5";

import ScrollToLoad from 'components/scrollToLoad';
import AudioController from '../components/audio-controller';
import ActionSheet from '../components/action-sheet';
import Recorder from '../components/recorder';
import { share } from 'components/wx-utils';
import { htmlTransferGlobal, formatDate } from 'components/util'
import { isQlchat } from 'components/envi';
import VideoController from '../components/video-controller';
import CollectVisible from 'components/collect-visible';
import { userBindKaiFang } from "../../../../actions/common";
import { getUrlParams } from "components/url-utils";

import {
	getStsAuth,
	uploadRec
} from '../../../actions/common';

import {
	getAuth,
	getTopicInfo
} from '../../../actions/topic';

import {
	getAnsweredList,
	like,
	essence,
	getMyAnswer,
	deleteAnswer,
	deleteComment,
	addComment,
	fetchGetQr,
	getAnswerAuth,
	getPeriodByChannel,
	fetchCampAffairStatus
} from '../../../actions/homework'

import {
	dangerHtml,
	locationTo
} from 'components/util';

@autobind
class HomeworkDetails extends Component{
	state = {
		commentType: '',
		commentInputVal: '',
		showAudioConcroller: false,
		playStatus: '',
		playSecond: 0,
		audioDuration: 0,
		currentAudioUrl: '',
		currentPage: 1,
		pageSize: 10,
		answeredList: [],
		noMore: false,
		disableScroll: false,
		showQr: false,
		qrUrl: "",
		campShare: null, // 训练营分享
		isJoinCamp: '',	// 是否已经参加训练营
		periodPo: '',	// 期数信息
		affairStatus: '',	 // 打卡状态
		topicInfo: {},	// 话题
	};
	data = {
		page: 1,
		currentCommentAnswerId: '',
		audioControllerList: [],
	};

	get channelId() {
		return this.props.location.query.channelId || this.props.homeworkInfo.channelId
	}

	get topicId () {
		return this.props.location.query.topicId || this.props.homeworkInfo.topicId
	}

	async componentDidMount(){
		this.getAnsweredList(1);
		if(this.props.power.allowMGLive){
			this.initStsInfo();
		}

		if(!this.props.power.allowMGLive){
			if(this.props.homeworkInfo.target === 'topic' && !await this.getAuth()){
				this.setState({
					showApplyBtn: true
				});
			}else{
				this.getMyAnswer();
			}
		}

		this.bindAppKaiFang();

		this.initTopicInfo()

		this.initReward()

		this.initSubscribeInfo();

		share({
			title: `${this.props.userInfo.name}分享了一份作业，小伙伴们快来围观！`,
			timelineTitle: `${this.props.homeworkInfo.userName}提交了一份作业，小伙伴们快来围观！`,
			desc: '点击即可参与',
			timelineDesc: '点击即可参与', // 分享到朋友圈单独定制
			imgUrl: this.props.userInfo.headImgUrl,
			shareUrl: location.href,
		});

	}

	async initTopicInfo() {
		if (this.topicId) {
			let res = await this.props.getTopicInfo(this.topicId)
			console.log(res);
			if(res.state.code === 0){
				this.setState({
					topicInfo: res?.data?.topicPo
				})
			}
		}
	}

	async initReward() {
		if(!this.props.homeworkInfo.channelId) {
			return
		}
		let res = await getPeriodByChannel(this.props.homeworkInfo.channelId)
		if(res.state.code == 0) {
			let isJoinCamp =  res.data.isJoinCamp
			let periodPo = res.data.periodPo || {}
			this.setState({
				isJoinCamp,
				periodPo
			})
		}

		let affairRes = await fetchCampAffairStatus({
			channelId: this.channelId,
			topicIdList: [this.topicId]
		})
		if(affairRes.state.code === 0) {
			this.setState({
				affairStatus: affairRes.data.status || ''
			})
		}

	}

	// oss上传
	initStsInfo() {
		this.props.getStsAuth();

		const script = document.createElement('script');
		script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
		document.body.appendChild(script);
	}
	async getAnsweredList(page){
		let result = await this.props.getAnsweredList({
			workId: this.props.location.query.id,
			page: {
				page,
				size: 10
			}
		});
		if(result.state.code === 0 && result.data.list){
			if(result.data.list.length){
				this.setState({
					answeredList: [
						...(page === 1 ? [] : this.state.answeredList),
						...result.data.list
					]
				})
			}
			if(result.data.list.length < 10){
				this.setState({
					noMore: true
				});
			}
			if(page === 1 && result.data.list.length === 0){
				this.setState({
					disableScroll: true
				});
			}
		}
	}
	async loadNext(next){
		await this.getAnsweredList(++this.data.page);
		next && next();
	}
	async getAuth(){
		const result = await this.props.getAnswerAuth(this.props.homeworkInfo.topicId);
		return result.data && result.data.flag;
	}

	async bindAppKaiFang(){
        const kfAppId = getUrlParams('kfAppId');
        const kfOpenId = getUrlParams('kfOpenId');
        console.log(kfAppId)
        console.log(kfOpenId)
        if(kfOpenId && kfAppId){
            await this.props.userBindKaiFang({
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            });
        }


	}

	async getMyAnswer(){
		let result = await this.props.getMyAnswer({
			homeworkId: this.props.location.query.id
		});

		if(result.state.code === 0){
			if(result.data.answer && result.data.answer.id){
				this.setState({
					myAnswer: result.data.answer
				});
				if(result.data.answer.periodId) {
					this.setState({
						campShare: localStorage.getItem('campShare')// 获取一下训练营
					})
				}
			}else{
				this.setState({
					showHandInBtn: true
				});
			}
		}
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
	teacherControllerHandle(data){
		this.refs['action-sheet'].show(data);
	}
	commentBtnHandle(id){
		this.setState({
			commentType: 'text'
		},() => {
			this.refs['comment-input'].focus();
			this.data.currentCommentAnswerId = id;
			setTimeout(() => {
				this.refs['comment-input'].scrollIntoView();
			},300);
		});
	}
	hideComment(e){
		this.refs.recorder.resetRec().then(() => {
			this.setState({
				commentType: '',
				commentInputVal: '',
			});
			this.data.currentCommentAnswerId = '';
		});

	}
	commentInputChangeHandle(e){
		this.setState({
			commentInputVal: e.target.value
		})
	}
	commentInputFocusHandle(e){
		this.setState({
			commentType: 'text'
		});
	}
	async like(id, liked){
		let result = await this.props.like({
			answerId: id,
			status: liked ? 'N' : 'Y'
		});
		if(result.state.code === 0){
			let answeredList = [...this.state.answeredList];
			answeredList.forEach((answer) => {
				if(answer.id === id){
					answer.liked = liked ? 'N' : 'Y';
					answer.upvoteCount = liked ? answer.upvoteCount - 1 : answer.upvoteCount + 1
				}
			});
			this.setState({
				answeredList
			});
		}
	}

	async essence (id, prime) {
		let result = await this.props.essence({
			answerId: id,
			prime: prime ? 'N' : 'Y',
			topicId: this.props.homeworkInfo.topicId,
			liveId: this.props.homeworkInfo.liveId
		});
		if(result.state.code === 0){
			let answeredList = [...this.state.answeredList];
			answeredList.forEach((answer) => {
				if(answer.id === id){
					answer.prime = prime ? 'N' : 'Y';
				}
			});
			this.setState({
				answeredList
			});
		}
	}

	async actionSheetDelete({id, commentId}){
		if(await window.confirmDialogPromise('您确定要删除吗？')){
			//有commentId就删点评
			if(commentId){
				let result = await this.props.deleteComment({
					id: commentId,
					liveId: this.props.homeworkInfo.liveId,
					topicId: this.props.homeworkInfo.topicId
				});
				if(result.state.code === 0){
					window.toast('删除成功');
					let answeredList = [...this.state.answeredList],
						index;
					answeredList.forEach((answer) => {
						if(answer.id === id){
							answer.reviewList.forEach((comment, i) => {
								if(comment.id === commentId){
									index = i
								}
							});
							answer.reviewList.splice(index, 1);
						}
					});
					this.setState({
						answeredList
					});
				}
			}else{
				let result = await this.props.deleteAnswer({
					id: id,
					liveId: this.props.homeworkInfo.liveId
				});
				if(result.state.code === 0){
					window.toast('删除成功');
					let answeredList = [...this.state.answeredList],
						index;
					answeredList.forEach((answer, i) => {
						if(answer.id === id) index = i
					});
					answeredList.splice(index, 1);
					this.setState({
						answeredList
					});
				}
			}

		}

	}
	onPCRecUploadSuccess(url,second){
		// console.log(url);
		// console.log(second);
		this.sendCommentHandle({
			audioUrl: url,
			duration: second
		});
	}
	onWXRecUploadSuccess(recServerId, second, recLocalId){
		this.sendCommentHandle({
			audioId: recServerId,
			duration: second
		});
	}
	async sendCommentHandle(audio){
		const isAudio = audio && audio.duration;
		if(!this.state.commentInputVal && !isAudio){
			window.toast('请输入内容');
			return false;
		}else if(!isAudio && this.state.commentInputVal.length > 1000){
			window.toast('点评内容不能超过1000字');
			return false;
		}
		let params = {
			topicId: this.props.homeworkInfo.topicId,
			answerId: this.data.currentCommentAnswerId,
			audioList: [],
			content: isAudio ? '' : this.state.commentInputVal,
			liveId: this.props.homeworkInfo.liveId,
			parentId: '',
			type: isAudio ? 'audio' : 'text'
		};
		if(isAudio){
			params.audioList.push(audio)
		}
		let result = await this.props.addComment(params);
		if(result.state.code === 0){
			window.toast('点评成功');

			const newComment = result.data.answerReview;
			let answeredList = [...this.state.answeredList];
			answeredList.forEach((answer) => {
				if(answer.id === newComment.answerId){
					if(!answer.reviewList) answer.reviewList = [];
					answer.reviewList.push({
						id: result.data.answerReview.id,
						userName: this.props.userInfo.name,
						content: newComment.content,
						audioUrl: newComment.audioUrl,
						second: newComment.second
					})
				}
			});
			this.setState({
				answeredList
			});

			this.hideComment();

		}
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

	initSubscribeInfo = () => {
		if(!this.props.power.allowMGLive) {
			if (/.*(recommend|subscribe\-period\-time).*/.test(sessionStorage.getItem('trace_page'))) {
				if(!this.props.subscribe.subscribe) {
					this.showQrCode("Y")
				}
			} else {
				if(this.props.subscribe.isBindThird && !this.props.subscribe.isFocusThree) {
					this.showQrCode("N")
				} else if (!this.props.subscribe.isBindThird && !this.props.subscribe.subscribe) {
					this.showQrCode("Y")
				}
			}
		}

	};

	showQrCode = async (showQl) => {

		const rqrUrl = await this.props.fetchGetQr(
			"homework",
			this.props.homeworkInfo.liveId,
			"",
			this.props.homeworkInfo.topicId,
			this.props.homeworkInfo.id,
			showQl
		)

		if(rqrUrl && rqrUrl.data && rqrUrl.data.qrUrl) {
			const flag = isQlchat();
			this.setState({
				qrUrl: rqrUrl.data.qrUrl,
				showQr: !flag 
			})
		}

	}

	hideQrCode = () => {
		this.setState({
			showQr: false
		})
	}

	closeQrHandel = (e) => {
		if(e.target.className == "unfollow-qrcode") {
			this.hideQrCode()
		}
	}

	deleteCommentHandle(data){
		if(this.props.power.allowMGLive || this.props.power.allowSpeak){
			this.refs['action-sheet'].show(data);
		}
	}
	// commentLongTap(data){
	// 	if(this.props.power.allowMGLive){
	// 		if(this.data.commentLongTapTimer) clearTimeout(this.data.commentLongTapTimer);
	// 		this.data.commentLongTapTimer = setTimeout(() => {
	// 			this.refs['action-sheet'].show(data);
	// 		},1000);
	// 	}
	// }
	removeCommentLongTap(){
		if(this.data.commentLongTapTimer) clearTimeout(this.data.commentLongTapTimer);
	}

	showOriginImg(url, imgList){
		let imgUrlList;
		imgUrlList = imgList.map((img) => {
			return img.url;
		});
		window.showImageViewer(url, imgUrlList);
	}

	parseDate(time){
		let date = new Date(time),
			year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			second = date.getSeconds();

		return `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day} ${hour > 9 ? hour : '0' + hour}:${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`
	}

    // 待加载视频列表
    lazyVideos = [];

    getChildContext () {
        return {
            lazyVideo: {
                push: this.pushVideoToLazyVideos,
                remove: this.removeVideoToLazyVideos,
            }
        }
	}
	
    pushVideoToLazyVideos (item) {
        if (!this.refs.detailsScroll) {
            this.lazyVideos.push(item);
            return;
        }

        if (!this.isVideoFetch(findDOMNode(this.refs.detailsScroll), item)) {
            this.lazyVideos.push(item);
        }
	}
	
    removeVideoToLazyVideos (id) {
		console.log(this.lazyVideos)
        this.lazyVideos = this.lazyVideos.filter(item => item.id != id);
	}
	
    @throttle(300)
    initLazyVideoLinstener() {
        if (!this.refs.detailsScroll) {
            return;
		}
		const target = findDOMNode(this.refs.detailsScroll)
        const st = target.scrollTop;
        const height = target.clientHeight;

        this.lazyVideos.forEach(item => {
            const pos = item.ref.parentNode.parentNode.parentNode.parentNode.offsetTop;
            if (pos < height + st) {
                item.init()
            }
        });
    }

    isVideoFetch(target, item) {
        const st = target.scrollTop;
        const height = target.clientHeight;
        const pos = item.ref.parentNode.parentNode.parentNode.parentNode.offsetTop;

        if (pos < height + st) {
            item.init()
            return true;
        } else {
            return false;
        }
	}
	
	scrollToDo () {
		this.initLazyVideoLinstener()
	}

	openCampDetails() {
		let { campId, homeworkId, createBy} = this.state.myAnswer
		locationTo(`/wechat/page/training-details?campId=${campId}&workId=${homeworkId}&by=${createBy}`)
		localStorage.setItem('campShare', 'Y')
	}

	render(){
		const {isJoinCamp, periodPo, topicInfo} = this.state
		return (
			<Page title="作业详情" className="homework-details">
				<ScrollToLoad
					ref="detailsScroll"
					loadNext={this.loadNext}
					noMore={this.state.noMore}
					disable={this.state.disableScroll}
                    scrollToDo={this.scrollToDo}
				>
					<div className="homework-details-container">

						<div className="homework-content">
							<div className={`avatar-wrap${this.props.isCampCourse? " camp-course" : "" }`} onClick={() => {if(!this.props.isCampCourse) {location.href = `/live/${this.props.homeworkInfo.liveId}.htm`} }}>
								<div className="avatar">
									<img src={`${this.props.homeworkInfo.liveLogo}?x-oss-process=image/resize,m_fill,h_130,w_130`} alt=""/>
								</div>
							</div>
							<div className="homework-title" dangerouslySetInnerHTML={dangerHtml(this.props.homeworkInfo.title)}></div>
							{ this.props.homeworkInfo.contentType === 'rich' ? (
								<div className="description">
									<XiumiEditorH5  content={ htmlTransferGlobal(this.props.homeworkInfo.content) } />
								</div>
							): (
								<div className="description" dangerouslySetInnerHTML={dangerHtml(this.props.homeworkInfo.content && this.props.homeworkInfo.content.replace(/\n/g,'<br/>'))}></div>
							) }

							{
								this.props.homeworkInfo.audioList && !!this.props.homeworkInfo.audioList.length &&
								this.props.homeworkInfo.audioList.map((audio, audioIndex) => {
									return (
										<div className="audio-box" key={audioIndex}>
											<AudioController
												ref={(audioController) => this.pushAudioControllerList(audioController)}
												currentAudioUrl={audio.audioUrl}
												second={audio.second}
												onPlay={this.audioOnPlay}
											    theme="green"
											    size="bigger"
											/>
										</div>
									)
								})
							}
							{
								!!this.props.homeworkInfo.topicId && !this.props.isCampCourse &&
								<div className="host">回顾课程：<span className="name" 
									onClick={() => {location.href = `/wechat/page/topic-intro?topicId=${this.props.homeworkInfo.topicId}`}}
									>《{this.props.homeworkInfo.topicName}》</span></div>
							}
						</div>
						{
							!(this.props.power.allowMGLive || this.props.power.allowSpeak ) &&
							<div className="student-panel">
								{
									this.state.showHandInBtn &&
									<CollectVisible>
									<div className="hand-in-btn on-log on-visible"
										data-log-region="hand_in"
										onClick={() => (location.href = `/wechat/page/homework/hand-in?id=${this.props.location.query.id}&topicId=${this.props.homeworkInfo.topicId}&liveId=${this.props.homeworkInfo.liveId}`)}>交作业</div>
									</CollectVisible>
								}
								{
									this.state.showApplyBtn &&
									<div className="hand-in-btn" onClick={() => (location.href = `/topic/${this.props.homeworkInfo.topicId}.htm`)}>报名学习后再来提交作业</div>
								}
								{
									this.state.myAnswer &&
									(() => {
										return (
											<div className="homework-item my-answer">
												<div className="avatar">
													<img src={`${this.props.userInfo.headImgUrl}?x-oss-process=image/resize,m_fill,h_70,w_70`} alt=""/>
												</div>
												<div className="main-body">
													<div className="name">{this.state.myAnswer.prime === 'Y' && <span className="item-hot">精华</span>}{this.props.userInfo.name}</div>
													<div className="date">{this.parseDate(this.state.myAnswer.createTime)}</div>
													{
														!!this.state.myAnswer.content &&
														<div className="speak-content" dangerouslySetInnerHTML={dangerHtml(this.state.myAnswer.content && this.state.myAnswer.content.replace(/\n/g,'<br/>'))}></div>
													}
													{
														!!this.state.myAnswer.videoList && !!this.state.myAnswer.videoList.length && this.state.myAnswer.videoList[0].status === 'show' && (
															<div className="video-list">
																{
																	this.state.myAnswer.videoList.map((video, index) => (
																		<div 
																			key={`video-wrapper-${index}`}
																			className="video-wrapper">
																			<VideoController
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
														this.state.myAnswer.audioList && this.state.myAnswer.audioList.map((audio, audioIndex) => {
															if(!audio.audioUrl) return null;
															return (
																<div className="audio-wrap" key={audioIndex}>
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
														// this.state.myAnswer.imageList && !!this.state.myAnswer.imageList.length &&
														// <div className={`img-list${this.state.myAnswer.imageList.length === 4 ? ' sp' : ''}`}>
														// 	{
														// 		this.state.myAnswer.imageList.map((img, imgIndex) => {
														// 			return (
														// 				this.state.myAnswer.imageList.length === 1 ?
														// 					<div className="img-item sp" key={imgIndex} ref={`imgWrapper${imgIndex}`}>
														// 						<img ref={`my-img${imgIndex}`} src={img.url + '?x-oss-process=image/resize,s_425'} onLoad={this.singleImgOnLoadHandle.bind(this, `my-img${imgIndex}`, `imgWrapper${imgIndex}`)} onClick={this.showOriginImg.bind(this, img.url, this.state.myAnswer.imageList)} />
														// 					</div>
														// 					:
														// 					<div className="img-item" key={imgIndex} style={{backgroundImage: `url(${img.url.replace(/\@.*/,'')}?x-oss-process=image/resize,s_170)`}} onClick={this.showOriginImg.bind(this, img.url, this.state.myAnswer.imageList)}></div>
														// 			)
														// 		})
														// 	}
														// </div>
													}
													{
														this.state.myAnswer.imageList && !!this.state.myAnswer.imageList.length &&
														(
															this.state.myAnswer.imageList.length === 1 ?
															this.state.myAnswer.imageList.map((img, imgIndex) => {
																return <div className="img-sigle" key={imgIndex} ref={`imgWrapper${imgIndex}`}>
																<img ref={`img${imgIndex}`} src={img.url + '?x-oss-process=image/resize,s_425'} onLoad={this.singleImgOnLoadHandle.bind(this, `img${imgIndex}`, `imgWrapper${imgIndex}`)} onClick={this.showOriginImg.bind(this, img.url, this.state.myAnswer.imageList)} />
															</div>
															})
															:
															<div className={`img-list${this.state.myAnswer.imageList.length === 4 ? ' sp' : ''}`}>
															{
																this.state.myAnswer.imageList.map((img, imgIndex) => {
																	return (
																		this.state.myAnswer.imageList.length === 1 ?
																			null:
																			<div className="img-item" key={imgIndex} style={{backgroundImage: `url(${img.url.replace(/\@.*/,'')}?x-oss-process=image/resize,s_170)`}} onClick={this.showOriginImg.bind(this, img.url, this.state.myAnswer.imageList)}></div>
																	)
																})
															}
															</div>
														)
													}
													{
														!!this.state.myAnswer.reviewList && !!this.state.myAnswer.reviewList.length &&
														<div className="teacher-comment-wrap">
															{
																this.state.myAnswer.reviewList.map((comment,commentIndex) => {
																	return (
																		<div className="teacher-comment" key={commentIndex}>
																			{!!comment.content && <span className="teacher-name">{comment.userName}：</span>}
																			{!!comment.content && comment.content}
																			{
																				comment.audioUrl &&
																				<div className="comment-audio-wrap">
																					<span className="teacher-name">{comment.userName}：</span>
																					<AudioController
																						ref={(audioController) => this.pushAudioControllerList(audioController)}
																						currentAudioUrl={comment.audioUrl}
																						second={comment.second}
																						onPlay={this.audioOnPlay}
																						theme="white"
																						size="smaller"
																					/>
																				</div>
																			}
																		</div>
																	)
																})
															}
														</div>
													}
													<div className="edit-btn" 
														onClick={() => (location.href = `/wechat/page/homework/hand-in?id=${this.props.homeworkInfo.id}&answerId=${this.state.myAnswer.id}&topicId=${this.props.homeworkInfo.topicId}&liveId=${this.props.homeworkInfo.liveId}`)}>
													</div>
													{
														/* 如果有训练营 需要展示分享按钮 */
														this.state.myAnswer.periodId &&
														<div className="camp-share-btn">
															{
																!this.state.campShare &&
																<div className="share-tip">分享作业收获点赞</div>
															}
															<CollectVisible>
																<div className="share-btn on-log on-visible"
																	data-log-region="share_homework"
																	onClick={this.openCampDetails}></div>	
															</CollectVisible>
														</div>
													}
													<div className={`like-btn`}>{this.state.myAnswer.upvoteCount}</div>
												</div>
											</div>
										)
									})()
								}
							</div>
						}
						<div className="submitted-count">
							<div className="container">
								<div className="content">
									{
										this.props.homeworkInfo.answerCount > 0?
											`${this.props.homeworkInfo.answerCount}人提交`
											:
											'暂无提交'
									}
								</div>
							</div>
						</div>
						<ul className="homework-list" onContextMenu={(e) => e.preventDefault()}>

							{
								this.state.answeredList.map((answer, index) => {
									let date = new Date(answer.createTime);
									return (
										<li className="homework-item" key={`homework-item-${index}`}>
											<div className="avatar">
												<img src={`${answer.userHeadImg}?x-oss-process=image/resize,m_fill,h_70,w_70`} alt=""/>
											</div>
											<div className="main-body">
												<div className="name">{answer.prime === 'Y' && <span className="item-hot">精华</span>}{answer.userName}</div>
												<div className="date">{this.parseDate(answer.createTime)}</div>
												{
													!!answer.content &&
													<div className="speak-content" dangerouslySetInnerHTML={dangerHtml(answer.content && answer.content.replace(/\n/g,'<br/>'))}></div>
												}
												{
													!!answer.videoList && !!answer.videoList.length && (
														<div className="video-list">
															{
																answer.videoList.map(video => (
																	<div className="video-wrapper">
																		<VideoController
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
															return <div className="img-sigle" key={imgIndex} ref={`imgWrapperAswer-${index}-${imgIndex}`}>
															<img ref={`imgAswer-${index}-${imgIndex}`} src={img.url + '?x-oss-process=image/resize,s_425'} onLoad={this.singleImgOnLoadHandle.bind(this, `imgAswer-${index}-${imgIndex}`, `imgWrapperAswer-${index}-${imgIndex}`)} onClick={this.showOriginImg.bind(this, img.url, answer.imageList)} />
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
												{
													(this.props.power.allowMGLive || this.props.power.allowSpeak )&&
													<div className="teacher-panel">
														<div className="comment-btn" onClick={this.commentBtnHandle.bind(this, answer.id)}>点评</div>
														<div className={`essence-btn${answer.prime === 'Y' ? ' ed' : ''}`} onClick={this.essence.bind(this, answer.id, answer.prime === 'Y')}>{answer.prime === 'Y' ? '取消精华' : '精华'}</div>
														<div className={`teacher-like-btn${answer.liked === 'Y' ? ' ed' : ''}`} onClick={this.like.bind(this, answer.id, answer.liked === 'Y')}>{answer.upvoteCount}</div>
													</div>
												}
												{
													!!answer.reviewList && !!answer.reviewList.length &&
													<div className="teacher-comment-wrap">
														{
															answer.reviewList.map((comment, commentIndex) => {
																return (
																	<div className="teacher-comment" key={commentIndex}>
																		{!!comment.content && <span className="teacher-name">{comment.userName}：</span>}
																		{
																			!comment.audioUrl ? <span className="teacher-content">{!!comment.content && comment.content}</span> : null
																		}
																		{
																			comment.audioUrl &&
																			<div className={`comment-audio-wrap${!!comment.content ? ' with-margin' : ''}`}>
																				<span className="teacher-name">{comment.userName}：</span>
																				<AudioController
																					ref={(audioController) => this.pushAudioControllerList(audioController)}
																					currentAudioUrl={comment.audioUrl}
																					second={comment.second}
																					onPlay={this.audioOnPlay}
																					theme="white"
																					size="smaller"
																				/>
																			</div>
																		}
																		<div className="reply-controller-wrap" onClick={this.deleteCommentHandle.bind(this, {id: answer.id, commentId: comment.id})}>
																			<div className="reply-controller"></div>
																		</div>
																	</div>
																)
															})
														}
													</div>

												}
												{/*<div className="edit-btn">编辑</div>*/}
												{
													this.props.power.allowMGLive ?
														<div className="teacher-controller" onClick={this.teacherControllerHandle.bind(this, {id: answer.id})}></div>
														:
														<div className={`like-btn${answer.liked === 'Y' ? ' ed' : ''}`} onClick={this.like.bind(this, answer.id, answer.liked === 'Y')}>{answer.upvoteCount}</div>
												}
											</div>
										</li>
									)
								})
							}

						</ul>

					</div>
				</ScrollToLoad>
				
				{
					this.props.isCamp &&
					<div className="footer">
						{
							// 如果是开启打开的期数,底部按钮文案改为: 点我去打卡
							isJoinCamp === 'Y' &&
							(periodPo.needSignIn === 'Y' || periodPo.canSupplement === 'Y') &&
							(this.state.affairStatus === 'Y' || this.state.affairStatus === 'S') ?
								<>
								{
									periodPo.rewardType === 'refund' ?
										<div className="btn-return-intro" onClick={() => locationTo(`/wechat/page/training-learn?channelId=${this.props.homeworkInfo.channelId}&afterExerciseShow=guide${topicInfo.startTime ? '&targetDate=' + formatDate(topicInfo.startTime, 'yyyy-MM-dd') : ''}`)}>点我去打卡</div>
										:
										<div className="btn-return-intro" onClick={() => locationTo(`/wechat/page/training-learn?channelId=${this.props.homeworkInfo.channelId}&afterExerciseShow=card${topicInfo.startTime ? '&targetDate=' + formatDate(topicInfo.startTime, 'yyyy-MM-dd') : ''}`)}>点我去打卡</div>
								}
								</>
								:
								<div className="btn-return-intro" onClick={() => locationTo(`/wechat/page/training-learn?channelId=${this.props.homeworkInfo.channelId}`)}>返回训练营</div>
						}
					</div>
				}
				
				<div className={`comment-wrapper ${this.state.commentType}`} onClick={this.hideComment}>
					<div className="comment-container" onClick={(e) => e.stopPropagation()}>
						<div className={`comment-box`}>
							<div className="speak-btn" onClick={() => this.setState({commentType: 'audio'})}></div>
							<div className="input-wrap">
								<input type="text" ref="comment-input" placeholder="输入评论内容" value={this.state.commentInputVal} onFocus={this.commentInputFocusHandle} onChange={this.commentInputChangeHandle}/>
							</div>
							<div className="send-btn" onClick={this.sendCommentHandle}>发送</div>
						</div>
						<div className={`recorder-wrapper`}>
							<Recorder
								ref="recorder"
								className="recorder-container"
								uploadRec={this.props.uploadRec}
								onPCRecUploadSuccess={this.onPCRecUploadSuccess}
								onWXRecUploadSuccess={this.onWXRecUploadSuccess}
							/>
						</div>
					</div>
				</div>

				{
					this.state.showQr ?
						<div className="unfollow-qrcode">
							<div  className="container">
								<div className="code">
									<span
										className='close-button'
										onClick={()=>{this.setState({showQr:false})}}
									></span>
									<img src={this.state.qrUrl}
										className={`on-visible`}
										data-log-name="课后作业领取查看二维码"
										data-log-region="visible-homework-get"
										data-log-pos="homework" />
								</div>
								<div className="tip">
									<p>长按二维码领取并查看作业<br />完成即可获取专属成就卡</p>
								</div>
							</div>
						</div>  : null
				}


				<ActionSheet
					ref="action-sheet"
					sheetList={[{
						name: '删除',
						callback: this.actionSheetDelete
					}]}
				/>
			</Page>
		)
	}
}
HomeworkDetails.childContextTypes = {
	lazyVideo: PropTypes.object
};

module.exports = connect((state) => {
	return {
		userInfo: state.common.userInfo,
		homeworkInfo: state.homework.info,
		power: state.homework.power,

		subscribe: state.homework.subscribe,

		isCampCourse: state.homework.info.isCampCourse === 'Y',
		isCamp: state.homework.info.isCamp === 'Y',
	}
}, {
	getAuth,
	getStsAuth,
	uploadRec,
	getAnsweredList,
	like,
	essence,
	getMyAnswer,
	deleteAnswer,
	deleteComment,
	addComment,
	fetchGetQr,
	getAnswerAuth,
	userBindKaiFang,
	getTopicInfo
})(HomeworkDetails);
