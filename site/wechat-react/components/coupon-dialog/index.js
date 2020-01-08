import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { MiddleDialog } from 'components/dialog';
import CouponTip from './coupon-tip';
import CouponReceive from './coupon-receive';
import { getVal, locationTo } from '../util';
import { receiveCoupon, isBindCoupon, bindCoupon, getCouponInfo, showCouponQrcode } from 'common_actions/coupon';
import { isServiceWhiteLive, getOfficialLiveIds, getIsSubscribe, getQr, getFocusLiveId } from 'common_actions/common'

/**
 * 领取优惠券，系列课介绍页和话题介绍页进入页面的时候的优惠券弹框，只有url上有couponCode（单发）或者codeId（群发）才会触发弹框
 * 传优惠码或者此批次优惠券ID就可以判断出需不需要弹出领取优惠券弹框
 */
@autobind
class CouponDialog extends Component {

    state = {
        showDialog: false,
        // isBinded: 是否绑定过, (1)是则提示：你有已领取未使用的优惠码，确定要再次领取并替换吗？-> 点击确定, 调用绑定接口 (2)否, 直接调用绑定接口
        isBinded: false,
        // 优惠券是否过期
        isCouponOver: false,
        // 是否直播间白名单
        isWhiteLive: false,
        // 是否官方直播间
        isOfficialList: false,
        // 关注信息
        subscribeMap: [],
        // 弹出框样式，button or qrcode
        footerStyle: 'button',
    }

    data = {
        hadLoged: false,
        liveId: this.props.liveId,
        qlLiveId: '',
        // qlLiveId: '2000000648729685',
        // qlLiveId: '140000000000092',
    }

