

/**
 * 需要判断是否走知识店铺授权的页面路由请添加该中间件（需在wxauth中间件前引入）
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
function goKnowledgeToQlCodeAuth () {

    return function (req, res, next) {
        // 标识 需要判断是否走知识店铺授权
        req._isGoKnowledgeToQlCodeAuth = true;

        next();
    };
}


module.exports = goKnowledgeToQlCodeAuth;
