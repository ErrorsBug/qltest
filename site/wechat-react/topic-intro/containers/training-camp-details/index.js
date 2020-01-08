
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Picture from 'ql-react-picture';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { request } from 'common_actions/common';
import { autobind, throttle } from 'core-decorators';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import CurrTask from './components/curr-task'
import TabContainer from './components/tab-container'
import CourseList from './components/course-list'
import StudentTask from './components/student-task'
import JobListDialog from 'components/dialogs-colorful/job-list-dialog'
import FollowDialog from 'components/follow-dialog';
import Confirm from 'components/dialog/confirm';


import { formatDate, locationTo } from 'components/util';

import { getQr } from '../../actions/common';

import { fetchCampListTopic, fetchCampListByChannel, campAnswerlikes, setCertificateName, getUserQualification } from '../../actions/channel-intro'
import {
	liveGetSubscribeInfo
} from '../../actions/live'

function mapStateToProps (state) {
	return {
		sysTime: get(state, 'common.sysTime'),
		channelInfo: get(state, 'splicingAll.channelInfo.channel'),
		isFocusThree: get(state, 'live.focusStatues.isFocusThree') ? 'Y' : 'N',
	}
}

const mapActionToProps = {
	getQr,
	fetchCampListTopic,
	fetchCampListByChannel,
	liveGetSubscribeInfo,
	campAnswerlikes,
	getUserQualification,
};

@autobind
class TrainingCampDetails extends Component {

	state = {
		liveId: '',
		periodInfo: null,
		currTask: null,
		
		// Tab相关配置
		tagIndex: 0,
		tagList: [
			{
				tagKey: 'course-list',
				tagName: '课程列表',
				dataList: {
					list: [], 
					allList: [], 
					page: 1, 
					pageSize: 20, 
					isNoMore: false,
					isEnd: false
				}
			},
			{
				tagKey: 'student-task',
				tagName: '学员作业',
				dataList: {
					list: [], 
					allList: [],
					page: 1,
					pageSize: 20, 
					isNoMore: false,
					isEnd: false,
				},
				// 缓存不同数据列表对象
				cacheDataList: {
					// 排序
					'ASC': {
						// 是否只看我的
						'Y': {
							list: [], 
							allList: [],
							page: 1,
							pageSize: 20, 
							isNoMore: false,
							isEnd: false,
						},
						'N': {
							list: [], 
							allList: [],
							page: 1,
							pageSize: 20, 
							isNoMore: false,
							isEnd: false,
						}
					},
					'DESC': {
						'Y': {
							list: [], 
							allList: [],
							page: 1,
							pageSize: 20, 
							isNoMore: false,
							isEnd: false,
						},
						'N': {
							list: [], 
							allList: [],
							page: 1,
							pageSize: 20, 
							isNoMore: false,
							isEnd: false,
						}
					}
				}
			},
		],

		isOnlyMine: 'N',
		orderBy: 'ASC',

		showJobListDialog: false,
		jobList: [],

		followDialogOption: {
			title: '',
			desc: '',
			qrUrl: '',
		},

		classQr: '',
		showNewGuide: true,
		hasQualification: 'N',
		nickName:'',
	}

	async componentDidMount () {
		const channelId = get(this.props.location, 'query.channelId')
		
		// 页面基础数据 位置不可变
		const userPeriod = await request({
			url: '/api/wechat/channel/camp/getUserPeriod',
			method: 'POST',
			body: {
				channelId
			}
		})

		const periodInfo = get(userPeriod, 'data.periodPo')
		const liveId = get(userPeriod, 'data.liveId')
		
		if (liveId) {
			await this.props.liveGetSubscribeInfo(liveId)
		}

		if (periodInfo && periodInfo.id) {

			this.initPageData(channelId, periodInfo.id, liveId)
			
			if (this.props.sysTime < periodInfo.estimateEndTime) {
				this.initClassQr(periodInfo, liveId)
			}
			
			this.setState({
				periodInfo,
				liveId
			},()=>{
				this.initIsCertificate();
			})
		} else {
			// 回到系列课页面
			locationTo(`/wechat/page/channel-intro?channelId=${channelId}`)
			return
		}

		this.loadMore()
	}

	async initIsCertificate(){
        let result = await this.props.getUserQualification({
            channelId: this.state.periodInfo.channelId,
		});
		if(result.data&&result.data.cardPo){
			this.setState({
				hasQualification: result.data.cardPo.hasQualification,
				nickName: result.data.cardPo.userName||'',
			})
		}
    }

