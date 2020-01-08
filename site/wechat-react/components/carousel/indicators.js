import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Indicators = ({
    count,
    activeIndex = 0,
    className = '',
    onItemClick = () => {}
}) => {
    let indicators = [];
    activeIndex = activeIndex % count;
    for (let i = 0; i < count; i++) {
        indicators.push(<span onClick={(e) => {onItemClick(e, i);}} key={`carousel-indicate-item-${i}`} className={ classnames('carousel-indicator-item', {'active': i === activeIndex})}></span>);
    }

    return (
        <div className={ `carousel-indicator ${className}` }>
            { indicators }
        </div>
    );
};

Indicators.propTypes = {
    // 导航点的数量
    count: PropTypes.number.isRequired,
    // 激活点的下标，从0开始
    activeIndex: PropTypes.number,
    // 自定义类名称
    className: PropTypes.string,
    // 点击指示点的处理函数
    onItemClick: PropTypes.func,
};

export default Indicators;
