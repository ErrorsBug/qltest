/**
 * 音频播放类
 *
 * @export
 * @class AudioPlayer
 */
export class AudioPlayer {
    /**
     * AudioPlayer的各种属性
     *
     * @type {AudioOptions}
     * @memberOf AudioPlayer
     */
    
    constructor(options) {
        // 初始化播放数据
        let ctx = wx.createAudioContext(options.id);
        // let current = options.list[0];
        let currentIndex = 0;
        let playType = '.aac';
        let status = 'stopped';

        if (options.system === 'android') { playType = '.amr'; }

        // 初始化数据放入opt
        this.opt = Object.assign({ ctx, currentIndex, playType, status }, options);
        this.listFilter();
        this.opt.current = this.opt.list[0];
        this.opt.ctx.setSrc(this.opt.current);

        this.initBindEvent()
    }

    /**
     * 添加audio bind事件
     *
     * @memberOf AudioPlayer
     */
    initBindEvent() {
        this.opt.ori.audioError = this.onError.bind(this);
        this.opt.ori.audioPlay = this.onPlay.bind(this);
        this.opt.ori.audioPause = this.onPause.bind(this);
        this.opt.ori.audioTimeupdate = this.onTimeupdate.bind(this);
        this.opt.ori.audioEnded = this.onEnded.bind(this);
    }

    /**
     * 过滤播放列表的url
     *
     * @memberOf AudioPlayer
     */
    listFilter() {
        const that = this;
        this.opt.list = this.opt.list.map((val, index) => {
            /* 将类型替换为对应的播放格式*/
            if (!/(\.mp3)/.test(val)) {
                return val.replace(/(\.amr)|(\.aac)/ig, '') + that.opt.playType;
            }
            return val;
        });
    }

    /**
     * 更新播放列表
     *
     * @param {Array<string>} list - 更新的列表数据
     *
     * @memberOf AudioPlayer
     */
    updateList(list) {
        if (typeof list == 'array') {
            this.opt.list = list;
        }
    }

    /**
     * 根据当前状态响应播放或暂停
     *
     * @memberOf AudioPlayer
     */
    action() {
        this.opt.status == 'playing'
            ? this.pause()
            : this.play();
    }

    /**
     * 播放音频
     *
     * @param {string} [url] - 要播放的音频的url
     *
     * @memberOf AudioPlayer
     */
    play(url, notReplace) {
        if (url) {
            // 如果有传url，则
            let src = url;
            if (!notReplace&& !/(\.mp3)/.test(url)) {
                src = url.replace(/(\.amr)|(\.aac)/, '') + this.opt.playType;
            }
            let index = this.opt.list.indexOf(src);
            // 设置播放源
            this.opt.ctx.setSrc(src);
            // 设置当前播放音频的src和index
            this.opt.current = src;
            if (index >= 0 && index < this.opt.list.length) {
                this.opt.currentIndex = index;
            }
        } else {
            console.log('ctx', this.opt.ctx);
            if (this.opt.status == 'ended') {
                this.opt.ctx.setSrc(this.opt.current);
            }
        }

        // 播放并更新播放状态
        this.opt.ctx.play();
        this.opt.status = 'playing';
    }

    /**
     * 跳转到指定秒数
     *
     * @param {number} second - 秒数
     *
     * @memberOf AudioPlayer
     */
    seek(second) {
        this.opt.ctx.seek(second);
    }

    /**
     * 暂停播放
     *
     * @memberOf AudioPlayer
     */
    pause() {
        // 暂停并更新播放状态
        this.opt.ctx.pause();
        this.opt.status = 'paused';
    }

    /**
     * 播放错误时的监听事件
     *
     * @param {any} e
     *
     * @memberOf AudioPlayer
     */
    onError(e) {
        this.opt.status = 'stopped';
        let src = this.opt.current
            .replace("media.qlchat.com", "audio.qianliaowang.com")
            .replace(/\.(amr|aac)/, "\.mp3");

        if (this.errorUrl == src) {
            wx.showToast({
                title:'音频加载失败',
                icon:'loading'
            })
            return;
        } else {
            this.errorUrl = src;
        }


        this.play(src);

        if (typeof this.opt.onError == 'function') {
            this.opt.onError(e);
        }
    }

    /**
     * 开始播放时的监听事件
     *
     * @param {any} e
     *
     * @memberOf AudioPlayer
     */
    onPlay(e) {
        if (typeof this.opt.onPlay == 'function') {
            this.opt.onPlay(e);
        }
    }

    /**
     * 暂停时的监听事件
     *
     * @
     * @param {any} e
     *
     * @memberOf AudioPlayer
     */
    onPause(e) {
        if (typeof this.opt.onPause == 'function') {
            this.opt.onPause(e);
        }
    }

    /**
     * 播放持续过程监听事件
     *
     * @param {any} e
     *
     * @memberOf AudioPlayer
     */
    onTimeupdate(e) {
        if (typeof this.opt.onTimeupdate == 'function') {
            this.opt.onTimeupdate(e);
        }
    }

    /**
     * 播放结束监听事件
     *
     * @param {any} e
     *
     * @memberOf AudioPlayer
     */
    onEnded(e) {
        // 如果未设置自动播放则不做操作
        this.opt.status = 'ended';
        if (!this.opt.autoPlay) return;
        // 否则播放下一条语音
        if (this.opt.currentIndex < this.opt.list.length - 1) {
            // 如果不是最后一条，继续播放
            this.updateCurrent(this.opt.currentIndex + 1)
            this.play();
        } else {
            // 否则重置为第一条
            this.updateCurrent(0)
        }

        if (typeof this.opt.onEnded == 'function') {
            this.opt.onEnded(e);
        }
        console.log('curr', this.opt.currentIndex, this.opt.current);
    }

    updateCurrent(index) {
        this.opt.currentIndex = index;
        this.opt.current = this.opt.list[this.opt.currentIndex];
    }

    /**
     * 返回当前属性
     *
     * @returns
     *
     * @memberOf AudioPlayer
     */
    getOptions() {
        return this.opt;
    }
}
