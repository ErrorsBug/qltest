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
            {/* 判断团长 和 团员 */}
                {(props.userId === props.creatorId || props.authStatus === 'Y') ? (
                    <div
                        className="ping-a"
                        onClick={() => {
                            locationTo(
                                "/topic/channel-group?groupId=" +
                                    props.id +
                                    "&type=sponser"
                            );
                        }}
                    >
                        查看
                    </div>
                ) : (
                    <div
                        className="ping-a on-log on-visible"
                        onClick={() => {
                            props.joinGroup(props.id, props.discountMoney);
                        }}
                        data-log-region="grouping-list-join-btn"
                        data-log-pos={props.index}
                    >
                        去拼团
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
                src={imgUrlFormat( props.headUrl ||"http://img.qlchat.com/qlLive/liveCommon/normalLogo.png", "@64w_64h_1e_1c_2o" )}
            />
        </i>
    );
};

const GroupingList = props => {
    if (props.groupingList.length > 0) {
        return (
            <div className="grouping-list-wrap">
                <div className="grouping-list-head">
                    <div className="">以下小伙伴正在发起拼团，您可以直接参与</div>
                </div>

                    <dl className="grouping-list">
                        {props.groupingList.map((val, index) => {
                            if (index < 2) {
                                return (
                                    <Item
                                        {...val}
                                        key={`grouping-item-${index}`}
                                        index={index}
                                        creatorId={props.userId}
                                        currentTime={props.currentTime}
                                        joinGroup={props.joinGroup}
                                        discountMoney={props.discountMoney}
                                        onFinish={props.updateChannelGroupingList}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })}
                    </dl>
            </div>
        );
    } else {
        return null;
    }
};

GroupingList.propTypes = {
    groupingList: PropTypes.array.isRequired,
    joinGroup: PropTypes.func.isRequired
};

export default GroupingList;
