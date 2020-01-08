import fetch from 'isomorphic-fetch';
import { encode, stringify } from 'querystring';

export function api({
    url,
    params = {},
    method = 'GET',
}, mockData = null,) {
    return new Promise((resolve, reject) => {

        url = method === 'GET' ? `${url}?${encode(params)}` : url;

        if (mockData) {
            setTimeout(() => resolve(mockData));
            return;
        }


        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            credentials: 'include',
            body: method === 'POST' ? JSON.stringify(params) : null,
        })
            .then((res) => res.json())
            .then((json) => {
                // console.log(json);

                if (!json.state || !json.state.code && json.state.code != 0) {
                    console.error('错误的返回格式');
                }

                if (json.state && json.state.code !=0 ){
                    window.toast(json.state.msg)
                }

                switch (json.state.code) {
                    case 0:
                        resolve(json)
                        break;

                    case 10001:
                        resolve(json)
                        break;

                    case 20005:
                        // 未登录
                        resolve(json)
                        break;

                    case 50004:
                        // 该CODE已被使用
                        resolve(json)
                        break;

                    case 50005:
                        // 已经是管理员
                        resolve(json)
                        break;

                    default:
                        resolve(json)
                        break;
                }
            })
            .catch((err) => {
                console.error(err);
            })
    });

}

export function mockableApiFactory({url = '', method = 'GET', mockFunc = normalResMock }) {
    return function({ params = {}, mock = false}) {
        if (mock) { 
            const mockData = mockFunc();
            return api({}, mockData);
        }
        return api({ url, params, method});
    }
}

function normalResMock() {
    return { state:{code:0, msg:"操作成功"}, data: "mock"}
}