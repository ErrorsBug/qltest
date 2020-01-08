import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import RedpackDialog from '../../../../../thousand-live/containers/topic-thousand-live/components/redpack-dialog';
import SpeakListVideo from '../../../../../thousand-live/containers/topic-thousand-live/components/speak-list-video';
import LuckyMoney from './components/lucky-money';
import { autobind, throttle } from 'core-decorators';
import { createPortal } from 'react-dom';
import SpeakInput from './components/speak-input';
import TopBar from './components/top-bar';
import { AudioPlayer } from 'components/audio-player';
import { startSocket } from 'thousand_live_actions/websocket';
import { locationTo } from 'components/util';
import TipsCard from "components/tips-card";

import { getVal, imgUrlFormat } from 'components/util';

import { doPay, getAllConfig } from 'common_actions/common';
import { getChannelInfo } from '../../../../actions/common';
import { getCouponForIntro } from 'common_actions/coupon';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BottomControlDialog from '../../../../../thousand-live/containers/topic-thousand-live/components/bottom-control-dialog';

import { resetScroll } from 'components/fix-scroll'

import {
    getForumSpeakList,
    revokeForumSpeak,
    addForumSpeak,
    toggleTeacherOnly
} from 'thousand_live_actions/thousand-live-av';

import {
    getGuestList,
    updateMute,
    clearForumSpsakList,
    setCanAddSpeak,
    isSubscribe as fetchSubscribe, 
} from 'thousand_live_actions/thousand-live-common';

import {
    getUserInfo,
} from 'thousand_live_actions/common';

import {
    receiveRedEnvelope,
    getMyReceiveDetail,
    updateRedEnvelope,
    getCouponAllCount,
} from 'thousand_live_actions/thousand-live-normal';

@autobind
class SpeakContainer extends Component {
    state = {
        /*播放音频相关*/
        audioUrl:'',//音频播放路径
        playStatus:'stop',
        playSecond:0,
        audioDuration:0,//音频时长
        // 音频是否正在加载
        audioLoading: false,
        
        //播放过的音频
        recordReaded: {},
        /*是否滚动加载到最后一页*/
        isLastSpeak: false,

        /*赞赏的用户ID*/
        payForId: null,
        payForPortrait: null,
        payForName: null,
        // 课堂红包数据列表
        redEnvelopeList: [],
        // 白名单
        isWhiteLive: 'N',
        // 官方直播间
        isOfficialLive: false,
        // 专业版
        isLiveAdmin: 'N',
        // 是否关注千聊
        subscribe: false,
        // 是否关注三方
        isFocusThree: false,
        // 是否绑定三方
        isBindThird: false,
        showControlDialog: false
    }

    data = {
        // 防止频繁记录
        recordTimeout: true,
        // 是否在加载下一页
        loadingNext: false,

        // 记录浏览位置
        recordTeacher: 0,
        recordAll: 0
    }
    
    /**
     * 图片懒加载方法
     * 
     * @memberof SpeakContainer
     */

    // 图片懒加载的待加载列表
    lazyImgs = [];
    
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
    initLazyImgLinstener() {
        let target = this.refs.topicListContainer;
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
            const pos = imgDom.offsetTop;
            const itemHeight = imgDom.clientHeight;
    
            if (pos < height + st + itemHeight && pos >  st - itemHeight) {
                imgDom.src = imgDom.getAttribute('data-real-src');
                return true;
            } else {
                return false;
            }
        }
    

    // 初始化渲染
    componentDidMount() {
        this.init();
        this.initAudio();
    }

    componentWillUnmount() {
        resetScroll();        
    }

