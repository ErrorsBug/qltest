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

class GetCouponTopic extends Component {
    state={
        shareQualify:{}
    }

    //绑定珊瑚计划
    bindOfficialKey(){
        if(this.props.location.query.officialKey){
            this.tracePage = 'coral';
        	this.props.bindOfficialKey({
		        officialKey: this.props.location.query.officialKey
            });
        }
    }
    
    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }

    componentDidMount() {
        this.bindOfficialKey();
        this.props.coupon.shareStatus==='Y'&&this.initShare();
    }

     /**
	 *
	 * 初始化分享
	 * @memberof ThousandLive
	 */
    async initShare(){  
        let businessType = 'topic'
        let businessId =  this.props.topic.topicInfo.topicPo.id
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
        let title =`我推荐：${this.props.topic.topicInfo.topicPo.topic}` ;
        let descript = '';
        let imgUrl = "https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png";
        //let shareUrl = window.location.origin + this.props.sendCouponInfo.redirectPath;

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
        let target = `${location.pathname+location.search}&shareKey=${shareQualifyInfo.shareKey}&type=topic`;
        const pre = `/wechat/page/live/${this.props.topic.topicInfo.topicPo.liveId}?isBackFromShare=Y&wcl=middlepage`;

        
        descript = "点击即可领取优惠码，先到先得."

        // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        const shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(target))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

        console.log({
            title: title,
            desc: descript,
            imgUrl: imgUrl,
            shareUrl: shareUrl,
        })
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
            <Page title={`优惠码领取`} className='topic-coupon-container'>
                <CouponPage
                    style="page"
                    businessType="topic"
                    businessId={ this.props.params.topicId }
                    businessName={ this.props.topic.topicInfo.topicPo.topic }
                    couponCode={ this.props.location.query.couponCode }
                    codeId={ this.props.location.query.codeId || this.props.location.query.couponId}
                    liveId={ this.props.topic.topicInfo.topicPo.liveId }
                    liveName={ this.props.topic.topicInfo.topicPo.liveName }
                    avatar={this.props.topic.topicInfo.createUser.headImgUrl}
                    coupon={this.props.coupon}
                    shareKey={this.props.location.query.shareKey||''}
                />

            </Page>
        );
    }
}

function mapStateToProps (state) { 
    return {
        coupon: state.coupon.topicDiscountCodeInfo.CouponInfoDto,
        topic: state.coupon.topic,

    }
}

const mapActionToProps = {
    getMyQualify,
    bindOfficialKey,
}

module.exports = connect(mapStateToProps, mapActionToProps)(GetCouponTopic);
