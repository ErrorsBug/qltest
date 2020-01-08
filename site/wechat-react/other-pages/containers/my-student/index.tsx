import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { get } from "lodash";
import MiddleDialog from "components/dialog/middle-dialog";
import { request } from "common_actions/common";
import { getUnreadCount } from "common_actions/notice-center";
import Page from "components/page";
import { useApi } from "components/hooks";
import DateBottomDialog from "./components/date-bottom-dialog";
import { getPower } from "../../actions/live";
import StudioIndexBar from "components/studio-index";
import * as Clipboard from "clipboard";
// import ScrollToLoad from "components/scrollToLoad";
import Empty from "components/empty-page";
import * as Swiper from "react-swipe";
// import moment from 'moment';
const moment = require("moment");

import "./style.scss";
import { locationTo } from "components/util";

const { useEffect, useState, useCallback, useMemo, useRef } = React;

// 计算听课时间文本
function addUpFormatter(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.ceil((seconds % 3600) / 60);
    if (hours === 0 && minutes === 0) {
        return (
            <>
                <span>00</span>小时<span>00</span>分钟
            </>
        );
    } else if (hours === 0) {
        return (
            <>
                <span>00</span>小时
                <span>{minutes > 10 ? minutes : `0${minutes}`}</span>分钟
            </>
        );
    } else if (minutes === 0) {
        return (
            <>
                <span>{hours > 10 ? hours : `0${hours}`}</span>小时
                <span>00</span>分钟
            </>
        );
    } else {
        return (
            <>
                <span>{hours > 10 ? hours : `0${hours}`}</span>小时
                <span>{minutes > 10 ? minutes : `0${minutes}`}</span>分钟
            </>
        );
    }
}

// 计算未读数量
function calUnreadNum(unreadMap) {
    if (!unreadMap) return;
    let sum = 0;
    Object.keys(unreadMap).forEach(key => {
        sum += unreadMap[key];
    });
    return sum;
}

interface Props {
    location: any;
    sysTime: number;
    [key: string]: any;
}

interface ModProps {
    className?: string;
    title?: string;
    subTitle?: string;
    children: React.ReactChild;
    tools: any;
}

const Mod = ({ title, subTitle, children, className, tools }: ModProps) => {
    return (
        <section className={["mod", className].join(" ")}>
            <header className="mod-header">
                <div className="text">
                    <p className="title">{title}</p>
                    <p className="sub-title">{subTitle}</p>
                </div>
                {tools}
            </header>
            <main className="mod-body">{children}</main>
        </section>
    );
};

const OverViewColumn = ({
    value,
    name,
    showIcon,
    onClick,
    slot,
    liveBindData,
    powerSet
}: {
    value: string | number;
    name: any;
    showIcon?: boolean;
    onClick?: () => void;
    [key: string]: any;
}) => {
    return (
        <div className="column">
            {slot ? (
                slot
            ) : (
                <div className="val">
                    {value >= 0 && value !== null ? value : "- -"}
                    {showIcon && (
                        <span className="icon-search" onClick={onClick}>
                            <img src={require("./img/icon-search.png")} />
                        </span>
                    )}
                </div>
            )}
            <div className="name">{name}</div>
        </div>
    );
};

const ToolColumn = ({ icon, title, subTitle, onClick, region }) => {
    return (
        <div
            className="column on-log"
            data-log-region={region}
            onClick={onClick}
        >
            <div className="icon">{icon}</div>
            <div className="detail">
                <div className="title">{title}</div>
                <div className="sub-title">{subTitle}</div>
            </div>
            <span className="arrow">
                <img src={require("./img/arrow.png")} alt="" />
            </span>
        </div>
    );
};

const PersonasItem = ({ desc, name, order, headImg }) => {
    return (
        <div className="personas-item">
            <div className="order">{order}</div>
            <div className="avartar">{headImg && <img src={headImg} />}</div>
            <div className="name">{name}</div>
            {desc}
        </div>
    );
};

