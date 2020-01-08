import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { get } from 'lodash';
import { request, checkShareStatus } from 'common_actions/common';
import BackTuitionDialog from 'components/back-tuition-dialog';
import { locationTo, formatMoney } from 'components/util';
import CollectVisible from 'components/collect-visible';

@autobind
class PaySuccess extends Component {
    constructor(props){
        super(props)
        this.state = {
            courseName: '',
            barrageInfoList: [],
            inviteTotal: 0,
            returnMoney: 0,
            payamount: 0,
            day: '00',
            hour: '00',
            minute: '00',
            expireTime: 0,
            progress: {},
            marqueeTop: 0,
            canInvite: false, //是否开启了请好友免费听
            businessId: '',
            businessType: '',
            backgroundUrl: '',
            showBanner: false,
            missionId: ''
        }
    }

    data = {
        time: 0,
    }

    componentDidMount(){
        this.fetchPayBackInfo()
    }

    // 检查请好友免费听状态
    async checkShareStatus(type, businessId){
        if(type !== 'channel'){
            return
        }
        await checkShareStatus({channelId: businessId}).then(res => {
            if (res.state.code) throw Error(res.state.msg);
            this.setState({
                canInvite: res.data && res.data.isOpenInviteFree === 'Y' && res.data.remaining > 0
            })
        }).catch(err => {
            return false;
        })
    }

