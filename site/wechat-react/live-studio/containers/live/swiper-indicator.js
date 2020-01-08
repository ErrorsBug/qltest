import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Indicator = ({
    size,
    activeIndex = 0,
    className = '',
    onItemClick = () => {}
}) => {
    let indicates = [];
    for (let i=0; i<size; i++ ) {
        indicates.push(<span onClick={(e) => {onItemClick(e, i);}} key={`swiper-indicate-item-${i}`} className={ classnames('swiper-indicate-item', {'active': i === activeIndex})}></span>);
    }

    return (
        <div className={ `swiper-indicator ${className}` }>
            { indicates }
        </div>
    );
};

Indicator.propTypes = {

    // 导航点的数量
    size: PropTypes.number.isRequired,

    // 激活点的下标，从0开始
    activeIndex: PropTypes.number,

    className: PropTypes.string,

    onItemClick: PropTypes.func,
};

export default Indicator;
