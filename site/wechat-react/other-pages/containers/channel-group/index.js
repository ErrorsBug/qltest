const isNode = typeof window == 'undefined';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isQlchat } from 'components/envi';
import appSdk from 'components/app-sdk'

import { autobind } from 'core-decorators';
import Page from 'components/page';
import { share, closeShare } from 'components/wx-utils'
import { Confirm, MiddleDialog } from 'components/dialog'

import Sponser from './components/sponser';
import Invited from './components/invited';
import Counting from './components/counting';
import InvitedCharged from './components/invited-charged';
import EndGroup from './components/end-group';
import FullGroup from './components/full-group';
import EndCharged from './components/end-charged';
import FailGroup from './components/fail-group';
import SuccessGroup from './components/success-group';

import JoinerList from './components/joiner-list';
import Notice from './components/notice';
import Desc from './components/desc';
// import QrCode from './components/qrcode';
import QRImg from 'components/qr-img';

import { logPayTrace, logGroupTrace } from 'components/log-util';
import { locationTo , formatMoney, filterOrderChannel  } from 'components/util';

import { doPay } from 'common_actions/common'
import { fetchInitData, initChannelGroup, setGroupPayList, getChannelQr, countShareCache, countVisitCache, countSharePayCache, getEditorSummary } from '../../actions/channel-group';
import { getQr, bindOfficialKey, getMyCoralIdentity, getQlShareKey } from '../../actions/common';
import { getChannelGroupResult, channelCreateGroup, getOpenPayGroupResult, getChannelGroupSelf } from '../../actions/channel';
import { bindLiveShare } from '../../actions/live';
import Timer from 'components/timer';

import { 
    getShareRate
} from 'common_actions/live';

import {
	checkUser
} from '../../../live-studio/actions/collection';


/**
 * 拼课详情页
 *
 * @class ChannelGroup
 * @extends {Component}
 */
@autobind
class ChannelGroup extends Component {

    constructor(props) {
		super(props);
        // type:
        //   sponser: 发起者查看正在拼课页面
        //   invited: 被邀请者
        //   success: 已经购买过这个团
        //   full: 已满进入
        //   end: 拼课已结束
        //   endcharge: 拼课结束并且成功购买
        //   complete: 团长进入拼课成功
        //   fail: 团长进入拼课失败
        //   counting: 拼团结算中
        // this.data.type = props.location.query.type;
		// this.data.groupId = props.location.query.groupId;
		console.log(44444, props.groupInfo.pageType)
        this.data.type = props.groupInfo.pageType;
        // this.data.type = 'endcharge';
        this.data.groupId = props.groupInfo.id;
        //拼课已结束(包括成功与否)
        this.data.isGroupClosed = (['full','end','endcharge','complete','fail'].indexOf(this.data.type) >= 0);
        this.onConfirmShare = this.onConfirmShare.bind(this);
        this.onShareClick = this.onShareClick.bind(this);
        this.onGroupFinished = this.onGroupFinished.bind(this);
        this.onLinkToChannel = this.onLinkToChannel.bind(this);
        this.onLinkToChannelIntro = this.onLinkToChannelIntro.bind(this);
        this.doPayClick = this.doPayClick.bind(this);
    }

    data = {
        isLeader: this.props.groupInfo.userId === this.props.userInfo.userId,
	    discountStatus: this.props.groupInfo.chargeConfigs[0].discountStatus,
	    groupType: this.props.groupInfo.type, // 开团时团的类型：free|charge
    };

    state = {
        payStatus: 'no', // success: 显示头部已支付文案  no: 显示头部普通样式
        groupPayList: [], // 报名的列表
        channelQrCode: '', // 系列课二维码
        showShare: false, // 分享连接
	    shareSuccessDialogFreeActive: false, // 免费团长分享成功弹层
	    shareSuccessDialogPayActive: false, // 付费团长分享成功弹层
        shareTime: 0,
	    showQlQRCodeDialog: false,
	    qlQRCodeUrl: '',
		coralPercent: '',
		channelDesc: '', // pc富文本
	};
	
	get tracePage() {
        return window.sessionStorage && sessionStorage.getItem('trace_page')
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }

