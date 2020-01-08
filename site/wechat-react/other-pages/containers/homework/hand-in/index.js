/**
 * Created by dylanssg on 2017/6/13.
 */
import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import { htmlTransferGlobal, locationTo } from 'components/util'

import {
	getStsAuth,
	uploadRec,
	uploadImage,
	uploadVideo,
	dataURLtoBlob
} from '../../../actions/common';
import {
	saveAnswer,
	getMyAnswer
} from '../../../actions/homework'
import ActionSheet from '../components/action-sheet';
import Recorder from '../components/recorder';
import AudioController from '../components/audio-controller';
import VideoController from '../components/video-controller';
import XiumiEditorH5 from "components/xiumi-editor-h5";

import Detect from 'components/detect'
import { request } from 'common_actions/common';

@autobind
class HandIn extends Component {
	state = {
		isWechat: false,
		isWechatUpload: false,
		content: '',
		contentCount: 0,
		showRecorder: false,
		showShot: false,
		showAudioController: false,
		currPlayIndex: -1,
		audioList: [],
		videoList: [],
		imgsList: [],
		imgIdList: [],
		imgServerIdList: [],
		videoServerId: '',
		videoId: '',
		videoLocalUrl: '',
		videoPosterImg: '',
		videoStatus: '',
		videoUploadPercent: 0,

		homework: undefined,
	};
	data = {
		tempLocalIdList: [],
		imgServerIdList: [],
	};

	componentDidMount() {
		if (Detect && Detect.os.weixin) {
			this.setState({
				isWechat: true
			})
		}
		this.initHomework();
		this.initStsInfo();
		if (this.props.location.query.answerId) {
			this.initAnswerData();
		}
	}

	initHomework() {
		request.post({
			url: '/api/wechat/transfer/h5/homework/get',
			body: {
				id: this.props.location.query.id
			}
		}).then(res => {
			this.setState({
				homework: res.data
			})
		}).catch(err => {
			console.error(err)
		})
	}

	// oss上传
	initStsInfo() {
		this.props.getStsAuth();

		// const script = document.createElement('script');
		// script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
		// document.body.appendChild(script);
		// 上传需要使用的oss sdk
		const scriptSrc = [
			'//gosspublic.alicdn.com/aliyun-oss-sdk.min.js',
			'//static.qianliaowang.com/video-admin/aliyun-sdk.min.js',

			'//static.qianliaowang.com/video-admin/vod-sdk-upload-1.0.6.min.js',
		];

		scriptSrc.forEach((val, index) => {
			const script = document.createElement('script')
			script.src = val
			document.body.appendChild(script)
		})
	}

	async initAnswerData() {
		let result = await this.props.getMyAnswer({
			homeworkId: this.props.location.query.id
		});
		if (result.state.code === 0) {
			if (result.data.answer && result.data.answer.id) {
				let answerData = result.data.answer;
				let imgsList = answerData.imageList && answerData.imageList.map((img) => {
					return img.url
				});
				const video = answerData.videoList && answerData.videoList.length && answerData.videoList[0]
				this.setState({
					imgsList: imgsList || [],
					content: answerData.content || '',
					contentCount: answerData.content && answerData.content.length || 0,
					audioList: answerData.audioList || [],
					videoStatus: video && video.status,
					videoId: video && video.resourceId,
					videoDuration: video && video.second
				});
			}
		}
	}

	textareaHandle(e) {
		this.setState({
			content: e.target.value,
			contentCount: e.target.value.length
		});
	}

	addImagePc = async (e) => {
		let task = [];
		if (e.target.files.length > 5) {
			window.toast('只能同时上传5张图片');
			this.refs.imgUploadInput.value = '';
			return false;
		}
		Array.prototype.forEach.call(e.target.files, (file, index) => {
			if (this.state.imgsList.length + index + 1 > 9) {
				return false;
			}
			task.push(this.props.uploadImage(file));
		});
		let results = await Promise.all(task);
		if (results.length) {
			let imgsList = [...this.state.imgsList];
			results.forEach((item) => {
				if (item) imgsList.push(item);
			});
			this.setState({
				imgsList
			});
		}
	};
	checkImgNum(e) {
		if (this.state.imgsList.length >= 9 || this.state.imgIdList.length >= 9) {
			window.toast('最多只能上传9张图片');
			e.preventDefault();
		}
	}


	videoUploadCancel() {
		this.refs.shotInput.value = '';
		this.refs.albumInput.value = '';
		this.setState({
			videoStatus: 'cancel',
			videoUploadPercent: 0,
			videoPosterImg: '',
			videoLocalUrl: '',
		})
	}

