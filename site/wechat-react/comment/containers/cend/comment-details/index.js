import React, { Component } from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import ScrollView from 'components/scroll-view';
import InputBox from '../../../components/input-box';

import { locationTo, imgUrlFormat, timeBefore } from 'components/util';
import detect from 'components/detect';
import { request } from 'common_actions/common';
import {
    cleanCommentRedDot,
} from 'common_actions/messages';



class CendCommentDetails extends Component {
    state = {
        commentInfo: {
            status: '',
            data: undefined,
        },

        commentList: {
            status: '',
            data: undefined,
            page: {
                page: 1,
                size: 10,
            }
        },

        subCommentMenu: null,

        inputBoxSrcComment: false,
        inputBoxPlaceHolder: '',
    }

    componentDidMount() {
        this.getCommentInfo();
    }

    render() {
        const commentInfo = this.state.commentInfo.data;

        return <Page title="评论" className="p-comment-list">
            <ScrollView
                onScrollBottom={() => this.getCommentList(true)}
                status={this.state.commentInfo.data && this.state.commentList.status}
            >
                {
                    this.state.commentInfo.status === 'error' &&
                    <div className="list-empty">
                        <div></div>
                        <p>你的评论已被删除</p>
                        <span className="btn" onClick={() => locationTo('/wechat/page/messages')}>回到消息管理</span>
                    </div>
                }
                {
                    !!commentInfo &&
                    <div>
                        <div className="section-title">
                            我的评论
                        </div>
                        <div className="comment-item">
                            <div className="left">
                                <div className="comment-avatar" style={{backgroundImage: `url(${imgUrlFormat(commentInfo.createByHeadImgUrl, '@80w_80h_1e_1c_2o')})`}}></div>
                            </div>
                            <div className="right">
                                <div className="username-wrap">
                                    <div className="comment-username">{commentInfo.createByName}</div>
                                    <div className="comment-time">{timeBefore(commentInfo.createTime)}</div>
                                </div>
                                <div className="comment-content">
                                    {commentInfo.content}
                                </div>
                                
                                <div className="bubble-block">
                                    {
                                        commentInfo.parentCommentPo && commentInfo.parentCommentPo.content !== undefined &&
                                        <div className="sub-comment-item">
                                            <div className="sub-comment-content">
                                                <span className="comment-reply-by">{commentInfo.parentCommentPo.createByName}：</span>
                                                {commentInfo.parentCommentPo.content}
                                            </div>
                                        </div>
                                    }
                                    {
                                        !!commentInfo.parentId && !commentInfo.parentCommentPo && 
                                        <div className="sub-comment-item">
                                            <div className="sub-comment-content is-deleted">
                                                原评论已被删除
                                            </div>
                                        </div>
                                    }
                                    <div className="course-info on-log"
                                        data-log-region="course-info"
                                        onClick={this.onClickCourseInfo}
                                    >
                                        <div className="img" style={{backgroundImage: `url(${commentInfo.topicLogo}@160w_100h_1e_1c_2o)`}}></div>
                                        <div className="info">
                                            <div className="title">{commentInfo.topicName}</div>
                                            <div className="desc">{commentInfo.liveName}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.commentList.data &&
                    <div>
                        <div className="section-title">
                            回复我的
                            <span>{this.state.commentInfo.data && this.state.commentInfo.data.commentNum}</span>
                        </div> 
                        {
                            this.state.commentList.data.map((item, index) => {
                                return <CommentItem
                                    key={index}
                                    item={item}
                                    onClickCommentReply={this.onClickCommentReply}
                                />
                            })
                        }
                    </div>
                }
            </ScrollView>

            {
                this.state.inputBoxSrcComment &&
                <InputBox
                    placeholder={this.state.inputBoxPlaceHolder}
                    onSend={this.onSendComment}
                    onBlur={this.onBlurInputBox}
                />
            }
        </Page>
    }

