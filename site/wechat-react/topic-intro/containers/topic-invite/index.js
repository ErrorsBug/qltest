import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { subAterSign, isServerWhite, } from 'common_actions/common'
import { getCoralQRcode } from "common_actions/coral";

import { checkReceiveStatus, receive } from '../../actions/topic-invite';

import ReceiveListOfInviteFriendsToListen from './components/invite-friend-receive-list';
import { locationTo, getVal, getCookie } from 'components/util';
import {getUrlParams, fillParams} from 'components/url-utils';
import {fetchUserPower} from '../../actions/topic-intro';
import {
    getQrCode,
} from '../../actions/common';

@autobind
class TopicInvite extends Component {
    state = {
        receiveStatus: '', // enable-可领取，none-没有名额，overLimit-个人领取超额，auth-已购买系列课或已领过话题
        total: 10, // 总共多少个赠送名额
        remaining: 10, // 剩余赠送名额
        receiveLimit: 0, // 每人每个系列课最多可领取多少个子话题
        shareUserInfo: null, // 分享者的用户信息
        channelInfo: null, // 分享的系列课信息
        topicInfo: null, // 分享的系列课内子话题信息
        liveId: '', // 课程的直播间id
        actUrlInfo: null, // 增粉活动url信息，为空则不展示banner
        init: false, // 是否请求了初始化数据的接口
        showActivity: false, // 是否展示活动跳转链接
    }

    componentDidMount(){
        this.checkReceiveStatus()
    }

