/**
 *
 * @author Dylan
 * @date 2019-05-24
 */
import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import classNames from "classnames";
import {filterOrderChannel, formatMoney, locationTo} from "components/util";

import TryListenBtn from './components/try-listen-btn';
import BuyBtn from './components/buy-btn';
import openApp from "components/open-app";
import {eventLog} from "components/log-util";
import {request} from "common_actions/common";
import {get} from "lodash";
import {withRouter} from "react-router";
import PaymentDetailsDialog from "./components/payment-details-dialog";
import CouponLists from "./components/coupon-lists";
import CouponBtn from "./components/coupon-btn";
import { Confirm } from 'components/dialog';

@withRouter
@autobind
export default class CoursePurchase extends Component {

	constructor(props) {
		super(props)
		const {getInstance} = props;
		if (typeof getInstance === 'function') {
			getInstance(this); // 在这里把this暴露给`parentComponent`
		}
	}

	state = {
		couponList: [],
		curTopicCoupon: null,
		curChannelCoupon: null,
		curCoupon: {},
		// 是否弹出支付框
		isOpenPayDialog: false,
		// 是否弹出优惠券框
		showCouponList: false,
		activeChargeIndex: 0, // 当前选中的付费类型
		isCoupons: false,	// 显示当前单课优惠券列表
		isOnce: false,
	};

	data = {
		channelId: this.props.channelInfo.channelId,
		portalContainer: this.props.portalContainer || '.portal-container',
		missionDetail: {}, // 拉人返学费数据
	};

	get channelId () {
		return this.props.channelInfo.channelId
	}

	get chargeInfo() {
		return this.props.chargeInfo
	}

	get chargeConfig() {
		if (this.props.chargeConfigs.length) {
			return this.props.chargeConfigs.filter(config => {
				return config.status === 'Y';
			})[0] || null
		} else {
			return null;
		}
	}

	/**
	 * 是否免费系列课
	 */
	get isFree() {
		return this.chargeConfig && this.props.channelInfo.chargeType === 'absolutely' && this.chargeConfig.amount === 0;
	}

	/**
	 * 更新单课优惠信息和系列课优惠信息
	 * @param {*} param0
	 */
	updateCouponInfo ({ topicCoupon, channelCoupon }) {
		this.setState({
			curTopicCoupon: topicCoupon || null,
			curChannelCoupon: channelCoupon || null
		});
	}

	updateCouponInfoId ({couseType, useRefId}) {
		if (action.couseType === 'channel') {
			const curChannelCoupon = {...this.state.curChannelCoupon};
			curChannelCoupon.useRefId = useRefId;
			this.setState({
				curChannelCoupon
			});
		} else {
			const curTopicCoupon = {...this.state.curTopicCoupon};
			curTopicCoupon.useRefId = useRefId;
			this.setState({
				curTopicCoupon
			});
		}
	}

	updateCurChannelCoupon(coupon){
		this.setState({
			curCoupon: coupon
		})
	}

	updateCurChannelCouponId(useRefId){
		const curCoupon = {...this.state.curCoupon};
		curCoupon.useRefId = useRefId;
		this.setState({
			curCoupon
		});
	}

	// 获取用户优惠券列表
	async getCoupons() {
		const [status, percent] = await Promise.all([
			// 判断该课是否是官方直播间的课或者平台分销的课
			this.officalOrPlatform(),
			// 官方直播间或者平台分销的直播间的比例
			this.officalOrPlatformRate()
		]);
		// 获取当前系列课所有的优惠券
		const { data: { couponList } } = await request({
			url: '/api/wechat/transfer/couponApi/coupon/myCouponList',
			body: {
				businessType: 'channel',
				businessId: this.channelId,
				liveId: this.props.channelInfo.liveId,
				status,
				percent
			}
		});
		const arr = couponList.filter((item) => {
			// 如果是会员券且会员失效 则不展示
			if (item.couponType === 'member' && !this.props.isMember) {
				return false
			}
			// 转载课过滤掉平台折扣券
			if (this.isRelay && item.couponType !== 'relay_channel') {
				return false
			}
			item.useRefId = item.couponId
			item.money = (Number(item.money) * 1000) / 10;
			item.minMoney = (item.minMoney || 0) * 100
			return true
		});
		this.setState({
			couponList: arr
		})
	}

