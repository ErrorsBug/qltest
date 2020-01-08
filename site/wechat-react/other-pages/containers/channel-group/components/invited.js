import React from 'react';
import PropTypes from 'prop-types';
import Timer from 'components/timer';
import Progress from './progress'

/**
 * 被邀请界面
 */
const Invited = (props) => {
    return (
        <div>
            <Progress
                groupNum={props.groupNum}
                joinNum={props.joinNum}
                status="pedding"
            />
            <div className='timer-container'>
                剩余时间
                <Timer durationtime={ props.second } onFinish={ props.onFinish } notSecond={true} ></Timer>
                结束
            </div>

            

            <div className='btn-row'>
                <span className='red' onClick={ props.doPayClick }>一键拼课，一起听课</span>
            </div>
        </div>
    );
};

Invited.propTypes = {
    // 倒计时回调
    onFinish: PropTypes.func.isRequired,

    // 还差多少人
    peopleNum: PropTypes.number.isRequired,

    // 剩余多少秒
    second: PropTypes.number.isRequired,

    // 支付按钮点击事件
    doPayClick: PropTypes.func.isRequired,
};

export default Invited;
