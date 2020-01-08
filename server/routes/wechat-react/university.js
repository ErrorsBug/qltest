import lo from 'lodash';
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

const StaticHtml = require('../../components/static-html').default;
const staticHtml = StaticHtml.getInstance();
const envi = require('../../components/envi/envi');


import { getUniversityHomeFirstData } from "../../../site/wechat-react/female-university/actions/home";
import { getUniversityFlagCardData } from "../../../site/wechat-react/female-university/actions/flag";
import { getUniversityStudentInfoData } from "../../../site/wechat-react/female-university/actions/home";
import { getUniversityCommunityIdeaData,
         getUniversityCommunityTopicData,getUniversityCommunityCenterData } from "../../../site/wechat-react/female-university/actions/community";
import { updateSysTime } from "../../../site/wechat-react/female-university/actions/common";
import { getExperienceInviteData } from "../../../site/wechat-react/female-university/actions/experience";
import { fillParams } from '../../../site/wechat-react/components/url-utils';


// 判断页面未购买访问权限
export const handleBuySratus = async (req, res, store) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId',null),
    }
    const isTab = req.query.isTab || ''
    const query = req.query;
    let par = []
    for (var key1 in query) {
        if (query[key1] !== undefined) {
            par.push(key1 + '=' + query[key1]);
        }
    }
    let { data ,state } = await proxy.apiProxyPromise(conf.apiPrefix.shortKnowledgeApi + '/woman/university/getStudentInfo', params, conf.baseApi.secret, req);
    const curTime = new Date().getTime();
    const flag = !!data.studentInfo && !!data.studentInfo.expireTime && curTime >= data.studentInfo.expireTime
    if((!data || !data.studentInfo || (data.studentInfo && !data.studentInfo.userId) || flag) || !state || (state &&state.code != 0)){
        if(isTab=='Y'){
            res.redirect(`/wechat/page/university/community-center${ !!par.length ? '?' + par.join('&') : '' }`);
            return false;
        }
        res.redirect(`/wechat/page/join-university${ !!par.length ? '?' + par.join('&') : '' }`);
        return false;
    }
    return store;
}

// 已购买时访问页面权限
export const handlePurchased = async (req, res, store) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId',null),
    }
    let { data } = await proxy.apiProxyPromise(conf.apiPrefix.shortKnowledgeApi + '/woman/university/getStudentInfo', params, conf.baseApi.secret, req);
    const curTime = new Date().getTime();
    if(data && data.studentInfo && !!data.studentInfo.expireTime && curTime < data.studentInfo.expireTime){
        res.redirect('/wechat/page/university/home');
        return false;
    }
    return store;
}

// 访问个人档案进行判断
export const handleFileLimit = async (req, res, store) => {
    const studentId = req.query.studentId
    let params = {
        userId: studentId || lo.get(req, 'rSession.user.userId',null),
    }
    let { data } = await proxy.apiProxyPromise(conf.apiPrefix.shortKnowledgeApi + '/woman/university/getStudentInfo', params, conf.baseApi.secret, req);
    if( !!studentId && !data.studentInfo ){
        res.redirect('/wechat/page/university/my-file');
        return false;
    }
    if(!data.studentInfo){
        res.redirect('/wechat/page/join-university');
        return false;
    }
    return store;
}

// 判断页面flag未生效
export const handleFlagSratus = async (req, res, store) => {
    let params = {
        flagUserId: lo.get(req, 'rSession.user.userId',null),
    }
    let { data ,state } = await proxy.apiProxyPromise(conf.apiPrefix.shortKnowledgeApi + '/woman/universityflag/flagGet', params, conf.baseApi.secret, req);
    if((!data||!data.status) || !state || (state &&state.code != 0)){ 
        res.redirect('/wechat/page/flag-list');
        return false;
    }
    if(data.status=='join'){
        res.redirect('/wechat/page/university/flag-wait');
        return false;
    } 
    return store;
}
// 判断页面flag生效
export const handleFlagWaitSratus = async (req, res, store) => {
    let params = {
        flagUserId: lo.get(req, 'rSession.user.userId',null),
    }
    let { data ,state } = await proxy.apiProxyPromise(conf.apiPrefix.shortKnowledgeApi + '/woman/universityflag/flagGet', params, conf.baseApi.secret, req);
    if((!data||!data.status) || !state || (state &&state.code != 0)){
        res.redirect('/wechat/page/flag-list');
        return false;
    }
    if(data.status!='join' || !state || (state &&state.code != 0)){
        res.redirect('/wechat/page/flag-home');
        return false;
    }
    return store;
}


