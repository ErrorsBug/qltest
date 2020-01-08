import { apiService } from "components/api-service/index";
import { Confirm } from "components/dialog";
import DownCard from "components/down-card/index";
import Page from "components/page";
import { isNumberValid, locationTo } from "components/util";
import { autobind } from "core-decorators";
import * as React from "react";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    canSetInviteReturnConfig,
    getInviteReturnConfig,
    getTopicAutoShare,
    setTopicAutoShare
} from "../../actions/topic-intro";

@autobind
class TopicDistributionSet extends Component {
    state = {
        percent: "",
        type: "auto",
        inviteTotal: "", // 邀请人数
        returnPercent: "", //返还比例
        expireDate: "", // 过期天数
        inviteId: "",
        price: "",
        isRelay: false,
        canISetReturn: false, //是否能设置拉人返现 Y/N
        isOpenShare: "N", //是否开启自动分销
        isOpenInviteReturn: "N" // 是否开启拉人返学费
    };

    async componentDidMount() {
        // await this.fetchCanSetInviteReturnConfig();

        // this.fetchTopicAutoShare();
        // // 能否设置拉人返现
        // if (this.state.canISetReturn) {
        //     this.fetchInviteReturnConfig();
        // }
        this.ajaxGetShareConfig();
    }

    async fetchCanSetInviteReturnConfig() {
        let res = await this.props.canSetInviteReturnConfig({
            businessId: this.props.params.topicId,
            businessType: "topic"
        });
        let shareType = "";
        if (res.state.code === 0) {
            // 当前分销类型 IR:拉人返现, Y:自动分销 N:都未开启
            switch (res.data.shareType) {
                case "IR":
                    shareType = "pull";
                    break;
                case "Y":
                    shareType = "auto";
                    break;
                case "N":
                    shareType = "null";
                    break;
            }
            this.setState({
                canISetReturn: res.data.canSet == "Y",
                type: shareType
            });
        }
    }

    async fetchInviteReturnConfig() {
        const result = await this.props.getInviteReturnConfig({
            businessId: this.props.params.topicId,
            businessType: "topic"
        });
        if (result.state.code === 0) {
            console.log("fetchInviteReturnConfig::", result);
            let { inviteTotal, returnPercent, expireDate, inviteId } =
                result.data.inviteReturnConfig || {};
            this.setState({
                inviteTotal, // 邀请人数
                returnPercent, //返还比例
                expireDate, // 过期天数
                inviteId,
                price: result.data.price
            });
        }
    }

    async fetchTopicAutoShare() {
        const result = await this.props.getTopicAutoShare({
            topicId: this.props.params.topicId
        });

        if (result.state.code === 0) {
            let percent = result.data.percent;
            if (result.data.isAutoshareOpen == "N") {
                percent = "0";
            }

            this.setState({
                percent,
                price: result.data.price
            });

            this.inputEle.focus();
        }
    }

    // 分销比例输入
    percentInput(e) {
        let percent = e.target.value.trim();
        this.setState({ percent });
    }

    // 重新设置分销比例
    confirmEleClick(tag) {
        this.confirmEle.hide();
        // 点击弹窗右边的按钮
        if (tag === "confirm") {
            this.inputEle.select();
        }
        // 点击弹窗左边的按钮
        if (tag === "cancel") {
            this.saveOpenInviteReturn();
        }
    }

    ajaxGetShareConfig = async () => {
        try {
            let result = await apiService.post({
                url: "/h5/share/getShareConfig",
                body: {
                    businessType: "topic",
                    businessId: this.props.params.topicId
                }
            });
            if (result.state.code == 0) {
                this.setState({
                    ...result.data,
                    percent: result.data.sharePercent
                });
            }
        } catch (error) {}
    };

    ajaxSetShareConfig = async () => {
        try {
            let result = await apiService.post({
                url: "/h5/share/saveShareConfig",
                body: {
                    businessType: "topic",
                    businessId: this.props.params.topicId,
                    isOpenShare: this.state.isOpenShare,
                    isOpenInviteReturn: this.state.isOpenInviteReturn,
                    sharePercent: this.state.percent,
                    inviteTotal: this.state.inviteTotal,
                    returnPercent: this.state.returnPercent,
                    expireDate: this.state.expireDate || 5
                }
            });
            if (result.state.code == 0) {
                window.toast('操作成功');
                setTimeout(() => {
                    this.confirmRequest();
                }, 800);
            } else {
            }
        } catch (error) {}
    };

