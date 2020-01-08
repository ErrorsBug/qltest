import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
// import shallowCompare from 'react-addons-shallow-compare';
import { locationTo } from "components/util";
import { request } from 'common_actions/common'

/**
 * 听课指南卡片
 */
class TipsCard extends PureComponent {
    state = {
        // 是否有直播间
        hasLive: false,
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return shallowCompare(this, nextProps, nextState);
    // }
    componentDidMount(){
        if(this.props.type === 'create-live'){
            this.hasLive();
        }
    }

    // 直播间列表
    async hasLive(){
        const result = await request({
            url: '/api/wechat/channel/getLiveList',
            method: 'GET'
        });
        if(result.state.code === 0){
            if(result.data.entityPo !== null){
                this.setState({hasLive: true})
            }
        }
    }

    render() {
        if(this.props.type === 'create-live'&& !this.state.hasLive){
            return (
                <ul ref="tipsCard" className="tips-card">
    				<div className="title">听课指南</div>
    				<li>文字互动请文明用语。</li>
                    <li>每个人都有自己的课堂。<span className="btn-create-live-enter" onClick={()=>{locationTo(`/wechat/page/create-live?ch=${this.props.chtype}`)}}>我要开课>></span></li>
                </ul>
            );
        }else if(this.props.type === 'normal'){
            return (
                <ul ref="tipsCard" className="tips-card">
    				<div className="title">听课指南</div>
    				<li>听不到声音请往下翻，点击语音即可播放，并确认手机没有静音。</li>
    				<li>课程语音永久保留，无限复听。</li>
    				<li>遇到卡顿和加载不出，点返回，重新进入即可。</li>
                </ul>
            );
        }else{
            return null;
        }
        
    }
}

export default TipsCard;
