/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';

import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { formatMoney, formatDate, locationTo } from 'components/util';

import { getWithdrawtList, getCheckUser } from '../../actions/account';

const STATUS_MAP = {
	SUCCESS: '成功',
	FAIL:'失败',
	AWAITING:'审核中',
	QAWAITING:'问题审核中',
	NO_PASS:'审核不通过'
};

class Profit extends Component {
    state = {
        noData: false,
        noMore: false,
		list: [],
		// 当前用户是否有进行体现操作的资格
		isQualified: true,
    };

    data = {
        page: 1,
        pageSize: 20
    };

    componentDidMount() {
		this.getWithdrawtList(1);
		this.initRealNameVerifyStatus();
    }

	/**
	 * 查询用户的实名认证状态
	 */
    async initRealNameVerifyStatus() {
        const res = await this.props.getCheckUser();
        const status = (res.data && res.data.status) || "no";
        const hasPriviledge = (res.data && res.data.userNameCheck === "N") || false;
        const isQualified = hasPriviledge || status === "pass";
        this.setState({
			isQualified,
		});
    }

    async getWithdrawtList(page) {
        const res = await this.props.getWithdrawtList({
            pageNum: page,
            pageSize: this.data.pageSize
        });
        if (res.state.code === 0) {
            if (page === 1 && (!res.data.list || !res.data.list.length)) {
                this.setState({
                    noData: true
                });
                return false;
            } else if (
                !res.data.list ||
                res.data.list.length < this.data.pageSize
            ) {
                this.setState({
                    noMore: true
                });
            }

            this.setState({
                list: [...this.state.list, ...res.data.list]
            });
        }
    }

    async loadNext(next) {
        await this.getWithdrawtList(++this.data.page);
        next && next();
    }

    retryWithdrew(id, money) {
        locationTo(
            `/wechat/page/coral/profit/withdraw?id=${id}&money=${money}`
        );
    }

    gotoVerifyPage() {
        locationTo("/wechat/page/real-name?reVerify=Y&type=topic");
    }

    render() {
        return (
            <Page title="我的收入" className="page-my-profit">
                <ScrollToLoad
                    loadNext={this.loadNext.bind(this)}
                    noMore={this.state.noMore}
                    toBottomHeight={50}
                >
                    <div className="banner">
                        <div className="content">
                            可提现金额(元)
                            <div className="num">
                                {formatMoney(this.props.accountData.balance)}
                            </div>
                            <div
                                className="withdraw-btn on-log"
                                data-log-region="btn-withdraw"
                                onClick={() =>
                                    locationTo(
                                        "/wechat/page/coral/profit/withdraw"
                                    )
                                }
                            >
                                提现
                            </div>
                        </div>
                    </div>
                    <div className="collect-box">
                        <div className="row">
                            <div className="col">
                                {formatMoney(
                                    this.props.accountData.todayIncome
                                )}
                                <div className="tip">今日收益金额(元)</div>
                            </div>
                            <div className="col">
                                {formatMoney(
                                    this.props.accountData.totalIncome
                                )}
                                <div className="tip">累计收益金额(元)</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                {formatMoney(
                                    this.props.accountData.beAccountBalance
                                )}
                                <div className="tip">待结算金额(元)</div>
                            </div>
                            <div className="col">
                                {formatMoney(
                                    this.props.accountData.withdrawAmount
                                )}
                                <div className="tip">已提现金额(元)</div>
                            </div>
                        </div>
                    </div>
                    <div className="withdraw-record">
                        <div className="title">提现记录</div>
                        <div className="withdraw-list">
                            {this.state.list.map((item, i) => {
                                return (
                                    <div className="item" key={i}>
                                        <div className="info">
                                            微信提现
											{
												!this.state.isQualified &&
												<span
													className="verify-again"
													onClick={this.gotoVerifyPage}
                                            	>
                                                点击重新实名认证
                                            	</span>
											}
                                            <div className="date">
                                                {formatDate(
                                                    item.createTime,
                                                    "yyyy-MM-dd hh:mm"
                                                )}
                                            </div>
                                        </div>
                                        <div className="num">
                                            {formatMoney(item.withdrawAmount)}元
                                            {item.repayResult === "SUCCESS" ? ( //重新提现
                                                <div
                                                    className={`status ${
                                                        item.type
                                                    }`}
                                                >
                                                    {STATUS_MAP["SUCCESS"]}
                                                </div>
                                            ) : item.type === "FAIL" &&
                                              item.errorInfo ===
                                                  "NAME_MISMATCH" ? (
                                                <div
                                                    className={`status real-name-fail-btn ${
                                                        item.type
                                                    }`}
                                                    onClick={this.retryWithdrew.bind(
                                                        this,
                                                        item.id,
                                                        item.withdrawAmount
                                                    )}
                                                >
                                                    实名验证失败，点击重试
                                                </div>
                                            ) : item.type === "FAIL" &&
                                              item.errorInfo ===
                                                  "NAME_MATCH" ? (
                                                <div
                                                    className={`status AWAITING`}
                                                >
                                                    {STATUS_MAP["AWAITING"]}
                                                </div>
                                            ) : (
                                                <div
                                                    className={`status ${
                                                        item.type
                                                    }`}
                                                >
                                                    {STATUS_MAP[item.type]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ScrollToLoad>
            </Page>
        );
    }
}

function mapStateToProps (state) {
	return {
		accountData: state.account.accountData
	}
}

const mapActionToProps = {
	getWithdrawtList,
	getCheckUser,
};

module.exports = connect(mapStateToProps, mapActionToProps)(Profit);
