import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import {
	getTopicListByChannel,
	setHomeworkRelatedCourse
} from '../../../../../actions/homework';
import {
	getChannelIdList
} from '../../../../../actions/channel'

import ScrollToLoad from 'components/scrollToLoad';


@autobind
class RelateCourse extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	state = {
		currentNav: 'course', // course, channel
		showCourseInChannelBox: false,
		courseList: [],
		courseNoMore: false,
		channelList: [],
		courseListInChannel: [],
		courseListInChannelNoMore: false
	};

	data = {
		currentCoursePage: 1,
		coursePageSize: 30,
		courseInChannelPage: 1,
		courseInChannelPageSize: 30
	};
	componentWillReceiveProps(props){

	}

	componentDidMount(){
		this.getTopicListByAll(this.data.currentCoursePage);
		this.getChannelIdList()
	}

	async getTopicListByAll(page){
		let result = await this.props.getTopicListByChannel({
			liveId: this.props.location.query.liveId,
			page: {
				page: page,
				size: this.data.coursePageSize
			}
		});

		if(result.data.topicList.length){
			this.setState({
				courseList: [
					...this.state.courseList,
					...result.data.topicList
				]
			});
		}
		if(result.data.topicList.length < this.data.coursePageSize){
			this.setState({
				courseNoMore: true
			});
			// this.data.currentCoursePage = 'no-more';
		}
	}
	async loadNextTopicListByAll(next){
		await this.getTopicListByAll(++this.data.currentCoursePage);
		next && next();
	}

	async getTopicListByChannel(page, channelId){
		let result = await this.props.getTopicListByChannel({
			channelId: channelId,
			page: {
				page: page,
				size: this.data.courseInChannelPageSize
			}
		});

		if(result.data.topicList){
			this.setState({
				courseListInChannel: [
					...(this.data.courseInChannelPage === 1 ? [] : this.state.courseListInChannel),
					...result.data.topicList
				]
			});
		}
		if(result.data.topicList.length === 0 || result.data.topicList.length < this.data.coursePageSize){
			this.setState({
				courseListInChannelNoMore: true
			});
			// this.data.courseInChannelPage = 'no-more';
		}
	}
	async loadNextTopicListByChannel(next){
		await this.getTopicListByChannel(++this.data.courseInChannelPage, this.data.currentChannelId);
		next && next();
	}

	async getChannelIdList(){
		let result = await this.props.getChannelIdList({
			liveId: this.props.location.query.liveId
		});

		if(result.data.courseList.length){
			this.setState({
				channelList: [
					...this.state.channelList,
					...result.data.courseList
				]
			});
		}
	}

	selectCourseHandle(topic){
		this.props.setHomeworkRelatedCourse(topic);
		sessionStorage.setItem('topic',JSON.stringify(topic));
		this.context.router.goBack();
	}
	removeRelatedCourseHandle(){
		this.props.setHomeworkRelatedCourse('');
		sessionStorage.setItem('topic','');
		this.context.router.goBack();
	}

	selectChannelHandle(channelId){
		if(this.data.currentChannelId != channelId){
			this.data.currentChannelId = channelId;
			this.setState({
				courseListInChannelNoMore: false
			},() => {
				this.getTopicListByChannel(this.data.courseInChannelPage = 1, channelId);
			});
		}
		this.setState({
			showCourseInChannelBox: true
		});
	}

    render() {
        return (
            <Page title="布置作业-关联课程" className="relate-course">
                <div className="nav">
                    <div className={`tab${this.state.currentNav === 'course' ? ' current' : ''}`} onClick={() => this.setState({currentNav: 'course'})}><span>单课</span></div>
                    <i className="split"></i>
                    <div className={`tab${this.state.currentNav === 'channel' ? ' current' : ''}`} onClick={() => this.setState({currentNav: 'channel'})}><span>系列课</span></div>
                </div>
                <div className="no-relate" onClick={this.removeRelatedCourseHandle}>不关联课程</div>
	            <div className={`list-wrapper${this.state.currentNav === 'channel' ? ' channel' : ''}`}>
		            <div className="course-list">
			            <ScrollToLoad
				            loadNext={this.loadNextTopicListByAll.bind(this)}
				            noMore={this.state.courseNoMore}
				            notShowLoaded={true}
			            >
			            {
			            	this.state.courseList.map((course, index) => {
								return <div className={`course-item${this.props.homeworkInfo.topicId == course.topicId ? ' selected' : ''}`} key={`course-item-${index}`} onClick={this.selectCourseHandle.bind(this, course)}>{course.name}</div>
				            })
			            }
			            </ScrollToLoad>
		            </div>
		            <div className="channel-list">
			            {
				            this.state.channelList.length ?
				            this.state.channelList.map((channel, index) => {
					            return <div className="channel-item" key={`channel-item-${index}`} onClick={this.selectChannelHandle.bind(this, channel.id)}>{channel.name}</div>
				            })
					            :
					            <div className="no-data">暂无系列课</div>
			            }
		            </div>
	            </div>
	            <div className={`course-in-channel-box${this.state.showCourseInChannelBox ? ' show' : ''}`}>
		            <div className="return-area">
			            <div className="return-btn" onClick={() => this.setState({showCourseInChannelBox :false})}>返回上一级</div>
		            </div>
		            <div className="course-list-in-channel">
			            <ScrollToLoad
				            loadNext={this.loadNextTopicListByChannel.bind(this)}
				            noMore={this.state.courseListInChannelNoMore}
				            notShowLoaded={true}
			            >
			            {
				            this.state.courseListInChannel.length ?
				            this.state.courseListInChannel.map((course, index) => {
					            return <div className={`course-item${this.props.homeworkInfo.topicId == course.topicId ? ' selected' : ''}`} key={`course-item-${index}`} onClick={this.selectCourseHandle.bind(this, course)}>{course.name}</div>
				            })
					            :
					            <div className="no-data">暂无课程</div>
			            }
			            </ScrollToLoad>
		            </div>
	            </div>
            </Page>
        );
    }
}

const mapDispatchToProps = {
	getChannelIdList,
	getTopicListByChannel,
	setHomeworkRelatedCourse
};
function mapStateToProps(state) {
    return {
	    homeworkInfo: state.homework.info
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(RelateCourse);