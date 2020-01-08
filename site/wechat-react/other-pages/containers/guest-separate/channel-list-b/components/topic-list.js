import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate,locationTo ,imgUrlFormat,formatMoney } from 'components/util';

import {
	getTopicList
} from '../../../../actions/guest-separate';

@autobind
class TopicList extends Component {
	state = {
		topicList: [],
		isZeroData: false,
		noMore:false,
	};
	data = {
		page: 1,
		pageSize: 30
	};
	componentDidMount(){
		this.getTopicList(1);
	}
	async getTopicList(page){                           
		let result = await this.props.getTopicList({
			liveId: this.props.liveId,
			pageNum: page,
			pageSize: this.data.pageSize
		});
		if(result.state.code === 0){
			if(result.data.topicList.length){
				this.setState({
					topicList: [...this.state.topicList, ...result.data.topicList]
				});
			}
			if(result.data.topicList.length < this.data.pageSize){
				this.setState({
					noMore: true
				})
			}
			if(page === 1 && result.data.topicList.length === 0){
				this.setState({
					isZeroData: true
				});
			}
		}
	}
	async loadNext(next){
		await this.getTopicList(++this.data.page);
		next && next();
	}
    render() {
        const listData = this.state.topicList.map((topic, i) => {
            return (
                <div className="item icon_enter" key={`topic-item-${i}`} onClick={() => locationTo(`/wechat/page/guest-separate/setting?topicId=${topic.topicId}&liveId=${this.props.liveId}`)}>
                    <div className="title">{topic.topicName || topic.name}</div>
                    <div className="guest-box">

                        {
                            topic.guestHeadImage && topic.guestHeadImage.map((img, i) => {
                                return (
                                    i < 4 &&
                                    <div className="avatar" key={`guest-avatar-${i}`}>
                                        <img src={`${img}?x-oss-process=image/resize,m_fill,h_30,w_30`} alt="" />
                                    </div>
                                )
                            })
                        }

                        <div className="count">
                            {
                                topic.guestHeadImage && topic.guestHeadImage.length ?
                                `${topic.guestHeadImage.length > 4 ? '等' : ''}${topic.guestHeadImage.length}位分成嘉宾`
                                :
                                '暂无嘉宾分成'
                            }
                        </div>
                    </div>
                </div>
            )
        });
        
        return (
	        <ScrollToLoad
		        loadNext={this.loadNext}
		        noMore={this.state.noMore}
		        notShowLoaded={true}
	        >
		        <div className={!this.state.isZeroData ? "list-wrap" : "no-data-tip"}>
			        {
				        !this.state.isZeroData ? listData:" 暂无付费课程"
			        }
		        </div>
	        </ScrollToLoad>
        )
        
    }
}

export default module.exports = connect((state) => {
	return {

	}
}, {
	getTopicList
})(TopicList);