import React, {Component} from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';

// actions
import { doPay } from 'common_actions/common'
import {
	logPayTrace,
	eventLog,
} from 'components/log-util';
import {
	locationTo,
} from 'components/util';
import {
	fillParams
} from 'components/url-utils';

class Pay extends Component {

    state = {

    };

    data = {

    };

	componentWillMount(){
		this.data = {...this.props.location.query};
	}

	componentDidMount() {
		history.replaceState(null, document.title, location.href.replace(location.search, ''));
		if(this.data.total_fee){
			wx.ready(() => {
				this.pay();
			});
		}
	}

	async pay(){
		try {
			await this.props.doPay({
				...this.data,
				callback: orderId => {
					logPayTrace({
						id: this.props.location.query.id,
						payType: this.props.location.query.type
					});
					window.toast('支付成功', 2000);
					setTimeout(_=> {
						locationTo(fillParams({
							orderId,
							payisfree:false,
						}, this.props.location.query.redirectUrl));
					},2000)
				},
				onPayFree: res => {
					logPayTrace({
						id: this.props.location.query.id,
						payType: this.props.location.query.type
					});
					window.toast('支付成功', 2000);

					setTimeout(_=> {
						locationTo(fillParams({
							payisfree: true,
						}, this.props.location.query.redirectUrl));
					},2000)
				},
				onCancel: () => {
					eventLog({
						category: 'cancelPayText',
						action: 'sucess',
					});
					setTimeout(_=> {
						locationTo(this.props.location.query.redirectUrl);
					},2000)
				},
			});
		} catch (error) {
			console.error(error);
		}
	}

    render() {
        return (
            <Page title="正在支付" className='common-pay-page'>
				<div className="container">
					<div className="icon"></div>
					<div className="tip">
						{
							this.data.total_fee?
								'支付正在发起中...'
								:
								'缺少参数!!!'
						}
					</div>
				</div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {
	doPay
};

module.exports = connect(mapStateToProps, mapActionToProps)(Pay);
