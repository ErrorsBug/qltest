
var weiboCookieId = 'QL_PG_WB',
    cookieTimeout = 60 * 60 * 24 * 1000;


function weiboCookie () {
    
    return function (req, res, next) {



            
        // 写入微博标识cookie，标识微博用户,用于tninx识别为微博用户分发链接到nodejs层
        // 后期可去掉该cookie
        res.cookie(weiboCookieId, '1', {
            maxAge: cookieTimeout, //expires * 1000,
            httpOnly: true,
        });

        next();
    };
}

module.exports = weiboCookie;
