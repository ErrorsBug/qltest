import { request } from 'common_actions/common';
import BottomDialog from 'components/dialog/bottom-dialog';
import iOSCompatible from 'components/wrapper-components/page-ios/index';
import * as React from 'react';
import { Component } from 'react';
import { isFunction } from 'util';

interface DialogMoreUserInfoProps {
    userId: any;
    visible?: boolean;
    onClose?: any;
    onSuccess?: any;
    onFailed?: any;
}

const STEP_1_PHONE = 'PHONE';
const STEP_2_CODE = 'CODE';
const STEP_3_PASSWORD = 'PASSWORD';

const REGEX_PHONE = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;

const defaultState = {
    phone: undefined,
    code: undefined,
    password: '',
    // 当前步骤
    currentStep: STEP_1_PHONE,
    // 是否明文显示密码
    showPassword: false,
    // 是否展开显示相关法规简述（默认显示）
    showLawDesc: true,
    // 是否显示dialog-content
    showDialogContent: false
};

// 实名认证弹框
@iOSCompatible('input')
export default class DialogMoreUserInfo extends Component<
    DialogMoreUserInfoProps,
    any
> {
    state = {
        ...defaultState,
        countdown: 0,
        messageId: ''
    };

    inputPassword;

    timer;

    componentDidMount() {
        this.initState();
        const showDialogContent = !!this.props.visible;
        setTimeout(() => {
            this.setState({
                showDialogContent
            });
            showDialogContent && typeof _qla != 'undefined' && _qla.collectVisible();
        }, 20);
    }

    // 控制底部弹窗过渡动画呈现状态
    componentWillReceiveProps(np) {
        if (np.visible !== this.props.visible) {
            const showDialogContent = !!np.visible;
            setTimeout(() => {
                this.setState({
                    showDialogContent
                });
            }, 20);
            showDialogContent && typeof _qla != 'undefined' && _qla.collectVisible();
        }
    }

    initState = () => {
        this.setState(defaultState);
    };

    handleClose = () => {
        const { onClose } = this.props;
        isFunction(onClose) && onClose(this.state.currentStep);
        this.initState();
    };

    handleInputChange = (key, val) => {
        this.setState({
            [key]: val
        });
    };

    handleSwitchStep = currentStep => {
        this.setState({
            currentStep
        });
    };

    handleSubmitPhone = async phone => {
        if (!REGEX_PHONE.test(phone)) {
            window.toast('手机号填写错误，请检查后再试！');
            return;
        }
        (await this.handleSendMsg(phone)) && this.handleSwitchStep(STEP_2_CODE);
    };

    handleSubmitCode = async code => {
        const { userId, onFailed } = this.props;
        const { messageId, phone } = this.state;
        try {
            // 确保已发送验证码
            if (messageId) {
                // 提交手机号接口已提供验证，故无需再调用另外的接口
                // if (await this.handleValidateCode(phone, code, messageId)) {
                const resUpdatePhone = await request({
                    url: '/api/wechat/transfer/h5/user/updatePhoneNum',
                    method: 'POST',
                    body: {
                        userId,
                        phoneNum: phone,
                        verifyCode: code
                    }
                });
                if (resUpdatePhone.state.code != 0) {
                    throw resUpdatePhone.state;
                }
                this.handleSwitchStep(STEP_3_PASSWORD);
                // }
            }
        } catch (error) {
            isFunction(onFailed) && onFailed(error);
            window.toast(error.msg);
            console.error(error);
        }
    };

    handleSubmitPassword = async password => {
        const { userId, onFailed, onSuccess } = this.props;
        if (password.length < 8) {
            window.toast('密码长度至少为8位，请重新输入！');
            return;
        }
        try {
            const res = await request({
                url: '/api/wechat/transfer/h5/user/updatePwd',
                method: 'POST',
                body: {
                    userId,
                    password
                }
            });
            if (res.state.code == 0) {
                window.toast('提交成功！');
                if (isFunction(onSuccess)) {
                    onSuccess();
                    this.initState();
                }
            } else {
                window.toast(res.state.msg);
                isFunction(onFailed) && onFailed(res.state);
            }
        } catch (error) {
            isFunction(onFailed) && onFailed(error);
            console.error(error);
        }
    };

    handleSendMsg = async (phoneNum): Promise<boolean> => {
        const { countdown } = this.state;

        try {
            const res = await request({
                url: '/api/wechat/transfer/h5/validCode/send',
                method: 'POST',
                body: {
                    phoneNum
                }
            });
            if (res.state.code == 0) {
                const { messageId } = res.data;
                this.setState(
                    {
                        messageId,
                        countdown: countdown || 60
                    },
                    () =>
                        (this.timer = setInterval(async () => {
                            const { countdown } = this.state;
                            if (countdown > 0) {
                                this.setState({
                                    countdown: countdown - 1
                                });
                                return;
                            }
                            clearInterval(this.timer);
                            this.timer = null;
                        }, 1000))
                );
                window.toast('验证码已发送，请查收短信');

                return true;
            } else {
                window.toast(res.state.msg);
            }
        } catch (error) {
            console.error(error);
        }

        return false;
    };

    handleValidateCode = async (phoneNum, code, messageId) => {
        try {
            const resValidate = await request({
                url: '/api/wechat/transfer/h5/validCode/check',
                method: 'POST',
                body: {
                    phoneNum,
                    code,
                    messageId
                }
            });
            if (resValidate.state.code != 0) {
                throw resValidate.state;
            }
            return true;
        } catch (error) {
            window.toast(error.msg);
            console.error(error);
            return false;
        }
    };

    getRenderNodes = (
        step
    ): {
        title: any;
        text: React.ReactNode;
        input: React.ReactNode;
        action: React.ReactNode;
    } => {
        const {
            phone,
            code,
            password,
            messageId,
            showPassword,
            countdown
        } = this.state;

        switch (step) {
            case STEP_2_CODE:
                const buttonCodeText = `${
                    countdown ? `${countdown}s` : ''
                } 重新获取`;

                const buttonCodeDisabled = !!countdown || !phone;

                const buttonNextDisabled = !(code && messageId);

                return {
                    title: '绑定手机号码',
                    text: (
                        <div className="desc text-center">
                            验证码已发送至{phone}
                        </div>
                    ),
                    input: (
                        <div className="action-btn-group">
                            <input
                                placeholder="请输入验证码"
                                type="tel"
                                maxLength={6}
                                value={code}
                                onChange={e =>
                                    this.handleInputChange(
                                        'code',
                                        e.target.value
                                    )
                                }
                            />
                            <div
                                className={`btn-send-code${
                                    buttonCodeDisabled ? ' disabled' : ''
                                }${countdown ? '' : ' encore'}`}
                                onClick={() =>
                                    !buttonCodeDisabled &&
                                    this.handleSendMsg(phone)
                                }
                            >
                                {buttonCodeText}
                            </div>
                        </div>
                    ),
                    action: (
                        <div className="action-btn-group">
                            <div
                                className="btn-back"
                                style={{ width: '47%' }}
                                onClick={() => {
                                    this.handleSwitchStep(STEP_1_PHONE);
                                    this.setState({
                                        code: undefined,
                                        countdown: 0
                                    });
                                }}
                            >
                                上一步
                            </div>
                            <div
                                className={`btn-submit on-log${
                                    buttonNextDisabled ? ' disabled' : ''
                                }`}
                                data-log-name="提交绑定手机号（底部弹窗）"
                                data-log-region="submit-user-info"
                                data-log-pos="bottom-dialog-phone-binding"
                                style={{ width: '47%' }}
                                onClick={() =>
                                    !buttonNextDisabled &&
                                    this.handleSubmitCode(code)
                                }
                            >
                                下一步
                            </div>
                        </div>
                    )
                };
            case STEP_3_PASSWORD:
                return {
                    title: '绑定成功，设置登录密码',
                    text: (
                        <div className="desc text-center">
                            设置密码后，可使用手机号登录
                        </div>
                    ),
                    input: (
                        <div className="password-input-container">
                            <input
                                className="password-input"
                                ref={n => {
                                    this.inputPassword = n;
                                }}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="请输入密码，至少8位"
                                // style={{ paddingRight: '100px' }}
                                value={password}
                                onChange={e =>
                                    this.handleInputChange(
                                        'password',
                                        e.target.value
                                    )
                                }
                            />
                            {/* <div
                                className={`icon icon-eye-${
                                    showPassword ? 'open' : 'close'
                                }`}
                                onClick={() => {
                                    this.setState({
                                        showPassword: !showPassword
                                    });
                                    this.inputPassword.focus();
                                }}
                            /> */}
                        </div>
                    ),
                    action: (
                        <div
                            className={`btn-submit${
                                !password ? ' disabled' : ''
                            }`}
                            onClick={() =>
                                !!password &&
                                this.handleSubmitPassword(password)
                            }
                        >
                            提交
                        </div>
                    )
                };
            default:
                const { showLawDesc } = this.state;

                return {
                    title: '绑定手机号码',
                    text: (
                        <div className="text c-mt-40">
                            <div className="tips">
                                根据
                                <span
                                // style={{ textDecoration: 'underline' }}
                                // onClick={() =>
                                //     this.setState({
                                //         showLawDesc: !showLawDesc
                                //     })
                                // }
                                >
                                    国家法律法规要求
                                </span>
                                ，请先进行手机号验证
                            </div>
                            {showLawDesc && (
                                <div className="desc">
                                    根据《中华人民共和国网络安全法》要求，自2017年6月1日起使用信息发布、即时通讯等互联网需进行身份信息验证。为保障您的使用体验，建议尽快完成手机号绑定验证，感谢你的理解和支持。
                                </div>
                            )}
                        </div>
                    ),
                    input: (
                        <input
                            className="phone-input"
                            type="tel"
                            maxLength={11}
                            placeholder="请输入您的手机号码"
                            value={phone}
                            onChange={e =>
                                this.handleInputChange('phone', e.target.value)
                            }
                        />
                    ),
                    action: (
                        <div
                            className={`btn-submit${!phone ? ' disabled' : ''}`}
                            onClick={() =>
                                !!phone && this.handleSubmitPhone(phone)
                            }
                        >
                            下一步
                        </div>
                    )
                };
        }
    };

    render() {
        const { visible = false } = this.props;
        const { currentStep, showDialogContent } = this.state;

        const { title, text, action, input } = this.getRenderNodes(currentStep);

        return (
            <BottomDialog
                className="dialog-more-user-info"
                show={visible}
                bghide={false}
                theme="empty"
                onClose={() => this.handleClose()}
            >
                <div
                    className={`dialog-more-user-info__content-box on-visible ${
                        showDialogContent ? '' : 'out-of-view'
                    }`}
                    data-log-name="浏览绑定手机号弹窗"
                    data-log-region="submit-user-info"
                    data-log-pos="view-phone-binding-modal"
                >
                    <div className="close-btn" onClick={this.handleClose} />
                    <div className="title">{title}</div>
                    <div className="text">{text}</div>
                    <div className="input-box">{input}</div>
                    <div className="action-box">{action}</div>
                </div>
            </BottomDialog>
        );
    }
}
