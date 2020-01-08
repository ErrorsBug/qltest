import { api } from './common'

export function getMyAnsweredList(params){
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading: false,
			url: '/api/wechat/studio/my-homework',
			body: params
		});

		return result;
	};
}
