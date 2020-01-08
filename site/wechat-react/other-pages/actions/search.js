import { api } from './common';

export async function searchTopic(params) {
    const result = await api({
        showLoading: true,
        method: 'GET',
        url: '/api/wechat/search/topic',
        body: params,
    });

    return result.data;
}

export async function searchChannel(params) {
    const result = await api({
        method: 'GET',
        showLoading: true,
        url: '/api/wechat/search/channel',
        body: params,
    });

    return result.data;
}

export async function searchLive(params) {
    const result = await api({
        method: 'GET',
        showLoading: true,
        url: '/api/wechat/search/live',
        body: params,
    });

    return result.data;
}

export async function hotWords(params) {
    const result = await api({
        method: 'GET',
        showLoading: false,
        url: '/api/wechat/search/hot',
        body: params,
    });

    return result.data;
}

/**
 * 查询打卡 http://showdoc.corp.qlchat.com/web/#/1?page_id=2159
 * 
 */
export async function searchCamp (params) {
    const result = await api({
        method: 'POST',
        showLoading: false,
        url: '/api/wechat/search/camp',
        body: {
            keyword: params.keyword,
            page: {
                page: params.page,
                size: params.size
            },
            liveId: params.liveId
        }
    })

    if (result.state.code == 0) {
        return result.data
    }
}

// 获取大学搜索-为你推荐栏目数据
export const queryMuneNodeMsg = async (params) => {
    const res = await api({
        method:'POST',
        showLoading: false,
        url: '/api/wechat/transfer/h5/menu/node/listChildren',
        body: { ...params }
    }).then(res => {
        if(res.state && res.state.code !== 0){
            throw new Error(res.state.msg)
        }
        return res;
    }).catch(err => {
        window.toast(err.message);
    })
    return res && res.data  || {};
}