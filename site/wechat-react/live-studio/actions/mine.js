import { api } from './common';

export const INIT_MINE_LIVE_DATA = 'INIT_MINE_LIVE_DATA';

// 初始化liveId
export function initMyLive (liveData) {
	return {
		type: INIT_MINE_LIVE_DATA,
		liveData
	}
};