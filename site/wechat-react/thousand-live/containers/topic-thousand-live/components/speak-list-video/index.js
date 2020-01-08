import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {imgUrlFormat} from 'components/util';
import Detect from 'components/detect';
import {TextItem,ImageItem,BannedTip,Reword,Prompt,InviteItem,FinishTopicTip, Redpack, CourseCardItem} from './speak-msg-item'
import {Outline} from './speak-msg-outline'
import AudioItem from './speak-msg-audio'
import SendingAudioItem from './speak-msg-audio-sending'
import FileItem from './speak-msg-file';
import VideoItem from './speak-msg-video';
import NotSupportMsg from './speak-msg-not-support';
import { autobind } from 'core-decorators';
import FistDefault from './speak-msg-first-default';
import WhisperItem from './speak-msg-whisper';
import AppDownload from './speak-msg-app-download';
import animation from 'components/animation'
import VideoMp4Item from './speak-msg-video-mp4'

@autobind
class SpeakListVideo extends PureComponent {
    data={
        redPackNum:'',
        showRedPackCouponCard:false,
    }
 
    // 判断是否显示禁言按钮
    judgeShowBanBtn = ({ power: { allowMGLive }, userId, createBy, creatorRole, liveRole }) => {
        // 当且仅当其身份为直播间创建者或管理员时，可ban除其以外的发言者，管理员只可ban听众
        return (userId != createBy) && allowMGLive && (liveRole === 'creator' ? true : creatorRole !== 'topicCreater' && creatorRole !== 'manager');
    }

    dangerHtml(content){
        if (content) {
            content = content.replace(/\</g, (m) => "&lt;");
            content = content.replace(/\>/g, (m) => "&gt;");
            content = content.replace(/(&lt;br(\/)?&gt;)/g, (m) => "\n");
        }

        return { __html: content }
    };

    scrollToItem(id){
        let index;
	    this.props.forumSpeakList.forEach(function(speak, i){
	        if(speak.id === id) index = i
        });
	    animation.add({
		    startValue: this.props.topicListContainer.scrollTop,
		    endValue: this.refs[`forum-item-${index}`].getOffsetTop() - this.props.topicListContainer.offsetTop,
		    step: (v) => {
			    this.props.topicListContainer.scrollTop = v;
		    }
	    });

    }

    imgView(imgUrl) {
        let imgSize = '?x-oss-process=image/resize,h_1600,w_1600';
        let imgSrcList = [];
        this.props.forumSpeakList.forEach((speakItem) => {
            if (speakItem.type === 'image') {
                imgSrcList.push(speakItem.content + imgSize);
            }
        })
        window.showImageViewer(imgUrl + imgSize ,imgSrcList);
    }


