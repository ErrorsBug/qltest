import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import { campCheckInListModel,campUserInfoModel } from '../../../../model/';
import { requestCheckInHeadList } from '../../../../model/camp-user-list/actions';
import CommentInput from '../comment-input';

const { 
    requestDeleteCheckInNews, 
    requestUnthumbCheckInNews, 
    requestThumbUpCheckInNews,
    requestCommentCheckInNews,
} = campCheckInListModel;

const { setCampUserInfo } = campUserInfoModel;

@autobind
export class AffairOperation extends Component {
    static propTypes = {
        isThumbUp: PropTypes.string,
        affairCount: PropTypes.number,
        createBy: PropTypes.string,
        allowMGLive: PropTypes.bool,
        userId: PropTypes.string,
        affairId: PropTypes.number,
        nickName: PropTypes.string,
        liveId: PropTypes.string,
    }

    state = {
        isShowComment: false,
    }

    handleDeleteCheckInNews() {
        const { allowMGLive } = this.props;
        const text = allowMGLive ? '该操作不可逆，确认后，该学员今日打卡数据清空' : '删除后，你今日的打卡失效，需重新发布';
        window.simpleDialog({
            title: '确认删除该打卡动态？',
            msg: text,
            onConfirm: this.onDeleteNewConfirm
        })
    }

    onDeleteNewConfirm() {
        requestDeleteCheckInNews({
            liveId: this.props.liveId,
            affairId: this.props.affairId,
            campId: this.props.campId,
        });
        if (this.props.createBy === this.props.userId) {
            // console.log(1);
            setCampUserInfo({affairStatus: 'N'})
        }
        requestCheckInHeadList({campId: this.props.campId});
    }

    handleThump() {
        const { isThumbUp, affairId, nickName } = this.props;
        // console.log(nickName)
        if (isThumbUp === 'Y') {
            requestUnthumbCheckInNews({ affairId, nickName });
        } else {
            requestThumbUpCheckInNews({ affairId, nickName })
        }
    }

    handleComment() {
        this.setState({ isShowComment: true})
    }

    onInputBlur() {
        this.setState({ isShowComment: false })
    }

    render() {
        return (
            <div className="affair-operation-container">
                <div className="left">
                    <div className="affair-count">已打卡{this.props.affairCount}天</div>
                    
                </div>
                <div className="right">
                {
                    this.props.allowMGLive || this.props.userId == this.props.createBy ?
                    <div className="delete icon" onClick={this.handleDeleteCheckInNews}></div> :
                    null
                }
                    <div className="comment icon" onClick={this.handleComment}></div>
                    <div className={`icon ${this.props.isThumbUp === 'Y' ? 'thumb-up' : "thumb"}`} onClick={this.handleThump}></div>
                </div>
                <CommentInput 
                    isShow={this.state.isShowComment}
                    onBlur={this.onInputBlur}
                    affairId={this.props.affairId}
                    placeholder="发表评论"
                    liveId={this.props.liveId}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    allowMGLive: getVal(state, 'campAuthInfo.allowMGLive', false),
    userId: getVal(state, 'campUserInfo.userId'),
    liveId:  getVal(state, 'campBasicInfo.liveId'),
    campId: getVal(state, 'campBasicInfo.campId'),
    nickName: getVal(state, 'campUserInfo.nickName')
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(AffairOperation)
