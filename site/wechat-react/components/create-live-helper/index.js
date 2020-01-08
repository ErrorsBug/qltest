
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locationTo } from "components/util";

import { request } from 'common_actions/common'

class CreateLiveHelper extends Component {
    state = {
        // 是否有直播间
        hasLive: false,
    }
    componentDidMount() {
        if(!this.props.getHasLive){
            this.hasLive()
        }else{
            this.setState({hasLive: this.props.isHasLive})
        }
        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
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
        if(this.state.hasLive ){
            return null;
        }
        return (
            <div className="create-live-enter" onClick={()=>{locationTo(`/wechat/page/create-live?ch=${this.props.chtype}`)}}>
                <div className="head">
                    <img src=" https://img.qlchat.com/qlLive/liveCommon/normalLogo.png?x-oss-process=image/resize,h_120,w_120,m_fill" />
                </div>
                <div className="content">
                    <div className="name">创课小助手</div>
                    <div className="tips">每个人有自己的知识讲台<span>我要开课>></span></div>
                </div>
            </div>
        );
    }
}

CreateLiveHelper.propTypes = {

};

export default CreateLiveHelper;