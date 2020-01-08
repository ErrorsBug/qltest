import React, { Component } from "react";
import { createPortal } from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router";
import Page from "components/page";
import { autobind, throttle } from "core-decorators";
import { api } from "common_actions/common";
import {
    request,
    insertOssSdk,
    uploadImage,
    unbindPhone,
    updateUserInfo,
    getUserInfoP
} from "common_actions/common";
import NewRealNameDialog from "components/dialogs-colorful/new-real-name";
import { imgUrlFormat, locationTo, getCookie } from "components/util";
import WechatDialog from "./components/wechat-dialog";
import PhoneDialog from "./components/phone-dialog";
import MiddleDialog from "components/dialog/middle-dialog";
import Picker from "components/picker";
import ClipBoard from "clipboard";
import LiveCategoryPicker from 'components/live-category-picker';

import {
    getLiveTag,
    getPower,
    getLiveInfo,
    setAuditedStatues,
    getRealStatus,
    getCheckUser
} from "../../actions/live";
import "./style.scss";

@autobind
class LiveSetting extends Component {
    state = {
        info: null,
        isLiveCreator: false,
        tagList: [],
        hotLiveTags: [],
        tagId: [],
        name: "",
        introduce: "",
        _headImgUrl: "",
        showWechatDialog: false,
        showPhoneDialog: false,
        showServiceDialog: false,
        checkUserStatus: "no"
    };

