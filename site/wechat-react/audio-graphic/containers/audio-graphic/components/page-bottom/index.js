import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatMoney, locationTo } from 'components/util';


class PageBottom extends Component {

    jump() {
        locationTo(
            `/live/channel/channelPage/${this.props.channelInfo.channel.channelId}.htm?shareKey=${this.props.shareKey || ''}`,
            `/pages/channel-index/channel-index?channelId=${this.props.channelInfo.channel.channelId}&shareKey=${this.props.shareKey || ''}`
        )
    }

    render() {
        return (
            <div className='page-bottom'>
                {
                    this.props.power.allowMGLive ?
                        (this.props.clientBListen == 'Y' || this.props.isOrNotListen == 'Y' || this.props.isRelayChannel == 'N' || this.props.isRelay == 'N') ?
                            <span
                                className="btn-edit on-log"
                                data-log-region="audio-graphic-edit"
                                onClick={() => { locationTo(`/wechat/page/topic-intro?topicId=${this.props.topicInfo.id}`) }}
                            >返回介绍页
                            </span>

                            : (
                                !this.props.isAuth ?
                                <div className='btn-buy-bar'>
                                    {
                                        (this.props.topicInfo.isSingleBuy == 'Y' && this.props.channelInfo.chargeConfigs[0].amount !== 0) ?
                                            <span className="btn-buy-topic" onClick={this.props.payForTopic}>
                                                <b>￥{formatMoney(this.props.topicInfo.money)} </b>
                                                购买单节课
                                            </span>
                                            : this.props.topicInfo.campId ?
                                                <span className="btn-buy-topic" onClick={() => {locationTo(`/wechat/page/camp-detail?campId=${this.props.topicInfo.campId}`)}}>参与打卡</span>
                                            : null
                                    }
                                        {
                                            !this.props.topicInfo.campId &&
                                            <span className="btn-buy-channel" onClick={this.jump.bind(this)}>
                                                {
                                                    this.props.channelInfo.chargeConfigs[0].amount !== 0 ?
                                                        <b>￥
                                                    {this.props.channelInfo &&
                                                                (
                                                                    this.props.channelInfo.chargeConfigs[0].discountStatus == 'Y' ?
                                                                        this.props.channelInfo.chargeConfigs[0].discount
                                                                        :
                                                                        this.props.channelInfo.chargeConfigs[0].amount
                                                                )

                                                            }
                                                        </b>
                                                        : null
                                                }
                                                购买系列课
                                            </span>
                                        }
                                </div>
                                : null
                            ) 
                    : this.props.isAuth ? null :
                        <div className='btn-buy-bar'>
                            {
                                (this.props.topicInfo.isSingleBuy == 'Y' && this.props.channelInfo.chargeConfigs[0].amount !== 0) ?
                                    <span className="btn-buy-topic" onClick={this.props.payForTopic}>
                                        <b>￥{formatMoney(this.props.topicInfo.money)} </b>
                                        购买单节课
                                    </span>
                                : this.props.topicInfo.campId ?
                                    <span className="btn-buy-topic" onClick={() => {locationTo(`/wechat/page/camp-detail?campId=${this.props.topicInfo.campId}`)}}>参与打卡</span>
                                : null
                            }
                            {
                                !this.props.topicInfo.campId &&
                                <span className="btn-buy-channel" onClick={this.jump.bind(this)}>
                                {
                                    this.props.channelInfo.chargeConfigs[0].amount !== 0 ?
                                        <b>￥
                                        {this.props.channelInfo &&
                                                (
                                                    this.props.channelInfo.chargeConfigs[0].discountStatus == 'Y' ?
                                                        this.props.channelInfo.chargeConfigs[0].discount
                                                        :
                                                        this.props.channelInfo.chargeConfigs[0].amount
                                                )

                                            }
                                        </b>
                                        : null
                                }
                                购买系列课
                            </span>
                            }
                        </div>
                }
            </div>
        );
    }
}

PageBottom.propTypes = {

};

export default PageBottom;