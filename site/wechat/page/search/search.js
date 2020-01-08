require('zepto');
// zeptofix
require('tapon');

// var Promise = require('promise');
var fastClick = require('fastclick');
var model = require('model');
var Scrollload = require('scrollload_v3');
var Promise = require('promise');
var toast = require('toast');

var view = require('./view');
var conf = require('../conf');

/**
 * @require '../../components_modules/reset.css'
 * @require './search.css'
 */

var search = {
    /*初始化*/
    init: function () {
        this.initListeners();

        /* bind this */
        this.onMoreClick = this.onMoreClick.bind(this)
        this.onTopicClick = this.onTopicClick.bind(this)
        this.onChannelClick = this.onChannelClick.bind(this)
        this.onLiveClick = this.onLiveClick.bind(this)
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
            this.searchWord.slice(0,10) + '...'
            : this.searchWord
    },

    onTopicClick: function (e) {
        this.calllog('valid', 'all', this.searchWord)
        var id = $(e.currentTarget).attr('data-id');
        setTimeout(function(){
            location.href = '/topic/' + id + '.htm?pro_cl=search';
        }, 200)
    },

    onChannelClick: function (e) {
        this.calllog('valid', 'all', this.searchWord)
        var id = $(e.currentTarget).attr('data-id');
        setTimeout(function(){
            location.href = '/live/channel/channelPage/' + id + '.htm?sourceNo=search';
        }, 200)
    },

    onLiveClick: function (e) {
        this.calllog('valid', 'all', this.searchWord)
        var id = $(e.currentTarget).attr('data-id');
        setTimeout(function(){
            location.href = '/wechat/page/live/' + id;
        }, 200)
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
        this.calllog('valid','all', this.searchWord)
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

    /**
     * 搜索结果valid
     *
     * 搜索出结果后点击话题/系列课/直播间或点击[更多]按钮将会记录一条日志，
     * 表示当次搜索是有效搜索，且一次搜索结果只记录一次。一个临时处理方法便
     * 是每次搜索出结果，打印success日志时将validState设置为true，打过一次
     * valid日志后便设置为false，防止重复打日志
     *
     */
    validState: false,

    /**
     * 打日志
     *
     * @param {string} actions 有效值为 success|fail|valid
     * @param {string} type 搜索类型，有效值为 topic|channel|live|all
     * @param {string} keyword 搜索关键词
     */
    calllog: function(actions, type, keyword) {
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

    viewState: false,

    /* 点击搜索按钮事件*/
    doSearch: function (e) {
        var that = this;
        var val = $('#search-input').val();
        if (!val) {
            return;
        }
        $('#search-input').blur();

        /* 将当前搜索词加入搜索历史*/
        this.searchWord = val;
        this.searchHistory.push(this.searchWord);

        var opt = {
            url: conf.api.searchAll,
            data: {
                keyword: that.wordFilter(val),
                page: {
                    page: 1,
                    size: 3,
                }
            },
            success: function (res) {
                console.log(res);
                if (res && res.state && res.state.code === 0) {

                    if(!res.data.lives.length && !res.data.topics.length){
                        that.calllog('fail', 'all', val)
                    }else{
                        that.calllog('success', 'all', val)
                    }

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
                    if(res.data.minimumShouldMatch){
                        that.minimumShouldMatch = res.data.minimumShouldMatch
                    }
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
                    if(res.data.minimumShouldMatch){
                        that.minimumShouldMatch = res.data.minimumShouldMatch
                    }
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
                    if(res.data.minimumShouldMatch){
                        that.minimumShouldMatch = res.data.minimumShouldMatch
                    }
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
        this.scroller = new Scrollload({
            $el: $('main'),
            toBottomHeight: 1200,
            el_noMore: '.no-more',
            el_loading: '.loading-next',
            loadFun: function () {
                return new Promise(function (resolve, reject) {
                    /* 加载更多内容*/
                    that.loadMore(resolve, loadType);
                });
            },
        })
    },

    /**
     * 是否采用最小匹配比例
     *
     * 第一次是最大限度匹配，如果数量少于5条，就要降级，75%匹配。通过传值实现。
     * 有效取值: {string} Y|N
     * 列表接口请求第一次会返回，之后的请求需要带上这个参数
     * 由于不存在同时请求topic|channel|live第二页的情况，因此三种类型的请求
     * 共用此属性不做区分
     */
    minimumShouldMatch: 'N',

    /* 加载更多*/
    loadMore: function (loaded, loadType) {
        var that = this;
        if (!loaded) {
            loaded = function () { };
        }

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
                minimumShouldMatch: that.minimumShouldMatch,
            },
            success: function (res) {
                if (res && res.state && res.state.code === 0) {
                    console.log(res);
                    /* 渲染列表*/
                    view.loadMore(res.data, loadType);
                    /* 如果已经是结尾则resolved*/
                    if (res.data.topicEnd || res.data.channelEnd || res.data.liveEnd) {
                        loaded(true);
                    } else {
                        loaded();
                    }
                    /* 页码+1*/
                    that.pageNum++;
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
        model.fetch(opt);
    },

    wordFilter: function (ff) {
        var ffData = ff;
        ffData = ffData.replace(/\</g, "&lt;");
        ffData = ffData.replace(/\>/g, "&gt;");
        ffData = ffData.replace(/\"/g, "&quot;");
        ffData = ffData.replace(/\'/g, "&#39;");
        return ffData;
    },
}

module.exports = search;
