import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { locationTo, imgUrlFormat } from 'components/util';

import { BottomDialog, Confirm } from 'components/dialog';
import PushTopicDialog from 'components/dialogs-colorful/push-dialogs/topic';
import DialogMoveToChannel from './dialog-move-to-channel';
import DialogTopicTypeChange from './dialog-topic-type-change';
import WinSelectTag from '../../../components/win-select-tag';

// actions
import {
    finishTopic,
    deleteTopic,
    updateTopic,
    removeTopic,
    // getPushNum,
    hideTopic,
} from '../../../actions/live';

@autobind
class TopicBottomActionSheet extends Component {

    state = {
        showPushTopicDialog: false
    }

    async componentDidMount() {
    }

    

    async onTopicHidden(type) {
        let result = null;

        if (type == 'hide') {
            result = await this.props.hideTopic(this.props.activeTopic.id, 'N')
        } else if (type == 'show') {
            result = await this.props.hideTopic(this.props.activeTopic.id, 'Y')
        }
        
        if (result.state.code == 0) {
            window.toast('操作成功')
            this.props.onChangeTopicHidden(type == 'hide' ? 'N' : 'Y');
        } else {
            window.toast(result.state.msg);
        }
    }

    onItemClick(tag) {
        this.actionTag = tag;

        switch (tag) {
            case 'push':
                locationTo(`/wechat/page/live-push-message?topicId=${this.props.activeTopic.id}`)
                break;
            
            case 'hide':
                window.simpleDialog({
                    // msg: '课程隐藏后，听众在直播间主页将不能看到该课程，是否确定隐藏？',
	                title: '确定隐藏课程吗?',
	                msg: `<p class="live-dialog">课程在直播间首页隐藏，报名过的学员在<span style="color: #F73657;">已购课程页</span>依旧可见。你可在<span style="color: #F73657;">【直播间后台-权限管理-回收站】</span>中恢复课程</p>`,
	                onConfirm: () => { 
                        this.onTopicHidden('hide');
                        typeof _qla != 'undefined' && _qla('click', {
                            region:'live-confirm-hidden',
                        });
                    }
                });
                break;
            case 'sort':
                locationTo(`/wechat/page/topics-sort/${this.props.liveId}`);
                break;
            case 'show':
                this.onTopicHidden('show')
                break;

            case 'move':
                this.refs.dialogMoveToChannel.getWrappedInstance().show();
                break;

            case 'relay':
                locationTo(`/relay/setup.htm?topicId=${this.props.activeTopic.id}`)
                break;
            case 'change-type': 
                this.refWinSelectTag && this.refWinSelectTag.show();
                break;
            case 'finish':
                window.simpleDialog({
                    title: '结束直播',
                    msg: `<div class='finish-dialog-wrap'>
                        1.结束直播后，讲师嘉宾将不能继续发言。<br/>
                        2.结束本次直播，用户将从头开始回顾。<br/>
                        3.若在话题开播前结束直播，将导致该话题门票收益无法提现。
                        </div>`,
                    onConfirm: async () => {
                        this.closeBottomMenu();
                        const result = await this.props.finishTopic(this.props.activeTopic.id);

                        window.toast(result.state.msg);
                        this.props.refresh && this.props.refresh(this.actionTag);

                        let tempItem = {...this.props.activeTopic};
                        tempItem.status = 'ended';
                        this.props.updateTopic(tempItem);
                    }
                });
                break;

            case 'delete':
                if (this.props.activeTopic.authNum > 0) {
                    window.simpleDialog({
                        msg: '该话题已有报名记录，仅可隐藏，不能删除',
                        buttons: 'cancel',
                        cancelText: '我知道了',
                        onCancel: () => null
                    })

                    return;
                }
                window.simpleDialog({
                    title: '删除话题',
                    msg: `<div class='finish-dialog-wrap'>
                        1.删除后话题将不能恢复。<br/>
                        2.话题中若有待结算金额，将无法提现。<br/>
                    </div>`,
                    onConfirm: async () => {
                        this.closeBottomMenu();
                        const result = await this.props.deleteTopic(this.props.activeTopic.id);

                        window.toast(result.state.msg);
                        this.props.refresh && this.props.refresh(this.actionTag);

                        this.props.removeTopic(this.props.activeTopic);
                    }
                });
                break;

            case 'change':
                if (this.props.activeTopic && this.props.activeTopic.status !== 'ended') {
                    window.toast('直播结束后才能切换直播类型');
                    return;
                }

                this.refs.dialogTopicTypeChange.show();

                break;

            default:
                break;
        }
    }

    onChangeComplete(resultTopic) {
        this.props.refresh && this.props.refresh(this.actionTag);
        this.closeBottomMenu();

        this.props.updateTopic(resultTopic);
    }

    onChangeTag(tagId) {
        this.refWinSelectTag && this.refWinSelectTag.hide();
        this.props.hideActionSheet();
        this.props.onChangeTag && this.props.onChangeTag(tagId);
    }

