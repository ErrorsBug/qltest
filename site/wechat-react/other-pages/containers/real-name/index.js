import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { MiddleDialog } from "components/dialog";
import Picker from "components/picker";
import ProtocolPage from "components/protocol-page";
import { uploadImage, getStsAuth, addImageWatermark } from "../../actions/common";
import FileInput from "components/file-input";
import { locationTo, checkID, updatePageData, getVal } from "components/util";
import { getAgreementVersion, getAgreementStatus, request } from "common_actions/common";

import {
    saveRealNameUser,
    getRealNameInfo,
    getRealStatus,
    getCheckUser,
    getVerifyInfo
} from "../../actions/live";

class RealName extends Component {
    state = {
        isShowRule: false,
        isShowDeal: false,
        changeCardNum: "",
        name: "",
        cardType: ["IDCard"],
        fileZhengPath: "",
        fileFanPath: "",
        fileHandheldPath: "",
        showZhengPath: "",
        showFanPath: "",
        showHandheld: "",
        isCommitEnable: false, //是否可提交
        isDeal: false,
        isChecking: false,
        audited: false,
        toastShow: false,
        isGoBackBack: false,
        // 是否同意过该版本协议，如果同意过，则不可以取消勾选
        agreeStatus: false,
        // 当前讲师协议版本
        agreementVersion: "",
        verifyStatus: '',
    };

    data = {
        // 水印图片地址
        watermark: 'https://img.qlchat.com/qlLive/business/B7BQHAYM-8L97-V664-1554953766693-S2L17XQJJJ7X.png',
        cardTypeOptions: [
            {label: '身份证', value: 'IDCard'},
            {label: '港澳居民来往内地通行证', value: 'HKTraffic'},
            {label: '台湾居民来往大陆通行证', value: 'TWTraffic'},
            {label: '护照', value: 'passport'}
        ]
    }

    get liveId() {
        return this.props.location.query.liveId || "";
    }

    get isInvite() {
        const isInvite = this.props.location.query.isInvite;
        return Object.is(isInvite, "Y");
    }

    get reVerify() {
        return this.props.location.query.reVerify === "Y";
    }

    componentDidMount() {
        this.initDataReal();
        this.initGoBack();
        this.getAgreementStatus();
        this.initAliyunOss();
    }

    /**
     * 初始化阿里云OSS上传
     */
    initAliyunOss() {
        this.props.getStsAuth();
        const ossScript = '//gosspublic.alicdn.com/aliyun-oss-sdk.min.js';
        const script = document.createElement("script");
        script.src = ossScript;
        document.body.appendChild(script);
    }

    /**
     * 查询当前的认证状态
     */
    async initDataReal() {
        if (this.reVerify) {
            let myLiveId = this.liveId;
            if (!myLiveId) {
                const myLiveRes = await request({
					url: '/api/wechat/transfer/h5/live/myLiveEntity',
					method: 'POST',
					body: {}
                });
                if (myLiveRes.state && myLiveRes.state.code === 0) {
                    myLiveId = getVal(myLiveRes,'data.entityPo.id','');
                } else {
                    console.error('获取liveId失败');
                }
            }
            if (myLiveId) {
                const enterPriseVerifyRes = await request({
                    url: '/api/wechat/transfer/h5/identity/getEnterprise',
                    method: 'POST',
                    body: {
                        liveId: myLiveId
                    }
                });
                if (enterPriseVerifyRes.state && enterPriseVerifyRes.state.code === 0) {
                    const { status = 'no' } = enterPriseVerifyRes.data.enterprisePo || {};
                    if (status == 'pass') {
                        this.setState({
                            verifyStatus: 'enterpriseVerifyPassed'
                        });
                    } else if (status == 'awaiting') {
                        this.setState({
                            verifyStatus: 'enterpriseVerifyPending'
                        });
                        return;
                    } else {
                        this.setState({
                            verifyStatus: 'reVerify'
                        });
                    }
                } else {
                    this.setState({
                        verifyStatus: 'reVerify'
                    });
                    console.error('查询直播间的企业认证状态失败');
                }   
            } else {
                this.setState({
                    verifyStatus: 'reVerify'
                });
            }
        }
        const res = await this.props.getCheckUser();
        if (res.state && res.state.code === 0) {
            let verifyStatus = (res.data && res.data.status) || "no";
            if (verifyStatus != 'no') {
                this.getVerifyInfo();
            } else {
                this.getRealNameInfo();
            }
            if (!this.reVerify) {
                this.setState({
                    verifyStatus
                });
            }
        } else {
            window.toast(res.state.msg);
        }
    }

