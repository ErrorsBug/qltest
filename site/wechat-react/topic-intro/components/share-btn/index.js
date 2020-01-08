/**
 *
 * @author Dylan
 * @date 2018/6/4
 */
import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import { withRouter, Link } from 'react-router';

import ActionSheet from 'components/action-sheet';
import CoralPromoDialog from 'components/dialogs-colorful/coral-promo-dialog';

import {
	locationTo,
	formatDate,
	formatMoney,
	imgUrlFormat,
	getVal,
	isFromLiveCenter,
} from 'components/util';

@withRouter
@autobind
class ShareBtn extends Component {

	state = {
		mountActionSheet: false,
		mountCoralPromoDialog: false,
		showCoralPromoDialog: false,
		coralPromotionPanelNav: 'tutorial',
		shrinkBtn: false,
	};

	componentDidMount(){
		if(this.props.coralLink){
			this.props.initCoralShare();
		}else{
			this.props.initShare();
		}
		setTimeout(() => {
			this.setState({
				shrinkBtn: true
			})
		}, 500);
	}

	data = {

	}
	
	componentDidUpdate(){
		if(this.buttonRef && this.btnTextRef){
			this.buttonRef.style.width = this.buttonRef.clientWidth + 1 + 'px';
			this.btnTextRef.style.width = this.btnTextRef.clientWidth + 1 + 'px';
		}
	}

	async uncertainShareBtnClickHandle(){
		if(!this.state.mountActionSheet){
			await new Promise(resolve => {
				this.setState({
					mountActionSheet: true
				}, () => resolve())
			});
		}

		if(this.data.coralShareSheetList){
			this.actionSheet.show(this.data.coralShareSheetList);
			return;
		}

		this.data.coralShareSheetList = [
			{
				name: '使用珊瑚计划推广赚',
				strong: `${formatMoney(this.props.price * (this.props.coralPercent / 100))}元`,
				action: _ => {
					this.showCoralPromoDialog();
					// this.initCoralShare();
				}
			},
			{
				name: '使用课代表推广赚',
				strong: `${formatMoney(this.props.price * (this.props.distributionPercent / 100))}元`,
				action: _ => this.onShareCardClick()
			}
		];

		this.actionSheet.show(this.data.coralShareSheetList);
	}

	async showCoralPromoDialog(){
		if(!this.state.mountCoralPromoDialog){
			await new Promise(resolve => {
				this.setState({
					mountCoralPromoDialog: true
				}, () => resolve())
			});
		}
		this.setState({
			showCoralPromoDialog: true
		})
		this.props.initCoralShare();
	}

	onShareCardClick(){
		const lshareKey = getVal(this.props, 'location.query.shareKey', '');
		const sourceNo = getVal(this.props, 'location.query.sourceNo', '');
		let url = `/wechat/page/sharecard?type=${this.props.type}&${this.props.type === 'channel' ? 'channelId=' : 'topicId='}${this.props.coralPushData.businessId}&liveId=${this.props.liveId}&lshareKey=${lshareKey}&sourceNo=${sourceNo}${this.props.missionId ? '&missionId=' + this.props.missionId : ''}`;
		// 平台分销
		if (isFromLiveCenter() && this.props.platformShareRate) {
            url = url + '&psKey=' + this.props.userId;
		}
		// 拉人返学费跳转到邀请卡页面的时候带参
		if(this.props.isBackTuition && !this.props.coralPercent) {
			url = url + '&isBackTuition=Y'
		}
		locationTo(url);
	}

	onCoralPromoDialogClose(){
		this.setState({
			showCoralPromoDialog: false
		})
		if(this.props.distributionPercent){
			this.props.initShare();
		}
	}

	switchCoralPromotionPanelNav(type){
		this.setState({
			coralPromotionPanelNav: type
		})
	}


