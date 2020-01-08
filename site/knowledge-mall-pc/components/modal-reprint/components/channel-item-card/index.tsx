import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './style.scss';

function onEditClick(channelId, e) {
    // if (e.target.className)
    if (e.target.classList.contains(styles.rightBtn)) return;
    window.location.href = `/live/channel/channelPage/${channelId}.htm?v=${Date.now()}`;
}

const ChannelItemCard = (props) => {
    const priceTag = props.discountStatus === 'Y' ? "特惠" : "原价";
    let priceAmount:any = 0;
    if (props.chargeMonths != 0) {
        priceAmount =  props.reprintChannelAmount + "/" + props.chargeMonths + "月";
    } else {
        priceAmount = props.discountStatus === 'Y' ? props.reprintChannelDiscount : props.reprintChannelAmount;
    }
    const priceTip = props.userAdminLevel === 'super-agent' ? '' : `(分成比例 ${props.selfMediaPercent}%)`


    return (
        <div className="channel-item-card" onClick={(e) => onEditClick(props.reprintChannelId, e)}>
            <div className="base-info">
                <div className="left-head" style={{backgroundImage: `url(${props.reprintChannelImg}?x-oss-process=image/resize,m_fill,limit_0,h_148,w_240)`}}></div>
                <div className="middle-info">
                    <p className="top">{props.reprintChannelName}</p>
                    {
                        props.itemType === 'reprint-item' ?
                        <p className="middle">
                            {`${priceTag}：¥${priceAmount}${priceTip}`}
                        </p>  : null
                    }
                    <p className="bottom">
                        {
                            props.itemType === 'reprint-item' ?
                            <span className="income">预计收益：¥{props.selfMediaProfit}</span> :
                            ` ${priceTag}：¥${priceAmount}${priceTip}`
                        }
                    </p>
                    {
                        props.itemType === 'market-item' ?
                        <span className="profile">
                            <span className="left">预计收益：¥</span>
                            <span className="right">{props.selfMediaProfit}</span>
                        </span> : null 
                    }
                </div>
                {
                    props.itemType === 'manage-item'?
                    <div className={`right-mark ${props.upOrDown === 'up' ? '': 'disable-mark'}`}>
                        <span>{props.upOrDown === 'up' ? '转载中' : '已下架'}</span>
                    </div> :
                    null
                }
                {
                    props.userAdminLevel === 'super-agent'?
                    <div className={`right-btn`} onClick={props.onTweetBtnClick}>
                        查看推文
                    </div> :
                    null
                }
            </div>
            {
                props.itemType === 'manage-item' ?
                <div className={`income-info ${props.upOrDown === 'down' ? 'disable-income' : ''}`}>
                    <span>预计收益：¥{props.selfMediaProfit || 0}</span>
                    <span>累计售卖：{props.orderTotalNumber || 0}单</span>
                    <span>总收入：¥{props.orderTotalMoney || 0}</span>
                </div> :
                null
            }

        </div>
    )
}

ChannelItemCard.propTypes = {
    // 类型 reprint-item || manage-item
    itemType: PropTypes.string,
    // 三方id
    tweetId: PropTypes.string,
    // 三方推文链接
    tweetUrl: PropTypes.string,
    // 当前直播间 liveId
    liveId: PropTypes.string,
    // 被转播的课程直播间 liveId
    reprintLiveId: PropTypes.string,
    // 被转播的系列课 id
    reprintChannelId: PropTypes.string,
    // 被转播的系列课名称
    reprintChannelName: PropTypes.string,
    // 被转播的系列课头图
    reprintChannelImg: PropTypes.string,
    // 被转播的系列课原价
    reprintChannelAmount: PropTypes.number,
    // 当前直播间分成比例
    selfMediaPercent: PropTypes.number,
    // 当前直播间分成收益
    selfMediaProfit: PropTypes.number,
    // 是否可以转播
    isRelay: PropTypes.string,
    discountStatus: PropTypes.string,

}

export default ChannelItemCard
