var envi = require('./envi');
var urlutils = require('./url-utils');

var appSdk = {
    /**
     * 跳转到原生页面
     * version: 2.0.0
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T11:25:57+0800
     * @param    {[type]}                           url [description]
     * @return   {[type]}                               [description]
     */
    linkTo: function (url, oriUrl) {
        var protocol = 'qlchat://';
        var link = protocol + url;
        if (oriUrl) {
            var search = new URL(oriUrl).search;
            var shareKey = urlutils.getUrlParams('shareKey', search);
            var lshareKey = urlutils.getUrlParams('lshareKey', search);

            var newSearch = '';
            shareKey && (newSearch += '&shareKey=' + shareKey);
            lshareKey && (newSearch += '&lshareKey=' + lshareKey);

            if (newSearch && /\?.*(?=\b|#)/.test(link)) {
                newSearch && (link += newSearch)
            } else {
                newSearch && (link += '?' + newSearch.splice(1))
            }
        }
        window.location.href = link;
    },

    /**
     * 新webview打开页面
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-12-29T17:34:10+0800
     * @param    {[type]}                           url [description]
     * @return   {[type]}                               [description]
     */
    goWebPage: function (url) {
        var ver = envi.getQlchatVersion();

        if (ver && ver >= 210) {
            if (url.indexOf('http') < 0) {
                url = window.location.protocol + window.location.host + url;
            }

            this.linkTo('dl/webpage?url=' + encodeURIComponent(url));
        } else {
            window.location.href = url;
        }
    },

    /**
     * app开启分享
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2017-02-27T17:22:19+0800
     * @param    {[type]}                           opts [description]
     * @return   {[type]}                                [description]
     */
    share: function(opts) {
        opts = opts || {};

        this.linkTo('dl/share/link?' +
            'title=' + encodeURIComponent(opts.wxqltitle || '') +
            '&content=' + encodeURIComponent(opts.descript || '') +
            '&shareUrl=' + encodeURIComponent(opts.shareUrl || '') +
            '&thumbImageUrl=' + encodeURIComponent(opts.wxqlimgurl || '')
        );
    },

    ready: function() {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function') {
            qlchat.ready(function() {});
        }
    },

    /**
     * 支持回调的分享调起协议
     * 支持版本：>= 3.6
     * @param  {[type]} opts 分享的参数配置
     *  opts: {
     *  	type: 'link' 或 'image'    表示分享的类型为链接或图片，默认为'link'
     *  	content:   ''    要分享的链接或图片（可传base64), 在type为'link'时，默认取当前页地址。其它type时，该参数必传
     *  	title: 分享标题，不传默认为页面标题
     *  	desc: 分享描述
     *  	thumbImage： 缩略图链接或者base64
     *
     *  }
     * @return {[type]}      [description]
     */
    shareAndCallback: function(opts) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && opts) {
            opts = opts || {};

            // 默认分享页面
            opts.type = opts.type || 'link';

            // 默认使用当前页面链接
            if (!opts.content && opts.type === 'link') {
                opts.content = window.location.href;
            }

            // 必要参数校验
            if (!opts.content) {
                throw Error('缺少分享配置参数: content');
                return;
            }

            opts.title = opts.title || document.title;

            console.log('share config:', opts);

            qlchat.ready(() => {
                qlchat.share({
                	type: opts.type,       // "link" "image"
                	content: opts.content, // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
                	title: opts.title,
                	desc: opts.desc || '',
                	thumbImage: opts.thumbImage || '',  // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
                    success: opts.success || ((res) => {}),  // 成功回调
                    fail: opts.fail || ((err) => {console.error(err)}),        // 失败回调
                });
            });
        }
    },

    /**
     * 分享配置，用于app三个点调起的分享初始化
     * 支持版本：>= 3.6
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    shareConfig: function(opts) {
        if (typeof qlchat != 'undefined' && opts) {
            opts = opts || {};

            // 默认分享页面
            opts.type = opts.type || 'link';

            // 默认使用当前页面链接
            if (!opts.content && opts.type === 'link') {
                opts.content = window.location.href;
            }

            // 必要参数校验
            if (!opts.content) {
                throw Error('缺少分享配置参数: content');
                return;
            }

            opts.title = opts.title || document.title;

            console.log('share config:', opts);

            var shareConfig = {
            	type: opts.type,       // "link" "image"
            	content: opts.content, // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
            	title: opts.title,
            	desc: opts.desc || '',
            	thumbImage: opts.thumbImage || '',  // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
                success: opts.success || ((res) => {}),  // 成功回调
                fail: opts.fail || ((err) => {console.error(err)}),        // 失败回调
            };

            qlchat.ready(() => {
                // Todo 还没有支持分享到哪里的定制，默认全部配置
                if (qlchat.onMenuShareWeChatTimeline) {
                    qlchat.onMenuShareWeChatTimeline(shareConfig);
                }

                if (qlchat.onMenuShareWeChatFriends) {
                    qlchat.onMenuShareWeChatFriends(shareConfig);
                }

                if (qlchat.onMenuShareWeibo) {
                    qlchat.onMenuShareWeibo(shareConfig);
                }
            });
        }
    },

    /**
     * app支付封装
     * 支持版本：>= 3.6
     * @param  {[type]} params 支付传参。具体参数参考app支付接口文档
     * @return {[type]}        [description]
     */
    pay: function(params) {
        // console.log('pay params: ', params);
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.pay(params || {})
            });
        }
    },
    /**
     * 用于页面加载完成，  获取整个页面HTML
     */
    onLoadedHtml: function(params) {
        
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function') {
            qlchat.ready(() => {
                qlchat.onLoadedHtml(params || '')
            });
        }
    },
    /**
     * 保存图片
     * @param {*} url 
     */
    saveImage: function(params) {
        // alert(JSON.stringify(params))
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.saveImage(params)
            });
        }
    },
    /**
     * 分享图片到微信
     * @param {*} params 
     */
    shareImageToWeChat: function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function') {
            qlchat.ready(() => {
                qlchat.shareImageToWeChat(params || '')
            });
        }
    },
    /**
     * 分享图片到微信朋友圈
     * @param {*} params 
     */
    shareImageToWeChatCircle: function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function') {
            qlchat.ready(() => {
                qlchat.shareImageToWeChatCircle(params || '')
            });
        }
    },
    /**
     * 一次性订阅
     * @param {*} params 
     */
    sendSubscribeMessage: function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.sendSubscribeMessage(params || '')
            });
        }
    },
    /**
     * 跳转app原生页面
     * @param {*} params 
     */
    callNativeView: function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.callNativeView(params || '')
            });
        }
    },
    /**
     * 女子大学补卡支付调用 安卓
     * @param {*} params 
     */
    resign:function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.resign(params || '')
            });
        }
    },
    /**
     * 体验营支付 app
     * @param {*} params 
     */
    commonOrder: function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.commonOrder(params || '')
            });
        }
    },
    /**
     * 体验营支付后一次性订阅 app
     * @param {*} params 
     */
    commonSubscribeMessage: function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.commonSubscribeMessage(params || '')
            });
        }
    },
    /**
     * 表单采集提交
     * @param {*} params 
     */
    checkFormAction:function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.checkFormAction(params || '')
            });
        }
    },
    /**
     * 全新app跳转方式（开启APP二级页面）
     * @param {*} params 
     */
    pushNativePage:function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.pushNativePage(params || '')
            });
        }
    },
    /**
     * 退出当前页面
     * @param {*} params 
     */
    popPage:function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.popPage(params || '')
            });
        }
    },
    /**
     * 退出登录
     * @param {*} params 
     */
    logoutAction:function(params) {
        if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
            qlchat.ready(() => {
                qlchat.logoutAction(params || '')
            });
        }
    },
};

export default appSdk;
