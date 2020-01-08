var app = getApp();

import log from '../../comp/log';
import { linkTo, getVal, digitFormat, getStorageSync } from '../../comp/util';
// import { initTabMenu } from '../../comp/tab-menu/tab-menu';
import { initSwiperBanners } from '../../comp/swiper-banners/swiper-banners';
import { api } from '../../config';
import request from '../../comp/request';

Page({
    data: {
        tabs: [{
            key: 'index',
            name: '首页',
            icon: __inline('/comp/tab-menu/img/tab-home.png'),
            activeIcon: __inline('/comp/tab-menu/img/tab-home-active.png'),
            active: true
        }, {
            key: 'joined',
            name: '最近学习',
            icon: __inline('/comp/tab-menu/img/topic-icon.png'),
            activeIcon: __inline('/comp/tab-menu/img/topic-icon-active.png'),
            active: false
        }, {
            key: 'mine',
            name: '我的',
            icon: __inline('/comp/tab-menu/img/mine-icon.png'),
            activeIcon: __inline('/comp/tab-menu/img/mine-icon-active.png'),
            active: false
        }],
        showContent: false,
        system: app.globalData.system,
    },

    /* 将onload方法传入的options存起来 */
    options: null,

    /* 是否调用过onHide，用来区分是打开app的onShow还是后台切回来的onShow */
    isHidden: false,

    onLoad(options) {
        this.options = options
        app.login().then(() => {
            this.init(options)
        });
    },

    onShow() {
        if (!global.isLogined && this.isHidden) {
            app.login().then(() => {
                this.init(this.options)
            }); 
        }
    },

    onHide() {
        this.isHidden = true
    },

    init(options) {
        global.loggerService.pv()

        this.setData({
            showContent: true,
        })

        if (options.weappShareCard === 'Y') {
            this.shareCardScanHandle(options)
            return;
        }
        
        if (options.key) {
            this.onItemClick({ detail: { key: options.key } });
        }
    },

    /**
     * 是否邀请卡扫描后进来页面的，是的话需要直接跳转到对应页面
     */
    shareCardScanHandle(options) {
        try {
            let dataStr = decodeURIComponent(decodeURIComponent(options.shareCardData));
            let data = {};
            
            dataStr.split('&').forEach(item => data[item.split('=')[0]] = item.split('=')[1]);
            
            if (data.businessType === 'channel') {
                wx.navigateTo({
                    url: `/pages/channel-index/channel-index?channelId=${data.businessId}&shareKey=${data.shareKey}`
                });
            }
        } catch (error) {
            console.error(error);
        }
    },

    onItemClick(e) {
        let key = this.data.tabs.find(item => item.key === e.detail.key).key;

        this.setData({
            tabs: this.data.tabs.map(item => {
                item.active = item.key === e.detail.key;

                return item;
            })
        });
    },
    
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },

    onShareAppMessage() {
        return {
            title: '千聊Live',
            // imageUrl: 'https://img.qlchat.com/qlLive/liveCommon/weapp-index-pic.jpg',
            desc: `海量专家、老师、达人正在为您分享`,
            path: `/pages/index/index`,
        };
    },
});