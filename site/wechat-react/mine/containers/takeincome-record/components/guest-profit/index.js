import React, { useState, useRef } from "react";
import moment from 'moment';
const GuestItem = ({ record }) => {
    return (
        <li className="record-item">
            <p>
                <span className="title">提现时间：</span>
                <span className="desc">{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') + ""}</span>
            </p>
            <p>
                <span className="title">提现金额：</span>
                <span className="desc money">{record.money}元</span>
            </p>

            <p>
                <span className="title">提现状态：</span>
                <span className="desc withdraw-status">
                    {/* record.transferWay === "guestAccount" */}
                    {record.transferWay === "guestAccount"
                        ? `已汇入嘉宾(${record.guestName})的千聊钱包，请嘉宾前往“个人中心”查看`
                        : `已汇入嘉宾(${record.guestName})的微信钱包`}
                </span>
            </p>

            <p>
                <span className="title">预计到账时间：</span>
                <span className="desc">
                    {record.transferWay === "guestAccount" ? `已到账` : `1天后`}
                </span>
            </p>
        </li>
    );
};

const GuestProfitTabItem = ({ children }) => {
    return children;
};

const GuestProfitTab = ({ defaultTabKey, onSwitch, children }) => {
    const [curIndex, setcurIndex] = useState(defaultTabKey || null);

    const onSwitchTab = index => {
        setcurIndex(index);
        onSwitch && onSwitch(index);
    };

    return (
        <div className="guest-profit-container">
            <div className="guest-tab-bar">
                {React.Children.map(children, child => (
                    <div
                        key={child.props.tabKey}
                        className={`guest-tab ${
                            curIndex === child.props.tabKey ? "active" : ""
                        }`}
                        onClick={() => onSwitchTab(child.props.tabKey)}
                    >
                        {child.props.title}
                    </div>
                ))}
            </div>
            {React.Children.map(children, child => (
                <div
                    className="scroller-wrap"
                    hidden={child.props.tabKey !== curIndex}
                >
                    {child}
                </div>
            ))}
        </div>
    );
};

export { GuestProfitTab, GuestProfitTabItem, GuestItem };
