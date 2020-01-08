/**
 *
 * @author Dylan
 * @date 2018/10/15
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

import {
	formatMoney,
} from 'components/util'

@autobind
class BuyBtn extends PureComponent {
	state = {
		redpacketExpire: undefined,
	}

	buyBtnClickHandle(){
		this.props.joinMembership();
	}

	/**
	 * 计时器还是写在子组件内吧，避免全页面刷新
	 * 回调方法onRedpacketExpire
	 */
	countRedpacketExpire = (num, isProcess) => {
		num = Number(num) || 0;
		let expire;
		
		if (isProcess) {
			expire = Math.round(num - (Date.now() - this._countRedpacketExpireBegin) / 1000);
		} else {
			// 记录开始时间戳
			this._countRedpacketExpireBegin = Date.now();
			expire = num;
		}
		expire || (expire = 0);
		this.setState({
			redpacketExpire: expire
		})

		// 退出倒计时
		if (expire <= 0) {
			typeof this.props.onRedpacketExpire === 'function' && this.props.onRedpacketExpire();
			return;
		}

		clearTimeout(this._countRedpacketExpireTimer)
		this._countRedpacketExpireTimer = setTimeout(() => {
			this.countRedpacketExpire(num, true);
		}, 1000)
	}

	render(){
		let originalPrice = this.props.price;
		let currentPrice = originalPrice;

		let redpacketExpire = this.state.redpacketExpire;
		let expSeconds, expMinutes, expHours;

		if (redpacketExpire) {
			if (this.props.redpacketMoney) {
				currentPrice = Math.round(originalPrice - this.props.redpacketMoney);
				currentPrice < 0 && (currentPrice = 0);
			}

			expHours = Math.floor(redpacketExpire / 3600);
			expMinutes = Math.floor((redpacketExpire - expHours * 3600 ) / 60);
			expSeconds = redpacketExpire % 60;
		}

		return (
			<div>
				{
					!!redpacketExpire &&
					<div className="member-center__counter">距离红包过期剩余：{expHours}时{expMinutes}分{expSeconds}秒</div>
				}
				<div className="member-center__buy-btn on-log"
					onClick={this.buyBtnClickHandle}
					data-log-region={this.props.memberInfo.level === 1 && this.props.memberInfo.status === 'Y' ? 'buy-btn-upgrade' : 'but-btn-join'}
				>	
					{
						this.props.memberInfo.level === 1 && this.props.memberInfo.status === 'Y' ?
							<div className="content">
								<div className="price">￥{formatMoney(currentPrice)}</div>
								{
									!!redpacketExpire &&
									<div className="original-price">{formatMoney(originalPrice)}</div>
								}
								升级为年度会员
							</div>
							:
							<div className="content">
								<div className="price">￥{formatMoney(currentPrice)}/年</div>
								<div className="vertical-bottom">
									{
										!!redpacketExpire &&
										<div className="original-price">{formatMoney(originalPrice)}</div>
									}
									立即开通
								</div>
							</div>
					}
				</div>
			</div>
		)
	}
}

export default BuyBtn;