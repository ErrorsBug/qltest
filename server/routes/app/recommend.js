import path from 'path';
import async from 'async';
import lo from 'lodash';

const { parallelFetchProxy } = require('../../components/proxy/proxy');
const resProcessor = require('../../components/res-processor/res-processor');
const htmlProcessor = require('../../components/html-processor/html-processor');
const conf = require('../../conf');
const clientParams = require('../../middleware/client-params/client-params');
const appAuth = require('../../middleware/auth/1.0.0/app-auth');

var recommendApi = require('../../api/app/recommend');

async function chargeRecommend(req, res, next) {
    let filePath = path.resolve(__dirname, '../../../public/app/page/charge-recommend/charge-recommend.html'),
        options = {
            filePath: filePath,
            fillVars: {
                COURSEDATA: {},
            },
            renderData: {

            }
        };

    let params = {
        page: {
            page: 1,
            size: 6
        }
    };

    try {
        var result = await recommendApi.getChargeRecommendCourseList(params, req);

        // store.dispatch(chargeInitCourseList(lo.get(result, 'courseList.data.dataList', [])));

        options.fillVars.COURSEDATA = {
            coursesLength: lo.get(result, 'courseList.data.dataList.length', 0),
            page: params.page,
        };
        // options.fillVars.NOWTIME = new Date().getTime();
        options.renderData.courses = lo.get(result, 'courseList.data.dataList', []);
        htmlProcessor(req, res, next, options);
    } catch(err) {
        console.error(err);
        resProcessor.error500(req, res, err);
    }
}

module.exports = [
    ['GET', '/app/page/charge-recommend', clientParams(), appAuth(), chargeRecommend],
];