	deleteVideo() {
		this.setState({
			videoId: '',
			videoLocalUrl: '',
			videoPosterImg: '',
			videoDuration: 0,
			videoStatus: ''
		})
	}

	addVideo = async (e) => {
		const file = e.target.files[0]
		if (file.size > 209715200) {
			this.setState({
				showShot: false,
				showVideoSize: true
			})
			this.refs.shotInput.value = '';
			this.refs.albumInput.value = '';
			return false;
		}
		if (e.target.files.length > 1) {
			window.toast('只能上传一个视频');
			this.refs.shotInput.value = '';
			this.refs.albumInput.value = '';
			return false;
		}

		const url = URL.createObjectURL(file);

		await this.props.uploadVideo(file, this.props.location.query.liveId, '', {
			startUpload: () => {
				this.setState({
					videoStatus: 'uploading'
				})
			},
			onProgress: (p) => {
				this.setState({
					videoUploadPercent: Math.floor(p)
				})
			},
			interruptUpload: () => {
				return this.state.videoStatus === 'cancel'
			},
			finish: (data, duration) => {
				this.setState({
					videoId: data.videoId,
					videoLocalUrl: url,
					videoDuration: duration,
					videoStatus: 'success'
				})
			},
			onError: () => {
				this.refs.shotInput.value = '';
				this.refs.albumInput.value = '';
				this.setState({
					videoStatus: '',
					videoUploadPercent: 0,
					showVideoErr: true
				})
			}
		})

		let canvas = document.createElement('canvas');
		let video = document.createElement("VIDEO")
		video.src = url;
		video.volume = 0;

		//  先播放 700ms， 确保触发 onloadedmetadata || onloadedmetadata;
		video.play();

		let videoPosterImg = ''
		await new Promise((resolve, reject) => {
			video.oncanplay = () => {
				this.videoWidth = video.videoWidth;
				this.videoHeight = video.videoHeight;
				canvas.width = this.videoWidth;
				canvas.height = this.videoHeight;
			}
			setTimeout(async () => {
				let ctx = canvas.getContext("2d");
				ctx.drawImage(video, 0, 0, this.videoWidth, this.videoHeight);
				videoPosterImg = canvas.toDataURL('image/jpeg', 0.5)
				video.pause();
				resolve();
			}, 300);
		});

		this.setState({
			showShot: false,
			videoPosterImg
		})
	};

