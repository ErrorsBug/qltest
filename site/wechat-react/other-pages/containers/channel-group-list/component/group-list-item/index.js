import React from 'react';
import PropTypes from 'prop-types';

const GroupListItem = props => {
    let price = Number(props.discountStatus === 'P' ? props.discountPrice : props.originPrice).toFixed(2);
    const subscrNum = props.subscrNum || 0;
    const groupNum = props.groupNum || 0;
    const handleBtnClick = (e) => {
        props.showBox(props.channelId, props.discountStatus, props.originPrice);
    }
    const routeToChannelDetail = (e) => {
        if (!e.target.classList.contains('add-group-button')) {
            location.href = `/live/channel/channelPage/${props.channelId}.htm`;
        }
    }
    return (
        <div className="group-list-item" onClick={routeToChannelDetail}>
            <div className="img" style={{backgroundImage:`url(${props.headImage})`}}></div>
            <div className="content">
                <p className="name">{props.name}</p>
                <div className="detail">
                    <p>
                        <span className="price">￥{price}</span>
                        <span className="subscr-num">{subscrNum}人订阅</span>
                    </p>
                    {
                        props.discountStatus === 'P'||props.discountStatus === 'GP' ? 
                        <span className="group-num">已团{groupNum}人</span> : 
                        <span 
                            className="add-group-button"
                            onClick={handleBtnClick}
                        >
                            开启拼课
                        </span>
                    }
                </div>
            </div>
        </div>
    );
};

GroupListItem.propTypes = {
    
};

export default GroupListItem;