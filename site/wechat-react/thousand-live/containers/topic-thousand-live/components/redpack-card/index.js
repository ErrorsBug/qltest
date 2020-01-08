import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
// import shallowCompare from 'react-addons-shallow-compare';

/**
 * 课堂红包指南卡片
 */
class RedPackCard extends PureComponent {
    // state = {
    //     isClosed: false,
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return shallowCompare(this, nextProps, nextState);
    // }

    render() {
        return (
                <div ref="redPackCard" className="redpack-card" onClick={()=>{this.props.locationToRedpack()}}>
    				<div className="title"><div className="text">上课啦！ <br/>快来发个签到红包，活跃下气氛吧！</div></div>
    				<div className="btn">立即发红包，让用户签到<i className="icon_enter"></i></div>
                </div>
            );
    }
}

export default RedPackCard;
