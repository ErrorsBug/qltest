import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { locationTo, imgUrlFormat } from 'components/util';

import { BottomDialog, Confirm } from 'components/dialog';
import DialogChannelTagSelector from './dialog-channel-tag-selector';

// actions
import {
    displayChannel,
    deleteChannel,
    updateChannel,
    removeChannel,
} from '../../../actions/live';

@autobind
class ChannelBottomActionSheet extends Component {

    state = {
    }

    async onItemClick(tag) {
        this.actionTag = tag;

        switch (tag) {
            case 'hide':
                window.simpleDialog({
                    // msg: '系列课隐藏后，听众在直播间主页将不能看到该系列课，是否确定隐藏？',
                    title: '确定隐藏课程吗?',
                    msg: `<p>课程在直播间首页隐藏，报名过的学员在<span style="color: #F73657;">已购课程页</span>依旧可见。你可在<span style="color: #F73657;">【直播间后台-权限管理-回收站】</span>中恢复课程</p>`,
                    onConfirm: () => this.switchDisplayChannel('N')
                })
                break;
            case 'show':
                this.switchDisplayChannel('Y')
                break;
            case 'change-type': 
                this.refs.dialogChannelTagSelector.getWrappedInstance().show();
                break;
            case 'sort':
                locationTo(`/wechat/page/channel-sort/${this.props.liveId}`);
                break;
            case 'delete':
                window.simpleDialog({
                    title: '删除系列课',
                    msg: `是否删除此系列课`,
                    onConfirm: async () => {
                        this.props.hideActionSheet();
                        const result = await deleteChannel(this.props.activeChannel.id);

                        window.toast(result.state.msg);
                        if (result.state.code == 0) {
                            this.props.onChannelDelete && this.props.onChannelDelete(this.props.activeChannel.id);
                            this.props.removeChannel && this.props.removeChannel(this.props.activeChannel);
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    // 修改了隐藏状态
    async switchDisplayChannel(display) {
        const { activeChannel: { id }, activeTag } = this.props;
        const result = await displayChannel(id, activeTag, display);
        let tempChannel = {...this.props.activeChannel};

        window.toast(result.state.msg);

        if (result.state.code == 0) {
            this.props.hideActionSheet();
            tempChannel.displayStatus = display;

            this.props.updateChannel && this.props.updateChannel(tempChannel);

            this.props.onChannelDisplayChange && this.props.onChannelDisplayChange(tempChannel);
        }
    }

    // 修改类别完成
    onChangeComplete(tagId) {
        this.props.hideActionSheet();
        this.props.onChannelTagComplete && this.props.onChannelTagComplete(tagId, this.props.activeChannel.id);
        this.refs.dialogChannelTagSelector.getWrappedInstance().hide();
    }

    render() {
        return (
            <div className='action-sheet-container'>
                <BottomDialog
                    show={ this.props.show }
                    theme={ 'list' }
                    items={
                        [
                            {
                                key: 'hide',
                                content: '隐藏系列课',
                                show: this.props.activeChannel && this.props.activeChannel.displayStatus == 'Y',
                            },
                            {
                                key: 'show',
                                content: '取消隐藏系列课',
                                show: this.props.activeChannel && this.props.activeChannel.displayStatus == 'N',
                            },
                            {
                                key: 'change-type',
                                content: '选择系列课分类',
                                show: true,
                            },
                            {
                                key: 'sort',
                                content: '系列课排序',
                                show: true,
                            },
                            {
                                key: 'delete',
                                content: '<span>删除系列课<span class="color-danger">（不可恢复）</span></span>',
                                show: true,
                            },
                        ]
                    }
                    title={this.props.activeChannel && this.props.activeChannel.name}
                    titleLabel={"系列课"}
                    close={ true }
                    onClose={ this.props.hideActionSheet }
                    onItemClick={ this.onItemClick }
                />
                
                <DialogChannelTagSelector
                    ref='dialogChannelTagSelector'
                    channelId={ this.props.activeChannel && this.props.activeChannel.id }
                    liveId={ this.props.liveId }
                    defaultTag={ this.props.activeTag }
                    onChangeComplete={ this.onChangeComplete }
                />
            </div>
        );
    }
}

ChannelBottomActionSheet.propTypes = {
    // 是否显示
    show: PropTypes.bool.isRequired,
    // 关闭底部弹框
    hideActionSheet: PropTypes.func.isRequired,
    // 当前目标话题
    activeChannel: PropTypes.object,
    // 当前的系列课标签
    activeTag: PropTypes.string,
    // 修改对应的系列课
    updateChannel: PropTypes.func,
    // 修改tag完毕
    onChannelTagComplete: PropTypes.func,
    // 移除列表中的系列课
    onChannelDelete: PropTypes.func,
    // 当修改了系列课隐藏状态
    onChannelDisplayChange: PropTypes.func,
    // 直播间id
    liveId: PropTypes.string.isRequired,
};


function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    updateChannel,
    removeChannel,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelBottomActionSheet);