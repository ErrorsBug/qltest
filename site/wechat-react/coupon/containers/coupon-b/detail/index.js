import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import classNames from 'classnames'

import Page from 'components/page'
import ScrollToLoad from 'components/scrollToLoad'
import { formatDate, imgUrlFormat, locationTo } from 'components/util'

import CouponPreview from './components/coupon-preview'

import {
    getCouponDetail,
    getCouponUseList,
} from '../../../actions/coupon'

@autobind
class CouponDetail extends Component {

    state = {
        coupon: null,
        list: [],

        page: 1,
        size: 20,
        noneOne: false,
        noMore: false,
    }

    componentDidMount() {
        this.fetchCouponDetail()
        this.fetchList()
    }

    get liveId() {
        return this.props.router.params.liveId
    }

    get couponId() {
        return this.props.location.query.couponId
    }

    async fetchCouponDetail() {
        const result = await this.props.getCouponDetail({
            couponId: this.couponId,
        })
        this.setState({ coupon: result })
    }

    async fetchList(next) {
        let { page, size, noMore, noneOne, list } = this.state
        const result = await this.props.getCouponUseList({
            couponId: this.couponId,
            page: {
                page,
                size,
            }
        })

        const len = result && result.length || 0;

        if (len < size) {
            noMore = true
        }
        if (page === 1 && len === 0) {
            noneOne = true
            noMore = false
        }
        if (result) {
            list = list.concat(result)
        }
        page += 1

        this.setState({ list, noMore, noneOne, page }, () => { next && next() })
    }

    toShare() {
        locationTo(`/wechat/page/coupon-manage/share/${this.liveId}?couponId=${this.couponId}&type=universal`)
    }

    render() {
        const {
            coupon, list,
            noMore, noneOne,
        } = this.state

        return (
            <Page title={'优惠券'}>
                <div className='coupon-b-detail-container'>
                    <main>
                        <ScrollToLoad
                            loadNext={this.fetchList}
                            toBottomHeigh={600}
                            noMore={noMore}
                        >
                            {
                                coupon &&
                                <CouponPreview
                                    {...coupon}
                                    sysTime={this.props.sysTime}
                                    hideShare={true}
                                    onShareClick={this.toShare}
                                />
                            }

                            
                                <div className="use-info">
                                    <p className='use-num'>
                                        使用明细({coupon ? coupon.useNum : ''})
                                    </p>
                                    {
                                        (list && list.length > 0) &&
                                        <ul className='coupon-b-use-list'>
                                            {
                                                list.map((item, index) => {
                                                    const used = item.status === 'used';
                                                    return <li key={`list-item-${index}`}>
                                                        <img src={imgUrlFormat(item.userHeadImage || 'http://img.qlchat.com/qlLive/liveCommon/normalLogo.png', '?x-oss-process=image/resize,m_fill,limit_0,h_140,w_140')} alt="" />
                                                        <div className="info">
                                                            <div className="name">{item.userName}</div>
                                                            <time>{formatDate(item.createTimeStamp, 'yyyy-MM-dd hh:mm')}</time>
                                                        </div>
                                                        <div className={classNames('status', { 'used': used })}>
                                                            {
                                                                item.status === 'used'
                                                                    ? '已使用'
                                                                    : '未使用'
                                                            }
                                                        </div>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    }
                                    {
                                        noneOne &&
                                        <div className='empty-list'>
                                            <p>暂无使用明细</p>
                                        </div>
                                    }
                                </div>
                        </ScrollToLoad>
                    </main>
                </div>
            </Page>
        );
    }
}

CouponDetail.propTypes = {

};

function mstp(state) {
    return {
        sysTime: state.common.sysTime,
    }
}

const matp = {
    getCouponDetail,
    getCouponUseList,
}

export default connect(mstp, matp)(CouponDetail);
