require('zepto');
// require('zeptofix');
require('tapon');

var // fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    validator = require('validator'),
    Scrollload = require('scrollload_v3'),
    toast = require('toast'),
    // urlutils = require('urlutils'),
    // appSdk = require('appsdk'),
    Tabbar = require('tabbar'),
    Promise = require('promise'),
    hbarcompare = require('hbarcompare'),
    hbardefaultVal = require('hbardefaultVal'),
    utils = require('../../comp/common-js/ql-common'),

    view = require('./view'),
    conf = require('../conf');

/**
 * [index description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './message.css'
 */
var messageTopic = {
    initData: null,

    nomoreConsult: null,

    init: function (initData) {
        this.defaultTab = utils.getQueryString('type') === 'topic' ? 'topic' : 'channel';
        this.topics=initData.TOPICS;
        this.channel=initData.CHANNELS;
        this.liveId=initData.LIVE_ID;

        this.consultChannelPage=2;
        this.consultChannelSize=20;

        this.consultTopicPage=2;
        this.consultTopicSize=20;
        view.listViewInit(this.topics, this.channel, this.defaultTab);

        this.initTabBar(initData.TAB_NUMBERS);
        // 下拉加载更多功能开启
        this.enableScrollLoad();

        this.initBindExposure(this.defaultTab);
    },

    initTabBar: function (tabNumbers) {
        new Tabbar({
            container: $('.tab-bar'),
            tabs: [
                {
                    key: 'channel',
                    title: '系列课 ' + (tabNumbers.channelCount == 0 ? '' : '(' +  tabNumbers.channelCount + ')'),
                    active: this.defaultTab === 'channel',
                },
                {
                    key: 'topic',
                    title: '单课 ' + (tabNumbers.topicCount == 0 ? '' : '(' +  tabNumbers.topicCount + ')'),
                    active: this.defaultTab === 'topic',
                },
            ],
            onTabClick: this.loadTabContent.bind(this),
        })
    },

    initBindExposure: function (key) {
        var bindKey = '_hasBindExposure_' + key;
        if (this[bindKey]) return;
        this[bindKey] = true;
        setTimeout(function () {
            exposure.bindScroll(key + '-list-wrap');
        }, 200)
    },

    /**
     * tab切换
     */
    loadTabContent: function (key) {
        if (key === 'channel') {
            $('.channel-list-wrap').show();
            $('.topic-list-wrap').hide();
            view.setTitle('系列课留言表')

            typeof _qla === 'undefined' || _qla.click({region: 'tab-channel'});
        } else if (key === 'topic') {
            $('.channel-list-wrap').hide();
            $('.topic-list-wrap').show();
            view.setTitle('话题留言表')

            typeof _qla === 'undefined' || _qla.click({region: 'tab-topic'});
        }
        this.initBindExposure(key);
    },

    /**
     * 加载咨询
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadTopicMessages: function(reset, loaded) {
        if (!loaded) {
            loaded = function () { };
        }

        var that = this,
            params = {
                liveId: this.liveId,
                type: 'topic',
                page: this.consultTopicPage,
                size: this.consultTopicSize,
            };


        this.topicScroller.updateScrollStatus('loading');

        model.fetch({
            url: conf.api.consultMList,
            data: params,
            success: function(res) {
                console.log(res);
                if (res && res.state && res.state.code === 200) {
                    console.log(res.data);
                     if (!res.data || !res.data.data||!res.data.data.topicList || !res.data.data.topicList.length ||
                        res.data.data.topicList.length < that.consultTopicSize) {
                        that.nomoreConsult = true;
                        loaded(true);
                    }else{
                        loaded();
                    }

                    view.updateTopicConsults(reset, res.data&&res.data.data && res.data.data.topicList);


                    // view.listViewInit(this.messages);
                    // 加载图片
                    setTimeout(lazyimg.loadimg, 50);

                    that.consultTopicPage+= 1;
                } else {
                    loaded();
                }
            },
            error: function() {
                loaded();
            },
        });
    },

    loadChannelMessage: function(reset, loaded) {
        var that = this,
        params = {
            liveId: this.liveId,
            type: 'channel',
            page: this.consultChannelPage,
            size: this.consultChannelSize,
        };

        this.channelScroller.updateScrollStatus('loading');

        model.fetch({
            url: conf.api.consultMList,
            data: params,
            success: function(res) {
                if (res && res.state && res.state.code === 200) {
                     if (!res.data || !res.data.data||!res.data.data.topicList || !res.data.data.topicList.length ||
                        res.data.data.topicList.length < that.consultTopicSize) {
                        that.nomoreConsult = true;
                        loaded(true);
                    }else{
                        loaded();
                    }

                    view.updateChannelConsults(reset, res.data&&res.data.data && res.data.data.topicList);


                    // view.listViewInit(this.messages);
                    // 加载图片
                    setTimeout(lazyimg.loadimg, 50);

                    that.consultChannelPage+= 1;
                } else {
                    loaded();
                }
            },
            error: function() {
                loaded();
            },
        });
    },


    /**
     * 下拉加载更多
     * @return {[type]} [description]
     */
    enableScrollLoad: function() {
        var that = this;
        this.channelScroller = new Scrollload({
            $el: $('.channel-list-wrap'),
            el_noMore: '.channel-no-more',
            el_loading: '.channel-loading-next',
            loadFun: function () {
                return new Promise(function (resolve, reject) {
                    that.loadChannelMessage(false, resolve);
                });
            },
            toBottomHeight: 100,
        });
        this.topicScroller = new Scrollload({
            $el: $('.topic-list-wrap'),
            el_noMore: '.topic-no-more',
            el_loading: '.topic-loading-next',
            loadFun: function () {
                return new Promise(function (resolve, reject) {
                    that.loadTopicMessages(false, resolve);
                });
            },
            toBottomHeight: 100,
        });


    },

};

