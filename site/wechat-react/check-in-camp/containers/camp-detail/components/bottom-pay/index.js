import React, { Component } from 'react';
import { connect } from 'react-redux';

import { autobind } from 'core-decorators';

import { Confirm } from 'components/dialog';

import { setCampUserInfo } from '../../../../model/camp-user-info/actions';
import { setCampBasicInfo } from '../../../../model/camp-basic-info/actions';
import { doPay, subAterSign } from 'common_actions/common'
import { followLive } from '../../../../actions/mine';
import BottomPayDialog from '../bottom-pay-dialog';
import BottomCouponListDialog from '../bottom-coupon-list-dialog';
import CouponGetBtn from '../coupon-get-btn';
import { locationTo } from 'components/util'
import { createPortal } from 'react-dom'
import {
    checkUser
} from 'common_actions/live';

@autobind
class BottomPay extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            // 是否弹出支付框
            isOpenPayDialog: false,
            // 是否弹出优惠码列表
            isOpenCouponListDialog: false,
            // 表单配置
            notFilled: null
        }
    }

    componentDidMount () {
        this.initAutoPay()
    }

    async initAutoPay () {
        const autopay = this.props.location.query.autopay;
        
        let config = await this.props.checkUser({ liveId: this.props.liveId, businessType: 'camp', businessId: this.props.campId });
        if (config) {
            this.setState({
                notFilled: config
            })

            if (sessionStorage.getItem("saveCollect") == config.id || autopay == 'Y') {
                autopay == 'Y' && window.history.replaceState(null, null, location.pathname + location.search.replace('&autopay=Y', ''))
                this.payCamp()
                sessionStorage.removeItem("saveCollect");
            }
        }
    }

    /**
     * 支付成功的回调
     */
    async onPaySuccess(payFree = 'N'){
        // 支付成功后的回调
        setCampUserInfo({
            payStatus: 'Y'
        });
        // 关注直播间
        const result = await this.props.followLive({
            status: 'Y',
            liveId: this.props.liveId
        });
        if (result.state.code === 0) {
            setCampBasicInfo({
                isFollow: 'Y'
            });
        }

        /**
         * 支付报名成功后引导关注千聊
         * 1、首先判断是否为白名单，是白名单的直接不走后面的流程（即返回false，原来支付或报名成功后怎么做就怎么做）。
         * 2、不是白名单的去查找是否有配置，没配置的判断是否关注千聊，以及是否是专业版，两个条件有一个是的话直接返回（即返回false，原来支付或报名成功后怎么做就怎么做），不走后面流程，有一个条件不是的话直接引导关注千聊。
         * 3、有配置的话判断配置的公众号是否已经关注，全都关注的话不走后面流程（即返回false，原来支付或报名成功后怎么做就怎么做），有未关注的直接引导关注当前第一个未关注的配置公众号。
         */

        let qrUrl = await subAterSign('subAfterSignCamp',this.props.liveId, {campId: this.props.campId})
        
        if (qrUrl) {
            qrUrl.channel = 'subAfterSignCamp'
        }
        
        const {
            notFilled
        } = this.state
        // 如果没填过表且不是跳过填表状态 则需要填表 表单后置
        if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != notFilled.id) {
            locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=camp&campId=${this.props.campId}${payFree === 'Y'?'&auth=Y':''}${qrUrl ? `&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}&qrChannel=${qrUrl.channel}` : ''}`);
        } else {
            if(qrUrl){
                locationTo(`/wechat/page/new-finish-pay?liveId=${this.props.liveId}&payFree=${payFree}&type=subAfterSignCamp&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}&title=${encodeURIComponent(this.props.campInfo.name)}`)
            }else{
                locationTo(window.location.href);
            }
        }
    }

    /**
     * 支付
     */
    payCamp(price = this.props.price){

        const {
            notFilled
        } = this.state
        // 如果没填过表且不是跳过填表状态 则需要填表 表单前置
        if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != notFilled.id) {
            locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=camp&campId=${this.props.campId}${price == 0?'&auth=Y':''}`);
            return
        }

        this.props.doPay({
            campId: this.props.campId,
            type: 'LIVECAMP',
            source: 'web',
            total_fee: (price * 100).toFixed(0),
            couponId: this.props.campSatus && this.props.campSatus.couponId || '',
			couponType: this.props.campSatus && this.props.campSatus.couponId && 'live' || '',
            onPayFree: () => {
                this.onPaySuccess('Y')
            },
            callback: () => {
                this.onPaySuccess()
            },
        });
    }
    handleOpenPayDialog(){
        this.setState({
            isOpenPayDialog: true
        })
    }
    // 关闭购买弹窗
    handleClosePayDialog() {
        this.setState({
            isOpenPayDialog: false,
        });
    }
    /**
     * 点击"立即加入"按钮
     */
    handlePayButtonClick(){
        const {
            price,
            totalDays,
            currentDays,
            requiredDays,
            bonusStatus,
            couponList,
        } = this.props;
        // 训练营剩余天数小于领取契约金需打卡天数，弹出提示信息
        if (price && bonusStatus === 'Y' && (totalDays - currentDays + 1 < requiredDays)) {
            this.refs['buy-tip-confirm'].show();
        } else {
            // 否则调起支付
            if (couponList.length > 0) {
                this.handleOpenPayDialog()
            } else {
                this.payCamp();
            }
        }
    }

    /**
     * 点击提示确认框的按钮
     * @param {string} tag 
     */
    handleConfirm(tag){
        if (tag === 'confirm') {
            this.refs['buy-tip-confirm'].hide();
            //this.payCamp();
            this.handleOpenPayDialog()
        }
    }
    
    // 优惠券列表点击处理，设置active
    onCoupnoItemClick(couponId) {
        const list = this.props.couponList.map(item => {
            item.active = item.couponId == couponId;
            return item;
        });

        this.props.changeCouponList(list);
    }
    onSelectCouponList() {
        this.setState({
            isOpenPayDialog: false,
            isOpenCouponListDialog: true,
        })
    }
    onSelectedCouponItem() {
		this.setState({
			isOpenPayDialog: true,
			isOpenCouponListDialog: false,
		})

		if (this.props.couponList instanceof Array) {
            const activeCouponItem = this.props.couponList.find(item => item.active);
			this.props.updateCouponInfo(
                {   
                    money: activeCouponItem.money, 
                    couponId:activeCouponItem.couponId, 
                    couponType:activeCouponItem.couponType, 
                    minMoney:activeCouponItem.minMoney
                }
            );
		}
    }
    onCloseCouponList() {
		this.setState({
			isOpenCouponListDialog: false,
		})
	}
    render(){
        const {
            client,
            payStatus,
            price,
            bonusStatus,
            bonusPercent,
            currentDays,
            totalDays,
            requiredDays,
            campInfo,
            couponList,
        } = this.props;

        // let price = chargeInfo.discountStatus =='Y' ? chargeInfo.discount : chargeInfo.amount;
        let isHaveCoupon = couponList.length > 0 // 是否有通用优惠券
        let alerydic = this.props.campSatus.money > price ? price : this.props.campSatus.money

        const couponNode = document.querySelector('.portal-coupon-get-btn');

        return (
            <div className="bottom-pay-control-container">
                <div className="bottom-pay-control-wrapper">
                    <div className="price-tip">
                        {
                            isHaveCoupon?
                                <div className="price">券后价：<span><em className="rmb-sign">￥</em><b className="amount">{price > alerydic ? (price - alerydic).toFixed(2) : 0} </b></span><span className='del-price'>￥{price}</span></div>
                                :price > 0 ?
                                <div className="price">课程价： <span><em className="rmb-sign">￥</em><b className="amount">{price}</b></span></div>
                                :<div className="price">课程价：<b className="free">免费</b></div>
                        }
                        
                        <div className="info">
                        {/* {
                            bonusStatus === 'Y' && <div className="bonus">含契约金￥{((price-alerydic) * bonusPercent / 100).toFixed(2)}</div>
                        } */}
                        {
                           isHaveCoupon && (<div  className="bonus">优惠券：<b className="amount">-￥{alerydic}</b></div>)
                        }
                        </div>
                    </div>
                    <div className="pay-button" onClick={this.handlePayButtonClick}>立即加入</div>
                </div>
                <Confirm
                    className="buy-tip-confirm-box"
                    ref="buy-tip-confirm"
                    title="温馨提示"
                    confirmText="确定入场"
                    onBtnClick={this.handleConfirm}>
                    该打卡训练营只剩下{totalDays - currentDays + 1}天，契约金条件是需要满足打卡{requiredDays}天。您入场后无法获得契约奖金，请确认。
                </Confirm>
                {/* 支付*/}
                <BottomPayDialog
                    isShow={this.state.isOpenPayDialog}
                    chargeType={'live'}
                    isHaveCoupon={isHaveCoupon}
                    qlCouponMoney={this.props.campSatus.money}
                    minMoney={this.props.campSatus.minMoney || 0} // 满足多少钱能用
                    price={price}
                    onCloseSettings={this.handleClosePayDialog}
                    payCamp={this.payCamp}
                    onSelectCouponList={this.onSelectCouponList}
                />
                <BottomCouponListDialog
                    isShow={this.state.isOpenCouponListDialog}
                    onCloseCouponList={this.onCloseCouponList}
                    onBackCouponList={this.onBackCouponList}
                    onSelectedCouponItem={this.onSelectedCouponItem}
                    list={couponList}
                    name={campInfo.name}
                    liveName={campInfo.liveName}
                    onItemClick={this.onCoupnoItemClick}
                    campSatus={this.props.campSatus}
                />

                {
                    couponNode?
                    createPortal(
                        <CouponGetBtn 
                            addCoupon={this.props.addCoupon} 
                            gotoPay={this.handlePayButtonClick} 
                            client='C' 
                        />,
                        couponNode
                    ):null
                }
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    liveId: state.campBasicInfo.liveId,
    campId: state.campBasicInfo.campId,
    client: state.campAuthInfo.allowMGLive ? 'B' : 'C',
    payStatus: state.campUserInfo.payStatus,
    price: state.campBasicInfo.price,
    bonusStatus: state.campBasicInfo.bonusStatus,
    bonusPercent: state.campBasicInfo.bonusPercent,
    currentDays: state.campBasicInfo.dateInfo.currentDays,
    totalDays: state.campBasicInfo.dateInfo.totalDays,
    requiredDays: state.campBasicInfo.receiveDayNum,
});

const mapActionToProps = {
    doPay,
    followLive,
    checkUser
};

export default connect(mapStateToProps, mapActionToProps)(BottomPay);