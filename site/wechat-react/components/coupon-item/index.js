/**
 * 20180514 搬运自weapp
 * 优惠券列表项
 */
import React, { Component } from 'react';



export default class CouponItem extends Component {
    render() {
        let { coupon, isActive } = this.props;

        let cls = isActive ? '__coupon-item active' : '__coupon-item';
        
        let moneyLen = String(coupon.money).length,
            moneyStyle = moneyLen > 3 ? moneyLen > 5 ? 'sm' : 'md' : '';

        return (
            <div className={cls} onClick={this.onClick}>
                <div className="__coupon-item-container">

                    <div className="__coupon-item-left">
                        <div className="main">
                            ￥<span className={moneyStyle}>{coupon.money}</span>
                        </div>
                        <div className="desc">
                            {coupon.minMoney ? '满'+coupon.minMoney+'元可用' : '优惠金额'}
                        </div>
                    </div>

                    <div className="__coupon-item-right">
                        <div className="main">{coupon.title}</div>
                        <div className="desc">
                            <div className="date">{coupon.isForever ? '永久有效' : coupon.timeStr }</div>
                        </div>
                        {
                            coupon.isOverTimeSoon &&
                            <div className="mark-overtimesoon">即将过期</div>
                        }
                        <div className="tick"><i className="icon_checked"></i></div>
                    </div>

                    <div className="__coupon-item-gap"></div>
                </div>
            </div>
        )
    }

    onClick = e => {
        let { onClick, coupon, index } = this.props;
        return onClick && onClick(e, coupon, index);
    }
}



/**
 * coupon对象过滤器
 * 
 * defaultParams为默认属性，由于接口数据不统一，甚至缺失字段，需做后置处理
 */
export function couponItemFilter(coupon, defaultParams) {
    Object.assign(coupon, defaultParams);

    let title = '';
    switch (coupon.couponType) {
        case 'topic':
            title = `仅可购买课程《${coupon.name}》`;
            break;
        case 'channel':
            title = `仅可购买系列课《${coupon.name}》`;
            break;
        case 'live':
            title = `可在【${coupon.liveName || coupon.name}】直播间使用`;
            break;
        case 'global_vip':
            title = `仅可购买【${coupon.name || coupon.liveName}】VIP会员`;
            break;
        case 'ding_zhi':
            title = coupon.codeName;  // 定制券才有这个字段，活动券名称
            break;
        case 'relay_channel':
            title = `仅限系列课《${coupon.name}》使用`;
            break;
    }
    coupon.title = title;


    // 坑，overTime有些是时间戳，有些是日期字符串xx-xx-xx
    let _overTime = (new Date(coupon.overTime)).getTime();

    // 是否永久有效
    let isForever = (coupon.couponType == 'live' && !coupon.overTime) ||
        _overTime - Date.now() > 315360000000;
    coupon.isForever = isForever;

    // 是否即将过期
    coupon.isOverTimeSoon = !isForever && _overTime - Date.now() < 259200000;

    let timeStr = '';
    if (!isForever) {
        // 针对自媒体转载系列课的定制券需要显示'2017/06/06至2017/06/08'的时间格式
        if (coupon.couponType === 'relay_channel') {
            let startTime = new Date(coupon.startTime);
            let overTime = new Date(coupon.overTime);
            timeStr = `${startTime.getFullYear()}/${startTime.getMonth() + 1}/${startTime.getDate()}至${overTime.getFullYear()}/${overTime.getMonth() + 1}/${overTime.getDate()}`;
            } else {
            let t = new Date(coupon.overTime)
            timeStr = t.getFullYear() + '/' + (t.getMonth() + 1) + '/' + t.getDate() + ' 前可使用';
        }
    }
    coupon.timeStr = timeStr;
}