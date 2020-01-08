
/**
 * 显示邀请结果
 *
 * @param {any} data
 * @param {any} this
 */
export const showInviteResult = (data) => {
    if (!data.shareType) { return }
    /* 讲师邀请*/
    if (data.shareType === 'teacher') {
        switch (data.resultCode) {
            case 0:
                this.props.toast('您成为该系列课讲师');
                break;

            case 50004:
                this.props.toast('该邀请链接已被使用');
                break;

            default:
                break;
        }
    }
    if (data.shareType === 'guest') {
        switch (data.resultCode) {
            case 50004:
                this.props.toast('该邀请链接已被使用');
                break;

            default:
                break;
        }
    }
}

/**
 * 获取系列课信息并初始化分享
 *
 * @export
 * @param {any} channelId
 * @param {any} this
 */
export async function fetchAndInit(share) {
    const channelId = Number(this.context.router.location.query.channelId);
    // 设置channelId
    this.props.setChannelId(channelId);
    // 获取系列课信息
    const result = await this.props.fetchChannelIndex(this.props.liveId, channelId);
    // 初始化权限
    this.props.initPower({ power: result.result.power });
    // detail展示
    this.setState({
        showDetail: this.props.power.allowMGLive || !this.props.chargeStatus,
    })
    // 初始化分享
    share({
        title: this.props.channelInfo.name,
        desc: this.props.channelInfo.name,
        shareUrl: window.location.href,
        imgUrl: this.props.channelInfo.headImage,
    });
}

 /**
  * 检查支付结果
  *
  * @param {action} selectPayResult - 检查支付结果的action
  */
export const checkPayResult = (selectPayResult) => {
    try {
        // 检查localstorage
        let payResult = window.localStorage.getItem(`pay-result-CHANNEL`);
        payResult = JSON.parse(payResult);

        if (payResult && payResult.isEnable) {
            // 请求确认支付结果
            selectPayResult(payResult.orderId, async () => {
                window.localStorage.removeItem(`pay-result-CHANNEL`);
                !this.props.subscrible && window.localStorage.setItem(`show-qr-dialog`, 'show');
                window.location.reload();
            });
        }
    } catch (error) {
        console.error(error);
    }
}
