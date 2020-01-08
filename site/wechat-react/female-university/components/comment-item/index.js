import React, { Component, Fragment } from 'react'
import classnames from 'classnames' 
import ToggleContent from '../toggle-content'
import { formatDate, locationTo, getDateDiff, getCookie } from 'components/util';
import ReplyInput from '../reply-input' 
import { autobind } from 'core-decorators';   
import { getUrlParams } from 'components/url-utils';
import {commentLike} from '../../actions/community'
import { getCommentList,deleteComment } from '../../actions/community'; 
import { isStudent } from "../../actions/community";
import TimeFormat from '../time-format'

 

@TimeFormat
@autobind
export default class extends Component {
    state={
        isShowReplyInput:false,
        parentId:'',
        sourceId:'',
        subList:[]
    }
    get userId(){
        return getCookie('userId','')
    }
    componentDidMount(){
        this.props.subList&&this.setState({
            subList:this.props.subList,
            isNoMore:this.props.subList.length<5
        })
    }
    componentWillUpdate(nextProps){ 
        if(nextProps.subList!=this.props.subList){
            this.setState({
                subList:nextProps.subList,
                isNoMore:nextProps.subList.length<5,
                likesNum:nextProps.likesNum,
                likes:nextProps.likes,
            })
        }
    }
    get ideaId(){
        return getUrlParams('ideaId','')
    }
    
    async getCommentListChildre(){ 
        const {subList} = this.state 
        const {sourceId_ListMap} = await getCommentList({
            ideaId:this.ideaId,
            sourceIdList:[this.props.id],
            page:1,
            size:5,
            time:subList[subList.length-1].createTime,
            beforeOrAfter:'before'
        })
        
        await this.setState({
            subList:[...subList,...sourceId_ListMap[this.props.id]],
            isNoMore:sourceId_ListMap[this.props.id].length<5
        }) 
        return true
    }
    toggleReply(parentId,sourceId,replyName){ 
        if(!this.props.isStudent){
            window.simpleDialog({
                title: null,
                msg: '加入女子大学才能完成此操作哦',
                buttons: 'cancel-confirm',
                confirmText: '去了解一下',
                cancelText: '',
                className: 'un-community-join-tip',
                onConfirm: async () => { 
                    // 手动触发打点日志 
                    typeof _qla != 'undefined' && _qla('click', {
                        region:'un-community-join-tip',
                    });
                    locationTo('/wechat/page/university-experience-camp?campId=2000006375050478&wcl=university_pm_community_10t8yxyq_191127')
                },
                onCancel: ()=>{ 
                },
            }) 
            return 
        }
        !this.state.isShowReplyInput&&this.setState({
            parentId,
            sourceId,
            replyName,
            isShowReplyInput:true
        }) 
    }
    onBlur(){
        this.setState({
            isShowReplyInput:false
        }) 

    }
    async commentLike(commentId,index){
        const res = await commentLike({
            commentId
        })
        if(res?.state?.code==0){
            window.toast('点赞成功')  
            if(index===undefined){
                this.setState({
                    likesNum:parseFloat(this.state.likesNum)+1,
                    likes:true, 
                })
            }else{
                const {subList} = this.state
                subList[index].likesNum=parseFloat(subList[index].likesNum)+1
                subList[index].likes=true
                this.setState({
                    subList
                })
            }
        }
    }
     
