import React, { Component } from 'react';
import { MiddleDialog } from 'components/dialog';
import {
    locationTo,
} from 'components/util';

// 实名认证弹框
class RealNameDialog extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                close={true}
                titleTheme={'white'}
                className="real-name-dialog"
                onClose={this.props.onClose}
            >
            {this.props.realNameStatus=="auditing"?
                <div className ="icon-real isrealing">
                    <span>直播间实名认证正在审核中<br/>请耐心等待</span>
                </div>
                :
                (this.props.realNameStatus=="unwrite"||this.props.realNameStatus=="auditBack"?
                <div className ="icon-real unreal">
                    <b>实名认证</b>
                    <ul>
                        <li>为规范市场秩序，保证消费者权益，直播间创建者须先完成实名认证</li>
                        <li>实名认证信息千聊会严格保密</li>
                        <li>实名认证过后，会赠予直播间实名认证徽章并给予直播间更多特权功能</li>
                    </ul>
                    <span  onClick={()=>{locationTo("/wechat/page/real-name?liveId="+this.props.liveId+"&type=topic")}}>立即完成实名认证</span>
                </div>
                :
                <div className="icon-real isreal">
                    <span>已通过实名认证</span>
                </div>
                )
            }
            </MiddleDialog>
        );
    }
}

RealNameDialog.propTypes = {

};

export default RealNameDialog;