    // 获取讲师协议状态
    getAgreementStatus = async () => {
        if (!this.liveId) {
            return;
        } else {
            // 获取讲师协议版本
            await getAgreementVersion().then(
                async version => {
                    this.setState({ agreementVersion: version });
                    // 获取讲师协议同意状态
                    const res = await getAgreementStatus({
                        liveId: this.props.power.liveId,
                        version
                    });
                    if (res.state.code === 0) {
                        let status = res.data && res.data.status;
                        if (status == "Y") {
                            this.setState({
                                agreeStatus: true,
                                isDeal: true
                            });
                        }
                    }
                },
                reject => {
                    console.error(reject);
                }
            );
        }
    };

    showRuleFunc() {
        this.setState({
            isShowRule: true
        });
    }
    notShowRuleFunc() {
        this.setState({
            isShowRule: false
        });
    }
    showDealFunc() {
        this.setState({
            isShowDeal: true
        });
    }
    notShowDealFunc() {
        this.setState({
            isShowDeal: false
        });
    }

    async changeName(e) {
        await this.setState({
            name: e.currentTarget.value
        });
        this.checkInfo();
    }

    async changeCardNum(e) {
        // const cardTypeLimit = {
        //     'IDCard': 18,
        //     'HKTraffic': 11,
        //     'TWTraffic': 8
        // }

        // 只能输入英文字母和数字
        if (!(/^[a-zA-Z0-9]*$/.test(e.currentTarget.value))) {
            window.toast("请输入规范的身份证信息");
            return false;
        }

        // 长度限制
        // if (cardTypeLimit[this.state.cardType] && e.currentTarget.value.length > cardTypeLimit[this.state.cardType] ) {
        //     window.toast("请输入规范的身份证信息");
        //     return false;
        // } 

        if (checkID(e.currentTarget.value)) {
            console.log("符合");
        }
        
        await this.setState({
            changeCardNum: e.currentTarget.value
        });
        this.checkInfo();
    }

    async chooseAgree() {
        // 如果已经同意过课程协议，就不再执行勾选操作
        if (this.state.agreeStatus && this.liveId) {
            return;
        }
        if (this.state.isDeal) {
            await this.setState({
                isDeal: false
            });
        } else {
            await this.setState({
                isDeal: true
            });
        }
        this.checkInfo();
    }

    checkInfo() {
        if (
            this.state.isDeal &&
            this.state.changeCardNum &&
            this.state.name &&
            this.state.fileZhengPath &&
            this.state.fileFanPath &&
            this.state.fileHandheldPath
        ) {
            this.setState({
                isCommitEnable: true
            });
        } else {
            this.setState({
                isCommitEnable: false
            });
        }
    }

    goBack() {
        if (window.history.length <= 1) {
            locationTo("/wechat/page/backstage");
        } else {
            window.history.go(-1);
        }
    }

    // 保存新的用户认证信息
    async saveRelaName() {
        var self = this;
        if (this.checkCard(this.state.changeCardNum, this.state.cardType[0])) {
            if (this.state.isCommitEnable) {
                let params = {
                    identity: this.state.changeCardNum,
                    // liveId:this.props.power.liveId,
                    type: this.state.cardType[0],
                    name: this.state.name,
                    photoNegative: this.state.fileFanPath,
                    photoPositive: this.state.fileZhengPath,
                    photoHold: this.state.fileHandheldPath,
                    certificateType: this.state.cardType && this.state.cardType[0]
                };
                try {

                    let result = await this.props.saveRealNameUser(params);
                    if (result.state.code === 0) {
                        // 同意讲师协议
                        // if(!this.state.agreeStatus ){
                        //     await assignAgreement({liveId: this.props.power.liveId,version: this.state.agreementVersion})
                        // }
                        this.setState({
                            agreeStatus: true,
                            toastShow: true
                        });
                        updatePageData(); //更新页面数据
                        setTimeout(function() {
                            self.goBack();
                        }, 5000);
                    } else {
                        window.toast(result.state.msg);
                    }
                } catch (error) {
                    window.toast("网络请求错误~,请稍后再试!");
                }
            }
        } else {
            window.toast("请输入规范的证件信息");
            return false;
        }
    }

    // 获取旧版实名验证已经提交的认证信息
    async getRealNameInfo() {
        if (this.liveId) {
            const { data } = await this.props.getRealNameInfo({
                liveId: this.liveId
            });
            if (data && data.identity) {
                let { name = '', identity = '', photoPositive, photoNegtivate: photoNegative } = data.identity;
                this.setState({
                    name, 
                    changeCardNum: identity,
                    fileFanPath: photoNegative,
                    fileZhengPath: photoPositive
                });
            }
        }
    }