//打卡数据加载
export const handleCardData = async (req, res, store) => {
    const cardId = req.query.cardId
    const state = store.getState();
    let params = { 
        userId: lo.get(req, 'rSession.user.userId',null),
        cardId
    }
    
    
    const { flagCardObj } = await proxy.parallelPromise([
        ['flagCardObj', conf.apiPrefix.shortKnowledgeApi + '/woman/universityflag/getFlagCard', params, conf.baseApi.secret], 
    ], req);  
    if(!flagCardObj||!flagCardObj?.data|| !flagCardObj?.data?.flagCard){
        res.redirect(`/wechat/page/university/home`);
        return false;
    }
    store.dispatch(getUniversityFlagCardData({
        flagCard: flagCardObj?.data?.flagCard  
    }))
    return store;
}



//大学首页首屏加载
export const handleHomeData = async (req, res, store) => {
    const state = store.getState();
    let params = {
        tagId : 'index',
        flagUserId: lo.get(req, 'rSession.user.userId',null),
    }
    
    // 将该页面标记为静态化页面处理
    req.isStaticHtml = true;
    // 注入静态化页面的前缀
    req.staticHtmlPrefix = `university-home`;
    // 注入静态化页面的标识id
    req.staticHtmlId = params.tagId;
    // 注入静态化页面的过期时间5分钟
    req.staticHtmlExpires = 5 * 60;


    // 获取本次请求的静态化页面缓存
    const htmlText = await new Promise(function(resolve, reject){
        staticHtml.getHtmlCache(req.staticHtmlPrefix, req.staticHtmlId, (err, htmlText) => {
            if (err) {
                reject(err)
            } else {
                resolve(htmlText)
            }
        });
    });
    
    if(htmlText){
        res.status(200).send(htmlText);
        return null;
    }

    const { allObj , liveObj, campObj, newObj, universityObj, academyList, rankRes, rankData, listTopicData, iconObj } = await proxy.parallelPromise([
        ['allObj', conf.baseApi.university.listChildren, {nodeCode:"QL_NZDX_SY"}, conf.baseApi.secret],
        ['liveObj', conf.baseApi.university.listChildren, {nodeCode:"QL_NZDX_SY_ZB"}, conf.baseApi.secret],
        ['campObj', conf.baseApi.university.getMenuNode, {nodeCode:"QL_NZDX_SY_XXY"}, conf.baseApi.secret],
        ['newObj', conf.baseApi.university.getWithChildren, { nodeCode:"QL_NZDX_SY_HK", page:{ size:5, page: 1 } }, conf.baseApi.secret],
        ['universityObj', conf.baseApi.university.getMenuNode, {nodeCode:"QL_NZDX_SY"}, conf.baseApi.secret],
        ['academyList', conf.baseApi.university.listChildren, {nodeCode:"QL_NZDX_SY_XY"}, conf.baseApi.secret],
        ['rankRes', conf.baseApi.university.listChildren, {nodeCode:"QL_NZDX_SY_RANK"}, conf.baseApi.secret],
        ['rankData', conf.baseApi.university.batchListChildren, {nodeCodeList: ["QL_NZDX_SY_RANK_COURSE_BG", 'QL_NZDX_SY_RANK_BOOK_BG'], page:{ size: 4, page: 1 }}, conf.baseApi.secret],
        ['listTopicData', conf.shortKnowledgeApi.getListTopic, { source:'ufw',page:{ size: 3, page: 1 }}, conf.shortKnowledgeApi.secret],
        ['iconObj', conf.baseApi.university.listChildren, {nodeCode:"QL_NZDX_SY_ICON"}, conf.baseApi.secret],
    ], req);
    store.dispatch(getUniversityHomeFirstData({
        allObj: allObj?.data?.dataList, 
        liveObj: liveObj?.data?.dataList, 
        campObj: campObj?.data?.menuNode, 
        newObj: newObj?.data?.menuNode, 
        universityObj: universityObj?.data?.menuNode, 
        academyList: academyList?.data?.dataList,
        rankList: rankRes?.data?.dataList,
        rankObj: rankData?.data,
        listTopicData: listTopicData?.data?.dataList,
        iconList: iconObj?.data?.dataList || [],
    }))
    return store;
}


