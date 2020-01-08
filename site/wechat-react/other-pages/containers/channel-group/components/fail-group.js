import React from 'react';
import PropTypes from 'prop-types';
import Progress from './progress'

/**
 * 拼课失败
 */
const FailGroup = props => {
    return (
        <div>
            <Progress
                groupNum={props.groupNum}
                joinNum={props.joinNum}
                status="fail"
            />
            {
                // 管理员不用展示
                !props.liveRole &&
                <div className='timer-container'>
                    课程收费将原路退换至您的账户
                </div>
            }
            

            <div className='btn-row'>
            {
                //管理员是 进入课程  非管理员是 查看课程
                props.liveRole ? 
                <span className='red' onClick={ props.onClick }>进入课程</span> 
                : <span className='red' onClick={ props.onChannelIntroClick }>查看课程</span> 
            }
                
            </div>
        </div>
    );
};

FailGroup.propTypes = {
    // 按钮点击
    onClick: PropTypes.func.isRequired,
}

export default FailGroup;