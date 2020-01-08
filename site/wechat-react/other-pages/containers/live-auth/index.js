import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";
import Page from "components/page";
import { MiddleDialog } from "components/dialog";
import CommonInput from "components/common-input";
import Detect from "components/detect";
import Picker from "components/picker";
import ProtocolPage from "components/protocol-page";
import { autobind } from "core-decorators";
import { locationTo, validLegal, formatDate } from "components/util";
import { doPay, getActiveTime, getAgreementVersion, getAgreementStatus, assignAgreement, request, getUserInfo } from "common_actions/common";

import { get } from 'lodash';
//action
import {
    getLiveTag,
    getAuthInfo,
    getIdentifyingCode,
    identityValidCode,
    saveAuthInfo,
    createLive,
    invitationCreate
} from "../../actions/live";

import { followLive } from "thousand_live_actions/thousand-live-common";
import LiveCategoryPicker from 'components/live-category-picker';
import LiveInfoForm from './components/live-info-form';

@autobind
class LiveAuth extends Component {
    state = {
        createrDuty: undefined,
        // 是否勾选
        isFollow: true,
        isSubNew: true,
        agree: false,
        // 分类数据
        tagArr: [],
        selectedTag: undefined,
        // 已经选中tag名字
        tagName: "",
        // 手机号
        phoneNum: "",
        // 微信
        weChatCount: "",
        //验证码
        identifyingCode: "",
        // 倒计时
        second: 0,
        // 显示协议
        showProtocol: false,
        // 老用户邀新活动
        showOldBeltNew: false,
        oldBeltNewIsEnd: true,
        activeTime: {
            startTime: 0,
            endTime: 0
        },
        // 是否同意过该版本协议，如果同意过，则不可以取消勾选
        agreeStatus: false,
        // 当前讲师协议版本
        agreementVersion: '',
    };

    data = {
        isGetCode: false,
        roles: [
            {
                title: "讲师",
                key: "teacher"
            },
            {
                title: "机构",
                key: "institute"
            },
            {
                title: "听众",
                key: "audience"
            }
        ]
    };

    componentWillMount() {
        this.setState({
            liveId: this.props.location.query.liveId || ""
        });
    }

    async componentDidMount() {
        this.getLiveTag();
        this.initInfo();
        // 获取讲师协议版本和状态
        this.getAgreementStatus();

        this.initLiveTag();

        let activeTime = await this.props.getActiveTime();
        this.getUserPhone();
        this.setState({
            oldBeltNewIsEnd: activeTime.data.isEnd,
            activeTime: {
                startTime: formatDate(activeTime.data.startTime, "MM月dd日"),
                endTime: formatDate(activeTime.data.endTime, "MM月dd日")
            }
        });
    }

    // 如果用户有手机号码，带过来
    async getUserPhone() {
        const res = await this.props.getUserInfo();
        if(res.state.code === 0) {
            const phoneNum = get(res, "data.user.mobile", "");
            this.setState({
                phoneNum
            });
        }
    }

    // 获取讲师协议状态
    getAgreementStatus = async()=> {
        // 获取讲师协议版本
        await getAgreementVersion().then(async(version) => {
            this.setState({agreementVersion: version})
            if(this.state.liveId){
                // 获取讲师协议同意状态
                const res = await getAgreementStatus({liveId: this.state.liveId,version})
                if(res.state.code === 0){
                    let status = res.data && res.data.status
                    if(status == 'Y'){
                        this.setState({
                            agreeStatus: true,
                            agree: true,
                        })
                    }
                }
            }
        },reject => {
            console.error(reject)
        })
    }

    async initInfo() {
        if (this.state.liveId) {
            let result = await this.props.getAuthInfo({
                liveId: this.state.liveId
            });

            if (result.state && result.state.code == 0) {
                let {
                    id,
                    phoneNum,
                    tagName,
                    weChatCount,
                    createrDuty
                } = result.data;
                this.setState({
                    phoneNum,
                    tagName,
                    weChatCount,
                    createrDuty,
                    selectedTag: id
                });
            }
        }
    }

