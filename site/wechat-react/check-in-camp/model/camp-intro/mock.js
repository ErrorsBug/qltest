import Mock from 'mockjs';


export function mockCampIntroList() {
    const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'descriptions':{
            // 训练营简介
            'campDesc|10': [{
                'content|+1':['@ctitle','@cparagraph','@image','@cparagraph','@image','@cparagraph'],
                'id': '@id',
                'sort|+1': 1,
                'type|+1': ['text', 'text', 'image', 'text', 'image', 'text'],
            }],
        },
    })
    return { state: {code:0, msg: "操作成功"}, data};
}