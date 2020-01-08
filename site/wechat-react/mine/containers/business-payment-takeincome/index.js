import React, { Component } from "react";

import { autobind } from "core-decorators";
import Page from "components/page";
import FormItem from "./components/form-item";
import { Confirm } from "components/dialog";

import { connect } from "react-redux";
import { uploadImage, getUserInfo } from "../../../actions/common";
import {
    getPubToPubMessage,
    commitApply
} from "../../actions/business-payment-takeincome";

@autobind
class BusinessPaymentTakeIncome extends Component {
    state = {
        applyAmount: "",
        promiseLetterUrl: "",
        isFocus: false
    };

    refs = {
        promiseDialog: null
    };

    data = {
        // 水印图片地址
        watermark:
            "https://img.qlchat.com/qlLive/business/B7BQHAYM-8L97-V664-1554953766693-S2L17XQJJJ7X.png"
    };

    async componentDidMount() {
        this.initStsInfo();
        await this.props.getUserInfo();
        const res = await this.props.getPubToPubMessage({
            liveId: this.props.location.query["liveId"],
            userId: this.props.userInfo.user.userId
        });
    }

    initStsInfo() {
        const script = document.createElement("script");
        script.src =
            "//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js";
        document.body.appendChild(script);
    }

    changeHandler(e, name) {
        const val = e.target.value;
        this.setState({ [name]: val });
    }

    showPromiseDialog() {
        this.promiseDialog.show();
    }

    hidePromiseDialog() {
        this.promiseDialog.hide();
    }

    handleAmountChange(e) {
        const val = e.target.value;
        // const fee  = this.getFee(val);
        // console.log(';FUCK', fee)

        this.setState({
            applyAmount: val
        });
    }

    /**
     * 计算手续费率
     * @param {string} amount 申请额度
     */
    getFeeText(amount) {
        if (amount.length <= 0) return;
        const money = Number(amount);
        if (isNaN(money)) {
            return <p className="text moneyrate">请输入2~50万范围的数字</p>;
        }
        if (money >= 20000 && money <= 200000) {
            const fee = money - money * 0.05;
            return (
                <p className="text moneyrate">
                    本次提现的服务费率为<span>5%</span>
                    ，扣除后提现到账金额为
                    <span>{fee}</span>元
                </p>
            );
        } else if (money > 200000 && money <= 500000) {
            const fee = money - money * 0.03;
            return (
                <p className="text moneyrate">
                    本次提现的服务费率为<span>3%</span>
                    ，扣除后提现到账金额为
                    <span>{fee}</span>元
                </p>
            );
        } else {
            return <p className="text moneyrate">请输入2~50万范围的数字</p>;
        }
    }

    async submit() {
        const money = Number(this.state.applyAmount);
        if (this.state.applyAmount.length <= 0) {
            window && window.toast("请先输入申请金额", 3000);
            return;
        }
        if (this.state.promiseLetterUrl.length <= 0) {
            window && window.toast("请先上传承诺函", 3000);
            return;
        }
        if (isNaN(money) || money < 20000 || money > 500000) {
            window && window.toast("请输入2~50万范围的提现金额", 3000);
            return;
        }
        this.props.commitApply({
            money: this.state.applyAmount,
            liveId: this.props.location.query["liveId"],
            userId: this.props.userInfo.user.userId,
            commitmentLetter: this.state.promiseLetterUrl
        });
    }

    async uploadImage(e) {
        const file = e.target.files[0];
        let backgroundUrl;
        try {
            const watermarkFile = await this.addImageWatermark(
                file,
                this.data.watermark
            );
            backgroundUrl = await this.props.uploadImage(
                watermarkFile,
                "topicBackground"
            );
            if (backgroundUrl) {
                this.setState({
                    promiseLetterUrl: backgroundUrl
                });
            }
        } catch (error) {}
    }

