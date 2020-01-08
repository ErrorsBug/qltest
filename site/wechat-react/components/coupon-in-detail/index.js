import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { getCouponForIntro,receiveCoupon } from 'common_actions/coupon';
import { locationTo, getVal } from '../util';

import CouponTip from '../coupon-dialog/coupon-tip'
import CouponDialog from '../coupon-dialog';

@autobind
class CouponInDetail extends Component {

    state = {
        showCoupon: false,
        couponInDetaulData: null,

        isValid: false,
        isBinded: false,
        // 是否领取过本批次
        isTheBind: false,
    }

    componentDidMount() {
        this.getShowQrcodeInDetail();
    }

    /** 获取显示在介绍页的优惠码 */
    async getShowQrcodeInDetail() {
        try {
            const result = await getCouponForIntro(this.props.businessId, this.props.businessType);

            if (getVal(result, 'state.code') == 0) {
                this.setState({
                    couponInDetaulData: getVal(result, 'data.codePo', false),
                }, this.initCouponStatus);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /** 领取按钮点击 */
    onReceiveClick() {
        if(this.state.isMG){
            this.props.onGotoSet();
        }else{
            // 已经领取过了，就不处理
            if (this.state.isTheBind) {
                return;
            }

            this.props.onReceiveClick(this.state.couponInDetaulData);
        }
        
    }

    /** 初始化优惠券条的显示 */
    async initCouponStatus() {
        if (!this.state.couponInDetaulData) {
            this.setState({
                showCoupon: false
            });
            return;
        }

        try {
            const result = await receiveCoupon({
                businessType: this.props.businessType,
                businessId: this.props.businessId,
                receiveType: 'batch',
                code: this.state.couponInDetaulData.id,
            });

            if (getVal(result, 'state.code') == 0) {
                let {
                    isBinded,
                    isBlack,
                    isMG,
                    isQl,
                    isTheBind,
                    isUsed,
                    isValid,
                    isVip,
                } = getVal(result, 'data');
                let showCoupon = true;

                if (isBlack == 'Y' || isQl == 'Y' || isVip == 'Y') {//isQl是白名单，isVip是vip，isBlack是黑名单
                    showCoupon = false;
                }

                this.setState({
                    showCoupon,
                    isValid: isValid == 'Y',
                    isBinded: isBinded == 'Y',
                    isTheBind: isTheBind == 'Y',
                    isMG: isMG == 'Y',
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        if (!this.state.showCoupon) {
            return null;
        }

        return [
            <div className="show-coupon-item-wrap" key="show-coupon-item-wrap">
                <div className="show-coupon-item" onClick={ this.onReceiveClick }>

                    {
                        this.state.isTheBind ?
                            <img className="coupon-item-bg" src={require('./img/course-button-ticketdone.png')} alt=""/>
                            :
                            <img className="coupon-item-bg" src={require('./img/course-button-ticket.png')} alt=""/>
                    }

                    <div className="inner-coupon-item">
                        <div className="coupon-money">
                            <span className="money-wrap">￥<var className={String((this.state.couponInDetaulData.money / 100)).length > 4 ? 'sm':''} >{ this.state.couponInDetaulData.money / 100 }</var></span>
                        </div>

                        <div className="coupon-info">
                            <span className="label-title">课程优惠券</span>
                            <span className="label-count">仅有{ this.state.couponInDetaulData.codeNum }张，先到先得~</span>

                    {
                        this.state.isMG?
                        <span className="btn-get">设置</span>
                        :
                        (
                            this.state.isTheBind ?
                                <span className="btn-get got-it">已领取</span>
                                :
                                <span className="btn-get">领取</span>
                        )
                    }
                            
                        </div>
                    </div>
                </div>
            </div>
        ]
    }
}

const ID = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
]);

CouponInDetail.propTypes = {
    // 业务类型（topic, channel）
    businessType: PropTypes.string,
    // 对应的 id
    businessId: ID,
    // 领取按钮点击
    onReceiveClick: PropTypes.func,
    //管理员设置
    onGotoSet: PropTypes.func,
};

export default CouponInDetail;