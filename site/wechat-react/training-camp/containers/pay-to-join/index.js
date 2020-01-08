import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import Page from 'components/page'
import ScrollToLoad from 'components/scrollToLoad'
import { formatDate, imgUrlFormat, locationTo, getUrlParams, formatMoney } from 'components/util'
import { eventLog ,logPayTrace} from 'components/log-util';

import { doPayCamp } from '../../actions/common'
import { getCampInfo, initPayInfo, fetchPayInfo, activityCodeBind, activityCouponObj } from '../../actions/camp'
import { isQlchat, isAndroid, isIOS } from 'components/envi';
import appSdk from 'components/app-sdk';
import { bindOfficialKey, bindLiveShare } from '../../../actions/common'

function mstp(state) {
    return {
        sysTime: state.common.sysTime,
        payInfo: state.payCamp.initPayInfo,
        campInfo: state.camp.trainCampPo
    }
}

const matp = {
    doPayCamp,
    getCampInfo,

    bindOfficialKey, bindLiveShare,

    fetchPayInfo,
    initPayInfo,
    activityCodeBind,
    activityCouponObj,
}

class PayToJoin extends Component {

    constructor(props){
        super(props);
        this.campId = this.props.location.query.campId

        this.officialKey = this.props.location.query.officialKey

        this.lshareKey = this.props.location.query.lshareKey
        this.liveId = this.props.campInfo.liveId || 0

        this.shareKey = this.props.location.query.shareKey
    }

    state = {
        showCouponPop: false,

        couponPrice: 0,
        couponStartTime: 0,
        couponEndTime: 0,
    }


    componentDidMount() {
        this.initInfo()
        this.initDistribution()

        this.initActivityCodeId()
        
    }

    initActivityCodeId = async () => {
        if(this.props.location.query.activityCodeId && !this.props.payInfo.couponReason) {
            const result = await this.props.activityCouponObj(this.props.location.query.activityCodeId)
            const money = result.data.promotionDto.money
            if(result.data.promotionDto.remark == "channel") {
                this.setState({
                    showCouponPop: true,
                    couponPrice: money % 100 == 0 ? money / 100 : (money / 100).toFixed(2) ,
                    couponStartTime: result.data.promotionDto.startDate,
                    couponEndTime: result.data.promotionDto.endDate,
                })
            }
        }
    }

    hideCouponPopHandle = (e) => {
        if(e.target.className == "get-coupon-pop" || e.target.className == "icon_cancel") {
            this.setState({
                showCouponPop: false
            })
        }
    }

    getCouponHandle = async (e) => {
        this.setState({
            showCouponPop: false
        })
        const codeId = await this.props.activityCodeBind(this.props.campInfo.channelId, this.props.location.query.activityCodeId)
        if(codeId && codeId.data && codeId.data.code) {
            const payInfo =  await this.props.fetchPayInfo(this.props.location.query.campId)
            if(payInfo && payInfo.data) {
                this.props.initPayInfo(payInfo.data)
            }
        }

    }
    

    async initInfo(){
        if(this.props.campInfo && this.props.campInfo.id && this.props.campInfo.id != this.props.location.query.campId){
            const result = await this.props.getCampInfo(this.props.location.query.campId)
        }
    }

    // 各种分销关系
    initDistribution = () => {
        // 绑定课代表分销关系
        if(this.props.campInfo.liveId  && this.lshareKey) {
            this.props.bindLiveShare(this.props.campInfo.liveId , this.lshareKey)
        }
        // 绑定珊瑚计划分销关系
        if(this.officialKey) {
            this.props.bindOfficialKey({officialKey: this.officialKey})
        }
    }

