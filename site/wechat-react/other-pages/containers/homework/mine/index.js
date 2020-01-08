/**
 * Created by dylanssg on 2017/6/13.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from 'components/page';
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad'
import { getMyAnsweredList } from '../../../actions/homework'
import {
	dangerHtml
} from 'components/util';
import Empty from 'components/empty-page';

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
	
	loadMoreCourse = async (next) => {

		let homework = [...this.state.homeworkList]

		var result = await this.props.getMyAnsweredList({
			page: {
				page: this.state.pageNum,
				size: this.state.pageSize
			}
		});

		if(this.state.pageNum === 1 && (!result.data || !result.data.list || !result.data.list.length)){
			this.setState({
				showEmptyBox: true
			});
		}
		
		if (!result.data || !result.data.list || result.data.list.length < this.state.pageSize) {
			this.setState({
				noMore: true
			})
		}

		if (result && result.data && result.data.list && result.data.list.length) {
			result.data.list.map((item) => {
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
		location.href = `/wechat/page/homework/details?id=${id}&topicId=${topicId}`;
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
					<Empty show={true} emptyMessage="暂时没有已完成作业"/>
				}
			</Page>
		)
	}
}

module.exports = connect((state) => {
	return {
	}
}, {
	getMyAnsweredList
})(MyHomework);