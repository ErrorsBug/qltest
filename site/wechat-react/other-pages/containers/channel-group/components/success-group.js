import React from 'react';
import PropTypes from 'prop-types';
import Progress from './progress'
/**
 * 拼课成功
 */
const SuccessGroup = props => {
    return (
        <div>
            <Progress
                    groupNum={props.groupNum}
                    joinNum={props.simulationStatus == 'Y' ? props.groupNum : props.joinNum}
                    status="success"
                    liveRole={props.liveRole}
                />
            <div className='btn-row'>
                <span className='red' onClick={ props.onClick }>进入课程</span>
            </div>
        </div>
    );
};

SuccessGroup.propTypes = {
    // 按钮点击
    onClick: PropTypes.func.isRequired,
}

export default SuccessGroup;
