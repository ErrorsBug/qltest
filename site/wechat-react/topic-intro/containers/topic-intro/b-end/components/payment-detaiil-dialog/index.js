import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import BottomDialog from 'components/dialog/bottom-dialog'
import CouponItem from '../coupon-item'

import { myCouponList, updateCouponInfo, updateSelectedChargeConfig, fetchMediaCouponList } from '../../../../../actions/topic-intro'

// utils
import { getVal, locationTo, formatMoney } from 'components/util';


@autobind
class PaymentDetailDialog extends Component {

    state = {
        type: '', // topic | channel
        showDialog: false,
        showTab: '', // payment-detail: 付费详情tab | coupon-list: 优惠券列表tab
        activeCoupon: null, // 当前选中的优惠券，可以用来做是否有优惠券的判断
        activeChargeConfig: null,
    }

    componentDidMount() {
        if (this.props.userId) {
            this.fetchCouponList();
        }    
    }

    show(type) {
        // 免费话题报名
        if (type === 'topic' && this.props.topicCouponList.length === 0) {
            this.requestDoPay(type);
            return;
        }

        // 免费系列课购买
        if (type === 'channel' && this.props.chargeConfigs.length && this.props.chargeConfigs[0].amount === 0) {
            this.requestDoPay(type);
            return;
        }

        this.setState({
            showDialog: true,
            type,
            showTab: 'payment-detail',
            activeCoupon: null
        });

        this.initCouponInfo(type);
    }

    hide() {
        this.setState({
            showDialog: false,
            showTab: ''
        });
    }

    changeTab(tab) {
        this.setState({
            showTab: tab
        });
    }

    onItemClick(couponId, couponType, businessId) {
        let list, name, key;
        if (this.state.type === 'topic') {
            list = this.props.topicCouponList;
            key = 'topicCoupon';
        } else {
            list = this.props.channelCouponList;
            key = 'channelCoupon';
        }
        let target = list.find(item => item.couponId== couponId);
        let activeCoupon = null;

        if (this.state.activeCoupon != null && target.couponId == this.state.activeCoupon.couponId) {
            // 如果点击中了已经选中的优惠券，则取消选中状态，null的意思是已经是取消状态了，就进入选中状态的逻辑
            activeCoupon = null;
        } else {
            activeCoupon = target;
        }

        this.setState({ activeCoupon });
        
        // 更新全局的优惠券选中状态
        this.props.updateCouponInfo({
            [key]: activeCoupon || false
        });
    }

    initCouponInfo(type) {
        let curCoupon = null;

        if (type === 'topic') {
            curCoupon = this.props.curTopicCoupon;
        } else {
            curCoupon = this.props.curChannelCoupon;
        }

        this.setState({
            activeCoupon: curCoupon
        });
    }

    async fetchCouponList() {
        try {

            if (this.props.isRelayChannel == 'Y') {
                await this.props.myCouponList({
                    topicId: this.props.topicId,
                    liveId: this.props.liveId
                })
                // 获取转载系列课的优惠券列表
                await this.props.fetchMediaCouponList({
                    channelId: this.props.channelId,
                });
            } else {
                await this.props.myCouponList({
                    channelId: this.props.channelId,
                    topicId: this.props.topicId,
                    liveId: this.props.liveId
                })
            }
            
        } catch (error) {
            console.error(error);
        }

        // 初始化可用优惠券
        this.props.topicCouponList.length > 0 && this.autoSelectCoupon('topic');
        this.props.channelCouponList.length > 0 && this.autoSelectCoupon('channel');
    }

    confirmSelect() {
        this.setState({
            showTab: 'payment-detail'
        });
    }

    requestDoPay(type) {
        this.props.doPay(type || this.state.type);
    }

    
    onSelectChargeConfig(index) {
        let chargeConfig = this.props.chargeConfigs[index];
        this.props.updateSelectedChargeConfig({
            chargeConfig
        });

        this.autoSelectCoupon('channel',chargeConfig);

    }

