import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import { getQr } from '../../actions/common';
import { request, getDomainUrl, fetchRelationInfo } from 'common_actions/common';
import {
    getLiveInfo
} from '../../actions/live';
import { imageProxy } from '@ql-feat/canvas-tools'; 

const imageProxyFunc = imageProxy('/api/wechat/image-proxy?url=');

@autobind
class newFinishPay extends Component {

	state = {
		relationInfo: undefined,
		qrUrl: null
	}

	// 是否正在进行touch事件
	isTouching = false

	get liveId() {
		return this.props.location.query.liveId || '';
	}

	// 是否订阅号
	get isSubscriptionAccount() {
		return this.props.location.query.isSubscriptionAccount;
	}

	get isBook(){
		return Object.is(this.props.location.query.isBook, 'Y') || false
	}

	async componentDidMount(){

		this.getWechatGroupName();
		this.getDomainUrl();
		// await this.getRelationInfo();

		// 如果是订阅号，3秒后自动跳转到
		if(this.isSubscriptionAccount === 'Y') {
			setTimeout(this.jumpToSubscriptionAccount,3000);
		}

		this.initQrCode()
	}

	async initQrCode () {
		const qrUrl = this.props.location.query.qrUrl ? decodeURIComponent(this.props.location.query.qrUrl) : ''

		if (qrUrl) {
			const liveInfo = await this.props.getLiveInfo(this.liveId)

			if (liveInfo && liveInfo.entity) { // 有liveId则在显示的二维码上导入直播间logo
				const liveLogo = liveInfo.entity.logo
				
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext("2d");
				this.watermark = new Image();
				this.editCover = new Image();
	
				// 绘制矩阵圆角
				const drawRadius = (ctx, x, y, width, height, radius) => {
					ctx.save()
					ctx.beginPath();
					//从右下角顺时针绘制，弧度从0到1/2PI  
					ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
	 
					//矩形下边线  
					ctx.lineTo(x + radius, y + height);
			 
					//左下角圆弧，弧度从1/2PI到PI  
					ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
			 
					//矩形左边线  
					ctx.lineTo(x + 0, y + radius);
			 
					//左上角圆弧，弧度从PI到3/2PI  
					ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
			 
					//上边线  
					ctx.lineTo(x + width - radius, y + 0);
			 
					//右上角圆弧  
					ctx.arc(x + width - radius, y + radius, radius, Math.PI * 3 / 2, Math.PI * 2);
			 
					//右边线  
					ctx.lineTo(x + width, y + height - radius);
					ctx.closePath();
				}
				
				this.editCover.onload = async ()=>{
					canvas.width = 500;
					canvas.height = 500;
					ctx.drawImage(this.editCover, 0, 0, 500, 500);
					this.watermark.onload = async ()=>{
						drawRadius(ctx, 202, 202, 104, 104, 6)
						ctx.clip()
						ctx.drawImage(this.watermark, 202, 202, 104, 104);
						const url = canvas.toDataURL('image/jpeg')
						this.setState({qrUrl: url})
						setTimeout(() => {
							typeof _qla != 'undefined' && _qla.collectVisible();
						}, 0);
					}
					this.watermark.src = imageProxyFunc(liveLogo);
				}
				this.editCover.src = imageProxyFunc(qrUrl);
			}
		} else {
			this.setState({qrUrl})
			setTimeout(() => {
				typeof _qla != 'undefined' && _qla.collectVisible();
			}, 0);
		}
	}

	get communityCode() {
        return this.props.location.query.communityCode||'';
	}
	

	touchStartHandle(){
		let category = 'focus-subAfterSign'
		if(this.props.location.query.payFree === 'inviteFree'){
			category = 'get-course'
		}
        this.isTouching = true
        this.touchTimer = setTimeout(() => {
            if(this.isTouching){
				typeof _qla != 'undefined' && _qla('event', {
					category,
					action:'success',
					trace_page: window.sessionStorage && window.sessionStorage.getItem('trace_page') || '',
				});
            }
        },700)
    }

