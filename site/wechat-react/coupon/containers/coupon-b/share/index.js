import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import classNames from 'classnames'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { isQlchat } from 'components/envi';
import appSdk from 'components/app-sdk';

import Page from 'components/page'
import { formatDate, locationTo, formatMoney } from 'components/util'
import { share } from 'components/wx-utils'

import CouponItem from '../components/coupon-item'
const isApp = isQlchat()

import {
    getCouponDetail,
} from '../../../actions/coupon'

@autobind
class CouponShare extends Component {

    state = {
        coupon: {
            
        },
    }

    get liveId() {
        return this.props.router.params.liveId
    }

    get couponId() {
        return this.props.location.query.couponId
    }

    get couponType() {
        return this.props.location.query.type
    }

    get officialKey() {
        return this.props.location.query.officialKey
    }

    get couponTitle() {
        const { coupon } = this.state
        if (!coupon) {
            return '--'
        }
        switch (this.couponType) {
            case 'topic':
                return ''
            case 'channel':
                return ''
            case 'vip':
                return ''
            case 'universal':
                return coupon.liveName
            default:
                return '--'
                break;
        }
    }

    get couponTypeText() {
        switch (this.couponType) {
            case 'topic':
                return '课程优惠券'
            case 'channel':
                return '系列课优惠券'
            case 'vip':
                return '直播间VIP优惠券'
            case 'universal':
                return '直播间通用券'
            default:
                return '优惠券'
                break;
        }
    }

    /* 不同类型从不同接口取优惠券信息 */
    get fetchCouponMethod() {
        switch (this.couponType) {
            /* 待加 */
            case 'universal':
                return this.props.getCouponDetail({ couponId: this.couponId })
                break;
        }
    }

    get couponLink() {
        if (!this.state.coupon) {
            return '--'
        }
        return `${location.origin}/wechat/page/get-coupon-universal/${this.state.coupon.liveId}?codeId=${this.couponId}&officialKey=${this.officialKey}`
    }

    componentDidMount() {
        this.fetchCouponDetail()
    }

    async fetchCouponDetail() {
        const result = await this.fetchCouponMethod;
        this.setState({ coupon: result }, () => {
            !isApp && this.initShare()
        })
    }

    initShare() {
        const { liveName, money } = this.state.coupon
        let title =''
        let desc = ''
        let timelineTitle=''
        switch (this.couponType) {
            case 'universal':
                title = `【领券便宜${formatMoney(money, 1)}元】${liveName}全场通用`;
                desc += `送你一张${this.couponTypeText}，海量课程任你选，先到先得，快点击领取吧！` 
                timelineTitle = `【领券便宜${formatMoney(money, 1)}元】${liveName}全场通用，点击领取` 
                break;
        
            default:
                break;
        }
        share({
            title,
            desc,
            timelineTitle,
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png',
            shareUrl: `${location.origin}/wechat/page/get-coupon-universal/${this.state.coupon.liveId}?codeId=${this.couponId}&officialKey=${this.officialKey}`,
        })
    }

    onCopyLink(text, result) {
        if (result) {
            window.toast('复制成功')
        } else {
            window.toast('复制失败，请手动长按复制')
        }
    }

    appShare () {
        const { liveName, money } = this.state.coupon
        let wxqltitle =''
        let descript = ''
        switch (this.couponType) {
            case 'universal':
                wxqltitle = `【领券便宜${formatMoney(money, 1)}元】${liveName}全场通用`;
                descript += `送你一张${this.couponTypeText}，海量课程任你选，先到先得，快点击领取吧！` 
                break;
        
            default:
                break;
        }
        appSdk.share({
            wxqltitle,
            descript,
            wxqlimgurl: 'https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png',
            friendstr: wxqltitle,
            shareUrl: `${location.origin}/wechat/page/get-coupon-universal/${this.state.coupon.liveId}?codeId=${this.couponId}&officialKey=${this.officialKey}`,
        });
    }

    render() {
        const { coupon } = this.state

        return (
            <Page title={'优惠券'}>
                <div className='coupon-b-share-container'>
                    {
                        coupon &&
                        <React.Fragment>
                        <div className="coupon">
                            <header>{this.couponTitle}</header>
                            <main>
                                <div className="info">
                                    <div className="money">
                                        ￥<var>{formatMoney(coupon.money, 1)}</var>
                                    </div>
                                    <div className="coupon-type">{this.couponTypeText}</div>
                                </div>
                                <div className="rules">
                                    <h2>使用规则</h2>
                                    <ul>
                                        <li dangerouslySetInnerHTML={{
                                            __html: isApp ? '① 点击下方<strong>"发送给好友"</strong>按钮,发送给好友' : '① 点击右上角，发送给好友'
                                        }}></li>
                                        <li>② 好友点击你发送的链接后即可领取优惠券</li>
                                    </ul>
                                </div>
                            </main>
                            <footer>
                                <p className='title'>优惠券领取地址</p>
                                <p>
                                    {this.couponLink}
                                    <span style={{display: 'inline-block', width: '10px'}}></span>
                                    
                                    <CopyToClipboard
                                        text={this.couponLink}
                                        onCopy={this.onCopyLink}
                                    >
                                        <button className='copy-button'>复制</button>
                                    </CopyToClipboard>
                                </p>
                            </footer>
                        </div>
                        {isApp ? <div className="send-friend-btn" onClick={this.appShare}>发送给好友</div> : null}
                        </React.Fragment>
                    }
                </div>
            </Page>
        );
    }
}

CouponShare.propTypes = {

};

function mstp(state) {
    return {
        sysTime: state.common.sysTime,
    }
}

const matp = {
    getCouponDetail,
}

export default connect(mstp, matp)(CouponShare);
