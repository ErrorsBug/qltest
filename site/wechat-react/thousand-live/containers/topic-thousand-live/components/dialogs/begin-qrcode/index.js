import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { Confirm } from 'components/dialog';
import Detect from 'components/detect';
import { isFromLiveCenter, timeAfter } from 'components/util';
import { whatQrcodeShouldIGet, getCommunity, getDomainUrl } from 'common_actions/common';
// import QRImg from 'components/qr-img';
import FollowDialog from 'components/follow-dialog';
import { formatMoney, locationTo } from 'components/util';
import errorCatch from 'components/error-boundary'


@errorCatch()
@autobind
class BeginQrcode extends Component {

    state = {
        qrcode: '',
        qrAppId: '',
        timeStr: '',
        hasFocus: true,
        focusTip: '',
        existCommunity: false,
        communityName: '',
        communityCode: '',

    };

    data = {
        domain: '',
    };

    async fetchCommunityInfo() {
        const data = await getCommunity(this.props.liveId, 'topic', this.props.topicId);
        if (data) {
            this.setState({
                existCommunity: data.showStatus == 'Y',
                communityName: data.communityName,
                communityCode: data.communityCode,
            });
            // 如果有关联社群，则获取显示社群二维码页面的域名
            if (data.showStatus == 'Y') {
                try {
                    const res = await getDomainUrl({
                        type: 'activityCommunity'
                    })();
                    if (res.state.code === 0) {
                        this.data.domain = res.data.domainUrl;
                    } else {
                        window.toast(res.state.msg);
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }
    
    componentDidMount() {
        this.showFollowDialog();
        this.fetchCommunityInfo();
        this.pushIntoDialogShowCache()
    }

    // 将当前课程的的未开播弹窗的弹窗状态存入缓存，只弹一次
    pushIntoDialogShowCache = () => {
        let status = window.localStorage.getItem(`BEGINDIALOGSHOWSTATUS_${this.props.userId}`)
        // 没有缓存则存入
        if(!status){
            status = []
            status.push(this.props.topicId)
        }else {
            status = JSON.parse(status)
            if(!Array.isArray(status)){
                status = []
            }
            if(status.length > 19){
                status.shift()
            }
            status.push(this.props.topicId)
        }
        window.localStorage.setItem(`BEGINDIALOGSHOWSTATUS_${this.props.userId}`, JSON.stringify(status))
    }

    async showFollowDialog () {
        console.log(this.props.power.allowSpeak, this.props.power.allowMGLive)
        if (!(this.props.power.allowSpeak || this.props.power.allowMGLive)) {
            // 显示倒计时
            this.formatTime();
            // 优先弹出引导一次性订阅的弹窗
            if(this.props.oneTimePushSubcirbeStatus.subcribe === false){
                console.log(this.refs.beginDialog)
                // 弹出弹框
                this.refs.beginDialog.show();
                return
            }
            await this.fetchQrcode();
            // 弹出弹框
            this.refs.beginDialog.show();
        }

    }
    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    /**
     * 请求二维码
     */
    async fetchQrcode() {
        if(this.props.tracePage ==='coral'){
            return false;
        }
        let {
            // 是否绑定三方
            isBindThird,
            // 是否关注三方
            isFocusThree,
            // 是否关注千聊
            subscribe,

            topicId,
            liveId,
            isLogin,
        } = this.props;

        let result;
        if (isLogin) {
            result = await whatQrcodeShouldIGet({
                isBindThird,
                isFocusThree,
                options: {
                    subscribe,
                    channel: '203',
                    liveId,
                    topicId,
                }
            })
            if (result) {
                await this.setState({
                    qrcode: result.url,
                    qrAppId: result.appId,
                    hasFocus:false
                });
            }
        }

        return result && result.url;
    }


    // 格式化日期，并且开始倒计时
    formatTime() {
        let now = this.props.currentTimeMillis;
        let distTime = (this.props.startTime - now) / 1000;
        let days, hours, minutes, seconds;
        
        if (distTime < 0) {
            // 已开始
        } else if (distTime > 86400) {
            // 大于1天
            days = ~~(distTime / 86400);
            hours = ~~(distTime % 86400 / 3600);
            minutes = ~~(distTime % 3600 / 60);
            seconds = 0;
        } else {
            // 小于1天
            days = 0;
            hours = ~~(distTime % 86400 / 3600);
            minutes = ~~(distTime % 3600 / 60);
            seconds = ~~(distTime % 60);
        }

        this.updateTime(days, hours, minutes, seconds);
    }

    // 倒计时执行函数
    updateTime(days, hours, minutes, seconds) {
        let d = days > 9 ? days : ('0'+days);
        let h = hours > 9 ? hours : ('0'+hours);
        let m = minutes > 9 ? minutes : ('0'+minutes);
        let s = seconds > 9 ? seconds : ('0'+seconds);

        if(this.state.hasFocus){// 已关注没有码的时候不加时间单位，方便用于分割
            this.setState({
                timeStr: `${d} ${h} ${m} ${s}`
            });
        }

        setTimeout(() => {
            if (days === 0 && seconds === 0 && minutes === 0 && hours === 0) {
                this.refs.beginDialog.hide();
                return;
            } else if (seconds === 0 && minutes === 0 && hours === 0) {
                days -= 1;
                hours = 23;
                minutes = 59;
                seconds = 59;
            } else if (seconds === 0 && minutes === 0) {
                hours -= 1;
                minutes = 59;
                seconds = 59;
            } else if (seconds === 0) {
                minutes -= 1;
                seconds = 59;
            } else {
                seconds -= 1;
            }

            this.updateTime(days, hours, minutes, seconds);
        }, 1000);
    }
    
    share(){
        // 系列课下的话题，都跳转到系列课分享卡页面，其余跳转到话题分享卡页面
        let type = 'topic'
        if (isFromLiveCenter() && this.props.platformShareRate) {
            if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y' && this.props.channelCharge[0]) {
                type = 'channel'
            }
        }else if(this.props.topicInfo.channelId){
            type = 'channel'
        }
        let url = `/wechat/page/sharecard?type=${type}&${type}Id=${type === 'topic' ? this.props.topicInfo.id : this.props.topicInfo.channelId}&liveId=${this.props.liveId}&wcl=beforeclass`;

        if (isFromLiveCenter() && this.props.platformShareRate) {
            url = url + "&psKey=" + this.props.userId;
        }
        locationTo(url)
    }
    

    render() {
        const followDialogOption = {
            traceData: 'thousandLiveFocusQrcode',
            channel: '203',
            appId: this.state.qrAppId
        }
        if(!this.state.hasFocus && this.props.oneTimePushSubcirbeStatus.subcribe){
            return (
                <FollowDialog 
                    ref='beginDialog'
                    title='开播提醒'
                    desc='太忙了，常常忘记上课？开课前15分钟，老师贴心提醒你'
                    qrUrl={ this.state.qrcode }
                    option={ followDialogOption }
                />
            );
        }else {
            let time = this.state.timeStr.split(' ');
            let {topicInfo,shareData} = this.props
            let money
            
            if (isFromLiveCenter() && this.props.platformShareRate) {
                // 如果是平台分销，则优先单课价格。
                if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y' && this.props.channelCharge[0]) {
                    // 如果没有开启单节购买
                    if (this.props.channelCharge[0].discountStatus === 'N') {
                        money = this.props.channelCharge[0].amount*100;
                    } else {
                        money = this.props.channelCharge[0].discount*100
                    }
                } else {
                    money = this.props.topicInfo.money;
                }
                
                shareData && (shareData.shareEarningPercent = this.props.platformShareRate);
                money = money * (this.props.platformShareRate / 100)
            } else {
                if(shareData){
                    if(topicInfo.channelId && shareData.discountStatus && shareData.discountStatus !== 'N'){
                        money = shareData.discount
                    }else {
                        money = shareData.amount
                    }
    
                    money = money * (shareData.shareEarningPercent / 100);
    
                }
            }
            return (
                <Confirm
                    ref='beginDialog'
                    theme='empty'
                    buttons='none'
                    className="begin-dialog"
                >
                    <main className='focus-begin-dialog-container'>
                        <div className="content-container">
                            <div className="title">距离开播</div>
                            <div className="time">
                                <span className="item">{time[0]}<em>天</em></span>
                                <span className="colon"></span>
                                <span className="item">{time[1]}<em>时</em></span>
                                <span className="colon"></span>
                                <span className="item">{time[2]}<em>分</em></span>
                                <span className="colon"></span>
                                <span className="item">{time[3]}<em>秒</em></span>
                            </div>
                            {
                                this.props.oneTimePushSubcirbeStatus.subcribe === false ? 
                                <div className="tip">提前15分钟在公众号通知你<br/>准时上课 实时互动</div> :
                                (
                                    topicInfo.type === 'charge' && shareData && shareData.shareEarningPercent && !(this.isWeapp && Detect.os.ios) ? 
                                    <div className="tip">每邀请<em>1人</em>报名<br/>即可获得<em>{shareData ? shareData.shareEarningPercent : ''}%</em>的分成</div>:
                                    <div className="tip">提前15分钟在公众号通知你<br/>这么好的知识，不要忘了好朋友啊~</div>
                                )
                            }
                        </div>
                        <div className="share-wrapper">
                        {   
                            this.props.oneTimePushSubcirbeStatus.subcribe === false ? 
                                (
                                    Detect.os.phone &&
                                    <div className="share on-log on-visible" data-log-region="oneTimePushSubcirbe" data-log-pos="4" onClick={()=>{locationTo(this.props.oneTimePushSubcirbeStatus.subcribeUrl)}}>
                                        设置开播提醒
                                    </div>
                                )    
                            :
                                topicInfo.type === 'charge' ?
                                    (
                                        (shareData && shareData.shareEarningPercent )&&!(this.isWeapp&&Detect.os.ios)?
                                        <div className="share on-log on-visible" data-log-region="shareBeforeClass" data-log-pos="2" onClick={this.share}>邀请好友赚{formatMoney(money)}元</div>:
                                        <div className="share on-log on-visible" data-log-region="shareBeforeClass" data-log-pos="3" onClick={this.share}>邀请好友一起学</div>
                                    )
                                :
                                    <div className="share on-log on-visible" data-log-region="shareBeforeClass" data-log-pos="1" onClick={this.share}>请好友免费听</div>
                        }
                            {
                                this.state.existCommunity &&
                                <div className="community-info">
                                    <img className="community-thumbnail" alt="" src={require('./img/thumbnail.png')} />
                                    <div className="community-name">{this.state.communityName}</div>
                                    <div className="join-tip">(限时进群中)</div>
                                    <div className="join-button" onClick={() => {
                                        locationTo(`${this.data.domain}wechat/page/community-qrcode?liveId=${this.props.liveId}&communityCode=${this.state.communityCode}`);
                                    }}>加入开课社群</div>
                                </div>
                            }
                        </div>
                        <div className="close" onClick={()=>{this.refs.beginDialog.hide()}}></div>
                    </main>
                </Confirm>
            );
        }
    }
}

BeginQrcode.propTypes = {
    
};

const mapStateToProps = state => ({
    liveName: state.thousandLive.liveInfo.entity.name,
    liveLogo: state.thousandLive.liveInfo.entity.logo,
    liveId: state.thousandLive.liveInfo.entity.id,
    channelId: state.thousandLive.topicInfo.channelId,
    topicId: state.thousandLive.topicInfo.id,
    topicInfo: state.thousandLive.topicInfo,
    startTime: state.thousandLive.topicInfo.startTime,
    power: state.thousandLive.power,
    currentTimeMillis: state.thousandLive.currentTimeMillis,
    topicStatus: state.thousandLive.topicInfo.status,

    isBindThird: state.thousandLive.liveInfo.isBindThird,
    isFocusThree: state.thousandLive.isSubscribe.isFocusThree,
    isShowQl: state.thousandLive.isSubscribe.isShowQl,
    subscribe: state.thousandLive.isSubscribe.subscribe,

    isLiveAdmin: state.common.isLiveAdmin,
});

const mapActionToProps = {
};

export default connect(mapStateToProps, mapActionToProps)(BeginQrcode);