    /**
     * 判断是否上麦
     *
     * @param {any} props
     * @returns
     *
     * @memberof SpeakListVideo
     */
    isMicMsg(props) {
        if (typeof(props.type) == 'undefined' || typeof(props.creatorRole) == 'undefined') {
            return;
        }
        if (/(mic\-text|mic\-audio)/.test(props.type)) {
            // 非音视频话题，C端发言必须是mic,类型上可直接区分是否主讲人等。 另一个是当时C端发言功能时，APP还没上线，不能显示该类型。
            return true ;
        }
        if (/(doc|video|start-default|app-download)$/.test(props.type)) {
            return false;
        }
        if (/(text|audio|image)$/.test(props.type) && !/(audio|video)/.test(this.props.topicStyle)) {
            return false;
        }
        if (props.creatorRole == "visitor") {
            return true ;
        }
        if (!props.creatorRole && props.creatorRole != '') {
            return true;
        }
        return false;
    }

    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }



    /** 课堂红包-新用户发放优惠券设置 */
    redPackCouponCard(showRedPackCouponCard){
        return (showRedPackCouponCard?
        <div className="red-pack-coupon-card" onClick={()=>{this.props.locationToCoupon()}}>
            <div className="top">
                <div className="t-right">
                    <div className="title">设置优惠券，让红包效果更好！</div>
                    <div className="tips">新用户访问课程时，会向TA发放当前课程的优惠券~</div>
                </div>
            </div>
            <div className="btn">{!!this.props.isCouponOpen?(this.props.couponCount<50?`当前剩余优惠券${this.props.couponCount}张，立即设置`:""):'当前没有可用优惠券，请打【显示优惠码】'} <i className="icon_enter"></i></div>
        </div>
        :null);
    }

    render() {
        var {delSpeakIdList} = this.props;
        
        delSpeakIdList = delSpeakIdList || [];
        var forumSpeakList = this.props.forumSpeakList.map((speakItem,index)=>{
            let newProps = { ...this.props };
            speakItem.liveId = newProps.liveId;
            speakItem.topicId = newProps.topicId;
            // 初始化是否显示禁言按钮
            speakItem.showBanBtn = !!this.judgeShowBanBtn({...newProps, ...speakItem});
            newProps.isMicMsg = this.isMicMsg;
            delete newProps['forumSpeakList'];
            if (!/(audio)/gi.test(speakItem.type)) {
                delete newProps['playStatus'];
                delete newProps['playSecond'];
                delete newProps['audioUrl'];
                delete newProps['audioDuration'];
                delete newProps['playAudio'];
                delete newProps['pauseAudio'];
                delete newProps['setAudioSeek'];
                delete newProps['recordReaded'];
                delete newProps['isPlayingUrl'];
                delete newProps['audioLoading'];
            }
            // 性能？
            if (delSpeakIdList.length) {
                for (let i of delSpeakIdList) {
                    if (i == speakItem.id) {
                        return <div className="speak-placeholder"></div>;
                    }
                }
            }
            if(this.props.power.allowSpeak
                &&(
                    (!this.props.topicInfo.channelId&&this.props.topicInfo.type === 'charge')
                    ||
                    (this.props.topicInfo.channelId&&this.props.channelCharge[0]&&this.props.channelCharge[0].amount>0)
                )
                &&!this.props.isCampCourse
                &&(!this.props.isCouponOpen||this.props.couponCount<50)
                &&speakItem.type==='red_envelope'
                &&(!this.data.showRedPackCouponCard|| this.data.redPackNum == index)
            )
            {
                this.data.showRedPackCouponCard= true;
                this.data.redPackNum = index;
            }

            switch(speakItem.type){
                case 'mic-text' :
                case 'text' :
                    return [<TextItem
                                key = {`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...newProps}
                                {...speakItem}
                                dangerHtml = {this.dangerHtml}
                                />]
                case 'image' :
                    return ( <ImageItem
                                key = {`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...newProps}
                                {...speakItem}
                                imgView = {this.imgView}
                                /> )
                case 'mic-audio' :
                case 'audio' :
                    return (
                        <AudioItem
                            key = {`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            {...newProps}
                            {...speakItem}
                        />
                    )
                case 'sending-audio' :
                    return (
                        <SendingAudioItem
                            key = {`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            {...newProps}
                            {...speakItem}
                        />
                    )
                case 'bannedTip':
                    return (<BannedTip
                                key = {`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                isBanned = {speakItem.isBanned}
                                />)
                case 'finishTopicTip' :
                    return (
                        <FinishTopicTip key={`forum-item-${speakItem.id}`} ref = {`forum-item-${speakItem.id}`} />
                    );
                case 'redpacket' :
                    return(
                        <Reword
                            key={`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            {...newProps}
                            {...speakItem}
                        />
                    )
                case 'red_envelope' :
                    return(
                        [<Redpack 
                            key={`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            {...newProps}
                            {...speakItem}
                        />,this.redPackCouponCard(this.data.redPackNum == index)]
                    )
                case 'end' :
                    return (
                        <div
                            key={`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            >
                            <Prompt
                                {...speakItem} 
                            />
                        </div>
                        
                    )
                case 'prompt' :
                    return(
                        <Prompt
                            key={`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            {...speakItem}
                        />
                    )
                case 'inviteAdd' :
                    return(
                        <InviteItem
                            key={`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            {...speakItem}
                        />
                    )
                case 'doc':
                    if (this.isWeapp) {
                        return (
                            <NotSupportMsg 
                                key={`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...speakItem}
                                {...newProps}
                            />
                        )
                    } else {
                        return (
                            <FileItem
                                key={`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...speakItem}
                                {...newProps}
                            />
                        );
                    }
                case 'video':
                    if (this.isWeapp) {
                        return (
                            <NotSupportMsg 
                                key={`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...speakItem}
                                {...newProps}
                            />
                        )
                    } else {
                        return (
                            <VideoItem
                                key={`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...speakItem}
                                {...newProps}
                            />
                        )
                    }
                case 'topic-video' :
                    return ( <VideoMp4Item
                                key = {`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...newProps}
                                {...speakItem}
                                dangerHtml = {this.dangerHtml}
                                /> )
                case 'start-default':
                    return (
                        <FistDefault
                            key={`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            {...newProps}
                            {...speakItem}
                        />
                        
                    );
                case 'app-download':
                    if (this.isWeapp) {
                        return (
                            <NotSupportMsg 
                                key={`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...speakItem}
                                {...newProps}
                            />
                        )
                    } else {
                        return (
                            <AppDownload
                                key={`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...newProps}
                                {...speakItem}
                            />
                        )
                    }
                case 'whisper':
                    // 私问显示提问者头像
                    speakItem.speakCreateByHeadImgUrl = speakItem.commentcreateByHeadImgUrl;
                    return (
                        <WhisperItem
                            key={`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            {...newProps}
                            {...speakItem}
                            isWhisper={true}
                            isRight={true}
                        />
                    );
                case 'outline' :
                    return ( <Outline
                                key = {`forum-item-${speakItem.id}`}
                                ref = {`forum-item-${speakItem.id}`}
                                {...newProps}
                                {...speakItem}
                                dangerHtml = {this.dangerHtml}
                                /> )
                case 'image-text-card':
                    return (
                        <CourseCardItem
                            key = {`forum-item-${speakItem.id}`}
                            ref = {`forum-item-${speakItem.id}`}
                            {...newProps}
                            {...speakItem}
                            />
                    )
                default:
                    return;
            }
        }).filter(item => item);

        // 列表非空时才渲染，避免与播放页右侧按钮重叠
        return forumSpeakList && !!forumSpeakList.length && (
            <div className={`topic-list-container ${this.props.hasMinHeight?'min-scroll-h':''}`} ref="topic-list-container" >
                {forumSpeakList}
            </div>
        );
    }
}

SpeakListVideo.propTypes = {
    // 赞赏按钮点击
    onRewardClick: PropTypes.func.isRequired,
    // 发言列表
    forumSpeakList: PropTypes.array.isRequired,
    // 权限
    power: PropTypes.object.isRequired,
    // 点击回复评论
    onFeedback: PropTypes.func.isRequired,
    topicType: PropTypes.string,
    topicInfo: PropTypes.object.isRequired,
};

export default SpeakListVideo;
