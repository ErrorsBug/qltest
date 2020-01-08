import React from "react";
import MessageItemWrapper from "../../message-item-hoc";

@MessageItemWrapper()
class SystemNotice extends React.PureComponent {
    renderContent = () => {
        const { message } = this.props;

        const deleteMap = {
            delete_camp_affair: "删除训练营打卡",
            delete_camp: "删除训练营",
            delete_channel: "删除系列课",
            delete_topic: "删除话题"
        };
        
        switch (message.businessType) {
            case "delete_camp_affair":
            case "delete_camp":
            case "delete_channel":
            case "delete_topic":
                return (
                    <>
                        <p className="desc">
                            审核结果：{deleteMap[message.businessType]}
                        </p>
                        <p className="desc">涉及课程：{message.courseName}</p>

                        <p className="desc main-desc">
                            审核处理内容：{message.violationContent}
                        </p>
                    </>
                );
            case "delete_image_text_card":
                return (
                    <>
                        <p className="desc">
                            审核结果：您在话题《{message.courseName}》中发送了一个图文卡，包含了违规内容，已删除
                        </p>
                        <p className="desc">涉及课程：{message.courseName}</p>

                        <p className="desc main-desc">
                            审核处理内容：<span dangerouslySetInnerHTML={{__html: message.violationContent}}></span>
                        </p>
                    </>
                );
            default:
                return (
                    <>
                        <p className="desc main-desc" dangerouslySetInnerHTML={{__html: message.content}}></p>
                    </>
                );
        }
    };

    getRegion(type) {
        switch(type) {
            case 'live_level':
                return 'news-senior';
            case "delete_camp_affair":
            case "delete_camp":
            case "delete_channel":
            case "delete_topic":
                return 'news-course-audit';
            case "enterprise_identity":
                return 'news-comp-certification';
            case "live_identity": 
                return 'news-per-certification';
        }
    }

    render() {
        const { message } = this.props;
        return (
            <div className="notice-center-message-content system-notice on-log" data-log-region={this.getRegion(message.businessType)}>
                <div className="notice-detail">{this.renderContent()}</div>
            </div>
        );
    }
}

export default SystemNotice;
