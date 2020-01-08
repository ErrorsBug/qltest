import React, { Component, Fragment } from "react";
import { createPortal } from "react-dom";
import { connect } from "react-redux";
import Page from "components/page";
import ScrollToLoad from "components/scrollToLoad";
import { Confirm } from "components/dialog";
import { autobind } from "core-decorators";
import { getUserInfo, request } from "common_actions/common";
import { resendName } from "../../actions/takeincome-record";
import { Tab, TabItem } from "./components/tab";
import {
    GuestProfitTab,
    GuestProfitTabItem,
    GuestItem
} from "./components/guest-profit";
const PAGE_SIZE = 10;

@autobind
class TakeincomeRecord extends Component {
    state = {
        resendName: "",
        takeincomeRecord: [],
        takeincomeRecordNoMore: false,
        takeincomeRecordPage: 1,
        topicIncomeList: [],
        topicIncomeNoMore: false,
        topicIncomePage: 1,
        channelIncomeList: [],
        channelIncomeNoMore: false,
        channelIncomePage: 1,
        liveCampIncomeList: [],
        liveCampIncomeNoMore: false,
        liveCampIncomePage: 1
    };

    data = {
        tempRecord: null
    };

    get liveId() {
        return this.props.location.query["liveId"];
    }

    portalBody = null;
    confirmRef = null;

    async componentDidMount() {
        this.portalBody = document.querySelector(".portal-low");
        await this.props.getUserInfo();
        this.getTakeincomeRecord();
        this.getIncomeList("topic", undefined, undefined, true);
    }

    async getTakeincomeRecord(page = 1, size = PAGE_SIZE) {
        const result = await request.post({
            url: "/api/wechat/transfer/h5/live/reward/withdrawRecord",
            body: {
                liveId: this.liveId,
                userId: this.props.userInfo.user.userId,
                page: {
                    page,
                    size
                }
            }
        });

        if (result.state.code === 0) {
            this.setState({
                takeincomeRecord: this.state.takeincomeRecord.concat(
                    result.data.list
                ),
                takeincomeRecordPage: page,
                takeincomeRecordNoMore:
                    result.data.list.length < PAGE_SIZE ? true : false
            });
        }
    }

    showModal(record) {
        this.data.tempRecord = record;
        this.confirmRef.show();
    }

    // confirm 点击事件回调
    async onClickDialog(e) {
        if (e === "confirm") {
            const postData = {
                liveId: this.props.location.query.liveId,
                userId: this.props.userInfo.user.userId,
                name: this.state.resendName,
                recordId: this.data.tempRecord && this.data.tempRecord.id
            };
            const res = await this.props.resendName(postData);
            if (res.code === 0) {
                this.confirmRef.hide();
            }
        }
    }

    onNameChange(e) {
        console.log(e.target.value);
        this.setState({
            resendName: e.target.value
        });
    }

    onModalHide() {
        this.data.tempRecord = null;
        this.setState({
            resendName: ""
        });
    }

    async fetchIncomeList(type, page, size) {
        const res = await request.post({
            url: "/api/wechat/transfer/h5/guest/liveGuestTransferRecord",
            body: {
                liveId: this.liveId,
                type,
                page: {
                    page,
                    size
                }
            }
        });
        if (res.state.code === 0) {
            return res.data;
        }
    }

    /**
     * 获取类型发放列表
     * @param {string} type 类型：topic 单课，channel 系列课， liveCamp 打卡
     * @param {number} page 当前分页
     * @param {number} size 分页大小
     * @param {boolean} init 是否初始化列表
     */
    async getIncomeList(type, page = 1, size = PAGE_SIZE, init = false) {
        let res = await this.fetchIncomeList(type, page, size);
        if (res) {
        this.setState({
                [`${type}IncomeList`]: init
                    ? res.list
                    : this.state[`${type}IncomeList`].concat(res.list),
                [`${type}IncomeNoMore`]: res.list.length < size ? true : false,
                [`${type}IncomePage`]: page
            });
        }
    }

