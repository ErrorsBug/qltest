import lo from 'lodash';

var liveApi = require('../../api/wechat/active-value');
var resProcessor = require('../../components/res-processor/res-processor');
var timelineApi = require('../../api/wechat/timeline.js');

// import activeApi from '../../../site/wechat-react/other-pages/actions/active-value';
import {
    initAddressPermission,
    initMyAddressInfo,
    initAddressFontObject,
} from '../../../site/wechat-react/other-pages/actions/activity-common';

var activityApi = require('../../api/wechat/activity')

export async function activityAddressPage (req, res, store) {
    const userId = lo.get(req, 'rSession.user.userId');
    const activityCode = req.query.activityCode;

    const params = {
        userId,
        activityCode,
    }

    const result = await activityApi.addressInit(params, req)

    const addressWriteNum = lo.get(result, 'addressWriteNum.data.num', 1001) || 1001
    const isHaveWrite = lo.get(result, 'myAddress.data.isHaveWrite', 'N') || 'N'
    const myAddress = lo.get(result, 'myAddress.data.addressPo', {name: "", phone: "", address: ""}) || {name: "", phone: "", address: ""}
    const defaultFontObject = {
        topFont: "",
        bottomFont: "",
        blankFont: "",
        maxGiveNum: 0,
    }
    const configList = lo.get(result, 'configs.data.dataList', []) || []

    let fontObject = {}
    configList.forEach((item) => {
        switch (item.code) {
            case "topFont":
                fontObject.topFont = item.remark || ""
                break;
            case "bottomFont":
                fontObject.bottomFont = item.remark || ""
                break;
            case "blankFont":
                fontObject.blankFont = item.remark || ""
                break;
            case "maxGiveNum":
                fontObject.maxGiveNum = item.remark || "0"
                break;
            default:
                break;
        }
    })

    store.dispatch(initAddressFontObject(fontObject))

    if(addressWriteNum >= parseInt(fontObject.maxGiveNum) && isHaveWrite === 'N') {
        
    } else {
        store.dispatch(initAddressPermission("Y"))
        store.dispatch(initMyAddressInfo(myAddress))
    }

    return store;
}