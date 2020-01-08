import React, { Component } from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import { connect } from "react-redux";

import { locationTo, imgUrlFormat } from "components/util";

import { BottomDialog, Confirm } from "components/dialog";

// actions
import {} from "../../../actions/live";
import WinSelectTag from "../../../components/win-select-tag";
import { modal } from "components/indep-render";

@autobind
class GroupBottomActionSheet extends Component {
    state = {};

    onItemClick = async tag => {
        this.actionTag = tag;
        switch (tag) {
            case "hide":
                break;
            case "show":
                // this.switchDisplayChannel('Y')
                break;
            case "open":
                this.props.toggleShowStatus && this.props.toggleShowStatus();
                break;
            case "close":
                this.props.toggleShowStatus && this.props.toggleShowStatus();
                break;
            default:
                break;
        }
    };

    // 修改了隐藏状态
    async switchDisplayChannel(display) {}

    getItems(index) {
        if (this.props.communityInfo) {
            if (this.props.communityInfo.showStatus !== "Y") {
                return [{
                    key: "open",
                    content: "开启直播间社群",
                    show: true,
                    region: "series-lessons-list-option-hide",
                    pos: index
                }];
            } else {
                return [{
                    key: "close",
                    content: "关闭直播间社群",
                    show: true,
                    region: "series-lessons-list-option-hide",
                    pos: index
                }];
            }
        }
        return null;
    }

    render() {
        let index = this.props.index;
        return (
            <div className="action-sheet-container">
                <BottomDialog
                    show={this.props.show}
                    theme={"list"}
                    items={this.getItems(index)}
                    className="live-group-operate"
                    // title={'社群 ' + (this.props.activeChannel && this.props.activeChannel.name || '') }
                    // titleLabel={"系列课"}
                    close={true}
                    onClose={this.props.hideActionSheet}
                    onItemClick={this.onItemClick}
                />
            </div>
        );
    }
}

GroupBottomActionSheet.propTypes = {};

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(GroupBottomActionSheet);
