/**
 *
 * @author Dylan
 * @date 2018/6/7
 */
import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { formatMoney } from 'components/util';

@autobind
class CouponBtn extends Component {

	render(){
		const {
			currCoupon,
			showCoupon,
			bindReceiveCoupon
		} = this.props
		const {
			isReceive, 
			animation, 
			autoBind, 
		} = currCoupon
		if(currCoupon && currCoupon.id){
			return (
				<div className={ `intro-page-coupon-btn on-log on-visible` }
						data-log-name="优惠券按钮"
						data-log-region="coupon-btn"
						onClick={isReceive || animation ? showCoupon : bindReceiveCoupon}
				>
					{
						isReceive ?
						<span className="tips receive">购买时自动抵扣</span>
						:
						<span className={ `tips animation ${ animation ? (autoBind ? 'auto-bind' : 'receive') : '' }` }>{ animation ? (autoBind ? '抢到限时券' : '购买时自动抵扣') : '优惠券' }</span>
					}
					<span className="price">{formatMoney(currCoupon.money)}</span>
				</div>
			)
		}else{
			return null;
		}
	}
}

export default CouponBtn