import React, { Component } from "react";
import { connect } from "react-redux";
import { Confirm } from "components/dialog";
import { autobind } from "core-decorators";
import Page from "components/page";
import ScrollToLoad from "components/scrollToLoad";
import Timer from "components/timer";
import { locationTo, imgUrlFormat, timeBefore } from "components/util";

import {
    fetchChannelInfo,
    getGroupListByChannelId,
	getChannelMarket,
	saveChannelMarket,
	checkLiveRole
} from "../../actions/splicing-all";

const HeadpicItem = props => {
    return (
        <i>
            <img
                src={imgUrlFormat(props.headUrl || "http://img.qlchat.com/qlLive/liveCommon/normalLogo.png", "@64w_64h_1e_1c_2o")}
            />
        </i>
    );
};

const Item = props => {
    return props.status === "ING" ? (
        <dd className="channel-group-list-item" onClick={() => {
            locationTo(`/topic/channel-group?liveId=${props.liveId}&channelId=${props.channelId}&groupId=${props.id}&type=sponser`);
        }}>
            <div className="head-img">
                <HeadpicItem
                    headUrl={props.leaderHead}
                    key={`grouping-img-0`}
                />
            </div>
            <div className="text-con">
                差
                <var className="left-num">
                &nbsp; {Number(props.groupNum - props.joinNum)}&nbsp; 
                </var>
                人成团 
                <span className="le-time">&nbsp;&nbsp;成团人数：{props.groupNum}人</span>
                <br />
                <span className="le-time">
                    剩余：
                    <Timer
                        className="le-time"
                        durationtime={props.endTime - props.currentTime}
                        notSecond={true}
                        onFinish={props.onFinish}
                    />
                </span>
            </div>
            <div className="right-con">
                <div className="arrow"></div>
            </div>
        </dd>
    ) : (
        <dd className="channel-group-list-item" onClick={() => { locationTo(`/topic/channel-group?liveId=${props.liveId}&channelId=${props.channelId}&groupId=${props.id}&type=sponser`);}}>
            <div className="head-img">
                <HeadpicItem
                    headUrl={props.leaderHeadUrl}
                    key={`grouping-img-0`}
                />
                {props.groupStatus == 'PASS' ? (
                    <span className="pin-badge">成功</span>
                ) : null}
            </div>
            <div className="text-con">
                {
                    props.groupStatus == 'PASS' ? 
                        <var className="end-status-succ">
                            拼课成功 ({props.groupNum} / {props.groupNum})
                            <span className="le-time-word">&nbsp;&nbsp;已到账: ￥{props.groupIncome}</span>
                        </var>
                    : 
                        <var className="end-status-fail">
                            拼课失败 ({props.joinNum} / {props.groupNum})
                        </var>
                }

                <br />
                <span
                    className={`le-time-word ${
                        props.groupStatus == 'PASS' ? "" : "second-tip"
                    }`}
                >
                发起时间：{timeBefore(props.endTime, props.currentTime)}
                </span>
            </div>
            <div className="right-con">
                <div className="arrow"></div>
            </div>
        </dd>
    );
};
@autobind
class ChannelSplicingAll extends Component {
    constructor(props) {
        super(props);
		this.channelId = Number(this.props.location.query.channelId);
		this.liveId = Number(this.props.location.query.liveId);
    }

    state = {
        toggle: false,
        status: "ING", //OVER ING
        isNoMore: false,
        noData: false,
        groupList: [],
		currentServerTime: 0, 
		overCount: 0,
		ingCount: 0,
		tempMark: {} //缓存设置的值
    };

    data = {
        page: 1,
        size: 20
    };

    async componentDidMount() {
        this.props.fetchChannelInfo({
            channelId: this.channelId
		});
		let result = await this.props.checkLiveRole({
			liveId: this.liveId
		})
		// 判断是否是 直播间 管理者 创建者
		if (!result.role) {
			locationTo(`/wechat/page/channel-intro?channelId=${this.channelId}`)
			return
		}
        this.getGroupList();
		this.initMarkSetting();
		this.getAllGroupList() // 为了获取两个count
	}
	changeCount(res, type) {
		this.setState({
			[type]: res.count > 1000 ? '999+' : res.count
		})
	}
	getAllGroupList() {
		this.props.getGroupListByChannelId({
            channelId: this.channelId,
            status: 'ING'
		}).then(res => {
			this.changeCount(res, 'ingCount')
		})

		this.props.getGroupListByChannelId({
            channelId: this.channelId,
            status: 'OVER'
		}).then(res => {
			this.changeCount(res, 'overCount')
		})
	}
    async getGroupList() {
        let groupInfo = await this.props.getGroupListByChannelId({
            channelId: this.channelId,
            status: this.state.status,
            page: {
            	page: this.data.page,
            	size: this.data.size,
            }
		});
        if (groupInfo.groupList && groupInfo.groupList.length) {
            this.setState({
                groupList: [...this.state.groupList, ...groupInfo.groupList],
                currentServerTime: groupInfo.currentServerTime
            });
        } else {
            this.setState({
                isNoMore: this.data.page != 1,
                noData: this.data.page == 1
            });
        }
    }
    // 切换tab时候需要重置页码
    tabHandle(status) {
		this.data.page = 1;
        this.setState({
			status,
			groupList: [],
			noData: false
        },() => {
			this.getGroupList()
		});
    }