// 处理珊瑚分销兑换码
export const handleBuyFromCoral = async (req, res, store) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId',null),
        code:req.query.buyCode 
    }
     
    let { data ,state } = await proxy.apiProxyPromise(conf.baseApi.university.codeIn, params, conf.baseApi.secret, req);
     
    
    if((!data || !data.status || data.status=='N' ) || !state || (state &&state.code != 0)){
        res.redirect(req.query.back_url?decodeURIComponent(req.query.back_url):`/wechat/page/join-university`);
        return false;
    }
    //status 报名成功  isFirstExchange 首次兑换
    if(data.status=='Y'){
        if(data.isFirstExchange=='Y'){
            res.redirect(`/wechat/page/join-university-success`); 
        }else{
            res.redirect(`/wechat/page/university/home`);
        }
        return false;
    }
    return store;
}



//大学用户数据加载
export const getStudentInfoData = async (req, res, store) => {
    const studentId = req.query.studentId
    const state = store.getState();
    let params = { 
        userId: lo.get(req, 'rSession.user.userId',null),
        studentId
    }
    
    const { studentInfoObj } = await proxy.parallelPromise([
        ['studentInfoObj', conf.apiPrefix.shortKnowledgeApi + '/woman/university/getStudentInfo', params, conf.baseApi.secret], 
    ], req);   
    store.dispatch(getUniversityStudentInfoData({
        studentInfo: studentInfoObj?.data?.studentInfo  
    }))
    return store;
}

//想法数据加载
export const getIdeaData = async (req, res, store) => {
    const ideaId = req.query.ideaId
    const state = store.getState();
    let params = { 
        userId: lo.get(req, 'rSession.user.userId',null),
        id:ideaId
    }
    
    const { communityIdeaObj } = await proxy.parallelPromise([
        ['communityIdeaObj', conf.apiPrefix.shortKnowledgeApi + '/community/getIdea', params, conf.baseApi.secret], 
    ], req);   
    store.dispatch(getUniversityCommunityIdeaData({
        communityIdea: communityIdeaObj?.data?.communityIdea  
    }))
    return store;
}

//话题数据加载
export const getCommunityTopicData = async (req, res, store) => {
    const topicId = req.query.topicId
    const state = store.getState();
    let params = { 
        userId: lo.get(req, 'rSession.user.userId',null),
        id:topicId
    }
    await proxy.apiProxyPromise(conf.apiPrefix.shortKnowledgeApi + '/community/updateTopicViewNum', { userId: lo.get(req, 'rSession.user.userId',null),topicId,sessionId: req.cookies.rsessionid||null}, conf.baseApi.secret, req);
    const { communityTopicObj } = await proxy.parallelPromise([
        ['communityTopicObj', conf.apiPrefix.shortKnowledgeApi + '/community/getTopic', params, conf.baseApi.secret],  
    ], req);   
    store.dispatch(getUniversityCommunityTopicData({
        topic: communityTopicObj?.data?.topic  
    }))
    return store;
}
//话题广场数据加载
export const getCommunityCenterData = async (req, res, store) => {
    const state = store.getState();
    
    let params = { 
        userId: lo.get(req, 'rSession.user.userId',null),
    }
    const {studentInfoObj, rmht ,listTopicData } = await proxy.parallelPromise([ 
        ['studentInfoObj', conf.apiPrefix.shortKnowledgeApi + '/woman/university/getStudentInfo', params, conf.baseApi.secret], 
        ['rmht', conf.baseApi.university.getMenuNode, {nodeCode:"QL_NZDX_SY_RMHT"}, conf.baseApi.secret],
        ['listTopicData',conf.shortKnowledgeApi.getListTopic, { source:'ufw',page:{ size: 3, page: 1 }}, conf.baseApi.secret],
    ], req);   
    store.dispatch(getUniversityCommunityCenterData({
        studentInfo:studentInfoObj?.data?.studentInfo,
        rmht: rmht?.data?.menuNode,  
        listTopicData: listTopicData?.data?.dataList,
    }))
    return store;
}

