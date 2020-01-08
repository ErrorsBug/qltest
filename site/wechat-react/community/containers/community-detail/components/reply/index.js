import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators' 
import ReplyInput from '../../../../components/reply-input'
import GoodClick from '../../../../components/idea-item/good-click'
import CollectClick from '../../../../components/idea-item/collect-click'
import ShareClick from '../../../../components/idea-item/share-click'
import { getUrlParams } from 'components/url-utils' 
import { locationTo } from 'components/util'
import {addLikeNum} from 'components/like-share'


@autobind
export default class index extends Component {
    state={
        isShowReplyInput:false,
        needShowTips:false,
        tips:'',
        wechatShare:false
    }
    get tabIdx(){
        return getUrlParams('tabIdx','')
    }
    async componentDidMount(){ 
        if(this.tabIdx==0){
            setTimeout(()=>{
                //this.toggleReply()
            },1000)
        }
    }
    toggleReply(){ 
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
        this.setState({
            isShowReplyInput:!this.state.isShowReplyInput
        })
    }
    //处理点赞引导分享
    handleLikeShare(){
        let [needShowTips,tips] = addLikeNum()
        if(needShowTips){
            this.setState({
                needShowTips:needShowTips,
                tips:tips,
                wechatShare:true
            },() => {
                setTimeout(() => {
                    this.setState({
                        needShowTips:false,
                        tips:''
                    })
                },2000)
            })
        }
    }
    render() {
        const {isShowReplyInput,needShowTips, tips,wechatShare}= this.state
        const {...otherPorps}= this.props  
        return (
            <div>
                {    
                    createPortal(
                        <div className="reply-btn" ref={ r => this.reply = r}>
                            <div 
                                className="reply flex flex-vcenter on-visible on-log" 
                                data-log-name="评论输入框"
                                data-log-region="un-community-comment-input"
                                data-log-pos="0" 
                                onClick={ ()=>this.toggleReply() }>
                                来说点什么吧~
                            </div>
                            <ShareClick  {...this.props} hideNum needShowTips={needShowTips} tips={tips} tipsMiddle={true} wechatShare={wechatShare}/>
                            <CollectClick  {...this.props} hideNum />
                            <GoodClick {...otherPorps} hideNum handleLikeShare={this.handleLikeShare}/>
                        </div>,
                        document.getElementById('app')
                    )
                }
                {
                    isShowReplyInput&&
                    <ReplyInput
                        onBlur={this.toggleReply}
                        {...otherPorps}/>
                }
                
            </div>
        )
    }
}