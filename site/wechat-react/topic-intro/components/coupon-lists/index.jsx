import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { formatDate } from 'components/util';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import BottomDialog from 'components/dialog/bottom-dialog';

import {
    getQueryCouponForIntro,
} from '../../actions/common';

import {
	formatMoney,
    getVal
} from 'components/util';

import {
    updateCouponInfo,
} from '../../actions/topic-intro'
import {
    updateCurChannelCoupon,
} from '../../actions/channel-intro'

@withRouter
@autobind
class CouponLists extends Component {
    
    // 更新优惠券
    async updateCoupon(coupon) {
        const {
            couponListType,
            from,
        } = this.props
        if (from === 'channel') {
            await this.props.updateCurChannelCoupon(coupon)
        } else {
            const couponInfo = {}

            if (couponListType === 'channel') couponInfo.channelCoupon = coupon
            else couponInfo.topicCoupon = coupon
            
            await this.props.updateCouponInfo(couponInfo);
        }
    }
    
    // 选择优惠券
    selectCoupon(coupon) {
        const currCoupon = this.currCoupon

        if (coupon.codeId === (currCoupon.id || currCoupon.codeId)) return

        this.updateCoupon(coupon)
        this.close()
    }

    // 获取当前指定优惠券
    get currCoupon () {
        const {
            couponListType,
            from,
            curChannelCoupon,
            curTopicCoupon,
            curCoupon,
        } = this.props
        if (from === 'channel') {
            return curCoupon
        } else {
            if (couponListType === 'channel') return curChannelCoupon
            else return curTopicCoupon
        }
    }
    
    // 关闭
    close() {
        this.props.hideCoupon()
    }

    // 计算优惠券时效对象
    erpTime(end) {
        const prescription = {
            isInvalid: false, // 是否失效
            timeStr: '永久有效' // 展示文案
        }
        if (!end) return prescription;
        const day = Math.ceil((new Date(end).getTime() - this.props.sysTime) / (1000 * 60 * 60 * 24));
        const year = Math.floor(day / (30 * 12));
        if (year >= 10) {
            return prescription
        }
        // 年 
        if (year > 0) {
            prescription.timeStr = formatDate(end, 'yyyy-MM-dd')
            return prescription;
        }
        // 月
        if (day > 30) {
            prescription.timeStr = `还有${Math.floor(day / 30)}个月过期`
            return prescription;
        }
        // 天
        if (day > 0) {
            prescription.timeStr = `还有${day}天过期`
        } else {
            prescription.isInvalid = true
            prescription.timeStr = `已失效`
        }
        return prescription;
    }

    renderCouponList () {
        const { couponLists } = this.props;

        let renderList = null
        if (couponLists && couponLists.length > 0) {
            const currCoupon = this.currCoupon

            const available = []
            const unavailable = []

            couponLists.map((coupon, index) => {
                coupon.prescription = this.erpTime(coupon.overTime)
                // 平台通用券没有价格，只有折扣
                if(coupon.couponType === 'discount' && !coupon.prescription.isInvalid){
                    available.push(<CouponItem key={index} isSelect={coupon.couponId == currCoupon.couponId} item={coupon} selectCoupon={this.selectCoupon} />)
                } else {
                    if (this.props.chargePrice < coupon.minMoney || coupon.prescription.isInvalid) {
                        unavailable.push(<CouponItem key={index} disable={true} item={coupon} />)
                    } else {
                        available.push(<CouponItem key={index} isSelect={coupon.codeId == (currCoupon.id || currCoupon.codeId)} item={coupon} selectCoupon={this.selectCoupon} />)
                    }
                }
            })

            renderList = [...available, ...unavailable]
        }
        
        return renderList
    }

    render() {
        return (
            <BottomDialog
                show={true}
                bghide={true}
                theme="empty"
                onClose={this.close}
                className="cou-lists">
                <div className="cou-head">
                    <h4>更换优惠券</h4>
                    <div className="cou-close" onClick={this.close}></div>
                </div>
                <div className="cou-cont">
                    { this.renderCouponList() }
                </div>
            </BottomDialog>
        );
    }
}

class CouponItem extends Component {

    // 券类型名称
    couponType(type) {
        // if(code){
        //   return code
        // } else {
        switch (type) {
            // 平台通用券显示文案
            case "discount": 
                return '手气红包：适用当前课程'
            case "live":
                return '指定直播间';
            case "ding_zhi":
                return '指定课程';
            case "custom_vip":
                return '指定课程';
            case "topic":
                return '指定课程';
            case "channel":
                return '指定课程';
            case "global_vip":
                return '指定直播间';
            case "relay_channel":
                return '指定课程';
        }
        // }
    }

    render () {
        const item = this.props.item
        return this.props.disable || item.couponType === 'app' ? (
            <div className="cou-item">
                <div className="cou-list disable">
                    <div className="cou-detail">
                        <div className="cou-title">
                            <span className="name">{this.couponType(item.couponType)}</span>
                            {
                                item.minMoney > 0 && <span className="limit-tips">满{formatMoney(item.minMoney)}可用</span>
                            }
                        </div>
                        <p>{item.name || item.codeName}</p>
                        <span>{item.prescription.timeStr}</span>
                    </div>
                    <div className="cou-price">
                        <p><span>￥</span>{formatMoney(item.money)}</p>
                    </div>

                    {
                        item.couponType === 'app' &&
                        <div className="label-app-type"></div>
                    }
                </div>
            </div>
        ) : (
            <div className="cou-item">
                <div className={`cou-list ${this.props.isSelect ? 'cou-select' : ''}`}
                    onClick={() => this.props.selectCoupon(item)}>
                    <div className="cou-detail">
                        <div className="cou-title">
                            <span className="name">{this.couponType(item.couponType)}</span>
                            {
                                item.minMoney > 0 && <span className="limit-tips">满{formatMoney(item.minMoney)}可用</span>
                            }
                        </div>
                        <p>{item.name || item.codeName}</p>
                        <span>{item.prescription.timeStr}</span>
                    </div>
                    <div className="cou-price">
                        <p> 
                            {
                                // 平台通用券显示折扣
                                item.couponType === 'discount' ? 
                                [`${item.discount / 10}`, <span>  折</span>]: 
                                [<span>￥</span>,`${formatMoney(item.money)}`]
                            }
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {

    return {
        sysTime: state.common.sysTime,
        curChannelCoupon: getVal(state, 'topicIntro.curChannelCoupon', ''),
        curTopicCoupon: getVal(state, 'topicIntro.curTopicCoupon', ''),
        curCoupon: getVal(state, 'channelIntro.curCoupon', ''),
        isSingleBuy: getVal(state, 'topicIntro.topicInfo.isSingleBuy', 'N'),
        selIdx: state.topicIntro.selIdx || 0
    }
}

const mapActionToProps = {
    getQueryCouponForIntro,
    updateCouponInfo,
    updateCurChannelCoupon,
};

export default connect(mapStateToProps, mapActionToProps)(CouponLists);