import * as React from "react";
import BottomDialog from "components/dialog/bottom-dialog";
import Touchable from "rc-touchable";
import { createPortal } from "react-dom";
import { autobind } from "core-decorators";
import ScrollView from "components/scroll-view";
import { fixScroll, resetScroll } from "components/fix-scroll";
const { useRef, useEffect, useState, useCallback, useMemo } = React;

const CLOSE_DELAY = 500;

const NUMBER_MAP = {
    "0": "请先选择一级分类",
    "1": "二级分类"
};

interface CategoryItem {
    children?: CategoryItem;
    [key: string]: any;
}

interface CategoryCascaderProp {
    data: CategoryItem[];
    value?: any;
    column?: number;
    onChange?: (value: any) => void;
    valueKey?: string;
    labelKey?: string;
}

interface PopUpProps {
    className?: string;
    children?: any;
    show: boolean;
    data: CategoryItem[];
    value: any;
    hotData: CategoryItem[]; // 热门数据
    labelKey?: string;
    valueKey?: string;
    column?: number;
    onClose: () => void;
    onChange?: (value: any) => void;
    onCancel?: () => void;
}
interface LiveCategoryPickerProps {
    className?: string;
    children?: any;
    hotData: CategoryItem[]; // 热门数据
    data: CategoryItem[]; // 选择列表数据源
    value: any; // 控件值
    column?: number; // 列数
    labelKey?: string; // label的键
    valueKey?: string; // value的键
    defaultShow?: boolean;
    onClose: () => void; // 关闭回调
    onChange?: (value: any) => void;
    onCancel?: () => void;
    onShow?: () => void;
}

