import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { collectVisible } from 'components/collect-visible';
import { showWinPhoneAuth } from 'components/phone-auth';
import { getVal, locationTo, digitFormat, imgUrlFormat } from "components/util";
import { getLike, addLikeIt, cancelLikeIt, isFocusLive, fetchFocusLive } from '../../../../actions/short-knowledge';

class BtnBar extends Component {
    state = {
        likeInfo: {},
        focusInfo: {},
        isClicklike: false,
    }

    async likeIt(){
        if(this.likeEnable) return false;
        this.likeEnable = true;
        
        if(!this.state.likeInfo.likes){
            this.setState({
                isClicklike: true,
            });
            this.props.setStatNum && this.props.setStatNum('likeNum','add');
            let result = await this.props.addLikeIt({
                type: 'knowledge',
                speakId: this.props.knowledgeId,
                topicId: this.props.knowledgeId,
            });
            let likeInfo = this.state.likeInfo;
            likeInfo.likesNum = result.data.likesNum;
            likeInfo.likes = true;
            this.setState({
                likeInfo,
            },()=>{
                this.likeEnable = false;
            });
        }else{
            this.props.setStatNum && this.props.setStatNum('likeNum','reduce');
            let result = await this.props.cancelLikeIt({
                type: 'knowledge',
                businessId: this.props.knowledgeId,
            });
            let likeInfo = this.state.likeInfo;
            likeInfo.likesNum = result.data.likesNum;
            likeInfo.likes = false;
            this.setState({
                likeInfo,
            },()=>{
                this.likeEnable = false;
                this.setState({
                    isClicklike: false,
                });
            });
        }
        
    }

    async initLike(){
        let result = await this.props.getLike({
            speakIds: this.props.knowledgeId,
        });
        if(result.state.code === 0){
            this.setState({
                likeInfo: result.data.speaks && result.data.speaks[0]
            });
        }
        
    }

    async initFocus(){
        let focusResult = await this.props.isFocusLive({
            liveId: this.props.liveId
        });
        this.setState({
            focusInfo: focusResult.data
        },()=>{
            collectVisible();
        });
    }
    

    async clickHead(){
        // B端直接跳转页面
        if(this.props.client ==='B'){
            this.jumpPage()
            return
        }
        this.props.setStatNum('liveNum','',this.jumpPage);
    }

    // 页面跳转
    jumpPage = () => {
        if(this.props.courseCount >0 ){
            locationTo(`${this.props.domainUrl}wechat/page/live/${this.props.liveId}?knowledgeId=${this.props.knowledgeId}&wcl=ShortVideo`);
        }else{
            locationTo(`${this.props.domainUrl}wechat/page/short-knowledge/video-list?liveId=${this.props.liveId}`);
        }
    }

    
    async onClickFocus(e){
        e.preventDefault();
        e.stopPropagation();
        //关注逻辑
        // 绑定手机号提示
        if (!getVal(this.props.userInfo, 'mobile')){
            await showWinPhoneAuth({close: true, onSuccess: ()=>{
                this.fetchFocusLiveFunc();
            }});
        }else{ this.fetchFocusLiveFunc() }
    }

    async fetchFocusLiveFunc(){
        await this.props.fetchFocusLive({
            liveId: this.props.liveId,
            status: 'Y',
        });
        let focusInfo = this.state.focusInfo;
        focusInfo.isFollow = true;
        focusInfo.focused =  true;
        this.setState({
            focusInfo
        },()=>{
            window.toast('关注成功');
        });
        this.props.calllog && this.props.calllog('short-follow-live');
    }

    goToMore(){
        if(this.props.qlchatQrcode){
            this.props.qlchatQrcodeShow && this.props.qlchatQrcodeShow();
        }else{
            locationTo(this.props.domainUrl +'wechat/page/short-knowledge/video-list?liveId='+this.props.liveId+ '&wcl=ShortVideo')
        }
        
    }

