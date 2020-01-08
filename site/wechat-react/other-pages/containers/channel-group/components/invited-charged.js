import React from 'react';
import PropTypes from 'prop-types';
import Timer from 'components/timer';
import Progress from './progress'

/**
 * 被邀请, 购买成功界面
 */
const InvitedCharged = props => {
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

            {/* <div className='group-qrcode-wrap'>
                <div className='qrcode-inner-wrap'>
                    <img className='' src={ props.qrcode } onTouchStart={touchStart} onTouchEnd={touchEnd} onTouchCancel={touchEnd} />
                </div>

                <p>长按识别二维码，进入听课</p>
            </div> */}

            <div className='btn-row'>
                <span className='red' onClick={ props.onShareClick }>分享好友来拼课</span>
                <span className='green-empty' onClick={ props.onLinkToChannel }>进入课程</span>
            </div>
        </div>
    );
};

function touchStart () {
    const qrCode = document.querySelector('.qrcode-inner-wrap img')
    qrCode.classList.add('qrcode-img');
}

function touchEnd () {
    const qrCode = document.querySelector('.qrcode-inner-wrap img')
    qrCode.classList.remove('qrcode-img');
}

InvitedCharged.propTypes = {
    // 倒计时回调
    onFinish: PropTypes.func.isRequired,

    // 还差多少人
    peopleNum: PropTypes.number.isRequired,

    // 剩余多少秒
    second: PropTypes.number.isRequired,

    // 二维码链接
    qrcode: PropTypes.string.isRequired,

    // 分享按钮点击事件
    onShareClick: PropTypes.func.isRequired,

    // 进入系列课按钮点击事件
    onLinkToChannel: PropTypes.func.isRequired,
};

export default InvitedCharged;