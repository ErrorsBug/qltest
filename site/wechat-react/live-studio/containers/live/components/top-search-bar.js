import React, { PureComponent } from "react";
import { locationTo } from "../../../../components/util";

class TopSearchBar extends PureComponent {
    componentDidMount() {
        setTimeout(() => {
            typeof _qla != "undefined" && _qla.collectVisible();
        }, 2000);
    }
    render() {
        return (
            <div className="top-search-bar">
                <div
                    className="inner on-log"
                    onClick={() => {
                        location.href = `/wechat/page/search?liveId=${this.props.liveId}`;
                    }}
                    data-log-name="搜索"
                    data-log-region="recommend-top-search-bar"
                >
                    <img
                        className="top-search-bar-icon"
                        src={require("../img/search.svg")}
                    />
                    <div className="input">请输入课程名称</div>
                </div>
                {this.props.allowMGLive && (
                    <div
                        className="top-search-bar-btn on-log on-visible"
                        data-log-region="topBarVip"
                        data-log-pos="B"
                        onClick={() => {
                            locationTo(
                                `/wechat/page/live-vip-setting-types?liveId=${this.props.liveId}`
                            );
                        }}
                    >
                        <img src={require("../img/live-vip.png")} alt="" />
                    </div>
                )}
                {!this.props.allowMGLive && (
                    <>
                        {this.props.hasLiveVip === "Y" && (
                            <div
                                className="top-search-bar-btn on-log on-visible"
                                data-log-region="topBarVip"
                                data-log-pos="C"
                                onClick={() => {
                                    locationTo(
                                        `/wechat/page/live-vip?liveId=${this.props.liveId}`
                                    );
                                }}
                            >
                                <img
                                    src={require("../img/buy-vip.png")}
                                    alt=""
                                />
                            </div>
                        )}
                        {
                            this.props.isBindApp &&
                            <div className="top-search-bar-btn on-log on-visible" data-log-region="QRcode" data-log-pos="C" onClick={this.props.onQrCode}>
                                <img src={require("../img/qr-bg.png")} alt="" />
                            </div>
                        }
                        {this.props.shareQualify &&
                            this.props.shareQualify.type === "live" &&
                            this.props.shareQualify.status === "Y" && (
                                <div
                                    className="top-search-bar-btn on-log on-visible" 
                                    data-log-region="shareLiveCard" 
                                    data-log-pos="C"
                                    onClick={() => {
                                        locationTo(
                                            `/wechat/page/sharecard?type=live&liveId=${this.props.liveId}`
                                        );
                                    }}
                                >
                                    <img
                                        src={require("../img/share-bg.png")}
                                        alt=""
                                    />
                                </div>
                            )}
                    </>
                )}
            </div>
        );
    }
}

export default TopSearchBar;