    async confirm() {
        if (this.state.isOpenShare === "Y") {
            // 分销比例必填，0-80
            if (!isNumberValid(this.state.percent, 0, 80, "分销比例")) {
                return;
            }
            // 分销比例是0的时候需要弹窗确认(弹窗最多弹一次))
            if (this.state.percent === "0" && !this.lock) {
                this.lock = true;
                this.confirmEle.show();
                return;
            }
        }
        this.saveOpenInviteReturn();
    }

    saveOpenInviteReturn = () => {
        if (this.state.isOpenInviteReturn === "Y") {
            let { inviteTotal, returnPercent, expireDate }:any = this.state;
            if (
                !isNumberValid(inviteTotal, 1, 100000, "邀请人数") ||
                !isNumberValid(returnPercent, 30, 100, "返现比例") 
            ) {
                return;
            }
            if (returnPercent > 100 || returnPercent < 30) {
                window.toast("返还比例只能设置为30%-100%");
                return;
            }
            if(expireDate && !isNumberValid(expireDate, 1, 10)) {
                window.toast(expireDate > 10 ? '有效期最多可设置为10天' : '请输入1-10的数');
                return;
            }
        }

        this.ajaxSetShareConfig();
    };

    async confirmRequest() {
        // const result = await this.props.setTopicAutoShare({
        //     topicId: this.props.params.topicId,
        //     isAutoshareOpen: Number(this.state.percent) ? "Y" : "N",
        //     percent: Number(this.state.percent)
        // });
        // if (result.state.code === 0) {
        // window.toast("设置成功");
        locationTo(
            `/wechat/page/topic-intro?topicId=${this.props.params.topicId}`
        );
        // }
    }
    // 切换tab
    // handleToggle(type) {
    //     // 相同的需要去除
    //     if (this.state.type == type) {
    //         this.setState({
    //             type: "null"
    //         });
    //     } else {
    //         this.setState({
    //             type,
    //             currentType: type
    //         });
    //     }
    // }
    changeInviteTotal(e, type) {
        this.setState({
            [type]: e.currentTarget.value
        });
    }

    // 暂不使用分销
    didNoUse() {
        // this.setState({
        //     inviteTotal: '', // 邀请人数
        //     returnPercent: '', //返还比例
        //     expireDate: '', // 过期天数
        //     percent: ''
        // })
        locationTo(
            `/wechat/page/topic-intro?topicId=${this.props.params.topicId}`
        );
    }

    onChangeSelected = type => {
        if (type == "share") {
            this.setState({
                isOpenShare: this.state.isOpenShare == "Y" ? "N" : "Y"
            });
        }
        if (type == "payFee") {
            this.setState({
                isOpenInviteReturn:
                    this.state.isOpenInviteReturn == "Y" ? "N" : "Y"
            });
        }
    };

