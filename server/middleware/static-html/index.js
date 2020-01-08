/**
 * 页面静态化中间件，获取当前类型的页面是否存在缓存，是否过期，如果有缓存的话就直接返回html到前端
 */
import StaticHtml from '../../components/static-html';

const conf = require('../../conf');
const staticHtml = StaticHtml.getInstance();

const lo = require('lodash');

/**
 * @param keyPrefix 页面标记 ( TI, CI, LI )
 * @param idType 需要从query中获取哪个字段当页面标识 (topicId, channelId, liveId)
 */
export default (keyPrefix, idType) => {

    return (req, res, next) => {
        // if (conf.mode !== 'prod') {
        //     next();
        //     return;
        // }

        let id = req.query[idType] || req.params[idType];

        if (!id) {
            next();
            return;
        }

        // const id = req.query[idType];
        // 将该页面标记为静态化页面处理
        req.isStaticHtml = true;
        // 注入静态化页面的前缀
        req.staticHtmlPrefix = keyPrefix;
        // 注入静态化页面的标识id
        req.staticHtmlId = id;

        // 获取本次请求的静态化页面缓存
        staticHtml.getHtmlCache(keyPrefix, id, (err, htmlText) => {
            if (err || !htmlText) {
                next();
            } else {
                res.status(200).send(htmlText);
            }
        });
    }
}
