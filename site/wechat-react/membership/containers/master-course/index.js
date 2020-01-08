
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Picture from 'ql-react-picture';
import ScrollToLoad from 'components/scrollToLoad';
import { fillParams } from 'components/url-utils';
import { findDOMNode } from 'react-dom';
import { formatDate, formatMoney, locationTo, getVal, getChannelFromTypeOfBusiness } from 'components/util'
import Page from 'components/page';
import MasterCourseItem from './components/course-item';
import MasterCourseDetails from './components/course-details';
import { share } from 'components/wx-utils';
import {AudioPlayer} from 'components/audio-player';
import { request } from 'common_actions/common';

import {
	doPay,
	getQr,
} from 'common_actions/common'

import {
	getQualityTag,
	getQualityCourse,
	selectCourse,
	getCourseInfo,
	fetchMediaUrl,
	getCourseTopicList,
} from '../../actions/master'
import {
	updateMemberInfo,
} from '../../actions/member'
import { autobind } from 'core-decorators';
import { logMemberTrace } from 'components/log-util';
import { memberMasterConfigure } from '../../config';

function mapStateToProps (state) {
	return {
		sysTime: get(state, 'common.sysTime'),
		//会员信息
		memberLevel: get(state, 'member.info.level'),
		memberCourseNum: get(state, 'member.info.courseNum'),
		expireTime: get(state, 'member.info.expireTime'),
		memberAppId: get(state, 'member.centerInitData.memberAppId'),
		centerInitData: get(state, 'member.centerInitData'),
	}
}

const mapActionToProps = {
	getQualityTag,
	getQualityCourse,
	selectCourse,
	doPay,
	updateMemberInfo,
	getCourseInfo,
	getQr,
	fetchMediaUrl,
	getCourseTopicList,
};

@autobind
class MasterCourse extends Component {

	data = {
		pageSize: 20,
		// 大师课列表分页数据
		dataCourseList: {},
		// 大师课列表已选数据 (需置顶)
		dataCourseListSelected: {},
		// 列表项详情介绍
		dataCourseDetails: {},
	}

	state = {
		courseList: [],
		courseListSelected: [],
        coursePage: 1,
		courseNoMore: false,

		
		tagList: [],
		categoryId: null,
		courseDetails: null,
		courseDetailsId: '',
		courseDetailsType: '',
		topicListPage: 2,
		isTopicListMore: false,

		// 已选中列表
		selectList: [],

		openVipDialog: false,
		showCourseDetatils: false,

		playerTopicId: '',
		active: false,

		inviteMemberId: undefined,
	}

	async componentDidMount () {

		this.initAudio();

		await this.initTagList()
		this.initPageDate()
		
		this.initShare()
		
		this.initRedpacket();
	}

	// 加载页面数据
	async initPageDate () {

		this.fetchCourseList(1, true)

	}

    initAudio() {
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.on('pause', this.disableAudio.bind(this));
	}
	
    disableAudio() {
        this.audioPlayer.pause();
        this.setState({active: false});
    }

    activeAudio(audioPlayerUrl, topicId) {
		const params = {
			active: true,
		}
		if (audioPlayerUrl) {
			this.audioPlayer.play(audioPlayerUrl)
			params.playerTopicId = topicId
		} else {
			this.audioPlayer.resume()
		}
		this.setState(params)
        // 临时兼容添加延时
        // setTimeout(() => this.setState(params), 300)
        // this.setState({active: true});
    }

    async handleAudioPlay(topicId, sourceTopicId) {
		
		if (topicId === this.state.playerTopicId) {
			if (this.state.active) {
				this.disableAudio();
			} else {
				this.activeAudio();
			}
		} else {
			
			let mediaResut = await this.props.fetchMediaUrl(topicId, sourceTopicId);

			if (mediaResut.state.code === 0) {
				const audioPlayerUrl = getVal(mediaResut, 'data.audio.playUrl', '')
				if (audioPlayerUrl) {
					this.activeAudio(audioPlayerUrl, topicId)
				} else {
					window.toast('获取播放地址失败')
				}
			} else {
				window.toast(mediaResut.state.msg)
			}
		}
		
    }
	
