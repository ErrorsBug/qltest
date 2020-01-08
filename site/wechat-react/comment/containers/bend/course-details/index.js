import React, { Component } from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import ScrollView from 'components/scroll-view';
import InputBox from '../../../components/input-box';

import { locationTo, imgUrlFormat, timeBefore } from 'components/util';
import { collectVisible } from 'components/collect-visible';
import detect from 'components/detect';
import { request } from 'common_actions/common';
import {
    cleanCommentRedDot,
} from 'common_actions/messages';


class BendCourseDetails extends Component {
    state = {
        courseInfo: {
            status: '',
            data: undefined,
        },

        commentList: {
            status: '',
            data: undefined,
            pageSize: 20,
        },

        subCommentMenu: null,

        inputBoxSrcComment: false,
        inputBoxCurComment: false,
        inputBoxPlaceHolder: '',
    }

    componentDidMount() {
        this.getCommentList();

        typeof _qla === 'undefined' || _qla.bindVisibleScroll('co-scroll-view');

        // 用于pc端
        this._appWrapOffsetLeft = 0;
        const appWrap = document.querySelector('.app-wrap');
        if (appWrap) {
            this._appWrapOffsetLeft = appWrap.offsetLeft;
        }
    }

    render() {
        const courseInfo = this.state.courseInfo.data;
        let htmlIndex = -1; // 记录评论所在的html索引

        return <Page title="课程评论管理" className="p-comment-list">
            <ScrollView
                onScrollBottom={() => this.getCommentList(true)}
                status={this.state.commentList.status}
            >
                {
                    !!courseInfo &&
                    <div className="header-info">
                        <div className="course-info on-log"
                            data-log-region="course-info"
                            onClick={this.onClickCourseInfo}
                        >
                            <div className="img" style={{backgroundImage: `url(${courseInfo.topicLogo}@160w_100h_1e_1c_2o)`}}></div>
                            <div className="info">
                                <div className="title">{courseInfo.topicName}</div>
                                <div className="learn-num"><i className="icon icon-learn-num"></i>{courseInfo.browsNum}人学习</div>
                            </div>
                        </div>
                    </div>
                }
                {
                    this.state.commentList.data &&
                    <div>
                        <div className="section-title">
                            全部评论
                            <span>{courseInfo && courseInfo.commentNum}</span>
                        </div> 
                        {
                            this.state.commentList.data.map((item, index) => {
                                if (item.publishStatus === 'delete' && (!item.teacherReplyCommentPos || !item.teacherReplyCommentPos.length)) {
                                    return false;
                                } else {
                                    htmlIndex++;
                                }
        
                                return <CommentItem
                                    key={index}
                                    item={item}
                                    htmlIndex={htmlIndex}
                                    onClickSubCommentBtnMore={this.onClickSubCommentBtnMore}
                                    onClickCommentDelete={this.onClickCommentDelete}
                                    onClickCommentReply={this.onClickCommentReply}
                                />
                            })
                        }
                    </div>
                }

            </ScrollView>

            {
                !!this.state.subCommentMenu &&
                <div className="sub-comment-more-menu" onTouchMove={e=> {
                    e.preventDefault();
                }}>
                    <div className="mask" onClick={this.hideSubCommentMenu}></div>
                    <div className="btns" style={{left: this.state.subCommentMenu.left, top: this.state.subCommentMenu.top}}>
                        <div className="btn on-log on-visible"
                            data-log-region="sub-comment-edit-btn"
                            onClick={this.onClickSubCommentEdit}
                        >
                            <i className="icon icon-edit"></i>
                            编辑回复
                        </div>
                        <div className="btn on-log on-visible"
                            data-log-region="sub-comment-undo-btn"
                            onClick={this.onClickSubCommentUndo}
                        >
                            <i className="icon icon-undo"></i>
                            撤销回复
                        </div>
                    </div>
                </div>
            }

            {
                this.state.inputBoxSrcComment &&
                <InputBox
                    placeholder={this.state.inputBoxPlaceHolder}
                    initialValue={this.state.inputBoxCurComment && this.state.inputBoxCurComment.content || ''}
                    onSend={this.onSendComment}
                    onBlur={this.onBlurInputBox}
                />
            }
        </Page>
    }