    // 设置当前价格配置的最优优惠券
    autoSelectCoupon(type, chargeConfig) {
        
        let money, couponList, key, isRelayChannel;
        
        if (type === 'topic') {
            key = 'topicCoupon';
            money = formatMoney(this.props.topicMoney);
            couponList = this.props.topicCouponList;
        } else {
            key = 'channelCoupon';
            couponList = this.props.channelCouponList;
            isRelayChannel = this.props.channelInfo.isRelay === 'Y';
            if (chargeConfig) {
                // 如果是选中时触发
                money = chargeConfig.amount;
            }else if (this.props.chargeType === 'flexible') {
                // 按月收费，获取当前选中的chargeConfig
                money = getVal(this.props, 'curChargeConfig.amount', 0);
            } else {
                // 固定收费要区分各种优惠活动，然后决定拿哪个金额当当前价格
                let discountStatus = getVal(this.props, 'chargeConfigs.0.discountStatus');
                if (discountStatus === 'Y') {
                    // 特价优惠
                    money = getVal(this.props, 'chargeConfigs.0.discount', 0);
                } else {
                    money = getVal(this.props, 'chargeConfigs.0.amount', 0);
                }
            }
        }

        // 如果当前优惠券符合使用条件则不选择
        if (chargeConfig && this.props.curChannelCoupon &&( !this.props.curChannelCoupon.minMoney || this.props.curChannelCoupon.minMoney <= chargeConfig.amount) ) {
            return false;
        }

        if (!couponList || couponList.length < 1) {
            return false;
        }

        

        let activeCoupon = false;


        if (money == 0) {
            activeCoupon = false;
        }else if (isRelayChannel) {
            // 转载系列课默认使用金额最大的优惠券，后端接口返回的优惠券列表第一张金额最大
            activeCoupon = couponList[0];
        } else {
            // 从小到大排序
            couponList = [...couponList].sort((l, r) => {
                return l.money <= r.money ? -1  : 1;
            });


            for (let i in couponList) {
                let coupon = couponList[i];
                if (coupon.minMoney && coupon.minMoney > money) continue; // 过滤最低使用价格
                if (coupon.money >= money) {
                    // 选出第一张大于等于当前价格的
                    activeCoupon = coupon;
                    break;
                }
                activeCoupon = coupon;
            }
        }

        this.setState({ activeCoupon});
        // 更新全局的优惠券选中状态
        this.props.updateCouponInfo({
            [key]: activeCoupon || false
        });



    }

