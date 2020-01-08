import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import { autobind, throttle } from 'core-decorators';
import LiveFollowInfo from 'components/live-follow-info';
import { BottomDialog } from 'components/dialog';
import CouponItem, { couponItemFilter } from 'components/coupon-item';
import OperateMenu from 'components/operate-menu';
import PushVipDialog from 'components/dialogs-colorful/push-dialogs/vip';
import FoldView from 'components/fold-view';

import { imgUrlFormat, getVal, formatMoney, locationTo, reloadPage } from 'components/util';
import { getGeneralVipInfo, checkUser } from '../../actions/vip';
import { getUserInfo, getDescriptList } from '../../actions/common';
import { doPay, subAterSign, bindShareKey } from 'common_actions/common';
import { getLiveInfo, liveFocus, getPower, initLiveShareQualify } from '../../actions/live';
import { fetchCouponListAction } from 'common_actions/coupon';
import { share } from 'components/wx-utils';
import { scrollToX } from 'components/scroll-box';
import { get } from 'lodash';

import VipGift from './vip-gift';
import Detect from "components/detect";



@autobind
class VipDetailGeneral extends Component {
    constructor(props) {
        super(props);

        this.state = {
            liveId: props.location.query.liveId,

            activeChargeIndex: 0,   // 当前价格配置
            originalPrice: 0,       // 初始价格（元）
            discountPrice: 0,       // 优惠了的价格
            finalPrice: 0,          // 最终价格

            descriptions: [],

            couponListAll: [],
            couponListAvailable: [],
            activeCouponIndex: -1,
            _activeCouponIndex: -1,

            isShowWinPaymentDetails: false,
            isShowWinCouponSelect: false,
            isShowWinPushVipDialog: false,

            isNeedFill: null,       // 购买会员前是否需要填写表单
            isShowPayCompnent: false, // 是否展示支付组件 用于优惠券的返回太慢 2s

            
        }
        this.data = {
            payStatus: '',
        }

    }

    async componentWillMount () {
        // 管理员信息
        await this.props.getPower(this.state.liveId);
    }

