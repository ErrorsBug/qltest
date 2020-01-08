import React from "react";
import PropTypes from "prop-types";
import Timer from "components/timer";
import { locationTo, imgUrlFormat } from "components/util";
// import {formateToDay,formatDate ,formatMoney } from 'components/util';

const Item = props => {
    return (
        <dd className="channel-group-list-item">
                <div className="head-img">
                    <HeadpicItem
                        headUrl={props.leaderHead}
                        key={`grouping-img-0`}
                    />
                    {/* {props.headUrlList.map((val, index) => {
                        if (index < 2) {
                            return (
                                <HeadpicItem
                                    headUrl={val}
                                    key={`grouping-img-${index + 1}`}
                                />
                            );
                        } else {
                            return null;
                        }
                    })} */}
                </div>
                <div className="text-con">
                    <div className="text-left">
                        <span className="author-name-over">{props.leaderName} </span>的团
                    </div>
                    <div>
                        <div className="text-right">只差
                            <var className="left-num">
                                {Number(props.groupNum - props.joinNum)}
                            </var>人
                        </div>
                        <div className="le-time">
                            剩余:
                            <Timer
                                className="le-time"
                                durationtime={props.endTime - props.currentTime}
                                onFinish={props.onFinish}
                                notSecond={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="right-con">
                {props.client === "C" ? (
                    props.userId === props.creatorId ? (
                        <div
                            className="ping-a"
                            onClick={() => {locationTo(`/topic/channel-group?channelId=${props.channelId}&liveId=${props.liveId}&groupId=${props.id}&type=sponser`);}}
                        >
                            查看
                        </div>
                    ) : (
                        <div className="ping-a"
                            onClick={() => {props.groupPayFunc(props.id,props.discountMoney);
                            }}
                        >
                            去拼课
                        </div>
                    )
                ) : (
                    <div
                        className="ping-a"
                        onClick={() => {locationTo(`/topic/channel-group?channelId=${props.channelId}&liveId=${props.liveId}&groupId=${props.id}&type=sponser`);}}
                    >
                        查看
                    </div>
                )}
            </div>
        </dd>
    );
};

const HeadpicItem = props => {
    return (
        <i>
            <img
                src={imgUrlFormat( props.headUrl || "http://img.qlchat.com/qlLive/liveCommon/normalLogo.png", "@64w_64h_1e_1c_2o")}
            />
        </i>
    );
};

const GroupingList = props => {
    //if (props.groupingListItem.length > 0) {
        return (
            <div className="grouping-list-wrap">
                <div className="grouping-list-head">
                    <div className="">正在拼课</div>
                    {
                        props.liveRole && 
                        <div className="grounp-all-tap" onClick={() => {locationTo(`/wechat/page/splicing-all?channelId=${props.channelId}&liveId=${props.liveId}`);}}>
                            全部
                            <span className="link-icon icon_enter" />
                        </div>
                    }
                    
                </div>
                {
                    (props.groupingListItem && props.groupingListItem.length > 0) ?
                    <dl className="grouping-list">
                        {props.groupingListItem.map((val, index) => {
                            if (index < 2) {
                                return (
                                    <Item
                                        {...val}
                                        key={`grouping-item-${index}`}
                                        creatorId={props.creatorId}
                                        currentTime={props.currentTime}
                                        groupPayFunc={props.groupPayFunc.bind(this)}
                                        discountMoney={props.discountMoney}
                                        client={props.client}
                                        onFinish={props.timeFinish}
                                        liveId={props.liveId}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })}
                    </dl>
                    : null            
                }
                </div>
        );
    // } else {
    //     return null;
    // }
};

GroupingList.propTypes = {
    groupingListItem: PropTypes.array.isRequired,
    groupPayFunc: PropTypes.func.isRequired
};

export default GroupingList;
