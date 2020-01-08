import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CouponItem = props => {

    let couponType = '';

    switch (props.couponType) {
        case 'topic':
            couponType = `仅可购买课程《${ props.name }》`;
            break;
    
        case 'channel':
            couponType = `仅可购买系列课《${ props.name }》`;
            break;
    
        case 'live':
            couponType = `可在【${ props.liveName }】直播间使用`;
            break;
    
        case 'vip':
            couponType = `仅可购买【${ props.liveName }】VIP会员`;
            break;
    
        case 'ding_zhi':
            couponType = props.codeName;
            break;
    
        default:
            break;
    }

    // 是否永久有效
    let isForever = 
        (props.couponType == 'live' && props.overTime == null) ||
        props.overTime - Date.now() > 315360000000;

    // 是否即将过期
    let isOverTimeSoon = props.overTime - Date.now() < 259200000;
    let timeStr = '';
    if (!isForever) {
        let t = new Date(props.overTime)
        timeStr = t.getFullYear() + '/' + (t.getMonth() + 1) + '/' + t.getDate() + ' 前可使用';
    }

    const strLen = String(props.money).length;
    const moneyStyle = strLen > 4 ? strLen > 6 ? 'sm' : 'md' : '';

    return (
        <li className={classnames('channel-coupon-item', { 'active': props.couponId == props.activeCouponId })} onClick={ props.onItemClick.bind(null, props.couponId, props.couponType, props.businessId) }>
            <section className="coupon_money_container">
                <span className={`money_span ${moneyStyle}`}>￥<var className="coupon_value"> { props.money } </var></span>
                {
                    props.minMoney ?
                    <span className='text'>满{props.minMoney}元可用</span>
                    :<span className="coupon_text">优惠金额</span>
                        
                }
                <aside className="dash_line" />
            </section>

            <section className="coupon_info_container">
                <p className="info_title multi-elli"> { couponType } </p>
                <span className="info_time_limit"> { isForever ? '永久有效' : timeStr } </span>

                <span className="icon_checked active_mark">
                    <span className="triangle" />
                </span>
            </section>
        </li>
    );
};

CouponItem.propTypes = {
    couponType: PropTypes.oneOf([
        'topic',
        'channel',
        'live',
        'vip',
        'platform',
    ]),

    onItemClick: PropTypes.func,
};

export default CouponItem;