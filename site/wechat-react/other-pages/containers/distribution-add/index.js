import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { isNumberValid } from "components/util";
// actions
import {
    saveAddDistributionUser,
    channelProfit
} from "../../actions/channel-distribution";
import Switch from "../../../components/switch";
import Picker from "../../../components/picker/components/picker";
import { LIVE_VALID_TIME_OPTIONS, LIVE_VALID_TIME_FOREVER } from "./constant";
import { saveAddDistributionTopic } from "../../actions/topic";
import { saveAddDistributionLive } from "../../actions/live";

class AuthDistributionAdd extends Component {
    state = {
        percent: 80,
        restPercent: 19.4,
        count: undefined,
        isRelay: false,
        profit: null,
        relayPercent: null,
        businessId: "",
        type: "live",
        isTopicFree: false,
        liveValidTime: LIVE_VALID_TIME_FOREVER
    };

    data = {
        intRegExp: /^[1-9][0-9]*?$/
    };

    async componentDidMount() {
        // 获取新增课代表类型和id
        const {
            location: {
                query: { type }
            },
            params: { businessId }
        } = this.props;
        switch (type) {
            case "channel":
                const res = await this.props.channelProfit(
                    this.props.params.channelId
                );
                this.setState({
                    percent: res.data.isRelay === "Y" ? 0 : 80,
                    profit: res.data.knowledgeProfit,
                    isRelay: res.data.isRelay === "Y",
                    relayPercent: res.data.knowledgePercent
                });
                break;
            default:
                break;
        }
        this.setState({
            businessId,
            type
        });
    }

    async changePercentFunc(e) {
        const { isRelay, type } = this.state;
        var percent = e.currentTarget.value;
        var upperLimit = type === "channel" && this.state.isRelay ? 100 : 80;
        if (
            !percent ||
            (this.data.intRegExp.test(percent) && +percent <= upperLimit)
        ) {
            this.setState({
                percent: +percent,
                restPercent: (99.4 - percent).toFixed(2)
            });
        } else {
            window.toast("比例超出分销范围");
        }
    }

    async changeCountFunc(e) {
        const [min, max] = [1, 20];
        const number = e.currentTarget.value;
        let count = number;
        if (number > max) {
            count = max;
            window.toast(`链接每次最多生成${max}个`);
        }
        else if (number < min) {
            count = min;
            window.toast(`链接最少生成${min}个`)
        }
        this.setState({
            count 
        });
    }

    async saveAddDistribution() {
        const { percent, count, isRelay } = this.state;
        const upperLimit = isRelay ? 100 : 80;
        if (
            isNumberValid(count, 1, 20, "课代表数量") &&
            isNumberValid(percent, 1, upperLimit, "课代表分成比例")
        ) {
            let res;
            const { type, businessId, isTopicFree, liveValidTime } = this.state;
            switch (type) {
                case "channel":
                    res = await this.props.saveAddDistributionUser(
                        percent,
                        count,
                        businessId
                    );
                    break;
                case "topic":
                    res = await this.props.saveAddDistributionTopic(
                        percent,
                        count,
                        businessId,
                        isTopicFree ? "Y" : "N"
                    );
                    break;
                default:
                    res = await this.props.saveAddDistributionLive(
                        percent,
                        count,
                        businessId,
                        liveValidTime
                    );
                    break;
            }
            window.toast(res.state.msg);
            if (res.state.code === 0) {
                setTimeout(() => {
                    window.history.go(-1);
                }, 1000);
            }
        }
    }

    handleSwitchChange = () => {
        this.setState({
            isTopicFree: !this.state.isTopicFree
        });
    };

    handlePickerChange = ([liveValidTime]) => {
        this.setState({
            liveValidTime
        });
    };

