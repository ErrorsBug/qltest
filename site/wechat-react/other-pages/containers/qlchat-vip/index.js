import React, { Component } from 'react';
import Page from 'components/page';
import { MiddleDialog, Confirm } from 'components/dialog';
import { locationTo } from 'components/util';

import {
    joinQlchatVipCooperation,
} from '../../actions/mine';

class QlchatVip extends Component {
    state = {
        // 显示操作确认弹框
        showConfirmDialog: false,
        // 显示成功加入千聊会员的弹框
        showSuccessDialog: false,
    }

    data = {
        liveId: this.props.location.query.liveId
    }

    /* 点击确认对话框的按钮 */
    onClickConfirmDialog = async (flag) => {
        if (flag == 'confirm') {
            this.refs.confirmDialog.hide();
        } else {
            const result = await joinQlchatVipCooperation({ liveId: this.data.liveId, isAgree: 'N' });
            if (result.state.code === 0) {
                window.toast('操作成功');
                setTimeout(() => {
                    locationTo('/wechat/page/backstage');
                }, 1000);
            } else {
                window.toast(result.state.msg);
            }
        }
    }

    /* 点击成功加入千聊VIP提示对话框的按钮 */
    onClickPromptDialog = () => {
        locationTo('/wechat/page/backstage');
    }

    /* 点击不同意按钮 */
    onClickDisagreeBtn = async () => {
        const { liveId } = this.data;
        if (!liveId) {
            window.toast('参数错误：缺少liveId');
            return false;
        }
        this.refs.confirmDialog.show();
    }

    /* 点击同意按钮 */
    onClickAgreeBtn = async () => {
        const { liveId } = this.data;
        if (!liveId) {
            window.toast('参数错误：缺少liveId');
            return false;
        }
        const result = await joinQlchatVipCooperation({ liveId, isAgree: 'Y' });
        if (result.state.code === 0) {
            this.refs.promptDialog.show();
        } else {
            window.toast(result.state.msg);
        }
    }

   

    render() {
        return (
            <Page title="一份重要的通知" className="qlchat-vip-page">
                <section className="scroll-content-container">
                    <h1 className="agreement-title">千聊会员特供课程方合作方案</h1>
                    <div className="agreement-content">
                        <p>为了更好地服务好用户，培养用户的购买习惯，从而拉动千聊直播中心的课程销量，千聊将推出【千聊会员】体系业务。</p>
                        <p>
                            <div><strong>1、千聊官方将补贴会员，赠送价值1316元礼包</strong></div>
                            <div><strong>2、会员在直播中心购买的所有课程都将享有八折优惠</strong></div>
                        </p>
                        <p>
                            <div><strong className="red-text">成为【千聊会员】特供课程方好处：</strong></div>
                            <div><strong>1、增加课程曝光，预计曝光量达到2000万</strong></div>
                            <div><strong>2、提高课程销量，预计销量将提高10-20倍</strong></div>
                            <div><strong>3、有机会参与平台课程主题活动</strong></div>
                        </p>
                        <p>您若同意参与本次【千聊会员】特供课程方合作，千聊会员在直播中心购买了您的课程将享有八折优惠，由此产生的营销成本将由千聊平台和贵直播间共同承担，故直播间的课程收益将以课程折后价格进行结算。</p>
                        <p>同意此政策调整请点击下方“同意”按钮。千聊会尽最大努力提升课程在直播中心的总销售额。</p>
                    </div>
                </section>
                <Confirm
                    className="confirm-dialog"
                    ref="confirmDialog"
                    show={true}
                    title="操作确认"
                    buttons="cancel-confirm"
                    cancelText="确认"
                    confirmText="再想想"
                    onBtnClick={this.onClickConfirmDialog}
                >
                    <div className="content">
                        <p>贵直播间的课程将会丧失对会员曝光的机会，请再次确认是否参与会员营销方案。</p>
                    </div>
                </Confirm>

                <Confirm
                    className="confirm-dialog"
                    ref="promptDialog"
                    show={true}
                    title="恭喜"
                    buttons="cancel"
                    cancelText="我知道了"
                    onBtnClick={this.onClickPromptDialog}
                >
                    <div className="content">
                        <p>恭喜，您已加入千聊会员特供课程合作计划！</p>
                        <p>您的课程将获得更多曝光机会，同时您将和千聊共同承担会员买课八折的营销成本哦。</p>
                    </div>
                </Confirm>
                <div className="button-area">
                    <button type="button" className="btn disagree-btn" onClick={this.onClickDisagreeBtn}>不同意</button>
                    <button type="button" className="btn agree-btn" onClick={this.onClickAgreeBtn}>同意</button>
                </div>
            </Page>
        )
    }  
}

export default QlchatVip;