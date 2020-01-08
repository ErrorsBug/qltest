import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { imgUrlFormat } from 'components/util';
import { eventLog } from 'components/log-util';
import { getQlchatVersion} from 'components/envi';
import { autobind } from 'core-decorators';
import dayjs from 'dayjs';
import LazyImage from '../lazy-image';
import classnames from 'classnames';
import Detect from 'components/detect';

import { doLike } from 'thousand_live_actions/thousand-live-common';
import { bannedToPost, deleteComment } from 'thousand_live_actions/thousand-live-normal';

const dangerHtml = content => {
    if(content){
        content = content.replace(/\</g, (m) => "&lt;");
        content = content.replace(/\>/g, (m) => "&gt;");
    }

    return { __html: content }
};

@autobind
class SpeakMsgContainer extends PureComponent {
    state = {}

    isMicObj = {
        type: this.props.type,
        creatorRole: this.props.creatorRole,

    }

    componentDidMount(){
        // 监听点击事件以关闭展开的评论菜单项
        window.addEventListener('click', e => {
            const { id } = this.props;
            const { showManagement } = this.state;
            const target = document.querySelector(`.action-btn[data-id='${id}']`);
            const isOtherTarget = target && !target.contains(e.target)
            isOtherTarget && showManagement && this.setState({
                showManagement: false
            })
        }, true);
    }

    /**
     * 头像
     *
     * @returns Element
     *
     * @memberOf SpeakMsgContainer
     */
    headBox() {
        let {
            createBy,
            speakCreateByHeadImgUrl,
            headImgUrl = '',
            name,
            isRight,
            onRewardClick,
            isEnableReward = 'N',
        } = this.props;

        const data = this.props;

        // 音视频不统一
        if( headImgUrl ){
            speakCreateByHeadImgUrl = headImgUrl;
        }

        return (
            <span
                className = "head-box"
            >
                {
                    isRight?
                    <LazyImage className="speak-head" 
                               onClick={this.onOpenTitleMenu}        
                               src={` ${imgUrlFormat(speakCreateByHeadImgUrl,'?x-oss-process=image/resize,h_60,w_60,m_fill')}`} 
                               alt=""/>
                    :
                    <LazyImage className="speak-head" 
                               onClick={this.onOpenTitleMenu}        
                               src={` ${imgUrlFormat(speakCreateByHeadImgUrl,'?x-oss-process=image/resize,h_120,w_120,m_fill')}`} 
                               alt=""/>
                }
                {
                    (!isRight && isEnableReward == 'Y' &&  !this.props.isMicMsg(this.isMicObj) && !getQlchatVersion()&&!(this.isWeapp&&Detect.os.ios)) ?
                        <b className="btn-like-tip on-log"
                            onClick={this.onRewardFun}
                            data-log-region="speak-list"
                            data-log-pos="reward-btn"
                            >
                            赏
                        </b>: null
                }
            </span>
        );
    }

    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    onRewardFun() {
        this.props.onRewardClick(this.props.createBy, this.props.speakCreateByHeadImgUrl||this.props.headImgUrl, this.props.speakCreateByName || this.props.name);
    }

    onOpenTitleMenu(e) {
        if (!this.props.isRight) {
            if (this.props.createBy == this.props.userId && this.props.openTitleMenu) {
                this.props.openTitleMenu();
            }
        }
    }

