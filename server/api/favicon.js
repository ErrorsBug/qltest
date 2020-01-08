var path = require('path');

function onFavicon(req, res) {
    res.status(200).sendFile(path.resolve(__dirname, '../../public/favicon.ico'));
}

module.exports = [
    // favicon   此处路由不再使用，利用static模块处理
    ['GET', '/favicon.ico.bak', onFavicon]
];