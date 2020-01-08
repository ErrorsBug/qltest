import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind, debounce, throttle } from 'core-decorators';
import LazyImage from '../../lazy-image';
import { imgUrlFormat, timeBefore } from 'components/util';

@autobind
class CommentListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showManagement: false,
        }
    }

    componentDidMount(){
        // 监听点击事件以关闭展开的评论菜单项
        window.addEventListener('click', e => {
            const { id } = this.props;
            const { showManagement } = this.state;
            const target = document.querySelector(`.control-btn[data-id='${id}']`);
            const isOtherTarget = target && !target.contains(e.target)
            isOtherTarget && showManagement && this.setState({
                showManagement: false
            })
        }, true);
    }

    dangerHtml(content){
        if (content) {
            content = content.replace(/\</g, (m) => "&lt;");
            content = content.replace(/\>/g, (m) => "&gt;");
            content = content.replace(/&lt;br\/&gt;/g, (m) => "<br/>");
        }

        return { __html: content }
    };

    triggerManageBox(e) {
        e.stopPropagation();
        this.setState({
            showManagement: !this.state.showManagement,
        });
    }

    closeManageBox(e) {
        if (e.currentTarget.className === 'comment-list-item') {
            this.setState({
                showManagement: false,
            });
        }
    }

    muteUserById(e) {
        e.stopPropagation();
        window.confirmDialog(
            '确定禁言吗？',
            () => {
                this.props.bannedToPost(this.props.commentCreateBy, 'Y', this.props.liveId);
                this.props.deleteComment(this.props.id, this.props.commentCreateBy, this.props.topicId);
            }
        );
        this.setState({
            showManagement: false,
        });
    }

    deleteComment(e) {
        e.stopPropagation();
        window.confirmDialog(
            '确定删除吗？',
            () => {
                this.props.deleteComment(this.props.id, this.props.commentCreateBy, this.props.topicId)
                this.props.deleteBarrageItem(this.props.id);
            }
        );
    }

    addTopicSpeak(e){
        this.props.onFeedback({
            name: this.props.createByName,
            id: this.props.id,
            type: 'replyComment',
            userId: this.props.commentCreateBy
        });
        this.props.showReplyBox();
    }

    replyComment(){
	    this.props.onFeedback({
		    name: this.props.createByName,
		    id: this.props.id,
		    type: 'replyComment',
		    userId: this.props.commentCreateBy,
	    });
	    this.props.focusCommentInput(this.commentItemRef);
    }

    get isTeacher(){
        return ['creater', 'manager', 'guest'].indexOf(this.props.createRole) >= 0;
    }

    get isParentTeacher(){
	    return this.props.parentComment && ['creater', 'manager', 'guest'].indexOf(this.props.parentComment.createRole) >= 0;
    }

    render() {
        const createByHeadImgUrl = this.props.createByHeadImgUrl;
        return (
            <li className="comment-list-item" onClick={this.closeManageBox} ref={r => this.commentItemRef = r}>
                <div className="avatar"><img src={imgUrlFormat(createByHeadImgUrl || 'http://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,h_60,w_60,m_fill')} alt=""/></div>

                <div className="comment-detail">
                    <div className="info">
                        <span className={`elli-text name${this.props.isVip ? ' vip' : ''}`}>
                            {
                                this.isTeacher &&
                                <i>(老师)</i>
                            }
                            { this.props.createByName }
                        </span>
                        {
                            !this.isTeacher &&
                            <div className="top-control-box">
	                            {
		                            (this.props.power.allowSpeak && this.props.topicStatus == 'beginning')?
			                            this.props.isReplay != 'Y'?
                                            <div className="btn-reply-wall" onClick={this.addTopicSpeak}>上墙</div>
				                            :
                                            <div className="btn-reply-wall disable" >已上墙</div>
			                            :null
	                            }
                            </div>
                        }
                    </div>
                    <div className="comment-content">
                       { this.props.isQuestion === 'Y' && <span className="question">问</span> }
                       <span dangerouslySetInnerHTML={this.dangerHtml(this.props.content)} className="content"></span>
                    </div>
                    {
                        !!this.props.parentId &&
                        (
	                        this.props.parentComment && this.props.parentComment.id ?
                            <div className="parent-item">
                                <span className="name">
                                    {
                                        this.isParentTeacher &&
                                        <i>(老师)</i>
                                    }
                                    {this.props.parentComment.createByName}：
                                </span>
                                <span className="text" dangerouslySetInnerHTML={this.dangerHtml(this.props.parentComment.content)}></span>
                            </div>
                            :
                            <div className="parent-item deleted">原评论已被删除</div>
                        )
                    }
                    <div className="tip-wrap">
                        <div className="time">{timeBefore(this.props.createTime, Date.now())}</div>
                        {
                            // 如果评论类型是 shareComment, 隐藏评论操作按钮, 无法删除和禁言
                            this.props.commentType !== 'shareComment' ?
                            (
                                ((this.props.power.allowMGTopic && this.props.createRole !== 'creater') || this.props.userId == this.props.createBy ) && <div className="control-btn" data-id={this.props.id} onClick={this.triggerManageBox}>
                                    {
                                        this.state.showManagement &&
                                        <div className="manage-box">
                                            {
                                                this.props.showBanBtn && 
                                                <span className="mute" onClick={this.muteUserById}>禁言</span>

                                            }
                                            {
                                                this.props.commentType !== 'shareComment' &&
                                                <span onClick={this.deleteComment}>删除</span>
                                            }
                                        </div>
                                    }
                                </div>
                            )
                            : null
                        }
	                    
	                    {
		                    this.props.userId !== this.props.commentCreateBy &&
                            <div className="reply-btn on-log on-visible"
                                 onClick={this.replyComment}
                                 data-log-region="comment-reply-btn"
                            ></div>
	                    }
                    </div>
                </div>
            </li>
        );
    }
}

CommentListItem.propTypes = {

};

export default CommentListItem;
