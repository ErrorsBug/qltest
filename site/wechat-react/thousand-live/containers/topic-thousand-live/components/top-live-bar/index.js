import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {imgUrlFormat,isFromLiveCenter, formatMoney} from 'components/util';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util'
import { getQlchatVersion } from 'components/envi'
import CountDown from './components/count-down';
import CollectVisible from 'components/collect-visible';
import {createPortal} from 'react-dom'
import { isSub, fetchQRCode, getDiplomaMes} from 'thousand_live_actions/thousand-live-common'
import {getAllConfig} from 'common_actions/common'
import { CSSTransition } from 'react-transition-group';

@autobind
class TopLiveBar extends PureComponent {
    state = {
        //显示选择回到直播间主页还是系列课主页
        showTopicChannelChose: false,
        showFollowTips:true,
        isCountDown: (Number(this.props.topicInfo.startTime) >  Number(this.props.sysTime)) && /^(normal|ppt)$/.test(this.props.topicInfo.style) && /^(beginning)$/.test(this.props.topicInfo.status),
        // 跑马灯滚动位移
        marqueeX: 0,
        showMarquee: false,
        // 是否显示跑马灯引导图
        showDiplomaGuide: false,
        // 是否显示直播数据卡提示
        showCourseDataCardTips: false,
    }

    data = {
        
    }

    componentDidMount(){
        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 1000);

