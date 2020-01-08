
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import ChannelCourseIntro from '../channel-course-intro';
import TopicList from '../topic-list';
import TopicCourseIntro from '../topic-course-intro';
import ScrollToLoad from 'components/scrollToLoad';
import {
	locationTo,
} from 'components/util';
class MasterCourseDetails extends PureComponent {

    state = {
		currentTab: 'intro',
	}
	
	tabHandle (key) {
		this.setState({
			currentTab: key
		}, () => {
			this.refs.scrollBox.scrollTop = 0
		})
	}

    onClickTopicItem = topic => {
		if(topic.style.match(/audio/) && topic.isAuditionOpen === 'Y') {
			this.props.audioPlay && this.props.audioPlay(topic.id, topic.sourceTopicId)
		} else if (topic.style.match(/video/)) {
			if (this.props.courseDetails.isAuth || topic.isAuthTopic) {
				locationTo(`/topic/details?topicId=${topic.id}`)
			} else {
				locationTo(`/wechat/page/topic-intro?topicId=${topic.id}`);
			}
		} else {
		    window.toast('开通会员后可免费畅听')
	    }
	};
	
	render(){

		const { 
			courseDetails,
			businessId,
			businessType,
			close,
			playerTopicId,
			playerStatus,
			loadMoreTopicList,
			noMore,
		} = this.props

		const {
			currentTab
		} = this.state

		return (
			<div className="master-course-details">
				<div className="layer" onClick={close}></div>
				<div className="details-container">
					<div className="tab-bar">
						<div 
							className={`tab-item ${this.state.currentTab == "intro" ? " active" : ""}`}
							onClick={this.tabHandle.bind(this, "intro")}
							>课程简介</div>
						{
							businessType === 'channel' && (
								<div 
									className={`tab-item ${this.state.currentTab == "course" ? " active" : ""}`}
									onClick={this.tabHandle.bind(this, "course")}
									>听课列表</div>
							)
						}
						<div className="close-btn" onClick={close}>
							<span className="icon icon_delete"></span>
						</div>
					</div>
					
					<ScrollToLoad
							ref="scrollBox"
							className={"master-course-details-container"}
							loadNext={loadMoreTopicList}
							noMore={noMore}
							disable={currentTab !== "course"}
						>
						{/* 课程介绍 */}
						{
							currentTab === "intro" && businessType === 'channel' && (
								<ChannelCourseIntro
									channelId={businessId}
									channelSummary={courseDetails.summary && courseDetails.summary.content || ''}
									channelDesc={courseDetails.desc}
								/>
							)
						}
						{
							currentTab === "intro" && businessType === 'topic' && (
								<TopicCourseIntro
									topicInfo = {courseDetails.info}
									profileList = {courseDetails.desc}
									topicSummary={courseDetails.summary && courseDetails.summary.content || ''}
								/>
							)
						}
						
						{/* 课程列表 */}
						{
							currentTab === "course" && (
								<TopicList
									list={courseDetails.topicList || []}
									playerTopicId={playerTopicId}
									playerStatus={playerStatus}
									onClickItem={this.onClickTopicItem}
								/>
							)
						}
					</ScrollToLoad>
				</div>
			</div>
		)
	}
}

export default MasterCourseDetails;