export interface IPromoteOrder{
    channelId:	string	// 系列课id
    channelName:	string	// 系列课名称
    channelHeadImg:	string	// 系列课头图
    purchaserName:	string	// 购买人名称
    purchaserUserId:	string	// 购买人id
    purchaserHeadImg:	string	// 购买人头像
    amount:	number	// 购买金额 单位: 元
    percent:	number	// 分成比例
    money:	number	// 我的收益
    createTime:	number	// 下单时间
}
