import React from "react";
import "./style.scss";
import { locationTo } from "components/util";

const GroupEntranceBar = ({
    hasBeenClosed, // 是否已经被关闭
    liveId,
    communityInfo,
    padding,
    onClose
}) => {
    if (communityInfo && communityInfo.showStatus !== "Y") return null;
    if (!hasBeenClosed && communityInfo && communityInfo.communityCode) {
        return (
            <div
                className="group-entrance-bar-wrap"
                style={padding ? { padding: padding } : null}
            >
                <div className="group-entrance-bar">
                    <div className="head-img">
                        <img src={require("./img/tp.png")} alt="" />
                    </div>
                    <div className="content">
                        <p className="title">课程已开启了社群功能</p>
                        <p className="sub-title">赶快加入吧!</p>
                    </div>
                    <div className="btn-wrap">
                        <button
                            className="btn"
                            onClick={() => {
                                locationTo(
                                    `/wechat/page/community-qrcode?liveId=${liveId}&communityCode=${communityInfo.communityCode}`
                                );
                            }}
                        >
                            加群学习
                        </button>
                    </div>
                    <span
                        className="close-btn"
                        onClick={() => {
                            onClose && onClose();
                        }}
                    >
                        <img src={require("./img/close.png")} alt="" />
                    </span>
                </div>
            </div>
        );
    }
    return null;
};
export default GroupEntranceBar;
