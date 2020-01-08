//index.js

import log from '../../comp/log';
import { linkTo, getStorageSync } from '../../comp/util';
import request from '../../comp/request';

//获取应用实例
var app = getApp();

Page({
    data: {
        scrollHeight: '100%',

        // 空列表
        isEmpty: false,

        // 加载中
        loading: false,

        // 是否没有更多
        nomore: false,


    },
    onLoad(option) {
        app.login().then(() => {
            this.assortId = option.id;
            this.page = 1;
            this.pageSize = 20;

            this.setTitle(this.assortId);

            // 初始化页面滚动区域高度
            this.initScrollHeight();

            // 加载数据并渲染
            this.fetchLives();

            // 页面pv日志
            log.pv({
                page: this.pageTitle,
                url: this.getPageUrl()
            });
        });
    },

    getPageUrl() {
        return this.__route__ + '?id=' + this.assortId;
    },

    /**
     * 获取本地存储的大分类信息设置页面标题
     * @param {[type]} assortId [description]
     */
    setTitle(assortId) {
        let assortsTitles = getStorageSync('assortsTitles', assortsTitles),
            pageTitle;

        if (assortId) {
            pageTitle = assortsTitles[assortId];
        }

        if (pageTitle) {
            this.pageTitle = pageTitle + '类热门直播间';
            wx.setNavigationBarTitle({
                title: this.pageTitle
            });
        }
    },

    /**
     * 初始化滚动列表高度
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    initScrollHeight(e) {
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    scrollHeight: (res.windowHeight) + 'px'
                });
            }
        })
    },

    /**
     * 滚屏到底部事件处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleScrollToLower(e) {
        this.fetchLives();
    },

    /**
     * 直播间点击处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleLiveTap(e) {
        let currentTarget = e.currentTarget,
            id = currentTarget.dataset.id;

        wx.navigateTo({
            url: '/pages/index/index?liveId=' + id,
        });

        // linkTo.liveIndex(id);
    },

    /**
     * 关注按钮点击处理
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleFocusBtnTap(e) {
        let currentTarget = e.currentTarget,
            liveId = currentTarget.dataset.id,
            status = currentTarget.dataset.status;

            status = status === 'N' ? 'Y': 'N';

            app.showLoading();

            request({
                url: '/api/studio-weapp/live/focus',
                data: {
                    liveId: liveId,
                    status: status
                }
            }).then(res =>{
                app.hideLoading();

                let lives = this.data.lives,
                    statusTip;

                lives = lives.map(live => {
                    if (live.id === liveId) {
                        return {...live, isFocus: live.isFocus === 'Y' ? 'N': 'Y'};
                    } else {
                        return live;
                    }
                });

                this.setData({
                    lives: lives
                });

                if (status === 'Y') {
                    statusTip = '关注成功'
                } else {
                    statusTip = '已取消关注'
                }

                wx.showToast({
                    title: statusTip,
                    icon: 'success',
                });
            });
    },

    /**
     * 加载直播间列表
     * @return {[type]} [description]
     */
    fetchLives() {

        if (this.nomoreLives) {
            console.log('没有更多直播间了！');
            return;
        }

        request({
            url: '/api/studio-weapp/assort/hot-lives',
            data: {
                tagId: this.assortId,
                page: this.page,
                size: this.pageSize
            }
        }).then((res) => {
            let data = res.data.data || res.data,
                lives;

            if (data && data.length && data[0].state && data[0].state.code === 0) {
                lives = data && data.length && data[0].data && data[0].data.lives;

                this.page += 1;

                if (!lives || lives.length < this.pageSize) {
                    this.nomoreLives = true;
                }

                this.loadLives(lives);
            }
        }, err => {
            console.error(err);
        }).catch(err => {
            console.error(err);
        });
    },

    /**
     * append渲染直播间列表
     * @param  {[type]} lives [description]
     * @return {[type]}       [description]
     */
    loadLives(lives) {
        lives = lives || [];

        lives = [...(this.data.lives || []), ...lives];

        this.setData({
            lives: lives,
            isEmpty: lives.length == 0
        });
    },
    /**
     * 页面分享设置
     * @return {[type]} [description]
     */
    onShareAppMessage() {
        return {
            title: '[小程序]千聊' + this.pageTitle,
            desc: '大家都在关注的直播间',
            path: '/pages/hot-live/hot-live?id=' + this.assortId
        };
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    }
});
