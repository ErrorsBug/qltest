import { createAction } from 'redux-act';
import { fillParams, getUrlParams } from './url-utils';
import { isPc, isQlchat, isIOS } from './envi';
import { request } from 'common_actions/common';


/**
 * 格式化钱
 * @param amount {Number/String}   要格式化的数字
 * @param base   {Number}          格式化基数,默认为100
 * @returns {number}
 * 
 */
export function formatMoney(amount, base = 100) {
    if (base === 1) {
        return amount;
    }

    // 解决类似amount=1990时的精数不准问题
    if (parseInt(amount) === Number(amount)) {
        return Number(amount || 0) / base;
    }
    
    // 解决类似 11.11/100 的精数不准问题
    let money=(Math.floor(Number(amount || 0) / base * base) / base).toFixed(2);
    return money;
};

/**
 * 数值计算精度问题
 * @param num {Number/String}   要格式化的数值
 * @param decimal   {Number}    需要保留几位小数
 * @returns {number}
 * 
 */
export function formatNumber (num, decimal = 2) {
    let _num = num
    for (let i = 0; i < decimal; i++) {
        _num *= 10
    }
    _num = _num.toFixed(1)
    return Number(Math.ceil(_num) / 100)
}

/**
 * 自动为数字添加加号(负数不加)
 * @param num
 * @return  String
 */
export function addPlus(num) {
    num = Number(num || 0);

    if (num > 0) {
        return '+' + num;
    }

    return String(num);
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
    date = dongbaDistrict(date)
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
 *
 *
 * @export
 * @param {*} params
 */
export function dongbaDistrict(date) {
    const timezone = 8;
    const offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
    const nowDate = new Date(date).getTime(); 
    const targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    return targetDate
}

/**
 * 格式化倒计时时间显示
 *
 * @export
 * @param {*} second
 * @param {*} formatStr
 * @param {boolean} flag
 * @returns
 */
export function formatCountdown(second, formatStr, flag = false) {
    if (!second && !Object.is(second,0)) {
        return '';
    }

    var format = formatStr || 'd';

    second = Number(second);
    var map = {
        "d": ~~(second / (3600 * 24)), //日
        "h": ~~(second % (3600 * 24) / 3600), //小时
        "m": ~~(second % 3600 / 60), //分
        "s": second % 60, //秒
    };
    if(flag){
        return map;
    } else {
        format = format.replace(/([dhms])+/g, function (all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'd') {
                return v;
            }
            return all;
        });
        return format;
    }
};

/**
 * 身份证号码校验
 * @param    {[type]}                cardNo [description]
 * @return   {[type]}                [description]
 * @datetime 2016-09-20T00:04:34+080
 * @author wangxiao<i@muyao.me>
 */
