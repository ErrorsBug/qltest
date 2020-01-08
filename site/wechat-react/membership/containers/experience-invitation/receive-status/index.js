
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Picture from 'ql-react-picture';

import {
	getQr
} from '../../../../actions/common'

function mapStateToProps (state) {
	return {
		sysTime: get(state, 'common.sysTime'),
		memberAppId: get(state, 'member.centerInitData.memberAppId'),
		sourceUserInfo: get(state, 'member.sourceUserInfo'),
	}
}

const mapActionToProps = {
	getQr,
};

const QrCode = (props) => {
	return (
		<div className="qr-box">
			<p className="title">长按识别二维码关注<br />即可免费听课，享会员权益</p>
			<div className="qr-img">
				<Picture src={props.qrUrl}/>
			</div>
		</div>
	)
}

const Success = (props) => {
	return (
		<div className="experience">
			<div>
				<span className="icon-success"></span>
				<p className="title">领取成功</p>
				<p className="desc">恭喜您成功领取{props.day || 7}天会员体验卡</p>
			</div>
			{
				props.qrUrl && <QrCode qrUrl={props.qrUrl}/>
			}
		</div>
	)
}

const Lead = (props) => {
	return (
		<div className="experience">
			<div>
				<p className="title">你已领取过</p>
				<p className="desc">关注千聊公众号，获取更多福利</p>
			</div>
			{
				props.qrUrl && <QrCode qrUrl={props.qrUrl}/>
			}
		</div>
	)
}

class ReceiveStatus extends Component {

	state = {
		qrUrl: '',
		day: null,
	}

	componentDidMount () {
		this.initDay()
		this.getQlCode()
	}

	initDay () {
		if (typeof window.sessionStorage != 'undefined'  && sessionStorage.getItem('member_experience_day')) {
			const day = parseInt(sessionStorage.getItem('member_experience_day'))
			this.setState({day})
		}
	}

	async getQlCode () {
		let result = await this.props.getQr({
			channel: 'memberTrial',
			appId: this.props.memberAppId,
			showQl: 'N'
		})
		
        if (result.state && result.state.code == '0') {
            this.setState({
                qrUrl:result.data.qrUrl
            })
		}
	}


	render() {
		const repeat = this.props.location.query.repeat

		if (repeat == 'Y') return <Lead qrUrl={this.state.qrUrl} />
		
		return <Success qrUrl={this.state.qrUrl} day={this.state.day} />
	}
}

module.exports = connect(mapStateToProps, mapActionToProps)(ReceiveStatus);