import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ConfirmDialog from 'components/dialog/confirm';
import BottomDialog from 'components/dialog/bottom-dialog';
import { formatMoney, locationTo } from 'components/util';
import { api } from 'common_actions/common';

class VipGift extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 赠礼数量
            giftCount: 1,
            // 展示赠礼底部弹窗
            showVipGiftDialog: false,
            // 选中的vip收费类型
            chargeSelected: props.chargeConfig[0] || {},
        }
        this.data = {
            integerRegExp: /^\d*?$/,
        }
    }

    // 点击赠礼
    clickGift = () => {
        if (this.props.chargeConfig.length) {
            this.setState({
                showVipGiftDialog: true
            });
        } else {
            this.refs['confirm-dialog'].show();
        }
    }

    // 隐藏无可用赠礼确认框
    hideConfirmDialog = () => {
        this.refs['confirm-dialog'].hide();
    }

    // 输入赠礼数量
    inputGiftCount = (event) => {
        const value = event.target.value.trim();
        if (!value || this.data.integerRegExp.test(value)) {
            this.setState({
                giftCount: +value
            });
        }
    }

    // 递减赠礼数量
    decreaseGiftCount = () => {
        const { giftCount } = this.state;
        if (giftCount > 1) {
            this.setState({
                giftCount: giftCount - 1
            })
        }
    }

    // 递增赠礼数量
    increaseGiftCount = () => {
        const { giftCount } = this.state;
        if (giftCount < 999) {
            this.setState({
                giftCount: giftCount + 1
            })
        }
    }

    // 选择VIP收费方式
    selectCharge = (event) => {
        const index = +event.currentTarget.dataset.index;
        const { chargeConfig } = this.props;
        const { chargeSelected } = this.state;
        if (chargeConfig[index].id != chargeSelected.id) {
            this.setState({
                chargeSelected: chargeConfig[index]
            });   
        }
    }

    // 支付赠礼
    pay = () => {
        const { doPay, liveId } = this.props;
        const { chargeSelected, giftCount } = this.state;
        if (giftCount < 1 || giftCount > 999) {
            window.toast('赠送数量范围为1-999');
            return false;
        }
        const params = {
            liveId: liveId,
            type: 'VIP_GIFT',
            chargeConfigId: chargeSelected.id,
            giftCount: giftCount,
            ifboth: 'Y',
            source: 'web',
            total_fee: giftCount * formatMoney(chargeSelected.amount),
            callback: async (orderId) => {
                const res = await api({
                    url: '/api/wechat/getGiftId',
                    body: { orderId },
                    method: 'GET'
                });
                if (res && res.state.code === 0) {
                    const giftId = res.data.orderGiftId;
                    locationTo(`/wechat/page/vip-gift-details?giftId=${giftId}`);
                }
            }
        };
        doPay(params);
    }

    render() {
        const { vipType, chargeConfig } = this.props;
        const { giftCount, showVipGiftDialog, chargeSelected } = this.state;
        return (
            <div>
                {/* 赠送赠礼按钮 */}
                <div className={classnames('gift-button flex flex-row flex-vcenter', { 'custom-vip-gift-button': vipType == 'custom' })} role="button" onClick={this.clickGift}><i></i><span>赠送好友</span></div>
                {/* 无可赠送会员提示弹窗 */}
                <ConfirmDialog
                    ref="confirm-dialog"
                    buttonTheme="line"
                    buttons="confirm"
                    title="暂无可赠送会员"
                    className="no-available-vip-dialog"
                    onBtnClick={this.hideConfirmDialog}
                >
                    <div className="dialog-text">仅按月付会员可赠送，试用会员不可赠送</div>
                </ConfirmDialog>
                {/* 赠送会员底部弹窗 */}
                <BottomDialog
                    show={showVipGiftDialog}
                    bghide={true}
                    onClose={() => { this.setState({ showVipGiftDialog: false }) }}
                    theme="empty"
                    className="vip-gift-dialog"
                >
                    <section className="dialog-header">
                        <div className="dialog-title">
                            { vipType == 'general' && '通用会员赠送'}
                            { vipType == 'custom' && '定制会员赠送'}
                        </div>
                        <div className="vip-gift-tip">赠礼将于90天后过期，过期未领取的会员将不退回</div>
                    </section>
                    <section className="vip-gift-list">
                        <div className="list-title"><strong>赠送类型</strong><span>（试用会员不可赠送）</span></div>
                        <div className="list-content flex flex-row">
                        {
                            chargeConfig.map((item, index) => {
                                return (
                                    <div className={classnames('list-item flex flex-col flex-hcenter flex-vcenter', { 'charge-selected': item.id == chargeSelected.id })} key={index} data-index={index} onClick={this.selectCharge}>
                                        <strong className="price"><i>￥</i><span>{formatMoney(item.amount)}</span></strong>
                                        <strong className="validity-duration">{item.chargeMonths}个月</strong>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </section>
                    <section className="flex flex-row flex-vcenter flex-space-between gift-count">
                        <div className="label">数量</div>
                        <div className="value flex flex-row flex-vcenter">
                            <span className="decrease" onClick={this.decreaseGiftCount}>-</span>
                            <input className="gift-count-field" value={giftCount} onChange={this.inputGiftCount} />
                            <span className="increase" onClick={this.increaseGiftCount}>+</span>
                        </div>
                    </section>
                    <section className="flex flex-row flex-vcenter flex-space-between gift-money">
                        <div className="label">合计</div>
                        <div className="value"><i>￥</i>{formatMoney(chargeSelected.amount * giftCount)}</div>
                    </section>
                    <div className="pay-gift-button" role="button" onClick={this.pay}>打包{giftCount}份赠礼</div>
                </BottomDialog>
            </div>
        )
    }
}

VipGift.propTypes = {
    // 会员类型
    vipType: PropTypes.oneOf(['general', 'custom']),
    // 会员收费类型
    chargeConfig: PropTypes.array,
    // 支付方法
    doPay: PropTypes.func,
    // 直播间id
    liveId: PropTypes.any,
}

VipGift.defaultProps = {
    chargeConfig: []
}

export default VipGift;