import { useEffect, useState, useMemo } from "react";
import { request } from "common_actions/common";
import debounce from "lodash.debounce";

const ABORT_ERROR_NAME = "AbortError";

/**
 * 请求hook，请求成功后会自动修改输出值，不适用于同步
 * @param {string} url 请求地址
 * @param {object} config 请求项
 * @param {boolean} initFetch 是否构建hook后直接请求
 */
const useApi = (url, config = {}, initFetch = true) => {
    const [state, setState] = useState({
        response: undefined,
        error: undefined,
        isLoading: true
    });

    /**
     * TODO...
     * 对config进行hash，作为useEffect的依赖
     */
    // const configHash = hash(config);
    // const controller = new AbortController();
    // const signal = controller.signal;

    async function fetch() {
        return request
            .post({
                url,
                ...config,
                // signal
            })
            .then(res => {
                setState({
                    ...state,
                    response: res
                });
                if(res.state.code === 0) return res;
            })
            .catch(error => {
                if (error.name === ABORT_ERROR_NAME) {
                    console.log("Request canceled by cleanup: ", error.message);
                } else {
                    setState({ error, response: undefined, isLoading: false });
                }
            });
    }
    useEffect(() => {
        setState({
            ...state,
            isLoading: true
        });
        if (initFetch) {
            fetch();
        }
        return () => {
            // controller.abort();
        };
    }, [url]);

    const { response, error, isLoading } = state;
    const data = response ? response.data : undefined;
    return {
        data,
        response,
        error,
        isLoading,
        fetch
    };
};

/**
 * 参数hook，配合useApi使用
 * 作为UseApi的参数时，参数变更时，能触发useApi请求
 * @param {object} initialParams 初始参数
 * @param {number} debounceWait 防抖间隔
 */
const useParams = (initialParams = {}, debounceWait = undefined) => {
    const [params, setParams] = useState(initialParams);
    const [isStale, setIsStale] = useState(false); // 参数是否陈旧

    // 更新参数setter
    function updateParams(updatedParams) {
        const newParams = { ...params, ...updatedParams };
        setParams(newParams);
    }

    // 包裹一层防抖
    const debouncedSetParams = useMemo(
        () =>
            debounce(newParams => {
                setIsStale(false); // 每次set参数，将陈旧标识
                setParams(newParams);
            }, debounceWait),
        []
    );

    return {
        params,
        isStale,
        setParams,
        debouncedSetParams: newParams => {
            setIsStale(true);
            debouncedSetParams(newParams);
        },
        updateParams,
        debouncedUpdateParams: updatedParams => {
            setIsStale(true);
            debouncedSetParams({ ...params, ...updatedParams });
        }
    };
};

export { useApi, useParams };
