import * as React from "react";
const moment = require('moment');
import "./style.scss";
import { locationTo } from "components/util";

// 话题状态 beginning=正在进行中,ended=结束,delete=删除
const PROFIT_TAG_MAP = {
    beginning: "正在进行",
    ended: "已经结束",
    delete: "已删除"
};

const RewardProfitDetail = ({ record }) => {
    return (
        <div className="reward-profit-detail">
            <div className="reward-content">
                <div className="detail">
                    <p className="title">{record.courseName}</p>
                    <p>
                        开始时间：
                        {moment(record.startTime).format("YYYY-MM-DD HH:mm")}
                    </p>
                    <p>分成比例：{record.userProfit}% </p>
                    <p>
                        所得金额：<span>￥{record.amount}</span>
                    </p>
                </div>
            </div>
            <div
                className={["tag", record.status ? record.status : null].join(
                    " "
                )}
            >
                {PROFIT_TAG_MAP[record.status]}
            </div>
        </div>
    );
};

// 状态 SUCCESS 成功 AWAITING 已提交微信审批 FAIL失败 NO_PASS 终止
const WITHDRAW_TAG_MAP = {
    SUCCESS: "已存入微信钱包",
    AWAITING: "提现中",
    FAIL: "提现失败",
    NO_PASS: "终止"
};

const RewardWithdrawDetail = ({ record, reSubmit }) => {
    return (
        <div className="reward-withdraw-detail">
            <p className="title">
                提现金额：<span>{record.withdrawAmount}元</span>
            </p>
            <p>
                申请时间：{moment(record.createTime).format("YYYY-MM-DD HH:mm")}
            </p>
            <p className="status">提现状态：{getText(record)}</p>
            {
                record.type == "FAIL" && record.errorInfo == "NAME_MISMATCH" && 
                (<div className="footer">
                    <div className="btn-wrap">
                        <div
                            className="btn"
                            onClick={() => {
                                reSubmit && reSubmit(record);
                            }}
                        >
                            <span className="btn-text">重新提交</span>
                        </div>
                        <div
                            className="btn"
                            onClick={() => {
                                locationTo("/wechat/page/real-name");
                            }}
                        >
                            <span className="btn-text">申请重新实名认证</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function getText({type, errorInfo, repayResult}) {
    if (type === "SUCCESS" || repayResult === "SUCCESS") {
        return "已汇入微信钱包";
    } else if (type === "AWAITING") {
        return "已提交微信审批";
    } else if (type === "FAIL" && errorInfo === "NAME_MATCH") {
        return "再次进行姓名认证，认证通过会立刻到账";
    } else if (type == "FAIL" && errorInfo == "NAME_MISMATCH") {
        return "姓名校验失败，微信钱包绑定银行卡姓名所有者的真实姓名必须与平台实名认证姓名一致，如未绑定银行卡，请先将微信钱包绑定银行卡";
    } else if (type === "NO_PASS") {
        return "因违规提现请求已中止，请联系千聊客服";
    } else {
        return "正在处理中";
    }
}

export { RewardProfitDetail, RewardWithdrawDetail };
