import React, { Component } from "react";
import { autobind, throttle } from "core-decorators";
import Page from "components/page";
import { connect } from "react-redux";

import { formatMoney, locationTo, getVal } from "components/util";
import NewRealNameDialog from "components/dialogs-colorful/new-real-name";
import ScrollToLoad from "components/scrollToLoad";
import { request } from "common_actions/common";

import { getRealStatus, getCheckUser } from "../../../actions/live";
import { userBindKaiFang } from "../../../../actions/common";
import {
    myDistributionAccount,
    distributionAccountWithdraw
} from "../../../actions/mine";
import ProfitCard from "../../../components/profit-card";
import { ProfitTabBar, ProfitTab } from "../../../components/profit-tab";
import {
    RewardProfitDetail,
    RewardWithdrawDetail
} from "../../../components/reward-profit-detail";
import WithdrawPullup from "../../../components/withdraw-pullup";
import Confirm from "components/dialog/confirm";
import { getCookie } from 'components/util';

const PAGE_SIZE = 20;

@autobind
class RewardProfit extends Component {
    state = {
        limit: 2,
        isNotBtn: false,
        showWithdraw: false,
        account: {},
        profitRecordList: [],
        profitRecordPage: 1,
        profitRecordNoMore: false,
        withdrawRecordList: [],
        withdrawRecordPage: 1,
        withdrawRecordNoMore: false,
        currentTab: 0,
        wechatNickName: ""
    };

    get userId() {
        return getCookie('userId');
    } 
    get liveId() {
        return this.props.location.query.liveId;
    }
    componentDidMount() {
        this.initDataReal();
        this.getRewardProfitRecord();
        this.getRewardWithdrawRecord();
        this.getRewardAccount();
        this.getWechatNickName();
    }

	async initDataReal(){
		let data = {};
		// 部分用户没有直播间 liveId = 'undefined'
		if (Number(this.liveId)) {
			data = await this.props.getRealStatus(this.liveId, 'live');
		}
        const res = await this.props.getCheckUser();
		const newReal = (res.data && res.data.status) || 'no';
		const hasPriviledge = (res.data && res.data.userNameCheck === 'N') || false;
        const oldReal = data.status || 'unwrite';
        const flag = hasPriviledge || Object.is(newReal, 'pass');
		this.setState({
            newRealStatus: newReal,
            realStatus: oldReal,
            isNotBtn: !flag,
        });
    }


    // 从开放平台过来的用户要绑定三方和关注直播间
    initUserBindKaiFang() {
        let kfAppId = getVal(this.props, "location.query.kfAppId", "");
        let kfOpenId = getVal(this.props, "location.query.kfOpenId", "");

        if (kfAppId && kfOpenId) {
            this.props.userBindKaiFang({
                kfAppId,
                kfOpenId
            });
        }
    }

    async withdrawMoney() {
        // // 体现金额>=2000，即使后台的实名验证开关已经关闭，但如果没有通过实名认证，强制进行认证
        // if (this.state.withdraw >= 2000 && this.state.newRealStatus != 'pass') {
        //     this.setState({
        //         isNotBtn: true
        //     });
        //     return;
        // }
        // const res = await this.props.distributionAccountWithdraw({
        // 	realName: this.state.name,
        // 	totalFee: this.state.withdraw * 100
        // });
        // if(res.state.code === 0){
        // 	window.toast(`提现成功${res.state.msg || ''}`);
        // 	this.setState({
        // 		withdrawableMoney: res.data.balance || 0
        // 	});
        // }else{
        // 	window.toast(res.state.msg);
        // }
    }

    // closeAuthConfirm(){
    // 	this.authConfirm.hide();
    // }

    // @throttle(1000)
    // async authConfirmClickHandle(){
    // 	if (!this.validInput(true)) {
    //         return false;
    // 	}
    //     this.withdrawMoney();
    // }

