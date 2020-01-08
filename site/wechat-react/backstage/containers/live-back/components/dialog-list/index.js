import React from "react";
import { createPortal } from "react-dom";

export default class DialogList extends React.Component {
    render() {
        return createPortal(
            <div className="dialog-queue-container">
                <div className="dialog-queue">{this.props.children}</div>
            </div>,
            document.querySelector(".portal-high")
        );
    }
}

//直通车新规
export function NewRule({ onClose }) {
    const ruleList = [
        {
            title: "1. 千聊直通车，在H5端即日起升级为【千聊推荐】",
            content:
                "千聊直通车历史绑定的直播间用户已全部解绑（APP/小程序除外），这些用户后续在H5端，通过直播间直接产生交易，平台不参与分成，通过平台流量成交，平台才分成。"
        },
        {
            title:
                "2.  APP/小程序受限于IOS/微信发布规则，依然按千聊直通车，预计2个月内升级更新为“千聊推荐”。"
        },
        {
            title:
                "3. 通过千聊推荐（平台渠道流量）帮助您进行课程分发，按您之前签订的协议约定比例分成。"
        },
        {
            title:
                "4. 自2018年12月6日起，所有千聊推荐的H5订单分成只按照单次分成，平台不绑定用户（APP/小程序除外）。即平台为您的直播间带来新增粉丝，如果TA在您的直播间产生交易，平台不参与分成；当TA通过特定千聊官方渠道的产生交易，平台才参与分成。"
        },
        {
            title: (
                <React.Fragment>
                    5. 千聊为您带来的分发收益，可以在
                    <strong>“直播间收益”-“千聊推荐收益”</strong>查看。
                </React.Fragment>
            )
        }
    ];
    return (
        <div className="new-rule">
            <img
                className="icon-close"
                src={require("../../../../assets/icon-close.svg")}
                onClick={onClose}
            />
            <div className="new-rule-header">千聊直通车新规</div>
            <div className="new-rule-body">
                {ruleList.map(item => {
                    return (
                        <div className="rule">
                            <div className="rule-title">{item.title}</div>
                            <div className="rule-content">{item.content}</div>
                        </div>
                    );
                })}
                <div className="protocol">
                    请阅读 
                    <a
                        class="green-font"
                        href="/wechat/page/distribution/protocol"
                    >
                        《课程上架协议》
                    </a>
                </div>
            </div>
            <div className="new-rule-footer">
                <div className="btn-know" onClick={onClose}>
                    已阅读
                </div>
            </div>
        </div>
    );
}

export function QlRecommend({onClose, liveId}) {
    return (
        <div className="ql-recommend">
            <img
                className="icon-close"
                src={require("../../../../assets/icon-close.svg")}
                onClick={onClose}
            />
            <img
                className="share-open"
                src="https://m.qlchat.com/styles/wtwap/img/live/share-open.png"
                onClick={onClose}
            />
            <div className="btn-panel">
                <div className="btn" onClick={onClose}>取消</div>
                <div className="btn primary" onClick={() => {
                    onClose();
                    location.href = `wechat/page/distribution/live-center-options?liveId=${liveId}`
                }}>马上开启</div>
            </div>
        </div>
    );
}

export function FloatBox ({onClose, linkUrl, imageUrl}) {
    return (
        <div className="float-box">
            <div className="icon-close" onClick={onClose} ></div>
            <img src={imageUrl} onClick={() => {
                location.href = linkUrl
            }}/>
        </div>
    )
}
