/**
 *
 * @author Dylan
 * @date 2018/6/6
 */
import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import { withRouter, Link } from 'react-router';
import classNames from 'classnames';

import {
	locationTo,
	formatDate,
	formatMoney,
	formatNumber,
	paymentPrice,
} from 'components/util';
import TryListenBtn from '../try-listen-btn/index';

const getMoneyBit = (n) => {
	let s = String(n);
	let len = s.length;
	let hasDot = s.indexOf('.') > -1;
	return hasDot ? len - 1 : len;
}

const BuyBtn = props => {
	// 当前使用的优惠券
	let couponPrice = props.coupon && props.coupon.useRefId && props.coupon.money || 0

	return(
		<div className={classNames("buy-btn on-log on-visible", props.className)}
			onClick={props.onBuyBtnClick}
			data-log-name="立即学习"
			data-log-region={props.region}
		>{
			props.showDiscount ?
				<Fragment>
					<div className="discount-status flex flex-center">
						{ 
							Object.is(props.marketingInfo.discountStatus, "Y") ? 
							<div className="flex flex-center height-1 emphasize">
								<i className="icon-fire"></i>
								<p className="flex flex-vend height-1">立即抢购
									{
										props.isOpenMemberBuy || couponPrice > 0  ? 
										<span className="payment-price">{paymentPrice(props.chargeInfo.discount * 100, props.isOpenMemberBuy, couponPrice)}</span>
										: null
									}
								</p>
							</div>
							:
							(Object.is(props.marketingInfo.discountStatus, "P") || Object.is(props.marketingInfo.discountStatus, "GP") || Object.is(props.marketingInfo.discountStatus, "K")) && (
							<s className={"price-num " + (getMoneyBit(props.chargeInfo.amount) > 3 ? 'font-size-10' : '')}>
								{ /P|GP/.test(props.marketingInfo.discountStatus) ? '单独报名' : '原价报名' }
								{getMoneyBit(props.chargeInfo.amount) > 3 ? <br /> : null}
								￥{props.chargeInfo.amount}
							</s>
						)}
					</div>
				</Fragment>
				:
				<div className="normal-status flex flex-center">
					{
						/P|GP|K/.test(props.marketingInfo?.discountStatus) ?
						<p className={getMoneyBit(props.chargeInfo.amount) > 3 ? 'font-size-10' : ''}>
							{ 
								/P|GP/.test(props.marketingInfo?.discountStatus) ?
								'单独报名' : '原价报名'
							}
							{getMoneyBit(props.chargeInfo.amount) > 3 ? <br /> : null}
							<span className="price-num"><s>￥</s>{props.chargeInfo.amount}</span>
							{
								!/P|GP|K/.test(props.marketingInfo?.discountStatus) ? 
								<span className="payment-price">{paymentPrice(props.chargeInfo.amount * 100, props.isOpenMemberBuy, couponPrice)}</span> : null
							}
						</p>
						:
						<div className="flex flex-center height-1 emphasize">
							<i className="icon-fire"></i>
							<p className="flex flex-vend">立即学习
								<span className="price-num"><s>￥</s>{props.chargeInfo.amount}</span>
								{
									!props.chargeInfo.chargeMonths && (props.isOpenMemberBuy || couponPrice > 0)  ? 
									<span className="payment-price">{paymentPrice(props.chargeInfo.amount * 100, props.isOpenMemberBuy, couponPrice)}</span>
									: null
								}
							</p>
						</div>
					}
					{
						props.chargeInfo.chargeMonths > 0 && (
							props.chargeInfo.chargeMonths > 1 ?
								`/${props.chargeInfo.chargeMonths}个月` : `/月`
						)
					}
				</div>
		}</div>
	);
}

// 训练营提示
const CampTi = () => (
	<div className="camp-ti">
		<img src={ require("../../img/ti.png") }/>
	</div>
)

@withRouter
@autobind
class BottomPurchasePanel extends Component {
	state = {
		isTi: !this.props.isShowOperateMenuTips
	}
	
