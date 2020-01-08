import React, { Component } from "react";
import PropTypes from "prop-types";
import { autobind, throttle } from "core-decorators";
import GroupItem from "./group-item";

@autobind
class MiniGroupList extends Component {
    state = {
        offset: 0,
        pageSize: 5,
        length: 5
    };

    componentDidMount() {
        if (this.props.showNum) {
            this.setState({
                length: this.props.showNum
            });
        }
    }

    render() {
        let { title, group, power, sysTime, onLinkClick, onClickOpenGroup } = this.props;

        // C端，关闭状态，不显示, 
        // C端，没有社群，不显示
        if (
            (power && !power.allowMGLive && group && group.showStatus === "N")
            ||
            (power && !power.allowMGLive && group && !group.communityId)
        ) {
            return null;
        }

        return (
            <div>
                <div className={["new-group", (group && !group.communityId) ? 'no-community' : null].join(' ')}>
                    <div className="header flex flex-row jc-between flex-vcenter">
                        <div className="text">{this.props.title ? (this.props.title.length > 0 ? this.props.title : "我的社群") : "我的社群"}</div>
                    </div>

                    {group && !group.communityId && (
                        <div className="empty-box">
                            <p>你还没有开启直播间社群哦!</p>
                            <button className="open-btn" onClick={onClickOpenGroup}>开启直播间社群</button>
                        </div>
                    )} 

                    {group && group.communityId && (
                        <GroupItem
                            onClick={() => {
                                this.props.onClickGroup &&
                                    this.props.onClickGroup(group);
                            }}
                            title={group.communityName}
                            showStatus={group.showStatus}
                            createTime={group.createTime}
                            invitedGroupMemberTotal={group.invitedGroupMemberTotal}
                            isShowCreateTime={this.props.isShowCreateTime}
                            isShowJoinNum={this.props.isShowJoinNum}
                            openBottomMenu={this.props.openBottomMenu}
                            power={this.props.power}
                        />
                    )}
                </div>
            </div>
        );
    }
}

MiniGroupList.propTypes = {};

export default MiniGroupList;
