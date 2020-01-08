require('zepto');
// zeptofix
require('tapon');

var fastClick = require('fastclick');
var model = require('model');
var loading = require('loading');
var appSdk = require('appsdk');

var conf = require('../conf');

/**
 * @require '../../components_modules/reset.css'
 * @require './search-all.css'
 */

var search = {
    /* 初始化*/
    init: function () {
        this.initListeners();
        this.checkResultAndLog()

        /* bind this */
        this.onMoreClick = this.onMoreClick.bind(this)
        this.onTopicClick = this.onTopicClick.bind(this)
        this.onChannelClick = this.onChannelClick.bind(this)
        this.onLiveClick = this.onLiveClick.bind(this)
    },

    /* 检查搜索结果并打印日志 */
    checkResultAndLog: function(){
        var hasTopic = $('.topics li').length > 0
        var hasLive = $('.lives li').length > 0
        var hasChannel = $('.channels li').length > 0
        if(hasTopic || hasLive || hasChannel){
            this.calllog('success', 'all', window.KEYWORD)
        } else{
            this.calllog('fail', 'all', window.KEYWORD)
        }
    },

    /* 初始化事件绑定*/
    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        /* 点击更多按钮事件*/
        $('body').on('click', '.more', function (e) {
            that.onMoreClick(e);
        })

        $('body').on('click', '.topic', function (e) {
            that.onTopicClick(e);
        })

        $('body').on('click', '.channel', function (e) {
            that.onChannelClick(e);
        })

        $('body').on('click', '.live', function (e) {
            that.onLiveClick(e);
        })
    },

    onTopicClick: function (e) {
        var that = this
        this.calllog('valid', 'all', window.KEYWORD)

        var id = $(e.currentTarget).attr('data-id');
        var lshareKey = $(e.currentTarget).attr('data-lsharekey');


        setTimeout(function(){
            that.fetchTypeAndRedirect(id, lshareKey);
        }, 200)
    },

    onChannelClick: function (e) {
        this.calllog('valid', 'all', window.KEYWORD)

        var id = $(e.currentTarget).attr('data-id');
        var oriUrl = $(e.currentTarget).attr('data-url');
        var lshareKey = $(e.currentTarget).attr('data-lsharekey');

        setTimeout(function(){
            appSdk.linkTo('dl/live/channel/homepage?channelId=' + id + (lshareKey ? ('&lshareKey=' + lshareKey): ''));
        }, 200)
    },

    onLiveClick: function (e) {
        this.calllog('valid', 'all', window.KEYWORD)

        var id = $(e.currentTarget).attr('data-id');
        var oriUrl = $(e.currentTarget).attr('data-url');
        var lshareKey = $(e.currentTarget).attr('data-lsharekey');

        setTimeout(function(){
            appSdk.linkTo('dl/live/homepage?liveId=' + id + (lshareKey ? ('&lshareKey=' + lshareKey): ''));
        }, 200)
    },

    /**
     * 打日志
     *
     * @param {string} actions 有效值为 success|fail|valid
     * @param {string} type 搜索类型，有效值为 topic|channel|live|all
     * @param {string} keyword 搜索关键词
     */
    calllog: function(actions, type, keyword){
        if(actions === 'success'){
            this.validState = true
        }
        if(actions === 'valid'){
            if(!this.validState){ return }
            this.validState = false
        }
        window._qla && window._qla('event',{
            category: 'search',
            action: actions,
            business_type: type,
            business_name: keyword,
        })
    },

    /* 更多按钮点击*/
    onMoreClick: function (e) {
        var keyword = encodeURIComponent(window.KEYWORD);
        this.calllog('valid', 'all', window.KEYWORD)

        setTimeout(function(){
            switch ($(e.target).attr('data-type')) {
                case 'topic':
                    appSdk.goWebPage('/app/page/search/topic?keyword=' + keyword)
                    break;
                case 'live':
                    appSdk.goWebPage('/app/page/search/live?keyword=' + keyword)
                    break;
                case 'channel':
                    appSdk.goWebPage('/app/page/search/channel?keyword=' + keyword)
                    break;
                default:
                    break;
            }
        }, 200)

    },

    fetchTypeAndRedirect: function (topicId, lshareKey) {
        var that = this;
        var params = {
            topicId: topicId,
        };

        if (that.fetchTypeRedirectLocked) {
            return;
        }

        this.fetchTypeRedirectLocked = true;

        this.showLoading();

        model.fetch({
            url: conf.api.liveRedirect,
            data: params,
            success: function (res) {
                that.hideLoading();
                that.fetchTypeRedirectLocked = false;
                if (res && res.state && res.state.code === 0) {
                    switch (res.data.type) {
                        case 'introduce':
                            appSdk.linkTo('dl/live/topic/introduce?topicId=' + res.data.content + (lshareKey ? ('&lshareKey=' + lshareKey): ''));
                            break;
                        case 'channel':
                            appSdk.linkTo('dl/live/channel/homepage?channelId=' + res.data.content + (lshareKey ? ('&lshareKey=' + lshareKey): ''));
                            break;
                        case 'topic':
                            appSdk.linkTo('dl/live/topic?topicId=' + res.data.content + (lshareKey ? ('&lshareKey=' + lshareKey): ''));
                            break;
                    }
                }
            },
            error: function () {
                that.fetchTypeRedirectLocked = false;
                that.hideLoading();
            },
        });
    },

    /**
     * 显示loading样式
     * @return {[type]} [description]
     */
    showLoading: function () {
        if (!this.loadingObj) {
            this.loadingObj = new loading.AjaxLoading();
        }

        this.loadingObj.show();
    },

    /**
     * 隐藏loading样式
     * @return {[type]} [description]
     */
    hideLoading: function () {
        if (this.loadingObj) {
            this.loadingObj.hide();
        }
    },
}

module.exports = search;