    render() {
        const {
            percent,
            profit,
            count,
            isRelay,
            relayPercent,
            type,
            isTopicFree,
            liveValidTime
        } = this.state;

        const actualPercent = (percent * relayPercent) / 100;
        const classPresidentProfit = Math.floor(profit * percent) / 100;
        const yourProfit =
            Math.floor((profit - classPresidentProfit) * 100) / 100;

        return (
            <Page title="添加课代表" className="page-distribution-set">
                <section className="setting-percent">
                    <div className="setClass-percent">
                        <span className="setClass-percent-span">
                            <i>%</i>
                        </span>
                        <span className="setClass-percent-span1">
                            设置
                            {type === "channel"
                                ? "系列课"
                                : type === "topic"
                                ? "话题"
                                : "直播间"}
                            分成比例
                        </span>
                    </div>
                    <div className="percent-input">
                        <span className="s-2">
                            <input
                                id="percent-input"
                                placeholder={`请输入分成比例(1-${
                                    isRelay ? 100 : 80
                                })`}
                                type="number"
                                value={percent || undefined}
                                onChange={this.changePercentFunc.bind(this)}
                            />
                        </span>
                        <span className="s-1">%</span>
                        {type === "channel" ? (
                            isRelay ? (
                                <div className="input-tips">
                                    <div>
                                        该课为转载课，即课代表实际分成比例为
                                        <strong>{actualPercent || "--"}</strong>
                                        %
                                    </div>
                                    <div>
                                        您的单课收益为
                                        <strong>{profit || "--"}</strong>
                                        元，分销后课代表得
                                        <strong>
                                            {classPresidentProfit || "--"}
                                        </strong>
                                        元，您得
                                        <strong>{yourProfit || "--"}</strong>元
                                    </div>
                                </div>
                            ) : (
                                <div className="input-tips">
                                    课代表得{percent || '?'}
                                    %，微信得0.6%，剩下
                                    {restPercent || '?'}%归你所有
                                </div>
                            )
                        ) : null}
                    </div>
                    <div className="percent-input">
                        <span>
                            <input
                                id="count-input"
                                placeholder="设置生成数量，每次最多20个"
                                type="number"
                                value={count}
                                onChange={this.changeCountFunc.bind(this)}
                            />
                        </span>
                        <div className="input-tips">
                            一个
                            {type === "channel"
                                ? "系列课"
                                : type === "live"
                                ? "直播间"
                                : "话题"}
                            最多生成
                            {type === "channel"
                                ? 500
                                : type === "live"
                                ? 2000
                                : 200}
                            个分销授权，每次生成不能超过20个
                        </div>
                    </div>
                    {type === "topic" && (
                        <div className="percent-addition">
                            <span>当前话题课代表免费</span>
                            <Switch
                                active={isTopicFree}
                                size="md"
                                onChange={this.handleSwitchChange}
                            />
                        </div>
                    )}
                    {type === "live" && (
                        <div className="percent-addition">
                            <span>课代表与用户推广关系有效期</span>
                            <Picker
                                data={LIVE_VALID_TIME_OPTIONS}
                                value={[liveValidTime]}
                                onChange={this.handlePickerChange}
                            >
                                <div className="c-flex-middle">
                                    {
                                        (
                                            LIVE_VALID_TIME_OPTIONS.filter(
                                                o => o.value == liveValidTime
                                            ).pop() || {}
                                        ).label
                                    }
                                    <img
                                        className="c-ml-10"
                                        src={require("./assets/icon-right.png")}
                                        width={16}
                                        height={16}
                                    />
                                </div>
                            </Picker>
                        </div>
                    )}
                    <div
                        className="percent-submit"
                        onClick={this.saveAddDistribution.bind(this)}
                    >
                        生成分销授权链接
                    </div>
                </section>
                <section className="process-detail">
                    <h1>具体流程</h1>
                    <p>1. 生成分销授权链接，发送给被授权用户</p>
                    <p>2. 对方点击后即成为本次系列课的课代表</p>
                    <p>
                        {`3. ${
                            type === "channel"
                                ? "课代表分享专属邀请卡或链接，产生交易即可的收益分成"
                                : type === "topic"
                                ? "分享收入微信会收取0.6%的手续费"
                                : "直播间课代表对于付费系列课和话题没有免费使用权限"
                        }`}
                    </p>
                </section>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {
    saveAddDistributionUser,
    channelProfit,
    saveAddDistributionTopic,
    saveAddDistributionLive
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(AuthDistributionAdd);
