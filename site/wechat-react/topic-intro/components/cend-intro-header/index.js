/**
 *
 * @author Dylan
 * @date 2018/5/30
 */
import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import Picture from 'ql-react-picture';
import ShortKnowledgeTip from "../../../components/short-knowledge-tip";
import { request } from 'common_actions/common';


import {
	locationTo,
	formatDate,
	formatMoney,
	digitFloor2,
	isBeginning,
	timeAfter,
	digitFormat,
	getVieoSrcFromIframe,
	replaceWrapWord,
	dangerHtml,
	refreshPageData,
	imgUrlFormat,
	getCookie,
	setCookie,
	updateUrl,
	timeAfterMixWeek,
	localStorageSPListAdd,
	getVal,
	timeBefore,
	handleAjaxResult,
	isLogined,
} from 'components/util';

import {
	fetchPayUser
} from '../../actions/channel-intro';

import TryListenButton from "../try-listen-button";
import {apiService} from "components/api-service/api";
import Barrage from '../barrage';

function mapStateToProps (state) {
	return {
		channelInfo: state.channelIntro.channelInfo,
		chargeConfigs: state.channelIntro.chargeConfigs,
		topicInfo: state.topicIntro.topicInfo,
		isAuthTopic: state.topicIntro.isAuthTopic,
		topicId: state.topicIntro.topicInfo.id,
		channelId: state.channelIntro.channelId,
		liveId: state.channelIntro.liveId,
		vipInfo: state.channelIntro.userVipInfo || state.topicIntro.userVipInfo || {},
		sysTime: state.common.sysTime,
	}
}

const mapActionToProps = {
	fetchPayUser
};

@autobind
class IntroHeader extends Component {

	state = {
		audienceCount: 0,

		// 未开播倒计时
		day: 0,
		hours: 0,
		minutes: 0,

		isShowBtnPlay: false,
	};

	data = {
	};

	initShowKnowledgeTip = async () => {
		let storage = localStorage.getItem('showKnowledgeTip');
		let key = this.props.channelId ? 'channel'+this.props.channelId : 'topic'+this.props.topicId
		let times = storage && JSON.parse(storage)[key] || 0;
		if (times > 2) return ;
		let [result, knowledgeResult] = await Promise.all([apiService.post({
			url: '/h5/dataStat/getCourseIndexStatus',
			body: {
				businessId: this.props.channelId || this.props.topicId,
				type: this.props.channelId ? 'channel' : 'topic'
			}
		}), request.post({
				url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/geKnowledgeByBusinessId',
				body: {
					businessId: this.props.channelId || this.props.topicId
				}
		}
		)])

		if (result.state.code == 0) {
			times ++;
			if (result.data.knowledgeStatus == 'Y' && times < 3 && Date.now() < new Date('2019-06-18').valueOf()) {
				localStorage.setItem('showKnowledgeTip', JSON.stringify({
					[key]: times
				}))
			}
			let auditPass = false;
			if (knowledgeResult.state.code == 0) {
				auditPass = knowledgeResult?.data?.dto?.auditStatus == 'pass'
			}
			this.setState({
				showKnowledgeTip: result.data.knowledgeStatus == 'Y' && times < 3 && auditPass && Date.now() < new Date('2019-06-18').valueOf()
			})
			setTimeout(() => {
				this.setState({
					showKnowledgeTip: false
				})
			}, 4000)
		}
	}

