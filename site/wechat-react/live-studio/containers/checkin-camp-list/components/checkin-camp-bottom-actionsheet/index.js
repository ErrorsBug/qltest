import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { locationTo } from 'components/util';

import { BottomDialog, Confirm } from 'components/dialog';

import { switchCheckinCampStatus, deleteCheckinCamp } from '../../../../actions/live-studio';

import WinSelectTag from '../../../../components/win-select-tag';

@autobind
class CheckinCampBottomActionSheet extends Component {
    async onItemClick(tag) {
        switch (tag) {
            case 'hide':
                window.simpleDialog({
                    // msg: '隐藏后，听众在您的直播间主页将无法看到该训练营的信息',
	                title: '确定隐藏课程吗?',
	                msg: `<p>课程在直播间首页隐藏，报名过的学员在<span style="color: #F73657;">已购课程页</span>依旧可见。你可在<span style="color: #F73657;">【直播间后台-权限管理-回收站】</span>中恢复课程</p>`,
	                onConfirm: () => {
                        this.switchDisplayStatus('N')
                        typeof _qla != 'undefined' && _qla('click', {
                            region:'live-confirm-hidden',
                        });
                    }
                });
                break;
            case 'show':
                this.switchDisplayStatus('Y');
                break;
            case 'edit':
                locationTo(`/wechat/page/check-in-camp/edit-camp/${this.props.activeCamp.campId}/${this.props.liveId}`);
                break;
            case 'delete':
                // 如果已经有学员报名，则打卡训练营不能删除
                if (this.props.activeCamp.authNum) {
                    window.toast('已有报名学员，不可删除，只能隐藏');
                    return;
                } else {
                    window.simpleDialog({
                        title: '删除打卡训练营',
                        msg: '确定删除该打卡训练营？',
                        onConfirm: async () => {
                            this.props.hideActionSheet();
                            const campId = this.props.activeCamp.campId;
                            const result = await this.props.deleteCheckinCamp({campId});
                            if (result.state.code == 0) {
                                this.props.onCampDelete();
                            }
                            window.toast(result.state.msg);
                        }
                    });
                }
                break;

            case "change-type":
                this.refWinSelectTag && this.refWinSelectTag.show();
                break;
            default:
                break;
        }
    }

    /**
     * 显示或隐藏打卡训练营
     * @param {*string} status 'Y' or 'N'
     */
    async switchDisplayStatus(status) {
        const {activeCamp: {campId}} = this.props;
        const result = await this.props.switchCheckinCampStatus({campId, displayStatus: status});
        if (result.state.code == 0) {
            this.props.hideActionSheet();
            this.props.onCampDisplayChange(status);
        }
        window.toast(result.state.msg);
    }

    onChangeComplete(resultTopic) {
        this.props.refresh && this.props.refresh(this.actionTag);
        this.closeBottomMenu();

        this.props.updateCheckinCamp && this.props.updateCheckinCamp(resultTopic);
    }
    onChangeTag(tagId) {
        this.refWinSelectTag && this.refWinSelectTag.hide();
        this.props.hideActionSheet();
        this.props.onChangeTag && this.props.onChangeTag(tagId);
    }


    closeBottomMenu() {
        this.props.hideActionSheet();
    }

    render() {
        const {activeCamp, show, hideActionSheet, index, notShowPoint} = this.props;
        const allowDisPlay = activeCamp.displayStatus === 'Y';
        const listItems = [
            {
                key: 'hide',
                content: '隐藏',
                show: allowDisPlay,
                region: 'checkin-camp-list-option-hide',
                pos: index
            },
            {
                key: 'show',
                content: '取消隐藏',
                show: !allowDisPlay,
                region: 'checkin-camp-list-option-hide',
                pos: index
            },
            {
                key: 'edit',
                content: '编辑',
                show: true,
                region: 'checkin-camp-list-option-edit',
                pos: index
            },
            {
                key: 'change-type',
                content: '打卡分类',
                show: true,
                region: 'series-lessons-list-option-categorize',
                pos: index
            },
            {
                key: 'delete',
                content: `<span class="${activeCamp.authNum && 'disabled-action'}">删除<span class="color-danger">（不可恢复）</span></span>`,
                show: true,
                region: 'checkin-camp-list-option-delete',
                pos: index
            },
        ]
        

        return (
            <div className='action-sheet-container'>
                <BottomDialog
                    show={show}
                    theme="list"
                    items={listItems}
                    className="live-course-operate"
                    title={'打卡训练营 ' + activeCamp.name}
                    // titleLabel={"打卡训练营"}
                    close={true}
                    onClose={hideActionSheet}
                    notShowPoint={notShowPoint}
                    onItemClick={this.onItemClick}
                />
                <WinSelectTag
                    ref={r => this.refWinSelectTag = r}
                    title="话题分类"
                    liveId={this.props.liveId}
                    businessType="liveCamp"
                    tagId={this.props.activeCamp && this.props.activeCamp.tagId}
                    businessId={this.props.activeCamp.campId}
                    business={this.props.activeCamp}
                    onChange={this.onChangeTag}
                    onClickManage={() => locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.props.liveId}&type=liveCamp`)}
                />
            </div>
        );
    }
}

CheckinCampBottomActionSheet.propTypes = {
    // 是否显示
    show: PropTypes.bool.isRequired,
    // 关闭底部弹框
    hideActionSheet: PropTypes.func.isRequired,
    // 当前打卡训练营
    activeCamp: PropTypes.object.isRequired,
    // 删除打卡训练营后的回调
    onCampDelete: PropTypes.func.isRequired,
    // 更改打卡训练营隐藏状态后的回调
    onCampDisplayChange: PropTypes.func.isRequired,
    // 直播间id
    liveId: PropTypes.string.isRequired,
};


const mapStateToProps = (state) => ({

});

const mapActionToProps = {
    switchCheckinCampStatus,
    deleteCheckinCamp,
}

export default connect(mapStateToProps, mapActionToProps)(CheckinCampBottomActionSheet);