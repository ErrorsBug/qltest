import proxy from '../../components/proxy/proxy'
import resProcessor from '../../components/res-processor/res-processor'
import lo from 'lodash'
import conf from '../../conf'
import { read } from 'fs';


const urlPrefixMap = {};
for (let k in conf.apiPrefix) {
    if (conf.apiPrefix.hasOwnProperty(k)) {
        urlPrefixMap[k] = `/api/wechat/transfer/${k}`;
    }
}


async function requestTransfer(req, res, next) {
    try {
        let url;
        const apiHost = req.params && req.params.apiHost;

        /**
         * 如果url包含特定前缀，去掉该前缀，拼接相应的apiHost；否则去掉默认前缀，拼接baseApi的host
         */
        if (conf.apiPrefix[apiHost]) {
            url = conf.apiPrefix[apiHost] + req._parsedUrl.pathname.replace(`/api/wechat/transfer/${apiHost}`, '');
        } else {
            url = conf.apiPrefix.baseApi + req._parsedUrl.pathname.replace('/api/wechat/transfer', '');
        }
 
        /* 获取请求参数 */
        let params
        if (req.method === 'GET') {
            params = req.query
        } else {
            params = req.body
        }

        /* 组织分页参数 */
        if (params.size) {
            params.page = {
                page: params.page,
                size: params.size,
            };
        }

        /* 添加userId */
        const userId = lo.get(req, 'rSession.user.userId')
        if (userId) {
            params.userId = userId
        }
        /* 添加secret */
        let secret = conf.baseApi.secret;
        if( lo.get(conf, `${apiHost}.secret`)){
            secret = lo.get(conf, `${apiHost}.secret`);
        }
        const result = await proxy.apiProxyPromise(url, params, secret, req)
        resProcessor.jsonp(req, res, result)
    } catch (error) {
        resProcessor.error500(req, res, error);
        return
    }
}

/**
 * 组合接口转发
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
async function groupRequestTransfer(req, res, next) {
    try {
        const requestData = req.body
        const userId = lo.get(req, 'rSession.user.userId')

        const tasks = requestData.map(item => {
            const url = conf.apiPrefix.baseApi + item.url
            const body = item.body || {}
            const secret = conf.baseApi.secret

            /* 加入userId */
            if (userId) {
                body.userId = userId
            }

            /* 组合分页参数 */
            if (body.size) {
                body.page = {
                    page: body.page,
                    size: body.size,
                };
            }

            return [url, body, secret]
        })

        const results = await proxy.parallelPromise(tasks)

        resProcessor.jsonp(req, res, {
            state: {
                code: 0
            },
            data: results
        })
    } catch (error) {
        console.error(`
        '组合接口请求失败:',
            参数：${req.body}
            错误：${error}
        `)
        resProcessor.error500(req, res, error);
    }
}

export { requestTransfer, groupRequestTransfer };
