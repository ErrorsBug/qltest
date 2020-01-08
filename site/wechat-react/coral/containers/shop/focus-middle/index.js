import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Page from "components/page";
import { getVal } from 'components/util';
import { pushDistributionCardMaking } from "./components/coral-focus-middle-card";

import { getUserInfo } from '../../../actions/common';
import { getTopicSimple, getChannelInfo, fetchPayUser } from "../../../actions/course";

class FocusMiddle extends Component {
    state={
        qrurl:'',
        haibaopic:'',
        businessId: this.props.location.query.businessId,
        businessType: this.props.location.query.businessType,
        qrcode: decodeURIComponent(this.props.location.query.qrcode),
    };

    componentDidMount(){
        this.initData();
        this.categoryPvLog();
    }
    async initData(){
        await this.props.getUserInfo();
        await this.initCourse();
        if(this.state.qrcode){
            this.initDrawCard();
        }
        
            // let qlUrl = await this.props.getQr({
            //     channel: 'personSharePage',
            //     channelId : this.state.businessType ==="CHANNEL"? this.state.businessId:'' , 
            //     topicId : this.state.businessType ==="TOPIC"? this.state.businessId:'' ,
            //     userId: this.props.userInfo.userId,
            //     toUserId: this.props.location.query.officialKey||'',
            // });
            // if(!qlUrl){
            //     return false;
            // }
            // this.setState({
            //     qrurl: getVal(qlUrl,"data.qrUrl","")
            // },()=>{
            //     this.initDrawCard();
            // });
    }
    
    async initCourse(){
        if(this.state.businessType ==="CHANNEL"){
            await this.getChannelPersonNum();
            let channelResult = await this.props.getChannelInfo(this.state.businessId);
            this.setState({
                courseData: {
                    liveName: getVal(channelResult,"data.channel.liveName",''),
                    businessName: getVal(channelResult,"data.channel.name",''),
                    businessImage: getVal(channelResult,"data.channel.headImage",''),
                    browseNum: this.state.audienceCount||0,
                    businessId: this.state.businessId,
                }
            });
        }else if(this.state.businessType ==="TOPIC"){
            let topicResult = await this.props.getTopicSimple(this.state.businessId);
            this.setState({
                courseData: {
                    liveName: getVal(topicResult,"topicInfo.liveName",''),
                    businessName: getVal(topicResult,"topicInfo.topic",''),
                    businessImage: getVal(topicResult,"topicInfo.backgroundUrl",''),
                    browseNum: getVal(topicResult,"topicInfo.browseNum",0),
                    businessId: this.state.businessId,
                }
            });
        }
    }
    
    initDrawCard(){
        pushDistributionCardMaking("https://img.qlchat.com/qlLive/coral/push-card-middle.png",this.state.courseData,(url) => {
			window.loading(false);
			// window.showImageViewer(url,[url]);
			this.setState({
				haibaopic: url,
            });
            // 曝光日志收集
            setTimeout(_=>{
                typeof _qla != 'undefined' && _qla.collectVisible();
            },0)
		}, true, "PersonCount", 660, 896, this.props.location.query.officialKey,this.state.qrcode);
    }

    async getChannelPersonNum (){
        const res = await this.props.fetchPayUser({
			channelId: this.state.businessId,
		});
		if(res.state.code === 0){
			this.setState({
				audienceCount: getVal(res,"data.payUserCount",0)
			});
		}
    }

    categoryPvLog() {
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla('pv', {

            });
        }, 0);
    }

    render() {
        return (
            <Page title="好友推荐" className='coral-focus-middle'>
                <div className="user-info-box">
                    <div className="head-pic"><img src={this.props.userInfo.headImgUrl} /></div>
                    <div className="head-info" >
                        <div className="name elli"><span>好学不倦</span>{this.props.userInfo.name}</div>
                        <div className="guid">这个课程很赞，值得学习</div>
                    </div>
                </div>
                <div className="card">
                    <img src={this.state.haibaopic} 
                    className="on-log on-visible" 
                        data-log-region="visible-personSharePage"
                        data-log-pos={ `personSharePage` } 
                        data-log-index={this.props.location.query.appIndex}/>
                </div>
                <div className="bottom">
                    珊瑚计划
                </div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        userInfo: state.common.userInfo,
    }
}

const mapActionToProps = {
    getTopicSimple,
    getChannelInfo,
    fetchPayUser,
    getUserInfo,
};

module.exports = connect(mapStateToProps, mapActionToProps)(FocusMiddle);