	initShare() {
        const shareUrl = window.location.protocol + "//" + window.location.host + `/wechat/page/membership-center`
		share({
			title: "千聊会员-一张通往终身成长大学的门票",
			desc: "千聊会员，尊享口碑大课免费学、精品好课免费学、海量课程八折优惠、会员专属优惠券、大咖社群陪你学等多种会员权益！",
			imgUrl: window.location.protocol + require("../experience-invitation/img/share-logo.png"),
			shareUrl
		});
	}

	async initTagList () {
		const categoryId = typeof location !== 'undefined' && (this.props.location.query.tagId || 0)
		const res = await this.props.getQualityTag()
		this.setState({
			tagList: [
				{
					id: 0,
					name: '全部'
				},
				...res
			],
			categoryId
		})
	}

    // 替换当前url地址
    replaceUrl(categoryId) {
        let query = this.props.router.location.query;
        let url = '';

        if (('' + categoryId) === '0') {
            delete query.tagId;
        } else {
            query = { ...query,
                tagId: categoryId
            };
        }

        url = fillParams(query, this.props.router.location.pathname);

		this.props.router.replace(url);
	}

	tagClick (item) {
		
		const categoryId = item.id

		if (categoryId === this.tagId) return
		this.replaceUrl(categoryId)
		
		setTimeout(() => {
			let scrollBoxDom = findDOMNode(this.refs.scrollBox);
			scrollBoxDom.scrollTop = 0;
		}, 0);

		this.setState({
			categoryId,
			coursePage: 1,
			courseList: [],
			courseNoMore: false
		}, () => {
			this.loadMore()
		})
	}

	get tagId () {
		return this.state.categoryId || 0
	}

	// 是否正式会员
	get isMember () {
		const { memberLevel, expireTime, sysTime } = this.props
		return memberLevel === 2 && sysTime < expireTime
	}

	get maxSelect () {
		return this.isMember ? this.props.memberCourseNum : 2
	}

	// 是否开启50选2 非正式会员 || (正式会员 & 有可选课程数量)
	get isOpenMemberSelect () {
		const { memberLevel } = this.props

		return memberLevel !== 2 || (memberLevel === 2 && this.maxSelect !== 0)
	}

	getCourseList (page) {
		let {dataCourseList, pageSize} = this.data;
		let sliceStartIndex = (page - 1) * pageSize;
		let sliceEndIndex = page * pageSize;
		const courseList = dataCourseList["" + this.tagId] || [];
		if(courseList.length && courseList[0].isExtraCourse){
			if(page > 1){
				sliceStartIndex += 1;
			}
			sliceEndIndex += 1;
		}
		return courseList.slice(sliceStartIndex, sliceEndIndex)
	}

	getCourseListSelected () {
		const {dataCourseListSelected} = this.data
		return dataCourseListSelected["" + this.tagId] || []
	}