        // 初始化课程数据卡tips
        if (!(this.props.power.allowMGLive && this.props.isRelayChannel == "Y") && !localStorage.getItem('course_data_card_tips')) {
            this.setState({showCourseDataCardTips: true})
            localStorage.setItem('course_data_card_tips','Y')
        }
    }

    // 显示成就卡跑马灯
    marqueeScroll(diplomaMes){
        // 初始化毕业证信息
        if(diplomaMes){
            this.diplomaMes = diplomaMes
        }
        if(!localStorage.getItem('DIPLOMA_GUIDE')){
            this.setState({
                showDiplomaGuide: true
            })
            localStorage.setItem('DIPLOMA_GUIDE','Y')
        }
        this.setState({
            showMarquee: true
        })
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
        // let ratio = Number(document.querySelector('html').style.fontSize.split('px')[0]) / 75
        let fWidth = document.querySelector('.word-scroll-content').clientWidth
        let cWidth = document.querySelector('.word-scroll').clientWidth
        this.timeOut && clearInterval(this.timeOut);
        this.timeOut = setInterval(_=>{
            let marqueeX = this.state.marqueeX
            if(marqueeX < - cWidth/fWidth * 100 - 1){
                marqueeX = 100
            }
            this.setState({
                marqueeX: marqueeX - 0.4
            })
        },20)
    }

    // 显示毕业证弹窗
    async initDiplomaCardMes(){
        // 如果已经已经有请求过的数据，则直接拿
        if(this.allOfDiplomaMes){
            this.props.showDiploma(this.allOfDiplomaMes)
            return 
        }
        let config = await getAllConfig({liveId:this.props.topicInfo.liveId})
        // 请求千聊二维码
        let showQl = 'Y'
        // 是否要请求关注公众号接口
        let isFetchFocus = false
        // 若是白名单 || （专业版 && 官方直播间）则要判断是否绑定三方号，没绑定的以及以上两种条件之外的都只显示千聊二维码
        if(config.isWhite === 'Y'){
            isFetchFocus = true
        }else{
            if(config.isLiveAdmin === 'Y'){
                if(!config.isOfficialLive){
                    isFetchFocus = true
                }
            }
        }
        if(isFetchFocus){
            let data = await isSub(this.props.topicInfo.liveId)
            if(data.isBindThird){
                showQl = 'N'
            }
        }
        const qrUrl = await fetchQRCode(this.props.topicId, this.props.liveId, showQl)
        const diplomaMes = this.diplomaMes || await getDiplomaMes(this.props.second,this.props.topicInfo.id)
        this.allOfDiplomaMes = {...diplomaMes,isFetchFocus,qrUrl}
        this.props.showDiploma(this.allOfDiplomaMes)
    }

    // // 显示毕业证
    // async showDiploma(){
    //     this.props.showDiploma(this.data)
    // }

    openChoseMenu() {
        this.setState({
            showTopicChannelChose: true,
        })
    }

    hideChoseMenu() {
        this.setState({
            showTopicChannelChose: false,
        })
    }

    dangerHtml(content){
        if (content) {
            content = content.replace(/\</g, "&lt;");
            content = content.replace(/\>/g, "&gt;");
            content = content.replace(/&lt;br\/&gt;/g, "<br/>");
        }

        return { __html: content }
    };

    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    logoLinkOnClick() {
        /* isCampCourse 属性用于来自训练营的课程不进行系列课主页跳转 */
        if(this.props.isCampCourse) {
            return
        }

        if (this.props.topicInfo.channelId || this.props.topicInfo.campId) {
            this.state.showTopicChannelChose ? this.hideChoseMenu() : this.openChoseMenu()
        } else {
            // 如果是APP
            getQlchatVersion() ?
                locationTo(`qlchat://dl/live/homepage?liveId=${this.props.liveId}`)
                :
            // 如果是小程序
            this.isWeapp ?
                wx.miniProgram.redirectTo({ url: `/pages/live-index/live-index?liveId=${this.props.liveId}` })
                :
            // 如果是H5
                locationTo(`/wechat/page/live/${this.props.liveId}${this.props.auditStatus ? '?auditStatus=' + this.props.auditStatus : ''}`);
        }
    }

    /**
     * 关闭选择菜单
     * 
     * @param {any} e 
     * @memberof TopLiveBar
     */
    handleChannelOrTopicBack(e) {
        if(e.target.className == "channel-or-topic-back on-log") {
            this.hideChoseMenu();
        }
    }

    componentWillReceiveProps (nextProps) {
        let {status} = nextProps.topicInfo;
        if (status === 'ended') {
            this.setState({
                isCountDown: false
            })
        }
    }

    /**
     * 回到直播间主页
     * 
     * @param {any} e 
     * @memberof TopLiveBar
     */
    handleLiveChoose(e) {
        if (this.isWeapp) {
            wx.miniProgram.redirectTo({ url: `/pages/live-index/live-index?liveId=${this.props.liveId}` });
        } else if (getQlchatVersion()) {
            locationTo(`qlchat://dl/live/homepage?liveId=${this.props.liveId}`);
        } else {
            locationTo(`/wechat/page/live/${this.props.liveId}`);
        }
    }

    /**
     * 回到频道页
     * 
     * @param {any} e 
     * @memberof TopLiveBar
     */
    handleChannelChoose(e) {
        if (this.isWeapp) {
            wx.miniProgram.redirectTo({ url: `/pages/channel-index/channel-index?channelId=${this.props.topicInfo.channelId}` });            
        } else {
            locationTo('/live/channel/channelPage/' + this.props.topicInfo.channelId + '.htm');
        }
    }

    /**
     * 回到打卡训练营主页
     */
    handleCampChoose() {
        locationTo(`/wechat/page/camp-detail?campId=${this.props.topicInfo.campId}`);
    }

    /**
     * 关注按钮
     * 
     * @param {any} e 
     * @memberof TopLiveBar
     */
    handleFollowClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.followLive(this.props.liveId);
    }


    /**
     * 关闭提示
     * 
     * @memberof TopLiveBar
     */
    closeFollowTips(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            showFollowTips: false,
        })
    }

    // 直播间数据
    handleDataCard = () =>{
        locationTo(`/wechat/page/course-data-card/${this.props.topicInfo.id}`)
    }

    // 跳转到邀请卡
    share(){
        // 点击日志采集
        typeof _qla != 'undefined' && _qla('click', {
            region: 'details-share-btn',
            pos: this.props.topicInfo.type === 'charge' ? (this.props.shareData.shareEarningPercent ? 'earn' : 'noearn') : 'free'
        });
        // 系列课下的话题，都跳转到系列课分享卡页面，其余跳转到话题分享卡页面
        let type = 'topic'
        // 如果有平台分销的情况
        if (isFromLiveCenter() && this.props.platformShareRate) {
            if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y' && this.props.channelCharge[0]) {
                type = 'channel'
            }
        }else if(this.props.topicInfo.channelId){
            type = 'channel'
        }

        let channel = ''
        if(type == 'channel' && this.props.coralInfo && this.props.coralInfo.isPersonCourse === 'Y' && this.props.coralInfo.sharePercent && !this.props.power.allowMGLive){
            channel = '&channel=personShareCard';//*** logtodo */
        }
        let url = `/wechat/page/sharecard?type=${type}&${type}Id=${type === 'topic' ? this.props.topicInfo.id : this.props.topicInfo.channelId}&liveId=${this.props.topicInfo.liveId}${channel}`;
        if (this.props.platformShareRate) {
            url = url + "&psKey=" + this.props.userId;
        }
        locationTo(url)
    }

    //直播间倒计时ui

    render() { 
        let {topicInfo,shareData,coralInfo, canInvite} = this.props
        let money, content = ''
         // 是否是C端珊瑚会员且是珊瑚课程
         let coral = false
         if(coralInfo && coralInfo.isPersonCourse === 'Y' && coralInfo.sharePercent && !this.props.power.allowMGLive){
             coral = true
         }
        

        if (isFromLiveCenter() && this.props.platformShareRate) {
            // 如果是平台分销，则优先单课价格。
            if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y' && this.props.channelCharge[0]) {
                // 如果没有开启单节购买
                if (this.props.channelCharge[0].discountStatus === 'N') {
                    money = this.props.channelCharge[0].amount*100;
                } else {
                    money = this.props.channelCharge[0].discount*100
                }
            } else {
                money = this.props.topicInfo.money;
            }
            
            money = money * (this.props.platformShareRate / 100)
        } else {
            if(shareData){
                if(topicInfo.channelId && shareData.discountStatus && shareData.discountStatus !== 'N' && shareData.discountStatus !== 'K'){
                    money = shareData.discount
                }else {
                    money = shareData.amount
                }
                // C端珊瑚会员要按珊瑚比例计算
                if(coral) {
                    money = money * (coralInfo.sharePercent / 100)
                }else {
                    money = money * (shareData.shareEarningPercent / 100)
                }
            }
        }
        
        // const showFollowBtn = !this.props.power.allowSpeak && !this.props.isFollow && !this.props.power.allowMGLive;
        // 再原本基础上增加一个判断条件，非直播中心过来的用户
        const showFollowBtn = !this.props.power.allowSpeak && !this.props.isFollow && !this.props.power.allowMGLive && !isFromLiveCenter()
        // 是否是珊瑚计划课程和会员
        // const isCoral = (this.props.qlsharekey.lsharekey && this.props.coralIdentity.identity) ? 'Y' : 'N';
        return (
            <div className="top-bar">
                {
                    // 顶部导航条分享榜版本
                    // this.props.style === 'shareRank' ? 
                    // <div className="top-live-bar switch-scroll">
                    //     <div className="live-main">
                    //         <span className="icon_live"></span>
                    //         <CollectVisible>
                    //             {
                    //                 (this.props.power.allowSpeak && this.props.power.allowMGLive) || !isFromLiveCenter() ? 
                    //                 <span className="name on-log on-visible" data-log-region="room-home" onClick={()=>{locationTo(`/wechat/page/live/${topicInfo.liveId}`)}}>直播间主页</span>:
                    //                 <span className="name on-log on-visible" data-log-region="ql-home" onClick={()=>{locationTo('/wechat/page/recommend')}}>回到首页</span>
                    //             }
                    //         </CollectVisible>
                    //     </div>
                    //     {
                    //         shareData?
                    //         <div className="btn-group">
                    //             {
                    //                 canInvite === 'Y' &&
                    //                 <CollectVisible>
                    //                     <div className="item on-log on-visible invite-friend" data-log-region="invitefree" onClick={this.props.openInviteFriendsToListenDialog}>
                    //                         {`请好友听${10 - this.props.remaining}/10`}
                    //                         {
                    //                             this.props.isShowRemindTips && <span className="remind-tips">您还有{this.props.remaining}个请朋友听的名额</span>
                    //                         }
                    //                     </div>
                    //                 </CollectVisible>
                    //             }
                    //             {
                    //                 this.props.showBackTuition ?
                    //                 <CollectVisible>
                    //                     <div className="item on-log on-visible back-tuition" data-log-region="returnFee" onClick={this.props.openBackTuitionDialog}>
                    //                         {`返学费￥${this.props.returnMoney}`}
                    //                     </div>
                    //                 </CollectVisible> : 
                    //                 // (
                    //                 //     (!this.props.topicInfo.campId && (this.props.platformShareRate || coral || shareData.shareEarningPercent)) ?
                    //                 //     <div className="item on-log share-money" data-log-region="scholarship" onClick={this.share}>
                    //                 //         {`奖学金￥${formatMoney(money)}`}
                    //                 //     </div> :
                    //                 //     <div className="item on-log share" data-log-region="normal" onClick={this.share}>
                    //                 //         邀请卡
                    //                 //     </div>
                    //                 // )
                    //                 (
                    //                     <div className="item on-log share" data-log-region="normal" onClick={this.share}>
                    //                         邀请卡
                    //                     </div>
                    //                 )
                    //             }
                    //         </div>
                    //         : null
                    //     }
                    //     {/* {
                    //         shareData && canInvite ?
                    //         <TopBar 
                    //             coral = {coral}
                    //             topicInfo = {topicInfo}
                    //             shareData = {shareData}
                    //             canInvite = {canInvite}
                    //             shareClick = {this.share}
                    //             inviteClick = {this.props.openInviteFriendsToListenDialog}
                    //             money = {money}
                    //             remaining = {this.props.remaining}
                    //             platformShareRate = {this.props.platformShareRate}
                    //             isShowRemindTips={this.props.isShowRemindTips}
                    //         /> : null
                    //     } */}
                    // </div>:
                    
                    // 顶部导航条默认版本
                    <div className="top-live-bar">
                        <div
                            className='left-item'
                        >
                            <img className='live-logo on-log'
                                src={` ${imgUrlFormat(this.props.liveLogo,'?x-oss-process=image/resize,h_100,w_100,m_fill')}`} alt=""
                                onClick = {this.logoLinkOnClick}
                                data-log-region="top-bar"
                                data-log-pos="live-logo"
                                data-log-business_id={this.props.topicInfo.id}
                            />
                            {
                                this.state.showTopicChannelChose ?
                                <div
                                    className='channel-or-topic-back on-log'
                                    style = {{
                                        height: `${document? document.body.clientHeight : 0}`
                                    }}
                                    onClick = {this.handleChannelOrTopicBack}
                                    data-log-region="top-bar"
                                    data-log-pos="back-btn"
                                    data-log-business_id={this.props.topicInfo.id}
                                >
                                </div>
                                :
                                ""
                            }
                            {
                                this.state.showTopicChannelChose ?
                                <div
                                    className='channel-chose-menu'
                                >
                                    <div
                                        className='content on-log'
                                        onClick = {this.handleLiveChoose}
                                        data-log-region="top-bar"
                                        data-log-pos="back-live-btn"
                                        data-log-business_id={this.props.topicInfo.id}
                                    >
                                        <span className="icon-live-page"></span>
                                        <span>直播间主页</span>
                                    </div>
                                    {
                                        this.props.topicInfo.channelId &&
                                            <div
                                                className='content on-log'
                                                onClick = {this.handleChannelChoose}
                                                data-log-region="top-bar"
                                                data-log-pos="back-channel-btn"
                                                data-log-business_id={this.props.topicInfo.id}
                                            >
                                                <span className="icon-channel-page"></span>
                                                <span>系列课主页</span>
                                            </div>
                                    }
                                    {
                                        this.props.topicInfo.campId &&
                                        <div
                                            className='content on-log'
                                            onClick = {this.handleCampChoose}
                                            data-log-region="top-bar"
                                            data-log-pos="back-camp-btn"
                                            data-log-business_id={this.props.topicInfo.id}
                                        >
                                            <span className="icon-camp-page"></span>
                                            <span>打卡训练营主页</span>
                                        </div>
                                    }
                                </div>
                                :
                                ""
                            }
                        </div>
                        { this.state.isCountDown ? 
                            <CountDown startTime={Number(this.props.topicInfo.startTime)} sysTime={Number(this.props.sysTime)} onFinish={() => { this.setState({isCountDown: false})}}/>
                            :
                            <div className='live-name'>
                                <li
                                    dangerouslySetInnerHTML={this.dangerHtml(this.props.topicInfo.liveName)}
                                >
                                </li>
                                <li>{this.props.browseNum}人次 |&nbsp;
                                    {
                                        this.props.topicInfo.status == 'ended'?
                                        <var className='ended'>已结束</var>
                                        : Number(this.props.topicInfo.startTime) >  Number(this.props.sysTime) ?
                                        <var className='beginning'>即将开始</var>
                                        :<var className='beginning playing'>直播中</var>
                                    }

                                </li>
                            </div>
                        }
                        <div className="follow-container">
                            <span
                                className={ showFollowBtn ? "btn-follow-enable on-log" : "btn-follow-disable on-log"}
                                onClick={this.handleFollowClick}
                                data-log-region="top-bar"
                                data-log-pos="follow-btn"
                                data-log-business_id={this.props.topicInfo.id}
                                >
                                关注
                            </span>

                            <div className={`follow-tips ${(this.state.showFollowTips&&this.props.showFollowTips&&showFollowBtn)?'':'hide'}`}>
                                <span
                                    className="info"
                                    onClick={this.handleFollowClick}
                                    data-log-region="top-bar"
                                    data-log-pos="follow-btn"
                                    data-log-business_id={this.props.topicInfo.id}
                                >关注老师，下次开课提醒你</span>
                                <span className="btn-close icon_cross" onClick={this.closeFollowTips}></span>
                            </div>

                        </div>
                        <span className='right-item'>

                        {
                            <div className="btn-group">
                                {this.props.power.allowMGLive && (
                                    <div
                                        className="item live-data on-log on-visible"
                                        data-log-region="DataCard"
                                        data-log-pos={`tap_${this.props.topicInfo.style}`}
                                        onClick={this.handleDataCard}>
                                        直播数据
                                    </div>
                                )}
                                {this.props.power.allowMGLive && (
                                    <CSSTransition
                                        in={this.props.showBubbleTips && this.state.showCourseDataCardTips}
                                        timeout={{enter: 500, exit: 500}}
                                        classNames="bubbling-tips"
                                        unmountOnExit
                                        onEntered={() => {
                                            setTimeout(() => {
                                                this.setState({
                                                    showCourseDataCardTips: false
                                                }, () => {
                                                    setTimeout(() => {
                                                        this.props.onBubbleTipsShowed(true);
                                                    }, 500);
                                                });
                                            }, 3000);
                                        }}
                                    >
                                        <p className="bubbling-tips">这里有实时课程数据</p>
                                    </CSSTransition>
                                )}
                                {
                                    this.props.showBackTuition ?
                                    <CollectVisible>
                                        <div className="item on-log on-visible back-tuition" data-log-region="returnFee" onClick={this.props.openBackTuitionDialog}>
                                            {`返学费￥${this.props.returnMoney}`}
                                        </div>
                                    </CollectVisible> : 
                                    // (
                                    //     (!this.props.topicInfo.campId && (this.props.platformShareRate || coral || shareData.shareEarningPercent)) ?
                                    //     <div className="item on-log share-money" data-log-region="scholarship" onClick={this.share}>
                                    //         {`奖学金￥${formatMoney(money)}`}
                                    //     </div> :
                                    //     <div className="item on-log share" data-log-region="normal" onClick={this.share}>
                                    //         邀请卡
                                    //     </div>
                                    // )
                                    (
                                        <div className="item on-log share" data-log-region="normal" onClick={this.share}>
                                            邀请卡
                                        </div>
                                    )
                                }
                                {
                                    canInvite === 'Y' &&
                                    <CollectVisible>
                                        <div className="item on-log on-visible invite-friend" data-log-region="invitefree" onClick={this.props.openInviteFriendsToListenDialog}>
                                            {`请好友听`}
                                            <span className="remaining"><span className="remaining-warn">{10 - this.props.remaining}</span>/10</span>
                                            {
                                                this.props.isShowRemindTips && <span className="remind-tips">您还有{this.props.remaining}个请朋友听的名额</span>
                                            }
                                        </div>
                                    </CollectVisible>
                                }

                            </div>
                        }

                        {/* {
                            /(audio|video)$/.test(this.props.topicInfo.style)?
                            <span className="btn-switch-video on-log"
                                onClick = {this.props.changgeLiveBox}
                                data-log-region="top-bar"
                                data-log-pos="switch-video-btn"
                                data-log-name={`${this.props.showLiveBox? '收起': '展开'}`}
                                data-log-business_id={this.props.topicInfo.id}
                                >
                                {
                                    this.props.showLiveBox?
                                        <span>收起</span>
                                    :
                                        <span>展开</span>
                                }
                            </span>
                            :/(ppt)$/.test(this.props.topicInfo.style)?
                            <span className="btn-switch-ppt"
                                onClick = {this.props.changgeLiveBox}
                                data-log-region="top-bar"
                                data-log-pos="switch-ppt-btn"
                                data-log-name={`${this.props.showLiveBox? '收起': '幻灯'}`}
                                data-log-business_id={this.props.topicInfo.id}
                                >
                                {
                                    this.props.showLiveBox?
                                        <span>收起</span>
                                    :
                                        <span>幻灯</span>
                                }
                            </span>
                            :null
                        } */}
                        </span>
                    </div>
                }
                {
                    // 毕业证跑马灯
                    this.state.showMarquee &&
                    <div className={`marquee-container on-visible on-log`} onClick={this.initDiplomaCardMes} data-log-region="SC-diploma" data-log-pos={this.props.topicInfo.style}>
                        <div className="icon"></div>
                        <div className="word-scroll-content">
                            <p style={{left: `${this.state.marqueeX}%`}} className="word-scroll">{this.props.userName}，你完成了课程，老师给你发了毕业证~</p>
                        </div>
                        <div className="check">
                            查看毕业证 >
                        </div>
                    </div>
                }
                {
                    // 毕业证引导图
                    this.state.showDiplomaGuide &&
                    createPortal(
                        <div className="diploma-first-bg" onClick={()=>{this.setState({showDiplomaGuide: false})}}>
                            <div className={`top ${this.props.topicInfo.style === 'audio' ? 'detail-video' : ''} ${this.props.topicInfo.style === 'ppt' ? 'ppt' : ''}`}></div>
                            <div className="center"></div>
                            <div className="bottom">
                                <div className="tips">点击查看毕业证哦~</div>
                                <div className="close"></div>
                            </div>
                        </div>,document.body
                    )
                }
            </div>
        )
    }
}

