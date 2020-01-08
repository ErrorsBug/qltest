import React from 'react';
import { 
    locationTo, 
    formatMoney, 
    getVal, 
    formatNumber,
	paymentPrice,
} from 'components/util';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const CButtons = props => {
    let topicOriginalPrice = formatMoney(props.topicInfo && props.topicInfo.money || 0);
    const hasTopicCoupon = !!props.curTopicCoupon.useRefId

    // 按钮本体
    let _Buttons = null;
    
    if (!props.isAuthTopic && props?.chargeInfo?.discountStatus == 'UNLOCK') {
	    _Buttons = <span key='enter-live'
	                     className='btn-lg color-excited on-log on-visible'
	                     onClick={() => {locationTo('/wechat/page/channel-intro?channelId=' + props.channelId)}}
	                     data-log-name=""
	                     data-log-region=""
	                     data-log-pos = ""
	                >
                    <span className='text-box'>进入系列课</span>
                </span>
    } else if (props.isAuthTopic || (props.isTopicOfChannel && props.isAuditionOpen == 'Y')) {
        // 如果是已经有权限进入，就直接显示进入课程按钮
        _Buttons = [
            (
                props.canInvite ?
                <span key='invite-friends'
                    className='btn-lg color-warm on-log on-visible uni-friend'
                    onClick={props.openInviteFriendsToListenDialog}
                    data-log-name="请好友听"
                    data-log-region="topic-bottom"
                    data-log-pos = "invite-listen"
                >
                    <span className='text-box'>请好友听</span>
                </span> : null
            ),
            (
                props.isUniCourse && <div className={ `btn-lg color-warm uni-add-btn on-log on-visible ${ props.isAnimate ? 'add' : '' } ${ props.isJoinUni ? 'join-btn' : '' }` } onClick={ () => props.joinUniversityBtn(props.isBooks) }>
                    <span>{ props.isJoinUni ? '已加课表' : '加入课表' }</span>
                </div>
            ),
            (
                props.showBackTuitionBanner && !props.canInvite ?
                <span key='back-tuition'
                    className='btn-lg color-warm on-log on-visible'
                    onClick={props.openBackTuitionDialog}
                    data-log-name="返学费"
                    data-log-region="returnFee"
                    data-log-pos = "2"
                >
                    <span className='text-box'>返学费￥{props.returnMoney}</span>
                </span> : null
            ),
            <span key='enter-live'
                    className='btn-lg color-excited on-log on-visible'
                    data-log-name='进入课程'
                    data-log-region='enter-course'
                    onClick={props.gotoTopicDetail}>
                <span className='text-box'>{props.isBooks ? '立即收听' : '进入课程'}
                {
                    props.showVipIcon?
                    <i className='icon-customized-vip'></i>
                    :null
                }
                </span>
            </span>
        ]
    } else if(props.s == 'taskcard' && props.t && props.sign){
        // 新增任务邀请卡完成任务后的报名按钮
        _Buttons = <span key='enter-live'
                        className='btn-lg color-excited on-log on-visible'
                        data-log-name='进入课程'
                        data-log-region='enter-course'
                        onClick={props.topicTaskCardAuth}>
                        <span className='text-box'>任务已完成</span>
                    </span>
    }else if (props.isTopicOfChannel) {
        // 如果是系列课内的话题  增加拼课逻辑 进行中与失败 成功的话 有上面的进入课程拦截
        // 一个神坑 系列课如果开了单节课购买的话 购买单节课的收入不会算入老师的账号，所以要屏蔽掉那个单节课购买的按钮 即使B端设置了可以单节课购买 我们也只给一个购买系列课按钮
        if (props.groupResult && props.groupResult.groupId && props.groupResult.result == 'ING') {
            _Buttons = [
                <span key='enter-live'
                    className='btn-lg color-excited'
                    onClick={props.gotoGroupInfo}>
                    <span className='text-box'>开始学习<b className="price-num">任务已完成</b></span>
                </span>
            ]
        } else if (props.isSingleBuy === 'Y') {
            // 如果是单节付费
            if (props.isBooks) {
                // 听书状态
                _Buttons = [
                    <span key='btn-single-buy'
                        className='btn-lg color-excited on-log on-visible'
                        data-log-name="购买单节课"
                        data-log-region="learn-buy-channel-topic"
                        onClick={ props.onBuyTopic }>
                        <p className="btn-buy">立即听书<s>￥</s><b>{topicOriginalPrice}</b></p>
                    </span>,
                    // buyChannelBtn(props, false)
                ];
            } else {
                _Buttons = [
                    <span key='btn-single-buy'
                        className='btn-lg color-warm on-log on-visible'
                        data-log-name="购买单节课"
                        data-log-region="learn-buy-channel-topic"
                        onClick={ props.onBuyTopic }>
                        <p className="btn-buy">单节购买<s>￥</s><b>{paymentPrice(props.topicInfo.money, props.isOpenMemberBuy, hasTopicCoupon ? props.curTopicCoupon.money : 0, false)}</b></p>
                    </span>,
                    buyChannelBtn(props, false)
                ];
            }
        } else {
            // 如果不是单节付费
            _Buttons = buyChannelBtn(props)
        }
    } else if (props.isTopicOfCamp) {
        // 如果是打卡训练营的话题，则需要跳转至打卡训练营详情页
        _Buttons = <span key='btn-channel-buy'
                        className='btn-lg color-excited on-log on-visible'
                        data-log-name="参与打卡"
                        data-log-region="learn-camp"
                        onClick={ props.onBuyCheckInCamp }>参与打卡</span>

    } else if (props.topicType === 'public') {
        // 如果是免费课程需要报名
        _Buttons = <span key='enter-live'
                        className='btn-lg color-excited on-log on-visible'
                        data-log-name="免费报名"
                        data-log-region="learn-free-enroll"
                        onClick={ props.authTopic }>{props.isBooks ? '免费收听' : '免费报名'}</span>
    } else if (props.topicType === 'charge') {
        // 如果是付费单课
        _Buttons = <span key='btn-charge'
                        className='btn-lg color-excited on-log on-visible btn-emphasize'
                        onClick={ props.onBuyTopic }
                        data-log-name="立即学习"
                        data-log-region="learn-normal">
                        <i className="icon-fire"></i>
                        <p className="btn-buy">
                            { props.isBooks ? '立即听书' : '立即学习' }
                            <s>￥</s><b>{topicOriginalPrice}</b>
                            {
                                props.isOpenMemberBuy || hasTopicCoupon  ? 
                                <span className="payment-price">{paymentPrice(props.topicInfo.money, props.isOpenMemberBuy, props.curTopicCoupon.money)}</span>
                                : null
                            }
                        </p>
                </span>
    }

    return (
        <footer className={ `button-row-v2 ${props.className || ''} ${ props.isUniCourse ? 'uni-topic-btn' : '' }` }>
            {
                (props.topicType === 'encrypt' && !props.isAuthTopic && !props.isTopicOfChannel) ?
                    <span className='encrypt-input btn-lg color-excited on-log on-visible'
                        data-log-name="解锁进入课程"
                        data-log-region="learn-decript"
                        onClick={ props.onPasswordInputClick }>
                        <i className="icon_lock"></i>解锁进入课程
                    </span>
                    :
                    _Buttons
            }

            {/* <aside className="operation-icon-group">
                <ReactCSSTransitionGroup
                    transitionName="btn-top"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}>
                    {
                        props.showGoToTop &&
                            <section className="icons-wrap on-log"
                                     onClick={ props.onScrollToTop }
                                     data-log-name="回到顶部"
                                     data-log-region="operation-icon-group"
                                     data-log-pos="to-top"
                            >
                                <img src={ require('../../img/to-top.png') } />
                            </section>
                    }
                </ReactCSSTransitionGroup>
            </aside> */}
        </footer>
    );
};


