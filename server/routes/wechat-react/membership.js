/**
 *
 * @author Dylan
 * @date 2018/10/23
 */
const lo = require('lodash');
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

const memberApi = require('../../api/wechat/membership');

const {
	initMemberInfo,
	initSourceUserInfo,
	initMemberCenterData,
} = require('../../../site/wechat-react/membership/actions/member');

export async function memberCenterHandle(req, res, store) {

	try{
		const userId = lo.get(req, 'rSession.user.userId', '');
		const businessId = lo.get(req, 'query.businessId', '');
		const businessType = lo.get(req, 'query.businessType', '');
		const [ memberInfo, centerData ] = await Promise.all([
			memberApi.initMemberInfo({ userId }, req),
			memberApi.initMemberCenterData({ userId, businessId, businessType }, req),
		]);
		store.dispatch(initMemberInfo(memberInfo));
		store.dispatch(initMemberCenterData(centerData));
	}catch(err){
		console.error(err);
	}

	return store;
}

export async function memberMasterHandle(req, res, store) {

	try{
		const userId = lo.get(req, 'rSession.user.userId', '');
		const [ memberInfo, centerData ] = await Promise.all([
			memberApi.initMemberInfo({ userId }, req),
			memberApi.initMemberCenterData({ userId }, req),
		]);
		store.dispatch(initMemberInfo(memberInfo));
		store.dispatch(initMemberCenterData(centerData));
	}catch(err){
		console.error(err);
	}

	return store;
}

export async function memberFreeCourseHandle(req, res, store) {

	try{
		const userId = lo.get(req, 'rSession.user.userId', '');
		const [ memberInfo, centerData ] = await Promise.all([
			memberApi.initMemberInfo({ userId }, req),
			memberApi.initMemberCenterData({ userId }, req),
		]);
		store.dispatch(initMemberInfo(memberInfo));
		store.dispatch(initMemberCenterData(centerData));
	}catch(err){
		console.error(err);
	}

	return store;
}

export async function invitationHandle(req, res, store) {

	try{
		const userId = lo.get(req, 'rSession.user.userId', '');
		const [ memberInfo ] = await Promise.all([
			memberApi.initMemberInfo({ userId }, req)
		]);
		
	    if(memberInfo.level !== 2){
		    res.redirect('/wechat/page/membership-center');
		    return false;
		}

		store.dispatch(initMemberInfo(memberInfo))

	}catch(err){
		console.error(err);
	}

	return store;
}

export async function invitationCardHandle(req, res, store) {

	try{
		const userId = lo.get(req, 'rSession.user.userId', '');
		const memberId = req.params.memberId
		const cardId = req.query.id;
		if(memberId){
			const [ memberInfo, sourceUserInfo ] = await Promise.all([
				memberApi.initMemberInfo({ userId }, req),
				memberApi.initMemberInfo({ userId, id: memberId }, req)
			]);

			store.dispatch(initMemberInfo(memberInfo))
			store.dispatch(initSourceUserInfo({
				headImgUrl: sourceUserInfo.headImgUrl,
				name: sourceUserInfo.name,
				isMember: sourceUserInfo.isMember,
				giftNum: sourceUserInfo.giftNum,
				isSelf: memberInfo.id === sourceUserInfo.id ? "Y" : "N"
			}))
		}else if(cardId){
			const [ memberInfo, officialCardInfo ] = await Promise.all([
				memberApi.initMemberInfo({ userId }, req),
				memberApi.initOfficialCardInfo({ userId, cardId }, req)
			]);

			store.dispatch(initMemberInfo(memberInfo));
			store.dispatch(initSourceUserInfo({
				headImgUrl: officialCardInfo.inviteHead,
				name: officialCardInfo.inviteName,
				day: officialCardInfo.day,
				isMember: 'Y',
				giftNum: officialCardInfo.giftNum,
				isSelf: 'N'
			}))
		}else{
			res.render('500')
		}


	}catch(err){
		console.error(err);
	}

	return store;
}


export async function invitationReceiveHandle(req, res, store) {

	try{
		const userId = lo.get(req, 'rSession.user.userId', '');
		const [ memberInfo, centerData ] = await Promise.all([
			memberApi.initMemberInfo({ userId }, req),
			memberApi.initMemberCenterData({ userId }, req),
		]);
		
	    if(memberInfo.isMember !== 'Y'){
		    res.redirect('/wechat/page/membership-center');
		    return false;
		}

		store.dispatch(initMemberInfo(memberInfo));
		store.dispatch(initMemberCenterData(centerData));

	}catch(err){
		console.error(err);
	}

	return store;
}