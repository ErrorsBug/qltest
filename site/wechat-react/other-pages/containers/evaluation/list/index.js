/**
 * Created by dylanssg on 2017/5/8.
 */
import { get } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import {
	formatDate
} from 'components/util';

import {
	getEvaluationList,
	reply
} from '../../../actions/evaluation';

import {
	getAuth
} from '../../../actions/topic'

import { findDOMNode } from 'react-dom';

import Stars from '../components/stars'

//EvaluCount

class EvaluationList extends Component {
	constructor(props) {
		super(props)
	}

	state = {
		title : 4,
		userType: this.props.userPower.allowMGTopic || this.props.userPower.allowSpeak ? 'manager' : 'student',
		// userType: 'manager',
		pageType: this.props.params.topicId ? 'topic' : 'channel',    //topic, channel
		contentFilterStatus: 'inactivated',  //activated, inactivated
		replyContent: '',
		currentRelyIndex: '',
		showReplyInput: false,
		replyPlaceholder: '',
		pageSize: 10,
		page: 1,
		pageStatus: 'loading',
		isAuth: false
	};

	scrollData = {
		posY: 0,
		maxscroll: 0
	};

	async componentDidMount(){
		this.getEvaluationList(this.state.page);
		if(this.state.pageType === 'topic'){
			let topicAuth = await this.props.getAuth(this.props.params.topicId);
			if(topicAuth.state.code === 0){
				this.setState({
					isAuth: topicAuth.data.isAuth
				});
			}
		}
		console.log('this.props.isEvaluated', this.props.isEvaluated);
	}

	async getEvaluationList(page){
		let params = {
			...this.props.params,
			page: {
				page: page,
				size: this.state.pageSize
			}
		};
		this.setState({
			pageStatus: 'loading'
		});
		let result = await this.props.getEvaluationList(params);
		let list = get(result,'data.list',[]);
		let pageStatus = '';
		if(page === 1 && !list.length) pageStatus = 'no-data';
		else if(list.length < this.state.pageSize) pageStatus = 'no-more-data';

		this.setState({
			pageStatus
		});
	}

	onContentFilter(){
		if(this.state.contentFilterStatus == 'inactivated') this.setState({
			contentFilterStatus: 'activated'
		});
		else this.setState({
			contentFilterStatus: 'inactivated'
		});
	}

	replyHandle(index,e){
		this.refs['reply-input'].focus();
		// setTimeout(() => {
		// 	findDOMNode(this.refs['reply-input-box']).scrollIntoView();
		// 	document.body.scrollTop = 700;
		// 	window.scrollTop = 700;
		// },1000);
		this.setState({
			currentRelyIndex: index,
			replyContent: '',
			replyPlaceholder: `回复：${this.props.evaluationList[index].content || this.props.evaluationList[index].userName}`,
			showReplyInput: true
		});
	}

	sendReplyHandle(){
		if(this.state.replyContent){
			this.props.reply({
				evaluateId: this.props.evaluationList[this.state.currentRelyIndex].id,
				replyContent: this.state.replyContent
			});
			this.props.evaluationList[this.state.currentRelyIndex].replyContent = this.state.replyContent;
			this.setState({
				replyContent: '',
				showReplyInput: false
			});
		}else{
			window.toast('请输入回复内容！');
		}
	}

	changeReplyContent(e){
		if(e.currentTarget.value.length > 500) return false;
		this.setState({
			replyContent: e.currentTarget.value
		});
	}

	scrollTouchStartHandle(e){
		let touch = e.touches[0],
			element = e.currentTarget;
		// 垂直位置标记
		this.scrollData.posY = touch.pageY;
		this.scrollData.scrollY = element.scrollTop;
		// 是否可以滚动
		this.scrollData.maxscroll = element.scrollHeight - element.clientHeight;
	}

	scrollTouchMoveHandle(e){
		// 如果不足于滚动，则禁止触发整个窗体元素的滚动
		if (this.scrollData.maxscroll <= 0) {
			// 禁止滚动
			e.preventDefault();
		}
		// 现在移动的垂直位置，用来判断是往上移动还是往下
		let touch = e.touches[0],
			element = e.currentTarget;
		// 移动距离
		let distanceY = touch.pageY - this.scrollData.posY;
		let scrollTop = element.scrollTop;
		// 上下边缘检测
		if (distanceY > 0 && scrollTop == 0) {
			// 往上滑，并且到头
			// 禁止滚动的默认行为
			e.preventDefault();
			return;
		}

		// 下边缘检测
		if (distanceY < 0 && (scrollTop + 1 >= this.scrollData.maxscroll)) {
			// 往下滑，并且到头
			// 禁止滚动的默认行为
			e.preventDefault();
			return;
		}
	}

	scrollTouchEndHandle(e){
		this.scrollData.maxscroll = 0;
	}