	async initClassQr (periodInfo, liveId) {
		const res = await this.props.getQr({
			channel: 'channelCampCommunity',
			pubBusinessId: periodInfo.communityCode,
			showQl: 'N',
			liveId: liveId
		})

		const classQr = get(res, 'data.qrUrl')

		this.setState({
			classQr
		})
	}

	async initPageData (channelId, periodId, liveId) {

		// 当前任务数据
		const _currTask = await request({
			url: '/api/wechat/channel/camp/currentTopic',
			method: 'POST',
			body: {
				channelId,
				periodId
			}
		})

		this.setState({
			currTask: get(_currTask, 'data.topicPo')
		})
	}

	tagClick (tagIndex) {
		if (tagIndex === this.state.tagIndex) return

		const tagList = [...this.state.tagList]
		tagList[tagIndex].dataList.page = 1
		tagList[tagIndex].dataList.isNoMore = false

		this.setState({
			tagIndex,
			tagList
		}, async () => {
			await this.loadMore()
		})
	}

	// 列表数据装载
	async fetchDataList (tagIndex, tagList) {

		const tempTagList = [...tagList]
		const tag = tagList[tagIndex]
		const data = tag.dataList

		if (data.isNoMore) return

		const count = data.page * data.pageSize

		// 当存储数据不满足装载量且没到底，请求增加数据
		if (count > data.allList.length && !data.isEnd) {
			switch (tag.tagKey) {
				case 'course-list':
					const _listTopic = await this.props.fetchCampListTopic({
						channelId: this.state.periodInfo.channelId,
						page: {
							page: data.page,
							size: data.pageSize
						}
					})
					const listTopic = get(_listTopic, 'data.dataList') || []
					data.allList.push(...listTopic)
					data.isEnd = true
					break;
				case 'student-task':
					const _listByChannel = await this.props.fetchCampListByChannel({
						channelId: this.state.periodInfo.channelId,
						onlyMine: this.state.isOnlyMine,
						order: this.state.orderBy,
						page: {
							page: data.page,
							size: data.pageSize
						}
					})
					const listByChannel = get(_listByChannel, 'data.list') || []
					data.allList.push(...listByChannel)
					if (listByChannel.length < data.pageSize) data.isEnd = true
					break;
			}
		}

		if (count >= data.allList.length && data.isEnd) {
			data.isNoMore = true
		}
		data.list = data.allList.slice(0, count)
		data.page += 1
		tag.dataList = data

		this.setState({
			tagList: tempTagList
		})
	}
	
	isLock = false
	async loadMore (next) {
		const {
			tagIndex,
			tagList
		} = this.state

		if (!this.isLock) {
			this.isLock = true
			await this.fetchDataList(tagIndex, tagList)
			this.isLock = false
		}

		next && next()
	}

	get isDisable () {

		return false
	}

	get isNoMore () {
		return false
	}

	// 训练营状态
	get campStatus () {
		const { periodInfo } = this.state

		if (periodInfo) {
			if (this.props.sysTime >= periodInfo.estimateEndTime) {
				return 'end'
			}
			if (this.props.sysTime >= periodInfo.startTime) {
				return 'open'
			}
		}

		return 'unopened'
	}
	
	// 阻止查看我的和排序同时点击
	toggleing = false
	// 仅看我的
	toggleOnlyMine () {
		const {
			isOnlyMine,
			orderBy,
			tagList,
		} = this.state

		if (this.toggleing) return
		this.toggleing = true

		const tempTagList = [...tagList]
		const tag = tempTagList[1]
		tag.cacheDataList[orderBy][isOnlyMine] = {...tag.dataList, page: 1, isNoMore: false }

		const _isOnlyMine = isOnlyMine === 'Y' ? 'N' : 'Y'

		tag.dataList = {...tag.cacheDataList[orderBy][_isOnlyMine]}

		this.setState({
			isOnlyMine: _isOnlyMine,
			tagList: tempTagList
		}, async () => {
			await this.loadMore()
			this.toggleing = false
		})
	}