export function checkID(cardNo) {
    var info = {
        isTrue: false, // 身份证号是否有效。默认为 false
        year: null, // 出生年。默认为null
        month: null, // 出生月。默认为null
        day: null, // 出生日。默认为null
        isMale: false, // 是否为男性。默认false
        isFemale: false // 是否为女性。默认false
    };

    if (!cardNo || 18 != cardNo.length) {
        info.isTrue = false;
        return false;
    }

    var year = cardNo.substring(6, 10);
    var month = cardNo.substring(10, 12);
    var day = cardNo.substring(12, 14);
    var p = cardNo.substring(14, 17);
    var birthday = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题
    if (birthday.getFullYear() != parseFloat(year) ||
        birthday.getMonth() != parseFloat(month) - 1 ||
        birthday.getDate() != parseFloat(day)) {
        info.isTrue = false;
        return false;
    }

    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
    var Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X

    // 验证校验位
    var sum = 0; // 声明加权求和变量
    var _cardNo = cardNo.split("");

    if (_cardNo[17].toLowerCase() == 'x') {
        _cardNo[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
    }
    for (var i = 0; i < 17; i++) {
        sum += Wi[i] * _cardNo[i]; // 加权求和
    }
    var i = sum % 11; // 得到验证码所位置

    if (_cardNo[17] != Y[i]) {
        return false;
    }

    info.isTrue = true;
    info.year = birthday.getFullYear();
    info.month = birthday.getMonth() + 1;
    info.day = birthday.getDate();

    if (p % 2 == 0) {
        info.isFemale = true;
        info.isMale = false;
    } else {
        info.isFemale = false;
        info.isMale = true;
    }
    return true;
}

/**
 * 从右至左混淆number的指定len位数(以*填充)
 * @param   {Number/String}   id
 * @param   {Number}          len 混淆的数字长度
 * @return  {string}
 */
export function mixId(id, len) {
    if (!id) {
        return '';
    }
    let idStr = String(id);
    len = len || 0;
    return idStr.substring(0, idStr.length - len) + ''.padStart(len, '*');
}

/**
 * 计算剩余天数
 * @param {Number/Date}   date      起始时间
 * @param {Number}        period    总天数
 * @returns {Number} 剩余天数
 */
export function dayLeft(date, period) {
    var timeNow = parseInt(new Date().getTime()),
        beginDate = 'object' === typeof date ? date : new Date(date),
        d = (timeNow - parseInt(beginDate.getTime())) / 1000,
        diff_days = Math.ceil(d / 86400);

    return period > diff_days ? period - diff_days : 0;
}

/**
 * 页面url跳转，延时150毫秒
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
export function locationTo(url, weappUrl, isNavigate) {
    if (url && /\s*javascript:/i.test(url)) return;

    setTimeout(() => {
        if (weappUrl && typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram') {
            isNavigate ? 
                wx.miniProgram.navigateTo({ url: weappUrl })
                :
                wx.miniProgram.redirectTo({ url: weappUrl })
        } else {
            if(isFromLiveCenter()
                && /topic\/\d{1,}\.htm|topic-simple-video|details-video|details-listenling|topic\/details|details-audio-graphic/.test(url)
                && !(/forbidLiveCenter/.test(url))
            ){
                // 如果目标页面是系列课话题介绍页和各种话题详情页时，带上C端来源(直播中心)标识，并且没有forbidLiveCenter标识
	            url = fillParams({
                    tracePage: 'liveCenter'
                }, url);
            }
            // window.location.assign(url);
            if(isQlchat() && isIOS()) {
                window.location.assign(url); // 兼容IOS 嵌套h5返回bug;
            } else {
                window.location.href = url
            }
        }
    }, 150);
}

/**
 * 数字格式化成万或千
 * @param  {[type]} digit [description]
 * @param  {[type]} block [description]
 * @return {[type]}       [description]
 */
export function digitFormat(digit, block, unit=['千','万']) {

    if ((digit === undefined) || (digit === '')) return 0;

    var format = parseInt(block) || 10000;

    digit = parseInt(digit);

    if (digit >= 1000 && digit < 10000 && format <= 1000) {

        digit = digit / 1000;

        digit = digit.toFixed(1) + unit[0];
        

    } else if (digit > 10000 && digit >= format) {

        digit = digit / 10000;

        digit = digit.toFixed(1) + unit[1];
        
    }

    return digit;
}

/**
 * 数字保留两位小数（只舍不入）
 * @param  {[type]} digit [description]
 * @return {[type]}       [description]
 */
export function digitFloor2(digit) {
    return Math.floor(digit * 100) / 100;
}

/**
 * 根据时间戳显示几天后开始的字符串
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */
export const timeAfter = (startTime, nowTime, endTime) => {
    var timeNow = parseInt(new Date().getTime()),
        d = (parseInt(startTime) - (nowTime || timeNow)) / 1000,
        d_days = Math.floor(d / 86400),
        d_hours = Math.floor(d / 3600),
        d_minutes = Math.floor(d / 60);

    if (d_days > 0 /*&& d_days < 15*/) {
        return d_days + "天后";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时后";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟后";
    } else if (endTime && (nowTime || timeNow) > endTime) {
        return '已结束';
    } else {
        return '进行中';
    }
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
    if (d_days > 7) {
        return formatDate(pushTime)
    } else if (d_days > 0 && d_days <= 7) {
        return d_days + "天前";
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时前";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟前";
    } else {
        return '刚刚';
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
// 从iframe截取src值
export const getVieoSrcFromIframe = (iframeStr) => {
    let reg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

    if (!iframeStr) {
        return '';
    }

    let matchs = iframeStr.match(reg);

    if (matchs && matchs.length > 1) {
        return matchs[1];
    }

    return '';
}

// 换行符处理
export const replaceWrapWord = (str) => {
    str = str || '';
    str = str.replace(/\</g, (m) => "&lt;");
    str = str.replace(/\>/g, (m) => "&gt;");
    return str.replace(/\n/g, (m) => '</br>');
}

export const dangerHtml = content => {
    return { __html: content };
};


export const parseDangerHtml = content => {

    content = content || '';

    if(typeof document != "undefined") {
        var output, elem = document.createElement('div');
        elem.innerHTML = content;
        output = elem.innerText || elem.textContent;
        return { __html: output.replace(/\n/g, (m) => '</br>') };
    } else {
        content = content.replace(/\&amp;/g, (m) => "&");
        return { __html: content.replace(/\n/g, (m) => '</br>') };
    }

};


export const noShifterParseDangerHtml = content => {

    content = content || '';

    if(typeof document != "undefined") {
        var output, elem = document.createElement('div');
        elem.innerHTML = content;
        output = elem.innerText || elem.textContent;
        return { __html: output};
    } else {
        content = content.replace(/\&amp;/g, (m) => "&");
        return { __html: content};
    }

};



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

export const simpleFilter = (sf) => {
    var sfData = sf || '';
    sfData = sfData.replace(/(\u0085)|(\u2028)|(\u2029)/g, (m) => "");
    sfData = sfData.replace(/\%/g, (m) => "%25");
    sfData = sfData.replace(/\+/g, (m) => "%2B");
    sfData = sfData.replace(/\#/g, (m) => "%23");
    sfData = sfData.replace(/\//g, (m) => "%2F");
    sfData = sfData.replace(/\?/g, (m) => "%3F");
    sfData = sfData.replace(/\=/g, (m) => "%3D");
    return sfData;
};

export const htmlTransfer = (sf) => {
    var sfData = sf || '';
    sfData = sfData.replace("&lt;", (m) => "<");
    sfData = sfData.replace("&gt;", (m) => ">");
    return sfData;
};

export  const htmlTransferGlobal = (sf) => {
    var sfData = sf || '';
    sfData = sfData.replace(/&lt;/g, (m) => "<");
    sfData = sfData.replace(/&gt;/g, (m) => ">");
    sfData = sfData.replace(/(\&quot\;)/g, (m) => "\"");
    sfData = sfData.replace(/(\&\#39\;)/g, (m) => "\'");
    return sfData;
}; 

/**
 * 根据时间戳显示周几的字符串
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */
export const formateToDay = (startTime, nowTime, showToday = false) => {
    var timeNow = nowTime || parseInt(new Date().getTime()),
        d_days = Math.abs((startTime - timeNow) / 1000);
    var timeDay = new Date(startTime).getDay();
    if (!showToday && d_days >= 0 && d_days <= 86400 && (timeDay === new Date().getDay())) {
        return "今天";
    } else {
        switch (timeDay) {
            case 1: return "周一"; break;
            case 2: return "周二"; break;
            case 3: return "周三"; break;
            case 4: return "周四"; break;
            case 5: return "周五"; break;
            case 6: return "周六"; break;
            case 0: return "周日"; break;
            default: ; break;
        }
    };
};

/**
 * 判断是今天、明天、或者后天
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */
export const dateJudge = (judgeTime, nowTime) => {
    var todayTimeStamp = 0
    if(nowTime) {
        todayTimeStamp = parseInt(new Date(new Date(nowTime).setHours(0,0,0,0)).getTime())
    } else {
        todayTimeStamp = parseInt(new Date(new Date().setHours(0,0,0,0)).getTime())
    }

    var timeStamp1 = todayTimeStamp + 86400000
    var timeStamp2 = timeStamp1 + 86400000
    var timeStamp3 = timeStamp2 + 86400000

    var timeBeJudge = parseInt(judgeTime)

    if(timeBeJudge < todayTimeStamp) {
        return "今天以前"
    } else if(timeBeJudge >= todayTimeStamp && timeBeJudge < timeStamp1 ){
        return "今天"
    } else if(timeBeJudge >= timeStamp1 && timeBeJudge < timeStamp2 ){
        return "明天"
    } else if(timeBeJudge >= timeStamp2 && timeBeJudge < timeStamp3 ){
        return "后天"
    } else {
        return "后天以后"
    }
    
};

/**
 * 跟星期配合在一起的一个非常复杂的根据时间戳显示几天后开始的字符串
 * 这周到下周之内  显示本周几或下周几更新
 * 超过一周显示X天后更新
 * 其余时间保持原有逻辑不变
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */
export const timeAfterMixWeek = (startTime, nowTime) => {
    var localTime = parseInt(new Date().getTime()),
        d = (parseInt(startTime) - (nowTime || localTime)) / 1000,
        d_days = Math.floor(d / 86400),
        d_hours = Math.floor(d / 3600),
        d_minutes = Math.floor(d / 60);

    var startTimeDay = new Date(startTime).getDay();
    var nowDay = new Date((nowTime || localTime)).getDay();

    startTimeDay = startTimeDay == 0 ? 7 : startTimeDay;
    nowDay = nowDay == 0 ? 7 : nowDay;

    var leftDay = 14 - nowDay
    var isCurrentWeek = (d/86400) <= (leftDay - 7)

    var startTimeDayStr = ""
    switch (startTimeDay) {
        case 1: startTimeDayStr = "一" ; break;
        case 2: startTimeDayStr = "二" ; break;
        case 3: startTimeDayStr = "三" ; break;
        case 4: startTimeDayStr = "四" ; break;
        case 5: startTimeDayStr = "五" ; break;
        case 6: startTimeDayStr = "六" ; break;
        case 7: startTimeDayStr = "日" ; break;

        default: ; break;
    }

    if (d_days >= leftDay ) {
        return d_days + "天后";
    } else if (d_days <= leftDay && d_days > 0) {
        return isCurrentWeek ? "本周" + startTimeDayStr : "下周" + startTimeDayStr
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + "小时后";
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + "分钟后";
    } else {
        return '进行中';
    }
}

export const updatePageData = () => {
    try {
        if (sessionStorage.getItem("isDataChange_B")) {
            var isDataChange_B = sessionStorage.getItem("isDataChange_B");
            sessionStorage.setItem("isDataChange_B", ++isDataChange_B);
        }
    } catch (e) {
    }
    return;
};
export const refreshPageData = () => {
    try {
        if (sessionStorage.getItem("isDataChange_A")) {
            var isDataChange_A = sessionStorage.getItem("isDataChange_A");
            var isDataChange_B = sessionStorage.getItem("isDataChange_B");
            if (isDataChange_A != isDataChange_B) {
                sessionStorage.setItem("isDataChange_A", isDataChange_B);
                window.location.reload(true);
            };
        } else {
            sessionStorage.setItem("isDataChange_A", 1);
            sessionStorage.setItem("isDataChange_B", 1);
        };
    } catch (e) {
        //TODO handle the exception
    };
    return;
};

/**
 * 验证数值的为空，整数，小于大于某个区域值
 * @param {number|string} inputNumber 待验证的数值 （如果要通过0的验证，请输入string类型的'0'）
 * @param {number}} minNum 最小值
 * @param {number} maxNum 最大值
 * @param {string} name 数值的名字，值为空或为假则不予toast提示
 */
export const isNumberValid = (inputNumber, minNum, maxNum, name='') => {
    // 提示的信息
    let validMsg = {
        // 输入为空
        voidString: '输入不能为空',
        // 输入非正整数
        notAPositiveNumber: '请输入正整数',
        //输入正数（取到2位小数）
        notDecimal: '请输入两位小数的非负数',
        // 小于最小值
        lessOrMoreThanNum: '请输入' + minNum + '-' + maxNum + '的数',
        lessThanNum: '请输入小于等于' + maxNum + '的数',
        moreThanNum:  '请输入大于等于' + minNum + '的数',
    };
    if (inputNumber === '') {
        name && window.toast(name + ': ' + validMsg.voidString);
        return false;
    } else if ((!/^[1-9]+[0-9]*]*$/.test(inputNumber)) && inputNumber !== '0') {
        name && window.toast(name + ': ' + validMsg.notAPositiveNumber);
        return false;
    } else if (minNum && maxNum && (Number(inputNumber) < minNum || Number(inputNumber) > maxNum)) {
        name && window.toast(name + ': ' + validMsg.lessOrMoreThanNum);
        return false;
    } else if(minNum && Number(inputNumber) < minNum){
        name && window.toast(name + ': ' + validMsg.moreThanNum);
        return false;
    }else if(maxNum && Number(inputNumber) > maxNum){
        name && window.toast(name + ': ' + validMsg.lessThanNum);
        return false;
    }else {
        return true;
    }
};

/************************ 验证输入类型是否符合格式 - start ******************/
/**
 * @param {Object} validType-检验类型(text\money\name\password)
 * @param {Object} typeName-提示标题
 * @param {Object} inputVal-检验值
 * @param {Object} maxNum-最大值
 * @param {Object} minNum-最小值
 */
export const validLegal = (validType, typeName, inputVal, maxNum, minNum, spec_tips) => {
    var inputVal = typeof inputVal ==='string' ? inputVal.trim() : inputVal;
    var isPass = true;
    if (inputVal == "") {
        window.toast(typeName + "不能为空");
        return false;
    };
    switch (validType) {
        case "text": isPass = checkText(); break;
        case "money": isPass = checkMoney(); break;
        case "name": isPass = checkName(); break;
        case "password": isPass = checkPassword(); break;
        case "wxAccount": isPass = checkWxAccount(); break;
        case "phoneNum": isPass = checkPhoneNum(); break;
        case "email": isPass = checkEmail(); break;
    };
    function checkText() {
        if (maxNum && inputVal.length > maxNum) {
            window.toast(typeName + "不能超过" + maxNum + "个字");
            return false;
        } else {
            return true;
        };
    };
    function checkMoney() {
        var tips = "";
        if (!/(^[0-9]*[\.]?[0-9]{0,2}$)/.test(inputVal)) {
            window.toast(typeName + "必须为非负数字,最多2位小数");
            return false;
        } else if (maxNum && Number(inputVal) > maxNum) {
            if (spec_tips && spec_tips != "") {
                tips += "，" + spec_tips;
            };
            window.toast(typeName + "不能超过" + maxNum + "元" + tips);
            return false;
        } else if (minNum && Number(inputVal) < minNum) {
            if (spec_tips && spec_tips != "") {
                tips += "，" + spec_tips;
            };
            window.toast(typeName + "不能小于" + minNum + "元" + tips);
            return false;
        } else if (/^(89|8\.9|0\.89|64|6\.4|0\.64|89\.64|64\.89|1989\.64|8964)$/.test(Number(inputVal))) {
             // 永久防止敏感信息
             window.toast('金额错误，请输入其他金额')
             return false;
        } else {
            return true;
        };
    };
    function checkName() {
        if (!/(^[a-zA-Z]+$)|(^[\u4e00-\u9fa5]+$)/.test(inputVal)) {
            window.toast("请输入真实姓名");
            return false;
        } else if (maxNum && inputVal.length > maxNum) {
            window.toast(typeName + "不能超过" + maxNum + "个字");
            return false;
        } else {
            return true;
        };
    };
    function checkPassword() {
        if (!/^[0-9a-zA-Z]+$/.test(inputVal)) {
            window.toast(typeName + "只能是数字与字母组成");
            return false;
        } else if (maxNum && inputVal.length > maxNum) {
            window.toast(typeName + "最长为" + maxNum + "位");
            return false;
        } else {
            return true;
        };
    };
    function checkWxAccount() {
        if (!/^[0-9a-zA-Z\-\_]{5,30}$/.test(inputVal)) {
            window.toast("微信号仅6~30个字母，数字，下划线或减号组成");
            return false;
        } else {
            return true;
        };
    };
    function checkPhoneNum() {
        if (!/^1\d{10}$/.test(inputVal)) {
            window.toast("请输入正确的手机号");
            return false;
        } else {
            return true;
        };
    };
    function checkEmail() {
        if (!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(inputVal)) {
            window.toast("请输入正确的邮箱");
            return false;
        } else {
            return true;
        };
    };
    return isPass;
};


/**
 * 图片格式化
 * @param {String} formatStrQ  阿里云的裁剪规格  例如："@96h_96w_1e_1c_2o"
 * @param {String} formatStrW  微信的裁剪规格 例如："/96"
 *
 * 默认裁剪尺寸是64
 */
export const imgUrlFormat = (url, formatStrQ = "?x-oss-process=image/resize,m_fill,limit_0,h_64,w_64", formatStrW = "/64") => {

    if (/(img\.qlchat\.com)/.test(url)) {
        url = url.replace(/@.*/, "") + formatStrQ;
    } else if (/(wx\.qlogo\.cn\/mmopen)/.test(url)) {
        url = url.replace(/(\/(0|132|64|96)$)/, formatStrW);
    };

    return url;
};


/**
 * 二维码弹框点击判断
 * @param {Event} e
 */
export const onQrCodeTouch = (e, selector, callback) => {
    const event = e.nativeEvent;
    const appDom = document.querySelector('#app');
    const qrConfirm = document.querySelector(selector);

    const qrHeight = qrConfirm.clientHeight;
    const qrWidth = qrConfirm.clientWidth;
    const appHeight = appDom.clientHeight;
    const appWidth = appDom.clientWidth;
    const pointX = event.changedTouches[0].clientX;
    const pointY = event.changedTouches[0].clientY;

    const top = (appHeight - qrHeight) / 2;
    const bottom = (appHeight - qrHeight) / 2 + qrHeight;
    const left = (appWidth - qrWidth) / 2;
    const right = (appWidth - qrWidth) / 2 + qrWidth;

    if (pointX > right || pointX < left || pointY > bottom || pointY < top) {
        callback();
    }
}

/**
 ** 加法函数，用来得到精确的加法结果
 **/
export function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}


// 乘法
export const mul = (arg1, arg2) => {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();

    try {
        m += s1.split(".")[1].length
    } catch (e) { }
    try {
        m += s2.split(".")[1].length
    } catch (e) { }

    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 *
 * 获取cookie
 * @param {any} c_name
 * @returns
 */
export const getCookie = (c_name) => {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return decodeURIComponent(document.cookie.substring(c_start, c_end));
        };
    };
    return "";
}

/**
* 添加cookie
*
* @param {any} c_name
* @param {any} value
* @param {any} expiredays
*/
export const setCookie = (c_name, value, expiredays, path = '/') => {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + encodeURIComponent(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=" + path;
}

/**
* 删除cookie
*
* @param {any} name
*/
export const delCookie = (name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + 999 + "; path=/";
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/";
    };
}

/**
 * 一个简单的字符串长度验证
 * 
 * @export
 * @param {string} val 字符串 
 * @param {number} [maxLength=10] 最大长度 
 * @param {number} [minLength=0] 最小长度
 * @returns 
 */
export function stringLengthValid(val, maxLength = 10, minLength = 1,name='') {
    if (!val.length || val.length < minLength) {
        window.toast(`${name}字数不够哦，最少${minLength}个字`, 1500)
        return false
    }
    if (val.length > maxLength) {
        window.toast(`${name}最多${maxLength}个字, 不可以再多了`, 1500)
        return false
    }
    return true
}

/**
 * 让代码停下来等一等
 *
 * @param {Number} time
 */
export const wait = (time) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		},time);
	});
};

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
        // console.warn('[getProperty]: target必须是Array或者Object，但是当前是' + target);
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
 * 
 * 排序
 * @param {any} attr 
 * @param {any} rev 
 * @returns 
 * @memberof StudioLiveMain
 */