    render() {
        if (typeof (document) == 'undefined') {
            return false;
        }

        let list, name, money;

        if (this.state.type === 'topic') {
            name = this.props.topicName;
            money = formatMoney(this.props.topicMoney);

            // 过滤不符合条件的优惠券
            list = this.props.topicCouponList.filter((item) => {
                return !item.minMoney || (item.minMoney && item.minMoney <= money);
            });
        } else {
            
            name = this.props.channelName;
            
            if (this.props.chargeType === 'flexible') {
                // 按月收费，获取当前选中的chargeConfig
                money = getVal(this.props, 'curChargeConfig.amount', 0);
            } else {
                // 固定收费要区分各种优惠活动，然后决定拿哪个金额当当前价格
                let discountStatus = getVal(this.props, 'chargeConfigs.0.discountStatus');
                if (discountStatus === 'Y') {
                    // 特价优惠
                    money = getVal(this.props, 'chargeConfigs.0.discount', 0);
                } else {
                    money = getVal(this.props, 'chargeConfigs.0.amount', 0);
                }
            }

            // 过滤不符合条件的优惠券
            list = this.props.channelCouponList.filter((item) => {
                return !item.minMoney || (item.minMoney && item.minMoney <= money);
            });
        }

        let couponMoney = getVal(this.state.activeCoupon, 'money', 0);
        let curChargeConfigId = getVal(this.props, 'curChargeConfig.id', '');
        let diffMoney = (money - couponMoney) < 0 ? 0 : (money - couponMoney).toFixed(2);

        return createPortal(
            <BottomDialog
                show={ this.state.showDialog }
                theme='empty'
                onClose={ this.hide }
            >
                {
                    this.state.showTab === 'payment-detail' &&
                        <main className='payment-dialog'>
                            <header><i className="icon_delete close" onClick={ this.hide }></i>付款详情</header>
                            <main>
                                <section className="detail-row">
                                    <span className="row-label">
                                        {
                                            this.state.type === 'topic' ?
                                                '课程票价'
                                                :
                                                '系列课票价'
                                        }
                                    </span>
                                    {
                                        (this.state.type === 'topic' || this.props.chargeType !== 'flexible') &&
                                            <span className="row-content red-text">￥{ money }</span>
                                    }
                                    
                                </section>
                                {
                                    (this.props.chargeType === 'flexible' && this.state.type === 'channel')&&
                                        <section className='money-per-month'>
                                            {
                                                this.props.chargeConfigs.map((item, index) => (
                                                    <div key={`charge-config-${index}`} 
                                                        className={"month-item " + (curChargeConfigId == item.id ? 'active' : '')}
                                                        onClick={ this.onSelectChargeConfig.bind(this, index) }>
                                                        <span className='money'>{ item.amount }元</span>
                                                        <span className='month'>{ item.chargeMonths }个月会员</span>

                                                        <span className="check-box">
                                                            <i className="icon_checked"></i>
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </section>
                                }
                                <section className="detail-row">
                                    <span className="row-label">优惠券</span>
                                    <span className="row-content red-text" onClick={ () => list.length > 0 && this.changeTab('coupon-list') }>
                                        {
                                            // 如果有优惠券
                                            list.length > 0 ?
                                                getVal(this.state, 'activeCoupon.couponId', '') ?
                                                    // 如果有使用
                                                    [
                                                        `已使用优惠券抵扣￥${couponMoney}`,
                                                        <i key='coupon-icon' className="icon_coupon_2"></i>
                                                    ]
                                                    :
                                                    // 如果不使用
                                                    '暂不使用优惠券'
                                                :
                                                // 如果没有优惠券
                                                <span className='grey-text'>暂无优惠券</span>
                                        }
                                        <i className="icon_enter"></i>
                                    </span>
                                </section>

                                <section className="detail-row">
                                    <span className="row-label bolder">还需支付</span>
                                    <span className="row-content large-size">￥{ diffMoney }</span>
                                </section>
                            </main>
                            <footer className="detial-button" onClick={ this.requestDoPay.bind(null, '') }>还需支付￥{ diffMoney }</footer>
                        </main>
                }
                {
                    this.state.showTab === 'coupon-list' &&
                        <main className='payment-dialog'>
                            <header>
                                <i className="icon_back close" onClick={ () => this.changeTab('payment-detail') }></i>
                                选择优惠券
                                <span className='confirm-btn' onClick={ this.confirmSelect }>确认</span>
                            </header>
                            <main>
                                <ul className='coupon-list'>
                                    {
                                        list.map((item, index) => (
                                            <CouponItem
                                                key={`list-item-${index}`}
                                                onItemClick={ this.onItemClick }
                                                couponType={ this.state.type }
                                                name = {this.state.type === 'topic' ? this.props.topicName : this.props.channelName}
                                                liveName = {this.props.liveName}
                                                activeCouponId={ getVal(this.state, 'activeCoupon.couponId', '') }
                                                { ...item }
                                            />
                                        ))
                                    }
                                </ul>
                                
                            </main>
                        </main>
                }
            </BottomDialog>,
            document.getElementById('app')
        );
    }
}

function mapStateToProps (state) {
    return {
        userId: getVal(state, 'topicIntro.userId'),
        topicId: getVal(state, 'topicIntro.topicId', ''),
        liveId: getVal(state, 'topicIntro.liveId', ''),
        channelId: getVal(state, 'topicIntro.channelId', ''),
        topicName: getVal(state, 'topicIntro.topicInfo.topic'),
        channelName: getVal(state, 'topicIntro.topicInfo.channelName'),
        liveName: getVal(state, 'topicIntro.topicInfo.liveName'),
        topicMoney: getVal(state, 'topicIntro.topicInfo.money', 0),
        isRelayChannel: getVal(state, 'topicIntro.topicInfo.isRelayChannel','N'),

        channelInfo: getVal(state, 'topicIntro.channelInfo.channel',{}),
        chargeType: getVal(state, 'topicIntro.channelInfo.channel.chargeType'),
        chargeConfigs: getVal(state, 'topicIntro.channelInfo.chargeConfigs', []),
        curChargeConfig: getVal(state, 'topicIntro.curChargeConfig', {}),

        channelCouponList: getVal(state, 'topicIntro.channelCouponList', []),
        topicCouponList: getVal(state, 'topicIntro.topicCouponList', []),
        curChannelCoupon: getVal(state, 'topicIntro.curChannelCoupon'),
        curTopicCoupon: getVal(state, 'topicIntro.curTopicCoupon'),
    }
}

const mapActionToProps = {
    myCouponList,
    updateCouponInfo,
    updateSelectedChargeConfig,
    fetchMediaCouponList,
}

export default connect(mapStateToProps, mapActionToProps, null, {
    withRef: true
})(PaymentDetailDialog); 
