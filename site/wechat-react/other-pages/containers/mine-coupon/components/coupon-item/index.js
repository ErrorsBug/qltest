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
            couponType = `可在【${ props.name }】直播间使用`;
            break;
    
        case 'vip':
            couponType = `仅可购买【${ props.name }】VIP会员`;
            break;
    
        case 'ding_zhi':
            couponType = props.codeName;
            break;
        
        case 'relay_channel':
            couponType = `仅限系列课《${ props.name }》使用`;
            break;
    
        default:
            break;
    }

    // 是否永久有效
    let isForever = 
        (props.overTime == null) ||
        props.overTime - Date.now() > 315360000000 ;
    // 是否即将过期
    let isOverTimeSoon = props.overTime - Date.now() < 259200000;
    let timeStr = '';
    if (!isForever) {
        // 针对自媒体转载系列课的定制券需要显示'2017/06/06至2017/06/08'的时间格式
        if (props.couponType === 'relay_channel') {
            let startTime = new Date(props.startTime);
            let overTime = new Date(props.overTime);
            timeStr = `${startTime.getFullYear()}/${startTime.getMonth() + 1}/${startTime.getDate()}至${overTime.getFullYear()}/${overTime.getMonth() + 1}/${overTime.getDate()}`;
        } else {
            let t = new Date(props.overTime)
            timeStr = t.getFullYear() + '/' + (t.getMonth() + 1) + '/' + t.getDate() + ' 前可使用';
        }
    }

    const styles = classnames(
        'coupon-item',
        {
            'bind': props.activeStatus === 'bind',
            'used': props.activeStatus === 'used',
            'overdue': props.activeStatus === 'overdue',
        }
    );

    const strLen = String(props.money).length;
    const moneyStyle = strLen > 4 ? strLen > 6 ? 'sm' : 'md' : '';

    return (
        <li className={ styles } onClick={ props.onItemClick.bind(null, props.codeId, props.couponType, props.businessId, props.url, props.startTime) }>
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
                {
                    props.activeStatus === 'bind' && !isForever && isOverTimeSoon && <span className='overtime-soon'>即将过期</span>
                }

                <p className="info_title multi-elli"> { couponType } </p>
                <span className="info_time_limit"> { isForever ? '永久有效' : timeStr } </span>

                {
                    props.activeStatus === 'overdue' &&
                        <img className='over-time-icon' src={require('../../imgs/overtime.png')} alt=""/>
                }
                {
                    props.activeStatus === 'used' &&
                        <img className='over-time-icon' src={require('../../imgs/used.png')} alt=""/>
                }
                {
                    props.activeStatus === 'bind' &&
                    <span className='btn-goto-use'>去使用</span>
                }
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
        'ding_zhi',
        'relay_channel',
    ]),

    onItemClick: PropTypes.func,
};

export default CouponItem;