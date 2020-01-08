import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Page from 'components/page';
import { validLegal } from 'components/util';
import { fetchContactInfo, savePhoneNumber, sendValidCode, checkValidCode } from '../../../actions/live-studio';

@autobind
class ContactInfo extends Component {
    state = {
        // 是否获取验证码
        getCaptchaFlag: false,
        // 是否显示手机号码相关内容
        isShowPhoneInfo: false,
        // 手机号码
        phoneNumber: '',
        // 当前已经保存的手机号码
        currentPhoneNumber: '',
        // 验证码
        captcha: '',
        // 间隔秒数
        secondsCounter: 60,
        // 业务负责人微信二维码URL
        qrcodeUrl: '',
        // 正在处理保存手机号码的请求
        requesting: false,
    }

    data = {
        // 定时器ID
        intervalTimer: 0,
        // 验证码短信id
        messageId: '', 
    }

    get liveId(){
        return this.props.params.liveId;
    }

    get splitPhoneNumber(){
        const phoneNumber = this.state.currentPhoneNumber;
        const slice_1 = phoneNumber.substring(0, 3);
        const slice_2 = phoneNumber.substring(3, 7);
        const slice_3 = phoneNumber.substring(7);
        return `${slice_1} ${slice_2} ${slice_3}`;
    }

    /**
     * 切换到手机号码的编辑界面
     */
    showPhoneEditor = () => {
        this.setState({
            currentPhoneNumber: '',
        });
    }

    /**
     * 检查手机号码的合法性
     */
    checkPhoneNumber = () => {
        const phoneNumber = this.state.phoneNumber;
        return validLegal('phoneNum', '手机号码', phoneNumber);
    }


    /**
     * 检查验证码的合法性
     */
    checkCaptcha = async () => {
        const {messageId} = this.data;
        const {phoneNumber, captcha} = this.state;
        // 验证码必填
        if (!captcha) {
            window.toast('验证码不能为空');
            return false;
        }
        // 必须先获取验证码
        if (messageId === '') {
            window.toast('请先获取验证码');
            return false;
        }
        // 验证码校验
        const result = await this.props.checkValidCode({
            phoneNum: phoneNumber,
            code: captcha,
            messageId: this.data.messageId
        });
        if (result.state.code > 0) {
            window.toast(result.state.msg);
            return false;
        }
        return true;
    }

    /**
     * 获取短信验证码
     */
    getCaptcha = async () => {
        if (!this.checkPhoneNumber()) {
            return false;
        }
        this.setState({
            getCaptchaFlag: true
        });
        let secondsCounter = this.state.secondsCounter;
        const intervalTimer = this.data.intervalTimer = setInterval(() => {
            if (secondsCounter > 1) {
                this.setState({
                    secondsCounter: --secondsCounter
                });
            } else {
                clearInterval(intervalTimer);
                this.setState({
                    getCaptchaFlag: false,
                    secondsCounter: 60
                })
            }
        }, 1000);
        const result = await this.props.sendValidCode({phoneNum: this.state.phoneNumber});
        if (result.state.code === 0) {
            this.data.messageId = result.data.messageId;
        } else {
            // 发送短息验证码失败
            window.toast(result.state.msg);
            this.setState({
                getCaptchaFlag: false,
                secondsCounter: 60
            })
        }
    }

    /**
     * 保存或编辑手机号码
     */
    handleSubmit = async () => {
        // 手机号码和验证码的输入校验
        if (!this.checkPhoneNumber()) {
            return false;
        }
        const isValidCaptcha = await this.checkCaptcha();
        if (!isValidCaptcha) {
            return false;
        }
        this.setState({
            requesting: true
        });
        const {phoneNumber} = this.state;
        const result = await this.props.savePhoneNumber({liveId: this.liveId, mobile: phoneNumber});
        if (result.state.code === 0) {
            this.setState({
                currentPhoneNumber: phoneNumber,
            });
        } else {
            window.toast(result.state.msg);
        }
        this.setState({
            captcha: '',
            getCaptchaFlag: false,
            secondsCounter: 60,
            requesting: false,
        });
    }

