import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import { MiddleDialog } from 'components/dialog';
import {
    locationTo,
} from 'components/util';

/**
 * 实名认证弹框 
 * */ 
@autobind
class NewRealNameDialog extends Component {
    attestStatus(){
        const { realNameStatus, checkUserStatus, rejectReason } = this.props;
        // 审核中
        const auditing =(
            <div className ="real-ing">
            <div className="real-head">个人认证正在<span>审核中</span>请耐心等待</div>
                <div className="real-know" onClick={ this.props.onClose }>我知道了</div>
            </div>
        )
        // 驳回
        const auditBack = (
            <div className="new-real-box new-real-yes">
                <h3 className="real-head">认证失败</h3>
                <p>认证信息不通过，请按照要求重新提交</p>
                {rejectReason && 
                    <p className="reject-reason">(驳回原因：{rejectReason})</p>
                }
                <div className="real-btn" onClick={()=>{locationTo(`/wechat/page/real-name?reVerify=Y&type=topic${this.props.liveId ? `&liveId=${this.props.liveId}` : ''}`)}}>重新认证</div>
            </div>
        )
        // 验证升级
        const upgrade = (
            <div className="new-real-box">
                <h3>实名认证升级</h3>
                <p>因国家<span>法律法规</span>要求，所有提现均需要实名认证。现已升级了实名认证机制，所有用户均需要重新进行<span>实名认证</span>，感谢您的支持和理解</p>
                <div className="real-footer-btn">
                    <div className="real-footer-btn-cancle" onClick={ this.props.onClose }>取消</div>
                    <div className="go-real" onClick={()=>{locationTo(`/wechat/page/real-name?type=topic${this.props.liveId ? `&liveId=${this.props.liveId}` : ''}`)}}>去认证</div>
                </div>
            </div>
        )
        // 还未填写
        const unwrite = (
            <div className="new-real-yes new-real-not">
                <h3 className="real-head">立即实名认证</h3>
                <p>为保证您的账户安全和收益及时到账，请先进行实名安全认证。</p>
                <div className="real-btn" 
                    onClick={()=>{locationTo(`/wechat/page/real-name?type=topic${this.props.liveId ? `&liveId=${this.props.liveId}` : ''}`)}}>
                    立即实名认证
                </div>
            </div>
        )
        // 已认证
        const end = (
            <div className="new-real-yes">
                <h3 className="real-head">已通过实名认证</h3>
                {
                    this.props.isLiveCreator && (
                        <>
                            <p>您提交的身份认证信息已经通过审核</p>
                            <div className="real-btn" onClick={()=>{locationTo(`/wechat/page/real-name?reVerify=Y&type=topic${this.props.liveId ? `&liveId=${this.props.liveId}` : ''}`)}}>重新认证</div>
                        </>
                    )
                }
            </div>
        )
        if(Object.is(checkUserStatus ,'no')){
            if (!realNameStatus || realNameStatus == 'unwrite') {
                return unwrite;
            } else {
                return upgrade;
            }
        } else {
            if(Object.is(checkUserStatus,'awaiting')){
                return auditing;
            }
            if(Object.is(checkUserStatus,'reject') || Object.is(checkUserStatus,'sys_reject')){
                return auditBack
            }
            return end
        }
    }
    render() {
        return (
            <MiddleDialog
                bghide={false}
                show={this.props.show}
                theme='empty'
                close={this.props.isClose}
                titleTheme={'white'}
                className="real-name-dialog"
                onClose={this.props.onClose}
            >
            { this.attestStatus() }
            </MiddleDialog>
        );
    }
}

NewRealNameDialog.propTypes = {
    isLiveCreator: PropTypes.bool,
};

NewRealNameDialog.defaultProps = {
    isLiveCreator: true
}

export default NewRealNameDialog;