    onMoveComplete() {
        this.props.refresh && this.props.refresh(this.actionTag);
        this.closeBottomMenu();

        this.props.removeTopic(this.props.activeTopic);
    }

    closeBottomMenu() {
        this.props.hideActionSheet();
    }

    //关闭推送直播弹框
    hidePushTopicDialog() {
        this.setState({
            showPushTopicDialog: false,
        });
    }

    render() {
        let { index } = this.props
        return (
            <div className='action-sheet-container'>
                <BottomDialog
                    show={ this.props.show }
                    theme={ 'list' }
                    items={
                        [
                        {
                                key: 'push',
                                content: '推送通知',
                                show: true,
                                region: 'single-lessons-list-option-inform',
                                pos: index
                        },
                        {
                                key: 'hide',
                                content: '隐藏本单课',
                                show: this.props.activeTopic.displayStatus == 'Y',
                                region: 'single-lessons-list-option-hide',
                                pos: index
                        },
                        {
                                key: 'sort',
                                content: '单课排序',
                                show: true,
                                region: 'single-lessons-list-option-sort',
                                pos: index
                        },
                        {
                                key: 'show',
                                content: '取消隐藏本单课',
                                show: this.props.activeTopic.displayStatus == 'N',
                                region: 'single-lessons-list-option-hide',
                                pos: index
                        },
                        {
                            key: 'change-type',
                            content: '话题分类',
                            show: true,
                            region: 'series-lessons-list-option-categorize',
                            pos: index
                        },
                        {
                                key: 'move',
                                content: '移动到系列课',
                                show: true,
                                region: 'single-lessons-list-option-move',
                                pos: index
                        },
                        {
                                key: 'change',
                                content: '切换直播类型',
                                show: this.props.activeTopic && (this.props.activeTopic.type === 'public' || this.props.activeTopic.type === 'encrypt'),
                                region: 'single-lessons-list-option-change',
                                pos: index
                        },
                        {
                                key: 'relay',
                                content: '设置转播',
                                show: /^(normal|ppt)$/.test(this.props.activeTopic.style),
                                region: 'single-lessons-list-option-relay',
                                pos: index
                        },
                        {
                                key: 'finish',
                                content: '结束直播',
                                show: this.props.activeTopic && this.props.activeTopic.status === 'beginning',
                                theme: 'danger',
                                region: 'single-lessons-list-option-end',
                                pos: index
                        },
                        {
                                key: 'delete',
                                content: `<span>删除直播<span class="color-danger">（不可恢复）</span></span>`,
                                show: this.props.activeTopic && this.props.activeTopic.status === 'ended',
                                region: 'single-lessons-list-option-delete',
                                pos: index
                        },
                        ]
                    }
                    className="live-course-operate"
                    title={'单课 ' + (this.props.activeTopic && this.props.activeTopic.topic || '')}
                    // titleLabel={"单课"}
                    close={ true }
                    onClose={ this.closeBottomMenu }
                    onItemClick={ this.onItemClick }
                />

                <PushTopicDialog
                    topicId={ this.props.activeTopic && this.props.activeTopic.id }
                    liveId={ this.props.liveId }
                    isShow={this.state.showPushTopicDialog}
                    hide={this.hidePushTopicDialog}
                />

                <DialogMoveToChannel
                    ref='dialogMoveToChannel'
                    liveId={ this.props.liveId }
                    topicId={ this.props.activeTopic && this.props.activeTopic.id }
                    onMoveComplete={ this.onMoveComplete }
                />

                <DialogTopicTypeChange
                    ref='dialogTopicTypeChange'
                    liveId={ this.props.liveId }
                    topicId={ this.props.activeTopic && this.props.activeTopic.id }
                    onChangeComplete={ this.onChangeComplete }
                />
                <WinSelectTag
                    ref={r => this.refWinSelectTag = r}
                    title="话题分类"
                    liveId={this.props.liveId}
                    businessType="topic"
                    tagId={this.props.activeTopic && this.props.activeTopic.tagId}
                    business={this.props.activeTopic}
                    onChange={this.onChangeTag}
                    onClickManage={() => locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.props.liveId}&type=topic`)}
                />
                
            </div>
        );
    }
}

TopicBottomActionSheet.propTypes = {
    // 是否显示
    show: PropTypes.bool.isRequired,
    // 关闭底部弹框
    hideActionSheet: PropTypes.func.isRequired,
    // 当前目标话题
    activeTopic: PropTypes.object,
    // 刷新列表
    refresh: PropTypes.func,
    // // 推送次数
    // pushNum: PropTypes.number,
    // 显示、隐藏课程成功回调
    onChangeTopicHidden: PropTypes.func,
};

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    finishTopic,
    deleteTopic,
    updateTopic,
    removeTopic,
    // getPushNum,
    hideTopic,
}

module.exports = connect(mapStateToProps, mapActionToProps)(TopicBottomActionSheet);
