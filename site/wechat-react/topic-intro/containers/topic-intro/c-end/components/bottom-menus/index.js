import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

// components
import CButtons from './c-buttons'
import BButtons from './b-buttons'
import OperationDialog from './operation-dialog'
import BottomDialog from 'components/dialog/bottom-dialog'
import { Confirm } from 'components/dialog'

// utils
import { getVal, locationTo, validLegal, filterOrderChannel, formatMoney, isLogined } from 'components/util';
import openApp from 'components/open-app';
import { getUrlParams } from 'components/url-utils';

// actions
import { doPay, subAterSign, request, } from 'common_actions/common'
import { 
    getCoralQRcode,
} from 'common_actions/coral'
import { enterEncrypt } from '../../../../../actions/topic-intro';
import {
    getQrCode,
} from '../../../../../actions/common';

import PaymentDetailsDialog from '../../../../../components/payment-details-dialog';

@autobind
class BottomMenus extends Component {

    // 支付详情弹框
    paymentDialog = null;
    // 密码输入弹框
    passwordDialog = null;

    static contextTypes = {
        router: PropTypes.object
    }

    state = {
        operationDialog: false,
        isOpenPayDialog: false, // 付费二次确认框
        payBusinessType: '', // 付费课程类型

        password: '',

        passwordVisibility: false,
        // 展示底部支付按钮
        showBottom:false,
        
        activeChargeIndex: 0, // 当前选中的付费类型

        couponList: {
            topic: [],
            channel: []
        }
    }

    componentDidMount() {
        const initCouponPromise = this.initCouponList();
        
        // 自动支付须在优惠券列表返回后调起
        initCouponPromise.then(() => {
            console.log('优惠券列表ok')
            this.setState({
                showBottom:true
            })
            this.initAutoPay()
        })
    }

    onBuyTopic() {
        this.setState({
            payBusinessType: 'topic'
        })
        this.showPaymentDetailsDialog({
            payBusinessType: 'topic'
        })
    }

    onBuyChannel() {
        if (!this.props.promptDuplicateBuy()) {
            return false;
        }
        this.setState({
            payBusinessType: 'channel',
        })
        this.showPaymentDetailsDialog({
            payBusinessType: 'channel',
            payChargeType: this.props.chargeType
        })
    }

    async initCouponList () {
        // 未登录不请求优惠券
        if (!isLogined()) return
        const couponList = {}
        if (this.isTopicOfChannel) {
            couponList.channel = await this.props.fetchCouponList('channel', false)
            this.paymentDialog.autoSelectCoupon('', couponList.channel, 'channel')
            if (this.props.isSingleBuy === 'Y') {
                couponList.topic = await this.props.fetchCouponList('topic', false)
                this.paymentDialog.autoSelectCoupon('', couponList.topic, 'topic')
            }
        } else {
            couponList.topic = await this.props.fetchCouponList('topic', false)
            this.paymentDialog.autoSelectCoupon('', couponList.topic, 'topic')
        }
        this.setState({
            couponList
        })
    }

