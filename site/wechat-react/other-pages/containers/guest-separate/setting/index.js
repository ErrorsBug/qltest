/**
 * Created by dylanssg on 2017/8/2.
 */
import React, { Component } from 'react';
import Page from 'components/page';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
import Confirm from 'components/dialog/confirm';
import DatePicker from 'components/date-picker';
import { locationTo, formatDate,formatMoney } from 'components/util';

import {
	channelAddedSeparateList,
	getAssignedPercent,
	addSeparate,
	deleteEmptyGuest,
	acceptTimeInvitation,
} from '../../../actions/guest-separate';

@autobind
class Setting extends Component{
	state = {
		noMore: false,
		datePickerVal: '',
		date: '',
		separateInputVal: '',
		guestList: [],
		assignedPercent: 0,
		isZeroData: false,
		autoPaySwitch: false
	};
	data = {
		pageType: this.props.location.query.channelId ? 'channel' : (this.props.location.query.campId ? 'camp' :'topic') ,
		page: 1,
		pageSize: 20
	};
	componentDidMount(){
		if(!this.props.location.query.channelId && !this.props.location.query.topicId && !this.props.location.query.campId){
			setTimeout(()=>{
				toast('缺少id')
			},3000)
		}else{
			this.getAssignedPercent();
			this.channelAddedSeparateList(1);
		}
		window.onpageshow = function(event){
			if (event.persisted) {
				window.location.reload();
			}
		}
	}
	getAssignedPercent(){
		this.props.getAssignedPercent({
			channelId: this.props.location.query.channelId,
			topicId: this.props.location.query.topicId,
			campId: this.props.location.query.campId,
		}).then((result) => {
			if(result.state.code === 0){
				this.setState({
					assignedPercent: result.data.assignedPercent
				})
			}
		});
	}
	async channelAddedSeparateList(page){
		let result = await this.props.channelAddedSeparateList({
			channelId: this.props.location.query.channelId || '',
			topicId: this.props.location.query.topicId || '',
			campId: this.props.location.query.campId || '',			
			pageNum: page,
			pageSize: this.data.pageSize
		});
		if(result.state.code === 0){
			if(result.data.guestList.length){
				this.setState({
					guestList: [
						...this.state.guestList,
						...result.data.guestList
					]
				});
			}
			if(result.data.guestList.length < this.data.pageSize){
				this.setState({
					noMore: true
				})
			}
			if(page === 1 && result.data.guestList.length === 0){
				this.setState({
					isZeroData: true
				});
			}
		}
	}
	async loadNext(next){
		await this.channelAddedSeparateList(++this.data.page);
		next && next();
	}
	addBtnClickHandle(){
		this.refs['addGuestConfirm'].show();
	}
	separateInputChangeHandle(e){
		if(!/[0-9\.]/.test(Number(e.target.value))){
			e.target.value = this.state.separateInputVal;
			window.toast('请输入数字');
			return;
		}
		this.setState({
			separateInputVal: e.target.value ? e.target.value : ''
		})
	}
	async addGuest(type){
		if(type === 'confirm'){
			if(!this.state.separateInputVal){
				window.toast('请输入分成比例')
				return false;
			}else if(this.state.separateInputVal < 1){
				window.toast('分成比例不得少于1%');
				return false;
			}else if(this.state.separateInputVal > 100 - this.state.assignedPercent){
				window.toast('分成比例不得超过' + (100 - this.state.assignedPercent));
				return false;
			}
			let result = await this.props.addSeparate({
				channelId: this.props.location.query.channelId || '',
				topicId: this.props.location.query.topicId || '',
				campId: this.props.location.query.campId || '',
				sharePercent: Number(this.state.separateInputVal).toFixed(2),
				expiryTime: this.state.date ? this.state.date.getTime() : '',
				isAutoTransfer: this.state.autoPaySwitch ? 'Y' : 'N'
			});
			if(result.state.code === 0){
				window.toast('添加成功');
				const nowDate=new Date().getTime();
				this.gotoInvite(result.data.guestInfo.id,nowDate);
			}
		}
	}

