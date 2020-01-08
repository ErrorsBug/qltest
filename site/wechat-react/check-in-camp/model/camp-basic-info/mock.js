import Mock from 'mockjs';


export function mockCampInfo() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'liveCamp':{
            'name': '@name',
            // 训练营Id
            'campId': '@id',
            // 训练营头图
            'headImage': '@image',
            // 报名人数
            'authNum|99-199': 1,
            // 报名价格
            'price|80-100': 1,
            // 契约金比例
            'bonusPercent|0-100': 1,
            // 实际收益
            'actualAmount|50-100': 1,
            // 开始时间 时间戳
            'startTimeStamp': Date.now() - 60 * 60 * 1000 * 24 * 10,
            // 结束时间 时间戳
            'endTimeStamp': Date.now() + 60 * 60 * 1000 * 24 * 20,
            // 总打卡次数
            'allAffairCount|0-1000': 1,
            // 所属直播间ID
            'liveId': '@id',
            // 奖池金池总额
            totalBonus: 12000,
            // 打卡完成人数
            completeNum: 99,
            // 实际打卡完成人数
            realCompleteNum: 98,
            // 是否开启契约金
            bonusStatus: 'N',
        },
    })
    return { state: {code:0, msg: "操作成功"}, data: data};
}

// export function mockCampUserInfo() {
//     const data = Mock.mock({
//         // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
//         'campUserInfo': {
//             // 是否购买
//             payStatus: 'Y',
//             // 分享奖金金额
//             shareBonus: 199,
//             // 是否完成打卡训练营任务
//             completeStatus: 'N',
//             // 今日是否打卡
//             affairStatus: 'N',
//         }
//     })
//     return { state: {code:0, msg: "操作成功"}, data: data};
// }

export function mockCampBonus() {
    return { state: {code:0, msg: "操作成功"}, data: { totalBonus: 12000, totalMoney: 88000,}}
}

export function mockRes() {
    return { state: {code:0, msg: "操作成功"}, data:null}
}


