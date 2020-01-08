// import Promise from 'es6-promise';
import { apiPrefix } from '../config';
import { encode } from './querystring';

/**
 * 封装微信sdk的promise工厂方法
 *     注：success对应resolve、fail对应reject，complete未转化
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2017-01-04T13:54:51+0800
 * @param    {Function}                         fn [description]
 * @param    {Object}                              [一些默认配置]
 * @return   {[type]}                              [description]
 */
export function wxPromisify(fn, option) {
    return function (obj = {}) {
        return new Promise((resolve, reject) => {
            // if (option) {
            //     for (var key in option) {
            //         obj[key] = option[key];
            //     }
            // }
            // objectAssin(obj, option);
            // 以下方式部分android机不兼容
            Object.assign(obj, option);

            if (!obj.success) {
                obj.success = function (res) {
                    resolve(res);
                };
            }

            if (!obj.fail) {
                obj.fail = function (res) {
                    reject(res);
                };
            }

            fn(obj);
        });
    };
};

export const getLiveId = () => {
    const extData = wx.getExtConfigSync();
    return extData.liveId;
}

export const getLoginSessionId = () => {
    return getStorageSync('sid');
};

/* 检查微信登录状态 */
export const checkSession = wxPromisify(wx.checkSession);

/* 微信登录 */
export const loginWx = wxPromisify(wx.login);

/* 微信获取用户信息 */
export const getUserInfo = wxPromisify(wx.getUserInfo);

/* 发起支付*/
export const pay = wxPromisify(wx.requestPayment);

/* 启动录音*/
export const startRecord = wxPromisify(wx.startRecord);

/* 停止录音*/
export const stopRecord = wxPromisify(wx.stopRecord);

/* */
export const linkTo = {
    liveIndex: id => {
        wx.navigateTo({
            url: '/pages/index/index?liveId=' + id,
        })
    },
    hotLive: id => {
        wx.navigateTo({
            url: '/pages/hot-live/hot-live?id=' + id,
        })
    },
    thousandLive: id => {
        wx.navigateTo({
            url: '/pages/thousand-live/thousand-live?topicId=' + id,
        })
    },
    introTopic: id => {
        wx.navigateTo({
            url: '/pages/intro-topic/intro-topic?topicId=' + id,
        })
    },
    channelIndex: (channelId, topicId) => {
        wx.navigateTo({
            url: `/pages/channel-index/channel-index?channelId=${channelId}&topicId=${topicId || ''}`,
        })
    },
    assort: id => {
        wx.navigateTo({
            url: '/pages/assort/assort?id=' + id,
        })
    },
    buyRecord: id => {
        wx.navigateTo({
            url: '/pages/mine-buy/mine-buy',
        })
    },
    mineFocus: id => {
        wx.navigateTo({
            url: '/pages/mine-focus/mine-focus',
        })
    },
    webpage: url => {
        wx.navigateTo({
            url: '/pages/web-page/web-page?url=' + encodeURIComponent(url)
        })
    },
    mineJoined: id => {
        wx.navigateTo({
            url: '/pages/mine-joined/joined'
        })
    },
    couponSelect: query => {
        let url = deckUrl('/pages/coupon-select/coupon-select', query);
        wx.navigateTo({ url })
    },
    mineCoupons: () => {
        wx.navigateTo({
            url: '/pages/mine-coupons/mine-coupons',
        })
    },
    couponDetails: query => {
        let url = deckUrl('/pages/coupon-details/coupon-details', query);
        wx.navigateTo({ url })
    },
    paymentDetails: query => {
        let url = deckUrl('/pages/payment-details/payment-details', query);
        wx.navigateTo({ url })
    },
}

/**
 * 格式化url
 * @param {string}  url         原始url
 * @param {object}  queryObj
 */
export function deckUrl(url = '', queryObj) {
    queryObj = encode(queryObj)

    if (queryObj) {
        url += '?' + queryObj
    }

    return url
}


/**
 * 本地存储获取方法，若过期则返回空
 * @type {[type]}
 */
export const getStorageSync = key => {
    let data;

    try {
        data = wx.getStorageSync(key);
    } catch (e) {
        console.error('get storage sync failed! ' + JSON.stringify(e));
        return;
    }

    if (data && 'object' === typeof data && data._expires) {
        let nowDate = new Date().getTime();

        // 已过期
        if ((+data._expires) < nowDate) {
            try {
                wx.removeStorageSync(key)
            } catch (e) {
                // Do something when catch error
                console.error('remove storage sync failed! ' + JSON.stringify(e));
            }

            console.info('缓存已过期！', key);
            return;
        }

        return data.value;
    }

    return data;
};

