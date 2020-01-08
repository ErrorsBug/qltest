import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import Switch from "components/switch";
import {
    getAttendRemindSetting,
    setAttendRemindSetting,
} from "../../actions/attend-remind";
import {
    userBindKaifang
} from "../../actions/common";

class PageContainer extends Component {
    state = {};

    get kfInfo() {
        if (
            this.props.location.query.kfAppId &&
            this.props.location.query.kfOpenId
        ) {
            return {
                kfAppId: this.props.location.query.kfAppId,
                kfOpenId: this.props.location.query.kfOpenId
            };
        } else {
            return;
        }
    }

    componentDidMount() {
        this.props.getAttendRemindSetting();
        if(this.kfInfo) {
            this.props.userBindKaifang(this.kfInfo);
        }
    }

    onSwitchAttendRemind = async () => {
        const openStatus = this.props.openStatus === "Y" ? "N" : "Y";
        await this.props.setAttendRemindSetting(openStatus);
        this.props.getAttendRemindSetting();
    };

    render() {
        const { openStatus } = this.props;
        return (
            <Page title="设置打卡" className="p-point-remind">
                <div className="content">
                    <div className="header-img-wrap">
                        <img src={require("./img/header.jpg")} alt="" />
                    </div>
                </div>
                <div className="op-list-wrap">
                    <ul className="op-list">
                        <li className="op-item">
                            <span className="desc">开启打卡提醒</span>
                            <Switch
                                active={openStatus === "Y"}
                                size="md"
                                onChange={this.onSwitchAttendRemind}
                            />
                        </li>
                        <li className="op-item">
                            <p>
                                小千每天上午在公众号推送消息，督促你学习已报名的课程，并且为你推荐每日精选的免费内容，
                            </p>
                        </li>
                    </ul>
                </div>
            </Page>
        );
    }
}

const mapStateToProps = state => {
    return {
        openStatus: state.attendRemind.openStatus
    };
};

const mapDispatchToProps = {
    getAttendRemindSetting,
    setAttendRemindSetting,
    userBindKaifang
};

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(PageContainer);
