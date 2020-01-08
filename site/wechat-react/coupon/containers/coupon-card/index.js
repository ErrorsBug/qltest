import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import { autobind } from 'core-decorators';
import { share } from 'components/wx-utils';
import { locationTo, getVal } from 'components/util';
import { apiService } from 'components/api-service';
import { fetchUserPower } from '../../actions/common';


import {
    getCouponInfo,
} from '../../../actions/coupon';
import couponBatchCard  from './components/coupon-batch-card';

import { isServiceWhiteLive, getOfficialLiveIds, getIsSubscribe, getQr, isLiveAdmin as getIsLiveAdmin, getFocusLiveId } from 'common_actions/common'


function mapStateToProps(state) {
    return {
        sysTime: state.common.sysTime,
    }
}

const mapDispatchToProps = {
    // getTopicInfo,
    getQr,
    isServiceWhiteLive,
    getOfficialLiveIds,
    getIsSubscribe,
    getIsLiveAdmin,
    fetchUserPower,
    getCouponInfo,
}

@autobind
//群发的优惠码邀请卡
class CouponCard extends Component {

    state = {
        courseInfo:{},
        type: this.props.location.query.businessType,
        id: this.props.location.query.businessId,
        codeId: this.props.location.query.codeId,
        couponInfo:{},
        couponCardUrl:'',
        isWhiteLive: 'N',
        isOfficialList: null,
        subscribeMap:[],
        isLiveAdmin: '',
        showQr: '',
    }

    data = {
        liveId: '',
        qlLiveId: '2000000648729685',
    }


    /*
     * 根据类型区分获取用户权限的参数
     * 这里获取用户权限，主要有两个作用：
     * 1. 为了判断用户是否有权限查看这个页面，没有的话就跳转到个人中心，
     *    服务端渲染也需要做对应权限判断
     * 2. 为了获取当前话题或频道对应的liveId，在拉黑操作中需要用到，
     *    虽然在获取话题或频道信息接口中有返回，但代价太高了，并不需要
     *    那么多信息。
     *  */
    get powerParams() {
        let type = this.props.location.query.businessType;
        type= type.toUpperCase();
        switch (type) {
            case 'TOPIC':
                return { topicId: this.props.location.query.businessId }
            case 'CHANNEL':
                return { channelId: this.props.location.query.businessId }
            default:
                break;
        }
    }


    get officialKey() {
        return this.props.location.query.officialKey
    }

    componentWillMount(){

    }
    componentDidMount(){
        this.initData();
        
    }

    async initData(){
        //获取课程信息
        await this.initCourseInfo();

        //获取优惠信息
        await this.initCouponInfo();
        await this.initQlLive();
        await this.initIsServiceWhiteLive();

        await this.initQrcode()
        this.doFetchPower();
        this.initEvent();
    }

    initEvent(){
        this.initShare();
    }

    async initQlLive() {
        try {
            const result = await getFocusLiveId(this.data.liveId);

            if (getVal(result, 'state.code') == 0) {
                this.data.qlLiveId = getVal(result, 'data.liveId');
            }
        } catch (error) {
            console.error(error);
        }
    }
    async initCourseInfo(){
       
        if(this.state.type.toUpperCase() === 'CHANNEL'){
            await this.getChannelInfo();
            
        } else if (this.state.type.toUpperCase() === 'TOPIC') {
            await this.getTopicInfo();
        }
        this.data.liveId = this.state.courseInfo.liveId;
        
    }


    // 获取系列课信息
    getChannelInfo() {
        return apiService.get({
            url: '/h5/channel/info',
            body: {
                channelId: this.state.id
            }
        }).then(res => {
            if (res.state.code == 0) {
                this.setState({courseInfo:res.data.channel});
            }
        })
    }

    // 获取课程信息
    getTopicInfo() {
        return apiService.get({
            url: '/h5/topic/get',
            body: {
                topicId: this.state.id
            }
        }).then(res => {
            if (res.state.code == 0) {
                this.setState({courseInfo:res.data.topicPo});
            }
        })
    }

    /* 获取用户权限操作 */
    async doFetchPower() {
        try {
            const result = await this.props.fetchUserPower(this.powerParams);
            this.setState({
                power : getVal(result, 'data.powerEntity'),
            });
            
        } catch (error) {
            console.error(error)
        }
    }

