'use strict';
import log from '../../../../comp/log';
import { linkTo, getUserInfo } from '../../../../comp/util';
import { api } from '../../../../config';
import request from '../../../../comp/request';
// import * as regeneratorRuntime from '../../../../comp/runtime'
//mine.js

const app = getApp();

Component({
    data: {
        userInfo: {},
        minePreview: {},
        system: app.globalData.system,
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
        mineFocusLive: function mineFocusLive() {
            linkTo.mineFocus();
        },
        mineCoupons: function mineCoupons() {
            linkTo.mineCoupons();
        },
        getPageUrl() {
            return this.__route__;
        },
        onFeedbackClick() {
            const systemInfo = wx.getSystemInfoSync()
            const {userInfo }= this.data

            const data = {
                userInfo,
                systemInfo,
                weappVersion: global.weappVersion,
            }

            request({
                url: '/api/weapp/mine/feedback-info',
                method: 'POST',
                data,
            })
        },
    },
    ready: function ready() {
        var that = this;
        
        getUserInfo().then((userInfoRes) => {
            that.setData({
                userInfo: userInfoRes.userInfo
            });
            this.requestMinePreview()
        }).catch((err)=>{
            console.error("请先登录",err);
        });
    }
});
