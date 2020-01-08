import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import Page from 'components/page';
import {
	getMyWallet,
} from '../../actions/mine';
import { userBindKaiFang } from '../../../actions/common';
import { getVal } from 'components/util';
import { locationTo } from 'components/util'
import { isQlchat } from 'components/envi'
import appSdk from 'components/app-sdk'
import Confirm from 'components/dialog/confirm';
import { autobind } from 'core-decorators';
import { request } from "common_actions/common";
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import {  getRealStatus, getCheckUser } from "../../actions/live";



@autobind
class MineProfit extends Component {

	state = {
		withDrawMoney: {},
		realName: '',
		newRealStatus: 'no',
		realStatus: 'unwrite',
		isNotBtn: false,
	}

	todayModalRef = null;
	
	get liveId(){
		return this.props.location.query.liveId;
	}

	async componentDidMount() {
		if (!this.props.walletData.totalIncome) {
			this.initWalletData();
		};
		this.initDataReal();
		this.getAccountWithDrawMoney();
		this.initUserBindKaiFang();
	}

	async initDataReal(){
		let data = {};
		// 部分用户没有直播间 liveId = 'undefined'
		if (Number(this.liveId)) {
			data = await this.props.getRealStatus(this.liveId, 'live');
		}
        const res = await this.props.getCheckUser();
		const newReal = (res.data && res.data.status) || 'no';
		const hasPriviledge = (res.data && res.data.userNameCheck === 'N') || false;
        const oldReal = data.status || 'unwrite';
        const flag = hasPriviledge || Object.is(newReal, 'pass');
		this.setState({
            newRealStatus: newReal,
            realStatus: oldReal,
            isNotBtn: !flag,
        });
    }

	async initWalletData() {
		let result = await this.props.getMyWallet();
	}

	/**
	 * 获取用户可提现金额
	 */
	async getAccountWithDrawMoney() {
		try {
			const result = await request({
				url: '/api/wechat/transfer/h5/account/accountWithDrawMoney',
				method: 'POST',
				body: {}
			});
			if(result.state.code === 0) {
				const {
					guest,
					share,
					reward
				} = result.data;
				this.setState({
					withDrawMoney: {
						guest,
						share,
						reward
					}
				})
			}
		} catch (error) {
			console.error(error);
		}

	}

	clearRealName(){
        this.setState({
            isNotBtn: false
        })
	}

    // 从开放平台过来的用户要绑定三方和关注直播间
    initUserBindKaiFang() {
        let kfAppId = getVal(this.props, 'location.query.kfAppId', '');
        let kfOpenId = getVal(this.props, 'location.query.kfOpenId', '');

        if (kfAppId && kfOpenId) {
            this.props.userBindKaiFang({
                kfAppId,
                kfOpenId
            });
        }
	}
	
	showTodayModal() {
		this.todayModalRef.show();
	}

