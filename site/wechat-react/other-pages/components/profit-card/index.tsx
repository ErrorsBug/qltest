import * as React from "react";

import "./style.scss";

interface Props {
    withdrawAmount: Number;
    total: Number;
    className?: String;
    onApplyWithDraw?: () => void;
}

const ProfitCard = ({
    className,
    withdrawAmount,
    total,
    onApplyWithDraw
}: Props) => {
    return (
        <div
            className={["profit-card", className ? className : null].join(" ")}
        >
            <div className="profit-content">
                <div className="item">
                    <div className="profit-title">可提现金额(元):</div>
                    <div className="profit-desc">{withdrawAmount || "0"}</div>
                </div>
                <span className="seporator"></span>
                <div className="item">
                    <div className="profit-title">历史总收益(元):</div>
                    <div className="profit-desc">{total || "0"}</div>
                </div>
            </div>
            <div className="apply-withdraw-btn" onClick={onApplyWithDraw}>
                <span className="money-icon">
                    <img src={require("./img/money.png")} alt="" />
                </span>
                <span className="text">申请提现</span>
                <span className="arrow-icon">
                    <img src={require("./img/arrow.png")} alt="" />
                </span>
            </div>
        </div>
    );
};

export default ProfitCard;
