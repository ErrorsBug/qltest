const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { autobind, throttle } from 'core-decorators';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import animation from 'components/animation'
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { limitScrollBoundary } from 'components/scroll-boundary-limit';
import MeadiaBox from './components/media-live-box';
import BottomComment from './components/bottom-comment-input';
import BottomControlDialog from './components/bottom-control-dialog';
import CommentListBubble from './components/comment-list-bubble';
import LuckyMoney from './components/lucky-money';
import TopLiveBar from './components/top-live-bar';
import BarrageLuckyMoney from './components/barrage-lucky-money';
import { logPayTrace } from 'components/log-util';

import { share } from 'components/wx-utils';
import {
    htmlTransferGlobal,
    wait,
    sortBy,
    getVal,
    getCookie,
    formatDate,
    imgUrlFormat,
    randomShareText
} from 'components/util';


import {
    followLive,
    setMute,
    fetchEndTopic,
    bindShareKey,
    addPageUv,
    updateMute,
    updateCurrentTimeMillis,
} from 'thousand_live_actions/thousand-live-common';


import {
    addComment,
    bannedToPost,
    deleteComment,
    fetchCommentList
} from 'thousand_live_actions/thousand-live-normal';
import {
    getLivePlayUrl,
    getLiveStatus,
    getLiveOnlineNum,
} from 'thousand_live_actions/thousand-live-av';


import { startSocket } from 'thousand_live_actions/websocket';

import { doPay, uploadTaskPoint, request } from 'common_actions/common'
import { getOfficialLiveIds } from 'actions/common';
import { setUniversityCurrentCourse } from "../../actions/live";

@autobind
class TheLive extends Component {

    data = {
        liveId: '0',
        topicId: '0',
    }

    state = {
        showControlDialog: false,
        /*赞赏的用户ID*/
        payForId: null,
        payForPortrait: null,
        payForName: null,

        //用户是否有创建直播间
        isHasLive: false,
        getHasLive: false,

        isOfficialLive: '',
    }
    // 图片懒加载的待加载列表
    lazyImgs = [];

    /*******************************    图片懒加载 start    *****************************/

    getChildContext() {
        return {
            lazyImg: {
                push: this.pushImgToLazyImgs,
                remove: this.removeImgToLazyImg,
            }
        }
    }

    /**
     * 添加图片到lazyImgs列表中
     * @param {*} ref 图片的ref
     */
    pushImgToLazyImgs(ref) {
        if (!this.refs.topicListContainer) {
            this.lazyImgs.push(ref);
            return;
        }

        if (!this.isImgCanLoad(findDOMNode(this.refs.topicListContainer), ref)) {
            this.lazyImgs.push(ref);
        }
    }

    /**
     * 通过图片一个唯一标识删除图片
     * @param {*} id 图片id
     */
    removeImgToLazyImg(id) {
        this.lazyImgs = this.lazyImgs.filter(item => item.getAttribute('id').trim() != id);
    }

    @throttle(300)
    initLazyImgLinstener(target) {
        if (!target) {
            return;
        }
        const st = target.scrollTop;
        const height = target.clientHeight;

        this.lazyImgs.forEach(item => {
            const pos = item.parentNode.parentNode.parentNode.parentNode.offsetTop;
            const itemHeight = item.parentNode.parentNode.parentNode.parentNode.clientHeight;
            if (pos < height + st + itemHeight && pos >  st - itemHeight) {
                item.src = item.getAttribute('data-real-src');
            }
        });
    }

    isImgCanLoad(target, imgDom) {
        const st = target.scrollTop;
        const height = target.clientHeight;
        const pos = imgDom.parentNode.parentNode.parentNode.parentNode.offsetTop;
        const itemHeight = imgDom.parentNode.parentNode.parentNode.parentNode.clientHeight;

        if (pos < height + st + itemHeight && pos >  st - itemHeight) {
            imgDom.src = imgDom.getAttribute('data-real-src');
            return true;
        } else {
            return false;
        }
    }

    /*******************************    图片懒加载 end    *****************************/



    componentWillMount() {
        // this.initPlayerScript();
        this.initShare();
        // 话题统计
        this.addPageUv();

        this.hasLive();
    }


