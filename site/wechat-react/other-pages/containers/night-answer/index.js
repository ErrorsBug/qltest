const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import { findDOMNode } from 'react-dom';

import Page from 'components/page';
import { locationTo,saveLocalStorageArray,setLocalStorageArrayItem,replaceWrapWord } from 'components/util';
import ScrollToLoad from 'components/scrollToLoad';
import { getQlchatVersion } from 'components/envi'
import { share } from 'components/wx-utils';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { fixScroll } from 'components/fix-scroll';

import FeaturedAnswerAudioPlayer from './components/featured-answer-audio-player';
import NightAnswerAudioPlayer from './components/night-answer-audio-player';

import CommentBar from './components/comment-bar';
import Comment from './components/comment';
import PastShow from './components/past-show';

import { AudioLocationRecord } from './audio-location-record'

// actions
import { 
    initNightAnswer,
    getInitAudio,
    getInitAnswer,
    getCommentList,
    getUserInfo,
    addComment,
    fetchFirstShowList,
    like,
} from '../../actions/night-answer';

@autobind
class NightAnswer extends Component {

    state = {
        //评论列表
        commentList: [],
        //是否显示往期弹出框
        showPast: false,
        //是否显示评论弹出框
        showCommentBar: false,
        //是否显示评论触发框
        showCommentTriggerInput: false,
        //存储未提交的评论内容
        saveComment: '',

        //页码
        pageSize: 20,
        pageNum: 1,

        //是否没有更多评论
        isNoMoreComment: false,
        //是否没有数据
        noneData:false,

        //当前用户信息
        user: {},
        //当前话题id
        topicId: this.props.location.query.topicId,

        //当前播放
        currentAudio: '',
        currentIndex: 0,

        //评论列表长度
        answerNum: 0,
        //是否评论成功
        commentSuccess: false,

        agreeOperation: true,

        //往期列表
        audioUrlList: [],
    }
    data = {
        //音频列表
        audioControllerList : []
    }

    componentDidMount() {
        this.getUserInfo();
        this.getInitAudioInfo();
        this.getNightAnswerList();
        this.getCommentList();
        this.showInputInitial();
        this.fetchAudioLocation();
        this.initShowList();
        setInterval(()=>{
            this.updateAudioLocation();
        },3000);
        this.initShare();
        fixScroll(".scroll-box");
        fixScroll(".show-container");
    }
    
    initShare() {
        let shareOption = {
            title: this.props.audioInfo.topic,
            desc: '咦？这里有个《夜答》，各路大神都来怼人放干货，一起听听吧！',
            imgUrl: 'https://img.qlchat.com/qlLive/liveComment/BVJKGME5-ISOQ-I4MB-1512542146768-882D8Z7JF1M2.png',
            url: window.location.href
        };

        share({
            title: shareOption.title,
            desc: shareOption.desc,
            imgUrl: shareOption.imgUrl,
            shareUrl: shareOption.url,
        });


        var ver = getQlchatVersion();
        if (ver && ver >= 360) {
            window.qlchat.onMenuShareWeChatTimeline({
                type: "link", // "link" "image"
                content: shareOption.url, // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
                title: shareOption.title,
                desc: shareOption.desc,
                thumbImage: shareOption.imgUrl // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
            });
            window.qlchat.onMenuShareWeChatFriends({
                type: "link", // "link" "image"
                content: shareOption.url, // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
                title: shareOption.title,
                desc: shareOption.desc,
                thumbImage: shareOption.imgUrl // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
            });
        }
    }
    //提交评论
    async confirmComment(inputText){
        const result = await this.props.addComment(this.state.topicId,inputText);
        if(result.state.code === 10001){
            window.toast(result.state.msg);
        }else if(result.state.code === 0){
            let comment = {
                id: result.id,
                userHeadImgUrl: this.state.user.headImgUrl,
                userId: this.state.user.userId,
                userName: this.state.user.name,
                content: inputText,
                createTime: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm'),
                likeNum: 0,
                isLiked: 'N'
            }
            this.state.commentList.unshift(comment)
            this.setState({
                commentList: this.state.commentList,
                commentSuccess: true,
                answerNum: this.state.answerNum+1
            })
            this.hideCommentComponent()
            window.toast('评论成功');
            document.querySelector('.night-answer-comment .comment-list').scrollIntoView();
        }
        
    }

    //初始音频获取
    async getInitAudioInfo(){
        if(!this.props.audioInfo){
            await this.props.getInitAudio(this.state.topicId)
        }
    }