	scrollHandle(scrollContainer, e){
		if(['no-more-data','loading'].indexOf(this.state.pageStatus) > -1) return false;
		if(scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight) <= 10){
			let page = this.state.page;
			this.getEvaluationList(++page);
			this.setState({
				page
			});
		}
	}

	titleHandle(){
		if(this.props.params.channelId) location.href = `/live/channel/channelPage/${this.props.params.channelId}.htm`;
		else location.href = `/wechat/page/topic-intro?topicId=${this.props.params.topicId}`
	}

	render() {
		return (
			<Page title={this.state.pageType == 'topic' ? '评价课程' : '评价系列课'} className='evaluaiton-course'>
				<div className="evaluaiton-course-wrapper">

					<div className="evaluaiton-course-scroll-box" ref="evaluaiton-course-scroll-box" onTouchMove={this.scrollTouchMoveHandle.bind(this)} onTouchStart={this.scrollTouchStartHandle.bind(this)} onTouchEnd={this.scrollTouchEndHandle.bind(this)} onScroll={this.scrollHandle.bind(this, this.refs['evaluaiton-course-scroll-box'])}>
						<div className="evaluaiton-course-container">
							<div className="header">
								<div className="title">
									<div className="type">{this.props.params.channelId ? '系列课' : '课程'}</div>
									<div className="content" onClick={this.titleHandle.bind(this)}>{this.props.evaluationData.topicName || this.props.evaluationData.channelName}</div>
								</div>
								<Stars showScore="true"
								       type="display"
								       score={this.props.evaluationData.score}
								       starsCustomStyle="stars-custom-style"
								/>
							</div>
							<div className="filter-box">
								<div className="total-num">全部评价({this.props.evaluationData.evaluateNum}条)</div>
								<div className={`content-filter ${this.state.contentFilterStatus}`} onClick={this.onContentFilter.bind(this)}>只看有内容的评价</div>
							</div>
							<div className="comment-container">
								<ul className="comment-list">
									{
										this.props.evaluationList.map((item, index) => {
											if(this.state.contentFilterStatus == 'activated' && !item.content) return '';
											return (
												<li className="comment-item">
													<div className="avatar">
														<img src={item.headImageUrl} alt=""/>
													</div>
													<div className="item-info">
														<div className="name">{item.userName}</div>
														<Stars type="display"
														       score={item.score}
														       starsCustomStyle="stars-custom-style--comment"
														/>
														{item.content && <div className="content">{item.content}</div>}
														{
															item.labelList ?
																<div className="tags">
																	{item.labelList.split(',').map((key) => {
																		return get([...this.props.labelList.highLabelList, ...this.props.labelList.lowLabelList].filter((label) => {
																			return label.key == key;
																		})[0], 'name', '不存在的key');
																	}).join(',')}
																</div>
																	:
																''
														}
														{
															item.replyContent &&
															<div className="reply-box">
																<div className="tip">直播间回复：</div>
																<div className="reply-content">{item.replyContent}</div>
															</div>
														}
														{
															this.state.pageType == 'channel' &&
															<div className="from" onClick={() => location.href = `/topic/${item.topicId}.htm`}>
																来自
																<div className="topic-name-wrap">
																	《
																	<div className="topic-name">{item.topicName}</div>
																	》
																</div>
															</div>
														}

														<div className="date">{formatDate(item.createTime)}</div>
														{
															this.state.userType == 'manager' &&
															<div className={`reply-btn${item.replyContent ? ' ed' : ''}`} onClick={this.replyHandle.bind(this,index)}>{item.replyContent ? '重新回复' : '回复'}</div>
														}
													</div>
												</li>
											)
										})
									}
								</ul>
								{this.state.pageStatus == 'no-data' && <div className="no-data">暂时没有评价</div>}
								{this.state.pageStatus == 'loading' && <div className="loading">正在玩命加载中...</div>}
								{this.state.pageStatus == 'no-more-data' && <div className="no-more-data">没有更多了</div>}
							</div>
						</div>
					</div>

					{
						this.state.userType == 'manager' ?
							<div className={`reply-input-box${this.state.showReplyInput ? ' show' : ''}`} ref="reply-input-box">
								<div className="input-wrap">
									<input type="text" ref="reply-input" placeholder={this.state.replyPlaceholder} value={this.state.replyContent} onChange={this.changeReplyContent.bind(this)} onBlur={() => {!this.state.replyContent && this.setState({showReplyInput: false})}} onFocus={() => setTimeout(() => findDOMNode(this.refs['reply-input-box']).scrollIntoView(),300)} />
								</div>
								<div className="send-btn" onClick={this.sendReplyHandle.bind(this)}>发送</div>
							</div>
							:
							(
								this.props.isEvaluated == 'N' && this.state.pageType == 'topic' && this.state.isAuth ?
									<div className="go-to-evaluate">
										<div className="tip">给此节课程打个分吧！</div>
										<div className="evaluate-btn" onClick={() => location.href = `/wechat/page/evaluation-create/${this.props.params.topicId}`}>立即评价</div>
									</div>
									:
									''
							)
					}
				</div>
			</Page>
			);
	}
}


module.exports = connect((state) => {
	return {
		evaluationData: state.evaluation.evaluationData,
		userPower: state.evaluation.userPower,
		evaluationList: state.evaluation.evaluationList,
		labelList: state.evaluation.labelList,
		isEvaluated: state.evaluation.isEvaluated
	}
}, {
	getEvaluationList,
	reply,
	getAuth
})(EvaluationList);