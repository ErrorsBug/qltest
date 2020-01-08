import { request } from 'common_actions/common';
import { autobind } from 'core-decorators';
import * as React from 'react';
import { Component, CSSProperties } from 'react';
import { isFunction } from 'util';

interface PhoneCodeProps {
    className?: string;
    style?: CSSProperties;
    phone?: number | string;
    code?: number | string;
    countdown?: number;
    onChange?: any;
}

const REGEX_PHONE = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;

@autobind
export default class PhoneCode extends Component<PhoneCodeProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            phone: undefined,
            code: undefined,
            countdown: 0,
            messageId: ''
        };
    }

    timer;

    componentDidMount() {
        const { phone, code } = this.props;
        this.setState({
            phone,
            code
        });
    }

    componentWillReceiveProps(np) {
        const { phone, code } = np;
        if (phone !== this.props.phone && code !== this.props.code) {
            this.setState({
                phone,
                code
            });
        }
    }

    handleCodeButtonClick = async () => {
        if (!this.timer) {
            const { countdown } = this.props;
            const { phone, code } = this.state;
            if (!REGEX_PHONE.test(phone)) {
                window.toast('手机号填写错误，请检查后再试！');
                return;
            }
            try {
                const res = await request({
                    url: '/api/wechat/transfer/h5/validCode/send',
                    method: 'POST',
                    body: {
                        phoneNum: phone
                    }
                });
                if (res.state.code == 0) {
                    const { messageId } = res.data;
                    const { onChange } = this.props;
                    isFunction(onChange) &&
                        onChange({ phone, code, messageId });
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
                } else {
                    window.toast(res.state.msg);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    handleInputChange = (type, value) => {
        this.setState(
            {
                [type]: value
            },
            () => {
                const { onChange } = this.props;
                const { phone, code, messageId } = this.state;
                isFunction(onChange) && onChange({ phone, code, messageId });
            }
        );
    };

    render() {
        const { className, style } = this.props;
        const { phone, code, countdown } = this.state;

        const buttonText = countdown
            ? `已发送 ( ${countdown}s )`
            : '获取验证码';

        return (
            <div
                className={`phone-code-container ${className || ''}`}
                style={style}
            >
                <div className="phone-input-container">
                    <img
                        className="icon"
                        src={require('./assets/icon-phone.png')}
                    />
                    <input
                        className="phone-input"
                        type="tel"
                        maxLength={11}
                        placeholder="请输入手机号"
                        value={phone}
                        onChange={e =>
                            this.handleInputChange('phone', e.target.value)
                        }
                    />
                </div>
                <div className="code-action">
                    <div className="code-input-container">
                        <img
                            className="icon"
                            src={require('./assets/icon-message.png')}
                        />
                        <input
                            className="code-input"
                            type="tel"
                            maxLength={6}
                            placeholder="请输入验证码"
                            value={code}
                            onChange={e =>
                                this.handleInputChange('code', e.target.value)
                            }
                        />
                    </div>
                    <div
                        className="action-button"
                        onClick={this.handleCodeButtonClick}
                    >
                        {buttonText}
                    </div>
                </div>
            </div>
        );
    }
}
