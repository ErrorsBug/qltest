/**
 * Created by dylanssg on 2017/6/19.
 */
import React, { Component } from 'react';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';
import { connect } from 'react-redux';
import { request } from "common_actions/common";
import { getCookie, formatMoney, locationTo, getVal } from 'components/util';
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';

import {  getRealStatus, getCheckUser } from "../../../actions/live";

import { userBindKaiFang } from '../../../../actions/common';
import {
	myDistributionAccount,
	distributionAccountWithdraw
} from '../../../actions/mine';
import ProfitCard from '../../../components/profit-card';
import WithdrawPullup from '../../../components/withdraw-pullup';


@autobind
class PromoProfit extends Component {

	state = {
		withdrawableMoney: 0,
		totalProfit: 0,
		clearingProfit: 0,
		realName: '',
		newRealStatus: 'no',
		realStatus: 'unwrite',
		isNotBtn: false,
		withdraw: "",
		name: "",
		limit: 2,
		showWithdraw: false,
		wechatNickName: ""
	};

	get userId() {
		return getCookie('userId');
	}
	get liveId(){
		return this.props.location.query.liveId;
	}
	componentDidMount(){
		this.initDataReal();
		this.initData();
		this.initUserBindKaiFang();
		this.getWechatNickName();
	}

	async initData(){
		const res = await this.props.myDistributionAccount();
		if(res.state.code === 0){
			this.setState({
				withdrawableMoney: res.data.balance || 0,
				totalProfit: res.data.totalIncome,
				clearingProfit: res.data.beAccountBalance,
				realName: res.data.realName || ''
			});
		}
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

	// @throttle(1000)
	// withdrawBtnClickHandle(){
	// 	if(formatMoney(this.state.withdrawableMoney) < 1){
	// 		window.toast('提现金额不能小于1元');
	// 	}else if(formatMoney(this.state.withdrawableMoney) > 2000){
	// 		this.authConfirm.show();
	// 	}else{
	// 		this.withdrawMoney();
	// 	}
	// }

	async withdrawMoney(){
		// 体现金额>=2000，即使后台的实名验证开关已经关闭，但如果没有通过实名认证，强制进行认证
        if (this.state.withdraw >= 2000 && this.state.newRealStatus != 'pass') {
            this.setState({
                isNotBtn: true
            });
            return;
        }
		const res = await this.props.distributionAccountWithdraw({
			realName: this.state.name,
			totalFee: this.state.withdraw * 100
		});
		if(res.state.code === 0){
			window.toast(`提现成功${res.state.msg || ''}`);
			this.setState({
				withdrawableMoney: res.data.balance || 0
			});
			this.hideWithdraw();
		}else{
			window.toast(res.state.msg);
		}
	}

	closeAuthConfirm(){
		this.authConfirm.hide();
	}

	@throttle(1000)
	async authConfirmClickHandle(){
		if (!this.validInput(true)) {
            return false;
		}
        this.withdrawMoney();
	}

	onConfirm(param) {
		this.setState({
			name: param.name,
			withdraw: param.withdraw
		}, () => {
			this.authConfirmClickHandle();
		});
	}

	/**
     * 检查是否勾选同意协议
     *
     * @param {any} showToast 是否显示toast
     * @returns
     *
     * @memberof LiveProfitWithdraw
     */
 
    /**
     * 检查提现金额的输入
     *
     * @param {any} value 提现金额
     * @param {any} showToast 是否显示toast提示
     * @returns
     *
     * @memberof LiveProfitWithdraw
     */
    validWithdraw(value, showToast) {
        if (value === "") {
            showToast && window.toast("请输入提现金额");
            return false;
        }
        if (!/(^[0-9]*[\.]?[0-9]{0,2}$)/.test(value)) {
            showToast && window.toast("提现金额需为非负数字,最多2位小数");
            return false;
		}
        if (value > (this.state.withdrawableMoney / 100)) {
            showToast && window.toast("提现金额不能超过可提现金额");
            return false;
        }
        if (value > this.state.limit * 10000 || value < 1) {
            showToast &&
                window.toast(`提现金额至少1元，上限${this.state.limit}万`);
            return false;
        }
        return true;
    }

    /**
     * 检查姓名输入是否合法
     *
     * @param {any} value 姓名
     * @param {any} showToast 是否显示toast
     * @returns
     *
     * @memberof LiveProfitWithdraw
     */
    validName(value, showToast) {
        if (value === "") {
            showToast && window.toast("请输入收款方姓名");
            return false;
        }
        return true;
	}
	// 检查输入是否合法
    validInput = (showToast = false) => {
        return (
            this.validWithdraw(this.state.withdraw, showToast) &&
            this.validName(this.state.name, showToast)
        );
    };
	// 监听金额
	changeMinMoney(e){
		this.setState({
            withdraw: e.target.value
        });
	}
	// 监听用户名
	changeUsername(e){
		this.setState({
            name: e.target.value
        });
	}
	clearRealName(){
        this.setState({
            isNotBtn: false
        })
	}
	
	hideWithdraw() {
		this.setState({
			showWithdraw: false
		})
	}

	// 获取用户微信昵称
	async getWechatNickName() {
		try {
			const result = await request({
				url: "/api/wechat/transfer/h5/user/getWechatUserName",
				method: "POST",
				body: {
					findNameUserId: this.userId
				}
			});
			if (result.state.code === 0) {
				this.setState({
					wechatNickName: result.data.wechatUserName
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	render() {
		const valid = this.validInput();
		return (
			<Page title="我的推广收益" className="my-promo-profit">
				<div className="container">
					<div>
						<ProfitCard
							className="gold"
							withdrawAmount={this.state.withdrawableMoney / 100}
							total={this.state.totalProfit / 100}
							onApplyWithDraw={() => {this.setState({
								showWithdraw: true
							})}}
						/>
					</div>
					<div className="row-item icon_enter margin" onClick={e => locationTo('/wechat/page/mine-profit/promo-withdraw')}>查看提现明细</div>
					<div className="row-item icon_enter alone margin" onClick={e => locationTo('/live/share/unSettleBalanceDetail.htm')}>待结算金额&nbsp;<p> {formatMoney(this.state.clearingProfit)}元<span></span></p></div>
					<span className="sepo"></span>
					<div className="row-item icon_enter margin" onClick={e => locationTo('/wechat/page/share-income-flow')}>推广收益流水</div>
					<div className="row-item icon_enter margin" onClick={e => locationTo('/wechat/page/share-income-list-topic')}>话题收益分析</div>
					<div className="row-item icon_enter margin" onClick={e => locationTo('/wechat/page/share-income-list-channel')}>系列课收益分析</div>
					<div className="row-item icon_enter margin" onClick={e => locationTo('/wechat/page/share-income-list-vip')}>直播间会员收益分析</div>
				</div>
				{ /* 
					<Confirm
					title="微信提现实名认证"
					ref={c => (this.authConfirm = c)}
					buttonTheme="block"
					theme='empty'
					onClose={this.closeAuthConfirm}
					buttons='cancel-confirm'
					className="auth-confirm"
					onBtnClick={this.authConfirmClickHandle}
					>
						<div className="content">
							<p className="tip">为了保障您资金的安全，超过2000的提现必须进行微信钱包实名认证!<br />请在下方填写微信钱包绑定的银行卡所有者的真实姓名，如未绑定银行卡，请先将微信钱包绑定银行卡。</p>
							<input type="text" placeholder="在此处填写姓名" value={this.state.realName} onChange={e => this.setState({realName: e.target.value})}/>
						</div>
					</Confirm>
				*/ }
				<WithdrawPullup 
					wechatNickName={this.state.wechatNickName}
					show={this.state.showWithdraw}
					onClose={this.hideWithdraw}
					onOk={this.onConfirm}
				/>
				<NewRealNameDialog 
					bghide={false}
                    show = { this.state.isNotBtn }
                    onClose = {this.clearRealName.bind(this)}
                    realNameStatus = { this.state.realStatus || 'unwrite'}
                    checkUserStatus = { this.state.newRealStatus || 'no' }
                    isClose={ true }
                    liveId = {this.liveId}/>
			</Page>
		)
	}
}

module.exports = connect((state) => {
	return {
	}
}, {
	myDistributionAccount,
	distributionAccountWithdraw,
	userBindKaiFang,
	getRealStatus,
	getCheckUser
})(PromoProfit);