import React, { Component } from "react";
// import "./style.scss";

// Tabbar 组件
class NoticeTabbar extends Component {
    // 切换Tab
    onSwitchTab = tabKey => {
        if (tabKey === this.props.currentTabKey) return;
        this.props.onSwitchTab && this.props.onSwitchTab(tabKey);
    };

    render() {
        const { newMessageCountMap, tabs, currentTabKey } = this.props;
        return (
            <div className="notice-tabbar-wrap">
                {tabs && (
                    <div className="notice-tabbar">
                        {tabs.map(tab => (
                            <NoticeTab
                                key={tab.key}
                                name={tab.name}
                                region={tab.region}
                                isActive={tab.key === currentTabKey}
                                newMessageCount={newMessageCountMap[tab.key]}
                                onTab={() => {
                                    this.onSwitchTab(tab.key);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default NoticeTabbar;

// tab 组件
class NoticeTab extends Component {
    render() {
        const { isActive, onTab, region } = this.props;
        return (
            <div
                className={["notice-tab on-log on-visible", isActive ? "active" : null].join(" ")}
                onClick={onTab}
                data-log-region={region}
            >
                <span className="tab-name">
                    {this.props.name}
                    {this.props.newMessageCount > 0 && (
                        <RedSpot count={this.props.newMessageCount} />
                    )}
                </span>
            </div>
        );
    }
}

// 红点消息提示组件
function RedSpot(props) {
    return (
        <span
            className={[
                "notice-red-spot",
                props.count > 0 ? null : "hidden"
            ].join(" ")}
        >
            {props.count > 99 ? "99+" : props.count}
        </span>
    );
}
