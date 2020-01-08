import Mock from 'mockjs';

// https://media.qianliaowang.com/qlLive/audio/OWOOZVDV-EEQ8-8YPX-1516267938974-MAU13NF3XDAZ.mp3
const Random = Mock.Random;
Random.extend({
    audio: function() {
        return " https://media.qianliaowang.com/qlLive/audio/OWOOZVDV-EEQ8-8YPX-1516267938974-MAU13NF3XDAZ.mp3"
    }
});

export function mockGraphicInfo() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'baseInfo':{
            // 小图文id
            'id': '@id',
            // 直播间ID
            'liveId': '@id',
            // 直播间名称
            'liveName': '@name',
            // 小图文名称
            'topicName': '@name',
            // 创建时间戳
            'createTimeTamp': Date.now() - 60 * 60 * 1000 * 24 * 20,
        },
    })
    return { state: {code:0, msg: "操作成功"}, data: data};
}

export function mockGraphicContentList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'contentList|30':[{
            // 发言id
            'id': '@id',
            // 课程名称
            'content|+1': ['@paragraph', '@audio', '@image'],
            // long	评论id
            'type|+1': ['text', 'audio', 'image'],
            // string	当前评论的用户名称
            'second': 54,
        }],
    })
    return { state: {code:0, msg: "操作成功"}, data};
}

export function mockRes() {
    return { state: {code:0, msg: "操作成功"}, data:null}
}