	gotoInvite(id,nowDate){
		this.setAcceptTimeInvitation(id,nowDate,()=>{
			locationTo(`/wechat/page/guest-separate/invitation?liveId=${ this.props.location.query.liveId }&id=${id}${this.props.location.query.channelId ? '&channelId=' + this.props.location.query.channelId : (this.props.location.query.campId ? '&campId='+ this.props.location.query.campId :'&topicId=' + this.props.location.query.topicId)}&ts=${nowDate}`)
		});
	}

	//时间缓存60分钟无效
	async setAcceptTimeInvitation(guestId,nowDate,callback){		
		const params={
			guestId,
			type:this.data.pageType,
			timeStamp:nowDate,
		};
		let result = await this.props.acceptTimeInvitation(params);
		if(result.state.code===0){
			callback&&callback();
		}else{
			window.toast(result.state.msg);
		}
	}

	deleteBtnClickHandle(id){
		this.data.currentDeleteId = id;
		this.refs.deleteGuestConfirm.show();
	}
	async deleteGuest(type){
		if(type === 'confirm') {
			this.refs.deleteGuestConfirm.hide();
			let result = await this.props.deleteEmptyGuest({
				channelId: this.props.location.query.channelId,
				topicId:this.props.location.query.topicId,
				campId:this.props.location.query.campId,
				guestId: this.data.currentDeleteId
			});
			if (result.state.code === 0) {
				window.toast('删除成功');
				let guestList = [...this.state.guestList],
					index;
				guestList.forEach((item, i) => {
					if (item.id === this.data.currentDeleteId){
						index = i;
						this.setState({
							assignedPercent: this.state.assignedPercent - item.sharePercent
						})
					}
				});
				if (index !== undefined) {
					guestList.splice(index, 1);
				}
				this.setState({
					guestList
				});
			}
		}
	}
	
	selectDate(date){
		this.setState({
			date: date,
			datePickerVal: date,
		});
	}
	
