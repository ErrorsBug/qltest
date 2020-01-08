import lo from 'lodash';

import { initBackstage, initLiveList } from "../../../site/wechat-react/backstage/actions/live-back";

const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

/**
 * 直播间管理后台的进入逻辑判断
 * @param {*} req 
 * @param {*} res 
 * @param {*} store 
 */
export async function backstage(req, res, store){
    let userId= lo.get(req, 'rSession.user.userId')
    let liveId = req.query.liveId;
    const result = await proxy.parallelPromise([
        ['creater', conf.baseApi.findLiveEntity, {liveId, userId, type:'creater', page: {
            page: 1,
            size:99999,
        } }, conf.baseApi.secret],
        ['manager', conf.baseApi.findLiveEntity, {liveId, userId, type:'manager', page: {
            page: 1,
            size:99999,
        } }, conf.baseApi.secret],
    ], req);
    let creater = lo.get(result, 'creater.data.liveEntityPos');
    let manager = lo.get(result, 'manager.data.liveEntityPos');

    let liveList = [...creater, ...manager];
    // 判断是否有创建和管理的直播间
    if(liveList.length>0 && liveList[0]){
        if(liveId){
			let queryLive = liveList.filter((value)=>{
				if(liveId == value.id){
					return true;
				}
			});
            if(queryLive.length <= 0){ //有liveId,则判断该直播间是否有权限进入，没有权限则进入切换直播间页面
                res.redirect('/wechat/page/live-change');
                return false;
			}
			store.dispatch(initBackstage(queryLive[0]));
		}else{
			store.dispatch(initBackstage(liveList[0]));
		}
        
        return store;
    }else{
        //跳转创建直播间的页面
        res.redirect('/wechat/page/create-live?ch=create-live-logic');
        return false
    }
    
}

/**
 * 切换直播间页面的进入逻辑判断
 * @param {*} req 
 * @param {*} res 
 * @param {*} store 
 */
export async function backstageChangePage(req, res, store){
    let userId= lo.get(req, 'rSession.user.userId')
    let liveId = req.query.liveId||'';
    const result = await proxy.parallelPromise([
        ['creater', conf.baseApi.findLiveEntity, {liveId, userId, type:'creater', page: {
            page: 1,
            size:99999,
        } }, conf.baseApi.secret],
        ['manager', conf.baseApi.findLiveEntity, {liveId, userId, type:'manager', page: {
            page: 1,
            size:99999,
        } }, conf.baseApi.secret],
    ], req);
    let creater = lo.get(result, 'creater.data.liveEntityPos');
    let manager = lo.get(result, 'manager.data.liveEntityPos');

    let liveList = [...creater, ...manager];
    if(liveList.length>0 && liveList[0]){
        store.dispatch(initLiveList(creater,manager));
        return store;
    }else{
        let ch = 'create-live-logic';//记录来源
        if(req.query.ch){
            ch = req.query.ch;
        }
        //跳转创建直播间的页面
        res.redirect('/wechat/page/create-live?ch=' + ch);
        return false
    }
    
}


/**
 * 直播间管理后台的进入逻辑判断
 * @param {*} req 
 * @param {*} res 
 * @param {*} store 
 */
export async function liveDistributePrower(req, res, store){
    let userId= lo.get(req, 'rSession.user.userId')
    let liveId = req.query.liveId;
    const powerInfo = await proxy.parallelPromise([
        ['power', conf.baseApi.user.power, { liveId, userId }, conf.baseApi.secret],
    ], req);
    const power = lo.get(powerInfo, 'power.data.powerEntity', {});

    // 不是管理员查看  重定向到切换直播间页面
    if (!power.allowMGLive) {
        res.redirect('/wechat/page/live-change');
        return false;
    }else{
        return store;
    }
    
}