import { request } from 'common_actions/common';
export const INIT_MEMBER_INFO = 'INIT_MEMBER_INFO'

/**
 * 初始化会员信息
 * 
 * @export
 * @param {{}} memberInfo 会员信息
 * @returns action
 */
export function initMemberInfo (memberInfo) {
    return {
        type: INIT_MEMBER_INFO,
        memberInfo
    }
}


// 获取会员信息
export function fetchMemberInfo() {
    return async (dispatch, getStore) => {
		const memberInfo = await request({
			url: '/api/wechat/member/memberInfo',
			method: 'POST'
        });

		dispatch(initMemberInfo(memberInfo))
    };
}