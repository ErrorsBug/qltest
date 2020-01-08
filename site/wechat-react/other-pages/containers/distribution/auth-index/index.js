/**
 *
 * @author Dylan
 * @date 2018/3/30
 */

import { get } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Link } from 'react-router';
import { api } from 'common_actions/common'

import Page from 'components/page';
import { locationTo } from 'components/util';

import { coralOnSaleInfo, knowledgeCourseInfo, getQlShareQualify } from '../../../actions/distribution';


const mapStateToProps = function(state) {
	return {
	}
};

const mapActionToProps = {
	coralOnSaleInfo,
	knowledgeCourseInfo,
	getQlShareQualify
};

@autobind
class AuthIndex extends Component {
	state = {
		coralWaitUp: 0,
		coralAlreadyUp: 0,

		knowledgeWaitUp: 0,
		knowledgeAlreadyUp: 0,

		isQlShareQualify: false
	};

	data = {
		liveId: get(this.props,'location.query.liveId',0),
	};

	async componentDidMount() {
		await this.getLive();
		this.getKnowledgeCourseInfo();
		this.getCoralOnSaleInfo();
		this.getQlShareQualify();
	}

	// 获取直播间列表
	async getLive() {
		if (!this.data.liveId) {
			const result = await api({
				url: '/api/wechat/channel/getLiveList',
				method: 'GET'
			});
			let liveId = get(result, 'data.entityPo.id');
			if (result.state.code === 0 && liveId) {
				this.data.liveId = liveId;
			} else {
				locationTo(`/wechat/page/create-live`);
			}
		}
		return;
    }

	async getCoralOnSaleInfo(){
		const res = await this.props.coralOnSaleInfo(this.data.liveId);
		if(res.state.code === 0){
			this.setState({
				coralWaitUp: res.data.waitUp,
				coralAlreadyUp: res.data.alreadyUp
			});
		}
	}

	async getQlShareQualify(){
		const res = await this.props.getQlShareQualify(this.data.liveId);
		if(res.state.code === 0 && res.data.platformShareQualifyPo && res.data.platformShareQualifyPo.status != 'N'){
			this.setState({
				isQlShareQualify: true
			})
		}
	}

	async getKnowledgeCourseInfo(){
		const res = await this.props.knowledgeCourseInfo(this.data.liveId);
		if(res.state.code === 0){
			this.setState({
				knowledgeWaitUp: res.data.waitUp,
				knowledgeAlreadyUp: res.data.alreadyUp
			});
		}
	}

	render() {
		return (
			<Page title="千聊帮你推" className='distribution-auth-index'>
				<div className="auth-type-item" onClick={_=> locationTo(`/wechat/page/live-studio/media-promotion/${this.data.liveId}`)}>
					<div className="flex-box">
						<div className="info">
							<div className="name">知识通商城</div>
							<div className="details">千聊与媒体渠道合作，在各大知识商城分发优质课程，帮直播间提升课程销量并享受分成收益。</div>
							<div className="data">已上架:<var>{this.state.knowledgeAlreadyUp||0}</var> | 待上架:<var>{this.state.knowledgeWaitUp||0}</var></div>
						</div>
						<div className="enter-btn icon_enter"></div>
					</div>
				</div>
				<div className="auth-type-item" onClick={_=> locationTo(`/wechat/page/coral/author?liveId=${this.data.liveId}`)}>
					<div className="flex-box">
						<div className="info">
							<div className="name">珊瑚商城</div>
							<div className="details">上架到珊瑚商城的课程，通过千聊珊瑚计划课代表分享团队，利用社交的方式分发推广，达到课程销量提升的目的。</div>
							<div className="data">已上架:<var>{this.state.coralAlreadyUp||0}</var> | 待上架:<var>{this.state.coralWaitUp||0}</var></div>
						</div>
						<div className="enter-btn icon_enter"></div>
					</div>	
				</div>
				<div className="auth-type-item" onClick={_=> locationTo(`/wechat/page/distribution/live-center-options?liveId=${this.data.liveId}`)}>
					<div className="flex-box">
						<div className="info">
							<div className="name">千聊推荐</div>
							<div className="details">千聊基于大数据算法，实时筛选最优课程，助您获得平台流量的扶持。</div>
							<div className="data">
								{
									this.state.isQlShareQualify ?
										'直播间已授权千聊推荐'
										:
										'直播间未授权千聊推荐'
								}
							</div>
						</div>
						<div className="enter-btn icon_enter"></div>
					</div>
				</div>
			</Page>
		)
	}
}


module.exports = connect(mapStateToProps, mapActionToProps)(AuthIndex);