    // 所有需要重复调用的初始化方法
    async init() {
        this.initTopicInfo();
        await this.props.getGuestList(this.props.topicId);
        this.initSpeakList();
        if (this.props.topicInfo.status !== 'ended') {
            if (this.socket) {
                this.socket.onclose = (event) => {
                };
                this.socket.close();
                delete this.socket;
            }
            this.socket = this.props.startSocket(this.props.sid, this.props.topicInfo.sourceTopicId || this.props.topicInfo.id, this.props.currentUserId, this.props.topicInfo.currentTimeMillis);
        }
        // 获取用户基本信息
        await this.props.getUserInfo(this.props.userId, this.props.topicId);
        this.getConfig()
        if(this.props.topicInfo.style === 'videoGraphic'){
            //获取优惠券数目
            this.initCouponCount();
            //获取优惠券是否显示
            this.initCouponOpen();
            
            this.initChannelInfo();
        }
    }
    
    componentWillReceiveProps(nextProps) {
        (nextProps.insertNewMsg && nextProps.insertNewMsg != this.props.insertNewMsg ) && this.newMsgScroll();

        if(nextProps.videoPlaying !== this.props.videoPlaying && nextProps.videoPlaying ){
            this.pauseAudio();   
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.videoTopicInfo !== this.props.videoTopicInfo) {
            await this.props.clearForumSpsakList();
            this.init();
		}
	    if(prevState.playStatus !== this.state.playStatus){
		    this.props.updateReactiveAudioPlayingStatus(this.state.playStatus === 'play')
	    }
    }

    // 获取是否是白名单，专业版，官方直播间，是否关注千聊，是否绑定三方，是否关注三方
    async getConfig(){
        const result = await getAllConfig({liveId: this.props.topicInfo.liveId})
        if(result.state.code === 0){
            this.setState({
                isWhiteLive: result.data.isWhite,
                isLiveAdmin: result.data.isLiveAdmin,
                isOfficialLive: result.data.isOfficialLive
            })
        }
        const isSubscribe = await this.props.fetchSubscribe({liveId: this.props.topicInfo.liveId})
        this.setState({
            subscribe: isSubscribe.subscribe,
            isFocusThree: isSubscribe.isFocusThree,
            isBindThird: isSubscribe.isBindThird
        })
    }
        
    // 同步话题数据
    handleScrollSpeakList(e) {
        this.initLazyImgLinstener();
        this.scrollLoadForumList();

        // 记录浏览位置
        let el = e.currentTarget
        this.recordPosition(el)
    }

    recordPosition (dom) {
        if (this.props.teacherOnly) {
            this.data.recordTeacher = dom.scrollTop
        } else {
            this.data.recordAll = dom.scrollTop
        }
    }

    initTopicInfo() {
        this.props.updateMute(this.props.topicInfo.isBanned);
    }
    
    // 初始化消息流
    async initSpeakList() {
        await this.getForumSpeakList();
        this.setState({
            isLastSpeak:this.props.forumSpeakList.length < 30,
        })
    }

    // 加载发言数据
    async getForumSpeakList(time='0',beforeOrAfter = 'after'){
        if(!this.state.isLoadingForumList){
            this.setState({
                isLoadingForumList : true,
            })
            let result = await this.props.getForumSpeakList(this.props.topicId,time,beforeOrAfter,this.props.teacherOnly?'Y':'N',!this.props.showReword);
            this.setState({
                isLoadingForumList : false,
            })

            return result;
        }else{
            return null;
        }

    }

     // 添加发言
     async addForumSpeak(type,content,second,isShowLoading = true){
        let isReplay = this.state.feedbackTarget ? 'Y' : 'N';
        let relateId = this.state.feedbackTarget ? this.state.feedbackTarget.id : '';
        let imageTextCard = null
        
        if (type === 'image-text-card') {
            imageTextCard = content
            content = ''
        }

        let result = await this.props.addForumSpeak(this.props.topicId, type, content, second||'', isReplay, relateId,isShowLoading, imageTextCard);

        this.setState({
            feedbackTarget : null,
        })
        if(result.state.code != 0){
            window.toast(result.state.msg);
        }
        if (!this.state.isLastSpeak) {
            await this.loadLastMsg(false);
        }

        if(this.props.teacherOnly){
            this.changeNotOnlyTeacher();
        }else{
	        setTimeout(() => {
		        this.scrollToLast(false);
	        }, 0);
        }

        return result;
    }


