import React, {Fragment} from "react";
import { connect } from 'react-redux';
import { share } from 'components/wx-utils';
import Page from 'components/page';
import { request } from 'common_actions/common'
import { locationTo, formatDate } from "components/util";
import { get } from 'lodash';
import { scholarship } from "components/constant/scholarship";

class GrabPlatformCoupon extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            userInfo: {},
            status: '',// 领取状态
            fromUserName: '',// 分享者的用户名
            fromUserHeadImg: '', //分享者的头像
            discount: 0, // 优惠券折扣
            isNewUser: '', //当前用户是否新用户
            expiryDate: '', // 过期时间
            receiveList: [], //领取列表
            courseList: [], //精选课程列表
            qrcode: '', // 配置的导粉二维码
            bestLucky: -1, // 最佳手气的折扣
            defaultHeadImage: 'https://img.qlchat.com/qlLive/liveCommon/defalut-headImage.png',// 默认头像链接
            wechatEmptyHeadImage: 'https://thirdwx.qlogo.cn/mmopen/vi_32/8XPTZty0gTAUA6lGMpEt2Kicc2jgzRfYIASN3hWPqflJDBJUqFSNiaZhoW1a8M76nz4QASUCwgibjLmZEJFdMCXuw/132', // 微信空头像
        }
    }

    data = {
        liveId: '100000', // 导粉用到的直播间id
        channel: 'discountCoupon', // 导粉用到的channel
        // 领取之后显示的感叹句
        sentence: ['突如其来的好运，得瑟得瑟~','今日份小幸运～','大型笑哈哈现场！','非常实用的券，我建议经常发～','今天的手气很稳~',
                        '谢谢金主爸爸','妥妥的！！','这波操作很666','千聊，和知识做朋友！','这就很开心啦～','课程很赞，而我刚好有券','好课当然配手气券',
                        '还好手快，要不然就错过了','嘿，终于可以入手我喜欢的课程了']
    }

    componentDidMount(){
        this.getPacketCoupon()
    }

    // 领取红包内的平台通用券
    getPacketCoupon = async()=>{
        let packetId = this.props.location.query.packetId
        await request({
			url: '/api/wechat/transfer/couponApi/coupon/receivePacketCoupon',
			body: { packetId }
		}).then(res => {
            if(res.state.code) throw Error(res.state.msg)
            this._hasFetch = true
            // 获取精选课程列表
            this.getRecommendCourse(get(res, 'data.useRefId'))
            let status = get(res, 'data.status', '')
            // 领了之后再请求配置二维码
            if(status && status !== 'none'){
                this.initQrcode()
            }
            this.setState({
                status,
                fromUserName: get(res, 'data.fromUserName', ''),
                fromUserHeadImg: get(res, 'data.fromUserHeadImg', ''),
                discount: get(res, 'data.discount', ''),
                isNewUser: get(res, 'data.isNewUser', ''),
                expiryDate: get(res, 'data.expiryDate', ''),
            })
            // 领取完之后再拿领取列表
            this.getBindPacketUserList()
            this.initShare(get(res, 'data.fromUserName', ''))
		}).catch(err => {
			console.log(err);
		})
    }

    // 初始化分享
    initShare = (username) => {
        // 获取用户信息
        let packetId = this.props.location.query.packetId || ''
        share({
            title: scholarship.randomChoose(),
            desc: `${username}正在发千聊奖学金，快来抢~`,
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/share-schloarship.png',
            shareUrl: `${window.location.protocol}//${window.location.host}/wechat/page/grab-platform-coupon?packetId=${packetId}`,
            successFn: () => {
                window.toast("分享成功！");
                if(window._qla){
                    _qla('event', {
                        category: 'luckyshare',
                        action: 'success',
                    });
                }
            }
        });
    }

    // 获取领取红包的用户列表
    getBindPacketUserList = async()=>{
        let packetId = this.props.location.query.packetId
        await request({
			url: '/api/wechat/transfer/couponApi/coupon/getBindPacketUserList',
			body: { packetId }
        }).then(res=>{
            let receiveList = get(res, 'data.list' ,[])
            let couponNum = get(res, 'data.packetPo.couponNum' ,0) // 总数量
            let bindCouponNum = get(res, 'data.packetPo.bindCouponNum' ,0) // 领取数量
            // 全部已经领取，判断手气最佳
            if(bindCouponNum > 0 && couponNum > 0 && couponNum === bindCouponNum){
                this.whoIsBestLuck(receiveList)
            }
            this.setState({ receiveList })
        })
    }

    // 新人专属和最佳手气判断
    whoIsBestLuck = (list) => {
        if(list.length < 1){
            return
        }
        // 新用户
        let isHaveNewPerson = list.find(i => i.isNew == 'Y')
        let bestLucky = 0
        if(isHaveNewPerson){
            // 拿新用户的折扣作为最低折扣(新用户的折扣一定是最低的)
            bestLucky = isHaveNewPerson.discount
            list.forEach(i => {
                if(i.isNew == 'N' && i.discount <= bestLucky){
                    bestLucky = i.discount
                }
            })
        } else {
            bestLucky = list[0].discount
            list.forEach(i => {
                if(i.discount <= bestLucky){
                    bestLucky = i.discount
                }
            })
        }
        this.setState({bestLucky})
    }

    // 获取精选课程列表
    getRecommendCourse = async (useRefId) => {
        // 没有领用记录，直接返回
        if(!useRefId){
            return
        }
        await request({
			url: '/api/wechat/transfer/h5/discountCoupon/getRecommendCourse',
			body: { useRefId }
        }).then(res=>{
            let courseList = get(res, 'data.courseList' ,[])
            this.setState({courseList})
        })
    }

    // 获取未关注的配置二维码
    initQrcode = async () => {
        // 先查配置
        const config = await request({
			url: '/api/wechat/live/getOpsAppIdSwitchConf',
			body: { 
                channel: this.data.channel,
                liveId: this.data.liveId 
            }
        })
        let configData = get(config, 'data', {})
        // isHasConf === 'Y'表示有配置，如果没有配置公众号，直接返回，不执行以下操作
        if(configData.isHasConf !== 'Y'){
            return 
        }
        let qlLiveId = '';
        // 获取appId列表
        let appIdList = [];
        // 获取liveid列表
        let liveIdList = [];
        // 第一个未关注的公众号的appId
        let appId = '';
        Array.isArray(configData.appBindLiveInfo) && configData.appBindLiveInfo.forEach(item => {
            if (item.isQlAppId == 'Y') {
                qlLiveId = item.bindLiveId;
            }

            appIdList.push(item.appId);
            liveIdList.push(item.bindLiveId);
        })
        const res = await request({
            url: '/api/wechat/user/is-subscribe',
            body: {
                liveIdList: liveIdList.join(',')
            }
        })
        const liveIdListResult = get(res, 'data.liveIdListResult')
        const _subscribe = liveIdListResult.find((item, index) => {
            if (item.liveId == qlLiveId) {
                if (!item.isShowQl && !item.subscribe) {
                    appId = appIdList[index];
                    return true;
                }
            } else if (!item.isFocusThree) {
                appId = appIdList[index];
                return true;
            }
        })
        // 如果没有未关注的公众号，直接返回，不执行下面操作
        if(!_subscribe){
            return
        }
        await request({
            url: '/api/wechat/live/get-qr',
            body: {
                liveId: this.data.liveId ,
                appId,
                channel: this.data.channel,
                showQl: 'N',
            }
        }).then(res => {
            this.setState({
                qrcode: get(res, 'data.qrUrl', '')
            })
            // 手动触发打曝光日志
            setTimeout(() => {
                typeof _qla != 'undefined' && _qla.collectVisible();
            }, 0);
        })
    }

    // 跳转到介绍页
    jumpToIntroPage = (businessId, businessType) => {
        locationTo(`/wechat/page/${businessType}-intro?${businessType}Id=${businessId}`)
    }
    
    render(){
        let { status, receiveList, bestLucky, courseList, qrcode, defaultHeadImage, wechatEmptyHeadImage, fromUserHeadImg } = this.state
        return (
            <Page title="奖学金" className="platform-coupon-grab-page">
                <div className="platform-coupon">
                    {
                        this._hasFetch ? 
                        <div className="user-info-container">
                            <img src={(!fromUserHeadImg || fromUserHeadImg == wechatEmptyHeadImage) ? defaultHeadImage : fromUserHeadImg} alt="" className="user-head-image"/>
                            <div className="user">
                                <div className="user-name">{this.state.fromUserName}</div>
                                <p className="say">给你发奖学金了，快来给大脑充点值！</p>
                            </div>
                        </div> : null
                    }
                    {
                        status ? 
                        <div className="coupon-container">
                            {
                                status == 'none' ? 
                                <Fragment>
                                    <div className="empty-coupon"></div>
                                    <div className="coupon-tip">非常可惜，奖学金被抢完了</div>
                                    <div className="use" onClick={()=>{locationTo('/wechat/page/recommend')}}>返回首页</div>
                                </Fragment>:
                                <Fragment>
                                    <div className="coupon-content">
                                        <div className="coupon-cover"></div>
                                        <div className={`coupon${status === 'success' ? ' move' : ''}`}>
                                            <div className="discount">{this.state.discount / 10}<em>折券</em></div>
                                            {
                                                this.state.isNewUser == 'Y' ? 
                                                <div className="new">新人专享</div>
                                                :null
                                            }
                                        </div>
                                    </div>
                                    <div className="coupon-tip">适用课程：部分非自营课程除外<br/>有效时间：{formatDate(this.state.expiryDate)}前</div>
                                    <div className="use on-log" onClick={()=>{locationTo('/wechat/page/recommend?wcl=lucky&ch=1')}} data-log-region="use">立即使用</div>
                                </Fragment>
                            }
                        </div> : null
                    }
                </div>
                {
                    courseList.length > 0 ?
                    <div className="course-container common">
                        <div className="title"><span></span>精选课程<span></span></div>
                        <div className="courses">
                            {
                                courseList.map(i => (
                                    <div className="item" key={i.businessId} onClick={()=>{this.jumpToIntroPage(i.businessId, i.businessType)}}>
                                        <img src={i.businessImg} alt=""/>
                                        <div className="save">省{i.reduceMoney ? i.reduceMoney.toFixed(1) : 0}元</div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="more-course" onClick={()=>{locationTo('/wechat/page/recommend?wcl=lucky&ch=2')}}>>> 更多课程 >></div>
                    </div> : null
                }
                {
                    receiveList.length > 0 ? 
                    <div className="grab-detail-container common">
                        <div className="title"><span></span>看看大家的手气<span></span></div>
                        <div className="grab-detail">
                            {
                                receiveList.map((i, d) => (
                                    <div className="item" key={i.userId}>
                                        <img src={(!i.headImage || i.headImage == wechatEmptyHeadImage) ? defaultHeadImage : i.headImage} alt="" className="user-head-image"/>
                                        <div className="grab">
                                            <div className="user-name">
                                                <p>{i.userName}</p>
                                                {
                                                    i.isNew == 'N' && i.discount == bestLucky ? 
                                                    <span className="best-lucky">手气最佳</span> : null
                                                }
                                                {
                                                    i.isNew == 'Y' ? 
                                                    <span className="new-exclusive">新人专属</span> : null
                                                }
                                            </div>
                                            <p className="say">{this.data.sentence[`${d % 14}`]}</p>
                                        </div>
                                        <div className="coupon">{ i.discount / 10 }折券</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div> : null
                }
                {
                    this._hasFetch && 
                    <div className="rule-container common">
                        <div className="title"><span></span>活动规则<span></span></div>
                        <div className="rule">
                            <p>1. 购买课程即可获得奖学金福袋，可赠送给好友，自己也能抢；</p>
                            <p>2. 每个福袋仅限20人领取，每人得到一张随机折扣券；</p>
                            <p>3. 折扣券可购买大部分千聊课程，点击“立即使用”可快速查看允许抵扣的课程；</p>
                            <p>4. 折扣券需在有效期内使用，不允许转让；</p>
                            <p>5. 千聊团队保持法律范围内允许的对奖学金福袋活动的解释权。</p>
                        </div>
                        {
                            qrcode ? 
                            <div className="qrcode-container on-visible" data-log-region="visible-channel" data-log-pos="channel">
                                <div className="tip">挑不到好课？<br />长按扫码，优质课程触手可及 <br /></div>
                                <div className="code">
                                    <span className="t-l"></span>
                                    <span className="t-r"></span>
                                    <span className="b-l"></span>
                                    <span className="b-r"></span>
                                    <div className="img"><img src={qrcode} alt=""/></div>
                                </div>
                            </div> : null
                        }
                    </div>
                }
            </Page>
        )
    }
}

export default connect(()=>({}),{})(GrabPlatformCoupon)