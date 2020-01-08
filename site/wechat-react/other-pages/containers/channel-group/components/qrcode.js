import React from 'react';
import PropTypes from 'prop-types';

const QrCode = props => {
    return (
        <section className='qrcode-row-container'>
            长按识别二维码  获取更多课程
            <img className='qrcode-wrap' src={ props.qrcode } alt=""/>
            <img className='fingerprint' src={require('../images/fingerprint.png')} alt="" />
        </section>
    );
};

QrCode.propTypes = {
    // 二维码地址
    qrcode: PropTypes.string.isRequired,
};

export default QrCode;