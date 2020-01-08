require('zepto');
require('tapon');

var fastClick = require('fastclick'),
    toast = require('toast'),
    urlUtils = require('urlutils'),
    wxutil = require('wxutil');

/**
 *
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require './test-audio.css'
 */
var testAudio = {
    init: function(initData) {

        this.audio = $('#audioPlayer')[0];

        // 如果页面上存在url参数，则从url参数初始化音频
        this.initAudioByUrl();

        // 事件初始化
        this.initListeners();
    },

    /**
     * 事件定义
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:44:01+0800
     * @return   {[type]}                           [description]
     */
    initListeners: function() {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function() {});


        $('body').on('click', '.play-btn', function(e) {
            that.onPlayBtnClick(e);
        });

        $('body').on('click', '.pause-btn', function(e) {
            that.onPauseBtnClick(e);
        });

        $('body').on('change', '.audio-file', function(e) {
            that.onInputFileChange(e);
        });

        $('body').on('change', '.select-menu', function(e) {
            that.onSelectMenuChange(e);
        })

        this.initPlayerEvents();

    },

    initPlayerEvents: function() {
        var that = this,
            evts = [
                'abort', 'canplay', 'canplaythrough', 'duratichange', 'emptied',
                'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause',
                'play', 'playing', 'progress', 'ratechange', 'readystatechange', 'seeked',
                'seeking', 'stalled', 'suspend', 'volumechange', 'waiting'
            ];

        for (var i = 0, len = evts.length; i< len; i++) {
            (function(type) {
                that.audio.addEventListener(type, function(e) {
                    console.log('[', type, ']', e);
                });
            })(evts[i]);
        }
    },
    onPlayBtnClick: function(e) {
        var target = $(e.currentTarget),
            src = target.attr('data-src');

        this.playAudio(src);
    },

    initAudioByUrl: function() {
        var audioUrl = urlUtils.getUrlParams('url');

        audioUrl = decodeURIComponent(audioUrl);

        if (audioUrl) {
            this.paramAudioUrl = audioUrl;
            this.playAudio();
        }
    },
    onPauseBtnClick: function(e) {
        this.audio.pause();
    },

    onInputFileChange: function(e) {
        var file = e.target && e.target.files && e.target.files.length && e.target.files[0];

        console.log('已选音频：', file.name);
        this.audioFile = file;
        this.audioName = file.name;
    },
    onSelectMenuChange: function(e) {
        if (this.audioName) {
            this.audio.playbackRate = e.target.value;
        }
    },

    playAudio: function(src) {
        
        if (this.audioFile) {
            $('.audio-name span').html(this.audioName);
            this.audio.src = URL.createObjectURL(this.audioFile)
            this.audio.load();
            this.audio.play();
            this.audio.playbackRate = $('.select-menu').val();
        } else if (this.paramAudioUrl) {
            this.audio.src = this.paramAudioUrl;
            this.audio.load();
            this.audio.play();
            this.audio.playbackRate = $('.select-menu').val();
        } else {
            toast.toast('请选择音频');
            return;
        }
    }

};


module.exports = testAudio;
