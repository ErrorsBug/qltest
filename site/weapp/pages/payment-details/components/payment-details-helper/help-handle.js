import { linkTo, deckUrl } from '../../../../comp/util';
const app = getApp();

/**
 * 接入步骤
 * 1.html引入
    <payment-details-helper
        wx:if="{{PDH_isShowModal}}"
        bindconfirm="PDH_continuePay"
        bindcancel="PDH_hideModal"
    />
 * 
 * 2.onLoad注册
 *  paymentDetailsHelper.bind(this);
 * 
 * 3.跳转付款详情页调用
 *  this.PDH_goToPaymentDetails(query);
 */

const paymentDetailsHelper = {

  bind(pageInstance) {    
    pageInstance.PDH_goToPaymentDetails = this.goToPaymentDetails.bind(pageInstance);

    pageInstance.PDH_continuePay = this.continuePay.bind(pageInstance);

    pageInstance.PDH_checkIsGiveupPayment = this.checkIsGiveupPayment.bind(pageInstance);

    pageInstance.PDH_hideModal = this.hideModal.bind(pageInstance);

    // 注册页面返回事件
    let _onShow = pageInstance.onShow;
    pageInstance.onShow = function () {
      _onShow && _onShow();
      pageInstance.PDH_checkIsGiveupPayment();
    }
  },


  /**
   * 跳到付款详情
   * 保存操作id，保存页面参数，用于继续支付，被唤起页面付款成功需要标记已支付
   */
  goToPaymentDetails(query) {
    // 操作id
    let _actId = Math.random();
    // 保存到实例
    this._paymentDetailsResultCache = {...query, _actId};
    // 保存到全局
    app._paymentDetailsResultCache = {...this._paymentDetailsResultCache};
    linkTo.paymentDetails(this._paymentDetailsResultCache);
  },


  // 继续支付
  continuePay() {
      app._paymentDetailsResultCache = {...this._paymentDetailsResultCache};
      linkTo.paymentDetails(this._paymentDetailsResultCache);
  },


  /**
   * 检查是否放弃付款
   */
  checkIsGiveupPayment() {
    // 对应付款详情返回的时候
    if (this._paymentDetailsResultCache &&
      app._paymentDetailsResultCache &&
      this._paymentDetailsResultCache._actId ==
      app._paymentDetailsResultCache._actId) {

      // 判断是否弹出继续支付
      if (!app._paymentDetailsResultCache.hasPay) {
        app._paymentDetailsResultCache = null
        this.setData({ PDH_isShowModal: true })
        
      // 支付成功的话刷新
      } else {
        app._paymentDetailsResultCache = null
        let url = `/${this.route}`
        url = deckUrl(url, this.options)
        wx.redirectTo({ url })
      }
    }
  },


  // 关闭继续支付提示
  hideModal() {
    this.setData({PDH_isShowModal: false})
  }
}

export default paymentDetailsHelper;