    //初始精选回答获取
    async getNightAnswerList(){
        if(!this.props.audioAnswerList){
            await this.props.getInitAnswer(this.state.topicId)
        }
    }
    //获取往期
    async initShowList() {
        const result = await this.props.fetchFirstShowList(1,100);
        this.setState({
            audioUrlList: result
        })
    }
    //获取评论列表
    async getCommentList(){
        const commentResult = await this.props.getCommentList(
            this.state.topicId,
            this.state.pageSize,
            this.state.pageNum
        );
        // 初始数据不够分页，则结束分页加载更多
        if (this.commentResult && this.commentResult.list.length <= 0) {
            this.setState({
                noneData: true
            });
        }else{
            this.setState({
                commentList: commentResult.list,
                answerNum: commentResult.totalNum
            })
        }
    }

    //加载更多评论
    async loadMoreComment(next) {
        this.setState({
            pageNum: ++this.state.pageNum
        })

        const result = await this.props.getCommentList(
            this.state.topicId,
            this.state.pageSize,
            this.state.pageNum
        );

        next && next();

        // 是否没有更多
        if (result.list && result.list.length < this.state.pageSize) {
            this.setState({
                isNoMoreComment: true
            });
        }
        this.setState({
            commentList: this.state.commentList.concat(result.list)
        })

    }

    //获取当前用户信息
    async getUserInfo(){
        const result = await this.props.getUserInfo();
        this.setState({
            user: result
        })
    }

    //在内容少，不足以滚动的的情况下初始化显示触发框
    showInputInitial(){
        let clientH = document.body.clientHeight
        let offsetT = document.querySelector('.night-answer-comment').offsetTop
        // let scrollT = document.querySelector('.night-answer-container').scrollTop
        if(offsetT < clientH) {
            this.setState({
                showCommentTriggerInput: true
            })
        }
    }

    //页面滚动触发输入框的显示与隐藏
    containerScroll(){
        let offsetT = document.querySelector('.night-answer-comment').offsetTop
        if(offsetT < arguments[1] + arguments[2]) {
            this.setState({
                showCommentTriggerInput: true
            })
        }else{
            this.setState({
                showCommentTriggerInput: false
            })
        }
    }

    //隐藏往期
    hideHistory(){
        this.setState({
            showPast: false
        })
    }

    //显示往期
    showHistory(){
        if(this.state.audioUrlList&&this.state.audioUrlList.length>0){
            document.querySelector('.show-container li[data-log-id="'+this.state.topicId+'"]').scrollIntoView()
        }
        this.setState({
            showPast: true
        })
    }

    //隐藏评论框
    hideCommentComponent(txt){
        this.setState({
            showCommentBar: false,
            saveComment: txt
        })
    }

    //显示评论框
    showCommentComponent(){
        this.setState({
            showCommentBar: true
        });
        // document.querySelector('.comment-container textarea').focus()
    }

    //精选回答点赞与取消
    async agree(e){
        let tar = e.currentTarget;
        let type = tar.getAttribute("data-type");
        if(type === "active"){
            tar.setAttribute("data-type","unactive");
            let businessId = tar.getAttribute('data-id'),
                businessType = 'answer',
                numEle = tar.querySelector('.num'),
                num = parseInt(numEle.innerText,10),
                status;
            if (tar.classList.contains('like')){
                status = 'N'
                if(await this.props.like(businessId,businessType,status)){
                    tar.classList.remove('like')
                    numEle.innerText = --num
                    tar.setAttribute("data-type","active");
                }
            }else {
                status = 'Y'
                if(await this.props.like(businessId,businessType,status)){
                    tar.classList.add('like')
                    numEle.innerText = ++num
                    tar.setAttribute("data-type","active");
                }
            }
        }
        else{
            e.preventDefault()
        }
    }

    //初始化音频队列
    pushAudioControllerList(audioController){
		if(audioController && this.data.audioControllerList.indexOf(audioController) < 0){
			this.data.audioControllerList.push(audioController)
        }
    }
    //同时只能播放一个音频
    audioOnPlay(target){
		this.data.audioControllerList.forEach((audioController,index) => {
			if(audioController !== target){
                audioController.setAuto()
            }
        });
    }

    /* 自动播放下一条音频*/
    autoPlay(target){
		this.data.audioControllerList.map((audioController,index) => {
			if(audioController === target && this.data.audioControllerList.length !== index+1){
                this.data.audioControllerList[index+1].playAudio();
			}
        });
    }

    /* 获取本地记录的播放位置 */
    fetchAudioLocation() {
        const record = AudioLocationRecord.fetch(this.props.audioInfo.num);
        let act = false;
        if(record&&record.audioId){
            this.data.audioControllerList.map((audioController,index) => {
                if(audioController.props.topicId == record.audioId){
                    act = true;
                    audioController.playAudio();
                    findDOMNode(audioController).scrollIntoView(false)
                }
            });
            //找不到相关记录
            if(!act){
                this.data.audioControllerList[0]&&this.data.audioControllerList[0].playAudio();
            }
        }else{
            this.data.audioControllerList[0]&&this.data.audioControllerList[0].playAudio();
        }
    }