    // 初始化数据
    async checkReceiveStatus(){
        let inviteFreeShareId = this.props.location.query.inviteFreeShareId
        if(!inviteFreeShareId){
            window.toast('链接参数不完整')
        }
        const result = await checkReceiveStatus(inviteFreeShareId)
        if(result.state.code === 0){
            // 判断是否是B端，B端直接跳转到极简模式
            const power = await this.props.fetchUserPower({topicId: result.data.topicInfo.topicId})
            if(power.state.code === 0){
                if(power.data.powerEntity.allowMGLive || power.data.powerEntity.allowSpeak){
                    locationTo(`/topic/details?topicId=${result.data.topicInfo.topicId}`)
                    return
                }
            }
            // 如果领取过或已经购买，则跳转到极简模式
            if(result.data && result.data.receiveStatus === 'auth'){
                window.location.href = window.location.origin + fillParams({topicId: result.data.topicInfo.topicId, ...getUrlParams()},'/topic/details-listening')
                return
            }
            // 白名单展示活动跳转链接
            let showActivity = false
            if(await this.initIsWhite(result.data.liveId) === 'N'){
                showActivity = true
            }
            this.setState({
                ...result.data,
                init: true,
                showActivity
            })
        }
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    // 初始化是否是白名单
    async initIsWhite(liveId){
        const result = await isServerWhite({
            liveId,
        });
        if(result.state.code === 0){
            return result.data && result.data.isWhite
        }
    }

    // 抢读
    async grab(){
        if(this.lock){
            return
        }
        this.lock = true
        const result = await receive(this.props.location.query.inviteFreeShareId)
        if(result.state.code === 0){
            if(result.data.result !== 'success'){
                this.setState({
                    receiveStatus: result.data.result,
                })
                return 
            }
            this.setState({
                receiveStatus: 'auth',
            })
            window.toast('领取成功！')

            let qrUrl = '';
            const officialKey = getVal(this.props, 'location.query.officialKey', '');
            const source = getVal(this.props, 'location.query.source', '');
            const tracePage = sessionStorage.getItem('trace_page');
            if(officialKey||source=="coral"|| tracePage==='coral'){
                qrUrl = await getCoralQRcode({
                    channel:'inviteFree',
                    liveId: this.state.liveId,
                    channelId: this.state.channelInfo.channelId,
                    topicId: this.state.topicInfo.topicId,
                    pubBusinessId: this.props.location.query.inviteFreeShareId,
                    pubBusinessId2: officialKey || getCookie('userId')
                });
            }else{
                qrUrl = await subAterSign('inviteFree',this.state.liveId, {
                    channelId: this.state.channelInfo.channelId, 
                    topicId: this.state.topicInfo.topicId,
                    pubBusinessId: this.props.location.query.inviteFreeShareId,
                    toUserId: this.props.location.query.shareKey || ''
                })
            }
            if(qrUrl){
                locationTo(`/wechat/page/new-finish-pay?liveId=${this.state.liveId}&payFree=inviteFree&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&title=${encodeURIComponent(this.state.topicInfo.name)}&appIndex=${qrUrl.appId}`)
            }else{
                locationTo(`/topic/details-listening?topicId=${this.state.topicInfo.topicId}&inviteFreeShareId=${this.props.location.query.inviteFreeShareId}${(source=="coral"|| tracePage==='coral')?'&source=coral':''}${officialKey?('&officialKey='+officialKey):''}&pro_cl=invited`)
            }
        }else {
            window.toast(result.state.msg)
        }
        this.lock = false
    }

    // 显示领取列表弹窗
    showReceiveDialog(){
        this.receiveListOfInviteFriendsToListenDialog.show()
    }

    // 跳转到话题介绍页
    jumpToTopicIntro(){
        if(!(this.state.topicInfo && this.state.topicInfo.topicId)){
            return
        }
        locationTo(`/wechat/page/topic-intro?topicId=${this.state.topicInfo.topicId}`)
    }

	render(){
        if(!this.state.init){
            return ''
        }
        let {receiveStatus} = this.state
		return (
			<Page title="花钱请你学" className='topic-invite-page'>
                <div className="container">
                    <div className="user-info">
                        <img src={this.state.shareUserInfo.headImg} alt=""/>
                        <div className="user-name">
                            <span>{this.state.shareUserInfo.name}</span>
                        </div>
                    </div>
                    <p className="i-purcase">我购买了这个课程，免费请你学！</p>
                    <div className="topic-invite-center">
                        <img src={this.state.topicInfo.headImg} alt="" onClick={this.jumpToTopicIntro}/>
                        <div className="title" onClick={this.jumpToTopicIntro}>{this.state.topicInfo.name}</div>
                        <div className="which-channel-does-it-belong-to">
                            <p onClick={()=>{locationTo(`/wechat/page/channel-intro?channelId=${this.state.channelInfo.channelId}&sourceNo=invited`)}}>所属系列课：{this.state.channelInfo.name}</p>
                        </div>
                        <BtnStatus 
                            receiveStatus = {receiveStatus}
                            grab = {this.grab}
                        />
                        <TipStatus 
                            receiveStatus = {receiveStatus}
                            showReceiveDialog = {this.showReceiveDialog}
                        />
                    </div>
                    {
                        this.state.showActivity && this.state.actUrlInfo && (this.state.actUrlInfo.gainCourseUrl || this.state.actUrlInfo.assistCourseUrl) ? 
                        <div className="other-activity">
                            <div className="top">
                                <div className="title">你还可以参加以下活动</div>
                            </div>
                            {
                                this.state.actUrlInfo.gainCourseUrl ? 
                                <div className="free-module on-log on-visible" data-log-region="invite-study" data-log-pos="banner-share" onClick={()=>{locationTo(this.state.actUrlInfo.gainCourseUrl)}}>
                                    <div className="group">
                                        <span>已有169人参与</span>
                                    </div>
                                </div> : null
                            }
                            {
                                this.state.actUrlInfo.assistCourseUrl ? 
                                <div className="help-module on-log on-visible" data-log-region="invite-study" data-log-pos="banner-openlock" onClick={()=>{locationTo(this.state.actUrlInfo.assistCourseUrl)}}>
                                    <div className="group">
                                        <span>已有289人参与</span>
                                    </div>
                                </div> : null
                            }
                        </div> : null
                    }
                </div>
                <ReceiveListOfInviteFriendsToListen 
                    ref = {el => this.receiveListOfInviteFriendsToListenDialog = el}
                    inviteFreeShareId = {this.props.location.query.inviteFreeShareId}
                />
			</Page>
		)
	}
}

// 按钮状态
const BtnStatus = ({receiveStatus, grab}) =>{
    if(receiveStatus === 'enable'){
        return (
            <div className="btn on-log on-visible" data-log-region="invite-study" data-log-pos="begin-read" onClick={grab}>立即抢读</div>
        )
    }else if(receiveStatus === 'none'){
        return (
            <div className="btn disabled on-visible" data-log-region="invite-study" data-log-pos="hand-slow">已抢完</div>
        )
    }else if(receiveStatus === 'overLimit'){
        return (
            <div className="btn disabled on-visible" data-log-region="invite-study" data-log-pos="nochance">没机会了</div>
        )
    }else if(receiveStatus === 'auth') {
        return (
            <div className="btn disabled">无需领取</div>
        )
    }
}

// 提示状态
const TipStatus = ({receiveStatus, showReceiveDialog}) => {
    if(receiveStatus === 'enable'){
        return (
            <p className="tip">只有<em>10</em>个名额，手慢无~</p>
        )
    }else if(receiveStatus === 'none'){
        return (
            <p className="tip on-log on-visible" data-log-region="invite-study" data-log-pos="look-who" onClick={showReceiveDialog}>只有<em>10</em>个名额，<em>看看谁抢到了>></em></p>
        )
    }else if(receiveStatus === 'overLimit'){
        return (
            <p className="tip">每个系列课最多可领取2个单课，你已超额~</p>
        )
    }else if(receiveStatus === 'auth') {
        return (
            <p className="tip">你已购买系列课或已领过话题，无需再次领取~</p>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        
    }
};

const mapActionToProps = {
    fetchUserPower,
    getQrCode,
};

module.exports = connect(mapStateToProps, mapActionToProps)(TopicInvite);