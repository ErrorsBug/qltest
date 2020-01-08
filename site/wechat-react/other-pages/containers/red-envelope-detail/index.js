import React, {Component} from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { autobind } from 'core-decorators'
import { locationTo, formatMoney } from 'components/util';
import { getReceiveDetailList, getUserInfo } from '../../actions/red-envelope';
import { createPortal } from 'react-dom';
import Empty from './empty-page'
import { getChannelInfo } from '../../actions/channel';
import { getTopicInfo } from '../../actions/topic';


function mapStateToProps (state) {
    return {
        topicInfo: state.topic.topicInfo||{},
        channelCharge: state.channel.channelCharge||{},
    }
}

const mapActionToProps = {
    getChannelInfo,
    getTopicInfo,
}
@autobind
class RedEnvelopeDetail extends Component {
    
    state = {
        // 红包总数
        totalCount: 0,
        // 已领取数量
        acceptCount: 0,
        // 红包金额
        amount: 0,
        // 红包已领取金额
        acceptAmount: 0,
        // 领取列表
        list: null,
        // 用户头像
        headImage: '',
        // 是否展示红包提示
        showRedEnvelopeTipDialog: false,
        url: this.props.location.query.url,

        channelId: this.props.location.query.channelId||'',
        campId: this.props.location.query.campId||'',
    }

    async componentDidMount(){
        this.getUserInfo()
        this.getReceiveDetailList()
        this.initCourseInfo();
    }

    // 获取用户信息
    async getUserInfo(){
        const result = await getUserInfo()
        if(result.state.code === 0){
            this.setState({
                headImage: result.data.user.headImgUrl
            })
        }
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

     // 获取已领取的红包列表
    async getReceiveDetailList(){
        const result = await getReceiveDetailList({
            redEnvelopeId: this.props.location.query.redEnvelopeId,
            pageNum: 1,
            pageSize: 100,
        })
        if(result.state.code === 0){
            this.setState({
                totalCount: result.data.totalCount,
                acceptCount: result.data.acceptCount,
                amount: result.data.amount,
                acceptAmount: result.data.acceptAmount,
                list: result.data.list || []
            })
        }
    }

    render() {
        const { totalCount, acceptCount, amount, acceptAmount, list, headImage, showRedEnvelopeTipDialog, url } = this.state
        return (
            <Page title="红包详情" className="red-envelope-detail-page">
                <div className="top">
                    <img src={headImage} alt="" className="richer"/>
                    <div className="whose-redpack">{decodeURIComponent(this.props.location.query.liveName)}的红包</div>
                </div>
                <div className="detail-container">
                    {
                        list && list.length > 0 ?
                        [
                            <div className="header">
                                <span>已领取{acceptCount}/{totalCount}个，共{formatMoney(acceptAmount)}/{formatMoney(amount)}元</span>
                                <span className="rule" onClick={()=>{this.setState({showRedEnvelopeTipDialog: true})}}>红包发放规则>></span>
                            </div>,
                            <ul className="detail">
                                {
                                    list.map((item,index)=>(
                                        <li className="list" key={`list${index}`}>
                                            <img src={item.userHeadImage} alt=""/>
                                            <span className="user-name">{item.userName}</span>
                                            <span className="detail-money">{Number(formatMoney(item.realMoney)).toFixed(2)}  元</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        ]:
                        <Empty show={list instanceof Array && list.length < 1 }/>
                    }
                </div> 
                <div className="return-class-container">
                    <div className="return" onClick={()=>{url ? locationTo(url) : window.history.go(-1)}}>回到课堂</div>
                </div>
                {
                    showRedEnvelopeTipDialog ? 
                    <div className="red-envelope-tip-dialog-container">
                        <div className="bg" onClick={()=>{this.setState({showRedEnvelopeTipDialog: false})}}></div>
                        <div className="red-envelope-tip-dialog">
                            <div className="redpack-top">红包发放规则</div>
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
                                {((!this.state.channelId&&this.state.topicInfo.type=="charge")||(this.state.channelId&&this.state.channelCharge[0]&&this.state.channelCharge[0].amount>0))&&!this.state.campId&&<div className="btn-set" onClick={()=>{locationTo(`/wechat/page/coupon-code/list/${this.state.channelId?'channel':'topic'}/${this.state.channelId||this.props.location.query.topicId}`)}}>设置优惠券</div>}
                                <div className="btn-ok" onClick={()=>{this.setState({showRedEnvelopeTipDialog: false})}}>知道了</div>
                            </div>
                        </div>
                    </div> : null
                }
            </Page>
        );
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(RedEnvelopeDetail);
