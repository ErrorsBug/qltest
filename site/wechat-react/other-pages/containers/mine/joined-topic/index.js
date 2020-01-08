import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import { get } from 'lodash';

import TopicItem from '../components/topic-item'
import TopicNoData from '../components/topic-no-data'

import {
	getJoinedTopicList
} from '../../../actions/mine';


class JoinedTopic extends Component {
    constructor(props) {
        super(props)
    }

    //loadState  loadding loaded nomore
    state = {
	    pageSize: 10,
	    page: 1,
	    topicList: [],
	    pageStatus: 'loading'
    };

	componentDidMount() {
		this.getJoinedTopicList(this.state.page);
	}

	async getJoinedTopicList(page){
		this.state.pageStatus = 'loading';
		let result = await this.props.getJoinedTopicList({
			page: {
				page: page,
				size: this.state.pageSize
			},
			pageNum: page,
			pageSize: this.state.pageSize
		});

		let topicList = get(result,'data.topicList',[]),
			pageStatus = '';
		if(!topicList.length && page === 1) pageStatus = 'no-data';
		else if(topicList.length < this.state.pageSize) pageStatus = 'no-more-data';

		this.setState({
			pageStatus
		});

		if(topicList.length){
			topicList = [...this.state.topicList, ...topicList];
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

    render() {
        return (
            <Page title="学习记录" className="mine-joined-topic">
                <div className="joined-topic-container" ref="joined-topic-container" onScroll={this.scrollHandle.bind(this, this.refs['joined-topic-container'])}>
                    <div className="topic-list">
			            {
				            this.state.topicList.map((topic,index) => {
					            return <TopicItem key={index} pageType="joinedTopic" userId={this.props.userId} {...topic}/>
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


module.exports = connect(mapStateToProps, mapActionToProps)(JoinedTopic);