const buyUrls = ['/wechat/page/experience-camp-list', '/wechat/page/university-activity-url', '/wechat/page/university-experience-success']
const unBuyUlrs = ['/wechat/page/university-experience-camp', '/wechat/page/experience-bottom']

// 处理新体验营是否购买
export const handleExpCamp = async (req, res, store) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId',null),
    }
    const isTab = req.query.isTab || ''
    const shareKey = req.query.shareKey || ''
    const query = req.query;
    let par = []
    for (var key1 in query) {
        if (query[key1] !== undefined && key1 != 'channelId') {
            par.push(key1 + '=' + query[key1]);
            params[key1] = query[key1]
        }
    }
    const curUrl = req.url.split("?")[0];
    const {studentInfoObj,getIntentionCampObj, getDistributeConfigObj } = await proxy.parallelPromise([ 
        ['studentInfoObj', conf.apiPrefix.shortKnowledgeApi + '/woman/university/getStudentInfo', params, conf.baseApi.secret],
        ['getIntentionCampObj', conf.apiPrefix.shortKnowledgeApi + '/woman/university/getIntentionCamp', params , conf.baseApi.secret  ], 
        ['getDistributeConfigObj', conf.apiPrefix.shortKnowledgeApi + '/woman/university/getDistributeConfig', {...params,type:'INTENTION'} , conf.baseApi.secret  ], 
    ], req);  
    let { data ,state } = getIntentionCampObj
    const isApp = envi.isQlApp(req);
    if(!data || (!!data && !data.camp) || (!!data && !!data.camp && !Object.is(data.camp.status, 'Y') && !Object.is(data.camp.buyStatus, 'Y'))){
        res.redirect(`/wechat/page/join-university`);
        return false;
    }
    //判断是否购买其他体验营
    if((data.camp.campType=='financing'||!studentInfoObj?.data?.studentInfo?.userId)&&!Object.is(data.camp.buyStatus, 'Y')&&data.camp.belongId){
        params = {
            userId: lo.get(req, 'rSession.user.userId',null),
            belongId:data.camp.belongId
        }
        const {getCampBuyInfoByBelongId } = await proxy.parallelPromise([ 
            ['getCampBuyInfoByBelongId', conf.apiPrefix.shortKnowledgeApi + '/ufw/intention/getCampBuyInfoByBelongId', params , conf.baseApi.secret  ], 
        ], req);  
        if(getCampBuyInfoByBelongId?.data?.actCharge?.actId) {
            query.campId=getCampBuyInfoByBelongId?.data?.actCharge?.actId
            res.redirect(fillParams(query,'/wechat/page/university-experience-camp',[]));
            return false;
        }
    }
    if(!!data && !!data.camp && !Object.is(data.camp.buyStatus, 'Y') && buyUrls.includes(curUrl)) {
        res.redirect(`/wechat/page/university-experience-camp${ !!par.length ? '?' + par.join('&') : '' }`);
        return false;
    }
    if(!!data && !!data.camp && Object.is(data.camp.buyStatus, 'Y') && unBuyUlrs.includes(curUrl)) {
        //来源分销，并且开分销模式和入口跳转
        if(shareKey&&shareKey==lo.get(req, 'rSession.user.userId',null)
            &&Object.is(getDistributeConfigObj?.data?.config?.entranceStatus, 'Y')
            &&Object.is(getDistributeConfigObj?.data?.config?.distributionStatus, 'Y') 
            ) {
           return store;
        } 
        //体验营训练营类型跳转
        if(data.camp.courseType=="camp"&&data.camp.channelId && !isApp){
            res.redirect(`/wechat/page/channel-intro?channelId=${data.camp.channelId}&experienceId=${data.camp.id}&campType=${data.camp.campType}&channelType=camp`) 
            return false;
        }
       
        const courseId = isApp ? data.camp.channelId : data.camp.courseId
        res.redirect(`/wechat/page/experience-camp-list${ !!par.length ? '?' + par.join('&') : '' }&channelId=${ courseId }`);
        return false;
    }
    return store;
}

