export type YorN = 'Y' | 'N'

export interface IAudition {
    totalSeconds: number	// 语音时长（单位：秒）
    contentList: string[] // 10min语音播放链接
}

export interface ICourseItem {
    tweetId: number	// 三方推文id
    title: string	// 推文标题
    url: string	// 推文链接
    status: number	// 推文状态, 0 - 失效, 1 - 生效
    liveId: string	// 直播间id
    liveName: string	// 直播间名称
    businessId: string	// 系列课id
    businessName: string	// 系列课名称
    tagId: string	// 课程分类id
    tagName: string	// 课程分类名称
    weight: number	// 权重
    isRecommend: string	// 是否推荐
    liveSharePercent: number	// 源直播间分成比例
    selfMediaPercent: number	// 自媒体版直播间分成比例, 如果为0则表示运营人员还未设置分成比例
    isRelay: YorN	// 当前登录的自媒体版直播间是否转载过这个系列课 Y 或N
    isBelongMyLive: YorN	// 当前课程是否属于自己的直播间 Y 或N
    businessHeadImg: string	// 系列课头图
    selfMediaProfit: number	// 自媒体版直播间的分成收益, 根据分成比例计算出来, 如果收益为零则表示分成比例为零
    price: number	// 系列课最低价格
    amount: number	// 系列课原价
    discount: number	// 系列课优惠价
    discountStatus: YorN	// 是否是特价优惠 Y: 是 N: 否
    chargeMonths: number	// 购买月数, 默认为0
    audition: Object	// 试听10分钟语音对象
    relayChannelId: string
    learningNum?: number
    readProfit?: number
}

export interface ICourseTagItem {
    id: string
    name: string
}

