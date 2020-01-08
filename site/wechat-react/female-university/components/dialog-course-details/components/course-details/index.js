
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
	componentDidMount=()=>{
		this.props.isHideIntro&&this.tabHandle( "course")
	}
	tabHandle (key) {
		this.setState({
			currentTab: key
		}, () => {
			this.refs.scrollBox.scrollTop = 0
		})
	}

    onClickTopicItem = topic => {
		this.props.audioPlay && this.props.audioPlay(this.props.businessType, topic.id, topic.sourceTopicId)
		 
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
			isHideIntro,
			tabTitle=[]
		} = this.props

		const {
			currentTab
		} = this.state

		return (
			<div className="finance-course-details">
				<div className="layer" onClick={close}></div>
				<div className="details-container">
					<div className="tab-bar">
						{
							!isHideIntro&&
							<div 
								className={`tab-item ${this.state.currentTab == "intro" ? " active" : ""}`}
								onClick={this.tabHandle.bind(this, "intro")}
								>{tabTitle[0]||'课程简介'}</div>
						}
						{
							businessType === 'channel' && (
								<div 
									className={`tab-item ${this.state.currentTab == "course"&&!isHideIntro ? " active" : ""}`}
									onClick={this.tabHandle.bind(this, "course")}
									>{tabTitle[1]||'听课列表'}</div>
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
							noneOne={courseDetails.topicList==0}
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