import React from 'react';

const BButtons = props => {
    return (
        <footer className={ `button-row-v2 ${props.className || ''}` }>
            {
                (props.isRelayChannel == 'Y' && props.isOrNotListen == 'N' && props.authStatus == 'N') ? 
                <a className='btn-a-lg color-excited on-log'
                   href={`/live/channel/channelPage/${props.sourceChannelId}.htm?orderNow=Y`}
                   data-log-name="立即购买系列课"
                   data-log-region="buy-btn"
                   data-log-pos="channel"
                >立即购买</a>
                :
                <span className='btn-lg color-excited' onClick={ props.gotoTopicDetail }>进入课程</span>
            }

            {/* <aside className="operation-icon" onClick={ props.onOperationClick }>
                <img src={ require('../../img/operation-icon.png') } />
                <span>操作</span>
            </aside> */}
        </footer>
    );
};

BButtons.defaultProps = {
    gotoTopicDetail: () => {},

    onOperationClick: () => {},
}

export default BButtons;