    async componentDidMount() {
        // 绑定分销关系
        if (this.props.location.query.lshareKey && this.props.location.query.lshareKey !== 'undefined') {
            await this.props.bindShareKey(this.state.liveId, this.props.location.query.lshareKey);
        }
        

        this.props.getGeneralVipInfo(this.state.liveId)
            .then(res => {
                if (res.status === 'error') {
                    return window.toast(res.message);
                }

                if (res.data.isOpenVip === 'N') {
                    window.toast('此直播间未开通通用会员卡服务');
                    return locationTo(`/wechat/page/live/${this.state.liveId}`)
                } 

                // 更新价格配置
                this.updateChargeIndex(0);

                // 已购vip的话加载个人信息
                res.data.isVip === 'Y' && this.props.getUserInfo();
                
                // 直播间信息
                this.props.getLiveInfo(this.state.liveId)
                    .then(() => {
                        // 优惠券
                        this.getCouponList()
                            .then(() => {
                                if (!this.state.isShowPayCompnent) {
                                    this.setState({
                                        isShowPayCompnent: true
                                    }) 
                                }
                                // 有优惠券，弹起付款详情
                                //this.state.couponListAvailable.length && res.data.isVip != 'Y' && this.showWinPaymentDetails()
                                this.state.couponListAvailable.length && res.data.isVip != 'Y';

	                            if(this.props.location.query.pullUpPay || this.props.location.query.autopay == 'Y'){
                                    this.props.location.query.autopay == 'Y' && window.history.replaceState(null, null, location.pathname + location.search.replace('&autopay=Y', ''))
		                            this.showWinPaymentDetails();
	                            }
                            })
                        
                        // 分销资格
                        this.props.initLiveShareQualify(this.state.liveId)
                            .then(() => {
                                // 分享文案
                                this.initShare();
                            })
                    })

                // 通用会员介绍
                this.getDescription();
            })

        this.setTimeShowPayComponent() // 设置两秒后才开

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
    getCollectionInfo = async () => {
        return this.props.checkUser({
            liveId: this.state.liveId,
            businessType: 'vip',
            businessId: this.state.liveId
        }).then(config => {
            this.setState({
                isNeedFill: config
            })
        }).catch(err => {
            console.error(err);
            window.toast('获取学员验证信息失败');
        })
    }

    getDescription() {
        return this.props.getDescriptList(this.state.liveId, 'liveVipDesc')
            .then(res => {
                if (res.state.code) throw Error(res.state.msg);
                this.setState({
                    descriptions: res.data.descriptions.liveVipDesc || [],
                })
                
            }).catch(err => {
                console.error(err);
                window.toast('获取vip介绍失败');
            })
    }

    getCouponList() {
        return this.props.fetchCouponListAction({
            businessId:this.state.liveId,
            liveId:this.state.liveId,
            businessType:'global_vip',
        })
            .then(res => {
                if (res.state.code) throw Error(res.state.msg);
                let couponList = res.data.couponList;

                // 处理coupon数据
                couponList.forEach(item => couponItemFilter(item, {
                    liveName: this.props.liveInfo.entity.name
                }))

                // 价格排序
                couponList.sort((l, r) => r.money - l.money)

                // 类型排序，优先vip券再live券
                couponList.sort((l, r) => r.money != l.money ? 0 : (l.couponType === 'vip' && r.couponType === 'live') ? -1 : 1)

                this.setState({
                    couponListAll: couponList
                })
                
                this.updateChargeIndex();
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

        if (this.props.generalVip.data.vipChargeconfig.length == 0) return

        let activeCharge = this.props.generalVip.data.vipChargeconfig[index],
            originalPrice = formatMoney(activeCharge.amount);

        // 可用优惠券过滤并排序
        let couponListAvailable = this.state.couponListAll
            .filter(item => !(item.minMoney > originalPrice));
        
        // 寻找大于等于原价的最小优惠
        let activeCouponIndex = -1;
        if (couponListAvailable.length) {
            activeCouponIndex = 0;
            for (let i = 1; i < couponListAvailable.length; i++) {
                if (couponListAvailable[i].money >= originalPrice) {
                    if (couponListAvailable[i].money < couponListAvailable[i - 1].money) {
                        activeCouponIndex = i;
                        break;
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
            let activeCharge = this.props.generalVip.data.vipChargeconfig[this.state.activeChargeIndex],
                originalPrice = formatMoney(activeCharge.amount),
                activeCoupon = this.state.couponListAvailable[this.state.activeCouponIndex],
                discountPrice = activeCoupon && (activeCoupon.money > originalPrice ? originalPrice : activeCoupon.money) || 0,
                finalPrice = Math.round((originalPrice - discountPrice) * 100) / 100;

            this.setState({
                originalPrice,
                discountPrice,
                finalPrice,
            })
        })
    }

    initShare = () => {
        let wxqltitle = `开通 ${this.props.liveInfo.entity.name} VIP`;
        let descript = this.props.liveInfo.entity.introduce;
        // let descript = this.state.descriptions.filter(item => item.type === 'text').map(item => item.content).join('\u000d\u000a');
        let wxqlimgurl = this.props.liveInfo.entity.logo;
        let friendstr = wxqltitle;
        let shareUrl = window.location.href;

        // 有登录才初始化更多信息
        if (this.props.shareQualify && this.props.shareQualify.shareKey && this.props.shareQualify.status == 'Y') {
            wxqltitle = "我推荐-" + wxqltitle;
            friendstr = "我推荐-" + friendstr.replace("欢迎", "");
            shareUrl = shareUrl + "&lshareKey=" + this.props.shareQualify.shareKey;
        }

        share({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            timelineDesc: friendstr,
            imgUrl: wxqlimgurl,
            shareUrl: shareUrl,
        });
    }

    onClickFollowLive = () => {
        this.props.liveFocus(this.props.liveInfo.isFollow ? 'N' : 'Y', this.state.liveId)
    }

    onClickCouponCode =() => {
        location.href = `/wechat/page/coupon-code/exchange/global-vip/${this.state.liveId}`
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
            window.location.href = '/wechat/page/live-studio/service-form/' + this.state.liveId + `?configId=${isNeedFill.id}&scene=${isNeedFill.scene}&type=vip&vipId=${this.state.liveId}&auth=${this.state.finalPrice == 0 ? 'Y' : 'N'}`;
            return;
        }

        let params = {
            type: 'LIVEVIP',
            liveId: this.state.liveId,
            chargeConfigId: this.props.generalVip.data.vipChargeconfig[this.state.activeChargeIndex].id,
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
        }

        let activeCoupon = this.state.couponListAvailable[this.state.activeCouponIndex];
        if (activeCoupon) {
            params.couponId = activeCoupon.couponId;
            params.couponType = activeCoupon.couponType;
        }

        this.props.doPay(params);
    }

    // 支付成功回调
    async payCallBack(payFree = 'N') {
        /**
         * 支付报名成功后引导关注千聊
         * 1、首先判断是否为白名单，是白名单的直接不走后面的流程（即返回false，原来支付或报名成功后怎么做就怎么做）。
         * 2、不是白名单的去查找是否有配置，没配置的判断是否关注千聊，以及是否是专业版，两个条件有一个是的话直接返回（即返回false，原来支付或报名成功后怎么做就怎么做），不走后面流程，有一个条件不是的话直接引导关注千聊。
         * 3、有配置的话判断配置的公众号是否已经关注，全都关注的话不走后面流程（即返回false，原来支付或报名成功后怎么做就怎么做），有未关注的直接引导关注当前第一个未关注的配置公众号。
         */

        let qrUrl = await subAterSign('subAfterSignVip',this.state.liveId)
        
        if (qrUrl) {
            qrUrl.channel = 'subAfterSignVip'
        }

        const {
            isNeedFill
        } = this.state

        // 如果没填过表且不是跳过填表状态 则需要填表 表单后置
        if (isNeedFill && isNeedFill.isWrite == 'N' && isNeedFill.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != isNeedFill.id) {
            locationTo('/wechat/page/live-studio/service-form/' + this.state.liveId + `?configId=${isNeedFill.id}&scene=${isNeedFill.scene}&type=vip&businessId=${this.state.liveId}&auth=${payFree}${qrUrl ? `&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}&qrChannel=${qrUrl.channel}` : ''}`)
        } else {
            if(qrUrl){
                locationTo(`/wechat/page/new-finish-pay?liveId=${this.state.liveId}&payFree=${payFree}&type=subAfterSignVip&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}&title=${encodeURIComponent(this.props.liveInfo.entity.name + '直播间通用会员')}&fromVip=Y`)
            }else{
                locationTo(window.location.href);
            }
        }
        
        this.data.payStatus = '';
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

    onSubmitCouponChange = () => {
        this.setState({
            isShowWinPaymentDetails: true,
            isShowWinCouponSelect: false,
            activeCouponIndex: this.state._activeCouponIndex
        })
        this.updatePrice();
    }

    onClickChargeItem = e => {
        this.updateChargeIndex(e.currentTarget.getAttribute('data-index'))
    }

    showWinPaymentDetails = e => {
        // 管理者不支持购买
        if (this.props.power.allowMGLive || get(this, 'props.generalVip.data.kickOutStatus', '') === 'Y') return;

        // 无可用优惠券时，直接下单
        if (!this.state.couponListAvailable.length) return this.onPay();

        this.setState({isShowWinPaymentDetails: true})
    }

    hideWinPaymentDetails = e => {
        this.setState({isShowWinPaymentDetails: false})
    }

    showWinCouponSelect = e => {
        this.setState({
            isShowWinPaymentDetails: false,
            isShowWinCouponSelect: true,
            _activeCouponIndex: this.state.activeCouponIndex
        })
    }

    hideWinCouponSelect = e => {
        this.setState({
            isShowWinPaymentDetails: true,
            isShowWinCouponSelect: false
        })
    }

    hideeWinPushVipDialog = e => {
        this.setState({isShowWinPushVipDialog: false})
    }

    onClickJoinList = e => {
        if (this.props.power.allowMGLive) {
            this.props.router.push(`/wechat/page/join-list/vip?id=${this.state.liveId}`)
        }
    }

    render() {
        let { generalVip, userInfo, liveInfo, power } = this.props;
        if (!generalVip.data || generalVip.data.isOpenVip === 'N') return false;
        generalVip = generalVip.data;
        let noTryChargeConfig = [];
        if (Array.isArray(generalVip.vipChargeconfig)) {
            noTryChargeConfig = generalVip.vipChargeconfig.filter((item) => {
                return item.type != 'tryout';
            });
        }
        return (
            <Page title="会员详情" className="p-live-vip-details">
                <div className="main">
                    <section>
                        <div className="banner" style={{backgroundImage: `url(${imgUrlFormat('https://img.qlchat.com/qlLive/liveCommon/vip-honour.png', '?x-oss-process=image/resize,w_750,h_468')})`}}></div>

                        {
                            generalVip.isVip === 'Y' &&
                            <div className="general-vip-expire">hi，{userInfo.user.name} 您的vip会员还有{Math.ceil((generalVip.expiryTime - Date.now()) / 86400000)}天到期</div>
                        }

                        <div className="main-charge-select">
                            <div className="title">选择包月</div>
                            <MainChargeSelectList
                                list={generalVip.vipChargeconfig}
                                activeIndex={this.state.activeChargeIndex}
                                onClickItem={this.onClickChargeItem}
                                isTryoutVip={generalVip.isTryoutVip}
                                />
                        </div>

                        <div className="member" onClick={this.onClickJoinList}>
                            <div className="member-count">
                                <i className="icon-user"></i>
                                {generalVip.vipCount}人开通
                            </div>
                            <div className="avatar-list">
                                {
                                    generalVip.vipHeadImage.reduce((prev, curr) => {
                                        if (!prev.find(item => item == curr)) {
                                            prev.push(curr);
                                        }
                                        return prev;
                                    },[]).slice(0, 5).map((item, index) => {
                                        return <div className="avatar-item" key={index} style={{backgroundImage: `url(${imgUrlFormat(item.headImgUrl , '?x-oss-process=image/resize,w_54,h_54')})`}}></div>
                                    })
                                }
                            </div>
                        </div>
                    </section>
                        
                    <section>
                        <LiveFollowInfo
                            liveInfo={liveInfo}
                            isAdmin={power.allowMGLive}
                            onClickFollow={this.onClickFollowLive} />
                    </section>
    
                    {
                        !!this.state.descriptions.length &&
                        <section>
                            <FoldView>
                                <div className="intro-wrap">
                                    <div className="intro-wrap-title">简介</div>
                                    {
                                        this.state.descriptions.map((item, index) => {
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
                            </FoldView>
                        </section>
                    }

                    <section>
                        <div className="intro-wrap">
                            <div className="intro-wrap-title">购买须知</div>
                            <ul>
                                <li>成功开通后，您可不限次数畅听本直播间各个系列课及话题（转播课除外）</li>
                                <li>只可有效期内畅听，过期需续费，请督促自己学习</li>
                                <li>通用会员用户可免费参与打卡训练营及新训练营，但不参与契约金分成</li>
                                <li>该课程为虚拟内容服务，购买成功后概不退款，敬请原谅</li>
                            </ul>
                        </div>
                    </section>
                    
                    {/* vip赠礼 */}
                    {
                        !power.allowMGLive &&
                        <VipGift vipType="general" chargeConfig={noTryChargeConfig} doPay={this.props.doPay} liveId={this.state.liveId} />
                    }
                </div>

                {
                    this.state.isShowPayCompnent && !power.allowMGLive && generalVip.kickOutStatus === 'N' ?
                    <footer>
                        <div className="footer-placeholder"></div>
                        <div className="footer-entity">
                            {
                                generalVip.isCouponOpen === 'Y' &&
                                <div className="btn-coupon-code" onClick={this.onClickCouponCode}>
                                    <div className="icon_label2"></div>
                                    优惠码
                                </div>
                            }
                            <div className="btn-open" onClick={this.showWinPaymentDetails}>
                                {
                                    generalVip.vipChargeconfig[this.state.activeChargeIndex].type == 'tryout' ? '试用会员' : generalVip.isVip === 'Y' ? '续费' : '开通会员'
                                }
                                {
                                    this.state.discountPrice > 0 && `（已优惠￥${this.state.discountPrice}元）`
                                }
                            </div>
                            
                        </div>
                    </footer> : null    
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
                                list={generalVip.vipChargeconfig}
                                activeIndex={this.state.activeChargeIndex}
                                onClickItem={this.onClickChargeItem}/>
                        </div>

                        <div style={{paddingBottom: 30}}>
                            <div className="cdb-line">
                                <div className="cdb-line-main">优惠</div>
                                <div className="cdb-line-desc" onClick={this.showWinCouponSelect}>
                                    {
                                        this.state.discountPrice > 0 ?
                                        `已使用优惠码抵扣￥${this.state.discountPrice}` : 
                                        '未使用优惠券'
                                    }
                                    <i className="icon_coupons_fill"></i>
                                    <i className="icon_enter"></i>
                                </div>
                            </div>
                            <div className="cdb-line">
                                <div className="cdb-line-main">还需支付</div>
                                <div className="cdb-line-desc">￥{this.state.finalPrice}</div>
                            </div>
                        </div>
                    </div>

                    <div className="btn-open" onClick={this.onPay}>支付 ￥{this.state.finalPrice}</div>
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
                

                {
                    power.allowMGLive && 
                    <OperateMenu
                        config={this.operateMenuConfig} />
                }

                
                {
                    power.allowMGLive && 
                    <PushVipDialog
                        liveId={this.state.liveId}
                        isShow={this.state.isShowWinPushVipDialog}
                        hide={this.hideeWinPushVipDialog} />
                }
            </Page>
        )
    }

    operateMenuConfig = [
        {
            name: '优惠码',
            src: require('./img/icon-coupon.svg'),
            style: {
                color: '#fbb25c'
            },
            onClick: () => {
                locationTo(`/wechat/page/coupon-code/list/global-vip/${this.state.liveId}`)
            }
        },
        {
            name: '设置',
            src: require('./img/icon-settings.svg'),
            onClick: () => {
                locationTo(`/wechat/page/live-vip-setting?liveId=${this.state.liveId}`)
            }
        },
        {
            name: '推送通知',
            src: require("./img/push-notify.svg"),
            onClick: () => {
                this.setState({
                    isShowWinPushVipDialog: true
                })
            }
        }
    ]
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
                                        item.type == 'live' ? 
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
        userInfo: getVal(state,'common.userInfo',null),
        liveInfo: state.live.liveInfo,
        power: state.live.power,
        generalVip: state.vip.generalVip,
        shareQualify: state.live.shareQualify,
    }
}

const mapDispatchToProps = {
    getGeneralVipInfo,
    getUserInfo,
    getLiveInfo,
    liveFocus,
    getPower,
    fetchCouponListAction,
    doPay,
    getDescriptList,
    bindShareKey,
    initLiveShareQualify,
    checkUser,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(VipDetailGeneral)