    // 加载最新的数据
    async loadLastMsg(showTip = true){
        await this.props.clearForumSpsakList();
        await this.getForumSpeakList(Date.now()+86400000,'before');
        this.setState({
            isLastSpeak: true,
        })
        this.props.setCanAddSpeak(true);
        this.scrollToLast(showTip);

    }

    // 滚动加载发言数据
    @throttle(300)
    async scrollLoadForumList() {
        // 锁判断
        if (this.data.loadingNext) {
            return;
        }

        if ( this.props.forumSpeakList.length <= 0 ){
            this.data.loadingNext = false;
           return;
        }

        let el = this.refs.topicListContainer;
        if (!el) {
            return;
        }

        // 正在加载·锁
        this.data.loadingNext = true;

        let pageHeight = el.clientHeight,
            domHeight = el.scrollHeight,
            scrollTop = el.scrollTop,
            ddt = domHeight - scrollTop - pageHeight;

        // 显示回到播放位置
        // this.showGotoPlayHandle(pageHeight, scrollTop);

        if (scrollTop <= 0 && this.props.forumSpeakList[0].type != 'start') {
            this.scrollDirection = 'toTop';
            await this.getForumSpeakList(this.props.forumSpeakList[0].createTime,'before');

        } else if (ddt < 300) {
            this.scrollDirection = 'toBottom';

            if (this.data.listDom) {
                this.lastSpeakItem = this.getLastValidItem();
            }
            await this.getForumSpeakList(this.props.forumSpeakList[this.props.forumSpeakList.length - 1].createTime);
        }

        // 正在加载·开锁
        setTimeout(() => {
            this.data.loadingNext = false;
        })
    }

    // 获取最后一个有效的item，列表中可能存在隐藏的元素，此时offsetTop是0，没法定位位置
    getLastValidItem() {
        let lastItemTop = 0;
        let lastSpeakItem = null;
        let index = this.props.forumSpeakList.length;
        while (index !== 0) {
            let lastItem = this.props.forumSpeakList[--index];
            lastSpeakItem = findDOMNode(this.refs.speakList.refs[`forum-item-${lastItem.id}`]);

            lastItemTop = lastSpeakItem && lastSpeakItem.offsetTop;

            if (lastItemTop && lastItemTop > 0) {
                return lastSpeakItem;
            }
        }

        return null;
    }


