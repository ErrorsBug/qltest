export interface IActivity {
    /* 主键 */
    id: string
    /* 活动标题 */
    title: string
    /* 活动总分值 */
    score: number
    /* 活动关联的公众号 */
    appId: string
    /* 关注二维码图片链接 */
    qrcode: string
    /* Y：已上线 N：已下线 */
    status: string
}

export interface IUSer {
    /* 用户呢称 */
    name: string
    /* 用户ID */
    userId: string
    /* 用户头像 */
    headImgUrl: string
}

export interface IInitData {
    /** 参与活动的目标用户ID */
    uid: string
    /** 当前登录的用户ID */
    curUserId: string
    /** 活动id */
    actid: string
    /** 活动用户状态： N未完成活动，Y已完成活动，R已领取奖品 */
    status: 'N' | 'Y' | 'R'
    /** 活动用户已获得的活动分值 */
    score: number
    /** 活动信息对象 */
    activity: IActivity
    /** 活动用户对象 */
    user: IUSer
    /** 当前用户查看别人的活动时候，会返回， Y：已经助力过，N 还没助力过 */
    isHelped: 'Y' | 'N'
}
