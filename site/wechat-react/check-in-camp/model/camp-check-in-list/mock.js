import Mock from 'mockjs';


const Random = Mock.Random;
Random.extend({
    YN: function(date) {
        var data = ['Y', 'N']
        return this.pick(data)
    },
    audio: function() {
        return "https://media.qianliaowang.com/qlLive/audio/OWOOZVDV-EEQ8-8YPX-1516267938974-MAU13NF3XDAZ.mp3"
    }
});

export function mockCheckInList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'affairList|10': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id':'@id',
            // Long	打卡动态id
            'affairId|+1': 1,
            // string	创建人用户id
            'createBy|+1000000': '@id',
            // 	String	训练营id
            'campId|+3': '@id',
            // 	String	头像
            'headImage|1': "https://img.qlchat.com/qlLive/channelLogo/QLSXASQ1-P2IB-83KW-1504789467942-1FZODSZ8IZYB.jpg@750w_1e_1c_2o",
            // 	String	昵称
            'nickName': '@name',
            // 	String	当前登录的用户是否对此条动态点赞 Y /N
            'isThumbUp': '@YN',
            // 	Long	打卡时间
            'createTimeStamp|+100000': Date.now(),
            // 	String	打卡文本内容
            'content': '按时打卡房间爱死了；地方就是看到积分按时打卡房间爱死了；地方就是看到积分按时打卡房间爱死了；地方就是看到积分按时打卡房间爱死了；地方就是看到积分按时打卡房间爱死了；地方就是看到积分按时打卡房间爱死了；地方就是看到积分按时打卡房间爱死了；地方就是看到积分按时打卡房间爱死了；地方就是看到积分按时打卡房间爱死了；地方就是看到积分',
            // 	List<String>	图片url
            'photoUrls|1-9': ['https://img.qlchat.com/qlLive/topicHeaderPic/thp-7.jpg'],
            // 	String	音频url
            'audioUrl': '@audio',
            // String	音频时长
            'audioSecond': 54,
            // 	int	打卡天数
            'affairCount|0-100': 1,
            // int	点赞人数
            'thumbUpCount|0-100': 1,
            // 	List<thumbUpDto>	所有点赞的人,最多返回500条,超过显示…
            'thumbUpList|30': [{
                'userName': '@name',
            }],
            // 	List<commentDto>	回复列表,分页处理,第一次返回前3条
            'commentList|5':[{
                // long	评论用户id， 用于判断当前评论是否自己评论，能否删除判断
                'commentUserId': '@id',
                // long	评论id
                'commentId|+1': 1,
                // string	当前评论的用户名称
                'commentUserName': '@cname',
                // string	回复谁的用户名称
                'parentUserName': '@cname',
                // string  评论内容
                'content': '@cparagraph'
            }],
    
        }]
    })
    return { state: {code:0, msg: "操作成功"}, data,};
}


export function mockCommentList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'commentList|15':[{
            // long	评论用户id， 用于判断当前评论是否自己评论，能否删除判断
            'commentUserId': '@id',
            // long	评论id
            'commentId': '@id',
            // string	当前评论的用户名称
            'commentUserName': '@name',
            // string	回复谁的用户名称
            'parentUserName': '@name',
        }],
    })
    return { state: {code:0, msg: "操作成功"}, data,};
}

export function mockComment() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'comment':{
            // long	评论用户id， 用于判断当前评论是否自己评论，能否删除判断
            'commentUserId': '@id',
            // long	评论id
            'commentId': Date.now(),
            // string	当前评论的用户名称
            'commentUserName': '@name',
            // string	回复谁的用户名称
            'parentUserName': '@name',
        },
    })
    return { state: {code:0, msg: "操作成功"}, data:data.comment};
}

export function mockRes() {
    return { state: {code:0, msg: "操作成功"}, data:null}
}


