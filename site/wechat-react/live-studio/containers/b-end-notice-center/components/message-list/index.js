import React from "react";
import ScrollToLoad from "components/scrollToLoad";
import { autobind } from "core-decorators";
import {
    PlatformActivity,
    HomeworkSubmit,
    ClassMessage,
    SystemNotice
} from "../message-item";
import { locationTo } from "components/util";

@autobind
class MessageList extends React.Component {
    componentDidMount() {}

    closeAd(e) {
        e.stopPropagation();
        this.props.onCloseAd && this.props.onCloseAd();
    }
    clickAd() {
        if (this.props.topMessage.url) {
            locationTo(this.props.topMessage.url);
        }
    }

    onMessageClick(tabType, message) {
        this.props.onMessageClick &&
            this.props.onMessageClick(tabType, message);
    }

    // 构造 平台活动 消息
    createPlatformActivityMessageItem(message, key) {
        return (
            <PlatformActivity
                key={key}
                tabType={this.props.tabType}
                message={message}
                onClick={this.onMessageClick}
            />
        );
    }

    // 构造 学员互动 消息
    createStudentReactiveMessageItem(message, key) {
        switch (message.businessType) {
            // 提交作业 消息
            case "homework_submit":
                return (
                    <HomeworkSubmit
                        key={key}
                        tabType={this.props.tabType}
                        message={message}
                        onClick={this.onMessageClick}
                    />
                );
            // course_evaluate:课程评价，course_consult:课程咨询 类型
            default:
                return (
                    <ClassMessage
                        key={key}
                        tabType={this.props.tabType}
                        message={message}
                        onClick={this.onMessageClick}
                    />
                );
        }
    }

    // 构造 系统消息 消息
    createSystemNoticeMessage(message, key) {
        return (
            <SystemNotice
                key={key}
                tabType={this.props.tabType}
                message={message}
                onClick={this.onMessageClick}
            />
        );
    }

    /**
     *
     * @param {any} type 消息类型
     * @param {object} message 消息对象
     * @param {any} key 循环key
     */
    createMessage(message, key) {
        const { tabType } = this.props;
        if (tabType == 3) {
            return this.createPlatformActivityMessageItem(message, key);
        } else if (tabType == 2) {
            return this.createSystemNoticeMessage(message, key);
        } else if (tabType == 1) {
            return this.createStudentReactiveMessageItem(message, key);
        }
    }

    render() {
        const { topMessage, showAd, tabType, none, nomore} = this.props;
        return (
                <ScrollToLoad
                    className="message-list-container"
                    bottomHeight={80}
                    loadNext={async (done) => {
                        this.props.onLoadMore && await this.props.onLoadMore(tabType);
                        done();
                    }}
                    noneOne={
                        none
                    }
                    noMore={nomore}
                >
                    <div className="message-list-wrap">
                        <ul className="message-list">
                            {/* 置顶消息 */}
                            {topMessage && showAd && (
                                <div
                                    data-log-region="news-advertising"
                                    className="ad-container on-log on-visible"
                                    onClick={this.clickAd}
                                >
                                    <div className="ad">
                                        <span className="close-btn">
                                            <img
                                                src={require("../../img/close.png")}
                                                onClick={this.closeAd}
                                                alt=""
                                            />
                                        </span>
                                        <div className="ad-img-box">
                                            <img src={topMessage.imageUrl} alt="" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* 置顶消息 */}
                            {this.props.messageList &&
                                this.props.messageList.map(message =>
                                    this.createMessage(message, message.id)
                                )}
                        </ul>
                    </div>
                    {/* </div> */}
                </ScrollToLoad>
        );
    }
}

export default MessageList;