	// 新版邀请卡
	newGenerateBtn() {
		const classArr = []
		let generateBtnClass = '';
		let styleObj = {};
		const contianerWidth = document.querySelector('.portal-container').getBoundingClientRect().width;
		const {
			tabStick,
			isScrollRolling,
			shareBtnSimplify,
			isQlLive,
			isUnHome
		} = this.props
		if (tabStick) {
			classArr.push('tabStick')
		}
		if (isScrollRolling) {
			classArr.push('rolling')
		}
		if (shareBtnSimplify) {
			classArr.push('simplify')
		}
		// if (!isUnHome && isQlLive) { // 引导下载app功能去除，样式就不要了
		// 	classArr.push('ql-live')
		// }
		generateBtnClass = classArr.join(' ')
		// 免费或者拉人返学费的都只显示“邀请好友学”
		// 拉人返 > 平台分销 > 珊瑚 > 拉人返  , 所以如果有珊瑚就不能拉人返
		if(this.props.isFree || (this.props.isBackTuition && !this.props.coralPercent)){
			return (
				<div className={`cend-intro-share-btn-new on-log on-visible ${generateBtnClass}`}
				     data-log-name="生成邀请卡"
				     data-log-region="cend-intro-share-btn"
				     data-log-pos={`${isFromLiveCenter() ? '' : 'B-'}normal`}
				     onClick={this.onShareCardClick}
					ref={el => (this.buttonRef = el)}
					style={styleObj}
				>
					<img src={require('./img/new-share.png')}/>
					<div className="text">
						<span>邀请卡</span>
						{/*<span>邀请</span>*/}
						{/*<span className="shrink">好友学</span>*/}
					</div>
				</div>
			)
		}else if(isFromLiveCenter() && this.props.platformShareRate){
			return (
				<div className={`cend-intro-share-btn-new pick on-log on-visible ${generateBtnClass}`}
					 data-log-name="生成邀请卡"
					 data-log-region="cend-intro-share-btn"
					 data-log-pos={`${isFromLiveCenter() ? '' : 'B-'}sr`}
					 onClick={this.onShareCardClick}
					 ref={el => (this.buttonRef = el)}
					 style={styleObj}
				>
					{/*<img src={require('./img/new-pick.png')}/>*/}
					<img src={require('./img/icon-sr.png')}/>
					<div className="text">
						<span>邀请卡</span>
						{/*<span className="shrink">推广赚</span>*/}
						{/*<span>￥{formatMoney(this.props.price * (this.props.platformShareRate / 100))}</span>*/}
					</div>
				</div>
			)
		}else if(this.props.distributionPercent && (this.props.coralPercent&&(this.props.coralLink||this.props.source=="coral"))){
			return (
				<div className={`cend-intro-share-btn-new pick on-log on-visible ${generateBtnClass}`}
				     data-log-name="生成邀请卡"
				     data-log-region="cend-intro-share-btn"
				     data-log-pos={`${isFromLiveCenter() ? '' : 'B-'}uncertain`}
				     onClick={this.uncertainShareBtnClickHandle}
					 ref={el => (this.buttonRef = el)}
					 style={styleObj}
				>
					{/*<img src={require('./img/new-pick.png')}/>*/}
					<img src={require('./img/icon-sr.png')}/>
					<div className="text">
						<span>邀请卡</span>
						{/*推广赚*/}
					</div>
				</div>
			)
		}else if(this.props.distributionPercent){
			return (
				<div className={`cend-intro-share-btn-new pick on-log on-visible ${generateBtnClass}`}
				     data-log-name="生成邀请卡"
				     data-log-region="cend-intro-share-btn"
				     data-log-pos={`${isFromLiveCenter() ? '' : 'B-'}sr`}
				     onClick={this.onShareCardClick}
					 ref={el => (this.buttonRef = el)}
					 style={styleObj}
				>
					{/*<img src={require('./img/new-pick.png')}/>*/}
					<img src={require('./img/icon-sr.png')}/>
					<div className="text">
						<span>邀请卡</span>
						{/*<span className="shrink">推广赚</span>*/}
						{/*<span>￥{formatMoney(this.props.price * (this.props.distributionPercent / 100))}</span>*/}
					</div>
				</div>
			)
		}else if(this.props.coralPercent&&(this.props.coralLink||this.props.source=="coral")){
			return (
				<div className={`cend-intro-share-btn-new coral on-log on-visible ${generateBtnClass}`}
				     data-log-name="生成邀请卡"
				     data-log-region="cend-intro-share-btn"
				     data-log-pos={`${isFromLiveCenter() ? '' : 'B-'}coral`}
				     onClick={this.showCoralPromoDialog}
					 ref={el => (this.buttonRef = el)}
					 style={styleObj}
				>
					<img src={require('./img/new-coral.png')}/>
					<div className="text">
						<span>邀请卡</span>
						{/*<span className="shrink">推广赚</span>*/}
						{/*<span>￥{formatMoney(this.props.price * (this.props.coralPercent / 100))}</span>*/}
					</div>
				</div>
			)
		}else if(this.props.isAutoShareOpen === 'Y'&& !this.props.coralLink) {/*珊瑚会员分享的自动分销课程，显示邀好友学*/
			return (
				<div className={`cend-intro-share-btn-new pick on-log on-visible ${generateBtnClass}`}
				     data-log-name="生成邀请卡"
				     data-log-region="cend-intro-share-btn"
				     data-log-pos={`${isFromLiveCenter() ? '' : 'B-'}sr`}
				     onClick={this.onShareCardClick}
					 ref={el => (this.buttonRef = el)}
					 style={styleObj}
				>
					{/*<img src={require('./img/new-pick.png')}/>*/}
					<img src={require('./img/icon-sr.png')}/>
					<div className="text">
						<span>邀请卡</span>
						{/*<span className="shrink">推广赚</span>*/}
						{/*<span>￥{formatMoney(this.props.price * this.props.autoSharePercent / 100)}</span>*/}
					</div>
				</div>
			)
		}else{
			return (
				<div className={`cend-intro-share-btn-new on-log on-visible ${generateBtnClass}`}
				     data-log-name="生成邀请卡"
				     data-log-region="cend-intro-share-btn"
				     data-log-pos={`${isFromLiveCenter() ? '' : 'B-'}normal`}
				     onClick={this.onShareCardClick}
					 ref={el => (this.buttonRef = el)}
					 style={styleObj}
				>
					<img src={require('./img/new-share.png')}/>
					<div className="text">
						<span>邀请卡</span>
						{/*<span>邀请</span>*/}
						{/*<span className="shrink">好友学</span>*/}
					</div>
				</div>
			)
		}
	}

	render(){
		let container = document.querySelector('.portal-container');
		return (
			<Fragment>
				{   
					container && createPortal(
						this.newGenerateBtn(),
						container
					)
					
				}
				{
					this.state.mountActionSheet &&
					createPortal(
						<ActionSheet
							ref={c => {this.actionSheet = c;}}
						/>,
						container
					)
				}
				{
					this.state.mountCoralPromoDialog &&
					createPortal(
						<CoralPromoDialog
							show={this.state.showCoralPromoDialog}
							close={this.onCoralPromoDialogClose}
							nav={this.state.coralPromotionPanelNav}
							switchNav={this.switchCoralPromotionPanelNav}

							courseData={this.props.coralPushData}
							officialKey={this.props.userId}
							userInfo = {getVal(this.props, 'userInfo', {})}
						/>,
						container
					)
				}
			</Fragment>
		);
	}
}

export default ShareBtn;