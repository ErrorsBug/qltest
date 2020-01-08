//index.js
//获取应用实例
var app = getApp();
// import Promise from 'es6-promise';

import log from '../../comp/log';
import { linkTo, getLoginSessionId, getVal, normalFilter } from '../../comp/util';
// import order from '../../comp/order';
import { AudioPlayer } from '../../comp/audio-player';
import { digitFormat } from '../../comp/filter';
import { getHisTopicPlayInfo, saveTopicPlayInfoToHis, getLastTopicPlayInfo} from '../../comp/play-history';
// import { getMsg } from './get-msg';
import { api } from '../../config';
// import { BackAudioPlayer } from './back-audio2';
import request from '../../comp/request';
import bufferQueue from '../../comp/buffer-queue';
import { AudioPlayRecordService } from './services/audio-play-record.service'

Page({
    veryOldTime: '1120752000000',
    // websocket关闭后是否自动重连
    websocketCloseReConnect: true,
    // 是否连播
    autoPlay: true,

    // 当前播放语音索引
    currentAudioIndex: -1,

    // 发言每次加载数据条数
    speakPageSize: 20,

    audioList: [],

    data: {
        liveId: '',
        topicId: '',

        /*****页面状态变量******/
        showMain: false,
        isPPTMode: false,/*是不是PPT模式*/
        isShowPPT: false,/*是否展示PPT*/
        isShowCommentDialog: false,/*是否显示评论列表*/
        // isShowTyping: false,// 是否显示正在输入中
        isFirstLoadComment: true,
        isShowRewardDialog: false,
        isShowBarrage: true,
        isShowOperationDialog: false, // 是否显示操作菜单

        activeSpeakItem: {},


        /******页面数据******/
        topicName: "",
        backgroundUrl: "",
        topicStartTimeView: "",
        liveName: "",
        liveLogo: "",
        liveFakeStatus: "end",
        onlineNum: 0,
        typingName: '',// 正在输入中的名字

        // 发言列表滚动位置
        speakListScrollTop: 0,
        // 发言列表是否加载完顶部
        isLoadFirstSpeak: false,


        // 发言列表状态
        speakListToViewId: '',

        /*正在播放数据*/
        playingSpeakPercent: 0,
        playingSpeakDuration: 0,
        playingSpeakStatus: 'stoped',
        audioSlidertouch: false,

        // PPT文件列表
        pptList: [],
        ppt: {
            indicatorDots: false,
            autoplay: false,
            interval: 5000,
            duration: 1000,
            index: 0,
        },
        pptIndex: 0,

        // 赞赏相关信息
        rewardIntroduce: "",
        rewardPic: "",
        rewardPrice: [],

        /*websocket数据*/
        socketData: {
            prevTime: "",
            idx: 0,
        },

        // 发言完整列表（排重后的列表）
        speakList: [],
        // 语音列表
        audioList: [],
        // 图片列表
        imgList: [],

        // 评论列表
        commentList: [],

        // 总评论数
        commentNum: 0,
        // 评论加载中状态
        isCommentLoading: false,
        // 评论加载完历史
        isNomoreComment: false,

        hideTipsModal: true,
        
        // 链接上带进来的shareKey
        shareKey: '',
        // 链接上带进来的别人的lsharekey
        lshareKeyOfThire: '',
        // 请求自己的分销关系自己的lsharekey
        lshareKeyOfMine: '',

        isLoadingLower: false,
        isLoadingUpper: false,

        // 用于传递给子组件，触发滚动定位到指定speakId（小程序嵌套组件不支持直接滚动定位到子组件元素）
        topSpeakId: '',
        diffTime: 0,//开播时间距离现在时间
    },

    onLoad(options) {
        // options.topicId = "100008299000342";
        //  options.topicId = "290000208034532";
        app.login().then(() => {
            global.loggerService.pv()

            // 无效参数，返回上级页
            if (!options.topicId) {
                wx.navigateBack();
                return;
            }

            // 设置导航条
            this.setNavigationBar();

            app.showLoading();

            // 初始化直播间分销参数
            this.initLshareKey(options);

            // 加载初始化数据
            this.fetchInitData(options.topicId, options.fromDetail)
                .then((res) => {
                    if (!res) {
                        return;
                    }
                    /* 音频播放本地记录服务 */
                    this.audioPlayRecordService = new AudioPlayRecordService()
                    this.initPage(res.data);

                    // 获取PPT数据
                    this.loadPPTList();

                    // 加载评论数据
                    this.initCommentTimeout = setTimeout(() => {
                        this.initComment();
                    }, 3000);
                })
                .then(() => {
                    // 获取直播间分销配置
                    this.fetchShareQualify();
                })
                .then(() => {
                    // 绑定分销关系
                    this.bindShare();
                });

            // 页面pv日志
            // log.pv({
            //     page: '课程详情页',
            //     url: this.getPageUrl(options)
            // });

            request({
                url: api.topicPageUv,
	            method: 'POST',
	            data: {
		            caller: 'weapp',
		            topicId: options.topicId,
	            }
            })

        });
    },

    /**
     * 导航条样式定制
     */
    setNavigationBar() {
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#fafafa',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        });
    },
    initLshareKey(options) {
        if (options.lshareKey) {
            this.setData({
                lshareKeyOfThire: options.lshareKey
            });
        }
        if (options.shareKey) {
            this.setData({
                shareKey: options.shareKey
            });
        }
    },

    // 获取直播间分销shareKey
    fetchShareQualify() {
        request({
            url: api.liveShareQualify,
            data: {
                caller: 'weapp',
                liveId: this.data.liveId,
            }
        }).then(result => {
            if (getVal(result, 'data.state.code') == 0 && getVal(result, 'data.data.shareQualify') != null) {
                this.setData({
                    lshareKeyOfMine: getVal(result, 'data.data.shareQualify.shareKey')
                });
            }
        });
    },

    // 绑定分销关系
    bindShare() {
        if (this.data.lshareKeyOfThire && this.data.lshareKeyOfThire != 'null') {
            request({
                url: api.bindLiveShare,
                method: 'POST',
                data: {
                    liveId: this.data.liveId,
                    shareKey: this.data.lshareKeyOfThire
                }
            }).then(resp => {
                if (getVal(resp, 'data.data.bind') === 'Y') {
                    // eventLog({
                    //     category: 'shareBind',
                    //     action:'success',
                    //     business_id: this.data.channelId,
                    //     business_type: 'channel',
                    // });
                }
            })
        }
    },

    // getPageUrl(options) {
    //     return this.__route__ + '?topicId=' + options.topicId;
    // },

    /**
     * 获取初始化数据
     *
     * @param {any} id
     */
    fetchInitData(topicId, fromDetail) {
        return request({
            url: api.thousandLiveInit,
            data: {
                topicId,
            }
        }).then(res => {
            app.hideLoading();

            if (res.data.code == 404) {
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    confirmText: '返回首页',
                    showCancel: false,
                    success: function () {
                        wx.redirectTo({
                            url: '/pages/index/index'
                        });
                    }
                });

                return;
            }

            if (getVal(res, 'data.topicView.topicPo.displayStatus', 'Y') == 'N') {
                wx.showModal({
                    title: '提示',
                    content: '该课程已下架',
                    confirmText: '返回',
                    showCancel: false,
                    success: function () {
                        const liveId = getVal(res, 'data.liveInfo.entity.id');
                        wx.redirectTo({
                            url: `/pages/live-index/live-index?liveId=${liveId}`
                        });
                    }
                });

                return;
            }

            let style = getVal(res, 'data.topicView.topicPo.style', '');
            let currentTimeMillis = getVal(res, 'data.currentTimeMillis');
            let startTime = getVal(res, 'data.topicView.topicPo.startTime');
            let endTime = getVal(res, 'data.topicView.topicPo.endTime');
            let diffTime = currentTimeMillis - startTime;
            diffTime = diffTime / 3600000;
            this.setData({diffTime});

            if (res && res.data.code && (res.data.code == 10001 || res.data.code == 404)) {
                wx.navigateBack();
                return;
            } else if (res && res.data.code && res.data.code == 403) {
                wx.redirectTo({
                    url: `/pages/intro-topic/intro-topic?topicId=${topicId}&lshareKey=${this.data.lshareKeyOfThire}&shareKey=${this.data.shareKey}`,
                });
                return;
            } else if (style === 'video' || style === 'audio') {
                // 如果音视频直播就跳转到webview
                let url = `/topic/details-video?topicId=${topicId}&weapp=Y&lshareKey=${this.data.lshareKeyOfThire}`;
                url = encodeURIComponent(url);

                wx.redirectTo({
                    url: '/pages/web-page/web-page?url=' + url
                });
                return res;
            } else if (style === 'videoGraphic' || style === 'audioGraphic') {
                // 如果音视频录播也跳转到webview
                let url = `/topic/details-audio-graphic?topicId=${topicId}&weapp=Y&lshareKey=${this.data.lshareKeyOfThire}`;
                url = encodeURIComponent(url);

                wx.redirectTo({
                    url: '/pages/web-page/web-page?url=' + url
                });
                return res;

                // wx.showModal({
                //     title: '提示',
                //     content: '小程序暂不支持音视频录播课程',
                //     confirmText: '返回',
                //     showCancel: false,
                //     success: function () {
                //         wx.redirectTo({
                //             url: '/pages/index/index'
                //         });
                //     }
                // });

                // return;
            } else if (fromDetail != 'Y' && (diffTime > 2 || endTime < new Date().getTime())) {
                // 如果已开播两个小时或者直播已经结束就跳转到极简模式
                wx.redirectTo({
                    url: `/pages/topic-listening/topic-listening?topicId=${topicId}&fromDetail=Y&lshareKey=${this.data.lshareKeyOfThire}`
                });
                return res;
            } else {
                // 显示页面
                this.setData({
                    showMain: true,
                });
                return res;
            }
            //that.getOtherInfo();
        }).catch(err => {
            console.error(err);
        });;
    },

    /**
     * 初始化页面
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    initPage(data) {
        // 自动播放开关
        this.autoPlay = (data.isAuth === 'Y' || !data.isAuth)? true: false;

        let initData = {
            'topicView': data.topicView,
            'topicPo': data.topicView.topicPo,
            'userPo': data.userPo || {},
            'currentTimeMillis': data.currentTimeMillis,
            'topicName': data.topicView.topicPo.topic,
            'backgroundUrl': data.topicView.topicPo.backgroundUrl,
            'topicStartTimeView': data.topicView.topicPo.startTimeStamp,
            'startTime': data.topicView.topicPo.startTime,
            'liveName': data.liveInfo.entity.name,
            'liveLogo': data.liveInfo.entity.logo,
            'isPPTMode': data.topicView.topicPo.style == "ppt" ? true : false,
            'liveStatus': data.topicView.topicPo.status,
            'liveId': data.topicView.topicPo.liveId,
            'topicId': data.topicView.topicPo.id,
            'isCommentBanned': data.topicView.topicPo.isBanned !="Y"?false:true,
            // 'power': data.power,
            "commentNum": data.topicView.topicPo.commentNum,
            "onlineNum": digitFormat(data.topicView.topicPo.browseNum,10000),
        };

        if (typeof (data.liveInfo.entityExtend.rewardPrice) == "string") {
            let rewardPrice = (data.liveInfo.entityExtend.rewardPrice).split(";");
            initData = {
                ...initData,
                "rewardIntroduce": data.liveInfo.entityExtend.rewardIntroduce,
                "rewardPic": data.liveInfo.entityExtend.rewardPic || '',
                "rewardPrice": rewardPrice,
            }
        }

        this.setData(initData, () => {
            this.topicId = this.data.topicId;
            this.topicName = this.data.topicName;
            this.liveLogo = this.data.liveLogo;

            wx.setNavigationBarTitle({
                title: data.topicView.topicPo.topic || '千聊',
            });

            // 初始化发言列表
            this.initSpeakList();
        });
    },

    /**
     * 获取发言列表初始化时的加载起点时间
     * @return {[type]} [description]
     */
    initSpeakList() {
        let loadTime;
        let beforeOrAfter;

        let hisTopicPlayInfo = getHisTopicPlayInfo(this.data.topicId);

        // 已开播且开播时间小于2小时或者未开播，则加载最后30条
        if (this.data.topicPo && this.data.topicPo.status != "ended" && (this.data.currentTimeMillis <= (this.data.topicPo.startTime + 7200000))) {

            loadTime = this.data.currentTimeMillis + 3600000;
            beforeOrAfter = 'before';
        // 有播放历史，则从历史位置加载
        } else if (hisTopicPlayInfo && hisTopicPlayInfo.audioCreateTime) {
            loadTime = hisTopicPlayInfo.audioCreateTime;
            beforeOrAfter = 'after';

            // 顶部插入”上次看到这里了”
            this.addLastViewTips(loadTime);

        // 其它情况从第一条加载（已开播且大于2小时、已结束）
        } else {
            loadTime = this.veryOldTime;
            beforeOrAfter = 'after';
        }

        this.loadSpeak(loadTime, this.speakPageSize, beforeOrAfter).then(res => {
            // 初始化音频播放器
            this.initAudioPlayer();
            // 初始化websocket
            this.webSocketInit();
        }).catch(err => {
            console.error(err);
        });
    },
    /**
     * 初始化音频播放器
     * @return {[type]} [description]
     */
    initAudioPlayer() {
        this.audioPlayer = new AudioPlayer({
            title: this.data.topicName,
            coverImgUrl: this.data.backgroundUrl,
            singer: this.data.userPo.name,
            onWaiting: (e) => {
                try {
                    this.setData({
                        playingSpeakStatus: 'waiting',
                    });
                } catch (err) {
                    console.log(err);
                }
            },
            onCanplay: (e) => {
                try {
                    this.setData({
                        playingSpeakStatus: 'playing',
                    });
                } catch (err) {
                    console.log(err);
                }
            },
            onPlay: (e) => {
                try {
                    this.setData({
                        playingSpeakStatus: 'playing',
                    });
                } catch (err) {
                    console.log(err);
                }
            },
            onPause: (e) => {
                try {
                    this.setData({
                        playingSpeakStatus: 'paused',
                    });
                } catch (err) {
                    console.log(err);
                }
            },
            onStop: (e) => {
                try {
                    this.setData({
                        playingSpeakStatus: 'stoped',
                        playingSpeakPercent: 0,
                    });
                } catch (err) {
                    console.log(err);
                }
            },
            onEnded: (e) => {
                try {
                    const business_id = this.audioList[this.currentAudioIndex].id
                    global.loggerService.event({
                        category: 'finishAudioPlay',
                        action: 'success',
                        business_id,
                        topicId: this.topicId ,
                    })
                    this.setData({
                        playingSpeakStatus: 'ended',
                        playingSpeakPercent: 0,
                    });
                } catch (err) {
                    console.log(err);
                }

                if (this.autoPlay) {
                    this.playNextAudio();
                }
            },
            onTimeUpdate: (e) => {
                try {
                    if (this.data.playingSpeakStatus != 'playing') {
                        this.setData({
                            playingSpeakStatus: 'playing',
                        });
                    }

                    if (this.audioPlayer.duration) {
                        let second = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
                        if (!this.data.audioSlidertouch) {
                            this.setData({
                                playingSpeakPercent: second,
                                playingSpeakDuration: this.audioPlayer.duration
                            });
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            onPrev: (e) => {
                this.playPrevAudio();
            },
            onNext: (e) => {
                this.playNextAudio();
            }
        });

        const player = wx.getBackgroundAudioManager();
        const lastPlayTopicInfo = getLastTopicPlayInfo();

        // 正在播放 且为当前课程的音频
        if ((player.paused === false || player.paused === 0) && lastPlayTopicInfo && lastPlayTopicInfo.topicId === this.data.topicId) {

            let matched = false;
            let index = -1;
            let playingUrl = player.src;
            for (var i = 0, len = this.audioList.length; i < len; i++) {
                let speak = this.audioList[i];

                // 匹配在播音频
                if (speak.content.indexOf(playingUrl.replace(/(.*\/)/, "").replace(/(\..*)/, "")) > -1) {
                    matched = true;
                    index = i;
                    break;
                }
            }

            // 当前语音列表中匹配到在播放音频时，续播
            if (matched) {
                this.currentAudioIndex = index;

                this.setData({
                    playingSpeakId: this.audioList[index].id,
                    playingSpeakStatus: 'playing'
                });
            }
        // 其它情况
        } else {
            // 自动播放
            if (this.autoPlay) {
                this.playNextAudio();

            // 停止播放
            } else {
                this.audioPlayer.stop();
            }
        }
    },
    updatePPTIndex() {
        let fileId;
        let pptIndex;
        const { pptList } = this.data

        for (var speak of this.data.speakList) {
            if (speak.id === this.data.playingSpeakId) {
                fileId = speak.fileId;
                break;
            }
        }
        for (var idx = 0, len = pptList.length; idx < len; idx++) {
            let ppt = pptList[idx];
            if (ppt.fileId === fileId) {
                pptIndex = idx;
                break;
            }
        }
        if (pptIndex != undefined) {
            this.setData({
                "pptIndex": pptIndex,
            });
        }
    },
    /**
     * 指定发言（音频）id播放音频
     * @param  {[type]} audioId [description]
     * @return {[type]}         [description]
     */
    playAudio(audioId) {
        let speak;
        for(var item of this.audioList) {
            if (item.id === audioId) {
                speak = item;
                break;
            }
        }
        if (speak && speak.content && speak.type === 'audio') {
            let { speakList } = this.data

            this.audioPlayer.play(speak);
            this.audioPlayRecordService.updateRecord(this.data.topicId, audioId)
            
            speakList.find(item =>
            {
                if (item.id === audioId) {
                    item.hasread = true
                }
            })

            try {
                this.setData({
                    playingSpeakId: audioId,
                    speakList,
                });

                if (this.data.isPPTMode) {
                    this.updatePPTIndex();
                }
            } catch (err) {
                console.log(err)
            }

            // setTimeout(() => {
            //     this.gotoPlaying();
            // }, 100);

            // 记录历史
            saveTopicPlayInfoToHis({
                topicId: this.topicId,
                // second: topicPlayInfo.second,
                title: this.topicName,
                audioId: audioId,
                audioCreateTime: speak.createTime,
                diffTime: this.data.diffTime,
                backgroundImgUrl: this.liveLogo,
            })
            //开始播放全局存储音频列表
            wx.setStorage({
                key: "audioList",
                data: this.audioList
            })
        }
    },
    /**
     * 播放下一个音频
     * @return {[type]} [description]
     */
    playNextAudio() {
        this.currentAudioIndex += 1;

        // 存在索引位置则播放下一条语音
        if (this.currentAudioIndex <= this.audioList.length - 1) {
            this.playAudio(this.audioList[this.currentAudioIndex].id);

        // 否则重置播放索引
        } else {
            this.currentAudioIndex = -1;
        }

        // 当播放列表在最后三条时，加载下屏数据
        try {
            if (this.currentAudioIndex >= this.audioList.length - 3) {
                this.onSpeakListScrollTolower();
            }
        } catch (err) {
            console.log(err);
        }
    },

    /**
     * 播放上一个音频
     * @return {[type]} [description]
     */
    playPrevAudio() {
        this.currentAudioIndex -= 1;
        // 存在索引位置则播放下一条语音
        if (this.currentAudioIndex >= 0 && this.currentAudioIndex <= this.audioList.length - 1) {
            this.playAudio(this.audioList[this.currentAudioIndex].id);
        // 否则重置播放索引
        } else {
            this.currentAudioIndex = -1;
        }
    },


    /******页面交互区******/

    /*显示PPT*/
    togglePPTBox() {
        this.setData({
            'isShowPPT': !this.data.isShowPPT
        })
    },
    toggleBarrage() {
        this.setData({
            'isShowBarrage': !this.data.isShowBarrage
        })
    },
    /*显示评论列表*/
    toggleCommentDialog() {
        this.setData({
            'isShowCommentDialog': !this.data.isShowCommentDialog
        })

        this.initComment();
    },

    /**
     * 展示操作菜单
     * @return {[type]} [description]
     */
    showOperationDialog() {
        this.setData({
            isShowOperationDialog: true,
        });
    },

    /**
     * 取消操作菜单展示
     * @return {[type]} [description]
     */
    hideOperationDialog() {
        this.setData({
            isShowOperationDialog: false,
        });
    },


    /**
     * 加载发言数据
     * @param  {[type]} loadTime  [description]
     * @param  {[type]} msgLength [description]
     * @param  {[type]} bOrA      [description]
     * @return {[type]}           [description]
     */
    loadSpeak(loadTime, speakPageSize, beforeOrAfter, reset = false){
        let pageSize = this.speakPageSize;

		if (speakPageSize){
			pageSize = speakPageSize;
		}

		if (!beforeOrAfter) {
            beforeOrAfter = 'before';
        }

        // 正在加载中
		if (((beforeOrAfter === 'after' && (this.isSpeakLoading || this.data.isNoMoreSpeak)) ||
            (beforeOrAfter === 'before' && (this.isSpeakLoading || this.data.isLoadFirstSpeak))) &&
            !reset
            ) {

            return Promise.resolve();
        }

		this.isSpeakLoading = true;

        return request({
            url: api.getSpeak,
            data: {
                liveId: this.data.liveId,
                topicId: this.data.topicId,
                beforeOrAfter: beforeOrAfter,
                time: loadTime,
                pageSize: pageSize,
            },
        }).then(res => {
            this.isSpeakLoading = false;
            if( res.statusCode == 200) {
                let liveSpeakViews = res.data.data && res.data.data.liveSpeakViews || [];

                if (beforeOrAfter === 'after' && liveSpeakViews.length && liveSpeakViews[0].type === 'start') {
                    this.setData({
                        isLoadFirstSpeak: true,
                    });
                }

                // 更新发言列表
                this.updateSpeakList(liveSpeakViews, beforeOrAfter);

                if (beforeOrAfter === 'before' && this.data.speakList.length && this.data.speakList[0].type === 'start') {
                    this.setData({
                        isLoadFirstSpeak: true,
                    });
                }

                // 是否到发言列表最底部
                if (liveSpeakViews.length < pageSize - 2 && beforeOrAfter === 'after') {
                    this.setData({
                        'liveFakeStatus': this.data.liveStatus,
                    });

                    if (beforeOrAfter === 'after') {
                        this.setData({
                            isNoMoreSpeak: true,
                        });

                    }
                }

                return liveSpeakViews;
            } else {
                Promise.reject(res);
            }

        }).catch(err => {
            this.isSpeakLoading = false;
            Promise.reject(err);
            console.log(err);
        });
	},

    /**
     * 加载评论数据
     * @param  {[type]}   ctx      [description]
     * @param  {[type]}   loadTime [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    loadComment(loadTime) {
        if (this.data.isNomoreComment || this.isCommentLoading) {
            return Promise.resolve();
        }

        this.isCommentLoading = true;

        this.setData({
            isCommentLoading: true,
        });


        return request({
            url: api.getComment,
            data: {
                liveId: this.data.liveId,
                topicId: this.data.topicId,
                time: loadTime,
                beforeOrAfter: "before",
                pageSize:'30'
            },
        }).then(res => {
            this.isCommentLoading = false;
            this.setData({
                isCommentLoading: false,
            });
            let comments = res.data.data && res.data.data.liveCommentViews || [];

            if (comments.length < 20) {
                this.setData({
                    isNomoreComment: true,
                });
            }

            this.updateCommentList(comments, 'before');

            return comments;

        }).catch(err => {
            this.isCommentLoading = false;
            this.setData({
                isCommentLoading: false,
            });
            Promise.reject(err);
        });
	},

    /**
     * 内容特殊字符转译
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    contentFilter(str) {
        str = str || '';
        str = str.replace(/(&lt;)/g, "\<");
        str = str.replace(/(&gt;)/g, "\>");
        str = str.replace(/(&quot;)/g, "\"");
        str = str.replace(/(&#39;)/g, "\'");
        str = str.replace(/(<br\/?>)/gi,"\n");

        return str;
    },

    /**
     * 格式化秒的显示
     * @param  {[type]} sec [description]
     * @return {[type]}     [description]
     */
    formatSecond(sec) {
		let second = Number(sec);

		if (second <= 60) {
			return String(second + '″');
		}

		let min = Math.floor(second / 60);
		let secs = second % 60;

		let secondStr = min + '′' + secs + '″';
		return secondStr;
	},

    /**
     * 更新发言列表
     * @param  {[type]}  dataKey [description]
     * @param  {[type]}  newData [description]
     * @param  {[type]}  arrKey  [description]
     * @param  {Boolean} isPush  [description]
     * @return {[type]}          [description]
     */
    updateSpeakList(speakList, beforeOrAfter){
        speakList = speakList || [];
        let localRecords = this.audioPlayRecordService.getRecord(this.data.topicId)
        // 遍历发言数据格式化
        speakList.forEach((val, idx, arr) => {
            if (val.type === "audio" ){
                arr[idx].audioName = val.content.replace(/(.*\/)/, '').replace(/(\..*)/, '');
                arr[idx].secondView = this.formatSecond(val.second);
                if (localRecords.indexOf(val.id) > -1) {
                    val.hasread = true                    
                }
            } else if (val.type === "text" ){
                arr[idx].content = this.contentFilter(val.content);
            } else if (val.type === 'redpacket') {
                arr[idx].rewardMoney = (arr[idx].rewardMoney / 100).toFixed(2)
            }
        })

        let uniqSpeakList = [];
        for (var newItem of speakList) {
            let isUniq = true;
            for (var item of this.data.speakList) {
                if (item.id === newItem.id) {
                    isUniq = false;
                    break;
                }
            }

            if (isUniq) {
                uniqSpeakList.push(newItem);
            }
        }

        let totalSpeakList = [];
        if (beforeOrAfter === 'before') {
            totalSpeakList = [...uniqSpeakList.reverse(), ...this.data.speakList];
        } else {
            totalSpeakList = [...this.data.speakList, ...uniqSpeakList];
        }


        let totalAudioList = [];
        let totalImgList = [];
        for (let item of totalSpeakList) {
            if (item.type === 'audio') {
                totalAudioList.push(item);
            } else if (item.type === 'image') {
                totalImgList.push(item);
            }
        }

        this.setData({
            speakList: totalSpeakList,
            imgList: totalImgList,
            audioList: totalAudioList,
        });

        this.audioList = totalAudioList;

        return uniqSpeakList;
    },

    /**
     * 更新评论列表
     * @param  {[type]} commentList   [description]
     * @param  {[type]} beforeOrAfter [description]
     * @return {[type]}               [description]
     */
    updateCommentList(commentList, beforeOrAfter) {
        commentList = commentList || []
        let newCommentList = commentList.map(item => {
            item.currentUserId = this.data.userPo.id;
            item.content = this.contentFilter(item.content);

            return item;
        });

        let uniqCommentList = [];
        for (var newItem of newCommentList) {
            let isUniq = true;
            for (var item of this.data.commentList) {
                if (item.id === newItem.id) {
                    isUniq = false;
                    break;
                }
            }

            if (isUniq) {
                uniqCommentList.push(newItem);
            }
        }

        let totalCommentList = [];
        if (beforeOrAfter === 'before') {
            totalCommentList = [...this.data.commentList, ...uniqCommentList];
        } else {
            totalCommentList = [...uniqCommentList, ...this.data.commentList];
        }


        this.setData({
            commentList: totalCommentList
        });

        return uniqCommentList;
    },
    /**
     * 更新ppt列表
     * @param  {[type]} pptList       [description]
     * @param  {[type]} beforeOrAfter [description]
     * @return {[type]}               [description]
     */
    updatePPTList(pptList, beforeOrAfter) {
        pptList = pptList || [];

        let uniqPPTList = [];
        for (var newItem of pptList) {
            let isUniq = true;
            for (var item of this.data.pptList) {
                if (item.id === newItem.id) {
                    isUniq = false;
                    break;
                }
            }

            if (isUniq) {
                uniqPPTList.push(newItem);
            }
        }

        let totalPPTList = [];
        if (beforeOrAfter === 'before') {
            totalPPTList = [ ...this.data.pptList, ...uniqPPTList];
        } else {
            totalPPTList = [...uniqPPTList, ...this.data.pptList];
        }

        this.setData({
            pptList: totalPPTList,
        });
    },

    /**
     * 加载ppt数据
     * @return {[type]} [description]
     */
    loadPPTList() {
        request({
            url: api.getPPT,
            data: {
                topicId: this.data.topicId,
                status: 'Y'
            }
        }).then(res => {
            this.setData({
                pptList: res.data.data && res.data.data.files || []
            });
        });
    },

    /**
     * 删除data数据中的指定元素列表中的某一个元素
     * @param  {[type]} dataKey 要删除的data中的元素key
     * @param  {[type]} itemKey  要删除的元素列表中的唯一标识
     * @param  {[type]} itemValue   要删除的元素列表中的唯一标识对应的值
     * @return {[type]}         [description]
     */
    deleteDataListItem(dataKey, itemKey, itemValue){
        let itemList = this.data[dataKey];

        if (itemList && itemList.length) {
            let pos = -1;
            for (var i = 0, len = itemList.length; i < len; i++) {
                if (itemList[i][itemKey] == itemValue) {
                    pos = i;
                    break;
                }
            }

            if (pos != -1) {
                itemList.splice(pos, 1);

                this.setData({
                    [dataKey]: itemList
                });
            }
        }
    },

    /**
     * 初始化页面评论（弹幕数据）
     * @return {[type]} [description]
     */
    initComment() {
        if (!this.isCommentIniting) {
            this.isCommentIniting = true;
            let loadTime = '';
            if (this.data.commentList.length > 0) {
                loadTime = this.data.commentList[this.data.commentList.length - 1].createTime;
            }
            this.loadComment(loadTime).then(res => {
                if (!this.isCommentLoading) {
                    this.isCommentInited = true;
                }
            });
        }
    },

    /**
     * 上拉加载更多发言
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onSpeakListScrollTolower() {
        let loadTime = this.veryOldTime;

        if (this.data.speakList.length) {
            loadTime = this.data.speakList[this.data.speakList.length - 1].createTime;
        }

        if (this.data.isLoadingLower || this.data.isNoMoreSpeak) {
            return;
        }

        this.setData({
            isLoadingLower: true,
        });

        this.loadSpeak(loadTime, this.speakPageSize, "after")
            .then(res => {
                if (!this.isSpeakLoading) {
                    this.setData({
                        isLoadingLower: false,
                    });
                }
            }).catch(e => {
                this.setData({
                    isLoadingLower: false,
                });
            });

    },

    /**
     * 由子组件的topSpeakId的observer来调用，用来滚动定位到指定位置
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onTopSpeakIdChange(e) {
        let offsetTop = e.detail.offsetTop;

        this.setData({
            speakListScrollTop: offsetTop,
        }, () => {
            setTimeout(() => {
                this.upperLoadingSpeakLock = false;
            }, 120);
        });
    },

    /**
     * 下拉加载更多发言
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onSpeakListScrollToUpper(e) {

        if (!this.data.speakList.length || this.upperLoadingSpeakLock) {
            return;
        }

        this.upperLoadingSpeakLock = true;

        let loadTime = this.data.speakList[0].createTime;
        let topSpeakId = this.data.speakList[0].id;

        if (this.data.isLoadingUpper || this.data.isLoadFirstSpeak) {
            return;
        }

        this.setData({
            isLoadingUpper: true,
        });


        this.loadSpeak(loadTime, this.speakPageSize, "before")
            .then(res => {
                if (!this.isSpeakLoading) {
                    console.log('.....begin');
                    setTimeout(() => {
                        this.setData({
                            topSpeakId: topSpeakId
                        });
                    }, 1000);

                    this.setData({
                        isLoadingUpper: false,
                    });
                }
            }).catch (e => {
                this.setData({
                    isLoadingUpper: false,
                })
            });
    },

    /**
     * 加载更多历史评论
     * @return {[type]} [description]
     */
    onLoadComment() {
        let loadTime = '';
        if (this.data.commentList.length) {
            loadTime = this.data.commentList[this.data.commentList.length - 1].createTime;
        }
        this.loadComment(loadTime);
    },

    /**
     * ws初始化
     * @return {[type]} [description]
     */
    webSocketInit() {
        const sid = getLoginSessionId();
        let socketOpen = false;
        let socketMsgQueue = [{
            sid: sid,
            topicId: this.data.topicId,
            prevTime: this.data.socketData.prevTime,
            idx: this.data.socketData.idx
        }];


        function sendSocketMessage(msg) {
            let ms = JSON.stringify(msg);
            if (socketOpen) {
                wx.sendSocketMessage({
                    data: ms
                })
            } else {
                socketMsgQueue.push(msg)
            }
        }

        wx.connectSocket({
            url: '__WSS_URL'
        })

        wx.onSocketOpen((res) => {
            console.log('WebSocket连接已打开！')
            socketOpen = true
            for (var i = 0; i < socketMsgQueue.length; i++) {
                sendSocketMessage(socketMsgQueue[i])
            }
            // socketMsgQueue = []
        });

        wx.onSocketMessage((res) => {

            var data = JSON.parse(res.data);

            // 更新在线人数
            if (data.onLineNum != 0) {
                this.setData({
                    'onlineNum': digitFormat(data.onLineNum, 10000),
                });
            }

            // 更新评论总数
            if (data.commentNum != 0) {
                this.setData({
                    'commentNum': data.commentNum
                });
            }

            if (data.status == "200") {
                for (var i = 0; i < data.list.length; i++) {
                    var dataObj = JSON.parse(data.list[i]);
                    if (dataObj.dateStr != this.data.socketData.prevTime) {
                        this.setData({
                            'socketData.prevTime': dataObj.dateStr,
                        })
                    } else {
                        this.setData({
                            'socketData.idx': this.data.socketData.idx + 1
                        })
                    }
                    this.socketCallback(dataObj);
                }
            }

        })

        wx.onSocketError(function (res) {
            console.log(res);
            console.log('WebSocket连接打开失败，请检查！');
        })
        wx.onSocketClose(function (res) {
            console.log(res)
            console.log('WebSocket 已关闭！');
            if (this.websocketCloseReConnect) {
                this.websocketTimeout = setTimeout(function () {
                    wx.connectSocket({
                        url: '__WSS_URL'
                    })
                }, 5000)
            }
        })

        bufferQueue.unregisterBuffer('comment');
        bufferQueue.registerBuffer({
            type: 'comment',
            limit: 5,
            method: 'FLUSH',
            handler: (items) => {
                this.updateCommentList(items, 'after');

                // 新消息过来的时候超过一定数量截断底部的旧消息（通过上拉可加载查看）
                if (this.data.commentList.length > 60) {
                    var comments = this.data.commentList.splice(0, 60);

                    this.setData({
                        commentList: comments,
                        isNomoreComment: false,
                    })
                }
            }
        });

        // 设置缓冲最长时间（ms)
        bufferQueue.setGlobalTimer(1200);
    },

    /**
     * ws回调数据处理
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    socketCallback(data) {
        let dataArr = [];
        switch (data.pushExp) {
            case "speak":
                if (this.data.liveFakeStatus == "beginning") {
                    dataArr.push(data);
                    this.updateSpeakList(dataArr, 'after');
                    this.scrollViewBottom();
                };
                break;
            case "comment":
                if (this.isCommentInited) {
                    bufferQueue.enqueue('comment', data);
                }
                break;
            case "deleteSpeak": this.deleteDataListItem("speakList", "id", data.id); break;
            case "deleteComment": this.deleteDataListItem("commentList", "id", data.id); break;
            case "liveEnd":
                this.addSpeakTips(data.liveSpeakPo);
                this.setData({
                    'liveStatus': 'ended'
                })
                break;
            case "prompt": this.addSpeakTips(data.liveSpeakPo); break;
            case "inviteAdd":
                data.type = "invite";
                dataArr.push(data);
                this.updateSpeakList(dataArr, 'after');
                break;
            case "banned":
                this.setBanned(data.isBanned);
                break;
            case "changeSpeaker":
                this.setWhoTyping(data);
                break;
            case "changePPTFile":
                this.changePPT(data);
                break;
        }
    },

    /**
     * 设置是否禁言
     * @param {[type]} isenable [description]
     */
    setBanned(isenable) {
        let speakItem = {};

        speakItem.createTime = Date.now();
        speakItem.id = speakItem.createTime;
        speakItem.type = 'tips';

        if (isenable == "N") {
            this.setData({
                'isCommentBanned': false
            })
            speakItem.content = '讨论区现在允许发言';
        } else if (isenable == "Y") {
            this.setData({
                'isCommentBanned': true
            })
            speakItem.content = '讨论区禁言功能已开启';
        }

        this.updateSpeakList([speakItem], 'after');
    },

    /**
     * 添加上次看到这里的提示
     */
    addLastViewTips(createTime) {
        let speakItem = {};

        speakItem.id = Date.now();
        speakItem.createTime = createTime;
        speakItem.type = 'tips';
        speakItem.content = '上次看到这里了';

        this.updateSpeakList([speakItem], 'before');
    },

    /**
     * 在发言列表添加提示发言
     * @param {[type]} data [description]
     */
    addSpeakTips(data) {
        let speakItem = {};

        speakItem.createTime = Date.now();
        speakItem.id = speakItem.createTime;
        speakItem.type = 'tips';
        speakItem.content = data.content;

        this.updateSpeakList([speakItem], 'after');
    },

    /**
     * 更新讲师输入状态
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    setWhoTyping(data) {
        // const speaker = data.params ? data.params.speaker : data.speaker;
        // const status = data.params ? data.params.status : data.status;
        //
        // if (status === 'Y' && speaker != '') {
        //     this.setData({
        //         isShowTyping: true,
        //         typingName: this.contentFilter(speaker),
        //     });
        //     if (this.typingTimer) {
        //         clearTimeout(this.typingTimer);
        //     }
        //
        //     this.typingTimer = setTimeout(() => {
        //         this.setData({
        //             isShowTyping: false
        //         });
        //     }, 10000);
        // }
    },

    /**
     * 改变ppt列表元素状态
     * @param  {[type]} pptItem [description]
     * @return {[type]}         [description]
     */
    changePPT(pptItem) {
        if (pptItem.status === 'Y') {
            this.updatePPTList([pptItem], 'after');
            this.setData({
                "pptIndex": (this.data.pptList.length != 0) ? (this.data.pptList.length - 1) : 0
            });
        } else if (pptItem.status === 'N') {
            this.deleteDataListItem('pptList', 'id', pptItem.id);
        }
    },

    /**
     * 回到发言顶部
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    gotoFirstMsg(e) {
        if (!this.isSpeakLoading) {
            // 加载完顶部发言,直接回顶部
            if (this.data.isLoadFirstSpeak) {
                this.scrollViewTop();

                wx.showToast({
                    title: '已回到第一条消息',
                    duration: 2000
                });

            // 未加载完，加载完重置发言列表，再回顶部
            } else {
                // 重置列表
                this.setData({
                    'speakList': []
                })
                this.loadSpeak(this.veryOldTime, this.speakPageSize, "after", true)
                    .then(results => {
                        this.scrollViewTop();

                        this.setData({
                            'isNoMoreSpeak': false,
                        })

                        wx.showToast({
                            title: '已回到第一条消息',
                            duration: 2000
                        })
                    }).catch(err => {
                        console.error(err);
                    });
            }
        }
    },

    /**
     * 去到发言列表底部
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    gotoLastMsg(e) {
        if (!this.isSpeakLoading) {
            // 已经去到页底
            if (this.data.isNoMoreSpeak) {
                this.scrollViewBottom();

                wx.showToast({
                    title: '已回到最新一条消息',
                    duration: 2000
                });

            // 不在页底，则清空发言列表，加载页底，去到页底
            } else {
                this.setData({
                    'speakList': []
                })

                this.loadSpeak(this.data.currentTimeMillis + 9000000000, "30", "before", true)
                    .then(results => {
                        this.scrollViewBottom();

                        this.setData({
                            'isNoMoreSpeak': true,
                            'isLoadFirstSpeak': false,
                        });

                        wx.showToast({
                            title: '已回到最新一条消息',
                            duration: 2000
                        })
                    }).catch(err => {
                        console.error(err);
                    });
            }
        }
    },
    /**
     * 关闭赞赏弹窗
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    hideRewardDialog(e) {
        this.setData({
            isShowRewardDialog: false,
        });

    },

    /**
     * 打开赞赏弹窗
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    openReward(e) {
        const id = e.detail.currentTarget.dataset.id;
        const activeItem = this.data.speakList.filter(item => item.id == id)[0];

        this.setData({
            isShowRewardDialog: true,
            activeSpeakItem: activeItem
        });
    },

    /**
     * 开始预览图片
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onImgClick(e) {
        const that = this;
        let imgurl = e.detail.currentTarget.dataset.url;
        wx.previewImage({
            current: imgurl, // 当前显示图片的http链接
            urls: that.data.imgList.map((item) => item.content) // 需要预览的图片http链接列表
        })

    },
    /**
     * 删除评论
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onDeleteCommont(e) {
        wx.showModal({
            title: '提示',
            content: '确认要删除该评论吗？',
            success: (res) => {
                if (res.confirm) {
                    app.showLoading();

                    const commentId = e.detail.currentTarget.dataset.id;
                    console.log(commentId);
                    const createBy = this.data.commentList.filter(item => item.id == commentId)[0].createBy;

                    request({
                        url: api.delComment,
                        method: 'POST',
                        data: {
                            topicId: this.data.topicId,
                            commentId,
                            createBy
                        }
                    }).then(result => {
                        app.hideLoading();

                        if (result.data.state && result.data.state.code === 0) {
                            this.deleteDataListItem("commentList", "id", commentId);
                        } else {
                            console.error('删除评论失败：', result.data.state.msg);
                        }

                    }).catch(err => {
                        app.hideLoading();
                    });
                }
            }
        })
    },

    /*播放音频*/
    onPlayAudioBtnClick(e) {
        let audioId = e.detail.currentTarget.dataset.id;

        // console.log('audioId', audioId, 'data.id:', this.data.playingSpeakId, ' ', this.data.playingSpeakStatus);

        // 同一音频正在播放时暂停
        if (this.data.playingSpeakId === audioId && this.data.playingSpeakStatus === 'playing') {
            this.audioPlayer.pause();

        // 同一音频暂停/停止时播放
        } else if (this.data.playingSpeakId == audioId && this.data.playingSpeakStatus !== 'playing') {
            if (this.data.playingSpeakStatus === 'stoped') {
                this.playAudio(audioId);
            } else {
                this.audioPlayer.play();
            }

        // 其它音频，直接播放
        } else {
            // 更新播放位置索引
            for (var i = 0, len = this.audioList.length; i < len; i++) {
                if (this.audioList[i].id === audioId) {
                    this.currentAudioIndex = i;
                    break;
                }
            }
            this.playAudio(audioId);
        }
    },

    /*拖动播放*/
    slideToSecond(percent) {
        let speak;
        for(var item of this.data.speakList) {
            if (item.id === this.data.playingSpeakId) {
                speak = item;
                break;
            }
        }

        let playTime = percent * Number(speak.second) / 100;
        this.audioPlayer.seek(playTime);

    },

    onTouchAudioSliderStart(e) {
        this.setData({
            'audioSlidertouch': true
        })

    },
    onTouchAudioSliderEnd(e) {
        this.slideToSecond(e.detail.detail.percent);

        setTimeout(() => {
            this.setData({
                'audioSlidertouch': false
            })
        }, 10);

    },
    onTouchAudioSliderCancel(e) {
        setTimeout(() => {
            this.setData({
                'audioSlidertouch': false
            })
        }, 300);
    },

    gotoPlaying() {
        let speak;
        for(var item of this.data.speakList) {
            if (item.id === this.data.playingSpeakId) {
                speak = item;
                break;
            }
        }
        if (speak) {
            this.setData({
                'topSpeakId': speak.id
            });
        }
    },

    scrollViewTop() {
        this.setData({
            'speakListScrollTop': 0,
        })
    },
    scrollViewBottom() {
        this.setData({
            'speakListScrollTop': 999999,
        })
    },

    onShow() {

    },

    onHide() {

    },
    onUnload() {
        // 关闭websocket
        this.websocketCloseReConnect = false;
        wx.closeSocket({
            code: 1000,
            reason: 'user close page'
        });

        // 清理定时器
        if (this.initCommentTimeout) {
            clearTimeout(this.initCommentTimeout);
        }

        if (this.websocketTimeout) {
            clearTimeout(this.websocketTimeout);
        }

        bufferQueue.clearGlobalFlushTimer();
        bufferQueue.unregisterBuffer('comment');
    },
    onShareAppMessage() {
        return {
            title: this.data.topicName,
            imageUrl: this.data.backgroundUrl || 'https://img.qlchat.com/qlLive/topicHeaderPic/thp-4.jpg',
            desc: `${this.data.topicName}，值得我的推荐和你的参与`,
            path: `/pages/thousand-live/thousand-live?topicId=${this.data.topicId}&lshareKey=${this.data.lshareKeyOfMine}`
        };
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    }
});
