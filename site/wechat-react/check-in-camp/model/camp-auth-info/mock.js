import Mock from 'mockjs';


export function mockAuthRes() {
    return { 
        state: {code:0, msg: "操作成功"}, 
        data:{ 
            powerEntity:{
                allowMGLive: true
            }
        }
    }
}

export function mockPayStatusRes() {
    return { 
        state: {code:0, msg: "操作成功"}, 
        data:{ payStatus: "N"}
    }
}