    async getLiveTag() {
        let result = await this.props.getLiveTag();
        if (result.state && result.state.code == 0) {
            this.setState({
                tagArr: result.data.dataList.map(item => {
                    return { label: item.name, value: item.id };
                })
            });
        }
    }

    /**
     * 确定分类
     *
     * @param {any} newValue
     * @memberof CustomerCollect
     */
    selectTagHandle(newValue) {
        let tagId = newValue;
        let tagObj = this.state.tagArr.filter(item => item.value == tagId);

        this.setState({
            selectedTag: newValue,
            tagName: tagObj[0].label
        });
    }

    selectMyRole(key) {
        this.setState({
            createrDuty: key == this.state.createrDuty ? undefined : key
        });
    }
    /**
     *
     * 修改手机号
     * @param {any} e
     * @memberof LiveAuth
     */
    changePhone(e) {
        this.setState({
            phoneNum: e.target.value
        });
    }
    /**
     * 修改微信号
     *
     * @param {any} e
     * @memberof LiveAuth
     */
    changeWechat(e) {
        this.setState({
            weChatCount: e.target.value
        });
    }
    /**
     * 输入验证码
     *
     * @param {any} e
     * @memberof LiveAuth
     */
    changeCode(e) {
        this.setState({
            identifyingCode: e.target.value
        });
    }
    /**
     * 关注交互
     *
     * @param {any} e
     * @memberof LiveAuth
     */
    toggleFollow() {
        this.setState({
            isFollow: !this.state.isFollow
        });
    }
    /**
     * 订阅交互
     *
     * @param {any} e
     * @memberof LiveAuth
     */
    toggleSubNew() {
        this.setState({
            isSubNew: !this.state.isSubNew
        });
    }

    /**
     * 同意协议交互
     *
     * @param {any} e
     * @memberof LiveAuth
     */
    toggleAgree() {
        // 已经同意过不给取消
        if (this.state.agreeStatus) {
            return false;
        }
        this.setState({
            agree: !this.state.agree
        });
    }

    async getCode() {
        if (validLegal("phoneNum", "手机号", this.state.phoneNum)) {
            if (this.data.isGeting) {
                return false;
            }
            this.data.isGeting = true;
            let result = await this.props.getIdentifyingCode({
                phoneNum: this.state.phoneNum
            });
            if (result.state && result.state.code == 0) {
                this.codeIntervel();
                this.data.isGeting = false;
                this.data.isGetCode = true;
                this.data.messageId = result.data.messageId;
            } else {
                window.toast(result.state.msg);
                this.data.isGeting = false;
            }
        }
    }

    codeIntervel() {
        if (!this.itvStart) {
            this.setState(
                {
                    second: 60
                },
                () => {
                    this.itvStart = setInterval(() => {
                        if (this.state.second == 0) {
                            clearInterval(this.itvStart);
                        } else {
                            this.setState({
                                second: this.state.second - 1
                            });
                        }
                    }, 1000);
                }
            );
        }
    }

    toggleProtocol() {
        this.setState({
            showProtocol: !this.state.showProtocol
        });
    }

    toggleOldBeltNew() {
        this.setState({
            showOldBeltNew: !this.state.showOldBeltNew
        });
    }

    // 检查数据。
    checkData() {
        if (!validLegal("phoneNum", "手机号", this.state.phoneNum)) {
            return false;
        }
        if (!this.data.isGetCode) {
            window.toast("请先获取验证码", 1000);
            return false;
        }
        if (!/^\d{6}$/.test(this.state.identifyingCode)) {
            window.toast("验证码错误", 1000);
            return false;
        }
        if (!validLegal("wxAccount", "微信号", this.state.weChatCount)) {
            return false;
        }
        if (this.state.tagName == "") {
            window.toast("请选择分类", 1000);
            return false;
        }
        return true;
    }

