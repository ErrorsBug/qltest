import React, { Component } from 'react';
import PropTypes, { array } from 'prop-types';
import { connect } from 'react-redux';
import { imgUrlFormat , normalFilter, formatDate } from 'components/util';
import ScrollToLoad from "components/scrollToLoad";

import { getKnowledgeComment, addKnowledgeComment, setCommentHideStatus, getLike, addLikeIt, cancelLikeIt } from "../../../../actions/short-knowledge";


class CommentBox extends Component {
    state = {
        commentList: [],
        isNone: false,
        isNoMore: false,
        content: '',
        contentLength: 0,
        replyIndex: 0,
        replyName: '',
        parentId:'',
    }
    data = {
        pageNum: 1,
        pageSize: 10,
        beforeTime: new Date().getTime(),
        afterTime: new Date().getTime(),
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
        
        await this.props.addKnowledgeComment({
            liveId: this.props.liveId,
            knowledgeId: this.props.knowledgeId,
            content:normalFilter(this.state.content || ''),//replaceWrapWord(
            ip: this.props.userInfo.userId,
            parentId: this.state.replyName ? this.state.parentId : '',
        })
        
        if(this.state.replyName){
            const commentList = this.state.commentList;
            commentList[this.state.replyIndex].replayComment = {
                createByName: this.props.userInfo.name,
                content: this.state.content,
            }
            this.setState({
                commentList
            });
            
        }else{
            this.props.setStatNum && this.props.setStatNum('commentNum');
            this.loadComment("after");
        }

        this.setState({
            content: '',
            contentLength: 0,
            replyName: '',
            parentId: 0,
            isNoMore: false,
            isNone: false,
        });
        
        this.commentSending = false;
        this.onBlur();
    }
    onBlur(){
        if(this.state.content ===''){
            this.setState({
                replyName: '',
            });
        }
        // 解决iOS系统下收起键盘后页面被截断的问题
        window.scroll(0, 0);
    }
    changeInput(el){
        this.setState({
            content: el.target.value ||'',
            contentLength: (el.target.value).length,
        });
    }
    async componentDidMount(){
        this.commentSending = false;
        
        
        
    }
    componentWillUpdate(nextProps){
        if(this.data.pageNum===1 && nextProps.show && nextProps.show !== this.props.show){
            this.loadComment('before');
        }
        if(this.data.pageNum >1 && nextProps.show && nextProps.show !== this.props.show){
            this.loadComment("after");
        }
    }

    loadNext(next){
        this.loadComment('before',next);
    }

    async loadComment(position,next){
        let commentData = await this.props.getKnowledgeComment({
            page:{
                page: position==='after'? 1 : this.data.pageNum,
                size: this.data.pageSize,
            },
            bOrC: this.props.client,
            liveId: this.props.liveId,
            knowledgeId: this.props.knowledgeId,
            time: position==='before' ? new Date(this.data.beforeTime).getTime(): new Date(this.data.afterTime).getTime(),
            position,
        });
        if(commentData.state.code === 0){
            let commentList = commentData.data.commentList||[];

            
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


            if(commentListFilter.length>0){ commentListFilter = await this.initLike(commentListFilter);}


            if(position==='before'){
                if( this.data.pageNum == 1 && commentListFilter.length <= 0 && this.state.commentList.length<=0 ){
                    this.setState({
                        isNone: true,
                    });
                    this.data.pageNum++;
                    next && next();
                    return false;
                }else if(this.data.pageNum >= 1 && commentListFilter.length < this.data.pageSize){
                    this.setState({
                        isNoMore: true,
                    });
                }
                if(commentListFilter[commentListFilter.length-1]){
                    this.data.beforeTime =  commentListFilter[commentListFilter.length-1].createTime;
                }
                if(position==='before'){
                    this.data.pageNum++;
                }
                
            }else if(position==='after'){
                if(commentListFilter.length>=1){
                    commentListFilter.reverse();
                    this.props.updateCommentNum && this.props.updateCommentNum(commentListFilter.length);
                    this.data.afterTime = commentListFilter[0].createTime;
                    this.setState({
                        isNone: false,
                    });
                }
                
            }
            
            


            this.setState({
                commentList: position==='before' ? [...this.state.commentList, ...commentListFilter]: [ ...commentListFilter, ...this.state.commentList],
            },()=>{
                
                next && next();
            });
        }else{
            window.toast(result.state.msg);
        }
    }

    onReply(index){
        this.setState({
            replyIndex: index,
            parentId: this.state.commentList[index].id,
            replyName: this.state.commentList[index].createByName,
            content: this.state.commentList[index].replayComment? this.state.commentList[index].replayComment.content : '',
            contentLength: this.state.commentList[index].replayComment? this.state.commentList[index].replayComment.content.length : 0 ,
        });
        
        let commentInput = document.getElementById('commentInput');
        commentInput.focus();
    }