    /**
     * 名字和头衔
     *
     * @returns Element
     *
     * @memberOf SpeakMsgContainer
     */
    nameBox() {
        return (
            <div className="name">
                <b dangerouslySetInnerHTML={dangerHtml(this.props.name||this.props.speakCreateByName)}></b>

                {!this.props.isMicMsg(this.isMicObj) && this.props.inviteListArr &&  (this.props.inviteListArr[this.props.createBy] ? this.props.inviteListArr[this.props.createBy].title : '')}

                {
                    (this.props.relateType === 'comment') ?
                        <var className='blue' dangerouslySetInnerHTML={dangerHtml('  回复: ' + this.props.relateName)}></var>
                    :(this.props.commentId && !this.props.commentCreateByName && !this.props.redpack) ? // 新增一个判断条件（this.props.redpack）,因为红包的信息流用的是commentId，所以每次都会出现这个回复信息
                        <var className='blue' dangerouslySetInnerHTML={dangerHtml('  回复: ' + this.props.commentId)}></var>
                        /* 判断是否回复上麦 commentId为人名，commentCreateByName为空*/
                    :(this.props.isReplyQuestion == 'Y' && this.props.type == 'audio') ?
                        <var className='blue' dangerouslySetInnerHTML={dangerHtml('  回复: ' + this.props.commentCreateByName)}></var>
                        /* 语音回复问题区*/        
                    : null
                }
            </div>
        );
    }

    
    /**
     * 禁言并撤回功能
     * 
     * 如果撤回的不是有发言权限的人，文案提示不一样
     * 
     * @memberof SpeakMsgContainer
     */
    async onRevoke(e){
        e.stopPropagation();

        let isDeleteVisit = this.props.power.allowMGTopic && !/(compere|guest|topicCreater)/.test(this.props.creatorRole) && /(mic-text|mic-audio)/.test(this.props.type);
        let name = this.props.name||this.props.speakCreateByName;
        let msg = isDeleteVisit?
                    ' 确定删除'+name+'的消息吗？'
                    : '确定删除消息吗？';
        let cancelText =  isDeleteVisit?'删除并禁言':'取消';
        let confirmText = isDeleteVisit?'仅删除消息':'确定';
        
        let revokeResult;
        window.confirmDialog(
            msg, 
            async ()=>{
                revokeResult = await this.props.revokeForumSpeak(this.props.createBy, this.props.id, this.props.liveId, this.props.topicId);
                sendRevokeResult();
            }, 
            async ()=>{
                if (isDeleteVisit){
                    revokeResult = await this.props.revokeForumSpeak(this.props.createBy, this.props.id, this.props.liveId, this.props.topicId);
                    let bannedResult = await this.props.liveBanned(this.props.createBy,'Y', this.props.liveId, this.props.userId);
                    sendRevokeResult();
                }
            }, 
            '' , 
            'cancel-confirm', 
            {
            confirmText: confirmText,
            cancelText: cancelText,
            }
        )

        
        let sendRevokeResult = () => {
            // 日志打印
            if (revokeResult) {
                if (revokeResult.state && revokeResult.state.code == 0) {
                    // 打印撤回成功日志
                    eventLog({
                        category: 'speak-revoke',
                        action: 'success',
                        revokeId: this.props.id,
                        type: this.props.type,
                    });
                } else {
                    // 打印撤回失败日志
                    eventLog({
                        category: 'speak-revoke',
                        action: 'failed',
                        revokeId: this.props.id,
                        type: this.props.type,
                    });
                }
            }
        }

        


    }

    /**
     * 撤回按钮
     * allowDelSpeak: 是否可以撤回： 管理员 创建者 均为true
     * userId: 用户ID
     * createBy: 创建者
     * allowSpeak 对否允许发言
     * isRight: 用户上墙
     * 判断条件：
     *    结束与未结束：
     *      1.话题未结束，嘉宾已删除，被删除嘉宾不能撤回之前的发言。
            2.话题已结束，嘉宾，用户不能撤回发言，只有管理员、创建者可以撤回
     */
    renderRevoke() {
        const {
            createBy,
            userId,
            power,
            isRight,
            isEnd
        } = this.props
        const revoke = (
            <span
                className="btn-revoke on-log"
                data-log-region="speak-list"
                data-log-pos="revoke-btn"
                onClick={this.onRevoke}
            >
                删除
            </span>
        )
        // 拥有绝对权限 管理员 创建者
        if (power.allowDelSpeak || userId == createBy) {
            return revoke
        }
    }
    /**
     * 发言的底下显示，包括点赞，多少人喜欢，撤回按钮
     *
     * @returns Element
     *
     * @memberOf SpeakMsgContainer
     */ 
    revokeBox() {
        const {
            createBy,
            id,
            power,
            userId,
            isRight,
            name,
            isWhisper,
            onWhisperQuestionClick,
            isShowBottomBar = true,
            likesNum,
            isLikes,
            topicStyle,
            type,
            hideFavor = false,
            redpack = false,
        } = this.props;
        // 如果是红包的信息流这一行都不显示
        if(redpack === true){
            return null
        }
        if (isWhisper) {
            return (
                <div className="control-box">
                    <span className='whisper-badge'>私问</span>
                </div>
            )
        } else if (isShowBottomBar) {
            
            return (
                <div className="control-box">
                    {
                        (!/(audio|video)/.test(topicStyle) && !hideFavor) ?
                        <span className={"on-log btn-like icon_praise " + (isLikes ? 'action' : '')}
                            onClick={this.onZan.bind(this, isLikes)}
                            data-log-region="speak-list"
                            data-log-pos="like-btn"
                            >
                            { likesNum == 0 ? null : likesNum }
                        </span>
                        :null
                    }
                    {
                    // this.renderRevoke()
                       this.renderActionBtn()
                    }
                </div>
            );
        }

    }

