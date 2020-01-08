import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import { locationTo } from 'components/util';

import { BottomDialog, Confirm } from 'components/dialog';

import { switchTrainingStatus, deleteTraining } from '../../../../actions/live-studio'
import WinSelectTag from '../../../../components/win-select-tag';
import { modal } from 'components/indep-render';


@autobind
class CheckinCampBottomActionSheet extends Component {
    async onItemClick(tag) {
        switch (tag) {
            case 'hide':
                modal({
                    className: 'common-confirm',
					title: '确定隐藏课程吗?',
                    buttons: 'cancel-confirm',
                    children: <p>课程在直播间首页隐藏，报名过的学员在<span style={{color: "#F73657"}}>已购课程页</span>依旧可见。你可在<span style={{color: "#F73657"}}>【直播间后台-权限管理-回收站】</span>中恢复课程</p>,
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
            case 'delete':
                // 如果已经有学员报名，则打卡训练营不能删除
                if (this.props.activeCamp.authNum) {
                    window.toast('已有报名学员，不可删除，只能隐藏');
                    return;
                } else {
                    modal({
                        className: 'common-confirm',
                        buttons: 'cancel-confirm',
                        title: '删除训练营',
                        children: '确定删除该训练营？',
                        onConfirm: async () => {
                            this.props.hideActionSheet();
                            const { id, liveId } = this.props.activeCamp;
                            const result = await this.props.deleteTraining({id, liveId});
                            if (result.state.code == 0) {
                                this.props.onCampDelete();
                            }
                            window.toast(result.state.msg);
                        }
                    });
                }
                break;
            case 'select-tag':
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
        const {activeCamp: {id, liveId}} = this.props;

        const result = await this.props.switchTrainingStatus({id, status, liveId});
        if (result.state.code == 0) {
            this.props.hideActionSheet();
            this.props.onCampDisplayChange(status);
        }
        window.toast(result.state.msg);
    }

    onChangeTag = tagId => {
        this.refWinSelectTag && this.refWinSelectTag.hide();
        this.props.hideActionSheet();
        this.props.onChangeTag && this.props.onChangeTag(tagId);
    }

    render() {
        const {activeCamp, show, hideActionSheet, index, notShowPoint} = this.props;
        const allowDisPlay = activeCamp.status === 'Y';
        const listItems = [
            {
                key: 'hide',
                content: '隐藏训练营',
                show: allowDisPlay,
                region: 'checkin-camp-list-option-hide',
                pos: index
            },
            {
                key: 'show',
                content: '取消隐藏训练营',
                show: !allowDisPlay,
                region: 'checkin-camp-list-option-hide',
                pos: index
            },
            {
                key: 'select-tag',
                content: '训练营分类',
                show: true,
                region: 'checkin-camp-list-option-select-tag',
                pos: index
            },
            {
                key: 'delete',
                content: `<span class="${activeCamp.authNum && 'disabled-action'}">删除训练营<span class="color-danger">（不可恢复）</span></span>`,
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
                    title={'训练营 ' + activeCamp.name}
                    // titleLabel={"训练营"}
                    close={true}
                    onClose={hideActionSheet}
                    notShowPoint={notShowPoint}
                    onItemClick={this.onItemClick}
                />

                <WinSelectTag
                    ref={r => this.refWinSelectTag = r}
                    title="训练营分类"
                    liveId={this.props.liveId}
                    businessType="camp"
                    tagId={this.props.activeCamp && this.props.activeCamp.tagId}
                    business={this.props.activeCamp}
                    onChange={this.onChangeTag}
                    onClickManage={() => locationTo(`/wechat/page/live-studio/tag-manage?liveId=${this.props.liveId}&type=camp`)}
                    region="train-page"
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
    liveId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
};


const mapStateToProps = (state) => ({

});

const mapActionToProps = {
    switchTrainingStatus,
    deleteTraining,
}

export default connect(mapStateToProps, mapActionToProps)(CheckinCampBottomActionSheet);1