    commentSuccess(data){
        const {liveComment} = data
        this.setState({
            subList:[liveComment,...this.state.subList]
        }) 
        this.setState({
            isShowReplyInput:false
        }) 
        this.props.calComment&&this.props.calComment()
    } 
    async deleteComment(commentId){
        window.simpleDialog({
            title: null,
            msg: '确认将此评论删除?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '取消',
            className: '',
            onConfirm: async () => {  
                const res= await deleteComment({commentId})
                if(res?.state?.code!=0)return false
                const {subList} = this.state
                const index = subList.findIndex((item,index)=>{
                    return item.id==commentId
                })
                subList.splice(index,1)
                this.setState({
                    subList
                })
                this.props.calComment&&this.props.calComment(false)
            },
            onCancel: ()=>{ 
            },
        })  
    }
    render() {
        const {subList,isShowReplyInput,parentId,sourceId,replyName,isNoMore,likesNum, likes,}= this.state
        const { id,createBy, createByName,createByHeadImgUrl,content,createTime, isMore,calDay,sysTime,isGuest,deleteComment  } = this.props; 
        return (
            <Fragment> 
                <div className="comment-item-box g-border-bottom">
                    <div className="comment-pic on-visible on-log" 
                        data-log-name={createByName}
                        data-log-region={'un-community-avator-list'}
                        data-log-pos={ id }  
                        onClick={()=>locationTo(`/wechat/page/university/community-home?studentId=${createBy}`)}>
                        <img src={ createByHeadImgUrl } />
                    </div>
                    <div className="comment-cont">
                        <div className="comment-h flex jc-between flex-vcenter">
                            <div className="comment-author flex-g-1">
                                <p
                                    className="on-visible on-log" 
                                    data-log-name={createByName}
                                    data-log-region={'un-community-avator-list'}
                                    data-log-pos={ id }  
                                    onClick={()=>locationTo(`/wechat/page/university/community-home?studentId=${createBy}`)}>{createByName}</p>
                            </div>
                            <div
                                data-log-name={'评论点赞'}
                                data-log-region={'un-community-like-click'}
                                data-log-pos={ id }  
                                onClick={ () => !likes&&this.commentLike(id) } 
                                className={ `on-visible on-log like-status ${ likes ? 'linked' : '' }` }>{ likesNum || 0 } <i className="iconfont iconweidianzan"></i></div>
                        </div>
                        <div className="comment-datail">
                            <ToggleContent  
                                maxLine={5}  
                                children={
                                    <div className="comment-datail-desc"
                                        onClick={()=>this.toggleReply('0',id,createByName)}
                                        dangerouslySetInnerHTML={{ __html: content?.replace(/\n/g,'<br/>') }}
                                    ></div>
                                }
                            /> 
                        </div>
                        {
                            subList.length>0&&
                            <div className={ `reply-box g-border-bottom ${ isMore? 'reply-btm' : '' }` }>
                                { subList.map((item,index) => (
                                    <div key={ index } 
                                        className="reply-item" 
                                        onClick={ (e) => { 
                                            e.stopPropagation();
                                            e.preventDefault();
                                            
                                        } }> 
                                        <div className="comment-h flex jc-between flex-vcenter">
                                            <div className="comment-author flex-g-1"> 
                                                    {
                                                        item.parentComment&&item.parentComment.id!=id? 
                                                        <p>
                                                            <span 
                                                                className="on-visible on-log" 
                                                                data-log-name={item.createByName}
                                                                data-log-region={'un-community-avator-list'}
                                                                data-log-pos={ item.id }  
                                                                onClick={()=>locationTo(`/wechat/page/university/community-home?studentId=${item.createBy}`)}>{item.createByName}</span>
                                                                回复
                                                            <span
                                                                className="on-visible on-log" 
                                                                data-log-name={item.parentComment.createByName}
                                                                data-log-region={'un-community-avator-list'}
                                                                data-log-pos={ item.parentComment.id }  
                                                                onClick={()=>locationTo(`/wechat/page/university/community-home?studentId=${item.parentComment.createBy}`)}>{item.parentComment.createByName}</span></p>
                                                        :
                                                        <p>
                                                            <span 
                                                                className="on-visible on-log" 
                                                                data-log-name={item.createByName}
                                                                data-log-region={'un-community-avator-list'}
                                                                data-log-pos={ item.id }  
                                                                onClick={()=>locationTo(`/wechat/page/university/community-home?studentId=${item.createBy}`)}>{item.createByName}</span>
                                                        </p>
                                                    }
                                                 
                                            </div>
                                            <div
                                                data-log-name={'评论点赞'}
                                                data-log-region={'un-community-like-click'}
                                                data-log-pos={ item.id }  
                                                onClick={ () => !item.likes&&this.commentLike(item.id,index) } 
                                                className={ `on-visible on-log like-status ${ item.likes ? 'linked' : '' }` }>{ item.likesNum || 0 } <i className="iconfont iconweidianzan"></i></div>
                                        </div>
                                        <div>
                                            <ToggleContent  
                                                maxLine={5}  
                                                children={
                                                    <div className="comment-datail-desc"
                                                        onClick={()=>this.toggleReply(item.id,id,item.createByName)}
                                                        dangerouslySetInnerHTML={{ __html: item.content?.replace(/\n/g,'<br/>') }}
                                                    ></div>
                                                }
                                            /> 
                                        </div>
                                        
                                        <div className="comment-item-todo"> 
                                            <div className="comment-bottom">
                                                <div className="comment-times">{calDay(item.createTime,sysTime)}</div>
                                                <div className="comment-reply on-visible on-log" 
                                                    data-log-name={'回复评论'}
                                                    data-log-region={'un-community-comment-reply'}
                                                    data-log-pos={ item.id }  
                                                    onClick={()=>this.toggleReply(item.id,id,item.createByName)}>回复</div>  
                                            </div>
                                            {
                                                this.userId==item.createBy&&
                                                <div className="comment-item-del on-visible on-log" 
                                                    data-log-name={'删除评论'}
                                                    data-log-region={'un-community-comment-del'}
                                                    data-log-pos={ item.id } 
                                                    onClick={(e)=>{e.stopPropagation(); this.deleteComment(item.id)}}>
                                                    删除
                                                </div>
                                                
                                            }
                                        </div>
                                    </div>
                                )) }
                                {
                                    !isNoMore&&
                                    <div onClick={ () => {
                                        this.getCommentListChildre()
                                    } } className="reply-more">查看更多回复 <i className="iconfont iconxiaojiantou"></i></div>
                                }
                            </div> 
                       
                        }
                        <div className="comment-item-todo"> 
                            <div className="comment-bottom">
                                <div className="comment-times">{calDay(createTime,sysTime)}</div>
                                <div className="comment-reply on-visible on-log" 
                                    data-log-name={'回复评论'}
                                    data-log-region={'un-community-comment-reply'}
                                    data-log-pos={ id }   
                                    onClick={()=>this.toggleReply(id,id,createByName)}>回复</div>  
                            </div>
                            {
                                this.userId==createBy&&
                                <div className="comment-item-del on-visible on-log" 
                                    data-log-name={'删除评论'}
                                    data-log-region={'un-community-comment-del'}
                                    data-log-pos={ id } 
                                    onClick={(e)=>{e.stopPropagation(); deleteComment&&deleteComment(id)}}>
                                    删除
                                </div>
                                
                            }
                        </div>
                    </div>
                </div>
                 
                {
                    isShowReplyInput&&
                    <ReplyInput   
                        replyName={replyName}
                        ideaId={this.ideaId}  
                        parentId={parentId}   
                        sourceId={sourceId}
                        onBlur={this.onBlur}
                        commentSuccess={this.commentSuccess} />
                }           
            </Fragment>
        )
    }
}