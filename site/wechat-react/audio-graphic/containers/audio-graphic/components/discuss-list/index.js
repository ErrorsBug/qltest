import React, { Component } from 'react';
import { imgUrlFormat,timeBefore} from 'components/util';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';

import ControlMenu from './control';
import ReplyItem from './reply-item';
import EmptyPage from 'components/empty-page';

@autobind
class DiscussList extends Component {
    
    state = {
        showManagement : false,
        showManageId:'',
    }


    triggerManageBox(e,id) {
        e.stopPropagation();
        this.setState({
            showManagement: true,
            showManageId:id,
        });
    }

    hideManageBox() {
        this.setState({
            showManagement: false,
        });
    }

    // 判断是否显示禁言按钮
    judgeShowBanBtn = ({ power: { allowMGTopic }, userId, createBy, createRole, liveRole}) => {
        // 当且仅当其身份为直播间创建者或管理员时，可ban除其以外的发言者，管理员只可ban听众
        return (userId != createBy) && allowMGTopic && (liveRole === 'creater' ? true : createRole !== 'creater' && createRole !== 'manager');
    }

    hideControl(){
        this.setState({
            showManagement: false,
            showManageId:'',
        });
        this.props.replyDiscuss({show:false,id:'',userName:''});
    }

    discussLike(item){

        this.props.discussLike({
            discussId:item.id,
            status:'Y'
        })

    }

    dangerHtml(content){
        if (content) {
            content = content.replace(/\</g, (m) => "&lt;");
            content = content.replace(/\>/g, (m) => "&gt;");
            content = content.replace(/(&lt;br(\/)?&gt;)/g, (m) => "\n");
        }

        return { __html: content }
    };

    toDiscuss() {
        if (!this.props.isAuth) { 
            this.props.showPayTopic();
        } else {
            this.props.toggleReplyBox();   
        }
    }

	isTeacher(createRole){
		return ['creater', 'manager', 'guest'].indexOf(createRole) >= 0;
	}


    render() {
        const delSpeakIdList = this.props.delSpeakIdList || [];
        return (
            <div className='comment-list-container' onClick={this.hideControl}>
                <div className="title-bar">
                    <span className='title'>全部评论</span>
                    {
                        !this.props.power.allowMGLive?
                        < span className="btn-discuss icon_edit_2" onClick={this.toDiscuss}>发表评论</span>
                        :null
                    }
                </div>
                {this.props.shareConfigSwitchElement}
                {
                    
                    this.props.discussList.length > 0 ? this.props.discussList.map((item, index) => {
                        for (let id of delSpeakIdList) {
                            if (id == item.id) {
                                return (<div className="speak-placeholder"></div>)
                            }
                        }

                        // 初始化显示禁言按钮状态
                        const showBanBtn = !!this.judgeShowBanBtn({ ...this.props, ...item });
                    
                        const logoUrl = item.createByHeadImgUrl ? item.createByHeadImgUrl : 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png'
                        return <div className="comment-item"
                                    key={`comment-item-${item.id}`}
                                    ref={r => this[`commentItemRef-${index}`] = r}
                        >
                            <img className='head' src={`${imgUrlFormat(logoUrl,'?x-oss-process=image/resize,w_100,h_100,limit_1')}`} alt="" />

                            <div className={`comment-main${!!item.parentId ? ' no-border' : ''}`}>
                                <div className="flex-main">
                                    <div className="flex-content">  
                                        <div className="top-bar">
                                            <span className="name">
                                                {
	                                                this.isTeacher(item.createRole) &&
                                                    <i>(老师)</i>
                                                }
                                                {item.createByName}
                                            </span>
                                        </div>
                                        <div className="time">{timeBefore(item.createTime,this.props.currentTimeMillis)}</div>
                                        <pre className="content"><b dangerouslySetInnerHTML={this.dangerHtml(item.content)}></b></pre>
                                    </div>  

                                    <div className="comment-op-panel">
                                        {/*{*/}
                                            {/*item.userLike == 'Y' ?*/}
                                            {/*<span className="btn-like on">{item.likeNum} <i className="icon"></i></span>*/}
                                            {/*:<span className="btn-like" onClick={()=>{this.discussLike(item)}}>{ (item.likeNum && item.likeNum > 0) ? item.likeNum : ''} <i className="icon"></i></span>*/}
                                        {/*}*/}
                                        {/* <div className="bottom-bar"> */}
                                        <ControlMenu
                                            bannedToPost = {this.props.bannedToPost}
                                            deleteDiscuss = {this.props.deleteDiscuss}
                                            replyDiscuss = {this.props.replyDiscuss}
                                            power = {this.props.power}
                                            userId = {this.props.userId}
                                            createBy={item.createBy}
                                            createRole={item.createRole}
                                            commentType={item.commentType}
                                            triggerManageBox = {this.triggerManageBox}
                                            item = {item}
                                            showManagement = {this.state.showManagement}
                                            showManageId = {this.state.showManageId}
                                            hideManageBox = {this.hideManageBox}
                                            topicId = {this.props.topicId}
                                            liveId = {this.props.liveId}
                                            liveRole={this.props.liveRole}
                                            showBanBtn={showBanBtn}
                                            currentTimeMillis = {this.props.currentTimeMillis}
                                            index={index}
                                        />
                                        
                                    </div>
                                </div>

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

                                <ReplyItem
                                    replyList={item.replyList}
                                    topicId={this.props.topicId}
                                    power = {this.props.power}
                                    deleteDiscuss={this.props.deleteDiscuss}
                                    dangerHtml={this.dangerHtml}
                                />
                            </div>

                            
                        </div>
                    })
                    :
                    <EmptyPage mini emptyMessage="还没有评论"/>
                }


            </div>
        );
    }
}

DiscussList.propTypes = {

};

export default DiscussList;