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

/*
购买礼包后的购买成功页面，引导关注公众号
*/
class CoralFocus extends Component {
	state = {
		bachelorRecommendProfit: 0,
        doctorRecommendProfit: 0,
        qrcodeUrl: this.props.location.query.qr,
	};

    componentDidMount(){
        this.initData();
        this.initProfitConfig();
        // 隐藏微信分享
        closeShare();
    }
    async initData(){
        await this.props.getUserInfo();
        // let qrCodeResult = await this.props.getCoralPayQr();
        // if(qrCodeResult.state.code === 0){
        //     this.setState({
        //         qrcodeUrl : qrCodeResult.data.url,
        //     })
        // }
        
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
            <Page title="分享" className='coral-focus'>
                <div className="focus-box">
                    < img className = "img-bg"
                        src = {require('./img/bg.png')}
                    />
                    <img className="name" src={imgUrlFormat(this.props.userInfo.headImgUrl,'?x-oss-process=image/resize,h_90,w_90,m_fill')} />
                    <div className="qrcode"><img src={this.state.qrcodeUrl || ''} /></div>
                </div>
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
    getCoralProfitConfig,
};

module.exports = connect(mapStateToProps, mapActionToProps)(CoralFocus);
