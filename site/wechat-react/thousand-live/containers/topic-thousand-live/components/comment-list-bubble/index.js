import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {imgUrlFormat} from 'components/util';
import Detect from 'components/detect';
import {TextItem} from './speak-msg-item'
import { autobind } from 'core-decorators';
import animation from 'components/animation'
import TipsCard from "components/tips-card";


@autobind
class CommentListBubble extends PureComponent {
    // 判断是否显示禁言按钮
    judgeShowBanBtn = ({ power: { allowMGLive }, userId, createBy, createRole, liveRole }) => {
        // 当且仅当其身份为直播间创建者或管理员时，可ban除其以外的发言者，管理员只可ban听众
        return (userId != createBy) && allowMGLive && (liveRole === 'creator' ? true : createRole !== 'creater' && createRole !== 'manager');
    }

    dangerHtml(content){
        if (content) {
            content = content.replace(/\</g, (m) => "&lt;");
            content = content.replace(/\>/g, (m) => "&gt;");
            content = content.replace(/(&lt;br(\/)?&gt;)/g, (m) => "\n");
        }

        return { __html: content }
    };

    render() {
        var commentList = this.props.commentList.map((speakItem,index)=>{
            let newProps = { ...this.props };
            const { id, liveId, topicId } = speakItem;
            speakItem.liveId = liveId || newProps.liveId;
            speakItem.topicId = topicId || newProps.topicId;
            // 初始化是否显示禁言按钮
            speakItem.showBanBtn = !!this.judgeShowBanBtn({...newProps, ...speakItem});

            switch(speakItem.type){
                case 'text' :
                    return ( <TextItem
                                key = {`forum-item-${id}`}
                                ref = {`forum-item-${id}`}
                                {...newProps}
                                {...speakItem}
                                dangerHtml = {this.dangerHtml}
                                /> )
                default:
                    return;
            }
        })
        return (
            <div className={`comment-list-bubble ${this.props.hasMinHeight?'min-scroll-h':''}`} ref="topic-list-container" >
            {/* 'videoLive':'audioLive' */}
                <TipsCard type="create-live" chtype={`create-live_${this.props.topicStyle}`}   />
                {commentList}
            </div>
        );
    }
}

CommentListBubble.propTypes = {
};

export default CommentListBubble;
