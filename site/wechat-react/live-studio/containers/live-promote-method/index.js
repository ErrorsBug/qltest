import Page from "components/page";
import { connect } from "react-redux";
import React, { Component } from "react";
import { getCourseIndexStatus } from "../../actions/data-statistics";
import { locationTo } from "components/util";
import { apiService } from "components/api-service";
import { request } from "common_actions/common";

class LivePromoteMethod extends Component {
    state = {
        showSetAuditionDialog: false,
        type: this.props.location.query.businessType,
        id: this.props.location.query.businessId,
        discountStatus: "N", // 课程优惠状态
        couponStatus: "N", // 优惠券状态
        auditionOpen: "N", // 单节购买状态
        knowledgeStatus: 'N', //是否关联短视频
        shareStatus: 'N', // 是否开启分销推广
        descStatus: 'N', // 是否开启了课程简介
        show: true,
        optimizeNum: 0, // 待优化的个数
        channelInfo: {
        },
        chargeConfigs: [{}],
        topicInfo: {},
        shortVideoCount: 0
    };

    async componentDidMount() {
        this.ajaxGetCourseOptimizeNum();
        this.ajaxGetCourseKnowledgeCount();
        if (this.state.type == 'topic') {
            this.ajaxGetTopicInfo()
        } else {
            this.ajaxGetChannelInfo();
        }
        const result = await getCourseIndexStatus({
            businessId: this.state.id,
            type: this.state.type
        });
        if (result.state.code === 0) {
            this.setState({ ...result.data, show: true });
        }
    }

    ajaxGetChannelInfo = async () => {
        let result = await apiService.post({
            url: '/h5/channel/info',
            body: {
                channelId: this.state.id
            }
        })
        if (result.state.code == 0) {
            this.setState({
                channelInfo: result.data.channel,
                chargeConfigs: result.data.chargeConfigs
            })
        }
    }

    ajaxGetTopicInfo = async () => {
        let result = await apiService.post({
            url: '/h5/topic/get',
            body: {
                topicId: this.state.id,
            }
        })
        if (result.state.code == 0) {
            this.setState({
                topicInfo: {
                    ...result.data.topicPo,
                    isSingleBuy: result.data.topicExtendPo.isSingleBuy
                }
            })
        }
    }

    ajaxGetCourseOptimizeNum = async () => {
        let result = await apiService.post({
            url: '/h5/dataStat/getChannelOrTopicOptimize',
            body: {
                businessId: this.state.id,
                type: this.state.type
            }
        })
        if (result.state.code == 0) {
            this.setState({
                optimizeNum: result.data.count
            })
        }
    }

    ajaxGetCourseKnowledgeCount = async () => {
        let result = await request.post({
            url: '/api/wechat/transfer/shortKnowledgeApi/short/knowledge/getCourseKnowledgeCount',
            body: {
                businessId: this.state.id
            }
        })
        if (result.state.code == 0) {
            this.setState({
                shortVideoCount: result.data.count
            })
        }
    }

