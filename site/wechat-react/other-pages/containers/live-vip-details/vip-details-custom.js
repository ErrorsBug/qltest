import React, { Component } from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import Page from 'components/page';
import LiveFollowInfo from 'components/live-follow-info';
import TabView from 'components/tab-view';
import { autobind,throttle } from 'core-decorators';
import ChannelListItem from 'components/channel-list-item';
import TopicListItem from 'components/topic-list-item';
import { share } from 'components/wx-utils';
import OperateMenu from 'components/operate-menu';
import PushVipDialog from 'components/dialogs-colorful/push-dialogs/vip';
import { Confirm } from 'components/dialog';
import { getDescriptList } from '../../actions/common';
import { getCustomVipInfo, getCustomVipAuthList, getCustomVipCourseList, getUserVipDetail, getVipInfo, checkUser } from '../../actions/vip';
import { getLiveInfo, liveFocus, getPower, initLiveShareQualify } from '../../actions/live';
import { doPay, subAterSign,bindShareKey } from 'common_actions/common'
import { imgUrlFormat, getVal, formatMoney, locationTo } from 'components/util';
import FoldView from 'components/fold-view';
import { fetchCouponListAction } from 'common_actions/coupon';
import { BottomDialog } from 'components/dialog';
import CouponItem, { couponItemFilter } from 'components/coupon-item';
import { scrollToX } from 'components/scroll-box';
import VipGift from './vip-gift';
import Detect from "components/detect";

import {
    fetchCustomVipAuthCount,
} from '../../actions/join-list'

