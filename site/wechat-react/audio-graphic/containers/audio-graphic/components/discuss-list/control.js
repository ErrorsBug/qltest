import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ControlMenu extends Component {

    muteUserById = (e) => {
        e.stopPropagation();
        this.props.hideManageBox();
        // b端转载不能删除
        if (this.canNotDelete()) {
            window.toast('转载方不能禁言');
            return ;
        }
        window.confirmDialog(
            '确定禁言吗？',
            () => {
                this.props.bannedToPost(this.props.item.createBy, 'Y', this.props.liveId);
                this.props.deleteDiscuss({discussId:this.props.item.id, businessId:this.props.topicId});
            }
        );
       
    }

    deleteDiscuss = (e) => {
        e.stopPropagation();
        this.props.hideManageBox();
        // b端转载不能删除
        if (this.canNotDelete()) {
            window.toast('转载方不能删除');
            return ;
        }
        window.confirmDialog(
            '确定删除吗？',
            () => {
                this.props.deleteDiscuss({discussId:this.props.item.id, businessId:this.props.topicId})
            }
        );
    }

    replyDiscuss = (e) => {
        e.stopPropagation(); 
        this.props.hideManageBox();
        if (this.canNotDelete()) {
            window.toast('转载方不能回复');
            return ;
        }
        this.props.replyDiscuss({
            ...this.props.item,
            show:true,
            commentItemIndex: this.props.index,
        })
    }

    isClientB = () => {
        return this.props.power && this.props.power.allowMGLive;
    }

    canNotDelete = () => {
        return this.isClientB && this.props.isFromRelay == 'Y';
    }

    render() {
        const {
            power,
            userId,
            liveRole,
            createBy,
            createRole,
            commentType,
            showManagement,
            showManageId,
            item = {},
            triggerManageBox,
            showBanBtn
        } = this.props;

        const { allowMGTopic, allowDelComment } = power || {};

        return (
            <div className="control-btn">
                {
                   !(commentType === 'shareComment' && userId === createBy) ?

                    ((power.allowMGTopic || allowDelComment) ? 
                    <div className="manage">
                        {
                            (showManagement && showManageId == item.id) ?  
                                <div className="manage-box">
                                {
                                    allowMGTopic && (userId !== createBy) &&
                                    <span className="reply on-log on-visible"
                                          data-log-region="comment-reply-btn"
                                          onClick={this.replyDiscuss}
                                    >回复</span>
                                }        
                                {
                                   showBanBtn &&
                                    <span className="mute" onClick={this.muteUserById}>禁言</span>
                                }
                                {
                                    commentType !== 'shareComment' && ((allowMGTopic && createRole !== 'creater') || createBy == userId) &&
                                    <span onClick={this.deleteDiscuss}>删除</span>
                                }
                            </div>
                            :null
                        }
                        {
                            allowDelComment?
                            <span className="manage-button" onClick={(e)=>{triggerManageBox(e,item.id)}}></span>
                            :null
                        }
                    </div>
                    :null) : null    
                }
            </div>
        );
    }
}

ControlMenu.propTypes = {

};

function mstp (state) {
    return {
        isFromRelay: state.thousandLive.channelInfo ? state.thousandLive.channelInfo.channel.isRelay : state.thousandLive.topicInfo.isRelay
    }
}

export default connect(mstp, {})(ControlMenu);