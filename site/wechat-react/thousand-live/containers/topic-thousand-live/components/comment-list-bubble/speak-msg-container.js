import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { imgUrlFormat } from 'components/util';
import { eventLog } from 'components/log-util';
import { getQlchatVersion} from 'components/envi';
import { autobind } from 'core-decorators';
import dayjs from 'dayjs';
import LazyImage from '../lazy-image';
import classnames from 'classnames';
import { doLike } from 'thousand_live_actions/thousand-live-common';

const dangerHtml = content => {
    if(content){
        content = content.replace(/\</g, (m) => "&lt;");
        content = content.replace(/\>/g, (m) => "&gt;");
    }

    return { __html: content }
};

@autobind
class SpeakMsgContainer extends Component {

    state ={
        showManagement: false
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
            createByHeadImgUrl,
            createByName,
        } = this.props;

        const data = this.props;


        return (
            <span
                className = "head-box"
            >
                <img className="speak-head" 
                    src={` ${imgUrlFormat(createByHeadImgUrl,'?x-oss-process=image/resize,h_120,w_120,m_fill')}`} 
                alt=""/>
            </span>
        );
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
                <b dangerouslySetInnerHTML={dangerHtml(this.props.createByName)}></b>
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

        let name = this.props.name||this.props.speakCreateByName;
        let msg = '确定删除消息吗？';
        let cancelText =  '取消';
        let confirmText = '确定';
        
        let revokeResult;
        window.confirmDialog(
            msg, 
            async ()=>{
                revokeResult = await this.props.deleteComment(this.props.id, this.props.createBy, this.props.topicId);
            }, 
            ()=>{}, 
            '' , 
            'cancel-confirm', 
            {
            confirmText: confirmText,
            cancelText: cancelText,
            }
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
                const {
                    id,
                    createBy,
                    liveId,
                    topicId,
                    bannedToPost,
                    deleteComment
                } = this.props;
                const res = await bannedToPost(createBy, 'Y', liveId, false);
                if (res.state.code == 0) {
                    window.toast(res.state.msg);
                    deleteComment(id, createBy, topicId);
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
            createByName,
            onWhisperQuestionClick,
            isShowBottomBar = true,
            likesNum,
            isLikes,
            topicStyle,
            type,
            hideFavor = false,
            createRole,
            power: {
                allowMGLive
            },
            showBanBtn
        } = this.props;

        if (isShowBottomBar) {
            return (
                ((allowMGLive && createRole !== 'creater') || createBy == userId) && (
                    <div className="control-box">
                        <div className="action-btn" onClick={this.triggerManageBox} data-id={this.props.id}>
                            {
                                !!this.state.showManagement &&
                                <div className="manage-box">
                                    {
                                        showBanBtn && <span className="mute" onClick={this.muteUserById}>禁言</span>
                                    }
                                    {
                                        (power.allowDelSpeak || userId == createBy)?
                                            <span className="btn-revoke"
                                                onClick={this.onRevoke}
                                                >
                                                删除
                                            </span>
                                        :null
                                    }
                                </div>
                            }
                        </div>
                    </div>
                )
            );
        }

    }




    render() {
        const currentTime = (typeof(this.props.createTime) === 'object') ? this.props.createTime.time : this.props.createTime;

        const speakContainerClass = classnames(
            'speak-container',
            this.props.className,
            {
                right: this.props.isRight,
                isGold: Number(this.props.likesNum) >= Number(this.props.likesSet)
            }
        );

        return (
            <div ref="speak-container" className = {speakContainerClass}>
                {
                    this.props.showTime && <div className = "date-bar">{ dayjs(Number(currentTime)).format('MM-DD HH:mm') }</div>
                }
                {
                    (this.props.isRight)
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
};


const mapActionToProps = {
    doLike,
};

function mapStateToProps (state) {
    return {
        inviteListArr: state.thousandLive.inviteListArr,
    }
}

export default connect(mapStateToProps, mapActionToProps, null, { withRef: true })(SpeakMsgContainer);

// export default SpeakMsgContainer;
