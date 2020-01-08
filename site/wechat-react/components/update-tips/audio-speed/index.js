/**
 *
 * @author Dylan
 * @date 2018/4/16
 */
import React, {PureComponent} from 'react';
import {
	MiddleDialog
} from 'components/dialog';

class AudioSpeedTips extends PureComponent {

	state = {
		isShow: false
	};

	componentDidMount(){
		let sign = localStorage.getItem(`isAudioSpeedTipsShowed${window.location.pathname}`);
		if(!sign){
			this.setState({
				isShow: true
			})
		}
	}

	hide = _ => {
		localStorage.setItem(`isAudioSpeedTipsShowed${window.location.pathname}`, 'yes');
		this.setState({
			isShow: false
		})
	};

	render() {
		return (
			<MiddleDialog
				title="功能更新"
				show={this.state.isShow}
				onClose={this.hide}
				onBtnClick={this.hide}
				buttons="cancel"
				confirmText="确定"
				cancelText="知道了"
				buttonTheme="line"
			    className="audio-speed-tips-dialog"
				bghide
			>
				<div className="content">
					<p className="point">产品GG做了一点微小的优化，已经支持：</p>
					<p>
						1.倍速&低速播放，想怎么听就怎么听
						<br/>
						2.播放列表，一键切换系列课下其他话题
						<br/>
						3.以及若干样式小优化
					</p>
				</div>
			</MiddleDialog>
		);
	}
}

export default AudioSpeedTips;
