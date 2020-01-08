import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import BottomDialog from 'components/dialog/bottom-dialog';
import ScrollToLoad from 'components/scrollToLoad';
import { stringify } from 'querystring';
import { fixScroll } from 'components/fix-scroll';

import { locationTo } from '../../../../../components/util';
import { getUrlParams } from '../../../../../components/url-utils';

import {
    fetchCourseList,
} from '../../../../actions/common'

@autobind
class CourseListDialog extends Component {
    state = {
        isNoMore: false,
        noData: false,
        courses: [],
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
            this.setState({
                courses: [...this.state.courses, ...list],
                userUnlockProcess
            }, () => {
	            this.props.setCourseList && this.props.setCourseList(this.state.courses);
            })
        }
    }

    async loadNext(next){
        await this.fetchCourseList(++this.data.page)
        next && next()
    }

    jump(style, id, isLock = false){
        // 未解锁不允许跳转
        if(isLock) {
            return
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
            }else if (/^(video|audio)$/.test(style)) {
                locationTo(`/topic/details-video?${queryResult}`);
                return true;
            } else if(/^(normal|ppt)$/.test(style)){
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
        this.props.onCloseSettings()
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
                <div className="head">课程列表</div>
                <div className="course-portal-content">
                    <ScrollToLoad
                        className={"course-scroll-box"}
                        toBottomHeight={300}
						noneOne={this.state.noData}
                        loadNext={ this.loadNext }
                        noMore={this.state.isNoMore}
                    >
                        {
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
                                    <div className={ `list ${item.id == this.props.topicInfo.id ? 'select' : ''} ${isLock ? 'is-lock' : ''}` } key={`list-${index}`} onClick={()=>{this.jump(item.style,item.id, isLock)}}>
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
                        }
                    </ScrollToLoad>
                </div>
                <div className="cancel" onClick={this.props.hideCourseListDialog}></div>
            </BottomDialog>
        )
    }
}

function mapStateToProps(state){
    return {

    }
}

const mapActionToProps = {
    fetchCourseList,
}

export default connect(mapStateToProps, mapActionToProps)(CourseListDialog)