    // 获取支付订单数据
    async fetchPayBackInfo(){
        await request({
            url: '/api/wechat/transfer/h5/invite/return/paybackInfo',
            body: {
                orderId: this.props.location.query.orderId
            }
        }).then(async(res) => {
            if (res.state.code) throw Error(res.state.msg);
            if(res.data){
                let data = res.data
                this.setState({
                    returnMoney: data.inviteReturnInfo.returnMoney, 
                    missionId: data.inviteReturnInfo.missionId || '', 
                    inviteTotal: data.inviteReturnInfo.inviteTotal || 0,
                    courseName: data.courseName,
                    payamount: data.inviteReturnInfo.payAmount,
                    expireTime: data.inviteReturnInfo.expireTime,
                    businessId: data.businessId || '',
                    businessType: data.businessType || '',
                    backgroundUrl: data.courseHeadImage || '',
                    barrageInfoList: data.barrageInfoList || []
                })
                this.checkShareStatus(data.businessType, data.businessId)
                this.initExpireTime(data.inviteReturnInfo.expireTime || 0)
                const coupon = await this.getCouponForInviteReturn(data.businessId, data.businessType)
                this.backTuitionDialogEle.initShare({
                    data: {backgroundUrl: data.courseHeadImage, name: data.courseName, id: data.businessId, channelId: data.businessId}, 
                    missionId: data.inviteReturnInfo.missionId || '',
                    type: this.state.businessType,
                    fromPaySuccess: true,
                    coupon
                })

                this.setState({
                    couponMoney: formatMoney(get(coupon, 'money', 0))
                })
            }
        }).catch(err => {
            console.error(err)
            window.toast(err);
        })
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
                show: true,
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

    // 跳转到介绍页
    jumpToIntroPage = () => {
        locationTo(`/wechat/page/${this.state.businessType}-intro?${this.state.businessType}Id=${this.state.businessId}&missionId=${this.state.missionId}`)
    }

     // 跳转到系列课介绍页
     jumpToChannelIntroPage = () => {
        locationTo(`/wechat/page/channel-intro?channelId=${this.state.businessId}&missionId=${this.state.missionId}`)
    }

    // 跳转到邀请卡页面
    jumpToShareCardPage = () => {
        locationTo(`/wechat/page/sharecard?type=${this.state.businessType}&${this.state.businessType}Id=${this.state.businessId}&missionId=${this.state.missionId}`)
    }

    // 打开返学费弹窗
    openBackTuitionDialog(){
        this.backTuitionDialogEle.show({
            inviteTotal: this.state.inviteTotal,
            returnMoney: this.state.returnMoney,
            expireTime: this.state.expireTime,
            missionId: this.state.missionId,
            needFetchInviteList: false,
            data: {backgroundUrl: this.state.backgroundUrl, name: this.state.courseName, id: this.state.businessId, channelId: this.state.businessId},
            type: this.state.businessType
        })
    }

    // 底部按钮显示在页面上
    showInPage = () => {
        let ele = document.querySelector('.button-component')
        let eleHeight = ele.offsetHeight // 高度
        let eleTop = ele.offsetTop // 顶部距离定位父元素顶部的高度
        let containerScrollTop = document.querySelector('.pay-success-page').scrollTop // 父元素容器滚动条高度
        let containerHeight = document.querySelector('.pay-success-page').offsetHeight // 父元素容器高度
        // 下边缘先出现 && 上边缘先出现 
        if(containerScrollTop < eleHeight + eleTop && eleTop < containerHeight + containerScrollTop){
            this.setState({showBottomBtn: false})
        }else{
            this.setState({showBottomBtn: true})
        }
    }

    // 获取拉人返现用于分享的券
	getCouponForInviteReturn = async(businessId, businessType) => {
        return new Promise(async(resolve)=>{
            await request({
                url: '/api/wechat/transfer/h5/coupon/getCouponForInviteReturn',
                body: { businessId, businessType }
            }).then(res=>{
                if(res.state.code) throw Error(res.state.msg)
                let data = get(res, 'data.codePo', {})
                resolve(data)
            }).catch(err=>{
                console.error(err)
                resolve({})
            })
        })
	}

	render(){
		return (
            <React.Fragment>
                <Page title={'支付成功'} className={`pay-success-page`} onScroll = {this.showInPage}>
                    <div className={`pay-success-content`}>
                        <div className="success">
                            <img src={require('./img/icon-success.png')}/>
                            报名成功
                        </div>
                        <section className="detail">
                            <div className="item">
                                <span className="label">支付金额</span>
                                <div className="content">{this.state.payamount}元</div>
                            </div>
                            <div className="item on-log" data-log-region="purchase-loadinpage" data-log-pos="details" onClick={this.jumpToIntroPage}>
                                <span className="label">已购课程</span>
                                <div className="content">{this.state.courseName}</div>
                                <span className="enter icon_enter"></span>
                            </div>
                        </section>
                    </div>
                    <div className="back-tuition-content">
                        <div className="title"><em>邀{this.state.inviteTotal}人</em>报名课程<br/>立返学费<em>{this.state.returnMoney || 0}元</em></div>
                        <div className="count-down-component">
                            <span className="label">有效期：</span>
                            <span className="time">{this.state.day}</span>
                            <span className="label">天：</span>
                            <span className="time">{this.state.hour}</span>
                            <span className="label">时：</span>
                            <span className="time">{this.state.minute}</span>
                            <span className="label">分</span>
                        </div>
                        <div className="button-component">
                            <div className="just-invite on-log" data-log-region="purchase-loadinpage" data-log-pos="share-learn" onClick={this.openBackTuitionDialog}>立即邀请</div>
                        </div>
                        {this.state.couponMoney ? <div className="share-tip">好友从你发送的链接报名，可以<em>省{this.state.couponMoney}元</em></div> : null}
                        <div className={`slide`}>
                            <span className="icon-slide"></span>滑动了解更多
                        </div>
                        <div className="question-content">
                            <div className="question q1">
                                <div className="line"></div>
                                <div className="title"><span className="list"></span>为什么可以返学费</div>
                                <div className="answer-content">
                                    <div className="step step1">
                                        <img src={require('./img/p1.png')} alt=""/>
                                        <p>每一位内容创作者都希望知识和经验能<em>被大家传播</em>，让更多人能获益学习从而成长。</p>
                                    </div>
                                    <div className="step step2">
                                        <p>因此，老师设置了返学费的奖励。只要你<em>邀请{this.state.inviteTotal}位朋友加入学习，就把{this.state.returnMoney || 0}元返还给你。</em></p>
                                        <img src={require('./img/p2.png')} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="question q2">
                                <div className="line"></div>
                                <div className="title"><span className="list"></span>学费如何退换给我</div>
                                <div className="answer-content">
                                    <div className="text">直接转入你的<em>微信钱包</em>，免去提现麻烦</div>
                                </div>
                            </div>
                            <div className="question q3">
                                <div className="line"></div>
                                <div className="title"><span className="list"></span>邀请小技巧</div>
                                <div className="answer-content">
                                {
                                    this.state.canInvite && 
                                    <CollectVisible>
                                        <div className="item on-log on-visible" data-log-region="skill" data-log-pos="1" onClick={this.jumpToChannelIntroPage}>
                                            <img src={require('./img/icon-invite.png')} alt=""/>
                                            <div className="content">
                                                <div className="item-title">请好友免费听</div>
                                                <div className="item-tip">你已购买课程，请朋友试听后再报名</div>
                                            </div>
                                            <span className="icon"></span>
                                        </div>
                                    </CollectVisible>
                                }
                                <div className="item on-log" data-log-region="skill" data-log-pos="2" onClick={this.openBackTuitionDialog}>
                                    <img src={require('./img/icon-link.png')} alt=""/>
                                    <div className="content">
                                        <div className="item-title">发送<em>课程链接</em>到五个以上亲友群</div>
                                        <div className="item-tip">群越多，成功率越高</div>
                                    </div>
                                    <span className="icon"></span>
                                </div>
                                <div className="item on-log" data-log-region="skill" data-log-pos="3" onClick={this.jumpToShareCardPage}>
                                    <img src={require('./img/icon-share.png')} alt=""/>
                                    <div className="content">
                                        <div className="item-title">发送<em>邀请卡</em>到朋友圈</div>
                                        <div className="item-tip">写下你报名课程的原因，打动朋友</div>
                                    </div>
                                    <span className="icon"></span>
                                </div>
                                </div>
                            </div>
                            {
                                this.state.barrageInfoList.length > 0 ?
                                <div className="question q4">
                                    <div className="line"></div>
                                    <div className="title"><span className="list"></span>推荐之星</div>
                                    <div className="answer-content">
                                        <div className="q4-tip">已有83.5%的小伙伴获得学费返现</div>
                                        <div className="return">
                                        {
                                            this.state.barrageInfoList.map((i,d) => {
                                                if(d < 10){
                                                    return (
                                                        <div className="return-list" key={d}>
                                                            <img src={i.headImage} alt=""/>
                                                            <div className="group">
                                                                <p className="user-name">{i.userName}</p>
                                                                <span>刚刚返还了学费</span>
                                                            </div>
                                                            <div className="return-money">+￥{i.returnMoney}</div>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                        <div className="show-tip"><span></span>仅展示最新10条<span></span></div>
                                        </div>
                                    </div>
                                </div> : null
                            }
                        </div>
                    </div>
                </Page>
                {
                    this.state.showBottomBtn ?
                    <div className="pay-success-bottom">
                        <div className="just-invite on-log" data-log-region="purchase-loadinpage" data-log-pos="share-learn" onClick={this.openBackTuitionDialog}>立即邀请</div>
                    </div> : null
                }
                {/* 拉人返学费弹窗 */}
                <BackTuitionDialog 
                    ref = {el => this.backTuitionDialogEle = el}
                />
            </React.Fragment>
		)
	}
}

const mapStateToProps = function(state) {
	return {
		userInfo: state.common.userInfo,
		userId: state.common.userInfo.userId
	}
};

const mapActionToProps = {
    
};

module.exports = connect(mapStateToProps, mapActionToProps)(PaySuccess);