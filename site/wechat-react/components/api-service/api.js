import fetch from 'isomorphic-fetch';
import { buildquery } from './build-query'


export class ApiService {
    /**
     * 请求默认配置
     *
     * @
     *
     * @memberOf ApiService
     */
    options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    }

    /**
     * ajax请求host
     *
     * @
     *
     * @memberOf ApiService
     */
    baseApiHost = `/api/wechat/transfer`
    weappApiHost = `/api/wechat/transfer`
    wechatApiHost = `/api/wechat/transfer`

    /**
     * get请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */
    get(opt) {
        opt.url = buildquery(opt.url, opt.body)
        return this.buildMethod('GET')(opt)
    }

    /**
     * post请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */
    post(opt) {
        return this.buildMethod('POST')(opt)
    }

    /**
     * put请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */
    put(opt) {
        return this.buildMethod('PUT')(opt)
    }

    /**
     * patch请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */
    patch(opt) {
        return this.buildMethod('PATCH')(opt)
    }

    /**
     * delete请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */
    delete(opt) {
        return this.buildMethod('DELETE')(opt)
    }

    /**
     * 创建一种类型的请求方法
     *
     * @
     * @template T
     * @param {HttpTypes} method 请求方法类型
     * @returns {(opt: IRequestOptions) =>  Promise <any>} 请求方法
     *
     * @memberOf ApiService
     */
    buildMethod(method) {
        return (opt) => {
            return new Promise((resolve, reject) => {
                let { url, body } = opt
                // url = opt.noTransfer ? url : this.apiHost + url

                if (!opt.noTransfer) {
                    const site = opt.transferApiSite || 'baseApi';
                    switch (site) {
                        case 'baseApi':
                            url = this.baseApiHost + url;
                            break;
                        case 'wechatApi':
                            url = this.wechatApiHost + url;
                            break;
                        case 'weappApi':
                            url = this.weappApiHost + url;
                            break;
                    }
                }

                if (body) {
                    body = method !== 'GET' ? JSON.stringify(body) : null
                }

                const obj = {
                    method,
                    body,
                    // headers: [
                    //     ['Content-Type', 'application/json;charset=UTF-8'],
                    // ],
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    credentials: 'include',
                }

                fetch(url, obj)
                    .then(res => res.json())
                    .then(json => {
                        if (!json.state || json.state.code == undefined) {
                            throw new Error('返回格式错误')
                        }
                        resolve(json)
                        if (json.state.code !== 0 && json.state.msg && opt.showError && (window).message) {
                            (window).message.warning(json.state.msg)
                        }
                    })
                    .catch(err => {
                        console.error(err)

                        if (opt.useReject) {
                            reject(err)
                        }

                        if (opt.fixFetchError) {
                            let result = {
                                state: {
                                    code: 444444,
                                    msg: '请求接口失败'
                                },
                                data: {}
                            }
                            resolve(result)
                        }
                    })
            })
        }
    }
}

const apiService = new ApiService()
export {apiService};