    async showPaymentDetailsDialog (option = {}) {
        await this.props.fetchCouponList(option.payBusinessType)

        const {
            couponLists
        } = this.props

        // 判断是否有可用优惠券
        let isHaveAvailableCoupon = false

        let chargeConfigId = ""
        let price = 0
        if (option.payBusinessType === 'channel') {
            const charge = this.props.chargeConfigs[0]
            price = (this.props.showDiscount ? charge.discount : charge.amount) * 100;
            chargeConfigId = charge.id
        } else {
            price = this.props.topicInfo.money || 0
        }

        let appCoupon;

		if (couponLists.length > 0) {
            let availableList = [];
            couponLists.filter(coupon => {
                if (!availableList.length && coupon.couponType === 'app' && !appCoupon) appCoupon = coupon;

                if (coupon.minMoney <= price
                && (!coupon.overTime || this.props.sysTime < coupon.overTime )
                && coupon.couponType !== 'app') availableList.push(coupon);
            })
            if (availableList.length > 0) {
                isHaveAvailableCoupon = true
            }
        }

        /**
		 * 首张可用券是app券，弹提示不弹选券窗
		 * 其他情况，弹选券窗
		 * 
		 * 取消过提示则不再弹
		 */
        if (appCoupon) {
			if (!this._hasShowAppCouponGuide && await new Promise(resolve => {
				this._hasShowAppCouponGuide = true;

				typeof _qla !== 'undefined' && _qla('visible', {
					logs: JSON.stringify([
						{
							region: 'app-coupon-guide'
						}
					])
                });
                
				window.simpleDialog({
					msg: <div style={{wordBreak: 'break-word'}}>你有未使用的APP专享优惠券，可抵扣<span style={{color: '#f73657'}}>{formatMoney(appCoupon.money)}元</span>，请前往APP使用</div>,
					buttons: 'cancel-confirm',
					confirmText: '去APP使用',
					cancelText: '不用优惠券',
					onConfirm: () => {
                        openApp({
							h5: location.href,
                            ct: 'appzhuanshu',
                            ckey: 'CK1422980938180',
						});
                        resolve(true);
						typeof _qla !== 'undefined' && _qla('click', {
							region: 'app-coupon-guide-confirm'
						}); 
					},
					onCancel: () => {
						resolve(false);
						typeof _qla !== 'undefined' && _qla('click', {
							region: 'app-coupon-guide-cancel'
						}); 
					},
				})
			})) return;
		}
        
        // 有appCoupon却不使用，就原价买吧
        if (appCoupon) {
            this.doPay(chargeConfigId, '', option.payBusinessType)
            return;
        }
        
        // 是否打开二次确认弹框 （ 按时收费 | 有优惠券 | 会员折扣 | 特价 ）
        if (
            price > 0 && (
                (option.payBusinessType === 'channel' && option.payChargeType === 'flexible' && this.props.chargeConfigs.length > 1) ||
                (this.props.isMember && this.props.isMemberPrice && this.props.tracePage !=="coral") || 
                this.props.showDiscount || isHaveAvailableCoupon
            )
        ) {
            this.setState({
                isOpenPayDialog: true,
                ...option
            })
            this.props.toggleOpenPayDialog(true)
        } else {
            this.doPay(chargeConfigId, '', option.payBusinessType)
        }
    }

    hidePaymentDetailsDialog (option = {}) {
        this.setState({
            isOpenPayDialog: false,
            ...option
        })
        this.props.toggleOpenPayDialog(false)
    }

    onBuyCheckInCamp(){
        locationTo(`/wechat/page/camp-detail?campId=${this.props.topicInfo.campId}`);
    }

    showOperationDialog() {
        this.setState({
            operationDialog: true
        });
    }

    hideOperationDialog() {
        this.setState({
            operationDialog: false
        });
    }

    gotoTopicDetail() {
        locationTo(`/topic/details?topicId=${this.props.topicId}`)
    }
    gotoGroupInfo() {
        // 拼课跳转到查看拼课界面
        let groupResult = this.props.groupResult
        if (groupResult.groupId) {
            locationTo(`/topic/channel-group?channelId=${this.props.channelId}&groupId=${groupResult.groupId}`)
        } else {
            window.toast('拼课链接出错，请稍后尝试')
        }
    }
    onPasswordInputClick() {
        const {
            isNeedCollect
        } = this.props
        // 解锁前判断是否需要采集信息，需要则跳转 表单前置
        if (isNeedCollect && isNeedCollect.isWrite == 'N' && isNeedCollect.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != isNeedCollect.id) {
            let paytype = this.props.channelId ?
						'topic-channel&channelId=' + this.props.channelId + '&topicId=' + this.props.topicId
						:
						'topic&topicId=' + this.props.topicId;

            locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${isNeedCollect.id}&scene=${isNeedCollect.scene}&type=${paytype}&auth=Y`)
            return false;
        }

        this.passwordDialog.show();
    }

    onPaswordInput(e) {
        let v = e.target.value;
        v = v.replace(/[^0-9a-zA-Z]/g, '')
        this.setState({
            password: v
        });
    }

    async confirmPassword(type) {
        if (type === 'cancel') {
            return;
        }
        
        const shareKey = getVal(this.context.router, 'location.query.shareKey', '');

        if (!validLegal("text", "密码", this.state.password)) {
            return false;
        }

        try {
            const result = await this.props.enterEncrypt({
                shareKey,
                password: this.state.password,
                topicId: this.props.topicId,
                channelNo: this.props.channelNo
            });

            window.toast(result.state.msg)

            if (result.state.code === 0) {
                this.props.onSuccessPayment({codeChannel:'subAfterSignB',type:'topic'});
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 支付成功回调
    async payCallBack(type, orderId) {
        this.props.onSuccessPayment({codeChannel:'subAfterSignA',type, orderId});
    }

    async doPay(chargeConfigId, amount, payBusinessType) {

        const type = payBusinessType || this.state.payBusinessType

        const {
            isNeedCollect
        } = this.props
        // 报名前判断是否需要采集信息，需要则跳转 表单前置
        if (isNeedCollect && isNeedCollect.isWrite == 'N' && isNeedCollect.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != isNeedCollect.id) {
            let paytype = type == 'channel' ?
					'channel&channelId=' + this.props.channelId
					:
					this.props.channelId ?
						'topic-channel&channelId=' + this.props.channelId + '&topicId=' + this.props.topicId
						:
						'topic&topicId=' + this.props.topicId;

            locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${isNeedCollect.id}&scene=${isNeedCollect.scene}&type=${paytype}&auth=Y`)
            return false;
        }


