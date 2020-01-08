import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { locationTo, imgUrlFormat } from 'components/util';

import { BottomDialog, Confirm } from 'components/dialog';

// actions
import {
    displayChannel,
    deleteChannel,
    updateChannel,
    removeChannel,
} from '../../../actions/live';
import WinSelectTag from '../../../components/win-select-tag';
import { modal } from 'components/indep-render';


@autobind
class ChannelBottomActionSheet extends Component {

    state = {
    }

    onItemClick = async (tag) => {
        this.actionTag = tag;

        switch (tag) {
            case 'hide':
                modal({
                    className: 'common-confirm',
					title: '确定隐藏课程吗?',
                    buttons: 'cancel-confirm',
                    children: <p className="live-dialog">课程在直播间首页隐藏，报名过的学员在<span style={{color: "#F73657"}}>已购课程页</span>依旧可见。你可在<span style={{color: "#F73657"}}>【直播间后台-权限管理-回收站】</span>中恢复课程</p>,
                    onConfirm: () => {
                        this.switchDisplayChannel('N')
                        typeof _qla != 'undefined' && _qla('click', {
                            region:'live-confirm-hidden',
                        });
                    }
                });
                break;
            case 'show':
                this.switchDisplayChannel('Y')
                break;
            case 'change-type': 
                this.refWinSelectTag && this.refWinSelectTag.show();
                break;
            case 'sort':
                locationTo(`/wechat/page/channel-sort/${this.props.liveId}`);
                break;
            case 'delete':
                modal({
                    className: 'common-confirm',
                    buttons: 'cancel-confirm',
                    title: '删除系列课',
                    children: '是否删除此系列课',
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
        let tempChannel = {...this.props.activeChannel};
        if (display === 'N') {
            tempChannel.tagId = 0;
        }
        const result = await displayChannel(id, tempChannel.tagId || activeTag, display);

        window.toast(result.state.msg);

        if (result.state.code == 0) {
            this.props.hideActionSheet();
            tempChannel.displayStatus = display;

            this.props.updateChannel && this.props.updateChannel(tempChannel);

            this.props.onChannelDisplayChange && this.props.onChannelDisplayChange(tempChannel);

            // 因为旧有的逻辑里，不同位置的引用回调不同的方法，我这里只是做迁移、统一
            this.props.onCourseDisplayChange && this.props.onCourseDisplayChange(display);
        }
    }

    // 修改类别完成
    onChangeComplete(tagId) {
        this.props.updateChannel({
            id: this.props.activeChannel.id,
            tagId
        })
        this.refWinSelectTag && this.refWinSelectTag.hide();
        this.props.hideActionSheet();
        this.props.onChangeTag && this.props.onChangeTag(tagId);
    }

    render() {
        let index = this.props.index
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
                                region: 'series-lessons-list-option-hide',
                                pos: index
                            },
                            {
                                key: 'show',
                                content: '取消隐藏系列课',
                                show: this.props.activeChannel && this.props.activeChannel.displayStatus == 'N',
                                region: 'series-lessons-list-option-hide',
                                pos: index
                            },
                            {
                                key: 'change-type',
                                content: '系列课分类',
                                show: true,
                                region: 'series-lessons-list-option-categorize',
                                pos: index
                            },
                            {
                                key: 'sort',
                                content: '系列课排序',
                                show: true,
                                region: 'series-lessons-list-option-sort',
                                pos: index
                            },
                            {
                                key: 'delete',
                                content: '<span>删除系列课<span class="color-danger">（不可恢复）</span></span>',
                                show: true,
                                region: 'series-lessons-list-option-delete',
                                pos: index
                            },
                        ]
                    }
                    className="live-course-operate"
                    title={'系列课 ' + (this.props.activeChannel && this.props.activeChannel.name || '') }
                    // titleLabel={"系列课"}
                    close={ true }
                    onClose={ this.props.hideActionSheet }
                    onItemClick={ this.onItemClick }
                />

                <WinSelectTag
                    ref={r => this.refWinSelectTag = r}
                    title="系列课分类"
                    liveId={this.props.liveId}
                    businessType="channel"
                    tagId={this.props.activeChannel && this.props.activeChannel.tagId}
                    business={this.props.activeChannel}
                    onChange={this.onChangeComplete}
                    onClickManage={() => locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.props.liveId}&type=channel`)}
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
    //埋点pros
    index: PropTypes.number
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