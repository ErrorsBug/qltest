/**
 *
 * @author Dylan
 * @date 2019-05-27
 */
import classNames from "classnames";
import {Fragment} from "react";
import React from "react";

const getMoneyBit = (n) => {
	let s = String(n);
	let len = s.length;
	let hasDot = s.indexOf('.') > -1;
	return hasDot ? len - 1 : len;
};

export default props => {
	return(
		<div className={classNames("buy-btn on-log on-visible", props.className)}
			 onClick={props.onBuyBtnClick}
			 data-log-name="立即学习"
			 data-log-region={props.region}
		>{
			props.showDiscount ?
				<Fragment>
					<div className="discount-status">
						{ Object.is(props.marketingInfo.discountStatus, "Y") ? '立即抢购' :
							(Object.is(props.marketingInfo.discountStatus, "P") || Object.is(props.marketingInfo.discountStatus, "GP") || Object.is(props.marketingInfo.discountStatus, "K")) && (
								<s className={"price-num " + (getMoneyBit(props.chargeInfo.amount) > 4 ? 'font-size-10' : '')}>原价购买{getMoneyBit(props.chargeInfo.amount) > 4 ? <br /> : null}￥{props.chargeInfo.amount}</s>
							)}
					</div>
				</Fragment>
				:
				<p>
					{
						Object.is(props.marketingInfo.discountStatus, "N")
						|| ( !props.showDiscount && (Object.is(props.marketingInfo.discountStatus, "Y") || Object.is(props.marketingInfo.discountStatus, "K")) )
						|| !!props.isFlex ?
							<span>立即学习<s>￥</s><span className="price-num">{props.chargeInfo.amount}</span></span>:
							<span className={getMoneyBit(props.chargeInfo.amount) > 4 ? 'font-size-10' : ''}>原价购买{getMoneyBit(props.chargeInfo.amount) > 4 ? <br /> : null}<s>￥</s><span className="price-num">{props.chargeInfo.amount}</span></span>
					}
					{
						props.chargeInfo.chargeMonths > 0 && (
							props.chargeInfo.chargeMonths > 1 ?
								`/${props.chargeInfo.chargeMonths}个月` : `/月`
						)
					}
				</p>
		}</div>
	);
}