    // 确定提交-验证信息是否正确。
    confirmValidCode() {
        if (!this.state.agree) {
            window.toast("请勾选同意协议", 1000);
            return false;
        }
        if (this.checkData()) {
            this.props
                .identityValidCode({
                    messageId: this.data.messageId,
                    code: this.state.identifyingCode,
                    phoneNum: this.state.phoneNum
                })
                .then(async result => {
                    if (result && result.state && result.state.code === 0) {
                        return await this.props.followLive("100000081018489");
                    } else {
                        window.toast(result.state.msg);
                        return false;
                    }
                })
                .then(result => {
                    if (result && result.state && result.state.code === 0) {
                        if (this.state.liveId) {
                            this.saveInfo();
                        } else {
                            this.createLive();
                        }
                    } else {
                        window.toast(result.state.msg);
                    }
                });
        }
    }

    // 保存认证信息
    saveInfo() {
        this.props
            .saveAuthInfo({
                hasOfficialAccount: "N",
                officialAccount: "",
                createrDuty: this.state.createrDuty,
                id: this.state.selectedTag,
                liveId: this.state.liveId,
                phoneNum: this.state.phoneNum,
                wechatAccount: this.state.weChatCount,
                subNew: this.state.isSubNew ? "Y" : "N"
            })
            .then(async result => {
                if (result && result.state && result.state.code === 0) {
                    window.toast("保存成功");
                    // 同意讲师协议
                    if(!this.state.agreeStatus){
                        await assignAgreement({liveId: this.state.liveId,version: this.state.agreementVersion})
                        this.setState({agreeStatus: true})
                    }
                    location.href =
                        "/wechat/page/backstage?liveId=" + this.state.liveId;
                } else {
                    window.toast(result.state.msg);
                }
            });
    }

    // 创建直播间
    createLive() {
        this.props
            .createLive({
                logo: "https://img.qlchat.com/qlLive/liveCommon/normalLogo.png",
                id: this.state.selectedTag,
                introduce: "",
                name: "",
                phoneNum: this.state.phoneNum,
                createrDuty: this.state.createrDuty,
                wechatAccount: this.state.weChatCount,
                hasOfficialAccount: "N",
                officialAccount: "",
                ch: this.props.location.query.ch,
                agreementVersion: this.state.agreementVersion
            })
            .then(result => {
                if (result && result.state && result.state.code === 0) {
                    const { live } = result.data;

                    // 邀请创建
                    const { invitationId } = this.props.location.query;
                    const liveId =
                        live && live["liveEntityView"]
                            ? live["liveEntityView"].id
                            : "";
                    const params = {
                        liveId
                    };

                    if (invitationId) {
                        params.sourceLiveId = invitationId;
                    }

                    if (!this.state.activeTime.isEnd) {
                        this.props.invitationCreate(params);
                    }

                    sessionStorage.setItem("novice-guidance", "1");
                    setTimeout(() => {
                        window.location.href =
                            "/wechat/page/create-live-success";
                    }, 1000);
                    if (window._qla) {
                        _qla("event", {
                            category: "createLive",
                            action: "success",
                            trace: sessionStorage.getItem("trace") || "normal",
                            liveId: liveId
                        });
                    }
                } else {
                    window.toast(result.state.msg);
                }
            });
    }

    payCreateLive() {
        if (!this.state.agree) {
            window.toast("请勾选同意协议", 1000);
            return false;
        }

        if (!this.checkData()) {
            return false;
        }

        // if (this.data.isPayed) {
        //     this.confirmValidCode();
        // } else {
        //     this.props.doPay({
        //         type: 'CREATE_LIVE_ENTITY',
        //         total_fee: 0.01,
        //         source : 'web',
        //         callback: () => {
        //             this.data.isPayed = true;
        //             this.confirmValidCode();
        //         },
        //     });
        // }
        this.confirmValidCode();
    }