@autobind
class VipDetailsCustom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            liveId: props.location.query.liveId,
            id: props.location.query.id,
            userList: [], // 已购会员
            vipDesc: [], // vip简介
            channelList: [],
            topicList: [],
            showBtnBuy:true,
	        couponList: [],
            couponListAvailable: [],
            vipAuthCount: 0,

            activeChargeIndex: 0,   // 当前价格配置
            originalPrice: 0,       // 初始价格（元）
            discountPrice: 0,       // 优惠了的价格
            finalPrice: 0,          // 最终价格

            isShowPushVipDialog: false, // 显示推送渠道窗口
            isShowWinPaymentDetails: false, // 显示底部支付详情弹框
            isShowWinCouponSelect: false, //显示优惠券选择
            isShowPayCompnent: false, // 是否展示支付组件 用于优惠券的返回太慢 2s

            isNeedFill: null,       // 购买会员前是否需要填写表单

        }
        this.data = {
            payStatus: '',

        }
    }

    /**
     * 页面流程
     */
    async componentDidMount() {
        // 绑定分销关系
        if (this.props.location.query.lshareKey && this.props.location.query.lshareKey !== 'undefined') {
            await this.props.bindShareKey(this.state.liveId, this.props.location.query.lshareKey);
        }
        

        await this.getCustomVipInfo();
        this.props.initLiveShareQualify(this.state.liveId).then(() => {
            this.initShare();
        })
        this.props.getLiveInfo(this.state.liveId);
        this.props.getPower(this.state.liveId);
        this.props.getUserVipDetail(this.state.id);
        this.getVipInfo();
        this.getCustomVipAuthCount()
        this.getCouponList();
        this.setTimeShowPayComponent() // 设置两秒后才开

    }

    async getCustomVipAuthCount () {
        
        try {
            const result = await this.props.fetchCustomVipAuthCount({cVipId:this.state.id})
            if (result && result.state && result.state.code === 0) {
                const vipAuthCount = result.data.count
                this.setState({
                    vipAuthCount
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    getCollectionInfo = async () => {
        return this.props.checkUser({
            liveId: this.state.liveId,
            businessType: 'customVip',
            businessId: this.state.id,
        }).then(config => {
            this.setState({
                isNeedFill: config
            })
        }).catch(err => {
            console.error(err);
            window.toast('获取学员验证信息失败');
        })
    }


    getCustomVip = () => {
        let chargeConfigList = this.props.customVip.data.chargeConfigList;
        let chargeList = chargeConfigList.filter(item => item.type == 'customVip');
        let minCustomVip = chargeList.sort((l,r) => {
            return l.amount - r.amount
        })[0]
        return minCustomVip
    }

    // 设置2S之后才展示
    setTimeShowPayComponent() {
        setTimeout(() => {
            if(this.state.isShowPayCompnent) return
            this.setState({
                isShowPayCompnent: true
            })
        }, 5000)
    }
    /**
     *
     * 初始化分享
     *
     * @memberof TopicIntro
     */
    initShare() {

        let wxqltitle = this.props.customVip.data.name;
        let descript = `￥${formatMoney(this.getCustomVip().amount)}/${this.getCustomVip().chargeMonths}${this.getCustomVip().type == 'tryout' ? '天' : '个月'}，畅听${this.props.customVip.data.channelNum + this.props.customVip.data.topicNum}节精品课`;
        let wxqlimgurl = this.props.customVip.data.imageUrl;
        let friendstr = wxqltitle;
        let shareUrl = window.location.href;

        let onShareComplete = null

        // 有登录才初始化更多信息
        if (this.props.shareQualify && this.props.shareQualify.shareKey && this.props.shareQualify.status == 'Y') {
            wxqltitle = "我推荐-" + wxqltitle;
            friendstr = "我推荐-" + friendstr.replace("欢迎", "");
            shareUrl = shareUrl + "&lshareKey=" + this.props.shareQualify.shareKey;
        }
        

        /*****/
        share({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            timelineDesc: friendstr, // 分享到朋友圈单独定制
            imgUrl: wxqlimgurl,
            shareUrl: shareUrl,
            successFn: onShareComplete,
        });
    }

    onClickOpen = () => {
        // if (this.props.customVip.data && this.props.customVip.data.authStatus === 'Y') {
        //     return window.toast('您已购买此vip')
        // }
        this.state.couponListAvailable.length > 0 ? 
        this.showWinPaymentDetails() :
        this.onPay();
    }

    showWinPaymentDetails = () => {
        this.setState({
            isShowWinPaymentDetails: true,
            _activeCouponIndex: this.state.activeCouponIndex
        })
    }

    hideWinPaymentDetails = () => {
        this.setState({
            isShowWinPaymentDetails: false
        })
    }

    @throttle(1000)
    async onPay(){
        if (this.data.payStatus === 'pending') return;
        this.data.payStatus = 'pending';
        if (!Detect.os.phone) {
            setTimeout(() => {
                if (this.data.payStatus) {
                    this.data.payStatus = '';
                }
            }, 3000)
        }

        if (this.state.isNeedFill === null) {
            await this.getCollectionInfo();
        }
        const {
            isNeedFill
        } = this.state
        // 如果没填过表且不是跳过填表状态 则需要填表 表单前置
        if (isNeedFill && isNeedFill.isWrite == 'N' && isNeedFill.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != isNeedFill.id) {
            window.location.href = '/wechat/page/live-studio/service-form/' + this.state.liveId + `?configId=${isNeedFill.id}&scene=${isNeedFill.scene}&type=customVip&vipId=${this.state.id}&auth=${this.state.finalPrice == 0 ? 'Y' : 'N'}`;
            return;
        }
        let coupon = this.state.couponListAvailable.length > 0 ? this.state.couponListAvailable[this.state.activeCouponIndex] : undefined;
        this.props.doPay({
            type: 'LIVEVIP',
            liveId: this.state.liveId,
            couponId: coupon ? coupon.couponId : undefined,
            couponType: coupon ? 'live': undefined,
            chargeConfigId: this.props.customVip.data.chargeConfigList[this.state.activeChargeIndex].id,
            total_fee: formatMoney(this.state.finalPrice),
            callback: () => {
                this.payCallBack()
            },
            onPayFree: (result) => {
                this.payCallBack('Y')
            },
            onCancel: () => {
                this.data.payStatus = '';
            },
        });
    }

    // 支付成功回调
    async payCallBack(payFree = 'N') {
        /**
         * 支付报名成功后引导关注千聊
         * 1、首先判断是否为白名单，是白名单的直接不走后面的流程（即返回false，原来支付或报名成功后怎么做就怎么做）。
         * 2、不是白名单的去查找是否有配置，没配置的判断是否关注千聊，以及是否是专业版，两个条件有一个是的话直接返回（即返回false，原来支付或报名成功后怎么做就怎么做），不走后面流程，有一个条件不是的话直接引导关注千聊。
         * 3、有配置的话判断配置的公众号是否已经关注，全都关注的话不走后面流程（即返回false，原来支付或报名成功后怎么做就怎么做），有未关注的直接引导关注当前第一个未关注的配置公众号。
         */

        let qrUrl = await subAterSign('subAfterSignVip',this.state.liveId, {toUserId: this.state.id})

        if (qrUrl) {
            qrUrl.channel = 'subAfterSignVip'
        }

        const {
            isNeedFill
        } = this.state

        // 如果没填过表且不是跳过填表状态 则需要填表 表单后置
        if (isNeedFill && isNeedFill.isWrite == 'N' && isNeedFill.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != isNeedFill.id) {
            locationTo('/wechat/page/live-studio/service-form/' + this.state.liveId + `?configId=${isNeedFill.id}&scene=${isNeedFill.scene}&type=customVip&vipId=${this.state.id}auth=${payFree}${qrUrl ? `&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}&qrChannel=${qrUrl.channel}` : ''}`)
        } else {
            if(qrUrl){
                locationTo(`/wechat/page/new-finish-pay?liveId=${this.state.liveId}&payFree=${payFree}&type=subAfterSignVip&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}&title=${encodeURIComponent(this.props.liveInfo.entity.name + '直播间定制会员')}&fromVip=Y`)
            }else{
                locationTo(window.location.href);
            }
        }

        this.data.payStatus = '';
    }

    async getCustomVipInfo() {
        await this.props.getCustomVipInfo(this.state.id)
            .then(res => {
                if (res.status === 'error') {
                    return window.toast(res.message);
                }
                
                // 开通列表
                this.props.getCustomVipAuthList(this.state.id)
                    .then(res => {
                        if (!res.state.code && res.data.headList) {
                            this.setState({
                                userList: res.data.headList
                            })
                        }
                    })
                
                // vip简介
                this.props.getDescriptList(this.state.id, "vipDesc")
                    .then(res => {
                        if (!res.state.code && res.data.descriptions && res.data.descriptions.vipDesc) {
                            this.setState({
                                vipDesc: res.data.descriptions.vipDesc
                            })
                        }
                    })
                
                // 系列课列表
                this.props.getCustomVipCourseList(this.state.id, "channel")
                    .then(res => {
                        if (!res.state.code && res.data.courseList) {
                            this.setState({
                                channelList: res.data.courseList
                            })
                        }
                    })

                // 单课列表
                this.props.getCustomVipCourseList(this.state.id, "topic")
                    .then(res => {
                        if (!res.state.code && res.data.courseList) {
                            this.setState({
                                topicList: res.data.courseList
                            })
                        }
                    })
            })
    }

    onClickFollowLive = () => {
        this.props.liveFocus(this.props.liveInfo.isFollow ? 'N' : 'Y', this.state.liveId)
    }

    showPushVipDialog = e => {
        this.setState({
            isShowPushVipDialog: true
        })
    }

    hidePushVipDialog = e => {
        this.setState({
            isShowPushVipDialog: false
        })
    }

    async getVipInfo() {
        let result = await this.props.getVipInfo({liveId:this.state.liveId, customId:this.props.location.query.id});
        let isVip = getVal(result, 'data.isVip', 'N');
        let kickOutStatus = getVal(result, 'data.kickOutStatus', 'N');
        if (isVip === 'Y' || kickOutStatus === 'Y') {
            this.setState({
                showBtnBuy:false,
            })
        }
    }

    getCouponList() {
        return this.props.fetchCouponListAction({
            businessId:this.state.liveId,
            liveId:this.state.liveId,
            businessType:'live',
        })
            .then(res => {
                if (res.state.code) throw Error(res.state.msg);
                let couponList = res.data.couponList;
                console.log('couponList', couponList)

                // 处理coupon数据
                couponList.forEach(item => couponItemFilter(item, {
                    liveName: this.props.liveInfo.entity.name
                }))

                // 价格排序
                couponList.sort((l, r) => r.money - l.money)

                this.setState({
                    couponList
                })
                
                this.updateChargeIndex();

                // 展示价格底部
                if (!this.state.isShowPayCompnent) {
                    this.setState({
                        isShowPayCompnent: true
                    })
                }

	            if(this.props.location.query.pullUpPay || this.props.location.query.autopay == 'Y'){
                    this.props.location.query.autopay == 'Y' && window.history.replaceState(null, null, location.pathname + location.search.replace('&autopay=Y', ''))
		            this.onClickOpen();
	            }
                
            })
            .catch(err => {
                console.error(err);
                window.toast(err.message);
            })
    }

    /**
     * 更新价格配置
     */
    updateChargeIndex = index => {
        index === undefined && (index = this.state.activeChargeIndex);

        let activeCharge = this.props.customVip.data,
            originalPrice = formatMoney(activeCharge.chargeConfigList.sort((l,r) => {
                l.amount - r.amount
            })[index].amount);

        // 可用优惠券过滤并排序
        let couponListAvailable = this.state.couponList
            .filter(item => !(item.minMoney > originalPrice));
        
        // 寻找大于等于原价的最小优惠
        let activeCouponIndex = -1;
        if (couponListAvailable.length) {
            activeCouponIndex = 0;
            for (let i = 1; i < couponListAvailable.length; i++) {
                if (couponListAvailable[i].money >= originalPrice) {
                    if (couponListAvailable[i].money < couponListAvailable[i - 1].money) {
                        activeCouponIndex = i;
                    }
                } else {
                    break;
                }
            }
        }

        this.setState({
            activeChargeIndex: index,
            originalPrice,
            couponListAvailable,
            activeCouponIndex,
        })

        setTimeout(() => {
            Array.prototype.slice.call(document.querySelectorAll('.main-charge-select .list')).forEach(wrapEl => {
                let itemEl = wrapEl.querySelectorAll('li')[index];
                let scrollX = itemEl.offsetLeft - (wrapEl.offsetWidth - itemEl.offsetWidth) / 2;
                scrollToX(wrapEl, scrollX);
            })
        })

        this.updatePrice();
    }

    updatePrice = () => {
        setTimeout(() => {
            let activeCharge = this.props.customVip.data.chargeConfigList[this.state.activeChargeIndex],
                originalPrice = activeCharge.amount,
                activeCoupon = this.state.couponListAvailable[this.state.activeCouponIndex],
                discountPrice = activeCoupon && (activeCoupon.money * 100 > originalPrice ? originalPrice : activeCoupon.money * 100) || 0,
                finalPrice = Math.round((originalPrice - discountPrice) * 100) / 100;

            this.setState({
                originalPrice,
                discountPrice,
                finalPrice,
            })
            
        })
    }

    hideWinCouponSelect = () => {
        this.setState({
            isShowWinCouponSelect: false
        })
    }

    showWinCouponSelect = () => {
        this.setState({
            isShowWinCouponSelect: true
        })
    }

    /********   渲染部分   ********/


    // 介绍、权益tab渲染
    tabsConfig = [
        {
            name: '介绍',
            render: () => {
                return <div className="introduce-tab">
                        {
                            this.state.vipDesc && this.state.vipDesc.length ?
                            <FoldView>
                                <div className="intro-wrap">
                                    <div className="intro-wrap-title">简介</div>
                                    {
                                        this.state.vipDesc.map((item, index) => {
                                            if (item.type === 'text') {
                                                return <pre key={index}>{item.content}</pre>
                                            } else if (item.type === 'image') {
                                                return <img
                                                    key={index}     
                                                    className='intro-image'
                                                    src={`${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_800,limit_1')}`}
                                                />
                                            }
                                            return false
                                        })
                                    }
                                </div>
                            </FoldView> :
                            <div className="intro-wrap">
                                <div className="no-content">暂无简介</div>
                            </div>
                        }
                    <div className="intro-wrap">
                        <div className="intro-wrap-title">须知</div>
                        <ul>
                            <li>成功开通后，您可不限次数畅听本专栏所有课程</li>
                            <li>只可有效期内畅听，过期需续费，请督促自己学习</li>
                            <li>该课程为虚拟内容服务，购买成功后概不退款，敬请原谅</li>
                        </ul>
                    </div>
                </div>
            }
        },
        {
            name: '权益',
            render: () => {
                let { channelList = [], topicList = [] } = this.state;
                let { power } = this.props;
                let sysTime = Date.now();

                channelList = channelList.filter(item => item.isRelay !== 'Y')

                return <div>
                    {   
                        channelList.length ?
                        <div className="course-list-wrap">
                            <div className="course-list-title">系列课</div>
                            {
                                channelList.map((item, index) => {
                                    return (
                                        <ChannelListItem key={item.id}
                                            channelId={item.id}
                                            title={item.name}
                                            logo={item.headImage}
                                            power={power}
                                            courseNum={item.topicCount}
                                            courseTotal={item.planCount}
                                            learnNum={item.learningNum}
                                            chargeConfigs={item.chargeConfigs}
                                            hide={item.displayStatus == "N"} />
                                    )
                                })
                            }
                        </div> : null
                    }
                    {
                        topicList.length ?
                        <div className="course-list-wrap">
                            <div className="course-list-title">课程</div>
                            {
                                topicList.map((item, index) => {
                                    return (
                                        <TopicListItem key={item.id}
                                            topicId={item.id}
                                            power={power}
                                            title={item.topic}
                                            logo={item.backgroundUrl}
                                            startTime={item.startTimeStamp}
                                            timeNow={sysTime}
                                            authNum={item.authNum}
                                            browseNum={item.browseNum}
                                            chargeType={item.type}
                                            topicStyle={item.style}
                                            money={item.money}
                                            status={item.status}
                                            displayStatus={item.displayStatus}
                                            isShowStudyNum={'Y'} />
                                    )
                                })
                            }
                        </div> : null
                    }
                    {
                        (!channelList.length && !topicList.length) ?
                            <div className="intro-wrap"><div className="no-content">暂无课程</div></div>
                        :null    
                    }
                </div>
            }
        }
    ]

    // 底部菜单配置
    operateMenuConfig = [
        {
            name: '编辑',
            src:   '//static.qianliaowang.com/frontend/rs/wechat-react/img/ope-icon-edit.3e68226d7fc08df7fe0b560dc0ccf3e2.png',
            onClick: () => {
                this.refs.editTips.show();
            }
        },
        {
            name: '推送通知',
            src:   '//static.qianliaowang.com/frontend/rs/wechat-react/img/ope-icon-push.283984c1bd1612fc3d501836c82d7457.png',
            onClick: () => {
                this.setState({
                    isShowPushVipDialog: true
                })
            }
        }
    ]

    onSubmitCouponChange = () => {
        this.setState({
            isShowWinPaymentDetails: true,
            isShowWinCouponSelect: false,
            activeCouponIndex: this.state._activeCouponIndex
        })
        this.updatePrice();
    }
    
    onClickCouponItem = (e, coupon, index) => {
        // 点击统一配置的话取消使用优惠码
        if (index == this.state._activeCouponIndex) {
            index = -1; 
        }

        this.setState({
            _activeCouponIndex: index
        })
    }

    goToAuthList = () => {
        if (this.props.power.allowMGLive) {
            locationTo(`/wechat/page/join-list/customvip?id=${this.props.location.query.liveId}&cvid=${this.props.location.query.id}`)
        }
    }

    onClickChargeItem = e => {
        this.updateChargeIndex(e.currentTarget.getAttribute('data-index'))
    }

    render() {
        if (!this.props.customVip.data) return false;

        let { customVip, liveInfo, power, vipChargePo } = this.props;
        let { imageUrl, name, amount, month, openPeopleNum, authStatus, chargeConfigList } = customVip.data || {};

        let noTryChargeConfig = [];
        if (Array.isArray(chargeConfigList)) {
            noTryChargeConfig = chargeConfigList.filter((item) => {
                return item.type != 'tryout';
            });
        }

        return (
            <Page title={name} className="p-live-vip-details">
                <div className="main">
                    <section>
                        <div className="banner" style={{backgroundImage: `url(${imgUrlFormat(imageUrl, '?x-oss-process=image/resize,w_750,h_468')})`}}></div>

                        <div className="vip-brief">
                            <div className="name">{name}</div>
                            {/* <div className="price-wrap">
                                ￥{formatMoney(amount)}
                                <span>/{month}月</span>
                            </div> */}
                            <div className="main-charge-select">
                                {/* <div className="title">选择包月</div> */}
                                <MainChargeSelectList 
                                    list={chargeConfigList}
                                    activeIndex={this.state.activeChargeIndex}
                                    onClickItem={this.onClickChargeItem}/>
                            </div>
                            {
                                (vipChargePo&& vipChargePo.status == 'Y') &&
                                <div className="expire-wrap">
                                    有效期：{dayjs(vipChargePo.expiryTime).format('YYYY-MM-DD')}   
                                    <span className="btn-renew" onClick={this.onClickOpen}>续费</span>
                                </div>
                            }
                        </div>

                        <div className="member"  onClick={this.goToAuthList} >
                            <div className="member-count">
                                <i className="icon-user"></i>
                                {this.state.vipAuthCount}人开通
                            </div>
                            <div className="avatar-list">
                                {
                                    this.state.userList.reduce((prev, cur) => {
                                        if (!prev.find(item => item == cur)) {
                                            prev.push(cur);
                                        }
                                        return prev;
                                    }, []).slice(0, 5).map((item, index) => {
                                        return <div className="avatar-item" key={index} style={{backgroundImage: `url(${imgUrlFormat(item, '?x-oss-process=image/resize,w_54,h_54')})`}}></div>
                                    })
                                }
                            </div>
                        </div>
                    </section>

                    <section>
                        <LiveFollowInfo liveInfo={liveInfo} onClickFollow={this.onClickFollowLive} isAdmin={power.allowMGLive}/>
                    </section>
               
                    <section>
                        <TabView tabs={this.tabsConfig}/>
                    </section>

                    {/* vip赠礼 */}
                    {
                        !power.allowMGLive &&
                        <VipGift vipType="custom" chargeConfig={noTryChargeConfig} doPay={this.props.doPay} liveId={this.state.liveId} />
                    }
                </div>

                {
                    (this.state.isShowPayCompnent && !power.allowMGLive && authStatus === 'N' && this.state.showBtnBuy)?
                    <footer>
                        <div className="footer-placeholder"></div>
                        <div className="footer-entity">
                            <div className="btn-open" onClick={this.onClickOpen}>{(chargeConfigList.length && chargeConfigList[this.state.activeChargeIndex].type == 'tryout') ? '立即试用' :'立即开通'}</div>
                        </div>
                    </footer> : null 
                }

                {
                    power.allowMGLive && 
                    <OperateMenu
                        config={this.operateMenuConfig} />
                }

                {
                    power.allowMGLive && 
                    <PushVipDialog
                        cVipId={this.state.id}
                        liveId={this.state.liveId}
                        isShow={this.state.isShowPushVipDialog}
                        hide={this.hidePushVipDialog} />
                }

                {/* 付款详情 */}
                <BottomDialog
                    theme='empty'
                    className="flex-scroll-h-lt-80"
                    show={this.state.isShowWinPaymentDetails}
                    onClose={this.hideWinPaymentDetails}
                >
                    <div className="cdb-header">
                        <div className="cdb-header-left" onClick={this.hideWinPaymentDetails}>
                            <i className="icon_delete"></i>
                        </div>
                        付款详情
                    </div>

                    <div className="cdb-body">
                        {/* <div className="bottom-charge-select">
                            <div className="title">选择购买类型</div>
                            <ul className="list">
                                {
                                    generalVip.vipChargeconfig.map((item, index) => {
                                        return (
                                            <li className={this.state.activeChargeIndex == index ? "item active" : 'item'} 
                                                key={item.id}
                                                data-index={index}
                                                onClick={this.onClickChargeItem}>
                                                <div className="item-entity">
                                                    <div className="price">￥{formatMoney(item.amount)}/{item.chargeMonths}个月</div>
                                                </div>
                                            </li> 
                                        )
                                    })
                                }
                            </ul>
                        </div> */}

                        <div className="main-charge-select">
                            <div className="title">选择包月</div>
                            <MainChargeSelectList
                                list={chargeConfigList}
                                activeIndex={this.state.activeChargeIndex}
                                onClickItem={this.onClickChargeItem} />
                        </div>

                        <div style={{paddingBottom: 30}}>
                            <div className="cdb-line">
                                <div className="cdb-line-main">优惠</div>
                                <div className="cdb-line-desc" onClick={this.showWinCouponSelect}>
                                    {
                                        this.state.discountPrice > 0 ?
                                        `已使用优惠码抵扣￥${formatMoney(this.state.discountPrice)}` : 
                                        '未使用优惠券'
                                    }
                                    <i className="icon_coupons_fill"></i>
                                    <i className="icon_enter"></i>
                                </div>
                            </div>
                            <div className="cdb-line">
                                <div className="cdb-line-main">还需支付</div>
                                <div className="cdb-line-desc">￥{formatMoney(this.state.finalPrice)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="btn-open" onClick={this.onPay}>支付 ￥{formatMoney(this.state.finalPrice)}</div>
                </BottomDialog>


                {/* 优惠券选择 */}
                <BottomDialog
                    theme='empty'
                    show={this.state.isShowWinCouponSelect}
                    className="flex-scroll-h-lt-80"
                    onClose={this.hideWinCouponSelect}  
                >
                    <div className="cdb-header">
                        <div className="cdb-header-left" onClick={this.hideWinCouponSelect}>
                            <i className="icon_back"></i>
                        </div>
                        选择优惠券
                        <div className="cdb-header-right" onClick={this.onSubmitCouponChange}>确认</div>
                    </div>

                    <div className="cdb-body">
                        {
                            this.state.couponListAvailable.map((item, index) => {
                                return (
                                    <CouponItem
                                        key={index}
                                        coupon={item}
                                        index={index}
                                        isActive={index === this.state._activeCouponIndex}
                                        onClick={this.onClickCouponItem}/>
                                )
                            })
                        }
                    </div>
                </BottomDialog>

                {/*编辑提示*/}
                <Confirm
                    ref='editTips'
                    title='定制VIP设置'
                    buttons = 'cancel'
                    cancelText='我知道了'
                    className='goto-customized'
                >
                    <main className='dialog-main'>
                        请到pc直播间管理后台，点击左侧菜单<span>【课程列表】-【会员列表】</span>进行操作<br />
                        访问地址：<a className="underline" href='http://v.qianliao.tv'>v.qianliao.tv</a><br />
                        不知道怎么操作？<a href='http://t.cn/Rmo4iKI'>点击查看教程</a>
                    </main>
                </Confirm>
            </Page>
        );
    }
}

class MainChargeSelectList extends Component {
    render() {
        let { list, activeIndex, onClickItem } = this.props;
        return (
            <ul className="list" ref={r => this.listEl = r}>
                {
                    list.map((item, index) => {
                        return (
                            <li className={activeIndex == index ? "item active" : 'item'} 
                                key={item.id}
                                data-index={index}
                                onClick={onClickItem}>
                                <div className="item-entity">
                                    <div className="price"><span>¥ </span>{formatMoney(item.amount)}</div>
                                    {
                                        item.type == 'customVip' ? 
                                        <div className="time">{item.chargeMonths}个月</div>:
                                        <div className="time">{item.chargeMonths}天试用</div>
                                    }
                                </div>
                            </li> 
                        )
                    })
                }
            </ul>
        )
    }

    componentDidMount() {
        let listEl = this.listEl;
        let itemEl = listEl.querySelectorAll('li')[this.props.activeIndex];
        if (itemEl) {
            let scrollX = itemEl.offsetLeft - (listEl.offsetWidth - itemEl.offsetWidth) / 2;
            scrollToX(listEl, scrollX, 0);
        }
    }
}


function mapStateToProps(state) {
    return {
        liveInfo: state.live.liveInfo,
        shareQualify: state.live.shareQualify,
        power: state.live.power,
        vipChargePo: getVal(state,'vip.customVip.vipChargePo',null),
        ...state.vip,
    }
}

const mapDispatchToProps = {
    getCustomVipInfo,
    getCustomVipAuthList,
    getLiveInfo,
    liveFocus,
    getPower,
    getDescriptList,
    getCustomVipCourseList,
    getUserVipDetail,
    doPay,
    getVipInfo,
    initLiveShareQualify,
    fetchCouponListAction,
    bindShareKey,
    fetchCustomVipAuthCount,
    checkUser,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(VipDetailsCustom)