import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { closeShare } from '../../../../components/wx-utils'
import { formatDate,accAdd } from '../../../../components/util'
import Page from '../../../../components/page'

import {
    fetchMyLiveEntity,
    createLiveroom,
    fetchCouponInfo,
} from '../../../actions/coupon'
import { fetchIsAdminFlag } from '../../../actions/live-studio'
import { doPay } from 'common_actions/common'
import { getQr } from '../../../actions/common'
import { liveGetSubscribeInfo}from '../../../actions/live'

@autobind
class StudioCouponOrder extends Component {

    state = {
        showPanel: 'order',
        showQrcode:false,
        qrcodeUrl: '',

        liveId: '',
        liveName: '',

        isliveAdmin: '',
        

        /* 该用户是否绑定了该批次优惠活动优惠码 Y:”绑定了” N:”没绑定” */
        isBindCode: false,
        /* 该用户绑定的优惠码的id 用于支付 */
        bindCodeId: '',
        /* 优惠码信息对象 */
        couponCodeEntity: {},
    }

    get charge() {
        return 1999
    }

    get realCharge() {
        return this.state.isBindCode === 'Y'
            ? accAdd(this.charge, - this.state.couponCodeEntity.discount)
            : this.charge
    }

    get title() {
        return this.state.showPanel === 'success' ? '支付成功' : '支付'
    }

    get couponId() {
        return this.props.location.query.couponId
    }

    componentDidMount() {
        closeShare()
        this.fetchMyLive()
    }

    async fetchMyLive() {
        const result = await this.props.fetchMyLiveEntity()
        if (result.data.entityPo) {
            const { name, id } = result.data.entityPo
            this.setState({
                liveId: id,
                liveName: name,
            },
            ()=>{
                this.fetchIsAdmin()
                this.fetchCoupon()
            })
        } else {
            /* 如果用户没有直播间，重定向回到优惠码介绍页创建默认直播间 */
            location.href = `/wechat/page/live-studio/coupon/preview/${this.couponId}`
        }
    }

    async fetchIsAdmin() {
        const result = await this.props.fetchIsAdminFlag({ liveId: this.state.liveId})
        if (result.state.code === 0) {
            const { isLiveAdmin, liveAdminOverDue, liveAdminStart } = result.data
            this.setState({ isLiveAdmin, liveAdminOverDue })
        }
    }

    async fetchCoupon() {
        const result = await this.props.fetchCouponInfo({
            couponId: this.couponId,
            liveId:this.state.liveId,
        })
        const { isBindCode, bindCodeId, couponCode } = result.data

        this.setState({ isBindCode, bindCodeId, couponCodeEntity: couponCode })
    }

    async checkSubscribe() {
        const result = await this.props.liveGetSubscribeInfo(this.state.liveId)
        let unSubscribe = result.subscribe === false 
        if (unSubscribe) {
            this.fetchQrcode()
        }
        this.setState({
            showPanel: 'success',
            showQrcode: unSubscribe,
        })
    }

    async fetchQrcode() {
        const result = await this.props.getQr({
            channel: 'liveAdminBuy',
            showQl: 'Y',
            liveId:this.state.liveId
        })    

        this.setState({qrcodeUrl:result.data.qrUrl})
    }

    order() {
        const doPayCallback = async () => {
            await this.fetchIsAdmin()
            this.setState({ showPanel: 'success' })
            this.checkSubscribe()
        }
        
        if (this.state.isLiveAdmin === 'Y') {
            window.toast('您已经是专业版用户，无需重复购买')
            return
        }

        this.props.doPay({
            type: 'LIVEADMIN',
            liveId: this.state.liveId,
            total_fee: this.charge - this.state.couponCodeEntity.discount,
            groupId: this.state.bindCodeId,
            callback: doPayCallback,
        });
    }

    render() {
        const {
            showPanel, qrcodeUrl,showQrcode,
            couponCode, isBindCode, couponCodeEntity,
            isliveAdmin, liveAdminOverDue, liveAdminStart ,
        } = this.state

        return (
            <Page title={this.title}>
                <div className='page-studio-coupon-order'>
                    {
                        showPanel === 'order' &&
                        <div className="order-container">

                            <div className="payment-infomation">
                                <div className="icon"></div>
                                <div className="charge">
                                    {
                                        couponCodeEntity.discount !== undefined &&
                                        <strong>￥{this.realCharge}</strong>
                                    }
                                    元/年
                                </div>
                                <div className="tips">您正在为千聊专业版支付年费</div>
                            </div>

                            <div className="details">
                                <h1>
                                    <span>明细</span>
                                </h1>
                                <ul className='description'>
                                    <li>
                                        <span className='title'>专业版原价:</span>
                                        <span className='desc'>{this.charge}元/年</span>
                                    </li>

                                    <li>
                                        <span className='title'>现场优惠券:</span>
                                        <span className='desc'>{isBindCode === 'Y' ? `抵扣${couponCodeEntity.discount}元`:'无优惠券'}</span>
                                    </li>

                                    <li>
                                        <span className='title'>生效直播间:</span>
                                        <span className='desc'>{this.state.liveName}</span>
                                    </li>
                                </ul>
                            </div>

                            <footer className='order' onClick={this.order}>
                                立即支付
                            </footer>
                        </div>
                    }

                    {
                        showPanel === 'success' &&
                        <ReactCSSTransitionGroup
                            transitionName="live-studio-animation-couponOrderSuccess"
                            transitionAppear={true}
                            transitionAppearTimeout={500}
                            transitionEnterTimeout={350}
                            transitionLeaveTimeout={350}    
                        >
                        <div className="success-container">
                            <section className="result">
                                <div className="mention">
                                    <h1>
                                        <span className="icon-success"></span>
                                        支付成功
                                    </h1>
                                    <p>恭喜您已成功开通专业版直播间</p>
                                </div>

                                <ul className="info">
                                    <li>
                                        <span className='label'>直播间:</span>
                                        <span className='content'>{this.state.liveName}</span>
                                    </li>

                                    <li>
                                        <span className='label'>有效期:</span>
                                        <span className='content'>
                                            {formatDate(liveAdminStart,'yyyy年MM月dd日')} 至 {formatDate(liveAdminOverDue, 'yyyy年MM月dd日')}
                                        </span>
                                    </li>
                                </ul>
                            </section>

                            {
                                showQrcode &&
                                <section className="guide">
                                    <div className="shop">
                                            
                                        <img
                                            className="qrcode"
                                            src={qrcodeUrl}
                                        />
                                
                                        <div className="forgive-hat"></div>
                                    </div>
                                
                                    <p className="tips">
                                        长按关注我们，马上查看您的知识店铺！
                                    </p>
                                </section>
                            }                                
                                    
                        </div>
                        </ReactCSSTransitionGroup>    
                    }

                </div>
            </Page>
        );
    }
}

StudioCouponOrder.propTypes = {

};

function mstp(state) {
    return {

    }
}

const matp = {
    fetchMyLiveEntity,
    createLiveroom,
    fetchCouponInfo,
    doPay,
    fetchIsAdminFlag,
    liveGetSubscribeInfo,
    getQr,
}

export default connect(mstp, matp)(StudioCouponOrder);