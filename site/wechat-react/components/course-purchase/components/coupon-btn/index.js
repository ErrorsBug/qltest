/**
 *
 * @author Dylan
 * @date 2018/6/7
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { withRouter } from 'react-router';
import { request } from 'common_actions/common';

import {
	formatMoney,
	getVal
} from 'components/util';


@withRouter
@autobind
class CouponBtn extends Component {

	state = {
		money: 0,
		couponId: '',
		coupon: null,
		isReceive: false
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

	getQueryCouponForIntro(params){
		return request({
			url: '/api/wechat/transfer/h5/coupon/queryCouponForIntro',
			body: params
		}).then(result => {
			if (result.state.code === 0 && result.data?.codePo) {
				return result.data
			}else{
				return null
			}
		});
	}
	
	// 指定优惠券
	async appointCoupon() {
		const coupon = await request({
			url: '/api/wechat/transfer/couponApi/coupon/queryCouponInfo',
			body: {
				couponId: this.props.location.query.couponId
			}
		}).then(result => {
			return result?.data?.CouponInfoDto || null
		});

		// app券这个字段是没有使用的
		coupon && coupon.couponType === 'app' && (coupon.status = 'Y');

		// 优惠券不存在 过期 失效 取其他优惠券显示
		if (!this.isNext(coupon)) {
			this.getLiveUniversalCoupon()
			return
		}

		if (this.props.businessType === 'channel') {
			await this.props.updateCurChannelCoupon(coupon || {})
		} else {
			// 当页面是话题介绍时， 可能出现单节购买和系列课购买两个按钮， 则需请求两张优惠券
			const couponInfo = {}
			if (coupon) {
				couponInfo.topicCoupon = coupon
			}
			if (this.props.channelId) {
				const channelCoupon = await this.getQueryCouponForIntro({
					businessId: this.props.channelId,
					businessType: 'channel',
					isUpdate: false
				});
	
				if (channelCoupon) {
					couponInfo.channelCoupon = channelCoupon.codePo
				}
	
			}
			await this.props.updateCouponInfo(couponInfo)
		}
		this.setState({
			money: coupon.money,
			couponId: coupon.id,
			coupon: coupon,
			isReceive: !!coupon.useRefId
		}, () => {
			// 如果没有领取就自动领取
			this.autoBindCoupon();
		})
	}

	async getLiveUniversalCoupon(){
		let coupon = null

		// 如果是系列课里的话题 并且没有单节购买则不请求
		if (!(this.props.businessType === 'topic' && this.props.channelId && this.props.isSingleBuy === 'N')) {
			coupon = await this.getQueryCouponForIntro({
				businessId: this.props.businessId,
				businessType: this.props.businessType
			});
		}

		if (this.props.businessType === 'channel') {
			await this.props.updateCurChannelCoupon(coupon && coupon.codePo || {})
		} else {
			// 当页面是话题介绍时， 可能出现单节购买和系列课购买两个按钮， 则需请求两张优惠券
			const couponInfo = {}
			if (coupon) {
				couponInfo.topicCoupon = coupon.codePo
			}
			if (this.props.channelId) {
				const channelCoupon = await this.getQueryCouponForIntro({
					businessId: this.props.channelId,
					businessType: 'channel',
					isUpdate: false
				});
	
				if (channelCoupon) {
					if (!coupon || coupon.isGet === channelCoupon.isGet && coupon.codePo.money < channelCoupon.codePo.money || coupon.isGet !== channelCoupon.isGet && channelCoupon.isGet === 'Y') {
						coupon = channelCoupon
					}
					couponInfo.channelCoupon = channelCoupon.codePo
				}
	
			}
			await this.props.updateCouponInfo(couponInfo)
		}

		if (coupon) {
			this.setState({
				money: coupon.codePo.money,
				couponId: coupon.codePo.id,
				coupon: coupon.codePo,
				isReceive: coupon.isGet === 'Y'
			}, () => {
				this.autoBindCoupon()
			})
		}
	}

	/**
	 * 自动领取优惠券
	 * @param {*} time 
	 */
	autoBindCoupon (time = 5000) {
		// 需要自动绑定的优惠券列表
		const autoCouponListBind = []
		setTimeout(() => {

			if (this.props.businessType === 'channel') {
				if (this.props.curCoupon && !this.props.curCoupon.useRefId) {
					autoCouponListBind.push(this.props.curCoupon)
				}
			} else {
				if (this.props.curTopicCoupon && !this.props.curTopicCoupon.useRefId) {
					autoCouponListBind.push(this.props.curTopicCoupon)
				}
				if (this.props.curChannelCoupon && !this.props.curChannelCoupon.useRefId) {
					autoCouponListBind.push(this.props.curChannelCoupon)
				}
			}

			autoCouponListBind.forEach(({belongId, businessType, id, couponType}) => {
						
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
			res = await request({
				url: '/api/wechat/transfer/h5/promotion/bind',
				body: {
					promotionId: couponId || this.state.couponId,
					sourcePage: autobind ? 'introAuto' : 'introHand',
					sourceChannel: 'h5',
				}
			})
		} else if (_couponType === 'relay_channel') {
			// 领取自媒体转载系列课优惠券
            res = await request({
				url: '/api/wechat/transfer/h5/relayChannel/coupon/bindRelayChannelCoupon',
				body: {
					codeId: couponId || this.state.couponId
				}
			})
        } else {
			res = await request({
				url: '/api/wechat/transfer/couponApi/coupon/bindCoupon',
				body: {
					businessId: businessId || this.props.businessId,
					businessType: businessType || this.props.businessType,
					couponId: couponId || this.state.couponId,
					from: this.props.from || ''
				}
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

	render(){
		const { isReceive, animation, autobind } = this.state
		if(this.state.couponId){
			return (
				<div className={ `intro-page-coupon-btn on-log on-visible` }
						data-log-name="优惠券按钮"
						data-log-region="coupon-btn"
						onClick={isReceive || animation ? this.showCoupon : this.bindReceiveCoupon}
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


export default CouponBtn;