    /**
     * 获取新版实名验证已经提交的认证信息
     */
    async getVerifyInfo() {
        const res = await this.props.getVerifyInfo();
        if (res.state && res.state.code === 0) {
            const verifyInfo = res.data.identityPo;
            if (verifyInfo) {
                let { name = '', identity = '', photoPositive, photoNegative, photoHold } = verifyInfo;
                this.setState({
                    name,
                    changeCardNum: identity,
                    fileFanPath: photoNegative,
                    fileZhengPath: photoPositive,
                    fileHandheldPath: photoHold
                });
            }
        } else {
            window.toast(res.state.msg);
        }
    }

    // 返回上一级
    initGoBack() {
        if (window.history.length <= 1) {
            this.setState({
                isGoBackBack: true
            });
        } else {
            this.setState({
                isGoBackBack: false
            });
        }
    }

    //图片上传pc
    addSpeakImagePc = async (event) => {
        // 这里对event事件对象的读取语句一定要放在await异步语句前面，否则你会收到报错的
        let file = event.target.files[0];
        let pictype = event.target.name;
        file = await addImageWatermark(file, this.data.watermark);
        let urlTemp = "";
        if (window.createObjectURL != undefined) {
            // basic
            urlTemp = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            // mozilla(firefox)
            urlTemp = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            // webkit or chrome
            urlTemp = window.webkitURL.createObjectURL(file);
        }
        try {
            let filePath = await this.props.uploadImage(file, "verify");
            if (pictype == "zheng-portrait") {
                await this.setState({
                    fileZhengPath: filePath,
                    showZhengPath: urlTemp
                });
            } else if (pictype == "hand-held") {
                await this.setState({
                    fileHandheldPath: filePath,
                    showHandheld: urlTemp
                });
            } else {
                await this.setState({
                    fileFanPath: filePath,
                    showFanPath: urlTemp
                });
            }
            this.checkInfo();
        } catch (error) {
            console.log(error);
        }
    };

    gotoReVerify = () => {
        this.setState({
            verifyStatus: 'reVerify'
        });
    }

    pickerChangeHandler = e => {
        console.log(e);
        this.setState({
            cardType: e
        });
    }

    /**
     * 根据证件类型校验证件合法性
     * 只能输入字母或数字
     * 身份证使用notValidIDCardNumber进行判断
     * 香港证件11位，台湾证件8位，护照不限位数
     * 返回true表示合法，false表示不合法
     */
    checkCard(cardNumber,cardType) {
        const cardReg = /^[a-zA-Z0-9]+$/;
        const cardTypeLimit = {
            'HKTraffic': 11,
            'TWTraffic': 8
        }
        const flag=  checkID(cardNumber);
        
        if(!cardReg.test(cardNumber)) return false;
        if(cardType === 'IDCard') return flag;
        if(cardType === 'passport') return true;

        return cardNumber.length === cardTypeLimit[cardType];
    }