const HotCategory = ({
    categoryList,
    labelKey = "label",
    valueKey = "value",
    onChange
}) => {
    const [curIndex, setCurIndex] = useState("0");
    const [disabled, setDisabled] = useState(false);
    const onClick = useCallback(
        cate => {
            if (disabled) return;
            setCurIndex(cate[valueKey]);
            setDisabled(true);
            onChange &&
                setTimeout(() => {
                    onChange(cate[valueKey]);
                }, CLOSE_DELAY);
        },
        [onChange, disabled]
    );
    return (
        <div className="hot-cate-list">
            {categoryList.map((cate, index: number) => (
                <div
                    className={`item ${
                        curIndex === cate[valueKey] ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => {
                        onClick(cate);
                    }}
                >
                    {cate[labelKey]}
                </div>
            ))}
        </div>
    );
};

const CategoryCascader = ({
    data,
    column = 2,
    valueKey,
    labelKey,
    // value,
    onChange
}: CategoryCascaderProp) => {
    const [currentValue, setCurrentValue] = useState([]);
    const [optingIndex, setOptingIndex] = useState(0); // 当前操作层级
    const [disabled, setDisabled] = useState(false);
    const listRef = useRef(null);

    /**
     * useEffect 模拟componentDidMount
     * clearEffect 模拟componentDidUnMount
     */
    useEffect(() => {
        // 防露底
        fixScroll(".co-scroll-view");
        return () => {
            // 记得清楚effect
            resetScroll();
        };
    }, []);
    // 19.12.20 改版不需要初始化值↓↓↓↓↓
    // 根据value prop 进行初始化
    // useEffect(() => {
    //     // 根据最终值，获取整个级联的值
    //     function getInitialValue(data, val) {
    //         if (val && data) {
    //             for (let i = 0; i < data.length; i++) {
    //                 if (data[i].children) {
    //                     for (let j = 0; j < data[i].children.length; j++) {
    //                         if (data[i].children[j].id == val) {
    //                             return [
    //                                 data[i][valueKey],
    //                                 data[i].children[j][valueKey]
    //                             ];
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     const initVal = getInitialValue(data, value);
    //     if (initVal) {
    //         setCurrentValue(initVal);
    //         setOptingIndex(initVal.length - 1);
    //     }
    // }, [value]);

    // 手动选择触发方法
    const select = (val, opindex) => {
        if (disabled) return;
        let newVal = currentValue;
        newVal[opindex] = val;
        setCurrentValue(newVal);
        setOptingIndex(() => {
            let idx = (opindex >= column ? column - 1 : opindex) + 1;

            if (idx >= column) {
                setDisabled(true);
                setTimeout(() => {
                    onChange(currentValue[column - 1]);
                }, CLOSE_DELAY);
            } else {
                setTimeout(() => {
                    typeof _qla != "undefined" && _qla.collectVisible();
                }, 100);
                if (listRef.current) {
                    const listDOM = listRef.current.dom;
                    if (listDOM) {
                        listDOM.scrollTo(0, 0);
                    }
                }
            }
            return idx;
        });
    };

    // 重新选择
    const reSelect = optindex => {
        setCurrentValue(currentValue.slice(0, optindex));
        setOptingIndex(optindex);
    };

    // 获取当前供选择的data列表
    const currentData = useMemo(() => {
        let dt = data;
        const limit = optingIndex > column - 1 ? column - 1 : optingIndex;
        for (let i = 0; i <= limit; i++) {
            if (i === limit) {
                return dt;
            }
            let target = dt.find(item => {
                return currentValue[i] == item[valueKey];
            });
            target && (dt = target.children);
        }
    }, [optingIndex, data]);

    // 获取tab的文本
    const getCateText = useCallback(
        index => {
            let dt = data;
            let target;
            for (let i = 0; i <= index; i++) {
                target = dt.find(item => {
                    return currentValue[i] == item[valueKey];
                });
                dt = target.children;
            }
            return target && target[labelKey];
        },
        [data, currentValue]
    );

    const casList = useMemo(() => {
        const arr = [];
        for (let i = 0; i < column; i++) {
            arr.push(i);
        }
        return arr;
    }, [column]);

    return (
        <div className="category-cascader-picker">
            <div className="category-cascader">
                {casList.map((cas, index) => {
                    return !!currentValue[index] ? (
                        <div key={index} className={`cascader-item ${(index == column - 1) ? "active" : ""}`} onClick={() => {reSelect(index)}}>
                            {getCateText(index)}
                        </div>
                    ) : (
                        <div
                            className={`cascader-item not-set ${
                                optingIndex == cas ? "active" : ""
                            }`}
                            key={index}
                        >
                            {NUMBER_MAP[`${cas}`]}
                        </div>
                    );
                })}
            </div>
            <div className="cate-list-wrap">
                <ScrollView ref={listRef}>
                    <div className="list">
                        {currentData &&
                            currentData.map((item, index) => (
                                <div
                                    className={`item ${
                                        currentValue.includes(item[valueKey])
                                            ? "active"
                                            : ""
                                    } on-log on-visible`}
                                    data-log-region="pleasechoose"
                                    data-log-pos={optingIndex == 0 ? 1 : 2}
                                    key={index}
                                    onClick={() => {
                                        select(item[valueKey], optingIndex);
                                    }}
                                >
                                    {currentValue.includes(item[valueKey]) ? <img src={require('./img/selected.png')} /> : null}
                                    <span>{item[labelKey]}</span>
                                </div>
                            ))}
                    </div>
                </ScrollView>
            </div>
        </div>
    );
};

const LiveCategoryPopUp = ({
    show,
    data,
    onClose,
    hotData,
    // value,
    valueKey,
    labelKey,
    onCancel,
    onChange
}: PopUpProps) => {
    return (
        <BottomDialog
            className="live-cate-picker-dialog"
            show={show}
            theme="empty"
        >
            <div className="content">
                <div className="header">
                    <span
                        className="close on-log on-visible"
                        data-log-region="shutdown"
                        onClick={onCancel}
                    >
                        <img src={require("./img/close.png")} alt="" />
                    </span>
                    <p className="title">选择分类</p>
                    <p className="sub-title">
                        热门分类和自定义分类只能选择一个
                    </p>
                </div>
                <div className="live-cate-section">
                    <p className="title">热门分类：</p>
                    <HotCategory
                        labelKey={labelKey}
                        valueKey={valueKey}
                        categoryList={hotData}
                        onChange={onChange}
                    />
                </div>
                <div className="live-cate-section all-cate">
                    <p className="title">全部分类：</p>
                    <CategoryCascader
                        data={data}
                        // value={value}
                        valueKey={valueKey}
                        labelKey={labelKey}
                        onChange={onChange}
                    />
                </div>
            </div>
        </BottomDialog>
    );
};

@autobind
class LiveCategoryPicker extends React.Component<LiveCategoryPickerProps, any> {
    state = {
        show: false
    };

    node = null;

    onShow() {
        if (this.node == null) {
            this.node = document.querySelector(".portal-high");
        }
        this.setState({ show: true });
        this.props.onShow && this.props.onShow();
        setTimeout(() => {
            typeof _qla != "undefined" && _qla.collectVisible();
        }, 100);
    }

    onClose() {
        this.setState({ show: false });
    }

    cancel() {
        this.onClose();
        this.props.onCancel && this.props.onCancel();
    }

    changeHandler(val) {
        this.onClose();
        this.props.onChange && this.props.onChange(val);
    }

    render() {
        const {
            data,
            hotData,
            className,
            children,
            labelKey,
            valueKey,
            // value,
            column = 2
        } = this.props;

        const { show } = this.state;
        return (
            <div
                className={`ql-live-cate-picker-bar ${
                    className ? className : ""
                }`}
            >
                {show &&
                    createPortal(
                        <LiveCategoryPopUp
                            show={show}
                            data={data}
                            // value={value}
                            hotData={hotData}
                            labelKey={labelKey}
                            valueKey={valueKey}
                            onClose={this.onClose}
                            column={column}
                            onCancel={this.cancel}
                            onChange={this.changeHandler}
                        />,
                        this.node
                    )}
                <Touchable onPress={this.onShow}>{children}</Touchable>
            </div>
        );
    }
}

export default LiveCategoryPicker;
