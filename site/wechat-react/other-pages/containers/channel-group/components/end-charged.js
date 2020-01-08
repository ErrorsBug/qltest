import React from 'react';
import PropTypes from 'prop-types';
import Progress from './progress'


/**
 * 已成功购买，拼课结束
 */
const EndCharged = props => {
    return (
        <div>
            <Progress
                groupNum={props.groupNum}
                joinNum={props.joinNum}
                status="success"
            />

            <div className='btn-row'>
                <span className='red' onClick={ props.onClick }>进入课程</span>
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

EndCharged.propTypes = {
    // 二维码地址
    qrcode: PropTypes.string.isRequired,

    // 跳转
    onClick: PropTypes.func.isRequired,
};

export default EndCharged;