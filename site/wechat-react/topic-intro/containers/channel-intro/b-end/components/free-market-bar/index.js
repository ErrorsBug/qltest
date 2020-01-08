import React from 'react';
import PropTypes  from 'prop-types';

const FreeMarketBar = (props) => {
    return (
        <ul className='market-bar-container'>
            <li key='stat'>
                <a href={`/wechat/page/channel-topic-statistics?businessId=${props.channelId}&businessType=channel`}>
                    <img className='market-stat' src={require('./market-stat.png')} alt="" />
                    <span>数据统计</span>
                </a>
            </li>
        </ul>
    );
}

export default FreeMarketBar;