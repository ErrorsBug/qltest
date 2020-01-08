import { api } from '../actions/common';
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

    let money = Math.floor(Number(amount || 0) / base * base) / base;
    return money;
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
}

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
        'M': date.getMonth() + 1, // 月份
        'd': date.getDate(), // 日
        'h': date.getHours(), // 小时
        'm': date.getMinutes(), // 分
        's': date.getSeconds(), // 秒
        'q': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds(), // 毫秒
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

}

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
        isFemale: false, // 是否为女性。默认false
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
    var _cardNo = cardNo.split('');

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
export function locationTo(url) {
    setTimeout(() => {
        window.location.href = url;
    }, 150);
}

/**
 * 数字格式化成万或千
 * @param  {[type]} digit [description]
 * @param  {[type]} block [description]
 * @return {[type]}       [description]
 */
export function digitFormat(digit, block) {

    if (digit === undefined || digit === '') return 0;

    var format = parseInt(block) || 10000;

    digit = parseInt(digit);

    if (digit >= 1000 && digit < 10000 && format <= 1000) {

        digit = digit / 1000;

        if (digit % 1 !== 0) {

            digit = digit.toFixed(1) + '千';
        }

    } else if (digit >= 10000 && digit >= format) {

        digit = digit / 10000;

        if (digit % 1 !== 0) {
            digit = digit.toFixed(1) + '万';
        }
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
export const timeAfter = (startTime, nowTime) => {

    var timeNow = parseInt(new Date().getTime()),
        d = (parseInt(startTime) - (nowTime || timeNow)) / 1000,
        d_days = parseInt(d / 86400),
        d_hours = parseInt(d / 3600),
        d_minutes = parseInt(d / 60);

    if (d_days > 0 /* && d_days < 15*/) {
        return d_days + '天后';
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + '小时后';
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + '分钟后';
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
    return str.replace(/\n/g, '</br>');
}

export const dangerHtml = (content) => {
    return { __html: content };
};

/**
 * 根据时间戳显示周几的字符串
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */
export const formateToDay = (startTime, nowTime) => {
    var timeNow = nowTime || parseInt(new Date().getTime()),
        d_days = Math.abs((startTime - timeNow) / 1000);
    var timeDay = new Date(startTime).getDay();
    if (d_days >= 0 && d_days <= 86400 && timeDay === new Date().getDay()) {
        return '今天';
    } else {
        switch (timeDay) {
            case 1: return '周一'; break;
            case 2: return '周二'; break;
            case 3: return '周三'; break;
            case 4: return '周四'; break;
            case 5: return '周五'; break;
            case 6: return '周六'; break;
            case 0: return '周日'; break;
            default: break;
        }
    }
};

export const updatePageData = () => {
    try {
        if (sessionStorage.getItem('isDataChange_B')) {
            var isDataChange_B = sessionStorage.getItem('isDataChange_B');
            sessionStorage.setItem('isDataChange_B', ++isDataChange_B);
        }
    } catch (e) {
    }
    return;
};
export const refreshPageData = () => {
    try {
        if (sessionStorage.getItem('isDataChange_A')) {
            var isDataChange_A = sessionStorage.getItem('isDataChange_A');
            var isDataChange_B = sessionStorage.getItem('isDataChange_B');
            if (isDataChange_A != isDataChange_B) {
                sessionStorage.setItem('isDataChange_A', isDataChange_B);
                window.location.reload(true);
            }
        } else {
            sessionStorage.setItem('isDataChange_A', 1);
            sessionStorage.setItem('isDataChange_B', 1);
        }
    } catch (e) {
        // TODO handle the exception
    }
    return;
};


export const isNumberValid = (inputNumber, minNum, maxNum, name) => {
    // 提示的信息
    let validMsg = {
        // 输入为空
        voidString: '输入不能为空',
        // 输入非正整数
        notAPositiveNumber: '请输入正整数',
        // 输入正数（取到2位小数）
        notDecimal: '请输入两位小数的非负数',
        // 小于最小值
        lessOrMoreThanNum: '请输入' + minNum + '-' + maxNum + '的数',
    };
    if (inputNumber === '') {
        window.message.error(name + ': ' + validMsg.voidString);
        return false;
    } else if (!/^[1-9]+[0-9]*]*$/.test(inputNumber) && inputNumber !== '0') {
        window.message.error(name + ': ' + validMsg.notAPositiveNumber);
        return false;
    } else if (minNum && maxNum && (Number(inputNumber) < minNum || Number(inputNumber) > maxNum)) {
        window.message.error(name + ': ' + validMsg.lessOrMoreThanNum);
        return false;
    } else {
        return true;
    }
};

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
 * 将文件大小数字转换为字符串
 *
 * @export
 * @param {any} sizeNum 文件大小
 * @returns
 */
export function parseSize(sizeNum) {
    let size = parseInt(sizeNum, 10)

    function calc(num) {
        return Math.pow(1024, num)
    }

    const sizes = [[1, 'B'], [2, 'KB'], [3, 'MB'], [4, 'GB']]

    for (let val of sizes) {
        if (size < calc(val[0])) {
            return (size / calc(val[0] - 1)).toFixed(2) + val[1]
        }
    }
}


export function apiActionFactory(method, url, toastMsg=false) {
    return (opt={}) => {
        return async (dispatch, getStore) => {
            const result = await api({
                dispatch,
                getStore,
                method,
                url,
                body: {
                    ...opt
                },
            });
            if (result.state.code === 0) {
                if (toastMsg) {
                    window.message && window.message.success(result.state.msg)
                }
                return result.data;
                
            } else {
                if (result.state && toastMsg) {
                    window.message.warning(result.state.msg)
                }
                console.error('接口请求错误: ', result.state.msg);
                return result
            }
        }
    }
}


// 乘法
export const mul = (arg1, arg2) => {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();

    try {
        m += s1.split(".")[1].length
    } catch (e) {}
    try {
        m += s2.split(".")[1].length
    } catch (e) {}

    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


/************************ 验证输入类型是否符合格式 - start ******************/
/**
 * @param {Object} validType-检验类型(text\money\name\password)
 * @param {Object} typeName-提示标题
 * @param {Object} inputVal-检验值
 * @param {Object} maxNum-最大值
 * @param {Object} minNum-最小值
 */
export const validLegal = (validType, typeName, inputVal, maxNum, minNum, spec_tips) => {
    var inputVal = typeof(inputVal) == 'string' ? inputVal.trim():inputVal;
    var isPass = true;
    if (inputVal == "") {
        window.message.error(typeName + "不能为空");
        return false;
    };
    switch (validType) {
        case "text": isPass = checkText(); break;
        case "money": isPass = checkMoney(); break;
        case "name": isPass = checkName(); break;
        case "password": isPass = checkPassword(); break;
        case "wxAccount": isPass = checkWxAccount(); break;
        case "phoneNum": isPass = checkPhoneNum(); break;
    };
    function checkText() {
        if (maxNum && inputVal.length > maxNum) {
            window.message.error(typeName + "不能超过" + maxNum + "个字");
            return false;
        } else {
            return true;
        };
    };
    function checkMoney() {
        var tips = "";
        if (!/(^[0-9]*[\.]?[0-9]{0,2}$)/.test(inputVal)) {
            window.message.error(typeName + "必须为非负数字,最多2位小数");
            return false;
        } else if (maxNum && Number(inputVal) > maxNum) {
            if (spec_tips && spec_tips != "") {
                tips += "，" + spec_tips;
            };
            window.message.error(typeName + "不能超过" + maxNum + "元" + tips);
            return false;
        } else if (minNum && Number(inputVal) < minNum) {
            if (spec_tips && spec_tips != "") {
                tips += "，" + spec_tips;
            };
            window.message.error(typeName + "不能小于" + minNum + "元" + tips);
            return false;
        } else {
            return true;
        };
    };
    function checkName() {
        if (!/(^[a-zA-Z]+$)|(^[\u4e00-\u9fa5]+$)/.test(inputVal)) {
            window.message.error("请输入真实姓名");
            return false;
        } else if (maxNum && inputVal.length > maxNum) {
            window.message.error(typeName + "不能超过" + maxNum + "个字");
            return false;
        } else {
            return true;
        };
    };
    function checkPassword() {
        if (!/^[0-9a-zA-Z]+$/.test(inputVal)) {
            window.message.error(typeName + "只能是数字与字母组成");
            return false;
        } else if (maxNum && inputVal.length > maxNum) {
            window.message.error(typeName + "最长为" + maxNum + "位");
            return false;
        } else {
            return true;
        };
    };
    function checkWxAccount() {
        if (!/^[0-9a-zA-Z\-\_]{5,30}$/.test(inputVal)) {
            window.message.error("微信号仅6~30个字母，数字，下划线或减号组成");
            return false;
        } else {
            return true;
        };
    };
    function checkPhoneNum() {
        if (!/^1\d{10}$/.test(inputVal)) {
            window.message.error("请输入正确的手机号");
            return false;
        } else {
            return true;
        };
    };
    return isPass;
};


/**
 * isDecimalValid
 * 验证数字输入是否符合格式 - 允许两位小数
 * 
 * @function
 * @param {number} inputNumber - 要验证的数字 
 * @param {number} minNum - 数字可取的最小值
 * @param {number} maxNum - 数字可取的最大值
 * @param {number} name - 数值名称 
 * @returns none
 */
export const isDecimalValid = (inputNumber, minNum, maxNum, name) => {
    // 提示的信息
    let validMsg = {
        // 输入为空
        voidString: '输入不能为空',
        // 输入非正整数
        notAPositiveNumber: '请输入正整数',
        //输入正数（取到2位小数）
        notDecimal:'请输入两位小数的非负数',
        // 小于最小值
        lessOrMoreThanNum:  (minum, manum) =>{ return '请输入' + minum + '-' + manum + '的数'; },
        // 大于最大值
        moreThanMax:  (num) =>{ return '请输入小于等于' + num + '的数'; }
    };
    
	if (inputNumber === '') {
		window.message.error(name + ': ' + validMsg.voidString, 1.5);
		return false;
	};
	if (!/^[0-9]+([.]\d{1,2})?$/.test(inputNumber)) {
		window.message.error(name + ': ' + validMsg.notDecimal, 1.5);
		return false;
	};
	if (minNum&&maxNum&&(inputNumber < minNum || inputNumber > maxNum)) {
		window.message.error(name + ': ' + validMsg.lessOrMoreThanNum(minNum, maxNum, 1.5));
		return false;
	};
	return true;
};

// 修正 graphql 参数，删除参数中的 __typename
export const formatParam = (param) => {
    let newParam = {...param}
    for (let prop in newParam) {
        if (prop === '__typename') {
            delete newParam[prop];
            break;
        }
        if (Object.prototype.toString.call(newParam[prop])=== '[object Object]') {
            newParam[prop] = formatParam(newParam[prop]);
        }

        if (Object.prototype.toString.call(newParam[prop])=== '[object Array]') {
            newParam[prop] = newParam[prop].map(val => formatParam(val));
        }
    }

    return newParam
}


/**
 * 通过url在当前页直接下载，不跳转页面
 * @param  {[type]} fileUrl [description]
 * @return {[type]}         [description]
 */
export const urlDownload = function (fileUrl) {
    var downloadIframe = document.getElementById('download-iframe');
    if (!downloadIframe) {
        downloadIframe = document.createElement('iframe');
        downloadIframe.setAttribute('id', 'download-iframe');
        downloadIframe.style.width = 0;
        downloadIframe.style.height = 0;
        downloadIframe.style.opacity = 0;
        downloadIframe.style.display = 'none';
        document.body.appendChild(downloadIframe);
    }

    downloadIframe.src = fileUrl;
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
export const setCookie = (c_name, value, expiredays) => {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + encodeURIComponent(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
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