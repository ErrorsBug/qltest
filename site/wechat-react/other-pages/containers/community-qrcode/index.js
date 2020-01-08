import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { request } from "common_actions/common";
import Curtain from "components/curtain/index";
import { CopyToClipboard } from "react-copy-to-clipboard";

const textToCopy = "qianliaoyunying";

class CommunityQrcode extends Component {
    get liveId() {
        return this.props.location.query.liveId;
    }

    get communityCode() {
        return this.props.location.query.communityCode;
    }

    get groupWxid() {
        return this.props.location.query.groupWxid;
    }

    state = {
        isQrcodeError: false,
        showCurtain: false,
        showFeedbackToast: false
    };

    getCommunityQrcode = async () => {
        try {
            let result = await request({
                url: "/api/wechat/community/getCommunityQrcode",
                method: "POST",
                body: {
                    communityCode: this.communityCode,
                    groupWxid: this.groupWxid
                }
            });
            if (result.state.code == 0) {
                const { customerQrCode, qrcodeImg, groupName } = result.data;
                this.setState({
                    customerQrCode,
                    qrcodeImg,
                    groupName
                });
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    componentDidMount() {
        this.getCommunityQrcode();
    }

    /**
     * 当社群二维码加载异常， 意味着社群群主被封，
     * 此时显示二维码异常样式
     */
    onQrcodeError = () => {
        this.setState({
            isQrcodeError: true
        });
    };

    handleFeedbackClick = () => {
        // 下架投诉弹层
        // if (!this.state.showFeedbackToast) {
        //     this.setState({
        //         showFeedbackToast: true
        //     });

        //     // 3秒后关闭弹层
        //     setTimeout(() => {
        //         this.setState({
        //             showFeedbackToast: false
        //         });
        //     }, 3000);
        // }

        // 跳转至投诉/反馈表单填写承接页
        window.open('http://jrcskvptg4otat7c.mikecrm.com/eJCj8Il', '_self');
    };

    onCopyLink(text, result) {
        if (result) {
            window.toast("复制成功");
        } else {
            window.toast("复制失败，请手动长按复制");
        }
    }

    render() {
        const {
            qrcodeImg,
            groupName,
            customerQrCode,
            isQrcodeError,
            showCurtain,
            showFeedbackToast
        } = this.state;

        return (
            <Page title={"进群入口"} className="community-qrcode-container">
                <div
                    className={`community-qrcode-container-inner ${
                        customerQrCode ? "" : "no-service-qrcode"
                    }`}
                >
                    <div className="community-qrcode-tips">
                        <div
                            className="content-box"
                            onClick={this.handleFeedbackClick}
                        >
                            <img
                                src={require("./assets/question.png")}
                            />
                            <span className="text">群投诉/建议/反馈</span>
                        </div>
                    </div>
                    <div className="qrcode-container">
                        {isQrcodeError && (
                            <div className="qrcode-error-mask">
                                <div className="img-wrap">
                                    <img
                                        src={require("./assets/bg.png")}
                                        alt=""
                                    />
                                </div>
                                <p>
                                    很抱歉~目前加群人数较多，请稍后再试~
                                    <br />
                                    也可以联系老师或千聊客服~
                                </p>
                            </div>
                        )}
                        <div className="qrcode-title">
                            <img
                                className="nickname"
                                src={require("./assets/avatar.png")}
                            />
                            <div className="title">{groupName}</div>
                        </div>
                        <div className="qrcode-wrap">
                            <img className="qrcode" src={qrcodeImg} />
                        </div>
                        <div className="qrcode-tips-1">
                            <div className="prompt">扫描上方二维码</div>
                            <div className="join-in">免费加入课程社群</div>
                        </div>
                    </div>
                    {customerQrCode && (
                        <div className="qrcode-tips-2">
                            <p>
                                遇到扫码异常无法进群，请{" "}
                                <span
                                    className="trigger"
                                    onClick={() =>
                                        this.setState({ showCurtain: true })
                                    }
                                >
                                    点击这里
                                </span>
                            </p>
                            <p>添加老师为好友，加入课程群</p>
                        </div>
                    )}
                </div>
                {showFeedbackToast && (
                    <div className="feedback-toast">
                        <CopyToClipboard
                            text={textToCopy}
                            onCopy={this.onCopyLink}
                        >
                            <div>
                                <p>
                                    添加客服微信号
                                    <span className="copy-text">
                                        {textToCopy}
                                    </span>
                                </p>
                                <p>马上反馈你的问题。</p>
                                <p>（点击即可复制微信号）</p>
                            </div>
                        </CopyToClipboard>
                    </div>
                )}
                <Curtain
                    isOpen={showCurtain}
                    onClose={() => this.setState({ showCurtain: false })}
                >
                    <div className="qrcode-teacher-container">
                        <img
                            className="qrcode-teacher"
                            src={customerQrCode || ""}
                        />
                    </div>
                    <div className="qrcode-teacher-tips">
                        <p>扫码添加老师微信</p>
                        <p>即可进入课程社群哦~</p>
                    </div>
                </Curtain>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        sysTime: state.common.sysTime
    };
}

const mapDispatchToProps = {};
module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(CommunityQrcode);
