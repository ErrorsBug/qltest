
var app = getApp();

/**
 * 音频播放器
 * 功能：基础的音频播放控制
 */
export class AudioPlayer {
    constructor(data) {
        // 获取基本数据
        this.data = data;

        // 获取全局背景播放器
        this.player = wx.getBackgroundAudioManager();

        // 当前音频地址
        if (this.data.audioUrl) {
            this.currentAudioUrl = this.formatUrl(this.data.audioUrl, this.data.format);
        }

        // 初始化播放器基础配置信息
        this.initData(this.data);

        // 绑定事件
        this.initEvts();

    }

    initData(data) {
        let keys = ['title', 'startTime', 'buffered', 'epname', 'singer', 'coverImgUrl', 'webUrl'];
        let key;
        for (let index in keys) {
            key = keys[index];
            if (typeof data[key] != 'undefined') {
                this.player[key] = data[key];
            }
        }
    }

    /**
     * 初始化事件绑定
     * @return {[type]} [description]
     */
    initEvts() {
        this.player.onCanplay(this.onCanplay.bind(this));
        this.player.onPlay(this.onPlay.bind(this));
        this.player.onPause(this.onPause.bind(this));
        this.player.onStop(this.onStop.bind(this));
        this.player.onEnded(this.onEnded.bind(this));
        this.player.onTimeUpdate(this.onTimeUpdate.bind(this));
        this.player.onPrev(this.onPrev.bind(this));
        this.player.onNext(this.onNext.bind(this));
        this.player.onError(this.onError.bind(this));
        this.player.onWaiting(this.onWaiting.bind(this));
    }

    /**
     * 格式化url成可播放的url（添加音频后缀）
     * @param  {String} url 音频地址
     * @param  {String} format 音频格式： mp3/m4a/aac
     * @return {[type]}     [description]
     */
    formatUrl(url, format) {
        if (!url) {
            return;
        }
        if (url.indexOf('.mp3') > 0 || url.indexOf('.aac') > 0 || url.indexOf('.m4a') > 0 || url.indexOf('.amr') > 0) {
            return url;
        } else {
            return formatAudioUrl({
                url,
                format: format || validFormatList[0],
            })

            // 部分安卓小程序无法播放m4a，会进入假死状态。换回aac
            return `${url}.${format || 'aac'}`;
        }
    }

    /**
     * 获取当前音频url
     * @return {[type]} [description]
     */
    get playingUrl() {
        return this.currentAudioUrl;
    }

    /**
     * 暂停播放
     * @return {[type]} [description]
     */
    pause() {
        this.player.pause();
    }

    /**
     * 播放
     * @param  {string|object} url [description]
     * @return {[type]}     [description]
     */
    play (url) {
        let options;
        if (typeof url === 'object') {
            options = url;
            url = options.content;
        } else {
            options = {};
        }

        if (url) {
            this.stop();
            this.currentAudioUrl = this.formatUrl(url, this.data.format);

            console.log('准备播放：', this.currentAudioUrl);

            // 重新初始化播放器基础配置信息（不重新初始化手机上会报错。。。）
            this.initData(this.data);
            this.player.src = this.currentAudioUrl;

            // android端有一段m4a无法获取即禁用掉，因为延迟太久才报错
            if (!this._hasDoneAndroidM4aTest
                && app.globalData.system === 'android'
                && options.second < 30
                && /\.m4a$/.test(this.currentAudioUrl)
            ) {
                this._hasDoneAndroidM4aTest = true;

                const currentAudioUrl = this.currentAudioUrl;
                wx.request({
                    url: currentAudioUrl,
                    complete: (res) => {
                        if (res.statusCode !== 200) {
                            disableFormat('m4a');

                            // 如果当前地址还没改变，切换地址
                            if (currentAudioUrl === this.currentAudioUrl) {
                                console.warn('立即切换格式');
                                const newUrl = formatAudioUrl({
                                    url: currentAudioUrl,
                                    format: validFormatList[0],
                                });
                                this.play(newUrl);
                            }
                        }
                    },
                })
            }
        } else {
            if (this.player.src) {
                this.currentAudioUrl = this.player.src;
                this.player.play();
            } else {
                console.error('播放地址不存在!');
            }
        }
    }

    /**
     * 停止播放
     * @return {[type]} [description]
     */
    stop () {
        this.player.stop();
    }

    /**
     * [seek description]
     * @param  {interger} position 定位到的秒数(s)
     * @return {[type]}          [description]
     */
    seek(position) {
        position = position || 0;
        this.player.seek(position);
    }

    /**
     * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
     * @return {[type]} [description]
     */
    get duration() {
        return this.player.duration;
    }

    /**
     * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回
     * @return {[type]} [description]
     */
    get currentTime() {
        return this.player.currentTime;
    }

