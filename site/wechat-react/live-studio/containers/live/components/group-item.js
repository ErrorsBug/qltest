import React, { Component } from "react";
import Picture from "ql-react-picture";
import dayjs from "dayjs";
import { locationTo, digitFormat } from "components/util";

class GroupItem extends Component {
    render() {
        return (
            <div
                className="live-group-item flex flex-row jc-between on-log on-visible"
                data-log-region="groupDetails"
                onClick={this.props.onClick}
            >
                <div className="logo-con flex-no-shrink">
                    <div className="logo">
                        <div className="c-abs-pic-wrap">
                            <Picture
                                src={
                                    "https://img.qlchat.com/qlLive/activity/image/HBDUBYOK-N8EV-NPCK-1569724192856-LNZMRYU3EUWA.png?x-oss-process=image/resize,m_fill,limit_0,w_220,h_138"
                                }
                                placeholder={true}
                                resize={{ w: "220", h: "138" }}
                            />
                        </div>
                    </div>
                </div>
                <div className="main-con flex-grow-1 flex flex-col jc-between">
                    <div className="group-name elli-text flex-grow-1">
                        {this.props.title}
                    </div>

                    <div className="last-con flex flex-row flex-vcenter jc-between">
                        <div className="charge flex flex-row flex-vcenter">
                            {this.props.power &&
                                this.props.power.allowMGLive &&
                                (this.props.showStatus === "Y"
                                    ? "已开启"
                                    : "已关闭")}
                        </div>
                        {this.props.power && this.props.power.allowMGLive && (
                            <div
                                className="icon-menu on-log on-visible"
                                data-log-region="groupOption"
                                onClick={this.props.openBottomMenu}
                            />
                        )}
                    </div>
                    <div className="group-time flex flex-row flex-vcenter jc-between">
                        <div className="flex flex-row flex-vcenter">
                            {this.props.isShowCreateTime === "Y" &&
                                this.props.createTime &&
                                dayjs(this.props.createTime).format(
                                    "YYYY-MM-DD HH:mm"
                                )}
                        </div>
                        {this.props.isShowJoinNum === "Y" && (
                            <span className="learning-num">{this.props.invitedGroupMemberTotal || '0'}人已加入</span>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

GroupItem.propTypes = {};

export default GroupItem;
