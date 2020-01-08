import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CouponTypeBar = props => {
    return (
        <section className='coupon-type-bar'>
            {
                props.tabs.map((item, index) => (
                    (props.activeStatus === 'overdue' && (item.key === 'channel' || item.key === 'topic' || item.key === 'vip')) ?
                        null
                        : 
                        <span key={`coupon-type-tab-item-${index}`} 
                            className={classnames({ active: item.active })}
                            onClick={ props.onTabClick.bind(null, index) }>
                            { item.name }
                        </span>
                ))
            }
        </section>
    );
};

CouponTypeBar.propTypes = {
    tabs: PropTypes.array.isRequired,
    onTabClick: PropTypes.func,
    activeStatus: PropTypes.string,
};

CouponTypeBar.defaultProps = {
    tabs: [],
    onTabClick: () => null,
};

export default CouponTypeBar;