/**
 * 本地存储方法，可设置过期时间
 *
 *	 setStorageSync('test', 1, 10);

     setTimeout(() => {
         console.log('5000:', getStorageSync('test'));
     }, 5000);

     setTimeout(() => {
         console.log('10000:', getStorageSync('test'));
     }, 10000);

     setTimeout(() => {
         console.log('12000:', getStorageSync('test'));
     }, 12000);
 *
 *
 *
 *
 * @param  {String} key    存储的数据的key
 * @param  {Object/String} value 存储的内容
 * @param  {[type]} expires 过期时间（单位：秒(s)）
 * @return {[type]}        [description]
 */
export const setStorageSync = (key, value, expires) => {
    let nowDate = new Date(),
        data;

    if (expires) {
        expires = nowDate.getTime() + (+expires) * 1000;

        data = {
            _expires: expires,
            value
        };
    } else {
        data = value;
    }

    try {
        wx.setStorageSync(key, data);
    } catch (e) {
        console.error('set storage sync failed! ' + JSON.stringify(e));
    }
};

export const getBackAudioStatus = wxPromisify(wx.getBackgroundAudioPlayerState);


/**
 * 获取对象的指定key值
 * eg:
 *  var obj = {
 *      a:1,
 *      b:2,
 *      c:{
 *          d:3,
 *          e:[
 *              1,2,3
 *          ],
 *          f:[
 *              {
 *                  1:2
 *              }
 *          ]
 *      }
 *  };
 *
 *  console.log(
 *      getVal(obj, 'a'),
 *      getVal(obj, 'c.d'),
 *      getVal(obj, 'c.e.1'),
 *      getVal(obj, 'c.f.0.1'),
 *      getVal(obj, 'c.f.f', 'haha'),
 *      obj
 *  )
 * @param {Object|Array} target
 * @param {string} query
 * @param {any} defaultValue
 */
export function getVal(target, query, defaultValue) {
    if (target == null || (typeof target !== 'object' && !target instanceof Array)) {
        console.error('[getProperty]: target必须是Array或者Object，但是当前是' + target);
        return defaultValue;
    }

    if (typeof query !== 'string') {
        throw new Error('[getProperty]: query必须是string。')
    }

    const keys = query.split('.')
    let index = 0;
    let keysLen = keys.length;

    while (target != null && index < keysLen) {
        target = target[keys[index++]];
    }

    if (target == null) {
        return defaultValue;
    }

    return target;
}

/**
 * 数字格式化成万或千
 * @param  {[type]} digit [description]
 * @param  {[type]} block [description]
 * @return {[type]}       [description]
 */
export function digitFormat(digit, block) {

        if ((digit === undefined) || (digit === '')) return 0;

        var format = parseInt(block) || 10000;

        digit = parseInt(digit);

        if (digit >= 1000 && digit < 10000 && format <= 1000) {

            digit = digit / 1000;

            digit = digit.toFixed(1) + '千';


        } else if (digit > 10000 && digit >= format) {

            digit = digit / 10000;

            digit = digit.toFixed(1) + '万';

        }

        return digit;
    }


export const imgUrlFormat = (url, formatStrQ = "?x-oss-process=image/resize,m_fill,limit_0,h_64,w_64", formatStrW = "/64") => {

    if (/(img\.qlchat\.com)/.test(url)) {
        url = url.replace(/@.*/, "") + formatStrQ;
    } else if (/(wx\.qlogo\.cn\/mmopen)/.test(url)) {
        url = url.replace(/(\/(0|132|64|96)$)/, formatStrW);
    };

    return url;
};

/**
 * 格格式输出日期串
 * @param date      {Number/Date}   要格式化的日期
 * @param formatStr {String}        格式串(yMdHmsqS)
 * @returns {*|string}
 */
export function formatDate(date, formatStr) {
    if (!date) {
        return '';
    }

    var format = formatStr || 'yyyy-MM-dd';

    if ('number' === typeof date || 'string' === typeof date) {
        date = new Date(+date);
    }

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;

};

/**
 * 根据时间戳显示多久前的字符串
 * @param  {[type]} pushTime [description]
 * @return {[type]}           [description]
 */
export const timeBefore = (pushTime, nowTime) => {

    var timeNow = parseInt(new Date().getTime()),
        d = ((nowTime || timeNow) - parseInt(pushTime)) / 1000,
        d_days = Math.floor(d / 86400),
        d_hours = Math.floor(d / 3600),
        d_minutes = Math.floor(d / 60);

    if (d_days > 30) {
        return formatDate(pushTime)
    } else if (d_days > 0 && d_days <= 30) {
        return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    } else {
        return '刚刚';
    }
}