    // 滚动到最后
    scrollToLast(showTip = true) {
        try {
            // TODO 如果最后一条没有id，就获取倒数第二条，这个还没做
            this.scrollMsgToView(this.props.forumSpeakList.slice(-1)[0].id);
            showTip && window.toast("已到达最后一条内容");

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * 滚动到某消息
     *
     * @param {any} index
     * @returns
     *
     * @memberof ThousandLiveVideo
     */
    scrollMsgToView(index, withAnimation) {
        let msgDom = findDOMNode(this.refs.speakList.refs['forum-item-'+ index]);
        if (!msgDom) {
            return;
        }

        // 自动滚动不触发用户滚动逻辑
        this.data.recordTimeout = false;

	    if (withAnimation) {
            const doAnimate = () => {
                let startValue = this.refs.topicListContainer.scrollTop,
                    endValue = msgDom.offsetTop - (this.refs.topicListContainer.clientHeight / 2) + (msgDom.clientHeight / 2);

                animation.add({
                    startValue,
                    endValue,
                    step: (v) => {
                        this.refs.topicListContainer.scrollTop = v;
                    },
                    oncomplete: () => {
                        let newEndValue = msgDom.offsetTop - (this.refs.topicListContainer.clientHeight / 2) + (msgDom.clientHeight / 2);
                        if (newEndValue != endValue) {
                            doAnimate();
                        } else {
                            this.data.recordTimeout = true;
                        }
                    }
                });
            };

            doAnimate();
	    } else {
		    setTimeout(() => {
                msgDom.scrollIntoView(true);//自动滚动到视窗内
                
                this.data.recordTimeout = true;
		    }, 300);
	    }

    }

    // 新消息滚动到底部
    async newMsgScroll() {
        let speakListDom = findDOMNode(this.refs.speakList);
        let distanceScrollCount = speakListDom.scrollHeight,
            distanceScroll = speakListDom.scrollTop,
            topicPageHight = speakListDom.clientHeight,
            ddt = distanceScrollCount - distanceScroll - topicPageHight,
            defaultToBottomHeight = 600;
        // ddt: 页面滚动距离底部的距离，如果小于defaultToBottomHeight则在新消息进来时滚动到底部
        if (this.props.canAddSpeak && this.props.isReactiveMode && ddt < defaultToBottomHeight) {
            this.scrollToLast(false);
        }


    }

    async changeOnlyTeacher(){
        await this.props.toggleTeacherOnly(!this.props.teacherOnly);
        await this.props.clearForumSpsakList();
        await this.getForumSpeakList();
        this.setState({
            isLastSpeak:false
        })
        this.props.setCanAddSpeak(false);

        // 跳转到浏览位置
        setTimeout(() => {
            let scrollTo = 0
            if (this.props.teacherOnly) {
                scrollTo = this.data.recordTeacher
            } else {
                scrollTo = this.data.recordAll
            }
            this.refs.topicListContainer.scrollTop = scrollTo
        }, 0)
    }

	async changeNotOnlyTeacher(){
		await this.props.toggleTeacherOnly(false);
		await this.props.clearForumSpsakList();
		await this.getForumSpeakList(Date.now() + 86400000, 'before');
		this.setState({
			isLastSpeak: true
		})
		this.props.setCanAddSpeak(true);
		let msgDom = findDOMNode(this.refs.speakList.refs[`forum-item-${this.props.forumSpeakList[this.props.forumSpeakList.length - 1].id}`]);

		if (!msgDom) {
			return;
		}
		setTimeout(function(){
			msgDom.scrollIntoView(true);//自动滚动到视窗内
		},300)
    }
    

    async initCouponCount(){
        if(this.props.topicInfo.channelId){
            let resultCount = await getCouponAllCount(this.props.topicInfo.liveId,'channel',this.props.topicInfo.channelId);
            this.setState({
                couponCount : resultCount.data.count,
            });
        }else{
            let resultCount = await getCouponAllCount(this.props.topicInfo.liveId,'topic',this.props.topicInfo.id);
            this.setState({
                couponCount : resultCount.data.count,
            });
        }
    }

    
    async initCouponOpen(){
        if(this.props.topicInfo.channelId){
            let resultOpen = await getCouponForIntro(this.props.topicInfo.channelId,'channel');
            this.setState({
                isCouponOpen : getVal(resultOpen, 'data.codePo', false),
            });
        }else{
            let resultOpen = await getCouponForIntro(this.props.topicInfo.id,'topic');
            this.setState({
                isCouponOpen : getVal(resultOpen, 'data.codePo', false),
            });
        }
        
    }

    
    /** 系列课信息 */
    async initChannelInfo(){
        if(this.props.topicInfo.channelId) {
            try {
                const result = await this.props.getChannelInfo({
                    channelId: this.props.topicInfo.channelId
                });
                this.setState({
                    channelCharge: getVal(result, 'data.chargeConfigs',[]),
                });
            } catch (error) {
                console.error(error);
            }
        }
        
    }

    /********** 播放音频部分 start **********/
    initAudio(){
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.on("timeupdate",this.audioTimeupdate);
        this.audioPlayer.on('ended',this.audioEnded);
        this.audioPlayer.on('pause',this.audioPause);
        this.audioPlayer.on('playing',this.audioPlaying);
    }

    audioTimeupdate(e){
        this.setState({
            playSecond:this.audioPlayer.currentTime,
            audioDuration:this.audioPlayer.duration
        })

        if(this.state.audioLoading){
            this.setState({
                audioLoading : false,
            })
        }
    }

    audioEnded(e){
        // this.props.setLiveVolume(1);

        let nextAudioMsg = this.nextAudio();

        this.setState({
            playSecond:0,
            audioDuration:0.01,
            playStatus:'ready',
            audioLoading:false,
            audioUrl: '',
            audioMsgId:'',
        });

        if (nextAudioMsg){
            this.playAudio(nextAudioMsg.id, true);
        }

    }

    audioPause(e){
        // this.props.setLiveVolume(1);
        this.setState({
            playStatus:'pause',
        })
    }

    /**
     * 获取下一条音频
     * 
     * @readonly
     *
     * @memberof ThousandLiveVideo
     */
    nextAudio(){
        let nextAudioMsg;
        // 音频列表
        let audioList = this.props.totalSpeakList.filter((item) => {
            return /(audio|mic\-audio)/gi.test(item.type);
        })
        this.data.audioUrlList = audioList;
        let audioIndex = audioList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });

        audioIndex++;
        if (audioIndex < audioList.length) {
            nextAudioMsg = audioList[audioIndex];
        }else{
            nextAudioMsg = false;
        }

        return nextAudioMsg;
    }
    
