'use strict';
import log from '../../comp/log';
import {
    getUserInfo, getVal, imgUrlFormat, formatSecondToTimeStr,linkTo
} from '../../comp/util';
import { decode } from '../../comp/querystring'
import { api } from '../../config';
import request from '../../comp/request';
import { AudioPlayer } from '../../comp/audio-player';
import * as regeneratorRuntime from '../../comp/runtime';


const app = getApp();

Page({
    data: {
        // 是否为大师课的查看更多页面
        showGrandMaster: false,
        list: [],
        
        page: 1,
        size: 20,
        noMore: false,
        noneOne: false,
        regionCode: '',//区域编码

        /*ios的判断，支付按钮隐藏*/
        system: app.globalData.system
    },
    
    onLoad(options){
        console.log("::::::::::::"+this.data.system);
        this.options = options;
        app.login().then(() => {
            global.loggerService.pv();
            // 动态改变页面标题
            let {regionCode,name} = this.options
            wx.setNavigationBarTitle({
                title: decodeURIComponent(name)
            })
            this.setData({
                showGrandMaster: regionCode == 'dashi',
                regionCode
            })

            this.loadPage();
        }).catch(err => console.error(err));
    },

    /* 请求锁 */
    fetchingList: false,
    loadPage() {
        if (this.fetchingList) { return }
        
        const { page, size, noMore, noneOne, lastCourseTime } = this.data
        if (noMore || noneOne) {
            return
        }

        this.fetchingList = true
        const params = {
            page: {page, size},
            regionCode: this.data.regionCode
        };

        request({
            url: api.viewMore,
            method: 'POST',
            data: params,
        }).then((res) => {
            this.fetchingList = false

            const list = getVal(res, 'data.data.dataList', [])
            console.log(res)
            this.updateList(list);
        }).catch((e) => {
            this.fetchingList = false
            app.hideLoading();
        });
    },
    updateList(data) {
        let {
            noneOne, noMore, page, size, list
        } = this.data
        
        noMore = !data.length 
        noneOne = !data.length && page === 1
        console.log('noMore',noMore)

        list = list.concat(data)
        page += 1
        
        this.setData({ noneOne, noMore, page, list})
    },
});
