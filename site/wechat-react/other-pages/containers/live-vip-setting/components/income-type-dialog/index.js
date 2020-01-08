import React, { PureComponent } from 'react';
import { BottomDialog } from 'components/dialog';

class IncomeTypeDialog extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            incomeList: props.incomeList && props.incomeList.length > 0
                ? Array.from(props.incomeList).sort((l, r) => {
                      return l.amount - r.amount;
                  })
                : [{
                    type: 'live'
                }]
        };
    }

    changeMoney = (index, e) => {
        let { incomeList } = this.state;
        let { value } = e.target;
        if (value == '') {
            this.setState({
                incomeList: incomeList.map((item, idx) => {
                    let newItem = Object.assign({}, item);
                    if (idx == index) {
                        newItem.amount = value;
                    }
                    return newItem;
                })
            });
            return;
        }
        if (value > 50000) {
            return window.toast('金额不能超过50000');
        }
        if (value < 1) {
            return window.toast('金额不能小于1');
        }
        this.setState({
            incomeList: incomeList.map((item, idx) => {
                let newItem = Object.assign({}, item);
                if (idx == index) {
                    newItem.amount = value;
                }
                return newItem;
            })
        });
    };

    changeMonth = (index, e) => {
        let { incomeList } = this.state;
        let { value } = e.target;
        if (value == '') {
            this.setState({
                incomeList: incomeList.map((item, idx) => {
                    let newItem = Object.assign({}, item);
                    if (idx == index) {
                        newItem.chargeMonths = value;
                    }
                    return newItem;
                })
            });
            return;
        }
        if (value > 9999) {
            return window.toast('最大月数不能超过9999');
        }
        if (value <= 0) {
            return window.toast('月份不能是负数或者0');
        }
        if (!Number.isInteger(Number(value))) {
            return window.toast('月份必须为正整数');
        }
        this.setState({
            incomeList: incomeList.map((item, idx) => {
                let newItem = Object.assign({}, item);
                if (idx == index) {
                    newItem.chargeMonths = value;
                }
                return newItem;
            })
        });
    };

    addIncomeItem = () => {
        let incomeList = Array.from(this.state.incomeList || []);
        if (incomeList.length >= 10) {
            return window.toast('最多10个收费类型');
        }
        incomeList = incomeList.sort((l, r) => {
            return l.amount - r.amount;
        });
        incomeList.push({
            type: 'live'
        });
        this.setState(
            {
                incomeList: incomeList
            },
            () => {
                var incomeDom = document.querySelector('.income-list');
                if (incomeDom) {
                    incomeDom.scrollTop = 9999;
                }
            }
        );
    };

    deleteIncomeItem = index => {
        let incomeList = Array.from(this.state.incomeList);
        incomeList.splice(index, 1);
        this.setState({
            incomeList
        });
    };

    onSave = () => {
        let { incomeList } = this.state;
        if (!incomeList) {
            return this.props.onClose();
        }
        if (incomeList.length == 0) {
            return this.props.onClose();
        }

        this.props.onSave(this.state.incomeList);
        this.props.onClose();
    };

    render() {
        return (
            <BottomDialog show={true} theme="empty" className="set-income-type__REWRQE" onClose={this.props.onClose}>
                <div className="header">设置收费类型</div>
                <div className="body">
                    <div className="income-list">
                        {this.state.incomeList &&
                            this.state.incomeList.map((item, index) => {
                                return (
                                    <IncomeItem
                                        key={index}
                                        {...item}
                                        index={index}
                                        onDelete={this.deleteIncomeItem}
                                        changeMonth={this.changeMonth}
                                        changeMoney={this.changeMoney}
                                    />
                                );
                            })}
                    </div>
                    <div className="add-income-type" onClick={this.addIncomeItem}>
                        <span className="icon-add">
                            <svg height="100%" width="100%" version="1.1" viewBox="0 0 37 37">
                                <defs />
                                <g id="整理" fill="none" stroke="none" strokeWidth="1">
                                    <g id="设置收费类型" transform="translate(-255.000000, -1064.000000)">
                                        <g id="Group-9" transform="translate(256.000000, 1061.000000)">
                                            <g id="Group-10">
                                                <circle
                                                    id="Oval-3"
                                                    cx="17.5"
                                                    cy="21.5"
                                                    r="17.5"
                                                    stroke="#F73657"
                                                    strokeWidth="2"
                                                />
                                                <rect
                                                    height="23"
                                                    id="Rectangle-19"
                                                    width="2"
                                                    fill="#F73657"
                                                    rx="1"
                                                    x="17"
                                                    y="10"
                                                />
                                                <rect
                                                    height="23"
                                                    id="Rectangle-19-Copy"
                                                    width="2"
                                                    fill="#F73657"
                                                    rx="1"
                                                    transform="translate(18.000000, 21.500000) rotate(-270.000000) translate(-18.000000, -21.500000) "
                                                    x="17"
                                                    y="10"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </span>
                        添加收费类型
                    </div>
                    <div className="body-info">修改价格后，用户无需重新付费，最多创建10个收费方式</div>
                </div>
                <div className="footer" onClick={this.onSave}>
                    保存
                </div>
            </BottomDialog>
        );
    }
}

