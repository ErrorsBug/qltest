import React from "react";
import { createPortal } from "react-dom";

import { whatQrcodeShouldIGet } from "common_actions/common";
import CollectVisible from 'components/collect-visible';

export default class TryListenShareMask extends React.Component {
    state = {
        show: false
    };

    componentDidMount() {
        this.getQr();
    }

    getQr = async () => {
        let {
            isBindThird,
            isFocusThree,
            subscribe,
            liveId,
            topicId,
            channelId
        } = this.props;
        const result = await whatQrcodeShouldIGet({
            isBindThird,
            isFocusThree,
            options: {
                subscribe,
                channel: "inviteAudition",
                liveId: liveId,
                topicId: topicId,
                channelId
            }
        });
        if (result) {
            this.setState({
                qrUrl: result.url
            });
        }
        this.setState({
            show: true
        });
    };

    render() {
        let {
            inviteNum = 0,
            inviteTotal = 0,
            imageList = [],
            qrUrl = "",
            onClose = () => {}
        } = this.props;
        while (imageList.length < inviteTotal) {
            imageList.push("");
        }
        try {
            inviteNum = imageList.filter(item => !!item).length
        } catch (error) {
            inviteNum = 0
        }
        if (!this.state.show) return null;
        return createPortal(
            <div className="try-list-share-mask" onClick={onClose}>
                <div className="middle-section">
                    <div
                        className="middle-section-inner"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="arrow">
                            <img
                                className="pic-arrow"
                                src={require("./assets/pic-arrow.svg")}
                                onClick={e => e.stopPropagation()}
                            />
                        </div>
                        <img
                            className="icon-share"
                            src={require("./assets/icon-share.svg")}
                        />
                        <div className="title">发送给好友</div>
                        <div className="prompt">
                            {inviteTotal}位好友<span>点击链接</span>，你就可以
                            <span>免费听下一课</span>
                        </div>
                        <div className="invite">
                            已邀请{inviteNum}人，还差{inviteTotal - inviteNum}人
                        </div>
                        <div className="require">(好友须未购买该课程)</div>
                        <div className="head-img-list">
                            {imageList.map(item => {
                                console.log("imageList", item);
                                return (
                                    <img
                                        key={item}
                                        className="head-img"
                                        src={
                                            item ||
                                            require("./assets/people.svg")
                                        }
                                    />
                                );
                            })}
                        </div>

                        {this.state.qrUrl ? (
                            <div className="bottom">
                                <div
                                    className="prompt"
                                    onClick={e => e.stopPropagation()}
                                >
                                    关注公众号，及时获取解锁进度
                                </div>
                                <div className="qr-code-wrap">
                                    <CollectVisible>
                                        <img
                                            className="qr-code on-visible"
                                            data-log-region="visible-channel"
                                            data-log-pos="channel"
                                            src={this.state.qrUrl}
                                            onClick={e => e.stopPropagation()}
                                        />
                                    </CollectVisible>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>,
            document.querySelector(".portal-high")
        );
    }
}
