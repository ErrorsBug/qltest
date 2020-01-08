import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

// components
import CButtons from './c-buttons'
import BButtons from './b-buttons'
import OperationDialog from './operation-dialog'
import BottomDialog from 'components/dialog/bottom-dialog'
import PaymentDetailDialog from '../payment-detaiil-dialog';
import { Confirm } from 'components/dialog'

// utils
import { getVal, locationTo, validLegal, getCookie } from 'components/util';

// actions
import { doPay, subAterSign, } from 'common_actions/common'
import { 
    getCoralQRcode,
} from 'common_actions/coral'
import { enterEncrypt } from '../../../../../actions/topic-intro';
import {
	getQrCode,
} from '../../../../../actions/common';

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

        password: '',

        passwordVisibility: false,
    }

    componentDidMount() {
        setTimeout(this.initAutoPay, 1500)
    }

    onBuyTopic() {
        this.paymentDialog.show('topic');
    }

    onBuyChannel() {
        if (!this.props.promptDuplicateBuy()) {
            return false;
        }
        this.paymentDialog.show('channel');
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
        locationTo(`/topic/details?topicId=${this.props.topicId}&sourceNo=${this.props.sourceNo || ''}&fromOld=${this.props.fromOld || ''}`)
    }

    onPasswordInputClick() {
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
                /**
                 * 报名成功后引导关注千聊
                 * 1、首先判断是否为白名单，是白名单的直接不走后面的流程（即返回false，原来支付或报名成功后怎么做就怎么做）。
                 * 2、不是白名单的去查找是否有配置，没配置的判断是否关注千聊，以及是否是专业版，两个条件有一个是的话直接返回（即返回false，原来支付或报名成功后怎么做就怎么做），不走后面流程，有一个条件不是的话直接引导关注千聊。
                 * 3、有配置的话判断配置的公众号是否已经关注，全都关注的话不走后面流程（即返回false，原来支付或报名成功后怎么做就怎么做），有未关注的直接引导关注当前第一个未关注的配置公众号。
                 * 4、珊瑚来源的支付成功后，判断是否关注珊瑚公众号，没关注则返回珊瑚公众号二维码
                 */
                let qrUrl = '';
                const officialKey = getVal(this.context.router, 'location.query.officialKey', '');
                const source = getVal(this.context.router, 'location.query.source', '');
                const tracePage = sessionStorage.getItem('trace_page');
                if(officialKey||source=="coral"|| tracePage ==='coral'){
                    qrUrl = await getCoralQRcode({
                        channel:'subAfterSignCoral',
                        liveId: this.props.topicInfo.liveId,
                        channelId: this.props.channelId,
                        topicId: this.props.topicId,
                    });
                }else{
                    qrUrl = await subAterSign('subAfterSign',this.props.liveId, {channelId: this.props.channelId || '', topicId: this.props.topicId})
                }
                if(qrUrl){
                    locationTo(`/wechat/page/new-finish-pay?liveId=${this.props.liveId}&payFree=${this.props.topicInfo.type === 'charge' ? 'N' : 'Y'}&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}`)
                }else{
                    locationTo(`/topic/details?topicId=${this.props.topicId}`)
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 支付成功回调
    async payCallBack() {
        /**
         * 支付报名成功后引导关注千聊
         * 1、首先判断是否为白名单，是白名单的直接不走后面的流程（即返回false，原来支付或报名成功后怎么做就怎么做）。
         * 2、不是白名单的去查找是否有配置，没配置的判断是否关注千聊，以及是否是专业版，两个条件有一个是的话直接返回（即返回false，原来支付或报名成功后怎么做就怎么做），不走后面流程，有一个条件不是的话直接引导关注千聊。
         * 3、有配置的话判断配置的公众号是否已经关注，全都关注的话不走后面流程（即返回false，原来支付或报名成功后怎么做就怎么做），有未关注的直接引导关注当前第一个未关注的配置公众号。
         * 4、珊瑚来源的支付成功后，判断是否关注珊瑚公众号，没关注则返回珊瑚公众号二维码
         */
        let qrUrl = '';
        const officialKey = getVal(this.context.router, 'location.query.officialKey', '');
        const source = getVal(this.context.router, 'location.query.source', '');
        const tracePage = sessionStorage.getItem('trace_page');
        if(officialKey||source=="coral"|| tracePage ==='coral'){
            qrUrl = await getCoralQRcode({
                channel:'subAfterSignCoral',
                liveId: this.props.topicInfo.liveId,
                channelId: this.props.channelId,
                topicId: this.props.topicId,
            });
        }else{
            qrUrl = await subAterSign('subAfterSign',this.props.liveId, {channelId: this.props.channelId || '', topicId: this.props.topicId})
        }

        
		const {
			isNeedCollect
		} = this.props
		// 如果没填过表且不是跳过填表状态 则需要填表 表单后置
		if (isNeedCollect && isNeedCollect.isWrite == 'N' && isNeedCollect.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != isNeedCollect.id) {
            let paytype = type == 'channel' ?
					'channel&channelId=' + this.props.channelId
					:
					this.props.channelId ?
						'topic-channel&channelId=' + this.props.channelId + '&topicId=' + this.props.topicId
						:
						'topic&topicId=' + this.props.topicId;
			locationTo(`/wechat/page/live-studio/service-form/${this.props.liveId}?configId=${isNeedCollect.id}&scene=${isNeedCollect.scene}&type=${paytype}&auth=Y${qrUrl ? '&qrUrl=' + encodeURIComponent(qrUrl.qrUrl) : ''}`);
		} else {
            if(qrUrl){
                locationTo(`/wechat/page/new-finish-pay?liveId=${this.props.liveId}&payFree=${this.props.topicInfo.type === 'charge' ? 'N' : 'Y'}&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}`)
            }else{
                locationTo(window.location.href);
            }
        }
    }

    async doPay(type) {

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
            liveId: this.props.liveId,
            topicId: this.props.topicId,
            total_fee: 0,
            ch,
            shareKey,
            officialKey: officialKey ? officialKey: (source=="coral"||(sessionStorage.getItem('trace_page')||'')=='coral'? this.props.userId:""),
            /**是否上一个页面来着微信活动页面Y=是N=不是 */
            isFromWechatCouponPage: this.props.isFromWechatCouponPage,
            /******/
            callback:this.payCallBack
        };

        let couponData;
        if (type === 'topic') {
            couponData = getVal(this.props, 'curTopicCoupon', {});

            payOptions.type = 'COURSE_FEE';
            payOptions.onPayFree = (res) => {
                window._qla && window._qla('event', {
					category: "jointopic",
					action:"success",
					business_id: this.props.topicId,
					business_type: 'topic',
					business_pay_type: 'COURSE_FEE',
					trace_page: sessionStorage.getItem('trace_page') || ''
				});

				locationTo(window.location.href);
            };
        } else {
            couponData = getVal(this.props, 'curChannelCoupon', {});

            payOptions.type = 'CHANNEL';
            payOptions.chargeConfigId = getVal(this.props, 'curChargeConfig.id', '');
            payOptions.onPayFree = (res) => {
                window._qla && _qla('event', {
                    category: 'joinchannel',
                    action:'success',
                    business_id: this.props.channelId,
                    business_type: 'channel',
                    business_pay_type: 'CHANNEL',
                    trace_page: sessionStorage.getItem('trace_page') || '',
                });

                locationTo(window.location.href);
            };
        }

        // 优惠信息
        payOptions.couponType = couponData.couponType;
        payOptions.couponId = couponData.couponId;

        payOptions.channelNo = this.props.channelNo;

        this.paymentDialog.hide();
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
        // 已经填过学员采集表单 或者地址有autopay
        if (sessionStorage.getItem("saveCollect") == this.props.liveId|| (autopay == 'Y' && !this.props.power.allowMGTopic)) {
            
            if (this.isTopicOfChannel && this.props.isSingleBuy != 'Y' ) {
                this.onBuyChannel();
            } else if (this.props.topicType == 'public') {
                this.props.authTopic()
            }else{
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

    render() {
        return [
            this.isClientB ? 
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
                    chargeConfigs={ this.props.chargeConfigs }
                    channelId={this.props.channelId}
                    topicInfo={this.props.topicInfo}
                    isOpenMemberBuy={this.props.isMember && this.props.isMemberPrice}
                />
            ,

            // 操作弹框
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
                    pushTopic = {this.props.pushTopic}
                    liveId = { this.props.topicInfo.liveId }
                />
            </BottomDialog>,

            // 付款详情弹框
            <PaymentDetailDialog 
                key='payment-detail-dialog'
                doPay={ this.doPay }
                ref={ dom => dom && (this.paymentDialog = dom.getWrappedInstance()) }
            />,

            // 输入密码弹框
            <Confirm
                key='password-dialog'
                ref={ dom => this.passwordDialog = dom }
                title='请输入课程密码'
                close={true}
                buttons="confirm"
                onBtnClick={ this.confirmPassword }
            >
                <main className="password-dialog">
                    <div className="password-input-wrap">
                        <input type={this.state.passwordVisibility ? 'text' : 'password'} className='password-input' placeholder='请输入密码' value={ this.state.password } onChange={ this.onPaswordInput } />
                        {
                            this.state.password && this.state.password.length ?
                            <i className="icon_cancel" onClick={this.onClickClearPassword}></i> : false
                        }
                        {
                            this.state.passwordVisibility ? 
                            <i className="icon_lit_eye" onClick={this.onClickPasswordVisibility}></i> :
                            <i className="icon_eye_off" onClick={this.onClickPasswordVisibility}></i>
                        }
                    </div>
                </main>
            </Confirm>
        ]
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
        chargeConfigs: getVal(state, 'topicIntro.channelInfo.chargeConfigs', []),
        isRelayChannel: getVal(state, 'topicIntro.topicInfo.isRelayChannel'),
        isSubscribe:getVal(state, 'topicIntro.isSubscribe',{}),
		//会员信息
		isMember: getVal(state, 'memberInfo.isMember') === 'Y',
		isMemberPrice: getVal(state, 'topicIntro.isMemberPrice') === 'Y',
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
