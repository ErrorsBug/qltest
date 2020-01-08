import fetch from 'isomorphic-fetch';
import { autobind } from 'core-decorators'

export interface IGroupRequestData {
    url: string
    body?: any
}

@autobind
export class GroupRequest{
    
    private groupRequestHost = '/api/wechat/group-transfer'

    public request(params: IGroupRequestData[]) {
        return new Promise((resolve, reject) => {
            const obj = {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                credentials: 'include',
            }

            fetch(this.groupRequestHost, obj as any)
                .then(res => res.json())
                .then(json => {
                    if (json.state.code === 0) {
                        resolve(json)
                    }
                })
                .catch(err => {
                    console.error('组合接口请求失败:', err)
                })
        })
    }
}

export const groupRequest = new GroupRequest()
