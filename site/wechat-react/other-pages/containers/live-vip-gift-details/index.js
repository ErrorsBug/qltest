import React, { Component, Fragment } from 'react';
import Page from 'components/page';
import classnames from 'classnames';
import { api } from 'common_actions/common';
import { locationTo, timeBefore } from 'components/util';
import { share } from 'components/wx-utils';

class VipGiftDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 展示操作指引
            showGuide: false,
            // 会员类型
            vipType: 'live',
            // 赠礼状态
            giftStatus: 'overdue',
            // 是否是赠礼人
            isGiftGiver: false,
            // 赠礼剩余份数
            giftRemainingAmount: 10,
            // 直播间id
            liveId: '',
            // 直播间名称
            liveName: '',
            // 定制VIP的id
            customVipId: '',
            // 系列课数量
            channelNum: 0,
            // 话题数量
            topicNum: 0,
            // 会员价格
            price: 0,
            // 有效时长（月）
            months: 0,
            // 赠礼过期时间
            expireTime: 0,
            // 领取详情
            receiveDetails: [],
            // 当前用户的用户名
            userName: '',
            show: false,
        }
        this.data = {
            // 赠礼id
            giftId: props.location.query.giftId,
            // 是否正在请求接口
            isRequesting: false,
        }
    }

    // 展示或者隐藏操作指引
    toggleGuide = () => {
        this.setState({
            showGuide: !this.state.showGuide
        });
    }

    // 领取赠礼
    receiveGift = async () => {
        // 没名额了直接跳转到会员详情页
        if(this.state.giftRemainingAmount < 1){
            this.gotoVipPage()
            return
        }
        if (this.data.isRequesting) {
            return;
        }
        this.data.isRequesting = true;
        const params = { giftId: this.data.giftId };
        const res = await api({
            url: '/api/wechat/vip/receiveVipGift',
            body: params,
            method: 'POST',
            errorResolve: true,
        });
        if (res && res.state.code === 0) {
            window.toast('领取成功');
            this.setState({
                giftStatus: 'receive-success',
            });
        }else {
            window.toast(res.state.msg)
        }
        this.data.isRequesting = false;
    }

    // 跳转直播间页面
    gotoLive = () => {
        locationTo(`/wechat/page/live/${this.state.liveId}`);
    }

    // 跳转至会员页面
    gotoVipPage = () => {
        const { liveId, customVipId, vipType } = this.state;
        if (vipType == 'customVip') {
            locationTo(`/wechat/page/live-vip-details?liveId=${liveId}&id=${customVipId}`);
        } else {
            locationTo(`/wechat/page/live-vip-details?liveId=${liveId}`);
        }
    }

    // 获取VIP赠礼数据
    initGiftData = async () => {
        const params = { giftId: this.data.giftId };
        const res = await api({
            url: '/api/wechat/vip/getVipGiftInfo',
            method: 'POST',
            body: params,
            errorResolve: true,
        });
        if (res && res.state.code === 0) {
            const data = res.data;
            this.setState({
                vipType: data.vipType,
                giftStatus: data.isExpire == 'Y' ? 'overdue' : data.receiveStatus == 'A' ? 'have-received' : 'not-receive',
                isGiftGiver: data.isGiftFrom == 'Y',
                giftRemainingAmount: data.remainCount,
                liveId: data.liveId,
                customVipId: data.vipId,
                liveName: data.liveName,
                price: data.price,
                months: data.months,
                topicNum: data.topicNum || 0,
                channelNum: data.channelNum || 0,
                expireTime: data.expireTime,
                show: true
            });
            // 如果是赠送礼物的人，则获取赠礼的领取详情
            if (data.isGiftFrom == 'Y') {
                const res = await api({
                    url: '/api/wechat/vip/getReceiverList',
                    body: params,
                    method: 'POST',
                    errorResolve: true,
                });
                if (res && res.state.code === 0) {
                    this.setState({
                        receiveDetails: res.data.receiverList || []
                    });
                }
            }
        }
    }

    // 获取用户信息
    getUserInfo = async () => {
        const res = await api({
            url: '/api/wechat/user/info',
            body: {},
            errorResolve: true
        });
        if (res && res.state.code === 0) {
            this.setState({
                userName: res.data.user.name
            });
        }
    }

    // 初始化页面的分享信息
    initShare = () => {
        const { vipType, userName, topicNum, channelNum } = this.state;
        const shareTitle = `${userName}赠送您一份VIP礼包`;
        const shareDesc = vipType == 'live' ? '享受直播间课程无限畅听' : `包含精品：${channelNum}个系列课 ${topicNum}个单课`;
        const shareIcon = vipType == 'live' ? 'https://img.qlchat.com/qlLive/business/37AVZIX7-NDAV-RE2B-1543457022970-TI4FC2ZEY6Y6.png' : 'https://img.qlchat.com/qlLive/business/F3KPT31T-ZNBL-U345-1543457016145-57S7HKHOVT2N.png';
        share({
            title: shareTitle,
            timelineTitle: shareTitle,
            desc: shareDesc,
            timelineDesc: shareDesc,
            imgUrl: shareIcon,
            shareUrl: location.href,
        });
    }
    

    componentDidMount() {
        if (!this.data.giftId) {
            window.toast('错误：页面链接缺少giftId参数');
            return;
        }
        Promise.all([this.initGiftData(), this.getUserInfo()]).then(this.initShare);
    }

    render() {
        const {
            vipType,
            showGuide,
            giftStatus,
            isGiftGiver,
            giftRemainingAmount,
            liveName,
            channelNum,
            topicNum,
            months,
            price,
            receiveDetails,
            expireTime,
            show
        } = this.state;
        if(!show){
            return ''
        }
        return (
            <Page title="会员赠送详情" className="vip-gift-details-page">
                <section className={classnames("vip-poster", { 'custom-vip-gift': vipType == 'customVip' })}>
                    <div className="vip-intro">
                        <div>直播间：{liveName}</div>
                        <div className="flex flex-row flex-vcenter flex-space-between">
                            <div>有效期：{months}个月  价值：<i>￥</i>{price}</div>
                            <div className="view-more-button" role="button" onClick={this.gotoVipPage}>查看</div>
                        </div>
                    </div>
                </section>
                <section className={classnames("gift-situation", { 'custom-vip-gift': vipType == 'customVip' })}>
                    {
                        giftStatus == 'not-receive' &&
                            <Fragment>
                                <div className={classnames("gift-remaining-amount", { 'grey-text': giftRemainingAmount <= 0 && !isGiftGiver })}>剩余<strong>{giftRemainingAmount}</strong>份</div>
                                <div className={classnames("gift-receive-tip", { 'grey-text': giftRemainingAmount <= 0 && !isGiftGiver })}>{ giftRemainingAmount > 0 ? `赠礼将于${Math.ceil((expireTime - Date.now()) / (24 * 3600 * 1000))}天后过期` : '赠礼已经被领完啦'}</div>
                            </Fragment>
                    }
                    {
                        (giftStatus == 'receive-success' || giftStatus == 'have-received') &&
                            <Fragment>
                                <div className="gift-receive-status flex flex-row flex-vcenter flex-hcenter"><div className="icon-checked"></div>{ giftStatus == 'receive-success' ? '领取成功' : '已领取' }</div>
                                <div className="gift-receive-tip">可在个人中心【购买记录】查看</div>
                            </Fragment>
                    }
                    {
                        giftStatus == 'overdue' &&
                            <Fragment>
                                <div className="gift-receive-status grey-text flex flex-row flex-vcenter flex-hcenter"><div className="icon-warning"></div>该赠礼已过期</div>
                                {
                                    !isGiftGiver && <div className="gift-receive-tip grey-text">如已领取，可在直播间【会员页面】查看</div>
                                }
                            </Fragment>
                    }
                    {
                        isGiftGiver && giftStatus != 'overdue' && giftRemainingAmount > 0 &&
                        <div className="gift-operate-button handsel-button" role="button" onClick={this.toggleGuide}>赠送给好友</div>
                    }
                    {
                        !isGiftGiver && giftStatus == 'not-receive' &&
                        <div className="gift-operate-button receive-button" role="button" onClick={this.receiveGift}>{giftRemainingAmount > 0 ? '立即领取' : '去直播间查看并购买'}</div>
                    }
                    {
                        !isGiftGiver && (giftStatus == 'receive-success' || giftStatus == 'have-received') &&
                        <div className="gift-operate-button receive-button" role="button" onClick={this.gotoLive}>去直播间享受会员权益</div>
                    }
                    {
                        !isGiftGiver && giftStatus == 'overdue' &&
                        <div className="gift-operate-button receive-button" role="button" onClick={this.gotoLive}>去直播间查看</div>
                    }
                </section>
                {
                    isGiftGiver && 
                    <section className="gift-receive-details">
                        <div className="section-title flex flex-row flex-vcenter">
                            <div className="horizontal-line"></div>
                            <div className="text">领取详情</div>
                            <div className="horizontal-line"></div>
                        </div>
                        {
                            receiveDetails.map((item, index) => {
                                return (
                                    <div className="gift-receive-item flex flex-row flex-vcenter flex-space-between" key={index}>
                                        <div className="flex flex-row flex-vcenter">
                                            <img className="avatar" src={`${item.headImage}@64w_64h_1e_1c_2o`} alt="" />
                                            <span className="receiver"><span>{item.userName}</span>领取了我的赠礼</span>
                                        </div>
                                        <div className="receive-time">{timeBefore(item.receiveTime, Date.now())}</div>
                                    </div>
                                )
                            })
                        }
                    </section>
                }
                {
                    showGuide &&
                    <div className="handsel-guide" onClick={this.toggleGuide}>
                        <div className="guide-bg"></div>
                        <div className="guide-content">
                            <img src={require('./img/handsel_guide.png')} alt="" />
                        </div>
                    </div>
                }
            </Page>
        )
    }
}

export default VipGiftDetails;