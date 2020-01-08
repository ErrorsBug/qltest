import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { request } from 'common_actions/common';
import { autobind } from 'core-decorators';

import {
	getVal,
	updateUrl,
	formatDate,
} from 'components/util';

import {
	activityCodeExist,
	activityCodeBind,
	getPromotion,
} from '../../../../../actions/channel-intro';

function mapStateToProps(state) {
	return {
		sysTime: getVal(state, 'common.sysTime',''),
		channelInfo: state.channelIntro.channelInfo,
	}
}

const mapActionToProps = {
	activityCodeExist,
	activityCodeBind,
	getPromotion,
};

@autobind
class ActCouponDialog extends Component {

    state = {
		couseId: '',
		couseType: 'channel',
	    showDialog: false,
	    couponMoney: 0,
	    startDate: '',
		endDate: '',
		inviteReturnCouponId: this.props.location.query.inviteReturnCouponId, // 拉人返学费优惠券id
		couponType: this.props.location.query.couponType, // 拉人返学费券类型
		missionId: this.props.location.query.missionId, // 拉人返学费任务id
		couponId: '', //拉人返学费优惠券id
		headImage: '', // 邀请者头像（发券者）
		userName: '', // 邀请者用户名（发券者）
    };

    componentDidMount () {
        this.init();
    }

	// 活动订制券的领取弹窗
	async init() {
		if(this.props.location && this.props.location.query && this.props.location.query.activityCodeId) {
			let couseId = this.props.location.query.channelId
			let couseType = 'channel'
			if (!couseId) {
				couseId = this.props.location.query.topicId
				couseType = 'topic'
			}
			const exist = await this.props.activityCodeExist(couseId, this.props.location.query.activityCodeId, couseType)
			if(exist && exist.data && exist.data.existsCode === 0) {
				const result  = await this.props.getPromotion(this.props.location.query.activityCodeId);
				if(result.state.code === 0){
					this.setState({
						couseId,
						couseType,
						couponMoney: result.data.promotionDto.money / 100,
						startDate: formatDate(result.data.promotionDto.startDate).replace(/-/g,'.'),
						endDate: result.data.promotionDto.endDate ? 
								 formatDate(result.data.promotionDto.endDate, '有效期至MM月dd日') :
								 result.data.promotionDto.useDay ? 
								 `领取后${result.data.promotionDto.useDay}天内使用` : '永久有效',
						showDialog: true,
					})
					this.props.onDisplayChange && this.props.onDisplayChange(true);
				}
			}
		}
		// 拉人返学费领券
		if(this.state.inviteReturnCouponId && this.state.couponType && this.state.missionId){
			let {businessId, businessType} = this.props
			await request({
                url: '/api/wechat/transfer/h5/coupon/getCouponForInviteReturn',
                body: { businessId, businessType, missionId: this.state.missionId }
            }).then(res=>{
				if(res.state.code) throw Error(res.state.msg)
				let couponData = get(res, 'data.codePo', {})
				let hasMission = get(res, 'data.hasMission')
				let useRefId = get(res, 'data.codePo.useRefId')
				// 未过期，未进行返学费任务，未领取过才显示返学费优惠券弹窗
				let overTime = get(couponData, 'overTime')
				let showDialog = (overTime ? (overTime > Date.now()) : true) && get(couponData, 'id') && hasMission === 'N' && !useRefId
				if(showDialog){
					this.setState({
						headImage: get(res, 'data.headImage', ''),
						userName: get(res, 'data.userName', ''),
						couponMoney: couponData.money / 100,
						couponId: couponData.id,
						endDate: overTime ? 
								 formatDate(couponData.overTime, '有效期至MM月dd日') : '',
						showDialog
					})
					this.props.onDisplayChange && this.props.onDisplayChange(true);
				}
            }).catch(err=>{
                console.error(err)
            })
		}
	}

	async fetchCoupon() {

		// 关闭展示优惠券用
		if (this.state.custom) {
			this.closeCouponPop()
			return
		}

		let codeData = {}
		// 拉人返学费领券
		if(this.state.inviteReturnCouponId && this.state.couponType) {
			if(this.state.couponType === 'ding_zhi'){
				codeData = await request({
					url: '/api/wechat/transfer/h5/promotion/bind',
					body: { promotionId:  this.state.couponId}
				})
			}else {
				// 普通券领用之后返回的参数是useRefId，故下面需要判断这个
				codeData = await request({
					url: '/api/wechat/transfer/couponApi/coupon/bindCoupon',
					body: { couponId:  this.state.couponId}
				})
			}
		}else {
			codeData = await this.props.activityCodeBind(this.state.couseId, this.props.location.query.activityCodeId, this.state.couseType)
		}
		this.setState({showDialog: false});
		this.props.onDisplayChange && this.props.onDisplayChange(false);
		if(codeData && codeData.data && (codeData.data.code || codeData.data.useRefId)) {
			window.toast('领取成功');
			setTimeout(function() {
				window.location.href = updateUrl(window.location.href)
			}, 300)
		} else {
            window.toast('领取失败');
        }
	}

	// 展示优惠券
	showCoupon (coupon) {
		this.setState({
			couponMoney: coupon.money / 100,
			endDate: coupon.overTime ? formatDate(coupon.overTime, '有效期至MM月dd日') : '永久有效',
			showDialog: true,
			custom: true
		})
		this.props.onDisplayChange && this.props.onDisplayChange(true);
	}

	closeCouponPop () {
        this.setState({
			showDialog: false,
			custom: !!this.state.custom
		})
		this.props.onDisplayChange && this.props.onDisplayChange(false);
    }

    render() {
		return this.state.showDialog && 
		<div className="act-coupon-dialog-container receive-coupon-dialog-2 on-log on-visible" 
			 data-log-region={ `${this.state.couseType === 'channel' ? 'channel' : 'topic'}-c-activity-coupon` }
			 data-log-pos={this.state.custom ? 'receive' : 'unreceived'}>
			<div className="c-d-bg" onClick={this.fetchCoupon}></div>
			<div className="c-d-content">
				<div className="receive-coupon-container">
						
					<div className="receive-coupon-body">
						{/* <i className="icon_close" onClick={this.closeCouponPop}></i> */}
						<div className="user">
							{this.state.headImage ? <img  class="head-image" src={this.state.headImage} alt=""/> : null}
							{this.state.userName ? <p className="">{this.state.userName}送你一张优惠券</p> : null}
						</div>

						<div className="top-section">
							<div className="coupon-amount">
								<div className="amount"><em>{this.state.couponMoney}</em></div>
							</div>
							<div className="coupon-type-tip">课程抵用券</div>
						</div>
						<div className="bottom-section">
							<div className="coupon-validity">
								{this.state.endDate}
							</div>

							<div>
								<div className="coupon-from">
									仅限该课程使用
								</div>

								<div className="receive-button on-log" role="button" data-log-region="get-act-coupon-btn" onClick={this.fetchCoupon}>{ this.state.custom ? '我知道了' : '马上领取' }</div>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		</div>
    }
}


module.exports = connect(mapStateToProps, mapActionToProps, null, { withRef: true })(ActCouponDialog);