export function sortBy(attr,rev){
    //第二个参数没有传递 默认升序排列
    if(rev ==  undefined){
        rev = 1;
    }else{
        rev = (rev) ? 1 : -1;
    }
    return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
            return rev * -1;
        }
        if(a > b){
            return rev * 1;
        }
        return 0;
    }
}

// 为解决再安卓微信浏览器中window.location.reload(true);不触发刷新的问题写的兼容方法
export function updateUrl(url, key) {
    var key = (key || 't') + '=';  //默认是"t"
    var reg = new RegExp(key + '\\d+');  //正则：t=1472286066028
    var timestamp = +new Date();
    if (url.indexOf(key) > -1) { //有时间戳，直接更新
        return url.replace(reg, key + timestamp);
    } else {  //没有时间戳，加上时间戳
        if (url.indexOf('\?') > -1) {
            var urlArr = url.split('\?');
            if (urlArr[1]) {
                return urlArr[0] + '?' + key + timestamp + '&' + urlArr[1];
            } else {
                return urlArr[0] + '?' + key + timestamp;
            }
        } else {
            if (url.indexOf('#') > -1) {
                return url.split('#')[0] + '?' + key + timestamp + location.hash;
            } else {
                return url + '?' + key + timestamp;
            }
        }
    }
}

