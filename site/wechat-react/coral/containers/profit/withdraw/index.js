/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';

import { formatMoney, locationTo } from 'components/util';
import Page from 'components/page';

import { personWithdraw, personReWithdraw, getCheckUser, getRealStatus } from '../../../actions/account';
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';


class Withdraw extends Component {

	state = {
		totalFee: this.props.location.query.money ? formatMoney(this.props.location.query.money) : '',
		realName: '',
		recordId: this.props.location.query.id || '',
		newRealStatus: 'no',
		isShowReal: false,
		isNotBtn: false,
	};

	componentDidMount(){
		// this.setState({
		// 	totalFee: this.props.location.query.money
		// })
		this.initData();
	}

	totalFeeChangeHandle = (e) => {
		this.setState({
			totalFee: e.target.value
		})
	};

	async initData(){
        const res = await this.props.getCheckUser();
        const newReal = (res.data && res.data.status) || 'no';
        const hasPriviledge = (res.data && res.data.userNameCheck === 'N') || false;
		const flag = hasPriviledge || newReal === 'pass';
		this.setState({
			newRealStatus: newReal,
            isShowReal: flag,
            isNotBtn: !flag
        })
	}

	clearRealName(){
        this.setState({
            isNotBtn: false
        })
    }

	realNameChangeHandle = (e) => {
		this.setState({
			realName: e.target.value
		})
	};

	/* 验证提现金额输入是否正确*/
	validWithdraw() {
		const { totalFee } = this.state;
		if(this.state.recordId){
			// 重试的不需要验证
			return true;
		}
		if (totalFee === '') {
			window.toast('请输入提现金额');
			return false
		}
		const withdrawNum = parseFloat(totalFee);
		if (isNaN(withdrawNum)) {
			window.toast('提现金额应为数字');
			return false
		}
		if (/\./.test(totalFee) && totalFee.split('.')[1].length > 2) {
			window.toast('最多输入两位小数');
			return false
		}
		if (withdrawNum < 1 || withdrawNum > 20000) {
			window.toast('提现金额应大于1元，小于20000元');
			return false
		}
		if (withdrawNum > formatMoney(this.props.accountData.balance)) {
			window.toast('提现金额不应大于可提现金额');
			return false
		}
		return true
	}

	/* 验证姓名输入是否正确*/
	validName() {
		if (!this.state.realName) {
			window.toast('请输入姓名')
			return false
		}
		return true
	}

	applyWithdraw = async () => {
		if(this.validWithdraw() && this.validName()) {
			// 体现金额>=2000，即使后台的实名验证开关已经关闭，但如果没有通过实名认证，强制进行认证
			if (this.state.totalFee >= 2000 && this.state.newRealStatus != 'pass') {
				this.setState({
					isNotBtn: true
				});
				return;
			}
			const res = this.state.recordId ?
				await this.props.personReWithdraw({
					recordId: this.state.recordId,
					realName: this.state.realName
				})
				:
				await this.props.personWithdraw({
					totalFee: (this.state.totalFee * 100).toFixed(0),
					realName: this.state.realName
				});

			if(res.state.code === 0){
				window.toast('申请成功');
				locationTo('/wechat/page/coral/profit');
			}else{
				window.toast(res.state.msg);
			}
		}
	};

	render(){
		return (
			<Page title="提现" className='page-withdraw'>
				<div className="gettable">
					<div>
						<div className="tip">当前可提现金额</div>
						<div className="num">{formatMoney(this.props.accountData.balance || 0)}</div>
					</div>
				</div>
				<div className="form-box">
					<div className="row">
						<div className="name">提现金额</div>
						{
							this.state.recordId ?
								<span className="disable">{this.state.totalFee} </span>
								:
								<input type="text" placeholder="最小提现金额为1元" value={this.state.totalFee} onChange={this.totalFeeChangeHandle}/>
						}
					</div>
					<div className="row">
						<div className="name">收款方实名</div>
						<input type="text" placeholder="请输入实名认证的真实姓名" value={this.state.realName} onChange={this.realNameChangeHandle}/>
					</div>
				</div>
				<div className="notice">
					注意: 姓名需要与微信绑定的持卡人姓名一致
				</div>
				<div className="intro-box">
					<p>1. 每笔提现金额至少<span>1元</span>，每日提现上限为<span>2万</span></p>
					<p>2. 为保证您的资金安全，提现申请需要<span>实名认证</span></p>
					<p>3. 提现到账后，将直接转入<span>微信钱包</span></p>
					<p>4. 每笔收入，微信已收起<span>0.6%</span>的手续费</p>
					<p>5. 如需帮助请在直播间管理后台咨询客服</p>
				</div>
				<div className="money-link" onClick={ () => {
					locationTo(`/wechat/page/live/profit/detail/problem`);
				} }>
					提现或资金遇到问题?
				</div>
				<div className="withdraw-mam">
					<div className={`withdraw-btn${this.state.totalFee && this.state.realName ? '' : ' disable'}`} onClick={this.applyWithdraw}>申请提现</div>
				</div>
				<NewRealNameDialog 
					bghide={false}
                    show = { this.state.isNotBtn }
                    onClose = {this.clearRealName.bind(this)}
                    realNameStatus = { 'unwrite' }
                    checkUserStatus = { this.state.newRealStatus || 'no' }
                    isClose={ false }
				/>
			</Page>
		)
	}
}

function mapStateToProps (state) {
	return {
		accountData: state.account.accountData
	}
}

const mapActionToProps = {
	personWithdraw,
	personReWithdraw,
	getCheckUser, 
	getRealStatus
};

module.exports = connect(mapStateToProps, mapActionToProps)(Withdraw);