        if (type !== 'topic' && type !== 'channel') {
            console.error('doPay request params type with "topic" or "channel", but get ', type);
        }
        const ch = getVal(this.context.router, 'location.query.ch', '');
        const shareKey = getVal(this.context.router, 'location.query.shareKey', '');
        const officialKey = getVal(this.context.router, 'location.query.officialKey', '');
        const source = getVal(this.context.router, 'location.query.source', '');
        // 支付请求的参数
        const payOptions = {
            missionId: this.props.missionId,
            liveId: this.props.liveId,
            topicId: this.props.topicId,
            total_fee: amount || 0,
            ch,
            shareKey: !this.props.showBackTuitionBanner && shareKey || '',// 有拉人返学费的时候支付不允许带上分销的shareKey
            officialKey: officialKey ? officialKey: (source=="coral"||this.props.tracePage=='coral'? this.props.userId:""),
            redEnvelopeId: this.props.redEnvelopeId, // 课堂红包id
            /**是否上一个页面来着微信活动页面Y=是N=不是 */
            isFromWechatCouponPage: this.props.isFromWechatCouponPage,
            /******/
            callback: async(orderId) => {
                // 多传一个orderId，用于返学费跳转
                this.payCallBack(type, orderId);
            }
        };

        let couponData;
        if (type === 'topic') {
            couponData = getVal(this.props, 'curTopicCoupon', {});

            payOptions.type = 'COURSE_FEE';
            payOptions.onPayFree = async (res) => {
                window._qla && window._qla('event', {
					category: "jointopic",
					action:"success",
					business_id: this.props.topicId,
					business_type: 'topic',
					business_pay_type: 'COURSE_FEE',
					trace_page: sessionStorage.getItem('trace_page') || ''
                });
                
                this.props.onSuccessPayment({codeChannel:'subAfterSignA',type:'topic'});
            };
        } else {
            couponData = getVal(this.props, 'curChannelCoupon', {});

            payOptions.type = 'CHANNEL';
            payOptions.chargeConfigId = chargeConfigId
            payOptions.onPayFree = async (res) => {
                window._qla && _qla('event', {
                    category: 'joinchannel',
                    action:'success',
                    business_id: this.props.channelId,
                    business_type: 'channel',
                    business_pay_type: 'CHANNEL',
                    trace_page: sessionStorage.getItem('trace_page') || '',
                });

                this.props.onSuccessPayment({codeChannel:'subAfterSignA',type:'channel'});
            };
        }

        // 优惠信息
        // 过滤app券
        if (couponData.couponType !== 'app') {
            payOptions.couponType = couponData.couponType;
            payOptions.couponId = couponData.useRefId;
        }

        payOptions.channelNo = this.props.channelNo;
        
        if (this.props.isMember && this.props.isMemberPrice&&this.props.tracePage !=="coral") {
            payOptions.payType = 'MEMBER_COURSE'
        }

        // 平台分销且不属于珊瑚计划来源
        if (this.props.platformShareRate && getUrlParams('psKey') && getUrlParams('source') !== "coral" && !officialKey) {
            payOptions.psKey = getUrlParams('psKey');
        }
        if (this.props.platformShareRate && getUrlParams('source') !== "coral" && !officialKey) {
            payOptions.psCh = filterOrderChannel();
            
        }