	// 排序切换
	toggleOrderBy () {
		const {
			isOnlyMine,
			orderBy,
			tagList,
		} = this.state

		if (this.toggleing) return
		this.toggleing = true

		const tempTagList = [...tagList]
		const tag = tempTagList[1]
		tag.cacheDataList[orderBy][isOnlyMine] = {...tag.dataList, page: 1, isNoMore: false }

		const _orderBy = orderBy === 'ASC' ? 'DESC' : 'ASC'

		tag.dataList = {...tag.cacheDataList[_orderBy][isOnlyMine]}

		this.setState({
			orderBy: _orderBy,
			tagList: tempTagList
		}, async () => {
			await this.loadMore()
			this.toggleing = false
		})
	}

	showJobListDialog (jobList) {
		this.setState({
			showJobListDialog: true,
			jobList
		})
	}

	closeJobListDialog () {
		this.setState({
			showJobListDialog: false
		})
	}

	// 点赞
	async toggleFabulous (answer, index) {
		const {
			tagIndex,
			tagList,
		} = this.state

		const tempTagList = [...tagList]
		const _answer = { ...answer }

		_answer.liked = answer.liked === 'Y' ? 'N' : 'Y'
		
		const res = await this.props.campAnswerlikes({
			status: _answer.liked,
			answerId: _answer.id
		})

		if (res.state && res.state.code === 0) {
			if (_answer.liked === 'Y') {
				_answer.upvoteCount += 1 
			} else {
				_answer.upvoteCount -= 1 
			}
	
			tempTagList[tagIndex].dataList.list[index] = { ..._answer }
	
			this.setState({
				tagList: tempTagList
			})
		}
	}

	async showClassQr () {
		let qrUrl = this.state.classQr
		
        if (qrUrl) {
			this.showFollowDialog({
				title: '请尽快长按扫码入群',
				desc: '跟老师一起学更有效',
				qrUrl
			})
		}
	}

	showFollowDialog (followDialogOption, params) {
		this.setState({
			followDialogOption,
			...params
		}, () => {
			this.followDialogDom.show()
		})
	}

	closeNewGuide () {
		this.setState({
			showNewGuide: false
		})
	}
	async cardNameSetting (type) {
		this.cardNameSettingDialog.hide();
		if(type === 'confirm'){
			if(this.state.nameStr){
				await setCertificateName({
					channelId: this.state.periodInfo.channelId,
					name: this.state.nameStr,
				});
			}
			
			locationTo(`/wechat/page/certificate?channelId=${this.state.periodInfo.channelId}`)
		}
	}
	showCardNameSettingDialog(){
		if(this.state.nickName){
			locationTo(`/wechat/page/certificate?channelId=${this.state.periodInfo.channelId}`)
		}else
		this.cardNameSettingDialog.show();
	}
	changeName (e) {
		const value = e.target.value;
		if(value.length>=10){
			window.toast('昵称不能大于10个字');
			return false;
		}
		this.setState({
			nameStr: value,
		});
	}
	
    /************************* 视频地址转换 *****************************/
    // 待加载视频列表
    lazyVideos = [];

    getChildContext() {
        return {
            lazyVideo: {
                push: this.pushVideoToLazyVideos,
                remove: this.removeVideoToLazyVideos,
            }
        }
    }

    pushVideoToLazyVideos(item) {
        if (!this.refs.detailsScroll) {
            this.lazyVideos.push(item);
            return;
        }

        if (!this.isVideoFetch(findDOMNode(this.refs.detailsScroll), item)) {
            this.lazyVideos.push(item);
        }
    }

    removeVideoToLazyVideos(id) {
        this.lazyVideos = this.lazyVideos.filter(item => item.id != id);
    }

    @throttle(300)
    initLazyVideoLinstener() {
        if (!this.refs.detailsScroll) {
            return;
        }
        const target = findDOMNode(this.refs.detailsScroll)
        const st = target.scrollTop;
		const height = target.clientHeight;

        this.lazyVideos.forEach(item => {
            const pos = item.ref.parentNode.parentNode.parentNode.parentNode.offsetTop;
            if (pos < height + st) {
                item.init()
            }
        });
    }

    isVideoFetch(target, item) {
        const st = target.scrollTop;
        const height = target.clientHeight;
        const pos = item.ref.parentNode.parentNode.parentNode.parentNode.offsetTop;

        if (pos < height + st) {
            item.init()
            return true;
        } else {
            return false;
        }
    }
    /************************* 视频地址转换 *****************************/
    
	scrollToDo () {
		this.initLazyVideoLinstener()
	}
	
