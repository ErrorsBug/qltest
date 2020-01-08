import React, { PureComponent } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { autobind, debounce, throttle } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
import animation from 'components/animation'
import { Confirm} from 'components/dialog';
import classNames from 'classnames';
import CommentListItem from './comment-list-item';
import CommentInput from './comment-input';
import AudioTip from './audio-tip'
import { normalFilter} from 'components/util';
import CommonTextarea from 'components/common-textarea';
import { fixScroll } from 'components/fix-scroll';
import CreateLiveHelper from "components/create-live-helper";
import ShareConfigSwitch from '../../../../components/share-config-switch';
import { apiService } from 'components/api-service/index';

@autobind
class CommentList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isNoMore: false, //是否还有更多
	        showAudioTip: false,
            transitionEnter: false,
            inputText:'',
            cachedCommentList: [],
            commentLength: 20,
        }
    }


    componentWillMount() {
        this.props.updateCommentIndex(0);
        this.enableTransition();
    }


    componentDidMount() {
        fixScroll(".comment-scroll-box");
        // if (this.props.gotComments) {
        //     this.setState({
        //         cachedCommentList: this.props.commentList.slice(0, 30)
        //     });
        // }

	    setTimeout(() => {
		    typeof _qla != 'undefined' && _qla.collectVisible();
		    typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
	    }, 1000);
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.gotComments && !this.state.cachedCommentList) {
        //     this.setState({cachedCommentList: nextProps.commentList.slice(0, 30)});
        // }
    }
 
    // 判断是否显示禁言按钮
    judgeShowBanBtn = ({ power: { allowMGLive }, userId, createBy, createRole, liveRole }) => {
        // 当且仅当其身份为直播间创建者或管理员时，可ban除其以外的发言者，管理员只可ban听众
        return (userId != createBy) && allowMGLive && (liveRole === 'creator' ? true : createRole !== 'creater' && createRole !== 'manager');
     }

    async loadNextComments(next) {
        this.disableTransition();
        const { commentLength } = this.state;
        const { commentIndex, commentList, topicId, liveId} = this.props;
        // console.log(commentList.length,commentIndex,commentLength);
        if (commentIndex + commentLength  + 20 <= commentList.length) {
            console.log(1);
            this.setState({commentLength: commentLength + 20})
        } else {
            console.log(2);
            const lastIndex = commentList.length - 1;
            const timestamp = commentList[lastIndex].createTime;
            const result = await this.props.fetchCommentList(topicId, liveId, timestamp, 'before');
            this.setState({commentLength: commentList.length - commentIndex + result.length});
            if (result.length < 10) {
                this.setState({
                    isNoMore: true,
                })
            }

        }


        next&&next();
    }

    onReceiveAudioErrorMsg(getResult = false) {
        if (getResult) {
            if (sessionStorage.getItem('audioTipShowed') || this.props.power.allowSpeak || this.props.power.allowMGLive) {
                return false;
            } else {
                return true;
            }

        } else {
            sessionStorage.setItem('audioTipShowed','yes');
            this.setState({
                showAudioTip: true
            });

        }

	}

    scrollMsgToView(index = 0, withAnimation){
        let msgDom = document.getElementsByClassName("comment-list-item")[index];
        if (!msgDom) {
            return;
        }
        let scrollBox = this.scrollContainerRef;
	    if(withAnimation){
		    animation.add({
			    startValue: scrollBox.scrollTop,
			    endValue: msgDom.offsetTop - scrollBox.offsetTop,
			    step: (v) => {
				    scrollBox.scrollTop = v;
			    }
		    });
	    }else{
		    setTimeout(function(){
			    msgDom.scrollIntoView(true);//自动滚动到视窗内
		    },300)
	    }

    }

    enableTransition() {
        this.setState({
            transitionEnter: true,
        });
    }

    disableTransition() {
        this.setState({
            transitionEnter: false,
        });
    }

    inputOnChange(e){
        this.setState({
            inputText:e.target.value
        })
    }
    showReplyBox(){
        this.replyCommentDialog.show();
    }

	focusCommentInput(replyCommentTargetItemRef){
        this.commentInputRef.focus();
        if(replyCommentTargetItemRef){
	        const boundingBottomDiff = this.scrollContainerRef.getBoundingClientRect().bottom - replyCommentTargetItemRef.getBoundingClientRect().bottom;
	        this.scrollContainerRef.scrollTop = this.scrollContainerRef.scrollTop - boundingBottomDiff;
        }
    }

    handleListTouchStart() {
        this.props.setCommentCacheModel(true);
        this.disableTransition();
    }

    async closeCacheModel() {
        this.props.setCommentCacheModel(false);
        this.enableTransition();
        await this.setState({
            commentLength: 20,
        })
        await this.props.updateCommentIndex(0);
        this.scrollMsgToView(0, true);
        this.setState({ isNoMore: false })
    }


    async replyCommentAndExpose (tag){
        if(tag == 'confirm'){
            let content = this.state.inputText;
            let commentId = this.props.feedbackTarget.id;
            // 上墙时同时发一条评论回复
            const [addSpeakRes, addCommentRes] = await Promise.all([
	            this.props.addTopicSpeak('text', normalFilter(content)),
	            this.props.addTopicComment(normalFilter(content), 'N')
            ]);
            if(addSpeakRes.state.code === 0){
                window.toast('上墙成功');
                this.setState({
                    inputText:''
                })
                this.replyCommentDialog.hide();
                this.props.updateCommentList(commentId,'isReplay','Y');
            }
        }
    }

	replyCommentDialogCloseHandle(){
		this.props.clearFeedback();
    }

    replyCommentDialog;
    
    render() {
        const { commentIndex } = this.props;
        const { commentLength } = this.state;
        console.log(commentIndex, commentLength);
        console.log('length: ', this.props.commentList.length);
        const comments = this.props.commentList.slice(commentIndex, commentIndex +  commentLength).map((comment, index, arr) => {
            return (
                <CommentListItem
                    index = {index}
                    key={ comment.id }
                    id={ comment.id }
                    createByHeadImgUrl={ comment.createByHeadImgUrl }
                    createByName={ comment.createByName }
                    createBy={comment.createBy}
                    createRole={ comment.createRole }
                    createTime={ comment.createTime }
                    createTimeView={ comment.createTimeView }
                    parentId={comment.parentId}
                    parentComment={ comment.parentCommentPo }
                    content={ comment.content }
                    isQuestion={ comment.isQuestion}
                    topicCreateBy={ this.props.topicCreateBy }
                    userId={ this.props.userId }
                    commentCreateBy = { comment.createBy }
                    deleteComment = { this.props.deleteComment }
                    deleteBarrageItem = { this.props.deleteBarrageItem }
                    topicId = { this.props.topicId }
                    bannedToPost = { this.props.bannedToPost }
                    liveId = { this.props.liveId }
                    isVip={comment.isVip}
                    power={this.props.power}
                    isReplay={comment.isReplay}
                    onFeedback={this.props.onFeedback}
                    topicStatus={this.props.topicStatus}
                    showReplyBox={this.showReplyBox}
                    focusCommentInput={this.focusCommentInput}
                    commentType={comment.commentType}
                    showBanBtn = {!!this.judgeShowBanBtn({...this.props, ...comment})}
                />
            );
        });

        const commentListClass = classNames({
            'comment-list': true,
        });
        console.log(this.props.isHasLive);
        return (
            <div className={ commentListClass }>
                <div className="blank-area" onClick={this.props.hideCommentList} />
                <div className="list-box" ref="listBox" onTouchStart={this.handleListTouchStart} onWheel={this.handleListTouchStart}>
                    <div className="header" >
                        全部评论
                        <span className="discuss">{this.props.commentNum}</span>
                        <div className="close-btn icon_delete" onClick={this.props.hideCommentList}></div>
                    </div>
                    {
                       this.props.openCacheModel && commentIndex > 0 ?
                        <div className="new-comment icon_up_2" onClick={this.closeCacheModel}>{commentIndex}条新消息</div> :
                        null
                    }
                    <ScrollToLoad
                        className={["comment-scroll-box", this.props.power.allowMGLive ? 'with-siwtch' : null].join(' ')}
                        ref={r => this.scrollContainerRef = r}
                        toBottomHeight={300}
                        noneOne={ this.props.commentList.length === 0 }
                        notShowLoaded = {false}
                        loadNext={ this.loadNextComments }
                        noMore={ this.state.isNoMore } >
                        {!(this.props.power.allowSpeak || this.props.power.allowMGLive || this.props.isLiveAdmin === 'Y' || !this.props.isShowQl)&&<CreateLiveHelper chtype={`create-live_${this.props.topicStyle=='normal'?'chair':this.props.topicStyle}`} getHasLive={this.props.getHasLive} isHasLive={this.props.isHasLive} />}
                        <ReactCSSTransitionGroup
                            transitionName="thousand-live-animation-commentListItem"
                            transitionEnterTimeout={350}
                            transitionLeaveTimeout={350}
                            transitionEnter={this.state.transitionEnter}
                            transitionLeave={false}
                        >
                            {
                                this.props.power.allowMGLive &&
                                <ShareConfigSwitch
                                    className="share-config-switch-box"
                                    flag={this.props.shareCommentConfigFlag}
                                    topicId={this.props.topicId}
                                    onSwitch={this.props.onShareCommentSwitch}
                                />
                            }
                            { comments }
                        </ReactCSSTransitionGroup>
                    </ScrollToLoad>
                </div>
                <CommentInput
                    ref={r => this.commentInputRef = r}
                    addTopicComment={this.props.addTopicComment}
                    liveId={this.props.liveId}
                    topicId={this.props.topicId}
                    onReceiveAudioErrorMsg={this.onReceiveAudioErrorMsg}
                    scrollMsgToView={this.scrollMsgToView}
                    topicStatus={this.props.topicStatus}
                    mute={this.props.mute}
                    enableTransition={this.enableTransition}
                    closeCacheModel={this.closeCacheModel}
                    openCacheModel={this.props.openCacheModel}
                    feedbackTarget={this.props.feedbackTarget}
                    clearFeedback={this.props.clearFeedback}
                />
                {
                    this.state.showAudioTip?
                        <AudioTip/>
                    :null
                }



                {/*回复评论弹框*/}
                <Confirm
                    ref = {node => this.replyCommentDialog = node}
                    buttons = 'cancel-confirm'
                    confirmText = '发送'
                    onBtnClick = {this.replyCommentAndExpose}
                    onClose = {this.replyCommentDialogCloseHandle}
                >
                    <main className='reply-comment-dialog'>
                        <CommonTextarea
                            placeholder={this.props.feedbackTarget?'回复：'+ this.props.feedbackTarget.name :'来说点什么...'}
                            value = {this.state.inputText}
                            ref='replyCommnetText'
                            onChange={this.inputOnChange}
                            autoFocus = {true}
                        />
                    </main>
                </Confirm>
            </div>
        );
    }
}

CommentList.propTypes = {

};

CommentList.defaultProps = {
    // commentList: [],
    // commentNum: 0,
}

export default CommentList;
