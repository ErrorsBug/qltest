import React from 'react';
import PropTypes from 'prop-types';

/**
 * 发起者
 */
const Progress = (props) => {
    return (
        <div className="progress-bar">
	        {props.joinNum }人参团 / <span className="total">{props.groupNum}人成团</span>
            <div className="content">
	            <div className="bar" style={{width:`${(props.joinNum) / props.groupNum * 100}%`}}></div>
            </div>
        </div>
    );
};

Progress.propTypes = {
	// 一共多少人
	groupNum: PropTypes.number.isRequired,

	// 多少人参加了
	joinNum: PropTypes.number.isRequired,
};

export default Progress
