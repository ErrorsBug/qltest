import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import QRImg from 'components/qr-img';
import { getUserInfo, getQr, getInviterInfo  } from "../../actions/common";

const CHAT_LIST = [
    "哇，我没想到你也对这门课感兴趣，真是志趣相投！",
    "我很喜欢这个课程，老师讲得很好，实名推荐！",
    "问了好几个朋友，都有在学这个课，你也一起呀！",
    "#用户昵称#，这个课很不错，我要拉你入坑~",
    "这么好的课程不听就亏了，快加入吧！",
    "#用户昵称#，你是第4个被我种草的，哈哈哈哈~"
];

/**
 * 邀请卡 订阅号关注页
 */
class ShareCardSubscribe extends Component {
    state = {
        qrcodeUrl: ""
    };

    async componentDidMount() {
        await this.props.getUserInfo();
        await this.props.getInviterInfo(this.props.userInfo.userId, this.props.location.query.fromUserId);
        const randomConvesationText =
            CHAT_LIST[Math.floor(Math.random() * (5 - 0 + 1)) + 0];
        this.setState({
            convesationText: getText(randomConvesationText, this.props.userInfo.name)
        });
        this.getFocusQr({});
    }

    // 获取引导关注二维码
    async getFocusQr() {
        const { liveId, topicId, channelId, appId } = this.props.location.query;
        const postData = {
            channel: "201", // 邀请卡
            topicId,
            liveId,
            userId: this.props.userInfo.userId,
            // 分享者userId
            fromUserId: this.props.location.query.fromUserId,
            channelId,
            appId
        };
        try {
            const result = await this.props.getQr(postData);
            if (result.state.code === 0) {
                this.setState({
                    qrcodeUrl: imageProxy(result.data.qrUrl),
                    followDialogOption: {
                        appId: result.data.appId,
                        traceData: 'shareCardSubscribe',
                        channel: '201'
                    }
                });
            }
        } catch (error) {}
    }

    render() {
        const {
            followDialogOption = {}
        } = this.state
        return (
            <Page title={"邀请卡"} className="share-card-subscribe">
                <div className="sharer-box">
                    <div className="sharer">
                        <div className="left-side">
                            <div className="avartar">
                                {
                                    this.props.inviterInfo&&
                                    <img
                                        src={this.props.inviterInfo.headImgUrl}
                                        alt=""
                                    />
                                }
                            </div>
                        </div>
                        <div className="right-side">
                            <div className="sharer-name">
                                {this.props.inviterInfo && this.props.inviterInfo.name}
                            </div>
                            <div className="msg">
                                {this.state.convesationText}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="qr-box">
                    <p className="title">关注公众号，获取听课链接</p>
                    <p className="desc">
                        如果关注后没有向你推送课程，
                        请在公众号里回复【我要听课】
                    </p>
                    <div className="qrcode">
                        <QRImg
                            src = { this.state.qrcodeUrl }
                            traceData = { followDialogOption.traceData }
                            channel = { followDialogOption.channel }
                            appId={ followDialogOption.appId }
                            className="img"
                            />
                    </div>
                </div>
            </Page>
        );
    }
}

function getText(text, name) {
    const reg = /\#.*?\#/;
    return reg.test(text) ? text.replace(reg, name) : text;
}

function imageProxy(url) {
    if (!url) {
        return "";
    } else if (/^data:image\/\w+;base64,/.test(url)) {
        return url;
    } else {
        return "/api/wechat/image-proxy?url=" + encodeURIComponent(url);
    }
}

function mapStateToProps(state) {
    console.log(state);

    return {
        inviterInfo: state.common.inviter,
        userInfo: state.common.userInfo
    };
}

const mapActionToProps = {
    getUserInfo,
    getQr,
    getInviterInfo
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(ShareCardSubscribe);
