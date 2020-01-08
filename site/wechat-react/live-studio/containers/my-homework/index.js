/**
 * Created by dylanssg on 2017/6/13.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from 'components/page';
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad'
import { getMyAnsweredList } from 'studio_actions/my-homework'
import {
	dangerHtml
} from 'components/util';

class MyHomework extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	state = {
		homeworkList : [],
		pageSize: 20,
		pageNum: 1,
		noMore: false,

		showEmptyBox: false
	};

	componentDidMount() {
		this.loadMoreCourse();
	}

	get liveId(){
		return this.props.location.query.liveId
	}
	
	loadMoreCourse = async (next) => {

		let homework = [...this.state.homeworkList]

		var result = await this.props.getMyAnsweredList({
			page: {
				page: this.state.pageNum,
				size: this.state.pageSize
			},
			liveId:this.liveId,
		});

		if(this.state.pageNum === 1 && (!result.data || !result.data.dataList || !result.data.dataList.length)){
			this.setState({
				showEmptyBox: true
			});
		}

		if (!result.data || !result.data.dataList || result.data.dataList.length < this.state.pageSize) {
			this.setState({
				noMore: true
			})
		}

		if (result && result.data && result.data.dataList && result.data.dataList.length) {
			result.data.dataList.map((item) => {
				homework.push({
					title: item.title,
					topicId: item.topicId,
					topicName: item.topicName,
					id: item.id,
					comented: item.isReview == "Y" ? true : false,
				})
			});
		}

		this.setState({
			homeworkList: homework,
			pageNum: this.state.pageNum + 1,
		}, () => {
			next && next();
		});

	}

	gotoHomeWorkDetail = (id, topicId) => {
		location.href = `/wechat/page/homework/details?id=${id}&topicId=${topicId}&liveId=${this.liveId}`;
	}

	gotoTopicIntro = (topicId, e) => {
		e.stopPropagation();
		location.href = `/wechat/page/topic-intro?topicId=${topicId}`;
	}

	render() {
		return (
			<Page title="我的作业" className="my-homework">
				<ScrollToLoad
					toBottomHeight={200}
                    loadNext={this.loadMoreCourse}
                    noMore = {this.state.noMore}
					notShowLoaded={true}
				>
					{
						this.state.homeworkList.map((item, index)=>{
							return (
								<div className="homework-item" onClick={this.gotoHomeWorkDetail.bind(this, item.id, item.topicId)} key={index}>
									<div key={index} className="title" dangerouslySetInnerHTML={dangerHtml(item.title)}></div>
									{ item.topicName ? <div className="related">关联课程：<span onClick={this.gotoTopicIntro.bind(this,item.topicId)} className="course-name">{item.topicName}</span></div> : null}
									{ item.comented ? <div className="commented">老师已点评</div> : null}
								</div>
							)
						})
					}
				</ScrollToLoad>
				{
					this.state.showEmptyBox &&
					<div className="empty-box">
						暂时没有已完成作业
					</div>
				}
			</Page>
		)
	}
}

export default connect((state) => {
	return {
	}
}, {
	getMyAnsweredList
})(MyHomework);