/**
 *
 * @author Dylan
 * @date 2018/10/15
 */
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import Picture from 'ql-react-picture';
import { autobind } from 'core-decorators';
import { get } from 'lodash';

import { request } from 'common_actions/common';

import {
	formatMoney,
	imgUrlFormat,
	locationTo,
	digitFormat,
} from 'components/util'

@autobind
class MemberCoupon extends PureComponent {

	state = {
		itemRotateX: 0,
		isReplacing: false,
		frontFaceCouponList: [],
		backFaceCouponList: [],
		showTip:false,
	};

	data = {
		pageSize: 3
	};

	componentDidMount(){
		this.getData(1, true);
	}

	async getData(page, doubleSize){
		const res = await request({
			url: '/api/wechat/member/coupon',
			method: 'POST',
			body: {
				pageIndex: page,
				pageSize: doubleSize ? this.data.pageSize * 2 : this.data.pageSize
			}
		});
		const couponList = get(res, 'data.couponCourseList', []);
		const nextPageIndex = get(res, 'data.nextPageIndex', 1);
		if(doubleSize){
			this.setState({
				frontFaceCouponList: couponList.slice(0, this.data.pageSize),
				backFaceCouponList: couponList.slice(this.data.pageSize),
				nextPageIndex
			})
		}else{
			if((this.state.itemRotateX / 180) % 2 === 1){
				this.setState({
					frontFaceCouponList: couponList,
					nextPageIndex
				})
			}else{
				this.setState({
					backFaceCouponList: couponList,
					nextPageIndex
				})
			}

		}
	}

	async replaceBtnClickHandle(){
		if(this.state.isReplacing){
			window.toast('您手速太快，受不了了啦')
			return false;
		}
		this.setState({
			itemRotateX: this.state.itemRotateX + 180,
			isReplacing: true,
		});
		await this.getData(this.state.nextPageIndex);
		this.setState({
			isReplacing: false
		})

	}

	async getCoupon({promotionId: id, status, businessId, businessType}, type){
		if(!this.props.isMember){
			this.setState({
				showTip: true
			})
		}else if(status === 'none'){
			window.loading(true);
			const res = await request({
				url: '/api/wechat/member/getCoupon',
				method: 'POST',
				body: {
					promotionId: id
				}
			});
			window.loading(false);
			if(res.state.code === 0){
				window.toast('领取成功');
				if(type === 'frontFace'){
					const frontFaceCouponList = [...this.state.frontFaceCouponList];
					frontFaceCouponList.forEach(item => {
						if(item.promotionId === id){
							item.status = 'bind';
						}
					});
					this.setState({ frontFaceCouponList });
				}else{
					const backFaceCouponList = [...this.state.backFaceCouponList];
					backFaceCouponList.forEach(item => {
						if(item.promotionId === id){
							item.status = 'bind';
						}
					});
					this.setState({ backFaceCouponList });
				}
			}else{
				window.toast(res.state.msg)
			}
		}else if(status === 'bind'){
			if(businessType === 'channel'){
				locationTo(`/wechat/page/channel-intro?channelId=${businessId}`);
			}else if(businessType === 'topic'){
				console.log(`/wechat/page/topic-intro?topicId=${businessId}`)
				locationTo(`/wechat/page/topic-intro?topicId=${businessId}`);
			}else{
				window.toast('unknown businessType');
			}
		}
	}

	render(){
		return (
			<div className="member-center__member-coupon">
				<div className="title">{this.props.moduleData.title}</div>
				<div className="module-tip">{this.props.moduleData.intro}</div>
				<div className="coupon-list">
					{
						this.state.frontFaceCouponList.map((item, i) => {
							const backFaceCouponItem = this.state.backFaceCouponList[i] || {};
							return (
								<div className="coupon-item" key={i}>

									<div className="item-container"
									     style={{
										     transform: `rotateX(${this.state.itemRotateX}deg)`
									     }}
									>
										<div className="main-body">
											<div className="poster">
												<Picture src={item.headImage}/>
												<div className="view-count">{digitFormat(item.learningNum)}次学习</div>
											</div>
											<div className="course-info">
												<div className="name">
													<div className="content">
														{item.businessName}
													</div>
												</div>
												<span className="price">￥{formatMoney(item.discount > 0 ? item.discount : item.amount)}</span>
											</div>
										</div>
										<div className="coupon-info">
											<div className="price"><span className="unit">￥</span>{formatMoney(item.promotionMoney)}</div>
											<div className={`get-btn${item.status === 'used' ? ' disable' : ''}${item.status === 'bind' ? ' bind' : ''}`}
											     onClick={e => this.getCoupon(item, 'frontFace')}>
												{
													item.status === 'none' &&
													'领取使用'
												}
												{
													item.status === 'bind' &&
													'立即使用'
												}
												{
													item.status === 'used' &&
													'已使用'
												}
											</div>
										</div>

									</div>

									<div className="item-container"
									     style={{
										     transform: `rotateX(${this.state.itemRotateX + 180}deg)`
									     }}
									>
										<div className="main-body">
											<div className="poster">
												<Picture src={backFaceCouponItem.headImage}/>
												<div className="view-count">{digitFormat(backFaceCouponItem.learningNum)}次学习</div>
											</div>
											<div className="course-info">
												<div className="name">
													<div className="content">
														{backFaceCouponItem.businessName}
													</div>
												</div>
												<span className="price">￥{formatMoney(backFaceCouponItem.discount > 0 ? backFaceCouponItem.discount : backFaceCouponItem.amount)}</span>
											</div>
										</div>
										<div className="coupon-info">
											<div className="price"><span className="unit">￥</span>{formatMoney(backFaceCouponItem.promotionMoney)}</div>
											<div className={`get-btn${backFaceCouponItem.status === 'used' ? ' disable' : ''}${backFaceCouponItem.status === 'bind' ? ' bind' : ''}`}
											     onClick={e => this.getCoupon(backFaceCouponItem, 'backFace')}>
												{
													backFaceCouponItem.status === 'none' &&
													'领取使用'
												}
												{
													backFaceCouponItem.status === 'bind' &&
													'立即使用'
												}
												{
													backFaceCouponItem.status === 'used' &&
													'已使用'
												}
											</div>
										</div>

									</div>

								</div>
							)
						})
					}

					<div className={`replace-btn replacing on-log${this.state.isReplacing ? '' : ' paused'}`}
					     onClick={this.replaceBtnClickHandle}
					     data-log-region="member-coupon-replace-btn"
					>换一批</div>
				</div>
				{
					this.state.showTip && document.querySelector('.member-center-page') &&
					createPortal(
						<div className="member-coupon__join-tip-dialog" onClick={e => this.setState({ showTip: false })}>
							<div className="dialog-container"  onClick={e => e.stopPropagation()}>
								<div className="title">温馨提示</div>
								<div className="content">此优惠券为会员专享，开通会员立即领取你的尊享优惠券。</div>
								<div className="join-btn" onClick={this.props.joinMembership}>立即开通</div>
								<div className="remove-btn icon_delete"  onClick={e => this.setState({ showTip: false })}></div>
							</div>
						</div>,
						document.querySelector('.member-center-page')
					)
				}
			</div>
		)
	}
}

export default MemberCoupon;