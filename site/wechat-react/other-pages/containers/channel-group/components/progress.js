import React from 'react';
import PropTypes from 'prop-types';

/**
 * 发起者
 */

function handleStatus (props) {
    switch (props.status) {
        case 'success':
            return (
                <div className="progress-status-wrap">
                    <div className="progress-status-left">
                        <img src={require('../images/success.png')}></img>
                        {
                            props.liveRole ?
                            <span className="status-word status-word-small">拼课成功！课程收入到账</span>
                            : <span className="status-word">拼课成功</span>
                        }
                        
                    </div>
                </div>
            )
        case 'fail':
            return (
                <div className="progress-status-wrap">
                    <div className="progress-status-left">
                        <img src={require('../images/reject.png')}></img>
                        <span className="status-word">拼课失败！</span>
                    </div>
                </div>
            )
        case 'pedding':
            return (
                <div className="progress-status-wrap">
                    <div className="progress-status-left">
                        <img src={require('../images/resolve.png')}></img>
                        <span className="status-word">正在拼课...</span>
                    </div>
                </div>
            )
        default:
            break;
    }
}
const Progress = (props) => {
    return (
        <div className="progress-bar">
            { handleStatus(props) }
            <div className="content">
	            <div className={`bar${props.joinNum === props.groupNum ? ' no-spot' : ''}`} style={{width:`${props.joinNum / props.groupNum * 100}%`}}></div>
            </div>
            {
                props.status === 'fail' ?
                    <div className="progress-status-right">
                        好可惜，还差<span className="status-join-num">{props.groupNum - props.joinNum}人</span>
                    </div>
                    :
                    <div className="progress-status-right">
                        <span className="status-join-num">{props.joinNum}</span>/{props.groupNum} 人
                    </div>
            }
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