	/**
	 * 加载页面列表
	 * @param {*} page 
	 * @param {*} firstLoadingParams 首次加载指定参数
	 */
	async fetchCourseList (page, firstFetch) {
		
		console.log(`页面TagId: ${this.tagId}`)

        let {
			courseList,
		} = this.state

		let resultList = this.getCourseList(page)
		let courseListSelected = this.getCourseListSelected()
		let res;

		const {
			businessId,
			businessType
		} = this.props.location.query;

		if (resultList.length === 0) {
			let params = {
				tagId: this.tagId,
				pageNum: page,
				pageSize: this.data.pageSize,
				businessId: businessId || '',
				businessType: businessType || ''
			};
			

			res = await this.props.getQualityCourse(params)
			resultList = res.qualityCourseList || []

			// 首次加载默认选中指定课程 (如有指定)
			const enterMemberCourse = res.enterMemberCourse
			if (page === 1 && enterMemberCourse && (enterMemberCourse.tagId === this.tagId || this.tagId === 0)) {
				resultList.unshift({ ...enterMemberCourse, isExtraCourse: true });
				// selectList.push({ ...enterMemberCourse, isChoose: true })
			}

			this.data.dataCourseList["" + this.tagId] = [...(this.data.dataCourseList[this.tagId] || []), ...resultList]

			if (page === 1) {
				courseListSelected = res.selectedCourseList || []
				this.data.dataCourseListSelected["" + this.tagId] = [...courseListSelected]
			}
		}

		// 切换tab时同步状态
		resultList.forEach(item => {
			if(this.state.selectList.length){
				if(!this.state.selectList.some(seletedItem => {
					if(item.businessId === seletedItem.businessId){
						item.isChoose = true;
						return true;
					}else{
						return false;
					}
				})){
					item.isChoose = false;
				}
			}else if(item.isChoose){
				item.isChoose = false;
			}

		});

		// resultList.map(item => {
		// 	let isChoose = false
		// 	selectList.map( sItem => {
		// 		if (sItem.businessId === item.businessId) {
		// 			isChoose = true
		// 		}
		// 	})
		// 	item.isChoose = isChoose
		// })

		const dataList = page !== 1 ? [...courseList, ...resultList] : [...resultList]

		const state = {
			courseList: dataList,
			courseListSelected,
			coursePage: page + 1,
			courseNoMore: resultList.length < this.data.pageSize,
		}
		
		this.setState(state, () => {
			if (firstFetch && this.state.courseList.length && this.state.courseList[0].businessId === businessId && !this.state.courseList[0].isChoose) {
				this.masterItemClick(this.state.courseList[0], 0)
			}
		})
	}

	loadMore = async (next) => {

		const { coursePage, courseNoMore } = this.state
		
		if (!courseNoMore) {
			await this.fetchCourseList(coursePage)
		}

		next && next();
	}

	async fetchTopicList (page) {

		const {
			courseDetails,
		} = this.state

		let resultList = await this.props.getCourseTopicList({
			channelId: this.state.courseDetailsId,
			pageNum: page,
			pageSize: this.data.pageSize
		})

		const dataList = page !== 1 ? [...courseDetails.topicList, ...resultList] : [...resultList]

		this.setState({
			courseDetails: { ...courseDetails, topicList: dataList },
			topicListPage: page + 1,
			isTopicListMore: resultList.length < this.data.pageSize,
		})
	}

	loadMoreTopicList = async (next) => {

		const { topicListPage, isTopicListMore } = this.state
		
		if (!isTopicListMore) {
			await this.fetchTopicList(topicListPage)
		}

		next && next();
	}

	async masterItemClick (item, index) {
		let select = [...this.state.selectList]
		const isSelect = !item.isChoose

		if (isSelect && select.length === this.maxSelect) {
			window.toast('最多选择两门')
			return
		}
		
		if (typeof index === 'undefined') {
			this.state.courseList.some((cItem, cIdnex) => {
				if (cItem.businessId === item.businessId) {
					index = cIdnex;
					return true;
				}
			})
		}
		
		const course = await this.getCourseDetails(item.businessId, item.businessType);
		const courseList = [...this.state.courseList];
		if (course.isAuth) {
			window.toast('该课程已购买')
			courseList[index].isAuth = "Y"
		} else {
			if (!isSelect) {
				select = select.filter( s => s.businessId !== item.businessId)
			} else if(!select.length || (select[0] && select[0].businessId !== item.businessId)){
				item.isChoose = isSelect;
				select.push(item)
			}
			if (index > -1) {
				courseList[index].isChoose = isSelect
			}
		}
		this.setState({
			courseList,
			selectList: select
		})
	}

	// 提交选择
	async submitSelect (isJump) {
		const courseList = []

		this.state.selectList.map( item => {
			courseList.push({
				businessId: item.businessId,
				businessType: item.businessType
			})
		})

		const res = await this.props.selectCourse(courseList)

		if (isJump !== 'N' && res && res.state.code == 0) {
			window.location.href = '/wechat/page/membership-center'
		}
	}

