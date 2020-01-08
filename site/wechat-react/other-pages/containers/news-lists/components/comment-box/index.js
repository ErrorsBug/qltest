import React, { Component } from 'react';
import PropTypes, { array } from 'prop-types';
import { connect } from 'react-redux';
import { imgUrlFormat , normalFilter, timeBefore } from 'components/util';
import ScrollToLoad from "@ql-feat/scroll-to-load";

import Picture from 'ql-react-picture';

import { getCourseComment, addCourseComment } from "../../../../actions/common";

import "./style.scss";


class CommentBox extends Component {
    state = {
        commentList: [],
        isNone: false,
        isNoMore: false,
        content: '',
        focus: false,
    }
    data = {
        pageNum: 1,
        pageSize: 10,
        beforeTime: new Date().getTime(),
        afterTime: new Date().getTime(),
        parentId: '',
    }

    


    async sendComment(){
        if(this.state.content === ''){
            window.toast('请输入评论再发送');
            return false;
        }else if(this.state.content.length>500){
            window.toast('评论字数不能超过500字');
            return false;
        }
        if(this.commentSending){return false}
        
        this.commentSending = true;
        this.props.setStatNum && this.props.setStatNum('commentNum');
        await this.props.addCourseComment({
            topicId: this.props.businessId,
            liveId: this.props.liveId,
            content:normalFilter(this.state.content || ''),
            userId: this.props.userInfo.userId,
            type: 'text',
            isQuestion:'N',
            parentId: this.data.parentId,
        })
        this.data.parentId = '';
        this.setState({
            content: '',
            isNoMore: false,
            isNone: false,
            replaceCommentUser: '',
        });
        this.loadComment("after");
        this.commentSending = false;
        this.onBlur();
    }
    onBlur(){
        
        // 解决iOS系统下收起键盘后页面被截断的问题
        window.scroll(0, 0);
        if(this.state.content ===''){
            this.data.parentId = '';
            this.setState({
                replaceCommentUser: '',
            });
        }
        this.setState({
            focus: false,
        });
    }
    onFocus(){
        this.setState({
            focus: true,
        });
    }
    changeInput(el){
        this.setState({
            content: el.target.value,
        });
    }
    async componentDidMount(){
        this.commentSending = false;
    }
    componentWillUpdate(nextProps){
        if(nextProps.businessId !== this.props.businessId){
            this.initCommentData(()=>{
                this.loadComment('before',null,nextProps.businessId, nextProps.liveId);
            });
            
        }else{
            if(this.data.pageNum >1 && nextProps.show && nextProps.show !== this.props.show){
                this.loadComment("after");
            }
        }
        
    }

    initCommentData(load){
        this.data.pageNum = 1;
        this.data.beforeTime =  new Date().getTime();
        this.data.afterTime =  new Date().getTime();
        this.setState({
            commentList: [],
            isNone: false,
            isNoMore: false,
            content: '',
        },()=>{load&& load()});
    }

    loadNext(next){
        this.loadComment('before',next);
    }

    async loadComment(beforeOrAfter,next,nextId,nextLiveId){
        let commentData = await this.props.getCourseComment({
            page:{
                page: beforeOrAfter==='after'? 1 : this.data.pageNum,
                size: this.data.pageSize,
            },
            topicId: nextId || this.props.businessId,
            liveId: nextLiveId || this.props.liveId,
            time: beforeOrAfter==='before' ? new Date(this.data.beforeTime).getTime(): new Date(this.data.afterTime).getTime(),
            beforeOrAfter,
            isQuestion:'N'
        });
        if(commentData.state.code === 0){
            let commentList = commentData.data.liveCommentViews||[];
            /** 评论排重 */
            let currentComment = this.state.commentList;
            
            let commentListFilter = commentList.filter((x) => {
                let isBool = true;
                currentComment.forEach(element => {
                    if(x.id === element.id){
                        isBool = false;
                        return false;
                    }
                });
                return isBool;
            });
            /** 评论排重 */
            if(beforeOrAfter==='before'){
                if( this.data.pageNum == 1 && commentListFilter.length <= 0 && this.state.commentList.length<=0 ){
                    this.setState({
                        isNone: true,
                    });
                    this.data.pageNum++;
                    next && next();
                    return false;
                }else if(this.data.pageNum >= 1 && commentList.length < this.data.pageSize){
                    this.setState({
                        isNoMore: true,
                    });
                }
                if(commentListFilter[commentListFilter.length-1]){
                    this.data.beforeTime =  Number(commentListFilter[commentListFilter.length-1].createTime);
                }
                if(beforeOrAfter==='before'){
                    this.data.pageNum++;
                }
                
            }else if(beforeOrAfter==='after'){
                if(commentListFilter.length>=1){
                    commentListFilter.reverse();
                    this.props.updateCommentNum && this.props.updateCommentNum(commentListFilter.length);
                    this.data.afterTime = Number(commentListFilter[0].createTime);
                    this.setState({
                        isNone: false,
                    });
                }
                
            }
            
            


            this.setState({
                commentList: beforeOrAfter==='before' ? [...this.state.commentList, ...commentListFilter]: [ ...commentListFilter, ...this.state.commentList],
            },()=>{
                next && next();
            });
        }
    }

