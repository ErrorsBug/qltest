import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import PushCheckInCampDialog from 'components/dialogs-colorful/push-dialogs/check-in-camp';

import MiddleDialog from '../../../../components/dialog/middle-dialog';
import BottomDialog from '../../../../components/dialog/bottom-dialog';
import { hidePushChannelDialog } from '../../methods/event';
import { createPortal } from 'react-dom'
import { locationTo } from 'components/util';
import CouponGetBtn from '../coupon-get-btn';

@autobind
class BottomMenu extends Component {

    state = {
        // 显示新建课程或训练营的底部弹框
        showBottomDialog: false,
    }

    creacteCoupon(){
        locationTo(`/wechat/page/coupon-code/list/camp/${this.props.campId}`)
    }

    displayPushDialog(){
        locationTo(`/wechat/page/live-push-message?campId=${this.props.campId}`)
    }

    displayBottomDialog(){
        this.setState({
            showBottomDialog: true
        })
    }

    hideBottomDialog(){
        this.setState({
            showBottomDialog: false
        })
    }

    render(){
        const {campId, liveId, client} = this.props;
        const { showBottomDialog } = this.state;
        const couponNode = document.querySelector('.portal-coupon-get-btn');
        return (
            <div className="bottom-menu-container">
                <div className="bottom-menu-wrapper">
                    {
                        this.props.campInfo.price > 0?
                        <div className="bottom-menu-item icon-coupon" onClick={this.creacteCoupon}>
                            <span>优惠券</span>
                        </div>
                        :null
                    }
                    <div className="bottom-menu-item icon-push" onClick={this.displayPushDialog}>
                        <span>推送通知</span>
                    </div>
                    <div className="bottom-menu-item icon-new" onClick={this.displayBottomDialog}>
                        <span>新建单课</span>
                    </div>
                    <div className="bottom-menu-item icon-edit" onClick={() => {locationTo(`/wechat/page/check-in-camp/edit-camp/${campId}/${liveId}`)}}>
                        <span>编辑</span>
                    </div>
                </div>
                <BottomDialog
                    className="checkin-camp-new-dialog"
                    show={showBottomDialog}
                    onClose={this.hideBottomDialog}
                    showCloseBtn={true}>
                    <div className="bottom-new-dialog">
                        <div className="new-item" onClick={() => locationTo(`/wechat/page/check-in-camp/create-little-graphic/${liveId}/${campId}`)}>小图文</div>
                        <div className="new-item" onClick={() => locationTo(`/wechat/page/topic-create?liveId=${liveId}&campId=${campId}`)}>更多课程方式</div>
                    </div>
                </BottomDialog>
                {
                    couponNode?
                    createPortal(
                        <CouponGetBtn client='B' />,
                        couponNode
                    ):null
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    campId: state.campBasicInfo.campId,
    liveId: state.campBasicInfo.liveId,
    client: state.campAuthInfo.allowMGLive ? 'B' : 'C',
});

const mapActionToProps = {

};

export default connect(mapStateToProps, mapActionToProps)(BottomMenu);