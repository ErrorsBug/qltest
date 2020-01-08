import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate,locationTo ,imgUrlFormat,formatMoney } from 'components/util';

import {
	getChennelList,
} from '../../../../actions/guest-separate';

@autobind
class ChannelList extends Component {
	state = {
		channelList: [],
		isZeroData: false,
		noMore:false,
	};
	data = {
		page: 1,
		pageSize: 30
	};
	componentDidMount(){
		this.getChennelList(1);
	}
	async getChennelList(page){
		let result = await this.props.getChennelList({
			liveId: this.props.liveId,
			pageNum: page,
			pageSize: this.data.pageSize
		});
		if(result.state.code === 0){
			if(result.data.channelList.length){
				this.setState({
					channelList: [...this.state.channelList, ...result.data.channelList]
				});
			}
			if(result.data.channelList.length < this.data.pageSize){
				this.setState({
					noMore: true
				})
			}
			if(page === 1 && result.data.channelList.length === 0){
				this.setState({
					isZeroData: true
				});
			}
		}
	}
	async loadNext(next){
		await this.getChennelList(++this.data.page);
		next && next();
	}
    render() {
        const listData = this.state.channelList.map((channel, i) => {
            return (
                <div className="item icon_enter" key={`channel-item-${i}`} onClick={() => locationTo(`/wechat/page/guest-separate/setting?channelId=${channel.channelId}&liveId=${this.props.liveId}`)}>
                    <div className="title">{channel.channelName || channel.name}</div>
                    <div className="guest-box">

                        {
                            channel.guestHeadImage && channel.guestHeadImage.map((img, i) => {
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
                                channel.guestHeadImage && channel.guestHeadImage.length ?
                                `${channel.guestHeadImage.length > 4 ? '等' : ''}${channel.guestHeadImage.length}位分成嘉宾`
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
				        !this.state.isZeroData ? listData : "暂无付费系列课"
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
	getChennelList
})(ChannelList);