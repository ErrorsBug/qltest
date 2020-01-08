import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class OperatePlat extends Component {
    render() {
        const {
            isRelay, channelId, channelInfo, isPop, realNameStatus,
            power, liveRole, chargeConfigs,
            createNewTopic, close, show, pushChannel, showPushChannelDialog, handleJoineWrapClick
        } = this.props;
        
        // 按钮曝光打点
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 500);
        
        return (
            show &&
            <main className="icons-container">
                <ul>
                    {
                        chargeConfigs && chargeConfigs[0].amount > 0 && (this.props.channelInfo.chargeType === 'absolutely'||this.props.channelInfo.chargeType === 'flexible') 
                        ?
                        <li
                            className="operate-item on-log on-visible"
                            data-log-region='channel-distribution-set'
                            onClick={() => window.location.href = `/wechat/page/channel-distribution-set/${channelId}`}
                        >
                            <div>
                                <img src={require('./img/1.png')} />
                                <span>分销推广</span>
                            </div>
                        </li>
                        : ''
                    }

                    {
                        !isRelay && chargeConfigs && chargeConfigs[0].amount > 0 && (this.props.channelInfo.chargeType === 'absolutely'||this.props.channelInfo.chargeType === 'flexible') 
                        ?
                        <li
                            className="operate-item on-log on-visible"
                            data-log-region='channel-coupon-list'
                            onClick={() => window.location.href = `/wechat/page/coupon-code/list/channel/${channelId}`}
                        >
                            <div>
                                <img src={require('./img/2.png')} />
                                <span>优惠券</span>
                            </div>
                        </li>
                        : ''
                    }

                    {
                        !isRelay && chargeConfigs && chargeConfigs[0].amount > 0 && channelInfo && channelInfo.chargeType === 'absolutely'
                            ?
                            <li
                                className="operate-item on-log on-visible"
                                data-log-region='channel-market-seting'
                                onClick={() => window.location.href = `/wechat/page/channel-market-seting?channelId=${channelId}`}
                            >
                                <div>
                                    <img src={require('./img/3.png')} />
                                    <span>系列课促销</span>
                                </div>
                            </li>
                            : ''
                    }

                    {
                        <li
                            className="operate-item on-log on-visible"
                            data-log-region='channel-data-analysis'
                            onClick={() => {
                                createNewTopic()
                                window.location.href = `/wechat/page/channel-topic-statistics?businessId=${channelId}&businessType=channel`
                            }
                            }
                        >
                            <div>
                                <img src={require('./img/4.png')} />
                                <span>数据统计</span>
                            </div>
                        </li>
                    }

                    {/* 用来加那条线 */}
                    <ul></ul>  

                    {
                        !isRelay && power.allowCreateTopic
                            ?
                            <li
                                className="operate-item on-log on-visible"
                                data-log-region='create-topic'
                                onClick={() => {
                                    createNewTopic();
                                    window.location.href = isPop && realNameStatus != "audited" ? "javascript:;" : `/wechat/page/topic-create?liveId=${channelInfo.liveId}&channelId=${channelId}`;
                                }}
                            >
                                <div>
                                    <img src={require('./img/8.png')} />
                                    <span>新建单课</span>
                                </div>
                            </li>
                            : ''
                    }

                    <li
                        className="operate-item on-log on-visible"
                        data-log-region='show-push-channel-dialog'
                        onClick={() => {
                            pushChannel();
                            close();
                        }}
                    >
                        <div>
                            <img src={require('./img/6.png')} />
                            <span>推送通知</span>
                        </div>
                    </li>

                    <li
                        className="operate-item on-log on-visible"
                        data-log-region='channel-goto-join-list'
                        onClick={handleJoineWrapClick}
                    >
                        <div>
                            <img src={require('./img/7.png')} />
                            <span>报名管理</span>
                        </div>
                    </li>

                    <li
                        className="operate-item on-log on-visible"
                        data-log-region='edit-channel'
                        onClick={() => window.location.href = `/wechat/page/channel-create?channelId=${channelId}&isRelay=${isRelay ? 'Y' : 'N'}&isCamp=${ this.props.isCamp ? 'Y' : 'N' }`}
                    >
                        <div>
                            <img src={require('./img/5.png')} />
                            <span>编辑系列课</span>
                        </div>
                    </li>
                </ul>

                <div className="close-button on-log" 
                    data-log-region="series"
                    data-log-pos="finish"
                onClick={close}>关闭</div>
            </main>
        )
    }
}



function mapStateToProps(state) {
    return {
    }
}

const mapActionToProps = {

}

module.exports = connect(mapStateToProps, mapActionToProps)(OperatePlat);