	// WX添加新图片
	addImageWx = (event) => {
		if (this.state.imgIdList.length >= 9) {
			window.toast('最多只能上传9张图片');
			return false;
		}
		let count = 9 - this.state.imgIdList.length - this.state.imgsList.length;
		if (window) {
			window.wx.chooseImage({
				count: count,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					// console.log("addImageWx success");
					let imgIdList = [...this.state.imgIdList]
					res.localIds.map((e) => {
						imgIdList.push(e)
					})

					// console.log("imgIdList to set:");
					// console.log(imgIdList);

					this.setState({
						imgIdList: imgIdList,
					})


					this.data.tempLocalIdList = res.localIds


					// this.wxImgUpload(res.localIds);
					this.asyncWxImgUpload();
				},

				cancel: (res) => {
					// console.log("chooseImage cancel");
					// console.log(res)
				}
			});
		}

	}

	asyncWxImgUpload = () => {
		window.loading(true);
		if (this.data.tempLocalIdList.length == 0) {
			window.loading(false);
		} else {
			var localId = this.data.tempLocalIdList.pop();
			wx.uploadImage({
				localId: localId,
				isShowProgressTips: 0,
				success: (res) => {
					this.data.imgServerIdList.push(res.serverId)
					this.asyncWxImgUpload();
				},
				fail: (res) => {
					window.toast("部分图片上传失败，请重新选择");
				},
			});
		}
	}

	wxImgUpload = (localIdList) => {

		var serverImageId = [];
		window.loading(true);


		Array.prototype.forEach.call(localIdList, (localId, index) => {
			if (this.state.imgServerIdList.length + index + 1 > 9) {
				return false;
			}
			wx.uploadImage({
				localId: localId,
				isShowProgressTips: 0,
				success: (res) => {
					serverImageId.push(res.serverId)
					window.loading(false);
				},
				fail: (res) => {
					window.toast("部分图片上传失败，请重新选择");
				},
				complete: (res) => {
					serverImageId.push(res.serverId)
					window.loading(false);
				}
			})

		});
	};

	deleteImgHandle = (index) => {
		this.data.imgIndexWillDelete = index;
		this.refs['action-sheet'].show();
	};

	deleteWxImgHandle = (index) => {
		this.data.imgIndexWillDelete = index;
		this.refs['action-sheet-wx'].show();
	};

	deleteWxImg = () => {
		let imgIdList = [...this.state.imgIdList];
		let imgServerIdList = [...this.data.imgServerIdList]

		imgIdList.splice(this.data.imgIndexWillDelete, 1);
		imgServerIdList.splice(this.data.imgIndexWillDelete, 1);

		this.data.imgServerIdList = imgServerIdList;
		this.setState({
			imgIdList: imgIdList,
		});
	}

	deleteImg = () => {
		let imgsList = [...this.state.imgsList];
		imgsList.splice(this.data.imgIndexWillDelete, 1);
		this.setState({
			imgsList: imgsList
		});
	};

	onPCRecUploadSuccess(audioUrl, second) {
		const _audioList = [...this.state.audioList]

		_audioList.push({
			audioUrl,
			second,
		})
		this.setState({
			showRecorder: false,
			audioList: _audioList
		});
	}
	onWXRecUploadSuccess(recServerId, second, recLocalId) {
		const _audioList = [...this.state.audioList]

		_audioList.push({
			second,
			recServerId,
			recLocalId
		})
		this.setState({
			showRecorder: false,
			audioList: _audioList
		});
	}
	deleteAudio(index) {
		if (this.refs[`audioController_${index}`]) this.refs[`audioController_${index}`].pauseAudio();

		const _audioList = [...this.state.audioList]
		_audioList.splice(index, 1);

		this.setState({
			showAudioController: false,
			audioList: _audioList
		});
	}

	saveHomeworkHandle = async () => {

		if (!this.state.content.trim() && !this.state.imgsList.length && !this.data.imgServerIdList.length && !this.state.second) {
			window.toast("请输入内容");
			return false;
		} else if (this.state.contentCount > 5000) {
			window.toast("作业文字长度不能多于5000个字");
			return false;
		} else if (this.state.videoStatus && this.state.videoStatus === 'uploading') {
			window.toast("视频上传中");
			return false
		}

		var imageList = [];
		var currentIdx = 0;
		if (this.state.imgsList.length) {
			this.state.imgsList.map((url, idx) => {
				imageList.push({
					imageUrl: url,
					sortNum: idx,
				})
			})
			currentIdx = this.state.imgsList.length;
		}
		// this.state.imgServerIdList.map((id, idx) => {
		// 	imageList.push({
		// 		imageId: id,
		// 		sortNum: idx + currentIdx
		// 	}) 
		// }) 
		this.data.imgServerIdList.map((id, idx) => {
			imageList.push({
				imageId: id,
				sortNum: idx + currentIdx
			})
		})

		const _audioList = []
		this.state.audioList.map((audio) => {
			_audioList.push({
				audioUrl: audio.audioUrl || '',
				second: audio.second || '',
				audioId: audio.recServerId || '',
			})
		})

		if (this.refs.audioController) this.refs.audioController.pauseAudio();

		let result = await this.props.saveAnswer({
			audioList: _audioList.length > 0 ? _audioList : '',
			content: this.state.content,
			homeworkId: this.props.location.query.id,
			id: this.props.location.query.answerId || '',
			imageList: imageList,
			videoList: this.state.videoId && [{ resourceId: this.state.videoId, isNew: this.state.videoLocalUrl ? 'Y' : '', duration: this.state.videoDuration }]
		});

		if (result.state.code === 0) {
			typeof _qla !== 'undefined' && _qla('event', {
				category: `hand_in_homework`,
				action: 'success',
			});

			locationTo(`/wechat/page/homework/details?id=${this.props.location.query.id}&topicId=${this.props.location.query.topicId}&liveId=${this.props.location.query.liveId}`);
		}

	}

	showRecorder() {
		if (this.state.audioList.length >= 5) {
			window.toast('您只能录五条语音');
			return false;
		}
		this.setState({
			showRecorder: true
		});
	}
	hideRecorder() {
		this.refs.recorder.resetRec().then(() => {
			this.setState({
				showRecorder: false
			});
		});
	}

	showShot() {
		if (this.state.videoId) {
			window.toast('您只能上传一个视频');
			return false
		}
		this.setState({
			showShot: true
		});
	}
	hideShot() {
		this.setState({
			showShot: false
		});
	}

	onAudioPlay(_this, index) {
		if (this.state.currPlayIndex > -1) {
			if (this.refs[`audioController_${this.state.currPlayIndex}`]) this.refs[`audioController_${this.state.currPlayIndex}`].pauseAudio();
		}
		console.log(_this.state, index)
		this.setState({
			currPlayIndex: index
		})
	}

	render() {
		const { videoStatus, homework } = this.state

		return (
			<Page title="作业内容" className='hand-in-homework'>
				<div className="hand-in-container">
					{
						!!homework &&
						<XiumiContent content={homework.content}/>
					}

					<div className="hand-in-homework-wrap">
						<div className="content">
							<textarea name="content" placeholder="请输入内容" onChange={this.textareaHandle.bind(this)} value={this.state.content}></textarea>
							<div className="counter">
								<span className="total">{this.state.contentCount}/5000</span>
							</div>
						</div>
						<div className="media-panel">

							{
								videoStatus === 'show' ? (
									<div className="video-wrapper">
										<div className="video-box">
											<VideoController
												videoUrl={this.state.videoLocalUrl || ''}
												poster={this.state.videoPosterImg || ''}
												videoId={this.state.videoId || ''}
												duration={this.state.videoDuration || 0}
												islazy={false}
												hideTime={true}
												isLive={true} />
										</div>
										<div className="video-info">
											<div className="video-info-content">
												<div>
													<p className="upload-tips"></p>
													<span className="delete-btn" onClick={this.deleteVideo}>删除</span>
												</div>
											</div>
										</div>
									</div>
								) : videoStatus && videoStatus !== 'cancel' ? (
									<div className="video-wrapper">
										<div className="video-upload">
											<div className="video-box"></div>
											{
												this.state.videoPosterImg && <img src={this.state.videoPosterImg} alt="" />
											}
										</div>
										<div className="video-info">
											<div className="video-info-content">
												{
													videoStatus === 'uploading' && (
														<div>
															<p className="upload-tips">上传中{this.state.videoUploadPercent}%.<span>.</span><span>.</span></p>
															<span className="delete-btn" onClick={this.videoUploadCancel}>取消</span>
														</div>
													)
												}
												{
													(videoStatus === 'hold' || videoStatus === 'success') && (
														<div>
															<p className="upload-tips">视频审核中</p>
															<span className="delete-btn" onClick={this.deleteVideo}>删除</span>
														</div>
													)
												}
												{
													videoStatus === 'success' && (
														<div>
															<p className="tips">请点击提交作业，视频审核通过就可以被别人看到咯</p>
														</div>
													)
												}
											</div>
										</div>
									</div>
								) : null
							}
							{
								this.state.audioList.length > 0 &&
								<div className="audio-list">
									{
										this.state.audioList.map((audio, audioIndex) => (
											<div className={`audio-wrapper show`}>
												<AudioController
													key={`audioController_${audioIndex}`}
													ref={`audioController_${audioIndex}`}
													currentAudioUrl={audio.audioUrl || ''}
													onPlay={_ => this.onAudioPlay(_, audioIndex)}
													recLocalId={audio.recLocalId || ''}
													second={audio.second}
												/>
												<div className="delete-btn" onClick={() => this.deleteAudio(audioIndex)}>删除</div>
											</div>
										))
									}
								</div>
							}
							{
								(!!this.state.imgsList.length || !!this.state.imgIdList.length) &&
								<div className="imgs-list">
									{
										this.state.imgsList.map((img, index) => {
											return <div className="img-item" key={`img-item-${index}`} style={{ 'backgroundImage': `url(${img})` }} onClick={this.deleteImgHandle.bind(this, index)}></div>
										})
									}
									{
										this.state.imgIdList.map((img, index) => {
											return <div className="img-item" key={`img-item-${index}`} onClick={this.deleteWxImgHandle.bind(this, index)}><img src={img}></img></div>
										})
									}
								</div>
							}
						</div>
						<div className="add-panel">
							<div className="button" onClick={this.showRecorder}>语音</div>
							<div className="split"></div>
							{
								this.state.isWechat ?
									<div className="button" onClick={this.addImageWx}>图片</div>
									: <div className="button">图片<input type="file" ref="imgUploadInput" accept="image/jpeg,image/png,image/gif" onFocus={this.checkImgNum} onClick={this.checkImgNum} onChange={this.addImagePc.bind(this)} /></div>
							}
							<div className="split"></div>
							<div className="button" onClick={this.showShot}>视频</div>
						</div>
					</div>
				</div>

				<div className="footer-container">
					<div className="submit-btn" onClick={this.saveHomeworkHandle}>提 交</div>
				</div>

				<ActionSheet
					ref="action-sheet"
					sheetList={[{ name: '删除', callback: this.deleteImg }]}
				/>
				<ActionSheet
					ref="action-sheet-wx"
					sheetList={[{ name: '删除', callback: this.deleteWxImg }]}
				/>
				<div className={`recording-wrapper${this.state.showRecorder ? ' show' : ''}`} onClick={this.hideRecorder}>
					<div className="recording-box" onClick={(e) => e.stopPropagation()}>
						<Recorder
							ref="recorder"
							className="recorder-container"
							uploadRec={this.props.uploadRec}
							onPCRecUploadSuccess={this.onPCRecUploadSuccess}
							onWXRecUploadSuccess={this.onWXRecUploadSuccess}
						/>
					</div>
				</div>
				<div className={`recording-wrapper${this.state.showShot ? ' show' : ''}`} onClick={this.hideShot}>
					<div className="recording-box" onClick={(e) => e.stopPropagation()}>
						<div className="shot-content">
							<p>拍摄上传<input type="file" ref="shotInput" accept="video/*" capture="camcorder" onChange={this.addVideo.bind(this)} /></p>
							<span className="splite"></span>
							<p>相册上传<input type="file" ref="albumInput" accept="video/*" onChange={this.addVideo.bind(this)} /></p>
							<p onClick={this.hideShot}>取消</p>
						</div>
					</div>
				</div>
				<div className={`homework-dialog${this.state.showVideoSize ? ' show' : ''}`}>
					<div className="bg" onClick={() => {this.setState({showVideoSize: false})}}></div>
					<div className="dialog-content">
						<div className="desc">拍摄视频长度建议小于<span className="s">60</span>秒，<br />上传视频小于<span className="s">200M</span></div>
						<div className="btn" onClick={() => {this.setState({showVideoSize: false})}}>确定</div>
					</div>
				</div>
				<div className={`homework-dialog${this.state.showVideoErr ? ' show' : ''}`}>
					<div className="bg" onClick={() => {this.setState({showVideoErr: false})}}></div>
					<div className="dialog-content">
						<div className="desc">视频上传好像出了点问题 请尝试重新上传</div>
						<div className="btn" onClick={() => {this.setState({showVideoErr: false})}}>确定</div>
					</div>
				</div>
			</Page>
		)
	}
}

