import Mock from 'mockjs';

const Random = Mock.Random;
Random.extend({
    YN: function(date) {
        var data = ['Y', 'N']
        return this.pick(data)
    }
});

export function mockTopUserInfo() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'userInfo':{
            'nickName': '@name',
            // 训练营Id
            'userId': '@id',
            // 训练营头图
            'headImage': '@image',
            // 打卡次数
            'affairCount': 99,
            // 打卡名次
            'affairRank': 3,
        },
    })

    return { 
        state: {code:0, msg: "操作成功"}, 
        data: data,
    }
}

export function mockCampUserInfo() {
    const data = Mock.mock({
        // 是否购买
        'payStatus': 'Y',
        // 分享奖金金额
        'shareBonus': 99,
        // 奖金池是否已经瓜分
        'status': 'N',
        // 是否完成打卡训练营任务
        'completeStatus': 'N',
        // 今日是否打卡
        'affairStatus': 'N',
        // 是否已经关注直播间
        'isFollowLive': 'Y'
    })

    return { 
        state: {code:0, msg: "操作成功"}, 
        data:{
            campUserInfo:data,
        },
    }
}