	render () {

		const campStatus = this.campStatus

		const { 
			periodInfo,
			currTask,
			tagList, 
			tagIndex,
			isOnlyMine,
			orderBy,
			showJobListDialog,
			jobList,
			followDialogOption
		} = this.state

		const data = tagList[tagIndex].dataList
		return  periodInfo ? (
			<Page title={periodInfo.channelName} className='training-camp-details-page'>

				<ScrollToLoad
						ref="detailsScroll"
						className="scroll-container"
						loadNext={this.loadMore}
						disable={!data || data.isDisable}
						noMore={data && data.isNoMore}
						notShowLoaded={data.allList.length === 0 && data.isEnd}
						scrollToDo={this.scrollToDo}
					>

					{
						campStatus !== 'unopened' ? (
							<div className={`periods ${campStatus}`}>
								<p>{periodInfo.name}</p>
								{/* {
									campStatus === 'open' && <p className="enter-class-btn on-log" data-log-region="enter_class" onClick={this.showClassQr}>进入班群</p>
								} */}
							</div>
						) : <p className="periods periods-num">{periodInfo.name} | 开营时间: {formatDate(periodInfo.startTime, 'yyyy-MM-dd')}</p>
					}

					<CurrTask
						campStatus={campStatus}
						periodInfo={periodInfo}
						data={currTask}
						taskClick={this.showJobListDialog}
						showQr={this.showFollowDialog}
						getQr={this.props.getQr}
						classQr={this.state.classQr}
						liveId={this.state.liveId}
						isFocusThree={this.props.isFocusThree}
						showCardNameSettingDialog = {this.showCardNameSettingDialog}
						hasQualification = {this.state.hasQualification}
						/>

					<TabContainer
						className="tab"
						tags={tagList}
						currTagIndex={tagIndex}
						tagClick={this.tagClick}
						>

						{
							[tagList[tagIndex]].map((item) => {
								switch (item.tagKey) {
									case 'course-list':
										return (
											<React.Fragment key={item.tagKey} >
												{
													data.allList.length > 0 || !data.isEnd ? (
														<CourseList 
															taskClick={this.showJobListDialog}
															data={data.list}
															sysTime={this.props.sysTime}
															/>
													) : <div className="list-empty list-one">暂无课程列表~</div>
												}
											</React.Fragment>
										)
									case 'student-task':
										return (
											<React.Fragment key={item.tagKey} >
												{
													data.allList.length > 0 || !data.isEnd ? (
														[
															<div className="operation-block">
																<p className={`only-mine ${isOnlyMine === 'Y' ? 'select' : ''}`} onClick={this.toggleOnlyMine}>只看我的</p>
																<p className={`order-by ${orderBy}`} onClick={this.toggleOrderBy}>{orderBy === 'ASC' ? '正序' : '倒序'}</p>
															</div>,
															<StudentTask 
																data={data.list}
																toggleFabulous={this.toggleFabulous}
																/>
														]
													) : <div className="list-empty list-two">暂无内容~</div>
												}
											</React.Fragment>
										)
								}
							})
						}

					</TabContainer>
				</ScrollToLoad>

				<JobListDialog
					isShow={showJobListDialog}
					onClose={this.closeJobListDialog}
					data={jobList}
					liveId={this.state.liveId}
				/>
				
				<FollowDialog 
                    ref={ dom => dom && (this.followDialogDom = dom) }
                    title={ followDialogOption.title }
                    desc={ followDialogOption.desc }
					qrUrl={ followDialogOption.qrUrl }
					tips=""
				/>

				<Confirm ref={ dom => dom && (this.cardNameSettingDialog = dom) }
					title="请填写姓名"
					buttons = "cancel-confirm"
					className="card-name-dialog"
					onBtnClick = {this.cardNameSetting}
				>
					<div className="set-name-input">
						<input value={this.state.nameStr} placeholder="不填写证书上将显示你的微信昵称" onChange={this.changeName}/>
					</div>
				</Confirm>

				{
					campStatus === 'open' && this.props.isFocusThree === 'N' && this.state.showNewGuide && (
						<div className="new-guide" onClick={this.closeNewGuide}>
							<div className="bg"></div>
						</div>
					)
				}

			</Page>
		) : null
	}
}
TrainingCampDetails.childContextTypes = {
	lazyVideo: PropTypes.object
};

module.exports = connect(mapStateToProps, mapActionToProps)(TrainingCampDetails);