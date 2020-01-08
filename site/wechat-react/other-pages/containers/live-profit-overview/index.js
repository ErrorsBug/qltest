/*
 * @Author: shuwen.wang 
 * @Date: 2017-05-11 10:53:26 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-06-02 14:36:42
 */
const isNode = typeof window === 'undefined';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router'

import { Confirm } from 'components/dialog';
import Page from 'components/page';
import {
	locationTo,
	refreshPageData,
} from 'components/util';

import { fetchProfitOverview, updateDisplayStatus } from '../../actions/profit'
import {
	getRealStatus,
	fetchLiveRole,
} from '../../actions/live';
import {
	fetchIsLiveAdmin,
} from '../../actions/common';

class LiveProfitOverview extends Component {
	constructor(props) {
		super(props)
		this.confirmClick = this.confirmClick.bind(this)
	}
	get liveId() {
		return this.props.params.liveId
	}
	state = {
		realNameStatus: '',
		isPop: false,
		showPoint: false,
	}
	componentDidMount() {
		this.initOverview();
		this.initRealStatus();
		this.props.fetchLiveRole(this.liveId);
		this.props.fetchIsLiveAdmin({ liveId: this.liveId });
		refreshPageData();

		this.getLocalDeposit()
	}
	// 检查本地的金额查询
	getLocalDeposit() {
		try {
			let res = JSON.parse(localStorage.getItem('profitDeposit'))
			if (!res || res.click == false || res.deposit != this.props.deposit) {
				this.setLocalDeposit(false)
			} else {
				this.setLocalDeposit(true)
			}
		} catch (error) {
			this.setLocalDeposit(false)
		}
	}
	// type: false 未点击  true 已点击
	setLocalDeposit(type) {
		localStorage.setItem('profitDeposit', JSON.stringify({
			deposit: this.props.deposit,
			click: type
		}))
		this.setState({
			showPoint: type
		})
	}
	// 初始化收益金额
	initOverview() {
		if (this.props.total === null) {
			this.props.fetchProfitOverview(this.liveId)
		}
	}
	
