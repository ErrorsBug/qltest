//获取应用实例
const app = getApp();

Page({

    // domain: 'http://localhost:5000',
    domain: '__H5_PREFIX',

    data: {
        url: '',
        show:false,
    },

    onLoad(options) {
        let url = options.url;

        try {
            url = decodeURIComponent(options.url);
        } catch (err) {
            console.error(err);
        1}

        // 绝对地址不作处理
        if (!/^http/.test(url)) {
            url = this.domain + url;
        }
        let show = !(app.globalData.system == 'ios' && /(details\-audio\-graphic)/.test(url));
        this.setData({
            url,
            show
        });
    },

    /**
     * 分享信息设置
     * @return {[type]} [description]
     */
    onShareAppMessage(options) {
        let title = this.options.title ? decodeURIComponent(this.options.title) : '[小程序]千聊';

        return {
            title,
            desc: '让你找到最全面有用的知识合集',
            path: '/pages/web-page/web-page?url=' + encodeURIComponent(options.webViewUrl)
        };
    },
});