	componentDidMount(){
		this.changeTi();
	}
	componentWillReceiveProps({ isAuthChannel,isVip,channelInfo,isShowOperateMenuTips }){
		const {isAuthChannel: preIsAuthChannel,isVip: isPreVip,isShowOperateMenuTips:isShow} = this.props;
		if(isAuthChannel !== preIsAuthChannel || (isVip !== isPreVip && channelInfo.isRelay != 'Y') || (isShowOperateMenuTips !== isShow)){
			this.setState({
				isTi: true
			})
			this.changeTi();
		}
	}
	changeTi(){
		setTimeout(() => {
			this.setState({
				isTi: false
			})
		},3000)
	}
	data = {
		groupId: this.props.location.query.groupId
	};
	render(){
		let currentGroup = this.props.groupResult// 找到是否有参团的团员
		const { isJoinUni, joinUniversityBtn, isBooks, isAnimate, isUniCourse } = this.props;
        // 是解锁课
        if(this.props?.chargeInfo?.discountStatus == 'UNLOCK') {
            // 已经报名
            if(this.props.isAuthChannel) {
                // 未解锁完
                if (this.props.unlockInfo.unlockStatus == 'wait') {
                    return (
                        <div className="channel-bottom-purchase-panel">
                            <div className="buy-btn unlock-btn on-log on-visible"
                                 data-log-region="deblocking_all"
                                 data-log-pos=""
                                 onClick={() => this.props.onUnlockBtnClick()}
							>
								<span className="deco-icon deco-left"></span>
								<i className="buy-btn-icon"></i>解锁剩余课程
								<span className="deco-icon deco-right"></span>
							</div>
                        </div>
                    )
                } else {
                    return (
                        <div className="channel-bottom-purchase-panel">
                            <div className="buy-btn on-log on-visible"
                                 onClick={this.props.enterCourse}
                                 data-log-name={ this.props.isCamp ? '进入训练营' : '进入课程' }
                                 data-log-region={this.props.isCamp  ? 'enter_training' : 'enter-course'}
                            >{ this.props.isCamp ? '进入训练营' : '进入课程' }</div>
                        </div>
                    )
                }
            }
            // 未报名
            else {
                return (
                    <div className="channel-bottom-purchase-panel">
                        {
                            this.props.auditionOpenCourse ? <TryListenBtn auditionOpenCourse={this.props.auditionOpenCourse}/> : null
                        }
                        <div className={classNames("buy-btn on-log on-visible")}
                             data-log-region="buy-btn"
                             data-log-pos="deblocking"
                             onClick={this.props.onBuyBtnClick}>
                            <p>活动价{this.props.chargeInfo.discount}元 <s className="origin-price">￥{this.props.chargeInfo.amount}</s></p>
                        </div>
                    </div>
                )
            }
            
        }
		if(this.props.isAuthChannel || (this.props.isVip && this.props.channelInfo.isRelay != 'Y')){
			return (
				<div className={ `channel-bottom-purchase-panel un-btm-channel` }>
					{ this.props.tracePage !== 'training-intro' && this.state.isTi && this.props.isCamp && <CampTi /> }
					{
						/* 请好友免费听 || 女大邀请好友 */
						(this.props.canInvite) ?
						<div className="buy-btn on-log style-white on-visible uni-friend"
							onClick={this.props.inviteFriends}
							data-log-name="请好友听"
							data-log-region={ isUniCourse ? 'uni-friend' : 'series-bottom' }
							data-log-pos = "invite-listen"
						>请好友听</div> : null
					}
					{
						isUniCourse && <div className={ `buy-btn uni-add-btn on-log on-visible ${ isAnimate ? 'add' : '' } ${ isJoinUni ? 'join-btn' : '' }` } onClick={ () => joinUniversityBtn(isBooks) }>
						<span>{ isJoinUni ? '已加课表' : '加入课表' }</span>
					</div>
					}
					{
						// 拉人返学费
						!this.props.canInvite && this.props.showBackTuitionBanner ?
						<div className="buy-btn on-log style-white on-visible"
							onClick={this.props.openBackTuitionDialog}
							data-log-name="返学费"
							data-log-region="returnFee"
							data-log-pos = "2"
						>返学费<s>￥</s>{this.props.returnMoney}</div> : null
					}
					<div className="buy-btn on-log on-visible uni-add"
					     onClick={this.props.enterCourse}
					     data-log-name={ this.props.isCamp ? '进入训练营' : '进入课程' }
					     data-log-region={this.props.isCamp  ? 'enter_training' : 'enter-course'}
					>{ this.props.isCamp ? '进入训练营' : '进入课程' }</div>
				</div>
			)
		} else if (this.props.isPeriodEnd) {
			return (
				<div className="channel-bottom-purchase-panel">
					<div className="buy-btn on-log on-visible"
						onClick={this.props.enterCampIntro}
						data-log-name="报名截止，看看其他"
						data-log-region="enter-camp-intro-btn"
					>报名截止，看看其他</div>
				</div>
			)
		} else if(this.props.s === 'taskcard' && this.props.sign && this.props.t){
			// 任务邀请卡新增个“任务完成按钮”
			return (
				<div className="channel-bottom-purchase-panel">
					<div className="buy-btn on-log on-visible"
						onClick={this.props.authTaskCard}
						data-log-name="免费报名"
						data-log-region="free-charge-btn"
					>开始学习<span className="price-num">任务已完成</span></div>
				</div>
			)
		}else if(this.props.isFree){
			return (
				<div className="channel-bottom-purchase-panel">
					<div className="buy-btn on-log on-visible"
					     onClick={this.props.onBuyBtnClick}
					     data-log-name="免费报名"
					     data-log-region="free-charge-btn"
					>免费报名</div>
				</div>
			)
		}else if(this.props.marketingInfo.discountStatus === 'P' || this.props.marketingInfo.discountStatus === 'GP'){
			// 判断 团长 团员  还要注意这个团是否失败了 失败的话 重开, 没有的话 往下走
			if(this.props.myGroupInfo.id || (currentGroup && currentGroup.result && currentGroup.result != 'FAIL')){
				return (
					<div className="channel-bottom-purchase-panel">
						<div className="buy-btn on-log on-visible"
						     onClick={() => locationTo(`/topic/channel-group?liveId=${this.props.channelInfo.liveId}&channelId=${this.props.channelInfo.channelId}&groupId=${this.props.myGroupInfo.id || (currentGroup && currentGroup.groupId)}&type=sponser`)}
						     data-log-name="查看拼课"
						     data-log-region="check-group-btn"
						>查看拼团</div>
					</div>
				)
			}
			else if (currentGroup && currentGroup.result && currentGroup.result == 'FAIL') {
				return (
					<div className="channel-bottom-purchase-panel">
						{
							this.props.auditionOpenCourse ? <TryListenBtn auditionOpenCourse={this.props.auditionOpenCourse}/> : null
						}
						<BuyBtn
							className="style-white"
							onBuyBtnClick={this.props.onBuyBtnClick}
							chargeInfo={this.props.chargeInfo}
							coupon={this.props.coupon}
							showDiscount={this.props.showDiscount}
							isOpenMemberBuy={this.props.isOpenMemberBuy}
							region={`buy-btn-in-${this.props.marketingInfo.discountStatus}-group`}
							marketingInfo={this.props.marketingInfo}
						/>
						{
							this.props.marketingInfo.discountStatus === 'P' ?
								<div className="buy-btn style-group on-log on-visible"
								     onClick={this.props.createGroup}
								     data-log-name="免费拼团"
								     data-log-region="create-group-btn"
								     data-log-pos="free"
								><p>免费开团<s>￥</s>0</p></div>
								:
								<div className="buy-btn style-group on-log on-visible"
								     onClick={this.props.createGroup}
								     data-log-name="拼团学习"
								     data-log-region="create-group-btn"
								     data-log-pos="charge"
								>
									<p className={getMoneyBit(this.props.marketingInfo.discount) > 5 ? 'font-size-10': ''}>
										拼团{getMoneyBit(this.props.marketingInfo.discount) > 5 ? <br /> : null}<s>￥</s><span className="price-num">{this.props.marketingInfo.discount}</span>
									</p>
								</div>
						}
					</div>
				)
			}
			else if(this.data.groupId){
				return (
					<div className="channel-bottom-purchase-panel">
						{
							this.props.auditionOpenCourse ? <TryListenBtn auditionOpenCourse={this.props.auditionOpenCourse}/> : null
						}
						<BuyBtn
							className="style-white"
							onBuyBtnClick={this.props.onBuyBtnClick}
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
									<div className="buy-btn style-group on-log on-visible"
										onClick={this.props.createGroup}
										data-log-name="免费拼团"
										data-log-region="create-group-btn"
										data-log-pos="free"
									><p>免费开团<s>￥</s>0</p></div>
									:
									<div className="buy-btn style-group on-log on-visible"
										onClick={this.props.createGroup}
										data-log-name="拼团学习"
										data-log-region="create-group-btn"
										data-log-pos="charge"
									>
										<p className={getMoneyBit(this.props.marketingInfo.discount) > 5 ? 'font-size-10' : ''}>
										拼团{getMoneyBit(this.props.marketingInfo.discount) > 5 ? <br /> : null}<s>￥</s><span className="price-num">{this.props.marketingInfo.discount}</span>
										</p>
									</div>
							: <div className="buy-btn style-group on-log on-visible"
									onClick={() => this.props.joinGroup(this.data.groupId)}
									data-log-name="拼团学习"
									data-log-region="join-group-btn"
							>
								<p className={getMoneyBit(this.props.marketingInfo.discount) > 5 ? 'font-size-10' : ''}>
									拼团{getMoneyBit(this.props.marketingInfo.discount) > 5 ? <br /> : null}<s>￥</s><span className="price-num">{this.props.marketingInfo.discount}</span>
								</p>
							</div>
						}
						
					</div>
				)
			}
			else{
				return (
					<div className="channel-bottom-purchase-panel">
						{
							this.props.auditionOpenCourse ? <TryListenBtn auditionOpenCourse={this.props.auditionOpenCourse}/> : null
						}
						<BuyBtn
							className="style-white"
							onBuyBtnClick={this.props.onBuyBtnClick}
							chargeInfo={this.props.chargeInfo}
							coupon={this.props.coupon}
							showDiscount={this.props.showDiscount}
							isOpenMemberBuy={this.props.isOpenMemberBuy}
							region={`buy-btn-in-${this.props.marketingInfo.discountStatus}-group`}
							marketingInfo={this.props.marketingInfo}
						/>
						{
							this.props.marketingInfo.discountStatus === 'P' ?
								<div className="buy-btn style-group on-log on-visible"
								     onClick={this.props.createGroup}
								     data-log-name="免费拼团"
								     data-log-region="create-group-btn"
								     data-log-pos="free"
								><p>免费开团<s>￥</s>0</p></div>
								:
								<div className="buy-btn style-group on-log on-visible"
								     onClick={this.props.createGroup}
								     data-log-name="拼团学习"
								     data-log-region="create-group-btn"
								     data-log-pos="charge"
								>
									<p className={getMoneyBit(this.props.marketingInfo.discount) > 5 ? 'font-size-10' : ''}>
										拼团{getMoneyBit(this.props.marketingInfo.discount) > 5 ? <br /> : null}<s>￥</s><span className="price-num">{this.props.marketingInfo.discount}</span>
									</p>
								</div>
						}
					</div>
				)
			}

		}else if(this.props.marketingInfo.discountStatus === 'K' && this.props.isWithinShareCut){
			return (
				<div className="channel-bottom-purchase-panel">
					{
						this.props.auditionOpenCourse ? <TryListenBtn auditionOpenCourse={this.props.auditionOpenCourse}/> : null
					}
					<BuyBtn
						className="style-white"
						onBuyBtnClick={this.props.onBuyBtnClick}
						chargeInfo={this.props.chargeInfo}
						coupon={this.props.coupon}
						showDiscount={this.props.showDiscount}
						isOpenMemberBuy={this.props.isOpenMemberBuy}
						region="buy-btn-in-share-cut"
						marketingInfo={this.props.marketingInfo}
					/>
					<div className="buy-btn style-cut on-log on-visible"
					     onClick={this.props.gotoShareCut}
					     data-log-name="砍价按钮"
					     data-log-region="share-cut-btn"
					>
						<p className={getMoneyBit(this.props.shareCutCourseInfo.minimumAmount) > 5 ? 'font-size-10' : ''}>
							发起砍价{getMoneyBit(this.props.shareCutCourseInfo.minimumAmount) > 5 ? <br /> : null}<s>￥</s><span className="price-num">{formatMoney(this.props.shareCutCourseInfo.minimumAmount)}</span>
						</p>
					</div>
				</div>
			)
		}else{
			return (
				<div className="channel-bottom-purchase-panel">
					{
						this.props.auditionOpenCourse ? <TryListenBtn auditionOpenCourse={this.props.auditionOpenCourse}/> : null
					}
					<BuyBtn
						onBuyBtnClick={this.props.onBuyBtnClick}
						chargeInfo={this.props.chargeInfo}
						coupon={this.props.coupon}
						showDiscount={this.props.showDiscount}
						isOpenMemberBuy={this.props.isOpenMemberBuy}
						marketingInfo={this.props.marketingInfo}
						isFlex= {(this.props.channelInfo.chargeType === 'flexible')}
						region={`${this.props.channelInfo.chargeType === 'flexible' ? 'flexible-buy-btn' : (this.props.chargeInfo.discountStatus === 'Y' && this.props.showDiscount ? 'discount-buy-btn' : 'buy-btn')}`}
					/>
				</div>
			)
		}
	}
}

export default BottomPurchasePanel;
