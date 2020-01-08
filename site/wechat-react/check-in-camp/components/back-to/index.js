import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { autobind, throttle } from 'core-decorators';

import { locationTo } from 'components/util';
import { getUrlParams } from 'components/url-utils'

@autobind
class BackTo extends Component {

    state = {
        // 底部悬停按钮是否显示
        show: false,
    }

    data = {
    }


    componentDidMount(){
    }

    /**
     * 回到直播间主页
     */
    backToLive(){
        locationTo(`/wechat/page/live/${this.props.liveId}`)
    }
    /**
     * 回到直播间主页
     */
    gotoCoupon() {
        let campId = getUrlParams('campId');
        locationTo(`/wechat/page/coupon-code/exchange/camp/${campId}`)
    }




    render(){
        return (
            <div className="back-to-buttons">
                {
                    this.props?.campInfo?.price > 0 && this.props?.client === 'C' && this.props?.payStatus === 'N' ?
                        <div className="back-to-button goto-coupon" onClick={this.gotoCoupon}></div>
                    : null
                }
                {
                    this.props.client === 'C' ?
                        <div className="back-to-button goto-live" onClick={this.backToLive}></div>
                    :null
                }
            </div>
        )
    }
}

BackTo.propTypes = {
    // 直播间id
    liveId: PropTypes.string,
    // B端或C端
    client: PropTypes.string
}

export default BackTo;