    async componentDidMount() {
        // if (!this.props.groupInfo.id) {
        //     this.props.fetchInitData(this.data.id);
        // }

        closeShare();

        this.initQr();

        (this.data.type === 'success' || this.data.type === 'endcharge') && this.setState({
            payStatus: 'success'
		});
		

		const { groupInfo, groupPayList = [] } = this.props;
		let tempGroupPayList = []
		let { joinNum, groupNum, groupResult, simulationStatus } = this.props.groupInfo

		if (groupPayList.length === 0) {
			tempGroupPayList.unshift({
				headUrl: groupInfo.leaderHead,
				userName: groupInfo.leaderName,
				createTime: groupInfo.createTime
			});

		} else {
			// 将团长弄到最前面
			let tempItem = groupPayList.filter(item => item.userId == groupInfo.userId)
			let noTempItem = groupPayList.filter(item => item.userId != groupInfo.userId)
			tempGroupPayList = [...tempItem, ...noTempItem]
		}

		// 模拟拼课成功了  需要添加机器人空位
		if (groupResult.result === 'SUCCESS' && groupNum > joinNum && simulationStatus === 'Y') {
			let tempMoniList = new Array(groupNum - joinNum).fill({
				headUrl: '',
				userName: '匿名用户',
				createTime: '',
				robot: true
			})
			tempGroupPayList.push(...tempMoniList)
		}
        this.setState({
            groupPayList: tempGroupPayList
		});
        if(this.props.location.query.type === 'invited'){
            this.props.countVisitCache(groupInfo.id);
		}
		
		if(this.props.location.query.officialKey||this.props.location.query.source=="coral"){
			this.tracePage = 'coral'
		}

        //获取分享次数缓存
        this.setState({
            shareTime: localStorage.getItem(`${groupInfo.channel.channelId}-shareTime`) || 0
        },() => {
        	if(!this.data.isGroupClosed && ((this.data.isLeader && this.data.groupType === 'charge') || groupInfo.groupResult && groupInfo.groupResult.result === 'SUCCESS') && this.state.shareTime === 0 && !isQlchat()){
        		//付费拼课，团长及付费团员没分享过的话引导分享
        		this.setState({
			        showShare: true
		        });
	        }else if(!this.data.isGroupClosed && this.data.isLeader && this.data.groupType === 'free' && !isQlchat()){
        		//免费拼课团长在拼团成功前都引导分享，好惨
		        this.setState({
			        showShare: true
		        });
	        }
        });

        //如果有lshareKey，就绑定关系
	    if(this.props.location.query.lshareKey){
	    	this.props.bindLiveShare(this.props.groupInfo.channel.liveId, this.props.location.query.lshareKey);
	    }


	    if((this.props.isLiveAdmin !== 'Y'||(this.props.isLiveAdmin === 'Y'&&this.props.isQlLive=='Y')) && this.props.isWhiteLive !=='Y' && !this.props.isFocusThree){
		    this.getQlQrCode();
	    }

	    //officialKey，就绑定关系
	    if(this.props.location.query.officialKey){
		    this.props.bindOfficialKey({
			    officialKey: this.props.location.query.officialKey
		    });
		}
		this.handleGetEditorSummary()

	    await this.getQlShareKey();

		
		this.props.getShareRate({businessId:this.props.groupInfo.channel.channelId,businessType:'CHANNEL'});
		this.initShare();
		this.checkUser();

		setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0)
		console.log('isQlLive:'+this.props.isQlLive);
		console.log('isWhiteLive:'+this.props.isWhiteLive);
		console.log('isLiveAdmin:'+this.props.isLiveAdmin);
		console.log('isShowQl:'+this.props.isShowQl);
		console.log('isSubscribe:'+this.props.isSubscribe);
		console.log('isFocusThree:'+this.props.isFocusThree);
	}

	componentDidUpdate(preProps,preState) {
        if (!this.isUpdateShare && this.props.platformShareRate && this.props.platformShareRate != preProps.platformShareRate) {
            // 重置页面分享。
            this.isUpdateShare = true;
            this.initShare();
        }
    }

	async handleGetEditorSummary() {
		let result = await this.props.getEditorSummary(this.props.groupInfo.channel.channelId, 'channel');
        if (result.state.code == 0) {
            this.setState({
                channelDesc: result.data.content
            })
        }
	}
    async getQlShareKey(){
    	const res = await this.props.getQlShareKey({
		    liveId: this.props.groupInfo.channel.liveId,
		    channelId: this.props.groupInfo.channel.channelId
	    });
    	if(res.state.code === 0 && res.data.lsharekey && res.data.percent){
    		return new Promise((resolve) => {
			    this.setState({
				    coralPercent: res.data.percent
			    },() => {
				    resolve();
			    });
		    });
	    }
    }

    /**
     * 初始化分享
     *
     * @memberOf ChannelGroup
     */
	initShare() {
		// 如果是团长进来,并且拼团未结束则初始化分享信息
	    if (this.data.type === 'sponser' || this.data.type === 'success' ||  this.data.type === 'invited'){
		    const {
			    channel,
			    chargeConfigs,
			    groupDiscount,
			    amount,
			    id,
				groupResult,
			} = this.props.groupInfo;
			
			let url = `${window.location.origin}/topic/channel-group?liveId=${this.props.groupInfo.channel.liveId}&channelId=${this.props.groupInfo.channel.channelId}&groupId=${this.data.groupId}&type=invited&${this.props.shareType === 'live' ? 'l' : ''}shareKey=${this.props.shareKey || this.props.location.query.shareKey || ''}${this.state.coralPercent ? '&officialKey=' + this.props.userInfo.userId : ''}`;

			if (this.props.platformShareRate) {
				let psKey = this.props.location.query.psKey || this.props.userInfo.userId;
				url = url + "&wcl=pshare&psKey=" + psKey;
			}
		    share({
			    title: `邀请你一起听好课【${channel.name}】`,
			    desc: `原价￥${amount}，拼课价￥${groupDiscount}【拼课仅剩${this.props.groupInfo.groupNum - this.props.groupInfo.joinNum}个名额】`,
			    imgUrl: channel.headImage,
			    shareUrl: url,
			    successFn: () => {
				    this.addShareTime();
				    this.setState({
					    showShare: false
					});
					let role = ''
					// 判断分享的人是什么角色
					if (groupResult.isPayGroupLeader === 'Y') {
						role = 'leader'
					} else if (groupResult.isGroupMember === 'Y') {
						role = 'team'
					} else {
						role = 'passer'
					}
				    if(groupResult.result === 'SUCCESS'){
				    	// 付费团长发送分享统计，后端会推送模板消息
					    this.props.countShareCache(id);
					    this.setState({
						    shareSuccessDialogPayActive: true
					    });
				    }else if(this.data.isLeader && this.data.groupType === 'free'){
					    this.setState({
						    shareSuccessDialogFreeActive: true
					    });
					}
					if(window._qla){
						_qla('event', {
							category: `channel-ping-share-role_${role}`,
							action: 'success',
							pos: this.props.userInfo.userId
						});
					}
			    }
		    });
	    }
    }

    async initQr() {
        if (['success', 'endcharge', 'charge'].includes(this.data.type)) {
			const result = await this.props.getChannelQr(this.props.groupInfo.channel.channelId);
			console.log('channelQrCode::', result)
            this.setState({
				channelQrCode: result.data.shareUrl,
				channelQrAppId: result.data.appId
            });
        }
    }

    /**
     * 点击关闭分享弹框
     *
     * @memberOf ChannelGroup
     */
    onConfirmShare() {
        // this.refs.shareDialog.hide();

        this.setState({
            showShare: false
        });
    }

    /**
     * 分享按钮点击事件
     */
    onShareClick() {
        isQlchat()
            ? this.linkToAppShare()
            : this.setState({ showShare: true })
    }

    linkToAppShare = () => {
        const {
            channel,
            chargeConfigs,
            groupDiscount,
            id,
        } = this.props.groupInfo;
        appSdk.share({
            wxqltitle: `邀请你一起听好课【${channel.name}】`,
            descript: `原价￥${chargeConfigs[0].amount}，拼课价￥${groupDiscount}【拼课仅剩${this.props.groupInfo.groupNum - this.props.groupInfo.joinNum}个名额】`,
            shareUrl: `${window.location.origin}/topic/channel-group?liveId=${this.props.groupInfo.channel.liveId}&channelId=${this.props.groupInfo.channel.channelId}&groupId=${this.data.groupId}&type=invited&${this.props.shareType === 'live' ? 'l' : ''}shareKey=${this.props.shareKey || this.props.location.query.shareKey || ''}${this.state.coralPercent ? '&officialKey=' + this.props.userInfo.userId : ''}`,
            wxqlimgurl: channel.headImage
        });

	    this.props.countShareCache(this.data.groupId);
	    this.addShareTime();

	    setTimeout(() => {
            this.props.countShareCache(id);
		    if(groupResult.result === 'SUCCESS'){
			    this.setState({
				    shareSuccessDialogPayActive: true
			    });
		    }else if(this.data.isLeader && this.data.groupType === 'free'){
			    this.setState({
				    shareSuccessDialogFreeActive: true
			    });
		    }
	        // if(this.data.groupType === 'free'){
		     //    this.setState({
			 //        shareSuccessDialogFreeActive: true
		     //    })
	        // }else if(this.data.groupType === 'charge'){
		     //    this.setState({
			 //        shareSuccessDialogPayActive: true
		     //    })
	        // }
        },5000);

    };

    /**
     * 在本页面拼团结束
     */
    onGroupFinished() {
        window.location.href = `/topic/channel-group?groupId=${this.data.groupId}&type=fail&liveId=${this.props.groupInfo.channel.liveId}&channelId=${this.props.groupInfo.channel.channelId}&`;
    }

    /**
     * 进入系列课
     */
    onLinkToChannel(e, groupId) {
        const channelId = this.props.groupInfo.channel.channelId;
        let url = `/live/channel/channelPage/${channelId}.htm`;

        if (this.data.type == 'invited' || this.data.type == 'sponser') {
            if (groupId) {
                url += `?groupId=${groupId}`;
            }
        }

        // 拼团成功时，带上渠道标识用于统计
        if (this.data.type === 'success') {
            url += url.indexOf('?') > -1 ? '&sourceNo=group': '?sourceNo=group';
        }

        locationTo(url);
        // window.location.href = url;
	}
	// 跳转到 课程介绍
	onLinkToChannelIntro () {
		const channelId = this.props.groupInfo.channel.channelId;
		locationTo(`/wechat/page/channel-intro?channelId=${channelId}`)
	}

    onChannelInfoClick = (e,id) => {
        if (isQlchat()) {
            return
        }
        this.onLinkToChannel(e, id)
	}

	/**
	 * 检查是否需要填表
	 */
	async checkUser() {
		if (this.data.type !== 'invited' || this.props.isLiveAdmin !== 'Y') {
			return;
		}

		let config = await this.props.checkUser({ liveId: this.props.groupInfo.channel.liveId, businessType: 'channel', businessId: this.props.groupInfo.channel.channelId});
		if (config) {
			this.setState({
				notFilled: config
			})

			if (sessionStorage.getItem("passCollect") == config.id) {
				if (sessionStorage.getItem("saveCollect") == config.id && this.data.type === 'invited') {
					// 需要判断是否是拼课的内容 自己创建拼课 createGroup 还是 拼进别人的课joinGroup
					
					this.doPayClick();
	
					sessionStorage.removeItem("saveCollect");
				}
				return;
			}
		}
	}

	/**
	 * 判断不是同个团的支付
	 */
	doPayOtherInvatedClick () {
		// groupOtherResult = {} 
		// groupOtherResult = null
		// groupOtherResult = { groupId: '', XXX: 'N' } 
		let { groupOtherResult } = this.props.groupInfo
		// 判断是否非空
		if (!groupOtherResult || groupOtherResult.result == 'FAIL' || !groupOtherResult.groupId) {
			this.doPayClick()
		} else if (groupOtherResult.groupId){
			window.toast('您已经参加其他拼团，拼团期间不能拼其他团')
		}
	}
    /**
     * 支付按钮点击
     */
    doPayClick() {
        const { groupInfo } = this.props;
        const {
            channel,
            chargeConfigs,
		} = groupInfo;
		const {
			notFilled
		} = this.state

		// 如果没填过表且不是跳过填表状态 则需要填表 表单前置
		if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyBefore' && sessionStorage.getItem("passCollect") != notFilled.id) {
			locationTo(`/wechat/page/live-studio/service-form/${channel.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${channel.channelId}&auth=''`);
			return;
		}

        this.props.doPay({
            liveId: channel.liveId,
            chargeConfigId: chargeConfigs[0].id,
            total_fee: chargeConfigs[0].discount,
            type: 'CHANNEL',
            topicId: '0',
            shareKey: this.props.location.query.lshareKey || this.props.location.query.shareKey || '',
	        officialKey: this.tracePage==='coral'? (this.props.location.query.officialKey || this.props.userInfo.userId):'',
	        ch: this.props.location.query.ch || this.props.location.query.wcl || '',
            groupId: this.data.groupId,
			channelNo: 'group',
			psKey:(this.props.platformShareRate && this.props.location.query.psKey) ? this.props.location.query.psKey :'',
			psCh:this.props.platformShareRate ? filterOrderChannel():'',

            callback: async (data) => {
                logPayTrace({
                    id: channel.channelId,
                    type: 'channel',
                    payType: 'CHANNEL_GROUP',
                });

                if(this.data.type === 'invited'){
	                this.props.countSharePayCache(chargeConfigs[0].discount * 100);
                }

				const result = await this.props.getChannelGroupResult(channel.channelId, this.data.groupId);
				
				let jumpUrl = ''
                if (result.data.result == "SUCCESS") {
                    jumpUrl = `/topic/channel-group?liveId=${this.props.groupInfo.channel.liveId}&channelId=${this.props.groupInfo.channel.channelId}&groupId=${this.data.groupId}&type=success`
				} 
				else {
					jumpUrl = `/topic/channel-group?liveId=${this.props.groupInfo.channel.liveId}&channelId=${this.props.groupInfo.channel.channelId}&groupId=${this.data.groupId}&type=full`
				}
				
				// 如果没填过表且不是跳过填表状态 则需要填表 表单后置
				if (notFilled && notFilled.isWrite == 'N' && notFilled.scene == 'buyAfter' && sessionStorage.getItem("passCollect") != notFilled.id) {
					locationTo(`/wechat/page/live-studio/service-form/${channel.liveId}?configId=${notFilled.id}&scene=${notFilled.scene}&type=channel&channelId=${channel.channelId}&auth=''&jumpUrl=${encodeURIComponent(jumpUrl)}`);
				} else {
					locationTo(jumpUrl)
				}
            },
        });
    }

	shareSuccessDialogFreeCloseHandle(){
        this.setState({
	        shareSuccessDialogFreeActive: false
        });
    }

	shareSuccessDialogPayCloseHandle(){
		this.setState({
			shareSuccessDialogPayActive: false
		});
    }

	noticeClickHandle(){
		this.refs.groupNoticeDialog.show();
    }

	groupNoticeDialogClickHandle(){
		this.refs.groupNoticeDialog.hide();
    }

	continueShareBtnClickHandle(){
	    this.onShareClick();
	    this.setState({
		    shareSuccessDialogFreeActive: false
        });
    }

    addShareTime(){
	    const shareTime = this.state.shareTime + 1;
	    localStorage.setItem(`${this.props.groupInfo.channel.channelId}-shareTime`,shareTime);
	    this.setState({
		    shareTime
	    });
    }

    openGroup(){
        if(this.data.groupType === 'charge'){
            this.openPayGroup();
        }else{
            this.refs.openFreeGroupConfirm.show();
        }
    }

	async openFreeGroup(){
        const channelId = this.props.groupInfo.channel.channelId;
		const result = await this.props.channelCreateGroup(channelId);
		if (result.state.code === 0) {
			logGroupTrace({
				id: channelId,
				type: 'channel',
			});
			window.toast('发起拼课成功')
			const result = await this.props.getChannelGroupSelf(channelId);
			const groupId = result.data && result.data.channelGroupPo && result.data.channelGroupPo.id;
			locationTo(`/topic/channel-group?liveId=${this.props.groupInfo.channel.liveId}&channelId=${this.props.groupInfo.channel.channelId}&groupId=${groupId}&type=sponser`);
		}else{
			window.toast(result.state.msg)
		}
		this.refs.openFreeGroupConfirm.hide();
    }

    openPayGroup(){
	    this.props.doPay({
		    liveId: this.props.groupInfo.channel.liveId,
		    chargeConfigId: this.props.groupInfo.chargeConfigs[0].id,
		    total_fee: this.props.groupInfo.chargeConfigs[0].discount,
		    channelNo: this.props.location.query.sourceNo || 'qldefault',
		    type: 'CHANNEL',
		    payType: 'group_leader',
		    topicId: '0',
		    ch: this.props.location.query.ch || this.props.location.query.wcl || '',
		    shareKey: this.props.location.query.lshareKey || this.props.location.query.shareKey || '',
			officialKey: this.tracePage==='coral'? (this.props.location.query.officialKey || this.props.userInfo.userId):'',
			psKey:this.props.platformShareRate ? (this.props.location.query.psKey || this.props.userInfo.userId):'',
			psCh:this.props.platformShareRate ? filterOrderChannel():'',
		    callback: async () => {

			    logPayTrace({
				    id: this.props.groupInfo.channel.channelId,
				    type: 'channel',
				    payType: 'CHANNEL_GROUP_LEADER',
			    });

			    if(this.data.type === 'invited'){
				    this.props.countSharePayCache(this.props.groupInfo.chargeConfigs[0].discount * 100);
			    }

			    let result = await this.props.getOpenPayGroupResult(this.props.groupInfo.channel.channelId);
			    if(result.state.code === 0){
				    locationTo(`/topic/channel-group?liveId=${this.props.groupInfo.channel.liveId}&channelId=${this.props.groupInfo.channel.channelId}&groupId=${result.data.channelGroupPo.id}&type=sponser`);
			    }else{
				    window.toast(result.state.msg)
			    }

		    },
	    });
    }

    async getQlQrCode(){
    	const res = await this.props.getQr({
		    channel: '117',
			liveId: this.props.officialLiveId, //'2000000648729685',//this.props.groupInfo.channel.liveId,
		    channelId: this.props.groupInfo.channel.channelId,
		    showQl: 'N'
	    });
    	if(res.state.code === 0){
    		this.setState({
				qlQRCodeUrl: res.data.qrUrl,
				qlQRCodeAppId: res.data.appId
		    })
	    }
    }

	closeQlQRCodeDialog(){
    	this.setState({
		    showQlQRCodeDialog: false
	    })
	}

    render() {
        const { groupInfo } = this.props;
        const { channel, chargeConfigs, } = groupInfo;

		const distributionInfo = this.props.channelAutoDistributionInfo || {};

		
        return <Page title={`拼团`} className='channel-group-container'>
	        {
				(this.props.isLiveAdmin !== 'Y'||(this.props.isLiveAdmin === 'Y'&&this.props.isQlLive=='Y')) 
				&& this.props.isWhiteLive !=='Y'
				&& !this.props.isFocusThree&&
		        <div className="qlqrcode-guide-bar">关注公众号及时接收拼课信息
			        <div className="follow-btn" onClick={() => this.setState({showQlQRCodeDialog: true})}>立即关注</div>
		        </div>
	        }
            <div className="group-page">
                {
					<header className='head-bar'>
						<img src={require('./images/head.png')} alt="" />
					</header>
	            }


	            <main className='group-main-wrap'>
					<section className='channel-info on-log on-visible' 
						data-log-name="拼课详情页访问"
						data-log-region="ping-visible"
						onClick={(e) => { this.onChannelInfoClick(e, groupInfo.id)}}>
	                    <img src={channel.headImage} />
	                    <div className='inner-info-wrap'>
	                        <div className='channel-name'>
	                            <p className='elli-text'>{channel.name}</p>
	                        </div>
							<div className="channel-tip-box">
								<span>共{channel.topicCount ? channel.topicCount :channel.planCount}节课 </span>
								<span className="channel-tip-left"></span>
								<span>已有{channel.learningNum > 1000 ? '999+': channel.learningNum}次学习</span>
							</div>
	                        <div className='channel-price-wrap'>
								<div>
									<span>拼课价: </span>
									<span className='price'>￥{groupInfo.groupDiscount}</span>
									<del className='del-price'>￥{groupInfo.amount}</del>
								</div>
	                            <div>
	                            	<span className='price-badge'>省￥{(groupInfo.amount - groupInfo.groupDiscount).toFixed(2)}</span>
								</div>
	                        </div>
	                    </div>
	                </section>

	                <section className='group-info'>
	                    {
	                        this.data.type == 'sponser' &&
	                        <Sponser
	                            groupNum={groupInfo.groupNum}
	                            joinNum={groupInfo.joinNum}
	                            peopleNum={groupInfo.groupNum - groupInfo.joinNum}
	                            second={groupInfo.endTime - groupInfo.currentServerTime}
	                            createTime={groupInfo.createTime}
	                            onShareClick={this.onShareClick}
	                            onFinish={this.onGroupFinished}
	                            onToChannelBtnClick={this.onLinkToChannel}
	                            groupDiscount={this.props.groupInfo.groupDiscount}
	                            discountStatus={this.data.discountStatus}
	                            groupType={this.data.groupType}
	                            // 直播间或者系列课课代表分成收益
	                            channelShareProfit={['live','channel'].indexOf(this.props.shareType) !== -1 ? (this.props.shareEarningPercent * groupInfo.groupDiscount / 100).toFixed(2) : '' }
	                            // 自动分销分成收益
	                            autoShareProfit={this.props.isOpenShare === 'Y' && this.props.autoSharePercent ? (this.props.autoSharePercent * groupInfo.groupDiscount / 100).toFixed(2) : ''}
	                            platformShareProfit={this.props.platformShareRate ? (this.props.platformShareRate * groupInfo.groupDiscount / 100).toFixed(2) : ''}
	                            shareTime={this.state.shareTime}
	                            // 珊瑚计划分成收益
	                            coralProfit={this.state.coralPercent ? (this.state.coralPercent * groupInfo.groupDiscount / 100).toFixed(2) : ''}
	                        />
	                    }

	                    {
	                        this.data.type == 'invited' &&
	                        <Invited
	                            groupNum={groupInfo.groupNum}
	                            joinNum={groupInfo.joinNum}
	                            peopleNum={groupInfo.groupNum - groupInfo.joinNum}
	                            second={groupInfo.endTime - groupInfo.currentServerTime}
	                            onFinish={this.onGroupFinished}
	                            doPayClick={this.doPayOtherInvatedClick}
	                            createTime={groupInfo.createTime}
	                            shareTime={this.state.shareTime}
	                        />
						}
						
	                    {
	                        this.data.type == 'counting' &&
	                        <Counting
								onChannelIntroClick={this.onLinkToChannelIntro}
	                        />
	                    }

	                    {
	                        this.data.type == 'success' &&
	                        <InvitedCharged
	                            groupNum={groupInfo.groupNum}
	                            joinNum={groupInfo.joinNum}
	                            peopleNum={groupInfo.groupNum - groupInfo.joinNum}
	                            second={groupInfo.endTime - groupInfo.currentServerTime}
	                            onFinish={this.onGroupFinished}
	                            qrcode={this.state.channelQrCode}
	                            onShareClick={this.onShareClick}
	                            onLinkToChannel={this.onLinkToChannel}
	                        />
	                    }

	                    {
	                        this.data.type == 'full' &&
	                        <FullGroup
	                            groupNum={groupInfo.groupNum}
	                            joinNum={groupInfo.joinNum}
	                            groupDiscount={this.props.groupInfo.groupDiscount}
	                            discountStatus={this.data.discountStatus}
	                            groupType={this.data.groupType}
	                            groupResult={this.props.groupInfo.groupResult.result}
								openGroup={this.openGroup}
								onClick={this.onLinkToChannelIntro}
	                            onToChannelBtnClick={this.onLinkToChannel}
	                        />
	                    }

	                    {
	                        this.data.type == 'end' &&
	                        <EndGroup
	                            groupNum={groupInfo.groupNum}
	                            joinNum={groupInfo.joinNum}
	                            groupDiscount={this.props.groupInfo.groupDiscount}
	                            discountStatus={this.data.discountStatus}
	                            groupType={this.data.groupType}
								openGroup={this.openGroup}
								onChannelIntroClick={this.onLinkToChannelIntro}
	                        />
	                    }

	                    {
	                        this.data.type == 'complete' &&
	                        <SuccessGroup
	                            groupNum={groupInfo.groupNum}
	                            joinNum={groupInfo.joinNum}
								onClick={this.onLinkToChannel}
								liveRole={this.props.liveRole}
								simulationStatus={groupInfo.simulationStatus}
	                        />
	                    }

	                    {
	                        this.data.type == 'fail' &&
	                        <FailGroup
	                            groupNum={groupInfo.groupNum}
	                            joinNum={groupInfo.joinNum}
								onClick={this.onLinkToChannel}
								onChannelIntroClick={this.onLinkToChannelIntro}
								groupType={this.data.groupType}
								liveRole={this.props.liveRole}
	                        />
	                    }

	                    {
	                        this.data.type == 'endcharge' &&
	                        <EndCharged
	                            groupNum={groupInfo.groupNum}
	                            joinNum={groupInfo.joinNum}
								onClick={this.onLinkToChannel}
								onChannelIntroClick={this.onLinkToChannelIntro}
	                            qrcode={this.state.channelQrCode}
	                            groupResult={this.props.groupInfo.groupResult.result}
	                        />
	                    }

	                </section>
	            </main>

	            {
	                this.state.groupPayList.length !== 0 &&
	                <JoinerList
						list={this.state.groupPayList}
						liveRole={this.props.liveRole}
						groupType={this.data.groupType}
	                />
	            }

	            
	            {
	                // <QrCode></QrCode>
	            }

	            {
	                // <Confirm
	                //     ref='shareDialog'
	                //     onBtnClick={this.onConfirmShare}
	                //     buttons='confirm'
	                //     confirmText='知道了'
	                // >
	                //     <div className='share-dialog'>
	                //         <div className='share-content'>
	                //             点击页面右上角
	                //             <img src={require('./images/share-icon-1.png')} />
	                //             选择
	                //             <img src={require('./images/share-icon-2.png')} />
	                //             发送给好友或发送到
	                //             <img src={require('./images/share-icon-3.png')} />
	                //             朋友圈
	                //         </div>
	                //     </div>
	                // </Confirm>
				}
				<Desc pcDescription = {this.state.channelDesc} desc = {groupInfo.desc} purchaseNotes={groupInfo.channel.purchaseNotes}></Desc>
				<Notice type={this.data.discountStatus === 'P' && this.data.isLeader ? 'b' : 'a'} onClick={this.noticeClickHandle}></Notice>

            </div>

            <div className='share-fragment' onClick={this.onConfirmShare} hidden={!this.state.showShare}>
                {/* <div className="guide-girl"></div> */}
				<div className="guide-content flex flex-row flex-vcenter flex-hcenter"><img src={require('./images/logo.png')} alt="" />点击右上角“…”发送</div>
                {/* <div className='share-text'>
                    还差 <span className='group-num'>{groupInfo.groupNum - groupInfo.joinNum}</span> 人，赶快邀请好友来参加吧
                </div>
                <div className="count-down">
                    剩余时间&nbsp;
                    <div className="time-box">
                        <Timer
                            durationtime={groupInfo.endTime - groupInfo.currentServerTime}
                            onFinish={() => {}}
                            className="timer"
                        />
                    </div>

                    &nbsp;结束
                </div>
	            {
		            (this.state.coralPercent || distributionInfo.isOpenShare === 'Y') &&
		            <div className="frame">
			            <div>齐心协力买好课，<br />分享邀请拼课
				            {
								this.props.platformShareRate ?
									<span>赚￥{formatMoney(this.props.platformShareRate * groupInfo.groupDiscount)}</span>
								:
					            ['live','channel'].indexOf(this.props.shareType) !== -1 ?
						            <span>赚￥{formatMoney(this.props.shareEarningPercent * groupInfo.groupDiscount)}</span>
						            :
						            (
							            this.state.coralPercent ?
								            <span>赚￥{formatMoney(this.state.coralPercent * groupInfo.groupDiscount)}</span>
								            :
								            this.props.isOpenShare === 'Y' &&
								            <span>赚￥{formatMoney(this.props.shareEarningPercent * groupInfo.groupDiscount)}</span>
						            )
				            }
			            </div>
		            </div>
	            }
	            <div className="light"></div>
	            {
		            (this.props.isLiveAdmin !== 'Y'||(this.props.isLiveAdmin === 'Y'&&this.props.isQlLive=='Y')) 
					&& this.props.isWhiteLive !=='Y'
					&& !this.props.isFocusThree&&
		            <button className="follow-ql-btn" onClick={() => this.setState({showShare: false, showQlQRCodeDialog: true})}>关注公众号，及时接收拼课信息 ></button>
	            } */}
            </div>

            <MiddleDialog
                show={this.state.shareSuccessDialogFreeActive}
                close={true}
                className="share-success-dialog"
                bghide={true}
                onClose={this.shareSuccessDialogFreeCloseHandle}
            >
                <div className="content">
                    <div className="gou icon_choosethis"></div>
                    <div className="title">分享成功</div>
                    <div className="tip">分享 <span>3</span> 次以上，拼课成功率高达95%哦</div>
                    <div className="continue-btn" onClick={this.continueShareBtnClickHandle}>继续分享</div>
                </div>
                <div className="sub-content">
                    <div className="ring-icon"></div>
                    <div className="title">好课提醒</div>
                    <div className="tip">90%的人都在这里发现了喜欢的课程</div>
                    <div className="to-live-btn" onClick={() => locationTo(`/wechat/page/live/${channel.liveId}`)}>前往直播间</div>
                </div>
            </MiddleDialog>

            <MiddleDialog
                show={this.state.shareSuccessDialogPayActive}
                close={true}
                className="share-success-dialog"
                bghide={true}
                onClose={this.shareSuccessDialogPayCloseHandle}
            >
                <div className="content">
                    <div className="gou icon_choosethis"></div>
                    <div className="title">分享成功</div>
                    <div className="tip">恭喜你，已获得听课资格</div>
                    <div className="qrcode">
                        <div className="code-wrap">
                            <QRImg 
                                src={this.state.channelQrCode}
                                traceData="share-success-dialog"
                                channel="206"
                                appId={this.state.channelQrAppId}
                                />
                        </div>
                        长按识别二维码，进入听课
                    </div>
                    <div className="to-channel-btn" onClick={() => locationTo(`/live/channel/channelPage/${channel.channelId}.htm`)}>进入听课</div>
                </div>
            </MiddleDialog>

            <Confirm
                className="group-notice-dialog"
                ref='groupNoticeDialog'
                title={this.data.discountStatus === 'P' && this.data.isLeader ? '如何参加拼课' : '拼课须知'}
                titleTheme='white'
                buttonTheme='line'
                confirmText= '知道了'
                theme='primary'                                // 主题
                bghide={ true }                                // 是否点击背景关闭
                buttons='confirm'                       // 按钮配置
                onBtnClick={ this.groupNoticeDialogClickHandle }
            >
                <div className="content">
	                {
		                this.data.discountStatus === 'P' && this.data.isLeader ?
			                <span>开免费拼课团需在规定时间内，邀请指定人数好友进行拼课，达到拼课人数后，即可进入听课，未达到拼课人数，免费拼课团长将不可听课</span>
			                :
			                <span>开拼课团或参加购买拼课<br/>分享给好友，即可进入听课</span>
	                }
                </div>
            </Confirm>

            <Confirm
                ref='openFreeGroupConfirm'
                buttons='confirm'
                confirmText="立即发起拼课"
                onBtnClick={this.openFreeGroup}
            >

                <main className='dialog-main pin-dialog'>
                    <div className="confirm-top pin-top">
                        邀请<span> {this.props.groupInfo.groupNum - 1}</span> 人拼课
                    </div>
                    <div className="confirm-content pin-content">
                        你将获得价值 <span>￥{this.props.groupInfo.amount}</span> 的免费听课机会
                    </div>
                </main>
            </Confirm>

	        <MiddleDialog
		        show={this.state.showQlQRCodeDialog}
		        className="qlqrcode-dialog"
		        bghide={true}
	            onClose={this.closeQlQRCodeDialog}
	        >
		        <div className="content">
			        <div className="bell"></div>
			        <div className="tip">为了及时接收拼课信息
				        请先关注公众号</div>
			        <div className="qrcode" >
				        <img  className={`on-visible`}
							data-log-name="拼课页面引导吸粉"
							data-log-region="visible-group-focus"
							data-log-pos="117" src={this.state.qlQRCodeUrl} alt="" data-log-index={this.state.qlQRCodeAppId} />
			        </div>
			        <div className="tip2">长按识别二维码并关注</div>
		        </div>
	        </MiddleDialog>

        </Page>
    }
}


