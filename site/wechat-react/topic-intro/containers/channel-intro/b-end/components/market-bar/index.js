// 好像废弃了。。
import React from 'react';
import PropTypes  from 'prop-types';

const MarketBar = (props) => {
    return (
        <ul className='market-bar-container'>
            {
                // 转载系列课支持分销推广
                // !props.isRelay &&
                <li key='bo'>
                    <a href={`/wechat/page/channel-distribution-set/${props.channelId}`}>
                        <img className='market-distri' src={require('./img/market-distri.png')} alt=""/>
                        <span>分销推广</span>
                    </a>
                </li>
            }

            {
	            !props.isRelay &&
                <li key='psw'>
                    <a href={`/wechat/page/coupon-code/list/channel/${props.channelId}`}>
                        <img className='market-discount' src={require('./img/market-discount.png')} alt=""/>
                        <span>优惠券</span>
                    </a>
                </li>
            }

            {
	            !props.isRelay &&
                props.channelInfo &&
                props.channelInfo.chargeType === 'absolutely'
                ?
                <li key='ying'>
                    <a href={`/wechat/page/channel-market-seting?channelId=${props.channelId}`}>
                        <img className='market-sale' src={require('./img/market-sale.png')} alt=""/>
                        <span>课程促销</span>
                    </a>
                </li>
                :
                null
            }

            <li key='stat'>
                <a href={`/wechat/page/channel-topic-statistics?businessId=${props.channelId}&businessType=channel`}>
                    <img className='market-stat' src={require('./img/market-stat.png')} alt="" />
                    <span>数据统计</span>
                </a>
            </li>
        </ul>
    );
}

export default MarketBar;