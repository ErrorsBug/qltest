/**
 * Created by dylanssg on 2017/8/2.
 */
import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
import { locationTo } from 'components/util';
import ChannelList from './components/channel-list';
import TopicList from './components/topic-list';
import CampList from './components/camp-list';


@autobind
class ChannelListB extends Component{
	state = {
		type:"topic"

    };

    get form(){
        return this.props.location.query.form
	}
	
	componentDidMount(){
		if(!this.props.location.query.liveId){
			setTimeout(()=>{
				toast('缺少liveId')
			},3000)
		}
	}

	onSelectTab(type){
 		if(this.state.type !== type){
		    this.setState({
			    type
		    });
	    }
	}

	render(){
		return (
			<Page title="嘉宾分成管理" className="guest-separate-channel-list-b flex-body">
				<div className="type-tab">
					<div className="tab-btn" onClick={this.onSelectTab.bind(this, 'topic')}>
						<span className={this.state.type === "topic" ? "active" : ""}>课程</span>
					</div>
					<div className="tab-btn" onClick={this.onSelectTab.bind(this, 'channel')}>
						<span className={this.state.type=== "channel" ? "active" : ""}>系列课</span>
					</div>
					<div className="tab-btn" onClick={this.onSelectTab.bind(this, 'camp')}>
						<span className={this.state.type=== "camp" ? "active" : ""}>训练营</span>
					</div>
				</div>
				<div className={`list-container ${this.state.type}`}>
					{ this.props.location.query.liveId && <TopicList liveId={this.props.location.query.liveId} /> }
					{ this.props.location.query.liveId && <ChannelList liveId={this.props.location.query.liveId} />}
					{ this.props.location.query.liveId && <CampList liveId={this.props.location.query.liveId} />}
				</div>
				{
					this.form === 'backstage' ?
					<div className="back-btn" onClick={() => locationTo(`/wechat/page/backstage?liveId=${this.props.location.query.liveId}`)}>返回工作台</div>
					:
					<div className="back-btn" onClick={() => locationTo(`/wechat/page/userManager/${this.props.location.query.liveId}`)}>返回用户管理</div>
				}
			</Page>
		)
	}
}

module.exports = connect((state) => {
	return {

	}
}, {

})(ChannelListB);