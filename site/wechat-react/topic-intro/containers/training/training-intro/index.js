
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { autobind, throttle } from 'core-decorators';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import XiumiEditorH5 from "components/xiumi-editor-h5";
import StudentTask from '../components/student-task';
import TabContainer from './components/tab-container';
import LimitPrice from './components/limit-price';
import CouponBtn from './components/coupon-btn';
import BuyBtn from './components/buy-btn';
import ActCouponDialog from './components/act-coupon-dialog';
import { share } from 'components/wx-utils';
import OperateMenu from 'components/operate-menu/home';
import SpecialsCountDown from '../components/specials-count-down';
import Evaluate from '../components/evaluate';
import CashBackRuleDialog from '../components/cash-back-rule';
// import CoursePurchase from 'components/course-purchase';
import PayFailDialog from './components/pay-fail-dialog';
import { logGroupTrace, eventLog } from 'components/log-util';


import {
	locationTo,
	imgUrlFormat,
	formatDate,
	getCookie,
	htmlTransferGlobal
} from 'components/util';

import {
	campAnswerlikes,
	joinPeriod,
	receiveMediaCoupon
} from '../../../actions/channel-intro'

import {
	fetchAnswerCountByCamp,
	fetchCampAnswerByCamp,
	fetchCampListTopic,
	getCampUserInfo,
	getChannelInfo,
	getEvaluationData,
	getEvaluationList,
	getMarketInfo,
	getPeriodByChannel,
	getUserReword,
	getVipInfo,
	newJoinPeriod,
	getLiveAdmin,
	getIsSubscribe
} from '../../../actions/training'

import {
	getQueryCouponForIntro,
	bindCoupon,
	getMyQualify
} from '../../../actions/common';

import {
	getActCouponSingle
} from '../../../actions/coupon'

import {
	reply,
	removeReply,
} from '../../../actions/evaluation';

import {doPay, subAterSign, getUserInfo, getCommunity} from 'common_actions/common'

import CommonInput from 'components/common-input';
import RewardCardDialog from './components/reward-card-dialog';
import TopicList from '../../../components/topic-list';
import IntroGroupBar from "components/intro-group-bar";
import MiddleDialog from 'components/dialog/middle-dialog';

function mapStateToProps(state) {
	return {
		// training: get(state, 'training') || {},
		campInfo: get(state, 'training.campInfo') || {},
		periodList: get(state, 'training.campInfo.periodList') || [],
		power: get(state, 'training.campInfo.power'),
		discountExtendPo: get(state, 'channel.discountExtendPo', {}),
		// joinCampInfo: get(state, 'training.joinCampInfo', {}),
		// userReword: get(state, 'training.userReword') || [],
		userInfo: state.common.userInfo.user,
	}
}

const mapActionToProps = {
	fetchCampAnswerByCamp,
	fetchAnswerCountByCamp,
	getQueryCouponForIntro,
	bindCoupon,
	getActCouponSingle,
	receiveMediaCoupon,
	campAnswerlikes,
	getVipInfo,
	getMyQualify,

	getMarketInfo,
	getChannelInfo,

	getEvaluationData,
	getEvaluationList,
	reply,
    removeReply,
	fetchCampListTopic,
	doPay,
	getUserInfo
};

@autobind
class TrainingIntro extends Component {

	data = {
		currentCommentAnswerId: '',
		timer: null,
		channelNo: ''
	};
	state = {
		liveId: '',
		periodList: [...this.props.periodList],
		periodInfo: {},
		currPeriodIndex: -1, // 当前期数ID

		// Tab相关配置
		tagIndex: 0,
		tagList: [
			{
				tagKey: 'training-intro',
				tagName: '训练营介绍',
				dataList: {
					list: [],
					page: 1,
					pageSize: 3,
					isNoMore: false,
					isEnd: false,
				},
			}
		],

		isOnlyMine: 'N',
		orderBy: 'ASC',

		showJobListDialog: false,
		isOpenInputText: '',
		commentInputVal: '',

		currCoupon: '',
		shareKey: '', // 用于判断分享者是否有分销关系
		shareType: '', // 分销类型
		scrolling: 'S',

		replyContent: '',
		currentRelyIndex: '',
		showReplyInput: false,
		replyPlaceholder: '',
		evaluateData: {}, // 评论人数
		hasValidFilter: 'normal', // 只看有效 normal/valid

		userReword: [],	// 当前选中的期数的打卡奖励券
		fixedTabBar: false, // 固定tab-bar
		communityInfo: null, // 社群信息
		groupHasBeenClosed: true, // 關閉社群入口
		isShowGroupDialog: false, // 显示社群弹窗
	}

	async componentDidMount() {
		this.initPeriodInfo()
		this.initTagList()
		this.initShare()
		this.initEvaluteData()
		this.props.getUserInfo()
		this.dispatchGetCommunity();
		// setTimeout(() => {
		// 	this.onSuccessPayment('N', '123123')
		// 	this.enterNewCampStudentInfo('N', '123123')
		// 	this.onCancelPayment()
		// }, 2000)
	}

	componentWillMount() {
		if (typeof(document) != 'undefined') {
			this.data.channelNo = this.props.location.query.pro_cl || getCookie('channelNo') || '';
		}
	}

	async initTagList () {
		const tagList = []
		let answerCount = await this.props.fetchAnswerCountByCamp({
			campId: this.props.campInfo.id,
			onlyPrime: 'allCount'
		})

		if (this.props.campInfo.isShowHomeworkCircle === 'Y' && answerCount > 0) {
			tagList.push({
				tagKey: 'homework',
				tagName: '作业圈子',
				dataList: {
					list: [],
					page: 1,
					pageSize: 20,
					isNoMore: false,
					isEnd: false,
				},
				// 缓存不同数据列表对象
				cacheDataList: {
					// 排序
					'ASC': {
						// 是否只看我的
						'Y': {
							list: [],
							page: 1,
							pageSize: 20,
							isNoMore: false,
							isEnd: false,
						},
						'N': {
							list: [],
							page: 1,
							pageSize: 20,
							isNoMore: false,
							isEnd: false,
						}
					},
					'DESC': {
						'Y': {
							list: [],
							page: 1,
							pageSize: 20,
							isNoMore: false,
							isEnd: false,
						},
						'N': {
							list: [],
							page: 1,
							pageSize: 20,
							isNoMore: false,
							isEnd: false,
						}
					}
				}
			})
		}

		// 是否加入课程列表
		if (this.props.campInfo.isShowCourse === 'Y') {
			tagList.push({
				tagKey: 'course',
				tagName: '课程列表',
				dataList: {
					list: [],
					page: 1,
					pageSize: 20,
					isNoMore: false,
					isEnd: false,
				},
				// 缓存不同数据列表对象
				cacheDataList: {
				}
			})
		}

		if (this.props.campInfo.isShowEvaluate === 'Y') {
			tagList.push({
				tagKey: 'evaluate',
				tagName: '用户评价',
				dataList: {
					list: [],
					page: 1,
					pageSize: 20,
					isNoMore: false,
					isEnd: false,
				},
				// 缓存不同数据列表对象
				cacheDataList: {
					// 有效的
					'valid': {
						list: [],
						page: 1,
						pageSize: 20,
						isNoMore: false,
						isEnd: false,
					},
					'normal': {
						list: [],
						page: 1,
						pageSize: 20,
						isNoMore: false,
						isEnd: false,
					}
				}
			})
		}

		if (tagList.length > 0) {
			let finalTagList = [...this.state.tagList, ...tagList]
			if(finalTagList.length >= 4) {
				finalTagList.map(tag => {
					if(tag.tagName === '训练营介绍') {
						tag.tagName = '简介'
					}
					if(tag.tagName === '作业圈子') {
						tag.tagName = '作业'
					}
					if(tag.tagName === '用户评价') {
						tag.tagName = '评价'
					}
					if(tag.tagName === '课程列表') {
						tag.tagName = '课表'
					}
				})
			}
			this.setState({
				tagList: finalTagList
			})
		}
	}

	initPeriodInfo () {
		if (this.props.periodList.length > 0) {
			this.setPeriodInfo(this.state.periodList[0], 0)
		}
	}

	// 自定义分享
	initShare() {
		let { name, headImage, id } = this.props.campInfo
		let wxqltitle = `我推荐-【${name}】`;
		let shareUrl = window.location.origin + this.props.location.pathname + `?campId=${id}&shareUserId=${getCookie('userId')}`;

		share({
			title: wxqltitle,
			timelineTitle: wxqltitle,
			desc: '点击看好课>>>',
			timelineDesc: wxqltitle, // 分享到朋友圈单独定制
			imgUrl: headImage,
			shareUrl,
		});
	}

	async initEvaluteData() {
		// 获取评分和评价人数
		let res = await this.props.getEvaluationData({
			campId: this.props.campInfo.id,
		})
		if (res.state.code == 0) {
			this.setState({
				evaluateData: res.data
			})
		}
	}


	// 选择当前期数
	async setPeriodInfo (nextPeriodInfo, index) {
		if (nextPeriodInfo.id == this.state.currPeriodId) return

		const { currPeriodIndex, periodInfo, periodList, currCoupon, tagList, tagIndex } = this.state
		const state = {
			currPeriodIndex: index,
		}

		// 存入当前修改的期数信息到列表中
		if (currPeriodIndex !== -1) {
			const _periodList = [...periodList]
			const _periodInfo = {...periodInfo}
			if (currCoupon) {
				_periodInfo.coupon = currCoupon
			}
			_periodList[currPeriodIndex] = _periodInfo
			state.periodList = _periodList
		}

		const { channelId, vipInfo, coupon, marketingInfo, channelInfo } = nextPeriodInfo

		// 新对象添加必要的信息
		if (!vipInfo) {
			const _vipInfo = await this.props.getVipInfo({
				liveId: this.props.campInfo.liveId,
				businessId: channelId
			})
			nextPeriodInfo.vipInfo = _vipInfo
		}
		if (!marketingInfo) {
			const _marketingInfo = await this.props.getMarketInfo(channelId)
			nextPeriodInfo.marketingInfo = _marketingInfo
		}
		if (!channelInfo) {
			const _channelInfo = await this.props.getChannelInfo(channelId)
			nextPeriodInfo.channelInfo = _channelInfo
		}
		// 用球用户的分销关系
		this.getShareUserShareKey(channelId)
		if (this.couponAutoBindTimer) clearTimeout(this.couponAutoBindTimer)
		if (!(nextPeriodInfo.hasBuy === 'Y' || nextPeriodInfo.hasJoin === 'Y' || this.props.power.allowMGLive)) {
			if (!coupon) {
				const couponData = await this.props.getQueryCouponForIntro({
					businessId: channelId,
					businessType: 'channel'
				});

				if (couponData && couponData.codePo) {
					state.currCoupon = {
						...couponData.codePo,
						isReceive: couponData.isGet === 'Y'
					}
				} else {
					state.currCoupon = {}
				}
			} else {
				state.currCoupon = { ...coupon }
			}
		} else {
			state.currCoupon = {}
		}

		if(this.state.tagList[this.state.tagIndex].tagKey == 'course') {
			this.state.tagList[this.state.tagIndex] = {
				tagKey: 'course',
				tagName: '课程列表',
				dataList: {
					list: [],
					page: 1,
					pageSize: 20,
					isNoMore: false,
					isEnd: false,
				},
				// 缓存不同数据列表对象
				cacheDataList: {
				}
			}
			this.setState({
				tagList: [...this.state.tagList]
			}, () => {
				state.periodInfo = nextPeriodInfo
				this.setState(state, async () => {
					this.loadMore()
					this.autoBindCoupon()
					let res = await getUserReword({periodId: this.state.periodInfo.id})
					this.setState({
						userReword: res.dataList || []
					})
				})
			})
		} else {
			state.periodInfo = nextPeriodInfo
			this.setState(state, async () => {
				this.loadMore()
				this.autoBindCoupon()
				let res = await getUserReword({periodId: this.state.periodInfo.id})
				this.setState({
					userReword: res.dataList || []
				})
			})
		}


	}