    async componentDidMount() {
        await this.initCommentList();

        this.initScrollDom();
        
        if(this.refs.commentListBox){
	        limitScrollBoundary(this.refs.commentListBox);
        }
        // 打开websocket
        if (this.props.topicInfo.status !== 'ended') {
            this.initWebsocket();
        }
        this.props.updateMute(this.props.topicInfo.isBanned);
        // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        /***************************************  
         *                                  
         *         !!!!! 注意 !!!!              
         * 
         *      需要userId 请求的接口放这里     
         * 
         *      ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
         * 
        ****************************************/
        
        // 需要登录才能请求的方法
        if (this.props.userId) {
            // 绑定分销关系
            if (this.props.location.query.lshareKey) {
                await this.props.bindShareKey(this.props.topicInfo.liveId, this.props.location.query.lshareKey);
            }
            setUniversityCurrentCourse({
                businessId: this.props.topicInfo.isBook ==='Y'? this.props.topicInfo.id : (!!this.props.topicInfo.channelId ? this.props.topicInfo.channelId : this.props.topicInfo.id),
                businessType: this.props.topicInfo.isBook ==='Y'? 'topic' : (!!this.props.topicInfo.channelId? 'channel':'topic'),
                currentId: this.props.topicInfo.id,
            });

        }
        /***************************************  
         *      ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
         *      需要userId 请求的接口放这里 
         *         !!!!! 注意 !!!!              
         ****************************************/
        // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    }


    componentDidUpdate(prevProps,prevState) {
        (prevProps.topicInfo.commentNum &&  prevProps.topicInfo.commentNum < this.props.topicInfo.commentNum) && this.newMsgScroll();
    }

    initScrollDom() {
        this.data.commentListBox = findDOMNode(this.refs.commentListBox);
    }

    // // 初始化播放器脚本
    // initPlayerScript() {
    //     const script = document.createElement('script');
	// 	script.src = '//imgcache.qq.com/open/qcloud/video/vcplayer/TcPlayer-2.2.1.js';
	// 	document.body.appendChild(script);
    // }

    /**
	 *
	 * 话题统计
	 * @memberof ThousandLive
	 */
	async addPageUv(){
	    await wait(3500);
		this.props.addPageUv(this.props.topicInfo.id, this.props.topicInfo.liveId, ['topicOnline', 'liveUv'], this.props.location.query.pro_cl || getCookie('channelNo') || '', this.props.location.query.shareKey ||'');
    }

    /**
     *
     * 关注直播间判断
     *
     * @memberof ThousandLive
     */
    followLive(liveId,status='Y') {
        this.props.followLive(liveId,status);
        this.setState({
            showFollowDialog: true
        });
    }


    async initCommentList() {
        await wait(2000);
        let currentTimeMillis = this.props.topicInfo.currentTimeMillis;
	    let getDataTime = Date.now();
        if (currentTimeMillis > getDataTime) {
            getDataTime = currentTimeMillis;
        }
        await this.props.fetchCommentList(this.props.topicInfo.id, this.props.topicInfo.liveId, getDataTime + 30000, 'before');
        // this.setState({ gotComments: true});
        if (this.props.commentList.length > 0) {
            this.scrollMsgToView(this.props.commentList.length-1, false);
        }

    }
    
    async initIsOfficial() {
        try {
            const [officialLiveIds] = await Promise.all([
                this.props.getOfficialLiveIds(),
            ]);

            let isOfficial = 'N';

            if (getVal(officialLiveIds, 'state.code') == 0) {
                isOfficial = getVal(officialLiveIds, 'data.dataList', []).includes(this.props.topicInfo.liveId);
                isOfficial = isOfficial ? 'Y' : 'N';
            }

            this.setState({
                isOfficialLive: isOfficial,
            });

        } catch (error) {
            console.error(error);
        }
    }

    /**
	 * 初始化websocket
	 *
	 * @memberof ThousandLive
	 */
    async initWebsocket(){
        // await wait(3000);
		this.props.startSocket(this.props.sid, this.props.topicInfo.sourceTopicId || this.props.topicInfo.id, this.props.userId,this.props.topicInfo.currentTimeMillis);
    }
    
    initedShare = false
    /**
     *
     * 初始化分享
     *
     * @memberof ThousandLive
     */
    initShare() {
        if (this.initedShare) { return }
        this.initedShare = true
        let wxqltitle = this.props.topicInfo.topic;
        let descript = this.props.topicInfo.liveName;
        let wxqlimgurl = "https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png";
        let friendstr = wxqltitle;
        let target = window.location.origin + this.props.location.pathname + '?topicId=' + this.props.topicInfo.id + "&pro_cl=link";
        let isNl = "\n";
        // if(this.props.topicInfo.status == "ended"){
        //     descript+=isNl+"点击查看回放";
        // }else if( Number(this.props.topicInfo.startTime) >  Number(this.props.topicInfo.currentTimeMillis) ){

        //     descript+=isNl+"时间:"+formatDate(this.props.topicInfo.startTime,'MM月dd日hh:mm')+isNl+"点击设置开播提醒";
        // }else{
        //     descript+="正在直播"+isNl+"点击链接即可参加";
        // };

        const shareObj = randomShareText({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            shareUrl: target,
        })

        if(this.props.lshareKey&&this.props.lshareKey.shareKey && this.props.lshareKey.status == 'Y' ){
            shareObj.title = "我推荐-" + shareObj.title;
            shareObj.timelineTitle = "我推荐-" + `《${wxqltitle}》`;
            shareObj.shareUrl = shareObj.shareUrl + "&lshareKey=" + this.props.lshareKey.shareKey;
        }

        
        
        if (this.props.location.query.psKey || this.state.isOfficialLive === "Y") {
            const pre = '/wechat/page/recommend?isBackFromShare=Y&wcl=middlepage-room'
            
            // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
            shareObj.shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(shareObj.shareUrl))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;
        }


        const onShareComplete = () => {
            console.log('share completed!') 

            // 学分任务达成触发点
            uploadTaskPoint({
                assignmentPoint: 'grow_share_course',
            })
        }

        console.log('分享信息: ', shareObj)
        share({
            ...shareObj,
            imgUrl: wxqlimgurl,
            successFn: onShareComplete,
        });
    }


