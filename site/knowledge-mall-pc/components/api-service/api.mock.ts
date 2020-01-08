import { Mock } from '../../mock'

export type HttpTypes = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'

/**
 * 发起请求选项
 *
 * @export
 * @interface IRequestOptions
 */
export interface IRequestOptions
{
    /**
     * 请求路径
     *
     * @type {string}
     * @memberOf IRequestOptions
     */
    url: string

    /**
     * 请求参数数据
     *
     * @type {*}
     * @memberOf IRequestOptions
     */
    body?: any

    /**
     * 是否不经过transfer中间件
     *
     * @type {boolean}
     * @memberof IRequestOptions
     */
    noTransfer?: boolean

    /**
     * 请求未成功时是否提示
     * 
     * @type {boolean}
     * @memberof IRequestOptions
     */
    showError?: boolean

    /**
     * 是否使用mock数据返回
     * 
     * @type {boolean}
     * @memberof IRequestOptions
     */
    mock?: boolean
}

/**
 * ajax请求服务封装
 *
 * @export
 * @class ApiService
 */
export class ApiMockService
{
    /**
     * 请求默认配置
     *
     * @private
     *
     * @memberOf ApiService
     */
    private options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    }

    /**
     * ajax请求host
     *
     * @private
     *
     * @memberOf ApiService
     */
    private apiHost = `/api/wechat/transfer`

    /**
     * get请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */
    public get<T>(opt: IRequestOptions)
    {
        // opt.url = buildquery(opt.url, opt.body)
        return this.buildMethod<T>('GET')(opt)
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
    public post<T>(opt: IRequestOptions)
    {
        return this.buildMethod<T>('POST')(opt)
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
    public put<T>(opt: IRequestOptions)
    {
        return this.buildMethod<T>('PUT')(opt)
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
    public patch<T>(opt: IRequestOptions)
    {
        return this.buildMethod<T>('PATCH')(opt)
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
    public delete<T>(opt: IRequestOptions)
    {
        return this.buildMethod<T>('DELETE')(opt)
    }

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
                resolve(Mock.success(opt.url))
            })
        }
    }
}