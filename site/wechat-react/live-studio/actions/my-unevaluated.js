import { api } from './common';

export const INIT_MINE_LIVE_DATA = 'INIT_MINE_LIVE_DATA';
export const INIT_MINE_WALLET = 'INIT_MINE_WALLET';

export function getUnevaluatedList(params) {
	return async (dispatch, getStore) => {
		const result = await api({
			dispatch,
			getStore,
			method: 'POST',
			showLoading:false,
			url: '/api/wechat/studio/unevaluated',
			body: params
		});
		
		return result;
	};
}