    render() {
        let { verifyStatus } = this.state;
        return (
            verifyStatus == 'awaiting' ? 
            (
                <Page title="实名认证信息审核中" className="real-name-checking">
                    <div>
                        <div className="checking-icon" />
                        <div className="checking-tips">
                            <span>
                                直播间实名认证正在审核中
                                <br />
                                请耐心等待
                            </span>
                            <a href="javascript:;" onClick={this.goBack.bind(this)}>
                                {this.state.isGoBackBack
                                    ? "返回直播间后台"
                                    : "返回"}
                            </a>
                        </div>
                    </div>
                </Page>
            ) : (verifyStatus == 'reject' || verifyStatus == 'sys_reject' || verifyStatus == 'enterpriseVerifyPassed' || verifyStatus == 'enterpriseVerifyPending') ?
            (
                <Page title={(verifyStatus == 'reject' || verifyStatus == 'sys_reject') ? '认证失败' : '提示'} className="real-name-checking">
                    <div>
                        <div className="checking-icon" />
                        <div className="checking-tips">
                        {
                            verifyStatus == 'enterpriseVerifyPassed' && <span>您是企业认证用户<br />企业认证用户重新进行个人认证，企业认证会失效，需重新在PC端上传企业认证相关材料</span>
                        }
                        {
                            verifyStatus == 'enterpriseVerifyPending' && <span>您的企业认证正在审核中，请审核通过后再重新进行个人认证</span>
                        }
                        {
                            (verifyStatus == 'reject' || verifyStatus == 'sys_reject') && <span>认证失败<br />请按照要求重新提交验证信息</span>
                        }
                        {
                            verifyStatus != 'enterpriseVerifyPending' && <a href="javascript:;" onClick={this.gotoReVerify}>重新认证</a>
                        }
                        </div>
                    </div>
                </Page>
            ) : verifyStatus == 'pass' ?
            (
                <Page
                    title="实名认证信息审核已通过"
                    className="real-name-checking"
                >
                    <div>
                        <div className="checking-icon" />
                        <div className="checking-tips">
                            <span>实名认证信息审核已通过</span>
                            <a href="javascript:;" onClick={this.goBack.bind(this)}>
                                {this.state.isGoBackBack
                                    ? "返回直播间后台"
                                    : "返回"}
                            </a>
                        </div>
                    </div>
                </Page>
            ) : (verifyStatus == 'no' || verifyStatus == 'reVerify') ?
            (
                 <Page title="填写实名认证信息" className="real-name">
                        <div>
                            <ul>
                                <li className="name">
                                    <span>姓</span>
                                    <input
                                        placeholder="请输入你的真实姓名"
                                        value={this.state.name}
                                        onChange={this.changeName.bind(this)}
                                    />
                                </li>
                                <li className="cardtype">
                                    <span>证件类型</span>
                                        <Picker
                                            data={this.data.cardTypeOptions}
                                            value={this.state.cardType}
                                            title="选择证件类型"
                                            onChange={this.pickerChangeHandler}
                                        >
                                    <div className='text'>
                                        {
                                            '' + this.data.cardTypeOptions.find(op => {op.value === this.state.cardType[0]}) ? 
                                                (this.data.cardTypeOptions.find(op => op.value === this.state.cardType[0])).label : ''
                                        }
                                        <i className="icon_dropdown">&gt;</i>
                                    </div>
                                        </Picker>
                                </li>
                                <li className="card">
                                    <span>证件号码</span>
                                    <input
                                        placeholder="请输入你的证件号码"
                                        value={this.state.changeCardNum}
                                        onChange={this.changeCardNum.bind(this)}
                                    />
                                </li>
                                <li className="pic" style={{"borderBottom": "0 none"}}>
                                    <div className="real-dec">
                                        <span>上传证件正/背面照</span>
                                    </div>
                                    <div className="box">
                                        <div
                                            className={`flex flex-col flex-vcenter flex-hcenter ${(this.state.showZhengPath || this.state.fileZhengPath) ? "pic-btn pic-one haspic" : "pic-btn pic-one"}`}
                                        >
                                            {
                                                (this.state.showZhengPath || this.state.fileZhengPath) ?
                                                    <img
                                                        src={this.state.showZhengPath || this.state.fileZhengPath}
                                                    />
                                                :
                                                    <>
                                                        <span className="icon-upload"></span>
                                                        <span className="pic-tip btntip">上传证件正面照</span>
                                                    </>
                                            }
                                            <FileInput
                                                name="zheng-portrait"
                                                accept="image/*"
                                                onChange={this.addSpeakImagePc.bind(this)}
                                            />
                                        </div>
                                        <div
                                            className={`flex flex-col flex-vcenter flex-hcenter ${(this.state.showFanPath || this.state.fileFanPath) ? "pic-btn pic-two haspic" : "pic-btn  pic-two"}`}
                                        >
                                            {
                                                (this.state.showFanPath || this.state.fileFanPath) ?
                                                    <img src={this.state.showFanPath || this.state.fileFanPath} />
                                                :
                                                    <>
                                                        <span className="icon-upload"></span>
                                                        <span className="pic-tip btntip">上传证件反面照</span>
                                                    </>
                                            }
                                            <FileInput
                                                name="fan-portrait"
                                                accept="image/*"
                                                onChange={this.addSpeakImagePc.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </li>
                                <div className="rule-tip" style={{background: "#f7f7f7"}}>
                                    <span className="rule1">
                                        仅支持JPG、JEPG、BMP格式，最大不超过2M
                                    </span>
                                </div>
                                <li className="pic">
                                    <div className="real-dec real-right">
                                        <span>上传手持证件照片</span>
                                        <div className="real-exp" onClick={this.showRuleFunc.bind(this)}>如何拍摄手持证件照片?</div>
                                    </div>
                                    <div className="box">
                                        <div className={`flex flex-col flex-hcenter flex-vcenter ${(this.state.showHandheld || this.state.fileHandheldPath) ? "pic-btn haspic pic-th" : "pic-btn pic-th"}`}>
                                            {
                                                (this.state.showHandheld || this.state.fileHandheldPath) ?
                                                    <img src={this.state.showHandheld || this.state.fileHandheldPath} />
                                                :
                                                    <>
                                                        <div className="icon-upload"></div>
                                                        <div className="real-show">
                                                            <p>上传手持证件正面照片</p>
                                                            <span>
                                                                仅支持JPG、 JEPG.
                                                                BMP格式，最大不超过2M
                                                            </span>
                                                        </div>
                                                    </>
                                            }
                                            <FileInput
                                                name="hand-held"
                                                accept="image/*"
                                                onChange={this.addSpeakImagePc.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            {/*<div className="check-rule" onClick={this.showRuleFunc.bind(this)}><span><i className="icon_warning"></i>查看身份证上传规范</span></div>*/}
                            <div className="rule-tip">
                                <span className="rule1">
                                    请确保上传的个人证明均为真实有效证件，提交后我们将在1个工作日之内进行审核并在千聊Live通知。
                                </span>
                                <span
                                    className="rule2 "
                                    onClick={this.chooseAgree.bind(this)}
                                >
                                    <i
                                        className={
                                            this.state.isDeal
                                                ? "icon_choosethis active"
                                                : "icon_choosethis"
                                        }
                                    />
                                    本人已阅读并同意
                                    <var onClick={this.showDealFunc.bind(this)}>
                                        千聊平台服务协议
                                    </var>
                                    ，并保证严格按照协议执行
                                </span>
                                <span
                                    className={
                                        this.state.isCommitEnable
                                            ? "sumit-btn  active"
                                            : "sumit-btn"
                                    }
                                    onClick={this.saveRelaName.bind(this)}
                                >
                                    确认提交
                                </span>
                            </div>
                        </div>
                        {/*<div className={this.state.isShowRule?"rule-box active":"rule-box"}>
                        <div className="main">
                            <i className="icon_cross"  onClick={this.notShowRuleFunc.bind(this)}></i>
                            <b>正确示例</b>
                            <div className="rule-pic"></div>
                        </div>
                    </div>*/}
                        <MiddleDialog
                            show={this.state.isShowRule}
                            theme="empty"
                            close={true}
                            titleTheme={"white"}
                            className="rule-box"
                            onClose={this.notShowRuleFunc.bind(this)}
                        >
                            <div className="main identify-dialog">
                                <b>手持证件照片</b>
                                <div className="rule-pic" 
                                >
                                    <img src={require('./img/realname-rule.png') } alt=""/>
                                </div>

                                <div className="rule-desc">
                                    <div className="rule-desc-title">
                                        <strong>注意事项</strong>
                                    </div>
                                    <p className="desc-warn">(需要符合以下要求，否则不予审核通过)</p>
                                    <p><span className="desc-idx">1、</span>拍摄时，手持本人身份证，手臂、上半身要拍进去，脸部清晰</p>
                                    <p><span className="desc-idx">2、</span>确保身份证上所有信息清晰、可见、完整</p>
                                </div>
                                <div className="rule-desc">
                                    <div className="rule-desc-title">
                                        <strong>常见错误拍摄方式</strong>
                                    </div>
                                    <p><span className="desc-idx">1、</span>自拍模式，导致照片反过来 </p>
                                    <p><span className="desc-idx">2、</span>拍摄距离太远，导致照片不清晰 </p>
                                    <p><span className="desc-idx">3、</span>没有露出双臂 </p>
                                    <p><span className="desc-idx">4、</span>长头发遮挡 </p>
                                    <p><span className="desc-idx">5、</span>环境不明亮，背光，侧光等导致人脸不清晰</p>
                                </div>
                            </div>
                        </MiddleDialog>

                        <div
                            className={
                                this.state.toastShow
                                    ? "successToast active"
                                    : "successToast"
                            }
                        >
                            <div className="content icon_checked">
                                提交成功,待审核
                            </div>
                        </div>

                        <MiddleDialog
                            show={this.state.isShowDeal}
                            theme="empty"
                            close={true}
                            titleTheme={"white"}
                            className="rule-box"
                            onClose={this.notShowDealFunc.bind(this)}
                        >
                            {/*<div className={this.state.isShowDeal?"rule-box active":"rule-box"}>*/}
                            <div className="main deal-box">
                                <div className="dealMain">
                                    <ProtocolPage />
                                </div>
                            </div>
                            {/*</div>*/}
                        </MiddleDialog>
                    </Page>
            ) : null
        )
    }
}

function mapStateToProps(state) {
    return {
        realStatus: state.live.realStatus || "",
        power: state.live.power
    };
}

const mapActionToProps = {
    uploadImage,
    getStsAuth,
    saveRealNameUser,
    getRealNameInfo,
    getRealStatus,
    getCheckUser,
    getVerifyInfo
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(RealName);
