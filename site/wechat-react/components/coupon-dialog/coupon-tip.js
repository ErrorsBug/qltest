import React from 'react';
import PropTypes from 'prop-types';

const TipChange = props => {
    return (
        <div className="coupon-tip">
            <img src={ require('./img/course-button-ticketchange.png') } />

            <div className="tip-content">
                <header className="title">领取新的优惠券来<br />替换旧的优惠券吗？</header>

                <div className="btn-row">
                    <span className="button" onClick={ props.onUseOld }>使用旧优惠券</span>
                    <span className="button" onClick={ props.onChange }>领取并替换</span>
                </div>
            </div>
        </div>
    )
}

const TipOver = props => {
    return (
        <div className="coupon-tip">
            <img src={ require('./img/course-button-ticketout.png') } />

            <div className="tip-content">
                <header className="title one-line">该优惠券已被领完</header>

                <div className="btn-row">
                {
                    /(topic|channel)/.test(props.couponType) ? 
                        <span className="button close" onClick={ props.onCloseAndRedirect }>去课程看看</span> :
                        <span className="button close" onClick={ props.onClose }>关闭</span>
                }
                </div>
            </div>
        </div>
    )
}

const TipBinded = props => {
    return (
        <div className="coupon-tip">
            <img src={ require('./img/course-button-ticketout.png') } />

            <div className="tip-content">
                <header className="title one-line">已经领过同批次的优惠券</header>

                <div className="btn-row">
                    <span className="button close" onClick={ props.onClose }>关闭</span>
                </div>
            </div>
        </div>
    )
}

const CouponTip = props => {
    return (
        <div className="coupon-tip">
            {
                props.type === 'change' ?
                    <TipChange { ...props } /> :
                props.type === 'binded' ?
                    <TipBinded { ...props } /> :
                props.type === 'over' ?
                    <TipOver { ...props } />
                    :
                    null
            }
        </div>
    );
};


CouponTip.propTypes = {
    // 提示类型，替换or领取完毕
    type: PropTypes.oneOf(['change', 'over', 'binded']),
    onUseOld: PropTypes.func,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
};

export default CouponTip;