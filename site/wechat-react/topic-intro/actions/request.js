import { api } from './common';

const request = async (params = {}) => {
    return new Promise(async (resolve, reject) => {
        try { 
            const res = await api({
                method: params.method || "POST",
                ...params
            }); 
            if(res.state && res.state.code == 0){
                resolve(res.data)
            } else {
                window.toast(res.state && res.state.msg);
            }
        } catch (error) {
            window.toast("网络请求异常~");
        }
    })
}

export default request;