    touchEndHandle(){
        if(this.isTouching){
			clearTimeout(this.touchTimer);
			this.isTouching= false;
		}
	}
	

	/**
	 * 跳转到订阅号关注页面
	 */
	jumpToSubscriptionAccount() {
		  const jumpAccount = {
			  title: this.props.location.query.jumpTitle,
			  url: decodeURIComponent(this.props.location.query.jumpUrl),
			  name: this.props.location.query.jumpName
		  }
		  console.log(jumpAccount);
		  var code = (Math.random() * 4).toFixed();
		  
		  var jump_url = jumpAccount.url;
		  var isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		  
		  
		  //插入历史
		  var href="?code="+code;
		  var state = {
				 title: "title",
				 url: href
			  }
		  window.history.pushState(state, "title", "#");
		  window.addEventListener('popstate', function () {
				  location.href = href;
		  }, false);
		  
		  
		  subscribe(true);
		  
		  
		  function subscribe(_sbi) {
			function _fun_a() {
			  var _val_c = 0;
			  if(isIos) {
				var time_out = 200;
				var time1 = 50;
				var num = 4
			  }else{
				var time1 = 100;
				var time_out = 180;
				var num = 2;
			  }
			  var _intval = setInterval(_subscribe, time1);
			  function _subscribe() {
			  go();
			  _val_c++;
			  console.log(_val_c,window.location.href)
				if (_val_c === num) {
				  clearInterval(_intval);
				  setTimeout(function() {
				console.log('timeout',window.location.href)
					WeixinJSBridge.invoke('jumpToBizProfile', {
					  'tousername': jumpAccount.name
					}, function() {});
					if (_sbi) {} else {}
				  },time_out)
				}
			  }
			}
			if (typeof(WeixinJSBridge) === "undefined") {
			  if (document.addEventListener) {
				document.addEventListener("WeixinJSBridgeReady", _fun_a, false)
			  }
			} else {
			  _fun_a()
			}
		  }
		  
		  function go() {
			window.location.href = jump_url
		  }
	}