    /**
     * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
     * @return {[type]} [description]
     */
    get paused() {
        // 兼容小程序该字段值为undefined情况
        return this.player.paused || this.isPaused;
    }

    /**
     * 音频开始播放的位置（单位：s）
     * @param  {[type]} second [description]
     * @return {[type]}        [description]
     */
    set startTime(second) {
        this.player.startTime = second || 0;
    }

    /**
     * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲
     * @param  {[type]} second [description]
     * @return {[type]}        [description]
     */
    set buffered(second) {
        if (second) {
            this.player.buffered = second;
        }
    }

    /**
     * 音频标题，用于做原生音频播放器音频标题。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值
     * @param  {[type]} title [description]
     * @return {[type]}       [description]
     */
    set title (title) {
        this.player.title = title;
    }

    /**
     * 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
     * @param  {[type]} epname [description]
     * @return {[type]}        [description]
     */
    set epname(epname) {
        this.player.epname = epname;
    }

    /**
     * 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
     * @param  {[type]} singer [description]
     * @return {[type]}        [description]
     */
    set singer(singer) {
        this.player.singer = singer;
    }

    /**
     * 封面图url。用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图。
     * @param  {[type]} coverImgUrl [description]
     * @return {[type]}             [description]
     */
    set coverImgUrl(coverImgUrl) {
        this.player.coverImgUrl = coverImgUrl;
    }

    /**
     * 设置原生播放器中的分享时的卡片简介展示的页面链接
     * @param  {[type]} webUrl [description]
     * @return {[type]}        [description]
     */
    set webUrl(webUrl) {
        this.player.webUrl = webUrl;
    }

    /**
     * 背景音频进入可以播放状态，但不保证后面可以流畅播放
     * @return {[type]} [description]
     */
    onCanplay(e) {
        console.info('音频进入可播放状态');
        if (this.data.onCanplay) {
            this.data.onCanplay(e);
        }
    }

    /**
     * 背景音频播放事件
     * @return {[type]} [description]
     */
    onPlay(e) {
        console.info('音频开始播放状态');
        this.isPaused = false;
        if (this.data.onPlay) {
            this.data.onPlay(e);
        }
    }

    /**
     * 背景音频暂停事件
     * @return {[type]} [description]
     */
    onPause(e) {
        console.info('音频进入暂停状态');
        this.isPaused = true;
        if (this.data.onPause) {
            this.data.onPause(e);
        }
    }

    /**
     * 背景音频停止事件
     * @return {[type]} [description]
     */
    onStop(e) {
        console.info('音频进入停止播放状态');
        this.isPaused = true;
        if (this.data.onStop) {
            this.data.onStop(e);
        }
    }

    /**
     * 背景音频自然播放结束事件
     * @return {[type]} [description]
     */
    onEnded(e) {
        console.info('音频自然播放结束状态');
        this.isPaused = true;
        if (this.data.onEnded) {
            this.data.onEnded(e);
        }
    }

    /**
     * 背景音频播放进度更新事件
     * @return {[type]} [description]
     */
    onTimeUpdate(e) {
        // console.info('音频播放进度更新。当前进度：',e, this.currentTime, this.duration, this.parsed);
        // 在非停止或暂停状态下回调播放进度方法
        if (this.data.onTimeUpdate && !this.paused) {
            this.data.onTimeUpdate(e);
        }
    }

