/**
 * Created by dylanssg on 2017/12/15.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';
import { autobind } from 'core-decorators';
import * as envi from "../../../components/envi";
import Tutorial from "./components/tutorial";
import { pushDistributionCardMaking } from './components/coral-poster-generate';
import ScrollToLoad from "../../../components/scrollToLoad";
import { getQr, getUserInfo } from 'actions/common';

import {
	getCourseMaterial
} from 'coral_actions/shop';

import {
	dangerHtml
} from 'components/util';


@autobind
class CoralPromoDialog extends Component {
	state = {
		businessId: '',
		businessType: '',
		show: false,
		animate: false,
		materialList: [],
		noData: false,
		noMore: false,
		qrurl:'',

		currentIndex:0,
		defaltMeterialList:[
			{desc:'课程太棒！实在忍不住分享一下！\n 主讲《courseName》\n 让知识变的如此易懂，扫码就可以查看课程~'},
			{desc:'发现一门好课~推荐！\n 通俗易懂，打开我另一个角度的思考。'},
			{desc:'所有的优秀都是训练的结果。\n 而这门课程，干货满满，让我获得了最丰富实用的只知识。\n 推荐！推荐！'},
			{desc:'我希望未来的几年，不要因为懈怠而辜负了自己。\n我们不断往上爬，不是为了被世界看见，而是为了看见世界。\n 加油！欢迎加入我的成长小分队~'},
			{desc:'勇敢的人总是在寂寥的夜里，不动声色的强大！\n 我正在学习：《courseName》'},
			{desc:'这真是个好课，很好的那种！\n 看到别人分享，刚好是我需要的知识，就报名试试看。\n 上完课，受益匪浅，老师的见解和经验都非常宝贵，推荐给有需要的人。'},
		],
		haibaopic:'',
		userInfo: this.props.userInfo,
		cardMap:[],
	};

	data = {
		page: 1,
		pageSize: 20,		
	};


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
			// this.bingLongTouchLog('imgWrapper');
			
		}
		if(this.props.courseData.businessId && this.props.courseData.businessId !== prevProps.courseData.businessId){
			this.setState({
				haibaopic:'',//初始化邀请卡置空邀请卡链接
			});
			this.getCourseMaterial(1);//获取素材
			this.getQrcode(this.props.courseData.businessType,this.props.courseData.businessId);//获取二维码跳转url

		}
		
	}

	bingLongTouchLog(el){
		var self = this;
		setTimeout(()=>{
			if (envi.isAndroid() || envi.isIOS()) {
				this[el].addEventListener('touchstart', self.startFn.bind(self), false);
				document.addEventListener('touchend', this.endFn.bind(this), false);
				document.addEventListener('touchcancel', this.endFn.bind(this), false);
			} else {
				this[el].addEventListener('mousedown', self.mouseRightFn.bind(self), false);
			}
		},300)
	}

	startFn(e){
		this.touching=true;
		this.touchImgTimer = setInterval(()=>{
			this.calllog(this.data.businessType,this.data.businessId);
		},700);
	}

	endFn(e){
		if(this.touching){
			clearInterval(this.touchImgTimer);
			this.touching = false;
		}
		
	}

	mouseRightFn (e){
		if(e.button===2){
			this.calllog(this.data.businessType,this.data.businessId);
		}
	}

    /**
     * 打日志
     *
     * @param {string} type 课程类型，有效值为 topic|channel
	 * @param {string} id 课程id
	 * 珊瑚计划的卡片长按 日志category = “extension-coral”
     */
    calllog (type,id,category) {
        typeof _qla !== 'undefined' && _qla('event',{
            category: 'extension-coral',
            action: "success",
            business_type: type,
			business_id:id,
        })
    }

	componentDidMount(){
		if(this.state.userInfo&&!this.state.userInfo.userId){
			this.initUserInfo();
		}
		
		this.activeAnimate();

		const clipboard = new Clipboard('.copy-btn');
		clipboard.on('success', function(e) {
			window.toast('文案已复制成功');
		});
		clipboard.on('error', function(e) {
			window.toast('复制失败！请手动复制');
		});
		// this.getQrcode(this.props.courseData.businessType,this.props.courseData.businessId);//获取二维码跳转url
		if(this.props.courseData.businessId){
			this.getCourseMaterial(1);//获取素材
			this.getQrcode(this.props.courseData.businessType,this.props.courseData.businessId);//获取二维码跳转url
		}
			
		
	}

	async initUserInfo(){
		await this.props.getUserInfo();
		this.setState({
			userInfo: this.props.userInfo.user,
		});
	}

	async getQrcode(businessType,businessId){
		let result = await this.props.getQr({
			channel: 'personParty',
			showQl: 'N',
			toUserId: this.props.officialKey,
			channelId: businessType==='CHANNEL'?businessId:'',
			topicId: businessType!=='CHANNEL'?businessId:'',
		});
		this.setState({
			qrurl:result.data&&result.data.qrUrl
		})
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
					materialList: this.state.defaltMeterialList,
					noMore: true
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

	showOriginImg(url,imgUrlList){
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

	generatePoster(){
		if(this.state.haibaopic){
			return false;
		}
		window.loading(true);
		pushDistributionCardMaking("https://img.qlchat.com/qlLive/coral/push-card-back.png",this.props.courseData,this.state.userInfo,(url) => {
			window.loading(false);
			// window.showImageViewer(url,[url]);
			this.setState({
				haibaopic:url,
			});
		}, true, "PersonCount", 600, 900, this.props.officialKey,this.state.qrurl);

	}
	drawHaibao(url){
		let cardMap = this.state.cardMap;
		cardMap[this.props.courseData.businessId] = url;
		console.log(this.props.courseData.businessId)
		console.log(cardMap)
		this.setState({
			haibaopic:url,
			cardMap,
		});
	}

	onClickClose = e => {
		typeof _qla === 'undefined' || _qla('click', {region: 'close-coral-promo-dialog'});
		this.props.close(e);
	}

	// changeDesc(){
	// 	this.setState({
	// 		currentIndex: (this.state.currentIndex < this.state.materialList.length-1 ? (++this.state.currentIndex):0)
	// 	});
	// }

	render(){
		const item = this.state.materialList[this.state.currentIndex];
		return (
			<div className={`coral-promo-dialog${this.state.show ? ' show' : ''}${this.state.animate ? ' animate' : ''}`}
				onClick={this.onClickClose} >
				<div className="container" onClick={e => e.stopPropagation()}>
					<div className="nav">
						<div className={`item on-log${this.props.nav === 'tutorial' ? ' current' : ''}`}
							data-log-region="tab-promo"
							data-log-pos="coral-promo-dialog"
							onClick={() => this.props.switchNav('tutorial')}>课程推广</div>
						<div className={`item on-log${this.props.nav === 'material' ? ' current' : ''}`}
							data-log-region="tab-material"
							data-log-pos="coral-promo-dialog"
							onClick={() => this.props.switchNav('material')}>推广素材</div>
					</div>
					{/* <div className="tips-top">长按图片并保存 > 复制分享文案 > 发送到朋友圈或群</div> */}
					<div className={`content-wrapper ${this.props.nav}`}>

						<div className="promotion-box">
							{
								this.props.officialKey &&
								<Tutorial
									datas ={this.props.courseData}
									officialKey ={this.props.officialKey}
									displayType ="inset"
									onClose ={this.props.close}
									qrurl ={this.state.cardMap[this.props.courseData.businessId]?'':this.state.qrurl}
									drawHaibao ={this.drawHaibao}
									userInfo ={this.state.userInfo}
									haibaopic = {this.state.cardMap[this.props.courseData.businessId]?this.state.cardMap[this.props.courseData.businessId]:this.state.haibaopic}
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
								this.state.materialList.map((item,i)=>{
									return <div className="material-item material-list-scroll-wrap" key={i}>
									<div className="main-body">
										<div className="avatar">
											<img src={`${this.state.userInfo.headImgUrl}?x-oss-process=image/resize,h_90,w_90,m_fill`} alt=""/>
										</div>
										<div className="content">
											<div className="promotion-tag">{this.state.userInfo.name}</div>
											<div className="promotion-text"  dangerouslySetInnerHTML={dangerHtml(item.desc && item.desc.replace(/\n/g,'<br/>').replace('courseName',this.props.courseData.businessName))}></div>
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
										</div>
									</div>
									<div className="operation">
										<div className="get-poster-btn on-log"
											data-log-region="btn-get-poster"
											data-log-pos="coral-promo-dialog"
											onClick={this.showOriginImg.bind(this, this.state.haibaopic,[this.state.haibaopic])}>获取推广海报</div>
										<div className="copy-btn on-log"
											data-log-region="extension-area"
											data-log-pos="copywriting"
											data-clipboard-text={item.desc.replace('courseName',this.props.courseData.businessName)}>复制文案</div>
									</div>
								</div>
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

CoralPromoDialog.defaultProps = {
	nav: 'material',
	courseData: {}
};

CoralPromoDialog.propTypes = {
	show: PropTypes.bool.isRequired,
	nav: PropTypes.oneOf(['tutorial', 'material']),
	close: PropTypes.func,
	switchNav: PropTypes.func,
};

function mapStateToProps (state) {
	return {
		userInfo: state.common.userInfo,
	}
}

const mapActionToProps = {
	getCourseMaterial,
	getQr,
	getUserInfo,
};

module.exports = connect(mapStateToProps, mapActionToProps)(CoralPromoDialog);