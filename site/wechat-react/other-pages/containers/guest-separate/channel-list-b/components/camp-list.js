import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate,locationTo ,imgUrlFormat,formatMoney } from 'components/util';

import {
	getCampList
} from '../../../../actions/guest-separate';

@autobind
class CampList extends Component {
	state = {
		campList: [],
		isZeroData: false,
		noMore:false,
	};
	data = {
		page: 1,
		pageSize: 30
	};
	componentDidMount(){
		this.getCampList(1);
	}
	async getCampList(page){                           
		let result = await this.props.getCampList({
			liveId: this.props.liveId,
			pageNum: page,
			pageSize: this.data.pageSize
		});
		if(result.state.code === 0){
			if(result.data.campList.length){
				this.setState({
					campList: [...this.state.campList, ...result.data.campList]
				});
			}
			if(result.data.campList.length < this.data.pageSize){
				this.setState({
					noMore: true
				})
			}
			if(page === 1 && result.data.campList.length === 0){
				this.setState({
					isZeroData: true
				});
			}
		}
	}
	async loadNext(next){
		await this.getCampList(++this.data.page);
		next && next();
	}
    render() {
        const listData = this.state.campList.map((camp, i) => {
            return (
                <div className="item icon_enter" key={`camp-item-${i}`} onClick={() => locationTo(`/wechat/page/guest-separate/setting?campId=${camp.campId}&liveId=${this.props.liveId}`)}>
                    <div className="title">{camp.campName || camp.name}</div>
                    <div className="guest-box">

                        {
                            camp.guestHeadImage && camp.guestHeadImage.map((img, i) => {
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
                                camp.guestHeadImage && camp.guestHeadImage.length ?
                                `${camp.guestHeadImage.length > 4 ? '等' : ''}${camp.guestHeadImage.length}位分成嘉宾`
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
	getCampList
})(CampList);