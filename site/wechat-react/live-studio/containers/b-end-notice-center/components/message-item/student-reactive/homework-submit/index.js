import React from "react";
import MessageItemWrapper from "../../../message-item-hoc";

/**
 * 学员互动下 作业提交 类型消息
 */

@MessageItemWrapper()
class HomeworkSubmit extends React.Component {
    render() {
        const { message } = this.props;
        return (
            <div className="notice-center-message-content homework-submit on-log" data-log-region="news-homework">
                <div className="notice-detail">
                    <p className="title">{message.userName}已提交作业</p>
                    <p className="desc">作业标题：{message.homeworkTitle}</p>
                </div>
            </div>
        );
    }
}

export default HomeworkSubmit;
