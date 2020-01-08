import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { htmlTransferGlobal } from 'components/util';
import { eventLog } from 'components/log-util';
import Detect from 'components/detect';
import SpeakMsgContainer from './speak-msg-container'
import { autobind } from 'core-decorators';



/**
 *
 * 提纲
 * @export
 * @class Component
 * @extends {Component}
 */
@autobind
export class Outline extends PureComponent {
    /**
     * 禁言并撤回功能
     * 
     * 如果撤回的不是有发言权限的人，文案提示不一样
     * 
     * @memberof SpeakMsgContainer
     */
    async onRevoke(){
        let msg = '确定撤回消息吗？';
        let cancelText =  '取消';
        let confirmText = '确定';
        
        let revokeResult;
        window.confirmDialog(
            msg, 
            async ()=>{
                revokeResult = await this.props.revokeForumSpeak(this.props.createBy, this.props.id, this.props.liveId, this.props.topicId);
                sendRevokeResult();
            }, 
            async ()=>{
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

                    this.props.updateOutline('remove', {
                        id:this.props.outlineId,
                    })

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


    render() {
        const {
            createBy,
            userId,
        } = this.props;
        return (
            <div className="speak-item-outline clearfix" >
                <div className="outline-body">
                    <div className="top-line"></div>    
                    <pre className="content"><code>{htmlTransferGlobal(this.props.content)}</code></pre>
                    <div className="bottom-line"></div>    
                </div>    
                {
                   ( this.props.power.allowMGTopic || userId == createBy) &&
                    <span className="btn-revoke on-log"
                        onClick={this.onRevoke}
                        data-log-region="speak-list"
                        data-log-pos="revoke-btn"
                        >
                        撤回
                    </span>
                }
            </div>
        )
    }
};