	// 开通会员
	async openMember () {
		console.log('开通会员')
		await this.props.doPay({
			type: 'MEMBER',
			total_fee: '',
			inviteMemberId: this.state.inviteMemberId,
			callback: () => {
				this.onSuccessPayment();
			}
		})
	}

	async onSuccessPayment () {
		logMemberTrace({
			wcl: getChannelFromTypeOfBusiness('member', memberMasterConfigure),
			business: this.props.centerInitData.totalFee
		})

		// 页面数据重置
		await this.submitSelect('N')
		this.setState({
			selectList: []
		})
		await this.props.updateMemberInfo()
		this.data.dataCourseList = {}
		this.data.dataCourseListSelected = {}
		this.initPageDate()
		
		let result = await this.props.getQr({
			channel: 'memberCharge',
			appId: this.props.memberAppId,
			showQl: 'N'
		})

        if (result.state && result.state.code == '0') {
            this.setState({
				openVipDialog: true,
                qrUrl:result.data.qrUrl
            })
		}
	}

	toggleOpenVipDialog () {
		this.setState({
			openVipDialog: !this.state.openVipDialog
		})
	}

	async getCourseDetails (businessId, businessType) {
		let data = this.data.dataCourseDetails['' + businessId]

		if (!data) {
			const res = await this.props.getCourseInfo({
				businessId: businessId,
				businessType: businessType
			})
			if (res) {
				this.data.dataCourseDetails['' + businessId] = res
				data = res
			}
		}

		return data
	}

	async showCourseDetatils ({businessId, businessType}) {

		if (this.maxSelect > 0) {
			let data = await this.getCourseDetails(businessId, businessType)
	
			if (data) {
				this.setState({
					courseDetails: data,
					courseDetailsId: businessId,
					courseDetailsType: businessType,
					showCourseDetatils: true,
					topicListPage: 2,
					isTopicListMore: data.topicList && data.topicList.length < this.data.pageSize,
				})
			}
		} else { 
			if(businessType === 'channel'){
				locationTo(`/wechat/page/channel-intro?channelId=${businessId}`)
			}else if(businessType === 'topic'){
				locationTo(`/wechat/page/topic-intro?topicId=${businessId}`)
			}
		}
	}

	closeCourseDetatils () {
		this.disableAudio()
		this.setState({
			showCourseDetatils: false,
			playerTopicId: ''
		})
	}

	renderCourseItem () {

		const {
			courseList,
			courseListSelected
		} = this.state

		const isOpenMemberSelect = this.isOpenMemberSelect
		const isMember = this.isMember

		const renderList = []

		courseListSelected.map( (item, index) => {
			
			renderList.push( 
				<MasterCourseItem
					key={`master-course-item-selected-${index}`}
					itemClick={this.showCourseDetatils.bind(this)}
					isMember={isMember}
					data={item} />
			)
		})

		courseList.map( (item, index) => {
			if(index === 0 || item.businessId !== this.props.location.query.businessId){
				renderList.push(
					<MasterCourseItem
						key={`master-course-item-${index}`}
						index={index}
						isOpenMemberSelect={isOpenMemberSelect}
						itemClick={this.showCourseDetatils.bind(this)}
						isMember={isMember}
						itemChoose={this.masterItemClick.bind(this)}
						data={item} />
				)
			}
		})

		
		return renderList
	}

	renderPosterItem (selectList) {
		const renderList = []

		for (let i = 0; i < this.maxSelect; i++) {
			const sItem = selectList[i]
			renderList.push(
				sItem ? (
					<div key={`poster-item-${i}`} className="poster-item pic" onClick={() => {this.masterItemClick(sItem)}}>
						<span className="clear-btn"></span>
						<Picture src={sItem.logo} />
					</div>
				) : <div key={`poster-item-${i}`} className="poster-item"></div>
			)
		}

		return renderList
	}

	// 非会员绘制总价
	renderTotalMoney () {
		let total = 0
		this.state.selectList.map( item => {
			total += item.amount
		})

	return <p className="total-price">&yen;{formatMoney(total)}{total > 0 && <span> (会员免费)</span>}</p>
	}

