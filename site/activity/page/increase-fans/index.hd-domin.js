require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');
var loading = require('loading');

 Loading = $.ajaxLoading();
Loading.hide();

var tpls = {
    courseItem: __inline('./tpl/course-item.handlebars'),
    tips: __inline('./tpl/tips.handlebars'),
    shareGuide: __inline('./tpl/share-guide.handlebars'),
    qrCode: __inline('./tpl/qr-code.handlebars'),
};

/**
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './index.scss'
 */

/**
 * course video player
 */
var player = {
    audioEl: document.getElementById('course-player'),
    curAudioDom: null,
    // 播放进度的日志
    audioPlayTimeLogs: {
        '1/5': false,
        '1/3': false,
        '1/2': false,
        '1/1': false,
    },
    eventLog: function (data) {
        if (window._qla && data) {
            window._qla('event', {
                category: data.category,
                action: data.action,
            });
        }
    },
    // 清除定时器
    clearIntervalTimer: function(){
        clearInterval(this.intervalTimer);
    },
    // 绑定事件，音频播放完毕的时候取消定时器
    bindEvents: function(){
        var $video = $(this.audioEl);
        
        $video.on('ended', this.handlePlayEnded.bind(this));
        $video.on('canplay', this.handleAudioCanPlay.bind(this));
        $video.on('playing', this.handleAudioPlaying.bind(this));
        $video.on('timeupdate', this.handleAudioTimeUpdate.bind(this));
    },
    handleAudioTimeUpdate: function () {
        let rate = this.audioEl.currentTime / this.audioEl.duration;

        if (!this.audioEl["1/5"] && rate > 0.05) {
            this.eventLog({
                category : "audio-playing-progress",
                action: '1/5',
            });
            this.audioEl["1/5"] = true;
        } else if (!this.audioEl["1/3"] && rate > (1/3)) {
            this.eventLog({
                category : "audio-playing-progress",
                action: '1/3',
            });
            this.audioEl["1/3"] = true;
        } else if (!this.audioEl["1/2"] && rate > (1/2)) {
            this.eventLog({
                category : "audio-playing-progress",
                action: '1/2',
            });
            this.audioEl["1/2"] = true;
        } else if (!this.audioEl["1/1"] && rate >= 1) {
            this.eventLog({
                category : "audio-playing-progress",
                action: '1/1',
            });
            this.audioEl["1/1"] = true;
        }
    },
    handleAudioCanPlay: function () {
        this.playCourse();
    },
    // 音频播放完毕后，切换播放图标
    handlePlayEnded: function(){
        this.clearIntervalTimer();
        $('.play-btn').removeClass('icon-audio-pause').addClass('icon-audio-play');
    },
    // 每两秒检查一次播放情况，如果播放卡住，先暂停，过0.1秒再次播放
    intervalCheck: function(){
        var that = this;
        var audioEl = this.audioEl;
        this.lastCurrentTime = audioEl.currentTime;
        this.intervalTimer = setInterval(function() {
            var currentTime = audioEl.currentTime;
            // 音频播放卡住
            if (currentTime == that.lastCurrentTime) {
                // 先暂停
                audioEl.pause();
                // 等待0.1秒，再次播放
                setTimeout(function() {
                    audioEl.play();
                }, 100);
            }
            that.lastCurrentTime = currentTime;
        }, 2000);
    },
    handleAudioPlaying: function () {
        if (this.curAudioDom && this.curAudioDom.hasClass('icon-audio-loading')) {
            this.playCourse();
        }
    },
    /**
     * 音频播放
     * @param src <String> 音频源URL
     */
    play: function(src){
        var audioEl = this.audioEl;
        this.loadingCourse();
        // 传入无效的音频源URL
        if (!src || typeof src !== 'string') {
            console.error('you must give it a valid video source');
            this.resetPlayBtn();
            return;
        } else if (!audioEl.src || audioEl.src !== src) {
            // 更改了音频源URL，播放新的音频
            audioEl.src = src;
            this.bindEvents();
            this.clearIntervalTimer();
        }
        audioEl.play();
        this.intervalCheck();
    },
    // 音频暂停
    pause: function(){
        this.audioEl.pause();
        this.clearIntervalTimer();
        this.pauseCourse();
    },

    // 把所有播放按钮重置为未播放状态
    resetPlayBtn: function () {
        $('.play-btn')
            .removeClass('icon-audio-pause')
            .removeClass('icon-audio-loading')
            .addClass('icon-audio-play');
    },

    // 使目标音频成为loading状态
    loadingCourse: function () {
        this.resetPlayBtn();

        this.curAudioDom &&
        this.curAudioDom
            .removeClass('icon-audio-play')
            .addClass('icon-audio-loading');
    },

    // 使目标音频成为播放状态
    playCourse: function () {
        this.curAudioDom &&
        this.curAudioDom
            .removeClass('icon-audio-loading')
            .addClass('icon-audio-pause');
    },

    // 设置成暂停状态
    pauseCourse: function () {
        this.curAudioDom &&
        this.curAudioDom
            .removeClass('icon-audio-pause')
            .addClass('icon-audio-play');
    },

}

