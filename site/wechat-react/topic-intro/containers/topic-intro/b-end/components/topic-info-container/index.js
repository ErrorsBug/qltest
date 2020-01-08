import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { formatDate,imgUrlFormat, formatMoney, locationTo, getVal, checkTime, htmlTransferGlobal } from 'components/util';

import TopicTipBar from './topic-tips-bar';
import ShortKnowledgeTip from "../../../../../../components/short-knowledge-tip";
import {apiService} from "components/api-service";


@autobind
class TopicInfo extends Component {

    state = {
        // 剩余时间
        leftSecond:0,
        // 显示倒计时
        showCountdown: false,
        day: 0,
        hours: 0,
        minutes: 0,
        second: 0,
        // 显示进入课程按钮
        showEnter: false,
        sysTimestamp:''
    }


    componentDidMount() {
        this.setState({
            sysTimestamp:this.props.sysTimestamp
        })
        this.initShowKnowledgeTip()
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.power != this.props.power) || (nextProps.chargeConfigs != this.props.chargeConfigs)) {
            this.initShowEnter(nextProps);
        }
    }

    initShowKnowledgeTip = async () => {
        let storage = localStorage.getItem('showKnowledgeTip');
        let key = 'topic'+this.props.topicId;
        let times = storage && JSON.parse(storage)[key] || 0;
        if (times > 2) return ;
        let result = await apiService.post({
            url: '/h5/dataStat/getCourseIndexStatus',
            body: {
                businessId: this.props.topicId,
                type: 'topic'
            }
        })
        if (result.state.code == 0) {
            times ++;
            if (result.data.knowledgeStatus != 'Y' && times < 3 && Date.now() < new Date('2019-06-18').valueOf()) {
                localStorage.setItem('showKnowledgeTip', JSON.stringify({
                    [key]: times
                }))
            }
            this.setState({
                showKnowledgeTip: result.data.knowledgeStatus != 'Y' && times < 3 && Date.now() < new Date('2019-06-18').valueOf()
            })
            setTimeout(() => {
                this.setState({
                    showKnowledgeTip: false
                })
            }, 4000)
        }
    }

    componentDidUpdate() {
        if (this.props.sysTimestamp && this.props.sysTimestamp != this.state.sysTimestamp) {
            this.isInitStart = true;
            this.initCountDown();
        }
    }


    // 倒计时初始化
    initCountDown() {
        // 已结束不开启倒计时;
        if (this.props.topicInfo.status != 'beginning' || !this.isInitStart) {
            return false;
        }
        this.isInitStart = false;
        let leftSecond = this.getLeftSeconds();

        if (leftSecond > 0) {
            this.setState({
                leftSecond,
                sysTimestamp:this.props.sysTimestamp
            },this.doTimer)
        }

    }

    // 获取剩余秒数
    getLeftSeconds() {
        let { sysTimestamp } = this.props;
        let { startTime } = this.props.topicInfo;

        let leftTime = parseInt((Number(startTime) - Number(sysTimestamp)) / 1000);

        if (leftTime < 0) {
            leftTime = 0;
        }

        return leftTime;
    }

    // 倒计时计时器
    doTimer() {
        this.timer = setInterval(() => {
            let leftSecond = this.state.leftSecond;

            if (leftSecond <= 0) {
                clearInterval(this.timer);
                this.setState({
                    showCountdown:false,
                });
                return false;
            }

            let day = ~~(leftSecond / (3600 * 24));
            let hours = ~~(leftSecond % (3600 * 24) / 3600);
            let minutes = ~~(leftSecond % 3600 / 60);
            let second = ~~(leftSecond % 60);
    
            this.setState({
                showCountdown:true,
                day: checkTime(day),
                hours: checkTime(hours),
                minutes: checkTime(minutes),
                second: checkTime(second),
                leftSecond : leftSecond - 1
            });
    
        }, 1000);
    }

    initShowEnter(nextProps) {

        if (nextProps.power.allowSpeak || nextProps.power.allowMGLive) {
            return false;
        }


        let channelPrice =
            (nextProps.channelId && nextProps.chargeConfigs.length) ?
            nextProps.chargeConfigs[0].discountStatus == 'Y' ? nextProps.chargeConfigs[0].discount
            : nextProps.chargeConfigs[0].amount
            : '';

        // 非系列课的公开话题、有权限进入话题、免费系列课
        if (
            nextProps.isAuthTopic
            ||(!nextProps.channelId && nextProps.topicInfo.type == 'public')
            || channelPrice == '0'
        ) {
            this.setState({
                showEnter: true,
            })
        }
    }

    enterTopic() {
        if (this.props.isAuthTopic ||(!this.props.channelId && this.props.topicInfo.type == 'public')) {
            this.props.authTopic();
        } else {
            this.props.buyChannel();
        }
        
    }

    render() {
        return (
            <div className="topic-info-container">
                    
                <div className="topic-banner">
                    {
                        this.state.showKnowledgeTip ?
                            <div className="knowledge-wrap" style={{
                                position: "absolute",
                                zIndex: 100,
                                right: 0
                            }}>
                                <ShortKnowledgeTip borC="B"/>
                            </div> : null
                    }
                    <img src={`${this.props.topicInfo.backgroundUrl}?x-oss-process=image/resize,m_fill,limit_0,h_500,w_800`} />  
                    {
                        this.state.showEnter && 
                        <div className="header-entry" onClick={this.enterTopic}></div>
                    }
                    {
                        this.state.showCountdown?
                        <div className="topic-count-down">
                            距开始 <dl className="main"><dd><b>{this.state.day}</b>天</dd> : <dd><b>{this.state.hours}</b>时</dd>  : <dd><b>{this.state.minutes}</b>分</dd>  : <dd><b>{this.state.second}</b>秒</dd> </dl>   
                            </div>
                        :null    
                    }
                </div>

                {/* <BtnShareCard
                    lShareKey = {this.props.lShareKey}
                    shareKey = {this.props.shareKey}
                    topicInfo = {this.props.topicInfo}
                    coral = {this.props.coral}
                    onCoralShare = {this.props.showCoralPromoDialog}
                    uncertainShareBtnClickHandle = {this.props.uncertainShareBtnClickHandle}
                    liveRole = {this.props.liveRole}
                />     */}

                {/*<FollowLiveTopBar/>*/}


                <div className="topic-title-price-container">
                    <div className="title">
                        {
                            this.props.topicInfo.flag ? 
                            <span className="girl-college">{this.props.topicInfo.flag}</span>
                            : null
                        }
                        {
                            this.props.topicInfo.style == 'video' ?
                                <i className='icon-video'></i>
                                : this.props.topicInfo.style == 'audio' ?
                                    <i className='icon-audio'></i>
                                :null    
                        }    
                        {
                            this.props.topicInfo.isRelayChannel =="Y" && this.props.power.allowMGLive ?
                            <i className='icon-tips'>转载</i>
                            :this.props.topicInfo.isRelay =="Y" && this.props.power.allowMGLive ?
                            <i className='icon-tips'>转播</i>
                            :null    
                        }  
                        <code>{htmlTransferGlobal(this.props.topicInfo.topic)}</code>
                    </div>
                    <span className="time">时间：{formatDate(this.props.topicInfo.startTime, 'yyyy-MM-dd hh:mm:ss')}</span>
                    
                    {/* 浏览人次被缓存了，需要额外调用一个接口获取数据*/}
                    <span className="view">{this.props.browsNum || this.props.topicInfo.browseNum}次学习</span>
                    <div className="price-bar">
                        {
                            this.props.topicInfo.type == 'charge' ?
                                (
                                    // 付费单课或者系列课单节购买
                                    (!this.props.topicInfo.campId && !this.props.topicInfo.channelId)
                                    ||
                                    (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy == 'Y')
                                ) &&   
                                [
                                    (
                                        (this.props.isOpenVip && this.props.topicInfo.isRelay != "Y" ) ?
                                            <a key='vip-free-link' href={`/wechat/page/live-vip-details?liveId=${this.props.topicInfo.liveId}`}
                                               className='icon-vip on-log'
                                               data-log-name="vip免费"
                                               data-log-region="icon-vip"
                                            >vip免费</a>
                                            : null
                                    ),
                                    <var key='vip-free-money'>￥{formatMoney(this.props.topicInfo.money)}</var>
                                ]
                            : this.props.topicInfo.type == 'encrypt' ?
                                <var>加密</var>   
                            :   <var>免费</var>     
                        }
                    </div>
                    {
                        (
                            (!this.props.topicInfo.channelId && !this.props.topicInfo.campId && this.props.topicInfo.type == 'charge')
                            ||
                            (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy == 'Y')
                        
                        ) && 
                        <div className="btn-present on-log"
                             onClick={ this.props.onGiftClick }
                             data-log-name="赠好友"
                             data-log-region="btn-present"
                        >
                            <img src={require('./img/icon-present.png')} alt="" />
                            赠好友
                        </div>
                    }
                </div>
                <TopicTipBar
                    topicInfo = {this.props.topicInfo}
                    isOpenVip = {this.props.isOpenVip}
                    sysTime = {this.props.sysTime}
                    power = {this.props.power}
                    isAuthTopic = {this.props.isAuthTopic}
                    chargeConfigs = {this.props.chargeConfigs}
                    chargeType={this.props.chargeType}
                    channelId={this.props.channelId}
                    userVipInfo={this.props.userVipInfo}
                />
                
            </div>
        );
    }
}

