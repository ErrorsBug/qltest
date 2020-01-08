import request from '../../comp/request';
import { couponListFilter } from '../../comp/coupon-util';
const app = getApp();


/**
 * 优惠券列表优先读缓存app._paymentDetailsCouponCache
 * 确定修改时写缓存app._paymentDetailsCouponCache
 */

Page({
  data: {
    name: '',
    async_couponList: {   // 优惠券异步对象
      status: 'pending',
      data: null,         // 所有的coupon
      message: '',
    },
    activeCoupon: null,
    availableCoupons: [], // 可用的coupon

    showWinCouponCode: false,
    couponCodeInput: '',

    async_exchangeCouponCode: {
      status: '',
      data: null,
      message: ''
    }
  },


  onLoad(options) {
    global.loggerService.pv()
    this.query = options;
    let cache = app._paymentDetailsCouponCache;
    app._paymentDetailsCouponCache = null;

    console.log(cache)

    // 判断缓存是否有效
    if (!cache) {
      this.setData({
        async_couponList: {
          status: 'error',
          error: '优惠券读取失败'
        }
      })

      return wx.showModal({
        title: '优惠券读取失败',
        showCancel: false,
      })
    } 

    app.login().then(() => {
      let { async_couponList } = this.data;

      this.setData({
        name: cache.name,
        async_couponList: {
          ...async_couponList,
          status: 'success',
          data: cache.data,
        },
        activeCoupon: cache.activeCoupon,
      });
      this.setAvailableCoupons();
    })
  },


  tapSubmit() {
    let { async_couponList, activeCoupon } = this.data;

    // 缓存优惠券配置
    app._paymentDetailsCouponCache = {
      _actId: this.query._actId,
      data: async_couponList.data,
      activeCoupon
    };

    wx.navigateBack();
  },


  tapCouponItem(e) {
    let index = e.currentTarget.dataset.index,
        activeCoupon = this.data.activeCoupon,
        _activeCoupon = this.data.availableCoupons[index];

    if (activeCoupon && activeCoupon.couponId == _activeCoupon.couponId) {
      _activeCoupon = null;
    }

    this.setData({
      activeCoupon: _activeCoupon
    })
  },


  showWinCouponCode() {
    this.setData({
      showWinCouponCode: true,
    })
  },


  hideWinCouponCode() {
    this.setData({
      showWinCouponCode: false,
      async_exchangeCouponCode: {
        ...this.data.async_exchangeCouponCode,
        message: '', // 清空错误提示
      }
    })
  },


  /**
   * 兑换优惠码
   * 1.channelCoupon
   * 2.vipCoupon
   * 3.coupon
   * 
   * TODO 待验证 
   */
  exchangeCouponCode() {
    let { couponCodeInput, async_exchangeCouponCode } = this.data,
        type = this.query.type,
        businessId;

    if (async_exchangeCouponCode.status === 'pending') return;
    if (!couponCodeInput) return;

    if (type === 'channel') {
      businessId = this.query.channelId;
    } else if (type === 'vip') {
      businessId = this.query.liveId;
    } else if (type === 'topic') {
      businessId = this.query.topicId;
    }

    this.setData({
      async_exchangeCouponCode: {
        status: 'pending',
        message: '兑换中...'
      }
    })

    return request({
      url: '/api/weapp/coupon/bind-coupon-code',  // /h5/coupon/bindCouponCode
      data: {
        code: couponCodeInput,
        type,
        businessId,
      }
    }).then(res => {
      if (res.statusCode !== 200) throw Error('请求接口失败');
      if (res.data.state.code) throw Error(res.data.state.msg);
      this.setData({
        async_exchangeCouponCode: {
          status: 'success',
          data: res.data.data
        },
        showWinCouponCode: false
      })

      this.updateCouponList(res.data.data.couponData.couponId);

    }).catch(err => {
      this.setData({
        async_exchangeCouponCode: {
          status: 'error',
          message: err.message
        }
      })
    })
  },


  changeCouponCodeInput(e) {
    this.setData({
      couponCodeInput: e.detail.value.trim()
    })
  },


  /**
   * 兑换优惠券成功后刷新列表
   */
  updateCouponList(activeCouponId) {
    this.setData({async_couponList: {
      status: 'pending',
      data: []
    }})

    let businessType = this.query.type,
        businessId;

    if (businessType === 'channel') {
      businessId = this.query.channelId;
    } else if (businessType === 'topic') {
      businessId = this.query.topicId;
    }

    return request({
      url: '/api/weapp/mine/coupon-list-by-business', // /h5/coupon/myCouponList
      data: {
        businessType,
        businessId
      }
    }).then(res => {
      if (res.statusCode !== 200) throw Error('请求接口失败');
      if (res.data.state.code) throw Error(res.data.state.msg);

      let couponList = res.data.data.couponList || [];

      // 过滤不符合最低使用价格的
      let curPrice = this.query.curPrice;
      couponList = couponList.filter(coupon => {
        return !(coupon.minMoney && coupon.minMoney > curPrice);
      });
      console.log(couponList)
      // 从大到小排序
      couponList = couponList.sort((l, r) => {
        return l.money < r.money ? 1 : -1;
      });

      // 设置name字段
      let name = this.data.name;
      couponList.forEach(item => item.name = name);

      // 再补充设置各种字段
      couponList = couponListFilter({
        list: couponList,
        status: 'bind'
      });

      this.setData({
        async_couponList: {
          status: 'success',
          data: couponList
        }
      });

      this.setAvailableCoupons();

      if (activeCouponId) {
        let activeCoupon = this.data.availableCoupons.filter(c => c.couponId === activeCouponId)[0];
        if (activeCoupon) {
          this.setData({activeCoupon});
        }
      }

    }).catch(err => {
      console.log(err)
      this.setData({async_couponList: {
        status: 'error',
        message: err.message || '获取优惠券失败'
      }})
    })
  },


  /**
   * 计算出可用优惠券
   */
  setAvailableCoupons() {
    let coupons = this.data.async_couponList.data || [],
        curPrice = this.query.curPrice;

    coupons = coupons.filter(coupon => {
      return !(coupon.minMoney && coupon.minMoney > curPrice);
    });

    this.setData({
      availableCoupons: coupons
    });
  }
})