    getCommentList = async isContinue => {
        if (/pending|end/.test(this.state.commentList.status)) return;

        // 这个神奇的接口需要前端做除重处理
        const avoidDuplication = [];
        if (isContinue && this.state.commentList.data) {
            const last = this.state.commentList.data[this.state.commentList.data.length - 1];
            if (last && last.createTimestamp) {
                const time = last.createTimestamp;
                this.state.commentList.data.forEach(item => {
                    if (item.createTimestamp === time) {
                        avoidDuplication.push(item.id);
                    }
                })
            }
        }

        this.setState({
            commentList: {
                ...this.state.commentList,
                status: 'pending',
            }
        })

        this.requestCommentList(this.state.commentList.pageSize).then(({status = 'success'}) => {
            let list = this.requestCommentBuffer; 

            // 去重
            if (avoidDuplication.length) {
                list = list.filter(item => avoidDuplication.indexOf(item.id + '') === -1);
            }

            this.setState({
                commentList: {
                    ...this.state.commentList,
                    status,
                    data: isContinue ? (this.state.commentList.data || []).concat(list) : list,
                },
            }, () => {
                // 清红点
                const ids = [];
                list.forEach(item => {
                    if (item.isNew === 'Y') {
                        ids.push(item.id);
                    }
                })
                ids.length && this.props.cleanCommentRedDot('bCommentList', ids);

                collectVisible();
            })
        }).catch(err => {
            console.error(err);
            this.setState({
                commentList: {
                    ...this.state.commentList,
                    status: '',
                }
            })
        }).then(() => {
            this.requestCommentBuffer = [];
        })
    }

    requestCommentBuffer = []

    getOldestCommentTime = () => {
        if (this.requestCommentBuffer.length) {
            for (let i = this.requestCommentBuffer.length - 1; i >= 0; i--) {
                if (this.requestCommentBuffer[i].createTimestamp) {
                    return this.requestCommentBuffer[i].createTimestamp;
                }
            }
        } else if (this.state.commentList.data && this.state.commentList.data.length) {
            const data = this.state.commentList.data;
            for (let i = data.length - 1; i >= 0; i--) {
                if (data[i].createTimestamp) {
                    return data[i].createTimestamp;
                }
            }
        } else {
            return null;
        }
    }

    requestCommentList = async pageSize => {
        return request({
            url: '/api/wechat/comment/getCourseComment',
            method: 'POST',
            body: {
                liveId: this.props.location.query.liveId,
                time: this.getOldestCommentTime(),
                beforeOrAfter: 'before',
                topicId: this.props.location.query.topicId,
                pageSize,
            }
        }).then(async res => {
            if (res.state.code) throw Error(res.state.msg);

            // 第一次请求获取课程信息
            if (!this.state.courseInfo.data) {
                const { liveCommentViews, ...courseInfo } = res.data;
                this.setState({
                    courseInfo: {
                        status: 'success',
                        data: courseInfo,
                    },
                });
            }
            
            let list = res.data.liveCommentViews || [];

            this.requestCommentBuffer = this.requestCommentBuffer.concat(list);
            // 避免死循环
            if (this.requestCommentBuffer.length > this.state.commentList.pageSize * 2) {
                return {
                    status: list.length < pageSize ? 'end' : 'success',
                };
            }
            
            let validNum = 0;
            list.forEach(item => {
                if (item.publishStatus !== 'delete' || item.teacherReplyCommentPos && item.teacherReplyCommentPos.length) {
                    validNum++;
                }
            })

            // 有效数量不够时，请求多页
            if (!validNum) {
                await this.requestCommentList(pageSize - validNum);
            }

            return {
                status: list.length < pageSize ? 'end' : 'success',
            };
        })
    }

