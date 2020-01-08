/**
 * Created by dylanssg on 2018/1/3.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';

import { pushDistributionCardMaking } from '../coral-poster-generate';

import {
	locationTo,
	imgUrlFormat,
	formatMoney,
} from 'components/util';
import {
	fillParams,
} from 'components/url-utils';


//珊瑚计划的推广弹框
class Tutorial extends Component {
	state = {
		pushBoxData:this.props.datas||{},
		mainVersible:true,
		haibaopic:'',
	}
	componentDidMount() {
		//复制链接
		var clipboard = new Clipboard(".fuzhi");
		clipboard.on('success', function(e) {
			window.toast('复制成功！');
		});
		clipboard.on('error', function(e) {
			window.toast('复制失败！请手动复制');
		});
	}

	componentWillUpdate(nextProps){
		//判断二维码是否相同目的是判断课程是否相同
			if(nextProps.qrurl&&nextProps.qrurl !== this.props.qrurl){   //nextProps.datas !== this.props.datas||
				pushDistributionCardMaking("https://img.qlchat.com/qlLive/coral/push-card-back.png",nextProps.datas,nextProps.userInfo,this.setImgFunc.bind(this), true,"PersonCount", 600, 900, this.props.officialKey,nextProps.qrurl);
			}
	}
	setImgFunc(url){
		this.setState({
			haibaopic:url,
			mainVersible:true,
		});
		this.props.drawHaibao(url);//把画好的邀请卡换到父级组件
	}
	haibaoCheck(){
		window.showImageViewer(this.state.haibaopic, [this.state.haibaopic]);
	}
	onPushBoxClose(){
		this.props.onClose();
	}

	render() {
		return (
			<div className={`coral-promo-tutorial${this.props.displayType === 'inset' ? ' inset' : ''}`}>
				{this.state.mainVersible&&<div className="bg" onClick={this.onPushBoxClose.bind(this)}></div>}
				{
					this.state.mainVersible&&
					<div className="main">
						{
							this.props.displayType !== 'inset' &&
							<div className="top">
								{/*<span className="title"><i className="icon_checked"></i>已加入推广列表</span>*/}
								<span className="icon_delete" onClick={this.onPushBoxClose.bind(this)}></span>
							</div>
						}
						<div className="info">
							<div className="left"><img src={imgUrlFormat(this.props.datas.businessImage,"@296h_480w_1e_1c_2o")} alt=""/></div>
							<div className="right">
								<span className="name elli-text">{this.props.datas.businessName}</span>
								<span className="price">售价：￥{this.props.datas.isAuditionOpen!=='Y'?formatMoney(this.props.datas.amount || this.props.datas.money):0}</span>
								<span className="income">预计收益：￥{this.props.datas.isAuditionOpen!=='Y'?formatMoney(Number(this.props.datas.percent*(this.props.datas.amount || this.props.datas.money)/100),100):0}</span>
							</div>
						</div>
						<div className="push-channel">
							<ul>
								<li className="flex-box">
									<div className="left">
										<span className="title">方式1：专属分享链接</span>
										<span className="tip">分享此链接完成购买即可获得收益</span>
										<span className="content elli-text">
                                            {
	                                            this.props.datas.url?
		                                            (/(officialKey)/.test(this.props.datas.url)?this.props.datas.url:fillParams({officialKey:this.props.officialKey},this.props.datas.url))
		                                            :
		                                            (
			                                            this.props.datas.businessType==="CHANNEL"?
				                                            `${window.location.origin}/live/channel/channelPage/${this.props.datas.businessId}.htm?officialKey=${this.props.officialKey}&pro_cl=coral`
				                                            :
				                                            `${window.location.origin}/wechat/page/topic-intro?topicId=${this.props.datas.businessId}&officialKey=${this.props.officialKey}&pro_cl=coral`
		                                            )
                                            }
                                        </span>
									</div>
									<div className="right">
										<span className="btn-fuzhi fuzhi on-log"
											data-log-region="btn-copy-link"
											data-log-pos="coral-promo-dialog"
											data-clipboard-text={
												this.props.datas.url?
													(/(officialKey)/.test(this.props.datas.url)?this.props.datas.url:fillParams({officialKey:this.props.officialKey},this.props.datas.url))
													:
													(
														this.props.datas.businessType==="CHANNEL"?
															`${window.location.origin}/live/channel/channelPage/${this.props.datas.businessId}.htm?officialKey=${this.props.officialKey}&pro_cl=coral`
															:
															`${window.location.origin}/wechat/page/topic-intro?topicId=${this.props.datas.businessId}&officialKey=${this.props.officialKey}&pro_cl=coral`
													)}>
										复制链接
								</span>
									</div>
								</li>
								<li className="flex-box">
									<div className="left">
									<span className="title">方式2：专属推广海报</span>
										<span className="tip">
                                            点击右侧推广海报，长按转发给朋友
                                            {/* <br/>
                                            或朋友圈进行推广 */}
                                        </span>
									</div>
									<div className="right">
                                        <span className="haibao-pic on-log" data-log-region="promo-poster" data-log-pos="coral-promo-dialog" onClick={this.haibaoCheck.bind(this)}>
											{
												this.props.haibaopic&&
												<img src={this.props.haibaopic}
												className={`on-visible`}
												data-log-name="珊瑚计划邀请卡"
												data-log-region="visible-coral-personParty"
												data-log-pos="personParty"  alt=""/>
											}
                                        </span>
									</div>


								</li>
								<li className="flex-box">
									<div className="left">
										<span className="title">方式3：直接分享</span>
										<span className="tip">
                                            点击右上角<i className="icon_dots_horizontal"></i>，【发送给好友】进行推广
                                        </span>
									</div>

								</li>
							</ul>
						</div>
						{
							this.props.displayType === 'inset' ?
								<div className="operation">
									<div className="close-btn on-log" data-log-region="close-coral-promo-dialog" onClick={this.props.onClose}>关闭</div>
									<div className="look-btn on-log" data-log-region="check-push-list" data-log-pos="coral-promo-dialog" onClick={()=>locationTo('/wechat/page/coral/shop/push-list')}>查看推广列表</div>
								</div>
								:
								<div className="btn-look on-log" data-log-region="check-push-list" data-log-pos="coral-promo-dialog" onClick={()=>locationTo('/wechat/page/coral/shop/push-list')}>查看推广列表</div>
						}
					</div>
				}
			</div>
		);
	}
}

Tutorial.propTypes = {
	drawHaibao: PropTypes.func,
	onClose: PropTypes.func.isRequired,
	datas: PropTypes.object.isRequired,//价格的单位是分
	officialKey: PropTypes.string.isRequired,
	displayType: PropTypes.string,
	haibaopic: PropTypes.string.isRequired,//初始化弹框时，置空邀请卡（生成邀请卡需要一定的时间，先置空原来的邀请卡，提高用户体验）

};

export default Tutorial;