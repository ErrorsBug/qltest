import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import { get } from 'lodash';

import TopicItem from './components/topic-item'
import TopicNoData from './components/topic-no-data'

import { request } from 'common_actions/common';
import {
	getJoinedTopicList
} from 'studio_actions/my-joined';
import { formatDate } from 'components/util';


class JoinedTopic extends Component {
    constructor(props) {
		super(props)
	}
	
	get liveId(){
		return this.props.location.query.liveId
	}

    //loadState  loadding loaded nomore
    state = {
	    pageSize: 10,
	    page: 1,
	    topicList: [],
	    pageStatus: 'loading'
	};
	
	data = {
		unit: {
            s: 1,
            m: 60,
            h: 60 * 60,
            d: 60 * 60 * 24,
            week: 60 * 60 * 24 * 7
        },
	}

	componentDidMount() {
		this.getJoinedTopicList(this.state.page);
	}

	async getJoinedTopicList(page){
		let time = 0;

		if (this.state.topicList && this.state.topicList.length) {
			time = this.state.topicList[this.state.topicList.length - 1].lastLearnTime;
		}

		this.state.pageStatus = 'loading';

		let result = await request({
			url: '/api/wechat/mine/recentCourse',
			method: 'POST',
			body: {
				liveId: this.liveId,
				pageSize: this.state.pageSize,
				beforeOrAfter: 'before',
				time,
			}
		})

		let topicList = get(result,'data.learningList',[]),
			pageStatus = '';
		if(!topicList.length && page === 1) pageStatus = 'no-data';
		else if(topicList.length < this.state.pageSize) pageStatus = 'no-more-data';

		this.setState({
			pageStatus
		});

		if(topicList.length){
			topicList = [...this.state.topicList, ...topicList];

			const nowTime = result.data && result.data.time;
			topicList.forEach((item) => {
                item.timeDiff = this.timeDiffConver(nowTime, item.lastLearnTime)
            })

			this.setState({
				topicList
			});
		}

	}

	scrollHandle(scrollContainer, e){
		if(['no-more-data','loading'].indexOf(this.state.pageStatus) > -1) return false;
		if(scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight) <= 10){
			let page = this.state.page;
			this.getJoinedTopicList(++page);
			this.setState({
				page
			});
		}
	}

	
    // 时间差转化
    timeDiffConver (nowTime, lastTime) {
        if (!nowTime || !lastTime) {
            return ''
        }
        const unit = this.data.unit
        let now = new Date(nowTime)
        let last = new Date(lastTime)

        // 是否一个月
        const newTime = new Date(nowTime)
        newTime.setMonth(newTime.getMonth() - 1)

        if (newTime.getTime() >= last.getTime()) {
            return {
                isSevenDay: true,
                str: formatDate(last, 'yyyy-MM-dd')
            }
        }

        const diff = Math.floor((now.getTime() - last.getTime()) / 1000)
        
        if (diff >= unit.week) {
            return {
                isSevenDay: true,
                str: `${Math.floor(diff / unit.week)}周前`
            }
        } else if (diff >= unit.d) {
            const d = Math.floor(diff / unit.d)
            return {
                isSevenDay: d >= 7,
                str: `${d}天前`
            }
        } else if (diff >= unit.h) {
            return {
                isSevenDay: false,
                str: `${Math.floor(diff / unit.h)}小时前`
            }
        } else {
            return {
                isSevenDay: false,
                str: `${Math.floor(diff / unit.m)}分钟前`
            }
        }
    }

    render() {
		const topicList = this.state.topicList;

		// 添加分类标签 (七天前)
		let isTimeSlot1 = false
		let isTimeSlot2 = false
		let timeSlot = (item, index, isValue) => {

			if (isTimeSlot1 && isTimeSlot2) {
				return false
			}

			if (topicList[0].timeDiff.isSevenDay) {
				isTimeSlot1 = true
				isTimeSlot2 = true
				return false
			}

			if (index === 0 || !item.timeDiff.isSevenDay) {
				return false
			}

			if (isValue) {
				isTimeSlot1 = true
			} else {
				isTimeSlot2 = true
			}
			
			if (isValue) return true
			else return <p className="seven-day">7天前</p>
		}

        return (
            <Page title="学习记录" className="mine-joined-topic">
                <div className="joined-topic-container" ref="joined-topic-container" onScroll={this.scrollHandle.bind(this, this.refs['joined-topic-container'])}>
                    <div className="topic-list">
			            {
				            this.state.topicList.map((topic,index) => {
								return <TopicItem key={index} index={index} pageType="joinedTopic"
								userId={this.props.userId}
								item={topic}
								timeSlot={timeSlot}/>
				            })
			            }
                    </div>
		            {this.state.pageStatus == 'no-data' && <TopicNoData/>}
		            {this.state.pageStatus == 'loading' && <div className="loading">玩命加载中...</div>}
		            {this.state.pageStatus == 'no-more-data' && <div className="no-more-data">没有更多了</div>}
                </div>
            </Page>
        );
    }
}



function mapStateToProps (state) {
	return {
		userId: state.common.userInfo.userId
	}
}

const mapActionToProps = {
	getJoinedTopicList
};


export default connect(mapStateToProps, mapActionToProps)(JoinedTopic);


