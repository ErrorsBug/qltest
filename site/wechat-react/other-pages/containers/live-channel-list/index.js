import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { locationTo } from 'components/util';

class LiveChannelList extends Component {
	parseDate(time){
		let date = new Date(time),
			year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			second = date.getSeconds();

		return `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day} ${hour > 9 ? hour : '0' + hour}:${minute > 9 ? minute : '0' + minute}:${second > 9 ? second : '0' + second}`
	}
    render() {
        return (
            <Page title="系列课数据统计" className="live-channel-list">
                <div className="list-wrap">
	                {
	                	this.props.channelList.map((item,i) => {
	                		return (
				                <div className="list-item icon_enter" key={`list-item-${i}`} onClick={() => locationTo(`/wechat/page/channel-topic-statistics?businessId=${item.id}&businessType=channel`)}>
					                <div className="title">{item.name}</div>
					                <div className="date">{this.parseDate(item.createTime)}</div>
				                </div>
			                )
		                })
	                }
                </div>
            </Page>
        );
    }
}

function mapStateToProps(state){
    return{
        channelList: state.channelStatistics.channelList
    }
}

const mapDispatchToProps ={

}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChannelList)