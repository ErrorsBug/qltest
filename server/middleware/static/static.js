var express = require('express'),

    conf = require('../../conf');

module.exports = function () {
    const options = {
        maxAge: conf.mode === 'prod' ? 30 * 24 * 3600 * 1000 : 0,
        index: false,
        redirect: false,
    };

    if (conf.mode !== 'prod') {
        options.setHeaders = function (res, path, stat) {
            res.set('Access-Control-Allow-Origin', '*');
        }
    }

    return express.static(conf.root, options);
};
