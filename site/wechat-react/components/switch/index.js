import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'

// Switch 组件
const Switch = ({
    active,
    size='lg',
    preChange,
    onChange,
    className,
    dataLog
}) => {
    return (
        <div
            className={ classnames('co-switch', className, size, { 'active': active }) }
            data-log-region={dataLog && dataLog.region}
            data-log-pos={dataLog && dataLog.pos}
            onClick={ onChange } >
        </div>
    );
};

Switch.propTypes = {
    // Switch是开关状态
    active: PropTypes.bool.isRequired,

    // switch的大小
    size: PropTypes.oneOf(['lg', 'md', 'sm']),

    // 改变状态时调用
    onChange: PropTypes.func,

    // 自定义样式
    className: PropTypes.string,
};

export default Switch;