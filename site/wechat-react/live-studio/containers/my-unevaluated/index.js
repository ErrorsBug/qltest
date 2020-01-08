import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import { get } from 'lodash';

import TopicItem from './components/topic-item'
import TopicNoData from './components/topic-no-data'

import {
	getUnevaluatedList
} from '../../actions/my-unevaluated';

class Unevaluated extends Component {
	constructor(props) {
		super(props)
	}

	state = {
	    pageSize: 10,
        page: 1,
        topicList: [],
		pageStatus: 'loading'
    };

	componentDidMount() {
		this.getUnevaluatedList(this.state.page);
	}

	get liveId(){
		return this.props.location.query.liveId
	}

	async getUnevaluatedList(page){
		this.state.pageStatus = 'loading';
		let result = await this.props.getUnevaluatedList({
			page: {
				page: page,
				size: this.state.pageSize
			},
			liveId:this.liveId,
		});

		let topicList = get(result,'data.courses',[]);
		let pageStatus = '';

		if(!topicList.length && page === 1) 
			pageStatus = 'no-data';
		else if(topicList.length < this.state.pageSize) 
			pageStatus = 'no-more-data';

		if(topicList.length){
			topicList = [...this.state.topicList, ...topicList];

			this.setState({
				topicList,
				pageStatus
			});
		} else {
			this.setState({ pageStatus });
		}

	}

	scrollHandle(scrollContainer, e){
		if(['no-more-data','loading'].indexOf(this.state.pageStatus) > -1) return false;
		if(scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight) <= 10){
			let page = this.state.page;
			this.getUnevaluatedList(++page);
			this.setState({
				page
			});
		}
	}

    render() {
        return (
            <Page title="待评价" className="unevaluated-page">
                <div className="unevaluated-container" ref="unevaluated-container" onScroll={this.scrollHandle.bind(this, this.refs['unevaluated-container'])}>
	                <div className="topic-list">
		                {
		                	this.state.topicList.map((topic, index) => {
				                return (
									<TopicItem 
										key={ `topic-list-${index}` }
										{...topic}
									/>
								)
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


export default connect((state) => {
	return {
	}
}, {
	getUnevaluatedList
})(Unevaluated);



