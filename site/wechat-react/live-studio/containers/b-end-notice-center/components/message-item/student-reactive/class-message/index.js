import React from "react";
import MessageItemWrapper from "../../../message-item-hoc";
import Ranking from "../../../ranking";

/**
 * 学员互动
 * 学员互动下的 课程咨询 和 课程评价 类型消息
 */

@MessageItemWrapper()
class ClassMessage extends React.Component {
    render() {
        const { message } = this.props;
        return (
            <div className="notice-center-message-content student-reactive on-log" data-log-region={message.businessType === "course_evaluate" ? "news-comments" : "news-consulting"}>
                <div className="notice-detail">
                    <p className="title">
                        {message.businessType === "course_evaluate" &&
                            `${message.userName}评论了你的课`}
                        {message.businessType === "course_consult" &&
                            `${message.userName}向你咨询`}
                    </p>
                    {message.score !== null && message.score !== undefined && (
                        <Ranking rank={message.score} />
                    )}
                    <p className="desc">
                        {message.businessType === "course_evaluate" &&
                            "评价内容："}
                        {message.businessType === "course_consult" &&
                            "咨询内容："}
                        {message.content}
                    </p>
                </div>
                <div className="notice-class">
                    <div className="img-wrap">
                        <img src={message.courseHeadImage} alt="" />
                    </div>
                    <div className="class-title">{message.courseName}</div>
                </div>
            </div>
        );
    }
}

export default ClassMessage;