module.exports = messageTopic;


var exposure = (function () {

    var collectExposure = function (wrapOrClassName, callback) {
        var wrap = wrapOrClassName;
        typeof wrapOrClassName === 'string' && (wrap = document.getElementsByClassName(wrapOrClassName)[0]);
        wrap || (wrap = document.body);

        var items = Array.prototype.slice.call(wrap.getElementsByClassName('on-visible')),
            i,
            len = items.length,
            item,
            result = [];

        var wrapRect = wrap.getBoundingClientRect();
        
        if (wrapRect.top != wrapRect.bottom) {
            for (i = 0; i < len; i++) {
                item = items[i];
                if (item.hasAttribute('isVisible')) {
                    continue;
                }
                if (isElementInViewport(item, wrapRect)) {
                    result.push(item);
                    item.setAttribute('isVisible', 1);
                }
            }
        }

        typeof callback === 'function' || (callback = commonCollectVisible);
        callback(result);
    }

    var bindScrollExposure = function (className, callback) {
        var wrap;
        className && (wrap = document.getElementsByClassName(className)[0]);
        wrap || (wrap = document.body);

        collectExposure(className, callback);
        wrap.addEventListener('scroll', debounce(function () {
            collectExposure(wrap, callback);
        }));
    }

    var commonCollectVisible = function (items) {
        var logs = [];

        items.forEach(function (item) {
            var namedNodeMap = item.attributes,
                params = {};

            for (var i = 0, len = namedNodeMap.length; i < len; i++) {
                var attr = namedNodeMap[i],
                    key;

                if (attr.name.indexOf('log-') === 0 || attr.name.indexOf('data-log-') === 0) {
                    key = attr.name.substring(4);

                    if (attr.name.indexOf('data-log-') === 0) {
                        key = attr.name.substring(9);
                    }

                    if (key) {
                        params[key] = encodeURIComponent(encodeURIComponent(attr.value));
                    }
                }
            }

            logs.push(params);
        })

        if (!logs.length) return;
        typeof _qla === 'undefined' || _qla('visible', {
            logs: JSON.stringify(logs)
        })
    }

    var isElementInViewport = function (el, wrapRect) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < wrapRect.top
            || rect.top > wrapRect.bottom
            || rect.right < wrapRect.left
            || rect.left > wrapRect.right
        ) {
            return false;
        }
        return true;
    }

    var debounce = function (fn, delay) {
        var timer;
        return function () {
            var args = arguments;
            var context = this;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay || 200);
        }
    }

    return {
        collect: collectExposure,
        bindScroll: bindScrollExposure,
    }
})();