function mapStateToProps(state) {
    return {
        userInfo: state.common.userInfo,
        groupInfo: state.channelGroup.groupInfo,
        groupPayList: state.channelGroup.groupPayList,
	    channelAutoDistributionInfo: state.channelDistribution.channelAutoDistributionInfo,
	    isOpenShare: state.channelDistribution.channelAutoDistributionInfo.isOpenShare,
	    autoSharePercent: state.channelDistribution.channelAutoDistributionInfo.autoSharePercent,
	    shareType: state.channelDistribution.shareSysInfo.shareType,
        shareKey: state.channelDistribution.shareSysInfo.shareKey,
	    shareEarningPercent: state.channelDistribution.shareSysInfo.shareEarningPercent,

	    isLiveAdmin: state.common.isLiveAdmin,
	    isSubscribe: state.channel.isSubscribe,
	    isFocusThree: state.channel.isFocusThree,
	    isBindThird: state.channel.isBindThird,
		isShowQl: state.channel.isShowQl,
		isQlLive: state.common.isQlLive,
		isWhiteLive: state.common.isWhiteLive,
		officialLiveId: state.common.officialLiveId,
		liveRole: state.channel.liveRole,
		platformShareRate: state.common.platformShareRate,
    }
}

const mapActionToProps = {
    fetchInitData,
    initChannelGroup,
    setGroupPayList,
    doPay,
    getChannelGroupResult,
    getChannelQr,
	countShareCache,
	countVisitCache,
	channelCreateGroup,
	getOpenPayGroupResult,
	getChannelGroupSelf,
	countSharePayCache,
	bindLiveShare,
	getQr,
	bindOfficialKey,
	getMyCoralIdentity,
	getQlShareKey,
	getEditorSummary,
	getShareRate,
	checkUser,
	
};

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelGroup);
