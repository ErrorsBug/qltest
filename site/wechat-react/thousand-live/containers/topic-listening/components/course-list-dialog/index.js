import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import BottomDialog from 'components/dialog/bottom-dialog';
import ScrollToLoad from 'components/scrollToLoad';
import { stringify } from 'querystring';
import { fixScroll } from 'components/fix-scroll';

import { locationTo, getVal } from '../../../../../components/util';
import { getUrlParams } from '../../../../../components/url-utils';

import {
    fetchCourseList,
    getReceiveTopicList,
} from '../../../../actions/thousand-live-common'

import { getSysTime } from '../../../../actions/common';

@autobind
class CourseListDialog extends Component {
    state = {
        isNoMore: false,
        noData: false,
        courses: [],
        serverTime: Date.now(),
        initReceiveList: false,
        receiveList: [],
        userUnlockProcess: {}
    }
    data = {
        page: 1,
        size: 20,
    }

    componentDidMount(){
        if(this.props.topicInfo.channelId){
            this.fetchCourseList(this.data.page)
        }else{
            this.setState({
	            courses: [this.props.topicInfo]
            })
        }

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.canListenByShare === true && !this.state.initReceiveList){
            this.getReceiveTopicList()
            setTimeout(() => {
                typeof _qla != 'undefined' && _qla.collectVisible();
            }, 0);
        }
    }

    // 获取用户已领取某系列课下的课程列表
    async getReceiveTopicList(){
        const result = await getReceiveTopicList(this.props.topicInfo.channelId)
        if(result.state.code === 0){
            this.setState({
                initReceiveList: true,
                receiveList: result.data.list
            }, ()=>{
                if(this.state.receiveList.length > 0){
                    this.setState({
                        courses: this.updateCourse(this.state.courses)
                    })
                }
            })
        }
    }

    // 更新课程的分享状态
    updateCourse(list){
        let newList = list.map(item => {
            if(this.state.receiveList.find(i => i == item.id)){
                return {
                    share: true,
                    ...item
                }
            }else {
                return {
                    share: false,
                    ...item,
                }
            }
        })
        return newList
    }

    /**获取课程列表 */
    async fetchCourseList(page){
        const result = await this.props.fetchCourseList(this.props.topicInfo.channelId, this.props.topicInfo.liveId, page, this.data.size)
        let userUnlockProcess = result.data.userUnlockProcess || {}
        if(result.state.code === 0) {
            let list = result.data.topicList
            if (page == 1 && (!list || !list.length)){
                this.setState({noData: true})
            }else if (!list.length || list.length < this.data.size) {
                this.setState({isNoMore: true})
            }
            if(this.props.canListenByShare){
                list = this.updateCourse(list)
            }
            this.setState({
                courses: [...this.state.courses, ...list],
                userUnlockProcess
            }, () => {
	            this.props.setCourseList && this.props.setCourseList(this.state.courses);
            });
        }
    }

    async loadNext(next){
        await this.fetchCourseList(++this.data.page)
        next && next()
    }

    jump(data, isLock = false){
        if(isLock) {
            return
        }
        const { id, style } = data;
        if (data.startTime > this.props.sysTime) {
            return;
        }

        // 点击同一个话题不跳转
        if (this.props.topicInfo.id != id) {
            const urlList = getUrlParams();
            delete urlList['showDialogMoreInfo'];
            const data = {
                ...urlList,
                topicId: id,
            }
            const queryResult = stringify(data);
            // 如果话题类型是音视频，就跳到音视频
            if (/^(audioGraphic|videoGraphic)$/.test(style)) {
                locationTo(`/topic/details-audio-graphic?${queryResult}`);
                return true;
            } else if (/^(graphic)$/.test(style)) {
                // 小图文类型
                locationTo(`/wechat/page/detail-little-graphic?${queryResult}`);
                return true;
            }else if (/^(video)$/.test(style)) {
                locationTo(`/topic/details-video?${queryResult}`);
                return true;
            } else if(/^(normal|ppt|audio)$/.test(style)){
                locationTo(`/topic/details?${queryResult}`);
                return true;
            } else {
                return false;
            }
        }else {
            return false;
        }
    }

    // 请好友免费听来源课程 点击跳转（只有来自于分享的，以及试听的课程可以跳转）
    inviteFreeJump(data){
        const { id, style, share, isAuditionOpen } = data;
        // 点击同一个话题不跳转
        if ((share || isAuditionOpen === 'Y') && this.props.topicInfo.id != id) {
            const urlList = getUrlParams();
            delete urlList['showDialogMoreInfo'];
            const data = {
                ...urlList,
                topicId: id,
            }
            const queryResult = stringify(data);
            // 如果话题类型是音视频，就跳到音视频
            if (/^(audioGraphic|videoGraphic)$/.test(style)) {
                locationTo(`/topic/details-audio-graphic?${queryResult}`);
                return true;
            } else if (/^(graphic)$/.test(style)) {
                // 小图文类型
                locationTo(`/wechat/page/detail-little-graphic?${queryResult}`);
                return true;
            }else if (/^(video)$/.test(style)) {
                locationTo(`/topic/details-video?${queryResult}`);
                return true;
            } else if(/^(normal|ppt|audio)$/.test(style)){
                locationTo(`/topic/details?${queryResult}`);
                return true;
            } else {
                return false;
            }
        }else {
            return false;
        }
    }

    hide(){
        this.props.hideCourseListDialog()
        // this.props.onCloseSettings()
    }

    render(){
        return(
            <BottomDialog
                show = {this.props.showCourseListDialog}
                bghide = {true}
                theme="empty"
                onClose = {this.hide}
                className = "course-portal-container"
            >
                <div className="head">{ this.props.isListenBook ? '听书列表' : this.props.isNewsTopic ? "播放列表" : "课程列表" }</div>
                <div className="course-portal-content">
                    <ScrollToLoad
                        className={"course-scroll-box"}
                        toBottomHeight={300}
						noneOne={this.state.noData}
                        loadNext={ this.loadNext }
                        noMore={this.state.isNoMore}
                    >
                        {
                            this.props.canListenByShare ?
                            (
                                this.state.courses.length > 0 && this.state.courses.map((item,index)=>{
                                    let isLock = false
                                    if (this.state.userUnlockProcess && this.state.userUnlockProcess.unlockStatus) {
                                        let {unlockStatus, unlockTopicId} = this.state.userUnlockProcess
                                        if (unlockStatus === 'wait' || unlockStatus === 'unPay') {
                                            if (unlockTopicId == item.id) {
                                                isLock = false
                                            } else {
                                                isLock = true
                                            }
                                        } else {
                                            isLock = false
                                        }
                                        if (item.isAuditionOpen === 'Y' || this.props.isBussiness) {
                                            isLock = false
                                        }
                                    }
                                    return (
                                        <div
                                            className={`on-log list ${item.share || item.isAuditionOpen === 'Y' ? '' : 'disable'} ${isLock ? 'is-lock' : ''}`}
                                            key={`list-${index}`}
                                            data-log-region="voice-simple"
                                            data-log-pos="list-listen"
                                            onClick={()=>{this.inviteFreeJump(item, isLock)}}
                                        >
                                            <div className="title">{item.topic}</div>
                                            {
                                                item.share && <span className="share">好友分享</span>
                                            }
                                            {
                                                item.isAuditionOpen === 'Y' && <span className="test">试听</span>
                                            }
                                            {
                                                // item.id == this.props.topicInfo.id && <span className="same"></span>
                                            }
                                        </div>
                                    )
                                })
                            ) : (
                                this.state.courses.length > 0 && this.state.courses.map((item,index)=>{
                                    let isLock = false
                                    if (this.state.userUnlockProcess && this.state.userUnlockProcess.unlockStatus) {
                                        let {unlockStatus, unlockTopicId} = this.state.userUnlockProcess
                                        if (unlockStatus === 'wait' || unlockStatus === 'unPay') {
                                            if (unlockTopicId == item.id) {
                                                isLock = false
                                            } else {
                                                isLock = true
                                            }
                                        } else {
                                            isLock = false
                                        }
                                        if (item.isAuditionOpen === 'Y' || this.props.isBussiness) {
                                            isLock = false
                                        }
                                    }
                                    return (
                                        <div className={`list ${item.startTime > this.props.sysTime ? 'disable' : ''} ${item.id == this.props.topicInfo.id ? 'select' : ''} ${isLock ? 'is-lock' : ''}`} key={`list-${index}`} onClick={()=>{this.jump(item, isLock)}}>
                                            <div className={ `title` }>{ index+1 }. {item.topic}</div>
                                            {
                                                item.id == this.props.topicInfo.id && (
                                                    <div className={ `same ${ !this.props.isPlay ? 'stop': '' }` }>
                                                        <span className="line1"></span>
                                                        <span className="line2"></span>
                                                        <span className="line3"></span>
                                                        <span className="line4"></span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                })
                            )
                        }
                    </ScrollToLoad>
                </div>
                {
                    this.props.canListenByShare ?
                    <div className="btn-group">
                        <div className="btn btn-cancel" onClick={this.props.hideCourseListDialog}>关闭</div>
                        <div className="btn btn-purcase on-log on-visible" data-log-region="voice-simple" data-log-pos="once-buy" onClick={this.props.jumpToChannelIntro}>一键购买</div>
                    </div>
                    :
                    <div className="cancel" onClick={this.props.hideCourseListDialog}></div>
                }
            </BottomDialog>
        )
    }
}

function mapStateToProps(state){
    return {
        sysTime: state.common.sysTime
    }
}

const mapActionToProps = {
    fetchCourseList,
    getSysTime,
}

export default connect(mapStateToProps, mapActionToProps)(CourseListDialog)