	/**
	 * 查找用户的分销关系
	 * @param {*} channleId
	 */
	async getShareUserShareKey(channleId) {

		if (this.props.location.query.shareUserId && channleId) {
			let res = await this.props.getMyQualify(channleId, 'channel', 'Y', this.props.location.query.shareUserId)
			this.setState({
				shareKey: get(res, 'data.shareQualifyInfo.shareKey'),
				shareType: get(res, 'data.shareQualifyInfo.type')
			})
		}
	}

	get isBought () {
		return this.state.periodInfo.hasBuy === 'Y'
		|| this.props.power.allowMGLive
	} 

	// 列表数据装载
	async fetchDataList(tagIndex, tagList) {

		const tempTagList = [...tagList]
		const tag = tagList[tagIndex]
		const data = tag.dataList
		if (data.isNoMore) return

		const count = data.page * data.pageSize
		// 当存储数据不满足装载量且没到底，请求增加数据
		if (count > data.list.length && !data.isEnd) {
			switch (tag.tagKey) {
				case 'training-intro':
					const _listByIntro = await this.props.fetchCampAnswerByCamp({
						campId: this.props.campInfo.id,
						onlyPrime: 'Y',
						order: 'ASC',
						orderByVote: 'Y',
						page: {
							page: data.page,
							size: data.pageSize
						}
					})

					const listByIntro = get(_listByIntro, 'data.list') || []
					data.list.push(...listByIntro)
					data.isDisable = true
					data.isEnd = true
					break;
				case 'homework':
					const _listByChannel = await this.props.fetchCampAnswerByCamp({
						campId: this.props.campInfo.id,
						onlyPrime: this.state.isOnlyMine,
						order: this.state.orderBy,
						page: {
							page: data.page,
							size: data.pageSize
						}
					})

					// 获取总数
					const answerCount = this.state.isOnlyMine === 'Y' ? tag.mineCount : tag.allCount
					if (answerCount === undefined) {
						let _answerCount = _answerCount = await this.props.fetchAnswerCountByCamp({
							campId: this.props.campInfo.id,
							onlyPrime: this.state.isOnlyMine
						})
						tag[this.state.isOnlyMine === 'Y' ? 'mineCount' : 'allCount'] = _answerCount
					}

					const listByChannel = get(_listByChannel, 'data.list') || []
					data.list.push(...listByChannel)
					if (listByChannel.length < data.pageSize) data.isEnd = true
					break;
				case 'evaluate':
					const _listByEvaluate = await this.props.getEvaluationList({
						campId: this.props.campInfo.id,
						onlyContent: this.state.hasValidFilter == 'valid' ? 'Y': 'N',
						page: {
							page: data.page,
							size: data.pageSize
						}
					})

					const listByEvaluate = get(_listByEvaluate, 'data.list') || []
					data.list.push(...listByEvaluate)
					if (listByEvaluate.length < data.pageSize) data.isEnd = true
					break;
				case "course":
					let channelId = this.state.periodInfo.channelId
					const _topicList = await this.props.fetchCampListTopic(channelId)
					const topicList = get(_topicList, 'dataList') || []
					data.list.push(...topicList)
					if (topicList.length < data.pageSize) data.isEnd = true
					break;
			}
		}

		if (count >= data.list.length && data.isEnd) {
			data.isNoMore = true
		}
		data.page += 1
		tag.dataList = data

		this.setState({
			tagList: tempTagList
		})
	}

	isLock = false
	async loadMore(next) {
		const {
			tagIndex,
			tagList
		} = this.state

		if (!this.isLock && tagList[tagIndex].dataList) {
			this.isLock = true
			await this.fetchDataList(tagIndex, tagList)
			this.isLock = false
		}

		next && next()
	}

	// 阻止查看我的和排序同时点击
	toggleing = false
	// 仅看我的loadMore
	toggleOnlyMine() {
		const {
			isOnlyMine,
			orderBy,
			tagList,
		} = this.state

		if (this.toggleing) return
		this.toggleing = true

		const tempTagList = [...tagList]
		const tag = tempTagList[1]
		tag.cacheDataList[orderBy][isOnlyMine] = { ...tag.dataList, page: 1, isNoMore: false }

		const _isOnlyMine = isOnlyMine === 'Y' ? 'N' : 'Y'

		tag.dataList = { ...tag.cacheDataList[orderBy][_isOnlyMine] }

		this.setState({
			isOnlyMine: _isOnlyMine,
			tagList: tempTagList
		}, async () => {
			await this.loadMore()
			this.toggleing = false
		})
	}

	// 排序切换
	toggleOrderBy() {
		const {
			isOnlyMine,
			orderBy,
			tagList,
			tagIndex
		} = this.state

		if (this.toggleing) return
		this.toggleing = true

		const tempTagList = [...tagList]
		const tag = tempTagList[tagIndex]
		tag.cacheDataList[orderBy][isOnlyMine] = { ...tag.dataList, page: 1, isNoMore: false }

		const _orderBy = orderBy === 'ASC' ? 'DESC' : 'ASC'

		tag.dataList = { ...tag.cacheDataList[_orderBy][isOnlyMine] }

		this.setState({
			orderBy: _orderBy,
			tagList: tempTagList
		}, async () => {
			await this.loadMore()
			this.toggleing = false
		})
	}

	// 有效评论
	onClickValidFilter() {

		const {
			tagList,
			hasValidFilter,
			tagIndex
		} = this.state

		if (this.toggleing) return
		this.toggleing = true

		const tempTagList = [...tagList]
		const tag = tempTagList[tagIndex]

		const _hasValidFilter = hasValidFilter === 'valid' ? 'normal' : 'valid'

		tag.dataList = {
			list: [],
			page: 1,
			pageSize: 3,
			isNoMore: false,
			isEnd: false
		}

		this.setState({
			hasValidFilter: _hasValidFilter,
			tagList: tempTagList
		}, async () => {
			await this.loadMore()
			this.toggleing = false
		})
	}


