'use strict';
import log from '../../../../comp/log';
import { linkTo, getUserInfo } from '../../../../comp/util';
import { api } from '../../../../config';
import request from '../../../../comp/request';
import Promise from '../../../../comp/es6-promise';
import * as regeneratorRuntime from '../../../../comp/runtime';
//mine.js

const app = getApp();

Component({
    data: {
        userInfo: {},
        minePreview: {},
        system: app.globalData.system,
        isLogin:false
    },
    methods: {
        requestMinePreview() {
            request({
                url: api.minePreview,
                method:'GET',
                data: {},
            }).then((res) => {
                this.setData({
                    minePreview: res.data.data,
                })
            }).catch((e) => {
                console.error(e)
            });
        },
        //事件处理函数
        mineBuyRecord: function mineBuyRecord() {
            linkTo.buyRecord();
        },
        mineJoined: function mineFocusLive() {
            linkTo.mineJoined();
        },
        getPageUrl() {
            return this.__route__;
        },
        goLogin() {
            app.checkLogin(() => {})

        },
    },
    ready: async function ready() {
        // await app.login().then(() => {
            
        // });
        var that = this;

        // 判断登录状态是否过期
        getUserInfo().then((userInfoRes) => {
            that.setData({
                isLogin: true,
                userInfo: userInfoRes.userInfo
            });
            this.requestMinePreview()
        });

        // 页面pv日志
        // log.pv({
        //     page: '个人中心',
        //     url: this.getPageUrl()
        // });
    }
});
