import React, { Component } from 'react';
import { request } from 'common_actions/common';
import { get } from 'lodash';
import { share } from 'components/wx-utils';
import { formatMoney } from 'components/util';
import { autobind } from 'core-decorators';
@autobind
class BackTuitionDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            returnMoney: 0,
            inviteTotal: 0,
            day: '00',
            hour: '00',
            minute: '00',
            show: false,
            inviteList: [],
            userInfo: {}
        }
    }

    componentDidMount(){
        
    }

    // 开启倒计时（先执行countDown一次的原因是防止有一秒时间显示00：00：00）
    initExpireTime = (endTime) => {
        this.countDown(endTime)
        let countDownInterval = setInterval(_=>{
            this.countDown(endTime, countDownInterval)
        }, 1000)
    }

    countDown = (endTime, countDownInterval) => {
        let timeInterval = (Number(endTime) - Date.now()) / 1000
        if(timeInterval > 0){
            let day = Math.floor(timeInterval / 3600 / 24)
            let hour = Math.floor(timeInterval % ( 3600 * 24 ) / 3600)
            let minute = Math.floor(timeInterval % 3600 / 60)
            this.setState({
                day: this.updateCountDown(day),
                hour: this.updateCountDown(hour),
                minute: this.updateCountDown(minute),
            })
        }else {
            this.setState({
                day: '00',
                hour: '00',
                minute: '00'
            })
            countDownInterval && clearInterval(countDownInterval)
        }
    }

    /**
     * 显示弹窗
     * 
     * @memberof BackTuitionDialog
     */
    async show({
        inviteTotal = 0, // 需要邀请的总人数
        returnMoney = 0, // 返现总金额
        expireTime = 0, // 过期时间
        needFetchInviteList = true, // 是否需要请求邀请列表接口（支付完成列表页面跳转过来的不需要，因为还没分享过）
        data = {}, // 课程信息
        type = '', // 课程类型
    }){
        this.initExpireTime(expireTime)
        // 请求邀请列表
        let inviteList = await this.fetchInviteList(needFetchInviteList, type, data)
        this.setState({
            show: true,
            returnMoney,
            inviteTotal,
            inviteList
        })
    }

    // 请求邀请列表
    async fetchInviteList(needFetchInviteList, type, data){
        return new Promise(async(resolve)=>{
            if(needFetchInviteList){
                if(!this.initInviteList){
                    await request({
                        url: '/api/wechat/transfer/h5/invite/return/inviteList',
                        body: { businessId: type == 'channel' ? data.channelId : data.id, businessType: type }
                    }).then(res => {
                        if (res.state.code) throw Error(res.state.msg);
                        this.initInviteList = true
                        let inviteList = []
                        if(res.data && res.data.inviteList){
                            inviteList = res.data.inviteList || []
                            this.setState({initInviteList})
                        }
                        resolve(inviteList)
                    }).catch(err => {
                        resolve([])
                        return false;
                    })
                }else {
                    resolve(this.state.inviteList)
                }
            }else {
                resolve([])
            }
        })
    }

    // 获取用户名
    getUserInfo = async() => {
        let userInfo = {};
        if(!this.initUserInfo){
            const userInfoResult  = await request({
                url: '/api/wechat/user/info',
            });
            if(userInfoResult.state.code === 0){
                this.initUserInfo = true
                userInfo = userInfoResult.data.user
                this.setState({userInfo})
            }
        }else {
            userInfo = this.state.userInfo
        }
        return userInfo
    }

    // 获取拉人返现用于分享的券
	getCouponForInviteReturn = async(businessId, businessType) => {
		return new Promise(async(resolve) => {
			await request({
				url: '/api/wechat/transfer/h5/coupon/getCouponForInviteReturn',
				body: { businessId, businessType }
			}).then(res=>{
				if(res.state.code) throw Error(res.state.msg)
				resolve(get(res, 'data.codePo', {}))
			}).catch(err=>{
				console.error(err)
				resolve({})
			})
		})
	}

    initShare = async({
        data = {}, 
        missionId, 
        fromPaySuccess = false, // 是否从支付落地页过来
        type,
        coupon = {}, // 获取拉人返现用于分享的券
    }) => {
        let userInfo = await this.getUserInfo()
        let shareUrl = window.location.href + '&missionId=' + missionId
        // 支付成功页面的分享链接为介绍页的分享链接
        if(fromPaySuccess){
            shareUrl = `${window.location.protocol}//${window.location.host}/wechat/page/${type}-intro?${type}Id=${type == 'channel' ? data.channelId : data.id}&missionId=${missionId}`
        }
        // 优惠券id，优惠券类型，优惠券金额
        let inviteReturnCouponId = get(coupon, 'id', ''), couponType = get(coupon, 'couponType', ''), money = get(coupon, 'money', 0)
        // 不是从支付落地页过来的需要获取拉人返现用于分享的券（已经在页面上已经获取，直接传进来即可）
        if(!fromPaySuccess){
            let res = await this.getCouponForInviteReturn(data.channelId || data.id, type)
            inviteReturnCouponId = get(res, 'id', '')
            couponType = get(res, 'couponType', '')
            money = get(res, 'money', 0)
        }
        shareUrl  = `${shareUrl}${inviteReturnCouponId ? '&inviteReturnCouponId=' + inviteReturnCouponId : ''}${couponType ? '&couponType=' + couponType : ''}`
        let title = money ? `这个课真不错，点击我发送的链接可以便宜${formatMoney(money)}元` : `${userInfo.name}等你一起听`
        let desc = money ? `${userInfo.name}正在学《${data.name || data.topic}》` : `我正在学，也推荐给你《${data.name || data.topic}》`
        share({
            title,
            desc,
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/back-tuition-share.png',
            shareUrl,
	        successFn: () => {
                if(window._qla){
	                _qla('event', {
		                category: 'returnFeeShare',
		                action: 'success',
	                });
                }
            }
        });
    }

    updateCountDown = (time) => {
        if(time > 0){
            if(time < 10) {
                return '0' + time
            }
            return time
        }else {
            return '00'
        }
    }

    hide = () => {
        this.setState({show: false})
    }

    render(){
        let { show, inviteList, inviteTotal, returnMoney } = this.state
        if(!show){
            return ''
        }
        return (
            <div className="back-tuition-dialog">
                <div className="bg" onClick={this.hide}></div>
                <div className="back-tuition-share-tip"></div>
                <div className="back-tuition-dialog-content">
                    <img src={require('./img/back-tuition-bg.png')} alt=""/>
                    <div className="invite-count">邀请{inviteTotal}人报名，返学费￥{returnMoney}</div>
                    <div className="count-down-item">
                        <span className="time">{this.state.day}</span>
                        <span className="unit">天:</span>
                        <span className="time">{this.state.hour}</span>
                        <span className="unit">时:</span>
                        <span className="time">{this.state.minute}</span>
                        <span className="unit">分</span>
                    </div>
                    <div className="come-on">你邀请了{inviteList.length}人，还差{inviteTotal - inviteList.length}人，加油！</div>
                    <div className="invite-item">
                        {
                            inviteList.length > 0 && inviteList.map(i => (
                                <img src={i} key = {i} alt=""/>
                            ))
                        }
                        <div className="invite"><span className="icon_plus"></span></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default BackTuitionDialog