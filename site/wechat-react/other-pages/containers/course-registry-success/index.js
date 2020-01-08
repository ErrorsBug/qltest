/*
*
*
*
*
*
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*       已迁移，下次再删除
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*/ 
import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { apiService } from "components/api-service";
import { request, getDomainUrl } from 'common_actions/common';
class CourseRegistrySuccess extends Component {
    getBusinessName = async () => {
        try {
            let result = await apiService.post({
                url: "/h5/live/getBusinessByType",
                body: {
                    type: this.businessType,
                    businessId: this.businessId
                }
            });
            if (result.state.code == 0) {
                this.setState({
                    businessName: result.data.name
                });
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    get businessId() {
        return this.props.location.query.businessId;
    }

    get businessType() {
        return this.props.location.query.businessType;
    }

    get liveId() {
        return this.props.location.query.liveId;
    }

    get communityCode() {
        return this.props.location.query.communityCode;
    }

    ajaxIsServiceWhiteLive = async () => {
        try {
            let result = await apiService.post({
                url: '/h5/live/isServiceWhiteLive',
                body: {
                    liveId: this.liveId
                }
            })
            if (result.state.code == 0){
                let returnValue = {
                    isServiceWhite: result.data.isWhite,
                    isBindThird: result.data.isBindThird
                }
                return returnValue;
            } else {
                window.toast(result.state.msg);
                return {
                    isServiceWhite: 'N',
                    isBindThird: 'N'
                }
            }
        } catch (error) {
            console.error(error);
            return {
                isServiceWhite: 'N',
                isBindThird: 'N'
            }
        }
    }

    state = {
        isSubscribe: undefined,
        qlchatQrcode: ""
    };

    async componentDidMount() {
        this.getBusinessName();
        this.getWechatGroupName();
        this.getDomainUrl();
        let { isServiceWhite, isBindThird } = await this.ajaxIsServiceWhiteLive();
        if (isServiceWhite == 'Y' && isBindThird == 'Y') {
            let isSubscribe = await this.getisSubscribe(this.liveId);
            if (isSubscribe) {
                this.setState({
                    isSubscribe: isSubscribe
                })
            } else {
                let qrcode = await this.getQr('N');

                this.setState({
                    isSubscribe: false,
                    qlchatQrcode: qrcode
                })
            }
        } else {
            let isSubscribe = await this.getisSubscribe();
            if (isSubscribe) {
                this.setState({
                    isSubscribe: isSubscribe
                })
            } else {
                let qrcode = await this.getQr();
                this.setState({
                    qlchatQrcode: qrcode,
                    isSubscribe: false
                })
            }
        }
    }

    getDomainUrl = async () => {
        try {
            let result = await this.props.getDomainUrl({
                type: 'activityCommunity'
            });
            if (result.state.code == 0) {
                this.setState({
                    domainUrl : result.data.domainUrl,
                })
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error)
        }
    }

    // 是否关注三方或千聊公众号，有liveId则是判断是否关注三方，没有就是判断是否关注千聊
    getisSubscribe = async (liveId) => {
        try {
            let result = await apiService.post({
                url: "/h5/user/isSubscribe",
                body: {
                    liveId
                }
            });
            if (result.state.code == 0) {
                if (liveId) {
                    return result.data.isFocusThree;
                } else {
                    return result.data.subscribe;
                }
            } else {
                window.toast(result.state.msg);
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    getQr = async (showQl = 'Y') => {
        try {
            let result = await apiService.post({
                url: "/h5/live/getQr",
                body: {
                    liveId: this.liveId,
                    channel: "courseCommunity",
                    showQl: showQl,
                    pubBusinessId: this.communityCode
                }
            });
            if (result.state.code == 0) {
                return result.data.qrUrl;
            } else {
                window.toast(result.state.msg);
                return ''
            }
        } catch (error) {
            console.error(error);
            return ''
        }
    };

    getWechatGroupName = async () => {
        try {
            let result = await request({
                url: "/api/wechat/community/getCommunityQrcode",
                method: 'POST',
                body: {
                    communityCode: this.communityCode,
                }
            });
            if (result.state.code == 0) {
                this.setState({
                    groupName: result.data.groupName
                })
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        if (typeof this.state.isSubscribe != 'boolean') {
            return null;
        }
        return (
            <Page title={"购买成功"} className="course-registry-success">
                <div className="background-image">
                    <img
                        style={{
                            width: "100%"
                        }}
                        src={
                            this.state.isSubscribe
                                ? require("./assets/background2.svg")
                                : require("./assets/background.svg")
                        }
                    />
                </div>
                <div className="background">
                    <div className="content-container">
                        <div className="course-container">
                            <div className="label">已购课程</div>
                            <div className="course-name">
                                {this.state.businessName}
                            </div>
                        </div>
                        {this.state.isSubscribe ? (
                            <React.Fragment>
                                <div className="free-to-community">
                                    <img className="group-avatar" src={require('./assets/group-avatar.png')} />
                                    <div className="group-name">
                                        {this.state.groupName}
                                    </div>
                                    <div className="go-into-group">
                                        （限时进群中）
                                    </div>
                                    <div className="intersector">
                                    </div>
                                    <div className="goto-learn">进群学习课程</div>
                                    <div
                                        className="btn-free-in on-log"
                                        data-log-region="sign_up_success"
                                        onClick={() => {
                                            location.href =
                                                `${this.state.domainUrl}wechat/page/community-qrcode?liveId=${
                                                    this.liveId
                                                }&communityCode=${
                                                    this.communityCode
                                                }` +
                                                (this.groupWxid
                                                    ? "&groupWxid=" +
                                                      this.groupWxid
                                                    : "");
                                        }}
                                    >
                                        免费加入社群
                                    </div>
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <div className="account-code">
                                    <div className="qr-code-wrap">
                                        <img
                                            className="qr-code"
                                            src={this.state.qlchatQrcode}
                                        />
                                        <div className="left-top" />
                                        <div className="right-top" />
                                        <div className="bottom-left" />
                                        <div className="bottom-right" />
                                    </div>
                                </div>
                                <div className="info">
                                    长按识别二维码，关注公众号听课
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {
    getDomainUrl
};
module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseRegistrySuccess);