	initRedpacket = () => {
		if (this.isMember) {
			return;
		}

		request.post({
			url: '/api/wechat/transfer/h5/member/invite/getRedPackInfo',
		}).then(res => {
			if (res.data.redpackInfo) {
				this.setState({
					inviteMemberId: res.data.redpackInfo.inviteUserId,
				})
			}
		}).catch(err => {
		})
	}

	render() {

		const { 
			tagList, 
			courseNoMore,
			selectList, 
			courseDetails,
			courseDetailsId,
			courseDetailsType, 
			playerTopicId,
			active,
			isTopicListMore,
		} = this.state

		let selectLength = selectList.length
		let maxSelect = this.maxSelect

		return (
			<Page title={maxSelect <= 0 ? `精品课` : '精品课免费学'} className='master-course-page'>
			
				<div className="category-menu-wrap">
					<div className="category-menu">
						{
							tagList.map((item, index) => (
								<div
									key={`category-item-${index}`}
									className={`category-item ${this.tagId == item.id ? 'active' : ''}`}
									onClick={() => { this.tagClick(item) }}
								>
									{item.name}
								</div>
							))
						}
					</div>
				</div>

				<ScrollToLoad
						ref="scrollBox"
						className={"master-course-container co-scroll-to-load"}
						toBottomHeight={88}
                        loadNext={this.loadMore}
                        noMore={courseNoMore}
                    >
					{
						this.renderCourseItem()
					}
				</ScrollToLoad>

				{/* 底部选择信息框 */}
				{
					this.isOpenMemberSelect && (
						<div className="information-box">
							{
								this.isMember ? (
									<div className="title member">
										<p className="title-main">大师课任选2门</p>
										<p className="title-vice">于<span className="time">{formatDate(this.props.expireTime, "yyyy.MM.dd")}</span>前完成挑选</p>
									</div>
								) : (
									<div className="title not-member">
										<p className="title-main">会员免费领2门</p>
										{
											this.renderTotalMoney()
										}
									</div>
								)
							}
							<div className="poster">
								{
									this.renderPosterItem(selectList)
								}
							</div>
							{
								selectLength === maxSelect ? this.isMember ? (
									<div className="confirm-btn" onClick={this.submitSelect}>确定</div>
								) : (
									<div 
										className="confirm-btn on-log" 
										data-log-name="开通会员"
										data-log-region="open-ql-member-btn"
										onClick={this.openMember}
										>开通会员</div>
								) : <div className="confirm-btn disable">还差{maxSelect - selectLength}门</div>
							}
						</div>
					)
				}

				{/* 课程详情展示 */}
				{
					this.state.showCourseDetatils && (
						<MasterCourseDetails
							courseDetails={courseDetails}
							businessId={courseDetailsId}
							businessType={courseDetailsType}
							playerTopicId={playerTopicId}
							playerStatus={active}
							audioPlay={this.handleAudioPlay}
							loadMoreTopicList={this.loadMoreTopicList}
							noMore={isTopicListMore}
							close={this.closeCourseDetatils}
							/>
					)
				}
				
				{
					this.state.openVipDialog && (
						<div className="open-vip-dialog">
							<div className="layer" onClick={this.toggleOpenVipDialog}></div>
							<div className="dialog-container">
								<div className="header">
									<i className="icon-member"></i>
									<p className="title">开通会员成功</p>
								</div>
								<div className="content">
									<p>恭喜，您已解锁六大会员权益！</p>
		
									<div className="qr-code">
										{
											this.state.qrUrl && <Picture src={this.state.qrUrl}/>
										}
									</div>
		
									<p>长按识别二维码，关注公众号，为您提供更多会员专属服务。</p>
								</div>
								<div className="footer" onClick={this.toggleOpenVipDialog}>
									<span>我知道了</span>
								</div>
							</div>
						</div>
					)
				}
			</Page>
		);
	}
}

module.exports = connect(mapStateToProps, mapActionToProps)(MasterCourse);