    // 切换显示控制菜单
    toggleControlDialog = (e) => {
        this.setState({
            showControlDialog:!this.state.showControlDialog,
        })
    }


    // 滚动到最后
    scrollToLast() {
        try {
            if ( this.props.commentList.length < 1 ) {
                return;
            }
            this.scrollMsgToView(this.props.commentList.length-1,'bottom')
        } catch (error) {
            console.log(error)
        }
    }

    /**
     *
     *滚动到某条消息
     * @param {*} index
     * @param {*} withAnimation
     * @returns
     * @memberof TheLive
     */
    scrollMsgToView(index, withAnimation){
        let msgDom = document.getElementsByClassName("speak-container")[index];
        if (!msgDom) {
            return;
        }
        let scrollBox = findDOMNode(this.refs.commentListBox);
        if (withAnimation) {
            if (withAnimation === 'top') {
                animation.add({
                    startValue: msgDom.offsetTop,
                    endValue: msgDom.offsetTop - 50,
                    step: (v) => {
                        scrollBox.scrollTop = v;
                    }
                });
            } else if (withAnimation === 'bottom'){
                animation.add({
                    startValue: scrollBox.scrollTop,
                    endValue: msgDom.offsetTop,
                    step: (v) => {
                        scrollBox.scrollTop = v;
                    }
                });
            } else {
                animation.add({
                    startValue: scrollBox.scrollTop,
                    endValue: msgDom.offsetTop - (scrollBox.clientHeight / 2),
                    step: (v) => {
                        scrollBox.scrollTop = v;
                    }
                });
            }
        } else {
            setTimeout(function () {
			    msgDom.scrollIntoView(true);//自动滚动到视窗内
		    },300)
	    }

    }

    newMsgScroll() {
        let scrollBox = findDOMNode(this.refs.commentListBox);
        let distanceScrollCount = scrollBox.scrollHeight,
            distanceScroll = scrollBox.scrollTop,
            topicPageHight = scrollBox.clientHeight,
            ddt = distanceScrollCount - distanceScroll - topicPageHight,
            defaultToBottomHeight = 600;
        // ddt: 页面滚动距离底部的距离，如果小于defaultToBottomHeight则在新消息进来时滚动到底部


        if (ddt < defaultToBottomHeight) {
            this.scrollToLast();
        }
        
    }

