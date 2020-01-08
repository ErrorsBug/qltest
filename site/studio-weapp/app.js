//app.js

import objectAssin from './comp/object-assign';
Object.assign = objectAssin;

import { 
    checkSession, 
    loginWx, 
    getUserInfo, 
    getLoginSessionId,
    setStorageSync, 
    getStorageSync,
    getVal,
    linkTo,
    getCurrentPageUrl
} from './comp/util';
import { api } from './config';
import request from './comp/request';
import Promise from './comp/es6-promise';
import { CommonService } from './service/common.service'
const appConfig = __inline('./app.json')

App({
    globalData: {
        userInfo: null,
        system: null,
        loginQueue: [],
    },
    /* 全局播放按钮的数据 */
    audioBox: {
        logo: '',
        link:'',
    },
    onLaunch(options) {
        const extData = wx.getExtConfigSync();
        const { liveId, extId } = extData;

        global.liveId = liveId
        global.appId = extId
        global.weappVer = appConfig.weappVer
        global.commonService = new CommonService()

        this._init();
    },

    onShow(options) {
        this._init();

        /* 跳转到官方小程序支付完毕后回到三方小程序时需要跳转回对应页面 */
        if (options.referrerInfo) {
            let redirectUrl = getVal(options,'referrerInfo.extraData.redirectUrl')
            if (redirectUrl) {
                wx.redirectTo({ url: redirectUrl })
            }
        }
    },

    /**
     * 初始化方法，主要做全局的配置、登录授权
     * @return {[type]} [description]
     */
    _init() {
        wx.getSystemInfo({
            success: res => {
                if (res.system.toLowerCase().indexOf('ios') >= 0) { this.globalData.system = 'ios'; }
                if (res.system.toLowerCase().indexOf('android') >= 0) { this.globalData.system = 'android'; }
            }
        })
    },

    login(loginstr) {
        return new Promise((resolve, reject) => {
            this.globalData.loginQueue.push({
                resolve,
                reject,
            });

            if (this.globalData.loginQueue.length > 1) {
                return
            }
            
            // 检查登录session是否过期
            if (!getLoginSessionId()) {//getStorageSync
                this._doLogin(loginstr).then((data) => {
                    if(loginstr){this.hideLoading();}
                    this.clearLoginQueue('resolve',data);
                }, (err) => {
                    if(loginstr){this.hideLoading();}
                    console.error(err);
                    this.clearLoginQueue('reject');
                    
                });
            // 登录session未过期
            } else {
                // 判断登录状态是否过期
                checkSession().then((data) => {
                    console.info('登录状态正常，不用重复登录！');
                    this.clearLoginQueue('resolve',data);
                    if(loginstr){this.hideLoading();}
                }, (err) => {
                    this._doLogin(loginstr).then((data) => {
                        this.clearLoginQueue('resolve',data);
                        if(loginstr){this.hideLoading();}
                    }, (err) => {
                        if(loginstr){this.hideLoading();}
                        console.error(err);
                        this.clearLoginQueue('reject');
                        
                    });
                });
            }
        });
    },

    /**
     * 登录操作
     * @return {[type]} [description]
     */
    _doLogin(loginstr) {
        
        return new Promise((resolve, reject) => {
            if(loginstr){this.showLoading();} 
            //调用登录接口
            loginWx().then((loginRes) => {
                
                if (loginRes.code) {
                    // 获取用户信息
                    getUserInfo().then((userInfoRes) => {
                        // wx.showNavigationBarLoading();
                        this.loginInfo(loginRes.code,userInfoRes,loginstr).then((data)=>{
                            resolve(data);
                        },(e)=>{
                            console.error(e);
                            reject(e);
                        });
                    }).catch((err)=>{
                        reject(Error('获取用户信息失败！' + err))
                        this.redirectLoginPage();
                    });
                } else {
                    reject(Error('调用wx.login获取code失败！' + loginRes.errMsg));
                    // this.redirectLoginPage();
                }
            }, (err) => {
                reject(Error('调用微信登录失败！', err));
                // this.redirectLoginPage();
            })
        });
    },

    redirectLoginPage(){
        var urlresule = getCurrentPageUrl();
        //如果没有授权登录，则跳转到授权登录页面，手动点击登录
        if( getCurrentPages()[0].__route__ !=='pages/login-page/login-page'){
            wx.redirectTo({
                url: '/pages/login-page/login-page?redirectUrl='+ encodeURIComponent('/' + urlresule),
            })
            return false;
        }
    },
    
    loginInfo(code,userInfoRes,loginstr) {
        return new Promise((resolve, reject) => {
            const { rawData, signature, iv, encryptedData } = userInfoRes;
            const extData = wx.getExtConfigSync();
            const appId = extData.extId;
            const liveId = extData.liveId;
            // 登录授权
            request({
                url: api.login,
                data: {
                    appId,
                    code: code,
                    rawData,
                    signature,
                    iv,
                    encryptedData
                }
            }).then((apiRes) => {
                const apiResData = apiRes.data;
                
                
                // 保存sid, session状态保持
                if (apiResData && apiResData.state && apiResData.state.code === 0) {
                    const { merchantUser, qlchatUser, sid, expires } = apiResData.data;
                    if (qlchatUser && qlchatUser.userId) {
                        this.saveLoginSessionId(sid, expires);
                        
                        // 保存用户信息
                        // 需重新请求
                        request({ url: api.userInfo, data: {},}).then((data) => {
                            this.saveUserInfo(data.user, expires);
                            console.info('获取用户信息成功');
                            resolve(data.user);
                        },(err)=>{
                            this.redirectLoginPage();
                            reject(Error('获取用户信息失败！ msg:', err));
                        })
                        console.info('登录成功！');
                        
                        
                    } else {
                        console.info('redirct');
                        const { openId } = merchantUser;

                        let authSuccessRedirect = loginstr || encodeURIComponent('/' + getCurrentPageUrl())
                        // let  authSuccessRedirect = loginstr;
                        reject();
                        linkTo.webpage(`/wechat/page/weapp/studio/auth?liveId=${liveId}&appId=${appId}&merchantOpenId=${openId}&redirect=${authSuccessRedirect}`)
                        
                    }
                } else {
                    this.redirectLoginPage();
                    reject(Error('调用授权登录接口失败！ msg:', apiResData.state.msg));
                    // throw Error('调用授权登录接口失败！ msg:', apiResData.state.msg);
                }
            }, (err) => {
                this.redirectLoginPage();
                reject(Error('wx.request接口调用失败！' + err));
                // throw Error('wx.request接口调用失败！' + err);
            })
        })
    },
     /**
     * 清空消费队列
     * @param {String} state 登录状态，成功:resolve，失败: reject
     */
    clearLoginQueue(state,data) {
        if (state === 'resolve') {
            this.globalData.loginQueue.forEach(item => item.resolve(data));
        } else {
            this.globalData.loginQueue.forEach(item => item.reject());
        }
        this.globalData.loginQueue = [];
    },

     /**
     * 检测是否登录
     * @param {String}
     */
    checkLogin(resolve) {
        // 判断登录状态是否过期
        getUserInfo().then((userInfoRes) => {
            resolve();
        }).catch((err)=>{
            this.redirectLoginPage();
        });
    },

    /**
     * 本地存储sid，保持session状态（过期时间和服务端同步，2天）
     * @param  {[type]} sid     [description]
     * @param  {[type]} expires [description]
     * @return {[type]}         [description]
     */
    saveLoginSessionId(sid, expires) {
        setStorageSync('sid', sid, expires);
        setStorageSync("miniSessionKey",sid, expires);
        setStorageSync("session_key",sid, expires);
        
    },
    /**
     * app全局存储用户信息
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    saveUserInfo(data, expires) {
        this.globalData.userInfo = data;
        if (data && data.userId) {
            setStorageSync('userId', data.userId, expires);
        }
    },

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