// 是否亲友卡是否绑定
export const handleFamilyCardBind = async (req, res, store) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId',null),
    }
    const cardId = req.query.cardId;
    if(!cardId){
        res.redirect(`/wechat/page/family-camp-list`);
        return false
    }
    let { data ,state } = await proxy.apiProxyPromise(conf.apiPrefix.shortKnowledgeApi + '/woman/university/card/userCardRefInfo', params , conf.baseApi.secret, req);
    if(!data || (!!data && !Object.is(data.status,'Y') && (data.cardInfo?.id !== cardId))){
        res.redirect(`/wechat/page/family-camp-list`);
        return false;
    }
    return store;
}

// 判断亲友卡是否是自己分享链接
export const handleShareFamilyCard = async (req, res, store) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId',null),
    }
    const cardId = req.query.cardId;
    let { data ,state } = await proxy.apiProxyPromise(conf.apiPrefix.shortKnowledgeApi + '/woman/university/card/info', params , conf.baseApi.secret, req);
    if(!!data && !!data.cardInfo && data.cardInfo.id == cardId){
        res.redirect(`/wechat/page/university/family-card`);
        return false;
    }
    return store;
}


//邀请有礼数据加载
export const handleInviteData = async (req, res, store) => {
    let params = { 
        userId: lo.get(req, 'rSession.user.userId',null),
        nodeCode: req.query.nodeCode
    }
    let { data ,state } = await proxy.apiProxyPromise(conf.baseApi.university.getWithChildren, params , conf.baseApi.secret, req);
    const nodeCodeList = await data?.menuNode?.children?.map((item) => item.nodeCode) 
    let results = await proxy.apiProxyPromise(conf.baseApi.university.batchListChildren, {nodeCodeList,page:{page:1,size:30}} , conf.baseApi.secret, req);
    
    store.dispatch(getExperienceInviteData({
        inviteNodeCodeData:data?.menuNode, 
        inviteNodeCodeObj:results?.data
    }))
    return store;
}

// 绑定第三方并跳转
export const handleBindAndJump = async (req, res, store) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId',null),
        kfAppId:req.query.kfAppId,
        kfOpenId:req.query.kfOpenId,
    } 
    let { data ,state } = await proxy.apiProxyPromise(conf.baseApi.userBindKaiFang, params , conf.baseApi.secret, req);
    res.redirect(req.query.target||'/wechat/page/university/home');
}

// 处理未购学习营访问相册和笔记本页面跳转
export const handleCampStatus = async (req, res, store) => {
    let params = {
        userId: lo.get(req, 'rSession.user.userId',null),
    }
    const shareUserId = req.query.shareUserId || ''
    if(!!shareUserId) {
        return store
    }
   
    let { data ,state } = await proxy.apiProxyPromise(conf.apiPrefix.shortKnowledgeApi + '/woman/university/getStudentInfo', params, conf.baseApi.secret, req);
    const curTime = new Date().getTime();
    const flag = !!data.studentInfo && !!data.studentInfo.expireTime && curTime >= data.studentInfo.expireTime
    if((!data || !data.studentInfo || (data.studentInfo && !data.studentInfo.userId) || flag) || !state || (state &&state.code != 0)){
        res.redirect(`/wechat/page/join-university`);
        return false;
    }
    return store;
}
