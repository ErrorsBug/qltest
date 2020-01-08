/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { locationTo, formatDate, formatMoney } from 'components/util';
import Page from 'components/page';

class PerformanceDetails extends Component {
	render(){
		return (
			<Page title="订单详情" className='page-order-details'>
				<div className="banner">
					<div className="content">
						恭喜，你已成为千聊官方课代表
						<div className="start-btn"onClick={() => locationTo('/wechat/page/coral/shop')}>开始赚钱</div>
					</div>
				</div>
				<div className="main-tips">
					<div>
						套餐课程已自动加入您的已购课程中 <span onClick={() => locationTo('/live/entity/myPurchaseRecord.htm')}>去听课<i className="icon_enter"></i> </span>
						<br/>
						{this.props.orderDetails.address && '实物产品会在下单后15天内发货'}
					</div>
				</div>
				{this.props.orderDetails.address &&
					<div className="consignee">
						<div className="row">收货人：{this.props.orderDetails.name}
							<div className="phone">{this.props.orderDetails.phoneNum}</div>
						</div>
						<div className="row">收货地址：{this.props.orderDetails.address}</div>
					</div>
				}
				<div className="product">
					{
						this.props.orderDetails.vipConfig&&
						<div className="info">
							<span className="pic">
								<img src={this.props.orderDetails.vipConfig.backgroundUrl||""} alt=""/>
							</span>
							<div className="name">
								<div className="main elli-text">{this.props.orderDetails.vipConfig.name}</div>
								<div className="gift">{this.props.orderDetails.businessName}{this.props.orderDetails.giftName && this.props.orderDetails.address ? '+'+this.props.orderDetails.giftName : ''}</div>
							</div>
							<div className="num">
								<div className="price">￥{formatMoney(this.props.orderDetails.vipConfig.money||0,100)}</div>
								<div className="count">x1</div>
							</div>
						</div>
					}
					
					<div className="cost">
						<div className="row">
							<span>订单金额：</span>
							<span>￥{formatMoney(this.props.orderDetails.amount||0,100)}</span>
						</div>
						{this.props.orderDetails.address &&
							<div className="row">
								<span>运费：</span>
								<span>￥0</span>
							</div>
						}
					</div>
					<div className="total">实付款{this.props.orderDetails.address ? '（含运费）合计' : ''}：￥{formatMoney(this.props.orderDetails.amount,100)}</div>
				</div>
				<div className="date">
					<div className="order-id">订单编号：{this.props.orderDetails.orderId}</div>
					<div className="create-time">下单时间：{formatDate(this.props.orderDetails.orderTime, 'yyyy-MM-dd hh:mm')}</div>
					<div className="pay-time">付款时间：{formatDate(this.props.orderDetails.payTime, 'yyyy-MM-dd hh:mm')}</div>
				</div>
				<div className="kefu-wrap">
					<div className="btn-kefu" onClick={()=>locationTo("http://qlkthb.zf.qianliao.net/wechat/page/activity/wcGroup/qrCode?id=2000000191547676")}></div>
				</div>
			</Page>
		)
	}
}

function mapStateToProps (state) {
	return {
		orderDetails: state.gift.orderDetails
	}
}

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(PerformanceDetails);
