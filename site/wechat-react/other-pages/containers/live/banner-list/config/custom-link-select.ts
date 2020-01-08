/**
 * 配置的课程类型列表
 * options      可设置该类型下的列表 (未设置则通过接口获取对应列表，须配置接口对应请求)
 * getUrl       该课程对应的链接地址 (businessId: string, liveId?: string) => {}
 * notRequest   不请求接口获取列表
 */
interface CourseTypeItem {
    label: string
    value: string
    notRequest?: boolean
    options?: OptionsItem[]
    getUrl?: (businessId: string, liveId: string) => string
}

interface OptionsItem {
    label: string
    value: string
}

/**
 * 类型定义 (统一定义，防止新增冲突)
 * page:        微页面
 * channel:     系列课
 * topic:       单课
 * training:    训练营
 * liveCamp:    打卡课
 * vip:         会员
 * url:         自定义链接
 * none:        无链接
 */

const CourseTypeConfig: CourseTypeItem[] = [
    {
        label: '微页面',
        value: 'page',
        options: [
            {
                label: '直播间主页',
                value: '1'
            },
            {
                label: '购买记录',
                value: '2'
            },
            {
                label: '学习记录',
                value: '3'
            }
        ],
        getUrl: (businessId: string, liveId: string) => {
            const bid = businessId && businessId.toString();
            switch (bid) {
                case '2':
                    return `${window.location.origin}/live/entity/myPurchaseRecord.htm?liveId=${liveId}`
                case '3':
                    return `${window.location.origin}/wechat/page/live-studio/my-joined?liveId=${liveId}`
                default:
                    return `${window.location.origin}/wechat/page/live/${liveId}`
            }
        }
    },
    {
        label: '系列课',
        value: 'channel',
        getUrl: (businessId: string) => `${window.location.origin}/live/channel/channelPage/${businessId}.htm`
    },
    {
        label: '单课',
        value: 'topic',
        getUrl: (businessId: string) => `${window.location.origin}/topic/details?topicId=${businessId}`
    },
    {
        label: '训练营',
        value: 'training',
        getUrl: (businessId: string) => `${window.location.origin}/wechat/page/training-intro?campId=${businessId}`
    },
    {
        label: '打卡课',
        value: 'liveCamp',
        getUrl: (businessId: string) => `${window.location.origin}/wechat/page/camp-detail?campId=${businessId}`
    },
    {
        label: '会员',
        value: 'vip',
        getUrl: (businessId: string, liveId: string) =>{console.log(businessId, liveId);return  businessId == liveId ? `${window.location.origin}/wechat/page/live-vip-details?liveId=${businessId}` : `${window.location.origin}/wechat/page/live-vip-details?liveId=${liveId}&id=${businessId}`}
    },
    {
        label: '自定义链接',
        value: 'link',
        notRequest: true
    },
    {
        label: '无链接',
        value: 'none',
        notRequest: true
    },
]

export {
    CourseTypeItem,
    CourseTypeConfig
}