var loading = require('loading');
var Handlebars = require('handlebars');

var tpls = {
    result: __inline('./tpl/result.handlebars'),
    topics: __inline('./tpl/topics.handlebars'),
    lives: __inline('./tpl/lives.handlebars'),
    channels: __inline('./tpl/channels.handlebars'),
    topic: __inline('./tpl/topic.handlebars'),
    live: __inline('./tpl/live.handlebars'),
    channel: __inline('./tpl/channel.handlebars'),
};

require('hbardateformat');
require('hbarcompare');

require('./helper');

/* 搜索区域各元素*/
var $clear = $('.clear');
var $search = $('.search');
var $cancel = $('.cancel');
var $input = $('#search-input');

var view = {

    /* 显示清除按钮并更改搜索按钮状态*/
    showClear: function () {
        this.showElement($clear);
    },

    /* 隐藏清除按钮并更改搜索按钮状态*/
    hideClear: function () {
        this.hideElement($clear);
        this.clearAll();
    },

    /* 隐藏一个元素*/
    hideElement: function ($el) {
        $el.attr('hidden', true)
    },

    /* 显示一个元素*/
    showElement: function ($el) {
        $el.removeAttr('hidden');
    },

    /* 清空输入框内容*/
    clearInput: function () {
        $input.val('');
    },

    /* 清空每个result下的内容*/
    clearAll: function () {
        $('#search-result').html('');
        $('#channel-result').html('');
        $('#topic-result').html('');
        $('#live-result').html('');
    },

    /* 显示搜索结果*/
    showResult: function (data) {
        this.clearAll();
        $('#search-result').append(tpls.result({
            topics: data.topics,
            lives: data.lives,
            topicEnd: data.topicEnd,
            liveEnd: data.liveEnd,
            channels: data.channels,
            channelEnd:data.channelEnd,
            hasContent: data.topics.length  || data.lives.length || data.channels.length,
        }));
    },

    /* 显示搜索的话题列表*/
    showTopics: function (data) {
        this.clearAll();
        $('#topic-result').append(tpls.topics({
            topics: data.topics,
        }));
    },

    /* 显示搜索的频道列表*/
    showChannels: function (data) {
        this.clearAll();
        $('#channel-result').append(tpls.channels({
            channels: data.channels,
        }));
    },

    /* 显示搜索的直播间列表*/
    showLives: function (data) {
        this.clearAll();
        $('#live-result').append(tpls.lives({
            lives: data.lives,
        }));
    },

    /* 滚动加载更多*/
    loadMore: function (data, loadType) {
        switch (loadType) {
            case 'topic': this.loadMoreTopics(data); break;
            case 'channel': this.loadMoreChannels(data); break;
            case 'live': this.loadMoreLives(data); break;
            default: break;
        }
    },

    /* 滚动加载更多话题*/
    loadMoreTopics: function (data) {
        $('#topics').append(tpls.topic({
            topics: data.topics,
        }))
    },

    /* 滚动加载更多频道*/
    loadMoreChannels: function (data) {
        $('#channels').append(tpls.channel({
            channels: data.channels,
        }))
    },

    /* 滚动加载更多直播间*/
    loadMoreLives: function (data) {
        $('#lives').append(tpls.live({
            lives: data.lives,
        }))
    },

    updateMain: function () {
        var template='<main id="main-content"><div class="search-result" id="search-result"></div><div id="topic-result"></div><div id="channel-result"></div><div id="live-result"></div></main>';  
        $('#main-content').remove();
        $('#container').append(template);
    },

    scrollToTop: function () {
        $('#main-content').scrollTop(0);
    },
    /**
     * 显示loading样式
     * @return {[type]} [description]
     */
    showLoading: function() {
        if (!this.loadingObj) {
            this.loadingObj = new loading.AjaxLoading();
        }

        this.loadingObj.show();
    },

    /**
     * 隐藏loading样式
     * @return {[type]} [description]
     */
    hideLoading: function() {
        if (this.loadingObj) {
            this.loadingObj.hide();
        }
    }
}

module.exports = view;