    /**
     * 用户在系统音乐播放面板点击上一曲事件（iOS only）
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onPrev(e) {
        console.info('点击上一曲事件');
        if (this.data.onPrev) {
            this.data.onPrev(e);
        }
    }

    /**
     * 用户在系统音乐播放面板点击下一曲事件（iOS only）
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onNext(e) {
        console.info('点击下一曲事件');
        if (this.data.onNext) {
            this.data.onNext(e);
        }
    }


    /**
     * 背景音频播放错误事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onError(e) {
        console.warn('音频播放出错! error:', e);

        switch (e.errCode) {
            case 10001:
                console.log('系统错误,尝试降级播放');
                // wx.showModal({
                //     title: '提示',
                //     content:'音频加载失败',
                //     showCancel: false,
                // });
                // this.pause();
                this.downgradeAudio(e.errCode);
                break;
            case 10002:
                console.log('网络错误,尝试降级播放');
                // wx.showModal({
                //     title: '提示',
                //     content:'网络错误，请稍后重试',
                //     showCancel: false,
                // });
                // this.pause();

                this.downgradeAudio(e.errCode);
                break;

            case 10003:
                console.log('文件错误，尝试降级播放');
                this.downgradeAudio(e.errCode);
                break;

            case 10004:
                // android端有一段aac无法播放即禁用掉
                if (app.globalData.system === 'android') {
                    if (/\.aac$/.test(this.currentAudioUrl)) {
                        disableFormat('aac');
                    } else if (/\.m4a$/.test(this.currentAudioUrl)) {
                        disableFormat('m4a');
                    }
                    console.warn('立即切换格式');
                    const newUrl = formatAudioUrl({
                        url: this.currentAudioUrl,
                        format: validFormatList[0],
                    });
                    this.play(newUrl);
                    break;
                }
                console.log('格式错误,尝试降级播放');
                this.downgradeAudio(e.errCode);
                break;
            default:
                console.log('未知错误,尝试降级播放');
                // wx.showModal({
                //     title: '提示',
                //     content:'音频加载失败',
                //     showCancel: false,
                // });
                // this.pause();
                this.downgradeAudio(e.errCode);
        }

        if (this.data.onError) {
            this.data.onError(e);
        }
    }

    /**
     * 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onWaiting(e) {
        console.info('音频进入加载状态');
        if (this.data.onWaiting) {
            this.data.onWaiting(e);
        }
    }

    /**
     * 音频降级播放
     * @return {[type]} [description]
     */
    downgradeAudio(errCode) {
        let url = this.currentAudioUrl;

        /*m4a音频播放失败，先转成aac或amr尝试*/
        if (/(m4a)/.test(url)) {
            let audioType = ".aac";

            // 小程序没说支持amr，暂时去掉
            // if (app.globalData.system === 'android') {
            //     audioType = ".amr";
            // }
            url = url.replace(/(\.m4a)/gi, "") + audioType;
            console.log('m4a 降级成 acc');

        // 尝试使用http协议播放amr/aac
        } else if (/(https\:)/.test(url) && /(amr|aac)/.test(url)) {
            url = url.replace("https:", "http:");
            console.log('https 降级成 http 的amr/aac');

        // 尝试使用https协议播放mp3
        } else if (/(http\:)/.test(url) && /(amr|aac)/.test(url)){
            url = url.replace("http:", "https:");
            url = url.replace(/(media\.qlchat\.com)/, "audio.qianliaowang.com").replace(/\.(amr|aac)/, "\.mp3");
            console.log('降级使用https的mp3');

        // 尝试使用http协议播放mp3
        } else if (/(https\:)/.test(url) && /(\.mp3)/.test(url)){
            url = url.replace("https:", "http:");
            console.log('降级使用 http的pm3');

        // mp3重试
        } else if (!/(again)/.test(url)) {
            if (/(\?)/.test(url)) {
                url = url+"&again="+(new Date()).getTime();
            } else {
                url = url+"?again="+(new Date()).getTime();
            }
            console.log('降级mp3失败，加入again标识重试');

        // 降级失败处理（上报错误信息）
        } else {
            wx.showModal({
                title: '提示',
                content:'音频加载失败',
                showCancel: false
            });
            this.pause();
            this.reportAudioError(url, errCode);

            return;
        }

        // 重试播放
        this.play(url);
    }

    /**
     * 报告错误信息
     * @param  {[type]} errCode [description]
     * @return {[type]}         [description]
     */
    reportAudioError(url, errCode) {
        // let body = {
		// 		url: _url,
		// 		status: _status,
		// 		errorCodeMsg:msg,
		// 	};
        //
        // fetch(`//stat.corp.qlchat.com/media.gif?${encode(body)}`, {
        //     method:'GET',
        //     headers: {
        //         'Content-Type': 'application/json;charset=UTF-8',
        //     },
        //     credentials: 'include',
        //
        // });

        wx.getImageInfo({
            src: `http://stat.corp.qlchat.com/media.gif?url=${encodeURIComponent(url)}&errorCodeMsg=${errCode}`,
            fail: (e) => {
                // console.error('上报音频播放失败日志失败。err:', e);
            }
        });
    }
}



/**
 * 音频格式工具
 */
function formatAudioUrl({
    url,
    format = 'mp3',
    https
}) {
    if (typeof url !== 'string') return url;
    url = url.replace(/\.[a-zA-Z0-9]*$/, '') + '.' + format;

    if (format === 'mp3') {
        url = url.replace('media.qlchat.com', 'audio.qianliaowang.com');
    } else {
        url = url.replace('audio.qianliaowang.com', 'media.qlchat.com');
    }

    if (https !== undefined) {
        url = url.replace(/^https?/, https ? 'https' : 'http');
    }
    return url;
}

const validFormatList = ['m4a', 'aac', 'mp3']

function disableFormat(format) {
    if (validFormatList.length > 1) {
        console.warn('放弃使用格式：', format);
        let index = validFormatList.indexOf(format);
        if (index >= 0) {
            validFormatList.splice(index, 1);
        } else {
            validFormatList.shift();
        }
    }
}