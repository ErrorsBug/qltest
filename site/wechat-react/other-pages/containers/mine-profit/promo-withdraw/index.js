import React, { useCallback, useEffect, useState, useRef } from "react";
import Page from "components/page";
import { connect } from "react-redux";

import { request } from "common_actions/common";
import dayjs from "dayjs";
import ScrollToLoad from "components/scrollToLoad";
import Confirm from "components/dialog/confirm";
import { locationTo } from "components/util";

const PAGE_SIZE = 20;

function PromoWithdrawItem({ record, reSubmit }) {
    const { withdrawAmount, createTime, payTime, type } = record;

    return (
        <li className="record">
            <p className="withdraw-money">
                提现金额：<span>{withdrawAmount}元</span>
            </p>
            <p>申请时间：{dayjs(createTime).format("YYYY-MM-DD HH:mm")}</p>
            <p>预计到账时间：{dayjs(payTime).format("YYYY-MM-DD HH:mm")}</p>
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
        </li>
    );
}

const Promo = ({}) => {
    const [currentPage, setcurrentPage] = useState(0);
    const [data, setData] = useState([]);
    const [renameRecordId, setRenameRecordId] = useState("");
    const [rename, setRename] = useState("");
    const [isNoMore, setNoMore] = useState(false);
    const confirmRef = useRef(null)

        // 重新提交提现申请
    const reWithdraw = useCallback(async (record) => {
        setRenameRecordId(record.id);
        confirmRef.current.show();
    })

    const onConfirmReWithdraw = useCallback(async (e) => {
        if(e === 'confirm') {
            if(rename.length === 0) {
                window.toast("请输入姓名");
                return ;
            }
            try {
                const result = await request({
                    url: "/api/wechat/transfer/h5/account/saveRealName",
                    method: "POST",
                    body: {
                        name: rename,
                        recordId: renameRecordId
                    }
                });
                if (result.state.code === 0) {
                    await this.getWithdrawRecord(1, PAGE_SIZE, 0);

                    confirmRef.current.hide();
                }
                window.toast(result.state.msg);
            } catch (error) {
                console.error(error);
            }

        } else {
            confirmRef.current.hide();
        }
    });

    // 获取收益明细
    const getRewardWithdraw = useCallback(async (page = 1, size = PAGE_SIZE, reload = false) => {
        try {
            const result = await request({
                url: "/api/wechat/transfer/h5/shareAccount/withdrawRecord",
                method: "POST",
                body: {
                    page: {
                        page,
                        size
                    }
                }
            });
            if (result.state.code === 0) {
                const { recordList } = result.data;
                if(reload) {
                    setData(recordList);
                } else {
                    setData(data.concat(recordList));
                }
                if(recordList&&recordList.length < PAGE_SIZE) {
                    setNoMore(true);
                }
                setcurrentPage(page);
            }
        } catch (error) {
            console.error(error);
        }
    });
    useEffect(() => {
        getRewardWithdraw();
    }, []);

    return (
        <Page title="我的推广提现记录" className="my-promo-withdraw">
            <div className="container">
                <ScrollToLoad
                    className={"profit-scroll-box"}
                    toBottomHeight={300}
                    noneOne={data.length <= 0}
                    loadNext={async (done) => {
                        await getRewardWithdraw(currentPage + 1)
                        done();
                    }}
                    noMore={isNoMore}
                >
                    <p className="tips">
                    微信支付的结算周期为T+1，提现申请后，1天会自动到账
                    </p>
                    <ul className="record-list">
                        {data.map(record => {
                            return <PromoWithdrawItem key={record.id} record={record} reSubmit={reWithdraw} />;
                        })}
                    </ul>
                </ScrollToLoad>
                <Confirm
                    className="rename-confirm"
                    ref={confirmRef}
                    title="重新提交申请"
                    onClose={() => {setRename(""); setRenameRecordId("")}}
                    onBtnClick={e => {onConfirmReWithdraw(e)}}
                >
                    <div className="rename-confirm-content">
                        <input className="rename-input" type="text" placeholder="在此填写姓名，必须和实名认证时填写的一致" value={rename} onChange={(e) => {setRename( e.target.value)}}></input>
                    </div>
                </Confirm>
            </div>
        </Page>
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


module.exports = connect(
    state => {},
    {}
)(Promo);
