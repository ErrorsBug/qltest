import React from 'react';
import PropTypes from 'prop-types';

const ChannelProfitCard = (props) => {
    const {relayLiveName, relayLiveImage, ticketNum, giftNum, money} = props;
    return (
        <div className="profit-record">
            <header className="profit-header">
                <img className="headImage" src={relayLiveImage} alt="头像" />
                <span className="username">{relayLiveName}</span>
            </header>
            <section className="profit-detail">
                <div className="order-detail">
                    <div className="order-category">
                        <span className="order-tip">带来入场票:</span><span className="order-count">{ticketNum}单</span>
                    </div>
                    <div className="order-category">
                        <span className="order-tip">带来赠礼数:</span><span className="order-count">{giftNum}单</span>
                    </div>
                </div>
                <div className="vertical-bar"></div>
                <div className="order-income">
                    <span className="order-tip">带来获利:</span><span className="order-count">￥{money}</span></div>
            </section>
        </div>
    )
}

ChannelProfitCard.propTypes = {
    relayLiveImage: PropTypes.string,
    relayLiveImage: PropTypes.string,
    ticketNum: PropTypes.number,
    giftNum: PropTypes.number,
    money: PropTypes.number
}

export default ChannelProfitCard;