function buyChannelBtn(props, isShowOrigin = true) {
    let defaultChargeConfig = props.chargeInfo,
        channelOriginalPrice = defaultChargeConfig.amount || 0,
        channelDiscountPrice = props.showDiscount && defaultChargeConfig.discount || 0,
        dataLogName = '购买系列课',
        dataLogRegion = 'learn-buy-channel';

    if (getVal(props.channelInfo, 'channel.chargeType') === 'flexible') {
        dataLogName = '购买系列课-按时';
        dataLogRegion = 'learn-buy-channel-flexible';
    } else if (props.showDiscount) {
        dataLogName = '购买系列课-特价';
        dataLogRegion = 'learn-buy-channel-discount';
    }

    // 系列课优惠信息
    const hasChannelCoupon = !!props.curChannelCoupon.useRefId

    return (
        <span key='btn-channel-buy'
            className={`btn-lg color-excited on-log on-visible${isShowOrigin ? ' btn-emphasize' : ''}`}
            data-log-name={dataLogName}
            data-log-region={dataLogRegion}
            onClick={ props.onBuyChannel }>
            {
                isShowOrigin ? <i className="icon-fire"></i> : null
            }
            <p className="btn-buy">
                {
                    props.isBooks ? (
                        channelOriginalPrice > 0 ?
                        <p>购买系列书<s>￥</s><b style={{ fontWeight:'normal' }}>{channelOriginalPrice}</b></p>
                        :
                        <p>免费收听</p>
                    ) : 
                    <p>
                    购买系列课
                    <s>￥</s>
                    <b style={{ fontWeight:'normal' }}>
                    {
                        isShowOrigin ? 
                        channelOriginalPrice 
                        : 
                        paymentPrice(props.showDiscount ? channelDiscountPrice*100 : channelOriginalPrice*100, props.isOpenMemberBuy, hasChannelCoupon ? props.curChannelCoupon.money : 0, false)
                    }
                    </b>
                    {
                        isShowOrigin && (props.isOpenMemberBuy || hasChannelCoupon) ? 
                        <span className="payment-price">{paymentPrice(props.showDiscount ? channelDiscountPrice*100 : channelOriginalPrice*100, props.isOpenMemberBuy, hasChannelCoupon ? props.curChannelCoupon.money : 0)}</span> : null
                    }
                    </p>
                }
            </p>
            {/* {
                props.isOpenMemberBuy ? (
                    props.showDiscount ?
                        <p className="btn-buy">
                            <p><s>￥</s><b>{(isCoupon ? (formatNumber(diffMoney * 0.8) > 0 ? formatNumber(diffMoney * 0.8) : 0) : formatNumber(channelDiscountPrice * 0.8))}</b></p>
                            
                            <span style={{marginLeft: '.5em', opacity: .5, textDecoration: 'line-through'}}>
                                <s>￥{channelOriginalPrice}</s>
                            </span>
                            <s style={{marginLeft: '.5em'}}>{isCoupon ? '系列课会员券后价' : '系列课会员价'}</s>
                        </p> :
                        <p className="btn-buy">
                            <p><s>￥</s><b>{(isCoupon ? (formatNumber(diffMoney * 0.8) > 0 ? formatNumber(diffMoney * 0.8) : 0) : formatNumber(channelOriginalPrice * 0.8))}</b></p>
                            
                            <span style={{marginLeft: '.5em', opacity: .5, textDecoration: 'line-through'}}>
                                <s>￥{channelOriginalPrice}</s>
                            </span>
                            <s style={{marginLeft: '.5em'}}>{isCoupon ? '系列课会员券后价' : '系列课会员价'}</s>
                        </p>
                ) : (
                    props.showDiscount ?
                        <p className="btn-buy">
                            <p><s>￥</s><b>{isCoupon ? (diffMoney > 0 ? diffMoney : 0) : channelDiscountPrice}</b></p>
                            
                            {
                                !isShowOrigin && isCoupon ? null : (
                                    <span style={{marginLeft: '.5em', opacity: .5, textDecoration: 'line-through'}}>
                                        <s>￥{channelOriginalPrice}</s>
                                    </span>
                                )
                            }
                            <s style={{marginLeft: '.5em'}}>{isCoupon ? '系列课券后价' : '购买系列课'}</s>
                        </p> :
                        <p className="btn-buy">
                            <p><s>￥</s><b>{isCoupon ? (diffMoney > 0 ? diffMoney : 0) : channelOriginalPrice}</b></p>
                            
                            {
                                isCoupon && isShowOrigin && (
                                    <span style={{marginLeft: '.5em', opacity: .5, textDecoration: 'line-through'}}>
                                        <s>￥{channelOriginalPrice}</s>
                                    </span>
                                )
                            }
                            <s style={{marginLeft: '.5em'}}>{isCoupon ? '系列课券后价' : '购买系列课'}</s>
                        </p>
                )
            } */}
        </span>
    )
}



CButtons.defaultProps = {
    // 直播间ID
    liveId: '',
    // 如果是单节付费
    isSingleBuy: 'Y',
    // 如果是系列课内的话题
    isTopicOfChannel: false,
    // 如果是打卡训练营内的话题
    isTopicOfCamp: false,
    // 是否已经有权限进入话题
    isAuthTopic: false,
    // 当前选中的系列课优惠券
    curChannelCoupon: {},
    // 当前选中的话题优惠券
    curTopicCoupon: {},
    // 话题的付费类型
    topicType: 'charge',
    // 输入的密码内容
    password: '',
    // 是否显示滚动到顶部的按钮
    showGoToTop: false,
    // 是否专业版
    isLiveAdmin: 'N',
    // 咨询按钮点击
    onConsultClick: () => {},
    // 购买话题
    onBuyTopic: () => {},
    // 购买系列课
    onBuyChannel: () => {},
    // 购买打卡训练营
    onBuyCheckInCamp: () => {},
    // 进入课程的处理方法
    gotoTopicDetail: () => {},
    // 密码输入条点击事件
    onPasswordInputClick: () => {},
    // 滚动到顶部的时间
    onScrollToTop: () => {},
}

export default CButtons;