    // 获取直播间类型列表
    async initLiveTag() {

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
                liveTags: res.data && res.data.allLiveTags,
                hotLiveTags: hotLiveTagsRes.data && hotLiveTagsRes.data.hotTags
            });
        }
    };

    render() {
        const { activeTime } = this.state;
        const liveTagName = getLiveTagName(this.state.liveTags, this.state.selectedTag);
        return (
            <Page title={"直播间认证"} className="live-auth-page">
                <div className="flex-main-s">
                    {/* <div className="my-role">
                        <ul>
                            {this.data.roles.map((item, index) => {
                                return (
                                    <li
                                        key={`roles-${index}`}
                                        className={`duty ${
                                            this.state.createrDuty == item.key
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            this.selectMyRole(item.key);
                                        }}
                                    >
                                        <img
                                            src={require(`./img/${
                                                this.state.createrDuty ==
                                                item.key
                                                    ? item.key + "-active"
                                                    : item.key
                                            }.png`)}
                                        />
                                        <b>我是{item.title}</b>
                                    </li>
                                );
                            })}
                        </ul>
                    </div> 
                    */}

                    <div className="live-auth-section">
                        <div className="header">
                            <p className="title required">请填写以下信息</p>
                            <p className="sub-title">为保证直播间的资金安全，请确保微信号和手机号的真实性</p>

                            <div className="live-info-form">
                                <div className="form-item">
                                    <input
                                        type="text"
                                        placeholder={"输入微信号"}
                                        value={this.state.weChatCount}
                                        onChange={this.changeWechat}
                                        onBlur={() => {window.scrollTo(0, 0)}}
                                    />
                                </div>
                                <div className="form-item">
                                    <input
                                        className="phone-input"
                                        type="text"
                                        placeholder={"输入手机号"}
                                        value={this.state.phoneNum}
                                        onChange={this.changePhone}
                                        onBlur={() => {window.scrollTo(0, 0)}}
                                    />

                                    {this.state.second ? (
                                        <span className="get-code disabled">
                                            {this.state.second}S
                                        </span>
                                    ) : (
                                        <span
                                            className="get-code on-log on-visible"
                                            data-log-region="getVerificationCode"
                                            onClick={this.getCode}
                                        >
                                            获取验证码
                                        </span>
                                    )}
                                </div>
                                <div className="form-item">
                                    <input 
                                        type="text" 
                                        placeholder={"输入验证码"} 
                                        value={this.state.identifyingCode}
                                        onChange={this.changeCode}
                                        onBlur={() => {window.scrollTo(0, 0)}}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    <LiveCategoryPicker 
                        hotData={this.state.hotLiveTags}
                        data={this.state.liveTags}
                        labelKey={"name"}
                        valueKey={"id"}
                        value={this.state.selectedTag}
                        onChange={(val) => {this.selectTagHandle(val)}}
                        onShow={() => {
                            setTimeout(() => {
                                typeof _qla != 'undefined' && _qla.collectVisible();
                            }, 100);
                        }}
                    >
                        <div className="live-auth-section choose-live-cate on-log on-visible" data-log-region="classification">

                                <div className="header">
                                    <p className="title required">选择直播间分类：</p>
                                    <p className="sub-title">平台会根据你填写的分类，<br />把课程分发给感兴趣的用户哦~</p>
                                </div>

                                <span 
                                    className={`text-btn ${liveTagName ? "chosen" : ""}`} 

                                >
                                    {liveTagName ?  <>{liveTagName}<img src={require('./img/arrow-gray.png')} alt=""/></> 
                                    :
                                    <>{"点击选择"}<img src={require('./img/arrow-red.png')} alt=""/></>}
                                </span>
                        </div>
                    </LiveCategoryPicker>

                    <div className="live-auth-section sence">
                        <div className="header">
                            <p className="title">选择你的授课场景</p>
                        </div>

                        <div className="sence-radio">
                            {
                                [{
                                    label: "线上培训",
                                    value: "onlineCultivate",
                                    sub: "适用于电商代理培训、企业内训、政府机构、家校培训"
                                },{
                                    label: "知识付费",
                                    value: "knowledgePayment",
                                    sub: "适用于个体老师、自媒体、出版社"
                                },{
                                    label: "在线教育",
                                    value: "onlineEducation",
                                    sub: "适用于学历考证、K12教育、职业技能、出国留学"
                                },{
                                    label: "内容分销商",
                                    value: "contentDistributor",
                                    sub: "适用于知识通课程的分销、推广及变现"
                                }].map(item => (<div className={`radio-item ${item.value === this.state.createrDuty ? "active" : ""}`} onClick={() => {this.selectMyRole(item.value)}}><p className="title">{item.label}</p><p className="sub-title">{item.sub}</p></div>))
                            }
                        </div>
                    </div>

                    <div className="manual">
                        <p className="tips-checkbox">
                            <span
                                className={`tips-name ${this.state.agree ? "checked" : ""}`}
                                onClick={this.toggleAgree}
                            />
                            <span className="select-color">勾选表示您同意</span>
                            <a
                                href="javascript:;"
                                className="btn"
                                onClick={this.toggleProtocol}
                            >
                                《千聊平台服务协议》
                            </a>
                        </p>

                    </div>
                </div>
                <div className="flex-other footer">
                        {this.state.liveId ? (
                            <div
                                className={`btn-style btn-change-info ${
                                    (!this.state.agree 
                                        || this.state.weChatCount.length <= 0
                                        || this.state.phoneNum.length <= 0
                                        || !this.state.selectedTag
                                        || this.state.identifyingCode.length <= 0
                                    ) ? "disable" : ""
                                } on-log on-visible`}
                                data-log-region="submit"
                                onClick={this.confirmValidCode}
                            >
                                提交
                            </div>
                        ) : (
                            <div
                                className={`btn-style btn-create ${
                                    (!this.state.agree 
                                        || this.state.weChatCount.length <= 0
                                        || this.state.phoneNum.length <= 0
                                        || !this.state.selectedTag
                                        || this.state.identifyingCode.length <= 0
                                    ) ? "disable" : ""
                                } on-log on-visible`}
                                data-log-region="submit"
                                onClick={this.payCreateLive}
                            >
                                <b>保存并提交</b>
                            </div>
                        )}
                </div>
                <MiddleDialog
                    className="protocol-dialog"
                    show={this.state.showProtocol}
                    theme="empty"
                    onClose={this.toggleProtocol}
                    close={true}
                >
                    <div className="main">
                        <ProtocolPage />
                    </div>
                </MiddleDialog>

                <MiddleDialog
                    className="old-belt-new-dialog"
                    show={this.state.showOldBeltNew}
                    theme="empty"
                    onClose={this.toggleOldBeltNew}
                    close={true}
                >
                    <div className="main">
                        <p className="title">注册送好礼</p>
                        <p>
                            {activeTime.startTime}至{activeTime.endTime}
                            期间，新创建直播间将免费获赠1个月专业版直播间体验权限。
                        </p>
                        <p>
                            创建一个月内直播间收益若达到1万，则赠送半年专业版有效期。
                        </p>
                        <p>
                            创建一个月内直播间收益若达到3万，则再赠送半年专业版有效期。
                        </p>
                    </div>
                </MiddleDialog>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {
    getLiveTag,
    getAuthInfo,
    getIdentifyingCode,
    identityValidCode,
    saveAuthInfo,
    createLive,
    doPay,
    followLive,
    getActiveTime,
    invitationCreate,
    getUserInfo
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(LiveAuth);

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

// 校驗微信號
function checkWxAccount(inputVal) {
    if (!/^[0-9a-zA-Z\-\_]{5,30}$/.test(inputVal)) {
        window.toast("微信号仅6~30个字母，数字，下划线或减号组成");
        return false;
    } else {
        return true;
    };
};