	// 点赞
	async toggleFabulous(answer, index) {
		const {
			tagIndex,
			tagList,
		} = this.state

		const tempTagList = [...tagList]
		const _answer = { ...answer }

		_answer.liked = answer.liked === 'Y' ? 'N' : 'Y'

		const res = await this.props.campAnswerlikes({
			status: _answer.liked,
			answerId: _answer.id
		})

		if (res.state && res.state.code === 0) {
			if (_answer.liked === 'Y') {
				_answer.upvoteCount += 1
			} else {
				_answer.upvoteCount -= 1
			}

			tempTagList[tagIndex].dataList.list[index] = { ..._answer }

			this.setState({
				tagList: tempTagList
			})
		}
	}

	tagClick(tagIndex) {
		if (tagIndex === this.state.tagIndex) return
		const tagList = [...this.state.tagList]

		tagList[tagIndex].dataList.page = 1
		tagList[tagIndex].dataList.isNoMore = false

		// 作业圈子埋点
		if (tagList[tagIndex].tagKey == 'homework') {
			typeof _qla != 'undefined' && _qla('click', {
				region: 'intro_learngroup'
			});
		}
		this.setState({
			tagIndex,
			tagList
		}, async () => {
			await this.loadMore()
		})
	}

	// 点击评论 需要区分老师（点评） 还是学员（留言）
	handleComment() {

	}

	handleShowComment(id) {
		this.setState({
			isOpenInputText: 'show'
		}, () => {
			this.refs['comment-input'].focus();
			this.data.currentCommentAnswerId = id;
			setTimeout(() => {
				this.refs['comment-input'].scrollIntoView();
			}, 300);
		});
	}

	// 隐藏发言框
	hideComment() {
		this.setState({
			isOpenInputText: '',
			commentInputVal: ''
		})
	}

	// 发言
	commentInputChangeHandle(e) {
		this.setState({
			commentInputVal: e.target.value
		})
	}

	async sendCommentHandle() {
		if (!this.state.commentInputVal) {
			window.toast('请输入内容');
			return false;
		}
		// let result = await this.props.putComment({
		//     answerId: this.data.currentCommentAnswerId,
		//     content: this.state.commentInputVal
		// })
		this.hideComment();
	}

	// ====================================================== 优惠券相关

	/**
	 * 自动领取优惠券
	 * @param {*} time
	 */
	autoBindCoupon (time = 5000) {
		const {id, useRefId, animation} = this.state.currCoupon
		if (!id || useRefId || animation) return

		// 需要自动绑定的优惠券列表
		const autoCouponListBind = []
		this.couponAutoBindTimer = setTimeout(() => {

			autoCouponListBind.push(this.state.currCoupon)

			autoCouponListBind.forEach(({belongId, businessType, id, couponType}) => {

				this.bindReceiveCoupon({
					businessId: belongId,
					businessType: businessType,
					couponId: id,
					couponType,
					autobind: true
				})
			})

		}, time);
	}

	async bindReceiveCoupon({businessId, businessType, couponId, couponType, autobind}){
		const _couponType = couponType
		let res = ''
		if (_couponType === 'ding_zhi') {
			res = await this.props.getActCouponSingle({promotionId: couponId})
		} else if (_couponType === 'relay_channel') {
            res = await this.props.receiveMediaCoupon({codeId: couponId})
        } else {
			res = await this.props.bindCoupon({
				businessId,
				businessType,
				couponId: couponId,
				from: 'camp'
			})
		}

		if(res.state.code === 0){
			window.toast('领取成功');

			setTimeout(() => {
				this.setState({
					currCoupon: {
						...this.state.currCoupon,
						animation: true,
						autoBind: autobind
					}
				})
			}, 1000);
		} else {
			window.toast(res.state.msg || '网络出错，请稍后再试');
		}
	}

	// 展示优惠券
	showCoupon() {
		this.actCouponDialogRef.showCoupon(this.state.currCoupon)
	}

	// @throttle(300)
	scrollingFunc(e) {
		// 处理是否固定tabbar
		this.processTabBar()
		// 懒加载视频
		this.initLazyVideoLinstener()
		// this.setState({
		// 	scrolling: 'Y',
		// });
		// clearTimeout(this.data.timer)
		// this.data.timer = setTimeout(() => {
		// 	this.setState({
		// 		scrolling: 'S',
		// 	});
		// }, 1000)
	}

	@throttle(300)
	processTabBar() {
		let ele = document.querySelector('.tab-container .tab-bar')
		if(ele) {
			this.setState({
				fixedTabBar: (ele && ele.getBoundingClientRect().top <= 0)
			})
		}
	}

	// ======================================================

	enterCourse (channelId, isAutoPay) {
		if (!channelId) {
			window.toast('训练营还没创建期数哦，请先创建一期课')
			return
		}
		let url = `/wechat/page/channel-intro?channelId=${channelId}&channelType=camp`

		if (isAutoPay) {
			url = url + '&autopay=Y'

			if (this.state.shareKey) {
				if (this.state.shareType == 'channel') {
					url = url + '&shareKey=' + this.state.shareKey
				} else if (this.state.shareType == 'live') {
					url = url + '&lshareKey=' + this.state.shareKey
				} else {
					url = url + '&shareKey=' + this.state.shareKey
				}
			}
		}

		window.sessionStorage && window.sessionStorage.setItem('trace_page', `training-intro`)
		locationTo(url)
	}

    /************************* 视频地址转换 *****************************/
    // 待加载视频列表
    lazyVideos = [];

    getChildContext() {
        return {
            lazyVideo: {
                push: this.pushVideoToLazyVideos,
                remove: this.removeVideoToLazyVideos,
            }
        }
    }

    pushVideoToLazyVideos(item) {
        if (!this.refs.detailsScroll) {
            this.lazyVideos.push(item);
            return;
        }

        if (!this.isVideoFetch(findDOMNode(this.refs.detailsScroll), item)) {
            this.lazyVideos.push(item);
        }
    }