/**
 * 刷新本页面，加上t参数
 */
export function reloadPage() {
    location.replace(updateUrl(location.href))
}

/**
 * 将一个数组存储到localStorage中
 * key 为 localStorage的key
 * item 塞入数组的对象
 * maxLength 为存储的数组的最大长度 如果不传则对长度不做限制
 * 超出最大长度的从头开始丢失数据，若原有长度超出最大长度，持续丢失数据到最大长度为止
 * @param {string} key 
 * @param {any} item 
 * @param {number} maxLength 
 */
export function saveLocalStorageArray(key, item, maxLength) {
    if( typeof key != "string" || (maxLength && typeof maxLength != "number") ) {
        console.error("saveLocalStorageArray 无效参数");
        return
    }
    if(!window || !window.localStorage || !JSON) {
        console.error("saveLocalStorageArray 无效的执行环境");
        return
    }
    var dataList = JSON.parse(window.localStorage.getItem(key)) || []

    while(dataList.length > 0 && dataList.length >= maxLength) {
        dataList.shift()
    }
    dataList.push(item)

    window.localStorage.setItem(key, JSON.stringify(dataList))

    return dataList
}
/**
 * 替换上面个LocalStorageArray中的某一条数据
 * 如果查不到这条数据，根据ifAdd为true是否就添加这条数据
 * maxLength控制数组长度
 * @param {string} localstorage 的key
 * @param {string} item 的key
 * @param {string} itemContent 的内容
 * @param {any} item 
 * 
 */
