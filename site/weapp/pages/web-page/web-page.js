//获取应用实例
const app = getApp();

Page({

    // domain: 'http://localhost:5000',
    domain: '__H5_PREFIX',

    data: {
        url: '',
        show: false,
    },

    onLoad(options) {
        let url = options.url;
        global.loggerService.pv()

        try {
            url = decodeURIComponent(options.url);
        } catch (err) {
            console.error(err);
        }

        if (!/^(https?:)?\/\//.test(url)) {
            url = this.domain + url
        }

        // let show = !(app.globalData.system == 'ios' && /(details\-audio\-graphic)/.test(url));
        let show = !(app.globalData.system == 'ios');
        this.setData({
            url,
            show
        });

        if (!show) {
            wx.hideShareMenu();
        }
    },

    /**
     * 分享信息设置
     * @return {[type]} [description]
     */
    onShareAppMessage(options) {
        return {
            title: '[小程序]千聊',
            desc: '让你找到最全面有用的知识合集',
            path: '/pages/web-page/web-page?url=' + encodeURIComponent(options.webViewUrl)
        };
    },
});