module.exports = connect((state) => {
	return {
		duration: state.common.duration,
		videoAuth: state.common.videoAuth,
		videoStatus: state.common.videoStatus,
		videoUploadPercent: state.common.videoUploadPercent,
	}
}, {
		getStsAuth,
		uploadRec,
		uploadImage,
		uploadVideo,
		saveAnswer,
		getMyAnswer
	})(HandIn);




class XiumiContent extends React.Component {
	state = {
		isHomeworkExpand: false, // 展开按钮状态，null为不显示
	}

	componentDidMount() {
		// 此处应该由秀米渲染组件抛出图片onload事件的
		setTimeout(() => {
			this.judgeExpand()
		}, 200)
		setTimeout(() => {
			this.judgeExpand()
		}, 2000)
		setTimeout(() => {
			this.judgeExpand()
		}, 4000)
	}

	mustOverflow = false // 是否肯定超长

	judgeExpand = async () => {
		if (this.mustOverflow) return;

		const wrap = this.refWrap;
		const content = wrap.getElementsByClassName('ql-editor-h5-wrap')[0];

		if (content.clientHeight > wrap.clientHeight) {
			this.mustOverflow = true;
			this.state.isHomeworkExpand === null && this.setState({
				isHomeworkExpand: false,
			})
		} else {
			this.setState({
				isHomeworkExpand: null,
			})
		}
	}

	render() {
		return <div className={`homework-container${this.state.isHomeworkExpand ? ' expand' : ''}`}>
			<div className="xiumi-wrap" ref={r => this.refWrap = r}>
				<XiumiEditorH5 content={htmlTransferGlobal(this.props.content || '')}/>
			</div>
			{
				this.state.isHomeworkExpand === null ? null :
				this.state.isHomeworkExpand
					?
					<div className="btn-expand" onClick={() => this.setState({isHomeworkExpand: false})}>收起详情</div>
					:
					<div className="btn-expand" onClick={() => this.setState({isHomeworkExpand: true})}>展开详情</div>
			}
		</div>
	}
}