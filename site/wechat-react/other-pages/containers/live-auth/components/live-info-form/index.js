import React, { useEffect, useState } from "react";
import { validLegal } from "components/util";

const COUNT_DOWN = 5;

const LiveInfoForm = ({
    weChatCount,
    phoneNum,
    onWeChatCountChange,
    onPhoneNumChange,
    getCode
}) => {
    const [count, setCount] = useState(0);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        let timer;
        if (count > 0) {
            timer = setInterval(() => {
                setCount(count - 1);
            }, 1000);
            if (!disabled) {
                setDisabled(true);
            }
        } else {
            setDisabled(false);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [count]);

    const getValidCode = () => {
        if (!disabled) {
            setCount(COUNT_DOWN);
        }

        getCode();
    };

    return (
        <div className="live-info-form">
            <div className="form-item">
                <input
                    type="text"
                    placeholder={"输入微信号"}
                    value={weChatCount}
                    onChange={onWeChatCountChange}
                />
            </div>
            <div className="form-item">
                <input
                    type="text"
                    placeholder={"输入手机号"}
                    value={phoneNum}
                    onChange={onPhoneNumChange}
                />
                <span
                    className={`get-code ${disabled ? "disabled" : ""}`}
                    onClick={getValidCode}
                >
                    {count > 0 ? count + "s" : "获取验证码"}
                </span>
            </div>
            <div className="form-item">
                <input type="text" placeholder={"输入验证码"} />
            </div>
        </div>
    );
};

export default LiveInfoForm;

function checkPhoneNum(inputVal) {
    console.log('!',inputVal);
    if (!/^1\d{10}$/.test(inputVal)) {
        return false;
    } else {
        return true;
    }
}