    audioPlaying(e) {
        this.setState({
            playStatus:'play',
            audioLoading: false,
        });

        //预加载
        let nextAudioMsg = this.nextAudio();
        if (nextAudioMsg) {
            this.audioPlayer.preLoad(nextAudioMsg.content);
        }


        /**
         * 延时执行，防止自动滚动过程中改变消息数目
         */
        setTimeout(() => {
            this.tryLoadMsg();
        }, 400);
    }

    /**
     * 连续播放兼容
     * 播放音频时检测是否最后一条是否还有后续数据，加载下一页
     *
     * @param {any} url
     * @memberof ThousandLiveVideo
     */
    async tryLoadMsg(){
        let arrIndex = this.data.audioUrlList.findIndex((item, index, arr) => {
            return item.id == this.state.audioMsgId;
        });
        if (!this.props.noMore && arrIndex > -1  && arrIndex  ==  this.data.audioUrlList.length - 1 ) {
            console.log('当前最后一条音频，尝试加载更多');
            await this.getForumSpeakList({time:this.props.forumSpeakList[this.props.forumSpeakList.length - 1].createTime});

            // 加载完后若有新的需要滚动到的音频，滚
            let needGotoPlayingMsg = Date.now() - this.data.lastScrollTime > 10000;

            if (needGotoPlayingMsg && this.data.autoPlayAudioIndex) {
                // 根据旧的audioIndex获取下一条index
                let preIndex = 0;
                this.props.forumSpeakList.find((item, index) => {
                    if (item.id == this.data.autoPlayAudioIndex) {
                        preIndex = index;
                    } 
                    return false;
                });

                let next = this.props.forumSpeakList.slice(preIndex + 1).find(item => {
                    return /(audio|mic\-audio)/gi.test(item.type);
                });

                if (next && !this.state.audioUrl) {
                    this.playAudio(next.id, true);
                }
            }
        }
    }


    /**
     *
     * 回到播放位置
     *
     * @memberof ThousandLiveVideo
     */
    gotoPlayingMsg(){
        this.scrollToSpeak(this.state.audioMsgId, true);
    }


