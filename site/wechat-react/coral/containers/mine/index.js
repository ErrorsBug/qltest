import React, {Component} from 'react';
import { connect } from 'react-redux';
import CoralTabBar from 'components/coral-tabbar';
import {
    locationTo,
	formatMoney,
} from 'components/util';
import { Confirm } from 'components/dialog';


// actions
import { getUserInfo } from '../../actions/common';
import { getMyIdentity, checkRealNameVerifyStatus } from '../../actions/mine';
import { getAccountData } from '../../actions/account';

import Page from 'components/page';
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';

const LEVEL_MAP = {
	X: 'bachelor',
	B: 'doctor',
	J: 'professor'
};

class Mine extends Component {

	state = {
		// 实名验证提示弹窗
		showRealNameVerifyModal: false,
	};

	componentDidMount(){
		this.initData();
		this.props.checkRealNameVerifyStatus();
		setTimeout(() => {
			typeof _qla === 'undefined' || _qla.collectVisible();
		}, 300);
	}


	async initData(){
		await Promise.all([
			this.props.getMyIdentity(),
			this.props.getUserInfo(),
			this.props.getAccountData()
		]);
		if(!this.props.myIdentity.identity){
			if(this.props.accountData.balance){
				this.refs.takeOutMoneyDialog.show();
			}else{
				window.location.href = '/wechat/page/coral/intro';
			}
			
		}
	}

	//提现
	takeOutMoney(){
		if(this.props.accountData.balance){
			window.location.href='/wechat/page/coral/profit/withdraw';
		}else{
			window.toast("暂无可提现");
		}
	}

	confirmTakeOut(tag){
		if(tag === 'cancel'){
			locationTo("/wechat/page/coral/shop");
		}else if(tag === 'confirm'){
			this.takeOutMoney();
		}
	}

	onBackClick(){
		locationTo("/wechat/page/coral/shop");
	}

	/**
	 * 点击实名认证的icon
	 */
	toggleRealNameVerifyModal = () => {
		this.setState({
			showRealNameVerifyModal: !this.state.showRealNameVerifyModal
		});
	}
	
    render() {
        return (
            <Page title="我的" className='coral-distribution-mine'>
				<div>
					<div className="mine-info">
						<div className="top">
							<span className="head"><img src={this.props.userInfo.headImgUrl} alt=""/></span>
							<span className="name">{this.props.userInfo.name}</span>
							<span className={`title ${LEVEL_MAP[this.props.myIdentity.identity]}`}></span>
							<span onClick={this.toggleRealNameVerifyModal} className={this.props.realNameVerifyStatus == 'pass' ? 'real-name-y' : 'real-name-n'}></span>							
							{/* <span className="btn-mine on-log" data-log-region="btn-mine-center" onClick={()=>locationTo('/wechat/page/mine')}>个人中心</span> */}
						</div>
						<div className="card">
							<div className="income-str1">今日收益</div>
							<div className="income-num1">{formatMoney(this.props.accountData.todayIncome||0,100)}</div>
							<ul>
								<li>
									<span className="income-num2">{formatMoney(this.props.accountData.beAccountBalance||0,100)}</span>
									<span className="income-str2">待结算金额(元)</span>
								</li>
								<li>
									<span className="income-num2">{formatMoney(this.props.accountData.withdrawAmount||0,100)}</span>
									<span className="income-str2">已提现金额(元)</span>
								</li>
							</ul>
							<div className="bottom">
								<div>
									<span className="income-num3">{formatMoney(this.props.accountData.balance||0,100)}</span>
									<span className="income-str3">可提现金额(元)</span>
								</div>
								<div>
									<span className="btn-income-take on-log" data-log-region="btn-withdraw" onClick={this.takeOutMoney.bind(this)}>提现</span>
								</div>
								
								
							</div>
						</div>
						<div 
							className="btn-invite on-log on-visible" 
							data-log-name="胶囊位置"
							data-log-region="location-capsule"
							onClick={()=>locationTo("/wechat/page/coral/share?officialKey="+this.props.userInfo.userId)}
						></div>
					</div>
					<div className="mine-manage">
						<span className="title">常用管理</span>
						<span className='btn-check-gift-order on-log' data-log-region="btn-check-gift-order" onClick={()=>locationTo("/wechat/page/coral/order/details")}>查看礼包订单<i className="icon_enter"></i></span>
						<dl>
							<dd className="push-list on-log"
								data-log-region="btn-push-list" 
								onClick={()=>locationTo("/wechat/page/coral/shop/push-list")}
							>
								<div>推广列表</div>
							</dd>
							<dd className="push-order on-log"
								data-log-region="btn-push-order" 
								onClick={()=>locationTo("/wechat/page/coral/push-order")}
							>
								<div>收益明细</div>
							</dd>
							<dd className="mine-income on-log"
								data-log-region="btn-mine-income" 
								onClick={()=>locationTo("/wechat/page/coral/profit")}
							>
								<div>我的收入</div>
							</dd>
						</dl>
						<dl>
							<dd className="grounp-manage on-log"
								data-log-region="btn-group-manage" 
								onClick={()=>locationTo("/wechat/page/coral/association")}	
							>
								<div>社群管理</div>
							</dd>
							<dd className="performance-manage on-log"
								data-log-region="btn-performance-manage" 
								onClick={()=>locationTo("/wechat/page/coral/performance")}
							>
								<div>业绩管理</div>
							</dd>
							<dd 
								className="coral-course on-log"
								data-log-name="帮助中心"
								data-log-region="navigation"
								data-log-pos="train-course"
								onClick={() => locationTo('https://mp.weixin.qq.com/s?__biz=MzU4NzM4ODc1Nw==&mid=100000777&idx=1&sn=3b6b09bd9de96ac7a607bad16ce28065&chksm=7ded86334a9a0f25a0c022d10d2b0948a869fd4d0c4af6f69a6d50f0bf969747bb29882b6a6b&mpshare=1&scene=1&srcid=1128e4BRgiJLbUVcz0FCZmsQ&pass_ticket=80u%2BCvQqsjLGeobwFB9xWlmRgrWon3e01IT2kfKXS40%3D#rd')}
							>
								<div>帮助中心</div>
							</dd>
						</dl>
					</div>
				</div>
			
	            
				<CoralTabBar  activeTab="coral-mine" />

				<Confirm
					ref='takeOutMoneyDialog'
					buttons={ 'cancel-confirm' }
					confirmText={ '去提现' }
					cancelText={ '返回' }
					className='money-dialog'
					onBtnClick={ this.confirmTakeOut.bind(this) }
					onClose = {this.onBackClick.bind(this) }
				>
					<div className='take-dialog-wrap'>
						您有 <var>{formatMoney(this.props.accountData.balance||0,100)}元</var> 还未提现
					</div>
				</Confirm>

				{/* 实名验证提示弹窗 */}
				<NewRealNameDialog 
					show={this.state.showRealNameVerifyModal}
					onClose={this.toggleRealNameVerifyModal}
					realNameStatus="unwrite"
					checkUserStatus={this.props.realNameVerifyStatus}
					isClose={true}
                />
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
		accountData: state.account.accountData||{},
		myIdentity: state.mine.myIdentity||{},
		userInfo: state.common.userInfo,
		subscribe: state.common.subscribe,
		realNameVerifyStatus: state.mine.realNameVerifyStatus,
    }
}

const mapActionToProps = {
	getMyIdentity,
	getUserInfo,
	getAccountData,
	checkRealNameVerifyStatus,
}

module.exports = connect(mapStateToProps, mapActionToProps)(Mine);
