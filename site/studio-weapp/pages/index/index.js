import Promise from '../../comp/es6-promise';
import * as regeneratorRuntime from '../../comp/runtime';

var app = getApp();

Page({
    data: {
        tabs: [
            {
                key: 'index',
                name: '首页',
                icon: __inline('/comp/tab-menu/img/tab-home.png'),
                activeIcon: __inline('/comp/tab-menu/img/tab-home-active.png'),
                active: true
            },
            // {
            //     key: 'joined',
            //     name: '最近学习',
            //     icon: __inline('/comp/tab-menu/img/topic-icon.png'),
            //     activeIcon: __inline('/comp/tab-menu/img/topic-icon-active.png'),
            //     active: false,
            // },
            {
                key: 'mine',
                name: '我的',
                icon: __inline('/comp/tab-menu/img/mine-icon.png'),
                activeIcon: __inline('/comp/tab-menu/img/mine-icon-active.png'),
                active: false,
            },
        ],
        liveId: "",

        system: app.globalData.system,
    },
    isLogin:false,
    isHidden:false,
    async onLoad(options) {
        // await app.login().then((data) => {
        //     this.isLogin = true;
            
        // });
        this.initData(options);
    },

    onHide() {
        this.isHidden = true;
    },

    async onShow(options) {
        if (!this.isLogin && this.isHidden) {
            this.isHidden = false;
            // await app.login().then(() => {
            //     this.isLogin = true;
                
            // });
            this.initData(options);
        }
    },
    initData(options){
        const extData = wx.getExtConfigSync();
        const liveId = extData.liveId;
        this.setData({ liveId });
        if (options.key) {
            this.onItemClick({ detail: { key: options.key } });
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

    updateShareConfig(e) {
        this.shareConf = e.detail.config || {}  
    },
    
    shareConf: {},
    onShareAppMessage() {
        return this.shareConf
    },
});