import fetch from 'isomorphic-fetch';
import { buildquery } from './build-query'
import { groupRequest } from './api.group'

export type HttpTypes = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'

export interface IRequestOptions
{
    /** 请求路径 */
    url: string

    /** 请求参数数据 */
    body?: any

    /** 是否不经过transfer中间件 */
    noTransfer?: boolean

    /** 请求未成功时是否提示 */
    showError?: boolean

    /** 是否将错误抛到外面 */
    useReject?: boolean

    /** 将fetch错误转化成标准api返回，错误信息反映在result.state.msg上 */
    fixFetchError?: boolean
}

export class ApiService
{
    /** 默认请求配置 */
    private options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    }

    /* 转发接口地址前缀 */
    private transferHost = '/api/wechat/transfer'

    /** get请求方法 */
    public get<T>(opt: IRequestOptions)
    {
        opt.url = buildquery(opt.url, opt.body)
        return this.buildMethod<T>('GET')(opt)
    }

    /** post请求方法 */
    public post<T>(opt: IRequestOptions)
    {
        return this.buildMethod<T>('POST')(opt)
    }

    /** put请求方法 */
    public put<T>(opt: IRequestOptions)
    {
        return this.buildMethod<T>('PUT')(opt)
    }

    /** patch请求方法 */
    public patch<T>(opt: IRequestOptions)
    {
        return this.buildMethod<T>('PATCH')(opt)
    }

    /** delete请求方法 */
    public delete<T>(opt: IRequestOptions)
    {
        return this.buildMethod<T>('DELETE')(opt)
    }

    /** 组合请求接口方法 */
    public group = groupRequest.request

    /**
     * 创建一种类型的请求方法
     *
     * @private
     * @template T
     * @param {HttpTypes} method 请求方法类型
     * @returns {(opt: IRequestOptions) =>  Promise <any>} 请求方法
     *
     * @memberOf ApiService
     */
    private buildMethod<T>(method: HttpTypes): (opt: IRequestOptions) => Promise<any>
    {
        return (opt: IRequestOptions): Promise<any> =>
        {
            return new Promise((resolve, reject) =>
            {
                let { url, body } = opt

                /* 如果是转发接口则添加转发前缀 */
                if (!opt.noTransfer) {
                    url = this.transferHost + url
                }

                /* 组织参数 */
                if (body) {
                    body = method !== 'GET' ? JSON.stringify(body) : null
                }

                const obj = {
                    method,
                    body,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    credentials: 'include',
                }

                fetch(url, obj as any)
                    .then(res => res.json())
                    .then(json =>
                    {
                        if (!json.state || json.state.code == undefined) {
                            throw new Error('返回格式错误')
                        }
                        resolve(json)
                        if (json.state.code !== 0 && json.state.msg && opt.showError && (window as any).message) {
                            (window as any).message.warning(json.state.msg)
                        }
                    })
                    .catch(err =>
                    {
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