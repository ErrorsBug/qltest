export interface IChannelTypeItem {
    id: number
    liveId: string	// 直播间id
    name: string	// 名称
    sortNum: number	// 序号
    channelNum: number	// 分类下系列课总数
    status: string	// 状态
    createTime: number	// 创建时间
    createBy: string	// 创建者
    updateTime: number	// 更新时间
    updateBy: string	// 更新人
    targetNum: number	// 移动后系列课分类位置
}

export interface IReprintChannelItem {
    id: string	// 系列课id
    name: string	// 系列课名称
    liveId: string	// 直播间id
    liveName: string	// 直播间名称
    headImage: string	// 系列课头图
    isCouponOpen: string	// 优惠码开关设置
    topicCount: number	// 系列课话题数量
    planCount: number	// 排课计划
    authNum: number	// 报名数
    displayStatus: 'Y' | 'N'	// 系列课是否显示，Y为显示，N为不显示
    learningNum: number	// 多少人正在学
    isRelay: string	// 是否属于转载系列课
    upOrDown: string	// 上下架
    tweetId: string	// 推文id
    tweetTitle: string	// 推文标题
    tweetUrl: string	// 推文url
    selfMediaPercent: number	// 直播间分成比例
    selfMediaProfit: number	// 分成收益
    price: number	// 最低价
    amount: number	// 原价
    discount: number	// 优惠价
    discountStatus: string	// 是否开启特价优惠, Y: 是 N: 否
    orderTotalNumber: number	// 订单数量
    orderTotalMoney: number	// 订单金额   
    chargeMonths: number 
}