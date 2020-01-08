import log from '../../comp/log';
import { getVal } from '../../comp/util'
import request from '../../comp/request'
import { api } from '../../config';

const app = getApp();

Page({
    data: {
        activeTab: '',
        sysTime: null,

        initTab: {
            topic: false,
            channel: false,
            vip: false,
        },
    },
    onLoad: function onLoad() {
        app.login().then(() => {
            global.loggerService.pv()

            console.log('onLoad');
            // 初始化tab-menu
            this.getSysTime()
            this.onTabClick({ detail: { tab: 'channel' } })
            // 页面pv日志
            log.pv({
                page: '购买记录',
                url: this.getPageUrl()
            });
        });
    },
    getSysTime() {
        request({
            url: api.sysTime,
            data: {},
        }).then(res => {
            this.setData({ sysTime: getVal(res, 'data.data.sysTime') })
        }).catch(err => {
            console.error('获取系统时间失败: ', err)
        })
    },
    onTabClick(e) {
        const { initTab } = this.data
        initTab[e.detail.tab] = true

        this.setData({
            activeTab: e.detail.tab,
            initTab,
        })
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
});
