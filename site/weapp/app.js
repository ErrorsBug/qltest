//app.js

import objectAssin from './comp/object-assign';
Object.assign = objectAssin;

import { login, getUserInfo, getLoginSessionId, setStorageSync, getStorageSync } from './comp/util';
import { api } from './config';
import request from './comp/request';
import Promise from './comp/es6-promise';

import { LoggerService } from './service/logger.service'
import { CommonService } from './service/common.service'
import { loginService } from './service/login.service'

import * as aldstat from './comp/aldstat/ald-stat' 
const appConfig = __inline('./app.json')

App({
    globalData: {
        userInfo: null,
        system: null,
    },
    /* 全局播放按钮的数据 */
    audioBox: {
        logo: '',
        link:'',
    },
    onLaunch() {
        console.log('onLaunch app');
        this._init();

        /* 配置小程序版本号 */
        global.weappVer = appConfig.weappVer
        global.loggerService = new LoggerService(this)
        global.commonService = new CommonService()
    },

    /* 场景值 */
    scene:null,
    onShow(options) {
        console.log('onShow app');
        if (options.scene) {
            global.scene = options.scene
        }
        this._init();
    },

    /**
     * 初始化方法，主要做全局的配置、登录授权
     * @return {[type]} [description]
     */
    _init() {

        // this.login().then(() => {
        //     // console.info('登录成功！');
        // }, () => {
        //     console.error('登录失败！');
        // });
        // 获取系统信息
        // wx.redirectTo({
        //     url:'pages/intro-topic/intro-topic?topicId=220000121003729',
        // });
        wx.getSystemInfo({
            success: res => {
                if (res.system.toLowerCase().indexOf('ios') >= 0) { this.globalData.system = 'ios'; }
                if (res.system.toLowerCase().indexOf('android') >= 0) { this.globalData.system = 'android'; }
            }
        })
    },

    login: loginService.login,

    /**
     * 显示页面loading加载框
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    showLoading(option) {
        this.isLoading = true;

        wx.showToast({
            icon: 'loading',
            title: '加载中...',
            mask: true,
            duration: 10000,
            ...option,
            success: () => {
                setTimeout(() => {
                    if (this.isLoading) {
                        this.showLoading(option);
                    }
                }, option && option.duration || 10000);
            }
        });
    },
    /**
     * 隐藏页面加载框
     * @return {[type]} [description]
     */
    hideLoading() {
        this.isLoading = false;
        try {
            wx.hideToast();
        } catch (error) {
            console.error('hide loading error: ', error);
        }

    },

    /**
     * 全局报错捕获
     * @param  {[type]} error [description]
     * @return {[type]}       [description]
     */
    onError(error) {
        console.error(error);
    }
});
