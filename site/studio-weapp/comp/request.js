// import Promise from 'es6-promise';
import { wxPromisify, getStorageSync, setStorageSync, getLoginSessionId } from './util';
import { apiPrefix } from '../config';

// 接口数据存储key值
const _REQ_API_ST_KEY_ = '_request_data_';

/* 请求数据*/
export default (opt) => {

    opt.data = opt.data || {};
    opt.data.weappVer = global.weappVer
    opt.data.caller = 'studio-weapp'

    // 给请求注入sessionid用于session获取
    let sid = getLoginSessionId();
    if (sid) {
        opt.data.sid = sid;
    }

    if (opt.url.indexOf('http') != 0) {
        opt.url = apiPrefix + (opt.url.indexOf('/') === 0 ? '' : '/') + opt.url;
    }

    // console.info('开始请求接口！参数：', opt);

    // 开启缓存
    if (opt.cache && opt.expires > 0) {
        let startTime = Date.now();
        let cacheKey = getCacheKeyString(opt),
            data = getStorageSync(cacheKey);

        // 存在缓存
        if (data) {
            return new Promise((resolve, reject) => {
                resolve(data);
                console.info('缓存响应！res:', data, ' 耗时：',  Date.now() - startTime);
            });
        }

        return new Promise((resolve, reject) => {
            wxPromisify(wx.request)(opt).then((res) => {
                resolve(res);

                // 响应数据正常（非异常或为空）
                if (isResponseCanCache(res)) {
                    console.info('开始设置缓存！');
                    setStorageSync(cacheKey, res, opt.expires);
                }
            }, (err) => {
                reject(err);
            });
        });
    }

    return wxPromisify(wx.request)(opt);
};

/**
 * 根据接口地址及参数构造本地缓存唯一健值
 * @param  {Object} opt                 request请求的option对象
 *   opt.cacheWithoutKeys    不作缓存健值生成策略参考的参数key的列表
 * @return {String}             请求的唯一标识字符串
 */
const getCacheKeyString = (opt) => {

    let cacheWithoutKeys = opt.cacheWithoutKeys || [],
        pairs = [];

    for (var key in opt.data) {
        var value = opt.data[key];
        if (cacheWithoutKeys.indexOf(key) < 0) {
            pairs.push(key + '=' + JSON.stringify(value));
        }
    }

    // 以下方式部分android不兼容
    // for (let [key, value] of Object.entries(opt.data)) {
    //     if (cacheWithoutKeys.indexOf(key) < 0) {
    //         pairs.push(key + '=' + JSON.stringify(value));
    //     }
    // };

    return `${_REQ_API_ST_KEY_}${opt.url}?${pairs.join('&')}&${(opt.method || '').toLowerCase()}`;
}

/**
 * 判断返回值是否可缓存
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
const isResponseCanCache = (res) => {
    let json = res.data,
        data;


    // 状态异常不缓存
    if (!json || !json.state || json.state.code != 0) {
        return false;
    }

    data = json.data;

    // 数据为空不缓存
    // 数组
    // if (Array.isArray(data)) {
    if (Object.prototype.toString.call(data) === '[object Array]') {
        if (!data.length) {
            return false;
        }

        return true;
    }

    // 对象
    if ('object' === typeof data) {
        if (!Object.keys(data).length) {
            return false;
        }

        return true;
    }

    return true;
}
