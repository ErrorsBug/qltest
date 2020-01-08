/**
 * 查询redux状态树
 */

// 查询阿里云stsAuth信息
export function selectStsAuth (state) {
    return state.common.stsAuth;
}