    isTeacher(createRole){
		return ['creater', 'manager', 'guest'].indexOf(createRole) >= 0;
    }
    
    dangerHtml(content){
		if (content) {
			content = content.replace(/\</g, (m) => "&lt;");
			content = content.replace(/\>/g, (m) => "&gt;");
			content = content.replace(/(&lt;br(\/)?&gt;)/g, (m) => "\n");
		}

		return { __html: content }
	};

    replyBtnClickHandle(item){
        this.data.parentId = item.id;
        this.setState({
            replaceCommentUser: item.createByName,
        },()=>{
            this.input.focus();
        });

    }

    render() {
        return (
            <div className={`newlist-comment-box ${this.props.show?'show':''}`}>
                <div className="bg" onClick={()=>{this.props.onHideComment()}}></div>
                <div className="main">
                    <div className='top'><span className="title">全部评论<i>{this.props.commentNum>999? '999+': (this.props.commentNum||0)}</i> </span>
                        <i className="btn-close" onClick={()=>{this.props.onHideComment()}}></i>
                    </div>
                    <ScrollToLoad 
                        toBottomHeight={300}
						noneOne={this.state.isNone}
                        loadNext={ this.loadNext.bind(this) }
                        noMore={this.state.isNoMore}
                        emptyMessage ="没有任何评论哦"
                        emptyPic = {'https://img.qlchat.com/qlLive/recommend/comment-empty.png'}
                        className="comment-list">
                    {
                        this.state.commentList.map((item,index)=>{
                            return <div className="comment-item" key={`comment-${index}`}>
                                <div className="avatar"><Picture className="pic" src={imgUrlFormat(item.createByHeadImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} placeholder={true} /></div>
                                <div className="comment-content">
                                    <div className="name">
											{
												this.isTeacher(item.createRole) &&
												<i>(老师)</i>
											}
											{item.createByName}
										</div>
										<div className="text" dangerouslySetInnerHTML={this.dangerHtml(item.content)}></div>
										{
											!!item.parentId &&
											(
												item.parentCommentPo && item.parentCommentPo.id ?
													<div className="parent-item">
							                            <span className="name">
							                                {
								                                this.isTeacher(item.parentCommentPo.createRole) &&
								                                <i>(老师)</i>
							                                }
								                            {item.parentCommentPo.createByName}：
							                            </span>
														<span className="text" dangerouslySetInnerHTML={this.dangerHtml(item.parentCommentPo.content)}></span>
													</div>
													:
													<div className="parent-item deleted">原评论已被删除</div>
											)
										}
										<div className="tip-wrap">
											<div className="time">{timeBefore(item.createTime,this.props.sysTime)}</div>
											{
												this.props.userId !== item.createBy &&
												<div className="reply-btn on-log on-visible"
												     data-log-region="comment-reply-btn"
												     onClick={this.replyBtnClickHandle.bind(this, item)}
												></div>
											}
										</div>
                                </div>
                            </div>;
                        })
                    }
                        
                    </ScrollToLoad>
                    <div className="input-box">
                        <input value = {this.state.content} ref={(el)=>{this.input = el }} onChange={(el)=>{this.changeInput(el)}} placeholder={this.state.replaceCommentUser? "回复："+ this.state.replaceCommentUser : "优秀的评论我来造…"} onFocus = {this.onFocus.bind(this)} onBlur = {this.onBlur.bind(this)} />
                        {(this.state.focus || this.state.content!=='') &&  <div className={`${this.state.content? '': 'not-send' } btn-comment-send`} onClick={this.sendComment.bind(this)}>发送</div>}
                    </div>
                </div>
            </div>
        );
    }
}

CommentBox.propTypes = {
    show: PropTypes.bool,
    onHideComment: PropTypes.func,
    userInfo: PropTypes.object,
};

function msp(state) {
    return {
    }
}

const map = {
    getCourseComment,
    addCourseComment,
}

export default connect(msp, map)(CommentBox);