IncomeTypeDialog.defaultProps = {
    incomeList: []
};

class IncomeItem extends PureComponent {
    get hideClose() {
        return this.props.index > 0 ? 'visible' : 'hidden';
    }

    delete = () => {
        this.props.onDelete(this.props.index);
    };

    changeMonth = e => {
        this.props.changeMonth(this.props.index, e);
    };

    changeMoney = e => {
        this.props.changeMoney(this.props.index, e);
    };

    render() {
        return (
            <div className="income-item">
                <div className="income-item-inner">
                    <input
                        className="month"
                        type="number"
                        placeholder="输入月数"
                        onChange={this.changeMonth}
                        value={this.props.chargeMonths}
                        style={{
                            textAlign: this.props.chargeMonths ? 'center' : 'left'
                        }}
                    />
                    <div
                        style={{
                            display: 'inline-block',
                            textAlign: 'center'
                        }}>
                        <span>个月收取</span>
                    </div>
                    <input
                        className="money"
                        type="number"
                        placeholder="输入金额"
                        onChange={this.changeMoney}
                        value={this.props.amount}
                        style={{
                            textAlign: this.props.amount ? 'center' : 'left'
                        }}
                    />
                    <span
                        style={{
                            textAlign: 'center'
                        }}>
                        元
                    </span>
                    <div
                        style={{
                            textAlign: 'center'
                        }}>
                        <span
                            className="intersect"
                            style={{
                                visibility: this.hideClose
                            }}
                        />
                    </div>
                    <div
                        style={{
                            textAlign: 'center'
                        }}>
                        <span
                            className="icon-close"
                            style={{
                                visibility: this.hideClose
                            }}
                            onClick={this.delete}>
                            <svg height="100%" width="100%" version="1.1" viewBox="0 0 34 34">
                                <defs />
                                <g id="整理" fill="none" stroke="none" strokeWidth="1">
                                    <g id="设置收费类型" transform="translate(-674.000000, -797.000000)">
                                        <g id="关闭" transform="translate(674.000000, 797.000000)">
                                            <circle id="Oval" cx="17" cy="17" fill="#D8D8D8" r="17" />
                                            <path
                                                id="Combined-Shape"
                                                d="M17,15.2931158 L23.4396085,8.85350729 C23.9109516,8.38216424 24.6751497,8.38216424 25.1464927,8.85350729 C25.6178358,9.32485034 25.6178358,10.0890484 25.1464927,10.5603915 L18.7068842,17 L25.1464927,23.4396085 C25.6178358,23.9109516 25.6178358,24.6751497 25.1464927,25.1464927 C24.6751497,25.6178358 23.9109516,25.6178358 23.4396085,25.1464927 L17,18.7068842 L10.5603915,25.1464927 C10.0890484,25.6178358 9.32485034,25.6178358 8.85350729,25.1464927 C8.38216424,24.6751497 8.38216424,23.9109516 8.85350729,23.4396085 L15.2931158,17 L8.85350729,10.5603915 C8.38216424,10.0890484 8.38216424,9.32485034 8.85350729,8.85350729 C9.32485034,8.38216424 10.0890484,8.38216424 10.5603915,8.85350729 L17,15.2931158 Z"
                                                fill="#FFFFFF"
                                            />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default IncomeTypeDialog;
