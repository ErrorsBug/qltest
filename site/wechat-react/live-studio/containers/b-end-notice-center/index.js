import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import StudioIndexBar from "components/studio-index";
import { NoticeTab, NoticeTabPane } from "./components/notice-tab";
import MessageList from "./components/message-list";
import {
    clearTabUnread,
    getUnreadCount,
    getMessageList,
    getTopMessage,
    readMessage,
    closeAd
} from "../../actions/notice-center";
import {
    getPower,
} from "../../actions/live";
import { autobind } from "core-decorators";

@autobind
class BEndNoticeCenter extends Component {

    noticeTabRef = null;
    
    get liveId() {
        return this.props.location.query.liveId;
    }

    async componentDidMount() {
        await this.getUnreadCount();
        this.props.getTopMessage(this.liveId);
        this.noticeTabRef.init();
        
        if (!this.props.power.liveId) {
            await this.props.getPower(this.liveId);
        }
    }

    // 获取未读信息数
    async getUnreadCount() {
        await this.props.getUnreadCount(this.liveId);
    }

    /**
     *获取对应的信息列表
     * @param {number} type tabKey,tab对应的类型
     * @param {number} page 分页
     */
    async getMessageList(type) {
        // 若该tab已经load过数据，就不再load数据
        if (this.props.messageList[type].data.length > 0) return;
        const res = await this.props.getMessageList(this.liveId, type);
        if(res.state.code === 0) {
            if(this.props.unreadMap[type] > 0) {
                window.toast(`${this.props.unreadMap[type]}条未读消息`)
            }
        }
    }
    
    async getMessage(type) {
        await this.props.getMessageList(this.liveId, type, this.props.messageList[type].page);
    }

    // 切换
    async onSwitchTab(tabKey) {
        // 读取tab列表
        await this.getMessageList(tabKey);
        // 清除tab上的提示红点
        if(this.props.unreadMap[tabKey] > 0) {
            this.props.clearTabUnread(tabKey);
            this.props.readMessage(this.liveId, tabKey, null, "tab");
        }
    }

    onMessageClick(tabType, message) {
        this.props.readMessage(this.liveId, tabType, message.id);
    }

    onCloseAd() {
        this.props.closeAd();
    }

    render() {
        const { unreadMap, messageList } = this.props;
        return (
            <Page title="消息中心" className="b-end-notice-center-page">
                <div className="layer-bg"></div>
                <NoticeTab unreadMap={unreadMap} onSwitchTab={this.onSwitchTab} ref={ref => {this.noticeTabRef = ref}}>
                    {/* 学员互动 类型消息 start */}
                    <NoticeTabPane tab="学员互动" region="stu-interactive" tabKey="1">
                        <MessageList
                            topMessage={this.props.topMessage}
                            tabType={1}
                            messageList={messageList["1"].data}
                            onMessageClick={this.onMessageClick}
                            showAd={this.props.showAd}
                            onCloseAd={this.onCloseAd}
                            onLoadMore={this.getMessage}
                            none={messageList["1"].none}
                            nomore={messageList["1"].nomore}   
                        />
                    </NoticeTabPane>
                    {/* 学员互动 类型消息 end*/}

                    {/* 系统通知 类型消息 start */}
                    <NoticeTabPane tab="系统通知" region="sys-notice" tabKey="2">
                        <MessageList
                            tabType={2}
                            messageList={messageList["2"].data}
                            onMessageClick={this.onMessageClick}
                            onLoadMore={this.getMessage}
                            none={messageList["2"].none}
                            nomore={messageList["2"].nomore}   
                        />
                    </NoticeTabPane>
                    {/* 系统通知 类型消息 end*/}

                    {/* 平台活动 类型消息 start */}
                    <NoticeTabPane tab="平台活动" region="plat-activity" tabKey="3">
                        <MessageList
                            tabType={3}
                            messageList={messageList["3"].data}
                            onMessageClick={this.onMessageClick}
                            onLoadMore={this.getMessage}
                            none={messageList["3"].none}
                            nomore={messageList["3"].nomore}    
                        />
                    </NoticeTabPane>
                    {/* 平台活动 类型消息 end*/}
                </NoticeTab>
                <StudioIndexBar liveId={this.liveId} activeIndex={"notice"} power={this.props.power} newMessageCount={this.props.newMessageCount} />
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        unreadMap: state.noticeCenter.unreadMap,
        newMessageCount: calUnreadNum(state.noticeCenter.unreadMap),
        // 三种 messageList 的集合
        messageList: state.noticeCenter.messageList,
        pageList: state.noticeCenter.pageMap,
        topMessage: state.noticeCenter.topMessage,
        showAd: state.noticeCenter.showAd,
        power: state.live.power
    };
}

const mapDispatchToProps = {
    clearTabUnread,
    getUnreadCount,
    getMessageList,
    getTopMessage,
    readMessage,
    closeAd,
    getPower
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BEndNoticeCenter);

// 计算未读数量
function calUnreadNum(unreadMap) {
    if(!unreadMap) return;
    let sum = 0;
    Object.keys(unreadMap).forEach(key  => {
        sum += unreadMap[key];
    });
    return sum;
}