    @throttle(300)
    async onTouchMoveCommentList(e) {
        // 锁判断
        if (this.data.loadingNext||this.props.commentList.length < 1) {
            return;
        }

        // 加上锁
        this.data.loadingNext = true;

        let createTime = this.props.commentList[0].createTime;
        if (this.data.commentListBox.scrollTop < 10 ) {
            let commentItem = this.props.commentList[0];
            let list = await this.props.fetchCommentList(this.props.topicInfo.id, this.props.topicInfo.liveId, createTime, 'before');
            let itemIndex = this.props.commentList.findIndex((item) => { return item.id == commentItem.id });
            this.scrollMsgToView(itemIndex, 'top');
            setTimeout(() => {
                if (list && list.length >= 20) {
                    this.data.loadingNext = false;
                }
            },500)
        }else{
            this.data.loadingNext = false;
        }

    }

    /**
     * 关闭赞赏弹框
     *
     * @memberOf ThousandLive
     */
    onCloseReward() {
        this.setState({
            showLuckyMoney: false
        });
    }

    /**
     *
     * 打开赞赏弹框
     *
     * @memberOf ThousandLive
     */
    onOpenReward() {
        this.setState({
            showLuckyMoney: true,
            payForId: this.props.createUser.userId,
            payForPortrait: this.props.createUser.headImgUrl,
            payForName: this.props.createUser.name,
        });
    }

    /**
     * 赞赏金额点击事件
     *
     * @memberOf ThousandLive
     */
    onRewardItemClick(money) {
        if(this.props.userId == this.state.payForId){
            window.toast('不能赞赏自己');

        }else{
            this.props.doPay({
                type: 'REWARD',
                total_fee: money,
                topicId: this.props.topicInfo.id,
                liveId: this.props.topicInfo.liveId,
                toUserId: this.state.payForId,
                callback: () => {
                    logPayTrace({
                        id: this.props.topicInfo.topicId,
                        type: 'topic',
                        payType: 'REWARD',
                    });
                    this.onCloseReward();
                },
            })
        }
    }

    // 获取用户是否有创建的直播间
    async hasLive(){
        const result = await request({
            url: '/api/wechat/channel/getLiveList',
            method: 'GET'
        });
        if(result.state.code === 0){
            if(result.data.entityPo !== null){
                this.setState({
                    isHasLive: true,
                })
            }
        }
        this.setState({
            getHasLive: true,
        });
    }


