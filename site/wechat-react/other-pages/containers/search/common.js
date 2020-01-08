import { locationTo } from 'components/util'
import { getUrlParams, query2string } from 'components/url-utils';

export function wordFilter(ff) {
    var ffData = ff || '';
    ffData = ffData.replace(/\</g, "&lt;");
    ffData = ffData.replace(/\>/g, "&gt;");
    ffData = ffData.replace(/\"/g, "&quot;");
    ffData = ffData.replace(/\'/g, "&#39;");
    return ffData;
}

export function replaceEm(str) {
    str = str || '';
    return str.replace('<em>', '').replace('</em>', '')
}

export const logHandler = {
    /**
     * 搜索结果valid
     *
     * 搜索出结果后点击话题/系列课/直播间或点击[更多]按钮将会记录一条日志，
     * 表示当次搜索是有效搜索，且一次搜索结果只记录一次。一个临时处理方法便
     * 是每次搜索出结果，打印success日志时将validState设置为true，打过一次
     * valid日志后便设置为false，防止重复打日志
     *
     */
    validState: false,

    /* 结果页是否是点击更多过来，是则不打success日志 */
    fromMore: false,
    source: 'self',

    updateSource(val) {
        this.source = val
        sessionStorage && sessionStorage.setItem('trace_page',`search_${this.source}`)
    },
    /**
     * 打日志
     *
     * @param {string} actions 有效值为 success|fail|valid
     * @param {string} type 搜索类型，有效值为 topic|channel|live|all
     * @param {string} keyword 搜索关键词
     */
    calllog(actions, type, keyword, page) {
        if (actions === 'success') {
            this.validState = true
        }
        if (actions === 'valid') {
            if (!this.validState) { return }
            this.validState = false
        }
        const logs = {
            category: 'search',
            action: actions,
            business_type: type,
            business_name: keyword,
            search_type: this.source,
        }
        if (page) {
            logs.pageNum = page
        }

        window._qla && window._qla('event', logs)
    },
}

/* 控制本地缓存历史记录的读写 */
export const localhandler = {
    SEARCH_HISTORY: 'SEARCH_HISTORY',

    update(word, historyType) {
        word = word.trim()
        if(!!historyType){
            this.SEARCH_HISTORY = historyType;
        }
        const history = this.read()
        let index = history.indexOf(word)
        if (index > -1) {
            history.splice(index, 1)
        }
        history.unshift(word)
        this.write(history.splice(0, 10))
    },

    read(historyType) {
        if(!!historyType){
            this.SEARCH_HISTORY = historyType;
        }
        const local = localStorage && localStorage.getItem(this.SEARCH_HISTORY)
        return local ? JSON.parse(local) : []
    },

    write(val) {
        val = Array.isArray(val) ? val : []
        localStorage && localStorage.setItem(this.SEARCH_HISTORY, JSON.stringify(val))
    }
}

/* 根据类型和id返回跳转链接 */
function pickUrlWithType(type, id, ch, lshareKey, source) {
    let url;
    switch (type) {
        case 'topic':
            url = `/wechat/page/topic-intro?topicId=${id}&pro_cl=search${ch ? '&ch=' + ch : ''}${source?('&source='+source):''}`;
            break;
        case 'channel':
            url = `/wechat/page/channel-intro?channelId=${id}&sourceNo=search${ch ? '&ch=' + ch : ''}${source?('&source='+source):''}`;
            break;
        case 'live':
            url = `/wechat/page/live/${id}${ch ? '?ch=' + ch : ''}`;
            break;
        case 'camp':
            url = `/wechat/page/camp-detail?campId=${id}&sourceNo=search${ch ? '&ch=' + ch : ''}${source?('&source='+source):''}`;
            break;
        default:
            break;
    }

    if (lshareKey && url) {
        if (url.indexOf('?') < 0) {
            url += '?';
        } else {
            url += '&';
        }
        url += `lshareKey=${lshareKey}`;
    }

    return url;
}

/* 点击列表项操作：打日志，延时跳转*/
export function logAndDirect(type, id, keyword, ch, lshareKey, source) {
    logHandler.calllog('valid', type, keyword)

    locationTo(pickUrlWithType(type, id, ch, lshareKey, source));
}


export function getUrlWithKeyword(keyword = '') {
    let pathname = keyword ? '/wechat/page/search/all' : '/wechat/page/search';
    let hash = location.hash;

    let params = getUrlParams();
    if (keyword) {
        params.keyword = encodeURIComponent(keyword);
    } else {
        delete params.keyword;
    }

    let search = query2string(params);
    search && (search = '?' + search);

    return pathname + search + hash;
}


export function getUrlWithQuery(obj = {}) {
    const params = {...getUrlParams(), ...obj};
    const pathname = params.keyword ? '/wechat/page/search/all' : '/wechat/page/search';
    const hash = location.hash;
    // delete undefined property
    for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] === undefined) {
            delete params[key];
        }
    }
    let search = query2string(params);
    search && (search = '?' + search);
    return pathname + search + hash;
}