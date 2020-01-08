/**
 * 封装、优化原有曝光逻辑
 * 
 * 添加包装容器，可定义曝光类名
 * 解决场景：子盒子曝光；横向滚动条曝光；首页banner曝光错误
 * 
 * @author jiajun.li 20181119
 */



/**
 * 收集一次曝光
 * @param {object|function} options function时作用同options.callback
 *      @param {string|element} wrap 指定包裹容器，默认为#app或body
 *      @param {function} callback 回调，参数为收集到的元素数组，可空
 *      @param {string} className 需要曝光的类名
 * 
 * e.g.
 * collectExposure()
 * collectExposure({wrap})
 * collectExposure({wrap, className})
 */
function collectExposure(options) {
    options || (options = {});

    var callback;
    if (typeof options === 'function') {
        callback = options;
    } else {
        callback = options.callback;
    }

    var wrap;
    if (typeof options.wrap === 'string') {
        wrap = document.getElementsByClassName(options.wrap)[0];
    } else if (options.wrap && options.wrap.tagName) {
        wrap = options.wrap;
    }
    wrap || (wrap = document.getElementById('app') || document.body);

    var className = options.className || 'on-visible';

    var items = Array.prototype.slice.call(wrap.getElementsByClassName(className)),
        i,
        len = items.length,
        item,
        result = [];

    var wrapRect = wrap.getBoundingClientRect();
    
    if (wrapRect.top != wrapRect.bottom) {
        for (i = 0; i < len; i++) {
            item = items[i];
            if (item.getAttribute('isVisible')) {
                continue;
            }
            if (isElementInViewport(item, wrapRect)) {
                result.push(item);
            }
        }
    }
    
    result.length && typeof callback === 'function' && callback(result);
    commonCollectVisible(result);
}



/**
 * 监听滚动事件收集曝光
 * @param {object} options
 *      @param {string|element} wrap 指定包裹容器，默认为#app或body
 *      @param {function} callback 回调，参数为收集到的元素数组，可空
 *      @param {string} className 需要曝光的类名
 */
function bindScrollExposure(options) {
    options || (options = {});

    var wrap;
    if (typeof options.wrap === 'string') {
        wrap = document.getElementsByClassName(options.wrap)[0];
    } else if (options.wrap && options.wrap.tagName) {
        wrap = options.wrap;
    }
    wrap || (wrap = document.getElementById('app') || document.body);

    var _options = {
        wrap: wrap,
        callback: options.callback,
        className: options.className,
    };

    collectExposure(_options);
    wrap.addEventListener('scroll', debounce(function () {
        collectExposure(_options);
    }));
}



/**
 * 通用的曝光处理，参考qlchat的曝光
 */
function commonCollectVisible(items) {
    var logs = [];

    items.forEach(function (item) {
        item.setAttribute('isVisible', 1);

        var namedNodeMap = item.attributes,
            params = {},
            attr,
            key;

        for (var i = 0, len = namedNodeMap.length; i < len; i++) {
            attr = namedNodeMap[i],
            key = undefined;

            if (attr.name.indexOf('data-log-') === 0) {
                key = attr.name.substring(9);
            } else if (attr.name.indexOf('log-') === 0) {
                key = attr.name.substring(4);
            }

            if (key) {
                params[key] = encodeURIComponent(encodeURIComponent(attr.value));
            }
        }

        logs.push(params);
    })

    if (!logs.length) return;

    typeof _qla === 'undefined' || _qla('visible', {
        logs: JSON.stringify(logs)
    })
}



function isElementInViewport(el, wrapRect) {
    var rect = el.getBoundingClientRect();
    var minViewPx = 1; // 最小显示px值
    if (rect.bottom < wrapRect.top + minViewPx
        || rect.top > wrapRect.bottom - minViewPx
        || rect.right < wrapRect.left + minViewPx
        || rect.left > wrapRect.right - minViewPx
    ) {
        return false;
    }
    return true;
}



function debounce(fn, delay) {
    var timer;
    return function () {
        var args = arguments;
        var context = this;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay || 200);
    }
}



export default {
    collect: collectExposure,
    bindScroll: bindScrollExposure,
}