	deleteDate(){
		this.setState({
			date: ''
		});
	}
	openGuestSeparateIntro(){
		this.refs['guestSeparateIntro'].show();
	}
	closeGuestSeparateIntro(){
		this.refs['guestSeparateIntro'].hide();
	}
	autoPaySwitchHandle(){
		if(!this.state.autoPaySwitch){
			this.refs['autoPayConfirmDialog'].show();
		}else{
			this.setState({
				autoPaySwitch: false
			});
		}
	}
	autoPayConfirmHandle(type){
		if(type === 'confirm'){
			this.refs['autoPayConfirmDialog'].hide();
			this.setState({
				autoPaySwitch: true
			});
		}
	}
	render(){
		return (
			<Page title="嘉宾分成设置" className="guest-separate-setting flex-body">
				<div className="add-guest">
					参与{this.data.pageType === 'channel' ? '系列课' : (this.data.pageType === 'channel' ? '训练营':'课程')}分成的嘉宾
					<div className="add-btn" onClick={this.addBtnClickHandle}>添加分成嘉宾</div>
				</div>
				{
					!this.state.isZeroData ?
						<ScrollToLoad
							loadNext={this.loadNext}
							noMore={this.state.noMore}
							notShowLoaded={true}
						>
							<div className="list-wrap">
								{
									this.state.guestList.map((item,i) => {
										return (
											<div className={`item${item.userId ? '' : ' vacancy'}`} key={`item-${i}`}>
												<div className="info-wrap">
													<div className="avatar">
														<img src={`${item.headImgUrl}?x-oss-process=image/resize,m_fill,h_80,w_80`} alt=""/>
													</div>
													<div className="details">
														<div className="name">{item.userName || '未邀请'}
															{
																!item.userId &&
																<span className="delete-btn" onClick={this.deleteBtnClickHandle.bind(this, item.id)}>删除</span>
															}
														</div>
														<div className="proportion">分成比例：{item.sharePercent}%&emsp;{item.userId ? (item.expiryTime && item.expiryTime < Date.now() ? '已结束' : '分成中') : ''}</div>
														<div className="deadline">截止时间：{item.expiryTime ? formatDate(new Date(item.expiryTime),'yyyy-MM-dd hh:mm') : '无'}</div>
														{
															!!item.userId &&
															<div className="settlement">待 发 放：<span className="price">￥{item.pendingMoney ? item.pendingMoney / 100 : 0}</span></div>
														}
													</div>
													{
														!item.userId &&
														<div className="invite-btn" onClick={this.gotoInvite.bind(this,item.id,Date.now())}>去邀请嘉宾</div>
													}
												</div>
												{
													!!item.userId &&
													(
														this.data.pageType==="channel"?
														<div className="operation">
															<div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/manage?channelId="+this.props.location.query.channelId+"&type=detail&guestId="+item.id)}}>查看收益明细</div>
															<div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/manage?channelId="+this.props.location.query.channelId+"&type=clearing&guestId="+item.id)}}>查看结算记录</div>
														</div>
														:
														(
															this.data.pageType==="camp"?
															<div className="operation">
																<div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/manage?campId="+this.props.location.query.campId+"&type=detail&guestId="+item.id)}}>查看收益明细</div>
																<div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/manage?campId="+this.props.location.query.campId+"&type=clearing&guestId="+item.id)}}>查看结算记录</div>
															</div>
															:
															<div className="operation">
																<div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/manage?topicId="+this.props.location.query.topicId+"&type=detail&guestId="+item.id)}}>查看收益明细</div>
																<div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/manage?topicId="+this.props.location.query.topicId+"&type=clearing&guestId="+item.id)}}>查看结算记录</div>
															</div>
														)

													)
													
												}
											</div>
										)
									})
								}
							</div>
							<div className="separate-intro">
								<div className="title">嘉宾分成说明</div>
								<div>嘉宾参与的分成收益范围仅为本{this.data.pageType === 'channel' ? '系列课' : (this.data.pageType === 'camp' ? '训练营': '课程')}入场券的净收入</div>
							</div>
						</ScrollToLoad>
					:
						<div className="no-data-tip">
						暂无分成嘉宾
						</div>
				}
				<div className="back-btn" onClick={() => locationTo(`/wechat/page/guest-separate/channel-list-b?liveId=${this.props.location.query.liveId}`)}>返回列表</div>

				<Confirm
					title="是否删除该嘉宾分成？"
					ref="deleteGuestConfirm"
					buttons='cancel-confirm'
					onBtnClick={this.deleteGuest}
				/>

				<Confirm
					title="添加分成嘉宾"
					ref="addGuestConfirm"
					buttons='cancel-confirm'
					onBtnClick={this.addGuest}
				>
					<div className="add-guest-confirm">
						<div className="sub-title">设置嘉宾分成比例
							<i>（按{this.data.pageType === 'channel' ? '系列课' : (this.data.pageType === 'camp' ? '训练营':'课程')}入场券净收入分成）</i>
						</div>
						<div className="input-wrap">
							<input className="input" type="text" placeholder={`请设置分成比例，最多能分${100 - this.state.assignedPercent}%`} value={this.state.separateInputVal} onChange={this.separateInputChangeHandle}/>
							<div className="unit">%</div>
						</div>
						{
							!!this.state.separateInputVal && 100 - this.state.assignedPercent - this.state.separateInputVal >= 0 ?
								<div className="tip">你将获得{this.data.pageType === 'channel' ? '系列课' : (this.data.pageType === 'camp' ? '训练营':'课程')}入场券利润的<strong>{100 - this.state.assignedPercent - this.state.separateInputVal}%</strong>
									<div className="icon-question icon_ask2" onClick={this.openGuestSeparateIntro}></div>
								</div>
								:
								(
									!!this.state.separateInputVal && 100 - this.state.assignedPercent - this.state.separateInputVal < 0 &&
									<div className="tip error">当前最多可设置为{100 - this.state.assignedPercent}%</div>
								)
						}

						<div className="sub-title">设置分成结束时间
							<i>（选填）</i>
						</div>
						<div className="input-wrap">
						<DatePicker mode="datetime"
							title="结束时间" 
							minValue={dayjs(new Date(Date.now() + 24 * 60 * 60 * 1000))}
							value={this.state.date ? dayjs(this.state.date) : dayjs(new Date(Date.now() + 25 * 60 * 60 * 1000))}
							style="normal-time-picker"
							barClassName="input"
							onChange={this.selectDate}
							>
                                <div className={this.state.date?'':'placeholder'} onClick={this.dateInputClickHandle}>{this.state.date?formatDate(this.state.date,'yyyy-MM-dd hh:mm'):"请设置时间"}</div>
                            {/* <input type="text" className="date-input" placeholder="请设置时间" readOnly value={formatDate(this.state.date,'yyyy-MM-dd hh:mm')} onClick={this.dateInputClickHandle} onFocus={(e) => e.preventDefault()}/> */}
                        </DatePicker>
							{
								!!this.state.date &&
								<div className="delete-date-btn icon_cancel" onClick={this.deleteDate}></div>
							}
						</div>
						<div className="tip">
							1.不设置时间则为永久分成，可手动结束
							<br/>
							2.用户接受邀请，即刻开始分成
						</div>
						<div className="auto-pay">
							<div className="sub-title">
								自动发放嘉宾分成收益
								<div className={`switch-btn${this.state.autoPaySwitch ? ' on' : ''}`} onClick={this.autoPaySwitchHandle}></div>
							</div>
							<div className="tip">
								开启自动发放分成后，将会由系统自动给嘉宾发放收益，请勿提前提现直播间收益。否则将导致无法自动分成。
							</div>
						</div>
					</div>
				</Confirm>

				<Confirm
					title="嘉宾分成比例说明"
					ref="guestSeparateIntro"
					buttons='confirm'
					confirmText="知道了"
					onBtnClick={this.closeGuestSeparateIntro}
				>
					<div className="guest-separate-intro">
						1.普通订单：订单收入扣除渠道成本（微信手续费<strong>0.6%</strong>），剩余为课程净收入，此嘉宾分净收入的<strong>{this.state.separateInputVal}%</strong>，其他嘉宾分净收入的<strong>{this.state.assignedPercent}%</strong>，直播间（你）分净收入的<strong>{100 - this.state.assignedPercent - this.state.separateInputVal}%</strong>。
						<br/>
						<br/>
						2.分销订单：订单收入扣除渠道成本（课代表分成及微信手续费<strong>0.6%</strong>），剩余为课程净收入，此嘉宾分净收入的<strong>{this.state.separateInputVal}%</strong>，其他嘉宾分净收入的<strong>{this.state.assignedPercent}%</strong>，直播间（你）分净收入的<strong>{100 - this.state.assignedPercent - this.state.separateInputVal}%</strong>。
					</div>
				</Confirm>

				<Confirm
					className="auto-confirm-dialog"
					ref='autoPayConfirmDialog'
					title="确认开启自动发放嘉宾收益？"
					titleTheme='white'
					buttonTheme='line'
					confirmText= '确定'
					theme='primary'                                // 主题
					bghide={ true }                                // 是否点击背景关闭
					buttons='cancel-confirm'                       // 按钮配置
					onBtnClick={ this.autoPayConfirmHandle }
				>
					<div className="auto-pay-intro">请确认合作老师为可信任的合作关系，开启自动发放收益后，系统将会每天自动结算老师的收益，中途也可修改为手动发放模式。</div>
				</Confirm>

			</Page>
		)
	}
}

module.exports = connect((state) => {
	return {

	}
}, {
	channelAddedSeparateList,
	getAssignedPercent,
	addSeparate,
	deleteEmptyGuest,
	acceptTimeInvitation,
})(Setting);