    // 播放音频
    async playAudio(id, needGotoPlayingMsg) {

        // 获取要播放的音频所在总列表下标
        let audioIndex = this.props.totalSpeakList.findIndex((item, index, arr) => {
            return item.id == id;
        });
        // 获取音频消息
        let audioMsg = this.props.totalSpeakList[audioIndex];
        // 获取音频路径
        let url = audioMsg.content;


        if(this.state.audioMsgId != id){
            this.setState({
                playSecond:0,
                audioDuration:0,
                audioUrl:url,
                playStatus: 'play',
                audioMsgId: audioMsg.id,
            })
            this.audioPlayer.volume=1;
            this.audioPlayer.play(url);
        } else {
            this.setState({
                playStatus: 'play',
                audioMsgId: audioMsg.id,
            })
            this.audioPlayer.resume();
        }
        
        // 记录音频播放ref
        this.data.audioIndex = id;

        this.setState({
            audioLoading : true,
        });



        if (needGotoPlayingMsg) {
            /**
             * 10秒前无滚动操作，将跳到正在播放的音频的位置
             */
            needGotoPlayingMsg = Date.now() - this.data.lastScrollTime > 10000;
            
            if (needGotoPlayingMsg) {
                // 记下本次自动滚动的音频ref
                this.data.autoPlayAudioIndex = id;
                this.gotoPlayingMsg();
            }
        }
    }

    // 暂停音频
    async pauseAudio(){
        this.audioPlayer.pause();
        this.setState({
            playStatus:'pause'
        })
    }

    // 拖放音频
    async setAudioSeek(percent){
        this.audioPlayer.pause();
        let currentTime = parseInt(this.state.audioDuration * percent / 100);
        this.audioPlayer.currentTime = currentTime;
        this.audioPlayer.seek(currentTime);
        this.audioPlayer.resume();
        this.setState({
            playStatus:'play'
        });
    }

    /********** 播放音频部分 end **********/



    /**
     *
     * 打开赞赏弹框
     *
     * @memberOf ThousandLiveVideo
     */
    onOpenReward(userId, headImgUrl, name) {
        if(this.props.userId == userId){
            window.toast('不能赞赏自己');
        }else{
            this.setState({
                showLuckyMoney: true,
                payForId: userId,
                payForPortrait: headImgUrl,
                payForName: name,
            });
        }
    }

    /**
     * 关闭赞赏弹框
     *
     * @memberOf ThousandLiveVideo
     */
    onCloseReward() {
        this.setState({
            showLuckyMoney: false
        });
    }

     /**
     * 赞赏金额点击事件
     *
     * @memberOf ThousandLiveVideo
     */
    onRewardItemClick(money) {
        if(this.props.userId == this.state.payForId){
            window.toast('不能赞赏自己');

        }else{
            this.props.doPay({
                type: 'REWARD',
                total_fee: money,
                topicId: this.props.topicId,
                liveId: this.props.topicInfo.liveId,
                toUserId: this.state.payForId,
                callback: () => {
                    this.onCloseReward();
                },
            })
        }
    }

    /************课堂红包相关开始***************/

    // 红包点击
    async redpackClick(props, type, hasOpenedByMe){
        // 曝光日志收集
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
        // 过期红包和已经领完的红包不能点
        if(type === 'expiry'){
            window.toast(`该红包已过期`)
            return
        }
        if(type === 'empty'){
            window.toast(`该红包已领完`)
            return
        }
        // 自己已经点过红包
        if(hasOpenedByMe){
            // 请求锁
            if(this.openLock) {
                return
            }
            this.openLock = true
            let redEnvelopeList = this.state.redEnvelopeList
            // 从state中查找是否已经开启相应的红包，有的话直接拿数据，没有的话就请求接口并将数据存入state
            let currentRedEnvelope = redEnvelopeList.find(item => item.id == props.relateId)
            if(currentRedEnvelope){
                this.redpackDialogEle.show(props, currentRedEnvelope)
            }else {
                const result = await getMyReceiveDetail(props.relateId)
                let item = {
                    ...result.detailDto,
                    id: props.relateId,
                    money: result.detailDto && result.detailDto.realMoney || 0,
                }
                // 有正确的请求结果才存到state
                if(result && result.detailDto){
                    redEnvelopeList.push(item)
                    this.setState({redEnvelopeList})
                    this.redpackDialogEle.show(props, item)
                }
            }
        }else {
            this.redpackDialogEle.show(props)
        }
    }

    // 请求解锁
    unLockRequest(){
        this.openLock = false
    }