    async loadNext(next) {
        this.data.page++;
        await this.getGroupList();
        next && next();
    }

    // 正在进行的  倒计时
    changeGroupList(id) {
        console.log("changeGroupList", id);
    }
    confirmEleClick(tags) {
        if (tags === "confirm") {
			let {discountStatus, discount, groupNum, groupHour} = this.state.tempMark
			
            this.setState({
                toggle: !this.state.toggle
            }, () => {
				this.props.saveChannelMarket({
					channelId: this.channelId,
					discountType: discountStatus,
					discount : discount, 
					groupNum,
					groupHour,
					simulationStatus: this.state.toggle ? 'Y': 'N'
				})
			});
        }

        this.refs.moniDialog.hide();
    }
    // 模拟拼团开关
    handleToggleMoni() {
        this.refs.moniDialog.show();
    }
    async initMarkSetting() {
		let result = await this.props.getChannelMarket(this.channelId);
		this.setState({
			toggle: result.simulationStatus === 'Y',
			tempMark: result
		})
    }
    render() {
        let { toggle, status, groupList, currentServerTime, ingCount, overCount } = this.state;
		let { channelInfo, marketInfo } = this.props;
        return (
            <Page title="拼课详情" className="channel-splicing-all-container">
                <div className="channel-info-wrap">
                    <div className="channel-info-left">
                        <img
                            src={channelInfo.channel.headImage}
                            className="img-responsive"
                        />
                    </div>
                    <div className="channel-info-right">
                        <div className="channel-info-intro">
							{
								marketInfo.discountStatus === 'P' ?
								<span className="tuan-free-bage">团长免费</span>
								:''
							}
                            <span className="channel-info-content">
                                {channelInfo.channel.name}
                            </span>
                        </div>

                        <div
                            className="channel-info-moni"
                            onClick={this.handleToggleMoni}
                        >
                            {toggle ? (
                                <div className="moni-open">
                                    <img
                                        src={require("./img/open.png")}
                                        className="moni-iocn"
                                    />
                                    已开模拟拼课
                                </div>
                            ) : (
                                <div className="moni-close">
                                    <img
                                        src={require("./img/close.png")}
                                        className="moni-iocn"
                                    />
                                    已关闭模拟拼课
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="splicing-tab">
                    <div
                        className={`tab-item ${
                            status == "ING" ? " active" : ""
                        }`}
                        onClick={this.tabHandle.bind(this, "ING")}
                    >
                        正在拼课({ingCount})
                    </div>
                    <div
                        className={`tab-item ${
                            status == "OVER" ? " active" : ""
                        }`}
                        onClick={this.tabHandle.bind(this, "OVER")}
                    >
                        拼课结束({overCount})
                    </div>
                </div>

                <div className="splicing-ul">
                    <ScrollToLoad
                        toBottomHeight={300}
                        noneOne={this.state.noData}
                        loadNext={this.loadNext}
                        noMore={this.state.isNoMore}
                    >
                        {groupList.map((item, index) => {
                            return (
                                <Item
                                    status={status}
                                    {...item}
                                    key={index}
                                    currentTime={currentServerTime}
                                    onFinish={this.changeGroupList}
                                    {...this.props.location.query}
                                />
                            );
                        })}
                    </ScrollToLoad>
                </div>
                <Confirm
                    ref="moniDialog"
                    cancelText="取消"
                    confirmText="确定"
                    bghide={true}
                    buttons="cancel-confirm"
                    onBtnClick={this.confirmEleClick}
                >
                    <div className="toggle-wrap">
                        <div className="toggle-title">
                            {toggle
                                ? "确定关闭”模拟拼课“吗？"
                                : "确定开启“模拟拼课”吗？"}
                        </div>
                        <div className="toggle-content">
                            {toggle
                                ? "关闭后将按照实际参与用户拼课，有可能人数不够导致拼团失败哦。拼团失败将原路退还课程费用给用户，直播间不获得任何收入。"
                                : "开启后，有效期内未达到拼课人数的课程，系统将投放“模拟用户”保证拼课成功。拼课成功后，直播间获得真实用户的对应课程收入。"}
                        </div>
                    </div>
                </Confirm>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    // const marketInfo = state.channelMarket && state.channelMarket.channelMarketInfo||{};
    return {
        channelInfo: state.splicingAll.channelInfo,
		marketInfo: state.splicingAll.marketInfo
    };
}

const mapActionToProps = {
    fetchChannelInfo,
    getGroupListByChannelId,
	getChannelMarket,
	saveChannelMarket,
	checkLiveRole
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(ChannelSplicingAll);
