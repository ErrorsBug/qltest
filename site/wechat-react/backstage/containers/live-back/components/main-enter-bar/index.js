import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locationTo } from 'components/util';


class QuickEnterBar extends Component {
    render() {
        return (
            <div className="main-enter-bar">
                <div className="main-enter btn-personal on-log" data-log-region="mine" onClick={()=>{locationTo('/wechat/page/mine')}}>个人中心</div>
                <div className="main-enter btn-setting on-log" data-log-region="live-setting" onClick={()=>{locationTo(`/live/entity/manage/${this.props.liveId}.htm`)}}>直播间设置
                </div>
            </div>
        );
    }
}

QuickEnterBar.propTypes = {

};

export default QuickEnterBar;