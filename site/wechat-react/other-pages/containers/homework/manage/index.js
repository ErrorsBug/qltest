/**
 * Created by dylanssg on 2017/6/12.
 */
import React, { Component } from 'react';
import Page from 'components/page';
import {connect} from 'react-redux';
import { autobind } from 'core-decorators';

import ScrollToLoad from 'components/scrollToLoad';
import ActionSheet from '../components/action-sheet';
import { locationTo } from 'components/util';
import Confirm from 'components/dialog/confirm';

import {
	getArrangedList,
	deleteHomework,
	getMaxPushCount,
	pushHomework
} from '../../../actions/homework';

import {
    restPushTimes,
} from '../../../actions/timeline';

import {
	dangerHtml
} from 'components/util';

@autobind
class Manage extends Component{
	state = {
		showGuide: false,
		homeworkList: [],
		showNoDataTip: false,
		noMore: false,
		maxPushCount: 0,
		currentCourseLeftCount: 0,
		currentCourseWillPushedId: '',
		pushTimelineChecked: false,
		pushNum: { },
	};
	data = {
		page: 1,
		pageSize: 10
	};
	componentDidMount() {
		// this.refs.actionSheet.show();
		this.initPushCount();
		this.getArrangedList(1);
		this.clearSessiongStorage();

	}
	clearSessiongStorage(){
		sessionStorage.removeItem('title');
		sessionStorage.removeItem('content');
		sessionStorage.removeItem('audioUrl');
		sessionStorage.removeItem('second');
		sessionStorage.removeItem('audioId');
		sessionStorage.removeItem('target');
		sessionStorage.removeItem('topic');
	}
	async initPushCount(){
		let result = await this.props.getMaxPushCount();
		this.setState({
			maxPushCount: result.data.maxPushCount
		});
	}
	async getArrangedList(page){
		let result = await this.props.getArrangedList({
			liveId: this.props.location.query.liveId,
			page: {
				page,
				size: this.data.pageSize
			}
		});
		if(result.state.code === 0){
			if(result.data.list.length){
				this.setState({
					homeworkList: [
						...(page === 1 ? [] : this.state.homeworkList),
						...result.data.list
					]
				});
			}
			if(result.data.list.length < this.data.pageSize){
				this.setState({
					noMore: true
				})
			}
			if(page === 1 && result.data.list.length === 0){
				this.setState({
					showNoDataTip: true
				});
			}
		}
	}
	// 编辑作业
	editHomework(id) {
		let find = this.state.homeworkList.find(item => item.id === id)
		if (find && /question|exam/.test(find.type)) {
			window.toast('题库及考试作业在H5端暂时不支持编辑')
			return
		}
		location.href = `/wechat/page/homework/create?liveId=${this.props.location.query.liveId}&id=${id}`;
	}

	togglePushToTimeline(){
		this.setState({
			pushTimelineChecked: !this.state.pushTimelineChecked,
		})
	}

	// 删除作业
	async deleteHomework(id) {
		if(!await window.confirmDialogPromise('确定要删除吗？')){
			return false;
		}

		let result = await this.props.deleteHomework({
			id
		});
		if(result.state.code === 0){
			window.toast('删除成功');
			let homeworkList = [...this.state.homeworkList],
				index;
			homeworkList.forEach((homework, i) => {
				if(homework.id === id) index = i
			});
			homeworkList.splice(index, 1);
			this.setState({
				homeworkList
			});
		} else {
			window.toast(result.state.msg)
		}
	}
	async loadNext(next){
		await this.getArrangedList(++this.data.page);
		next && next();
	}
	makeHomeworkBtnHandle(){
		if(!localStorage.getItem('homework-guided')){
			this.setState({
				showGuide: true
			});
			return false;
		}
		location.href = `/wechat/page/homework/create?liveId=${this.props.location.query.liveId}`
	}
	async pushBtnHandle(id, pushedCount = 0, isRelated){


		if(!isRelated){
			window.toast('该作业未关联课程，不能进行推送操作', 2000);
		}else{
			const result = await this.props.restPushTimes(id,'homework')
			this.setState({ pushNum: result.data })

			this.setState({
				currentCourseWillPushedId: id,
				currentCourseLeftCount: this.state.maxPushCount - pushedCount
			});
			this.refs.pushConfirm.show();
		}
	}
	async pushHomework(tag){
		if(tag === 'cancel'){
			return false;
		}
		if(!this.state.currentCourseLeftCount){
			window.toast('推送次数已经用完 ');
			this.refs.pushConfirm.hide();
		} else {
			this.refs.pushConfirm.hide()
			setTimeout(()=> {
				location.href = `/wechat/page/course/push/homework/${this.state.currentCourseWillPushedId}?sync=${(this.state.pushTimelineChecked && this.state.pushNum.leftFeedPushNum > 0)?'Y':'N'}&liveId=${this.props.location.query.liveId}`
			}, 100);
		}
	}

