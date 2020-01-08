import React from "react";
import NoticeTabPane from "./components/notice-tab-pane";
import NoticeTabbar from "./components/notice-tabbar";
import { autobind } from "core-decorators";

import "./style.scss";

@autobind
class NoticeTab extends React.Component {
    state = {
        currentTabKey: null
    };

    
    // 初始化tab
    init() {
        // 初始化第一个tab
        this.onSwitchTab("1");
    }

    onSwitchTab(tabKey) {
        this.setState({
            currentTabKey: tabKey
        });
        this.props.onSwitchTab && this.props.onSwitchTab(tabKey);
    }

    createTabbar() {
        return React.Children.map(this.props.children, child => {
            return { name: child.props.tab, key: child.props.tabKey, region: child.props.region };
        });
    }

    createTabContent() {
        return React.Children.map(this.props.children, child => (
            <div
                className={["tab-pane", child.props.tabKey != this.state.currentTabKey ? "hidden" : null].join(' ')}
            >
                {child}
            </div>
        ));
    }

    render() {
        const tabList = this.createTabbar();
        return (
            <div className="notice-tab">
                <NoticeTabbar
                    tabs={tabList}
                    currentTabKey={this.state.currentTabKey}
                    newMessageCountMap={this.props.unreadMap}
                    onSwitchTab={this.onSwitchTab}
                />
                {this.createTabContent()}
            </div>
        );
    }
}

export { NoticeTab, NoticeTabPane };
