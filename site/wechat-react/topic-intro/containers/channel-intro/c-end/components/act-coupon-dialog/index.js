import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { request } from 'common_actions/common';
import { autobind } from 'core-decorators';

import {
	getVal,
	updateUrl,
	formatDate,
	imgUrlFormat,
	isLogined,
} from 'components/util';
import openApp from 'components/open-app';

import {
	activityCodeExist,
	activityCodeBind,
	getPromotion,
	setCouponResult,
	updateCurChannelCoupon,
} from '../../../../../actions/channel-intro';

import CollectVisible from 'components/collect-visible';

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
	setCouponResult,
	updateCurChannelCoupon
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

			coupon: {}, 
    };

    async componentDidMount () {
		let initCoupon = this.init();
		this.props.setCouponResult(initCoupon)
    }

	// 活动订制券的领取弹窗
	async init() {
		if(this.props.location && this.props.location.query && this.props.location.query.activityCodeId && isLogined()) {
			let couseId = this.props.location.query.channelId
			let couseType = 'channel'
			if (!couseId) {
				couseId = this.props.location.query.topicId
				couseType = 'topic'
			}
			// 该用户是否已经绑定活动定制优惠券判断
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
						promotionDto:result.data.promotionDto
					})
					this.props.onDisplayChange && this.props.onDisplayChange(true);
				}
			}
		}


		// couponId参数，暂时所知是app券
		if (this.props.location && this.props.location.query && this.props.location.query.couponId) {
			let couseId = this.props.location.query.topicId;
			let couseType = 'topic';
			if (!couseId) {
				couseId = this.props.location.query.channelId;
				couseType = 'channel';
			}
			if (!couseId) return;
			
			this.props.activityCodeExist(couseId, this.props.location.query.couponId, couseType)
				.then(res => {
					if (res.data.existsCode !== 0) return;

					return this.props.getPromotion(this.props.location.query.couponId)
						.then(res => {
							if (res.state.code) return; 
							const coupon = res.data.promotionDto;
							coupon.couponType = coupon.type;

							this.setState({
								couseId,
								couseType,
								couponMoney: coupon.money / 100,
								startDate: formatDate(coupon.startDate).replace(/-/g,'.'),
								endDate: coupon.endDate ? 
										 formatDate(coupon.endDate, '有效期至MM月dd日') :
										 coupon.useDay ? 
										 `领取后${coupon.useDay}天内使用` : '永久有效',
								showDialog: true,
								coupon,
							})
							this.props.onDisplayChange && this.props.onDisplayChange(true);
						})
				}).catch(err => {
					console.warn(err);
				})
			
		}

		if (this.state.showDialog) {
			return false;
		} else {
			return true;
		}
		


		// 拉人返学费领券
		// if(this.state.inviteReturnCouponId && this.state.couponType && this.state.missionId){
		// 	let {businessId, businessType} = this.props
		// 	await request({
        //         url: '/api/wechat/transfer/h5/coupon/getCouponForInviteReturn',
        //         body: { businessId, businessType, missionId: this.state.missionId }
        //     }).then(res=>{
		// 		if(res.state.code) throw Error(res.state.msg)
		// 		let couponData = get(res, 'data.codePo', {})
		// 		let hasMission = get(res, 'data.hasMission')
		// 		let useRefId = get(res, 'data.codePo.useRefId')
		// 		// 未过期，未进行返学费任务，未领取过才显示返学费优惠券弹窗
		// 		let overTime = get(couponData, 'overTime')
		// 		let showDialog = (overTime ? (overTime > Date.now()) : true) && get(couponData, 'id') && hasMission === 'N' && !useRefId
		// 		if(showDialog){
		// 			this.setState({
		// 				headImage: get(res, 'data.headImage', ''),
		// 				userName: get(res, 'data.userName', ''),
		// 				couponMoney: couponData.money / 100,
		// 				couponId: couponData.id,
		// 				endDate: overTime ? 
		// 						 formatDate(couponData.overTime, '有效期至MM月dd日') : '',
		// 				showDialog
		// 			})
		// 			this.props.onDisplayChange && this.props.onDisplayChange(true);
		// 		}
        //     }).catch(err=>{
        //         console.error(err)
        //     })
		// }
	}

	async fetchCoupon() {

		// 关闭展示优惠券用
		if (this.state.custom) {
			this.closeCouponPop()
			this.props.showPaymentDetailsDialog && this.props.showPaymentDetailsDialog(this.state.coupon)
			return
		}

		let codeData = {}
		// 拉人返学费领券
		// if(this.state.inviteReturnCouponId && this.state.couponType) {
		// 	if(this.state.couponType === 'ding_zhi'){
		// 		codeData = await request({
		// 			url: '/api/wechat/transfer/h5/promotion/bind',
		// 			body: { promotionId:  this.state.couponId}
		// 		})
		// 	}else {
		// 		// 普通券领用之后返回的参数是useRefId，故下面需要判断这个
		// 		codeData = await request({
		// 			url: '/api/wechat/transfer/couponApi/coupon/bindCoupon',
		// 			body: { couponId:  this.state.couponId}
		// 		})
		// 	}
		// }else {
		// 	codeData = await this.props.activityCodeBind(this.state.couseId, this.props.location.query.activityCodeId, this.state.couseType)
		// }

		codeData = await this.props.activityCodeBind(this.state.couseId, this.props.location.query.activityCodeId || this.props.location.query.couponId, this.state.couseType)
		this.setState({showDialog: false});
		this.props.onDisplayChange && this.props.onDisplayChange(false);
		if(codeData && codeData.data && (codeData.data.code || codeData.data.useRefId)) {
			window.toast('领取成功');
			let coupon = {
				codeName:this.state.promotionDto?.name,
				couponType:this.state.promotionDto?.type,
				money:this.state.promotionDto?.money,
				createTime:this.state.promotionDto?.createTime,
				overTime:this.state.promotionDto?.endDate,
				minMoney:this.state.promotionDto?.minMoney||null,
				couponId:codeData.data.id,
				useRefId:codeData.data.id,
				codeId: this.props.location.query.activityCodeId || this.props.location.query.couponId,
				receiveSource: 'actCouponDialog'
			};
			this.props.updateCurChannelCoupon(coupon)

			// 饼饼要求自动弹起支付
			setTimeout(()=> {
				if (this.props.payChannel) {
					this.props.payChannel();
					// 更新优惠券
					this.props.updateCouponList && this.props.updateCouponList();
				} else {
					window.location.href = updateUrl(window.location.href)
				}
			}, 300)
		} else {
            window.toast(codeData?.state?.msg);
        }
	}

	// 展示优惠券
	showCoupon (coupon) {
		this.setState({
			couponMoney: coupon.money / 100,
			endDate: coupon.overTime ? formatDate(coupon.overTime, '有效期至MM月dd日') : '永久有效',
			showDialog: true,
			custom: true,
			coupon,
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
		
		openApp = () => {
			openApp({
				h5: location.href,
				ct: 'appzhuanshu',
				ckey: 'CK1422980938180',
			});
		}

    render() {
		return this.state.showDialog && 
		<CollectVisible key={this.state.custom ? 'receive' : 'unreceived'}>
		<div className="act-coupon-dialog-container1 receive-coupon-dialog-3 on-log on-visible" 
			 data-log-region={ `${this.state.couseType === 'channel' ? 'channel' : 'topic'}-c-activity-coupon` }
			 data-log-pos={this.state.custom ? 'receive' : 'unreceived'}>
			<div className="c-d-bg" onClick={this.state.custom ? this.closeCouponPop : this.fetchCoupon}></div>
			<div className="c-d-content">
				<div className="receive-coupon-container">
						
					<div className="receive-coupon-body">
						<i className="icon_close" onClick={this.state.custom ? this.closeCouponPop : this.fetchCoupon}></i>
						<div className="user">
							{this.state.headImage ? <img  class="head-image" src={imgUrlFormat(this.state.headImage, '?x-oss-process=image/resize,m_fill,limit_0,h_84,w_84')} alt=""/> : null}
							{this.state.userName ? <p className="">{this.state.userName}送你一张优惠券</p> : null}
						</div>

						<div className="top-section">
							<div className="coupon-amount">{this.state.couponMoney}</div>

							<div className="coupon-type-tip">
								{
									this.state.coupon.couponType === 'app' &&
									<span className="label">APP专享</span>
								}
								课程抵用券
							</div>
						</div>

						<div className="bottom-section">
							<div className="coupon-validity">
								{this.state.endDate}
							</div>

							{
								this.state.coupon.couponType === 'app' && this.state.custom
									?
									<div className="receive-button on-log" role="button" data-log-region="act-coupon-open-app" onClick={this.openApp}>去打开APP使用</div>
									:
									<div className="receive-button on-log" role="button" data-log-region="get-act-coupon-btn" onClick={this.fetchCoupon}>{ this.state.custom ? '立即使用' : '马上领取' }</div>		
							}
							{
								this.state.coupon.couponType === 'app'
									?
									<div className="coupon-from">仅限App使用，可在 “ 个人中心 > 优惠券 ” 查看</div>
									:
									<div className="coupon-from">仅限该课程使用</div>
							}
						</div>
					</div>
					
				</div>
			</div>
		</div>
		</CollectVisible>
    }
}


module.exports = connect(mapStateToProps, mapActionToProps, null, { withRef: true })(ActCouponDialog);
