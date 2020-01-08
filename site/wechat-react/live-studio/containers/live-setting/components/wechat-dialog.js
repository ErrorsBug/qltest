import React, { useState, useEffect, useCallback } from "react";
import MiddleDialog from "components/dialog/middle-dialog";
import { api } from "common_actions/common";

export default ({ show, wechatAccount, onCancel, onCommit, liveId, defaultStep = 0 }) => {
    const [step, setStep] = useState(defaultStep);
    const [newWechat, setNewWechat] = useState("");
    const [disabled, setDisabled] = useState(true);

    // 下一步
    const next = useCallback(() => {
        setStep(step + 1);
    });

    const wechatHandler = useCallback(e => {
        setNewWechat(e.target.value);
    });

    const commit = useCallback(async () => {
        if (disabled) return;
        if(!checkWxAccount(newWechat)) return;
        await changeWechat();

    });

    const changeWechat = async () => {
        const postData = {
            liveId,
            savePhone: "N",
            wechatAccount: newWechat
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



    // 关闭时清空信息
    useEffect(() => {
        setStep(defaultStep);
        setNewWechat("");
    }, [show, defaultStep]);

    useEffect(() => {
        setDisabled(newWechat.length <= 0);
    }, [newWechat]);

    return (
        <MiddleDialog
            show={show}
            buttons="none"
            className="live-setting-dialog"
            close={true}
            onClose={onCancel}
        >
            <div className="content">
                <p className="title">创建者微信号</p>
                <p className="desc">
                    只有直播间创作者的微信号才能提现，为保证资金安全，请确保微信号的真实性
                </p>
                <div className="box">
                    {step === 0 && (
                        <p>
                            已绑定微信号：<span>{wechatAccount}</span>
                        </p>
                    )}
                    {step === 1 && (
                        <input
                            type="text"
                            placeholder="请输入微信号"
                            value={newWechat}
                            onChange={wechatHandler}
                            onBlur={() => {window.scrollTo(0, 0)}}
                        />
                    )}
                </div>
                <div className="dialog-btn-wrap">
                    {step === 0 && (
                        <>
                            <div className="dialog-btn ghost" onClick={next}>
                                更改微信号
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
// 校驗微信號
function checkWxAccount(inputVal) {
    if (!/^[0-9a-zA-Z\-\_]{5,30}$/.test(inputVal)) {
        window.toast("微信号仅6~30个字母，数字，下划线或减号组成");
        return false;
    } else {
        return true;
    };
};