function generateUuId(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


var standard = {
    init: function (initData) {
        // console.log(initData);
        this.initState(initData);
        this.initHandlebarList(initData);
        this.initListeners();
        this.initSelectBtns();
        this.initPlayBtns();
        this.initGetCourseBtn();
        this.getConfig();
    },

    initState: function (initData) {
        var urlParams = urlUtils.getUrlParams();
        var courses = initData.courses || [];
        var coursesId = courses.map(function (item) {
            return {id: String(item.id), liveId: item.liveId, shareLiveId: item.shareLiveId};
        });
        // 千聊liveId
        // var qlChatLiveId = "100000081018489";//prod
        var qlChatLiveId = "140000033000004" //test1
        // var qlChatLiveId = "140000025000034"; // test2
        // var coursesId = initData

        // 本地的uid
        var localUid = localStorage.getItem('local-uid');
        // 若不存在则生成一个本地的Uid
        if (!localUid) {
            localUid = generateUuId();
            localStorage.setItem('local-uid', localUid);
        } 
        // 已扫过二维码的uid
        var uId = urlParams.uId || '';
        // 活动Id
        var activityId = initData.id;
        // 已扫过码的活动Id
        var joinedActivityId = localStorage.getItem('joined-activity-id') ?  localStorage.getItem('joined-activity-id').split(',') : [];
        // 已分享过的活动Id
        var sharedActivityId = localStorage.getItem('shared-activity-id') ? localStorage.getItem('shared-activity-id').split(',') : [];
        // 已获得的课程Id
        var gotCourseId = localStorage.getItem('got-course-id') || '';
        // 当前选择的课程Id
        var curSelectedId = '';
        // 通过扫描二维码的关注的公众号的 liveId, 默认为千聊
        var qrLiveId = qlChatLiveId;
        // 页面可播放状态 none, got, all
        var playState = 'none';
        // 是否参加过本活动
        // console.log(joinedActivityId);
        var isJoined = joinedActivityId.some(function(id) {
            return id === activityId
        }) && localUid === uId;

        //  是否分享过本活动链接
        var isShared = sharedActivityId.some(function(id) {
            return id === activityId
        }) && localUid === uId;

        // 是否通过分享链接进入页面
        var isFromShare = urlParams.isShareUrl === 'Y';

        // 若参加过本活动，则可播放之前选择过的一组课程，否则所有课程均不能播放
        if (isJoined ) {  
            playState = 'got';
        } else { 
            playState = 'none';
        }

        // 若参加且分享过本活动，则可播放全部课程
        if (isJoined && isShared ) {
            playState = 'all';
        }
        switch (playState) {
            case 'got':
                // 若当前状态为
                if (gotCourseId === coursesId[0].id) {
                    curSelectedId = coursesId[1].id;
                    qrLiveId = coursesId[1].liveId;
                } else {
                    curSelectedId = coursesId[0].id;
                    qrLiveId = coursesId[0].liveId;
                }
                // curSelectedId = gotCourseId === coursesId[0] ? coursesId[1] : coursesId[0];
                break;
            case 'all':
            case 'none':
                curSelectedId = coursesId[0].id;
                break;
            default:
                break;
        }

        window.state = {
            playState: playState,
            qrLiveId: qrLiveId,
            qlChatLiveId: qlChatLiveId,
            isFromShare: isFromShare,
            gotCourseId: gotCourseId,
            curSelectedId: curSelectedId,
            localUid: localUid,
            activityId: activityId,
            shareTitle: initData.title,
            courses: courses,
        }
    },

    initPlayBtns: function(){
        var playBtns = $('.play-btn'); 
        var courseImg = $('.course-img');
        var self = this;
        courseImg.on('click', function(e){
            var $this = $(this);
            var curPlayBtn = $this.children('.play-btn');
            player.curAudioDom = curPlayBtn;
            var courseId = $(e.target).parents('.course-data').data('id');
            if (window.state.playState === 'none') {
                // toast.toast('请先领取课程', 1000, 'middle');
                return;
            }
            if (window.state.playState === 'got' && `${courseId}`!== window.state.gotCourseId) {
                return;
            }

            if (curPlayBtn.hasClass('icon-audio-play')) {
                // 当音频处于暂停状态，点击后切换为播放状态
                var audioUrl = curPlayBtn.data('src');
                player.play(audioUrl);
                // 把所有的播放按钮都重置为play状态
                // playBtns.removeClass('icon-audio-pause').addClass('icon-audio-play');
                // curPlayBtn.removeClass('icon-audio-play').addClass('icon-audio-pause');
            } else if (curPlayBtn.hasClass('icon-audio-pause')) {
                // 当音频处于播放状态，点击后切换为暂停状态
                player.pause();
                curPlayBtn.removeClass('icon-audio-pause').addClass('icon-audio-play');
            }
        });
    },

    initSelectBtns: function(){
        var selectBtns = $('.select-btn');
        var courses = $('.course-wrap ');
        // console.log(courses);
        courses.on('click', function(e){
            var $this = $(this);
            var curSelectBtn = $this.children('.title').children('.select-btn');

            var curLiveId = curSelectBtn.data('liveid');
            var courseId = curSelectBtn.data('id');

            // 若已获得课程，则忽略选择事件
            if (window.state.playState !== 'none') {
                return
            }


            // console.log(curLiveId, courseId);

            if (courseId === window.state.curSelectedId) {
                return;
            } else {
                selectBtns.removeClass('selected icon-checked');
                curSelectBtn.addClass('selected icon-checked');
                courses.removeClass('course-selected');
                $this.addClass('course-selected');
                window.state.curSelectedId = `${courseId}`;
                window.state.qrLiveId = `${curLiveId}`;
                return;
            }
        });
    },

    initGetCourseBtn: function(){
        var getCourseBtn = $('.get-course-btn');
        var self = this;
        
        getCourseBtn.on('click', function(e){
            var $this = $(this);
            
            switch (window.state.playState) {
                case 'none':
                    if (!window.state.curSelectedId || window.state.curSelectedId === '') {
                        toast.toast('请先选择一组课程', 1000, 'middle');
                        return
                    }

                    Loading.show();

                    var selectedCourse = null;
                    window.state.courses.forEach(function (item) {
                        if (item.id === Number(window.state.curSelectedId)) {
                            selectedCourse = item;
                        }
                    });
                    if (!selectedCourse) {
                        toast.taost('请先选择一组课程');
                    }

                    var toUserId = window.state.localUid;
                    var liveId = window.state.isFromShare ? selectedCourse.shareLiveId : selectedCourse.liveId;
                    var topicId = window.state.activityId;

                    self.getQrCode(toUserId, liveId, topicId);
                    break;  
                case 'got':
                case 'all':
                    $(".modal").append(tpls.shareGuide({
                        isShared: window.state.playState === 'all',
                    })).show();
                    break;
                default:
                    break;
            }
        });
    },

    initHandlebarList: function (initData) {

        var courses = initData.courses.map(function (item) {
            // console.log(item.id === window.state.curSelectedId)
            // console.log(item.id)
            // console.log(window.state.curSelectedId)
            return Object.assign({
                disable: window.state.playState === 'got' && String(item.id)  !== String(window.state.gotCourseId),
                showShareTips: window.state.playState === 'got' && String(item.id) === String(window.state.gotCourseId),
                isSelected: window.state.playState !== 'all' && String(item.id) === String(window.state.curSelectedId),
                isGot:  window.state.playState === 'all' || (window.state.playState !== 'none' && String(item.id) === String(window.state.gotCourseId)),
                unJoined: window.state.playState === 'none',
            }, item) 
        }) || [];

        var shareBtnText = '';
        var logPos = '';
        switch (window.state.playState) {
            case 'got':
                shareBtnText = '分享朋友圈，继续免费领取';
                logPos = 'timeline';
                break;
            case 'none':
                shareBtnText =  '立即免费领取';
                logPos = 'qrcode';
                break;
            case 'all':
                shareBtnText = '分享给朋友';
                logPos = 'friend';
                break; 
            default:
                shareBtnText = '立即免费领取';
                logPos = 'qrcode';
                break;
        }

        $(".content-detail").html(tpls.courseItem({
            courses: courses,
            isJoined: window.state.playState === 'got',
            shareBtnText: shareBtnText,
            isShared: window.state.playState === 'all',
            logPos: logPos
        }))
        $(".tips").html(tpls.tips({
            class: window.state.playState === 'none'? '' : 'got-course',
            tips: window.state.playState === 'none'? '/免费领取音频课程（2选1）/' : ''
        }))

    },

    getQrCode: function (toUserId, liveId, topicId) {
        $.ajax({
            type: 'POST',
            url: '/api/wechat/activity/getQr',
            timeout: 10000,
            data: { 
                channel: '118',
                toUserId: toUserId,
                userId: toUserId,
                liveId: '',
                appId: liveId,
                topicId: topicId,
                // 选中的那个course的ID
                sourceKey: window.state.curSelectedId,
            },
            dataType: 'json',
            success: function (res) {
                Loading.hide();
                if (res.state.code === 0 ){
                    $(".qr-modal").append(tpls.qrCode({
                        src: res.data.qrUrl,
                    })).show();
                    // 手动触发打曝光日志
                    setTimeout(() => {
                        typeof _qla != 'undefined' && _qla.collectVisible();
                    }, 0);
                    var joinedActivityId = localStorage.getItem('joined-activity-id')?  localStorage.getItem('joined-activity-id').split(',') : [];
                    if ( !joinedActivityId.some(function(id) {return id === window.state.activityId}) ) {
                        joinedActivityId.push(window.state.activityId);
                    }
                    localStorage.setItem('joined-activity-id', joinedActivityId);
                    localStorage.setItem('got-course-id', window.state.curSelectedId);
                }
            },
            error: function (err) {
                Loading.hide();
                toast.toast(err, 1000, 'middle');
            },
        });
    },

    initListeners: function () {

        //* 各种兼容处理 *//
        // 解决点击300ms延迟
        fastClick.attach(document.body);
        // 解决IOS漏底问题
        function disableScroll(event) {
            if (!event.canScroll) {
                event.preventDefault();
            }
        }
        function overscroll(el) {
            if (el) {
                el.addEventListener('touchstart', function (){
                     top = el.scrollTop;
                     totalScroll = el.scrollHeight;
                     currentScroll = top + el.offsetHeight;
                    if (top === 0) {
                        el.scrollTop = 1;
                    } else if (currentScroll === totalScroll) {
                        el.scrollTop = top - 1;
                    }
                });

                el.addEventListener('touchmove', function(event) {
                    if (el.offsetHeight < el.scrollHeight) event.canScroll = true;
                });
            }
        }

        function fixScroll(selector) {
             elSelectot = selector || '';
            overscroll(document.querySelector(selector));
            document.body.addEventListener('touchmove', disableScroll);
        }

        fixScroll('.main-container');
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //* 各种兼容处理 *//

        $('body').on('click', '.dialog-conform', function () {
            $('.dialog-back').hide();
        });

        // 隐藏modal
        $('.modal').on('click', function(){
            $('.share-guide').remove();
            this.style.display = 'none';
        });

        $('.qr-modal').on('click', function(e){
            if (($(e.target).hasClass('qr-code'))) return;
            $('.qr-code').remove();
            this.style.display = 'none';
        });

        $('.qr-close-btn').on('click', function(e){
            $('.qr-code').remove();
            this.style.display = 'none';
            if (window._qla) {
                window._qla('event', {
                    category: 'close',
                    pos: '118',
                });
            }
        });

        // // 朋友圈分享
        // $('.selected-btn').on('click', function(){
        //     handleClickShare();
        // });


    },

    /* 获取微信配置 */
    getConfig: function () {
        var that = this;
        $.ajax({
            type: 'GET',
            url: '/api/wechat/activity/config',
            data: { url: encodeURIComponent(location.href) },
            // dataType: 'jsonp',
            success: function (res) {
                res = JSON.parse(res)
                if (res.data.config.statusCode == 200) {
                    that.initWechat(res.data.config)
                }
            },
            error: function (err) {
                console.error(err)
            },
        })
    },
    /* 初始化微信配置 */
    initWechat: function (config) {
        var that = this;
        if (window.wx) {
            var apiList = ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice',
                'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation',
                'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'
            ];
            window.wx.config({
                debug: false,
                appId: config.appId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                signature: config.signature,
                jsApiList: apiList
            })
            window.wx.ready(function () {
                that.initShare()
            })
        }
    },
    /* 初始化微信分享 */
    initShare: function () {
        var that = this;
        var url = window.location.href;
        url = urlUtils.fillParams({
            isShareUrl: 'Y'
        }, url);

        var config = {
            title: window.state.shareTitle, // 分享标题
            desc: '',
            link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/zfgift.jpg', // 分享图标
            success: function () {
                if (window._qla) {
                    window._qla('event', {
                        category: 'wechat_share',
                        action: 'success',
                    });
                }
            },
            cancel: function () {
            },
        };

        var timeLineConfig = {
            title: window.state.shareTitle, // 分享标题
            desc: '',
            link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/zfgift.jpg', // 分享图标
            success: function () {
                if (window._qla) {
                    window._qla('event', {
                        category: 'wechat_share',
                        action: 'success',
                    });
                }
                var sharedActivityId = localStorage.getItem('shared-activity-id') ? localStorage.getItem('shared-activity-id').split(',') : [];
                if ( !sharedActivityId.some(function(id) {return id === window.state.activityId}) ) {
                    sharedActivityId.push(window.state.activityId);
                }
                localStorage.setItem('shared-activity-id', sharedActivityId);
                // window.location.reload(); 
                window.location.href = location.href+'?time='+((new Date()).getTime());         
            },
            cancel: function () {
            },
        };

        // window.wx.updateAppMessageShareData(config);
        // window.wx.updateTimelineShareData(timeLineConfig);

        window.wx.onMenuShareAppMessage(config);
        window.wx.onMenuShareTimeline(timeLineConfig);
        window.wx.onMenuShareQQ(config);
        window.wx.onMenuShareWeibo(config);
    },
}

module.exports = standard;