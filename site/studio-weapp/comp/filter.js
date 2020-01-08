// 一些通用filter定义在这儿

/**
 * 给图片加裁剪后缀
 *
 * @param {any} url - 图片url
 * @param {any} formatStr - 裁剪后缀
 * @returns
 */
export const imgFormat = (url, formatStr) => {
    var domain = 'img.qlchat.com';

    // 阿里云域下的图片格式化只需添加后缀
    if ('string' === typeof url && url.indexOf(domain) > 0) {
        return url + (formatStr || '');
    }

    return url;
};

/**
 * 将时间戳转换成对应的时间字符串格式
 *
 * @param {any} date - 时间戳
 * @param {any} block - 格式
 * @returns
 */
export const dateFormat = (date, block) => {

    if (!date) {
        return '';
    }

    var format = block || 'yyyy-MM-dd';

    date = new Date(date);

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
 * 根据时间戳转换出对应的几天前时间字符串
 *
 * @param {any} publishTime - 时间戳
 * @returns
 */
export const timeAgo = publishTime => {
    var timeNow = parseInt(new Date().getTime()),
        d = (timeNow - parseInt(publishTime)) / 1000,
        d_days = parseInt(d / 86400),
        d_hours = parseInt(d / 3600),
        d_minutes = parseInt(d / 60);

    if (d_days > 0 /*&& d_days < 15*/) {
        return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    } else {
        // var s = new Date(publishTime * 1000);
        // s.getFullYear()+"年";
        // return (s.getMonth() + 1) + "月" + s.getDate() + "日";
        return '刚刚';
    }
};

/**
 * 根据时间戳显示几天后开始的字符串
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */
export const timeAfter = (startTime, nowTime) => {

    var timeNow = parseInt(new Date().getTime()),
        d = (parseInt(startTime) - (nowTime || timeNow)) / 1000,
        d_days = parseInt(d / 86400),
        d_hours = parseInt(d / 3600),
        d_minutes = parseInt(d / 60);

    if (d_days > 0 /*&& d_days < 15*/ ) {
        return d_days + "天后";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时后";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟后";
    } else {
        return '进行中';
    }
}

export const isBeginning = (startTime, nowTime) => {

    var timeNow = parseInt(new Date().getTime()),
        d = (parseInt(startTime) - (nowTime || timeNow)) / 1000,
        d_days = parseInt(d / 86400),
        d_hours = parseInt(d / 3600),
        d_minutes = parseInt(d / 60);

    if (d_days > 0 || d_hours > 0 || d_minutes > 0) {
       return false;
    } else {
       return true;
    }
}

/**
 * 数字格式化
 *
 * @param {any} digit - 数字
 * @param {any} block - 格式
 * @returns
 */
export const digitFormat = (digit, block) => {
    if ((digit === undefined) || (digit === '')) return 0;
    var format = parseInt(block) || 10000;

    digit = parseInt(digit);

    if (digit >= 1000 && digit < 10000 && format <= 1000) {
        digit = digit / 1000;
        if (digit % 1 !== 0) {
            digit = digit.toFixed(1);
        }
        digit +='千';
        

    } else if (digit >= 10000 && digit >= format) {
        digit = digit / 10000;
        if (digit % 1 !== 0) {
            digit = digit.toFixed(1) ;
        }
        digit +='万';
    }

    return digit;
}


 /**
  * 没有值则使用默认值
  *
  * @param {any} value - 数值
  * @param {any} defaultVal - 默认值
  * @returns
  */
export const defaultVal = (value,defaultVal) => {
    return value ? value : defaultVal;
}
