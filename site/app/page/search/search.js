require('zepto');
// zeptofix
require('tapon');

// var Promise = require('promise');
var fastClick = require('fastclick');
var model = require('model');
var appSdk = require('appsdk');

// var Scrollload = require('scrollload_v3');
var scrollload = require('scrollload');
var Promise = require('promise');
var toast = require('toast');

var view = require('./view');
var conf = require('../conf');

/**
 * @require '../../components_modules/reset.css'
 * @require './search.css'
 */

var search = {
    /* 初始化*/
    init: function () {
        this.initListeners();
    },

    /* 初始化事件绑定*/
    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        /* 点击取消按钮返回上一页*/
        $('.cancel').click(function (e) {
            history.go(-1);
        })

        /* 点击清除按钮则清除已输入内容*/
        $('.clear').click(function (e) {
            that.onClearClick(e);
        })

        /* 搜索框输入事件*/
        $('#search-input').keyup(function (e) {
            that.onInputKeyUp(e);
        })

        $('#search-input').change(function (e) {
            that.onInputChange(e);
        });

        $('body').on('click', '#search', function (e) {
            that.doSearch();
        })

        /* 点击更多按钮事件*/
        $('body').on('click', '.more', function (e) {
            that.onMoreClick(e);
        })

        /* 返回按钮点击事件*/
        $('body').on('click', '.back', function (e) {
            that.onBackClick();
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

        this.firstSearch();
    },

    searchWordPipe: function () {
        return this.searchWord.length > 10 ?
            this.searchWord.slice(0, 10) + '...'
            : this.searchWord
    },

    onTopicClick: function (e) {
        var id = $(e.currentTarget).attr('data-id');
        var oriUrl = $(e.currentTarget).attr('data-url');

        // location.href = '/topic/' + id + '.htm';
        this.fetchTypeAndRedirect(id, oriUrl);
    },

    onChannelClick: function (e) {
        var id = $(e.currentTarget).attr('data-id');
        var oriUrl = $(e.currentTarget).attr('data-url');
        appSdk.linkTo('dl/live/channel/homepage?channelId=' + id, oriUrl);
        // location.href = '/live/channel/channelPage/' + id + '.htm';
    },

    onLiveClick: function (e) {
        var id = $(e.currentTarget).attr('data-id');
        var oriUrl = $(e.currentTarget).attr('data-url');
        appSdk.linkTo('dl/live/homepage?liveId=' + id, oriUrl);
        // location.href = '/live/' + id + '.htm';
    },

    /* 当前搜索词和搜索历史*/
    searchWord: '',
    searchHistory: [],

    /* 搜索框输入事件*/
    onInputChange: function (e) {
        var val = $('#search-input').val().trim();
        /* 更新搜索词*/
        this.searchWord = val;
    },

    /* 搜索框输入事件*/
    onInputKeyUp: function (e) {
        var val = $('#search-input').val().trim();
        /* 有内容则显示清除按钮，否则隐藏*/
        val ? view.showClear() : view.hideClear();
    },

    firstSearch: function () {
        var val = $('#search-input').val().trim();
        if (val) {
            $('#search-input').trigger('keyup');
            this.doSearch();
        }
    },


    /* 清除按钮点击*/
    onClearClick: function (e) {
        /* 清除已输入内容并隐藏按钮*/
        view.clearInput();
        view.hideClear();
    },

    /* 更多按钮点击*/
    onMoreClick: function (e) {
        switch ($(e.target).attr('data-type')) {
            case 'topic': this.fetchTopics(this.searchWord); break;
            case 'live': this.fetchLives(this.searchWord); break;
            case 'channel': this.fetchChannels(this.searchWord); break;
            default: break;
        }
        this.viewState = true;
        view.scrollToTop();
    },

    /* 点击返回按钮*/
    onBackClick: function (e) {
        // view.clearAll();
        // var index = this.searchHistory.indexOf(this.searchWord);
        // var word;
        // if (index > 0) {
        //     word = this.searchHistory[index - 1];
        //     this.searchWord = word;
        //     $('#search-input').val(word);
        //     this.doSearch();
        // }
        // if (index === 0) { history.go(-1); }
        view.updateMain();
        this.pageNum = 1;
        this.scroller = null;
        if (this.viewState) {
            this.doSearch();
        } else {
            history.go(-1);
        }
    },

    viewState: false,

    /* 点击搜索按钮事件*/
    doSearch: function (e) {
        var that = this;
        if (!this.searchWord) { return; }
        $('#search-input').blur();
        /* 将当前搜索词加入搜索历史*/
        var val = $('#search-input').val();

        this.searchWord = val;
        this.searchHistory.push(this.searchWord);

        var opt = {
            url: conf.api.searchAll,
            data: {
                keyword: that.wordFilter(val),
                page: {
                    page: 1,
                    size: 3,
                },
            },
            success: function (res) {
                console.log(res);
                if (res && res.state && res.state.code === 0) {
                    view.showResult(res.data);
                    view.scrollToTop();
                    that.viewState = false;
                }
            },
            error: function (res) {
                if (res && res.state && res.state.msg) {
                    toast.toast(res.state.msg);
                } else {
                    toast.toast('请求错误，请稍后重试');
                }
            },
        }
        this.doFetch(opt);

        typeof _qla != 'undefined' && _qla('click', {
            keyword: that.wordFilter(that.searchWordPipe()),
            region: 'search',
        });
    },

    /* 默认获取长度*/
    pageSize: 20,
    pageNum: 1,

    /* 获取话题*/
    fetchTopics: function (len) {
        var that = this;
        var opt = {
            url: conf.api.searchTopic,
            data: {
                keyword: that.searchWord,
                page: {
                    page: 1,
                    size: 20,
                },
            },
            success: function (res) {
                if (res && res.state && res.state.code === 0) {
                    console.log(res);
                    that.pageNum = 2;
                    view.showTopics(res.data);
                    if (!res.data.topicEnd) {
                        that.enableScrollLoad('topic');
                    }
                } else {
                    toast.toast(res.state.msg);
                }
            },
            error: function (res) {
                if (res && res.state && res.state.msg) {
                    toast.toast(res.state.msg);
                } else {
                    toast.toast('请求错误，请稍后重试');
                }
            },
        };
        this.doFetch(opt);
    },

    /* 获取直播间*/
    fetchLives: function () {
        var that = this;
        var opt = {
            url: conf.api.searchLive,
            data: {
                keyword: that.searchWord,
                page: {
                    page: 1,
                    size: 20,
                },
            },
            success: function (res) {
                if (res && res.state && res.state.code === 0) {
                    console.log(res);
                    that.pageNum = 2;
                    view.showLives(res.data);
                    if (!res.data.liveEnd) {
                        that.enableScrollLoad('live');
                    }
                } else {
                    toast.toast(res.state.msg);
                }
            },
            error: function (res) {
                if (res && res.state && res.state.msg) {
                    toast.toast(res.state.msg);
                } else {
                    toast.toast('请求错误，请稍后重试');
                }
            },
        }
        this.doFetch(opt);
    },

    /* 获取频道*/
    fetchChannels: function () {
        var that = this;
        var opt = {
            url: conf.api.searchChannel,
            data: {
                keyword: that.searchWord,
                page: {
                    page: 1,
                    size: 20,
                },
            },
            success: function (res) {
                if (res && res.state && res.state.code === 0) {
                    console.log(res);
                    that.pageNum = 2;
                    view.showChannels(res.data);
                    if (!res.data.channelEnd) {
                        that.enableScrollLoad('channel');
                    }
                } else {
                    toast.toast(res.state.msg);
                }
            },
            error: function (res) {
                if (res && res.state && res.state.msg) {
                    toast.toast(res.state.msg);
                } else {
                    toast.toast('请求错误，请稍后重试');
                }
            },
        }
        this.doFetch(opt);
    },

    fetchLock: false,

    /* 发起ajax请求*/
    doFetch: function (options) {
        if (this.fetchLock) return;
        this.fetchLock = true;

        var that = this;
        var $opt = {
            loading: true,
            /* 请求结束后解除ajax锁*/
            complete: function () {
                that.fetchLock = false;
            },
        }
        $.extend($opt, options);

        model.fetch($opt);
    },

    scroller: null,

    /* 初始化滚动加载*/
    enableScrollLoad: function (loadType) {
        var that = this;

        /* 重置滚动加载页码和scroller实例*/
        this.pageNum = 2;
        this.scroller = null;
        this.scroller = new scrollload.UpScrollLoad(
            'main',
            function (loadingCtx, finishFn, errorFn) {
                that.loadMore(finishFn, errorFn, loadType);
            }, {
                marginBottom: 1000,
            })
    },

    /* 加载更多*/
    nomoreData: false,
    loadMore: function (finishFn, errorFn, loadType) {
        if (this.nomoreData) return;
        scrollload.updateScrollStatus('loading');

        var that = this;

        var url;
        switch (loadType) {
            case 'topic': url = conf.api.searchTopic; break;
            case 'channel': url = conf.api.searchChannel; break;
            case 'live': url = conf.api.searchLive; break;
            default: break;
        }

        var opt = {
            url: url,
            data: {
                keyword: that.searchWord,
                page: {
                    page: that.pageNum,
                    size: 20,
                },
            },
            success: function (res) {
                scrollload.updateScrollStatus('loaded');
                if (res && res.state && res.state.code === 0) {
                    console.log(res);
                    /* 渲染列表*/
                    view.loadMore(res.data, loadType);
                    /* 如果已经是结尾则resolved*/
                    if (res.data.topicEnd || res.data.channelEnd || res.data.liveEnd) {
                        that.nomoreData = true;
                        scrollload.updateScrollStatus('hide');
                    }
                    /* 页码+1*/
                    that.pageNum++;
                } else {
                    toast.toast(res.state.msg);
                }
                if (finishFn) {
                    finishFn();
                }
            },
            error: function (res) {
                if (res && res.state && res.state.msg) {
                    toast.toast(res.state.msg);
                } else {
                    toast.toast('请求错误，请稍后重试');
                }
            },
        }
        model.fetch(opt);
    },

    fetchTypeAndRedirect: function (topicId, oriUrl) {
        var that = this;
        var params = {
            topicId: topicId,
        };

        if (that.fetchTypeRedirectLocked) {
            return;
        }

        this.fetchTypeRedirectLocked = true;

        view.showLoading();

        model.fetch({
            url: conf.api.liveRedirect,
            data: params,
            success: function (res) {
                view.hideLoading();
                that.fetchTypeRedirectLocked = false;
                if (res && res.state && res.state.code === 0) {
                    switch (res.data.type) {
                        case 'introduce':
                            appSdk.linkTo('dl/live/topic/introduce?topicId=' + res.data.content, oriUrl);
                            break;
                        case 'channel':
                            appSdk.linkTo('dl/live/channel/homepage?channelId=' + res.data.content, oriUrl);
                            break;
                        case 'topic':
                            appSdk.linkTo('dl/live/topic?topicId=' + res.data.content, oriUrl);
                            break;
                    }
                }
            },
            error: function () {
                that.fetchTypeRedirectLocked = false;
                view.hideLoading();
            },
        });
    },


    wordFilter: function (ff) {
        var ffData = ff;
        ffData = ffData.replace(/\</g, '&lt;');
        ffData = ffData.replace(/\>/g, '&gt;');
        ffData = ffData.replace(/\"/g, '&quot;');
        ffData = ffData.replace(/\'/g, '&#39;');
        return ffData;
    },
}

module.exports = search;
