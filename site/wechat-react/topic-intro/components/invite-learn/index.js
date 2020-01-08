import React from "react";
import { createPortal } from "react-dom";

export default class InviteLearn extends React.Component {
    render() {
        let { info } = this.props;
        console.log('invitelearn', info)
        let { userName, headImage, topicName, topicId} = info;

        return createPortal(
            <div className="invite-learn-mask" onClick={this.props.onClose}>
                <div
                    className="invite-learn-dialog"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="avatar-wrap">
                        <img src={headImage} />
                    </div>
                    <div className="nickname">
                        {userName}正在学
                    </div>
                    <div className="course-name">
                        <div>课程名称：</div>
                        <div className="course">{topicName}</div>
                    </div>
                    <div className="learn-together">
                        <div className="learn-btn" onClick={() => {
                            location.href = `/topic/details?topicId=${topicId}`
                        }}>一起学习</div>
                    </div>
                </div>
            </div>,
            document.querySelector(".portal-low")
        );
    }
}
