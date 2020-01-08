import Mock from 'mockjs';

export function mockCampUserList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'userList|30':[{
            // string	用户头像
            'headImgUrl': '@image',
            // string	用户ID
            'id': '@id',
            // 	Long	报名时间戳
            'createTimeStamp': Date.now() - 100000,
            // 	string	Y已拉黑，N未拉黑
            'blackListStatus|+1': ['Y', 'N'],
            // string	Y有效,N无效,D已踢出
            'payStatus|+1': ['Y', 'N', 'D'],
            // int	已打卡天数
            'affairDays|99-999':1,
        }],
    })
    return { state: {code:0, msg: "操作成功"}, data};
}


export function mockCampTopNList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'topNList|10':[{
            // string	用户头像
            'headImage': '@image',
            // string	用户ID
            'nickName': '@name',
            // 打卡次数
            'affairCount|99-999':1,
            // 打卡次数
            'affairRank|99-999':1,
        }],
    })
    return { state: {code:0, msg: "操作成功"}, data};
}

export function mockUserHeadList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'headImageList|10':['@image'],
    })
    return { state: {code:0, msg: "操作成功"}, data};
}

export function mockCheckInHeadList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'images|10':['@image'],
    })
    return { state: {code:0, msg: "操作成功"}, data};
}

export function mockRes() {
    return { state: {code:0, msg: "操作成功"}, data:null}
}


