class RouteService {
    /* 页面栈最大数量 */
    private maxPageStackCount = 10

    /**
     * 获取当前页面栈的url
     * 
     * @private
     * @returns 
     * @memberof RouteService
     */
    private getPageUrls() {
        return getCurrentPages().map(pageObj => {
            let url = urlUtils.encode(pageObj.__route__, pageObj.options)
            /** 
             * 之所以要做这一步是因为在微信的页面栈中存储的__route__的值没有最开头的反斜杠，
             * 而调用redirectTo，navigateTo等方法时又需要开头的反斜杠，因此需要加上反斜杠
             * 才能在对比url时获得正确的结果
             */
            return '/' + url
        })
    }

    /**
     * 跳转页面方法
     * 
     * @param {string} url 页面url
     * @memberof RouteService
     */
    public navigateTo(options: wx.NavigateToOptions) {
        let pages = this.getPageUrls()
        let index = pages.indexOf(options.url)

        if (index >= 0) {
            let delta = pages.length - index - 1
            if (delta > 0) {
                wx.navigateBack({
                    delta: pages.length - index - 1,
                })
            }
        } else if (pages.length === this.maxPageStackCount) {
            /* 如果当前页面栈数量已达微信最大限制，后续方法全部用redirect */
            wx.redirectTo(options)
        } else {
            wx.navigateTo(options)
        }
    }
}

export const routeService = new RouteService()

class UrlUtils {
    public encode(url: string, obj: { [index: string]: any }) {
        let search = Object.keys(obj)
            .map(key => {
                let _key = encodeURIComponent(key)
                let _val = encodeURIComponent(obj[key].toString())

                return `${_key}=${_val}`
            })
            .join('&')

        return search ? `${url}?${search}` : url
    }

    public decode(url: string) {
        let queryIndex = url.indexOf('?')
        if (queryIndex < 0) {
            return url
        }

        let search = url.slice(queryIndex + 1, url.length)
        let pairs = search.split('&')
        let obj = new Object()
        pairs.forEach(pair => {
            let item = pair.split('=')
            let _key = decodeURIComponent(item[0])
            let _val = decodeURIComponent(item[1])

            Object.defineProperty(obj, _key, {
                value: _val,
                enumerable: true,
            })
        })

        return obj
    }
}

export const urlUtils = new UrlUtils()
