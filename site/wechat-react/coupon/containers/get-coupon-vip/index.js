const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Page from 'components/page';
import CouponPage from 'components/coupon-dialog/index-page';

import { 
    bindVipDiscountCode,
 } from '../../actions/coupon';
 import {
	bindOfficialKey,
} from '../../actions/common';

class GetCouponVip extends Component {

    state = {
        getedDiscount: false,
    }
    query = null

    judgeIfBatch() {
        if (this.props.location.pathname.search(/batch/) > -1) {
            this.ifBatch = true;
            this.query = this.props.location.query.couponId || this.props.location.query.codeId;
        } else {
            this.ifBatch = false
            this.query = this.props.location.query.couponCode;
        }
    }
   
    async clickToGetCode() {
        var self = this;
        
        //判断是否可领取优惠码
        if (this.props.coupon.vipDiscountCode.isValid === 'Y') {
            //是否绑定过
            if (this.props.coupon.vipDiscountCode.isBinded === 'Y') {
                window.confirmDialog('你有已领取未使用的优惠码，确定要再次领取并替换吗？', async ()=>{
                    //按确定按钮更新优惠码
                    let bindResult = await self.props.bindVipDiscountCode(self.props.params.liveId, self.query, self.ifBatch);
                    // console.log(JSON.stringify(bindResult));
                    if (bindResult && bindResult.state.code === 0) {
                        window.toast("领取成功");
                        setTimeout(()=>{
                            // window.location.href = '/live/whisper/vip.htm?liveId='+ self.props.params.liveId;
                            window.location.href = '/wechat/page/live-vip-details?liveId='+ self.props.params.liveId;
                        },1000);
                    } else if (bindResult) {
                        window.toast(bindResult.state.msg);
                        setTimeout(()=>{
                            window.location.reload(true);
                        },1000);
                    }
                },function(){});
            } else {
                //未绑定过则直接调用绑定接口
                let bindResult = await this.props.bindVipDiscountCode(this.props.params.liveId, this.query, this.ifBatch); //无返回值
                if (bindResult && bindResult.state.code === 0) {
                    window.toast("领取成功");
                    setTimeout(()=>{
                        // window.location.href = '/live/whisper/vip.htm?liveId='+ self.props.params.liveId;
                        window.location.href = '/wechat/page/live-vip-details?liveId='+ self.props.params.liveId;
                    },1000);
                } else if (bindResult) {
                    window.toast(bindResult.state.msg);
                    setTimeout(()=>{
                        window.location.reload(true);
                    },1000);
                }
            }
        } else {
            //不可领取优惠码则切换按钮
            this.setState({
                getedDiscount: true
            })

        }
    }
    //绑定珊瑚计划
    bindOfficialKey(){
        if(this.props.location.query.officialKey){
        	this.props.bindOfficialKey({
		        officialKey: this.props.location.query.officialKey
            });
        }
    }

    componentDidMount() {
        this.judgeIfBatch();
        if (!(this.props.coupon.vipDiscountCode.isValid === 'Y')) {
            this.setState({
                getedDiscount: true
            });
        }
        this.bindOfficialKey();

    }
    render() {
        return (
            <Page title={`优惠码领取`} className='live-coupon-container'>
                <CouponPage
                    style="page"
                    businessType="global_vip"
                    businessId={ this.props.params.liveId }
                    businessName={ this.props.liveInfo.entity.name }
                    couponCode={ this.props.location.query.couponCode }
                    codeId={ this.props.location.query.codeId || this.props.location.query.couponId}
                    liveId={this.props.params.liveId}
                    liveName={ this.props.liveInfo.entity.name }
                    avatar={this.props.liveInfo.entity.logo}
                    coupon={this.props.coupon.vipDiscountCodeInfo.CouponInfoDto}
                />
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        coupon: state.coupon,
        liveInfo: state.live.liveInfo
    }
}

const mapActionToProps = {
    bindVipDiscountCode,
    bindOfficialKey,
}

module.exports = connect(mapStateToProps, mapActionToProps)(GetCouponVip);
