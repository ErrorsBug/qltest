import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { MiddleDialog } from 'components/dialog';
import './style.scss'
import Slider from 'react-slick'

@autobind
class RewardCardDialog extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isShow: false,
			showIndex: 0
		}
	}

	componentWillReceiveProps(props) {

	}

	componentDidMount() {
	}

	async show(item, index) {

		this.setState({
			isShow: true,
			showIndex: index
		}, () => {
			// this.refs.slider.slickGoTo(index)
			typeof _qla != 'undefined' && _qla.collectVisible();
		})
		// 手动触发打曝光日志

	}

	hide() {
		this.setState({
			isShow: false
		})
	}

	/**
	 * 优惠券类型:
	 * live 直播间通用券,
	 * topic 话题券,
	 * channel 系列课券,
	 * global_vip 通用vip,
	 * custom_vip 定制vip
	 * */
	renderCouponType(couponType) {
		switch (couponType) {
			case 'live':
				return '直播间内全部课程'
			case 'topic':
				return '话题券'
			case 'channel':
				return '系列课券'
			case 'global_vip':
				return '直播间通用vip'
			case 'custom_vip':
				return '直播间定制vip'
		}
	}

	render() {
		let { list = [] } = this.props
		let { currentIndex = 0 } = this.state
		let settings = {
			dots: false,
			arrows: false,
			autoplay: false,
			infinite: false,
			speed: 400,
			centerMode: true,
			// adaptiveHeight: true,
			className: 'card-list',
			// centerPadding: '70px',
			initialSlide: this.state.showIndex,
			variableWidth: true,
		};
		return (
			<MiddleDialog
				show={this.state.isShow}
				ref='rewardCardDialog'
				theme='empty'
				onClose={this.hide}
				buttons='empty'
				className='reward-card-dialog'
				contentClassName=''
			>
				<main className="reward-card-dialog-container">
					<Slider {...settings} ref='slider'>
						{
							list.map((item, index) => {
								if (index < 5) {
									return (
										<div className="item"
											key={`reward-card-${index}`}>
											<div className="title">
												<span className="money">￥{item.money}</span>
												<span>优惠券</span>
											</div>
											<div className="text">打卡满{item.affairNum}天奖励</div>
											<div className="desc">使用范围：{this.renderCouponType(item.couponType)}</div>
										</div>
									)
								}
								else {
									return null
								}

							})
						}
					</Slider>
				</main>
			</MiddleDialog>
		)
	}
}

export default RewardCardDialog
