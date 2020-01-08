var path = require('path'),
    fs = require('fs'),
    header = require('../components/header/header');


var recordingSwf = function(req, res, next) {
    var filePath = path.resolve(__dirname, '../components/swf/recorder.swf');
        // res = this.response;

    header.contentType('swf', res);
    res.status(200).send(fs.readFileSync(filePath));
};

module.exports = [
    ['GET', '/api/swf/rec', recordingSwf],
];
