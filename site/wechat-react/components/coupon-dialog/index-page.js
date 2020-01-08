import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { MiddleDialog } from 'components/dialog';
import CouponTip from './coupon-tip';
import CouponReceive from './coupon-receive';
import { getVal } from '../util';
import { receiveCoupon, isBindCoupon, bindCoupon, getCouponInfo, showCouponQrcode } from 'common_actions/coupon';
import { isServiceWhiteLive, getOfficialLiveIds, getIsSubscribe, getQr, isLiveAdmin as getIsLiveAdmin, getFocusLiveId } from 'common_actions/common'
import { locationTo, getCookie } from 'components/util';

/**
 * 领取优惠券，领取优惠券页面的UI，逻辑跟介绍页弹框的逻辑差不多（本组件文件夹的index.js是弹框）
 * 传优惠码或者此批次优惠券ID就可以判断出需不需要弹出领取优惠券弹框
 */
@autobind
class CouponDialog extends Component {

    state = {
        // 是否绑定过同批次的优惠券
        isBinded: false,
        isUsed: false,
        // 优惠券是否过期
        isCouponOver: false,
        // 是否直播间白名单
        isWhiteLive: false,
        // 是否官方直播间
        isOfficialList: false,
        // 关注信息
        subscribeMap: [],
        // 弹出框样式，button or qrcode
        footerStyle: '',
        // 这就是二维码了
        qrcode: '',
        // 是否专业版
        isLiveAdmin: 'N',

        coupon: this.props.coupon,
        firstShow: false
    }

    get receiveType () {
        return this.props.couponCode ? 'single' : 'batch';
    }

    data = {
        liveId: this.props.liveId,
        qlLiveId: '2000000648729685',
        // qlLiveId: '140000000000092',
    }

    async componentDidMount() {
        await this.initQlLive();
        this.verifyCoupon();
        // this.initCouponInfo();
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            coupon: {
                ...nextProps.coupon,
                ...this.getCouponStatus(nextProps.coupon, this.state.isBinded, this.state.isUsed)
            }
        })
    }

    getCouponStatus (coupon, isBinded, isUsed) {
        if (this.receiveType == 'single') {
            return  {
                isBinded: isBinded,
                isBindout: !isBinded && (coupon.useStatus == 'bind'|| coupon.useStatus == 'used' ),
                isUsed: isUsed,
                isOverTime: coupon.overTime ? coupon.overTime < Date.now() : false
            }
        } else {
            return {
                isBinded: isBinded,
                isBindout: coupon.codeNum == coupon.useNum,
                isUsed: isUsed,
                isOverTime: coupon.overTime ? coupon.overTime < Date.now() : false 
            }
        }
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
    
    async verifyCoupon() {
        try {
            let receiveType = this.props.couponCode ? 'single' : 'batch';
            let code = this.props.couponCode || this.props.codeId;

            const bindResult = await isBindCoupon({
                receiveType,
                code,
            });
            const receiveResult = await receiveCoupon({
                businessType: this.props.businessType,
                businessId: this.props.businessId,
            });
            let { isBinded,isValid, isUsed } = getVal(bindResult, 'data',{});

            let coupon = this.state.coupon;
            this.setState({
                firstShow: true,
                coupon: {
                    ...this.state.coupon,
                    ...this.getCouponStatus(coupon, isBinded == 'Y', isUsed == 'Y')
                },
                isBinded: isBinded == 'Y',
                isUsed: isUsed == 'Y'
            })

            // if (getVal(receiveResult, 'state.code') == 0) {
            //     let {
            //         isBlack,
            //         isMG,
            //         isQl,
            //         isVip,
            //     } = receiveResult.data;

            //     console.log('各种状态--\n', receiveResult.data);
    
            //     if (
            //         isBlack == 'N' &&
            //         isMG == 'N' &&
            //         isVip == 'N' &&
            //         isQl == 'N'
            //     ) {
            //         this.setState({
            //             showDialog: true,
            //             isBinded: isBinded == 'Y',
            //             isValid: isValid == 'Y',
            //         });
            //     }
            // }
        } catch (error) {
            console.error(error);
        }
    }

    willReceiveCoupon() {
        let { coupon } = this.state;
        this.setState({
            coupon: {
                ...coupon,
                afterStatus: 'binding'
            }
        })
        this.doBindCoupon();
    }

    gotoBusinessPage() {
        switch (this.props.businessType) {
            case 'topic':
                window.location.href = '/wechat/page/topic-intro?topicId=' + this.props.businessId ;
                break;
            case 'channel':
            window.location.href = '/wechat/page/channel-intro?channelId=' + this.props.businessId;
                break;
            case 'camp':
                window.location.href = '/wechat/page/camp-detail?campId=' + this.props.businessId ;
                break;
        }
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

            let { coupon } = this.state;

            if (getVal(result, 'state.code') == 0) {
                this.setState({
                    coupon: {
                        ...coupon,
                        afterStatus: 'bindSuccess'
                    }
                })
            } else {
                if (result.state.msg.indexOf('其他人') > -1) {
                    this.setState({
                        coupon: {
                            ...coupon,
                            isBindout: true
                        }
                    })
                } else if (result.state.msg.indexOf('过期') > -1) {
                    this.setState({
                        coupon: {
                            ...coupon,
                            isOverTime: true
                        }
                    })
                }
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    onCloseDialog() {
        this.setState({
            showChangeDialog: false,
            showOverDialog: false,
        });
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
                isLiveAdmin: getVal(liveAdminRes, 'data.isLiveAdmin'),
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
                receiveType,
                code,
            });
            
            await this.initIsServiceWhiteLive();
            if (getVal(result, 'state.code') == 0) {
                let footerStyle = '';

                if (!this.state.showQr) {
                    footerStyle = 'button';
                } else {
                    if (
                        (this.state.isLiveAdmin === 'Y' && !this.state.isOfficialList && !this.state.subscribeMap[this.data.liveId].isBindThird)
                        ||
                        getVal(result, 'data.CouponInfoDto.spreadType') != 'qr'
                    ) {
                        footerStyle = 'button';
                    } else {
                        footerStyle = 'qrcode';
                        
                    }
                }
                
                this.setState({
                    money: getVal(result, 'data.CouponInfoDto.money'),
                    footerStyle,
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

   

    render() {
        if (this.state.firstShow) {
            return [
                <div className="show-coupon-dialog-page" key="show-coupon-dialog-page">
                    <main className="content">
                        <CouponReceive 
                            style={ this.state.footerStyle }
                            money={ this.state.money }
                            liveName={ this.props.liveName }
                            liveId={this.props.liveId}
                            businessName={ this.props.businessName }
                            businessId={this.props.businessId}
                            businessType={this.props.businessType}
                            onClickUse={ this.willReceiveCoupon }
                            avatar={this.props.avatar}
                            coupon={this.state.coupon}
                            shareKey={this.props.shareKey}
                        />
                    </main>
                </div>,
            ]
        } else {
            return null;
        }
    }
}

const ID = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
]);

CouponDialog.propTypes = {
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
    shareKey: PropTypes.string,
};

function mapStateToProps(state) {
    return {

    }
}

const mapActionToProps = {
    isServiceWhiteLive,
    getOfficialLiveIds,
    getQr,
    getIsLiveAdmin,
    bindCoupon,
    getCouponInfo,
}

export default connect(mapStateToProps, mapActionToProps)(CouponDialog);