    onSendComment = (content = '') => {
        if (!content || !content.trim()) return  window.toast('请输入有效内容~');

        // 区分编辑和添加
        if (this.state.inputBoxCurComment) {
            if (content == this.state.inputBoxCurComment.content) {
                return window.toast('内容没有修改噢~');
            }

            window.loading(true);
            request({
                url: '/api/wechat/comment/update',
                method: 'POST',
                body: {
                    topicId: this.props.location.query.topicId,
                    commentId: this.state.inputBoxCurComment.id,
                    content,
                }
            }).then(res => {
                if (res.state.code) throw Error(res.state.msg);
                
                this.state.commentList.data.some((item, index) => {
                    if (item.id == this.state.inputBoxSrcComment.id) {
                        const data = [...this.state.commentList.data];
                        data[index] = {...data[index]};

                        (data[index].teacherReplyCommentPos || []).some((item, subIndex) => {
                            if (item.id == this.state.inputBoxCurComment.id) {
                                data[index].teacherReplyCommentPos = [...data[index].teacherReplyCommentPos];
                                data[index].teacherReplyCommentPos[subIndex] = {
                                    ...data[index].teacherReplyCommentPos[subIndex],
                                    content,
                                };

                                this.setState({
                                    commentList: {
                                        ...this.state.commentList,
                                        data,
                                    }
                                })

                                return true;
                            }
                        })
                        return true;
                    }
                })

                this.onBlurInputBox();
                window.toast('编辑成功');

            }).catch(err => {
                console.error(err);
                window.toast(err.message);
            }).then(() => {
                window.loading(false);
            })

            return;
        }


        const srcComment = this.state.inputBoxSrcComment;

        window.loading(true);
        request({
            url: '/api/wechat/topic/addComment',
            method: 'POST',
            body: {
                liveId: srcComment.liveId,
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
                        const data = [...this.state.commentList.data];
                        data[index] = {...data[index]};
                        data[index].teacherReplyCommentPos = (data[index].teacherReplyCommentPos || []).concat([res.data.liveCommentView])
                        this.setState({
                            commentList: {
                                ...this.state.commentList,
                                data,
                            }
                        })
                        return true;
                    }
                })
            }

            this.onBlurInputBox();
            this.addCommentNum(1);
            window.toast('回复成功');
            collectVisible();

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
            inputBoxCurComment: false,
            inputBoxPlaceHolder: '',
        });
    }

    onClickCommentDelete = comment => {
        window.simpleDialog({
            msg: '确定删除该评论吗？',
            onConfirm: () => {
                typeof _qla === 'undefined' || _qla('click', {region: 'comment-delete-confirm'});

                request({
                    url: '/api/wechat/topic/deleteComment',
                    method: 'POST',
                    body: {
                        topicId: this.props.location.query.topicId,
                        commentId: comment.id,
                        createBy: comment.createBy,
                    }
                }).then(res => {
                    if (res.state.code) throw Error(res.state.msg);

                    let commentNum = 1 + (comment.teacherReplyCommentPos && comment.teacherReplyCommentPos.length || 0);

                    // 还有子评论的话不删除
                    if (!comment.teacherReplyCommentPos || !comment.teacherReplyCommentPos.length) {
                        this.setState({
                            commentList: {
                                ...this.state.commentList,
                                data: [...this.state.commentList.data].filter(item => item.id != comment.id),
                            },
                        });
                    } else {    
                        this.setState({
                            commentList: {
                                ...this.state.commentList,
                                data: [...this.state.commentList.data].map(item => {
                                    if (item.id == comment.id) {
                                        item = {...item, publishStatus: 'delete'};
                                    }
                                    return item;
                                }),
                            },
                        });
                    }

                    this.addCommentNum(-1);
                    window.toast('删除成功');

                }).catch(err => {
                    console.error(err);
                    window.toast(err.message);
                })
            },
            onCancel: () => {
                typeof _qla === 'undefined' || _qla('click', {region: 'comment-delete-cancel'});
            }
        })
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

    onClickSubCommentEdit = () => {
        const { comment, subComment } = this.state.subCommentMenu;
        this.hideSubCommentMenu();
        
        this.setState({
            inputBoxSrcComment: comment,
            inputBoxPlaceHolder: subComment.content,
            inputBoxCurComment: subComment,
        }, () => {
            this.scrollToContentAfterFocus(`.content-id-${subComment.id}`);
        })
    }

    onClickSubCommentUndo = () => {
        const { comment, subComment } = this.state.subCommentMenu;
        this.hideSubCommentMenu();

        window.simpleDialog({
            msg: '确定撤回该回复吗？',
            onConfirm: () => {
                request({
                    url: '/api/wechat/topic/deleteComment',
                    method: 'POST',
                    body: {
                        topicId: this.props.location.query.topicId,
                        commentId: subComment.id,
                        createBy: subComment.createBy,
                    }
                }).then(res => {
                    if (res.state.code) throw Error(res.state.msg);

                    const commentList = {...this.state.commentList};
                    commentList.data = [...commentList.data];
                    let srcIndex = -1;
                    commentList.data = commentList.data.map((item, index) => {
                        if (item.id == comment.id) {
                            srcIndex = index;
                            item = {...item};
                            item.teacherReplyCommentPos && 
                            (item.teacherReplyCommentPos = item.teacherReplyCommentPos.filter(subItem => {
                                return subItem.id != subComment.id;
                            }));
                        }
                        return item;
                    })
                    // 如果父评论为删除状态且没有子评论，删除父评论
                    if (srcIndex >= 0 && commentList.data[srcIndex].publishStatus === 'delete' && (!commentList.data[srcIndex].teacherReplyCommentPos || !commentList.data[srcIndex].teacherReplyCommentPos.length)) {
                        commentList.data.splice(srcIndex, 1);
                    }

                    this.setState({
                        commentList,
                    });
                    this.addCommentNum(-1);
                    window.toast('撤回成功');

                }).catch(err => {
                    console.error(err);
                    window.toast(err.message);
                })
            }
        })
    }

    addCommentNum(num = 0) {
        this.setState({
            courseInfo: {
                ...this.state.courseInfo,
                data: {
                    ...this.state.courseInfo.data,
                    commentNum: this.state.courseInfo.data.commentNum + num,
                }
            }
        })
    }

    onClickCourseInfo = () => {
        locationTo(`/topic/details?topicId=${this.props.location.query.topicId}`);
    }

    onClickSubCommentBtnMore = (e, comment, subComment) => {
        let rect = e.currentTarget.getBoundingClientRect();
        
        this.setState({
            subCommentMenu: {
                left: rect.left - this._appWrapOffsetLeft,
                top: rect.top + rect.height / 2,
                comment,
                subComment,
            }
        }, () => {
            collectVisible(0);

            const scrollBox = document.querySelector('.co-scroll-view');
            scrollBox && (scrollBox.style.overflow = 'hidden');
        })
    }

    hideSubCommentMenu = () => {
        this.setState({
            subCommentMenu: null
        });
        const scrollBox = document.querySelector('.co-scroll-view');
        scrollBox && (scrollBox.style.overflow = '');
    }
}