    // 打开红包
    async openRedpack(id){
        let redEnvelopeList = this.state.redEnvelopeList
        let result = await receiveRedEnvelope(id)
        await this.props.updateRedEnvelope(id, result.acceptResult)
        redEnvelopeList.push({
            id,
            ...result
        })
        this.setState({redEnvelopeList})
        return result
    }

    // 跳转到分享榜页面
    locationToShare(id){
        // 系列课下的话题，都跳转到系列课分享卡页面，其余跳转到话题分享卡页面
        let type = 'topic'
        if(this.props.topicInfo.channelId){
            type = 'channel'
        }
        locationTo(`/wechat/page/sharecard?wcl=redEnvelope&redEnvelopeId=${id}&type=${type}&${type}Id=${type === 'topic' ? this.props.topicInfo.id : this.props.topicInfo.channelId}&liveId=${this.props.topicInfo.liveId}`)
    }
    /************课堂红包相关结束***************/

    hideControlDialog() {
        this.setState({
            showControlDialog: false
        })
        resetScroll()
    }

    showBottomControl () {
		this.setState({
			showControlDialog: true
		});
	}

    render() {
        if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-low");

        if (!portalBody) {
            return null;
        }

        return (
            <div className='video-speak-container'>
                <TopBar
                    topicId={this.props.topicId}
                    topicInfo={this.props.topicInfo}

                    liveStatus={this.props.liveStatus}
                    renderProp={this.props.renderProp}
                />    
                <div
                    className="flex-main-s speak-main-flex"
                    id="main-scroll-area"
                    onScroll={this.handleScrollSpeakList}
                    onTouchMove={e=>{this.handleScrollSpeakList(e);}}
                    onWheel={e=>{this.handleScrollSpeakList(e);}}
                    ref='topicListContainer'
                >
                    <TipsCard type="create-live" chtype={`create-live_${this.props.topicInfo.style}`}   />
                    
                    {/* 社群入口组件 */}
                    {this.props.groupComponent}
                    {/* 社群入口组件 */}
                    
                    <SpeakListVideo
                        ref = 'speakList'
                        forumSpeakList = {this.props.forumSpeakList}
                        delSpeakIdList={this.props.delSpeakIdList}
                        onRewardClick={this.onOpenReward}
                        playAudio={this.playAudio}
                        pauseAudio={this.pauseAudio}
                        setAudioSeek={this.setAudioSeek}
                        playStatus={this.state.playStatus}
                        audioUrl={this.state.audioUrl}
                        audioMsgId={this.state.audioMsgId}
                        playSecond={this.state.playSecond}
                        audioDuration={this.state.audioDuration}
                        showReword={true}
                        power={this.props.power}
                        onFeedback={()=>{} }
                        userId={this.props.userId}
                        inviteListArr={this.props.inviteListArr}
                        topicStyle = {this.props.topicInfo.style}
                        isEnableReward = {this.props.topicInfo.isEnableReward}
                        revokeForumSpeak = {this.props.revokeForumSpeak}
                        liveBanned = {this.props.liveBanned}
                        topicId = {this.props.topicId}
                        liveId = {this.props.topicInfo.liveId}
                        audioLoading={this.state.audioLoading}
                        userInfo = {this.props.userInfo}
                        showCard = {`N`}
                        redpackClick = {this.redpackClick}
                        locationToShare = {this.locationToShare}
                        topicInfo = {this.props.topicInfo}
                        couponCount ={this.state.couponCount||0}
                        isCouponOpen = {this.state.isCouponOpen}
                        isCampCourse={!!this.props.topicInfo.campId}
                        channelCharge = {this.state.channelCharge||[]}
                    />
                </div>
                <SpeakInput
                    changeMode={this.props.changeMode}
                    mute={this.props.mute}
                    addForumSpeak={this.addForumSpeak}
                    topicInfo={this.props.topicInfo}
                    topicEnded={this.props.topicInfo.status == 'ended'}
                    topicStyle={this.props.topicInfo.style}
                    currentIndex={this.props.currentIndex}
                    showBottomControl={this.showBottomControl}
                />


                {/*赞赏弹框*/}
                {
                    this.state.showLuckyMoney &&
                    createPortal(
                        <LuckyMoney
                            rewardPrice = {this.props.liveInfo.entityExtend.rewardPrice}
                            rewardIntroduce = {this.props.liveInfo.entityExtend.rewardIntroduce}
                            payForHead={ imgUrlFormat(this.state.payForPortrait, '?x-oss-process=image/resize,h_50,w_50,m_fill') }
                            payForName={ this.state.payForName }
                            onRewardClick={ this.onCloseReward }
                            onRewardItemClick={ this.onRewardItemClick }
                        />
                    ,
                    portalBody)  
                }

                {/* 抢红包弹窗 */}
                {
                    createPortal(
                        <RedpackDialog 
                            ref = {el => this.redpackDialogEle = el}
                            liveName = {this.props.liveInfo.entity.name}
                            power = {this.props.power}
                            isWhiteLive={this.state.isWhiteLive}
                            isLiveAdmin = {this.state.isLiveAdmin}
                            isBindThird = {this.state.isBindThird}
                            topicInfo = {this.props.topicInfo}
                            openRedpack = {this.openRedpack}
                            unLockRequest = {this.unLockRequest}
                        />,portalBody
                    )
                }

                					 

                    {
                        
                        this.state.showControlDialog &&
                        createPortal(
                            <ReactCSSTransitionGroup
                                transitionName="thousand-live-animation-oprationList"
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={500}>
                                <BottomControlDialog
                                    customerClassName="video-speaker-bottom"
                                    topicInfo = {this.props.topicInfo}
                                    isShow = {this.state.showControlDialog}
                                    excludeItems = {['gotoTop', 'liveIntro', 'shareFile']}
                                    onCloseSettings = {this.hideControlDialog}
                                    liveId = {this.props.topicInfo.liveId}
                                    teacherOnly = {this.props.teacherOnly}
                                    toggleTeacherOnly = {this.changeOnlyTeacher}
                                    topicId = {this.props.topicInfo.id}
                                    power = {this.props.power}
                                    topicStatus = {this.props.topicInfo.status}
                                />
                            </ReactCSSTransitionGroup>,portalBody
                        )
                    }

            </div>
        );
    }
}