/**
 * 几天后
 * @param {*} time
 * @param {*} now
 */
export const timeAfter = (time, now = Date.now()) => {
    const deffTimeStamp = time - now;
    let timeStr = '';
    if (deffTimeStamp > 86400000) {
        timeStr = (~~((deffTimeStamp/86400000))) + '天后'
    } else if (deffTimeStamp > 3600000) {
        timeStr = (~~((deffTimeStamp/3600000))) + '小时后'
    } else {
        timeStr = (~~((deffTimeStamp/60000))) + '分钟后'
    }

    return timeStr;
}

export function formatSecondToTimeStr(second) {
    if (second <= 0) { return '00:00' }
    second = Math.ceil(second)
    let min = (Math.floor(second / 60)).toString()
    while (min.length < 2) {
        min = '0' + min
    }
    let sec = (second % 60).toString()
    while (sec.length < 2) {
        sec = '0' + sec
    }
    return min + ':' + sec
}


export function rmNull (obj = {}) {
    let result = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];

            if (element instanceof Object) {
                result[key] = rmNull(element);
            } else if (element != null) {
                result[key] = element;
            }
        }
    }

    return result;
}

/**
 * 过滤主要特殊字符
 * 注意：此方法的使用场景--过滤后的数据只在node或app展示，不在wt展示
 * @author dodomon
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */
export const normalFilter = (sf) => {
    var sfData = sf || '';
    sfData = sfData.replace(/\</g, (m) => "&lt;");
    sfData = sfData.replace(/\>/g, (m) => "&gt;");
    sfData = sfData.replace(/\"/g, (m) => "&quot;");
    sfData = sfData.replace(/\'/g, (m) => "&#39;");
    sfData = sfData.replace(/(\u0085)|(\u2028)|(\u2029)/g, (m) => "");
    sfData = sfData.replace(/\%/g, (m) => "%25");
    sfData = sfData.replace(/\+/g, (m) => "%2B");
    sfData = sfData.replace(/\#/g, (m) => "%23");
    sfData = sfData.replace(/\//g, (m) => "%2F");
    sfData = sfData.replace(/\?/g, (m) => "%3F");
    sfData = sfData.replace(/\=/g, (m) => "%3D");
    sfData = sfData.replace(/\&/g, (m) => "%26");
    return sfData;
};


/**
 * 获取query参数
 * @param  {string} name 需要获取的参数key值
 * @return {[type]}      [description]
 */
export const getUrlParams = function(name, search) {
    var search = (search || '').match(/\?.*(?=\b|#)/);

    search && (search = (search[0] || '').replace(/^\?/, ''));
    if (!search) return name ? '' : {};
    var queries = {},
        params = search.split('&');

    for (var i in params) {
        var param = params[i].split('=');
        queries[param[0]] = param[1];
    }

    return name ? queries[name] : queries;
};

/**
 * 给url注入参数，注入的参数会覆盖旧参数
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-06-25T09:37:04+0800
 * @param    {Object}                           params  要注入的参数
 * @param    {String}                           url     要注入参数的url, 为空时取当前页面url
 * @param    {Array}                           withouts url中需要排除的参数key数组
 * 例：
 * fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d?aa=1&bb=2&cc=3&b=4#a=0&b=6', ['aa', 'a', 'b', 'c', 'bb', 'cc'])
 *   =》"http://a.b.c.d#a=0&b=6"
 *   
 * fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d?aa=1&bb=2&cc=3&b=4#a=0&b=6', ['aa', 'a', 'b', 'c', 'bb'])
 *   =》"http://a.b.c.d?cc=3#a=0&b=6"
 *   
 *  fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d?aa=1&bb=2&cc=3&b=4#a=0&b=6', ['aa'])
 *   =》"http://a.b.c.d?bb=2&cc=3&a=1&b=2&c=3#a=0&b=6"
 *   
 *  fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d?aa=1&bb=2&cc=3&b=4#a=0&b=6')
 *   =》"http://a.b.c.d?aa=1&bb=2&cc=3&a=1&b=2&c=3#a=0&b=6"
 *
 *  fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d')
 *   =》"http://a.b.c.d?a=1&b=2&c=3"
 *
 * @return   {String}                          注入参数后的url
 */
export const fillParams = function(params, url, withouts) {
    
    if (!url) {
        return '';
    }

    var urlPairs = url.split('#'),
        fullUrl = urlPairs[0],

        hashUrl = urlPairs.length > 1 && ('#' + urlPairs[1]) || '',
        baseUrl = fullUrl.split('?')[0],
        originParams = getUrlParams(null, fullUrl),

        paramsList = [],
        re = '';


    for (var key in originParams) {
        if (undefined === params[key] && indexOfArray(withouts, key) === -1) {
            var v = originParams[key];

            if (undefined === v) {
                v = '';
            }
            paramsList.push(key + '=' + v);
        }
    }

    for (var key1 in params) {
        if (indexOfArray(withouts, key1) === -1) {
            var v1 = params[key1];

            if (undefined === v1) {
                v1 = '';
            }
            paramsList.push(key1 + '=' + v1);
        }
    }

    re += baseUrl;
    re += paramsList.length && ('?' + paramsList.join('&')) || '';
    re += hashUrl;

    return re;
};


 /**
 *
 * 日志使用
 * @param {*} params
 * @param {*} withouts
 * @returns
 */
export const logParams = function(params, withouts) {

    var paramsList = [],
        re = '';

    for (var key1 in params) {
        if (indexOfArray(withouts, key1) === -1) {
            var v1 = params[key1];

            if (undefined === v1) {
                v1 = '';
            }
            paramsList.push(key1 + '=' + v1);
        }
    }

    re += paramsList.length && (paramsList.join('`')) || '';

    return re;
};


/**
 * 判断key是否在数组中
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-06-25T09:26:51+0800
 * @param    {[type]}                           arr [description]
 * @param    {[type]}                           key [description]
 * @return   {[type]}                               [description]
 */
var indexOfArray = function(arr, key) {
    arr = arr || [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === key) {
            return i;
        }
    }

    return -1;
};

/**
 * 格式化钱
 * @param amount {Number/String}   要格式化的数字
 * @param base   {Number}          格式化基数,默认为100
 * @returns {number}
 */
export function formatMoney(amount, base = 100) {
    if (base === 1) {
        return amount;
    }

    // 解决类似amount=1990时的精数不准问题
    if (parseInt(amount) === Number(amount)) {
        return Number(amount || 0) / base;
    }

    let money = (Math.floor(Number(amount || 0) / base * base) / base).toFixed(2);
    return money;
};

export function sameDay(day1, day2) {

    const date1 = new Date(day1)
    const date2 = new Date(day2)

    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDay() === date2.getDay()
}

/**
 * 字符串前面添加填充
 * 
 * @param {string} str 
 * @param {number} len 
 */
export const padStart = function (len, str = ' ') {
    if (this.length > len) {
        return String(this)
    }
    const remainLen = len - this.length
    let padStr = ''
    while (padStr.length < remainLen) {
        padStr += str
    }
    padStr = padStr.substr(0, remainLen)
    return padStr + String(this)
}

/**
 * 根据时间戳显示几天后开始的字符串
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */
export const timeAfterFix = (startTime, nowTime) => {

    var dateNow = new Date(),

        timeNow = Number(dateNow.getTime()),
        hoursNow = dateNow.getHours(),
        minutesNow = dateNow.getMinutes(),

        c = (23 - hoursNow) * 3600 + (60 - minutesNow) * 60,
        d = (Number(startTime) - (nowTime || timeNow)) / 1000,


        d_days = Number(d / 86400),
        d_hours = Number(d / 3600),
        d_minutes = Number(d / 60),

        c_days = Number((d - c) / 86400);

    if (c_days < 0) {
        return "今天"
    } else {
        if (c_days < 1) {
            return "明天"
        } else if (c_days > 1 && c_days < 2) {
            return "后天"
        } else {
            return (~~c_days + 1) + "天后"
        }
    }

}

/**
 * 跳转到官方小程序进行支付
 * 
 * @export
 * @param { Object } orderData 下单数据
 * @param { string } redirectUrl 回来时需要重定向的url
 */
export function orderInAnotherWeapp(order, url) {
    const orderData = encodeURIComponent(encode(order))
    const redirectUrl = encodeURIComponent(url)
    const path = `pages/studio-pay/studio-pay?orderData=${orderData}&redirectUrl=${redirectUrl}` 

    wx.navigateToMiniProgram({
        appId: 'wx984d6990d313afd4',
        path,
        envVersion: '__WEAPP_ENV_VERSION',
    }) 
}


/**
 * 获取当前页面url
 */
export function getCurrentPageUrl() {
    let page = getCurrentPages()[0]
    return deckUrl(page.route, page.options)
}

module.exports.getUrlParams = getUrlParams;
module.exports.fillParams = fillParams;