	componentDidMount(){
		if(this.props.channelId){
			// this.initChannelIntroHeader();
		}else{
			this.initTopicIntroHeader();
		}
		this.initShowKnowledgeTip();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.type === 'topic' && nextProps.liveStatus === 'plan') {
			this.initCountDown();
		}
	}

	async initChannelIntroHeader(){
		const res = await this.props.fetchPayUser({
			channelId: this.props.channelId,
		});
		if(res.state.code === 0){
			this.setState({
				audienceCount: res.data.payUserCount
			});
		}
	}


	initTopicIntroHeader(){
		let isShowBtnPlay = false;

		// 试听课
		if (this.props.topicInfo.channelId && this.props.topicInfo.isAuditionOpen == 'Y') {
			isShowBtnPlay = true;
		
		// 未购买的加密课不显示播放按钮
		} else if (this.props.topicInfo.type === 'encrypt' && !this.props.isAuthTopic) {
			isShowBtnPlay = false;

		// 免费单课显示播放按钮
		} else if (this.props.topicInfo.money == 0 && !this.props.topicInfo.channelId) {
			isShowBtnPlay = true;
		}
		
		this.setState({
			isShowBtnPlay,
			audienceCount: this.props.topicInfo.browseNum || 0,
		})

		if (this.props.liveStatus === 'plan') {
			this.initCountDown();
		}
	}

	initCountDown(){
		if (this._hasInitCountDown) return;
		this._hasInitCountDown = true;

		let leftSecond = Math.floor((this.props.topicInfo.startTime - this.props.sysTime) / 1000);

		this.setState({
			day: ~~(leftSecond / (3600 * 24)),
			hours: ~~(leftSecond % (3600 * 24) / 3600),
			minutes:  ~~(leftSecond % 3600 / 60),
		});

		this.countDownTimer = window.setInterval(_=> {
			if(leftSecond <= 0){
				clearInterval(this.countDownTimer);
				this.handleCountDownFinish();
				return false;
			}
			leftSecond--;
			if(leftSecond < 120 && leftSecond > 0){
				return false;
			}
			this.setState({
				day: ~~(leftSecond / (3600 * 24)),
				hours: ~~(leftSecond % (3600 * 24) / 3600),
				minutes:  ~~(leftSecond % 3600 / 60),
			});
		}, 1000);

	}
	// 倒计时结束处理方法
    handleCountDownFinish() {

    }

	topicPlayBtnClickHandle(){
		const {topicInfo} = this.props;
		// 若话题属于打卡训练营，训练营结束后不可再进行
		try {
			if(topicInfo 
				&& ((new Date(topicInfo.endTime)) <  (new Date(this.props.sysTime))) 
				&& topicInfo.isCampCourse === 'Y' 
				&& this.props.isAuthChannel === false
			) {
				return ;
			}
		} catch (error) {}
		if (this.props.topicId) {
			// 试听单课也是auth状态
			if (this.props.isAuthTopic) {
				locationTo(`/topic/details?topicId=${this.props.topicId}`);
			} else {
				this.props.authTopic && this.props.authTopic();
			}
		}
	}

	channelPlayBtnClickHandle(){
		if(this.props.isAuthChannel || this.props.isVip){
			this.props.enterCourse();
		}else if(this.props.isFree){
			this.props.payChannel();
		}else if(this.props.auditionOpenCourse){
			locationTo(`/topic/details?topicId=${this.props.auditionOpenCourse.id}`);
		}
	}

	// 是否开启弹幕
	get isOpenBarrage () {
		if (
			// 未报名系列课
			this.props.type === 'channel' &&
			!this.props.isAuthChannel
		) {
			return true
		}
		if (
			// 未报名话题
			this.props.type === 'topic' &&
			this.props.topicInfo && 
			!this.props.isAuthTopic &&
			// 非系列课下的话题
			!this.props.topicInfo.channelId
		) {
			return true
		}

		return false
	}

	render(){
		return (
			<div className="cend-intro-header">
				<Picture className="banner" src={`${imgUrlFormat(this.props.banner, '@750w_469h_1e_1c_2o')}`} alt=""/>
				{
					this.state.showKnowledgeTip ?
						<div className="knowledge-wrap" style={{
							position: "absolute",
							zIndex: 100,
							right: 0
						}}>
							<ShortKnowledgeTip borC="C"/>
						</div> : null
				}
				{
					this.props.liveStatus === 'plan' &&
					<div className="count-down-box">
						<div className="tip">距开课还有</div>
						<div className="clocking">
							<div className="block"><div className="c"><span>{this.state.day}</span>天</div></div>
							:
							<div className="block"><div className="c"><span>{this.state.hours}</span>时</div></div>
							:
							<div className="block"><div className="c"><span>{this.state.minutes}</span>分</div></div>
						</div>
					</div>
				}

				{/* <div className="tip-info">
					<div className="audience-count">{digitFormat(this.state.audienceCount)}次学习</div>
					{
						(this.props.isFree || !this.props.isVip || !this.props.isRelay) &&
						<div className="service-note-btn">{this.props.chargeType === 'flexible' ? '支持回听' : '支持回听'}</div>
					}
				</div> */}

				{
					this.props.type === 'topic' &&
					this.props.liveStatus !== 'plan' &&
					(this.props.isAuthTopic || this.state.isShowBtnPlay) && 
					<div className="play-btn-topic on-log on-visible"
					     data-log-name="头部播放按钮"
					     data-log-region="play-btn"
					     onClick={this.topicPlayBtnClickHandle}
					>
					</div>
				}

				{
					this.props.type === 'channel' && (this.props.auditionOpenCourse || this.props.isFree) &&
					<div className={this.props.isFree ? "play-btn-topic" : "play-btn" + " on-log on-visible"}
					     data-log-name="头部播放按钮"
					     data-log-region="play-btn"
					     onClick={this.channelPlayBtnClickHandle}
					>
						{
							this.props.isFree ? null : 
							<TryListenButton />
						}
					</div>
				}
				{
					this.isOpenBarrage ? 
					<div className="intro-barrage">
						<Barrage 
							isQlchat={false} 
							type={this.props.type}
							topicId={this.props.topicId}
							channelId={this.props.channelId} 
							/>
					</div> : null
				}
				{this.props.children}
			</div>
		)
	}
}

export default connect(mapStateToProps, mapActionToProps)(IntroHeader);
