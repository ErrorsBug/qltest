import React, { Component } from 'react';

import { BottomDialog } from 'components/dialog';
import { Switch } from '../switch';
import { formatMoney } from 'components/util';

class TryoutDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        };
    }

    onDay = day => {
        this.setState({
            data: {
                ...this.state.data,
                chargeMonths: day
            }
        });
    };

    openTryout = () => {
        if (this.state.data) {
            this.setState({
                data: {
                    ...this.state.data,
                    status: this.state.data.status == 'Y' ? 'N' : 'Y'
                }
            });
        } else {
            this.setState({
                data: {
                    status: 'Y'
                }
            });
        }
    };

    changeAmount = e => {
        let v = e.target.value;
        if (v != '') {
            if (v < 0) {
                this.setState({
                    data: {
                        ...this.state.data,
                        amount: ''
                    }
                });
                return window.toast('试用价格不能小于0');
            }
            if (v > 50000) {
                return window.toast('金额不能超过50000');
            }
        }
        if (this.state.data) {
            this.setState({
                data: {
                    ...this.state.data,
                    amount: v
                }
            });
        } else {
            this.setState({
                data: {}
            });
        }
    };

    save = () => {
        if (!this.state.data) {
            this.props.onClose();
            return;
        }
        if (this.state.data.status == 'Y') {
            if (!this.state.data.amount) return window.toast('试用金额不能为空！');
            if (Number(this.state.data.amount) < 0.1) return window.toast('试用金额不能小于0.1元');
            if (!this.state.data.chargeMonths) return window.toast('使用天数不能为空！');
            let data = this.state.data;
            data.type = 'tryout';
            this.props.onSave(data);
        } else {
            this.props.onRemove();
        }
        this.props.onClose();
    };

    render() {
        return (
            <BottomDialog show={true} theme="empty" className="try-vip" onClose={this.props.onClose}>
                <div className="header">试用会员设置</div>
                <div className="body">
                    <div className="try-vip-setting">
                        <div className="try-vip-setting-inner">
                            <div className="left">
                                <div className="left-up">开启试用会员</div>
                                <div className="left-down">试用会员，每个用户仅可购买一次</div>
                            </div>
                            <div className="right">
                                <Switch
                                    status={this.state.data && this.state.data.status == 'Y' ? true : false}
                                    onClick={this.openTryout}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"try-vip-date " + (!this.state.data || this.state.data.status == 'N' ? 'close-try-out' : '')}>
                        {
                            !this.state.data || this.state.data.status == 'N' ?
                            <div className="mask"></div> :null
                        }
                        <div className="mask" onClick={(e) => {
                            e.stopPropagation();
                        }}></div>
                        <div className="try-vip-date-inner">
                            <div className="top">试用会员天数</div>
                            <div className="bottom">
                                {[1, 2, 3, 4].map(item => {
                                    return (
                                        <div
                                            className={
                                                'day-item ' +
                                                (this.state.data &&
                                                this.state.data.chargeMonths &&
                                                this.state.data.chargeMonths == item &&
                                                this.state.data.status == 'Y'
                                                    ? 'selected'
                                                    : '')
                                            }
                                            key={item}
                                            onClick={() => {
                                                this.onDay(item);
                                            }}>
                                            {item}天
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="bottom-intersect" />
                            <div className="bottom">
                                {[5, 6, 7].map(item => {
                                    return (
                                        <div
                                            className={
                                                'day-item ' +
                                                (this.state.data &&
                                                this.state.data.chargeMonths &&
                                                this.state.data.chargeMonths == item &&
                                                this.state.data.status == 'Y'
                                                    ? 'selected'
                                                    : '')
                                            }
                                            key={item}
                                            onClick={() => {
                                                this.onDay(item);
                                            }}>
                                            {item}天
                                        </div>
                                    );
                                })}
                                <div
                                    className="day-item"
                                    style={{
                                        visibility: 'hidden'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={"try-vip-price " + (!this.state.data || this.state.data.status == 'N' ? 'close-try-out' : '')}>
                        {
                            !this.state.data || this.state.data.status == 'N' ? <div className="mask"></div> : null
                        }
                        <div className="try-vip-price-inner">
                            <div className="top">试用会员价格</div>
                            <div className="bottom">
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="需要小于常规会员金额"
                                    value={this.state.data && this.state.data.amount}
                                    onChange={this.changeAmount}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer" onClick={this.save}>
                    <div className="save-btn">保存</div>
                </div>
            </BottomDialog>
        );
    }
}

export default TryoutDialog;
