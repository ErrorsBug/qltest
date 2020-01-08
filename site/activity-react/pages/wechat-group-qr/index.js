import * as React from 'react';
import { render } from 'react-dom';
import Page from '../../components/page';
import api from '../../utils/api';
import { getUrlParam, getCookie } from '../../utils/util';
import QRImg from '../../components/qr-img';
import './style.scss';

class WechatGroupQr extends React.Component {
	/** 页面初始化数据 */
	state = {
		qrImg: '',
		leaderStatus:'N',
	};
	data = {};
	cache = {};

	get wclParam(){
		return getUrlParam('wcl')
	}
	get channelParam(){
		return getUrlParam('id')
	}


	componentDidMount(){
		if(document.readyState === 'complete'){
			this.initQr().catch(err => {
				toast(err.message, 2000);
			}).then(() => {
				loading(false);
			})
		}else{
			window.addEventListener('load', (e) => {
				this.initQr().catch(err => {
					toast(err.message, 2000);
				}).then(() => {
					loading(false);
				})
			});
		}
	}

	async initQr(){
		loading(true);

		const { qrcodeUrl, energizeId,leaderStatus,leaderUrl } = await api('/api/wechat/activity/getCommunityQr', {
			method: 'GET',
			body: {
				cId: getUrlParam('id'),
				uId: localStorage.getItem('uid') || getCookie('uid') || 'LOCAL_CACHE_HAS_BEEN_BANNED'
			}
		}).then(res => {
			if (res.state.code) throw Error(res.state.msg);
			return res.data || {};
		})

		if (location.pathname === '/wechat/page/activity/wcGroup/qr_auth' && energizeId) {
			await api('/api/wechat/transfer/h5/live/userBindEnergizeId', {
				method: 'POST',
				body: {
					energizeId,
				}
			}).then(res => {
				if (res.state.code) throw Error("获取二维码失败");
			})
		}

		this.setState({
			qrImg: qrcodeUrl,
			leaderStatus,
			leaderUrl
		})
	}

	render(){ 
		return (
			<Page title='' className='we-group-qr-page'>
				{
					this.state.leaderStatus === 'Y' ?
						<div className="wrapper-box">
							{
								this.wclParam?
								<QRImg 
                                    src={this.state.qrImg}
									traceData="wclQrcode" 
									channel = {this.channelParam}
                                    className="qr-img"
                                />
								:
								<img className="qr-img" src={this.state.qrImg} alt="" />
							} 
							<div className="info-box">
								<span className="title">亲爱的学员：</span>
								<span className="info">若群二维码提示“群聊人数超过100人”或“二维码已过期”请<a href={this.state.leaderUrl}>联系班长></a></span>
							</div>
						</div>
					:
						<div className="wrapper">
							{
								this.wclParam?
								<QRImg 
                                    src={this.state.qrImg}
                                    traceData="wclQrcode" 
									channel = {this.channelParam}
                                    className="qr-img"
                                />
								:
								<img className="qr-img" src={this.state.qrImg} alt="" />
							} 
						</div>
						
				}
			</Page>
		)
	}
}
render(<WechatGroupQr />, document.getElementById('app'));