    componentDidMount(){
        this.initLike();
        this.initFocus();
    }


    render() {
        return (
            <div className={`video-show-btn-bar ${this.props.client ==='B'? 'B':'C'}`}>
                <div className={`btn-focus ${this.state.focusInfo.focused?'focused':''}`} onClick={this.clickHead.bind(this)}>
                    <img src={imgUrlFormat(this.props.liveImg||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} className = "on-log"
                            data-log-region="short-knowledge"
                            data-log-pos="photo"
                            data-log-name="头像"  />
                    {this.props.client ==='B' ? <span>{digitFormat((this.props.liveNum||0), 10000, ['千','w'])+'访问'}</span>:"" }
                    {
                        this.props.client ==='C' && !this.state.focusInfo.isFollow && 
                        <div className="btn-focus-live on-visible on-log"
                            data-log-region="short-knowledge"
                            data-log-pos="follow"
                            data-log-name="关注直播间" onClick={this.onClickFocus.bind(this)}></div>
                    }
                </div>
                { 

                    this.props.auditStatus !== 'auditing' && 
                    this.props.transcodStatus !=='transcoding' &&
                    this.props.client ==='B' &&
                    <div className={`btn-edit on-log`} 
                        data-log-region="short-knowledge"
                        data-log-pos="edit"
                        data-log-name="编辑"  
                        onClick={()=>{locationTo(this.props.domainUrl + 'wechat/page/short-knowledge/publish?wcl=ShortVideo&knowledgeId='+this.props.knowledgeId+'&liveId='+this.props.liveId)}}>
                        <span>编辑</span>
                    </div>
                }
                <div className={`btn-like ${this.state.likeInfo.likes?'active':''} on-log`} 
                    data-log-region="short-knowledge"
                    data-log-pos="like"
                    data-log-name="点赞"  
                    onClick={this.likeIt.bind(this)}>
                    <span>{digitFormat((this.state.likeInfo.likesNum||0), 10000, ['千','w'])}</span>
                </div>
                <div className="btn-comment on-log" 
                    data-log-region="short-knowledge"
                    data-log-pos="comment"
                    data-log-name="评论" 
                    onClick={this.props.onShowComment.bind(this)}>
                    <span>{digitFormat((this.props.commentNum||0),10000,['千','w'])}</span>
                </div>
                
                { this.props.client ==='C' && <div className="btn-share on-log" 
                    data-log-region="short-knowledge"
                    data-log-pos="share"
                    data-log-name="分享" 
                    onClick={this.props.onShowShareTips.bind(this)}
                    ><span>{digitFormat((this.props.shareNum||0),10000,['千','w'])}</span></div>}

                { this.props.client ==='C' && 
                <div className="btn-create on-log" 
                    onClick={()=>{locationTo(this.props.domainUrl+'wechat/page/short-knowledge/create?wcl=ShortVideo&liveId='+this.props.liveId)}}
                    data-log-region="short-knowledge"
                    data-log-pos="create"
                    data-log-name="创建" 
                ><span>创建</span></div>}

                { this.props.client ==='C' && !this.props.isSubscribe && 
                <div className="btn-more on-log" 
                    data-log-region="short-knowledge"
                    data-log-pos="more"
                    data-log-name="评论" 
                    onClick={this.goToMore.bind(this)}><span>公众号</span></div>}
            </div>
        );
    }
}

BtnBar.propTypes = {
    client: PropTypes.string,
    liveId: PropTypes.string,
    knowledgeId: PropTypes.string,
    commentNum: PropTypes.number,
    courseVisitsNum: PropTypes.number,
    liveImg: PropTypes.string,
    userInfo: PropTypes.object,
    domainUrl: PropTypes.string,
};

function msp(state) {
    return {
    }
}

const map = {
    getLike,
    addLikeIt,
    cancelLikeIt,
    isFocusLive, 
    fetchFocusLive,
}

export default connect(msp, map)(BtnBar);