    render() {
        let {
            type,
            discountStatus,
            couponStatus,
            auditionOpen,
            knowledgeStatus, //是否关联短视频
            shareStatus, // 是否开启分销推广
            descStatus, // 是否开启了课程简介
            show
        } = this.state;
        if (!show) {
            return "";
        }
        return (
            <Page
                title={"如何提升课程指数"}
                className="how-to-promote-course-index"
            >
                <div className="promote-list" onClick={() => {
                    locationTo(
                        `/wechat/page/short-knowledge/create?liveId=${this.state.channelInfo.liveId}&businessId=${this.state.id}&businessType=${this.state.type}`
                    );
                }} style={{
                    backgroundImage: `url(${require('./img/short_video.png')})`
                }}>
                    <div className="content">
                        <div className="title">制作获客短视频</div>
                        <div className="tip1">
                        60秒短视频，把课程高潮和爆点呈现给用户，为课程精准引流。
                        </div>
                        <div className="tip2">课代表分享短视频，可以获得分成</div>
                    </div>
                    {this.state.shortVideoCount ? (
                        <div
                            className="has-seted"
                        >
                            已制作{this.state.shortVideoCount}个
                        </div>
                    ) : (
                        <div
                            className="set on-log"
                            data-log-region="market_setting"
                        >
                            去制作
                        </div>
                    )}
                </div>
                {/* 付费系列课且不是转载系列课才显示营销工具 */}
                {(type == "channel" && this.state.channelInfo.isRelay != 'Y' && this.state.chargeConfigs && this.state.chargeConfigs[0].amount) ? (
                    <div className="promote-list" onClick={() => {
                        locationTo(
                            `/wechat/page/channel-market-seting?channelId=${
                                this.state.id
                            }`
                        );
                    }} style={{
                        backgroundImage: `url(${require('./img/icon_marketing.png')})`
                    }}>
                        <div className="content">
                            <div className="title">开启营销工具</div>
                            <div className="tip1">
                                开启营销功能 , 报名率预计可翻倍
                            </div>
                            <div className="tip2">60%的S级课程已开启</div>
                        </div>
                        {discountStatus == "Y" ? (
                            <div
                                className="has-seted"
                            >
                                已开启
                            </div>
                        ) : (
                            <div
                                className="set on-log"
                                data-log-region="market_setting"
                            >
                                去开启<i className="icon_enter" />
                            </div>
                        )}
                    </div>
                ) : null}
                 {(type == "channel" && this.state.chargeConfigs[0].amount && this.state.channelInfo.isRelay != 'Y' ) ? (
                    <div className="promote-list" style={{
                        backgroundImage: `url(${require('./img/icon_audition.png')})`
                    }}>
                        <div className="content">
                            <div className="title">开启试听</div>
                            <div className="tip1">
                                系列课内开启试听，用户可快速了解课程内容和质量，从而提高购买转化率
                            </div>
                            <div className="tip2">46%的S级课程已设置</div>
                        </div>
                        {auditionOpen == "Y" ? (
                            <div
                                className="has-seted"
                                onClick={() => {
                                    this.setState({
                                        showSetAuditionDialog: true
                                    });
                                }}
                            >
                                已设置
                            </div>
                        ) : (
                            <div
                                className="set on-log"
                                data-log-region="trial_setting"
                                onClick={() => {
                                    this.setState({
                                        showSetAuditionDialog: true
                                    });
                                }}
                            >
                                去设置<i className="icon_enter" />
                            </div>
                        )}
                    </div>
                ) : null}
                <div className="promote-list" style={{
                    backgroundImage: `url(${require('./img/intro.png')})`
                }} onClick={() => {
                    if (this.state.type == 'channel') {
                        location.href = `/wechat/page/channel-create?channelId=${this.state.id}`
                    } else {
                        location.href = `/wechat/page/topic-intro-edit?topicId=${this.state.id}`
                    }id
                }}>
                    <div className="content">
                        <div className="title">完善课程简介</div>
                        <div className="tip1">
                            有{this.state.optimizeNum}项内容待优化
                        </div>
                        <div className="tip2">您也可以登录PC管理后台，一键套用模版，轻松制作精致封面和简介。v.qianliao.tv</div>
                    </div>
                    {descStatus == "Y" ? (
                        <div
                            className="has-seted"
                        >
                            已设置
                        </div>
                    ) : (
                        <div
                            className="set on-log"
                            data-log-region="trial_setting"
                        >
                            去设置<i className="icon_enter" />
                        </div>
                    )}
                </div>
                {
                    (type == 'topic' && this.state.topicInfo.money) || (type == 'channel' && this.state.chargeConfigs[0].amount && this.state.channelInfo.isRelay != 'Y') ?
                    <div className="promote-list" style={{
                        backgroundImage: `url(${require('./img/icon_coupons.png')})`
                    }} onClick={() => {
                        locationTo(
                            `/wechat/page/coupon-code/list/${
                                this.state.type
                            }/${this.state.id}`
                        );
                    }}>
                        <div className="content">
                            <div className="title">设置优惠券</div>
                            <div className="tip1">
                                给老用户发优惠券 , 复购率预计可提高20%
                            </div>
                            <div className="tip2">80%的S级课程已设置</div>
                        </div>
                        {couponStatus == "Y" ? (
                            <div
                                className="has-seted"
                            >
                                已设置
                            </div>
                        ) : (
                            <div
                                className="set on-log"
                                data-log-region="coupon_setting"
                            >
                                去设置<i className="icon_enter" />
                            </div>
                        )}
                    </div> : null
                }
                {(type == 'channel' && this.state.chargeConfigs[0].amount) ||
                (type == 'topic' && this.state.topicInfo.money && !this.state.topicInfo.channelId) ? (
                    <div className="promote-list" style={{
                        backgroundImage: `url(${require('./img/share.png')})`
                    }} onClick={() => {
                        if (type == 'topic') {
                            locationTo(
                                `/wechat/page/topic-distribution-set/${this.state.id}`
                            )
                        } else {
                            locationTo(
                                `/wechat/page/channel-distribution-set/${this.state.id}`
                            )
                        }
                    }}>
                        <div className="content">
                            <div className="title">开启分销推广</div>
                            <div className="tip1">
                                为学员设置分销奖励，鼓励学员邀请好友来上课
                            </div>
                            <div className="tip2">建议分销比例设置为30%～50%</div>
                        </div>
                        {shareStatus == "Y" ? (
                            <div
                                className="has-seted"
                            >
                                已完善
                            </div>
                        ) : (
                            <div
                                className="set on-log"
                                data-log-region="trial_setting"
                            >
                                去完善<i className="icon_enter" />
                            </div>
                        )}
                    </div>
                ) : null}
                {/* 设置试听课程弹窗 */}
                {this.state.showSetAuditionDialog && (
                    <div className="set-audition-dialog">
                        <div
                            className="bg"
                            onClick={() => {
                                this.setState({ showSetAuditionDialog: false });
                            }}
                        />
                        <div className="set-audition">
                            <div className="content">
                                <div className="title">设置试听课程方法</div>
                                <div className="item">
                                    <div className="tip">
                                        第一步：进入系列课，点击课程列表
                                        <em>【更多】</em>
                                    </div>
                                    <img
                                        src={require("./img/audition-tip1.png")}
                                        alt=""
                                    />
                                </div>
                                <div className="item">
                                    <div className="tip">
                                        第二步：打开<em>【免费试听】</em>开关
                                    </div>
                                    <img
                                        src={require("./img/audition-tip2.png")}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div
                                className="set-audition-btn on-log"
                                data-log-region="trial_setting_go"
                                onClick={() => {
                                    locationTo(
                                        `/wechat/page/channel-intro?channelId=${
                                            this.state.id
                                        }`
                                    );
                                }}
                            >
                                去设置
                            </div>
                        </div>
                    </div>
                )}
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {};

export default connect(
    mapStateToProps,
    mapActionToProps
)(LivePromoteMethod);