class CommentItem extends React.PureComponent {
    render() {
        const { item, htmlIndex } = this.props;
        if (item.publishStatus === 'delete'
            && (!item.teacherReplyCommentPos || !item.teacherReplyCommentPos.length) 
        ) return false; 

        return <div className="comment-item bend">
            <div className="info">
                <div className="comment-avatar" style={{backgroundImage: `url(${imgUrlFormat(item.createByHeadImgUrl, '@80w_80h_1e_1c_2o')})`}}>
                    {
                        item.isNew === 'Y' &&
                        <span className="new"></span>
                    }
                </div>
                <div className="comment-username">{item.createByName}</div>
                <div className="comment-time">{timeBefore(item.createTimestamp)}</div>
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
                item.parentId > 0 && (
                    item.parentCommentPo
                    ? 
                    <div className="comment-src-comment">“<span className="comment-reply-by">{item.parentCommentPo.createByName}：</span>{item.parentCommentPo.content}”</div>
                    :
                    <div className="comment-src-comment is-deleted">“原评论已被删除”</div>
                )
            }

            <div className="bubble-block">
                {
                    (item.teacherReplyCommentPos || []).map((subItem, subIndex) => {
                        return <div key={subIndex}
                            className="sub-comment-item"
                        >
                            <div className={`sub-comment-content content-id-${subItem.id}`}>
                                <span className="comment-reply-by">老师回复：</span>
                                {subItem.content}
                            </div>
                            <div className="btn-more on-log on-visible"
                                data-log-region="sub-comment-control-btn"
                                onClick={e => this.props.onClickSubCommentBtnMore(e, item, subItem)}
                            ><i className="icon icon-more"></i></div>
                        </div>
                    })
                }
            </div>

            {
                item.publishStatus !== 'delete' &&
                <div className="control-btns">
                    <div className="control-btn delete on-log on-visible"
                        data-log-region="comment-delete-btn"
                        data-log-pos={htmlIndex}
                        onClick={() => this.props.onClickCommentDelete(item)}
                    >
                        <i className="icon icon-delete"></i>
                        删除评论
                    </div>
                    <div className="control-btn on-log on-visible"
                        data-log-region="comment-reply-btn"
                        data-log-pos={htmlIndex}
                        onClick={() => this.props.onClickCommentReply(item)}
                    >
                        <i className="icon icon-comment"></i>
                        回复评论
                    </div>
                </div>
            }
        </div>
    }
}





function mapStateToProps(state) {
    return state
}

const mapActionToProps = {
    cleanCommentRedDot,
}

module.exports = connect(mapStateToProps, mapActionToProps)(BendCourseDetails);
