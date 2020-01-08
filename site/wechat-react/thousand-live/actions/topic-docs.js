import { api } from './common';



export function getDocList(topicId, page) {
    return async (dispatch, getStore) => {
        return api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/doc/getTopicDocs',
			body: {
				topicId,
                page
			}
		})
    };
}


export function getDocAuthor(data) {
    return async (dispatch, getStore) => {
        return api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/doc/auth',
			body: data
		})
    };
}


export function deleteDocument(docId) {
    return async (dispatch, getStore) => {
        return api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/doc/delete',
			body: {
				docId
			}
		})
    };
}


export function modifyDocPrice(data) {
    return async (dispatch, getStore) => {
        return api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: true,
			url: '/api/wechat/doc/modify',
			body: data
		})
    };
}