    /**
     * 给图片添加居中的图片水印
     * @param {File} file HTML5 File对象
     * @param {String} watermarkImageUrl 水印图片的地址
     */
    addImageWatermark(file, watermarkImageUrl) {
        const reader = new FileReader();
        const sourceImage = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        return new Promise((resolve, reject) => {
            try {
                reader.onload = event => {
                    sourceImage.onload = () => {
                        canvas.width = sourceImage.width;
                        canvas.height = sourceImage.height;
                        ctx.drawImage(
                            sourceImage,
                            0,
                            0,
                            sourceImage.width,
                            sourceImage.height
                        );
                        const watermarkImage = new Image();
                        watermarkImage.crossOrigin = "anonymous";
                        watermarkImage.src = `/api/wechat/image-proxy?url=${watermarkImageUrl}`;
                        watermarkImage.onload = () => {
                            const watermarkImageWidth = watermarkImage.width;
                            const watermarkImageHeight = watermarkImage.height;
                            ctx.drawImage(
                                watermarkImage,
                                0,
                                0,
                                watermarkImageWidth,
                                watermarkImageHeight,
                                0,
                                0,
                                canvas.width,
                                (canvas.width * watermarkImageHeight) /
                                    watermarkImageWidth
                            );
                            const blob = this.dataURLtoBlob(
                                canvas.toDataURL("image/jpeg")
                            );
                            const resultFile = new File([blob], "tmp.jpg", {
                                type: "image/jpeg"
                            });
                            resolve(resultFile);
                        };
                    };
                    sourceImage.src = event.target.result;
                };
                reader.readAsDataURL(file);
            } catch (err) {
                console.error("图片添加水印失败！");
            }
        });
    }

    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    render() {
        return (
            <Page
                title="公对公打款提现"
                className="business-payment-takeincome"
            >
                <div className="scroll">
                    <form className="form">
                        <FormItem
                            title="申请金额"
                            placeholder="请输入金额"
                            value={this.state.applyAmount}
                            onChange={this.handleAmountChange}
                        />
                        {this.getFeeText(this.state.applyAmount)}
                        <FormItem
                            title="开户行"
                            disabled={true}
                            placeholder="请输入开户银行"
                            value={this.props.openBank}
                            onChange={e => {
                                this.changeHandler(e, "accountBank");
                            }}
                        />
                        <FormItem
                            title="收款账号"
                            disabled={true}
                            placeholder="请输入收款账号"
                            value={this.props.accountNo}
                            onChange={e => {
                                this.changeHandler(e, "accountNumber");
                            }}
                        />
                        <FormItem
                            title="户名"
                            disabled={true}
                            placeholder="请输入户名"
                            value={this.props.accountName}
                            onChange={e => {
                                this.changeHandler(e, "accountName");
                            }}
                        />
                    </form>

                    <div className="upload-box">
                        <div className="header">
                            上传承诺函
                            <span
                                className="upload-tip"
                                onClick={this.showPromiseDialog}
                            />
                            <a
                                className="download-btn"
                                href="https://static.qianliaowang.com/frontend/rs/doc/大额提款承诺书-ytxjeyfw.doc"
                                download="大额提款承诺书.doc"
                            >
                                下载模板
                            </a>
                        </div>
                        <div className="content">
                            <div
                                className="upload-img-wrap"
                                style={
                                    this.state.promiseLetterUrl.length > 0
                                        ? {
                                              background: `url(${
                                                  this.state.promiseLetterUrl
                                              }) 0% 0% / cover no-repeat`
                                          }
                                        : {}
                                }
                            >
                                {this.state.promiseLetterUrl.length <= 0 && (
                                    <div className="upload-empty">
                                        <span className="icon-upload" />
                                        <p className="upload-title">
                                            上传承诺函图片
                                        </p>
                                        <p className="upload-desc">
                                            请务必下载模板打印后，加盖企业公章并手写签字，
                                            扫描后上传(支持jpg、jpeg、bmp、png
                                            大小不超5M)
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="file"
                                    accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
                                    onChange={this.uploadImage}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="desc-box">
                        <p className="text title">公对公提现说明：</p>
                        <p className="text">
                            1、 从2019年7月1日，对公提现金额范围2~50万。其中
                            <span>2万~20万 (包含20万)</span>提现服务费
                            <span>5%，20万~50万(包含50万)</span>提现服务费
                            <span>3%</span>
                        </p>
                        <p className="text">
                            2、审核通过后<span>10~15</span>
                            个工作日内可到账，节假日顺延，请在提现明细里查看进度
                        </p>
                        <p className="text">
                            3、提现申请需先邮寄纸质<span>【承诺函】</span>
                            到千聊，否则将影响进一步提现。
                            <span>
                                (邮寄地址：广东省广州市天河区远洋创意园棠下街道棠东东路5号沐思科技有限公司(干聊)财务部-对公打款
                                电话：020-88525535)
                            </span>
                        </p>
                        <p className="text">
                            4、如有疑问，请关注<span>【千聊知识店铺】</span>
                            并回复关键词“<span>企业提现</span>
                            "，我们将第一时间回复您
                        </p>
                        <p className="text">
                            5、
                            <a
                                className="link"
                                href={`/wechat/page/mine/takeincome-record?liveId=${
                                    this.props.location.query["liveId"]
                                }`}
                            >
                                点击查看对公提现进度>>
                            </a>
                        </p>
                    </div>
                </div>

                <div className="bottom-btn-wrap">
                    <div className="bottom-btn" onClick={this.submit}>
                        提交申请
                    </div>
                </div>

                <Confirm
                    className="promise-dialog"
                    title="承诺函说明"
                    buttons="cancel"
                    cancelText="我知道了"
                    ref={dom => {
                        this.promiseDialog = dom;
                    }}
                >
                    <p className="content">
                        <p className="promise-item">
                            <span className="order">1、</span>
                            <span className="content-text">
                                在企业对公提现时，需提交承诺函;
                            </span>
                        </p>

                        <p className="promise-item">
                            <span className="order">2、</span>
                            <span className="content-text">
                                承诺函是直播间对公提现及完税证明时需用到的证明材料;
                            </span>
                        </p>

                        <p className="promise-item">
                            <span className="order">3、</span>
                            <span className="content-text">
                                每次对公提现，由于提现金额可能不一致，需按照承诺函上的要求，按照实际提现信息填写;
                            </span>
                        </p>

                        <p className="promise-item">
                            <span className="order">4、</span>
                            <span className="content-text">
                                请先下载承诺函模板，按照模板要去填写。
                            </span>
                        </p>

                        <p className="promise-item">
                            <span className="order">5、</span>
                            <span className="content-text">
                                关于承诺函及提现流程的使用说明，{" "}
                                <a href="https://w.url.cn/s/AVMj8DA">
                                    点击查看教程>>
                                </a>
                            </span>
                        </p>
                    </p>
                </Confirm>
            </Page>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.common.userInfo,
        accountName: state.businessPaymentTakeincome.accountName,
        accountNo: state.businessPaymentTakeincome.accountNo,
        openBank: state.businessPaymentTakeincome.openBank
    };
};

const mapDispatchToProps = {
    uploadImage,
    getUserInfo,
    getPubToPubMessage,
    commitApply
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BusinessPaymentTakeIncome);
