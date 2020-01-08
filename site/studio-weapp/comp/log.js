import { setStorageSync, getStorageSync,logParams } from './util';
import request from './request';

var app = getApp(),

    LOG_KEY = '_local_logs';


const log = {
    /**
     * 获取系统参数
     * @return {[type]} [description]
     */
    getGlobalParams() {
        try {
            let res = wx.getSystemInfoSync();
            return res;
        } catch (e) {
          console.error('get systeminfo err.', e);
          return {};
        }
    },
    /**
     * 页面访问日志api
     * @param {[Object]}  ctx     页面对象
     * @param  {[Object]} options pv日志参数，日志必打字段： page-页面标题，url:页面url
     * @return {[type]}         [description]
     */
    pv(options) {
        if (`'__API_PREFIX'`.indexOf('h5.qianliao.cn') === -1) {
            return;
        }

        let urlDetail = logParams({...(this.getGlobalParams()), ...options,
            site: 'studio-weapp',
            userId: getStorageSync('userId') || '',
            weappVer: global.weappVer
        })
        

        request({
            url: 'https://qlchat.cn-hangzhou.log.aliyuncs.com/logstores/qlchat-collect/track_ua.gif',
            data: {
                APIVersion:'0.6.0',
                logType: 'pv',
                detail:urlDetail,
            }
        }).then((res) => {
            console.info('pv log sent!');
        }, (err) => {
            console.error('pv log error.', err);
        }).catch((err) => {
            console.error('pv log error.', err);
        });
    }
}

export default log;