    render() {
        const {
            percent,
            type,
            inviteTotal,
            returnPercent,
            expireDate,
            isRelay,
            price,
            canISetReturn
        } = this.state;
        return (
            <Page
                title="分销比例设置"
                className="topic-distribution-set-container"
            >
                <div className="topic-distribution-top-tip">
                    当前课程定价{price}元
                </div>
                <div className="choose-distribution">
                    <span>*</span>点击选择分销类型（可多选）
                </div>
                <div className="topic-distribution-wrap">
                    <div className="down-card-container">
                        <DownCard
                            className="down-card-wrap"
                            title="自动分销"
                            info="学员未报名也能分销推广"
                            selected={this.state.isOpenShare == "Y"}
                            onClick={() => {
                                this.onChangeSelected("share");
                            }}
                        >
                            <div className="topic-distribution-box">
                                <div className="topic-pull-box">
                                    <div className="topic-pull-item">
                                        <div className="topic-pull-item-inner">
                                            <label
                                                className="topic-pull-item-label require"
                                                htmlFor="pull-man"
                                            >
                                                分成比例（%）
                                            </label>
                                            <input
                                                className="topic-pull-item-input"
                                                ref={el => (this.inputEle = el)}
                                                type="number"
                                                id="pull-man"
                                                value={percent || undefined}
                                                placeholder="建议设置30%-50%"
                                                onChange={this.percentInput.bind(
                                                    this
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pull-tip-box">
                                    <ol>
                                        <li>1.分成比例可设置为0-80%；</li>
                                        <li>
                                            2.用户成功邀请朋友购买课程，可获得分销收益，分销收益
                                            =成交价×分成比例；
                                        </li>
                                        <li>
                                            3.修改分成比例后，已经分享的用户按修改前的分成比例发
                                            放收益，30天内有效；
                                        </li>
                                        <li>
                                            4.用户未购买你的课程，也可参与推广；
                                        </li>
                                        <li>
                                            5.通过知识通商场转载的课程，按照您可获得的收益与课代
                                            表进行分成结算；
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </DownCard>
                    </div>
                    <div className="down-card-container">
                        <DownCard
                            className="down-card-wrap"
                            title="拉人返学费"
                            info="学员分销成功可获学费返还"
                            selected={this.state.isOpenInviteReturn == "Y"}
                            onClick={() => {
                                this.onChangeSelected("payFee");
                            }}
                        >
                            <div className={`topic-distribution-box`}>
                                <div className="topic-pull-box">
                                    <div className="topic-pull-item">
                                        <div className="topic-pull-item-inner">
                                            <label
                                                className="topic-pull-item-label require"
                                                htmlFor="pull-man"
                                            >
                                                邀请人数（人）
                                            </label>
                                            <input
                                                className="topic-pull-item-input"
                                                type="number"
                                                id="pull-man"
                                                value={inviteTotal || undefined}
                                                placeholder="建议设置为2~3人"
                                                onChange={e =>
                                                    this.changeInviteTotal(
                                                        e,
                                                        "inviteTotal"
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="topic-pull-item">
                                        <div className="topic-pull-item-inner">
                                            <label
                                                className="topic-pull-item-label require"
                                                htmlFor="pull-radio"
                                            >
                                                返还比例（%）
                                            </label>
                                            <input
                                                className="topic-pull-item-input"
                                                type="number"
                                                id="pull-radio"
                                                value={returnPercent || undefined}
                                                placeholder="建议设置为100%"
                                                onChange={e =>
                                                    this.changeInviteTotal(
                                                        e,
                                                        "returnPercent"
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="topic-pull-item">
                                        <div className="topic-pull-item-inner">
                                            <label
                                                className="topic-pull-item-label"
                                                htmlFor="pull-time"
                                            >
                                                有效时间（天）
                                            </label>
                                            <input
                                                className="topic-pull-item-input"
                                                type="number"
                                                id="pull-time"
                                                value={expireDate || undefined}
                                                placeholder="不设置默认为5天"
                                                onChange={e =>
                                                    this.changeInviteTotal(
                                                        e,
                                                        "expireDate"
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pull-tip-box">
                                    <ol>
                                        <li>
                                            1.已报名用户，邀请
                                            <span className="font-bold">
                                                {inviteTotal || "N"}位好友
                                            </span>
                                            报名课程，可获得
                                            <span className="font-bold">
                                                {returnPercent || "M"}%学费返还
                                            </span>
                                            ，学费指该笔订单的直播间净收益；
                                        </li>
                                        <li>2.返还比例可设置为30%-100%；</li>
                                        <li>
                                            3.必须邀请指定人数的好友购买课程，才能获得学费返还；只完成部分任务，不返还；
                                        </li>
                                        <li>
                                            4.为保证准时给完成任务的用户发放返现学费。
                                        </li>
                                        <li>
                                            5.用户支付金额大于1元，才能参与返学费。
                                        </li>
                                    </ol>
                                    <div className="font-bold">
                                        从用户成交日起，冻结该笔订单预设要返还给用户的部分，超过有效时间直播间方可提现。
                                    </div>
                                </div>
                            </div>
                        </DownCard>
                    </div>
                </div>
                <div className="btn-group">
                    <div className="topic-no-use" onClick={this.didNoUse}>
                        <span>暂不修改</span>
                    </div>
                    <div className="confirm" onClick={this.confirm.bind(this)}>
                        <span>确定</span>
                    </div>
                </div>

                <Confirm
                    ref={el => (this.confirmEle = el)}
                    className="distribution-confirm"
                    title="您确定要把分销奖励设为0%吗？"
                    cancelText="确定"
                    confirmText="重新设置"
                    bghide={true}
                    onBtnClick={this.confirmEleClick}
                >
                    <div className="content">
                        用户分享课程将没有奖励，不利于课程推广，您无法获得最大的课程收益~
                    </div>
                </Confirm>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {
    getTopicAutoShare,
    setTopicAutoShare,
    getInviteReturnConfig,
    canSetInviteReturnConfig
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(TopicDistributionSet);
