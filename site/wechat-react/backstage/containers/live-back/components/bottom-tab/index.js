import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locationTo } from 'components/util';


class BackstageBottomTab extends Component {
    render() {
        return (
            <div className="backstage-bottom">
                <div className="bottom-tab btn-index on-log" data-log-region="live-index-page" onClick={()=>{locationTo(`/wechat/page/live/${this.props.liveId}`)}}>直播间主页</div>
                <div className="bottom-tab btn-backstage active " >直播间后台</div>
			</div>
        );
    }
}
 BackstageBottomTab.propTypes = {
    liveId: PropTypes.string.isRequired,
};

export default BackstageBottomTab;