    removeVideoToLazyVideos(id) {
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

	replyHandle (index, target) {
		this.refs['reply-input'].focus();
		const {
			tagIndex,
			tagList,
		} = this.state

		let userName = tagList[tagIndex].dataList.list[index].userName
		this.setState({
			currentRelyIndex: index,
			replyContent: '',
			replyPlaceholder: `回复：${userName}`,
			showReplyInput: true
		}, () => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        });
	}

	changeReplyContent(e){
		if(e.currentTarget.value.length > 500) return false;
		this.setState({
			replyContent: e.currentTarget.value
		});
	}


	async removeReplyHandle (index) {
		this.setState({
			currentRelyIndex: index,
		})
        const { tagIndex, tagList } = this.state
		const evaluationItem = tagList[tagIndex].dataList.list[index];

        const res = await this.props.removeReply({evaluateId: evaluationItem.id})
        if (res.state.code == 0) {
            this.updateEvaluationList({
                replyContent: '',
                replyType: 'N',
            });
        } else {
			window.toast(res.state.msg);
        }
	}

	async sendReplyHandle () {
		if(this.state.replyContent) {
			const { tagIndex, tagList, currentRelyIndex } = this.state
			const evaluationItem = tagList[tagIndex].dataList.list[currentRelyIndex];

			const res = await this.props.reply({
				evaluateId: evaluationItem.id,
				replyContent: this.state.replyContent
            });
            if (res.state.code == 0) {
                this.updateEvaluationList({
                    replyContent: this.state.replyContent,
                    replyType: 'Y',
                });

                this.setState({
                    replyContent: '',
                    showReplyInput: false
                });
            } else {
                window.toast(res.state.msg);
            }
		}else{
			window.toast('请输入回复内容！');
		}
	}

	// 更新评论
	updateEvaluationList (params) {
		const { tagIndex, tagList, currentRelyIndex } = this.state
		const tempTagList = [...tagList]

		const tag = tempTagList[tagIndex]
		const data = tag.dataList

		data.list[currentRelyIndex] = {
			...data.list[currentRelyIndex],
			replyType: params.replyType,
			replyContent: params.replyContent
		}

		tempTagList[tagIndex].dataList.list[currentRelyIndex] = data.list[currentRelyIndex]
		this.setState({
			tagList: tempTagList
		})
	}

    /************************* 视频地址转换 *****************************/

	showRewardCard(item, index) {
		this.refs.rewardCardDialog.show(item, index)

	}

	onClickTopicItem = async (topic, isLock = false) => {
		locationTo(`/topic/details?topicId=${topic.id}${this.props.location.query.auditStatus ? "&auditStatus=" + this.props.location.query.auditStatus : ""}`)
	}

	// 支付失败回调
	async onCancelPayment() {
		this.refs.payFailDialog.show()
		// let isBindThirdResult = await getLiveAdmin(this.state.periodInfo.liveId)
		// let isSubscribeResult = await getIsSubscribe(this.state.periodInfo.liveId)
		//
		// let liveLevel = get(isBindThirdResult, 'liveLevel')
		// let isBindThird = get(isBindThirdResult, 'isBindThird')
		// let isSubscribe = get(isSubscribeResult, 'isSubscribe')
		// try {
		// 	const cancelPayTexts = [
		// 		{
		// 			text: '亲，你真的忍心放弃吗？长按下方二维码关注，可找聊妹进一步了解课程内容↓ ↓ ↓',
		// 			channel: 'channelCancelPayA',
		// 		},
		// 		{
		// 			text: '亲，你真的忍心放弃吗？长按下方二维码关注，可以获取更多优质大V课程，还有神秘惊喜哦↓ ↓ ↓',
		// 			channel: 'channelCancelPayB',
		// 		},
		// 		{
		// 			text: '亲，你真的忍心放弃吗？长按下方二维码关注，聊妹为你打造量身课程，还可以和聊妹咨询哦！',
		// 			channel: 'channelCancelPayC',
		// 		},
		// 	];
		// 	if (liveLevel === 'normal' && isBindThird === 'N') {
		// 		// 已经关注千聊就不跳转
		// 		if (isSubscribe) {
		// 			return;
		// 		}
		//
		// 		const randomIndex = get(this.props, 'userInfo.userId', '0').slice(-1) % 3;
		// 		eventLog({
		// 			category: 'cancelPayText',
		// 			action: cancelPayTexts[randomIndex].channel,
		// 		});
		//
		// 		locationTo(`/wechat/page/focus-ql?redirect_url=${encodeURIComponent(window.location.href)}&channel=${cancelPayTexts[randomIndex].channel}&liveId=${this.state.periodInfo.liveId}&channelId=${this.state.periodInfo.channelId}`);
		// 	}
		// } catch (e) {
		// 	console.error(e);
		// }

	}

