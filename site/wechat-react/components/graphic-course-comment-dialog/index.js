/**
 *
 * @author Dylan
 * @date 2018/5/14
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames'

import {
	imgUrlFormat,
	locationTo,
	getCookie,
	normalFilter,
	formatMoney,
	setLocalStorageArrayItem,
	localStorageSPListAdd,
	getVal,
	getAudioTimeShow,
	sleep,
	timeBefore,
	validLegal,
} from 'components/util';
import { isWeixin,isPc } from 'components/envi';
import ScrollToLoad from 'components/scrollToLoad';
import CreateLiveHelper from "components/create-live-helper";
import Empty from 'components/empty-page';


import { getGraphicCommentList, addGraphicComment } from '../../actions/messages';


function mapStateToProps (state) {
	return {
		sysTime: state.common.sysTime || Date.now(),
		userId: getVal(state, 'common.userInfo.user.userId', ''),
	}
}

const mapActionToProps = {
	getGraphicCommentList,
	addGraphicComment,
};

@autobind
class CommentDialog extends Component {

	state = {
		commentList: [],
		isNoMore: false,
		isNoOne: false,
		inputText: '',
		isFocus: false,
		inputPlaceholder: '可以发表下意见嘛~',
		replyTargetId: '',
	};

	data = {
		page: 1
	};

	componentWillReceiveProps(nextProps){
	}

	componentDidUpdate(prevProps) {
	}

	componentWillUpdate(nextProps, nextState){
	}

	componentDidMount() {
		this.getGraphicCommentList(1);

		setTimeout(() => {
			typeof _qla != 'undefined' && _qla.collectVisible();
			typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
		}, 1000);
	}

	async getGraphicCommentList(page, time){
		const res = await this.props.getGraphicCommentList({
			businessId: this.props.topicId,
			time: time || this.props.sysTime,
			page,
			size: 20,
		});
		if(res.state.code === 0){
			if(page === 1 && (!res.data.discussList || !res.data.discussList.length)){
				this.setState({
					isNoOne: true
				})
			}
			if(res.data.discussList && res.data.discussList.length){
				this.setState({
					commentList: [...this.state.commentList, ...res.data.discussList],
					isNoMore: res.data.discussList.length < 20
				})
			}
		}
	}

	async loadNextComments(next){
		const time = this.state.commentList[(this.state.commentList.length - 1)].createTime;
		await this.getGraphicCommentList(++this.data.page, time);
		next();
	}

	dangerHtml(content){
		if (content) {
			content = content.replace(/\</g, (m) => "&lt;");
			content = content.replace(/\>/g, (m) => "&gt;");
			content = content.replace(/(&lt;br(\/)?&gt;)/g, (m) => "\n");
		}

		return { __html: content }
	};

	inputChangeHandle(e){
		this.setState({
			inputText: e.target.value
		})
	}

	async sendText(){
		if(validLegal('text','评论内容',this.state.inputText,200,0)){

			const result = await this.props.addGraphicComment({
				businessId: this.props.topicId,
				courseStyle: this.props.courseStyle,
				content: normalFilter(this.state.inputText),
				parentId: this.state.replyTargetId,
				playTime: this.props.getMediaPlayerCurrentTime && this.props.getMediaPlayerCurrentTime(),
			});

			if (result && result.state && result.state.code === 0){
				this.setState({
					isNoOne: false,
					inputText: '',
					commentList: [result.data.discuss, ...this.state.commentList]
				}, () => {
					setTimeout(() => {
						this[`comment-item-${result.data.discuss.id}`] && this[`comment-item-${result.data.discuss.id}`].scrollIntoView(true);
					}, 200);
				});
				this.props.addCommentCount && this.props.addCommentCount();
			}else{
				window.toast(result.state.msg)
			}
		}

	}

	hide(){
		this.props.hideCommentDialog && this.props.hideCommentDialog();
	}

	onFocus = () => {
		this.setState({isFocus: true}, () => {
			setTimeout(() => {
				this.commentInput.scrollIntoView(true)
			},200);
		})
	};

	onBlur = () => {
		this.setState({
			isFocus: false,
			inputPlaceholder: '可以发表下意见嘛~',
		},() => {
			setTimeout(() => {
				this.title.scrollIntoView(true)
			},200);
		});
		if(!this.state.inputText){
			this.setState({
				replyTargetId: ''
			})
		}
	}

	replyBtnClickHandle(c){
		this.commentInput.focus();
		this.setState({
			replyTargetId: c.id,
			inputPlaceholder: `回复：${c.createByName}`
		});
		setTimeout(() => {
			this.commentInput.scrollIntoView(true);
		}, 200);
		setTimeout(() => {
			this.scrollReplyTargetIntoView(this[`comment-item-${c.id}`]);
		}, 500);
	}

	scrollReplyTargetIntoView(target){
		// 滑到容器最底部
		if(!target) return false;
		const boundingBottomDiff = this.scrollContainerRef.getBoundingClientRect().bottom - target.getBoundingClientRect().bottom;
		this.scrollContainerRef.scrollTop = this.scrollContainerRef.scrollTop - boundingBottomDiff;
	}

	isTeacher(createRole){
		return ['creater', 'manager', 'guest'].indexOf(createRole) >= 0;
	}

	render() {
		return (
			<div className={`graphic-course-comment-dialog${this.props.show ? '' : ' hide'}`}>
				<div className="title" ref={ r => this.title = r }>
					全部评论 <span className="num">{this.props.graphicCommentCount > 0 ? this.props.graphicCommentCount : ''}</span>
					<div className="close-btn icon_delete" onClick={this.hide}></div>
				</div>
				<ScrollToLoad
					ref={r => this.scrollContainerRef = r}
					className="comment-scroll-box"
					toBottomHeight={100}
					notShowLoaded = {true}
					loadNext={ this.loadNextComments }
					noMore={this.state.isNoMore}
				>
				{!(this.props.power.allowSpeak || this.props.power.allowMGLive)&&<CreateLiveHelper chtype="transcribe-create-live" getHasLive={this.props.getHasLive} isHasLive={this.props.isHasLive}  />}
					<div className="graphic-course-comment-list">
						{
							this.state.commentList.map((c, i) => (
								<div className="comment-item"
								     key={i}
								     ref={el => (this[`comment-item-${c.id}`] = el)}
								>
									<div className="avatar"><img src={imgUrlFormat(c.createByHeadImgUrl || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,w_100,h_100,limit_1')} alt=""/></div>
									<div className="comment-content">
										<div className="name">
											{
												this.isTeacher(c.createRole) &&
												<i>(老师)</i>
											}
											{c.createByName}
										</div>
										<div className="text" dangerouslySetInnerHTML={this.dangerHtml(c.content)}></div>
										{
											!!c.parentId &&
											(
												c.parentCommentPo && c.parentCommentPo.id ?
													<div className="parent-item">
							                            <span className="name">
							                                {
								                                this.isTeacher(c.parentCommentPo.createRole) &&
								                                <i>(老师)</i>
							                                }
								                            {c.parentCommentPo.createByName}：
							                            </span>
														<span className="text" dangerouslySetInnerHTML={this.dangerHtml(c.parentCommentPo.content)}></span>
													</div>
													:
													<div className="parent-item deleted">原评论已被删除</div>
											)
										}
										<div className="tip-wrap">
											<div className="time">{timeBefore(c.createTime,this.props.sysTime)}</div>
											{
												this.props.userId !== c.createBy &&
												<div className="reply-btn on-log on-visible"
												     data-log-region="comment-reply-btn"
												     onClick={this.replyBtnClickHandle.bind(this, c)}
												></div>
											}
										</div>
										{/*{*/}
											{/*c.replyList && c.replyList.map((r, ri) => (*/}
												{/*<div className="reply-item" key={ri}>*/}
													{/*<div className="name live">直播间回复</div>*/}
													{/*<div className="time">{timeBefore(r.createTime,this.props.sysTime)}</div>*/}
													{/*<div className="text" dangerouslySetInnerHTML={this.dangerHtml(r.content)}></div>*/}
												{/*</div>*/}
											{/*))*/}
										{/*}*/}
									</div>
								</div>
							))
						}
					</div>
					{
						this.state.isNoOne &&
						<Empty emptyMessage="没有任何评论哦" />
					}
				</ScrollToLoad>
				<div className="send-bar">
					<input type="text"
					       placeholder={this.state.inputPlaceholder}
					       ref={el => (this.commentInput = el)}
					       value = {this.state.inputText }
					       onChange={this.inputChangeHandle}
						   onFocus={this.onFocus}
						   onBlur={this.onBlur}/>
					{
						(this.state.isFocus || this.state.inputText) &&
						<div className={
							classnames("send-btn",{
								"text": this.state.inputText
							})
						}
						     onClick={this.sendText}
						>发送</div>
					}
				</div>
			</div>
		);
	}
}



module.exports = connect(mapStateToProps, mapActionToProps)(CommentDialog);
