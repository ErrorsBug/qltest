import * as React from "react";
import "./style.scss";
import { locationTo } from "components/util";
import { CSSProperties } from "react";
interface Props {
    liveId: string; // 直播间Id
    allowMGLive: boolean; // 客戶端属性
    communityInfo: {
        communityCode?: string | null;
        communityName?: string | null;
        showStatus?: "Y" | "N";
    }; // 社群信息
    padding?: CSSProperties;
    isGroupOpen?: boolean; // 社群是否开启
    hasBeenClosed: boolean; // 是否被关闭
    isBuy?: boolean; // 是否报名
    forceHidden?: boolean; // 强制隐藏
    onClose?: () => void;
    onModal?: () => void; // 点击了解
    // onGoGroup?: () => void; // 点击重定向
}

/**
 * B端：如果社群已经开启，显示该入口
 * C端：---社群是否开启----N ----- 不显示
 *                    |
 *                    --Y ----- 是否报名 ---Y --- 显示进入社群
 *                                       |
 *                                       --N --- 显示了解社群
 */
function IntroGroupBar(props: Props) {
    if (props.forceHidden) return null;
    if (props.hasBeenClosed) return null;
    if (props.communityInfo && props.communityInfo.showStatus === "Y") {
        return (
            <div
                className="intro-group-bar-wrap"
                style={props.padding ? { padding: props.padding } : null}e
            >
                <div className="intro-group-bar">
                    <div className="head-img">
                        <img src={require("./img/tp.png")} alt="" />
                    </div>
                    <div className="content">
                        <p className="title">
                            {// 是管理员
                            props.allowMGLive && "马上进入我的课程社群"}
                            {!props.allowMGLive &&
                                (props.isBuy
                                    ? "马上进入我的课程社群"
                                    : "课程已开启了社群功能")}
                        </p>
                    </div>
                    <div className="btn-wrap">
                        <button
                            className="btn"
                            onClick={() => {
                                if (
                                    props.allowMGLive ||
                                    (!props.allowMGLive && props.isBuy)
                                ) {
                                    locationTo(
                                        `/wechat/page/community-qrcode?liveId=${props.liveId}&communityCode=${props.communityInfo.communityCode}`
                                    );
                                } else {
                                    props.onModal && props.onModal();
                                }
                            }}
                        >
                            {// 是管理员
                            props.allowMGLive && "点击进入"}
                            {!props.allowMGLive &&
                                (props.isBuy ? "点击进入" : "点击了解")}
                        </button>
                    </div>
                    <span className="close-btn" onClick={props.onClose}>
                        <img src={require("./img/close.png")} alt="" />
                    </span>
                </div>
            </div>
        );
    }

    return null;
}

export default IntroGroupBar;
