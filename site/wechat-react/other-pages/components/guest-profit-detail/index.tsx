import * as React from "react";
const moment = require('moment');

import "./style.scss";
import { locationTo } from "components/util";

const GuestProfitDetail = ({ record }) => {
    return (
        <div className="guest-profit-detail">
            <div className="guest-content">
                <div className="avartar"></div>
                <div className="detail">
                    <p className="title">课程名称OOXX</p>
                    <p>分成比例：80% 分成中</p>
                    <p>截止时间：2019-09-10 18:42</p>
                    <p>
                        已发放：<span>￥20</span>
                    </p>
                </div>
            </div>
            <div className="tag">课程</div>
            <div className="footer">
                <div className="btn-wrap">
                    <div className="btn">
                        <span className="btn-text">查看收益明细</span>
                    </div>
                    <div className="btn">
                        <span className="btn-text">查看结算记录</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GuestWithdrawDetail = ({ record, reSubmit }) => {
    return (
        <div className="guest-withdraw-detail">
            <p className="title">
                提现金额：<span>{record.withdrawAmount}元</span>
            </p>
            <p>
                申请时间：{moment(record.createTime).format("YYYY-MM-DD HH:mm")}
            </p>
            <p>
                预计到账时间：{moment(record.payTime).format("YYYY-MM-DD HH:mm")}
            </p>
            <p className="status">提现状态：{getText(record)}</p>
            {record.type == "FAIL" && record.errorInfo == "NAME_MISMATCH" && (
                <div className="footer">
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

function getText({ type, errorInfo, repayResult }) {
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

export { GuestProfitDetail, GuestWithdrawDetail };
