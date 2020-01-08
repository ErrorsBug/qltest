/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { locationTo, formatMoney, } from 'components/util';
import Page from 'components/page';
import Picker from 'components/picker';
import AddressSelect from 'components/address-select';
import { logPayTrace } from 'components/log-util';
import { isQlchat } from 'components/envi';


import { doPay } from 'common_actions/common'
import { updateOrderData } from '../../../actions/gift';

class OrderConfirm extends Component {

	state = {
		weixinNum: '',
		phoneNum: '',
		name: '',
		address: '',
		areaAdress:'',
	};

	data = {
		giftChosenIndex: this.props.location.query.index || 0,
		qrcode : this.props.location.query.qr,
	};

	componentDidMount(){
		// if(isQlchat()){
		// 	window.toast('请到微信“千聊Live”公众号中购买',3000);
		// 	return false;
		// }
	}

	weixinNumChangeHandle = (e) => {
		this.setState({
			weixinNum: e.target.value
		})
	};

	phoneNumChangeHandle = (e) => {
		this.setState({
			phoneNum: e.target.value
		})
	};

	nameChangeHandle = (e) => {
		this.setState({
			name: e.target.value
		})
	};

	addressChangeHandle = (e) => {
		this.setState({
			address: e.target.value
		})
	};

	/* 验证姓名输入是否正确*/
	validName() {
		if (!this.state.name) {
			window.toast('请输入收货人姓名');
			return false
		}
		return true
	}

	validWeixinNum(){
		if (!this.state.weixinNum) {
			window.toast('请输入微信号');
			return false
		}
		return true
	}

	validPhoneNum(){
		if (!this.state.phoneNum) {
			window.toast('请输入手机号码');
			return false
		}else if(!/^1[3|4|5|7|8]\d{9}$/.test(this.state.phoneNum)){
			window.toast("请输入正确的手机号");
			return false;
		}
		return true
	}

	validAddress(){
		if (!this.state.areaAdress) {
			window.toast('请选择所在地区');
			return false
		}else if(!this.state.address){
			window.toast('请输入地址');
			return false
		}
		return true
	}

	confirmOrder = () => {
		if(this.validWeixinNum() && this.validName() && this.validPhoneNum() && (this.props.giftBagData.isOpenExpress !== 'Y' || this.validAddress())){ //开启了物流才需要验证地址
			this.doPay();
		}
	};
	getareaLabel(selectAdress){
		this.setState({
			areaAdress:selectAdress.join(""),
		});
	}

	doPay(){
		const channelId = this.props.giftBagData.businessList && this.props.giftBagData.businessList[this.data.giftChosenIndex].businessId || "";
		const {
			weixinNum,
			phoneNum,
			name,
			address,
			areaAdress,
		} = this.state;
		this.props.doPay({
			liveId: 0,
			channelId,
			total_fee: this.props.giftBagData.money,
			type: 'OFFICIAL_AUTHORITY',
			topicId: '0',
			callback: async (orderId) => {

				logPayTrace({
					id: channelId,
					type: 'OFFICIAL_AUTHORITY',
				});

				const res = await this.props.updateOrderData({
					orderId,
					weixinNum,
					phoneNum,
					name,
					address:(areaAdress+address),
				});

				if(res.state.code === 0){
					window.toast('支付成功');
					locationTo(`/wechat/page/coral/focus?qr=${this.data.qrcode}`);
				}

			},
		});
	}

	render(){		
		return (
			<Page title="确认订单" className='page-confirm-order'>
				<div className="write-wrap">
					{
						// 是否开启物流
						this.props.giftBagData.isOpenExpress === 'Y' ?
						<div className="section">
							<div className="title">申请人信息</div>
							<ul>
								<li>
									<div className="str">微信号</div>
									<div className="write"><input type="text" placeholder="请填写微信号" value={this.state.weixinNum} onChange={this.weixinNumChangeHandle} /></div>
								</li>
							</ul>
						</div>:
						<div className="section">
							<div className="title">申请人信息</div>
							<ul>
								<li>
									<div className="str">姓名</div>
									<div className="write">
										<input type="text" placeholder="请填写姓名" value={this.state.name} onChange={this.nameChangeHandle}/>
									</div>
								</li>
								<li>
									<div className="str">微信号</div>
									<div className="write"><input type="text" placeholder="请填写微信号" value={this.state.weixinNum} onChange={this.weixinNumChangeHandle} /></div>
								</li>
								<li>
									<div className="str">手机号码</div>
									<div className="write">
										<input type="text" placeholder="请填写手机号码" value={this.state.phoneNum} onChange={this.phoneNumChangeHandle}/>
									</div>
								</li>
							</ul>
						</div>
					}
					{
						// 是否开启物流
						this.props.giftBagData.isOpenExpress === 'Y' ?
						<div className="section">
							<div className="title">收货信息</div>
							<ul>
								<li>
									<div className="str">收货人姓名</div>
									<div className="write">
										<input type="text" placeholder="填写真实姓名才能收到货哦" value={this.state.name} onChange={this.nameChangeHandle}/>
									</div>
								</li>
								<li>
									<div className="str">手机号码</div>
									<div className="write">
										<input type="text" placeholder="请填写手机号码" value={this.state.phoneNum} onChange={this.phoneNumChangeHandle}/>
									</div>
								</li>
								<li>
									<div className="str">所在地区</div>
									<div className="press active">
										<AddressSelect col={3} getAreaLabel={this.getareaLabel.bind(this)} />
									</div>
								</li>
								<li>
									<div className="write">
										<textarea name="" id="" cols="30" rows="3" placeholder="请填写具体地址" value={this.state.address} onChange={this.addressChangeHandle}></textarea>
									</div>
								</li>
							</ul>
						</div>:null
					}
					<div className="section">
						<div className="title">订单信息</div>
						<ul>
							<li className="info-part">
								<div className="pic"><img src={this.props.giftBagData.backgroundUrl} alt=""/></div>
								<div className="info">
									<div className="name elli-text">{this.props.giftBagData.name}</div>
									<div className="subsidiary">
										{this.props.giftBagData.businessList&&this.props.giftBagData.businessList[this.data.giftChosenIndex].businessName}{this.props.giftBagData.businessList[this.data.giftChosenIndex].giftName ? '+' + this.props.giftBagData.businessList[this.data.giftChosenIndex].giftName : ''}
									</div>
									<div className="price">￥{formatMoney(this.props.giftBagData.money,100)}</div>
								</div>
							</li>
							<li className="all-price"><span>合计：￥{formatMoney(this.props.giftBagData.money,100)}</span></li>
						</ul>
					</div>
				</div>
				<div className="confirm-wrap">
					<div className="info">
						<div className="all-price">总计：￥{formatMoney(this.props.giftBagData.money,100)}</div>
						{this.props.giftBagData.isOpenExpress === 'Y' && <div className="tips">(免运费)</div>}
					</div>
					<div className="btn-confirm" onClick={this.confirmOrder}>确认付款</div>
				</div>

			</Page>
		)
	}
}

function mapStateToProps (state) {
	return {
		giftBagData: state.gift.giftBagData
	}
}

const mapActionToProps = {
	doPay,
	updateOrderData
};

module.exports = connect(mapStateToProps, mapActionToProps)(OrderConfirm);