    payCampOpe = () => {
        const that = this

        // 如果是APP支付
        if (isQlchat()) {

            let uaString = ''
            if(isAndroid()) {
                uaString = 'android'
            }
            if(isIOS()) {
                uaString = 'ios'
            }


            appSdk.pay({
                type: 'TRAINCAMP',
                source: uaString,
                ch: this.props.location.query.ch || '',
                couponId: this.props.payInfo.couponId || '',
                couponType: this.props.payInfo.couponType || '',
                channelNo: 'qldefault',
                chargeConfigId: this.props.payInfo.chargeConfigId || '',
                shareKey: this.shareKey || '',
                officialKey: this.officialKey || '',
            	success: () => {
                    logPayTrace({
                        id: that.campId,
                        type: 'camp',
                        payType: 'CAMP',
                        coral: that.officialKey ? 'Y' : 'N',
                        shareKey: that.officialKey ? 'this.officialKey' : 'N',
                    });
                    locationTo('/wechat/page/camp-finish-pay' + that.props.location.search)
                },
                fail: (err) => {
                    console.error('qlchat pay err:', err);
                }
            });
        } else {
             // 如果是H5 和 微信支付
            this.props.doPayCamp({
                ch: this.props.location.query.ch || '',
                couponId: this.props.payInfo.couponId || '',
                couponType: this.props.payInfo.couponType || '',
                channelNo: 'qldefault',
                chargeConfigId: this.props.payInfo.chargeConfigId || '',
                shareKey: this.shareKey || '',
                officialKey: this.officialKey || '',
                callback: async (orderId) => {
                    logPayTrace({
                        id: that.campId,
                        type: 'camp',
                        payType: 'CAMP',
                        coral: that.officialKey ? 'Y' : 'N',
                        shareKey: that.officialKey ? 'this.officialKey' : 'N',
                    });
                    // locationTo('/wechat/page/camp-finish-pay?campId=' + that.campId)
                    locationTo('/wechat/page/camp-finish-pay' + that.props.location.search)
                },
                onCancel: (orderId) => {
                    // locationTo('/wechat/page/camp-fail-pay?orderCode=' + orderId  + '&campId=' + this.campId)
                    locationTo('/wechat/page/camp-fail-pay' + that.props.location.search + '&orderCode=' + orderId)
                }
            });
        }
    }

    render() {

        let price = null,
            couponText = '',
            payInfo = this.props.payInfo,
            originPrice = payInfo.originPrice,
            couponPrice = payInfo.couponPrice;

        payInfo.couponReason = payInfo.couponReason || ''

        payInfo.couponReason

        if (/share/.test(payInfo.couponReason)) {
            price = formatMoney(originPrice - couponPrice),
                couponText = '分享已减' + formatMoney(couponPrice) + '元'
        } else if (/buyCourse/.test(payInfo.couponReason)) {
            price = formatMoney(originPrice - couponPrice),
                couponText = '已购课程抵扣' + formatMoney(couponPrice) + '元'
        } else if (/channel/.test(payInfo.couponReason)) {
            price = formatMoney(originPrice - couponPrice),
                couponText = '已优惠' + formatMoney(couponPrice) + '元'
        } else {
            price = formatMoney(originPrice)
        }
        
        return (
            <Page title={'提交支付'} className='camp-submit-pay'>
            <div className="camp-submit-pay-container">
                <div className="submit-pay-title">
                    <div className="logo"></div>
                    <div className="title-content">
                        <span className="left">《</span>
                        <p>{this.props.campInfo.name}</p>
                        <span className="right">》</span>
                    </div>
                </div>
                <div className="center">
                    <div className="price">
                        <span className="b">￥</span>
                        <span className="num">{price}</span>
                    </div>
                    <div className="tip">{couponText}</div>
                </div>
                <div className="sign-up-success">
                    <div className="sign-up-title">报名成功后，你将获得</div>
                    <ol className="sign-up-container">
                        <li>180天陪伴式学习，让你更容易坚持</li>
                        <li>专业助教，随时随地为你答疑解惑</li>
                        <li>课前预习课后实践，技能提升更迅速</li>
                        <li>所有课程支持回听，错过上课也不怕</li>
                    </ol>
                </div>
            </div>
            
            {
                this.state.showCouponPop && <div className="get-coupon-pop" onClick={this.hideCouponPopHandle}>
                <div className="icon_cancel"></div>
                    <div className="get-coupon-con">
                        <div className="price">{this.state.couponPrice}</div>
                        <div className="coupon-des">训练营优惠券</div>
                        <div className="time">{formatDate(this.state.couponStartTime)} 到 {formatDate(this.state.couponEndTime)}</div>
                        <div className="camp-name">{this.props.campInfo.name}</div>

                        <div className="btn-get-coupon" onClick={this.getCouponHandle}>马上领取</div>
                    </div>
                </div>
            }
            
            <div className="camp-submit-sign-up" onClick={this.payCampOpe}>立即报名</div>
        </Page>
        );
    }
}




export default connect(mstp, matp)(PayToJoin);
