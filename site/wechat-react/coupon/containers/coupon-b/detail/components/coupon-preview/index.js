import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatMoney, formatDate } from 'components/util'

const CouponPreview = props => {
    const overdue = props.overTime ? (props.sysTime > props.overTime) : false
    const caniuse = props.overTime ? formatDate(props.overTime, 'yyyy/MM/dd hh:mm') : '永久有效'
    const codeNum = props.codeNum ? props.codeNum + '个' : '无限制'

    const charge = formatMoney(props.money, 1).toString()
    let chargeClass = 'large'
    if (charge.length > 4) {
        chargeClass = 'middle'
    }
    if (charge.length > 6) {
        chargeClass = 'small'
    }
    return (
        <section className={classNames('co-coupon-b-preview', { 'overdue': overdue })}>
            <header>
                <div className="money">￥<var>{charge}</var></div>
                <div className='text'>优惠金额</div>
            </header>    
            <main className={classNames({ 'overdue': overdue })}>
                <ul className="info">
                    <li>
                        <span className='desc'>生成时间:</span>
                        <span className='content'>{formatDate(props.createTime, 'yyyy/MM/dd hh:mm')}</span>
                    </li>

                    <li>
                        <span className='desc'>生成数量:</span>
                        <span className='content'>{codeNum} <span>(已领取{props.useNum || 0}个)</span></span>
                    </li>

                    <li>
                        <span className='desc'>有效时间:</span>
                        <span className='content'>{caniuse}</span>
                    </li>
                </ul>
                <div className="remark">
                    备注: &nbsp; {props.remark || '无'}
                </div>
            </main>
            <footer>
                <button
                    className={classNames({ 'overdue': overdue })}
                    onClick={() => {
                        overdue
                            ? window.toast('优惠券已失效')  
                            : props.onShareClick()
                    }}
                >
                    立即发放
                </button>
            </footer>
        </section>
    );
};

CouponPreview.propTypes = {
    id: PropTypes.number.isRequired,			// 优惠码id
    couponCode: PropTypes.string.isRequired,	// 优惠码编码
    createTime: PropTypes.number.isRequired,	// 创建时间
    overTime: PropTypes.number,			        // 过期时间（为空则永久有效）
    codeNum: PropTypes.number,			        // 生成数量（为空则无限个）
    createBy: PropTypes.number.isRequired,		// 创建人id
    money: PropTypes.number.isRequired,			// 优惠金额（元）
    remark: PropTypes.string,			        // 优惠码备注

    sysTime: PropTypes.number.isRequired,       // 服务器时间

    onItemClick: PropTypes.func,
    onShareClick: PropTypes.func,
    hideShare: PropTypes.bool,
};

CouponPreview.defaultProps = {
    onItemClick: () => { },
    onShareClick: () => { },
    hideShare: false,
}

export default CouponPreview;