    async initCouponInfo(){
        try{
            let result = await this.props.getCouponInfo({
                businessType : this.state.type,
                businessId : this.state.id,
                receiveType : 'batch', 
                code: this.state.codeId,
            });
            this.setState({
                couponInfo : getVal(result, 'data.CouponInfoDto'),
            });
            
        } catch (error){
            console.error(error);
        }
        
    }
    async initIsServiceWhiteLive() {
        try {
            let [isWhiteLive, officialList, isSubscribe, liveAdminRes, showQr] = await Promise.all([
                this.props.isServiceWhiteLive(this.data.liveId),
                this.props.getOfficialLiveIds(),
                getIsSubscribe([
                    this.data.qlLiveId,
                    this.data.liveId
                ]),
                this.props.getIsLiveAdmin(this.data.liveId),
            ]);

            let list = getVal(officialList, 'data.dataList');
            let subscribeMap = {};
            let liveIdListResult = getVal(isSubscribe, 'data.liveIdListResult', []);
            liveIdListResult.forEach(item => {
                subscribeMap[item.liveId] = item;
            });

            this.setState({
                isWhiteLive: getVal(isWhiteLive, 'data.isWhite', 'N'),
                isOfficialList: list.find(item => this.data.liveId == item) != null,
                subscribeMap,
                isLiveAdmin: getVal(liveAdminRes, 'data.isLiveAdmin'),
            });
        } catch (error) {
            console.error(error);
        }
    }

    async initQrcode(){
        let reqLiveId = '';
        let showQl = 'Y';
        if((this.state.isLiveAdmin === 'Y' || this.state.isWhiteLive==="Y")&&this.state.subscribeMap[this.data.liveId]?.isBindThird){
            reqLiveId = this.data.liveId;
            showQl = "N";
        }else{
            reqLiveId = this.data.qlLiveId;
            showQl = 'Y';
        }
        // getQr的参数
        const params = {
            channel: 'acceptCouponFromShare',
            liveId: reqLiveId,
            showQl,
            couponCodeId: this.state.codeId,
            topicId: this.state.type.toUpperCase() === 'TOPIC'?this.state.id:'',
            channelId: this.state.type.toUpperCase() === 'CHANNEL'?this.state.id:'',
        };

        if (this.props.businessType === 'topic') {
            params.topicId = this.state.id;
        } else if (this.props.businessType === 'channel') {
            params.channelId = this.state.id; 
        }

        const result = await this.props.getQr(params);

        if (getVal(result, 'state.code') == 0) {
            this.setState({
                qrcode: getVal(result, 'data.qrUrl'),
                qrcodeType: params.liveId == this.data.qlLiveId ? 'ql' : 'third'
            }, () =>{
                this.drawCouponCard();
                if(!this.data.hadLoged && this.state.footerStyle == 'qrcode' && this.state.qrcodeType == 'ql') {
                    this.data.hadLoged = true;
                    setTimeout(()=>{
                        typeof _qla != 'undefined' && _qla.collectVisible();
                    }, 0)
                }
            });
        }
    }

    drawCouponCard(){
        couponBatchCard('https://img.qlchat.com/qlLive/liveCommon/coupon-card-bg.png',{
        headImgUrl:this.state.type.toUpperCase() === 'CHANNEL'?this.state.courseInfo.headImage:this.state.courseInfo.backgroundUrl,
        liveName:this.state.courseInfo.liveName,
        courseName:this.state.type.toUpperCase() === 'CHANNEL'?this.state.courseInfo.name:this.state.courseInfo.topic,
        money:this.state.couponInfo.money||0,
        shareUrl:this.state.qrcode,
        },this.setcardUrl,true,'ACHIEVE_1');
    }
    setcardUrl(url){
        this.setState({
            couponCardUrl:url,
        });
    }

    initShare() {
        
        let title = this.state.type.toUpperCase() === 'CHANNEL'?this.state.courseInfo.name:this.state.courseInfo.topic;
        let descript = "点击即可领取优惠码，先到先得.";
        let imgUrl = "https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png";
        
        share({
            title: title,
            desc: descript,
            imgUrl: imgUrl,
        });
    }


    
    render() {
        return (
            <Page title="优惠券邀请卡" className="coupon-card-page">
                {   
                    this.state.power&&(this.state.power.allowMGLive||(this.state.type.toUpperCase()==='TOPIC'&&this.state.allowMGTopic))&&
                    (this.state.isLiveAdmin === 'Y' || this.state.isWhiteLive==="Y")&&!this.state.subscribeMap[this.data.liveId]?.isBindThird&&
                    <div className="warning" onClick={()=>{locationTo(`http://kaifang.qlchat.com/wechatAccess/mobile/preJoinUp.htm?liveId=${this.data.liveId}`)}}>您尚未对接服务号，使用该功能会引导关注至「千聊」，点击前往对接，对接后将引导关注至您所对接的服务号；</div>}
                {this.state.power&&(this.state.power.allowMGLive||(this.state.type.toUpperCase()==='TOPIC'&&this.state.allowMGTopic))&&<div className="tips">分享该卡片或此页面给学员，学员扫码后可以领取对应金额的优惠券，同时会关注直播间，24小时后若学员仍未使用优惠券会下发使用提醒；</div>}
                <div className="card">
                    <img src={this.state.couponCardUrl} 
                        className={`on-visible`}
                        data-log-name="优惠券二维码"
                        data-log-region="visible-accept-coupon"
                        data-log-pos="acceptCouponFromShare" />
                    </div>
            </Page>
        );
    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(CouponCard)