    getCommentList = async isContinue => {
        if (/pending|end/.test(this.state.commentList.status)) return;

        const page = {
            ...this.state.commentList.page
        };
        page.page = isContinue ? page.page + 1 : 1;

        this.setState({
            commentList: {
                ...this.state.commentList,
                status: 'pending',
            }
        })

        request({
            url: '/api/wechat/comment/getCommentReplyList',
            method: 'POST',
            body: {
                topicId: this.props.location.query.topicId,
                commentId: this.props.location.query.id,
                page,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            let list = res.data.commentPos || [];

            this.setState({
                commentList: {
                    ...this.state.commentList,
                    status: list.length < page.size ? 'end' : 'success',
                    data: isContinue ? this.state.commentList.data.concat(list) : list,
                    page,
                    num: res.data.num || 0, 
                },
            }, () => {
                // 清红点
                const ids = [];

                // 如果有效消息太少，加载下一页
                let validNum = 0;

                list.forEach(item => {
                    if (item.isNew === 'Y') {
                        ids.push(item.id);
                    }
                    if (item.publishStatus !== 'delete' || item.myReplyCommentPos && item.myReplyCommentPos.length) {
                        validNum++;
                    }
                })
                ids.length && this.props.cleanCommentRedDot('cReplyList', ids);

                if (validNum === 0) this.getCommentList(true);
            })

        }).catch(err => {
            console.error(err);
            this.setState({
                commentList: {
                    ...this.state.commentList,
                    status: '',
                }
            })
        })
    }

    getCommentInfo = () => {
        request({
            url: '/api/wechat/comment/getCommentDetail',
            method: 'POST',
            body: {
                topicId: this.props.location.query.topicId,
                commentId: this.props.location.query.id,
            }
        }).then(res => {
            if (res.state.code) {
                if (res.state.code != 10012) window.toast(res.state.msg);
                throw Error(res.state.msg);
            }
            
            this.setState({
                commentInfo: {
                    status: 'success',
                    data: res.data
                }
            })

            this.getCommentList();
        }).catch(err => {
            console.error(err);
            
            this.setState({
                commentInfo: {
                    ...this.state.commentInfo,
                    status: 'error',
                    message: err.message,
                }
            })
        })
    }

    onSendComment = (content = '') => {
        if (!content || !content.trim()) return  window.toast('请输入有效内容~');

        const srcComment = this.state.inputBoxSrcComment;
        window.loading(true);
        request({
            url: '/api/wechat/topic/addComment',
            method: 'POST',
            body: {
                liveId: this.state.commentInfo.data.liveId,
                topicId: this.props.location.query.topicId,
                parentId: srcComment.id,
                type: 'text',
                content,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            if (res.data && res.data.liveCommentView) {
                this.state.commentList.data.some((item, index) => {
                    if (item.id == srcComment.id) {
                        const commentList = {
                            ...this.state.commentList,
                            data: [...this.state.commentList.data],
                        }
                        commentList.data[index] = {...commentList.data[index]}
                        commentList.data[index].myReplyCommentPos = (commentList.data[index].myReplyCommentPos || []).concat([res.data.liveCommentView]);

                        this.setState({
                            commentList
                        })

                        return true;
                    }
                })
            }

            this.onBlurInputBox();
            // this.addCommentNum(1);
            window.toast('回复成功');

        }).catch(err => {
            console.error(err);
            window.toast(err.message);
        }).then(() => {
            window.loading(false);
        })
    }

    onBlurInputBox = () => {
        // 失焦清空状态
        this.state.inputBoxSrcComment && this.setState({
            inputBoxSrcComment: false,
            inputBoxPlaceHolder: '',
        });
    }

    onClickCommentReply = comment => {
        this.setState({
            inputBoxSrcComment: comment,
            inputBoxPlaceHolder: `回复：${comment.createByName}`,
        }, () => {
            this.scrollToContentAfterFocus(`.content-id-${comment.id}`);
        })
    }

    scrollToContentAfterFocus = async className => {
        if (!detect.os.ios) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        const inputBox = document.querySelector('.input-wrap');
        const target = document.querySelector(className);
        const scrollView = document.querySelector('.co-scroll-view');
        if (!inputBox || !target || !scrollView) return;

        const targetRect = target.getBoundingClientRect();
        scrollView.scrollTop = targetRect.top + targetRect.height + scrollView.scrollTop + inputBox.clientHeight - scrollView.clientHeight + 10;

        detect.os.ios && setTimeout(() => {
            inputBox.scrollIntoView();
        }, 800)
    }

    addCommentNum(num = 0) {
        this.setState({
            commentInfo: {
                ...this.state.commentInfo,
                data: {
                    ...this.state.commentInfo.data,
                    commentNum: this.state.commentInfo.data.commentNum + num,
                }
            }
        })
    }

    onClickCourseInfo = () => {
        locationTo(`/topic/details?topicId=${this.state.commentInfo.data.topicId}`);
    }
}




function mapStateToProps(state) {
    return state
}

const mapActionToProps = {
    cleanCommentRedDot,
}

module.exports = connect(mapStateToProps, mapActionToProps)(CendCommentDetails);




class CommentItem extends React.PureComponent {
    render() {
        const item = this.props.item;

        if (item.publishStatus === 'delete' && (!item.myReplyCommentPos || !item.myReplyCommentPos.length)) return false;

        return <div
            className="comment-item"
        >
            <div className="left">
                <div className="comment-avatar" style={{backgroundImage: `url(${imgUrlFormat(item.createByHeadImgUrl, '@80w_80h_1e_1c_2o')})`}}>
                    {
                        item.isNew === 'Y' &&
                        <div className="new"></div>
                    }
                </div>
            </div>
            <div className="right">
                <div className="username-wrap">
                    <div className="comment-username">
                        {
                            /creater/.test(item.createRole) &&
                            <span className="teacher">(老师) </span>
                        }
                        {item.createByName}
                    </div>
                </div>

                {
                    item.publishStatus !== 'delete'
                    ?
                    <div className={`comment-content content-id-${item.id}`}>{item.content}</div>
                    :
                    <div className="comment-content is-deleted">
                        原评论已被删除
                    </div>
                }
                    
                {
                    item.myReplyCommentPos && item.myReplyCommentPos.length
                    ?
                    <div className="bubble-block">
                    {
                        item.myReplyCommentPos.map((subItem, subIndex) =>
                            <div key={subIndex}
                                className="sub-comment-item"
                            >
                                <div className="sub-comment-content">
                                    <span className="comment-reply-by">{subItem.createByName}：</span>
                                    {subItem.content}
                                </div>
                            </div>
                        )
                    }
                    </div>
                    :
                    false
                }

                <div className="cend-comment-footer">
                    <div className="comment-time">{timeBefore(item.createTime)}</div>
                    <i className="icon icon-comment on-log"
                        data-log-region="comment-reply-btn"
                        onClick={() => this.props.onClickCommentReply(item)}
                    ></i>
                </div>
            </div>
        </div>
    }
}
