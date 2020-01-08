'use strict';

//joined.js

import log from '../../comp/log';
import { linkTo, imgUrlFormat } from '../../comp/util';
import { api } from '../../config';

import { timeAfter, isBeginning ,dateFormat } from '../../comp/filter';
import request from '../../comp/request';

const app = getApp();
let loadPamas={
    page:1,
    size:20,
    statusnone:true,
    isloading:false
};

Page({
    data: {
        // followers:[]
    },
    //事件处理函数
    onLoad: function onLoad() {
        app.login().then(() => {
            global.loggerService.pv()

            console.log('onLoad');
            loadPamas={
                page:1,
                size:10,
                statusnone:true,
                isloading:false
            };
            // 初始化tab-menu
            this.beginPage();

            // 页面pv日志
            log.pv({
                page: '我的关注',
                url: this.getPageUrl()
            });
        });
    },
    getPageUrl() {
        return this.__route__;
    },
    linkTolive:function linkTolive (e){
        linkTo.liveIndex(e.currentTarget.dataset.liveid);
    },
    beginPage:function beginPage(){
        let loadData={
            page:loadPamas.page,
            size:loadPamas.size
        }
        request({
             url: api.getFollowerInit,
             data:loadData,
        }).then((res) => {
            var data = res.data;
            console.log(data)
            this.dataInitView(data);
        }).catch((e)=>{

        });
    },
    loadFollower:function loadFollower(){
        let loadData={
            page:loadPamas.page,
            size:loadPamas.size
        }
        request({
             url: api.getFollowerLive,
             data: loadData,
        }).then((res) => {
            var data = res.data.data.liveEntityPos;
            this.dataView(data);
        }).catch((e)=>{

        });
    },
    lower:function lower(e){
        if(loadPamas.statusnone&&!loadPamas.isloading){
            loadPamas.isloading=true;
                this.loadFollower();
            };
    },
    dataView:function dataView(obj){
        let exampleArray=obj;
        if(exampleArray.length<=0){
            if(loadPamas.page==1){
                loadPamas.statusnone=false;
                console.log("暂无数据");
            }else{
                loadPamas.statusnone=false;
                console.log("没有更多");
            }
        };
        loadPamas.page=Number(loadPamas.page)+1;
        loadPamas.isloading=false;
        // 渲染课程数据
        this.loadFollowers(exampleArray);
        this.setData({
            "hasLoad":loadPamas.statusnone
        });
    },
    dataInitView:function dataInitView(obj){
        let creatorData=obj.creater.data.liveEntityPos;
        let managerData=obj.manager.data.liveEntityPos;
        let followerData=obj.follower.data.liveEntityPos;
        this.loadCreator(creatorData);
        this.loadManager(managerData);
        this.loadFollowers(followerData);
        loadPamas.page=Number(loadPamas.page)+1;
        this.setData({
            "hasLoad":loadPamas.statusnone
        });
    },
    loadCreator:function loadCreator (creaters) {
        var creaters = creaters || [];

        creaters = [...(this.data.creaters || []), ...creaters];

        this.setData({
            creaters: creaters
        });
    },
    loadManager:function loadManager (managers) {
        var managers = managers || [];

        managers = [...(this.data.managers || []), ...managers];

        this.setData({
            managers: managers
        });
    },
    loadFollowers:function loadFollowers (followers) {
        var followers = followers || [];

        followers = followers.map(item => {
            const logo = imgUrlFormat(item.logo, "?x-oss-process=image/resize,m_fill,limit_0,h_60,w_60") 
            return { ...item, logo}
        })
        followers = [...(this.data.followers || []), ...followers];
        this.setData({
            followers: followers
        });
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    }
});
