'use strict';

//joined.js

import log from '../../comp/log';
import { linkTo, imgUrlFormat } from '../../comp/util';
import { api } from '../../config';

import { timeAfter, isBeginning ,dateFormat } from '../../comp/filter';
import request from '../../comp/request';

const app = getApp();

Page({
    data: {
        redirectUrl:'',
    },
    //事件处理函数
    onLoad: function onLoad(options) {
        
        this.setData({
            redirectUrl: options.redirectUrl,
        })
        
        // 查看是否授权
        wx.getSetting({
            success: function(res){
            if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                success: function(res) {
                    console.log(res.userInfo)
                }
                })
            }
            }
        })
    },
    onGotUserInfo: function(e) {
        console.log(e.detail.errMsg)
        console.log(e.detail.userInfo)
        console.log(e.detail.rawData)
        app.login(this.data.redirectUrl).then(() => {
            this.setData({
                userInfo: e.detail.userInfo,
            });
            wx.redirectTo({
                url: decodeURIComponent(this.data.redirectUrl),
            });
        });
    },
});
