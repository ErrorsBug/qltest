import * as React from "react";
// import moment from 'moment';
const moment = require('moment');
import BottomDialog from "components/dialog/bottom-dialog";

import "./style.scss";

const { useState, useEffect, useRef, useMemo } = React;

const Comp = ({ show, onClose, sysTime, onTimeChange }) => {
    const [timeType, setTimeType] = useState("all"); // 统计时间类型
    const [calTime, setCalTime] = useState(null); // 统计时间

    const timeTypeList = useRef([
        { label: "全部", value: "all" },
        { label: "7日", value: "nearly_seven" },
        { label: "自定义月份", value: "custom" }
    ]);

    const monthList = useMemo(() => {
        const list = [];
        for (let i = 0; i < 12; i++) {
            list.push(
                moment(sysTime)
                    .add(-i, "month")
                    .format("YYYY/MM")
            );
        }
        return list;
    }, [sysTime]);

    const onSelect = val => {
        setCalTime(val);
        onTimeChange && onTimeChange(val);
    };

    const onTimeTypeChange = val => {
        setTimeType(val);
        if (val !== "custom") {
            onTimeChange && onTimeChange(val);
        }
    };

    return (
        <BottomDialog
            className="date-bottom-dialog"
            show={show}
            theme="empty"
            onClose={onClose}
        >
            <div className="wrap">
                <div className="content">
                    <p className="title">选择统计时间</p>
                    <div className="radio-list">
                        {timeTypeList.current.map((item, index) => (
                            <div
                                key={index}
                                className={[
                                    "radio",
                                    item.value === timeType ? "selected" : null
                                ].join(" ")}
                                onClick={() => onTimeTypeChange(item.value)}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                    <div className="item-list">
                        {timeType === "custom" &&
                            monthList.map((item, index) => (
                                <div
                                    key={index}
                                    className={[
                                        "item",
                                        calTime === item ? "selected" : null
                                    ].join(" ")}
                                    onClick={() => onSelect(item)}
                                >
                                    {item}
                                </div>
                            ))}
                    </div>
                </div>
                <div className="btn-wrap">
                    <div className="btn" onClick={onClose}>
                        取消
                    </div>
                </div>
            </div>
        </BottomDialog>
    );
};

export default Comp;
