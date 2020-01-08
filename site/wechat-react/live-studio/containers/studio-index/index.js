const isNode = typeof window == 'undefined';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';
import { locationTo } from 'components/util';

import LiveMainDispatcher from '../live';
import { getDomainUrl } from 'common_actions/common';
import StudioIndexBottomBar from 'components/studio-index';
import { FunctionMenu, FunctionBtn } from './components/function-menu'
import {
    getUnreadCount
} from '../../actions/notice-center';

const PATH_MAP = {
    "notice-center": "notice",
    "live": "home",
    "mine": "student-center"
}
/**
 * 专业版的主页容器
 */
@withRouter
class StudioIndex extends Component {

    state = {
        /* 功能菜单是否可见 */
        functionMenuVisible: false,
        activeIndex: null
    }

    componentDidMount() {
        if(this.props.power.allowMGLive) {
            const liveId = this.props.liveId || this.props.params.liveId
            // 获取未读消息数量
            this.props.getUnreadCount(liveId);
            this.getDomain('shortKnowledge');     
        }
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
            console.log(err)
        }
        
    }

    render() {
        const liveId = this.props.liveId || this.props.params.liveId || this.props.location.query.liveId;
        const activeIndex = getActiveIndex(this.props.location.pathname);
        console.log(activeIndex, this.props.location.pathname);
        return (
            <div>
                { this.props.children }

                <StudioIndexBottomBar 
                    power={this.props.power}
                    newMessageCount={this.props.newMessageCount}
                    shortDomainUrl={this.state.shortDomainUrl}
                    activeIndex={activeIndex}
                    liveId={liveId}
                />

            </div>
        );
    }
}

StudioIndex.propTypes = {
};

function mapStateToProps (state) {
    return {
        liveId: state.live.liveInfo.entity && state.live.liveInfo.entity.id,
        power: state.live.power,
        unreadMap: state.noticeCenter.unreadMap,
        newMessageCount: calUnreadNum(state.noticeCenter.unreadMap),
    }
}

const mapActionToProps = {
    getUnreadCount,
    getDomainUrl
}


export default connect(mapStateToProps, mapActionToProps)(StudioIndex);

    
// 计算未读数量
function calUnreadNum(unreadMap) {
    if(!unreadMap) return;
    let sum = 0;
    Object.keys(unreadMap).forEach(key  => {
        sum += unreadMap[key];
    });
    return sum;
}

function getActiveIndex(path) {
    switch(true) {
        case path.indexOf("notice-center") >= 0:
            return PATH_MAP["notice-center"]
        case path.indexOf("/wechat/page/live/") >= 0:
            return PATH_MAP["live"]
        case path.indexOf("live-studio/mine") >= 0:
            return PATH_MAP["mine"]
        default:
            return ;
    }
}