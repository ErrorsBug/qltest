const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import CouponStatusBar from './components/coupon-status-bar';
import CouponTypeBar from './components/coupon-type-bar';
import CouponItem from './components/coupon-item';

import { getVal, locationTo } from 'components/util';

import { queryCouponListByType, queryCouponListCount } from '../../actions/mine';
import { isLiveAdmin } from '../../actions/live';
// import { isLeafType } from 'graphql';

@autobind
class MineCoupon extends Component {

    data = {
        pageSize: 20
    }

    state = {
        statusTabs: [
            {
                name: '未使用',
                num: 0,
                active: false,
                key: 'bind',
            },
            {
                name: '已使用',
                num: 0,
                active: false,
                key: 'used',
            },
            {
                name: '已过期',
                num: 0,
                active: false,
                key: 'overdue',
            }
        ],

        typeTabs: [
            {
                name: '系列课券',
                active: false,
                key: 'channel',
            },
            {
                name: '课程券',
                active: false,
                key: 'topic',
            },
            {
                name: 'VIP券',
                active: false,
                key: 'vip',
            },
            {
                name: '通用券',
                active: false,
                key: 'live',
            },
            {
                name: '平台活动券',
                active: false,
                key: 'ding_zhi',
            },
        ],

        activeType: '',
        activeStatus: '',
        // 判断是否是专业版,
        isLiveAdmin: 'N',
        liveId: null,

        // 当前列表打page
        page: 1,
        noMore: false,
        // 当前列表的数据, 每次切换列表都会重置该列表
        list: [],
    }

    async componentDidMount() {
        const liveId = getVal(this.props, 'location.query.liveId') || null;

        // 如果链接带liveId，则通过liveId判断是否为专业版，
        // 若无liveId，则默认为非专业版
        let isLiveAdmin = 'N';
        let liveLevel = 'normal';
        if (liveId) {
            const res = await this.props.isLiveAdmin(liveId);
            isLiveAdmin = getVal(res, 'data.isLiveAdmin');
            liveLevel = getVal(res, 'data.liveLevel');
            await this.setState({liveId, isLiveAdmin});
        }

        // 从个人中心或自媒体版直播间的学员中心进入“我的优惠券”，需要显示“定制券”
        if (!liveId || liveLevel === 'selfMedia') {
            this.setState((prevState) => {
                return {
                    typeTabs: [...prevState.typeTabs, {
                        name: '定制券',
                        active: false,
                        key: 'relayChannel',
                    }]
                }
            });
        }

        const activeStatus = await this.fetchBaseInfo();
        let result = [];
        if (this.state.activeType && this.state.activeType !==  '') {
            result = await this.fetchListData(this.state.activeType, activeStatus, this.state.page);
        }

        let typeTabs = this.state.typeTabs;
        // 若为专业版则不显示平台活动券
        if (isLiveAdmin === 'Y') {
            typeTabs = this.state.typeTabs.filter(val => val.key !== 'ding_zhi');
        }

        this.setState({
            list: result,
            noMore: result.length < this.data.pageSize,
            page: this.state.page + 1,
            typeTabs: typeTabs.map(typeItem => ({ ...typeItem, active: typeItem.key === this.state.activeType })),
            activeType: this.state.activeType,
            isLiveAdmin,
            liveId,
        })
    }

    onStatusTabClick(index) {
        this.setState({
            statusTabs: this.state.statusTabs.map((item, id) => ({
                ...item,
                active: id == index
            })),
            activeStatus: this.state.statusTabs[index].key,
            list: [],
            page: 1,
        }, async () => {
            let hasItem = false;

            // 循环查找有内容的tab
            for (let i=0; i<this.state.typeTabs.length; i++) {
                let type = this.state.typeTabs[i];

                //已过期券没有话题、系列课、VIP类型,所以略过
                // if (this.state.statusTabs[index].key == 'overdue' &&
                //     (type.key == 'topic' ||
                //     type.key == 'channel' ||
                //     type.key == 'vip')
                // ) {
                //     continue;
                // }

                // 获取该列表该状态下的优惠券列表
                let result = await this.fetchListData(type.key, this.state.activeStatus, 1);

                if (result && result.length != 0) {
                    hasItem = true;
                    this.setState({
                        page: 1,
                        list: result,
                        noMore: result.length < this.data.pageSize,
                        typeTabs: this.state.typeTabs.map((item, id) => ({
                            ...item,
                            active: id == i
                        })),
                        activeType: this.state.typeTabs[i].key
                    });
                    break;
                } else if (i == this.state.typeTabs.length - 1 && !hasItem) {
                    this.setState({
                        page: 1,
                        list: [],
                        noMore: true,
                        typeTabs: this.state.typeTabs.map((item, id) => ({
                            ...item,
                            active: id == i
                        })),
                        activeType: this.state.typeTabs[i].key
                    });
                }
            }
        })
    }

    onTypeTabClick(index) {
        this.setState({
            typeTabs: this.state.typeTabs.map((item, id) => ({
                ...item,
                active: id == index
            })),
            activeType: this.state.typeTabs[index].key,
            list: [],
            page: 1,
        }, () => {
            this.loadNext();
        })
    }

