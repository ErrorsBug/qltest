// import { readdirSync } from 'fs';
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.resolve(__dirname))

const types = files.map(file => {
    if (path.extname(file) === '.gql') {
        let str = fs.readFileSync(path.resolve(__dirname, file)).toString().trim();
        return str
    }
}).filter(item => item !== undefined);

/**
 * 配置根查询和根变异
 */
const SchemaDefinition = `
    schema {
        query: Query
        mutation: Mutation
    }
`;

export default [SchemaDefinition, ...types]