/**
 * Created by dylanssg on 2017/8/2.
 */
import React, { Component } from "react";
import Page from "components/page";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import ScrollToLoad from "components/scrollToLoad";
import { request } from "common_actions/common";
import ChannelList from "./components/channel-list";

import { getchannelGuestData } from "../../../actions/guest-separate";
import {
    GuestProfitDetail,
    GuestWithdrawDetail
} from "../../../components/guest-profit-detail";
import ProfitCard from "../../../components/profit-card";
import { ProfitTabBar, ProfitTab } from "../../../components/profit-tab";
import WithdrawPullup from "../../../components/withdraw-pullup";
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';

import {  getRealStatus, getCheckUser } from "../../../actions/live";
import Confirm from "components/dialog/confirm";
import { getCookie } from 'components/util';

const PAGE_SIZE = 20;

@autobind
class ChannelListC extends Component {
    state = {
        limit: 2,
        pageSize: 20,
        isNoFlow: false,
        isNoMoreFlow: false,
        account: {},
        withdrawRecordList: [],
        withdrawRecordPage: 1,
        withdrawRecordNomore: true,
        dataList: [],
        showWithdraw: false,
        currentTab: 0,
        realName: '',
		newRealStatus: 'no',
		realStatus: 'unwrite',
        isNotBtn: false,
        rename: "",
        renameRecordId: "",
        wechatNickName: ""
    };
    data = {
        pageNum: 1
    };

    get userId() {
        return getCookie('userId');
    }

    get liveId(){
		return this.props.location.query.liveId;
    }
    
    confirmRef = null;

    componentDidMount() {
        this.initDataReal();
        this.getChennelList();
        this.getGuestAccount();
        this.getWithdrawRecord();
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


    async getChennelList(next) {
        let params = {
            pageNum: this.data.pageNum,
            pageSize: this.state.pageSize
        };
        let result = await this.props.getchannelGuestData(params);
        if (result.state.code === 0) {
            if (this.data.pageNum === 1) {
                this.setState({
                    dataList: result.data.list
                });
                if (result.data.list.length <= 0) {
                    this.setState({
                        isNoFlow: true
                    });
                }
            } else {
                this.setState({
                    dataList: [...this.state.dataList, ...result.data.list]
                });
            }

            if (result.data.list.length <= 0 && this.data.pageNum > 1) {
                this.setState({
                    isNoMoreFlow: true
                });
            }
            ++this.data.pageNum;
            next && next();
        }
    }

    hideWithdraw() {
        this.setState({
            showWithdraw: false
        });
    }

    async withdraw(param) {
        const { withdraw, name } = param;
        try {
            const res = await request({
                url: "/api/wechat/transfer/h5/guest/withDraw",
                method: "POST",
                body: {
                    totalFee: withdraw * 100,
                    realName: name
                }
            });
            if(res.state.code === 0) {
                this.setState({
                    showWithdraw: false
                });
                this.getGuestAccount();
                this.getWithdrawRecord(1, PAGE_SIZE, true);
                return res;
            }
            window.toast(res.state.msg);

        } catch (error) {
            console.error(error);
        }
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
            if(this.state.rename.length ===0) {
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
                    await this.getWithdrawRecord(1, PAGE_SIZE, true);
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

    async confirmWithdraw(param) {
        if(!this.validInput(param, true)) {
            return ;
        }
        if (param.withdraw >= 2000 && this.state.newRealStatus != 'pass') {
            this.setState({isNotBtn: true});
            return;
        }
        this.withdraw(param);
    }

    clearRealName(){
        this.setState({
            isNotBtn: false
        })
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
    

    // 获取嘉宾账户信息
    async getGuestAccount() {
        try {
            const result = await request({
                url: "/api/wechat/transfer/h5/guest/myGuestAccount",
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
    
    // 嘉宾提现记录
    async getWithdrawRecord(page = 1, size = PAGE_SIZE, reload = false) {
        try {
            const result = await request({
                url: "/api/wechat/transfer/h5/guest/withdrawRecord",
                method: "POST",
                body: {
                    page: {
                        page,
                        size
                    }
                }
            });
            if(result.state.code === 0) {
                let arr = [];
                if(reload) {
                    arr = result.data.recordList;
                } else {
                    arr = this.state.withdrawRecordList;
                    arr = arr.concat(result.data.recordList);
                }

                this.setState({
                    withdrawRecordList: arr,
                    withdrawRecordPage: page,
                    withdrawRecordNomore: result.data.recordList.length < PAGE_SIZE
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const {account} = this.state;
        return (
            <Page
                title="嘉宾分成收益"
                className="guest-separate-channel-list-c flex-body my-guest-profit"
            >
                <div className="container">
                    <ScrollToLoad
                        className="profit-scroll-box"
                        toBottomHeight={500}
                        page={
                            this.state.currentTab === 0 ? 
                            this.state.page
                            :
                            this.state.withdrawRecordPage
                        }
                        noneOne={
                            this.state.currentTab === 0 ?
                            this.state.isNoFlow
                            :
                            this.state.withdrawRecordList.length <= 0
                        }
                        loadNext={async done => {
                            if(this.state.currentTab === 0) {
                                await this.getChennelList();
                                done();
                            } else {                                
                                await this.getWithdrawRecord(this.state.withdrawRecordPage + 1);
                                done();
                            }
                        }}
                        noMore={
                            this.state.currentTab === 0 ?
                            this.state.isNoMoreFlow
                            :
                            this.state.withdrawRecordNomore
                        }
                    >                
                        <ProfitCard
                            className="blue"
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
                                })
                            }}
                        >
                            <ProfitTab title="收益明细">
                                <div className="profit-list">
                                    <ChannelList item={this.state.dataList} />
                                </div>
                            </ProfitTab>
                            <ProfitTab title="提现明细">
                                <div className="withdraw-detail-list">
                                    {
                                        this.state.withdrawRecordList.map(record => <GuestWithdrawDetail record={record} reSubmit={this.reWithdraw} />)
                                    }
                                </div>
                            </ProfitTab>
                        </ProfitTabBar>
                    </ScrollToLoad>
                    <WithdrawPullup
                        wechatNickName={this.state.wechatNickName}
                        show={this.state.showWithdraw}
                        onClose={this.hideWithdraw}
                        onOk={this.confirmWithdraw}
                    />
                    <NewRealNameDialog 
                        bghide={false}
                        show = { this.state.isNotBtn }
                        onClose = {this.clearRealName.bind(this)}
                        realNameStatus = { this.state.realStatus || 'unwrite'}
                        checkUserStatus = { this.state.newRealStatus || 'no' }
                        isClose={ false }
                        liveId = {this.liveId}
                        isClose={true}
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
    
                </div>
            </Page>
        );
    }
}

module.exports = connect(
    state => {
        return {};
    },
    {
        getchannelGuestData,
        // userBindKaiFang,
        getRealStatus,
        getCheckUser
    }
)(ChannelListC);