	gotoTimelineTuto(e) {
        e.stopPropagation()
        setTimeout(function() {
            location.href = 'https://mp.weixin.qq.com/s/nQWzLse4FITW91B_wpDYDQ'
        }, 100);
	}

	homeworkCardClick (homework) {
		if (/question|exam/.test(homework.type)) {
			locationTo(`/wechat/page/topic-intro?topicId=${homework.topicId}`)
		} else {
			location.href = `/wechat/page/homework/details?id=${homework.id}&liveId=${this.props.location.query.liveId}${homework.topicId ? '&topicId=' + homework.topicId : ''}`
		}
	}

	render(){
		return (
			<Page title="作业管理" className='homework-manage'>
				{
					!!this.state.homeworkList.length &&
					<ScrollToLoad
						loadNext={this.loadNext.bind(this)}
						noMore={this.state.noMore}
						notShowLoaded={true}
					>
						{
							this.state.homeworkList.map((homework, index) => {
								return (
									<div className="homework-manage-items" key={`homework-manage-item-${index}`} onClick={() => this.homeworkCardClick(homework)}>
										<header className="title" dangerouslySetInnerHTML={dangerHtml(homework.title)}></header>
										<div className="homework-info">
											<p>
											关联课程：
											{homework.topicId ? <a href={`/wechat/page/topic-intro?topicId=${homework.topicId}`} onClick={(e) => e.stopPropagation()}>{homework.topicName}</a> : '无'}
											</p>
											<p>
											已交作业：<s>{homework.answerCount || 0}</s>
											</p>
										</div>
										<div className="operation-box" onClick={(e) => e.stopPropagation()}>
											<div className="operation-btn push" onClick={this.pushBtnHandle.bind(this, homework.id, homework.pushCount, !!homework.topicId)}>推送通知</div>
											<div className="operation-btn get-homework-card" onClick={() => locationTo(`/wechat/page/homework-card?id=${homework.id}`)}>获取作业卡</div>
											<div className="operation-btn edit" onClick={() => this.editHomework(homework.id)}>编辑</div>
											<div className="operation-btn del" onClick={() => this.deleteHomework(homework.id)}>删除</div>
										</div>
									</div>
								)
							})
						}

					</ScrollToLoad>
				}
				{
					this.state.showNoDataTip &&
					<div className="no-data-tip">
						<div className="no-pic"></div>
						<p>还没有布置作业哦</p>
					</div>
				}

				<div className="btn-make-homework on-log" data-log-region='btn-make-homework' onClick={this.makeHomeworkBtnHandle}><span>布置作业</span></div>

				<ActionSheet
					ref = "actionSheet"
					sheetList = {[
						{name: '编辑', callback: this.editHomework},
						{name: '删除', callback: this.deleteHomework}
					]}
				/>

				{
					this.state.showGuide &&
					<div className="guide">
						<div className="container">
							<div className="content">讲师在每次课程开始前预先布置对应作业，在讲课最后发送作业卡在对应课程内，引导学员完成</div>
							<div className="remove-btn" onClick={() => {this.setState({showGuide: false});localStorage.setItem('homework-guided',true)}}>我知道了</div>
						</div>
					</div>
				}

				<Confirm
					ref="pushConfirm"
					buttons='cancel-confirm'
					onBtnClick={this.pushHomework}
					confirmText='去推送'
				>
					<div className="push-confirm-content">
						<div className="left-count">还剩<i className="num">{this.state.currentCourseLeftCount}</i>次机会</div>
						<div className="push-intro">给报名该课程的听众推送作业提醒，每个作业可推送{this.state.maxPushCount}次，每次时间间隔必须大于24小时</div>
						{
                            this.state.pushNum.leftPushNum > 0 &&
                            this.state.pushNum.leftFeedPushNum > 0 &&
                            <section
                                onClick={this.togglePushToTimeline}
                                className={this.state.pushTimelineChecked ? 'push-to-timeline new checked' : 'push-to-timeline new'}
                            >
								同时发布到直播间动态
								<span className='goto' onClick={this.gotoTimelineTuto}></span>
							</section>
                        }
					</div>
				</Confirm>

			</Page>
			)
	}
}

function mapStateToProps(state) {
	return {};
}
const mapDispatchToProps = {
	getArrangedList,
	deleteHomework,
	getMaxPushCount,
	pushHomework,
	restPushTimes,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Manage);