    /**
     * 检查是否勾选同意协议
     *
     * @param {any} showToast 是否显示toast
     * @returns
     *
     * @memberof LiveProfitWithdraw
     */

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
        if (value > this.state.withdrawableMoney / 100) {
            showToast && window.toast("提现金额不能超过可提现金额");
            return false;
        }
        if (value > this.state.limit * 10000 || value < 1) {
            showToast &&
                window.toast(`提现金额至少1元，上限${this.state.limit}万`);
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
    // 检查输入是否合法
    validInput = (param,showToast = false) => {
        return (
            this.validWithdraw(param.withdraw, showToast) &&
            this.validName(param.name, showToast)
        );
    };

    clearRealName() {
        this.setState({
            isNotBtn: false
        });
    }

    hideWithdraw() {
        this.setState({
            showWithdraw: false
        });
    }

    // 发起提现
    async withdraw(param) {
        try {
            const result = await request({
                url: "/api/wechat/transfer/h5/reward/withDraw",
                method: "POST",
                body: param
            });
            if(result.state.code === 0) {
                this.setState({
                    showWithdraw: false
                });
                this.getRewardAccount();
                this.getRewardWithdrawRecord(1, PAGE_SIZE, true);
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async getRewardAccount() {
        try {
            const result = await request({
                url: "/api/wechat/transfer/h5/reward/myRewardAccount",
                method: "POST",
                body: {}
            });
            if (result.state.code === 0) {
                const { balance, totalIncome, realName } = result.data;
                this.setState({
                    account: {
                        balance,
                        totalIncome,
                        realName
                    },
                    withdrawableMoney: balance
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 获取收益明细
    async getRewardProfitRecord(page = 1, size = PAGE_SIZE) {
        try {
            const result = await request({
                url: "/api/wechat/transfer/h5/reward/myRewardProfitRecord",
                method: "POST",
                body: {
                    page: {
                        page,
                        size
                    }
                }
            });
            if (result.state.code === 0) {
                const { recordList } = result.data;
                this.setState({
                    profitRecordList: this.state.profitRecordList.concat(
                        recordList
                    ),
                    profitRecordPage: page,
                    profitRecordNoMore: recordList.length < PAGE_SIZE
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 获取提现记录
    async getRewardWithdrawRecord(page = 1, size = PAGE_SIZE, reload = false) {
        try {
            const result = await request({
                url: "/api/wechat/transfer/h5/reward/withdrawRecord",
                method: "POST",
                body: {
                    page: {
                        page,
                        size
                    }
                }
            });
            if (result.state.code === 0) {
                const obj = {
                    withdrawRecordPage: page,
                }
                if(reload) {
                    obj.withdrawRecordList = result.data.recordList;
                } else {
                    obj.withdrawRecordList = this.state.withdrawRecordList.concat(result.data.recordList);
                }
                obj.withdrawRecordNoMore = result.data.recordList.length < PAGE_SIZE;
                this.setState(obj);
            }
        } catch (error) {
            console.error(error);
        }
    }

    onWithdraw(param) {
        if(!this.validInput(param,true)) {
            return ;
        }
        if (param.withdraw >= 2000 && this.state.newRealStatus != 'pass') {
            this.setState({isNotBtn: true});
            return;
        }
        this.withdraw({
            totalFee: (param.withdraw * 100).toString(),
            realName: param.name
        })
        
    }

    // 重新提交提现申请
    async reWithdraw(record) {
        this.setState({
            renameRecordId: record.id
        });

        this.confirmRef.show();
    }
    async onConfirmReWithdraw(e) {
        if(e === 'confirm') {
            if(this.state.rename.length === 0) {
                window.toast("请输入姓名");
                return ;
            }
            try {
                const result = await request({
                    url: "/api/wechat/transfer/h5/account/saveRealName",
                    method: "POST",
                    body: {
                        name: this.state.rename,
                        recordId: this.state.renameRecordId
                    }
                });
                if (result.state.code === 0) {
                    await this.getRewardWithdrawRecord(1, PAGE_SIZE, true);
                    this.confirmRef.hide();
                }
                window.toast(result.state.msg);
            } catch (error) {
                console.error(error);
            }

        } else {
            this.confirmRef.hide();
        }
    }

    	// 获取用户微信昵称
	async getWechatNickName() {
		try {
			const result = await request({
				url: "/api/wechat/transfer/h5/user/getWechatUserName",
				method: "POST",
				body: {
                    findNameUserId: this.userId
                }
			});
			if (result.state.code === 0) {
				this.setState({
					wechatNickName: result.data.wechatUserName
				});
			}
		} catch (error) {
			console.error(error);
		}
	}


    render() {
        const { account } = this.state;
        return (
            <Page title="我的赞赏收益" className="my-reward-profit">
                <div className="container">
                    <ScrollToLoad
                        className={"profit-scroll-box"}
                        toBottomHeight={50}
                        noneOne={
                            this.state.currentTab === 0
                                ? this.state.profitRecordList.length === 0
                                : this.state.withdrawRecordList.length === 0
                        }
                        loadNext={async done => {
                            if (this.state.currentTab === 0) {
                                await this.getRewardProfitRecord(
                                    this.state.profitRecordPage + 1
                                );
                                done();
                            } else {
                                await this.getRewardWithdrawRecord(
                                    this.state.withdrawRecordPage + 1
                                );
                                done();
                            }
                        }}
                        noMore={
                            this.state.currentTab === 0
                                ? this.state.profitRecordNoMore
                                : this.state.withdrawRecordNoMore
                        }
                    >
                        <ProfitCard
                            className="red"
                            withdrawAmount={account.balance / 100}
                            total={account.totalIncome / 100}
                            onApplyWithDraw={() => {
                                this.setState({
                                    showWithdraw: true
                                });
                            }}
                        />
                        <ProfitTabBar
                            onSwitchTab={idx => {
                                this.setState({
                                    currentTab: idx
                                });
                            }}
                        >
                            <ProfitTab title="收益明细">
                                {this.state.profitRecordList.map(
                                    (record, index) => (
                                        <RewardProfitDetail
                                            record={record}
                                            key={index}
                                        />
                                    )
                                )}
                            </ProfitTab>
                            <ProfitTab title="提现明细">
                                <div className="reward-withdraw-list">
                                    {this.state.withdrawRecordList.map(
                                        (record, index) => {
                                            return (
                                                <RewardWithdrawDetail
                                                    reSubmit={this.reWithdraw}
                                                    record={record}
                                                    key={index}
                                                />
                                            );
                                        }
                                    )}
                                </div>
                            </ProfitTab>
                        </ProfitTabBar>
                    </ScrollToLoad>
                </div>
                <WithdrawPullup
                    wechatNickName={this.state.wechatNickName}
                    show={this.state.showWithdraw}
                    onClose={this.hideWithdraw}
                    onOk={this.onWithdraw}
                />
                <NewRealNameDialog
                    bghide={false}
                    show={this.state.isNotBtn}
                    onClose={this.clearRealName.bind(this)}
                    realNameStatus={this.state.realStatus || "unwrite"}
                    checkUserStatus={this.state.newRealStatus || "no"}
                    isClose={true}
                    liveId={this.liveId}
                />
                <Confirm
                    className="rename-confirm"
                    ref={ref => this.confirmRef = ref}
                    title="重新提交申请"
                    onClose={() => {this.setState({rename: "", renameRecordId: ""})}}
                    onBtnClick={e => {this.onConfirmReWithdraw(e)}}
                >
                    <div className="rename-confirm-content">
                        <input className="rename-input" type="text" placeholder="在此填写姓名，必须和实名认证时填写的一致" value={this.state.rename} onChange={(e) => {this.setState({rename: e.target.value})}}></input>
                    </div>
                </Confirm>
            </Page>
        );
    }
}

module.exports = connect(
    state => {
        return {};
    },
    {
        myDistributionAccount,
        distributionAccountWithdraw,
        userBindKaiFang,
        getRealStatus,
        getCheckUser
    }
)(RewardProfit);
