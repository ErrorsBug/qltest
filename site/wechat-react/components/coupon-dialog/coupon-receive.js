import React from "react";
import PropTypes from "prop-types";
import { couponStatus, getCouponStatus } from "./coupon-status";

const getDate = timestamp => {
    let date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

class CouponReceive extends React.Component {
    onClick = () => {
        switch (getCouponStatus(this.props.coupon)) {
            case "unused":
                this.props.onClickUse();
                break;
            case "binding":
                break;

            case "bindSuccess":
                break;

            case "bind":
                this.gotoBusinessPage(true);
                break;
            default:
                this.gotoBusinessPage();
        }
    };

    state = {
        time: 5
    };

    componentWillReceiveProps(nextProps) {
        if (getCouponStatus(nextProps.coupon) == "bindSuccess") {
            this.intervalId = setInterval(() => {
                if (this.state.time == 0) {
                    this.gotoBusinessPage(true);
                    clearInterval(this.intervalId);
                } else {
                    this.setState({
                        time: this.state.time - 1
                    });
                }
            }, 1000);
        }
    }

    gotoBusinessPage(available) {
        let status = getCouponStatus(this.props.coupon);
        let withCoupon = false;
        if (status.indexOf("overdue") > -1 && status == "bindOut") {
            withCoupon = false;
        } else {
            withCoupon = true;
        }

        let shareKey = ''; 
        if (typeof this.props.shareKey == 'string') {
            shareKey = this.props.shareKey;
        } else if (Array.isArray(this.props.shareKey)) {
            shareKey = this.props.shareKey[0];
        }
        
        switch (this.props.businessType) {
            case "topic":
                window.location.href =
                    "/wechat/page/topic-intro?topicId=" +
                    this.props.businessId +
                    `${withCoupon ? `&couponId=${this.props.coupon.id}` : ""}`+
                    `${shareKey ? `&shareKey=${shareKey}&type=topic` : ""}`;
                break;
            case "channel":
                window.location.href =
                    "/wechat/page/channel-intro?channelId=" +
                    this.props.businessId + 
                    `${withCoupon ? `&couponId=${this.props.coupon.id}` : ""}`+
                    `${shareKey ? `&shareKey=${shareKey}` : ""}`;
                break;
            case "camp":
                window.location.href =
                    "/wechat/page/camp-detail?campId=" +
                    this.props.businessId + 
                    `${withCoupon ? `&couponId=${this.props.coupon.id}` : ""}`+
                    `${shareKey ? `&shareKey=${shareKey}` : ""}`;
                break;
            case "global_vip":
                let url = available
                    ? `/wechat/page/live-vip-details?liveId=${
                          this.props.liveId
                      }`
                    : `/wechat/page/live/${this.props.liveId}`;
                location.href = url;
                break;
            default:
                window.location.href = `/wechat/page/live/${this.props.liveId}`+`${shareKey ? `?lshareKey=${shareKey}` : ""}`;
        }
    }

    uiSecondSection = () => {
        let { props } = this;
        let { coupon } = props;
        if (getCouponStatus(coupon) == "bindSuccess") {
            return (
                <div className="second-section">
                    <div className="bind-success">
                        <img src={require("./img/bind-success.svg")} />
                        <span>领取成功</span>
                    </div>
                </div>
            );
        }
        if (this.props.businessType == "live") {
            return (
                <div className="second-section" style={{
                    justifyContent: !props.coupon.minMoney ? 'center' : ''
                }}>
                    <div
                        className={
                            "coupon-info " +
                            (getCouponStatus(coupon).indexOf("overdue") > -1
                                ? "info-disable"
                                : "")
                        }
                    >
                        <div className="coupon-money">
                            <span className="unit">¥</span>
                            <span className="money">{props.coupon.money}</span>
                        </div>
                        {
                            props.coupon.minMoney ? 
                            <div className="min-money">
                                满¥
                                {coupon.minMoney}
                                元可用
                            </div> : null
                        }
                    </div>
                </div>
            );
        }
        return (
            <div className="second-section">
                <div
                    className={
                        "coupon-info " +
                        (getCouponStatus(coupon).indexOf("overdue") > -1
                            ? "info-disable"
                            : "")
                    }
                >
                    <div className="coupon-money">
                        <span className="unit">¥</span>
                        <span className="money">{props.coupon.money}</span>
                    </div>
                    {/(topic|channel|camp)/.test(props.businessType) ? (
                        <div
                            className="range"
                            onClick={() => {
                                this.gotoBusinessPage();
                            }}
                        >
                            仅适用:【
                            <span>{props.businessName}</span>
                            】课程
                        </div>
                    ) : /live/.test(props.businessType) ? (
                        <div className="range">直播间通用券</div>
                    ) : (
                        <div className="range">通用VIP优惠券</div>
                    )}
                </div>
            </div>
        );
    };

    uiThirdSection = () => {
        let { props } = this;
        let { coupon } = props;
        if (this.props.businessType == "live") {
            return (
                <div
                    className={
                        "third-section " +
                        (getCouponStatus(coupon).indexOf("overdue") > -1
                            ? "third-section-info-disable"
                            : "")
                    }
                >
                    {getCouponStatus(coupon).indexOf("overdue") > -1 ? (
                        <div className="overdue live">优惠券已过期</div>
                    ) : getCouponStatus(coupon) == "bindOut" ? (
                        <div className="bindOut live">优惠券已领完</div>
                    ) : coupon.overTime ? (
                        <div className="valid live">
                            有效期至
                            {getDate(coupon.overTime)}
                        </div>
                    ) : (
                        <div className="valid live">永久有效</div>
                    )}
                    {/(topic|channel|camp)/.test(props.businessType) ? (
                        <div
                            className="range"
                            onClick={() => {
                                this.gotoBusinessPage();
                            }}
                        >
                            仅适用:【
                            <span>{props.businessName}</span>
                            】课程
                        </div>
                    ) : /live/.test(props.businessType) ? (
                        <div className="range">直播间通用券</div>
                    ) : (
                        <div className="range">通用VIP优惠券</div>
                    )}
                </div>
            );
        } else {
            return (
                <div
                    className={
                        "third-section " +
                        (getCouponStatus(coupon).indexOf("overdue") > -1
                            ? "third-section-info-disable"
                            : "")
                    }
                >
                    {getCouponStatus(coupon).indexOf("overdue") > -1 ? (
                        <div className="overdue">优惠券已过期</div>
                    ) : getCouponStatus(coupon) == "bindOut" ? (
                        <div className="bindOut">优惠券已领完</div>
                    ) : coupon.overTime ? (
                        <div className="valid">
                            有效期至
                            {getDate(coupon.overTime)}
                        </div>
                    ) : (
                        <div className="valid">永久有效</div>
                    )}
                </div>
            );
        }
    };

    render() {
        let { props } = this;
        let { coupon } = props;
        console.log(getCouponStatus(coupon));
        return (
            <div className="coupon-receive">
                <div className="coupon-receive-inner">
                    {getCouponStatus(coupon) == "bind" ? (
                        <img
                            className="icon-identify"
                            src={require("./img/has-get.svg")}
                        />
                    ) : null}
                    {getCouponStatus(coupon) == "bind-overdue" ? (
                        <img
                            className="icon-identify"
                            src={require("./img/has-get-overdue.svg")}
                        />
                    ) : null}
                    {getCouponStatus(coupon) == "used" ? (
                        <img
                            className="icon-identify"
                            src={require("./img/has-use.svg")}
                        />
                    ) : null}
                    {getCouponStatus(coupon) == "used-overdue" ? (
                        <img
                            className="icon-identify"
                            src={require("./img/has-use-overdue.svg")}
                        />
                    ) : null}
                    <div className="coupon-receive-inner-inner">
                        <header>
                            <div
                                className="header-inner"
                                onClick={() => {
                                    location.href = `/wechat/page/live/${
                                        this.props.liveId
                                    }`;
                                }}
                            >
                                <img
                                    src={props.avatar}
                                    alt=""
                                    className="avatar"
                                />
                                <div className="live">
                                    <div className="live-name">
                                        {props.liveName}
                                    </div>
                                </div>
                            </div>
                        </header>
                        {this.uiSecondSection()}
                        {this.uiThirdSection()}

                        <div className="fourth-section">
                            {getCouponStatus(coupon).indexOf("overdue") > -1 ||
                            getCouponStatus(coupon) == "used" ||
                            getCouponStatus(coupon) == "bindOut" ? (
                                <div
                                    className="use-button"
                                    onClick={this.onClick}
                                >
                                    <div>
                                        {/topic|channel|camp/.test(
                                            props.businessType
                                        )
                                            ? "去课程看看"
                                            : "去直播间看看"}
                                    </div>
                                </div>
                            ) : null}
                            {getCouponStatus(coupon) == "binding" ? (
                                <div
                                    className="use-button"
                                    onClick={this.onClick}
                                >
                                    <div>领取中</div>
                                </div>
                            ) : null}
                            {getCouponStatus(coupon) == "bindSuccess" ? (
                                <div
                                    className="use-button"
                                    onClick={this.onClick}
                                >
                                    <div>
                                        跳转到直播间... ({this.state.time})
                                    </div>
                                </div>
                            ) : null}
                            {getCouponStatus(coupon) == "bind" ? (
                                <div
                                    className="use-button"
                                    onClick={this.onClick}
                                >
                                    <div>立即使用</div>
                                </div>
                            ) : getCouponStatus(coupon) == "unused" ? (
                                <div
                                    className="use-button"
                                    onClick={this.onClick}
                                >
                                    <div>马上领取</div>
                                </div>
                            ) : null}
                        </div>

                        <div className="fifth-section">
                            <div className="info">
                                卡券可访问“个人中心>我的优惠券”查看
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CouponReceive.propTypes = {
    style: PropTypes.oneOf(["qrcode", "button", ""]),
    money: PropTypes.number,
    liveName: PropTypes.string,
    businessName: PropTypes.string,
    onClickUse: PropTypes.func,
    shareKey: PropTypes.string,
};

export default CouponReceive;
