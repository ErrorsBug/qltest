import React from 'react';
import { locationTo, formatMoney } from 'components/util';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const CButtons = props => {
    // 按钮本体
    let _Buttons = null;
    let topicMoney = props.topicInfo && formatMoney(props.topicInfo.money);
    // 话题优惠信息
    let _TopicCouponInfo = (props.curTopicCoupon && props.curTopicCoupon.money) && <span className='coupon-deff-money-span'>（已优惠￥{props.curTopicCoupon.money > topicMoney ? topicMoney : props.curTopicCoupon.money}）</span>
    // 系列课优惠信息
    let _ChannelCouponInfo = (props.curChannelCoupon && props.curChannelCoupon.money && props.chargeConfigs.length && props.chargeConfigs[0].amount != 0) && <span className='coupon-deff-money-span'>（已优惠￥{props.curChannelCoupon.money}）</span>

    if (props.isAuthTopic || (props.isTopicOfChannel && props.isAuditionOpen == 'Y')) {
        // 如果是已经有权限进入，就直接显示进入课程按钮
        _Buttons = <span key='enter-live' className='btn-lg color-excited' onClick={props.gotoTopicDetail}>
            <span className='text-box'>
            进入课程
            {
                props.showVipIcon?
                <i className='icon-customized-vip'></i>
                :null        
            }  
            </span>    
        </span>
    } else if (props.isTopicOfChannel) {
        // 如果是系列课内的话题
        if (props.isSingleBuy === 'Y') {
            // 如果是单节付费
            _Buttons = [
                <span key='btn-single-buy' className='btn-lg color-warm' onClick={ props.onBuyTopic }>
                    购买单课
                    { _TopicCouponInfo }
                </span>,
                <span key='btn-channel-buy' className='btn-lg color-excited' onClick={ props.onBuyChannel }>
                    购买系列课
                    { _ChannelCouponInfo }
                </span>
            ];
        } else {
            // 如果不是单节付费
            _Buttons = <span key='btn-channel-buy' className='btn-lg color-excited' onClick={ props.onBuyChannel }>
                购买系列课
                { _ChannelCouponInfo }
            </span>
        }
    } else if (props.isTopicOfCamp) {
        // 如果是打卡训练营的话题，则需要跳转至打卡训练营详情页
        _Buttons = <span key='btn-channel-buy' className='btn-lg color-excited' onClick={ props.onBuyCheckInCamp }>参与打卡</span>

    } else if (props.topicType === 'public') {
        // 如果是免费课程需要报名
        _Buttons = <span key='enter-live' className='btn-lg color-excited on-log' onClick={ props.authTopic } data-log-name="预约报名" data-log-region="free-auth-btn">预约报名</span>
    } else if (props.topicType === 'charge') {
        // 如果是付费单课
        _Buttons = <span key='btn-charge'
                         className='btn-lg color-excited on-log'
                         onClick={ props.onBuyTopic }
                         data-log-name="立即购买单课"
                         data-log-region="buy-btn"
                         data-log-pos="topic">
            立即购买
            { _TopicCouponInfo }
        </span>
    }

    return (
        <footer className={ `button-row ${props.className || ''}` }>
            {
                (props.topicType === 'encrypt' && !props.isAuthTopic && !props.isTopicOfChannel) ?
                    <section className='encrypt-input' onClick={ props.onPasswordInputClick }>
                        <i className="icon_lock"></i>解锁进入课程
                    </section>
                    :
                    [
                        (!props.isTopicOfChannel && !props.isTopicOfCamp && props.isLiveAdmin != 'Y') &&
                            <span key='btn-open-live'
                                  className='btn-sm color-light on-log'
                                  onClick={ () => locationTo(`/wechat/page/backstage?ch=topic_detail`)}
                                  data-log-name="开课程"
                                  data-log-region="btn-open-live"
                            >
                                <img src={ require('../../img/open-live.png') } />
                                开课程
                            </span>
                        ,
                        <span key='btn-consult'
                              className='btn-sm color-light on-log'
                              onClick={ props.onConsultClick }
                              data-log-name="咨询"
                              data-log-region="btn-consult"
                        >
                            <img src={ require('../../img/consult-icon.png') } />
                            咨询
                        </span>,
                        !(props.isTopicOfChannel && props.isSingleBuy == 'Y') &&
                            <span key='btn-goto-live'
                                  className='btn-sm color-light on-log'
                                  onClick={ () => onLiveClick(props) }
                                  data-log-name="直播间"
                                  data-log-region="btn-goto-live"
                            >
                                <img src={ require('../../img/live-home-icon.png') } />
                                直播间
                            </span>
                        ,
                        _Buttons
                    ]
            }

            <aside className="operation-icon-group">
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
            </aside>
        </footer>
    );
};

function onLiveClick (props) {
    if(window._qla) {
        _qla('click', {region: "topic",pos: "bottom", type: 'live'})
    };

    locationTo(`/wechat/page/live/${props.liveId}`);
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
    onScrollToTop: () => {}
}

export default CButtons;
