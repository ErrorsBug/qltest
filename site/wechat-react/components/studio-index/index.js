const isNode = typeof window == 'undefined';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';
import { locationTo } from 'components/util';

import { FunctionMenu, FunctionBtn } from './components/function-menu'


class StudioIndex extends Component {

    state = {
        /* 功能菜单是否可见 */
        functionMenuVisible: false,

    }

    componentDidMount() {
    }

    showFunctionMenu(state) {
        this.setState({ functionMenuVisible: state })
    }

    getDomain = async (type) => {
        try{
            let result = await this.props.getDomainUrl({
                type,
            });
            if(result.state.code === 0){
                if(type === 'shortKnowledge'){
                    this.setState({
                        shortDomainUrl: result.data.domainUrl,
                    });
                }
            }
        }catch(err){
            console.log(err);
        }
        
    }

    render() {
        const liveId = this.props.liveId;
        const power = this.props.power || {};
        const activeIndex = this.props.activeIndex;
        return (
            <div>
                {this.props.children}
                <div className="co-live-footer">
                    <div className="footer-block-wrap">
                        <a
                            className={`footer-block ${activeIndex === "home" ? "active" : ""} on-log`}
                            data-log-region="live-footer-home"
                            onClick={() => locationTo(`/wechat/page/live/${liveId}`)} >
                                {
                                    power.allowMGLive ?
                                    "首页":"直播间主页" 
                                }
                        </a>
                    </div>

                    {
                        power.allowMGLive ?
                            <>
                                <div className="footer-block-wrap">
                                    <a
                                        className={`footer-block ${activeIndex === "admin" ? "active" : ""} on-log`}
                                        data-log-region="live-footer-admin"
                                        onClick={e => {e.preventDefault(); locationTo(`/wechat/page/backstage?liveId=${liveId}&qlfrom=qledu`)}}
                                    >
                                        工作台
                                    </a>
                                </div>
                                
                                {
                                    power.allowMGLive ?
                                        <FunctionBtn
                                            key='btn'
                                            showFunctionMenu={this.showFunctionMenu.bind(this)}
                                        /> : null
                                }

                                {
                                    power.allowMGLive &&
                                        <FunctionMenu
                                            key='menu'
                                            liveId={liveId}
                                            showFunctionMenu={this.showFunctionMenu.bind(this)}
                                            functionMenuVisible={this.state.functionMenuVisible}
                                            shortDomainUrl = {this.state.shortDomainUrl}
                                        />
                                }

                                <div className="footer-block-wrap">
                                    <a
                                        className={`footer-block ${activeIndex === "my-student" ? "active" : ""} on-log`}
                                        onClick={e => {e.preventDefault(); locationTo(`/wechat/page/my-student?liveId=${liveId}`)}}
                                    >
                                        学员 
                                    </a>
                                </div>
                                <div className="footer-block-wrap">
                                    <a
                                        className={`footer-block ${activeIndex === "notice" ? "active" : ""} on-log`}
                                        onClick={() => locationTo(`/wechat/page/notice-center?liveId=${liveId}`)} >
                                        <>
                                            {
                                                (this.props.newMessageCount !== undefined && this.props.newMessageCount !== null && this.props.newMessageCount > 0) ? 
                                                (<span className={`redspot ${this.props.newMessageCount < 10 ? "circle" : ""}`}>
                                                    {this.props.newMessageCount > 99 ? '99+' : this.props.newMessageCount}
                                                </span>)
                                                : 
                                                null
                                            }
                                            消息
                                        </>
                                    </a>
                                </div>
                            </>
                            :
                            <>
                                <div className="footer-block-wrap">
                                    <a
                                        className={`footer-block ${activeIndex === "student-center" ? "active" : ""}`}
                                        onClick={() => locationTo(`/wechat/page/live-studio/mine?fromLiveId=${liveId}`)} >
                                            学员中心
                                    </a>
                                </div>
                            </>
                    }
                </div>
            </div>
        );
    }
}


export default StudioIndex;
    
// 计算未读数量
function calUnreadNum(unreadMap) {
    if(!unreadMap) return;
    let sum = 0;
    Object.keys(unreadMap).forEach(key  => {
        sum += unreadMap[key];
    });
    return sum;
}