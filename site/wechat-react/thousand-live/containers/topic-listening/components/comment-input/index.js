import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonTextarea from 'components/common-textarea';
import { locationTo } from 'components/util';
import SimpleControlDialog from "components/simple-control-dialog"

const Button = props => {
    const redirect = () => {
        locationTo(props.href)
    }

    let className = `option-button ${props.logPos} on-log on-visible`;

    return (
        <a className={className + ' ' + props.className}
            onClick={ props.href ? redirect : props.onClick }
            data-log-region={ props.logRegion }
            data-log-pos={ props.logPos }
        >
            <div className="icon-wrap">
                {
                    props.remaining > 0 && <div className="remaining">{`${10 - props.remaining}/10`}</div>
                }
                {
	                props.count > 0 &&
                    <div className="count">{props.count}</div>
                }
            </div>
            {
                props.redpoint && 
                    <aside className="red-point"></aside>
            }
            <span className="content">{ props.text }</span>
        </a>
    )
}


class CommentInput extends Component {
    render() {
        let {
            topicInfo,
            commentNumber = 0,
            sysTime = Date.now(),
            onCommentClick,
            jumpToChannelIntro,
            graphicCommentCount,
            isShowAppDownloadConfirmBtn,
            showAppDownloadConfirm,
            openInviteFriendsToListenDialog,
            shareBtnStatus,
            shareRemaining,
            canListenByShare,
            isFreePublicCourse,
            isNewsTopic,
            likeClick,
            likeObj,
            tipsShow = true,
        } = this.props;

        let style = '';
        switch (topicInfo.style) {
            case 'audio':
            case 'video':
            case 'normal':
            case 'ppt':
                style = 'interaction';
                break;
            
            default:
                style = 'comment';
        }

        // 领取了请好友免费听的课的用户的显示按钮
        if(canListenByShare){
            return (
                <div className={`footer-options listen-by-share`}>
                    <p>试听中，现在购买可解锁整个专辑</p>
                    <div className="listen-by-buy-btn" onClick={jumpToChannelIntro}>立即购买</div>
                </div>
            )
        }
        return (<div className={`footer-options clearfix${isShowAppDownloadConfirmBtn && shareBtnStatus ? ' column' : ''}`}>
            {
                isShowAppDownloadConfirmBtn &&
                <Button 
                    text='后台播放' 
                    onClick={showAppDownloadConfirm}
                    logRegion="option-btn"
                    logPos="app-download-btn"
                />
            }
            {   isNewsTopic?
                <Button 
                    className = {tipsShow?'show-tips':''}
                    text={`${likeObj && likeObj.likes?'觉得有用' : '有用' } `}
                    onClick={likeClick}
                    logRegion="option-btn"
                    logPos={`${likeObj && likeObj.likes?'active-like': 'like'} `}
                    count = {likeObj.likesNum ? ( likeObj.likesNum + topicInfo.likeNum ):0 }
                /> 
                :
                (
                    shareBtnStatus === 'share' ? 
                    <Button 
                        text='分享'
                        href = { `/wechat/page/sharecard?type=topic&topicId=${topicInfo.id}&liveId=${topicInfo.liveId}` }
                        onClick={likeClick}
                        logRegion="option-btn"
                        logPos="share"
                    /> : 
                    (
                        shareBtnStatus === 'invite' ?
                        <Button 
                            text='请好友听' 
                            onClick={openInviteFriendsToListenDialog}
                            logRegion="voice-simple"
                            logPos="invite-listen"
                            remaining = {shareRemaining}
                        /> : null
                    )
                )
                
            }

            
            {
                style === 'interaction' ? 
                    <Button
                        text='互动模式' 
                        redpoint={ topicInfo.status === 'beginning' && sysTime < (topicInfo.startTime + 7200000) } 
                        onClick={ onCommentClick.bind(null, 'interaction') }
                        logRegion="option-btn"
                        logPos="interaction"
                    />
                    :
                    <Button
                        text={isFreePublicCourse?'留言':'评论'}
                        onClick={ onCommentClick.bind(null, 'comment') }
                        logRegion="option-btn"
                        logPos="comment"
                        count={graphicCommentCount}
                    />
            }
            <Button
                text='更多'
                onClick={() => { this.controlDialog.show()}}
                logRegion="option-btn"
                logPos={ 'more' }
                logVisible={ true }
            />

            <SimpleControlDialog 
                ref={r=>this.controlDialog = r}
                topicId={topicInfo.id}
                topicInfo={topicInfo}
                power = {this.props.power}
            
            />
        </div>
        );
    }
}

CommentInput.propTypes = {

};


export default CommentInput;