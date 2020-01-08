import React, {Component} from 'react';
import PropTypes from 'prop-types';

const Empty = props => {
    return (
        <div className='co-empty' hidden={!props.show}>
            <div className="co-empty-box">
                <img src={ require('./img/emptyPage.png') } />
            </div>
            暂无数据
        </div>
    );
};

Empty.propTypes = {
    // 是否显示empty
    show: PropTypes.bool.isRequired,
};

export default Empty;