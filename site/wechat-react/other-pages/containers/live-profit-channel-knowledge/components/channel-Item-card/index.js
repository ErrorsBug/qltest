import React from 'react'
import PropTypes from 'prop-types'

const ChannelItemCard = (props) => {
    const {channelImg, channelName, sharePercent, price, chargeType} = props;

    const priceTag = price.discountStatus === 'Y' ? "特惠" : "原价";
    
    let priceCount = '';
    let priceProfit = ''
    
    if (chargeType=="absolutely") {
        if (price.discountStatus === 'Y') {
            priceCount = price.discount;
        } else {
            priceCount = price.amount;
        }

        priceProfit = priceCount * sharePercent;
    } else {
        priceCount = price.amount+"/"+price.chargeMonths+"月"
        priceProfit = price.amount * sharePercent;
    }
    // 预计受益最多保留三位小数
    const profitExpected = Math.floor(priceProfit / 100 * 1000) / 1000;



    return (
        <div className="channel-item-card">
            <div className="base-info">
                <div className="left-head"><img src={channelImg} alt="系列课图片"/></div>
                <div className="middle-info">
                    <p className="name">{channelName}</p>
                    <section className="price"><span className="money-tip">{priceTag}:</span>￥{priceCount}</section>
                    <section className="profit">
                        <span className="profit-item"><span className="money-tip">分成:</span>{sharePercent}%</span>
                        <span className="profit-item"><span className="money-tip">预计收益</span>￥{profitExpected}</span>
                    </section>
                </div>
            </div>
        </div>
    )
}

ChannelItemCard.propTypes = {
    // 原价
    price: PropTypes.object,
    // 收费类型
    chargeType: PropTypes.string,
    // 分成比率
    sharePercent: PropTypes.number,
    // 系列课名称
    channelName: PropTypes.string,
    // 系列课图片
    channelImg: PropTypes.string,
}

export default ChannelItemCard