export function setLocalStorageArrayItem(localStorageKey, itemKey, itemContent, item, ifAdd, maxLength) {
    if( typeof localStorageKey != "string" || typeof itemKey != "string" || (maxLength && typeof maxLength != "number")) {
        console.error("setLocalStorageArrayItem 无效参数");
        return
    }
    if(!window || !window.localStorage || !JSON) {
        console.error("setLocalStorageArrayItem 无效的执行环境");
        return
    }
    var dataList = JSON.parse(window.localStorage.getItem(localStorageKey)) || []
    var i = 0
    var findData = false
    for(i; i < dataList.length; i++) {
        if(dataList[i][itemKey] == itemContent) {
            dataList[i] = item
            findData = true
        }
    }
    if(!findData && ifAdd === true) {
        while(dataList.length > 0 && dataList.length >= maxLength) {
            dataList.shift()
        }
        dataList.push(item)
    } 
    window.localStorage.setItem(localStorageKey, JSON.stringify(dataList))
    return dataList
}

/**
 * 这个操作针对用idlist来存储足迹数据
 * 如果要插入列表的数据已经存在，则插入到最前面
 * @param {string} localstorage 的key
 * @param {any} item 要插入这个数组的内容，只要不是引用对象，啥都行
 * @param {number} 这个数组的最大长度
 */
export function localStorageSPListAdd(localStorageKey, id, type,  maxLength) {
    if(!window || !window.localStorage || !JSON) {
        console.error("localStorageSPListAdd 无效的执行环境");
        return
    }
    var dataList = JSON.parse(window.localStorage.getItem(localStorageKey)) || []
    var i = 0
    var findData = false
    var findIndex = -1

    for(i; i < dataList.length; i++) {
        if(dataList[i].id == id && dataList[i].type == type) {
            findData = true
            findIndex = i
        }
    }
    if(findData) {
        dataList.unshift(dataList.splice(findIndex , 1)[0])
        while(dataList.length > 0 && dataList.length > maxLength) {
            dataList.pop()
        }
    } else {
        while(dataList.length > 0 && dataList.length >= maxLength) {
            dataList.pop()
        }
        dataList.unshift({id: id, type: type})
    }

    window.localStorage.setItem(localStorageKey, JSON.stringify(dataList))
    return dataList
}

/**
 * 这个操作针对用idlist来存储足迹数据
 * 删除值为id的列表项
 * @param {string} localstorage 的key
 * @param {any} item 要插入这个数组的内容，只要不是引用对象，啥都行
 * @param {number} 这个数组的最大长度
 */
export function localStorageSPListDel(localStorageKey, id, type) {
    if(!window || !window.localStorage || !JSON) {
        console.error("setLocalStorageArrayItem 无效的执行环境");
        return
    }
    var dataList = JSON.parse(window.localStorage.getItem(localStorageKey)) || []
    var i = 0
    var findData = false
    var findIndex = -1
    for(i; i < dataList.length; i++) {
        if(dataList[i].id == id && dataList[i].type === type) {
            findData = true
            findIndex = i
        }
    }
    if(findData) {
        dataList.splice(findIndex , 1)
    } 
    window.localStorage.setItem(localStorageKey, JSON.stringify(dataList))
    return dataList
}


/* 是否来自直播中心的判断 */
export function isFromLiveCenter() {
    if(typeof sessionStorage != 'undefined') {
        return /recommend|subscribe-period-time|timeline|mine|charge-recommend|rank-topic|livecenter|search/.test(window.sessionStorage.getItem('trace_page'))
    }else{
        return false;
    }
} 

/* 判断千聊推荐的下单位置 需求链接 http://www.pmdaniu.com/cloud/33673/2b0f524719e451542e20afa22486de7b-35265/start.html#g=1&p=直播间收益-千聊推荐
   下单位置：千聊-推荐页，千聊-发现页，千聊-我的课程，千聊-个人中心，千聊-搜索，千聊公众号推文，千聊公众号菜单，千聊用户分享，千聊-猜你喜欢
*/
export function filterOrderChannel() {
    let place = 'recommend' //'千聊-推荐页'
    if (getUrlParams('psKey')) {
        place = 'share' //'千聊用户分享'
    } else if (getUrlParams('wcl') == 'tweet') {
        place = 'tweet'// '千聊公众号推文'
    } else if (getUrlParams('wcl') == 'tab') {
        place = 'menu' // '千聊公众号菜单'
    } else if (/promotion_details-listening|promotion_topic-simple-video|promotion_channel-intro|promotion_topic-intro|promotion_channel-intro-bought|promotion_topic-intro-bought|promotion_recent|promotion_purchased|promotion_recent-null|promotion_purchased-null|promotionnNEW_details-listening|promotionNEW_topic-simple-video|promotionNEW_channel-intro|promotionNEW_topic-intro|promotionNEW_channel-intro-bought|promotionNEW_topic-intro-bought|promotionNEW_recent|promotionNEW_purchased|promotionNEW_recent-null|promotionNEW_purchased-null/.test(getUrlParams('wcl'))) {
        place = 'guess' //'千聊-猜你喜欢'
    } else if (/timeline|messages/.test(document.referrer)) {
        place = 'discovery' // '千聊-发现页'
    } else if (/course/.test(document.referrer)) {
        place = 'mine-course' //'千聊-我的课程'
    } else if (/collect|foot-print|joined-topic|myPurchaseRecord|point/.test(document.referrer)) {
        place = 'mine-center' //'千聊-个人中心'
    } else if (/search/.test(document.referrer)) {
        place = 'search' // '千聊-搜索'
    } else if (/recommend|coupon-center|album|membership-center/.test(document.referrer)) {
        place = 'recommend' // '千聊-推荐页'
    }
    return place
}