    render() {
        // 判断当前用户角色
        const liveRole = this.props.power.allowMGLive ? this.props.liveInfo.entity.createBy == this.props.userId ? 'creator' : 'manager' : '';

        return (
            <Page title={htmlTransferGlobal(this.props.topicInfo.topic)} className="thousand-live flex-body">
                <div className="flex-other">
                    <MeadiaBox
                        topicInfo={this.props.topicInfo}
                        sysTime={this.props.sysTime}
                        getLivePlayUrl={this.props.getLivePlayUrl}
                        getLiveStatus={this.props.getLiveStatus}
                        getLiveOnlineNum={this.props.getLiveOnlineNum}
                        pushStatus={this.props.pushStatus}
                        browseNum = {this.props.browseNum}
                        followLive = {this.followLive}
                        isFollow = {this.props.isFollow}
                        power = {this.props.power}
                        updateCurrentTimeMillis={this.props.updateCurrentTimeMillis}
                        // 显示课程数据卡入口
                        showCourseDataCardEntrance
                    />
                    {/*顶部模块*/}
                    {
                        this.props.topicInfo.style == 'videoLive' ?
                        <TopLiveBar
                            ref = {el => this.topLiveBarEle = el}
                            topicInfo = {this.props.topicInfo}
                            browseNum = {this.props.browseNum}
                            power = {this.props.power}
                            isFollow = {this.props.isFollow}
                            liveId = {this.props.topicInfo.liveId}
                            liveLogo = {this.props.topicInfo.liveLogo}
                            followLive = {this.followLive}
                            showFollowTips = {this.state.showFollowTips}
                            topicId = {this.props.topicInfo.id}
                            isCampCourse = {this.props.isCampCourse}
                            auditStatus = {this.props.location.query.auditStatus || ''}
                            userName = {this.props.userInfo.user.name}
                            switch = {`default`}
                            />  
                        :null    
                    }
                </div>
                <div className='flex-main-h'>
                    <div
                        className="flex-main-s"
                        // id="main-scroll-area"
                        onScroll={this.onTouchMoveCommentList}
                        onTouchMove={(e)=>{this.onTouchMoveCommentList(e);   /* this.recordScrollTime();  */ }}
                        onWheel={(e)=>{this.onTouchMoveCommentList(e);   /* this.recordScrollTime();   */}}
                        ref='commentListBox'
                    >
                        <CommentListBubble
                            commentList={this.props.commentList}
                            liveRole={liveRole}
                            bannedToPost={this.props.bannedToPost}
                            deleteComment={this.props.deleteComment}
                            power={this.props.power}
                            userId={this.props.userId}
                            topicId={this.props.topicInfo.id}
                            topicStyle={this.props.topicInfo.style}
                            isHasLive = {this.state.isHasLive}
                            getHasLive = {this.state.getHasLive}
                        />
                    </div>
                    <div className="chat-room">
                        <BarrageLuckyMoney
                            isAbsolute = { false }
                            rewardBulletList = {this.props.rewardBulletList}
                            isShowBullet = {this.props.isShowBullet}
                            isShootBullet = {this.props.isShootBullet}
                        />
                    </div> 
                </div>    
                <div className="flex-other">
                    <BottomComment
                        mute={this.props.mute}
                        topicInfo = {this.props.topicInfo}
                        addComment={this.props.addComment}
                        showControlDialog = {this.toggleControlDialog}
                        scrollToLast = {this.scrollToLast}
                        onOpenReward = {this.onOpenReward}
                    />
                </div>


                {
                    this.state.showControlDialog ?
                    <BottomControlDialog
                        topicInfo = {this.props.topicInfo}
                        mute = {this.props.mute}
                        showReword = {this.props.showReword}
                        setMute = {this.props.setMute}
                        onCloseSettings = {this.toggleControlDialog}
                        liveId = {this.props.topicInfo.liveId}
                        topicId = {this.props.topicInfo.id}
                        power = {this.props.power}
                        currentUserId = {this.props.userId}
                        fetchEndTopic={this.props.fetchEndTopic}
                    />:null
                }    
                {/*赞赏弹框*/}
                {
                    this.state.showLuckyMoney &&
                        <LuckyMoney
                            rewardPrice={this.props.liveInfo.entityExtend.rewardPrice}
                            rewardIntroduce = {this.props.liveInfo.entityExtend.rewardIntroduce}
                            payForHead={ imgUrlFormat(this.state.payForPortrait, '?x-oss-process=image/resize,h_50,w_50,m_fill') }
                            payForName={ this.state.payForName }
                            onHideRewardClick={ this.onCloseReward }
                            onRewardItemClick={ this.onRewardItemClick }
                            rewardPic={this.props.liveInfo.entityExtend.rewardPic}
                            showRewardCard = {false}
                        />
                }
            </Page>
        );
    }
}



function mapStateToProps (state) {
    return {
        sid: state.thousandLive.sid,
        userInfo: state.common.userInfo,
        sysTime: state.common.sysTime,
        topicInfo: state.thousandLive.topicInfo,
        liveInfo:state.thousandLive.liveInfo,
        power: state.thousandLive.power,
        isAlert: state.thousandLive.isAlert,
        userId: state.thousandLive.userId,
        browseNum: state.thousandLive.browseNum,
        isFollow: state.thousandLive.isFollow,
        isCampCourse: state.thousandLive.topicInfo.isCampCourse === 'Y',
        mute: state.thousandLive.mute,
        lshareKey: state.thousandLive.lshareKey,
        commentList: state.thousandLive.commentList.sort(sortBy('createTime')),
        pushStatus: getVal(state, 'thousandLive.pushStatus', 0),
        rewardBulletList: state.thousandLive.rewardBulletList,
        isShowBullet:state.thousandLive.isShowBullet,
        isShootBullet:state.thousandLive.isShootBullet,
        createUser: getVal(state, 'thousandLive.topicInfo.createUser', 0),
    }
}

const mapActionToProps = {
    followLive,
    addComment,
    bannedToPost, 
    deleteComment,
    fetchCommentList,
    startSocket,
    setMute,
    fetchEndTopic,
    getLivePlayUrl,
    getLiveStatus,
    bindShareKey,
    addPageUv,
    updateMute,
    updateCurrentTimeMillis,
    getLiveOnlineNum,
    doPay,
    getOfficialLiveIds
}

module.exports = connect(mapStateToProps, mapActionToProps)(TheLive); 
