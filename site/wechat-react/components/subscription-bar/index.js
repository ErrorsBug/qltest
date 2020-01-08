/*
 * 页面顶部订阅条
 */

import React from 'react';
import {locationTo} from 'components/util';

export default class SubscriptionBar extends React.Component{

    state = {
        showSubscriptionBar: this.props.show
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.show){
            typeof _qla != 'undefined' && _qla.collectVisible();
        }
        this.setState({
            showSubscriptionBar: nextProps.show
        })
    }
    close(){
        this.props.close && this.props.close();
    }

    /** 订阅操作 */
    subscribe(){
        this.props.subscribe && this.props.subscribe();
    }

    render(){
        return (
            <div className={`on-visible subscription-label-container ${this.state.showSubscriptionBar ? '' : 'hide'} `} log-pos="subscription-bar">
                <p>更多同类精品课程，点击订阅</p>
                <span className="subscription on-log" onClick={this.subscribe.bind(this)} log-pos="subscribe">订阅</span>
                <span className="close on-log" onClick={this.close.bind(this)} log-pos="subscribe-cancel"></span>
            </div>
        )
    }
}