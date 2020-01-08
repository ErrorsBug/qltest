import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {Confirm} from 'components/dialog';
import {locationTo} from 'components/util';


@autobind
class FissionGroupDialog extends Component {
	constructor(props) {
		super(props)
		this.state = {
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
		setTimeout(() => {
			// 手动触发打曝光日志
			typeof _qla != 'undefined' && _qla.collectVisible();
		}, 1000)
	}

	hide(e) {
		this.refs.fissionDialog.hide()
		if (e === 'cancel') {
			this.refs.fissionDialog.hide()
			this.props.onBtnClick && this.props.onBtnClick('cancel')
		} else {
			this.props.onBtnClick && this.props.onBtnClick('confirm')
		}
	}

	render() {
		return (
			<Confirm
				title="确定要屏蔽班群入口吗?"
				ref='fissionDialog'
				theme='empty'
				cancelText='再想想'
				confirmText='立即支付'
				//onBtnClick={this.hide}
				buttons='-'
				bghide={false}
			>
				<main className="fission-dialog-container">
					<div className="group-text">屏蔽后将不会再出现, <br/>请确保您已加入微信群</div>
				</main>
				<div className="co-dialog-btn-line">
		            <span className="co-dialog-btn-line-cancel on-log on-visible"
		                  data-log-region="deblocking_group"
		                  data-log-pos="close_1"
		                  onClick={() => this.hide('cancel')}>确定关闭</span>
					<span className="co-dialog-btn-line-confirm on-log on-visible"
					      data-log-region="deblocking_group"
					      data-log-pos="join_1"
					      onClick={() => this.hide('success')}>立即进群</span>
				</div>
			</Confirm>
		)
	}
}

export default FissionGroupDialog
