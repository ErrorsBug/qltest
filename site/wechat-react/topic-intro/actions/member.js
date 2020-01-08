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