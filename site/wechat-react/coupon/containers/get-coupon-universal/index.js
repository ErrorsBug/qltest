import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators'
import classNames from 'classnames'

import Page from 'components/page';
import { formatDate, locationTo, formatMoney } from 'components/util';
import CouponPage from 'components/coupon-dialog/index-page';

import {
    getCouponDetail,
    isBindLiveCoupon,
    bindCoupon,
    initLiveShareQualify
} from '../../actions/coupon';
import {
    bindOfficialKey
} from '../../actions/common';

import { getLiveInfo } from "../../actions/live";
import { share } from 'components/wx-utils';

@autobind
class GetCouponUniversal extends Component {

    state = {
        coupon: {
            overTimeStamp: '',
            codeNum: '',
            useNum: '',
            money: ''
        },
        isBind: false,
        loading: true,
        liveInfo: {
            
        },
        shareQualify:{}
    }

    get liveId() {
        return this.props.router.params.liveId
    }

    get couponId() {
        return this.props.location.query.codeId || this.props.location.query.couponId 
    }

    get couponRanOut() {
        const { overTimeStamp, codeNum, useNum } = this.state.coupon
        const { sysTime } = this.props

        const outOfDate = overTimeStamp && overTimeStamp < sysTime
        const noCoupon = codeNum && codeNum <= useNum

        return outOfDate || noCoupon
    }

    get liveId () {
        return this.props.params.liveId;
    }

    componentDidMount() {
        this.fetchCoupon()
        this.bindOfficialKey();
        this.getLiveInfo();
        
    }

    async getinitLiveShareQualify() {
        const result = await this.props.initLiveShareQualify(this.liveId)   
        if(result.state.code === 0&&result.data.shareQualify&&result.data.shareQualify.shareKey){ 
            this.initShare(result.data.shareQualify)
            this.setState({
                shareQualify: result.data.shareQualify
            })
        }
        
    }
    
    initShare(shareQualify) {
        console.log(shareQualify)
        const { liveName, money } = this.state.coupon
        let title ='我推荐：'
        let desc = ''
        let timelineTitle=''
        title += liveName
        desc += `送你一张直播间通用券，优惠金额${formatMoney(money, 1)}元，点击即可领取，先到先得` 
        timelineTitle = `送你一张直播间通用券，优惠金额${formatMoney(money,1)}元，点击即可领取，先到先得` 
        
        console.log({
            title,
            desc,
            timelineTitle,
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png',
            shareUrl: `${location.origin}/wechat/page/get-coupon-universal/${this.state.coupon.liveId}?codeId=${this.couponId}&officialKey=${this.officialKey}&lshareKey=${shareQualify.shareKey}`,
        })
        share({
            title,
            desc,
            timelineTitle,
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png',
            shareUrl: `${location.origin}/wechat/page/get-coupon-universal/${this.state.coupon.liveId}?codeId=${this.couponId}&officialKey=${this.officialKey}&lshareKey=${shareQualify.shareKey}`,
        })
    }


    getLiveInfo = async () => {
        let result = await this.props.getLiveInfo(this.liveId);
        if (result && result.state.code == 0) {
            this.setState({
                liveInfo: result.data.entity
            })
        } else {

        }
    }

    async fetchCoupon() {
        const [coupon, isBind] = await Promise.all([
            this.props.getCouponDetail({couponId: this.couponId}),
            this.props.isBindLiveCoupon({couponId: this.couponId}),
        ])
        // 判断优惠券是否失效
        if (!coupon && window.confirmDialog) {
            window.confirmDialog('优惠券已失效', ()=>{}, null, null, 'confirm')
            return false
        }
        this.setState({ 
            isBind: isBind.data.isBinded == 'Y',
            coupon: coupon,
            loading: false
         },()=>{
            this.state.coupon.shareStatus==='Y'&&this.getinitLiveShareQualify()
         })
    }

    async bindCoupon() {
        if (this.state.isBind) {
            window.toast('您已绑定优惠码，无需重复绑定')
            return
        }

        const result = await this.props.bindCoupon({ couponId: this.couponId, businessId: this.liveId, businessType: 'live' })
        if (result.state.code === 0) {
            window.toast('领取成功')
            // this.setState({ isBind: true },()=>{
                setTimeout(() => {
                    location.href = `/wechat/page/live/${this.liveId}`
                }, 1500)
            // })
        } else {
            window.toast(result.state.msg)
        }
    }
    //绑定珊瑚计划
    bindOfficialKey() {
        if(this.props.location.query.officialKey && this.props.location.query.officialKey !== 'undefined'){
        	this.props.bindOfficialKey({
		        officialKey: this.props.location.query.officialKey
            });
        }
    }
    render() {
        const { coupon, isBind, liveInfo,shareQualify } = this.state
        const formattedMoney = coupon ? formatMoney(coupon.money, 1).toString() : ''
        let moneyClass = 'large'
        if (formattedMoney.length > 5) {
            moneyClass = 'small'
        }
        return (
            <Page title={`优惠码领取`} className='universal-coupon-container'>
                <CouponPage
                    style="page"
                    businessType="live"
                    businessId={ this.props.params.liveId }
                    businessName={ coupon.businessName }
                    couponCode={ this.props.location.query.couponCode }
                    codeId={ this.props.location.query.codeId || this.props.location.query.couponId}
                    liveId={ this.props.params.liveId }
                    liveName={ liveInfo.name }
                    avatar={liveInfo.logo}
                    coupon={coupon}
                    shareKey={this.props.location.query.lshareKey||''}
                />
            </Page>
        );
    }
}

function mapStateToProps(state) { 
    return {
        sysTime: state.common.sysTime,
    }
}

const mapActionToProps = {
    initLiveShareQualify,
    getCouponDetail,
    isBindLiveCoupon,
    bindCoupon,
    bindOfficialKey,
    getLiveInfo
}

module.exports = connect(mapStateToProps, mapActionToProps)(GetCouponUniversal);
