import { getStorage, setStorage } from './storage.service'
import { apiPrefix } from '../config'

type RequestMethodType = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
interface RequestParams {
    url: string
    data?: {
        [index: string]: any
    }
    cache?: boolean
    expires?: number
    ignoreCacheKeys?: Array<string>
}
type RequestFunc = (opt: RequestParams) => Promise<any>

class ApiService {
    public get: RequestFunc
    public post: RequestFunc
    public put: RequestFunc
    public delete: RequestFunc
    public trace: RequestFunc
    public connect: RequestFunc
    public options: RequestFunc
    public head: RequestFunc

    private storageKeyPrefix = 'REQUEST_CACHE_STORAGE'
    private apiPrefix = apiPrefix

    constructor() {
        this.get = this.buildMethod('GET')
        this.post = this.buildMethod('POST')
        this.put = this.buildMethod('PUT')
        this.delete = this.buildMethod('DELETE')
        this.trace = this.buildMethod('TRACE')
        this.connect = this.buildMethod('CONNECT')
        this.options = this.buildMethod('OPTIONS')
        this.head = this.buildMethod('HEAD')
    }

    private buildMethod(requestMethodType: RequestMethodType): RequestFunc {
        return (opt: RequestParams) => {
            opt.data = opt.data || {}
            opt.url = this.apiPrefix + opt.url

            const storageKey = this.buildStorageKey(opt, requestMethodType)
            const needCache = opt.cache && opt.expires > 0

            if (needCache) {
                let cacheData = getStorage(storageKey)
                if (cacheData) {
                    return new Promise((resolve, reject) => {
                        resolve(cacheData)
                        console.info('请求到缓存数据: ', cacheData)
                    })
                }
            }

            return new Promise((resolve, reject) => {
                const requestData = {
                    ...opt,
                    method: requestMethodType,
                    success: (res: any) => {
                        console.log('请求成功:', res.data)
                        resolve(res.data)
                        if (needCache && this.canResponseCache(res)) {
                            setStorage(storageKey, res.data, opt.expires)
                        }
                    },
                    fail: (err: Error) => {
                        console.error('请求失败: ', err)
                        reject(err)
                    },
                }

                wx.request(requestData)
            })
        }
    }
    
    private canResponseCache(response: any) {
        try {
            /* 这层data是微信请求封装的一层data */
            let wrapData = response.data

            if (!wrapData || !wrapData.state || wrapData.state.code !== 0) {
                throw new Error('返回数据异常')
            }

            /* 这是请求实际返回的数据 */
            let data = wrapData.data

            if (Array.isArray(data) && !data.length) {
                throw new Error('返回数组为空')
            }

            if (typeof data === 'object' && !Object.keys(data).length) {
                throw new Error('返回对象为空')
            }

            return true
        } catch (error) {
            console.info('不缓存数据:', error)
            return false
        }
    }

    private buildStorageKey(opt: RequestParams, method: RequestMethodType) {
        let pairs = new Array<string>()
        let ignoreKeys = opt.ignoreCacheKeys || []

        for (const key in opt.data) {
            if (opt.data.hasOwnProperty(key) && ignoreKeys.indexOf(key) < 0) {
                pairs.push(`${key}=${JSON.stringify(opt.data[key])}`)
            }
        }
        
        return `${this.storageKeyPrefix}-${method}-${opt.url}-${pairs.join('&')}`
    }
}

export default class ProxyApiService {
    static apiService: ApiService

    constructor() {
        if (!ProxyApiService.apiService) {
            ProxyApiService.apiService = new ApiService()
        }
        return ProxyApiService
    }
}

export const apiService = new ApiService()
