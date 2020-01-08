import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { get } from 'lodash';
import Picture from 'ql-react-picture';

import { request } from 'common_actions/common';

@autobind
class JoinedDialog extends PureComponent {

	state = {
		show: true,
		qrUrl: ''
	};

	componentDidMount(){
		this.getQrCode();
	}

	hide(){
		this.setState({
			show: false
		})
	}

	closeBtnClickHandle(){
		this.hide();
	}

	dialogClickHandle(){
		this.hide();
	}

	containerClickHandle(e){
		e.stopPropagation();
	}

	async getQrCode(){
		const res = await request({
			url: '/api/wechat/get-qrcode',
			body: {
				channel: 'memberCharge',
				appId: this.props.memberAppId
			}
		});
		const qrUrl = get(res, 'data.qrUrl', '');
		this.setState({
			qrUrl
		});
	}

	render(){
		return (
			<div className={`member-center__joined-dialog${this.state.show ? '' : ' hide'}`} onClick={this.dialogClickHandle}>
				<div className="dialog-container" onClick={this.containerClickHandle}>
					<div className="header">
						<div className="logo"></div>
						<div className="title">开通会员成功</div>
					</div>
					{
						this.state.qrUrl &&
						<div className="content">
							恭喜，您已解锁六大会员权益！
							<img src={this.state.qrUrl} className="qrcode"/>
							长按识别二维码，关注公众号，为您提供更多会员专属服务。
						</div>
					}
					<div className="close-btn" onClick={this.closeBtnClickHandle}>知道了</div>
				</div>
			</div>
		)
	}
}

export default JoinedDialog;