    data = {
        userId: getCookie("userId")
    };

    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem("trace_page");
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem("trace_page", tp);
    }

    get liveId() {
        return this.props.location.query.liveId;
    }
    
    get autoLive() {
        return this.props.location.query.autoLive;
    }

    livecatePickerRef = null;

    async componentDidMount() {
        this.props.getUserInfoP();
        this.initClipBoard();
        this.getLiveInfo();
        this.getLiveTags();
        this.initRealStatus();

        await this.props.getLiveInfo(this.liveId);

        if (!this.props.power.liveId) {
            await this.props.getPower(this.liveId);
        }
        if (this.props.createBy) {
            this.setState({
                isLiveCreator: this.props.createBy == this.data.userId
            });
        }
    }

    initClipBoard = () => {
        let that = this;
        let clipboard = new ClipBoard("#pc-href");
        clipboard.on("success", function(e) {
            window.toast("复制成功！");
        });
        clipboard.on("error", function(e) {
            window.toast("复制失败！请手动复制");
        });

        let liveLinkClipBoard = new ClipBoard("#live-link");
        liveLinkClipBoard.on("success", function(e) {
            window.toast("复制成功！");
        });
        liveLinkClipBoard.on("error", function(e) {
            window.toast("复制失败！请手动复制");
        });

        var enterpriseClipBoard = new ClipBoard(".fuzhi");
        enterpriseClipBoard.on("success", function(e) {
            that.setState({
                showPcManageBox: false
            });
            window.toast("复制成功！");
        });
        enterpriseClipBoard.on("error", function(e) {
            that.setState({
                showPcManageBox: false
            });
            window.toast("复制失败！请手动复制");
        });
    };

    onChangeInputAvatar = e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        e.target.value = "";

        window.loading(true);
        insertOssSdk()
            .then(() => this.props.uploadImage(file))
            .then(_headImgUrl => {
                if (!_headImgUrl) throw Error("上传图片失败");
                // this.setState({
                //     _headImgUrl
                // }, () => {});
                this.Infomodify("logo", _headImgUrl);
            })
            .catch(err => {
                window.toast(err.message);
            })
            .then(() => {
                window.loading(false);
            });
    };

    onWechatCommit(wechatAccount) {
        this.setState({
            showWechatDialog: false
        });
        this.getLiveInfo();
    }

    onPhoneCommit() {
        this.setState({
            showPhoneDialog: false
        });
        this.getLiveInfo();
    }

    getLiveInfo() {
        request
            .post({
                url: "/api/wechat/transfer/h5/live/revonsitution/manage",
                body: {
                    liveId: this.liveId
                }
            })
            .then(res => {
                if (res.state.code === 0) {
                    this.setState({
                        ...res.data.liveEntityView,
                        tagId: res.data.tagId
                            ? [res.data.tagId]
                            : [],
                        info: res.data.liveEntityView,
                        enterpriseIdentityStatus:
                            res.data.enterpriseIdentityStatus,
                        userIdentityStatus: res.data.userIdentityStatus
                    });
                }
            })
            .catch(err => {
                // window.toast('获取短信配置失败')
            });
    }

    // 获取直播间类型列表
    async getLiveTags() {

        try {
            const hotLiveTagsRes = await request.post({
                url: "/api/wechat/transfer/h5/tag/hotLiveTags",
                body: {
                    isGetParentName: 'Y'
                }
            }); 
            const res = await request.post({
                url: "/api/wechat/transfer/h5/tag/allLiveTags",
            });
            if(res.state.code === 0 && hotLiveTagsRes.state.code === 0) {
                this.setState({
                    tagList: res.data && res.data.allLiveTags,
                    hotLiveTags: hotLiveTagsRes.data && hotLiveTagsRes.data.hotTags
                });

                if(this.autoLive === "Y") {
                    this.livecatePickerRef.onShow()
                }
            }
        } catch (error) {
            
        }
    }

    Infomodify(type, value) {
        request
            .post({
                url: "/api/wechat/transfer/h5/live/revonsitution/modify",
                body: {
                    liveId: this.liveId,
                    type,
                    value
                }
            })
            .then(res => {
                window.toast(res.state.msg);
                this.getLiveInfo();
            })
            .catch(err => {
                window.toast(res.state.msg);
            });
    }

    changeWechatAccountAndPhone(type, value) {
        const postData = {
            liveId: this.liveId
        };
        postData.savePhone = type === "phone" ? "Y" : "N";
        if (postData.savePhone === "Y") {
            postData.phoneNum = value;
        } else {
            postData.wechatAccount = value;
        }
        request
            .post({
                url: "/api/wechat/transfer/h5/live/saveWechatAccountAndPhone",
                body: postData
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                // window.toast('获取短信配置失败')
            });
    }

    changeName() {
        this.Infomodify("name", this.state.name);
        this.setState({
            liveNameSetDialog: false
        })
    }

    changeIntroduce() {
        this.Infomodify("introduce", this.state.introduce);
    }

    changeLiveTag(tagId) {
        request
            .post({
                url: "/api/wechat/transfer/h5/live/revonsitution/modify",
                body: {
                    liveId: this.liveId,
                    type: "account",
                    tagId
                }
            })
            .then(res => {
                window.toast(res.state.msg);
                const show = window.localStorage.getItem("SHOW_NEW_LIVE_CATE_DIALOG");
                if(show == null) {
                    window.localStorage.setItem("SHOW_NEW_LIVE_CATE_DIALOG", "Y");
                }
                this.getLiveInfo();
            })
            .catch(err => {
                window.toast(res.state.msg);
            });
    }

    async initRealStatus() {
        let statusresult = await this.props.getRealStatus(this.liveId, "topic");
        let { data } = await this.props.getCheckUser();
        const newReal = (data && data.status) || "no";
        const oldReal =
            (statusresult.data && statusresult.data.status) || "unwrite";
        this.setState({
            checkUserStatus: newReal
        });
        this.props.setAuditedStatues(oldReal);
    }

    onPersonalRealName() {
        if (!this.state.isLiveCreator) return;
        if (this.state.checkUserStatus === "no") {
            locationTo(`/wechat/page/real-name?liveId=${this.liveId}`);
        } else {
            this.setState({
                isShowRealName: true
            });
        }
    }

    onEnterpriceRealName() {
        if (!this.state.isLiveCreator) return;
        this.setState({
            showPcManageBox: true
        });
    }

	onBlur(e){
		window.scrollTo(0, document.body.scrollTop + 1);
		document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
	}

    render() {
        const { userInfo } = this.props;
        const {
            info,
            logo,
            name,
            phoneNum,
            wechatAccount,
            introduce,
            tagId,
            tagList,
            hotLiveTags,
            userIdentityStatus,
            enterpriseIdentityStatus,
            isLiveCreator
        } = this.state;
        const selectedTag =
            tagId &&
            tagId.length > 0 &&
            tagList.find(item => item.value === tagId[0]);
        return (
            <Page title="直播间设置" className="live-setting">
                <div className="container">
                    <WechatDialog
                        show={this.state.showWechatDialog}
                        wechatAccount={this.state.wechatAccount}
                        defaultStep={(!wechatAccount) ? 1 : 0}
                        liveId={this.liveId}
                        onCommit={this.onWechatCommit}
                        onCancel={() => {
                            this.setState({
                                showWechatDialog: false
                            });
                        }}
                    />
                    <PhoneDialog
                        show={this.state.showPhoneDialog}
                        defaultStep={(!phoneNum) ? 1 : 0}
                        phone={this.state.phoneNum}
                        onCommit={this.onPhoneCommit}
                        getCheckNum={this.sendCheckNum}
                        liveId={this.liveId}
                        onCancel={() => {
                            this.setState({
                                showPhoneDialog: false
                            });
                        }}
                    />
                    <div className="avartar-box">
                        <div className="avartar on-log" data-log-region="head">
                            <img
                                src={imgUrlFormat(
                                    logo || userInfo.headImgUrl,
                                    "?x-oss-process=image/resize,m_fill,limit_0,h_180,w_180"
                                )}
                            />
                            <input
                                className="upload"
                                type="file"
                                ref={r => (this.refInputAvatar = r)}
                                accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
                                onChange={this.onChangeInputAvatar}
                            />
                            <p> 点击更换直播间头像 </p>
                        </div>
                    </div>

                    <ul className="item-list">
                        <li className="item">
                            <div className="label">直播间名称</div>
                            <div 
                                className="value on-log"
                                data-log-region="name"
                                onClick={() => {
                                    this.setState({
                                        liveNameSetDialog: true,
                                        name: info && info.name || ''
                                    })
                                }}
                            >
                            {info && info.name || ''}
                            </div>
                            <i className="arrow">
                                <img src={require("./img/arrow.png")} alt="" />
                            </i>
                        </li>
                        <li className="item">
                            <div className="label">直播间简介</div>
                            <div
                                className={[
                                    "value",
                                    !introduce ? "empty" : null,
                                    "on-log"
                                ].join(" ")}
                                data-log-region="intro"
                                onClick={() => {
                                    locationTo(
                                        `/wechat/page/live/intro/edit/${this.liveId}`
                                    );
                                }}
                            >
                                {!!introduce && "去编辑"}
                                {!introduce && "你还没填写"}
                            </div>
                            <i className="arrow">
                                <img src={require("./img/arrow.png")} alt="" />
                            </i>
                        </li>
                        <li className="item">
                            <div className="label">
                                直播间分类
                                {/* 一个月后下线 */}
                                {!tagId[0] && <div className="red-spot"></div>}
                            </div>
                            <div className="value">
                                <LiveCategoryPicker
                                    ref={ref => {this.livecatePickerRef = ref}}
                                    col={2}
                                    hotData={hotLiveTags}
                                    data={tagList}
                                    labelKey="name"
                                    valueKey="id"
                                    value={tagId[0]}
                                    defaultShow={true}
                                    onChange={this.changeLiveTag}
                                >
                                    <div>
                                        {
                                            getLiveTagName(tagList, tagId[0]) || "请选择分类"
                                        }
                                    </div>
                                </LiveCategoryPicker>
                            </div>
                            <i className="arrow">
                                <img src={require("./img/arrow.png")} alt="" />
                            </i>
                        </li>
                        <li
                            className="item on-log"
                            data-log-region="background"
                            onClick={() => {
                                locationTo(
                                    `/live/entity/headerBgManage/${this.liveId}.htm`
                                );
                            }}
                        >
                            <div className="label">直播间背景</div>
                            <div className={["value", "empty"].join(" ")}>
                                应用于直播间小程序
                            </div>
                            <i className="arrow">
                                <img src={require("./img/arrow.png")} alt="" />
                            </i>
                        </li>

                        <span className="sepo"></span>
                        <li
                            className="item on-log"
                            data-log-region="phone"
                            onClick={() => {
                                if (!isLiveCreator) return;
                                this.setState({
                                    showPhoneDialog: true
                                });
                            }}
                        >
                            <div className="label">创建者手机号</div>
                            <div
                                className={`value ${!phoneNum ? "empty" : ""} ${
                                    !isLiveCreator ? "disabled" : ""
                                }`}
                            >
                                {phoneNum || "请不要随意更改"}
                            </div>
                            <i className="arrow">
                                <img src={require("./img/arrow.png")} alt="" />
                            </i>
                        </li>
                        <li
                            className="item on-log"
                            data-log-region="wechat"
                            onClick={() => {
                                if (!isLiveCreator) return;
                                this.setState({
                                    showWechatDialog: true
                                });
                            }}
                        >
                            <div className="label">创建者微信号</div>
                            <div
                                className={`value ${
                                    !wechatAccount ? "empty" : ""
                                } ${!isLiveCreator ? "disabled" : ""}`}
                            >
                                {wechatAccount || "请不要随意更改"}
                            </div>
                            <i className="arrow">
                                <img src={require("./img/arrow.png")} alt="" />
                            </i>
                        </li>
                        <li className="item">
                            <div className="label">创建者身份认证</div>
                            <div
                                className={`value ${
                                    !userIdentityStatus ? "empty" : ""
                                } ${!isLiveCreator ? "disabled" : ""} ${
                                    userIdentityStatus === "pass"
                                        ? "pass"
                                        : "no_pass"
                                } on-log`}
                                data-log-region="IDcard"
                                onClick={this.onPersonalRealName}
                            >
                                {userIdentityStatus === "awaiting" && "审核中"}
                                {userIdentityStatus === "pass" && "认证通过"}
                                {(userIdentityStatus === "reject" ||
                                    userIdentityStatus === "sys_reject") &&
                                    "认证失败"}
                                {userIdentityStatus === "invalid" && "待认证"}
                            </div>
                            {userIdentityStatus !== "pass" && (
                                <i className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </i>
                            )}
                        </li>
                        <li className="item">
                            <div className="label">直播间企业认证</div>
                            <div
                                className={`value ${
                                    !enterpriseIdentityStatus ? "empty" : ""
                                } ${!isLiveCreator ? "disabled" : ""} ${
                                    enterpriseIdentityStatus === "pass"
                                        ? "pass"
                                        : "no_pass"
                                } on-log`}
                                data-log-region="corporate"
                                onClick={this.onEnterpriceRealName}
                            >
                                {enterpriseIdentityStatus === "awaiting" &&
                                    "审核中"}
                                {enterpriseIdentityStatus === "pass" &&
                                    "认证通过"}
                                {enterpriseIdentityStatus === "invalid" &&
                                    "待认证"}
                                {(enterpriseIdentityStatus === "reject" ||
                                    enterpriseIdentityStatus ===
                                        "sys_reject") &&
                                    "认证失败"}
                            </div>
                            {enterpriseIdentityStatus !== "pass" && (
                                <i className="arrow">
                                    <img src={require("./img/arrow.png")} alt="" />
                                </i>)
                            }
                        </li>
                    </ul>

                    <div className="live-op">
                        <div className="op-list">
                            <div
                                className="op on-log"
                                data-log-region="copy"
                                id="live-link"
                                data-clipboard-text={`${window.location.origin}/wechat/page/live/${this.liveId}`}
                            >
                                <div className="op-icon">
                                    <img
                                        src={require("./img/copy-link.png")}
                                        alt=""
                                    />
                                </div>
                                <div className="text-wrap">
                                    <div className="text">复制直播间链接</div>
                                </div>
                                <i className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </i>
                            </div>
                            <span className="sepo"></span>
                            <div
                                className="op on-log"
                                data-log-region="shareCard"
                                onClick={() => {
                                    locationTo(
                                        `/wechat/page/sharecard?type=live&liveId=${this.liveId}`
                                    );
                                }}
                            >
                                <div className="op-icon">
                                    <img
                                        src={require("./img/gen-sharecard.png")}
                                        alt=""
                                    />
                                </div>
                                <div className="text-wrap">
                                    <div className="text">生成直播间邀请卡</div>
                                </div>
                                <i className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </i>
                            </div>
                        </div>
                    </div>

                    <div className="live-op">
                        <div className="header">直播间权限管理</div>
                        <div className="op-list">
                            <div
                                className="op left with-border on-log"
                                data-log-region="manager"
                                onClick={() => {
                                    locationTo(
                                        `/live/invite/mgrList/${this.liveId}.htm`
                                    );
                                }}
                            >
                                <div className="op-icon">
                                    <img
                                        src={require("./img/admin.png")}
                                        alt=""
                                    />
                                </div>
                                <div className="text-wrap">
                                    <div className="text">管理员</div>
                                    <div className="sub-text">
                                        设置直播间管理员
                                    </div>
                                </div>
                                <i className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </i>
                            </div>
                            <div
                                className="op with-border on-log"
                                data-log-region="guest"
                                onClick={() => {
                                    locationTo(
                                        `/wechat/page/guest-separate/channel-list-b?liveId=${this.liveId}&form=backstage`
                                    );
                                }}
                            >
                                <div className="op-icon">
                                    <img
                                        src={require("./img/guest.png")}
                                        alt=""
                                    />
                                </div>
                                <div className="text-wrap">
                                    <div className="text">嘉宾分成</div>
                                    <div className="sub-text">
                                        设置嘉宾分成比例
                                    </div>
                                </div>
                                <i className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </i>
                            </div>
                            <div
                                className="op left with-border on-log"
                                data-log-region="blacklist"
                                onClick={() => {
                                    locationTo(
                                        `/live/entity/enterBlacklist.htm?liveId=${this.liveId}`
                                    );
                                }}
                            >
                                <div className="op-icon">
                                    <img
                                        src={require("./img/black.png")}
                                        alt=""
                                    />
                                </div>
                                <div className="text-wrap">
                                    <div className="text">黑名单用户</div>
                                    <div className="sub-text">
                                        拉黑后无法报名课程
                                    </div>
                                </div>
                                <i className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </i>
                            </div>
                            <div
                                className="op with-border on-log"
                                data-log-region="Forbidden"
                                onClick={() => {
                                    locationTo(
                                        `/live/entity/blackList/${this.liveId}.htm`
                                    );
                                }}
                            >
                                <div className="op-icon">
                                    <img
                                        src={require("./img/shutup.png")}
                                        alt=""
                                    />
                                </div>
                                <div className="text-wrap">
                                    <div className="text">禁言用户</div>
                                    <div className="sub-text">
                                        禁言后不能发表评论
                                    </div>
                                </div>
                                <i className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </i>
                            </div>
                            <div
                                className="op left with-border"
                                onClick={() => {
                                    locationTo(
                                        `/live/entity/liveReward/${this.liveId}.htm`
                                    );
                                }}
                            >
                                <div className="op-icon">
                                    <img
                                        src={require("./img/reward.png")}
                                        alt=""
                                    />
                                </div>
                                <div className="text-wrap">
                                    <div className="text">赞赏设置</div>
                                    <div className="sub-text">
                                        设置赞赏分成比例
                                    </div>
                                </div>
                                <i className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </i>
                            </div>
                            <div
                                className="op with-border"
                                onClick={() => {
                                    locationTo(
                                        `/wechat/page/evaluation-setting?liveId=${this.liveId}`
                                    );
                                }}
                            >
                                <div className="op-icon">
                                    <img
                                        src={require("./img/comment.png")}
                                        alt=""
                                    />
                                </div>
                                <div className="text-wrap">
                                    <div className="text">评价设置</div>
                                    <div className="sub-text">
                                        关闭课程评价入口
                                    </div>
                                </div>
                                <i className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </i>
                            </div>
                        </div>
                    </div>

                    {/* 实名认证弹框  */}
                    <NewRealNameDialog
                        close={true}
                        show={this.state.isShowRealName}
                        onClose={() => {
                            this.setState({ isShowRealName: false });
                        }}
                        realNameStatus={this.props.auditedStatues || "unwrite"}
                        checkUserStatus={this.state.checkUserStatus}
                        isClose={true}
                        isLiveCreator={this.state.isLiveCreator}
                        liveId={this.props.liveId}
                    />
                </div>
                <div className="btn-wrap">
                    <div
                        className="btn on-log"
                        data-log-region="return"
                        onClick={() => {
                            locationTo(
                                `/wechat/page/backstage?liveId=${this.liveId}`
                            );
                        }}
                    >
                        返回直播间工作台
                    </div>
                </div>
                {this.state.showPcManageBox && (
                    <div
                        className="copy-pc-manage-url"
                        onClick={() => {
                            this.setState({
                                showPcManageBox: false
                            });
                        }}
                    >
                        <div
                            className="fuzhi"
                            data-clipboard-text="http://v.qianliao.tv/"
                        >
                            请登录“电脑端-千聊讲师管理后台”，进行企业认证：{" "}
                            <br />
                            如何登录电脑端？
                            <br />
                            方式一：打开浏览器搜索“千聊管理后台” <br />
                            方式二：在PC浏览器输入以下网址 <br />
                            <span className="link"> v.qianliao.tv </span>{" "}
                            (点击复制)
                        </div>
                    </div>
                )}

                {
                    this.state.liveNameSetDialog ?
                    <MiddleDialog
                        show={true}
                        theme='empty'
                        bghide={false}
                        close={true}
                        titleTheme={'white'}
                        className="live-name-set-dialog"
                        onClose={() => {
                            this.setState({liveNameSetDialog: false})
                        }}
                        >
                        <div className="_header">
                            <p>直播间名称</p>
                        </div>
                        <div className="_container">
                            <input 
                                type="text"
                                value={name}
                                onChange={e => {
                                    this.setState({
                                        name: e.target.value
                                    });
                                }}
                                onBlur={this.onBlur}
                                />
                        </div>
                        <div className="_footer">
                            <span className="cancel-btn" onClick={() => {
                                this.setState({liveNameSetDialog: false})
                            }}>取消</span>
                            <span className="confirm-btn" onClick={this.changeName}>确定</span>
                        </div>
                    </MiddleDialog> : null
                }
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.common.userInfo.user || {},
        power: state.live.power,
        createBy: state.live.liveInfo.entity.createBy,
        auditedStatues: state.live.auditedStatues
    };
}

const mapActionToProps = {
    uploadImage,
    updateUserInfo,
    getUserInfoP,
    getLiveTag,
    getPower,
    getLiveInfo,
    setAuditedStatues,
    getRealStatus,
    getCheckUser
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveSetting);

function getLiveTagName(data, value) {
    if(data) {
        for(let i = 0; i < data.length ; i++) {
            if(data[i].children) {
                for(let j = 0; j < data[i].children.length; j++) {
                    if(data[i].children[j].id == value) {
                        return `${data[i].name}/${data[i].children[j].name}`;
                    }
                }
            }
        }
    }
}