    renderActionBtn = () => {
        const {
            creatorRole,
            userId,
            createBy,
            power: {
                allowMGLive
            },
            showBanBtn
         } = this.props;

        return (
            ((allowMGLive && creatorRole !== 'topicCreater') || createBy == userId) && (
                <div className="action-btn" onClick={this.triggerManageBox} data-id={this.props.id}>
                    {
                        !!this.state.showManagement &&
                        <div className="manage-box">
                            {
                                showBanBtn && <span className="mute" onClick={this.muteUserById}>禁言</span>
                            }
                            {
                                this.renderRevoke()
                            }
                        </div>
                    }
                </div>
            )
        )
    }

    triggerManageBox(e) {
        e.stopPropagation();
        this.setState({
            showManagement: !this.state.showManagement,
        });
    }

    muteUserById(e) {
        e.stopPropagation();
        window.confirmDialog(
            '确定禁言吗？',
            async () => {
                const res = await this.props.bannedToPost(this.props.createBy, 'Y', this.props.liveId, false);
                if (res.state.code == 0) {
                    window.toast(res.state.msg);
                    this.props.revokeForumSpeak(this.props.createBy, this.props.id, this.props.liveId, this.props.topicId);
                }
                else {
                    window.toast(res.state.msg);
                }
            }
        );
        this.setState({
            showManagement: false,
        });
    }

    /**
     * do 点赞
     *
     *
     * @memberof SpeakMsgContainer
     */
    async onZan(isLikes) {
        if(isLikes) return;
	    // console.log(this.props.id);
        await this.props.doLike(this.props.id);
    }

	getOffsetTop(){
		return this.refs['speak-container'].offsetTop;
    }


    render() {
        const currentTime = (typeof(this.props.createTime) === 'object') ? this.props.createTime.time : this.props.createTime;

        const speakContainerClass = classnames(
            'speak-container',
            this.props.className,
            {
                right: this.props.isRight || this.props.isMicMsg(this.isMicObj),
                isGold: Number(this.props.likesNum) >= Number(this.props.likesSet)
            }
        );

        return (
            <div ref="speak-container" className = {speakContainerClass}>
                {
                    this.props.showTime && <div className = "date-bar">{ dayjs(Number(currentTime)).format('MM-DD HH:mm') }</div>
                }
                {
                    (this.props.isRight || this.props.isMicMsg(this.isMicObj) )
                    ?
                    <div className = "speak-flex-main">
                        <span className="flex-box">
                            <span className="msg-box">
                                {this.nameBox()}
                                {this.props.children}
                                {this.revokeBox()}
                            </span>
                        </span>
                        {this.headBox()}
                    </div>
                    :
                    <div className = "speak-flex-main">
                        {this.headBox()}
                        <span className="flex-box">
                            <span className="msg-box">
                                {this.nameBox()}
                                {this.props.children}
                                {this.revokeBox()}
                            </span>
                        </span>
                    </div>

                }

            </div>
        );
    }
}

SpeakMsgContainer.propTypes = {
    // 赞赏按钮点击
    onRewardClick: PropTypes.func.isRequired,
    // 发言时间
    createTime: PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    // 头衔
    userTitle: PropTypes.string,
    // 权限
    power: PropTypes.object,
    // 是否私问消息
    isWhisper: PropTypes.bool,
};


const mapActionToProps = {
    doLike,
    bannedToPost,
    deleteComment
};

function mapStateToProps (state) {
    return {
        inviteListArr: state.thousandLive.inviteListArr,
        isEnd: state.thousandLive.topicInfo.status
    }
}

export default connect(mapStateToProps, mapActionToProps, null, { withRef: true })(SpeakMsgContainer);

// export default SpeakMsgContainer;
