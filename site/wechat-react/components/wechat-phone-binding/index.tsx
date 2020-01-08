import { apiService } from "components/api-service/index";
import PhoneCode from "components/phone-code/index";
import { autobind } from "core-decorators";
import * as React from "react";
import { Component, CSSProperties } from "react";
import { isFunction } from "util";
import { handleKeyBoardCollapseListen } from "../../../tools/tool-box";

interface WechatPhoneBindingProps {
    className?: string;
    style?: CSSProperties;
    userId: any;
    wechat?: string;
    phone?: number | string;
    onChange?: (data: {
        phone?: any;
        code?: any;
        messageId?: string;
        wechatAccount?: string;
    }) => any;
    onSuccess: any;
    onFail: (err: { code: number; msg: string }) => any;
}

@autobind
export default class WechatPhoneBinding extends Component<
    WechatPhoneBindingProps,
    any
> {
    constructor(props) {
        super(props);
        this.state = {
            wechat: undefined,
            phone: undefined
        };
    }

    componentDidMount() {
        handleKeyBoardCollapseListen();
    }

    handleChange = data => {
        const { onChange } = this.props;
        const submitInfo = {
            ...this.state.submitInfo,
            ...data
        };
        this.setState({
            submitInfo
        });
        isFunction(onChange) && onChange(submitInfo);
    };

    handleInfoSubmit = async () => {
        const { userId, onSuccess, onFail } = this.props;
        const {
            submitInfo: { wechatAccount, phone: mobile, code, messageId }
        } = this.state;
        try {
            // 对验证码进行验证
            if (messageId) {
                const resValidate = await apiService.post({
                    url: "/h5/validCode/check",
                    body: {
                        phoneNum: mobile,
                        code,
                        messageId
                    }
                });
                if (resValidate.state.code != 0) {
                    throw resValidate.state;
                }
            }
            // 验证通过，提交信息
            const resApply = await apiService.post({
                url: "/h5/user/saveUserMobileAndWechatAccount",
                body: {
                    userId,
                    mobile,
                    wechatAccount
                }
            });
            if (resApply.state.code == 0) {
                isFunction(onSuccess) && onSuccess();
            } else {
                throw resApply.state;
            }
        } catch (error) {
            isFunction(onFail) && onFail(error);
            console.error(error);
        }
    };

    render() {
        const { wechat, phone, className, style } = this.props;
        const { submitInfo } = this.state;
        const {
            phone: phoneToBind,
            code,
            messageId,
            wechatAccount: wechatToBind
        } = submitInfo || {};

        const buttonSubmitDisabled =
            wechat && !phone
                ? !(phoneToBind && code && messageId)
                : !wechat && phone
                ? !wechatToBind
                : !(wechatToBind && phoneToBind && code && messageId);

        return (
            <div
                className={`wechat-phone-binding-container ${className || ""}`}
                style={style}
            >
                <div className="user-info">
                    {!wechat && (
                        <div className="wechat-input-container">
                            <img
                                className="icon"
                                src={require("./assets/icon-wechat.png")}
                            />
                            <input
                                className="wechat-input"
                                maxLength={50}
                                placeholder="请输入微信号"
                                value={wechatToBind}
                                onChange={e =>
                                    this.handleChange({
                                        wechatAccount: e.target.value
                                    })
                                }
                            />
                        </div>
                    )}
                    {!phone && <PhoneCode onChange={this.handleChange} />}
                </div>
                <div className="actions">
                    <div
                        className={`btn-submit${
                            buttonSubmitDisabled ? " disabled" : ""
                        }`}
                        onClick={() =>
                            !buttonSubmitDisabled && this.handleInfoSubmit()
                        }
                    >
                        完成
                    </div>
                </div>
            </div>
        );
    }
}
