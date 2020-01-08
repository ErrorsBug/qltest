/**
 *
 * @author Dylan
 * @date 2019-04-25
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { digitFormat, locationTo } from	'components/util';
import { isQlchat } from 'components/envi';
import openApp from 'components/open-app';

import {request, isAuthCourse, authFreeCourse, getFirstTopicInChannel} from 'common_actions/common';

@autobind
class FreeColumn extends Component {

	state = {
		categoryList: [],
		subjectList: [],
		noData: false,
		noMore: false,
	};

	data = {
		tagId: '',
		page: 1,
		size: 20,
	};

	async componentDidMount() {
		this.getCategoryList();
	}

	async getCategoryList(){
		const res = await request.post({
			url: '/api/wechat/transfer/h5/freeModule/getAllTags',
		});
		if(res.state.code !== 0){
			window.toast(res.state.msg || '网络错误，请稍后重试');
			return false;
		}
		const categoryList = res.data?.tags || [];
		if(categoryList.length){
			categoryList[0].activated = true;
			this.setState({
				categoryList
			});
			this.data.tagId = categoryList[0]?.id;
			this.getSubjectList({
				tagId: this.data.tagId + '',
				page: 1
			})
		}else{
			window.toast('缺少分类')
		}
	}

	async getSubjectList({ tagId, page }){
		if(page === 1){
			window.loading(true)
		}
		const res = await request.post({
			url: '/api/wechat/transfer/h5/freeModule/subjectList',
			memoryCache: true,
			body: {
				tagId,
				pageNum: page,
				pageSize: this.data.size
			}
		});
		window.loading(false)

		if(res.state.code !== 0){
			window.toast(res.state.msg || '网络错误，请稍后重试');
			return false;
		}

		const subjectList = res.data?.subjectList || [];
		const length = subjectList.length;

		// 过滤没有课程的主题和主题内付费课程
		const validSubjectList = subjectList.filter(s => {
			if(s.freeModuleCourseDtoList?.length){
				s.freeModuleCourseDtoList = s.freeModuleCourseDtoList.filter(c => {
					return c.isAuditionOpen === 'Y' || !c.money || c.money === 0;
				});
				return !!s.freeModuleCourseDtoList?.length
			}else{
				return false
			}
		});
		const validLength = validSubjectList.length;

		if(validLength){
			this.setState({
				subjectList: page === 1 ? validSubjectList : [...this.state.subjectList, ...validSubjectList],
				noMore: length < this.data.size,
				noData: false
			})
		}else{
			this.setState({
				subjectList: page === 1 ? [] : this.state.subjectList,
				noData: !validLength && page === 1 && length < this.data.size,
				noMore: length < this.data.size,
			})
		}

	}

	categoryListItemClickHandle(e){
		const tagId = e.target?.dataset?.tagId;
		if(tagId && tagId !== this.data.tagId){

			const categoryList = [...this.state.categoryList];
			categoryList.forEach(c => {
				if(c.id + '' === tagId){
					c.activated = true
				}else{
					c.activated = false
				}
			});
			this.setState({
				categoryList
			})

			this.data.tagId = tagId;
			this.data.page = 1;
			this.getSubjectList({
				tagId,
				page: this.data.page,
			})
		}
	}

	async loadMoreSubject(next){
		this.data.page += 1;
		await this.getSubjectList({
			tagId: this.data.tagId,
			page: this.data.page
		});
		next();
	}

	async courseClickHandle(course){
		window.sessionStorage.setItem('freeColumnWords', course.jumpWord);
		window.sessionStorage.setItem('freeColumnJumpUrl', course.jumpUrl);
		if(course.auditionTopicId ){
			locationTo(`/topic/details?topicId=${course.auditionTopicId}`)
			// locationTo(`/wechat/page/topic-simple-video?topicId=${course.auditionTopicId}`)
		}else{
			window.loading(true)
			if(await isAuthCourse({ businessId: course.businessId, businessType: course.businessType })  === 'Y'){
				window.loading(false);
				// 已有权限
				if(course.businessType === 'topic') {
					// if(isQlchat()){
						locationTo(`/topic/details?topicId=${course.businessId}`)
					// }else{
					// 	locationTo(`/wechat/page/topic-simple-video?topicId=${course.businessId}`)
					// }
				}else{
					window.loading(true)
					const topic = await getFirstTopicInChannel(course.businessId);
					window.loading(false);
					if(topic?.id){
						// if(isQlchat()){
							locationTo(`/topic/details?topicId=${topic.id}`)
						// }else{
						// 	locationTo(`/wechat/page/topic-simple-video?topicId=${topic.id}`);
						// }
					}else{
						window.toast('获取课程失败，请稍后重试')
					}
				}
			}else{
				// 没权限就帮他报名
				const res = await authFreeCourse({
					businessId: course.businessId,
					businessType: course.businessType
				});
				window.loading(false);
				if(res === 'success'){
					if(course.businessType === 'topic'){
						// if(isQlchat()){
							locationTo(`/topic/details?topicId=${course.businessId}`)
						// }else{
						// 	locationTo(`/wechat/page/topic-simple-video?topicId=${course.businessId}`)
						// }
					}else{
						window.loading(true)
						const topic = await getFirstTopicInChannel(course.businessId);
						window.loading(false);
						if(topic?.id){
							// if(isQlchat()){
								locationTo(`/topic/details?topicId=${topic.id}`)
							// }else{
							// 	locationTo(`/wechat/page/topic-simple-video?topicId=${topic.id}`);
							// }
						}else{
							window.toast('获取课程失败，请稍后重试')
						}
					}
				}else{
					window.toast('网络错误，请稍后再试');
				}
			}
		}
	}

	render(){
		return (
			<Page title={`免费专栏`} className='free-column-page'>
				<div className="top-category-bar">
					{
						!isQlchat() &&
						<div className="to-recommend-btn" onClick={e => locationTo('/wechat/page/recommend')}>首页</div>
					}
					<div className="category-list">
						{
							this.state.categoryList.map((c, i) => (
								<div className={`list-item${c.activated ? ' current' : ''} on-log`}
									 data-log-region="categoryItem"
									 data-log-pos={i}
									 data-tag-id={c.id}
									 key={i}
									 onClick={this.categoryListItemClickHandle}
								>{c.name}</div>
							))
						}
					</div>
				</div>
				<ScrollToLoad
					className="scroll-container"
					toBottomHeight={300}
					loadNext={this.loadMoreSubject}
					noneOne={this.state.noData}
					noMore={this.state.noMore}
					scrollToDo={this.scrollingFunc}
				>
					<div className="subject-list">
						{
							this.state.subjectList.map((s, i) => (
								<div className="subject-item" key={i}>
									<div className="title">{s.name}</div>
									<div className="course-list">
									{
										s.freeModuleCourseDtoList.map((c, i) => (
											<div className="course-item"
												 key={i}
												 data-log-region="courseItem"
												 data-log-pos={i}
												 onClick={e => this.courseClickHandle(c)}
											>
												<div className="cover">
													<Picture
														src={c.headImageUrl}
														resize={{
															w: 294,
															h: 182
														}}
													/>
												</div>
												<div className="course-details">
													<div className="name">{c.businessName}</div>
													<div className="desc">{c.description}</div>
													<div className="bottom-bar">
														<div className="learned-num">{digitFormat(c.leaningNum)}次学习</div>
														<div className="play-btn">播放</div>
													</div>
												</div>
											</div>
										))
									}
									</div>
								</div>
							))
						}
					</div>
				</ScrollToLoad>
			</Page>
		)
	}
}

export default FreeColumn