TopicInfo.propTypes = {
};


function mapStateToProps (state) {
    return {
        sysTime: getVal(state, 'topicIntro.sysTimestamp',getVal(state, 'common.sysTime')),
        sysTimestamp: getVal(state, 'topicIntro.sysTimestamp',''),
        topicId: getVal(state, 'topicIntro.topicInfo.id'),
        liveId: getVal(state, 'topicIntro.topicInfo.liveId'),
        channelId: getVal(state, 'topicIntro.channelId',''),
        topicInfo : getVal(state, 'topicIntro.topicInfo', {}),
        lShareKey:getVal(state, 'topicIntro.lShareKey',{}),
        shareKey:getVal(state, 'topicIntro.shareKey',{}),
        coral:getVal(state, 'topicIntro.coral', {}),
        power:getVal(state, 'topicIntro.power', {}),
        isAuthTopic: getVal(state, 'topicIntro.isAuthTopic', false),
        chargeConfigs: getVal(state, 'topicIntro.channelInfo.chargeConfigs', []),
        liveRole: getVal(state, 'topicIntro.liveRole', ''),
        browsNum: getVal(state, 'topicIntro.browsNum', 0),
        // 判断收费类型
        chargeType: getVal(state, 'topicIntro.channelInfo.channel.chargeType'),
        // 用户VIP信息
        userVipInfo: getVal(state, 'topicIntro.userVipInfo', {}),
    }
}

const mapActionToProps = {
}

module.exports = connect(mapStateToProps, mapActionToProps)(TopicInfo);
