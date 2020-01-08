"use strict";
exports.__esModule = true;
/**
 * 将对象以search语句的形式放入url中
 *
 * @export
 * @param {string} url 请求地址
 * @param {*} query search语句对象
 * @returns {string} 构建好的url
 */
function buildquery(url, query) {
    if (!query || typeof query !== 'object') {
        return url;
    }
    var result = [];
    var _loop_1 = function (key) {
        if (query.hasOwnProperty(key)) {
            var val_1 = query[key];
            // 如果是数组则将每一项都push进result
            if (Array.isArray(val_1)) {
                val_1.forEach(function (item) {
                    result.push(key + "=" + val_1);
                });
            }
            else {
                result.push(key + "=" + val_1);
            }
        }
    };
    for (var key in query) {
        _loop_1(key);
    }
    var querysymbol = url.indexOf('?') > -1
        ? '&'
        : '?';
    return url + querysymbol + result.join('&');
}
exports.buildquery = buildquery;
