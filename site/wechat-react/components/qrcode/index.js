import React, { Component } from 'react';
import PropTypes from 'prop-types';

class QRCode extends Component {
    render() {
        return (
            <div className={ 'co-qrcode-container ' + this.props.className }>
                <img src={this.props.src} />
            </div>
        );
    }
}

QRCode.propTypes = {
    // 二维码链接
    src: PropTypes.string.isRequired,
};

export default QRCode;