        this.hidePaymentDetailsDialog();
        await this.props.doPay(payOptions);
    }


    // 是否是b端
    get isClientB() {
        return this.props.power && this.props.power.allowMGLive
    }

    // 是否是单节付费
    get isSingleBuy() {
        return (this.isTopicOfChannel && this.props.isSingleBuy) || 'N'
    }

    // 是否是系列课中的话题
    get isTopicOfChannel() {
        return !!this.props.channelId
    }

    // 自动调起支付或自动报名
    initAutoPay() {
        if (this.props.isAuthTopic) {
            return false;
        }

        const autopay = getVal(this.context.router, 'location.query.autopay', '');
        
        const {
            isNeedCollect
        } = this.props
        // 已经填过学员采集表单 或者地址有autopay
        if((isNeedCollect&&sessionStorage.getItem("saveCollect") == isNeedCollect.id)|| (autopay == 'Y' && !this.props.power.allowMGTopic)) {
			autopay == 'Y' && window.history.replaceState(null, null, location.pathname + location.search.replace('&autopay=Y', ''))
            
            if (this.isTopicOfChannel && this.props.isSingleBuy != 'Y' ) {
                this.onBuyChannel();
            } else if (this.props.topicType == 'public') {
                this.props.authTopic()
            } else if (this.props.topicType == 'encrypt') { // 加密话题
                this.onPasswordInputClick()
            } else{
                this.onBuyTopic();
            }
            
            sessionStorage.removeItem("saveCollect");

        }
        return false;

    }

    onClickPasswordVisibility = () => {
        this.setState({
            passwordVisibility: !this.state.passwordVisibility
        })
    }

    onClickClearPassword = () => {
        this.setState({
            password: ''
        })
    }

    onReady() {
        this.setState({
            showBottom:true
        })
    }

	toggleChargeIndex (activeChargeIndex) {
		this.setState({
			activeChargeIndex
		})
	}

    render() {
		const chargeInfo = this.props.chargeConfigs[this.state.activeChargeIndex];
        return (
            <Fragment>
                {
                    !this.state.showBottom ?
                        null
                    :this.isClientB ? 
                    <BButtons 
                        key='button-row'
                        onOperationClick={ this.showOperationDialog }
                        gotoTopicDetail={ this.gotoTopicDetail}
                        sourceChannelId={this.props.sourceChannelId}
                        isRelayChannel={this.props.isRelayChannel}
                        isOrNotListen={this.props.isOrNotListen}
                        authStatus={this.props.authStatus}
                    />
                    :
                    <CButtons 
                        key='button-row'
                        isUnHome={ this.props.isUnHome }
                        liveId={ this.props.liveId }
                        isSingleBuy={ this.isSingleBuy }
                        isTopicOfChannel={ this.isTopicOfChannel }
                        isTopicOfCamp={!!this.props.topicInfo.campId}
                        isAuditionOpen={ this.props.topicInfo.isAuditionOpen }
                        onConsultClick={ this.props.onConsultClick }
                        onBuyTopic={ this.onBuyTopic }
                        onBuyChannel={ this.onBuyChannel }
                        onBuyCheckInCamp={ this.onBuyCheckInCamp }
                        curChannelCoupon={ this.props.curChannelCoupon }
                        curTopicCoupon={ this.props.curTopicCoupon }
                        isAuthTopic={ this.props.isAuthTopic }
                        gotoTopicDetail={ this.gotoTopicDetail }
                        authTopic={ this.props.authTopic }
                        topicType={ this.props.topicType }
                        onPasswordInputClick={ this.onPasswordInputClick }
                        password={ this.state.password }
                        onScrollToTop={ this.props.onScrollToTop }
                        showGoToTop={ this.props.showGoToTop }
                        showVipIcon={ this.props.showVipIcon }
                        isLiveAdmin={ this.props.isLiveAdmin.isLiveAdmin }
                        chargeInfo={ chargeInfo }
                        isBooks={  this.props.isBooks }
                        joinUniversityBtn={ this.props.joinUniversityBtn }
                        isUniCourse={ this.props.isUniCourse }
                        isJoinUni={ this.props.isJoinUni }
                        isAnimate={ this.props.isAnimate }
                        channelId={this.props.channelId}
                        topicInfo={this.props.topicInfo}
                        channelInfo={this.props.channelInfo}
                        topicTaskCardAuth = {this.props.topicTaskCardAuth}
                        canInvite = {this.props.canInvite}
                        remaining = {this.props.remaining}
                        openInviteFriendsToListenDialog = {this.props.openInviteFriendsToListenDialog}
                        /** 任务邀请卡相关 **/
                        sign = {this.props.sign}
                        t = {this.props.t}
                        s = {this.props.s}
                        /*****************/
                        isOpenMemberBuy={this.props.isMember && this.props.isMemberPrice&&this.props.tracePage !=="coral"}
                        showDiscount={this.props.showDiscount}
                        groupResult = {this.props.groupResult}
                        gotoGroupInfo = {this.gotoGroupInfo}
                        /* 拉人返学费相关 */
						openBackTuitionDialog = {this.props.openBackTuitionDialog}
						showBackTuitionBanner = {this.props.showBackTuitionBanner}
						returnMoney = {this.props.returnMoney}
                        /***************/
                    />
                }
        
                {/* 操作弹框 */}
                <BottomDialog 
                    key='operation-dialog'
                    show={ this.state.operationDialog }
                    theme='empty'
                    onClose={ this.hideOperationDialog }
                >
                    <OperationDialog
                        topicId={ this.props.topicId }
                        topicInfo={ this.props.topicInfo }
                        hideOperationDialog={ this.hideOperationDialog }
                        showPushTopicDialog={ this.props.showPushTopicDialog }
                        liveId = {this.props.liveId}
                    />
                </BottomDialog>
                
				{/* 付费二次确认框 */}
                <PaymentDetailsDialog
                    ref={ref => this.paymentDialog = ref && ref.getWrappedInstance().getWrappedInstance()}
                    isShow={this.state.isOpenPayDialog}
                    businessType={this.state.payBusinessType}
					fromPage="topic"
					chargeType={this.props.chargeType}
					chargeConfigs={this.props.chargeConfigs}
                    curChannelCoupon={ this.props.curChannelCoupon }
                    curTopicCoupon={ this.props.curTopicCoupon }
                    topicInfo={this.props.topicInfo}
                    showDiscount={this.props.showDiscount}
                    couponLists={this.props.couponLists}
					showCouponList={ this.props.showCouponList }
					toggleChargeIndex={this.toggleChargeIndex}
					onClose={this.hidePaymentDetailsDialog}
					pay={this.doPay}
                    isOpenMemberBuy={this.props.isMember && this.props.isMemberPrice && this.props.tracePage !=="coral"}
					/>
    
                {/* 输入密码弹框 */}
                <Confirm
                    key='password-dialog'
                    ref={ dom => this.passwordDialog = dom }
                    title='请输入课程密码'
                    buttons="cancel-confirm"
                    onBtnClick={ this.confirmPassword }
                    confirmDisabled={!this.state.password}
                >
                    <main className="password-dialog-v2">
                        <div className="password-input-wrap">
                            <input type={this.state.passwordVisibility ? 'text' : 'password'} className='password-input' placeholder='请输入密码' value={ this.state.password } onChange={ this.onPaswordInput } />
                            {
                                this.state.password && this.state.password.length ?
                                <i className="icon_cross" onClick={this.onClickClearPassword}></i> : false
                            }
                            {
                                this.state.passwordVisibility ? 
                                <i className="icon_lit_eye" onClick={this.onClickPasswordVisibility}></i> :
                                <i className="icon_eye_off" onClick={this.onClickPasswordVisibility}></i>
                            }
                        </div>
                    </main>
                </Confirm>
            </Fragment>
        )
    }
}

