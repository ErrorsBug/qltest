'use strict';
import log from '../../comp/log';
import {
    getUserInfo, getVal, imgUrlFormat, formatSecondToTimeStr,
} from '../../comp/util';
import { decode } from '../../comp/querystring'
import { api } from '../../config';
import request from '../../comp/request';
import { AudioPlayer } from '../../comp/audio-player';
import * as regeneratorRuntime from '../../comp/runtime';
import { parse } from '../../comp/we-rich/we-rich';
import { getLastTopicPlayInfo, getHisTopicPlayInfo, saveTopicPlayInfoToHis } from '../../comp/play-history'

const app = getApp();

Page({
    data: {
        /* 基本信息 */
        userInfo: {},
        sysTime: null,

        topicView: {
            topicPo: {},
        },
        profile: [],
        isRebate: false, // 是否返现课程

        /* 评论相关 */
        commentList: [],
        commentPage: 1,
        commentSize: 20,
        lastCommentTime: null,
        commentNoneOne: false,
        commentNoMore: false,

        /* 音频相关 */
        playTime: 0,
        playTimeStr: '00:00',
        duration: 0,
        durationStr: '00:00',
        ratio: 0,
        status: 'stop',
        curPlayIndex: 0,

        playBtnAnimation: {},

        // 是否富文本
        notSummary:true,
        summary:{}
    },
    /* 存储一些因页面销毁后无法拿到data的数据 */
    store: {
        /* 直播间logo */
        liveLogo: '',
    },
    onLoad(options) {
        this.fromDetail = options.fromDetail;

        app.login().then(async() => {
            var that = this;
            global.loggerService.pv()

            getUserInfo().then((userInfoRes) => {
                let topicId = options.topicId
                let scene = decode(decodeURIComponent(options.scene || ''))
                if (scene && scene.topicId) {
                    topicId = scene.topicId
                }
                if (!topicId) { wx.navigateBack() }
                
                that.setData({
                    userInfo: userInfoRes.userInfo,
                    topicId,
                });
                app.showLoading()
                Promise.all([
                    this.initTopicInfo(),
                    this.fetchAudioList()                
                ]).then(() => {
                    app.hideLoading()
                    this.checkHistory()

                    /* 延迟两秒去加载评论，非重要数据，也不会出现在第一屏 */
                    this.commentTimeout = setTimeout(() => { this.loadComment() }, 2000);
                    })
                
                this.getSummary();
                
            }).catch((err) => {
                console.error("请先登陆", err);
            });
            
            // 页面pv日志
            log.pv({
                page: '个人中心',
                url: this.getPageUrl(options)
            });
        });
    },
    onUnload() {
        clearTimeout(this.commentTimeout)
    },
    /* 分享方法 */
    onShareAppMessage(options) {
        return {
            title: getVal(this.data,'topicView.topicPo.topic'),
            path: this.getPageUrl(),
            imageUrl: getVal(this.data, 'topicView.topicPo.backgroundUrl'),
        }
    },
    /* 检测播放历史 */
    checkHistory() {
        const topicId = this.data.topicId
        const history = getHisTopicPlayInfo(topicId)
        const lastTopic = getLastTopicPlayInfo() || {}
        const player = wx.getBackgroundAudioManager()
        
        /* 正在播放的课程都会打历史记录，因此拿最新一条记录与当前课程对比topicId就可以 */
        if (lastTopic.topicId === topicId) {
            const curAudio = this.audioList.find((item, index) => {
                if (item.id === lastTopic.audioId) {
                    this.curPlayIndex = index
                    return true
                }
                return false
            })
            
            /* 如果播放器正在播放，设置播放状态为'playing',否则只更新进度条 */
            if (player.paused === false || player.paused === 0) {
                this.setData({ status: 'playing' })
            } else {
                let curTime = player.currentTime || 0
                const playedTime = this.audioList.slice(0, this.curPlayIndex)
                    .reduce((prev, curr) => prev + curr.second, 0)
                this.updatePlayTime(playedTime + curTime)
                /* 给一个变量保存这条音频的进度 */
                this.nextPlaySeekTo = curTime
            }

            this.initAudioPlayer()
            
        } else {
            player.pause()
        }
    },
    /* 初始化课程信息 */
    initTopicInfo() {
        return request({
            url: api.plainLiveInfo,
            data: {
                topicId: this.data.topicId,
            }
        }).then(res => {
            /* 错误code，有一个就要走啦 */
            const errCode = [403, 404, 10001]
            if (errCode.indexOf(getVal(res, 'data.code')) > -1) {
                // 不能进，回去介绍页
                wx.redirectTo({ url: `/pages/intro-topic/intro-topic?topicId=${this.data.topicId}`})
                return
            }
            this.updateTopicData(res.data)
        }).catch(e => {
            console.error(e)
        })
    },
    /* 更新课程信息 */
    updateTopicData(data){
        let { profile } = this.data
        let {topicView} = data
       
        wx.setNavigationBarTitle({ title: topicView.topicPo.topic})
        let bgUrl = topicView.topicPo.backgroundUrl
        bgUrl = imgUrlFormat(bgUrl, '?x-oss-process=image/resize,h_394,w_630,m_fill') 

        this.store.liveLogo = topicView.topicPo.liveLogo
        this.setData({
            ...data,
            'topicView.topicPo.backgroundUrl': bgUrl,
            profile: data.profile,
            isRebate: topicView.topicPo.isFromRebateChannel === 'Y',
        })
    },

    /********************* 音频相关方法 - start *********************/

    /* 获取语音列表 */
    fetchAudioList() {
        const { topicId } = this.data
        return request({
            url: api.totalSpeakList,
            data: {
                type: 'audio',
                topicId,
            }
        }).then(res => {
            if (getVal(res, 'data.state.code') === 0) {
                let list = getVal(res, 'data.data.speakList', [])
                if (!list.length) {
                    wx.showToast({ title: '暂无可播放的语音' })
                }
                this.updateSpeakList(list)
            }
        })
    },
    /* 语音列表 */
    audioList: [],
    /* 播放音频的index */
    curPlayIndex: 0,
    /* 下次播放跳转到音频对应位置 */
    nextPlaySeekTo: 0,
    /* 更新语音数据 */
    updateSpeakList(list) {

        this.audioList = this.audioList.concat(list)
        let duration = 0
        list.forEach(item => { duration += item.second })
        this.updateDuration(duration)
    },
    /* 更新总时长 */
    updateDuration(val) {
        let { duration, durationStr } = this.data
        duration = val
        durationStr = formatSecondToTimeStr(val)

        this.setData({ duration, durationStr })
    },
    /* 更新已播放时间 */
    updatePlayTime(val) {
        let { playTime, playTimeStr, ratio, duration } = this.data
        playTime = val
        playTimeStr = formatSecondToTimeStr(val)
        /* 同时更新百分比 */
        ratio = duration ? Math.ceil((playTime / duration) * 100) : 0

        this.setData({ playTime, playTimeStr, ratio })
    },
    /* 音频进度条拖动事件s */
    onSliderChange(e) {
        let { duration } = this.data
        let seekTo = Math.ceil(duration * e.detail.value / 100)

        seekTo = seekTo === duration ? seekTo - 1 : seekTo

        let prevAudioSecond = 0
        this.audioList.find((item, index) => {
            if (prevAudioSecond + item.second > seekTo) {
                this.curPlayIndex = index
                return true
            }
            prevAudioSecond += item.second
            return false
        })
        this.updatePlayTime(seekTo)
        this.doPlay(this.curPlayIndex, seekTo - prevAudioSecond)
    },
    /* 音频播放按钮点击事件 */
    onPlayClick() {
        if (!this.player) {
            this.initAudioPlayer()
        }
        let { status, playTime, duration } = this.data

        if (status === 'playing') {
            this.player.pause()
            this.setData({ status: 'paused' })
            return
        }
        if (status === 'stop') {
            this.doPlay(this.curPlayIndex, this.nextPlaySeekTo)
            this.setData({ status: 'playing' })
            //开始播放全局存储音频列表
            wx.setStorage({
                key: "audioList",
                data: this.audioList
            })
            return
        }
        if (status === 'paused') {
            this.player.play()
            this.setData({ status: 'playing' })
            return
        }
    },

    /* 保存播放历史方法加一个锁，防止保存操作太过频繁，现在是一次保存结束两秒后才能做下次保存 */
    saveHistoryLock:false,
    /* 保存播放历史 */
    saveHistory() {
        if (this.saveHistoryLock) { return }

        this.saveHistoryLock = true
        const { data, currentTime, playedTime } = this.player
        const curAudio = this.audioList[this.curPlayIndex]
        const playInfo = {
            second: currentTime,
            title: data.title,
            playedTime: playedTime,
            backgroundImgUrl: this.store.liveLogo,
            
            topicId: curAudio.topicId,
            audioId: curAudio.id,
            audioCreateTime: curAudio.createTime,
        }

        saveTopicPlayInfoToHis(playInfo)

        setTimeout(() => {
            this.saveHistoryLock = false
        }, 2000);
    },
    /* 初始化播放器 */
    initAudioPlayer() {
        const { topicView = {}, userInfo } = this.data
        const { topicPo = {} } = topicView

        this.player = new AudioPlayer({
            title: topicPo.topic,
            coverImgUrl: topicPo.backgroundUrl,
            // system: app.globalData.system,
            singer: userInfo.nickName,
            onPlay: (e) => {
                try {
                    this.setData({ status: 'playing' })
                    
                } catch (error) {
                    // console.error('on play error: ',error)                    
                }
            },
            onPause: (e) => { 
                try {
                    this.setData({ status: 'paused' })
                } catch (error) {
                    // console.error('on pause error: ', error)
                }
            },
            onStop: (e) => {
                try {
                    this.setData({ status: 'stop' })
                } catch (error) {
                    // console.error('on stop error:', error)                    
                }
            },
            onEnded: (e) => {
                try {
                    let { ratio, duration, topicId } = this.data
                    const business_id = getVal(this.audioList, `${this.curPlayIndex}.id`)

                    global.loggerService.event({
                        category: 'finishAudioPlay',
                        action: 'success',
                        business_id,
                        topicId,
                    })
                    
                    if (this.curPlayIndex < this.audioList.length - 1) {
                        this.curPlayIndex++
                        this.doPlay(this.curPlayIndex, 0)
                    } else {
                        this.updatePlayTime(0)
                        this.curPlayIndex = 0
                        this.setData({ status: 'stop' })
                    }
                } catch (error) {
                    if (this.curPlayIndex < this.audioList.length - 1) {
                        this.curPlayIndex++
                        this.doPlay(this.curPlayIndex,0)
                    }
                    // console.error('on ended error:', error)             
                }    
            },
            onTimeUpdate: (e) => { 
                try {
                    let { duration } = this.data

                    /* 拿到当前条的播放时间累加上前面所有音频的时间，除以总时长，就是当前百分比啦 */
                    const curTime = this.player.currentTime
                    const playedTime = this.audioList.slice(0, this.curPlayIndex)
                        .reduce((prev, curr) => prev + curr.second, 0)
                    this.player.playedTime = curTime + playedTime;
                    /* 更新一下播放时间和百分比 */
                    this.updatePlayTime(curTime + playedTime)
                    /* 保存播放历史 */
                    this.saveHistory()
                } catch (error) {
                    this.saveHistory()
                    // console.error('on timeupdate error:', error)             
                }
            },
        })
        /* 自动开始播放 */
        // this.doPlay(1, 0)
    },
    /**
     * 进行播放操作
     *
     * @param {number} index 播放第几条
     * @param {number} second 从第几秒开始
     */
    doPlay(index, second = 0) {
        if (!this.audioList.length) {
            wx.showToast('暂无可播放的语音')
            return
        }
        this.player.startTime = second
        this.player.play(getVal(this.audioList, `${index}`))
        // this.player.seek(second)
    },
    /********************* 音频相关方法 - end *********************/
    

    /********************* 评论相关方法 - start *********************/
    /* 评论请求锁 */
    loadingComment: false,
    /* 加载评论方法 */
    loadComment() {
        if (this.loadingComment) { return }
        const {
            commentPage, commentSize, commentNoMore, commentNoneOne, lastCommentTime,
            liveId, sysTime, topicId,
        } = this.data

        /* 已经加载完毕 */
        if (commentNoMore || commentNoneOne) { return }

        this.loadingComment = true
        request({
            url: api.fetchComment,
            data: {
                liveId: liveId,
                time: lastCommentTime || sysTime,
                topicId: topicId,
                beforeOrAfter: "before",
                page: commentPage,
                size: commentSize,
            },
        }).then(res => {
            this.updateComment(getVal(res, 'data.data.liveCommentViews', []))
            this.loadingComment = false
        }).catch(e => {
            this.loadingComment = false
            console.error(e)
        })
    },
    /* 更新评论数据 */
    updateComment(data) {
        let {
            commentList,
            commentPage, commentSize,
            commentNoneOne, commentNoMore,
            lastCommentTime,
        } = this.data

        commentNoMore = !data.length || data.length < commentSize
        commentNoneOne = !data.length && commentPage === 1

        data = data.filter(item => {
            let { id } = item
            let repeated = commentList.find(comment => comment.id === id)
            if (repeated) {
                return false
            }
            return true
        })

        commentList = commentList.concat(data)
        if (commentList.length) {
            lastCommentTime = getVal(commentList, `${commentList.length - 1}.createTime`)
        }
        /* 虽然后端返回结果没有管传过去的page参数，本地还是保留下来，
           说不定字段以后有用 */
        commentPage += 1

        this.setData({ commentNoMore, commentNoneOne, commentList, commentPage, lastCommentTime })
    },
    /* 评论发送成功后在列表最前面插上这条数据 */
    prependComment(e) {
        const comment = getVal(e, 'detail.comment')
        let { commentList,topicView } = this.data

        /* unshift会返回数组的长度，不要拿来赋值了 */
        commentList.unshift(comment)
        topicView.topicPo.commentNum ++

        this.setData({
            commentList,
            topicView,
        })
    },
    /********************* 评论相关方法 - end *********************/
    
    
    redirectToThousanLive() {
        wx.redirectTo({ url:`/pages/thousand-live/thousand-live?topicId=${this.data.topicId}&fromDetail=Y`})
    },
    getPageUrl(options) {
        let topicId = options ? options.topicId : this.data.topicId
        return this.__route__ + '?topicId=' + topicId;
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
    /* 获取富文本 */
    async getSummary() {
        const { topicId } = this.data
        const result = await request({
            url: '/api/wechat/ueditor/getSummary',
            method: 'POST',
            data: {
                businessId:topicId,
                type:"topic",
            },
        })
        if (getVal(result, 'data.state.code', 1) == 0) {
            let summary = parse(result.data.data.content);
            this.setData({
                summary,
                notSummary:false
            })
        } else {
            this.setData({
                notSummary:true
            })
        }
        
    },
});