	// 判断该课是否是官方直播间的课或者平台分销的课
	async officalOrPlatform() {
		return new Promise(async (resolve) => {
			let psCh = (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : ''
			let isQlLive = await this.props.isQlLive()
			if (isQlLive === 'Y') {
				resolve('qlLive')
			} else if (!this.data.missionDetail.missionId && psCh && this.props.platformShareRate) {
				resolve('platform')
			} else {
				resolve('')
			}
		})
	}

	// 官方直播间或者平台分销的直播间的比例
	async officalOrPlatformRate() {
		return new Promise(async (resolve) => {
			let psCh = (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : ''
			let isQlLive = await this.props.isQlLive()
			// 如果是官方直播间，就拿官方直播间的比例，是平台分销的课就拿平台分销的比例，官方直播间和平台分销是互斥的
			if (isQlLive === 'Y') {
				await request({
					url: '/api/wechat/transfer/h5/live/qlLiveSharePercent',
					body: { businessId: this.channelId, businessType: 'channel' }
				}).then(res => {
					resolve(get(res, 'data.sharePercent', 0))
				})
			} else if (this.data.missionDetail && !this.data.missionDetail.missionId && psCh && this.props.platformShareRate) {
				resolve(this.props.platformShareQualify)
			} else {
				resolve(0)
			}
		})
	}

	// 购买点击打开弹窗
	async buyBtnClickHandle() {

		// 判断是否已经购买了相同的系列课
		if (this.props.alreadyBuyChannelId && (this.props.alreadyBuyChannelId !== this.channelId)) {
			this.haveBoughtDialogRef.show(this.channelId, true);
			return;
		}

		// 如果是一元购直接去系列课介绍页支付
		if(this.props.chargeInfo.discountStatus === 'UNLOCK') {
			// this.payChannel();
			this.props.enterCourse()
			return
		}

		await this.getCoupons()

		let appCoupon;

		let isHaveAvailableCoupon = false;
		let couponList = this.state.couponList;
		if (couponList && couponList.length > 0) {
			const charge = this.props.chargeInfo;
			let price = (this.props.discountExtendPo.showDiscount ? charge.discount : charge.amount) * 100;
			// 判断是否有平台通用券
			const isHavePlatformCoupon = couponList.find(i => i.businessType === 'discount')

			const availableList = [];
			couponList.filter(coupon => {
				if (!availableList.length && coupon.couponType === 'app' && !appCoupon) appCoupon = coupon;

				if (coupon.minMoney <= price
					&& (!coupon.overTime || this.props.sysTime < coupon.overTime )
					&& coupon.couponType !== 'app') availableList.push(coupon);
			})
			if (isHavePlatformCoupon || availableList.length > 0) isHaveAvailableCoupon = true
		}

		/**
		 * 首张可用券是app券，弹提示不弹选券窗
		 * 其他情况，弹选券窗
		 *
		 * 取消过提示则不再弹
		 */
		if (appCoupon) {
			if (!this._hasShowAppCouponGuide && await new Promise(resolve => {
				this._hasShowAppCouponGuide = true;

				typeof _qla !== 'undefined' && _qla('visible', {
					logs: JSON.stringify([
						{
							region: 'app-coupon-guide'
						}
					])
				});

				window.simpleDialog({
					msg: <div style={{wordBreak: 'break-word'}}>你有未使用的APP专享优惠券，可抵扣<span style={{color: '#f73657'}}>{formatMoney(appCoupon.money)}元</span>，请前往APP使用</div>,
					buttons: 'cancel-confirm',
					confirmText: '去APP使用',
					cancelText: '不用优惠券',
					onConfirm: () => {
						openApp({
							h5: location.href,
							ct: 'appzhuanshu',
							ckey: 'CK1422980938180',
						});
						resolve(true);
						typeof _qla !== 'undefined' && _qla('click', {
							region: 'app-coupon-guide-confirm'
						});
					},
					onCancel: () => {
						resolve(false);
						typeof _qla !== 'undefined' && _qla('click', {
							region: 'app-coupon-guide-cancel'
						});
					},
				})
			})) return;
		}

		// 有appCoupon却不使用，就原价买吧
		if (appCoupon) {
			this.payChannel();
			return;
		}

		// 是否打开二次确认弹框 （ 不是免费 | 按时收费 | 有优惠券 | 会员折扣 | 特价 ）
		if (
			!this.props.isFree &&
			(this.props.channelInfo.chargeType === 'flexible' && this.props.chargeConfigs.length > 1) ||
			(this.props.isMember && this.props.isMemberPrice && this.props.tracePage !== "coral") ||
			this.props.discountExtendPo.showDiscount ||
			isHaveAvailableCoupon
		) {
			this.setState({
				isOpenPayDialog: true,
			});
		} else {
			this.payChannel();
		}
	}

	// 系列课支付
	payChannel(chargeConfigId, amount) {
		// 判断是否购买了其他转载课 则不重复购买
		if (this.props.alreadyBuyChannelId && (this.props.alreadyBuyChannelId !== this.channelId)) {
			this.haveBoughtDialogRef.show();
			return;
		}

		// 如果没填过表且不是跳过填表状态 则需要填表
		if (this.props.notFilled == 'Y' && sessionStorage.getItem("passCollect") != this.props.channelInfo.liveId) {
			locationTo(`/wechat/page/live-studio/service-form/${this.props.channelInfo.liveId}?type=channel&channelId=${this.channelId}&couponId=${this.props.channelCouponStatus.couponId || this.data.targetCouponId || ''}${amount === 0 ? '&auth=Y' : ''}`);
			return;
		}

		let couponId = '';
		let couponType = '';
		let curCoupon = this.state.curCoupon;
		if (curCoupon.couponType !== 'app' && curCoupon.useRefId) {
			couponId = curCoupon.useRefId;
			couponType = curCoupon.couponType;
		}

		// 一元解锁的情况下
		if (this.props.chargeInfo.discountStatus === 'UNLOCK') {
			couponId = ''
			couponType = ''
		}

		const isOpenMemberBuy = this.props.isMember && this.props.isMemberPrice && this.props.tracePage !== "coral"
		// 拉人返学费的missionId
		let missionId = this.props.location.query.missionId || this.data.missionDetail && this.data.missionDetail.missionId || ''
		/* 购买系列课*/
		let payType = this.props.chargeInfo.discountStatus === 'UNLOCK' == 'UNLOCK' ? 'unlock' : isOpenMemberBuy ? 'MEMBER_COURSE' : ''
		this.props.doPay({
			missionId: missionId,
			liveId: this.props.channelInfo.liveId,
			chargeConfigId: chargeConfigId || this.chargeConfig.id,
			total_fee: this.props.total_fee || '0',
			channelNo: this.props.channelNo || '',
			type: this.props.type || 'CHANNEL',
			topicId: this.props.topicId || '0',
			payType: payType,
			ch: this.props.location.query.ch || this.props.location.query.wcl || '',
			shareKey: !this.state.showBackTuitionBanner && this.props.location.query.shareKey || '',// 有拉人返学费资格的时候支付不允许带上分销的shareKey
			couponId,
			couponType,
			officialKey: this.props.location.query.officialKey ? this.props.location.query.officialKey : (this.props.location.query.source == "coral" || this.props.tracePage == "coral" ? this.props.userId : ""),
			redEnvelopeId: this.props.location.query.redEnvelopeId, // 课堂红包id
			/**是否上一个页面来着微信活动页面Y=是N=不是 */
			isFromWechatCouponPage: this.props.location.query.isFromWechatCouponPage || '',
			psKey: (this.props.platformShareRate && this.props.location.query.psKey && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? this.props.location.query.psKey : '',
			psCh: (this.props.platformShareRate && this.props.location.query.source !== "coral" && !this.props.location.query.officialKey) ? filterOrderChannel() : '',
			/******/
			callback: async (orderId) => {
				// 支付完成之后传一个orderId用于返学费的跳转
				this.props.onSuccessPayment('N', orderId);
			},
			onPayFree: (result) => {
				window.toast(this.data.reNewTip ? '续费成功' : '报名成功');

				eventLog({
					category: 'joinchannel',
					action: 'success',
					business_id: this.channelId,
					business_type: 'channel',
					business_pay_type: 'CHANNEL',
				});

				this.props.onSuccessPayment('Y');
			},
			onCancel: this.props.onCancelPayment
		});

		// if (result && result.state.msg) {
		//     if(result && result.state.code == 10001 ) {
		//         window.location.href = updateUrl(window.location.href);
		//     }
		//     window.toast(result.state.msg);
		// } else {
		//     window.toast('报名失败，请稍后重试');
		// }
	}

	// 展示优惠券
	showCoupon(coupon) {
		this.actCouponDialogRef.showCoupon(coupon)
	}

	toggleChargeIndex(activeChargeIndex) {
		this.setState({
			activeChargeIndex
		})
	}

	handleClosePayDialog() {
		this.setState({
			isOpenPayDialog: false,
		});
	}

	// 显示优惠券列表
	showCouponList(couponListType, couponUsePrice) {
		this.setState({
			isCoupons: true,
			couponUsePrice
		})
	}

	// 隐藏优惠券列表
	hideCoupon() {
		this.setState({
			isCoupons: false,
			isOnce: true,
		})
	}

	render(){
		const {
			channelInfo,
			chargeInfo,
			marketingInfo,
			isAuth,
			isVip,
			unlockInfo,
			auditionOpenCourse,
			tracePage,
			isCamp,
			canInvite,
			showBackTuitionBanner,
			returnMoney,
			isPeriodEnd,
			isFree,
			currentGroup,
			myGroupInfo,
		} = this.props;

		const portalContainer = document.querySelector(this.data.portalContainer);

		return (
			<Fragment>
				<div className="course-purchase">
					{
						do {
							// 是解锁课
							if(chargeInfo.discountStatus == 'UNLOCK') {
								// 已报名
								if(isAuth){
									// 未解锁完
									if (unlockInfo.unlockStatus == 'wait') {
										<div className="buy-btn on-log on-visible"
											 data-log-region="deblocking_al"
											 data-log-pos=""
											 onClick={() => this.props.onUnlockBtnClick()}>解锁剩余课程</div>
									} else {
										<div className="buy-btn on-log on-visible"
											 onClick={this.props.enterCourse}
											 data-log-name={ this.props.isCamp ? '进入训练营' : '进入课程' }
											 data-log-region={this.props.isCamp  ? 'enter_training' : 'enter-course'}
										>{ this.props.isCamp ? '进入训练营' : '进入课程' }</div>
									}
								}
								// 未报名
								else {
									<Fragment>
										{
											auditionOpenCourse && <TryListenBtn auditionOpenCourse={auditionOpenCourse}/>
										}
										<div className={classNames("buy-btn on-log on-visible")}
											 data-log-region="buy-btn"
											 data-log-pos="deblocking"
											 onClick={this.buyBtnClickHandle}>
											<p>活动价{chargeInfo.discount}元 <s className="origin-price">￥{chargeInfo.amount}</s></p>
										</div>
									</Fragment>
								}
							}else if(isAuth || (isVip && channelInfo.isRelay !== 'Y')){
								<Fragment>
									{
										tracePage !== 'training-intro' && this.state.isTi && isCamp &&
										<div className="camp-ti">
											<img src={ require("./img/ti.png") }/>
										</div>
									}
									{
										/* 请好友免费听 */
										canInvite ?
											<div className="buy-btn on-log style-white on-visible"
												 onClick={this.props.inviteFriends}
												 data-log-name="请好友听"
												 data-log-region="series-bottom"
												 data-log-pos = "invite-listen"
											>请好友听</div> : null
									}
									{
										// 拉人返学费
										!canInvite && showBackTuitionBanner ?
											<div className="buy-btn on-log style-white on-visible"
												 onClick={this.props.openBackTuitionDialog}
												 data-log-name="返学费"
												 data-log-region="returnFee"
												 data-log-pos = "2"
											>返学费￥{returnMoney}</div> : null
									}
									<div className="buy-btn on-log on-visible"
										 onClick={this.props.enterCourse}
										 data-log-name={ isCamp ? '进入训练营' : '进入课程' }
										 data-log-region={isCamp  ? 'enter_training' : 'enter-course'}
									>{ this.props.isCamp ? '进入训练营' : '进入课程' }</div>
								</Fragment>
							}else if(isPeriodEnd){
								<div className="buy-btn on-log on-visible"
									 onClick={this.props.enterCampIntro}
									 data-log-name="报名截止，看看其他"
									 data-log-region="enter-camp-intro-btn"
								>报名截止，看看其他</div>
							}else if(this.props.s === 'taskcard' && this.props.sign && this.props.t){
								<div className="buy-btn on-log on-visible"
									 onClick={this.props.authTaskCard}
									 data-log-name="免费报名"
									 data-log-region="free-charge-btn"
								>开始学习<span className="price-num">任务已完成</span></div>
							}else if(isFree || this.isFree){
								<div className="buy-btn on-log on-visible"
									 onClick={this.buyBtnClickHandle}
									 data-log-name="免费报名"
									 data-log-region="free-charge-btn"
								>免费报名</div>
							}else if(['P', 'GP'].indexOf(marketingInfo.discountStatus) >= 0){
								// 判断 团长 团员  还要注意这个团是否失败了 失败的话 重开, 没有的话 往下走
								if(myGroupInfo.id || (currentGroup && currentGroup.result && currentGroup.result !== 'FAIL')){
									<div className="buy-btn on-log on-visible"
										 onClick={() => locationTo(`/topic/channel-group?liveId=${channelInfo.liveId}&channelId=${channelInfo.channelId}&groupId=${this.props.myGroupInfo.id || (currentGroup && currentGroup.groupId)}&type=sponser`)}
										 data-log-name="查看拼课"
										 data-log-region="check-group-btn"
									>查看拼团</div>
								}
								else if (currentGroup && currentGroup.result && currentGroup.result === 'FAIL') {
									<Fragment>
										{
											auditionOpenCourse && <TryListenBtn auditionOpenCourse={auditionOpenCourse}/>
										}
										<BuyBtn
											className="style-white"
											onBuyBtnClick={this.buyBtnClickHandle}
											chargeInfo={this.props.chargeInfo}
											coupon={this.props.coupon}
											showDiscount={this.props.showDiscount}
											isOpenMemberBuy={this.props.isOpenMemberBuy}
											region={`buy-btn-in-${this.props.marketingInfo.discountStatus}-group`}
											marketingInfo={this.props.marketingInfo}
										/>
										{
											this.props.marketingInfo.discountStatus === 'P' ?
												<div className="buy-btn on-log on-visible"
													 onClick={this.props.createGroup}
													 data-log-name="免费拼团"
													 data-log-region="create-group-btn"
													 data-log-pos="free"
												>免费开团￥0</div>
												:
												<div className="buy-btn on-log on-visible"
													 onClick={this.props.createGroup}
													 data-log-name="拼团学习"
													 data-log-region="create-group-btn"
													 data-log-pos="charge"
												>
													<p className={getMoneyBit(this.props.marketingInfo.discount) > 4 ? 'font-size-10': ''}>
														立即开团{getMoneyBit(this.props.marketingInfo.discount) > 4 ? <br /> : null}<s>￥</s><span className="price-num">{this.props.marketingInfo.discount}</span>
													</p>
												</div>
										}
									</Fragment>
								}
								else if(this.data.groupId){
									<div className="channel-bottom-purchase-panel">
										{
											this.props.auditionOpenCourse ? <TryListenBtn auditionOpenCourse={this.props.auditionOpenCourse}/> : null
										}
										<BuyBtn
											className="style-white"
											onBuyBtnClick={this.buyBtnClickHandle}
											chargeInfo={this.props.chargeInfo}
											coupon={this.props.coupon}
											showDiscount={this.props.showDiscount}
											isOpenMemberBuy={this.props.isOpenMemberBuy}
											region="buy-btn-in-join-group"
											marketingInfo={this.props.marketingInfo}
										/>
										{
											// 如果拼团已满 或者 拼团结束  帮用户开新团 同时注意是否是免费课
											this.props.groupStatus === 'OVER' || this.props.groupStatus == 'PASS' ?
												this.props.marketingInfo.discountStatus === 'P' ?
													<div className="buy-btn on-log on-visible"
														 onClick={this.props.createGroup}
														 data-log-name="免费拼团"
														 data-log-region="create-group-btn"
														 data-log-pos="free"
													>免费开团￥0</div>
													:
													<div className="buy-btn on-log on-visible"
														 onClick={this.props.createGroup}
														 data-log-name="拼团学习"
														 data-log-region="create-group-btn"
														 data-log-pos="charge"
													>
														<p className={getMoneyBit(this.props.marketingInfo.discount) > 4 ? 'font-size-10' : ''}>
															立即开团{getMoneyBit(this.props.marketingInfo.discount) > 4 ? <br /> : null}<s>￥</s><span className="price-num">{this.props.marketingInfo.discount}</span>
														</p>
													</div>
												: <div className="buy-btn on-log on-visible"
													   onClick={() => this.props.joinGroup(this.data.groupId)}
													   data-log-name="拼团学习"
													   data-log-region="join-group-btn"
												>
													<p className={getMoneyBit(this.props.marketingInfo.discount) > 4 ? 'font-size-10' : ''}>
														立即开团{getMoneyBit(this.props.marketingInfo.discount) > 4 ? <br /> : null}<s>￥</s><span className="price-num">{this.props.marketingInfo.discount}</span>
													</p>
												</div>
										}

									</div>
								}
								else{
									<Fragment>
										{
											this.props.auditionOpenCourse ? <TryListenBtn auditionOpenCourse={this.props.auditionOpenCourse}/> : null
										}
										<BuyBtn
											className="style-white"
											onBuyBtnClick={this.buyBtnClickHandle}
											chargeInfo={this.props.chargeInfo}
											coupon={this.props.coupon}
											showDiscount={this.props.showDiscount}
											isOpenMemberBuy={this.props.isOpenMemberBuy}
											region={`buy-btn-in-${this.props.marketingInfo.discountStatus}-group`}
											marketingInfo={this.props.marketingInfo}
										/>
										{
											marketingInfo.discountStatus === 'P' ?
												<div className="buy-btn on-log on-visible"
													 onClick={this.props.createGroup}
													 data-log-name="免费拼团"
													 data-log-region="create-group-btn"
													 data-log-pos="free"
												>免费开团￥0</div>
												:
												<div className="buy-btn on-log on-visible"
													 onClick={this.props.createGroup}
													 data-log-name="拼团学习"
													 data-log-region="create-group-btn"
													 data-log-pos="charge"
												>
													<p className={getMoneyBit(this.props.marketingInfo.discount) > 4 ? 'font-size-10' : ''}>
														立即开团{getMoneyBit(this.props.marketingInfo.discount) > 4 ? <br /> : null}<s>￥</s><span className="price-num">{this.props.marketingInfo.discount}</span>
													</p>
												</div>
										}
									</Fragment>
								}
							} else{
								<Fragment>
									{
										this.props.auditionOpenCourse ? <TryListenBtn auditionOpenCourse={this.props.auditionOpenCourse}/> : null
									}
									<BuyBtn
										onBuyBtnClick={this.buyBtnClickHandle}
										chargeInfo={this.props.chargeInfo}
										coupon={this.props.coupon}
										showDiscount={this.props.showDiscount}
										isOpenMemberBuy={this.props.isOpenMemberBuy}
										marketingInfo={this.props.marketingInfo}
										isFlex= {(this.props.channelInfo.chargeType === 'flexible')}
										region={`${this.props.channelInfo.chargeType === 'flexible' ? 'flexible-buy-btn' : (this.props.chargeInfo.discountStatus === 'Y' ? 'discount-buy-btn' : 'buy-btn')}`}
									/>
								</Fragment>
							}
						}
					}
				</div>
				{
					portalContainer && createPortal(
						 // 提示已经购买过相同的课程
						<Confirm
							ref={r => this.haveBoughtDialogRef = r}
							theme='empty'
							close={true}
							onClose={function(){
								this.hide()
							}}
							buttons='none'
						>
							<main className='buy-channel-dialog have-bought-dialog'>
								<p className="des"><strong>您已购买该课程，请直接进入学习</strong></p>
								<div className="red-btn on-log on-visible"
									 onClick={e => {
										 locationTo(`/wechat/page/channel-intro?channelId=${this.props.alreadyBuyChannelId}`)
									 }}
									 data-log-name="进入课程"
									 data-log-region="have-bought-dialog"
									 data-log-pos="red-btn"
								>进入课程
								</div>
								<div className="view-bought-records">
									<a href="javascript:void(0)"
									   onClick={() => locationTo('/live/entity/myPurchaseRecord.htm')}>查看购买记录</a>
								</div>
							</main>
						</Confirm>
						, portalContainer
					)
				}
				{
					portalContainer && createPortal(
						 // 付费二次确认框
						<PaymentDetailsDialog
							isShow={this.state.isOpenPayDialog}
							businessType="channel"
							fromPage="channel"
							chargeType={channelInfo.chargeType}
							chargeConfigs={this.props.chargeConfigs}
							curChannelCoupon={this.state.curCoupon}
							showCouponList={this.showCouponList}
							couponLists={this.state.couponList}
							showDiscount={this.props.discountExtendPo.showDiscount || false}
							toggleChargeIndex={this.toggleChargeIndex}
							onClose={this.handleClosePayDialog}
							pay={this.payChannel}
							isOpenMemberBuy={this.props.isMember && this.props.isMemberPrice && this.props.tracePage !== "coral"}
							updateCouponInfo={this.updateCouponInfo}
							updateCurChannelCoupon={this.updateCurChannelCoupon}
							sysTime={this.props.sysTime}
						/>
						, portalContainer
					)
				}
				{
					portalContainer && this.state.isCoupons && createPortal(
						<CouponLists
							sysTime={this.props.sysTime}
							isSingleBuy={this.props.isSingleBuy}
							curTopicCoupon={this.state.curTopicCoupon}
							curChannelCoupon={this.state.curChannelCoupon}
							curCoupon={this.state.curCoupon}
							updateCouponInfo={this.updateCouponInfo}
							updateCurChannelCoupon={this.updateCurChannelCoupon}
							chargePrice={this.state.couponUsePrice}
							couponLists={this.state.couponList}
							couponListType="channel"
							hideCoupon={this.hideCoupon}
							from="channel"
							isOnce={this.state.isOnce}
							channelId={this.channelId}
						/>
						, portalContainer
					)
				}
				{
					this.props.couponBtnPortalContainer && this.props.chargeInfo.discountStatus !== 'UNLOCK' && createPortal(
						<CouponBtn
							ref={r => this.couponButtonRef = r}
							sysTime={this.props.sysTime}
							businessType="channel"
							businessId={this.channelId}
							curTopicCoupon={this.state.curTopicCoupon}
							curChannelCoupon={this.state.curChannelCoupon}
							curCoupon={this.state.curCoupon}
							updateCouponInfo={this.updateCouponInfo}
							updateCouponInfoId={this.updateCouponInfoId}
							updateCurChannelCoupon={this.updateCurChannelCoupon}
							updateCurChannelCouponId={this.updateCurChannelCouponId}
							showCoupon={this.showCoupon}
							isMore={Object.is(channelInfo.chargeType, 'flexible')}
							isFixed={this.props.isCouponBtnFixed}
							style={{ top: this.props.introHeaderHeight + 'px', right: this.props.couponBtnRight + 'px' }}
							isSingleBuy={this.props.isSingleBuy}
							from="channelIntro"
						/>
						, this.props.couponBtnPortalContainer
					)
				}
			</Fragment>
			)
	}
}

CoursePurchase.defaultProps = {
	sysTime: Date.now(),
	channelInfo: {},
	chargeInfo: {},
	chargeConfigs: [],
	isQlLive: async () => 'N',
	isFree: false,
	marketingInfo: {},
	discountExtendPo: {},
	isAuth: false,
	isVip: false,
	auditionOpenCourse: false,
	// 拼团id
	groupId: '',
	myGroupInfo: {},
	// 是否填表
	notFilled: null,
	channelCouponStatus: {},
	// 平台分销比例中的个人比例
	platformShareRate: '',
	// 优惠券按钮传送目标容器
	couponBtnPortalContainer: null,
	// 是否单节购买
	isSingleBuy: 'N',
	isCouponBtnFixed: false,
	introHeaderHeight: 0,
	couponBtnRight: 0,
};