function mapStateToProps (state) {
    return {
        topicId: getVal(state, 'topicIntro.topicId', ''),
        liveId: getVal(state, 'topicIntro.liveId', ''),
        topicInfo: getVal(state, 'topicIntro.topicInfo', {}),
        channelId: getVal(state, 'topicIntro.topicInfo.channelId', ''),
        topicName: getVal(state, 'topicIntro.topicInfo.topic'),
        channeName: getVal(state, 'topicIntro.topicInfo.channelName'),
        liveName: getVal(state, 'topicIntro.topicInfo.liveName'),
        power: getVal(state, 'topicIntro.power'),
        isSingleBuy: getVal(state, 'topicIntro.topicInfo.isSingleBuy', 'N'),
        isAuthTopic: getVal(state, 'topicIntro.isAuthTopic', false),
        topicType: getVal(state, 'topicIntro.topicInfo.type'),
        isLiveAdmin:getVal(state, 'topicIntro.isLiveAdmin',{}),
        curChannelCoupon: getVal(state, 'topicIntro.curChannelCoupon'),
        curTopicCoupon: getVal(state, 'topicIntro.curTopicCoupon'),
        curChargeConfig: getVal(state, 'topicIntro.curChargeConfig', {}),
        isNeedCollect: getVal(state, 'topicIntro.isNeedCollect'),
        channelInfo: getVal(state, 'topicIntro.channelInfo', {}),
        chargeType: getVal(state, 'topicIntro.channelInfo.channel.chargeType', ''),
        chargeConfigs: getVal(state, 'topicIntro.channelInfo.chargeConfigs', []),
        isRelayChannel: getVal(state, 'topicIntro.topicInfo.isRelayChannel'),
        isSubscribe:getVal(state, 'topicIntro.isSubscribe',{}),
		//会员信息
		isMember: getVal(state, 'memberInfo.isMember') === 'Y',
        isMemberPrice: getVal(state, 'topicIntro.isMemberPrice') === 'Y',
        platformShareRate: getVal(state,'common.platformShareRate',false),
        sysTime: state.common.sysTime,
    }
}

const mapActionToProps = {
    doPay,
    enterEncrypt,
    getQrCode,
}

export default connect(mapStateToProps, mapActionToProps, null, {
    withRef: true
})(BottomMenus); 