const TopBar = ({
    coral,
    topicInfo,
    shareData,
    canInvite,
    shareClick,
    inviteClick,
    money,
    remaining,
    platformShareRate,
    isShowRemindTips
}) => {
    // 开启了请好友免费听资格
    if(canInvite === 'Y'){

        return (
            <div className="link-main on-log on-visible" data-log-pos="invite-listen-freely" region="voice-class" onClick={inviteClick}>
                <span className="tip">{`请好友免费听(${10 - remaining}/10)`}</span>
                <span className="icon_enter"></span>
                {
                    isShowRemindTips && <span className="remind-tips">您还有{remaining}个请朋友听的名额</span>
                }
            </div>
        )
    }
    // 未开启请好友免费听，但有分销的课程
    if((isFromLiveCenter() && platformShareRate) || coral || (shareData && shareData.shareEarningPercent)) {
        return (
            <div className="link-main on-log" onClick={shareClick}>
                <span className="tip">{`邀请朋友上课，赚${formatMoney(money)}元`}</span>
                <span className="icon_enter"></span>
            </div>
        )
    }
    // 没有分销，不是珊瑚会员的付费课
    if(topicInfo.type === 'charge'){
        return (
            <div className="link-main on-log" onClick={shareClick}>
                <span className="tip">{`邀请好友一起学`}</span>
                <span className="icon_enter"></span>
            </div>
        )
    }
    // 没有分销，不是珊瑚会员的免费课
    return (
        <div className="link-main on-log" onClick={shareClick}>
            <span className="tip">{`推广课程，为老师打call`}</span>
            <span className="icon_enter"></span>
        </div>
    )
}

TopLiveBar.propTypes = {
};

function mapStateToProps(state) {
    return {
        qlsharekey: state.common.qlsharekey || {},
        coralIdentity: state.common.coralIdentity || {},
    }
}

const mapActionToProps = {
}

export default connect(mapStateToProps, mapActionToProps, null, { withRef: true })(TopLiveBar);