    handlePhoneInput(e){
        this.setState({
            phoneNumber: e.target.value.trim()
        });
    }

    handleCaptchaInput(e){
        this.setState({
            captcha: e.target.value.trim()
        });
    }

    /**
     * 获取当前的手机号码和业务负责人微信二维码
     */
    componentDidMount = async () => {
        const result = await this.props.fetchContactInfo({liveId: this.liveId});
        if (result.state.code === 0) {
            const {mobile, qrUrl} = result.data;
            this.setState({
                isShowPhoneInfo: true,
                currentPhoneNumber: mobile,
                phoneNumber: mobile,
                qrcodeUrl: qrUrl
            });
        } else {
            window.toast(result.state.msg);
        }
    }

    componentWillUnmount = () => {
        // 清除定时器
        clearInterval(this.data.intervalTimer);
    }


    render(){
        const {
            getCaptchaFlag, 
            currentPhoneNumber, 
            phoneNumber, 
            captcha, 
            secondsCounter, 
            qrcodeUrl, 
            isEditPhone, 
            isShowPhoneInfo, 
            requesting,} = this.state;
        return (
            <Page title="知识通商城" className="contact-info-container">
                <div className="ci-upper">
                    <p className="tip large-tip page-tip">亲爱的用户，请确认您的联系方式，我们的运营人员将很快联系您洽谈合作事宜并为您开通权限。</p>
                    {
                        isShowPhoneInfo ? 
                            currentPhoneNumber ? 
                                <section className="current-phone">
                                    <header className="tip middle-tip">手机号码</header>
                                    <div className="phone-wrapper phone-view">
                                        <h1 className="phone">{this.splitPhoneNumber}</h1>
                                        <div role="button" className="ci-button edit-button" onClick={this.showPhoneEditor}>修改</div>
                                    </div>
                                </section>
                            :
                                <section className="phone-wrapper phone-edit">
                                    <div className="edit-phone-form" role="form">
                                        <div className="form-row">
                                            <em className="label">手机号:</em>
                                            <input 
                                                type="text" 
                                                placeholder="请输入您的手机号"
                                                className="input-field phone-field" 
                                                value={phoneNumber} 
                                                onChange={this.handlePhoneInput} />
                                            {
                                                getCaptchaFlag ?
                                                    <span className="get-captcha-tip tip large-tip gold-tip">重获({secondsCounter})s</span>
                                                :
                                                <span className="get-captcha-button ci-button ci-button-noborder" role="button" onClick={this.getCaptcha}>获取验证码</span>
                                            }
                                        </div>
                                        <div className="form-row">
                                            <em className="label">验证码:</em>
                                            <input 
                                                type="text" 
                                                placeholder="请输入您的验证码" 
                                                className="input-field" 
                                                value={captcha}
                                                onChange={this.handleCaptchaInput} />
                                        </div>
                                        <div className={classnames("submit-button", {
                                            "disabled-submit-button": requesting
                                        })} onClick={this.handleSubmit}>{requesting ? '保存中...' : '确定'}</div>
                                    </div>
                                </section>
                        : null
                    }
                </div>
                <div className="ci-bottom">
                    <div className="qrcode-wrapper">
                        <img src={qrcodeUrl} alt="业务负责人微信二维码" className="qrcode" />
                        <p className="tip middle-tip gold-tip">长按识别二维码添加</p>
                    </div>
                    <div className="tip tip-middle qrcode-tip">
                        <p>如有疑问，请添加</p>
                        <p>自媒体版业务负责人微信</p>
                    </div>
                </div>
            </Page>
        )
    }
}

function mapStateToProps(state) {
    return {

    }
}

const mapActionToProps = {
    fetchContactInfo,
    savePhoneNumber,
    sendValidCode,
    checkValidCode,
}

export default connect(mapStateToProps, mapActionToProps)(ContactInfo);