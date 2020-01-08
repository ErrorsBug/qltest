import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { MiddleDialog, BottomDialog } from 'components/dialog';
import IncomeTypeDialog from './components/income-type-dialog';
import { getVipInfo, updateVipStatus, saveVipCharge } from '../../actions/live';
import TryoutDialog from './components/try-out-dialog';
import { Switch } from './components/switch';
import { formatMoney } from 'components/util';

class LiveVipSetting extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        vipInfo: {}
    };

    get liveId() {
        return this.props.location.query.liveId;
    }

    get from() {
        return this.props.location.query.from;
    }

    getVipInfo = (liveId = this.liveId) => {
        this.props
            .getVipInfo({
                liveId: liveId
            })
            .then(res => {
                if (res.state.code == 0) {
                    let { vipChargeconfig } = res.data;
                    vipChargeconfig = vipChargeconfig.map(item => {
                        item.amount = formatMoney(item.amount);
                        return item;
                    });
                    this.setState({
                        vipInfo: {
                            ...res.data,
                            vipChargeconfig,
                            isOpenVip: this.from == 'editDesc' ? 'Y' : res.data.isOpenVip
                        }
                    });
                }
            });
    };

    updateVipStatus = (liveId = this.liveId, vipDesc = '', isOpenVip = 'Y') => {
        if (isOpenVip == 'Y') {
            this.setState({
                vipInfo: {
                    ...this.state.vipInfo,
                    isOpenVip: 'Y'
                }
            })
        } else {
            this.props
            .updateVipStatus({
                liveId,
                vipDesc,
                isOpenVip
            })
            .then(res => {
                if (res.state.code == 0) {
                    this.setState({
                        vipInfo: {
                            ...this.state.vipInfo,
                            isOpenVip: 'N'
                        }
                    });
                } else {
                    window.toast(res.state.msg);
                }
            });
        }
    };

    onUpdateVipStatus = status => {
        this.updateVipStatus(this.liveId, '', status ? 'Y' : 'N');
    };

    componentDidMount() {
        this.getVipInfo();
    }

    onVipCardInfo = () => {
        this.setState({
            showVipCardInfo: true
        });
    };

    save = () => {
        if (this.saving) return;
        this.saving = true;
        try {
            let { vipChargeconfig } = this.state.vipInfo;
            if (!vipChargeconfig) {
                throw new Error('请输入按时收费');
            }
            let normalCharge = vipChargeconfig.filter(item => item.type == 'live');
            if (!normalCharge) {
                throw new Error('请输入按时收费');
            }
            if (normalCharge.length == 0) {
                throw new Error('请输入按时收费');
            }
            let tryoutCharge = vipChargeconfig.find(item => item.type == 'tryout');
            if (tryoutCharge) {
                let min = this.getMinIncomeType(vipChargeconfig);
                if (Number(tryoutCharge.amount) > Number(min.amount)) {
                    throw new Error('试用会员价格不能大于会员价格');
                }
                if (Number(tryoutCharge.chargeMonths) > Number(min.chargeMonths * 30)) {
                    throw new Error('试用会员月数不嫩大于会员天数');
                }
            }

            let chargeconfigPos = vipChargeconfig.map(item => {
                let newItem = Object.assign({}, item);
                newItem.amount = newItem.amount * 100;
                return newItem;
            });
            this.props
                .saveVipCharge({
                    liveId: this.liveId,
                    chargeconfigPos: chargeconfigPos
                })
                .then(res => {
                    if (res.state.code == 0) {
                        location.href = `/wechat/page/live-vip-details?liveId=${this.liveId}`;
                    } else {
                        this.saving = false;
                        window.toast(res.state.msg);
                    }
                })
                .catch(e => {
                    console.error(e);
                    this.saving = false;
                });
        } catch (e) {
            this.saving = false;
            return window.toast(e.message);
        }
    };

    saveTryout = tryoutCharge => {
        let { vipChargeconfig } = this.state.vipInfo;
        if (vipChargeconfig) {
            let index = vipChargeconfig.findIndex(item => item.type == 'tryout');
            if (index != -1) {
                vipChargeconfig[index] = tryoutCharge;
            } else {
                vipChargeconfig.push(tryoutCharge);
            }
        } else {
            vipChargeconfig = [tryoutCharge];
        }
        this.setState({
            vipInfo: {
                ...this.state.vipInfo,
                vipChargeconfig
            }
        });
    };

    saveIncomeType = normalCharge => {
        let { vipChargeconfig } = this.state.vipInfo;
        if (vipChargeconfig) {
            let tryoutCharge = vipChargeconfig.find(item => item.type == 'tryout');
            if (tryoutCharge) {
                normalCharge.push(tryoutCharge);
            }
        }
        this.setState({
            vipInfo: {
                ...this.state.vipInfo,
                vipChargeconfig: normalCharge
            }
        });
    };

    getMinIncomeType = vipChargeconfig => {
        let normalCharge = vipChargeconfig.filter(item => item.type == 'live');
        let min = normalCharge.sort((a, b) => {
            return a.amount - b.amount;
        })[0];
        if (min) {
            return min;
        } else {
            return {};
        }
    };

    removeTryout = () => {
        let { vipChargeconfig } = this.state.vipInfo;
        let chargeconfigPos = vipChargeconfig.filter(item => {
            return item.type != 'tryout';
        });
        this.setState({
            vipInfo: {
                ...this.state.vipInfo,
                vipChargeconfig: chargeconfigPos
            }
        });
    };

    render() {
        let { vipChargeconfig } = this.state.vipInfo;
        let tryoutCharge = undefined;
        let normalCharge = undefined;
        if (vipChargeconfig) {
            tryoutCharge = vipChargeconfig.find(item => item.type == 'tryout');
            normalCharge = vipChargeconfig.filter(item => item.type == 'live');
        }

        return (
            <Page title="直播间通用会员设置" className="live-vip-setting_DFDSS">
                <div className="option-panel">
                    <div className="item-wrap">
                        <div className="item-top">
                            <div className="left" onClick={this.onVipCardInfo}>
                                <div className="entry">显示开通入口</div>
                                <div className="info">直播间通用会员卡服务内容</div>
                            </div>
                            <div className="right">
                                <Switch status={this.state.vipInfo.isOpenVip == 'Y'} onClick={this.onUpdateVipStatus} />
                            </div>
                        </div>
                    </div>
                    {this.state.vipInfo.isOpenVip == 'Y' ? (
                        <React.Fragment>
                            <div className="item-wrap">
                                <div
                                    className="item"
                                    onClick={() => {
                                        location.href = `/wechat/page/edit-desc?type=generalVip&liveId=${this.liveId}`;
                                    }}>
                                    <div className="left">通用会员服务简介</div>
                                    <div className="right">
                                        <RightArrow />
                                    </div>
                                </div>
                            </div>
                            <div className="item-wrap">
                                <div
                                    className="item"
                                    onClick={() => {
                                        this.setState({
                                            showIncometype: true
                                        });
                                    }}>
                                    <div className="left">按时收费</div>
                                    <div className="right">
                                        {normalCharge && normalCharge.length > 0 ? (
                                            <span>
                                                <span className="money">
                                                    ¥{this.getMinIncomeType(vipChargeconfig).amount}
                                                </span>
                                                <span className="date">
                                                    （{this.getMinIncomeType(vipChargeconfig).chargeMonths}
                                                    月）
                                                </span>
                                            </span>
                                        ) : null}
                                        <RightArrow />
                                    </div>
                                </div>
                            </div>
                            <div className="item-wrap">
                                <div
                                    className="item"
                                    onClick={() => {
                                        this.setState({
                                            showTryOutPanel: true
                                        });
                                    }}>
                                    <div className="left">试用会员</div>
                                    <div className="right">
                                        {tryoutCharge ? (
                                            <div style={{ display: 'inline-block' }}>
                                                <span className="money">¥{tryoutCharge.amount}</span>
                                                <span className="date">
                                                    （{tryoutCharge.chargeMonths}
                                                    天）
                                                </span>
                                            </div>
                                        ) : null}
                                        <RightArrow />
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ) : null}
                </div>
                {this.state.vipInfo.isOpenVip == 'Y' ? (
                    <div className="save-area">
                        <div className="save" onClick={this.save}>
                            保存
                        </div>
                    </div>
                ) : null}
                {this.state.showVipCardInfo ? (
                    <MiddleDialog
                        show={true}
                        className="middle-dialog"
                        onClose={() => {
                            this.setState({
                                showVipCardInfo: false
                            });
                        }}>
                        <div className="header">直播间通用会员卡服务内容</div>
                        <div className="body">
                            <p>1.成功购买直播间通用会员即可享受收听当前直播间所有加密和付费的系列课及话题（转播课除外）。</p>
                            <p>
                                2.直播间会员尽显尊贵身份 <br />
                                <span>
                                注：直播间会员服务关闭，已购会员用户依然享有会员服务，直到服务到期。购买直播间会员服务，将会给直播间课代表分成。
                                </span>
                            </p>
                            <p>3.通用会员用户可免费参与打卡训练营，但不参与契约金分成</p>
                        </div>
                        <div
                            className="footer"
                            onClick={() => {
                                this.setState({
                                    showVipCardInfo: false
                                });
                            }}>
                            <div className="confirm">确认</div>
                        </div>
                    </MiddleDialog>
                ) : null}
                {this.state.showTryOutPanel ? (
                    <TryoutDialog
                        data={tryoutCharge}
                        onClose={() => {
                            this.setState({
                                showTryOutPanel: false
                            });
                        }}
                        onSave={this.saveTryout}
                        onRemove={this.removeTryout}
                    />
                ) : null}
                {this.state.showIncometype ? (
                    <IncomeTypeDialog
                        incomeList={normalCharge}
                        onClose={() => {
                            this.setState({
                                showIncometype: false
                            });
                        }}
                        onSave={this.saveIncomeType}
                    />
                ) : null}
            </Page>
        );
    }
}

class RightArrow extends React.PureComponent {
    render() {
        return <div className={'right-arrow_REQFDFE ' + this.props.className} />;
    }
}

RightArrow.defaultProps = {
    className: ''
};

function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {
    getVipInfo,
    updateVipStatus,
    saveVipCharge
};

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LiveVipSetting);
