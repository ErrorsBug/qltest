const fs = require('fs');
const path = require('path');
const lo = require('lodash');

const files = fs.readdirSync(path.resolve(__dirname))

// 组合resolver
const resolvers = files.reduce((pre, cur, index) => {
    if (path.extname(cur) === '.js' && path.basename(cur) !== 'index') {
        let obj = require(path.resolve(__dirname, cur)).default;
        return lo.merge(pre, obj)
    }
}, {})

export default resolvers
