import { encode, tranformCamelToUnderline } from '../comp/querystring'
const appConfig = __inline('../app.json')

interface CommonOption {
    /* 设备基本信息 */
    brand: string
    model: string
    language: string
    version: string
    system: string
    platform: string
    SDKVersion: string

    /* 其他信息 */
    tz: string // 0800
    rs: string // 1500x1000
    referrer: string  // redirect过来的页面是不准的
    url: string // https://m.qlchat.com/wechat/page/recommend
    caller: string // h5
    userId: string // 90000112074092
    scene: number // 场景值

    [index: string]: any
}

type logType = 'pv' | 'click' | 'visible' | 'event'
type initType = 'app' | 'page'

export class LoggerService {
    /* 设备信息 */
    private readonly systemInfo: any;
    /* 网络状态 */
    private networkType: string
    private isConnected: boolean
    /* 时区字符串 */
    private timeZoneStr: string
    
    constructor() {
        this.systemInfo = wx.getSystemInfoSync()
        this.initNetworkTypeListener()
    }

    /* pv方法，只需要传输最基本的数据,方法内获取就ok */
    public pv() {
        this.sendLog('pv', this.commonData)
    }

    /* 点击日志，传入的e的类型是微信点击事件类型，然而微信没有官方的头文件 = =，先any吧 */
    public click(e: any): boolean {
        try {
            if (!e.detail || !e.currentTarget) {
                throw new Error('不合法的事件对象')
            }

            let dataset = e.currentTarget.dataset
            let clickData = {}

            for (let key in dataset) {
                if (/^log/.test(key)) {
                    let transformKey = tranformCamelToUnderline(key).replace('log_', '')
                    Object.defineProperty(clickData, transformKey, {
                        value: dataset[key],
                        enumerable: true,
                    })
                }
            }

            this.sendLog('click', {
                ...this.commonData,
                ...clickData,
                x: e.detail.x,
                y: e.detail.y,
            })
            return true
        } catch (error) {
            console.error('点击事件错误： ', error)
            return false
        }
    }

    public visible(data: any) {
        this.sendLog('visible', {
            ...this.commonData,
            logs: data,
        })
    }

    /* 事件日志，这个基本是要手动调用的，就不做多余的事件了 */
    public event(data: any) {
        this.sendLog('event', {
            ...this.commonData,
            ...data
        })
    }

    /* 发送日志方法 */
    private sendLog(type: logType, data: CommonOption) {
        let url: string
        switch (type) {
            case 'pv':
                url = 'https://collect-logs.qianliao.cn/pv'
                break;
            case 'click':
                url = 'https://collect-logs.qianliao.cn/click'
                break;
            case 'visible':
                url = 'https://collect-logs.qianliao.cn/visible'
                break;
            case 'event':
                url = 'https://collect-logs.qianliao.cn/event'
                break;
        }
        let dataStr = encode(data)
        if (dataStr) {
            url += `?${dataStr}`
        }
        console.log('----------------')
        console.log('日志类型：', type)
        console.log('日志数据：', data)
        console.log('----------------')
        wx.getImageInfo({
            src: url,
            // success() { console.log('日志发送成功') },
            // fail(e) { console.error('日志发送失败', e) },
        })
    }

    /* 网络类型监听 */
    private initNetworkTypeListener() {
        wx.getNetworkType({
            success: (res) => {
                this.networkType = res.networkType
            }
        });
        (wx as any).onNetworkStatusChange((res: any) => {
            this.networkType = res.networkType
            this.isConnected = res.isConnected
        })
    }

    /* 组装url和参数 */
    private combineUrlWithOptions(url: string, options: any): string {
        const queryStr = encode(options)
        if (queryStr) {
            url += `?${queryStr}`
        }
        return url
    }

    /* 通用数据 */
    get commonData(): CommonOption {
        const {
            brand,	// 手机品牌	1.5.0
            model,	// 手机型号	
            language,	// 微信设置的语言	
            version,	// 微信版本号	
            system,	// 操作系统版本	
            platform,	// 客户端平台	
            SDKVersion,	// 客户端基础库版本
            screenWidth,	// 屏幕宽度	1.1.0
            screenHeight,	// 屏幕高度	1.1.0
        } = this.systemInfo

        return {
            brand,
            model,
            language,
            version,
            system,
            platform,
            SDKVersion,

            weappVer: global.weappVer,
            site: 'weapp',
            tz: this.timeZone,
            rs: screenWidth + 'x' + screenHeight,
            referrer: this.refferer,
            url: this.url,
            caller: 'weapp',
            userId: this.userId,
            scene: global.scene,
        }
    }

    /* 时区 */
    get timeZone() {
        if (this.timeZoneStr) {
            return this.timeZoneStr
        } else {
            const date = new Date()
            const offsetHour = date.getTimezoneOffset() / 60

            let timeZone;
            if (offsetHour < -10 || offsetHour > 10) {
                timeZone = (offsetHour * 100);
            }
            if (offsetHour > -10 && offsetHour < 0) {
                timeZone = '-0' + Math.abs(offsetHour) * 100;
            }
            if (offsetHour < 10 && offsetHour > 0) {
                timeZone = '0' + Math.abs(offsetHour) * 100;
            }
            if (offsetHour == 0) {
                timeZone = '0000'
            }
            return timeZone.toString()
        }
    }

    /* refferer，如果是redirect过来的页面，拿到的不一定准确 */
    get refferer() {
        let pages = getCurrentPages()
        let lastPage = pages[pages.length - 2]

        if (!lastPage) { return '' }
        return this.combineUrlWithOptions(lastPage.__route__, lastPage.options)
    }

    /* 当前页面url */
    get url() {
        const pages = getCurrentPages()
        const thisPage = pages[pages.length - 1]

        return this.combineUrlWithOptions(thisPage.__route__, thisPage.options)
    }

    /* 用户id */
    get userId() {
        return wx.getStorageSync('userId').value
    }

}

/**
 * 代理类实现单例
 * 
 * @export
 * @class ProxyLoggerService
 */
export class ProxyLoggerService {
    private static loggerService: LoggerService

    static create(): LoggerService {
        if (!ProxyLoggerService.loggerService) {
            ProxyLoggerService.loggerService = new LoggerService()
        }
        return ProxyLoggerService.loggerService
    }
}
