import React from 'react';
import PropTypes from 'prop-types';
import { api,getAllConfig } from 'common_actions/common'
import {locationTo,getCookie} from 'components/util';
import {fillParams} from 'components/url-utils';

export default class ComplainFooter extends React.Component{
    constructor(props){
        super(props)
    }

    state = {
        // 是否是专业版
        isLiveAdmin: 'N',
        // 是否是官方直播间
        isOfficialLive: false,
        // 是否是白名单
        isWhite: 'N',
        // 是否有直播间
        hasLive: false,
    }

    componentDidMount(){
        this.initStatus()
        if (getCookie('userId')) {
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
        const result = await api({
            url: '/api/wechat/channel/getLiveList',
            method: 'GET'
        });
        if(result.state.code === 0){
            if(result.data.entityPo !== null){
                this.setState({hasLive: true})
            }
        }
    }

    locationToCreateLive() {
		// const qlform = this.props.router.location.query.qlfrom ? 'qledu' : ''
		// const liveId = this.props.liveData && this.props.liveData.id || ''
		const resTime = Date.now()
		// const fromLiveId = this.state.fromLiveId || ''
		// const ch = 'center'

		const url = fillParams({resTime}, '/wechat/page/create-live?ch=create-live_admin_channel')

		locationTo(url) 
	}


    render(){
        return (
                <div className="footer-container">
                    {
                        (!this.state.hasLive && ( this.state.isOfficialLive || (this.state.isWhite == 'N' && this.state.isLiveAdmin == "N"))) && 
                        <div className="creat-studio on-visible on-log" data-log-region="channelPageCreatStudioBtn" onClick={this.locationToCreateLive.bind(this)}>我也要创建直播间</div>
                    }
                    {
                        this.state.isLiveAdmin === 'N' ?
                        <div className="complain-footer">
                            <span className="qlchat"></span>
                            <i>千聊提供技术支持</i>
                            <a href={`/wechat/page/complain-reason?channelId=${this.props.channelId}&link=${encodeURIComponent(this.props.pageUrl)}`} className="qianliao-complain">
                                <span>投诉举报</span>
                            </a>
                        </div>:null
                    }
                </div>
            )
    }
}
