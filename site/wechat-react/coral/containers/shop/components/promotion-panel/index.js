/**
 * Created by dylanssg on 2017/12/15.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';
import { autobind } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
import CoralPushBox from 'components/dialogs-colorful/coral-push-box';
import { pushDistributionCardMaking } from 'components/dialogs-colorful/coral-push-box/draw-push-card';

import {
	getCourseMaterial
} from '../../../../actions/shop';

import {
	dangerHtml
} from 'components/util';

@autobind
class CoralPromotionPanel extends Component {
	state = {
		businessId: '',
		businessType: '',
		show: false,
		animate: false,
		materialList: [],
		noData: false,
		noMore: false,
	};

	data = {
		page: 1,
		pageSize: 10
	};

	// componentWillUpdate(nextProps){
	// 	console.log(nextProps);
	// 	if(nextProps.courseData.businessId && nextProps.courseData.businessId !== this.props.courseData.businessId){
	// 		this.getCourseMaterial(1);
	// 	}
	// }

	componentDidUpdate(prevProps){
		if(prevProps.show !== this.props.show){
			if(this.props.show){
				this.setState({
					show: this.props.show
				},() => {
					setTimeout(() => {
						this.setState({
							animate: true
						})
					},100);
				});
			}else{
				this.setState({
					animate: false
				},() => {
					setTimeout(() => {
						this.setState({
							show: false
						});
					},500);
				});
			}
		}
		if(this.props.courseData.businessId && this.props.courseData.businessId !== prevProps.courseData.businessId){
			this.getCourseMaterial(1);
		}
	}

	componentDidMount(){
		this.activeAnimate();

		const clipboard = new Clipboard('.copy-btn');
		clipboard.on('success', function(e) {
			window.toast('文案已复制成功');
		});
		clipboard.on('error', function(e) {
			window.toast('复制失败！请手动复制');
		});
	}

	async getCourseMaterial(pageNum){
		const {
			businessId,
			businessType
		} = this.props.courseData;

		if(!businessId) return false;

		if(pageNum === 1){
			this.data.page = 1;
			this.setState({
				noMore: false,
				noData: false
			});
		}

		const res = await this.props.getCourseMaterial({
			businessId,
			businessType,
			pageNum,
			pageSize: this.data.pageSize
		});
		if(res.state.code === 0){
			if(res.data.list && res.data.list.length){
				if(pageNum === 1){
					this.setState({
						materialList: res.data.list
					});
				}else{
					this.setState({
						materialList: [...this.state.materialList, ...res.data.list]
					});
				}
			}else if(pageNum === 1 && (!res.data.list || !res.data.list.length)){
				this.setState({
					materialList: [],
					noData: true
				});
			}
			if((pageNum === 1 && res.data.list && res.data.list.length && res.data.list.length < this.data.pageSize) || (pageNum !== 1 && (!res.data.list || !res.data.list.length || res.data.list.length < this.data.pageSize))){
				this.setState({
					noMore: true
				});
			}
		}
	}

	async loadNextMaterial(next){
		await this.getCourseMaterial(++this.data.page);
		next && next();
	}

	activeAnimate(){
		setTimeout(() => {
			this.setState({
				animationCls: true
			})
		},100);
	}

	showOriginImg(url, imgUrlList){
		window.showImageViewer(url, imgUrlList);
	}

	singleImgOnLoadHandle(img, wrapperRef){
		let wrapper = this[wrapperRef];
		if(img.height > img.width){
			if(img.height * 0.8 > img.width){
				img.style.height = wrapper.clientWidth * 1.2 + 'px';
			}else{
				img.style.width = '100%';
			}
		}else{
			if(img.width * 0.8 > img.height){
				img.style.width = wrapper.clientWidth * 1.2 + 'px';
			}else{
				img.style.height = '100%';
			}
		}
	}

	generatePoster(data){
		window.loading(true);
		pushDistributionCardMaking("https://img.qlchat.com/qlLive/coral/share-card-bgnew.jpg",this.props.courseData,(url) => {
			window.loading(false);
			window.showImageViewer(url,[url]);
		}, true, "W", 653, 653, this.props.officialKey,this.props.shareKey);

	}

	render(){
		return (
			<div className={`coral-promotion-panel${this.state.show ? ' show' : ''}${this.state.animate ? ' animate' : ''}`} onClick={this.props.close} >
				<div className="container" onClick={e => e.stopPropagation()}>
					<div className="nav">
						<div className={`item${this.props.nav === 'promotion' ? ' current' : ''}`} onClick={() => this.props.switchNav('promotion')}>课程推广</div>
						<div className={`item${this.props.nav === 'material' ? ' current' : ''}`} onClick={() => this.props.switchNav('material')}>推广素材</div>
					</div>
					<div className={`content-wrapper ${this.props.nav}`}>

						<div className="promotion-box">
							{
								this.props.officialKey &&
								<CoralPushBox
									datas={this.props.courseData}
									officialKey={this.props.officialKey}
									shareKey = {this.props.shareKey}
									displayType="inset"
									onClose={this.props.close}
								/>
							}
						</div>

						<div className="material-list" onTouchMove={e => {if(this.state.materialList.length < 2){e.preventDefault()}}}>
							<ScrollToLoad
								className='material-list-scroll-wrap'
								toBottomHeight={100}
								loadNext={this.loadNextMaterial}
								noneOne={this.state.noData}
								noMore={this.state.noMore}
							>
								{
									this.state.materialList.map((item, i) => {
										return (
											<div className="material-item" key={i}>
												<div className="main-body">
													<div className="avatar">
														<img src={`${this.props.userInfo.headImgUrl}?x-oss-process=image/resize,s_100`} alt=""/>
													</div>
													<div className="content">
														<div className="promotion-tag">推广文案</div>
														<div className="promotion-text"  dangerouslySetInnerHTML={dangerHtml(item.desc && item.desc.replace(/\n/g,'<br/>'))}></div>
														{
															item.pictrueList && !!item.pictrueList.length &&
															<div className={`img-list${item.pictrueList.length === 4 ? ' sp' : ''}`}>
																{
																	item.pictrueList.map((url, imgIndex) => {
																		return (
																			item.pictrueList.length === 1 ?
																				<div className="img-item sp" key={imgIndex} ref={(el) => { this[`imgWrapper${imgIndex}`] = el; }}>
																					<img src={url + '?x-oss-process=image/resize,s_425'} onLoad={(e) => this.singleImgOnLoadHandle(e.target, `imgWrapper${imgIndex}`)} onClick={this.showOriginImg.bind(this, url, item.pictrueList)} />
																				</div>
																				:
																				<div className="img-item" key={imgIndex} style={{backgroundImage: `url(${url.replace(/\@.*/,'')}?x-oss-process=image/resize,s_170)`}} onClick={this.showOriginImg.bind(this, url, item.pictrueList)}></div>
																		)
																	})
																}
															</div>
														}
														<div className="save-tip">点击图片长按保存</div>
													</div>
												</div>
												<div className="operation">
													<div className="get-poster-btn" onClick={this.generatePoster.bind(this, item)}>获取推广海报</div>
													<div className="copy-btn" data-clipboard-text={item.desc}>复制文案</div>
												</div>
											</div>
										)
									})
								}
							</ScrollToLoad>
							<div className="close-btn" onClick={this.props.close}></div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

CoralPromotionPanel.defaultProps = {
	nav: 'material',
	courseData: {}
};

CoralPromotionPanel.propTypes = {
	show: PropTypes.bool.isRequired,
	nav: PropTypes.oneOf(['promotion', 'material']),
	close: PropTypes.func,
	switchNav: PropTypes.func,
};

function mapStateToProps (state) {
	return {
		userInfo: (state.common.userInfo && state.common.userInfo.user) || {},
	}
}

const mapActionToProps = {
	getCourseMaterial
};

module.exports = connect(mapStateToProps, mapActionToProps)(CoralPromotionPanel);