SpeakContainer.childContextTypes = {
    lazyImg: PropTypes.object
  };


function mapStateToProps (state) {
    return {
        userInfo: state.common.userInfo,
        sid: state.video.sid,
        currentUserId: state.thousandLive.currentUserId,
        forumSpeakList: state.thousandLive.forumSpeakList,
        totalSpeakList: state.thousandLive.totalSpeakList,
        power: state.video.power,
        topicInfo:getVal(state, 'thousandLive.topicInfo',{}),
        videoTopicInfo:getVal(state, 'video.topicInfo',{}),
        liveInfo:getVal(state, 'video.liveInfo',{}),
        teacherOnly:getVal(state, 'thousandLive.teacherOnly',true),
        inviteListArr:getVal(state, 'thousandLive.inviteListArr',{}),
        mute: getVal(state, 'thousandLive.mute', false),
        userId: state.video.userId,
        insertNewMsg: state.thousandLive.insertNewMsg,
        canAddSpeak: state.thousandLive.canAddSpeak,
        isSubscribe: state.thousandLive.isSubscribe,
	}
}

const mapActionToProps = {
    startSocket,
    getForumSpeakList,
    addForumSpeak,
    getGuestList,
    updateMute,
    clearForumSpsakList,
    setCanAddSpeak,
    toggleTeacherOnly,
    doPay,
    revokeForumSpeak,
    getUserInfo,
    updateRedEnvelope,
    fetchSubscribe,
    getChannelInfo,
};

module.exports = connect(mapStateToProps, mapActionToProps)(SpeakContainer);