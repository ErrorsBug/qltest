/*
 * @Author: shuwen.wang
 * @Date: 2017-05-11 10:53:26
 * @Last Modified by: piaorong.zeng
 * @Last Modified time: 2019-01-30 16:32:49
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Page from "components/page";
import { formatMoney, locationTo } from "components/util";

import {
    fetchProfitOverview,
    doWithdraw,
    fetchDepositLimit,
    getBalanceData
} from "../../actions/profit";
import {
    getAgreementVersion,
    getAgreementStatus,
    assignAgreement,
    getWechatNickName
} from "common_actions/common";
import { fetchLiveRole, getRealStatus, getCheckUser, getLiveInfo } from "../../actions/live";
import ProtocolPage from "components/protocol-page";
import { MiddleDialog } from "components/dialog";
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import "./style.scss";


// 提现相关tips
const tips = [
    "4.每笔收入，微信已收取<span>0.6%</span>的手续费",
    "5.如需帮助，可咨询千聊客服<span>（wx: mumu06131207）</span>"
];

class LiveProfitWithdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withdraw: "",
            name: "",
            limit: 2,
            balanceData: 0,
            // 是否选中协议
            isAgree: false,
            // 是否同意过该版本协议，如果同意过，则不可以取消勾选
            agreeStatus: "",
            // 当前讲师协议版本
            agreementVersion: "",
            // 是否显示讲师协议弹窗
            showProtocol: false,
            newRealStatus: 'no',
            realStatus: 'unwrite',
            isShowReal: false,
            isNotBtn: false,
            showClientbox: false,
            teacherQr:'',
            wechatNickName: ""
        };
    }

    get liveId() {
        return this.props.params.liveId;
    }

    async componentDidMount() {
        this.initData();
        const res = await this.props.fetchDepositLimit(this.liveId);
        this.setState({ limit: Number(res.data.limitMoney) });
        if (this.props.deposit === null) {
            this.updateOverview();
        }
        this.initBalanceData();
        this.fetchLiveRole();
        await this.props.getLiveInfo(this.liveId);
        this.dispatchGetWechatNickName();
    }

    async initBalanceData() {
        let result = await this.props.getBalanceData(this.liveId);
        if (result.state.code === 0) {
            this.setState({
                balanceData: result.data.balance
            });
        }
    }

    updateOverview() {
        this.props.fetchProfitOverview(this.liveId);
    }

    // 检查输入是否合法
    validInput = (showToast = false) => {
        return (
            this.validWithdraw(this.state.withdraw, showToast) &&
            this.validName(this.state.name, showToast)
        );
    };
    /**
     * 初始化获取认证状态
     * 
     * 原有的认证信息和新的认证状态信息
     */
    async initData(){
        const { data } = await this.props.getRealStatus(this.liveId,'live');
        const res = await this.props.getCheckUser();
        const newReal = (res.data && res.data.status) || 'no';
        const oldReal = data.status || 'unwrite';
        const hasPriviledge = (res.data && res.data.liveNameCheck === 'N') || false;
        const flag = hasPriviledge || Object.is(newReal, 'pass');
		this.setState({
            newRealStatus: newReal,
            realStatus: oldReal,
            isShowReal: flag,
            isNotBtn: !flag
        });
    }

    /**
     * 检查提现金额的输入
     *
     * @param {any} value 提现金额
     * @param {any} showToast 是否显示toast提示
     * @returns
     *
     * @memberof LiveProfitWithdraw
     */
    validWithdraw(value, showToast) {
        if (value === "") {
            showToast && window.toast("请输入提现金额");
            return false;
        }
        if (!/(^[0-9]*[\.]?[0-9]{0,2}$)/.test(value)) {
            showToast && window.toast("提现金额需为非负数字,最多2位小数");
            return false;
        }
        if (value > this.props.deposit) {
            showToast && window.toast("提现金额不能超过可提现金额");
            return false;
        }
        if (value > this.state.limit * 10000 || value < 1) {
            showToast && window.toast(`提现金额至少1元，上限${this.state.limit}万`);
            return false;
        }
        return true;
    }

    /**
     * 检查姓名输入是否合法
     *
     * @param {any} value 姓名
     * @param {any} showToast 是否显示toast
     * @returns
     *
     * @memberof LiveProfitWithdraw
     */
    validName(value, showToast) {
        if (value === "") {
            showToast && window.toast("请输入收款方姓名");
            return false;
        }
        return true;
    }

    onWithdrawChange = e => {
        this.setState({
            withdraw: e.target.value
        });
    };

    onNameChange = e => {
        this.setState({
            name: e.target.value
        });
    };

    fetchLiveRole() {
        this.props.fetchLiveRole(this.liveId);
    }

    onConfirmClick = async () => {
        if (!this.validInput(true)) {
            return false;
        }
        // 体现金额>=2000，即使后台的实名验证开关已经关闭，但如果没有通过实名认证，强制进行认证
        if (this.state.withdraw >= 2000 && this.state.newRealStatus != 'pass') {
            this.setState({
                isNotBtn: true
            });
            return;
        }
        const result = await this.props.doWithdraw(
            this.liveId,
            this.state.name,
            (this.state.withdraw * 100).toFixed(0)
        );
        if (result && result.state && result.state.code === 0) {
            window.toast("提现成功");
            this.updateOverview();
        }else if (result && result.state && result.state.code === 50004) {
            let url = result.state.msg;

            this.setState({
                showClientbox: true,
                teacherQr:url
            });

        } else {
            window.toast(result.state.msg);
        }
        // 同意讲师协议
        if (this.state.agreeStatus == "N") {
            await assignAgreement({
                liveId: this.liveId,
                version: this.state.agreementVersion
            });
            this.setState({ agreeStatus: "Y" });
        }
    };

    toggleProtocol = () => {
        this.setState({
            showProtocol: !this.state.showProtocol
        });
    };
    toggleClientBox = () => {
        this.setState({
            showClientbox: !this.state.showClientbox
        });
    };

    // 切换服务协议复选框的勾选状态
    toggleAgreeStatus = () => {
        this.setState({
            isAgree: !this.state.isAgree
        });
    };

    clearRealName(){
        this.setState({
            isNotBtn: false
        })
    }

    // 获取创建者的微信昵称
    async dispatchGetWechatNickName() {
        const creatorId = this.props.liveInfo.createBy;
        const res = await getWechatNickName(creatorId);
        if(res) {
            this.setState({
                wechatNickName: res.wechatUserName
            })
        }
    }

    render() {
        const valid = this.validInput();
        return (
            <Page className="live-profit-withdraw-page" title="提现申请">
                <div className="live-profit-withdraw-wrap">
                    <div className="live-profit-withdraw-container">
                        <div className="my-head-wrap">
                            <div className="my-head">
                                <div className="my-com">
                                    <span>可提现金额</span>
                                    <p><strong>{this.props.deposit}</strong></p>
                                </div>
                                <div className="my-com">
                                    <span>历史总收益</span>
                                    <p className="my-total"><strong>{this.props.totalProfit}</strong></p>
                                </div>
                            </div>
                        </div>
                        {this.state.balanceData > 0 && (
                            <div className="last-tip" onClick={() =>
                                locationTo(
                                    `/wechat/page/guest-separate/channel-list-b?liveId=${
                                        this.liveId
                                    }`
                                )
                            }>
                                <span>嘉宾分成待发放金额：</span>
                                <span className="btn-clear">{formatMoney(this.state.balanceData || 0)}元</span>
                            </div>
                        )}
                        <div className="input-container">
                            <div>
                                <div className="main">
                                    <label htmlFor="">提现金额(元)：</label>
                                    <input
                                        onChange={this.onWithdrawChange}
                                        value={this.state.withdraw}
                                        type="number"
                                        placeholder="最小提现金额为1元"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="main">
                                    <label htmlFor="">收款方姓名：</label>
                                    <input
                                        onChange={this.onNameChange}
                                        value={this.state.name}
                                        type="text"
                                        placeholder="请输入实名认证的真实姓名"
                                    />
                                </div>
                            </div>
                        </div>

                        <ol className="tips" start="1">
                            <li>
                                注意
                            </li>
                            <li>
                                1.每笔提现金额至少<span>1元</span>，每日提现上限为
                                <span>{this.state.limit}万</span>
                            </li>
                            <li>
                                
                                2.为保证您的资金安全，提现申请需要<span>实名认证</span>，且姓名必须与<span>直播间创建者</span>在微信上绑定的持卡人姓名一致；<a onClick={() => {
                                locationTo(
                                    `/wechat/page/real-name?reVerify=Y&type=topic&liveId=${this.liveId}`
                                );
                            }} style={{color:'#45779F'}}>去认证 ></a>
                            </li>
                            <li>3.提现到账后，将直接转入<span>微信钱包</span>（微信昵称为：{this.state.wechatNickName}）</li>
                            {tips.map((val, index) => (
                                <li key={index} dangerouslySetInnerHTML={{
                                    __html:val
                                }}></li>
                            ))}
                        </ol>

                        <div
                            className="money-link"
                            onClick={() => {
                                locationTo(
                                    `/wechat/page/live/profit/detail/problem`
                                );
                            }}
                        >
                            提现或资金遇到问题？
                        </div>

                        {/* 讲师协议 */}
                        <MiddleDialog
                            className="protocol-dialog"
                            show={this.state.showProtocol}
                            theme="empty"
                            onClose={this.toggleProtocol}
                            close={true}
                        >
                            <div className="main">
                                <ProtocolPage />
                            </div>
                        </MiddleDialog>

                        <MiddleDialog
                            className="client-dialog"
                            show={this.state.showClientbox}
                            theme="empty"
                            onClose={this.toggleClientBox}
                            close={true}
                        >
                            <div className="main">
                                <span className='s1'>亲爱的老师,为了保障您的资金,特为您提供了专属千聊顾问,她讲一对一协助您完成提现</span>
                                <img src={this.state.teacherQr} />
                                <span className='s2'>长按识别二维码,添加千聊顾问</span>
                            </div>
                        </MiddleDialog>
                    </div>


                </div>
                {this.props.liveRole == "creater" ? (
                            <div className="btn-invalid">
                                <button
                                    className={valid ? "" : "invalid"}
                                    onClick={this.onConfirmClick}
                                >
                                    申请提现
                                </button>
                            </div>
                        ) : null}
                <NewRealNameDialog 
                    show = { this.state.isNotBtn }
                    onClose = {this.clearRealName.bind(this)}
                    realNameStatus = { this.state.realStatus || 'unwrite'}
                    checkUserStatus = { this.state.newRealStatus || 'no' }
                    isClose={ !this.state.isShowReal }
                    liveId = {this.liveId}/>
            </Page>
        );
    }
}

LiveProfitWithdraw.propTypes = {
    deposit: PropTypes.number.isRequired
};

function mapStateToProps(state) {
    return {
        totalProfit: state.profit.total,
        deposit: state.profit.deposit,
        liveRole: state.live.role,
        liveInfo: state.live.liveInfo && state.live.liveInfo.entity
    };
}

const mapActionToProps = {
    fetchProfitOverview,
    doWithdraw,
    fetchDepositLimit,
    getBalanceData,
    fetchLiveRole,
    getRealStatus, 
    getCheckUser,
    getLiveInfo
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(LiveProfitWithdraw);
