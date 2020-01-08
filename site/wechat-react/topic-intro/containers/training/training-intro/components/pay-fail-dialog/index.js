import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {Confirm} from 'components/dialog';
import {formatCountdown, locationTo} from 'components/util';
import './style.scss'

@autobind
class PayFailDialog extends Component {
	constructor(props) {
		super(props)
		this.state = {
			saveSecond: 900,
			counter: undefined
		}
	}


	show() {
		clearInterval(this.state.counter)
		this.setState({
			saveSecond: 900
		})
		this.state.counter = setInterval(() => {
			this.setState({
				saveSecond: this.state.saveSecond -= 1
			})
			if (this.state.saveSecond <= 0) {
				clearInterval(this.state.counter)
				this.hide('cancel')
			}
		}, 1000)

		this.refs.fissionDialog.show()
	}

	hide(e) {
		this.refs.fissionDialog.hide()
		if (e === 'cancel') {
			if (this.props.failPayUrl && this.props.failPayUrl.indexOf('http') > -1) {
				locationTo(this.props.failPayUrl)
			} else {
				//this.props.onBuyBtnClick && this.props.onBuyBtnClick()
				this.refs.fissionDialog.hide()
			}
		} else {
			this.props.onBuyBtnClick && this.props.onBuyBtnClick()
		}
	}

	renderSecondNumber() {
		let secondArr = [0, 0, 0, 0]
		if (!this.state.saveSecond) {
			return (
				<>
					<i><a>{secondArr[0]}</a></i>
					<i><a>{secondArr[1]}</a></i>
					<span>分</span>
					<i><a>{secondArr[2]}</a></i>
					<i><a>{secondArr[3]}</a></i>
					<span>秒{this.state.saveSecond}</span>
				</>
			)
		}
		let timeRes = formatCountdown(this.state.saveSecond, '', true)
		if (timeRes.m < 10) {
			timeRes.m = '0' + timeRes.m
		} else {
			timeRes.m = String(timeRes.m)
		}
		if (timeRes.s < 10) {
			timeRes.s = '0' + timeRes.s
		} else {
			timeRes.s = String(timeRes.s)
		}
		secondArr = [...timeRes.m.split(''), ...timeRes.s.split('')]
		return (
			<>
				<i>{secondArr[0]}</i>
				<i>{secondArr[1]}</i>
				<span>分</span>
				<i>{secondArr[2]}</i>
				<i>{secondArr[3]}</i>
				<span>秒</span>
			</>
		)
	}

	render() {
		return (
			<Confirm
				ref='fissionDialog'
				theme='empty'
				cancelText='再想想'
				confirmText='立即支付'
				//onBtnClick={this.hide}
				buttons='-'
				bghide={false}
			>
				<main className="fission-dialog-container">
					<header className="title">剩余支付时间</header>
					<div className="timer">
						{
							this.renderSecondNumber()
						}
					</div>
					<div className="desc">
						<p>该训练营马上截止报名了，请抓紧最后的时间报名</p>
						{/*<p>活动结束后，将失去<span>{this.props.unlockCourseInfo.discountAmount || this.props.chargeInfo.discount}元</span>报名资格， </p>*/}
						{/*<p>只能以原价<span>{this.props.unlockCourseInfo.amount || this.props.chargeInfo.amount}元</span>购买！</p>*/}
					</div>
				</main>
				<div className="co-dialog-btn-line">
		            <span className="co-dialog-btn-line-cancel on-log on-visible"
						  data-log-region="deblocking_fail"
						  data-log-pos="wait"
						  onClick={() => this.hide('cancel')}>再想想</span>
					<span className="co-dialog-btn-line-confirm on-log on-visible"
						  data-log-region="deblocking_fail"
						  data-log-pos="go_on"
						  onClick={() => this.hide('success')}>立即支付</span>
				</div>
			</Confirm>
		)
	}
}

export default PayFailDialog
