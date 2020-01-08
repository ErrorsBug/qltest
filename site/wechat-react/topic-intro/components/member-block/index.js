/**
 *
 * @author wei.chen
 * @date 2018/10/25
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import { get } from 'lodash';
import classnames from 'classnames'
import { locationTo, formatMoney, formatNumber, isFromLiveCenter } from 'components/util';



class MemberBlock extends Component {

	state = {
		isShow: false,
		memberCourseType: '',
	}

	async componentDidMount () {
	}

	// 计算会员价
	get memberPrice () {
		let price = 0
		let couponPrice = 0
		let curCoupon = null
		if (this.props.businessType === 'channel') {
			const charge = this.props.info[0];
			price = (this.props.showDiscount ? charge.discount : charge.amount) * 100
			curCoupon = this.props.curCoupon
			// 如果该券是折扣券
            if(curCoupon && curCoupon.couponType === 'discount' && curCoupon.overTime > Date.now()){
				couponPrice = price * (100 - curCoupon.discount) / 100
            }else if (curCoupon && curCoupon.useRefId && price >= curCoupon.minMoney) {
				couponPrice = curCoupon.money
			}
		} else {
			price = this.props.info.money
			curCoupon = this.props.curTopicCoupon
			// 如果该券是折扣券
			if(curCoupon && curCoupon.couponType === 'discount' && curCoupon.overTime > Date.now()){
				couponPrice = price * (100 - curCoupon.discount) / 100
            }else if (curCoupon && curCoupon.useRefId && price >= curCoupon.minMoney) {
				couponPrice = curCoupon.money
			}
		}
		const memberPrice = formatNumber((price - couponPrice) * 0.8)
		return memberPrice > 0 ? memberPrice : 0
	}

	toMemberCenter () {
		if(this.props.memberCourseType && this.props.isMember && this.props.memberInfo.courseNum > 0){
			locationTo(`/wechat/page/membership-master?businessId=${this.props.businessId}&businessType=${this.props.businessType}`);
		}else{
			locationTo(`/wechat/page/membership-center?businessId=${this.props.businessId}&&businessType=${this.props.businessType}`);
		}
	}

	// 课程是否有营销活动
	get isMarketing () {
		const { marketingInfo } = this.props;
		return marketingInfo && ((Object.is(marketingInfo.discountStatus, 'K') && this.props.isK) || Object.is(marketingInfo.discountStatus, 'P') || (Object.is(marketingInfo.discountStatus, 'Y') && this.props.showDiscount) || Object.is(marketingInfo.discountStatus, 'GP'))
	}

	renderText () {
	}
 
	render(){
		const isMarketing = this.isMarketing

		const cls = classnames('member-block on-log on-visible', {
			'normal': !isMarketing,
			'member-special': isMarketing,
		})
		
		const {
			isMember,
			memberInfo,
			memberCourseType, // quality：大课 free：小课
			memberCourseReceive
		} = this.props
		let price = 0
		
		if (this.props.businessType === 'channel') {
			price = this.props.info[0].amount * 100
		} else {
			price = this.props.info.money
		}

		if (isMember) {
			// 会员访问小课课程
			if (memberCourseType === 'free') return <ContentAssemble className={cls} {...this.props}>您是千聊会员，可免费学习该课</ContentAssemble>
			if (memberCourseType === 'quality') {
				// 正式会员，访问大师课课程详情页
				if (memberInfo.level === 2) {
					// 已领取该课程
					if (memberCourseReceive) return <ContentAssemble className={cls} {...this.props}>您是千聊会员，可免费学习该课</ContentAssemble>
					// 未完成选课
					if (memberInfo.courseNum > 0) return <ContentAssemble className={cls} {...this.props} btnText="免费领取" onClick={() => {locationTo(`/wechat/page/membership-master?businessId=${this.props.businessId}&businessType=${this.props.businessType}`)}}>您是千聊会员，可免费领取该课</ContentAssemble>
				}
				// 体验会员，访问大师课课程详情页
				if (memberInfo.level === 1) return <ContentAssemble className={cls} {...this.props} btnText="立即开通" onClick={() => {locationTo(`/wechat/page/membership-master?businessId=${this.props.businessId}&businessType=${this.props.businessType}`)}}>开通正式会员，可免费领取该课</ContentAssemble>
			}
			return <ContentAssemble className={cls} {...this.props}>您是千聊会员，已为您节省{formatMoney(price - this.memberPrice)}元</ContentAssemble>
		} else {
			// 非会员
			if (memberCourseType) return <ContentAssemble className={cls} {...this.props} btnText="立即开通" onClick={() => {locationTo(`/wechat/page/membership-center?businessId=${this.props.businessId}&&businessType=${this.props.businessType}`)}}>开通会员，可免费领取该课</ContentAssemble>
			else return <ContentAssemble className={cls} {...this.props} btnText="立即开通" onClick={() => {locationTo(`/wechat/page/membership-center?businessId=${this.props.businessId}&&businessType=${this.props.businessType}`)}}>开通会员，该课仅需 <span className="member-price">&yen;{formatMoney(this.memberPrice)}</span></ContentAssemble>
		}
	}
}

const ContentAssemble = (props) => {
	const {
		btnText,
		children,
		className,
		isFixBottom,
		isShow,
		onClick = () => {}
	} = props
	return [
		<div 
			className={className} 
			data-log-name="开通会员"
			data-log-region="member-block-btn"
			data-log-pos="normal"
			onClick={onClick}>
			<i className="icon-meber-vip"></i>
			<p className="member-tips">{children}</p>
			{
				btnText && (
					<div className="open-member-btn">
						{btnText}
						<i className='icon_enter'></i>
					</div>
				)
			}
		</div>,
		isFixBottom && createPortal(
			<div 
				className={`member-block on-log on-visible fix-bottom ${isShow ? 'show' : ''}`} 
				data-log-name="开通会员"
				data-log-region="member-block-btn"
				data-log-pos="fixed"
				onClick={onClick}>
				<i className="icon-meber-vip"></i>
				<p className="member-tips">{children}</p>
				{
					btnText && (
						<div className="open-member-btn">
							{btnText}
							<i className='icon_enter'></i>
						</div>
					)
				}
			</div>,
            document.querySelector('.portal-container')
		)
	]
}

function mapStateToProps(state) {
	const obj = {
    sysTime: state.common.sysTime,
		// 话题优惠券
    curChannelCoupon: get(state, 'topicIntro.curChannelCoupon'),
		curTopicCoupon: get(state, 'topicIntro.curTopicCoupon'),
		// 系列课优惠券
    curCoupon: get(state, 'channelIntro.curCoupon'),
	}
	return obj;
}

const mapActionToProps = {
};

export default connect(mapStateToProps, mapActionToProps)(MemberBlock);