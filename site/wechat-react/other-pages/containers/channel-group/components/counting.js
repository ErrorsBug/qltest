import React from 'react';
import PropTypes from 'prop-types';

/**
 * 拼课失败
 */
const Counting = props => {
    return (
        <div>
            <div className="end-status-wrap">
                <div className="progress-status-left">
                    <img src={require('../images/resolve.png')}></img>
                    <span className="status-word">拼课结算中...</span>
                </div>
            </div>
          
            <div className='btn-row'>
              <span className='red' onClick={ props.onChannelIntroClick }>查看课程</span> 
            </div>
        </div>
    );
};

Counting.propTypes = {
    // 按钮点击
    onChannelIntroClick: PropTypes.func.isRequired,
}

export default Counting;