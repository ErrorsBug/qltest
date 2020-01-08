import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Redpoint from 'components/redpoint';
import {
    locationTo,
    imgUrlFormat,
} from 'components/util';
import {
	fillParams,
} from 'components/url-utils'
import Detect from 'components/detect';
import { Confirm } from 'components/dialog';



import { share, closeShare } from 'components/wx-utils'

import Page from 'components/page';
import { getUserInfo, getCoralProfitConfig } from '../../../actions/common';


class CoralShareCard extends Component {

	
	state = {
		bachelorRecommendProfit: 0,
        doctorRecommendProfit: 0,
	};

    componentDidMount(){
        this.initData();
        this.initProfitConfig();
    }
    async initData(){
        await this.props.getUserInfo();
        this.initShare();
    }

    async initProfitConfig(){
        const res = await this.props.getCoralProfitConfig();
        if(res.state.code === 0){
            this.setState({
	            bachelorRecommendProfit: res.data.xRecommendVipProfit,
                doctorRecommendProfit: res.data.bRecommendVipProfit,
                personShareBackgroundUrl: res.data.personShareBackgroundUrl||'',
            })
        }
    }

    initShare(){
        let isNl = "\n";
        share({
            title: `${this.props.userInfo.name}邀请您加入千聊官方课代表开启知识分享之旅`,
            desc: `买课省钱，卖课赚钱${isNl}点击立即加入`,
            imgUrl: this.props.giftBagData.backgroundUrl||"https://img.qlchat.com/qlLive/rocal/gift-detail-headpic.jpg",
            shareUrl: `${window.location.origin}/wechat/page/coral/intro?officialKey=${this.props.userInfo.userId}`,
	        successFn: () => {
                window.toast("分享成功！");
                if(window._qla){
	                _qla('event', {
		                category: 'wechatShareCoralGift',
		                action: 'success'
	                });
                }
            }
        });
    }

    render() {
        return (
            <Page title="分享" className='coral-share'>
                <div className="top">
                    <div className="tips_1">点击右上角 <i className="icon_dots_horizontal"></i> ，选择发送给朋友</div>
                    <div className="tips_2">学士会员邀请好友成为学士，即可获得<var>{this.state.bachelorRecommendProfit}元</var>奖励</div>
                    <div className="tips_2">博士会员邀请好友成为学士，即可获得<var>{this.state.doctorRecommendProfit}元</var>奖励</div>
                    <div className="tips_3">Tips:学士只需直属邀请50个学士 或个人销售业绩达到<br/>5000元即可晋升为博士</div>
                    
                </div>
                <div className="name">{this.props.userInfo.name} 推荐</div>
                <div 
                    className="btn-get-card on-log" 
                    data-log-name="获取专属推广二维码海报"
                    data-log-region="bottom"
                    data-log-pos="mine"
                    onClick={()=>{this.state.personShareBackgroundUrl?locationTo("/wechat/page/coral/gift-share-card?bgurl="+ this.state.personShareBackgroundUrl):locationTo("/wechat/page/coral/gift-share-card")}}
                >获取专属推广二维码海报</div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        userInfo: state.common.userInfo,
        giftBagData: state.gift.giftBagData,
        myIdentity: state.mine.myIdentity||{},
    }
}

const mapActionToProps = {
    getUserInfo,
	getCoralProfitConfig
};

module.exports = connect(mapStateToProps, mapActionToProps)(CoralShareCard);
