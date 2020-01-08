/**
 * 新建或编辑社群打卡训练营
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { browserHistory } from 'react-router';
import Page from 'components/page';
import DatePicker from 'components/date-picker';
import Switch from 'components/switch';
import CommonInput from 'components/common-input';
import {
	formatDate,
	locationTo,
	validLegal
} from 'components/util';

import ImageUploader from './components/image-uploader';

import {
	initLiveLevel,
	createCheckInCamp,
	fetchCampDetail,
} from '../../actions/common';

import { getChannelIntro } from '../../actions/camp-intro-edit';
@autobind
export class newCheckInCamp extends Component {

	state = {
		// 页面title
		pageTitle: '新建打卡',
		// 训练营海报图
		campPoster: '',
		// 训练营名称
		campName: '',
		// 训练营开始日期
		startDate: null,
		// 训练营结束日期
		endDate: null,
		// 打卡天数
		checkInDays: '',
		// 是否开启契约金奖金计划
		openBonusPlan: false,
		// 奖金比例
		bonusScale: '',
		// 领取奖金前需要打卡的天数
		checkInDaysRequired: '',
		// 是否显示契约奖金的详细规则
		showBonusRule: false,

		// 新建训练营 OR 编辑训练营
		isEditCamp: false,
		// 训练营的已报名人数
		campAuthNum: 0,
		// 训练营价格
		campPrice: '',
		// 是否已经设置训练营简介
		isHaveCampIntro: true,
		// 训练营文本简介
		campTextIntro: '',
	}

	data = {
		// 允许上传的图片格式
		imageFormatsAllow: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
		// 允许上传的图片的最大值
		imageMaxSize: 2,
		// 匹配整数的正则
		integerRegExp: /^\d+?$/,
		// 代表今日零点的日期对象
		today: new Date(formatDate(this.props.sysTime, 'yyyy/MM/dd')),
	}

	/**
	 * 获取训练营id
	 */
	get campId() {
		return this.props.params.campId;
	}

	/**
	 * 获取直播间id
	 */
	get liveId() {
		return this.props.params.liveId;
	}

	/**
	 * 处理训练营名称的输入
	 * @param {*event object} e
	 */
	onCampNameInput(e) {
		const value = e.target.value.trim();
		// 最多40个字
		if (value.length <= 40) {
			this.setState({
				campName: value
			});
		}
	}

	/**
	 * 结束日期联动
	 */
	endDateLinkage() {
		let { startDate, checkInDays } = this.state;
		if (checkInDays) {
			// 开始日期未填，默认为今天
			if (!startDate) {
				startDate = this.data.today;
			}
			this.setState({
				endDate: new Date(startDate.getTime() + Number(checkInDays - 1) * 24 * 60 * 60 * 1000)
			});
		}
	}

	/**
	 * 打卡天数联动
	 */
	checkInDaysLinkage() {
		// 打卡天数联动
		let { startDate, endDate } = this.state;
		if (endDate) {
			// 开始日期未填，默认为今天
			if (!startDate) {
				startDate = this.data.today;
			}
			//console.log((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
			this.setState({
				checkInDays: (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000) + 1
			});
		}
		this.onBlur();
	}

	/**
	 * 选择训练营的开始日期
	 * @param {*Date} date
	 */
	onStartDateSelect(date) {
		this.setState({
			startDate: new Date(formatDate(date.getTime(), 'yyyy/MM/dd'))
		}, this.endDateLinkage);
	}

	/**
	 * 输入打卡天数
	 * @param {*DOM event object} e
	 */
	onCheckInDaysChange(e) {
		const value = e.target.value.trim();
		// 打卡天数只能为<=999的整数或留空
		const days = +value;
		if ((this.data.integerRegExp.test(value) && days <= 999) || !value) {
			this.setState({
				checkInDays: value
			}, this.endDateLinkage);
		}
	}

	/**
	 * 选择训练营的结束日期
	 * @param {*date} date
	 */
	onEndDateSelect(date) {
		this.setState({
			endDate: new Date(formatDate(date.getTime(), 'yyyy/MM/dd'))
		}, this.checkInDaysLinkage);
	}

	/**
	 * 输入训练营的价格
	 * @param {*event object} e
	 */
	onPriceInput(e) {
		const value = e.target.value.trim();
		if (value == Number(value)) {
			const decimal = value.split('.')[1];
			if (decimal && decimal.length > 2) {
				return false;
			} else {
				this.setState({
					campPrice: value
				});
			}
		}
		if (value == 0) {
			this.setState({
				openBonusPlan: false
			})
		}
	}

	/**
	 * 开启或关闭契约金奖金计划
	 */
	switchBonusPlan() {
		if (this.disabledPromt()) {
			return;
		}
		const { campPrice, openBonusPlan } = this.state;
		const { isLiveAdmin } = this.props;
		const onConfirm = () => {
			locationTo(`/topic/live-studio-intro?liveId=${ this.liveId }`)
		}
		const onCancel = () => {}
		/**
		 * @param {*event object} isLiveAdmin
		 * isLiveAdmin: Y：专业版
		 * isLiveAdmin: N：非专业版
		 */
		if (isLiveAdmin) {
			if (!openBonusPlan) {
				if (Number(campPrice) == 0) {
					window.toast('请先设置价格');
					return false;
				} else {
					this.setState({
						openBonusPlan: true
					});
				}
			} else {
				this.setState({
					openBonusPlan: false
				});
			}
		} else {
			const msg = '当前版本非专业版，暂时不支持契约奖金计划，是否前往升级专业版？';
			window.confirmDialog(msg, onConfirm, onCancel, "升级专业版", 'cancel-confirm', {
				confirmText: "前往升级",
				cancelText: '暂不需要',
			});
		}

		setTimeout(() => {
			typeof _qla != 'undefined' && _qla('click', {
				region: 'open-bouns-plan',
				pos:this.state.openBonusPlan
			});
		}, 0);


	}

	/**
	 * 输入奖金比例
	 * @param {*event object} e
	 */
	onBonusScaleChange(e) {
		const value = e.target.value.trim();
		if (!value || (this.data.integerRegExp.test(value) && Number(value) >= 1 && Number(value) <= 98)) {
			this.setState({
				bonusScale: value
			});
		}
	}

	/**
	 * 输入领取奖金需要的打卡天数
	 * @param {*event object} e
	 */
	onCheckInDaysRequiredChange(e) {
		const value = e.target.value.trim();
		if ((this.data.integerRegExp.test(value) && Number(value) > 0) || !value) {
			this.setState({
				checkInDaysRequired: value
			});
		}
	}

	/**
	 * 表单提交
	 */
	async onSubmit() {
		// 验证表单是否填写完整
		const {
			campPoster,
			campName,
			startDate,
			checkInDays,
			endDate,
			campPrice,
			openBonusPlan,
			bonusScale,
			checkInDaysRequired,
			showBonusRule,
		} = this.state;
		if (!(campName && checkInDays && endDate)) {
			window.toast('请将训练营信息补充完整');
			return;
		}
		// 如果开启了契约金计划，那么契约金比例和领取条件必填
		if (openBonusPlan && !(bonusScale && checkInDaysRequired)) {
			window.toast('请将训练营信息补充完整');
			return;
		}
		const price = +campPrice;
		if (price > 0 && !validLegal('money', '收费训练营的价格', price, 50000, 1)) {
			return false;
		}
		if (bonusScale > 98) {
			window.toast('契约金比例不能超过98%');
			return false;
		}
		if (checkInDaysRequired > checkInDays) {
			window.toast('领取条件不能超过总的打卡天数');
			return;
		}
		createCheckInCamp({
			campId: this.campId || '',
			liveId: this.liveId,
			headImage: campPoster || 'https://img.qlchat.com/qlLive/liveCommon/default-bg-cover-1908080' + (~~(Math.random() * 3 + 1)) + '.png',
			name: campName,
			// liveId: this.liveId,
			startTime: startDate ? startDate.getTime() : this.data.today.getTime(),
			dayNum: checkInDays,
			endTime: endDate.getTime(), // 结束日期选择2018-01-01，那么实际的结束时间点理应是2018-01-02的零点
			price: Number(campPrice) * 100,
			bonusStatus: openBonusPlan ? 'Y' : 'N',
			bonusPercent: openBonusPlan ? bonusScale : 0,
			receiveDayNum: checkInDaysRequired
		}).then((result) => {
			if (result.state.code === 0) {
				// 跳转至打卡详情页
				locationTo(`/wechat/page/camp-detail?campId=${result.data.liveCampPo.id}`)
				// this.props.router.push(`/wechat/page/camp-detail?campId=${result.data.liveCampPo.id}`);
			} else {
				window.toast(result.state.msg);
			}
		});
	}

	/**
	 * 切换奖金规则的显示
	 */
	toggleBonusRule() {
		this.setState((prevState) => {
			return {
				showBonusRule: !prevState.showBonusRule
			}
		});
	}

	/**
	 * 图片上传后的回调
	 * @param {*string} imageUrl
	 */
	uploadImageCallback(imageUrl) {
		this.setState({
			campPoster: imageUrl
		});
	}

	/**
	 * 相关字段的禁止编辑提示
	 */
	disabledPromt() {
		const { isEditCamp, campAuthNum } = this.state;
		const isCampInUse = isEditCamp && campAuthNum;
		if (isCampInUse) {
			window.toast('已有学员报名，不可修改');
		}
		return isCampInUse;
	}

	/**
	 * 跳转至训练营的简介编辑页面
	 */
	editCampIntro() {
		this.props.router.push(`/wechat/page/check-in-camp/camp-intro-edit/${this.campId}?type=campDesc`);
	}

	componentWillMount() {
		this.props.initLiveLevel(this.liveId);
	}

	async componentDidMount() {
		const campId = this.campId;
		// 存在campId则为编辑训练营
		if (campId) {
			this.setState({
				isEditCamp: true,
				pageTitle: '编辑打卡',
			});
			fetchCampDetail(campId).then((result) => {
				if (result.state.code === 0) {
					const liveCamp = result.data.liveCamp;
					this.setState({
						campPoster: liveCamp.headImage,
						campName: liveCamp.name,
						startDate: new Date(liveCamp.startTimeStamp),
						checkInDays: liveCamp.dayNum,
						endDate: new Date(liveCamp.endTimeStamp),
						campPrice: liveCamp.price,
						openBonusPlan: liveCamp.bonusStatus === 'Y',
						bonusScale: liveCamp.bonusPercent || '',
						checkInDaysRequired: liveCamp.receiveDayNum,
						campAuthNum: liveCamp.authNum
					});
				} else {
					window.toast(result.state.msg);
				}
			});
			// 获取训练营的简介信息
			const campDesc = await this.props.getChannelIntro('campDesc', campId);
			if (Array.isArray(campDesc) && campDesc.length) {
				this.setState({
					isHaveCampIntro: true,
				})
				const firstTextIntro = campDesc.filter((item) => {
					return item.type === 'text';
				})[0];
				if (firstTextIntro) {
					this.setState({
						campTextIntro: firstTextIntro.content
					});
				}
			} else {
				this.setState({
					isHaveCampIntro: false
				})
			}

		}
	}

	onBlur(e){
		window.scrollTo(0, document.body.scrollTop + 1);
		document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
	}

	render() {
		const {
			sysTime,
			isLiveAdmin,
		} = this.props;
		const {
			imageFormatsAllow,
			imageMaxSize,
		} = this.data;
		const {
			pageTitle,
			campPoster,
			campName,
			startDate,
			endDate,
			checkInDays,
			isHaveCampIntro,
			campTextIntro,
			campPrice,
			openBonusPlan,
			bonusScale,
			checkInDaysRequired,
			showBonusRule,
			isEditCamp,
			campAuthNum,
		} = this.state;

		// 开始日期至少从当天开始
		const today = new Date(formatDate(sysTime, 'yyyy/MM/dd'));
		const minStartDate = dayjs(new Date(formatDate(sysTime, 'yyyy/MM/dd')).getTime());
		// 结束日期的选择范围至少从开始日期的当天开始
		let minEndDay;
		// 打卡训练营的周期最多为999天
		let endDay;
		// 默认选中的开始日期和结束日期
		let defaultStartDay;
		if (startDate) {
			minEndDay = new Date(startDate.getTime());
			endDay = new Date(startDate.getTime() + 24 * 60 * 60 * 1000 * 998);
			defaultStartDay = startDate;
		} else {
			minEndDay = new Date(today.getTime());
			endDay = new Date(today.getTime() + 24 * 60 * 60 * 1000 * 998);
			defaultStartDay = today;
		}
		const defaultStartDate = dayjs(defaultStartDay);
		let defaultEndDate;
		if (endDate) {
			const defaultEndDay = endDate.getTime();
			defaultEndDate = dayjs(defaultEndDay);
		}
		const minEndDate = dayjs(minEndDay);
		const maxEndDate = dayjs(endDay);
		// 训练营信息处于编辑状态且训练营已经有人报名
		const isCampInUse = isEditCamp && campAuthNum;
		return (
			<Page title={pageTitle} className="new-checkin-camp-container">
				<section className="checkincamp-post-uploader-container">
					<ImageUploader
						customClass="checkincamp-post-uploader"
						tip="上传打卡训练营海报"
						callback={this.uploadImageCallback}
						formatsAllow={imageFormatsAllow}
						maxSize={imageMaxSize}
						previewImageUrl={campPoster}
					/>
				</section>
				<section className="checkincamp-detail-editor-container">
					<div className="checkincamp-detail-editor-section">
						<div className="checkincamp-detail-item">
							<span className="checkincamp-detail-item-label">训练营名称</span>
							<span className="checkincamp-detail-input-box">
								<CommonInput type="text" placeholder="最多40个字(必填)" value={campName} onBlur={this.onBlur} onChange={this.onCampNameInput} />
							</span>
						</div>
						<div className="checkincamp-detail-item">
							<span className="checkincamp-detail-item-label">开始时间</span>
							{
								isCampInUse ?
									<span className="checkincamp-detail-input-box" onClick={this.disabledPromt}><i className="placeholder">{formatDate(startDate)}</i></span>
									:
									<DatePicker title="开始时间" minValue={minStartDate} value={defaultStartDate} onChange={this.onStartDateSelect} style="normal-time-picker">
										<span className="checkincamp-detail-input-box with-arrow-sign on-log" data-log-region='set-camp-date'  style={{ cursor: 'pointer' }}>
											{
												startDate ?
													formatDate(startDate)
													:
													<i className="placeholder">不设置则当天生效</i>
											}
										</span>
									</DatePicker>
							}
						</div>
						<div className="checkincamp-detail-item">
							<span className="checkincamp-detail-item-label">打卡天数(天)</span>
							<span className="checkincamp-detail-input-box">
								{
									isCampInUse ?
										<i className="placeholder" onClick={this.disabledPromt}>{checkInDays}</i>
										:
										<CommonInput type="text" placeholder="请填写整数(必填)" value={checkInDays} onChange={this.onCheckInDaysChange} onBlur={this.checkInDaysLinkage} />
								}
							</span>
						</div>
						<div className="checkincamp-detail-item">
							<span className="checkincamp-detail-item-label">结束时间</span>
							{
								isCampInUse ?
									<span className="checkincamp-detail-input-box" onClick={this.disabledPromt}><i className="placeholder">{formatDate(endDate)}</i></span>
									:
									<DatePicker title="结束时间" minValue={minEndDate} maxValue={maxEndDate} value={defaultEndDate} onChange={this.onEndDateSelect} style="normal-time-picker">
										<span className="checkincamp-detail-input-box with-arrow-sign" style={{ cursor: 'pointer' }}>
											{
												endDate ?
													formatDate(endDate)
													:
													<i className="placeholder">请设置(必填)</i>
											}
										</span>
									</DatePicker>
							}
						</div>
						{
							isEditCamp &&
							<div className="checkincamp-detail-item">
								<span className="checkincamp-detail-item-label">训练营简介</span>
								<span className="checkincamp-detail-input-box with-arrow-sign" style={{ cursor: 'pointer' }} onClick={this.editCampIntro}>
									{
										isHaveCampIntro ?
											<span className="camp-intro">{campTextIntro}</span>
											:
											<i className="placeholder">未设置</i>
									}
								</span>
							</div>
						}
						<div className="checkincamp-detail-item">
							<span className="checkincamp-detail-item-label">价格(元)</span>
							<span className="checkincamp-detail-input-box">
								{
									isCampInUse ?
										<i className="placeholder" onClick={this.disabledPromt}>{campPrice}</i>
										:
										<CommonInput type="text" placeholder="不填写则为免费" value={campPrice} onBlur={this.onBlur} onChange={this.onPriceInput} onFocus={() => {
											typeof _qla != 'undefined' && _qla('click', {
												region:'set-camp-money',
									   		});
										}} />
								}
							</span>
						</div>
					</div>
					<div className="checkincamp-detail-editor-section">
						<div className="checkincamp-detail-item">
							<span className="checkincamp-detail-item-label on-log" data-log-region='view-rule-link'>契约奖金计划<a href="javascript:void(0)" className="view-rule-link" onClick={this.toggleBonusRule}>查看详细规则</a></span>
							<Switch className="bonus-switcher" active={openBonusPlan} onChange={this.switchBonusPlan} />
						</div>
						{
							showBonusRule &&
							<div className="bonus-rule">开启契约奖金计划后，从每个成员的门票中扣除部分金额划入奖金池。打卡任务结束后，由完成任务的学员瓜分这笔奖金。</div>
						}
						{
							openBonusPlan &&
							<div>
								<div className="checkincamp-detail-item">
									<span className="checkincamp-detail-item-label">奖金比例</span>
									<span className="checkincamp-detail-input-box with-percent-sign">
										{
											isCampInUse ?
												<i className="placeholder" onClick={this.disabledPromt}>{bonusScale}</i>
												:
												<input type="text" value={bonusScale} onBlur={this.onBlur} onChange={this.onBonusScaleChange} placeholder="请输入(1-98%)的分成比例(必填)" />
										}
									</span>
								</div>
								<div className="checkincamp-detail-item">
									<span className="checkincamp-detail-item-label">领取条件(天)</span>
									<span className="checkincamp-detail-input-box">
										{
											isCampInUse ?
												<i className="placeholder" onClick={this.disabledPromt}>{checkInDaysRequired}</i>
												:
												<input type="text" value={checkInDaysRequired || ''} onBlur={this.onBlur} onChange={this.onCheckInDaysRequiredChange} placeholder="请设置需打卡天数(必填)" />
										}
									</span>
								</div>
							</div>
						}
					</div>
					<div className="submit-button on-log" role="button" data-log-region='submit-create-camp' onClick={this.onSubmit}>完成</div>
				</section>
			</Page>
		)
	}
}

newCheckInCamp.propTypes = {

}

const mapStateToProps = (state) => ({
	sysTime: state.common.sysTime,
	isLiveAdmin: state.common.isLiveAdmin === 'Y',
})

const mapDispatchToProps = {
	initLiveLevel,
	getChannelIntro,
}

export default connect(mapStateToProps, mapDispatchToProps)(newCheckInCamp)