    // 嘉宾发放明细切换tab
    onGuestSwitchTab(key) {
        if (
            this.state[`${key}IncomeList`] &&
            this.state[`${key}IncomeList`].length <= 0
        ) {
            this.getIncomeList(key);
        }
    }

    renderItem(record) {
        if (record.type === "SUCCESS" || record.repayResult === "SUCCESS") {
            return "已汇入直播间创建者的钱包";
        } else if (record.type === "AWAITING") {
            return "已提交微信审批";
        } else if (record.type == "FAIL" && record.errorInfo == "NAME_MATCH") {
            return "再次进行姓名认证，认证通过会立刻到账";
        } else if (
            record.type == "FAIL" &&
            record.errorInfo == "NAME_MISMATCH"
        ) {
            return "姓名校验失败，微信钱包绑定银行卡姓名所有者的真实姓名必须与平台实名认证姓名一致，如未绑定银行卡，请先将微信钱包绑定银行卡";
        } else if (record.type == "NO_PASS") {
            return "因违规提现请求已中止，请联系千聊客服";
        } else {
            return "正在处理中";
        }
    }

    render() {
        return (
            <Page title="提现记录" className="takeincome-record">
                <Tab>
                    <TabItem title="直播间提现明细">
                        <ScrollToLoad
                            className="takeincome-list scroller"
                            none={this.state.takeincomeRecord.length <= 0}
                            noMore={this.state.takeincomeRecordNoMore}
                            loadNext={async done => {
                                await this.getTakeincomeRecord(
                                    this.state.takeincomeRecordPage + 1
                                );
                                done();
                            }}
                        >
                            <div className="content">
                                <ul className="record-list">
                                    {this.state.takeincomeRecord &&
                                        this.state.takeincomeRecord.map(
                                            record => {
                                                return (
                                                    <li
                                                        className="record-item"
                                                        key={record.id}
                                                    >
                                                        {record.accountType ===
                                                            "PTP" && (
                                                            <Fragment>
                                                                <p>
                                                                    <span className="title">
                                                                        申请时间：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {
                                                                            record.creatTime
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        申请金额：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {
                                                                            record.withdrawAmount
                                                                        }
                                                                        元
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        服务费率：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {record.withdrawAmount >
                                                                        200000
                                                                            ? "3"
                                                                            : "5"}
                                                                        %
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        预计到账时间：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {/* 提交申请后15天内 */}
                                                                        {record.withdrawAmount >=
                                                                            20000 &&
                                                                            record.withdrawAmount <=
                                                                                200000 &&
                                                                            "提交申请后15天"}
                                                                        {record.withdrawAmount >
                                                                            200000 &&
                                                                            record.withdrawAmount <=
                                                                                500000 &&
                                                                            "提交申请后10天"}
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        特别说明：
                                                                    </span>
                                                                    <span className="desc">
                                                                        如有疑问，请联系千聊木木：mumu06131207
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        申请状态：
                                                                    </span>
                                                                    <span
                                                                        className={[
                                                                            "desc",
                                                                            record.type.toLowerCase()
                                                                        ].join(
                                                                            " "
                                                                        )}
                                                                    >
                                                                        【公对公打款】
                                                                        {record.type ===
                                                                            "SUCCESS" &&
                                                                            "申请成功"}
                                                                        {record.type ===
                                                                            "PWAITING" &&
                                                                            "申请中"}
                                                                        {record.type ===
                                                                            "NO_PASS" &&
                                                                            "申请失败"}
                                                                    </span>
                                                                </p>
                                                                {record.type ===
                                                                    "NO_PASS" && (
                                                                    <p>
                                                                        <span className="title">
                                                                            申请不通过原因：
                                                                        </span>
                                                                        <span className="desc no_pass">
                                                                            {
                                                                                record.rejectReason
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                )}
                                                            </Fragment>
                                                        )}
                                                        {record.accountType ===
                                                            "GUEST_OP" && (
                                                            <Fragment>
                                                                <p>
                                                                    <span className="title">
                                                                        提现时间：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {
                                                                            record.creatTime
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        提现金额：
                                                                    </span>
                                                                    <span className="desc money">
                                                                        {
                                                                            record.withdrawAmount
                                                                        }
                                                                        元(嘉宾分成发放)
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        预计到账时间：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {/* 提交申请后15天内 */}
                                                                        {
                                                                            record.transferTime
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        提现状态：
                                                                    </span>
                                                                    <span
                                                                        className={[
                                                                            "desc withdraw-status",
                                                                            record.type.toLowerCase()
                                                                        ].join(
                                                                            " "
                                                                        )}
                                                                    >
                                                                        {record.type ==
                                                                            "SUCCESS" ||
                                                                        record.repayResult ==
                                                                            "SUCCESS"
                                                                            ? `已汇入嘉宾${record.guestName}的微信钱包`
                                                                            : "正在处理中"}
                                                                    </span>
                                                                </p>
                                                            </Fragment>
                                                        )}
                                                        {record.accountType ===
                                                            "WARES_REFUND" && (
                                                            <Fragment>
                                                                <p>
                                                                    <span className="title">
                                                                        提现时间：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {
                                                                            record.creatTime
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        提现金额：
                                                                    </span>
                                                                    <span className="desc money">
                                                                        {
                                                                            record.withdrawAmount
                                                                        }
                                                                        元(退款)
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        预计到账时间：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {/* 提交申请后15天内 */}
                                                                        {
                                                                            record.transferTime
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        提现状态：
                                                                    </span>
                                                                    <span
                                                                        className={[
                                                                            "desc withdraw-status",
                                                                            record.type.toLowerCase()
                                                                        ].join(
                                                                            " "
                                                                        )}
                                                                    >
                                                                        {record.type ==
                                                                            "SUCCESS" ||
                                                                        record.repayResult ==
                                                                            "SUCCESS"
                                                                            ? `退款已汇入用户${record.guestName}的微信钱包`
                                                                            : "［退款］正在处理中"}
                                                                    </span>
                                                                </p>
                                                            </Fragment>
                                                        )}
                                                        {!(
                                                            record.accountType ===
                                                                "PTP" ||
                                                            record.accountType ===
                                                                "GUEST_OP" ||
                                                            record.accountType ===
                                                                "WARES_REFUND"
                                                        ) && (
                                                            <Fragment>
                                                                <p>
                                                                    <span className="title">
                                                                        提现时间：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {
                                                                            record.creatTime
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        提现金额：
                                                                    </span>
                                                                    <span className="desc money">
                                                                        {
                                                                            record.withdrawAmount
                                                                        }
                                                                        元
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        预计到账时间：
                                                                    </span>
                                                                    <span className="desc">
                                                                        {/* 提交申请后15天内 */}
                                                                        {
                                                                            record.transferTime
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <span className="title">
                                                                        提现状态：
                                                                    </span>
                                                                    <span
                                                                        className={[
                                                                            "desc withdraw-status",
                                                                            record.type.toLowerCase()
                                                                        ].join(
                                                                            " "
                                                                        )}
                                                                    >
                                                                        {this.renderItem(
                                                                            record
                                                                        )}
                                                                        {record.type ==
                                                                            "FAIL" &&
                                                                            record.errorInfo ==
                                                                                "NAME_MISMATCH" && (
                                                                                <div className="btn-wrapper">
                                                                                    <a
                                                                                        href="javascript:;"
                                                                                        onClick={() => {
                                                                                            this.showModal(
                                                                                                record
                                                                                            );
                                                                                        }}
                                                                                        className="link-btn send-again"
                                                                                    >
                                                                                        重新提交申请
                                                                                    </a>
                                                                                    <a
                                                                                        href="/wechat/page/real-name?reVerify=Y&type=topic"
                                                                                        className="link-btn verify-again"
                                                                                    >
                                                                                        重新实名认证
                                                                                    </a>
                                                                                </div>
                                                                            )}
                                                                    </span>
                                                                </p>
                                                            </Fragment>
                                                        )}
                                                    </li>
                                                );
                                            }
                                        )}
                                </ul>
                            </div>
                        </ScrollToLoad>
                    </TabItem>
                    <TabItem title="嘉宾发放明细">
                        <GuestProfitTab
                            topicIncomeList={this.state.topicIncomeList}
                            channelIncomeList={this.state.channelIncomeList}
                            liveCampIncomeList={this.state.liveCampIncomeList}
                            topicIncomeNoMore={this.state.topicIncomeNoMore}
                            channelIncomeNoMore={this.state.channelIncomeNoMore}
                            liveCampIncomeNoMore={
                                this.state.liveCampIncomeNoMore
                            }
                            topicIncomePage={this.state.topicIncomePage}
                            channelIncomePage={this.state.channelIncomePage}
                            liveCampIncomePage={this.state.liveCampIncomePage}
                            onSwitch={this.onGuestSwitchTab}
                            defaultTabKey={"topic"}
                        >
                            <GuestProfitTabItem title="话 题" tabKey="topic">
                                <ScrollToLoad
                                    className="guest-profit-scroller scroller"
                                    none={
                                        this.state.topicIncomeList.length <= 0
                                    }
                                    noMore={this.state.topicIncomeNoMore}
                                    loadNext={async done => {
                                        await this.getIncomeList(
                                            "topic",
                                            this.state.topicIncomePage + 1
                                        );
                                        done();
                                    }}
                                >
                                    <div className="content">
                                        <ul className="record-list">
                                            {this.state.topicIncomeList.map(
                                                record => {
                                                    return (
                                                        <GuestItem
                                                            key={record.id}
                                                            record={record}
                                                        />
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </div>
                                </ScrollToLoad>
                            </GuestProfitTabItem>
                            <GuestProfitTabItem title="系列课" tabKey="channel">
                            <ScrollToLoad
                                    className="guest-profit-scroller scroller"
                                    none={
                                        this.state.channelIncomeList.length <= 0
                                    }
                                    noMore={this.state.channelIncomeNoMore}
                                    loadNext={async done => {
                                        await this.getIncomeList(
                                            "channel",
                                            this.state.channelIncomePage + 1
                                        );
                                        done();
                                    }}
                                >
                                    <div className="content">
                                        <ul className="record-list">
                                            {this.state.channelIncomeList.map(
                                                record => {
                                                    return (
                                                        <GuestItem
                                                            key={record.id}
                                                            record={record}
                                                        />
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </div>
                                </ScrollToLoad>
                            </GuestProfitTabItem>
                            <GuestProfitTabItem title="打 卡" tabKey="liveCamp">
                            <ScrollToLoad
                                    className="guest-profit-scroller scroller"
                                    none={
                                        this.state.liveCampIncomeList.length <= 0
                                    }
                                    noMore={this.state.liveCampIncomeNoMore}
                                    loadNext={async done => {
                                        await this.getIncomeList(
                                            "liveCamp",
                                            this.state.liveCampIncomePage + 1
                                        );
                                        done();
                                    }}
                                >
                                    <div className="content">
                                        <ul className="record-list">
                                            {this.state.liveCampIncomeList.map(
                                                record => {
                                                    return (
                                                        <GuestItem
                                                            key={record.id}
                                                            record={record}
                                                        />
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </div>
                                </ScrollToLoad>
                            </GuestProfitTabItem>
                        </GuestProfitTab>
                    </TabItem>
                </Tab>

                {this.portalBody &&
                    createPortal(
                        <Confirm
                            ref={ref => {
                                this.confirmRef = ref;
                            }}
                            title="重新提交申请"
                            onBtnClick={this.onClickDialog}
                            onClose={this.onModalHide}
                        >
                            <div className="takeincome-record-resend-name">
                                <input
                                    className="resend-name-input"
                                    type="text"
                                    placeholder="在此填写姓名，必须和实名认证时填写的一致"
                                    value={this.state.resendName}
                                    onChange={this.onNameChange}
                                />
                            </div>
                        </Confirm>,
                        this.portalBody
                    )}
            </Page>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.common.userInfo
    };
};

const mapDispatchToProps = {
    getUserInfo,
    resendName
};

export default connect(mapStateToProps, mapDispatchToProps)(TakeincomeRecord);
