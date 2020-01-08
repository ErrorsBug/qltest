'use strict';
import * as regeneratorRuntime from '../../comp/runtime'
import request from '../../comp/request'
import { getVal } from '../../comp/util'

const app = getApp();

Page({
    data: {
        redirectUrl: '',
        appLogo:'',
        appName:'',
    },
    //事件处理函数
    onLoad: function (options) {
        
        let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}

        this.setData({
            redirectUrl: options.redirectUrl,
        });
        // 查看是否授权
        wx.getSetting({
            success: function(res){
            if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                // wx.getUserInfo({
                // success: function(res) {
                // }
                // })
            }
            }
        })
        
        this.fetchLiveIntro();
    },
    onGotUserInfo: function(e) {
        app.login(this.data.redirectUrl).then(() => {
            this.setData({
                userInfo: e.detail.userInfo,
            });
            wx.redirectTo({
                url: decodeURIComponent(this.data.redirectUrl),
            });
        });
    },
    async fetchLiveIntro() {
        const liveId = global.liveId
        const result = await request({
            url:'/api/studio-weapp/live/info',
            data: { liveId },
        })
        if (getVal(result, 'data.state.code') === 0) {
            this.setData({
                appLogo:getVal(result, 'data.data.entity.logo')||'https://img.qlchat.com/qlLive/activity/image/BVYTKCAB-EL8W-T66M-1569236183471-UZDAYDOW91IA.jpg',
                appName:getVal(result, 'data.data.entity.name'),
            })
        } else {
            // wx.showToast({ title: '获取简介失败' })
        }
    },
});
