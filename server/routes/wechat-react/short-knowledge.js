const lo = require('lodash');
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');
const envi = require('../../components/envi/envi');
import { initData } from '../../../site/wechat-react/short-knowledge/actions/short-knowledge';
import { updateUserPower } from "../../../site/wechat-react/short-knowledge/actions/common";

export async function getShortknowledgeData (req, res, store) {
	try {
		let params = {
            userId: lo.get(req, 'rSession.user.userId',''),
            id: lo.get(req, 'query.knowledgeId'),
            liveId: lo.get(req, 'query.liveId')
        };
        if(params.liveId){
            const powerData = await proxy.parallelPromise([[conf.baseApi.user.power, params, conf.baseApi.secret]], req)
            const power = lo.get(powerData[0], 'data.powerEntity', {});
            if(!power.allowMGLive){
                res.redirect(`/wechat/page/short-knowledge/create`)
                return false
            }
        }
        let tasks = []
        // 编辑状态
        if(params.id){
            tasks.push(['getKnowledgeById', conf.shortKnowledgeApi.getKnowledgeById, params, conf.shortKnowledgeApi.secret])
            const result = await proxy.parallelPromise(tasks, req);
            const data = lo.get(result, 'getKnowledgeById.data.dto', {})
            if(data.type === 'ppt'){
                res.redirect(`/wechat/page/short-knowledge/ppt-edit?liveId=${lo.get(req, 'query.liveId')}&knowledgeId=${lo.get(req, 'query.knowledgeId')}`)
                return false
            }
            store.dispatch(initData(data));
        }
		
        

	} catch(err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}

export async function pptEditPageHandler(req, res, store){
    try {
		let params = {
            userId: lo.get(req, 'rSession.user.userId',''),
            id: lo.get(req, 'query.knowledgeId'),
            liveId: lo.get(req, 'query.liveId')
        };
        if(params.liveId){
            const powerData = await proxy.parallelPromise([[conf.baseApi.user.power, params, conf.baseApi.secret]], req)
            const power = lo.get(powerData[0], 'data.powerEntity', {});
            if(!power.allowMGLive){
                res.redirect(`/wechat/page/short-knowledge/create`)
                return false
            }
        }
        let tasks = []
        // 编辑状态
        if(params.id){
            tasks.push(['getKnowledgeById', conf.shortKnowledgeApi.getKnowledgeById, params, conf.shortKnowledgeApi.secret])
            const result = await proxy.parallelPromise(tasks, req);
            const data = lo.get(result, 'getKnowledgeById.data.dto', {})
            store.dispatch(initData(data));
        }
	} catch(err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}

// 已废弃，观望后再删。。。。。。。。。。。
export async function shortknowledgeRedict(req, res, next){
    try {
        let tasks = [];
        let type = 'main';
        // 短知识详情页在微信端使用其他域名访问，如果是其他端则使用主站域名
        if (envi.isWeixin(req)) {
            type = 'shortKnowledge';
        }
        tasks.push(['shortDomainUrl', conf.toSourceApi.getDomainUrl, {type}, conf.toSourceApi.secret])
        const result = await proxy.parallelPromise(tasks, req);
        let shortDomainUrl = lo.get(result, "shortDomainUrl.data.domainUrl", "");
        
        const urlTest = shortDomainUrl.replace(/(\w*\:\/\/)/,'').replace(/(\/)$/,'');
        if(lo.get(req,"hostname") !== urlTest ){
            res.redirect(`${shortDomainUrl.replace(/(\/)$/,'')}${lo.get(req,"url")}`);
            return false;
        }
	} catch(err) {
		console.error(err);
		res.render('500');
		return false;
	}
    next();
	return next;
    
}

export async function initShortknowledgeData (req, res, store) {
	try {
		let params = {
            userId: lo.get(req, 'rSession.user.userId',''),
            id: lo.get(req, 'query.knowledgeId'),
            liveId: lo.get(req, 'query.liveId')
        };

        const powerData = await proxy.parallelPromise([[conf.baseApi.user.power, params, conf.baseApi.secret]], req)
        const power = lo.get(powerData[0], 'data.powerEntity', {});
        if(power.allowMGLive){
            params.bOrC = 'B';
        }else{
            params.bOrC = 'C';
        }
        
        let tasks = []
        if(params.id){
            tasks.push(['getKnowledgeById', conf.shortKnowledgeApi.getKnowledgeById, params, conf.shortKnowledgeApi.secret])
            const result = await proxy.parallelPromise(tasks, req);
            const data = lo.get(result, 'getKnowledgeById.data.dto', {})
            
            store.dispatch(initData(data));
            store.dispatch(updateUserPower(power));
        }
    }catch(err) {
		console.error(err);
		res.render('500');
		return false;
    }
    
    return store;
    
}