    async componentDidMount() {
        await this.initQlLive();

        this.autoReceiveCoupon();
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
    
    async autoReceiveCoupon() {
        if (!this.props.isAutoReceive) {
            return;
        }

        // 获取优惠券状态
        await this.verifyCoupon();
        // 自动领取
        this.autoReceive();
    }
    
    async verifyCoupon() {
        try {
            let receiveType = this.props.couponCode ? 'single' : 'batch';
            let code = this.props.couponCode || this.props.codeId;

            const bindResult = await isBindCoupon({
                receiveType,
                code,
            });

            const result = await receiveCoupon({
                businessType: this.props.businessType,
                businessId: this.props.businessId,
                receiveType,
                code,
            });

            let { isBinded,isValid } = getVal(bindResult, 'data',{});

            if (getVal(result, 'state.code') == 0) {
                let {
                    isBlack,
                    isMG,
                    isQl,
                    isVip,
                } = result.data;
    
                if (
                    isBlack == 'N' &&
                    isMG == 'N' &&
                    isVip == 'N' &&
                    isQl == 'N'
                ) {
                    this.setState({
                        isBinded: isBinded == 'Y',
                        isValid: isValid == 'Y',
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    /** 页面进来时需要判断是否可以自动领取 */
    autoReceive() {
        if (this.state.isValid && !this.state.isBinded) {
            this.doBindCoupon();
            return;
        }

        this.showDialog();
    }

    async doBindCoupon() {
        try {
            let receiveType = this.props.couponCode ? 'single' : 'batch';
            let code = this.props.couponCode || this.props.codeId;

            const result = await this.props.bindCoupon({
                businessType: this.props.businessType,
                businessId: this.props.businessId,
                receiveType,
                code,
            });

            if (getVal(result, 'state.code') == 0) {
                window.toast('领取成功');

                setTimeout(() => {
                    let url = window.location.href.replace(/(couponCode=[^&]*&?|codeId=[^&]*&*)/g, '');
                    if (url.indexOf('?') > -1) {
                        url += `&_=${Date.now()}`;
                    } else {
                        url += `?_=${Date.now()}`;
                    }
                    window.location.href = url + '&couponId=' + code;
                }, 1000);
            }
        } catch (error) {
            console.error(error);
        }
    }

    closeDialog() {
        this.setState({
            showDialog: false,
        });
    }

    showDialog() {
        this.setState({
            showDialog: true,
        });
    }

    /** 介绍的二维码点击 */
    async onIntroReceiveClick() {
        // 获取优惠券状态
        await this.verifyCoupon();
        // 获取优惠券基本信息，之后在显示优惠券信息的时候用得上
        this.initCouponInfo();

        this.showDialog();
    }

    async initIsServiceWhiteLive() {
        try {
            let [isWhiteLive, officialList, isSubscribe, showQr] = await Promise.all([
                this.props.isServiceWhiteLive(this.data.liveId),
                this.props.getOfficialLiveIds(),
                getIsSubscribe([
                    this.data.qlLiveId,
                    this.data.liveId
                ]),
                showCouponQrcode(),
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
                showQr: showQr.data,
            });
        } catch (error) {
            console.error(error);
        }
    }

    /** 获取当前优惠券的详细信息 */
    async initCouponInfo() {
        try {
            let receiveType = this.props.couponCode ? 'single' : 'batch';
            let code = this.props.couponCode || this.props.codeId;

            const result = await this.props.getCouponInfo({
                businessType: this.props.businessType,
                businessId: this.props.businessId,
                receiveType,
                code,
            });
            
            await this.initIsServiceWhiteLive();

            if (getVal(result, 'state.code') == 0) {
                

                this.setState({
                    money: getVal(result, 'data.CouponInfoDto.money'),
                    // footerStyle,
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    

    /**
     * 替换优惠券
     * 1.页面进来(isAutoReceive=true)，这种情况下的替换就是直接领取了优惠券
     * 2.介绍中点击了使用优惠券，这时弹出的替换点击了替换是需要弹出二维码的，这里的做法就是清掉当前的已领取状态，让用户看起来是未领取状态弹出的样式
     */
    onChangeCoupon() {
        if (!this.data.qlLiveId) {
            window.toast('请稍后再试');
            return;
        }

        let subscribeQl = this.state.subscribeMap[this.data.qlLiveId];
        let subscribeThird = this.state.subscribeMap[this.data.liveId];

        if (this.props.isAutoReceive) {
            this.doBindCoupon();
        } else {
            this.setState({
                isBinded: false,
            });
        }
    }

    closeAndRedirect = () => {
        this.closeDialog();
        let url = '';
        switch (this.props.businessType) {
            case 'topic':
                url = `/wechat/page/topic-intro?topicId=${this.props.businessId}`;
                break;
            case 'channel':
                url = `/live/channel/channelPage/${this.props.businessId}.htm`;
                break;
        }
        if (url) {
            setTimeout(() => {
                locationTo(url);
            }, 1000);
        }
    }

    render() {
        if (!this.state.showDialog) {
            return null;
        }

        return (
            <div className="show-coupon-dialog-container">
                <div className="bg" onClick={ this.closeDialog }></div>

                <main className="content">
                    {
                        this.state.isValid && this.state.isBinded &&
                            <CouponTip type='binded' onUseOld={ this.closeDialog } onChange={ this.onChangeCoupon } onClose={ this.closeDialog } />
                    }
                    {
                        !this.state.isValid &&
                            <CouponTip type={ 'over' } couponType={this.props.businessType} onUseOld={ this.closeDialog } onChange={ this.onChangeCoupon } onCloseAndRedirect={this.closeAndRedirect} onClose={this.closeDialog} />
                    }
                    {
                        this.state.isValid && !this.state.isBinded &&
                            <CouponReceive 
                                onClickUse={ this.doBindCoupon }
                                style={ this.state.footerStyle }
                                money={ this.state.money }
                                liveName={ this.props.liveName }
                                businessName={ this.props.businessName }
                            />
                    }
                </main>
            </div>
        );
    }
}

const ID = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
]);

CouponDialog.propTypes = {
    // 是否自动领取，页面进来的时候需要设置为自动领取
    isAutoReceive: PropTypes.bool,
    // 业务类型（topic, channel）
    businessType: PropTypes.string,
    // 对应的 id
    businessId: ID,
    // 业务名，话题名称或者系列课名称
    businessName: PropTypes.string,
    // 如果是单发就传优惠码
    couponCode: PropTypes.string,
    // 如果是群发就传此批次优惠券ID
    codeId: ID,
    // 直播间ID
    liveId: ID,
    // 直播间名称
    liveName: PropTypes.string,
    // 是否专业版
    isLiveAdmin: PropTypes.string,
};

function mapStateToProps(state) {
    return {

    }
}

const mapActionToProps = {
    isServiceWhiteLive,
    getOfficialLiveIds,
    bindCoupon,
    getCouponInfo,
}

export default connect(mapStateToProps, mapActionToProps, null, { withRef: true })(CouponDialog);