    //记录播放位置 
    updateAudioLocation() {
        const record = {
            audioId: null,
            issueNum: this.props.audioInfo.num,
        }
        this.data.audioControllerList.map((audioController,index)=>{
            if(audioController.state.playStatus === 'play'){
                record.audioId = audioController.props.topicId;
                AudioLocationRecord.update(record)
            }
        })
    }

    //老师头像链接跳转
    pageUrlRedirect(e){
        let tar = e.currentTarget
        let url = tar.getAttribute('data-url')
        if(url){
            locationTo(url)
        }else{
            e.preventDefault()
        }
    }

    render() {
        let nightAnswerList = this.props.audioAnswerList.map((item,index)=>{
            return (
                <div className="answer-list" key={`answer-list-${index}`}>
                    <img src={item.guest.headImgUrl} alt="头像" className="headImage" data-url={item.guest.pageUrl} onClick={this.pageUrlRedirect}/>
                    <div className="content">
                        <div className="content-title">
                            <span className="name">{item.guest.name}</span>
                            {item.guest.title&&
                                <span className="title">{item.guest.title}</span>
                            }
                        </div>
                        <div className="content-desc">{item.description}</div>
                        <FeaturedAnswerAudioPlayer 
                            ref={(audioController) => this.pushAudioControllerList(audioController)}
                            onPlay={this.audioOnPlay}
                            currentAudioUrl ={item.content}
                            second={item.second}
                            autoPlay={this.autoPlay}
                            topicId={item.id}
                        />
                    </div>
                    <div className={classnames('agree', {like: item.isLiked === 'Y'})} onClick={this.agree} data-id={item.id} data-type="active">
                        <span className="pic"></span>
                        <span className="num">{item.likeNum}</span>
                    </div>
                </div>
            )
        });
        return (
            <Page title={this.props.audioInfo.topic} className='night-answer-container'>
                <ScrollToLoad
                    className="scroll-box"
                    toBottomHeight={500}
                    noneOne={this.state.noneData}
                    loadNext={ this.loadMoreComment }
                    noMore={ this.state.isNoMoreComment }
                    scrollToDo = {this.containerScroll}>
                    <div className="main">
                        <div className='night-answer-audio-player'>
                            <img src={this.props.audioInfo.imageUrl} className="main-bg" />
                            <p className="main-article">{this.props.audioInfo.description}</p>
                            {
                                this.props.audioInfo.audioUrl?
                                <NightAnswerAudioPlayer
                                    ref={(audioController) => this.pushAudioControllerList(audioController)}
                                    currentAudioUrl ={this.props.audioInfo.audioUrl}
                                    num={this.props.audioInfo.num}
                                    topicId={this.props.audioInfo.id}
                                    second={this.props.audioInfo.second}
                                    showHistory = {this.showHistory}
                                    onPlay={this.audioOnPlay}
                                    autoPlay={this.autoPlay}
                                />
                                :<div className="des-con">
                                    <span>夜答第{this.props.audioInfo.num}期</span>
                                    <div className="history" onClick={this.showHistory}>
                                        <span className="icon"></span>往期
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="featured-answer-container">
                        <div className="title">
                            <span className="num">精选回答<span>{this.props.audioAnswerList.length}</span></span>
                        </div>
                        {
                            nightAnswerList
                        }
                    </div>
                    {
                        this.state.commentList&&
                        <Comment
                            commentList = {this.state.commentList}
                            like = {this.props.like}
                            num = {this.state.answerNum}
                        />
                    }
                </ScrollToLoad>
                <PastShow 
                    audioList = {this.state.audioUrlList}
                    show = {this.state.showPast}
                    hideHistory = {this.hideHistory}
                    topicId = {this.state.topicId}
                />
                {this.state.showCommentTriggerInput&&
                <div className='trigger-input-bar'>
                    <div>
                        <input type="text" className="trigger-input" placeholder="发表留言" onClick={this.showCommentComponent}/>  
                    </div>  
                </div>
                }
                {
                    this.state.showCommentBar&&
                    <CommentBar 
                        hide={this.hideCommentComponent}
                        complete = {this.confirmComment}
                        commentSuccess = {this.state.commentSuccess}
                        saveComment = {this.state.saveComment}
                    />
                }
            </Page>
        );
    }
}
function mapStateToProps (state) {
    return {
        audioInfo: state.nightAnswer.nightAnswerAudioInfo,
        audioAnswerList: state.nightAnswer.audioAnswerList,
    }
}

const mapActionToProps = {
    initNightAnswer,
    getInitAudio,
    getInitAnswer,
    getCommentList,
    getUserInfo,
    addComment,
    fetchFirstShowList,
    like,
}

module.exports = connect(mapStateToProps, mapActionToProps)(NightAnswer);