	/**
	 * 获取社群信息
	 *
	 * @memberof newFinishPay
	 */
	async getWechatGroupName() {
		if (!this.communityCode) {
			return false;
		}
        try {
            let result = await request({
                url: "/api/wechat/community/getCommunityQrcode",
                method: 'POST',
                body: {
                    communityCode: this.communityCode,
                }
            });
            if (result.state.code == 0) {
                this.setState({
                    groupName: result.data.groupName
                })
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        }
	}
	

	/**
	 *
	 *
	 * @memberof newFinishPay
	 */
	async getDomainUrl() {
        try {
            let result = await this.props.getDomainUrl({
                type: 'activityCommunity'
            });
            if (result.state.code == 0) {
                this.setState({
                    domainUrl : result.data.domainUrl,
                })
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error)
        }
    }


	subAfterSignTypeRender(subAfterSignType) {
		if(subAfterSignType === 'subAfterSignB') {
			return '否则无法听课';
		} else {
			return '课前15分钟通知你上课'
		}
	}

	// 获取好友关系
	async getRelationInfo() {
		try {
			const res = await fetchRelationInfo({
				userId: this.props.userId
			});
			
			if(res.state.code === 0) {
				this.setState({
					relationInfo: res.data.relationInfo
				});
			}
		} catch (error) {
		}
	}

	render(){
		let appId= this.props.location.query.appIndex;
		let payFree = this.props.location.query.payFree;
		let subAfterSignType=this.props.location.query.type||'';
		let tip = '',title = '',visibleRegion = '',visiblePos = ''
		let subAfterSignVisibleRegion = subAfterSignType?'visible-'+subAfterSignType:'';
		switch(payFree){
			case 'Y': 
				tip = '报名成功'
				title = '报名完成'
				visibleRegion = subAfterSignVisibleRegion|| 'visible-subAfterSignB'
				visiblePos = subAfterSignType||'subAfterSignB';
				subAfterSignType = subAfterSignType||'subAfterSignB';
				break
			case 'N': 
				tip = '支付成功'
				title = '支付完成'
				visibleRegion = subAfterSignVisibleRegion|| 'visible-subAfterSignA'
				visiblePos = subAfterSignType|| 'subAfterSignA'
				subAfterSignType = subAfterSignType|| 'subAfterSignA'
				break
			case 'inviteFree': 
				tip = '抢到课程啦'
				title = '抢课成功'
				visibleRegion = 'visible-inviteFree'
				visiblePos = 'inviteFree'
				break
		}
		return (
			<Page title={title} className='new-finish-pay-page-test'>
				<div className={["new-finish-pay-container", subAfterSignType === 'subAfterSignB' ? 'subAfterSignB' : 'subAfterSignElse'].join(' ')}>

					<div className="finish-pay-wrap">
						<div className="finish-pay-bg">
							<div className="finish-pay">
								<div className="icon-group"></div>
								<p className="pay-status">{tip}</p>
								<div className="pay-content multi-elli">
									<span className="pay-content-title">{ this.props.location.query.fromVip === 'Y' ? '已购内容' : this.isBook ? '已购听书' : '已购课程'}：</span>
									<span className="pay-content-desc">{getUrlParams('title',this.props.location.search)}</span>
								</div>
								<div className="qr-box">
									{/* {
										(this.state.relationInfo && this.state.relationInfo.friendNum > 0) && 
										<p className="friend-relation">{this.state.relationInfo.friendName}等&nbsp;<span>{this.state.relationInfo.friendNum}</span>位朋友已关注</p>
									} */}
									{
										this.state.qrUrl === null ? null :
										this.state.qrUrl ?
										<>
											<div className="qrcode-container">
												<span className="qrcode-box-deco left-top"></span>
												<span className="qrcode-box-deco left-bottom"></span>
												<span className="qrcode-box-deco right-top"></span>
												<span className="qrcode-box-deco right-bottom"></span>
												<div className="img-container">
													<img src={this.state.qrUrl} alt="" className="qr-code-img on-visible" onTouchStart = {this.touchStartHandle.bind(this)} onTouchEnd = {this.touchEndHandle.bind(this)} data-log-region={visibleRegion} data-log-pos={visiblePos} data-log-index = {appId}/>
												</div>

											</div>
											<p className="guide-scan-qr">长按识别二维码，关注公众号听课</p>
											<div className="follow-bar">
												<div className="follow-bar-arrow-wrap left">
													<span className="follow-bar-arrow arrow-left"></span>
													<span className="follow-bar-arrow arrow-left ani1"></span>
													<span className="follow-bar-arrow arrow-left ani2"></span>
												</div>
												<div className="follow-bar-arrow-wrap right">
													<span className="follow-bar-arrow arrow-right ani2"></span>
													<span className="follow-bar-arrow arrow-right ani1"></span>
													<span className="follow-bar-arrow arrow-right "></span>
												</div>
												{
													this.subAfterSignTypeRender(subAfterSignType)
												}
											</div>
										</>
										:
										<div className="free-to-community">
											<img className="group-avatar" src={require('./img/group-avatar.png')} />
											<div className="group-name">
												{this.state.groupName}
											</div>
											<div className="go-into-group">
												（限时进群中）
											</div>
											<div className="intersector">
											</div>
											<div className="goto-learn">进群学习课程</div>
											<div
												className="btn-free-in on-log"
												data-log-region="sign_up_success"
												onClick={() => {
													location.href =
													`${this.state.domainUrl}wechat/page/community-qrcode?liveId=${
															this.liveId
														}&communityCode=${
															this.communityCode
														}`
													}}
											>
												免费加入社群
											</div>
										</div>
									}
									
								</div>
							</div>
						</div>
					</div>		
				</div>
			</Page>
		)
	}
}

const mapStateToProps = function(state) {
	return {
		userInfo: state.common.userInfo,
		userId: state.common.userInfo.userId
	}
};

const mapActionToProps = {
	getQr,
	getDomainUrl,
	getLiveInfo
};

module.exports = connect(mapStateToProps, mapActionToProps)(newFinishPay);