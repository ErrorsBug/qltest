/**
 *
 * @author Dylan
 * @date 2018/5/14
 */
import React, { Component } from 'react';
import { autobind, throttle } from 'core-decorators';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BottomDialog from 'components/dialog/bottom-dialog';


@autobind
class CourseListDialog extends Component {

	state = {

	};

	data = {

	};

	componentDidMount() {

	}

	render() {
	    let userUnlockProcess = this.props.userUnlockProcess || {}
		if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-low");

        if (!portalBody) {
            return null;
		}
		
		return (
            createPortal(
                <ReactCSSTransitionGroup
                    transitionName="course-video-page-menu"
                    transitionEnterTimeout={3000}
                    transitionLeaveTimeout={3000}
                >
                    <BottomDialog
                        show = {this.props.isShow}
                        bghide = {true}
                        theme="empty"
                        onClose = {this.props.hideCourseListDialog}
                        className = "course-list-dialog"
					>
						<div className="co-dialog-bottom">
							<div className="head">
								课程列表
								<i className="icon_delete on-log"
									onClick={this.props.hideCourseListDialog}
									data-log-name="关闭课程列表按钮"
									data-log-region="close-course-list-dialog"
								></i>
							</div>
							<div className="item-wrap">
								{
									this.props.courseList.map((item, index) => {
                                        let isLock = false
                                        if (userUnlockProcess && userUnlockProcess.unlockStatus) {
                                            let {unlockStatus, unlockTopicId} = userUnlockProcess
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
										<div className={`list on-log ${item.startTime > this.props.sysTime ? 'disable' : ''} ${item.id == this.props.topicInfo.id ? 'select' : ''}  ${isLock ? 'is-lock' : ''}`}
											key={`list-${index}`}
											data-log-name="课程列表点击"
											data-log-region="course-dialog-item"
											onClick={_=> {this.props.jumpToCourse(item, isLock);this.props.hideCourseListDialog();}}
										>
											<div className="title">{ index+1 }. {item.topic}</div>
											{
												item.id == this.props.topicInfo.id &&(
													(
														<div className={ `same ${ !this.props.isPlay ? 'stop': '' }` }>
															<span className="line1"></span>
															<span className="line2"></span>
															<span className="line3"></span>
															<span className="line4"></span>
														</div>
													)
												)
											}
										</div>
									)})
								}
							</div>
						</div>
                    </BottomDialog>
                </ReactCSSTransitionGroup>,
            portalBody)
        );
	}
}


export default CourseListDialog
