import React, {Component} from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { autobind } from 'core-decorators'
import { locationTo, formatMoney } from 'components/util';
import Detect from 'components/detect';
import {
    doPay,
} from 'common_actions/common';
import { getChannelInfo } from '../../actions/channel';
import { getTopicInfo } from '../../actions/topic';


function mapStateToProps (state) {
    console.log(state);
    return {
        topicInfo: state.topic.topicInfo||{},
        channelCharge: state.channel.channelCharge||{},
    }
}

const mapActionToProps = {
    doPay,
    getChannelInfo,
    getTopicInfo,
}
@autobind
class RedEnvelope extends Component {
    
    state = {
        // 备注字数
        wordNum: 0,
        // 备注
        remark: '',
        // 红包金额
        money: '',
        // 红包个数
        count: '',
        // 是否展示红包提示
        showRedEnvelopeTipDialog: false,
        // 是否隐藏底部提示
        hideTip: false,
        channelId: this.props.location.query.channelId||'',
        campId: this.props.location.query.campId||'',
    }

    data = {
        // （金额检测）首位大于0，最多两位小数的数字
        moneyTest: /^[1-9][0-9]*(.[0-9]{0,2})?$/,
        // （红包个数检测）大于0的整数
        countTest: /^[1-9][0-9]*$/,
    }