	// 点击提现按钮去往提现页面
	onWithdrawClick = () => {
		location.href = '/wechat/page/live/profit/withdraw/' + this.liveId;
		// if (!this.state.isPop) {
		// 	this.setLocalDeposit(true)
		// 	location.href = '/wechat/page/live/profit/withdraw/' + this.liveId;
		// } else {
		// 	this.refs.confirmEle.show()
		// }
	}
	closeRealName() {
		this.refs.confirmEle.hide()
	}
	// 点击公对公打款按钮去往对应页面
	onBusinessClick = () => {
		location.href = `/wechat/page/mine/business-payment-takeincome?liveId=${this.liveId}`
	}
	// 点击开启眼睛
	handleToggleSee = () => {
		
		this.props.updateDisplayStatus({
			liveId: this.liveId,
			displayStatus: this.props.displayStatus === 'Y' ? 'N' : 'Y'
		}).then(res => {
			if (this.props.displayStatus === 'Y') {
				window.toast('直播间总收益已对管理员显示', 2500)
			} else {
				window.toast('直播间总收益已对所有人隐藏', 2500)
			}
			if (this.props.total === 0 && this.props.displayStatus === 'Y') {
				this.props.fetchProfitOverview(this.liveId)
			}
		})
		
	}
	// 点击交易记录去往记录列表    
	onRecordClick = () => {
		this.props.router.push('/wechat/page/live/profit/checklist/' + this.liveId)
	}
	// 初始化实名认证状态信息
	async initRealStatus() {
		let result = await this.props.getRealStatus(this.liveId, "tixian");
		if (result && result.state.code == 0) {//unwrite=未填写， auditing 已填写审核中， audited =已审核， auditBack =审核驳回
			this.setState({
				realNameStatus: result.data.status,
				isPop: result.data.isPop,
			});
		}
	}
	handleRealName() {
		let realNameStatus = this.state.realNameStatus
		if (realNameStatus == "auditing") {
			return (
				<div className="real-name-dialog-box">
					<div className="real-name-dialog-title">
						实名认证通过才可提现
					</div>
					<div className="real-name-content">
						<div className="real-name-item">
							直播间实名认证正在审核中，请耐心等待
						</div>
					</div>
				</div>
			)
		} else if (realNameStatus == "unwrite" || realNameStatus == "auditBack") {
			return (
				<div className="real-name-dialog-box">
					<div className="real-name-dialog-title">
						请先完成实名认证再提现
					</div>
					<div className="real-name-content">
						<div className="real-name-item">
							实名认证须与微信绑定银行卡同一人，否则会导致认证不通过
						</div>
						{/* <div className="real-name-item">
							为规范市场秩序，保证消费者权益，直播间创建者须先完成实名认证
						</div>
						<div className="real-name-item">
							实名认证信息千聊会严格保密
						</div>
						<div className="real-name-item">
							实名认证后会赠予直播间实名认证徽章并给予直播间更多特权功能
						</div> */}
					</div>
					
				</div>
			)
		} 
		// else if (realNameStatus == "auditBack") {
		// 	return (
		// 		<div className="real-name-dialog-box">
		// 			<div className="real-name-dialog-title">
		// 				认证信息与微信绑定银行卡不一致
		// 			</div>
		// 			<div className="real-name-content">
		// 				<div className="real-name-item">
		// 					实名认证信息需与当前微信绑定银行卡一致，才能正常提现
		// 				</div>
		// 			</div>
		// 		</div>
		// 	)
		// }
	}
	confirmClick() {
		let realNameStatus = this.state.realNameStatus
		if (realNameStatus == 'unwrite' || realNameStatus == 'auditBack') {
			locationTo("/wechat/page/real-name?liveId=" + this.liveId + "&type=tixian")
		} else {
			this.refs.confirmEle.hide()
		}
	}
	render() {
		return (
			<Page title='直播间收益' className="live-profit-overview-container">

					<div className="overview">
						<div className="summary">
							<header>
								<div className="list-item after-arrow-small hide-split">
									<div className="income-box">
										历史总收益（元）
									</div>
									<span className="income-recode on-log" data-log-region="transaction-record" onClick={this.onRecordClick}>交易记录</span>
								</div>
							</header>
							<p className="tip">总收益 = 待结算金额 + 可提现金额 + 已提现金额</p>
							<div className="total">
								<h1>
									{
										this.props.displayStatus === 'Y' ?
											<var>{this.props.total}</var>
											: <var>*****</var>
									}
									
									{
										this.props.liveRole === 'creater' ?
										<span onClick={this.handleToggleSee}>
											{
												this.props.displayStatus === 'Y' ?
												<img className="eye-style" src={require(`./img/open.png`)}></img>
												: <img className="eye-style" src={require(`./img/close.png`)}></img>
											}
										</span>
										:null	
									}
                  </h1>
							</div>
						</div>


						<div className="with-wrap">
							<div className="with-item">
								<Link className="on-log" data-log-region="settlement-details" to={`/wechat/page/live/profit/checking/${this.liveId}`}>
									<p className="after-arrow after-arrow-small">待结算金额 </p>
									<var>{this.props.displayStatus === 'Y' ? (this.props.checking).toFixed(2) : '*****'}</var>	
								</Link>
							</div>
							<div className="with-item hide-right">
								<div>
									<p className="on-log after-arrow after-arrow-small" data-log-region="put-forward" onClick={this.onWithdrawClick}>
										可提现金额 
									</p>
									{
										this.props.liveRole === 'creater' ?
										<span className={`${!this.state.showPoint ? 'red-point' : ''}`}></span>
										: null
									}
									
									<var>{this.props.displayStatus === 'Y' ? (this.props.deposit).toFixed(2) : '*****'}</var>	
								</div>
							</div>
							<div className="with-line"></div>
							<div className="with-item">
								<a className="on-log" data-log-region="put-forward-details" href={`/wechat/page/mine/takeincome-record?liveId=${this.liveId}`}>
									<p className="after-arrow after-arrow-small">已提现金额 </p>
									<var>{this.props.displayStatus === 'Y' ? (this.props.withdrawn).toFixed(2) : '*****'}</var>	
								</a>
							</div>
							<div className="with-item hide-right">
								{
									this.props.isShowKey === 'Y' ?
									<div onClick={this.onBusinessClick}>
										<p className="after-arrow after-arrow-small">
											公对公打款
										</p>
										<var>{this.props.displayStatus === 'Y' ? (this.props.deposit).toFixed(2) : '*****'}</var>	
									</div>
									: null
								}
							</div>
                <Link to={`/wechat/page/live/profit/detail/problem`}>
									<div className="money-link-box">
											<p className="after-arrow after-arrow-small">提现或资金遇到问题</p>
									</div>
                </Link>
						</div>
					</div>

          <div className="live-profit-box">
            <div className="live-profit-header">基础收益分析</div>
            <ol className="live-profit-row">
              <li className='live-profit-item'>
                <Link className="on-log" data-log-region="topic-analysis" to={`/wechat/page/live/profit/anslysis/topic/${this.liveId}`}>
                  <img className="live-profit-icon" src={require(`./img/icon-topic.png`)}></img>
                  <div className="live-profit-name">单课收益</div>
                </Link>
              </li>
              <li className='live-profit-item'>
                <Link className="on-log" data-log-region="series-lessons-analysis" to={`/wechat/page/live/profit/anslysis/channel/${this.liveId}`}>
                  <img className="live-profit-icon" src={require(`./img/icon-channel.png`)}></img>
                  <div className="live-profit-name">系列课收益</div>
                </Link>
              </li>
              <li className='live-profit-item'>
                <Link className="on-log" data-log-region="vip-analysis" to={`/wechat/page/live-vip-income?liveId=${this.liveId}`}>
                  <img className="live-profit-icon" src={require(`./img/icon-living.png`)}></img>
                  <div className="live-profit-name">直播间收益</div>
                </Link>
              </li>
              <li className='live-profit-item'>
                <Link className="on-log" data-log-region="checkin-camp-analysis" to={`/wechat/page/live/profit/analysis/checkinCamp/${this.liveId}`}>
                  <img className="live-profit-icon" src={require(`./img/icon-xun.png`)}></img>
                  <div className="live-profit-name">训练营收益</div>
                </Link>
              </li>
            </ol> 
          </div>
          
          <div className="live-profit-box">
            <div className="live-profit-header">推广收益分析</div>
            <ol className="live-profit-colums">
                <li className="live-profit-item">
                  <div className="live-profit-flex" onClick={ () => { locationTo(`/wechat/page/live/profit/anslysis/recommend/${this.liveId}`); }}>
                    <img className="live-profit-icon" src={require(`./img/icon-comm.png`)}></img>
                    <div className="live-profit-right after-arrow after-arrow-small">
                      <div className="live-profit-title">千聊推荐</div>
                      <div className="live-profit-name">千聊基于大数据算法，实时筛选最优课程，助您获得平台流量的扶持。</div>
                    </div>
                  </div>
                </li>
            </ol>
            
          </div>
	
					{/* { !this.props.isLiveAdmin && (
						<div className="footer-box">
							<p>温馨提示：升级为<span className="emphasize">专业版</span>即可享受实时结算，提现实时到账，每日提现最高可达<span className="emphasize">20万</span>，资金快速周转！
								<span className="upgrade-btn on-log" data-log-region="fast-upgrades" onClick={ () => {
                                    locationTo(`/topic/live-studio-intro?liveId=${ this.liveId }`);
                                } }>快速升级通道 >></span>
							</p>
						</div>
					) } */}
					
				<Confirm
					ref = "confirmEle"
					onBtnClick = {this.confirmClick}
					className = "real-name-dialog-wrap"
					confirmText = {
						this.state.realNameStatus == 'auditing' ?
						'我知道了' 
						: this.state.realNameStatus == 'unwrite' ? 
						'立即完成实名认证' : '重新认证'
					}
					buttons = 'confirm'
				>
					{this.handleRealName()}
				</Confirm>

			</Page>
		);
	}
}

LiveProfitOverview.propTypes = {
	total: PropTypes.number.isRequired,
	withdrawn: PropTypes.number.isRequired,
	deposit: PropTypes.number.isRequired,
	checking: PropTypes.number.isRequired,
	isShowKey: PropTypes.string.isRequired,
	isLiveAdmin:PropTypes.bool.isRequired
};

function mapStateToProps(state) {
	return {
		total: state.profit.total,
		withdrawn: state.profit.withdrawn,
		deposit: state.profit.deposit,
		checking: state.profit.checking,
		isShowKey: state.profit.isShowKey,
		displayStatus: state.profit.displayStatus,
		isLiveAdmin: state.common.isLiveAdmin === 'Y',
		liveRole: state.live.role,
	};
}

const mapActionToProps = {
	fetchIsLiveAdmin,
	fetchProfitOverview,
	getRealStatus,
	fetchLiveRole,
	updateDisplayStatus
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveProfitOverview);