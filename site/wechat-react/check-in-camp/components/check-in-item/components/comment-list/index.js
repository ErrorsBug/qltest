import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal, htmlTransferGlobal } from 'components/util';
import { autobind } from 'core-decorators';
import CommentItem from '../comment-item';
import CommentInput from '../comment-input';
import { campCheckInListModel } from '../../../../model/';
import BottomDialog from '../../../dialog/bottom-dialog';
import AudioItem from '../../../audio-item';


const { 
    requestDeleteCommentCheckInNews, 
    requestCheckInNewsCommentList
} = campCheckInListModel
@autobind
export class CommentList extends Component {
    static propTypes = {
       
    }

    state = {
        isShowComment: false,
        showBottomDialog: false,
        parentUserId: '',
        parentUserName: '',
        // 默认不展开
        expandCommentList: false,    
    }

    onCommentItemClick(commentUserId, commentUserName, commentId) {

        const { userId, allowMGLive } = this.props
        if (userId === commentUserId || allowMGLive) {
            this.setState({
                parentUserId: commentUserId,
                parentUserName: commentUserName,
                showBottomDialog: true,
                commentId
            })
        } else {
            this.setState({
                parentUserId: commentUserId,
                parentUserName: commentUserName,
                isShowComment: true,
                commentId
            });
        }


    }

    onInputBlur() {
        this.setState({ isShowComment: false })
    }

    showDeleteConfirmDialog() {
        window.simpleDialog({
            title: '确认删除此条评论？',
            msg: '该操作不可逆',
            onConfirm: this.onDeleteConfirm,
        })
    }

    onDeleteConfirm() {
        requestDeleteCommentCheckInNews({
            liveId: this.props.liveId,
            affairId: this.props.affairId,
            commentId: this.state.commentId,
        });
        this.hideBottomDialog();
    }

    showCommentInput() {
        this.setState({
            isShowComment: true,
            showBottomDialog: false,
        })
    }

    hideBottomDialog() {
        this.setState({
            showBottomDialog: false,
        })
    }

    handleExpand() {
        requestCheckInNewsCommentList({affairId: this.props.affairId});
        this.setState({expandCommentList: true});
    }

    handlePickup() {
        this.setState({expandCommentList: false});
    }

    render() {
        // console.log(this.props)
        const { commentList = [], allowMGLive } = this.props;
        const comments = this.state.expandCommentList ? commentList : commentList.slice(0, 5);
        const hasContent = this.props.thumbUpList.length > 0 || comments.length > 0;

        return (
            <div className={`comment-list-container ${hasContent ? 'tri-icon' : ''}`}>
                {
                    this.props.thumbUpList && this.props.thumbUpList.length > 0 ? 
                    <div className={`thumb-list ${comments && comments.length > 0 ? 'thumb-list-border' : ''}`}>
                        <span className="thumb-ed"></span>
                        <span className="thumb-name-list">
                        {
                            this.props.thumbUpList.map((item, idx) => <span key={idx} className="thumb-name-item">{ item.userName + `${this.props.thumbUpList.length == idx + 1  ? '' : '，'}`}</span>)
                        }
                        </span>
                    </div> :
                    null
                }
                {
                    comments && comments.length > 0 ?
                    <div className="comment-list">                
                    {
                        comments.map(comment => {
                            const { commentUserName, parentUserName, commentId, content, commentUserId, contentType, audioId, duration } = comment;
                            return (
                                <div className="comment-item" key={commentId}  onClick={() => this.onCommentItemClick(commentUserId, commentUserName, commentId)}>
                                    <span className={`comment-name ${contentType ==='audio'?'audio-user':''}`}>
                                        {
                                            parentUserName ? 
                                            <span><b>{commentUserName}{ false ? "(老师) " : "" }</b>回复<b>{parentUserName}</b>：</span> :
                                            <span>{commentUserName}{ false ? "(老师)" : "" }：</span>
                                        }
                                    </span>
                                    {
                                        contentType ==='audio'?
                                        <div className="audio-box" onClick={e=>e.stopPropagation()}>
                                            <AudioItem 
                                            src={content}  
                                            audioLength={duration}
                                            /> 
                                        </div>
                                        :
                                        <span className="comment-content" ><code>{htmlTransferGlobal(content)}</code></span>
                                    }
                                </div>
                            )
                        })
                    }
                    </div> :
                    null
                } 
                {
                    this.props.commentList.length >=5 && !this.state.expandCommentList ?
                    <div className="btn-load load-more-comment" onClick={this.handleExpand}>展开全部<span className="icon_down"></span></div> :
                    null
                }
                {
                    this.props.commentList.length >=5 && this.state.expandCommentList ?
                    <div className="btn-load no-more" onClick={this.handlePickup}>收起<span className="icon_up"></span></div> :
                    null
                }
                <CommentInput 
                    isShow={this.state.isShowComment}
                    onBlur={this.onInputBlur}
                    parentUserId={this.state.parentUserId}
                    affairId={this.props.affairId}
                    placeholder={`回复${this.state.parentUserName}`}
                    liveId={this.props.liveId}
                />
                <BottomDialog
                    show={this.state.showBottomDialog}
                    onClose={this.hideBottomDialog}
                    showCloseBtn={true}
                    className="comment-bottomDialog"
                >
                    <div className="check-in-comment-bottomDialog-container">
                        {
                            this.props.allowMGLive && this.props.userId !== this.state.parentUserId ?
                            <div className="base-flex title" onClick={this.showCommentInput}>回复</div> :
                            null
                        }
                        <div className=" base-flex oper delete" onClick={this.showDeleteConfirmDialog}>删除(不可恢复)</div>
                    </div>
                </BottomDialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    allowMGLive: getVal(state, 'campAuthInfo.allowMGLive', false),
    userId: getVal(state, 'campUserInfo.userId'),
    liveId:  getVal(state, 'campBasicInfo.liveId'),
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentList)
