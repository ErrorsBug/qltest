import React, { useState, useEffect, useCallback } from "react";
import MiddleDialog from "components/dialog/middle-dialog";
import { api } from "common_actions/common";

const COUNT_DOWN_SECOND = 60;

export default ({ show, phone, onCancel, onCommit, liveId, defaultStep }) => {
    const [step, setStep] = useState(0);
    const [newPhone, setNewPhone] = useState("");
    const [validCode, setValidCode] = useState("");
    const [msgId, setMsgId] = useState("");
    const [validDisabled, setValidDisabled] = useState(true);
    const [count, setCount] = useState(0);
    const [disabled, setDisabled] = useState(true);

    // 下一步
    const next = useCallback(() => {
        setStep(step + 1);
    });

    const phoneHandler = useCallback(e => {
        setNewPhone(e.target.value);
    });

    const validCodeHandler = useCallback(e => {
        setValidCode(e.target.value);
    });

    const commit = useCallback(async () => {
        if (disabled) return;
        if(msgId.length <= 0) {
            window.toast("验证码错误");
            return ;
        }
        if (!checkPhone(newPhone)) return ;
        const res = await validCheckNum();
        if (res && res.state.code === 0) {
            changePhone();
        } else {
            window.toast(res.state.msg);
        }
    });

    const getValidCodeHandler = useCallback(async () => {
        if (validDisabled || newPhone.length <= 0) return;
        if(!checkPhone(newPhone)) return ;
        await getCheckNum(newPhone);
    });

    const getCheckNum = useCallback(async phoneNum => {
        const result = await api({
            method: "POST",
            showLoading: false,
            body: { phoneNum },
            url: "/api/wechat/sendValidCode"
        });

        if (result.state.code === 0) {
            setMsgId(result.data.messageId);
            setCount(COUNT_DOWN_SECOND);
            setValidDisabled(true);
        } else {
            window.toast(result && result.state && result.state.msg || '网络异常，请重试')
        }
    });

    const validCheckNum = useCallback(async () => {
        return await api({
            method: "POST",
            showLoading: false,
            body: {
                code: validCode,
                messageId: msgId,
                phoneNum: newPhone
            },
            url: "/api/wechat/checkValidCode"
        });
    });

    const changePhone = async () => {
        const postData = {
            liveId,
            savePhone: "Y",
            phoneNum: newPhone
        };
        const result = await api({
            method: "POST",
            showLoading: false,
            body: postData,
            url: "/api/wechat/transfer/h5/live/saveWechatAccountAndPhone"
        });
        if (result.state.code === 0) {
            onCommit();
        }
        window.toast(result.state.msg);
    };

    useEffect(() => {
        if (count <= 0) {
            setValidDisabled(false);
            return;
        }

        const timer = setInterval(() => {
            setCount(count - 1);
            if (!validDisabled) setValidDisabled(true);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [count]);

    useEffect(() => {
        if (newPhone.length <= 0 || validCode.length <= 0) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [newPhone, validCode]);

    // 关闭时清空信息
    useEffect(() => {
        setStep(defaultStep);
        setNewPhone("");
    }, [show, defaultStep]);

    return (
        <MiddleDialog
            show={show}
            buttons="none"
            className="live-setting-dialog"
            close={true}
            onClose={onCancel}
        >
            <div className="content">
                <p className="title">创建者手机号</p>
                <p className="desc">
                    为保证直播间的资金安全，请确保该手机号为创建者的真实手机号
                </p>
                <div className="phone-box">
                    {step === 0 && (
                        <p>
                            已绑定手机号：<span>{phone}</span>
                        </p>
                    )}
                    {step === 1 && (
                        <>
                            <div className="input-wrap">
                                <input
                                    type="text"
                                    placeholder="请输入手机号"
                                    value={newPhone}
                                    onChange={phoneHandler}
                                    onBlur={() => {window.scrollTo(0, 0)}}
                                />
                            </div>
                            <div className="input-wrap">
                                <input
                                    type="text"
                                    placeholder="请输入验证码"
                                    value={validCode}
                                    onChange={validCodeHandler}
                                    onBlur={() => {window.scrollTo(0, 0)}}
                                />
                                <div
                                    className={[
                                        "btn get-code",
                                        validDisabled || newPhone.length <= 0? "disabled" : null,
                                    ].join(" ")}
                                    onClick={getValidCodeHandler}
                                >
                                    {validDisabled
                                        ? `${count}s 重新获取`
                                        : "获取验证码"}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="dialog-btn-wrap">
                    {step === 0 && (
                        <>
                            <div className="dialog-btn ghost" onClick={next}>
                                更改手机号
                            </div>
                            <div
                                className="dialog-btn primary"
                                onClick={onCancel}
                            >
                                取消
                            </div>
                        </>
                    )}
                    {step === 1 && (
                        <div
                            className={[
                                "dialog-btn primary",
                                disabled ? "disabled" : null
                            ].join(" ")}
                            onClick={commit}
                        >
                            提交
                        </div>
                    )}
                </div>
            </div>
        </MiddleDialog>
    );
};
// 校驗电话
function checkPhone(inputVal) {
    if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(inputVal)) {
        window.toast("请输入正确的电话号码");
        return false;
    } else {
        return true;
    };
};