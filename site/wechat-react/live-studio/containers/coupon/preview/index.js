import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { closeShare } from '../../../../components/wx-utils'
import { formatDate } from '../../../../components/util'
import Page from '../../../../components/page'

import {
    fetchMyLiveEntity,
    createLiveroom,
    fetchCouponInfo,
    bindCouponCode,
} from '../../../actions/coupon'

import { fetchIsAdminFlag} from '../../../actions/live-studio'

@autobind
class StudioCoupon extends Component {

    state = {
        successModalVisible: false,
        inputModalVisible: false,
        couponCode: '',
        showPanel: '',

        liveId: '',
        liveName: '',

        isLiveAdmin: '',

        /* 该用户是否绑定了该批次优惠活动优惠码 Y:”绑定了” N:”没绑定” */
        isBindCode: false,
        /* 该用户绑定的优惠码的id 用于支付 */
        bindCodeId: '',
        /* 优惠码信息对象 */
        couponCodeEntity: {},
    }

    /* 页面标题 */
    get title() {
        if (this.showPanel === 'overtime') {
            return '优惠码已失效'
        }
        if (this.state.isBindCode === 'Y') {
            return '已领取优惠码'
        }
        return '领取优惠码'
    }

    get couponId() {
        return this.props.router.params.couponId
    }

    get couponCode() {
        return this.props.location.query.detail
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
            },this.fetchInfo)
        } else {
            /* 没有直播间怎么办？自己创一个呗 */
            const result = await this.props.createLiveroom()
            if (result.state.code===0){
                this.fetchMyLive()
            }
        }
    }

    async fetchInfo() {
        const [admin, coupon] = await Promise.all([
            this.props.fetchIsAdminFlag({ liveId: this.state.liveId }),
            this.props.fetchCouponInfo({ couponId: this.couponId, liveId: this.state.liveId })
        ])

        /* 如果已经过期 */
        if (coupon.state.code === 10001) {
            this.setState({ showPanel: 'overtime' })
            return
        }

        const isLiveAdmin = admin.data.isLiveAdmin
        const { isBindCode, bindCodeId, couponCode } = coupon.data
        const showPanel = couponCode.expiryTime > this.props.sysTime ? 'coupon' : 'overtime'

        this.setState({
            isLiveAdmin,
            isBindCode,
            bindCodeId,
            couponCodeEntity: couponCode,
            showPanel,
        })

        if (isBindCode === 'N' && this.couponCode && showPanel === 'coupon' && isLiveAdmin === 'N') {
            const bindResult = await this.bindCouponCode(this.couponCode)
        }
    }

    async bindCouponCode(code) {
        const { liveId } = this.state
        const result = await this.props.bindCouponCode({
            liveId,
            code,
            couponId: this.couponId,
        })

        if (result.state.code === 0) {
            this.setState({
                isBindCode: 'Y',
                inputModalVisible: false,
                successModalVisible: true,
            })
            setTimeout(()=> {
                this.hideSuccessModal()
                location.href = `/topic/live-studio-intro?liveId=${liveId}&couponId=${this.couponId}`
            }, 1500);
        } else {
            window.simpleDialog({
                msg: result.state.msg,
                buttons: 'confirm',
            })
        }
        return result
    }

    showSuccessModal() {
        this.setState({ successModalVisible: true })
    }

    hideSuccessModal() {
        this.setState({ successModalVisible: false })
    }

    showInputModal() {
        this.setState({ inputModalVisible: true })
    }

    hideInputModal() {
        this.setState({ inputModalVisible: false })
    }

    onCouponChange(e) {
        this.setState({ couponCode: e.target.value })
    }

    onRecieveClick() {
        this.showInputModal()
    }

    onConfirmCouponClick() {
        let code = this.state.couponCode.trim()
        if (!code) {
            window.toast('还没有输入优惠码')
            return
        }

        if (!/^\w+$/.test(code)) {
            window.toast('请输入正确的优惠码')
            return
        }

        this.bindCouponCode(code)
    }

    onOrderClick() {
        location.href = `/topic/live-studio-intro?liveId=${this.state.liveId}&couponId=${this.couponId}`
    }

    render() {
        const {
            successModalVisible, inputModalVisible, couponCode, showPanel,
            liveId, liveName,
            isBindCode, bindCodeId, couponCodeEntity,
        } = this.state

        return (
            <Page title={this.title}>
                <div className={classNames('page-studio-coupon', {
                    'coupon-wrap': showPanel === 'coupon',
                    'overtime-wrap': showPanel === 'overtime',
                })}>
                    {
                        showPanel === 'coupon' &&
                        <div className="coupon-container">
                            <div className="options">
                                <span className="tips">千聊专业版专属优惠</span>
                                <h1>{couponCodeEntity.discount}元抵扣券</h1>
                                {
                                    isBindCode === 'N' &&
                                    <button onClick={this.onRecieveClick}>立即领取</button>
                                }

                                {
                                    isBindCode === 'Y' &&
                                    <button onClick={this.onOrderClick}>马上使用</button>
                                }
                            </div>
                            <ul className="info">
                                <li>
                                    <span className='title'>适用直播间</span>
                                    <span className='desc'>{liveName}</span>
                                </li>

                                <li>
                                    <span className='title'>有效时间</span>
                                    <span className='desc'>{formatDate(couponCodeEntity.expiryTime,'yyyy-MM-dd')}前使用</span>
                                </li>

                                <li>
                                    <span className='title'>使用说明</span>
                                    <span className='desc'>购买专业版立减{couponCodeEntity.discount}元</span>
                                </li>
                            </ul>
                        </div>
                    }

                    {
                        showPanel === 'overtime' &&
                        <div className="overtime-container">
                            <div className="image"></div>
                            <p>活动结束了，你访问的链接已失效</p>
                        </div>
                    }

                    {
                        successModalVisible &&
                        
                        <div className="modal modal-success">
                            <div className="bg"></div>
                            <ReactCSSTransitionGroup
                                component={FirstChild}
                                transitionName="live-studio-animation-modalContent"
                                transitionAppear={true}
                                transitionAppearTimeout={500}
                                transitionEnterTimeout={350}
                                transitionLeaveTimeout={350}
                            >
                            <main className='content'>
                                <div className="icon"></div>
                                <div className="tips">领取成功</div>
                            </main>
                            </ReactCSSTransitionGroup>
                        </div>
                    }

                    {
                        inputModalVisible &&
                        <div className="modal modal-input">
                            <div className="bg" onClick={this.hideInputModal}></div>
                            <ReactCSSTransitionGroup
                                component={FirstChild}
                                transitionName="live-studio-animation-modalContent"
                                transitionAppear={true}
                                transitionAppearTimeout={500}
                                transitionEnterTimeout={350}
                                transitionLeaveTimeout={350}
                            >
                            <main className='content'>
                                <section className='input-area'>
                                    <label htmlFor="coupon">请输入你的优惠码</label>
                                    <input type="text" name="coupon" value={couponCode} onChange={this.onCouponChange} />
                                </section>
                                <footer onClick={this.onConfirmCouponClick}>确定</footer>
                            </main>
                            </ReactCSSTransitionGroup>
                        </div>
                    }
                </div>
            </Page>
        );
    }
}

function FirstChild(props) {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
}

StudioCoupon.propTypes = {

};

function mstp(state) {
    return {
        sysTime: state.common.sysTime,
    }
}

const matp = {
    fetchMyLiveEntity,
    createLiveroom,
    fetchCouponInfo,
    bindCouponCode,
    fetchIsAdminFlag,
}

export default connect(mstp, matp)(StudioCoupon);