// 获取媒体时间格式化字符串
export function getAudioTimeShow(secs,hasHour=false) {
    //小时
    let hours = parseInt(secs / 3600);
    if (hours < 10) {
        hours = "0" + hours;
    }
    //分钟
    let minutes = parseInt(secs / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    //秒
    let seconds = Math.round(secs % 60);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (hasHour) {
        minutes = parseInt(secs % 3600 / 60);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return `${hours}:${minutes}:${seconds}`;
    } else {
        return `${minutes}:${seconds}`;
    }
}

export function createAsyncAction(prefix) {
    const REQUEST = 'REQUEST';
    const SUCCESS = 'SUCCESS';
    const ERROR = 'ERROR';

    return [REQUEST, SUCCESS, ERROR].reduce((acc, type) => {
        acc[type] = createAction(prefix + "_" + type);
        return acc
    }, {})
}

//检查时间小于2位数
export function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

export const handleAjaxResult = (result , cb) => {
    if (result && result.state) {
        if (result.state.code == 0) {
            cb(result.data);
        } else {
            window.toast(result.state.msg);
        }
    }
}


/**
 * 本地存储获取方法，若过期则返回空
 * @type {[type]}
 */
export const getLocalStorage = key => {
	let data;

	try {
		data = JSON.parse(localStorage.getItem(key));
	} catch (e) {
		console.error('get localStorage failed! ' + JSON.stringify(e));
		return;
	}

	if (data && 'object' === typeof data && data._expires) {
		let nowDate = new Date().getTime();

		// 已过期
		if ((+data._expires) < nowDate) {
			try {
				localStorage.removeItem(key)
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
 *	 setLocalStorage('test', 1, 10);
 *
 * @param  {String} key    存储的数据的key
 * @param  {Object/String} value 存储的内容
 * @param  {[type]} expires 过期时间（单位：秒(s)）
 * @return {[type]}        [description]
 */
export const setLocalStorage = (key, value, expires) => {
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

	if(typeof data === 'object'){
	    data = JSON.stringify(data);
    }

	try {
		localStorage.setItem(key, data);
	} catch (e) {
		console.error('set storage sync failed! ' + JSON.stringify(e));
	}
};

// 睡觉函数
export function sleep(time){
	return new Promise(function(resolve){
		setTimeout(resolve, time)
	})
}

/**
 * 初始化小程序sdk
 * @returns {Promise<boolean>} true: 是小程序环境并且准备完毕， false: 不是小程序环境
 */
export const miniprogramReady = () => {

    return new Promise((resolve) => {
        let timer;
        const ready = () => {
            timer && clearTimeout(timer);

            if (window.__wxjs_environment === 'miniprogram') {
                resolve(true);
            } else {
                resolve(false);
            }
        }

        if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
            document.addEventListener('WeixinJSBridgeReady', ready, false)
            timer = setTimeout(() => {
                ready();
            }, 2000)
        } else {
            ready()
        }
    });
}

// 课程完成度记录
let updatePercentageCompleteTimestamp;
export function updatePercentageComplete({topicId, finished, total, rate}){
	if(!rate){
	    if(!total || total <= 0){
	        return false;
        }
		rate = finished / total
	}
    if(rate < 1){
	    // 防止记录过于频繁，执行间隔设定为300ms，除非rate为1
	    const previousTimestamp = updatePercentageCompleteTimestamp;
	    const now = Date.now();
	    if(previousTimestamp && now - previousTimestamp <= 300){
		    return false;
	    }else{
		    updatePercentageCompleteTimestamp = now;
	    }
    }
	if(typeof localStorage !== 'undefined') {
	    const coursePercentageCompleteRecord = JSON.parse(localStorage.getItem('coursePercentageCompleteRecord') || '{}');
        if(!coursePercentageCompleteRecord[topicId] || coursePercentageCompleteRecord[topicId] < rate){
            coursePercentageCompleteRecord[topicId] = rate;
	        localStorage.setItem('coursePercentageCompleteRecord', JSON.stringify(coursePercentageCompleteRecord));
        }
    }
};

let taskExecutionInterval;
let taskTopicId;
let taskLastCurrentTime;
let taskTimeLength;
let isTodayFirstPlay;
// 记录学习时长
export function updateLearningTime({topicId, playStatus, currentTime = 0, setTime}){
    if (typeof setTime === 'undefined') {
        if (taskTopicId !== topicId) {
            taskTimeLength = 0
            taskLastCurrentTime = 0
            taskTopicId = topicId
        }
    
        // 记录间隔时间内播放总时长
        const temp = currentTime - taskLastCurrentTime
        taskLastCurrentTime = currentTime
        if (temp > 2 || temp < 0) { // 允许2秒内的拖拽
            return false
        }
        taskTimeLength += temp
    
        if (playStatus !== 'end') {
            // 执行间隔设定为30s
            const previousTimestamp = taskExecutionInterval;
            const now = Date.now();
            if (previousTimestamp && now - previousTimestamp <= 5000){
                return false;
            } else {
                taskExecutionInterval = now;
            }
        } else {
            taskLastCurrentTime = 0
        }
    } else {
        taskTimeLength = setTime
    }

	if(typeof localStorage !== 'undefined') {

        // 一天内首次播放通知
        if (!isTodayFirstPlay) {
            const sysTime = window.__INIT_STATE__.common.sysTime
            const t = parseInt(localStorage.getItem('todayFirstPlay') || 0)
            const todayTimeStamp = parseInt(new Date(new Date(sysTime).setHours(0,0,0,0)).getTime())

            isTodayFirstPlay = true
            if (t && t >= todayTimeStamp) {
                return false
            }

            localStorage.setItem('todayFirstPlay', sysTime);
            
            request({
                url: '/api/wechat/point/doAssignment',
                method: 'POST',
                body: {
                    assignmentPoint: 'grow_learn_course_time',
                    learnTime: 1
                }
            });
        }

	    let learnTime = parseInt(localStorage.getItem('courseLearningTime') || 0);
        learnTime += parseInt(taskTimeLength)
        if(learnTime >= 600){ // 大于10分钟
            request({
                url: '/api/wechat/point/doAssignment',
                method: 'POST',
                body: {
                    assignmentPoint: 'grow_learn_course_time',
                    learnTime
                }
            });
            learnTime = 0
        }
        localStorage.setItem('courseLearningTime', learnTime);
        taskTimeLength = 0
    }
};

// 上一次课程访问记录
export function updateTopicInChannelVisit({channelId, topicId, id, startTime, style}){
	if(typeof localStorage !== 'undefined') {
		const lastRecord = JSON.parse(localStorage.getItem('lastTopicInChannelVisitRecord') || '{}');
		lastRecord[channelId] = {
            topicId: topicId || id,
            startTime,
			style,
        };
        localStorage.setItem('lastTopicInChannelVisitRecord', JSON.stringify(lastRecord));
	}
}


/**
 * 初始化C端来源注入
 *
 */
export function initCEndSourseInject(){
    if(typeof sessionStorage !== 'undefined'){

        // 以下两个判断条件见需求链接 http://jira.corp.qlchat.com/browse/QLCHAT-13595
        // wcl是这几个的值的属于c端来源；
        if (['promotion_recent','promotion_purchased','promotion_recent-null','promotion_purchased-null'].includes(getUrlParams('wcl'))) {
            sessionStorage.setItem('trace_page', "livecenter");
            return;
        }
        // 个人中心和我的课程不属于c端来源
        if (/(joined-topic|myPurchaseRecord|mine\/collect|mine\/foot-print|mine\/course)/.test(location.pathname)) {
            sessionStorage.removeItem('trace_page');
            return ;
        }
        if((/tweet|tab/.test(getUrlParams('wcl')) || getUrlParams('psKey')) && !isFromLiveCenter()){
            sessionStorage.setItem('trace_page', 'livecenter');
        }else if(!(/tweet|tab/.test(getUrlParams('wcl'))  || getUrlParams('psKey')) && getUrlParams('clearTrace') === 'Y' && isFromLiveCenter()){
            // 链接带clearTrace=Y强行去掉C端标识
            sessionStorage.removeItem('trace_page');
        }
    }
}



/**
 * 因为page父组件加了pv，导致单页应用的首次手动触发pv是错误的，此处忽略首次加载的pv
 */
export function addPv() {
    setTimeout(function () {
        if (window._hasFirstPv) {
            window._qla && window._qla('pv', {});
        } else {
            window._hasFirstPv = true;
        }
    }, 10)
}

export const businessTypeCNMap = {
    topic: '话题',
    channel: '系列课',
    vip: '直播间vip',
    doc: '文件',
    gift: '赠礼',
}

/**
 * 判断是否隔天
 * @param {*} param 时间戳 | 存在localStroge的key值
 */
export function isNextDay (param) {
    if (!param) return false

    let dateTime = null
    if (typeof param === 'number') {
        dateTime = new Date(param)
    } else if (typeof param === 'string') {
        const timeStamp = getLocalStorage(param)
        timeStamp && (dateTime = new Date(timeStamp))
    }

    if (dateTime) {
        return new Date().getDate() !== dateTime.getDate()
    }

    return true
}

/* 根据缓存的存在与否判断是否要执行某些方法
 *
 * @export
 * @param {*} storageName 缓存名字
 * @param {*} storageValue 缓存的值
 * @param {*} cb 要执行的函数名称
 * @param {*} time 多少时间后执行该函数
 */
export function executeFunAccordingToStorage(storageName, storageValue, cb, time = 0){
    let timeOut = setTimeout(_=>{
        if(localStorage.getItem(storageName) == storageValue){
            localStorage.removeItem(storageName)
            cb && cb()
        }
        clearTimeout(timeOut)
    },time)
}


const QL_BROWSE_HISTORY_SESSION = 'QL_BROWSE_HISTORY_SESSION'
/**
 * 记录用户浏览历史
 * @param {*} router 地址对象
 */
export function recordBrowseHistoryToStorage (router) {
    if (!router || typeof location === 'undefined' || typeof sessionStorage === 'undefined') return

    const origin = location.origin
    const {pathname, search} = router
    const url = origin + pathname + search

    let _sHistory = JSON.parse(sessionStorage.getItem(QL_BROWSE_HISTORY_SESSION))
    _sHistory instanceof Array || (_sHistory = [])

    if (_sHistory[_sHistory.length - 1] != url) {
        _sHistory.push(url)
        sessionStorage.setItem(QL_BROWSE_HISTORY_SESSION, JSON.stringify(_sHistory))
    }
}

/**
 * 根据对应业务做相关逻辑处理，获取渠道来源
 * @param {*} type wcl配置，用于匹配入口页是否满足统计规则
 * @param {configure} configure 来源规则配置
 */
export function getChannelFromTypeOfBusiness (type, configure) {
    if (!configure || typeof location === 'undefined' || typeof sessionStorage === 'undefined') return

    let _sHistory = JSON.parse(sessionStorage.getItem(QL_BROWSE_HISTORY_SESSION))
    _sHistory instanceof Array || (_sHistory = [])

    for (let index = 0; index < _sHistory.length; index++) {
        const urlObj = parseURL(_sHistory[index])
        let wcl = urlObj.params.wcl
        // 用户入口页面， 如果携带相关wcl则判定为符合渠道规则来源
        if (type && index === 0 && wcl && wcl.indexOf(type) > -1) {
            return wcl
        }

        // 规则解析
        wcl = distinguishChannelFromConfigure(urlObj, configure)

        if (wcl) return wcl
    }
    return ''
}

/**
 * 根据当前地址信息，匹配出首次符合条件的渠道来源
 * @param {*} urlObj url 解析后的对象
 * @param {*} configure 配置的来源渠道列表
 */
function distinguishChannelFromConfigure (urlObj, configure) {
    // 一次筛选 匹配路径
    let _search = configure.filter(item => item.page === urlObj.path)

    if (_search.length > 0 && _search[0].params) {
        // 二次筛选 匹配必要参数是否相等
        _search = _search.filter(s => {
            if (s.params) {
                let isMatch = true
                for (let key in s.params) {
                    if (s.params[key] !== urlObj.params[key]) isMatch = false
                }
                return isMatch
            }
            return false
        })
    }
    if (_search.length > 0) return _search[0].wcl
}


/**
 * 解析URL
 * @param {*} url 
 */
export function parseURL (url) {  
    var a =  document.createElement('a');  
    a.href = url;  
    return {  
        source: url,  
        protocol: a.protocol.replace(':',''),  
        host: a.hostname,  
        port: a.port,  
        query: a.search,  
        params: (function(){  
            var ret = {},  
                seg = a.search.replace(/^\?/,'').split('&'),  
                len = seg.length, i = 0, s;  
            for (;i<len;i++) {  
                if (!seg[i]) { continue; }  
                s = seg[i].split('=');  
                ret[s[0]] = s[1];  
            }  
            return ret;  
        })(),  
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],  
        hash: a.hash.replace('#',''),  
        path: a.pathname.replace(/^([^\/])/,'/$1'),  
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  
        segments: a.pathname.replace(/^\//,'').split('/')  
    };  
}



/**
 * 根据businessType生成url
 */
export function getBusinessUrl({businessType, businessId}) {
    let url = '';
    switch (businessType) {
        case 'live':
            url = `/wechat/page/live/${businessId}`;
            break;
        case 'channel':
            url = `/wechat/page/channel-intro?channelId=${businessId}`;
            break;
        case 'topic':
            url = `/wechat/page/topic-intro?topicId=${businessId}`;
    }
    url = location.origin + url;
    return url;
}

/**
 * 生成唯一的字符串
 */
export function genUniqStr(){
    return Math.random().toString(36).substring(7) + Date.now().toString(16)
}

/**
 * 随机分享描述
 */
export function randomShareText (shareObj, userName) {
    const randomPool = [
        {
            desc: '听完觉得确实不错，忍不住要推荐！',
        },
        {
            desc: '天啦噜！上了这门课我才发现……',
        },
        {
            desc: '朋友圈里优秀的人都在学，你要落后吗？',
        },
        {
            desc: `就差你了！有${Math.floor(Math.random() * (12 - 4 + 1) ) + 4}位朋友已经加入我的学习圈`,
        },
        {
            desc: '正在直播，老师讲得特别好，再不学就晚了！',
        },
    ]
    const idx = Math.floor(Math.random() * randomPool.length)
    const r = randomPool[idx]

    if (shareObj.shareUrl) { // 重写ch
        if (shareObj.shareUrl.indexOf('shareKey=') == -1) {
            shareObj.timelineTitle = `我发现了一门好课《${shareObj.title}》`
        }
        shareObj.shareUrl = fillParams({ch_r: `shareR${idx + 1}`}, shareObj.shareUrl)
    }

    return {
        ...shareObj,
        ...r
    }
}

/**
 *
 * 是否登录
 * @return {boolean}
 */
export const isLogined = () => {
    return !!getCookie('userId');
};

/**
 * 实际支付价
 * @param {*} price 支付价(分)
 * @param {*} isQlMemberPrice 是否会员价
 * @param {*} couponPrice 优惠券金额(分)
 */
export const paymentPrice = (price, isQlMemberPrice = false, couponPrice = 0, hasSub = true) => {
    if (price == 0) {
        return null
    }

	let _price = price - couponPrice
	if (isQlMemberPrice) {
		_price *= 0.8
    }
    let str = ''
    if (isQlMemberPrice && couponPrice > 0) {
        str = '会员券后价'
    } else if (couponPrice > 0) {
        str = '券后价'
    } else if (isQlMemberPrice) {
        str = '会员价'
    }
	return `${hasSub ? str + '￥' : ''}${_price > 0 ? formatNumber(_price / 100) : 0}`
}

/**
 * 评论时间
 */
export const getDateDiff = (dateTimeStamp) => {
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	// var halfamonth = day * 15;
	var month = day * 30;
	var year = month * 12;
    var now = new Date().getTime();
    var diffValue = now - new Date(Number(dateTimeStamp)).getTime();
	if (diffValue < 0) { return; }
	var yearC = diffValue / year;
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
    let result;
	if (dayC > 3) {
		result = formatDate(dateTimeStamp, 'yyyy-MM-dd hh:mm:ss');
	}
	else if (dayC >= 1) {
		result = `${ parseInt(dayC) }天前`;
	}
	else if (hourC >= 1) {
		result = `${ parseInt(hourC) }小时前`;
	}
	else if (minC >= 1) {
		result = `${ parseInt(minC) }分钟前`;
	} else
		result = `刚刚`;
	return result;
};


/**
 * 四舍五入
 * @export
 * @param {*} number
 * @param {number} [precision=2]
 * @returns
 */
export function fomatFloat(number,precision = 2){   
    const enlargeDigits = function enlargeDigits(times) {
        return function (number) {
            return +(String(number) + "e" + String(times));
        };
    };
    const toFixed = function toFixed(precision) {
        return function (number) {
            return number.toFixed(precision);
        };
    };
    const compose = function compose() {
        for (var _len = arguments.length, functions = Array(_len), _key = 0; _key < _len; _key++) {
            functions[_key] = arguments[_key];
        }
        var nonFunctionTypeLength = functions.filter(function (item) {
            return typeof item !== 'function';
        }).length;
        if (nonFunctionTypeLength > 0) {
            throw new Error("compose's params must be functions");
        }
        if (functions.length === 0) {
            return function (arg) {
                return arg;
            };
        }
        if (functions.length === 1) {
            return functions[0];
        }
        return functions.reduce(function (a, b) {
            return function () {
                return a(b.apply(undefined, arguments));
            };
        });
    };
    precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    if (Number.isNaN(+number)) {
        throw new Error("number's type must be Number");
    }
    if (Number.isNaN(+precision)) {
        throw new Error("precision's type must be Number");
    }
    return compose(toFixed(precision), enlargeDigits(-precision), Math.round, enlargeDigits(precision))(number)
}  

/**
 * 数字格式化为金额
 * @param {*} c 小数点后面有几位 (四舍五入到指定的位数)
 * @param {*} d 小数点 符号 (.) , 把它作为参数，是因为你可以自己制定你所需要的符号
 * @param {*} t 千分位的符号 (,)
 */
export function numberFormat (number, c = 2, d = '.', t = ','){
    var n = number, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


/**
 * 字符串匹配超链接，空格格式化
 * @param {*} text 字符串的超链接以http://或者https://开头，匹配非中文
 */
export function formatRichText(text){
    const reg = /([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)([A-Za-z0-9\-\~\.\/\?\=\&\%\_\#\+\*\(\)\@\!\$\^\:]+)/g
    const result =  text?.replace(reg,`<a href="$&">$&</a>`).replace(/\n/g,'<br/>')
    return result||text
}  
/**
 * 百度自动推送代码
 */
export function baiduAutoPush () {
    const bp = document.createElement('script');
    const curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https'){
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    } else{
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    const s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
}

export const isCompetitorLink = async (url) => {
    if (!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(url)) {
        window.toast('链接格式不正确')
        return true
    }

    let competitorLink = window.competitorLink
    // 竞品链接
    if (!competitorLink) {
        const res = await request({
            url: '/api/wechat/transfer/h5/domain/competitorDomain',
            method: 'POST',
            body: {}
        });

        competitorLink = res && res.data && res.data.domainList || []
        window.competitorLink = competitorLink
    }

    if (competitorLink && competitorLink.length > 0 && competitorLink.some(item => new RegExp(item, 'i').test(url))) {
        window.toast('暂不支持输入该链接～')
        return true
    }

    return false
}


// 获取课程 title keyword description
export const getCourseHtmlInfo = ({
    businessName = '',  // 课程名称
    liveName = '',      // 直播间名称
    intro = '',         // 主讲人介绍
    firstName = '',     // 课程一级类目标签
    secondName = '',    // 课程二级类目标签
}) => {
    if (!businessName || !liveName) return false

    return {
        htmlTitle: `${businessName}_${!firstName ? '' : firstName + '_'}${liveName}_千聊`,
        htmlKeywords: `${!intro ? '' : intro + ','}${!firstName ? '' : firstName + ','}${!secondName ? '' : secondName + ','}${liveName}`, 
        htmlDescription: `欢迎收听《${businessName}》，更多优质精品内容，尽在千聊。千聊，2亿人都在用的知识学习平台！涵盖职场、情感、教育、变美等各生活领域的各类专家，竭诚为你提供高质量的知识库！千聊,腾讯投资的微信直播/私域流量管理/涨粉引流工具,免费使用,不抽佣不抽成。`
    }
}