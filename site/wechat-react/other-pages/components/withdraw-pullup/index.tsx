import * as React from "react";
import { BottomDialog } from "components/dialog";

import "./style.scss";

const { useState, useEffect, useCallback } = React;

interface Props {
    wechatNickName?: string;
    show?: Boolean;
    onClose?: () => void;
    onOk?: (param: any) => void;
}

interface InputProps {
    label: string;
    placeholder?: string;
    value: any;
    required?: boolean;
    onChange: (e: string) => void;
}

const Input = ({
    label,
    placeholder,
    value,
    onChange,
    required
}: InputProps) => {
    return (
        <div className={["input-item", required ? "required" : null].join(" ")}>
            {label && <div className="label"> {label}：</div>}
            <div className="input-wrap">
                <input
                    type="text"
                    className="input"
                    value={value}
                    onChange={e => {
                        onChange && onChange(e.target.value);
                    }}
                    // 微信浏览器下键盘顶起window
                    onBlur={() => {
                        window.scrollTo(0, 0);
                    }}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

const WithdrawPullup = ({ show, onClose, onOk, wechatNickName }: Props) => {
    const [withdraw, setWithdraw] = useState<String>("");
    const [name, setName] = useState<String>("");
    const [disabled, setDisabled] = useState<Boolean>(true);
    /**
     * 当withdraw name 发生改变时，判断输入是否有长度
     * 修改提现按钮可点击状态
     */
    useEffect(() => {
        if (withdraw && name && withdraw.length > 0 && name.length > 0) {
            if (disabled === true) setDisabled(false);
        } else {
            if (disabled === false) setDisabled(true);
        }
    }, [withdraw, name]);

    /**
     * 每次关闭时重置信息
     */
    useEffect(() => {
        if (show !== true) {
            setWithdraw("");
            setName("");
            setDisabled(true);
        }
    }, [show]);

    const okHandler = useCallback(onOk, []);

    return (
        <BottomDialog
            theme="empty"
            className="withdraw-pullup-dialog"
            show={show}
        >
            <div className="withdraw-pullup">
                <div className="header">
                    <p className="title">申请提现</p>
                    <div className="close-btn" onClick={onClose}>
                        <img src={require("./img/close.png")} alt="" />
                    </div>
                </div>
                <div className="content">
                    <Input
                        label="提现金额(元)"
                        value={withdraw}
                        onChange={setWithdraw}
                        placeholder="请输入最小提现金额为1元"
                    />
                    <Input
                        label="收款方姓名"
                        value={name}
                        onChange={setName}
                        placeholder="请输入实名认证的正式姓名"
                    />
                    <div className="attention">
                        <p>注意：</p>

                        <p>
                            1、每笔提现金额至少<span>1元</span>，每日提现上限为
                            <span>2万；</span>
                        </p>

                        <p>
                            2、提现超过<span>2000元</span>，需要进行
                            <span>实名认证</span>
                            ，且姓名必须与你在微信上绑定的持卡人姓名一致；
                            <a className="go-verify" href="/wechat/page/real-name">去认证></a>
                        </p>

                        <p>
                            3、提现到账后，将直接转入你的微信钱包（微信昵称：
                            {wechatNickName}）；
                        </p>

                        <a
                            className="problem"
                            href={`/wechat/page/live/profit/detail/problem`}
                        >
                            提现或资金遇到问题？
                        </a>
                    </div>
                </div>
                <div className="btn-wrap">
                    <div
                        className={["btn", disabled ? "disabled" : null].join(
                            " "
                        )}
                        onClick={() => {
                            !disabled &&
                                okHandler &&
                                okHandler({
                                    withdraw: Number(withdraw),
                                    name
                                });
                        }}
                    >
                        提现
                    </div>
                </div>
            </div>
        </BottomDialog>
    );
};

export default WithdrawPullup;
