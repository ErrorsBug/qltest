
import { api } from './common';

/**
 * 生成做请求的action
 *
 * @export
 * @param {string} url 请求路径
 * @returns
 */
export function createFetchAction(url, method) {
    return (data = {}) => {
        return async (dispatch, getStore) => {

            const result = await api({
                dispatch,
                getStore,
                showLoading: false,
                method,
                body: { ...data },
                url,
            });

            return result
        }
    }
}




