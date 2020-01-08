import React from "react";
import MessageItemWrapper from "../../message-item-hoc";

@MessageItemWrapper()
class PlatformActivity extends React.Component {
    render() {
        const { message } = this.props;
        return (
            <div
                data-log-region="news-activity"
                className={[
                    "notice-center-message-content platform-activity on-log",
                    message.imageUrl ? null : "pure-text"
                ].join(" ")}
            >
                <div className="notice-detail">
                    {message.imageUrl && (
                        <div className="img-wrap">
                            <img src={message.imageUrl} alt="" />
                        </div>
                    )}
                    <div className="desc">{message.content}</div>
                </div>
            </div>
        );
    }
}

export default PlatformActivity;
