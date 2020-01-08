import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate, imgUrlFormat, locationTo } from 'components/util';

import BottomDialog from 'components/dialog/bottom-dialog';

import {
    getCampCourseList,
    markLearnTopic,
} from '../../actions/camp'

function mstp(state) {
    return {
        sysTime: state.common.sysTime,
        courseList: state.camp.courseList,
    }
}

const matp = {
    getCampCourseList,
    markLearnTopic,
}


class CampHistoryCourse extends Component {
    constructor(props){
        super(props);
        this.campId = this.props.location.query.campId;
    }

    state = {
        noMore: false,
        page: 1,
        courseList: [],

        showActionSheet: false,
        activeItem: null,
    }

    componentDidMount = async () => {
        if(this.props.courseList && this.props.courseList.length > 0) {
            this.setState({
                courseList: this.props.courseList,
                page: 2,
                noMore: this.props.courseList.length < 10,
            })
        } else {
            this.loadNext()
        }
    }

    loadNext = async (next) => {
        const result = await this.props.getCampCourseList(this.campId, {
            page: this.state.page,
            size: 10
        })
        const list = this.state.courseList
        result.data && result.data.topics && result.data.topics.length  && result.data.topics.map(item => {
            list.push(item)
        })

        this.setState({
            page: this.state.page + 1,
            noMore: result.data && result.data.topics && result.data.topics.length < 10,
            courseList: list,
        })
        next && next()
    }  

    operationHandle = (item) => {
        this.setState({activeItem: item})
        this.showActionSheet()
    }

    showActionSheet = () => {
        this.setState({showActionSheet: true})
    }

    hideActionSheet = () => {
        this.setState({
            showActionSheet: false,
            activeItem: null
        })
    }

    onOperationItemClick = (key) => {
        switch(key) {
            case "prepare": 
                if(this.state.activeItem.isReply === 'Y') {
                    window.toast("答疑课不用预习和写作业哦")
                    return
                }
                locationTo('/wechat/page/camp-preview?topicId=' + this.state.activeItem.topicId)
                break;
            case "review": 
                if(this.state.activeItem.isReply === 'Y') {
                    window.toast("答疑课不用预习和写作业哦")
                    return
                }
                if(this.state.activeItem.homeworkIdList && this.state.activeItem.homeworkIdList[0]) {
                    locationTo(`/wechat/page/homework/details?id=${this.state.activeItem.homeworkIdList[0]}&topicId=${this.state.activeItem.topicId}`)
                } else {
                    window.toast("该课程暂无课后作业")
                }
                break;
            default: 
                return
        }
    }

    // gotoCourseHandle(style, topicId) {
    //     if (style == "video") {
    //         locationTo('/topic/details-video?topicId=' + topicId)
    //     } else {
    //         locationTo('/topic/details-listening?topicId=' + topicId)
    //     }
    // }

    gotoCourseHandle = async (style, topicId) => {
        await this.props.markLearnTopic(topicId)
        
        if (style == "video") {
            locationTo('/topic/details-video?topicId=' + topicId)
        } else {
            locationTo('/topic/details?topicId=' + topicId)
        }
    }

    render() {
        return (
            <Page title={'历史课程'} className='camp-history-course-list'>
                {
                    this.state.courseList.length > 0 && this.state.courseList[0].startTime < this.props.sysTime ?
                        <ScrollToLoad
                            className='camp-course-list'
                            loadNext={this.loadNext}
                            noMore={this.state.noMore}
                            notShowLoaded={false}
                        >
                            {
                                this.state.courseList.map((item, index) => {
                                    if (item.startTime < this.props.sysTime) {
                                        return (
                                            <li
                                                className='camp-course-list-item'
                                                key={"camp-course-list-item" + index}
                                                onClick={(e) => {
                                                    if (e.target.className !== "operation") {
                                                        this.gotoCourseHandle(item.style, item.topicId)
                                                    }
                                                }}
                                            >
                                                <div className="left"><img className='course-img' src={item.headImage + '@296h_480w_1e_1c_2o'} alt="" /></div>
                                                <div className="right">
                                                    <div className="name">{item.name}</div>
                                                    <div className="time">{formatDate(item.startTime)}</div>
                                                    <div className="third-con">
                                                        <div className="order">第{item.order}课</div>
                                                        <div className="operation" onClick={this.operationHandle.bind(this, item)}></div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    }
                                })
                            }
                        </ScrollToLoad>
                        :
                        <div className='nomore'> 暂无历史课程 </div>
            }


                <BottomDialog
                    show={this.state.showActionSheet}
                    theme={'list'}
                    items={
                        [
                            {
                                key: 'prepare',
                                content: '课前预习',
                                show: true,
                            },
                            {
                                key: 'review',
                                content: '课后复习',
                                show: true,
                            },
                        ]
                    }
                    close={true}
                    onClose={this.hideActionSheet}
                    onItemClick={this.onOperationItemClick}
                >
                </BottomDialog>
            </Page>
        );
    }
}

export default connect(mstp, matp)(CampHistoryCourse);
