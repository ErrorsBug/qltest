import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import BottomDialog from 'components/dialog/bottom-dialog'
import errorCatch from 'components/error-boundary/index';

import {
	formatMoney,
    formatNumber
} from 'components/util';

import {
    updateCouponInfo,
} from '../../actions/topic-intro'
import {
    updateCurChannelCoupon,
} from '../../actions/channel-intro'

@errorCatch
@autobind
class PaymentDetailsDialog extends Component {

    state = {
        activeChargeIndex: 0
    }

    componentDidMount() {
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.couponLists && nextProps.couponLists && this.props.couponLists.length !== nextProps.couponLists.length) {
            console.log('优惠券列表有变动, 重新筛出最大优惠券')
            let coupon;
            if (this.props.businessType === 'channel') {
                coupon = this.props.curChannelCoupon
            } else {
                coupon = this.props.curTopicCoupon
            }

            console.log('是否重新筛出最大优惠券： coupon: ', coupon, 'receiveSource: ', coupon && coupon.receiveSource)
            if (!coupon || coupon.receiveSource !== 'actCouponDialog') {
                this.autoSelectCoupon('', nextProps.couponLists, nextProps.businessType)
            }
        }
    }

    // 当前课程价格
    currCharge (businessType) {
        let charge = {}

        if (businessType === 'channel') {
            charge = this.props.chargeConfigs[this.state.activeChargeIndex]
        } else {
            charge.amount = formatMoney(this.props.topicInfo.money || 0);
        }

        return charge
    }

    // 有优惠券时 返回优惠券的价格
    get currCouponPrice () {
        let coupon;
        if (this.props.businessType === 'channel') {
            coupon = this.props.curChannelCoupon
        } else {
            coupon = this.props.curTopicCoupon
        }

        if (coupon && (coupon.useRefId || coupon.couponId) && coupon.couponType !== 'app') {
            const charge = this.currCharge(this.props.businessType)
            let price = charge.amount * 100
            if (this.props.businessType === 'channel' && this.props.showDiscount) {
                price = charge.discount * 100
            }

            // 如果该券是折扣券，优先使用，并算出省多少钱
            if(coupon.couponType === 'discount'){
                return formatMoney(price * (100 - coupon.discount) / 100)
            }
            
            if (price*100 >= coupon.minMoney) {
                return formatMoney(coupon.money)
            }
        } else {
            console.log('没有优惠券/当前选中券无效')
            this.autoSelectCoupon()
        }

        return 0
    }

    chargeConfigsToggle (activeChargeIndex, charge) {
        this.props.toggleChargeIndex && this.props.toggleChargeIndex(activeChargeIndex)
        
        this.autoSelectCoupon(charge)

        this.setState({
            activeChargeIndex
        })
    }

    // 自动选中可使用的最大优惠券
    async autoSelectCoupon (chargeConfig, couponLists, businessType) {
        const {
            showDiscount,
            fromPage,
        } = this.props

        const _couponLists = couponLists || this.props.couponLists
        const _businessType = businessType || this.props.businessType
        const charge = chargeConfig || this.currCharge(_businessType)

        let price = charge.amount

        if (_businessType === 'channel' && showDiscount) {
            price = charge.discount
        }
        price *= 100
        const now = this.props.sysTime
        // 判断是否有平台通用券，有的话优先使用
        const isHavePlatformCoupon = _couponLists.find(i => i.couponType === 'discount')
        const matchCouponList = _couponLists.filter( coupon => 
            coupon.minMoney <= price 
            && (!coupon.overTime || now < coupon.overTime ) 
            && coupon.couponType !== 'app'
        )

        let coupon = {}
        if (isHavePlatformCoupon || matchCouponList.length > 0) {
            coupon = isHavePlatformCoupon || { ...matchCouponList[0] }
            
            if (fromPage === 'channel') {
                await this.props.updateCurChannelCoupon(coupon)
            } else {
                const couponInfo = {}
                if (_businessType === 'channel') {
                    couponInfo.channelCoupon = coupon
                } else {
                    couponInfo.topicCoupon = coupon
                }
                await this.props.updateCouponInfo(couponInfo);
            }
        }
    }

    payBusiness (amount) {
        if (this.props.businessType === 'channel') {
            this.props.pay(this.props.chargeConfigs[this.state.activeChargeIndex].id, amount)
        } else {
            this.props.pay( '', amount)
        }
    }

    render() {
        
        if (!this.props.isShow) return null

        const { businessType, chargeType, chargeConfigs, showDiscount = false, isOpenMemberBuy } = this.props
        const charge = this.currCharge(businessType)
        const originalPrice = charge.amount
        let couponPrice = this.currCouponPrice


        let payPrice = charge.amount

        if (businessType === 'channel' && showDiscount) {
            payPrice = charge.discount
        }

        // 判断是否达到优惠券使用门槛
        const couponUsePrice = payPrice * 100

        // 当优惠券金额大于原价或特价时
        if (couponPrice > payPrice) {
            couponPrice = payPrice
        }
        payPrice = payPrice - couponPrice
        
        let memberPrice = 0
        if (isOpenMemberBuy) {
            memberPrice = formatNumber(payPrice - formatNumber(payPrice * 0.8))
            payPrice = payPrice - memberPrice
        }

        return (
            <BottomDialog
                show={ this.props.isShow }
                theme='empty'
                onClose={ this.props.onClose }
                className="payment-details-dialog-box"
            >
                <main className='payment-details-dialog'>
                    <header>付费详情<i className="close" onClick={ this.props.onClose }></i></header>
                    <main>
                        {
                            businessType === 'channel' && chargeType === 'flexible' && (
                                <section className="detail-row buy-type">
                                    <p>选择购买类型</p>
                                    <div className="buy-type-list">
                                        {
                                            chargeConfigs.map((item, index) => (
                                                <span
                                                    key={`buy-type-${index}`}
                                                    className={index == this.state.activeChargeIndex ? 'activate' : ''}
                                                    onClick={() => { this.chargeConfigsToggle(index, item) }}
                                                    >￥{item.amount}/{item.chargeMonths}月</span>
                                            ))
                                        }
                                    </div>
                                </section>
                            )
                        }
                        <section className="detail-row">
                            <span className="row-label">课程价格</span>
                            <span className="row-content">￥{originalPrice}</span>
                        </section>
                        {
                            businessType === 'channel' && showDiscount && (
                                <section 
                                    className="detail-row"
                                    >
                                    <span className="row-label">限时特价</span>
                                    <span className="row-content red-text">-￥{formatNumber(charge.amount - charge.discount)}</span>
                                </section>
                            )
                        }
                        {
                            couponPrice > 0 && (
                                <section 
                                    className="detail-row"
                                    onClick={ () => { this.props.showCouponList(businessType, couponUsePrice) }}
                                    >
                                    <span className="row-label">优惠券</span>
                                    <span className="row-content red-text">-￥{couponPrice}<i className="icon_enter"></i></span>
                                </section>
                            )
                        }
                        {
                            isOpenMemberBuy && (
                                <section className="detail-row">
                                    <span className="row-label">会员折扣</span>
                                    <span className="row-content red-text">-￥{memberPrice}</span>
                                </section>
                            )
                        }
                    </main>
                    <footer className="detial-button">
                        <span
                            onClick={()=>{ this.payBusiness(payPrice > 0 ? payPrice : 0) }}
                            >立即付款￥{payPrice > 0 ? formatNumber(payPrice) : 0}</span>
                    </footer>
                </main>
            </BottomDialog>
        )
    }
}

function mapStateToProps(state) {
    return {
        sysTime: state.common.sysTime,
    }
}

const mapActionToProps = {
    updateCouponInfo,
    updateCurChannelCoupon,
};

export default connect(mapStateToProps, mapActionToProps, null, {
    withRef: true
})(PaymentDetailsDialog);