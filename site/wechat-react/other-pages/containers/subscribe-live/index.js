import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { autobind } from 'core-decorators';
import {
    locationTo
} from 'components/util';

import {
    subscribe,
    getLiveInfo,
    liveGetFollowNum,
    focusLive,
} from '../../actions/subscribe-live';

import {
    isFollow,
} from 'common_actions/common'
@autobind
class SubscribeLive extends Component {
    state = {
        // 订阅状态
        subscribe: null,
        // 直播间logo
        logo: '',
        // 直播间名称
        name: '',
        // 直播间关注人数
        follwerNum: '',
    };

    // 切换锁🔒
    switchLock= false

    componentDidMount(){
        this.getLiveInfo()
        this.liveGetFollowNum()
        this.isFollow()
    }

    // 初始化默认关注直播间
    async focusLive(){
        const res = await focusLive('Y', this.props.location.query.liveId)
        console.log(res)
        if(res.state.code !== 0) {
            window.toast("初始化关注直播间失败")
        }
    }

    // 是否关注和订阅直播间
    async isFollow(){
        const res = await this.props.isFollow(this.props.location.query.liveId)
        if(res.state.code === 0) {
            this.setState({subscribe: res.data.isAlert})
            // 如果未关注则默认进行关注操作
            if(!res.data.isFollow) {
                this.focusLive()
            }
        }else {
            window.toast(res.state.msg)
        }
    }

    // 获取直播间信息
    async getLiveInfo(){
        const res = await this.props.getLiveInfo(this.props.location.query.liveId)
        if(res.state.code === 0){
            this.setState({
                logo: res.data.entity.logo,
                name: res.data.entity.name,
            })
        }
    }

    //获取直播间关注数
    async liveGetFollowNum(){
        const res = await this.props.liveGetFollowNum(this.props.location.query.liveId)
        if(res.state.code === 0){
            this.setState({
                follwerNum: res.data.follwerNum
            })
        }
    }

    /** 订阅直播间通知处理 */
    async subscribe(cancel){
        this.switchLock = true;
        const res = await this.props.subscribe({
            liveId: this.props.location.query.liveId,
            auditStatus: cancel ? 'N' : 'Y',
        })
        if(res.state.code === 0){
            if(res.data.isAlert) {
                this.setState({subscribe: true},()=>{
                    this.switchLock = false;
                })
                window.toast('订阅成功！')
            }else {
                this.setState({subscribe: false},()=>{
                    this.switchLock = false;
                })
                window.toast('取消订阅成功！')
            }
        }
    }

    switch(){
        if(!this.switchLock){
            this.subscribe(this.state.subscribe)
        }
    }

    render() {
        const {
            logo,
            name,
            subscribe,
            follwerNum,
        } = this.state
        return (
            <Page title="订阅直播间" className="subscribe-live-container">
                <div className="top">
                    <div className="tip">{subscribe ? '成功订阅该直播间开播通知' : '订阅该直播间开播通知'}</div>
                </div>
                <div className="detail-label">
                    <img src={logo} alt=""/>
                    <div className="right-label">
                        <div className="message">
                            <div className="title">{name}</div>
                            <span className="attention-count">{follwerNum}人关注</span>
                        </div>
                        {subscribe !== null &&
                            <div className={`switch ${subscribe ? 'on' : ''}`} onClick={this.switch}>
                                <span></span>
                            </div>
                        }
                    </div>
                </div>
                <div className="redirect" onClick={()=>{locationTo('/wechat/page/timeline/mine-focus')}}>管理我的直播间开播通知</div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        
    };
}

const mapActionToProps = {
    subscribe,
    getLiveInfo,
    liveGetFollowNum,
    isFollow,
}

module.exports = connect(mapStateToProps, mapActionToProps)(SubscribeLive);