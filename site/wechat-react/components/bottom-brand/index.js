import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locationTo, isLogined } from 'components/util'
import { request, getAllConfig } from 'common_actions/common';
import { autobind } from 'core-decorators';

@autobind
class BottomBrand extends Component {
    state = {
        url:'',
        // 是否是专业版
        isLiveAdmin: 'Y',
        // 是否是官方直播间
        isOfficialLive: false,
        // 是否是白名单
        isWhite: 'N',
        // 是否有直播间
        hasLive: false,
    }
    componentDidMount() {
        this.setState({
            url:window.location.href
        })
        this.initStatus()
        if(isLogined()){
            this.hasLive()
        }
        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    // 初始化各种数据
    async initStatus(){
        const result = await getAllConfig({liveId: this.props.liveId})
        if(result.state.code === 0){
            this.setState({
                isLiveAdmin: result.data.isLiveAdmin,
                isOfficialLive: result.data.isOfficialLive,
                isWhite: result.data.isWhite,
            })
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

    iWantCreateClass() {
        if(this.props.createAdvance === true) {
            locationTo(`/wechat/page/activity-entrance`)
        } else {
            locationTo(`/wechat/page/create-live?ch=${this.props.chtype}`)
        }
    }

    goHelpCenter = () => {
        locationTo(`/wechat/page/help-center?role=student&liveId=${this.props.liveId}`)
    }

    render() {
        if(this.state.isLiveAdmin === 'N'){
            let idParams = '';
            if(this.props.channelId){
                idParams = '&channelId=' + this.props.channelId;
            }else if(this.props.topicId){
                idParams = '&topicId=' + this.props.topicId;
            }else if(this.props.liveId){
                idParams = '&liveId=' + this.props.liveId;
            }else if(this.props.campId){
                idParams = '&campId=' + this.props.campId;
            }
            return (
                <div className="bottom-branch-bar" >
                    <div className="button-list">
                        {
                            this.props.liveisBindApp && 
                            <div className="on-log" data-log-region="footFocus" onClick={this.props.onFocusUs}>关注我们</div>
                        }
                        {
                            (!this.state.hasLive && ( this.state.isOfficialLive || this.state.isWhite == 'N')) && 
                            <div className="on-log" data-log-region="footCreate" onClick={this.iWantCreateClass}>我要创课</div>
                        }
                        <div className="on-log" data-log-region="footMine" onClick={()=>{locationTo('/wechat/page/mine')}}>个人中心</div>
                        <div onClick={()=>{locationTo(`/wechat/page/complain-reason?link=${encodeURIComponent(this.state.url)}${idParams}`)}}>投诉举报</div>
                        <div className="on-log" data-log-region="footHelp" onClick={this.goHelpCenter}>帮助中心</div>
                    </div>
                    
                    <div className="tec-logo">提供技术支持</div>
                </div>
            );
        }else{
            return (
                <div className="bottom-branch-bar" >
                    <div className="button-list">
                        {
                            this.props.liveisBindApp && 
                            <div className="on-log" data-log-region="footFocus" onClick={this.props.onFocusUs}>关注我们</div>
                        }
                        <div className="on-log" data-log-region="footHelp" onClick={this.goHelpCenter}>帮助中心</div>
                    </div>
                    
                    {
                        this.state.isOfficialLive && 
                        <div className="tec-logo">提供技术支持</div>
                    }
                </div>
            )
        }
        
    }
}

BottomBrand.propTypes = {

};

export default BottomBrand;