	render() {
		return (
			<Page title="我的钱包" className='my-wallet profit'>
				<div className="wallet-history-wrap">
					<div className="wallet-history">
						<div className="bg"><img src={require('./img/bg-money-banner.png')} alt=""/></div>
						<ul className='wallet-info'>
							<li className="title">历史总收益(元)</li>
							<li><var className='money'>{this.props.walletData.totalIncome || 0}</var></li>
							<li className="gain-wrap" onClick={this.showTodayModal}><var className='gain'>今日 +{this.props.walletData.totalTodayIncome || 0}</var><span className="icon"><img src={require('./img/doubt.png')} alt=""/></span></li>
						</ul>
					</div>
				</div>
				
				<div className="profit-nav-box">
					<ul className="personal-center-nav">
						<li onClick={() => { isQlchat() ? location.href =`/appRedirect.htm?redirectUrl=/wechat/page/mine-profit/reward-profit?isLiveAdmin=${this.props.location.query.isLiveAdmin || 'N'}&liveId=${this.liveId}` : location.href = `/wechat/page/mine-profit/reward-profit?isLiveAdmin=${this.props.location.query.isLiveAdmin || 'N'}&liveId=${this.liveId}` }}>
							<div className="text">赞赏收益</div>
							<div className="gain">可提现 <var className='money'>+{this.state.withDrawMoney.reward || 0.00}元</var><b className='icon_enter'></b></div>
						</li>
						<li onClick={() => { isQlchat() ? location.href =`/appRedirect.htm?redirectUrl=/wechat/page/mine-profit/promo-profit?isLiveAdmin=${this.props.location.query.isLiveAdmin || 'N'}&liveId=${this.liveId}` : location.href = `/wechat/page/mine-profit/promo-profit?isLiveAdmin=${this.props.location.query.isLiveAdmin || 'N'}&liveId=${this.liveId}` }}>
							<div className="text">推广收益</div>
							<div className="gain">可提现 <var className='money'>+{this.state.withDrawMoney.share || 0.00}元</var><b className='icon_enter'></b></div>
						</li>
						<li onClick={() => { isQlchat() ? location.href ='/appRedirect.htm?redirectUrl=/wechat/page/guest-separate/channel-list-c' : location.href = '/wechat/page/guest-separate/channel-list-c' }}>
							<div className="text">嘉宾分成收益</div>
							<div className="gain">可提现 <var className='money'>+{this.state.withDrawMoney.guest || 0.00}元</var><b className='icon_enter'></b></div>
						</li>
						<div className="seporator"></div>
						<li onClick={() => {
							isQlchat() ? location.href ='/appRedirect.htm?redirectUrl=/live/whisper/questionProfit.htm' : location.href = '/live/whisper/questionProfit.htm' }}>
							<div className="text">私问收益</div>
							<div className="gain">今日 <var className='money'>+{this.props.walletData.whisperTodayIncome || 0.00}元</var><b className='icon_enter'></b></div>
						</li>
						<li onClick={() => { isQlchat() ? location.href ='/appRedirect.htm?redirectUrl=/wechat/page/live/profit/detail/checkin' : this.props.router.push('/wechat/page/live/profit/detail/checkin') }}>
							<div className="text">打卡收益</div>
							<div className="gain">今日 <var className='money'>+{this.props.walletData.affairTodayIncome || 0.00}元</var><b className='icon_enter'></b></div>
						</li>
						<li onClick={() => { isQlchat() ? location.href ='/appRedirect.htm?redirectUrl=/wechat/page/red-envelope-income' : location.href = '/wechat/page/red-envelope-income' }}>
							<div className="text">红包收益</div>
							<div className="gain">今日 <var className='money'>+{this.props.walletData.redEnvelopeTodayIncome || 0.00}元</var><b className='icon_enter'></b></div>
						</li>
					</ul>
				</div>

				<div className="wallet-tips">
					<span>温馨提示</span>
					<ul>
						<li>1.每笔私问收益在7天后会自动到账；</li>
						<li>2.每笔赞赏收益、推广收益、嘉宾分成收益，会根据结算规则计入可提现金额，需手动进行提现到账；</li>
						<li>3.红包将会在次日发放到您的微信钱包，打卡收益以打卡契约金到账时间为准；</li>
						<li>4.提现超过2000元，需要进行实名认证。点击<a className="link" href="/wechat/page/real-name">去认证>></a></li>
					</ul>
				</div>
				{
					this.props.location.query.isLiveAdmin !== 'Y' &&
						<div className="money-link" onClick={ () => {
							locationTo(`/wechat/page/live/profit/detail/problem`);
						} }>
							提现或资金遇到问题？
						</div>
				}
				<Confirm
					buttons="confirm"
					confirmText="我知道了"
					title="今日新增说明"
					ref={ref => this.todayModalRef = ref}
					onBtnClick={() => {this.todayModalRef.hide();}}
				>
					<div className="today-modal-content">
						<p>今日新增的金额包含了赞赏、推广、嘉宾分成、私问、打卡和红包6个新增收益总和。</p>
					</div>
				</Confirm>
				<NewRealNameDialog 
					bghide={false}
                    show = { this.state.isNotBtn }
                    onClose = {this.clearRealName}
                    realNameStatus = { this.state.realStatus || 'unwrite'}
                    checkUserStatus = { this.state.newRealStatus || 'no' }
                    isClose={ true }
                    liveId = {this.liveId}/>
			</Page>
		);
	}
}
function mapStateToProps(state) {
	return {
		walletData: state.mine.walletData
	}
}

const mapActionToProps = {
	getMyWallet,
	userBindKaiFang,
	getRealStatus,
	getCheckUser
}

module.exports = connect(mapStateToProps, mapActionToProps)(MineProfit);