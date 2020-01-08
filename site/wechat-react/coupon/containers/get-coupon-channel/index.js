const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Page from 'components/page';
import CouponPage from 'components/coupon-dialog/index-page';

import {
    getMyQualify,
 } from '../../actions/coupon';
import {
	bindOfficialKey,
} from '../../actions/common';
import { share } from 'components/wx-utils';
import { fillParams } from 'components/url-utils';

class GetCouponChannel extends Component {
    state={
        shareQualify:{}
    }
    //绑定珊瑚计划
    bindOfficialKey(){
        if(this.props.location.query.officialKey){
            this.tracePage = 'coral'
        	this.props.bindOfficialKey({
		        officialKey: this.props.location.query.officialKey
            });
        }
    }
    
    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }

    async componentDidMount () {
        this.bindOfficialKey();
        console.log(this.props.coupon)
        this.props.coupon.shareStatus==='Y'&&this.initShare();
    }

     /**
	 *
	 * 初始化分享榜
	 * @memberof ThousandLive
	 */
    async initShare(){ 
        let businessType = 'channel'
        let businessId =  this.props.channel.channelInfo.channelId
        const result = await this.props.getMyQualify(businessId,businessType) 
        if(result.state.code === 0&&result.data.shareQualifyInfo&&result.data.shareQualifyInfo.shareKey
            &&result.data.shareQualifyInfo.shareEarningPercent>0){
            this.toShare(result.data.shareQualifyInfo)
            this.setState({
                shareQualify: result.data.shareQualifyInfo
            })
        }
	}
    /**
    *
    * 分享
    * @memberof ThousandLive
    */
   toShare(shareQualifyInfo){  
        let title =`我推荐：${this.props.channel.channelInfo.name}` ;
        let descript = '';
        let imgUrl = "https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png";
        //let shareUrl = window.location.origin + this.props.sendCouponInfo.redirectPath;

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
        let target = fillParams({shareKey:shareQualifyInfo.shareKey},location.pathname+location.search);
        const pre = `/wechat/page/live/${this.props.channel.channelInfo.liveId}?isBackFromShare=Y&wcl=middlepage`;
        
        
        descript = "点击即可领取优惠码，先到先得."

        // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        const shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(target))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

        share({
            title: title,
            desc: descript,
            imgUrl: imgUrl,
            shareUrl: shareUrl,
        }); 
   }
    render() {
        const { shareQualify } = this.state
        return (
            <Page title={`优惠码领取`} className='channel-coupon-container'>
                <CouponPage
                    style="page"
                    businessType="channel"
                    businessId={ this.props.params.channelId }
                    businessName={ this.props.channel.channelInfo.name }
                    couponCode={ this.props.location.query.couponCode }
                    codeId={ this.props.location.query.couponId || this.props.location.query.codeId }
                    liveId={ this.props.channel.channelInfo.liveId }
                    liveName={ this.props.channel.channelInfo.liveName }
                    avatar={this.props.channel.channelInfo.liveHeadImageUrl}
                    coupon={this.props.coupon}
                    shareKey={this.props.location.query.shareKey||''}
                />

            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        coupon: state.coupon.channelDiscountCodeInfo.CouponInfoDto,
        channel: state.coupon.channel
    }
}

const mapActionToProps = {
    bindOfficialKey,
    getMyQualify
}

module.exports = connect(mapStateToProps, mapActionToProps)(GetCouponChannel);