    /** 初始化课成信息 */
    async initCourseInfo() {
        if (!this.state.channelId) {
            await this.props.getTopicInfo(this.props.location.query.topicId);
            this.setState({
                topicInfo: this.props.topicInfo,
            });
            console.log(this.props.topicInfo)
        }else{
            try {
                await this.props.getChannelInfo(this.state.channelId);
                console.log(this.props.channelCharge)
                this.setState({
                    channelCharge: this.props.channelCharge,
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    componentDidMount(){
        this.initCourseInfo();
        
        // 安卓软键盘弹起的时候隐藏底部提示（安卓手机在软键盘弹起的时候会将页面文档高度挤压）
        if (Detect.os.android) {
            // 初始页面文档高度
            this.originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
            window.onresize = ()=>{
                // resize之后的页面文档高度
                let resizeHeight = document.documentElement.clientHeight|| document.body.clientHeight;
                if(resizeHeight < this.originalHeight){
                    this.setState({hideTip: true})
                }else {
                    this.setState({hideTip: false})
                }
            }
        }
    }

    // 金额输入
    moneyInput(e){
        let value = e.target.value.trim()
        if(!value){
            this.setState({
                money: value
            })
        }else {
            console.log(value,this.data.moneyTest.test(value))
            if(this.data.moneyTest.test(value)){
                if(Number(value) > 10000){
                    window.toast('红包总金额上限为10000元')
                    return
                }
                this.setState({
                    money: value
                })
            }
        }
    }

    // 红包个数输入
    countInput(e){
        // 红包金额未输入时不允许输入红包个数
        if(!this.state.money){
            window.toast('请先输入红包金额')
            this.moneyInputEle.focus()
            return
        }
        let value = e.target.value.trim()
        // 允许为空
        if(!value){
            this.setState({
                count: value
            })
        }else if (value && this.data.countTest.test(value)){
            let max = Math.min(Math.floor(Number(this.state.money) * 9.94), 100)
            if(Number(value) > max){
                window.toast(`红包个数不得大于${max}个！`)
                return
            }
            this.setState({
                count: value
            })
        }
    }

    // 备注输入
    remarkInput(e){
        let value = e.target.value.trim()
        if(value.length > 15){
            value = value.slice(0,15)
        }
        this.setState({
            remark: value,
            wordNum: value.length
        })
    }

    // 支付
    async doPay(){
        const {
            money,count,remark
        } = this.state
        if(!money){
            window.toast('请输入红包金额')
            return
        }
        if(!count){
            window.toast('请输入红包个数')
            return
        }
        if (/^(89|8\.9|0\.89|64|6\.4|0\.64|89\.64|64\.89|1989\.64|8964)$/.test(Number(money))) {
            // 永久防止敏感信息
            window.toast('金额错误，请输入其他金额')
            return false;
        }
        try {
            await this.props.doPay({
                liveId: this.props.location.query.liveId,
                topicId: this.props.location.query.topicId,
                type: 'RED_ENVELOPE',
                total_fee: Number(money),
                totalCount: Number(count),
                description: remark || '邀请好友一起来学习~',
                callback: async (orderId) => {
                    window.toast('支付成功', 2000);
                    // 支付成功日志
                    if (typeof _qla != 'undefined') {
                        _qla('event', {
                            category: 'hb-succeed',
                            action:'success',
                            trace_page: window.sessionStorage && window.sessionStorage.getItem('trace_page') || '',
                        });
                    }
                    setTimeout(_=>{
                        locationTo(document.referrer)
                    },2000)
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    focusFn(){
        this.setState({hideTip: true})
    }
    blurFn(){
        this.setState({hideTip: false})
    }

    render() {
        const { wordNum, remark, money, showRedEnvelopeTipDialog, count, hideTip } = this.state
        return (
            <Page title="发红包" className="red-envelope-page">
                <div className="red-envelope-tip">发红包，提升课堂人气！<div className="btn-rule" onClick={()=>{this.setState({showRedEnvelopeTipDialog: true})}}>红包发放规则>></div></div>
                <div className="red-envelope-input-container money">
                    <div className="input-container">
                        <span>总金额</span>
                        <input type="number" value={money} onChange={this.moneyInput} placeholder="1-10000" ref={el => this.moneyInputEle = el}/>
                        <span>元</span>
                    </div>
                    <div className="tip">微信收取6‰的手续费，实际红包金额为<span>￥{(Math.floor(Number(money) * 99.4) / 100).toFixed(2)}</span></div>
                </div>
                <div className="red-envelope-input-container count">
                    <div className="input-container">
                        <span>红包个数</span>
                        <input type="number" placeholder="填写个数" value={count} onChange={this.countInput} />
                        <span>个</span>
                    </div>
                    <div className="tip">{this.props.location.query.authNum || 0}人报名了课程</div>
                </div>
                <div className="red-envelope-textarea-container">
                    <textarea className="textarea" value={remark} onChange={this.remarkInput} placeholder={`邀请好友一起来学习~`}/>
                    <span className="word-num">{wordNum}/15</span>
                </div>
                <div className="money-container">
                    <div className="money">{Number(money).toFixed(2)}</div>
                    <div className="pay on-log" data-log-region="hb-build" data-log-pos="hb-success" onClick={this.doPay}>塞钱进红包</div>
                    <div className="return-class on-log" data-log-region="hb-build" data-log-pos="return-course" onClick={()=>{locationTo(document.referrer)}}>返回课堂</div>
                </div>
                <div className={`return-tip${hideTip ? ' hide' : ''}`}>未领取的红包，7天后自动退回至你的钱包</div>
                {
                    showRedEnvelopeTipDialog ? 
                    <div className="red-envelope-tip-dialog-container">
                        <div className="bg" onClick={()=>{this.setState({showRedEnvelopeTipDialog: false})}}></div>
                        <div className="red-envelope-tip-dialog">
                            <div className="top">红包发放规则</div>
                            <div className="tip-content">
                                <p>1. 您发送红包后，聊妹会引导学员推广课程，增加新订单； </p>
                                <p>2. 您可以在课程简介中，提前预告发红包，提高听课率。</p>
                                <p>3. 红包会分多次发送给用户 
                                    <ul>
                                        <li>（1）用户拆开红包领1/4； </li>
                                        <li>（2）关注您的直播间领1/4； </li>
                                        <li>（3）成功邀请3人领1/2。</li>
                                        
                                    </ul>
                                    若24小时内未完成任务，剩余红包会在7天后退还到您的钱包。 
                                </p>
                                <p>4. 新用户访问课程时，系统会向TA发放当前课程的优惠券，提高成交率。若您未设置优惠券或未打开【显示优惠码通道】，则不发送。</p>
                                {((!this.state.channelId&&this.state.topicInfo.type=="charge")||(this.state.channelId&&this.state.channelCharge[0]&&this.state.channelCharge[0].amount>0))&&!this.state.campId&&<img src="https://img.qlchat.com/qlLive/repack/setCouponModule.jpg"/>}
                            </div>
                            <div className="bottom-bar">
                                {((!this.state.channelId&&this.state.topicInfo.type=="charge")||(this.state.channelId&&this.state.channelCharge[0]&&this.state.channelCharge[0].amount>0))&&!this.state.campId&&this.state.topicInfo.isRelay !== 'Y'&&<div className="btn-set" onClick={()=>{locationTo(`/wechat/page/coupon-code/list/${this.state.channelId?'channel':'topic'}/${this.state.channelId||this.props.location.query.topicId}`)}}>设置优惠券</div>}
                                <div className="btn-ok" onClick={()=>{this.setState({showRedEnvelopeTipDialog: false})}}>知道了</div>
                            </div>
                            
                        </div>
                    </div> : null
                }
            </Page>
        );
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(RedEnvelope);