    //隐藏显示评论
    async setCommentHideStatus(index, commentId, publishStatus){
        await this.props.setCommentHideStatus({
            commentId,
            publishStatus,
            liveId: this.props.liveId,
        });
        let commentList = this.state.commentList;
        commentList[index].publishStatus = publishStatus;
        this.setState({
            commentList,
        })
        window.toast('设置成功');
    }


    async likeIt(index){
        if(this.likeEnable) return false;
        this.likeEnable = true;
        const commentList = this.state.commentList;
        
        if(!commentList[index].likeInfo.likes){
            
            let result = await this.props.addLikeIt({
                type: 'comment',
                speakId: commentList[index].id,
                topicId: this.props.knowledgeId,
            });
            commentList[index].likeInfo.likesNum = result.data.likesNum;
            commentList[index].likeInfo.likes = true;
            this.setState({
                commentList,
            },()=>{
                this.likeEnable = false;
            });
        
        }else{
            this.likeEnable = false;
        }
        
    }

    async initLike(list){
        const commentIds = [];
        list.forEach((element)=>{
            commentIds.push(element.id)
        })
        let result = await this.props.getLike({
            speakIds: commentIds.join(','),
        });
        if(result.state.code === 0){
            list.forEach((element,index)=>{
                list[index].likeInfo = result.data.speaks && result.data.speaks[index];
            });
        }
        return list;
        
    }


    render() {
        return (
            <div className={`video-comment-box ${this.props.show?'show':''}`}>
                <div className="bg" onClick={()=>{this.props.onHideComment()}}></div>
                <div className="main">
                    <div className='top'>说一说 {this.props.commentNum || 0 }  <i className="btn-close" onClick={()=>{this.props.onHideComment()}}></i></div>
                    <ScrollToLoad 
                        toBottomHeight={300}
						noneOne={ this.state.isNone}
                        loadNext={ this.loadNext.bind(this) }
                        noMore={this.state.isNoMore}
                        className="comment-list">
                    {
                        this.state.commentList.map((item,index)=>{
                            return <div className="comment" key={`comment-${index}`}>
                                <div className="head"><img src={imgUrlFormat(item.createByHeadImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} /></div>
                                <div className="info">
                                    <div className="user-name elli">
                                        { item.publishStatus ==='hide' && <span className="icon-hidden">隐藏</span>}
                                        {item.createByName} 
                                    </div>
                                    <span className={`btn-like ${item.likeInfo.likes? "active":""} `} onClick={()=>this.likeIt(index)}>{ item.likeInfo.likesNum|| 0 }</span>
                                    <div className={item.publishStatus ==='hide' ? "content hide-style":"content"} dangerouslySetInnerHTML={this.props.dangerHtml(item.content)} ></div>
                                    {
                                        item.replayComment && item.replayComment.content && <div className="reply-box"><span className="t-name">{item.replayComment.createByName}：</span><span className="t-reply">{item.replayComment.content}</span></div>
                                    }
                                    <div className="func-bar">
                                        <span>{formatDate(item.createTime,'yyyy.MM.dd hh:mm')}</span>
                                        {
                                            this.props.client ==='B' &&
                                            <div className="control">
                                                {
                                                    item.publishStatus ==='hide' ?
                                                    <span onClick={()=>this.setCommentHideStatus(index, item.id, 'publish')}>显示</span>
                                                    :
                                                    <span onClick={()=>this.setCommentHideStatus(index, item.id, 'hide')}>隐藏</span>
                                                }
                                                <span onClick={()=>{this.onReply(index,item.parentId)}}>回复</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                                
                            </div>;
                        })
                    }
                        
                    </ScrollToLoad>
                    <div className="input-box">
                        <textarea id='commentInput' value = {this.state.content} onChange={(el)=>{this.changeInput(el)}} placeholder={this.state.replyName? '回复：' + this.state.replyName :"优秀的评论我来造…"} onBlur = {this.onBlur.bind(this)} />
                        <div className="comment-send-right">
                            <div className="length">{this.state.contentLength}/500</div>
                            <div className={`btn-comment-send ${this.state.content?'active':''}`} onClick={this.sendComment.bind(this)}>发送</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CommentBox.propTypes = {
    show: PropTypes.bool,
    client: PropTypes.string,
    onHideComment: PropTypes.func,
    userInfo: PropTypes.object,
};

function msp(state) {
    return {
    }
}

const map = {
    getKnowledgeComment,
    addKnowledgeComment,
    setCommentHideStatus,
    getLike, addLikeIt, cancelLikeIt
}

export default connect(msp, map)(CommentBox);
