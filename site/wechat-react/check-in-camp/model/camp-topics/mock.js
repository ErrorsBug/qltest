import Mock from 'mockjs';

const Random = Mock.Random;
Random.extend({
    YN: function(date) {
        var data = ['Y', 'N']
        return this.pick(data)
    }
});

export function mockCampTopicList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'campTopicList|30':[{
            // 课程名称
            'topicName': '@name',
            // long	评论id
            'headImage': '@image',
            // string	当前评论的用户名称
            'startTimeStamp': Date.now() - 100000,
            // string	回复谁的用户名称
            'topicId': '@id',
            // int	学习次数
            'browsNum|0-100': 1,
            // String	话题类型 小图文=graphic; 讲座=normal; PPT=ppt; 音频图文=audioGraphic; videoGraphic 视频图文
            'style|+1': ['graphic','normal','ppt','audioGraphic', 'videoGraphic'],
            // String	话题状态（plan=预开始，beginning=开始中，ended=已结束，delete=删除）
            'status|+1': ['plan', 'beginning', 'ended'],
            // String	话题隐藏状态，Y为显示，N为不显示
            'displayStatus': '@YN',
        }],
    })
    return { state: {code:0, msg: "操作成功"}, data};
}

export function mockTodayTopicList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'topicList|5':[{
            // 课程名称
            'topicName': '@name',
            // long	评论id
            'backgroudUrl': '@image',
            // string	当前评论的用户名称
            'startTimeStamp': Date.now() - 100000,
            // string	回复谁的用户名称
            'topicId': '@id',
            // String	话题类型 小图文=graphic; 讲座=normal; PPT=ppt; 音频图文=audioGraphic; videoGraphic 视频图文
            'style|+1': ['graphic','normal','ppt','audioGraphic', 'videoGraphic'],
        }],
    })
    return { state: {code:0, msg: "操作成功"}, data};
}

export function mockRes() {
    return { state: {code:0, msg: "操作成功"}, data:null}
}