// swiper弹窗
const SwiperContent = ({ children }) => {
    const [curIndex, setCurIndex] = useState<number>(0);
    const swiper = useRef(null);
    const onSwipe = useCallback(index => {
        setCurIndex(index);
    }, []);
    return (
        <div className="banner-wrap">
            <Swiper
                className="banner-swiper"
                key={1}
                ref={swiper}
                swipeOptions={{
                    callback: onSwipe
                }}
            >
                {children}
            </Swiper>
            <div className="indicator">
                {React.Children.map(children, (_, index) => (
                    <div
                        className={`item ${
                            index === curIndex ? "selected" : ""
                        }`}
                        onClick={() => {
                            swiper.current.swipe.slide(index);
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

/**
 * RankSwiper
 * 我猜可以抽成组件，swipeToLoad， just like scrollToLoad
 * ๑Ő௰Ő๑)
 */
const RankSwiper = ({ children, none }: { children?: any; none?: boolean }) => {
    const [curIndex, setcurIndex] = useState(0);
    const swiper = useRef(null);
    const onSwipe = useCallback(index => {
        setcurIndex(index);
    }, []);

    // 没有子组件或者none属性为true，显示空样式
    if (!children || none === true) {
        return (
            <div className="personas-list none">
                <Empty mini={true} emptyMessage="暂时还没有数据哦" />
            </div>
        );
    }

    return (
        <div className="personas-list">
            <Swiper
                key={2}
                ref={swiper}
                swipeOptions={{
                    callback: onSwipe
                }}
            >
                {children}
            </Swiper>
            {/* 长度>1才出现indicator */}
            {React.Children.count(children) > 1 && (
                <div className="indicator">
                    {React.Children.map(children, (_, index) => (
                        <div
                            className={`item ${
                                index === curIndex ? "selected" : ""
                            }`}
                            onClick={() => {
                                swiper.current.swipe.slide(index);
                            }}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};

// getUnreadCount
const MyStudent = (props: Props) => {
    const { location, sysTime } = props;
    const [showDateBottomDialog, setShowDateBottomDialog] = useState<boolean>(
        false
    ); // 显示时间选择弹窗
    const [showPCDialog, setShowPCDialog] = useState<boolean>(false); // 显示pc指引弹窗
    const [showServiceDialog, setShowServiceDialog] = useState<boolean>(false); // 显示服务号对接弹窗
    const [timeType, setTimeType] = useState<string>("all"); // 统计时间类型
    const [alertType, setAlertType] = useState<string>(null); // 提示类型 0：用户数据， 1：建群宝，2：群发助手
    const [durationRankingList, setDurationRankingList] = useState([]); // 听课时长排行榜
    const [sharingTopsList, setSharingTopsList] = useState([]); // 分享排行榜
    const [powerSet, setPowerSet] = useState<string>(""); // 公众号授权权限集
    const [community, setCommunity] = useState({});

    // 统计时间类型
    const timeTypeText = useMemo(() => {
        switch (timeType) {
            case "all":
                return "全部";
            case "nearly_seven":
                return "7日";
            default:
                return timeType;
        }
    }, [timeType]);

    // 获取流量概览
    const { data: overviewData, fetch: fetchOverviewData } = useApi(
        "/api/wechat/transfer/privateApi/private/pool/privateAreaTrafficPoolList",
        {
            body: { liveId: location.query.liveId, dateType: "all", isPc: "N" }
        }
    );

    // 直播间是否绑定公众号
    const { data: liveBindData, fetch: fetchLiveBindData } = useApi(
        "/api/wechat/transfer/h5/live/revonsitution/liveIsBindApp",
        {
            body: { liveId: location.query.liveId }
        },
        false
    );

    const { data: updateTimeData } = useApi(
        "/api/wechat/transfer/privateApi//private/pool/getMaxUpdateTime",
        {
            body: { liveId: location.query.liveId }
        }
    );

    //复制链接
    const initCopy = () => {
        var clipboard = new Clipboard(".fuzhi");
        clipboard.on("success", function(e) {
            window.toast("复制成功！");
        });
        clipboard.on("error", function(e) {
            window.toast("复制失败！请手动复制");
        });
    };

    // 隐藏日期选择弹窗
    const hideDateBottomDialog = useCallback(() => {
        setShowDateBottomDialog(false);
    }, []);

    // 切换统计时间类型
    const onTimeChange = useCallback(
        e => {
            setTimeType(e);
            getPersonas(e);
        },
        [liveBindData]
    );

    // 获取听课时长排行
    const getDurationRankingList = useCallback(
        async (dateType: string) => {
            try {
                const res = await request.post({
                    url:
                        "/api/wechat/transfer/privateApi/private/pool/lectureDurationRankingList",
                    body: {
                        liveId: location.query.liveId,
                        dateType,
                        isPc: "N"
                    }
                });
                if (res.state.code === 0) {
                    // 奇奇怪怪的结构
                    const list = [];
                    const length = 5;
                    let index = -1; // 分块，每length条数据分一块,index 为块的索引
                    res.data.resultList &&
                        res.data.resultList.forEach((item, idx) => {
                            if (idx % length === 0) {
                                index++;
                            }
                            if (!list[index]) {
                                list[index] = [];
                            }
                            list[index].push(item);
                        });
                    setDurationRankingList(list);
                    return res.data;
                }
            } catch (error) {}
        },
        [liveBindData]
    );

    // 获取分享排行
    const getSharingTopsList = useCallback(
        async (dateType: string) => {
            try {
                const res = await request.post({
                    url:
                        "/api/wechat/transfer/privateApi/private/pool/sharingTopsList",
                    body: {
                        liveId: location.query.liveId,
                        dateType,
                        isPc: "N"
                    }
                });
                if (res.state.code === 0) {
                    // 奇奇怪怪的结构
                    const list = [];
                    const length = 5;
                    let index = -1; // 分块，每length条数据分一块,index 为块的索引
                    res.data.resultList &&
                        res.data.resultList.forEach((item, idx) => {
                            if (idx % length === 0) {
                                index++;
                            }
                            if (!list[index]) {
                                list[index] = [];
                            }
                            list[index].push(item);
                        });
                    setSharingTopsList(list);
                    return res.data;
                }
            } catch (error) {}
        },
        [liveBindData]
    );

    // 获取用户画像
    const getPersonas = useCallback(
        (param: string) => {
            let pm = param;
            if (param.includes("/")) {
                pm = param.split("/").join("");
            }
            getDurationRankingList(pm);
            getSharingTopsList(pm);
        },
        [getSharingTopsList, getDurationRankingList, liveBindData]
    );

    const overView = useMemo(() => {
        return get(overviewData, "resultList[0]", {});
    }, [overviewData]);

    const refreshFans = useCallback(async () => {
        try {
            const res = await request.post({
                url:
                    "/api/wechat/transfer/privateApi/private/pool/updateAppFans",
                body: {
                    appId: liveBindData.appId,
                    recordId: overView && overView.id
                }
            });
            if (res.state.code === 0) {
                fetchOverviewData();
            }
        } catch (error) {}
    }, [liveBindData, overviewData]);

    // 直播间公众号授权权限集
    const getPowerSet = async (appId: string) => {
        try {
            const res = await request.post({
                url:
                    "/api/wechat/transfer/kaifangApi/authorizationInfo/getFuncInfo",
                body: { appId }
            });
            if (res.state.code === 0) {
                setPowerSet(res.data.funcInfo || "");
                return res.data;
            }
        } catch (error) {}
    };

    // 直播间公众号授权权限集
    const getNumAndCommunity = async () => {
        try {
            const res = await request.post({
                url:
                    "/api/wechat/transfer/communityApi/community/wxStat/getNumAndCommunity",
                body: { liveId: location.query.liveId }
            });
            if (res.state.code === 0) {
                setCommunity(res.data);
            }
        } catch (error) {}
    };

    const onClickTimeType = () => {
        setShowDateBottomDialog(true);
    };

    const updateTime = useMemo(() => {
        let time = get(updateTimeData, "maxUpdateTime");
        return time ? moment(time).format("YYYY-MM-DD") : undefined;
    }, [updateTimeData]);

    const getUnread = () => {
        props.getUnreadCount(location.query.liveId);
    };

    // 模拟componentDidmount
    useEffect(() => {
        async function mount() {
            getPersonas(timeType);
            getUnread();
            const res = await fetchLiveBindData();
            if (res.state.code === 0) {
                getPowerSet(res.data.appId);
            }
            getNumAndCommunity();
            props.getPower(location.query.liveId);
            initCopy();
        }
        mount();
    }, []);

    return (
        <Page title={`学员管理`} className="my-student-page">
            <div className="container">
                <Mod
                    className="overview"
                    title="私域流量概览"
                    subTitle="该数据每天16点更新一次"
                    tools={
                        <div
                            className="download-btn on-log"
                            data-log-region="download"
                            onClick={() => {
                                setAlertType("3");
                                setShowPCDialog(true);
                            }}
                        >
                            下载明细数据
                            <span className="arrow">
                                <img
                                    src={require("./img/red-arrow.png")}
                                    alt=""
                                />
                            </span>
                        </div>
                    }
                >
                    <div className="mod-section">
                        <div className="row">
                            <OverViewColumn
                                value={overView.myStudentNum}
                                name="我的学员(人)"
                            />
                            <OverViewColumn
                                value={overView.subscribeLiveFansNum}
                                name="订阅直播间(人)"
                            />
                            <OverViewColumn
                                value={overView.focusLiveFansNum}
                                name={
                                    <span
                                        className="name-btn"
                                        onClick={() =>
                                            locationTo(
                                                `/live/invite/lastNewFollowList/${location.query.liveId}.htm`
                                            )
                                        }
                                    >
                                        关注直播间(人)
                                        <span className="arrow">
                                            <img
                                                src={require("./img/arrow.png")}
                                                alt=""
                                            />
                                        </span>
                                    </span>
                                }
                            />
                        </div>
                        <div className="row">
                            <OverViewColumn
                                value={overView.appFansNum}
                                showIcon={
                                    // 未绑定服务号或者绑定了未授权用户管理权限
                                    (liveBindData && !liveBindData.appId) ||
                                    (liveBindData &&
                                        liveBindData.appId &&
                                        powerSet.indexOf("2") < 0)
                                }
                                onClick={() => {
                                    if (liveBindData && !liveBindData.appId) {
                                        setShowServiceDialog(true);
                                    } else if (
                                        liveBindData &&
                                        liveBindData.appId &&
                                        powerSet.indexOf("2") < 0
                                    ) {
                                        setAlertType("4");
                                        setShowPCDialog(true);
                                    }
                                }}
                                slot={
                                    liveBindData &&
                                    liveBindData.appId &&
                                    powerSet.indexOf("2") >= 0 &&
                                    !overView.appFansNum && (
                                        <p className="slot">
                                            未更新，
                                            <span
                                                style={{ color: "#F73657" }}
                                                onClick={refreshFans}
                                            >
                                                点击刷新
                                            </span>
                                        </p>
                                    )
                                }
                                name="服务号粉丝(人)"
                            />
                            <OverViewColumn
                                value={
                                    overView.appBindFansNum &&
                                    liveBindData &&
                                    liveBindData.appId &&
                                    powerSet.indexOf("2") >= 0
                                        ? overView.appBindFansNum
                                        : null
                                }
                                onClick={() => {
                                    setShowServiceDialog(true);
                                    refreshFans();
                                }}
                                name="已绑定(人)"
                            />
                        </div>
                        <div className="row">
                            <OverViewColumn
                                value={overView.wechatGroupFansNum}
                                onClick={() => {
                                    if (community.communityNum == 0) {
                                        console.log("C");
                                        // 没有创建社群
                                        setAlertType("7");
                                        setShowPCDialog(true);
                                    } else if (community.wxGroupNum == 0) {
                                        console.log("N");
                                        // 微信群数量为0
                                        setAlertType("8");
                                        setShowPCDialog(true);
                                    } else if (
                                        !(overView.wechatGroupFansNum >= 0)
                                    ) {
                                        console.log("M");
                                        // 没有群粉丝
                                        setAlertType("7");
                                        setShowPCDialog(true);
                                    }
                                }}
                                showIcon={
                                    // 未绑定服务号或者绑定了未授权用户管理权限
                                    community.communityNum == 0 ||
                                    community.wxGroupNum == 0
                                }
                                name="微信群粉丝(人)"
                            />
                            <OverViewColumn
                                value={overView.hasPhoneUserNum}
                                name="已填手机号(人)"
                            />
                        </div>
                    </div>
                </Mod>
                <Mod
                    className="tool"
                    title="群发工具"
                    subTitle="目前只支持在电脑端进行群发"
                >
                    <div className="mod-section">
                        <div className="row">
                            <ToolColumn
                                title="公众号模版消息"
                                subTitle="不限次数，触达率高"
                                icon={<img src={require("./img/btn_tm.png")} />}
                                region="pushPush"
                                onClick={() => {
                                    setAlertType("2");
                                    setShowPCDialog(true);
                                }}
                            />
                            <span className="sepo"></span>
                            <ToolColumn
                                title="公众号粉丝消息"
                                subTitle="消息样式丰富"
                                region="pushCustom"
                                icon={
                                    <img src={require("./img/btn_pnm.png")} />
                                }
                                onClick={() => {
                                    setAlertType("2");
                                    setShowPCDialog(true);
                                }}
                            />
                        </div>
                        <div className="row">
                            <ToolColumn
                                title="短信"
                                subTitle="信息必达，不受限微信"
                                region="pushMassage"
                                icon={
                                    <img src={require("./img/btn_sms.png")} />
                                }
                                onClick={() => {
                                    setAlertType("2");
                                    setShowPCDialog(true);
                                }}
                            />
                            <span className="sepo"></span>
                            <ToolColumn
                                title="微信群"
                                subTitle="互动性强，阅读率高"
                                region="pushGroup"
                                icon={
                                    <img
                                        src={require("./img/btn_wechat.png")}
                                    />
                                }
                                onClick={() => {
                                    setAlertType("1");
                                    setShowPCDialog(true);
                                }}
                            />
                        </div>
                    </div>
                </Mod>
                <Mod
                    className="personas"
                    title="用户画像"
                    subTitle="该数据每天16点更新一次"
                    tools={
                        <div
                            className="time-select on-log"
                            data-log-region="selectTime"
                            onClick={onClickTimeType}
                        >
                            <span className="label">统计时间</span>
                            <div className="select">
                                {timeTypeText}
                                <span className="arrow">
                                    <img
                                        src={require("./img/arrow.png")}
                                        alt=""
                                    />
                                </span>
                            </div>
                        </div>
                    }
                >
                    <>
                        <div className="mod-section">
                            <p className="mod-title">
                                听课时长排行榜<span>（前50名）</span>
                            </p>
                            <div className="list">
                                <RankSwiper
                                    none={durationRankingList.length <= 0}
                                >
                                    {durationRankingList &&
                                        durationRankingList.map(
                                            (bucket, index) => (
                                                <div key={index}>
                                                    {bucket.map(item => (
                                                        <PersonasItem
                                                            key={item.id}
                                                            order={item.ranking}
                                                            name={item.userName}
                                                            headImg={
                                                                item.headImg
                                                            }
                                                            desc={
                                                                <p className="desc">
                                                                    听课{" "}
                                                                    {addUpFormatter(
                                                                        item.classTime
                                                                    )}
                                                                </p>
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            )
                                        )}
                                </RankSwiper>
                            </div>
                        </div>

                        <div className="mod-section">
                            <p className="mod-title">
                                分享达人排行榜<span>（前50名）</span>
                            </p>
                            <div className="list">
                                <RankSwiper none={sharingTopsList.length <= 0}>
                                    {sharingTopsList &&
                                        sharingTopsList.map((bucket, index) => (
                                            <div key={index}>
                                                {bucket.map(item => (
                                                    <PersonasItem
                                                        key={item.id}
                                                        order={item.ranking}
                                                        name={item.userName}
                                                        headImg={item.headImg}
                                                        desc={
                                                            <p className="desc">
                                                                邀请好友
                                                                <span>
                                                                    {
                                                                        item.inviteUserNum
                                                                    }
                                                                </span>
                                                                人
                                                            </p>
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                </RankSwiper>
                            </div>
                        </div>
                    </>
                </Mod>
                <div className="go-pc">
                    <div className="func-list">
                        <div className="func">
                            <div className="order">1</div>
                            <p className="content">用户消费能力分析</p>
                        </div>
                        <div className="func">
                            <div className="order">2</div>
                            <p className="content">用户购买/报名频次分布</p>
                        </div>
                        <div className="func">
                            <div className="order">3</div>
                            <p className="content">用户完播率分布</p>
                        </div>
                        <div className="func">
                            <div className="order">4</div>
                            <p className="content">邀请好友人数分布</p>
                        </div>
                    </div>
                    <div className="btn-wrap">
                        <div
                            className="btn on-log"
                            data-log-region="downloadPC"
                            onClick={() => {
                                setAlertType("0");
                                setShowPCDialog(true);
                            }}
                        >
                            登陆电脑端查看
                        </div>
                    </div>
                </div>
            </div>
            <StudioIndexBar
                liveId={location.query.liveId}
                activeIndex={"my-student"}
                power={props.power}
                newMessageCount={props.newMessageCount}
            />
            <DateBottomDialog
                sysTime={sysTime}
                show={showDateBottomDialog}
                timeType={timeType}
                onClose={hideDateBottomDialog}
                onTimeChange={onTimeChange}
            />
            <MiddleDialog
                className="my-student-dialog"
                show={showPCDialog}
                theme="none"
                close={true}
                onClose={() => {
                    setShowPCDialog(false);
                }}
            >
                <div className="content">
                    <p className="title">
                        {alertType === "0" &&
                            `请登录“电脑-千聊管理后台”
                            查看更多用户画像`}
                        {alertType === "1" &&
                            `请登录“电脑端-千聊管理后台”，向学员群发消息`}
                        {alertType === "2" &&
                            `请登录“电脑端-千聊管理后台”，向学员群发消息`}
                        {alertType === "3" &&
                            `请登录“电脑端-千聊管理后台”，下载学员明细数据`}
                        {alertType === "4" && `公众号未授权`}
                        {alertType === "7" &&
                            `你还没有创建社群
                            请登录“电脑端-千聊管理后台”创建`}
                        {alertType === "8" && `你的社群还没有学员加入`}
                    </p>
                    {alertType === "8" && (
                        <p className="sub-title">
                            请登录“电脑端-千聊管理后台”下载社群活码，邀请学员进群
                        </p>
                    )}
                    {alertType === "4" && (
                        <p className="sub-title">
                            【用户管理权限】，无法为你获取粉丝数。请登录“电脑端-千聊管理后台”重新授权
                        </p>
                    )}

                    {alertType === "0" && (
                        <div className="pic">
                            <img src={require("./img/0.png")} />
                        </div>
                    )}
                    {alertType === "1" && (
                        <SwiperContent>
                            <img src={require("./img/1_0.png")} />
                            <img src={require("./img/1_1.png")} />
                            <img src={require("./img/1_2.png")} />
                        </SwiperContent>
                    )}
                    {alertType === "2" && (
                        <div className="pic">
                            <img src={require("./img/2.png")} />
                        </div>
                    )}
                    {alertType === "3" && (
                        <div className="pic">
                            <img src={require("./img/3.png")} />
                        </div>
                    )}
                    {alertType === "4" && (
                        <SwiperContent>
                            <img src={require("./img/4_1.png")} />
                            <img src={require("./img/4_0.png")} />
                            <img src={require("./img/4_2.png")} />
                        </SwiperContent>
                    )}

                    {alertType === "7" && (
                        <div className="pic">
                            <img src={require("./img/7.png")} />
                        </div>
                    )}

                    {alertType === "8" && (
                        <div className="pic">
                            <img src={require("./img/8.png")} />
                        </div>
                    )}

                    <div className="tip">
                        <p className="title">如何登录电脑端？</p>
                        <p className="desc">
                            <span className="tit">方式一：</span>
                            <span>打开浏览器搜索“千聊管理后台”</span>
                        </p>
                        <p
                            className="desc fuzhi"
                            data-clipboard-text="http://v.qianliao.tv/"
                        >
                            <span className="tit">方式二：</span>
                            <span>
                                打开浏览器输入以下地址
                                <br />
                                v.qianliao.tv
                                <span className="highlight">（点击复制）</span>
                            </span>
                        </p>
                    </div>
                </div>
            </MiddleDialog>
            <MiddleDialog
                className="my-student-dialog"
                show={showServiceDialog}
                theme="none"
                close={true}
                onClose={() => {
                    setShowServiceDialog(false);
                }}
            >
                <div className="content">
                    <p className="title">你还没有对接服务号</p>
                    <div
                        className="service-btn"
                        onClick={() => {
                            locationTo(
                                `/wechat/page/service-number-docking?liveId=${location.query.liveId}`
                            );
                        }}
                    >
                        立即对接
                    </div>
                </div>
            </MiddleDialog>
        </Page>
    );
};

function mapStateToProps(state) {
    return {
        sysTime: state.common.sysTime,
        unreadMap: state.noticeCenter.unreadMap,
        newMessageCount: calUnreadNum(state.noticeCenter.unreadMap),
        power: state.live.power
    };
}

const mapActionToProps = {
    getUnreadCount,
    getPower
};

export default connect(mapStateToProps, mapActionToProps)(MyStudent);
