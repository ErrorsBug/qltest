/**
 * Created by dylanssg on 2017/6/6.
 */
import React, { Component } from 'react';

class AudioTip extends Component{

	state = {
		isShow:true
	};


	render(){
		if(!this.state.isShow) return null;

		return (
			<div className="audio-tip" onClick={() => this.setState({isShow: false})}>
				<div className="container" onClick={(e) => e.stopPropagation()}>
					<div className="header">无法正常收听语音？</div>
					<div className="content">
						<p>1.本次直播为语音+图文直播，语音收听方式跟在微信群一样，一条一条播放；</p>
						<p>2.听不到的同学请往下翻，确认直播已经开始并有语音发出来，如果没有看到语音条，说明暂时没有发送语音，请耐心等待；</p>
						<p>3.点击语音条后，如果一直在转圈，说明网速太慢，请切换其他网络；</p>
						<p>4.如果看到语音条滑块在移动，请确认手机处于非静音模式，拔掉耳机或者关闭WIFI再试；</p>
						<p>5.如果还是无法播放，请点击左侧按钮下载“千聊”APP，登录后点击“我的”>“近期看过的直播间”>进入找到报名的话题>收听；</p>
					</div>
					<div className="operation">
						<div className="download-btn" onClick={() => (location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live')}>下载千聊APP</div>
						<div className="cancel-btn" onClick={() => this.setState({isShow: false})}>取消</div>
					</div>
				</div>
			</div>
		)
	}
}

AudioTip.defaultProps = {
	isShow: true
};

export default AudioTip