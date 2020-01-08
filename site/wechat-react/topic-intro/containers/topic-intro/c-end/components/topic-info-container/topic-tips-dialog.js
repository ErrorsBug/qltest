import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import BottomDialog from 'components/dialog/bottom-dialog'

import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { getVal, locationTo } from 'components/util';

@autobind
class TopicTipsDialog extends Component {

    static contextTypes = {
        router: PropTypes.object
    }

    state = {
        shareKey : ''
    }
    componentDidMount() {
        const shareKey = getVal(this.context.router, 'location.query.shareKey', '');
        console.log(shareKey);
        this.setState({
            shareKey
        })
    }
    
    render() {

        if (typeof (document) == 'undefined') {
            return false;
        }
        return createPortal(
            <BottomDialog
                className='topic-tips-dialog'   
                show={ true }
                theme='empty'
                onClose = {this.props.hide}
            >
                <div className="main">
                    <div className="title">服务说明</div>
                    <ul>
                        {
                            this.props.ifShowPermanentPlayback() &&
                            <li>
                                <img className='icon' src={require('./img/icon-forever.png')} alt="" />
                                <div className="label-bar"><span className="label">{this.props.ifShowPermanentPlayback() === 'month' ? '支持回听' : '支持回听'}</span></div>
                                <div className="tips">{this.props.ifShowPermanentPlayback() === 'month' ? '课程包月期间免费不限次回听，可在个人中心下找到' : '本课程可支持回听，可在个人中心找到听过的课程'}</div>
                            </li>
                        }
                        {
                            (  
                                
                                this.props.topicInfo.isRelay!="Y" &&
                                (
                                    (!this.props.topicInfo.channelId && !this.props.topicInfo.campId && this.props.topicInfo.type == 'charge')
                                    ||
                                    (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy == 'Y')
                                )
                            ) &&
                            <li>
                                <img className='icon' src={require('./img/icon-coupon.png')} alt="" />
                                <div className="label-bar">
                                    <span className="label">支持优惠券</span>
                                    {
                                        (
                                            !this.props.power.allowSpeak &&
                                            !this.props.isAuthTopic
                                        ) &&
                                        <span className="btn-link on-log"
                                              onClick={() => { locationTo(`wechat/page/coupon-code/exchange/topic/${this.props.topicInfo.id}${this.state.shareKey && '&shareKey=' + this.state.shareKey}`) }}
                                              data-log-name="优惠券兑换"
                                              data-log-region="topic-tips-dialog"
                                              data-log-pos="coupon"
                                        >优惠券兑换 <i className='icon_enter'></i></span>
                                    }
                                </div>
                                <div className="tips">本课程支持使用优惠券，直播间拥有最终解释权</div>
                            </li>
                        }   
                        {
                            (   
                                this.props.topicInfo.isRelay!="Y" &&
                                (
                                    (!this.props.topicInfo.channelId && !this.props.topicInfo.campId && this.props.topicInfo.type == 'charge') ||
                                    (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy == 'Y')
                                ) &&
                                this.props.isOpenVip
                            ) &&
                            <li>
                                <img className='icon' src={require('./img/icon-vip.png')} alt="" />
                                <div className="label-bar">
                                    <span className="label">会员免费听</span>
                                    <span className="btn-link on-log"
                                          onClick={() => { locationTo(`/wechat/page/live-vip-details?liveId=${this.props.topicInfo.liveId}`) }}
                                          data-log-name="购买VIP会员"
                                          data-log-region="topic-tips-dialog"
                                          data-log-pos="vip"
                                    >购买VIP会员 <i className='icon_enter'></i></span>
                                </div>
                                <div className="tips">购买成为直播间VIP会员，即可全场任意免费听</div>
                            </li>
                        }
                        {
                            this.props.topicInfo.type == 'charge' && this.props.topicInfo.isRelay=="Y" &&
                            <li>
                                <img className='icon' src={require('./img/icon-vip-unuse.png')} alt="" />
                                <div className="label-bar">
                                    <span className="label">会员不可用</span>
                                    <span className="btn-link on-log"
                                          onClick={() => { locationTo(`/wechat/page/live-vip-details?liveId=${this.props.topicInfo.liveId}`) }}
                                          data-log-name="购买VIP会员"
                                          data-log-region="topic-tips-dialog"
                                          data-log-pos="vip"
                                    >购买VIP会员 <i className='icon_enter'></i></span>
                                </div>
                                <div className="tips">其他直播间转播课，直播间VIP不支持免费收听</div>
                            </li>
                        }   
                    </ul>
                    <div className="btn-close" onClick={() => { console.log('11');this.props.hide()}}>关闭</div>
                </div>    
            </BottomDialog>,
            document.getElementById('app')
        );
    }
}

TopicTipsDialog.propTypes = {

};

export default TopicTipsDialog