	// 支付成功后回调
	async onSuccessPayment(payFree, orderId = '') {
		// 更新支付后的状态
		let targetPeriod = this.state.periodList[this.state.currPeriodIndex]
		targetPeriod.hasBuy = 'Y'
		this.state.periodInfo.hasBuy = 'Y'
		this.setState({
			periodInfo: {...this.state.periodInfo},
			periodList: [...this.state.periodList]
		})

		// 关注二维码逻辑
		let communityInfo = {}
		let qrUrl = '';
		let channel = ''
		if (payFree === 'Y') {
			channel = 'subAfterSignB'
		} else {
			channel = 'subAfterSignA'
		}
		let params = {
			channelId: this.state.periodInfo.channelId
		}
		params.isNewCamp = true
		// params.isOfficialLive = getVal(this.data, 'liveConfig.isOfficialLive', false);
		// 延迟1秒后再去请求二维码，后端的回调太慢，先临时兼容后端的bug
		sleep(1000);
		params.campLiveId = this.props.campInfo.liveId
		qrUrl = await subAterSign(channel, params.campLiveId, params)

		// 跳转页面
		if (!qrUrl) {
			await this.enterNewCampStudentInfo()
		} else if (qrUrl || communityInfo.communityCode) {
			locationTo(`/wechat/page/new-finish-pay?liveId=${this.props.campInfo.liveId}&payFree=${payFree}${qrUrl ? `&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}` : ''}&title=${encodeURIComponent(this.state.periodInfo.name)}${communityInfo.communityCode ? '&communityCode=' + communityInfo.communityCode + '&liveId=' + params.campLiveId : ''}`)
			return
		} else {
			await this.enterNewCampStudentInfo()
		}
	}

	async enterNewCampStudentInfo() {
		let res = await getPeriodByChannel(this.state.periodInfo.channelId)

		// 先判断用户是否加入了训练营 再判断用户是否有答应公约 最后跳学习页面
		if (res.state.code == 0 && res.data.isJoinCamp == 'N') {
			await newJoinPeriod(this.state.periodInfo.channelId)
			locationTo(`/wechat/page/training-student-info?channelId=${this.state.periodInfo.channelId}`)
		} else {
			let userInfo = await getCampUserInfo(this.state.periodInfo.channelId)
			if (userInfo.state.code == 0 && !userInfo.data.campUserPo.contractTime) {
				locationTo(`/wechat/page/training-student-info?channelId=${this.state.periodInfo.channelId}`)
			} else {
				locationTo(`/wechat/page/training-learn?channelId=${this.state.periodInfo.channelId}`)
			}
		}
	}

	async dispatchGetCommunity() {
		const res = await getCommunity(this.props.campInfo.liveId, "training", this.props.campInfo.id);
		if(res) {
			this.setState({
				communityInfo: res
			});
			this.getGroupShow();
		}

	}

	// 判断是否显示社群入口
	getGroupShow() {
		if(window && window.sessionStorage) {
			let communityList = window.sessionStorage.getItem('SHOW_COMMUNITY_LIST_INTRO');
			if(!communityList) {
				communityList = "[]";
			}
			try {
				let communityRecord = JSON.parse(communityList).includes(`${this.props.campInfo.liveId}_${this.props.campInfo.id}`);
				if(!communityRecord){
					this.setState({
						groupHasBeenClosed: false
					})
				} 
			} catch (error) {
				console.log(error);
			}
		};
	}

	onGroupEntranceClose() {
		this.setState({
			groupHasBeenClosed: true
		});
		if(window && window.sessionStorage) {
			let communityList = window.sessionStorage.getItem('SHOW_COMMUNITY_LIST_INTRO');
			if(!communityList) {
				communityList = "[]";
			}
			try {
				communityList = JSON.parse(communityList);
				let hasRecord = communityList.includes(`${this.props.campInfo.liveId}_${this.props.campInfo.id}`);
				if(hasRecord === false) {
					communityList.push(`${this.props.campInfo.liveId}_${this.props.campInfo.id}`);
				}
				window.sessionStorage.setItem('SHOW_COMMUNITY_LIST_INTRO', JSON.stringify(communityList));
			} catch (error) {
				console.log('ERR',error);
			}
		};
	}

	render() {
		const { campInfo } = this.props
		const {
			periodList,
			periodInfo,
			tagList,
			tagIndex,
			isOnlyMine,
			orderBy,
			currPeriodIndex,
			currCoupon,
			scrolling,
		} = this.state
		let {
			headImgList,
			authNum,
			startTime,
			signupEndTime
		} = periodInfo
		const tag = tagList[tagIndex]
		const data = tag.dataList
		const list = data.list.slice(0, data.page * data.pageSize)
		return (
			<Page title={campInfo.name} className='training-intro-wrap'>

				<ScrollToLoad
					ref="detailsScroll"
					className="scroll-container"
					loadNext={this.loadMore}
					// disable={!data || data.isDisable}
					noMore={data && data.isNoMore}
					scrollToDo={this.scrollingFunc}
					notShowLoaded={data && list.length === 0 && data.isEnd}
					toBottomHeight={50}
				>
					<div className="training-header">
						<img className="head-icon" src={`${imgUrlFormat(campInfo.headImage, '@750w_469h_1e_1c_2o')}`} />
						<div className="learn-num">累计已有：{campInfo.campAuthNum}学员入营学习</div>
					</div>
						{/* 限时特价 */}
						{
							periodInfo.marketingInfo && (
								<SpecialsCountDown
									channelId={periodInfo.channelId}
									marketingInfo={periodInfo.marketingInfo}
									chargeConfigs={periodInfo.channelInfo.chargeConfigs || []}
									isBought={this.isBought}
									ref={el => this.specialsCountDownEle = el}
								/>
							)
						}

					{/* 期数信息展示 */}
					{
						periodList.length > 0 && (
							<React.Fragment>
								<div className="period-wrap">
									<div className="period-ul">
										{
											periodList.map((item, index) => {
												return (
													<div className={`period-li ${currPeriodIndex == index ? 'active' : ''}`} key={`period-${index}`} onClick={() => this.setPeriodInfo(item, index)}>
														<div className="period-name">{item.name}</div>
														<div className="period-num"> {formatDate(item.startTime, 'M月d日')} &nbsp;开营</div>
													</div>
												)
											})
										}
									</div>
								</div>
								{
									periodInfo.needSignIn == 'Y' && periodInfo.rewardType === 'refund' && (
										<div className="cash-back-tips">
											<p>坚持打卡{periodInfo.refundAffairNum}天，全额返学费</p>
											<span className="icon-description-rule" onClick={() => { this.setState({isShowCashBackTips: true}) }}></span>
										</div>
									)
								}
								<div className="joined-wrap">
									<div className="pics">
										{
											headImgList && headImgList.length && headImgList.slice(0, 3).map((item, index) => (
												<div key={`joined-pics${index}`} className="pic" style={{
													backgroundImage: `url(${imgUrlFormat(item, '@42w_42h_1e_1c_2o')})`,
													left: '-' + (index * 18) + "px"
												}}
												/>
											))
										}
									</div>
									{
										campInfo.isShowAuthNum == 'Y' && authNum > 0 && (
											<div className="num-tip">
												已有{authNum}人参加，快来一起成长!
											</div>
										)
									}
								</div>
								<div className="training-time">
									<div className="stop-time">
										<div>
											<div className="tip">报名截止: </div>
											<div className="time">{formatDate(signupEndTime, 'yyyy-MMMM-dd hh:mm')}</div>
										</div>
									</div>
										<div className="line"></div>
									<div className="open-time">
										<div className="tip">开营时间: </div>
										<div className="time">{formatDate(startTime, 'yyyy-MMMM-dd hh:mm')}</div>
									</div>
								</div>

								{/* 如果课程配置了打卡奖励，要展示在训练营介绍页 */}
								{
									(this.state.userReword.length > 0 && !(periodInfo.needSignIn == 'Y' && periodInfo.rewardType === 'refund')) &&
									<div className="reward-list">
										<div className="wrapper">
											{
												this.state.userReword.map((item, index) => {
													if(index < 5) {
														return (
															<div className="item noSelect" onClick={() => this.showRewardCard(item, index)}>
																<div className="title">
																	<span className="money">￥{item.money}</span><span>优惠券</span>
																</div>
																<div className="desc">打卡满{item.affairNum}天奖励</div>
															</div>
														)
													}
													else {
														return null
													}
												})
											}
										</div>
									</div>
								}

								<div className="bg-bar"></div>
							</React.Fragment>
						)
					}

					{/* tab内容 */}
					<TabContainer
						className="tab"
						tags={tagList}
						currTagIndex={tagIndex}
						tagClick={this.tagClick}
						evaluationData={this.state.evaluateData}
					>

						{
							[tagList[tagIndex]].map((item) => {
								switch (item.tagKey) {
									case 'training-intro':
										return (
											<React.Fragment key={item.tagKey} >

												<div className="p-intro-title">
													<div className="excellent-homework">简介</div>
													{
                                                        this.state.periodInfo.discountStatus === 'UNLOCK' ?
                                                            null
                                                            :
                                                            (
                                                                currCoupon && currCoupon.id && (
                                                                    <CouponBtn
                                                                        currCoupon={currCoupon}
                                                                        showCoupon={this.showCoupon}
                                                                        bindReceiveCoupon={this.bindReceiveCoupon}
                                                                    />
                                                                )
                                                            )
													}
												</div>
												
												<div className="camp-intro-content">
													<XiumiEditorH5 content={htmlTransferGlobal(campInfo.desc)} />
												</div>

												<IntroGroupBar
													padding="0.26667rem 0.53333rem"
													communityInfo={this.state.communityInfo} 
													hasBeenClosed={this.state.groupHasBeenClosed}
													isBuy={this.isBought}
													allowMGLive={this.props.power.allowMGLive}
													onClose={this.onGroupEntranceClose}
													onModal={() => {this.setState({isShowGroupDialog: true})}}
												/>
												
												<div className="excellent-homework">购买须知</div>
												<div className="p-intro-content">
													<p>1. 该课程为训练营课程，按课程计划定期更新，可反复回听</p>
													<p>2. 社群服务必须在购买期数开营时间前入群才可享受，逾期未入群视为自动放弃社群服务权利</p>
													<p>3. 购课后关注我们的服务号，可在菜单里进入听课</p>
													<p>4. 该课程为虚拟内容服务，购买成功后概不退款，敬请原谅</p>
													<p>5. 该课程听课权益跟随支付购买微信账号ID，不支持更换（赠礼课程除外）</p>
													<p>6. 如有其它疑问，可在具体期数的课程介绍页，点击左下角“咨询”按钮，与内容供应商沟通后再购买</p>
												</div>

												{
													campInfo.isShowPastHomework == 'Y' &&
													<React.Fragment>
														<div className="excellent-homework">优秀作业展示</div>
														{
															list.length > 0 ?
															<React.Fragment>
																<StudentTask
																	data={list}
																	toggleFabulous={this.toggleFabulous}
																	showComment={this.handleShowComment}
																	/>
															</React.Fragment>
															:
															<div className="list-empty list-two">暂无内容~</div>

														}
													</React.Fragment>
												}
											</React.Fragment>
										)
									case 'homework':
										return (
											<React.Fragment key={item.tagKey} >
												<div className="operation-block">
													<p className={`only-mine ${isOnlyMine === 'Y' ? 'select' : ''}`} onClick={this.toggleOnlyMine}>
														只看精华 <span className="homework-num">共{isOnlyMine === 'Y' ? tag.mineCount : tag.allCount}份作业</span>
													</p>
													<p className={`order-by ${orderBy}`} onClick={this.toggleOrderBy}>{orderBy === 'ASC' ? '正序' : '倒序'}</p>
												</div>
												{
													list.length > 0 || !data.isEnd ? (
														<StudentTask
															data={list}
															toggleFabulous={this.toggleFabulous}
															showComment={this.handleShowComment}
														/>
													) : <div className="list-empty list-two">暂无内容~</div>
												}
											</React.Fragment>
										)
									case 'evaluate':
										return (
											<React.Fragment key={item.tagKey} >
												{/* 用户评价 */}
												<Evaluate
													evaluationData={this.state.evaluateData}
													evaluationListObj={list}
													courseType="channel"
													isAuth={this.props.power.allowMGLive}
													onClickValidFilter={this.onClickValidFilter}
													replyHandle={this.replyHandle}
													removeReplyHandle={this.removeReplyHandle}
													hasValidFilter={this.state.hasValidFilter}
												/>
											</React.Fragment>
										)
									case 'course':
										return (
											<React.Fragment key={item.tagKey} >
												<TopicList
													list={list}
													onClickItem={this.onClickTopicItem}
												/>
											</React.Fragment>
										)
								}
							})
						}

					</TabContainer>

				</ScrollToLoad>

				{/* 固定tab */}
				{
					tagList && tagList.length > 0 && this.state.fixedTabBar &&
					<div className="tab-bar fixed">
						{
							tagList.map((item, index) => (
								<div
									key={item.tagKey}
									className={`tab-item ${tagIndex === index ? 'activity' : ''}`}
									onClick={() => { this.tagClick(index) }}
								>
									<span>{item.tagName}</span>
									{
										item.tagKey == "evaluate" && this.state.evaluationData && this.state.evaluationData.evaluateNum > 0 &&
										<span className="tab-num">{this.state.evaluationData.evaluateNum > 999 ? '999+': this.state.evaluationData.evaluateNum}</span>
									}
								</div>
							))
						}
					</div>
				}

				{/* 评论框 */}
				<div className={`comment-wrapper ${this.state.isOpenInputText}`} onClick={this.hideComment}>
					<div className="comment-container" onClick={(e) => e.stopPropagation()}>
						<div className={`comment-box`}>
							<div className="input-wrap">
								<input type="text" ref="comment-input" placeholder="输入评论内容"
									value={this.state.commentInputVal}
									onFocus={this.commentInputFocusHandle}
									onChange={this.commentInputChangeHandle} />
							</div>
							<div className="send-btn" onClick={this.sendCommentHandle}>发送</div>
						</div>
					</div>
				</div>

				{/* 活动优惠券弹窗 */}
				<ActCouponDialog
					ref={ref => ref && (this.actCouponDialogRef = ref.getWrappedInstance())}
					location={this.props.location}
					onDisplayChange={isShow => isShow && this.setState({ _isShowActCouponDialog: isShow })}
					businessId={periodInfo.channelId}
					businessType={'channel'}
				/>

				{/* 底部按钮 */}
				<BuyBtn
					className="bottom-sign-btn"
					periodInfo={periodInfo}
					enterCourse={this.enterCourse}
					isBought={this.isBought}
					showDiscount={this.props.discountExtendPo.showDiscount || periodInfo.discountStatus == 'UNLOCK' ||  false}
					campInfo={campInfo}
					hasJoin={this.state.periodInfo.hasJoin}
					allowMGLive={this.props.power.allowMGLive}
				/>
				{/*{*/}
				{/*	(this.isBought || !periodInfo.channelId) ?*/}
				{/*		<BuyBtn*/}
				{/*			className="bottom-sign-btn"*/}
				{/*			periodInfo={periodInfo}*/}
				{/*			enterCourse={this.enterCourse}*/}
				{/*			isBought={this.isBought}*/}
				{/*			showDiscount={this.props.discountExtendPo.showDiscount || periodInfo.discountStatus == 'UNLOCK' ||  false}*/}
				{/*			campInfo={campInfo}*/}
				{/*		/>*/}
				{/*		:*/}
				{/*		<CoursePurchase*/}
				{/*			getInstance={(coursePurchase) => {*/}
				{/*				this.coursePurchase = coursePurchase;*/}
				{/*			}}*/}
				{/*			channelNo={this.data.channelNo}*/}
				{/*			enterCourse={this.enterCourse}*/}
				{/*			isAuth={this.isBought}*/}
				{/*			isCamp={true}*/}
				{/*			channelInfo={periodInfo.channelInfo.channel}*/}
				{/*			chargeInfo={periodInfo.channelInfo.chargeConfigs[0] || {}}*/}
				{/*			marketingInfo={periodInfo.marketingInfo}*/}
				{/*			chargeConfigs={periodInfo.channelInfo.chargeConfigs || []}*/}
				{/*			showDiscount={this.props.discountExtendPo.showDiscount || periodInfo.discountStatus == 'UNLOCK' ||  false}*/}
				{/*			sysTime={this.props.sysTime}*/}
				{/*			doPay={this.props.doPay}*/}
				{/*			onCancelPayment={this.onCancelPayment}*/}
				{/*			onSuccessPayment={this.onSuccessPayment}*/}
				{/*		/>*/}
				{/*}*/}

				<div className={`reply-input-box${this.state.showReplyInput ? ' show' : ''}`} ref="reply-input-box">
                    <div className="input-wrap">
                        <CommonInput type="text" ref="reply-input" noIntoView={true} placeholder={this.state.replyPlaceholder} value={this.state.replyContent} onChange={this.changeReplyContent} onBlur={() => {!this.state.replyContent && this.setState({showReplyInput: false})}} onFocus={() => setTimeout(() => findDOMNode(this.refs['reply-input-box']).scrollIntoView(),300)} />
                    </div>
                    <span
                        className={ `send-btn on-log on-visible${this.state.replyContent ? '' : ' disable'}`}
                        data-log-region="channel-comment-send-btn"
                        data-log-pos={this.state.currentRelyIndex}
                        onClick={this.state.replyContent ? this.sendReplyHandle : () => {}}>发送</span>
                </div>

				<OperateMenu scrolling={scrolling} locationType="living" liveId={this.props.campInfo.liveId}/>

				<CashBackRuleDialog
					show={this.state.isShowCashBackTips}
					refundAffairNum={periodInfo && periodInfo.refundAffairNum || 0}
					onClose={() => {this.setState({isShowCashBackTips: false})}}
					/>

				<RewardCardDialog ref='rewardCardDialog' list={this.state.userReword || []}/>

				<PayFailDialog
					ref="payFailDialog"
					failPayUrl={this.state.periodInfo.redirectUrl}
					onBuyBtnClick={() => {
						this.coursePurchase.buyBtnClickHandle()
					}}/>
					
				<MiddleDialog
					show={this.state.isShowGroupDialog}
					title = "什么是课程社群?"
					buttons="cancel"
					buttonTheme="line"
					cancelText="我知道了"
					onBtnClick={() => {this.setState({
						isShowGroupDialog: false
					})}}
					className="group-entrance-understand-dialog"
				>
					<div className="content">
						<p>
							课程社群是直播间老师为了提升报名学员的学习效率，所设置的学习社群。
						</p>
						<br />
						<p>
							当你加入社群后，将能获得包括<span>上课提醒、学习氛围、和老师对话、反馈学习成果</span>等深度服务，帮助到你更好吸收所学知识。
						</p>
						<br />
						<p>
							马上报名课程，即可加入课程社群~
						</p>
					</div>
				</MiddleDialog>
            
			</Page>
		)
	}
}
TrainingIntro.childContextTypes = {
	sysTime: PropTypes.number,
	lazyVideo: PropTypes.object
};

module.exports = connect(mapStateToProps, mapActionToProps)(TrainingIntro);
