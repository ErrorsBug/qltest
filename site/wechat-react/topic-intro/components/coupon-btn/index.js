/**
 *
 * @author Dylan
 * @date 2018/6/7
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { withRouter } from 'react-router';

import {
	getQueryCouponForIntro,
	bindCoupon
} from '../../actions/common';

import {
	formatMoney,
	getVal
} from 'components/util';

import {
	updateCouponInfo,
	updateCouponInfoId
} from '../../actions/topic-intro'
import {
	updateCurChannelCoupon,
	updateCurChannelCouponId,
	receiveMediaCoupon
} from '../../actions/channel-intro'

import {
	getCouponInfo,
	getActCouponSingle
} from '../../actions/coupon'

@withRouter
@autobind
class CouponBtn extends Component {

	state = {
		money: 0,
		couponId: '',
		coupon: null,
		isReceive: false,

		// 展示优惠券
		showCoupon: []
	};

	componentDidMount(){
		// 用户是否指定了优惠券
		if(this.props.location && this.props.location.query && this.props.location.query.couponId) {
			console.log("制定了优惠券")
			this.appointCoupon()
		} else {
			console.log("没有使用定制的")
			this.getLiveUniversalCoupon();
		}
	}

	isNext (coupon) {
		if (!coupon) {
			return false
		}

		const { overTime, status, codeNum, useNum, useRefId } = coupon

		// 是否过期
		if (overTime) {
			if (this.props.sysTime > overTime) {
				return false
			}
		}

		// 是否可用
		if (status !== 'Y') {
			return false
		}

		// 未领取 且有数量限制 且已领完
		if (!useRefId && codeNum && codeNum > 0 &&  useNum >= codeNum) {
			return false
		}

		return true
	}
	
	// 指定优惠券
	async appointCoupon() {
		const coupon = await this.props.getCouponInfo({couponId: this.props.location.query.couponId})

		// app券这个字段是没有使用的
		coupon && coupon.couponType === 'app' && (coupon.status = 'Y');

		// 优惠券不存在 过期 失效 取其他优惠券显示
		if (!this.isNext(coupon)) {
			this.getLiveUniversalCoupon()
			return
		}

		const _showCoupon = []

		if (this.props.businessType === 'channel') {
			_showCoupon.push(coupon || {})
		} else {
			// 当页面是话题介绍时， 可能出现单节购买和系列课购买两个按钮， 则需请求两张优惠券
			if (coupon) {
				_showCoupon.push(coupon || {})
			}
			if (this.props.channelId) {
				const channelCoupon = await this.props.getQueryCouponForIntro({
					businessId: this.props.channelId,
					businessType: 'channel',
					isUpdate: false
				});
	
				if (channelCoupon) {
					_showCoupon.push(channelCoupon.codePo || {})
				}
	
			}
		}
		this.setState({
			money: coupon.money,
			couponId: coupon.id,
			coupon: coupon,
			isReceive: !!coupon.useRefId,
			showCoupon: _showCoupon
		}, () => {
			// 如果没有领取就自动领取
			this.autoBindCoupon();
		})
	}

	async getLiveUniversalCoupon(){
		let coupon = null

		// 如果是系列课里的话题 并且没有单节购买则不请求
		if (!(this.props.businessType === 'topic' && this.props.channelId && this.props.isSingleBuy === 'N')) {
			coupon = await this.props.getQueryCouponForIntro({
				businessId: this.props.businessId,
				businessType: this.props.businessType
			});
		}

		const _showCoupon = []
		if (this.props.businessType === 'channel') {
			_showCoupon.push(coupon && coupon.codePo || {})
		} else {
			// 当页面是话题介绍时， 可能出现单节购买和系列课购买两个按钮， 则需请求两张优惠券
			if (coupon) {
				_showCoupon.push(coupon.codePo || {})
			}
			if (this.props.channelId) {
				const channelCoupon = await this.props.getQueryCouponForIntro({
					businessId: this.props.channelId,
					businessType: 'channel',
					isUpdate: false
				});
	
				if (channelCoupon) {
					// 展示系列课优惠券
					// 话题没有优惠券 || 话题和系列课的优惠券都领了 且 话题优惠券比系列课优惠券金额小 || 话题优惠券未领 系列课优惠券已领 
					if (!coupon || coupon.isGet === channelCoupon.isGet && coupon.codePo.money < channelCoupon.codePo.money || coupon.isGet !== channelCoupon.isGet && channelCoupon.isGet === 'Y') {
						coupon = channelCoupon
					}
					_showCoupon.push(channelCoupon.codePo || {})
				}
	
			}
		}

		if (coupon) {
			this.setState({
				money: coupon.codePo.money,
				couponId: coupon.codePo.id,
				coupon: coupon.codePo,
				isReceive: coupon.isGet === 'Y',
				showCoupon: _showCoupon
			}, () => {
				this.autoBindCoupon()
			})
		}
	}

	/**
	 * 自动领取优惠券
	 * 不再更新 Redux 内的优惠券信息
	 * @param {*} time 
	 */
	autoBindCoupon (time = 5000) {
		// 需要自动绑定的优惠券列表
		const autoCouponListBind = [...this.state.showCoupon]
		console.log('需要自动领取的优惠券', autoCouponListBind)
		setTimeout(() => {

			// 如果信息确认框已弹起， 则不自动领券 如果已领取则不再自动领取
			console.log('是否拦截', this.props.paymentDetailsShow, this.state.isReceive, this.state.animation)
			if (this.props.paymentDetailsShow || this.state.isReceive || this.state.animation) return

			console.log('开始自动领取')
			autoCouponListBind.forEach(({belongId, businessType, id, couponType, useRefId}) => {
				if (useRefId) return
				
				// 当有弹窗时 不自动领取该券
				if(this.props.location && this.props.location.query) {
					// 活动券
					if (this.props.location.query.activityCodeId && id == this.props.location.query.activityCodeId) {
						return
					}
					// 转载券
					if (this.props.location.query.couponCode && id == this.props.location.query.couponCode) {
						return
					}
					// 拉人返学费券
					if(this.props.location.query.inviteReturnCouponId && this.props.location.query.couponType){
						return
					}
					// app券
					if (couponType === 'app' && this.props.location.query.couponId == id) {
						return
					}
				}

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
		const _couponType = couponType || this.state.coupon.couponType
		let res = ''
		if (_couponType === 'ding_zhi' || _couponType === 'app') {
			res = await this.props.getActCouponSingle({
				promotionId: couponId || this.state.couponId,
				sourcePage: autobind ? 'introAuto' : 'introHand',
				sourceChannel: 'h5',
			})
		} else if (_couponType === 'relay_channel') {
            res = await this.props.receiveMediaCoupon({codeId: couponId || this.state.couponId})
        } else {
			res = await this.props.bindCoupon({
				businessId: businessId || this.props.businessId, 
				businessType: businessType || this.props.businessType, 
				couponId: couponId || this.state.couponId,
				from: this.props.from || ''
			})
		}

		if(res.state.code === 0){
			if (couponType === 'app') {
				window.toast('已成功领取APP专享优惠券');
			} else {
				window.toast('领取成功');
			}

			// 领取成功返回关联Id 用于确认是否领取与购买
			// const useRefId = res.data.useRefId || res.data.id
			
			// if (this.props.businessType === 'channel') {
			// 	await this.props.updateCurChannelCouponId(useRefId)
			// } else {
			// 	await this.props.updateCouponInfoId({
			// 		couseType: businessType,
			// 		useRefId
			// 	})
			// }

			this.props.bindSuccess && this.props.bindSuccess();
		
			setTimeout(() => {
				this.setState({
					animation: true,
					autobind
				})
			}, 1000);
		} else {
			window.toast(res.state.msg || '网络出错，请稍后再试');
		}
	}

	showCoupon () {
		this.props.showCoupon(this.state.coupon)
	}

	get isAppCoupon () {
		// 当前是否app券 且 链接上携带了couponId
		return this.props.location && this.props.location.query && this.props.location.query.couponId && this.state.coupon && this.state.coupon.couponType === 'app'
	}

	render(){
		const { isReceive, animation, autobind } = this.state
		if(this.state.couponId){
			return (
				<div className={ `intro-page-coupon-btn on-log on-visible` }
						data-log-name="优惠券按钮"
						data-log-region="coupon-btn"
						onClick={isReceive || animation || this.isAppCoupon ? this.showCoupon : this.bindReceiveCoupon}
				>
					{
						this.state.coupon.couponType === 'app'
						?
						<span className="tips receive">仅限APP购买可抵扣</span>
						:
						isReceive ?
						<span className="tips receive">购买时自动抵扣</span>
						:
						<span className={ `tips animation ${ animation ? (autobind ? 'auto-bind' : 'receive') : '' }` }>{ animation ? (autobind ? '抢到限时券' : '购买时自动抵扣') : '优惠券' }</span>
					}
					<span className="price">{formatMoney(this.state.money)}</span>
				</div>
			)
		}else{
			return null;
		}
	}
}

function mapStateToProps(state) {
	return {
        sysTime: state.common.sysTime,
        curChannelCoupon: getVal(state, 'topicIntro.curChannelCoupon', ''),
        curTopicCoupon: getVal(state, 'topicIntro.curTopicCoupon', ''),
		curCoupon: getVal(state, 'channelIntro.curCoupon', ''),
		isSingleBuy: getVal(state, 'topicIntro.topicInfo.isSingleBuy', 'N'),
	}
}

const mapActionToProps = {
	getQueryCouponForIntro,
	bindCoupon,
	updateCouponInfo,
	updateCouponInfoId,
	updateCurChannelCoupon,
	updateCurChannelCouponId,
	getCouponInfo,
	getActCouponSingle,
	receiveMediaCoupon
};

export default connect(mapStateToProps, mapActionToProps)(CouponBtn);