    // 根据参数获取列表
    async fetchListData(type, status, page) {
        // 若为专业版，则传入该专业版liveId
        let params = {
            type,
            status,
            page,
            liveId: this.state.isLiveAdmin === 'Y' ? this.state.liveId : null,
        }

        const result = await this.props.queryCouponListByType(params);

        if (result.state.code == 0) {
            return result.data.resultList || [];
        }
    }

    // 获取以及tab bar上的数量字段，并且返回需要初始化哪个列表
    async fetchBaseInfo() {
        // 若为专业版，则传入该专业版liveId
        let liveId = this.state.isLiveAdmin === 'Y' ? this.state.liveId : null

        const result = await this.props.queryCouponListCount(liveId)

        if (result.state.code == 0) {
            let activeType = null;
            let activeStatus = null;

            const statusTabs = this.state.statusTabs.map((item, index) => {
                let calcObj = null;

                switch (item.key) {
                    case 'bind':
                        calcObj = result.data.unUseCoupon;
                        break;
                    case 'used':
                        calcObj = result.data.usedCoupon;
                        break;
                    case 'overdue':
                        calcObj = result.data.overTimeCoupon;
                        break;
                    default:
                        break;
                }

                if (!calcObj) {
                    return;
                }

                // console.log(calcObj)

                const count = this.state.typeTabs.reduce((pre, cur) => {
                    let curCount = 0;
                    switch (cur.key) {
                        case 'channel':
                            curCount = calcObj.channelNum || 0;
                            break;
                        case 'topic':
                            curCount = calcObj.topicNum || 0;
                            break;
                        case 'vip':
                            curCount = calcObj.vipNum || 0;
                            break;
                        case 'live':
                            curCount = calcObj.universalNum || 0;
                            break;
                        case 'ding_zhi':
                            curCount = calcObj.promotionNum || 0;
                            break;
                        case 'relayChannel':
                            curCount = calcObj.relayChannelNum || 0;
                            break;
                        default:
                            break;
                    }
                    if (curCount > 0 && !activeType) {
                        activeType = cur.key;
                        activeStatus = item.key;
                    }

                    return pre + curCount;
                }, 0);
                return { ...item, num: count || 0, active: activeStatus == item.key };
            });

            this.setState({ activeType: activeType, activeStatus: activeStatus, statusTabs })

            return activeStatus;
        }
    }

    // 获取下一页
    async loadNext(next) {
        const result = await this.fetchListData(
            this.state.activeType,
            this.state.activeStatus,
            this.state.page,
        )

        this.setState({
            page: this.state.page + 1,
            list: this.state.list.concat(result),
            noMore: result.length < this.data.pageSize,
        }, () => {
            next && next();
        });
    }

    onItemClick(couponId, couponType, businessId, url, startTime) {
        if (this.state.activeStatus !== 'bind') {
            return;
        }

        if (couponType === 'relay_channel') {
            if (startTime && (Date.now() < (new Date(startTime)).getTime())) {
                window.toast('该优惠券暂不可用~');
                return;
            }
        }

        switch (couponType) {
            case 'topic':
                // pro_cl=coupon 代表的是优惠券渠道进入到话题的，用在数据统计中的渠道统计
                locationTo(`/wechat/page/topic-intro?topicId=${businessId}&pro_cl=coupon&couponId=${couponId}&couponType=${couponType}`);
                break;
            case 'channel':
                locationTo(`/live/channel/channelPage/${businessId}.htm?couponId=${couponId}&couponType=${couponType}&sourceNo=coupon`);
                break;
            case 'vip':
                locationTo(`/wechat/page/live-vip-details?liveId=${businessId}&couponId=${couponId}`);
                break;
            case 'live':
                locationTo(`/wechat/page/live/${businessId}`);
                break;
            case 'ding_zhi':
                locationTo(url);
                break;
            case 'relay_channel':
                locationTo(`/live/channel/channelPage/${businessId}.htm?couponId=${couponId}&couponType=${couponType}&sourceNo=coupon`);
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <Page title="我的优惠券" className="my-coupon-page">

                <CouponStatusBar
                    tabs={ this.state.statusTabs }
                    onTabClick={ this.onStatusTabClick } />

                <CouponTypeBar
                    tabs={ this.state.typeTabs }
                    activeStatus={ this.state.activeStatus }
                    onTabClick={ this.onTypeTabClick } />

                <div className='coupon-list-container'>
                    <ScrollToLoad
                        className={`coupon-list${this.state.isLiveAdmin === "N" ? " showBottom" : ""}`}
                        loadNext={ this.loadNext }
                        noMore={ this.state.noMore }
                        >
                        {
                            this.state.list.map((item, index) => (
                                <CouponItem
                                    key={`list-item-${index}`}
                                    onItemClick={ this.onItemClick }
                                    couponType={ this.state.activeType }
                                    activeStatus={ this.state.activeStatus }
                                    { ...item }
                                />
                            ))
                        }
                    </ScrollToLoad>

                    <div className="to-coupon-center" onClick={() => {locationTo('/wechat/page/coupon-center')}}>
                        <div className="img"></div>
                        <div className="des">领券中心</div>
                    </div>

                </div>
            </Page>
        );
    }
}

MineCoupon.propTypes = {

};

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    queryCouponListByType,
    queryCouponListCount,
    isLiveAdmin,
}

module.exports = connect(mapStateToProps, mapActionToProps)(MineCoupon);
