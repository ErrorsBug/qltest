import React, { Component } from 'react'
import { isQlchat, isIOS, isAndroid } from 'components/envi'
import appSdk from 'components/app-sdk'
import { locationTo } from 'components/util'

/**
 * 用于调用app(安卓、IOS)相关的方法
 * @param {*} WrappedComponent
 * @returns
 */
const HandleAppFunHoc = (WrappedComponent) => {
    return class extends Component {
        /**
         * 调用IOS、安卓相关方法
         * @param {string} event 方法名称
         * @param {object} params 参数 
         */
        handleAppSdkFun = (event, params = {}) => {
            if(isQlchat()){
                const data = { ...params };
                if(data.callback) {
                    delete data.callback;
                    delete data.success;
                    delete data.fail;
                }
                if(isAndroid()){
                    appSdk[event](data)
                    // 安卓回调兼容
                    appSdk.onSuccess('onSuccess', () => {
                        params.callback && params.callback()
                    })
                }
                if(isIOS()) {
                    delete data.callback;
                    window?.webkit?.messageHandlers[event].postMessage({ 
                        ...data,
                        callBackEventName: `window.${ event }Call` // 触发函数名称
                    })
                    // IOS调用回调函数,触发函数
                    window[event+'Call'] = function (responseData) {
                        params.callback && params.callback(responseData)
                    }
                }
            }
        }
        // 用于安卓回调
        onSuccess(event, cb) {
            window?.WebViewJavascriptBridge?.registerHandler(event, function(data, responseCallback) {
                cb();
            });
        }
        // 处理app二级跳转
        handleAppSecondary = (url, params = {}) => {
            if(isQlchat()) {
                if(!url.includes('https') && !url.includes('http')) {
                    url = location.origin + url
                }
                if((isIOS() && !window?.webkit?.messageHandlers?.pushNativePage) || (isAndroid() && !appSdk.pushNativePage)) {
                    locationTo(url)
                } else {
                    const obj = { entry: {
                            "target": "webpage",
                            "webUrl":url, 
                        }, ...params}
                    this.handleAppSdkFun('pushNativePage', {
                        ...obj
                    })
                }
            } else { 
                locationTo(url)
            }
        }
        render() {
            return (
                <WrappedComponent { ...this.props } 
                    onSuccess={ this.onSuccess } 
                    handleAppSdkFun={ this.handleAppSdkFun } 
                    handleAppSecondary={ this.handleAppSecondary } />
            )
        }
    }
}
export default HandleAppFunHoc