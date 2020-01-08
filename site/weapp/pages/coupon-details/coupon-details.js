import { api } from '../../config';
import request from '../../comp/request';
import { getStorageSync, deckUrl } from '../../comp/util';
import { useCoupon } from '../../comp/coupon-util';
import * as regeneratorRuntime from '../../comp/runtime';
const app = getApp();


/**
 * type为live|ding_zhi时，id是couponRefId
 * couponRefId用于 通用券 和 平台券 唯一标识，用作这两种券的couponId
 */

Page({
  data: {
    isMine: false,
    coupon: null,
    couponUserId: null, // coupon所有者id
    couponDesc: '',

    async_bind: {
      status: '', // pending|success|error
      message: ''
    },
    system: app.globalData.system,
  },

  /**
   * id
   * type
   * from 分享者id
   */
  query: {
  },

  async onLoad(options) {
    
    global.loggerService.pv()
    wx.showLoading();
    await app.login();

    this.query = options;
    console.log('query', options)
    this.userId = getStorageSync('userId');
    
    // 有优惠券缓存则读缓存
    let coupon = app._couponDetailsCache;

    if (coupon) {
      console.log('coupon', coupon);
      this.setData({
        couponUserId: this.userId,
      })
      app._couponDetailsCache = null;

    } else if (this.query.from) {
      coupon = await this.getSharedCouponDetails();
      if (!coupon) return;
      this.setData({
        couponUserId: coupon.ownerUserId,
      });
      coupon.name = coupon.businessName;
    }
    
    wx.setNavigationBarTitle({
      title: coupon.name || ''
    });

    let couponDesc = '';
    switch (coupon.couponType) {
      case 'live':
        couponDesc = '【通用券】支持直播间所有课程'
        break;
      case 'channel':
        couponDesc = `【系列课券】${coupon.name || ''}`
        break;
      case 'topic':
        couponDesc = `【课程券】${coupon.name || ''}`
        break;
      case 'vip':
        couponDesc = '【vip】支持购买直播间VIP'
        break;
      case 'ding_zhi':
        couponDesc = '【平台活动券】支持活动课程'
        break;
    }

    let isMine = this.userId == this.data.couponUserId;

    let async_bind = {
      status: '',
      message: (this.data.couponUserId && !isMine) ? '优惠券已被领取' : ''
    };

    if (coupon.status === 'overdue' || coupon.isOverdue === 'Y') {
      async_bind.message = '优惠券已过期';
    } else if (coupon.status === 'used') {
      async_bind.message = '优惠券已被使用';
    }

    wx.hideLoading();
    this.setData({
      isMine,
      coupon,
      couponDesc,
      async_bind
    }); 
  },


  /**
   * 获取分享出的优惠券的信息 /h5/coupon/getTransformCoupon
   */
  getSharedCouponDetails() {
    return request({
      url: '/api/weapp/coupon/get-transform-coupon',
      data: {
        type: this.query.type,
        couponId: this.query.id,
        fromUserId: this.query.from,
      }
    }).then(res => {
      console.log('get coupon', res.data);
      if (res.statusCode !== 200) throw Error('请求接口失败');
      if (res.data.state.code) throw Error(res.data.state.msg);

      return res.data.data.couponData;

    }).catch(err => {
      this.setData({
        async_bind: {
          message: err.message
        }
      })
      wx.showToast({
        title: err.message,
        icon: 'loading',
      })
    })
  },


  async bindAndUseCoupon() {
    let result = await this.bindCoupon()
    
    result && this.useCoupon();
  },


  // 领取
  bindCoupon() {
    let { coupon, async_bind } = this.data;
    if (async_bind.status === 'pending') return;

    this.setData({
      async_bind: {
        ...async_bind,
        status: 'pending'
      }
    })

    return request({
      url: '/api/weapp/coupon/bind-transform-coupon', // /h5/coupon/bindTransformCoupon
      data: {
        type: coupon.couponType,
        couponId: this.query.id,
        fromUserId: this.query.from,
      }
    }).then(res => {
      console.log('bind', res.data);
      if (res.statusCode !== 200) throw Error('请求接口失败');
      if (res.data.state.code) throw Error(res.data.state.msg);

      this.setData({
        couponUserId: this.userId,
        isMine: true,
        async_bind: {
          ...async_bind,
          status: 'success'
        }
      })

      app._mineCouponsCache = {
        needRefresh: true
      }
      
      return true;
    }).catch(err => {
      wx.showToast({
        title: err.message,
        icon: 'loading',
      })

      this.setData({
        async_bind: {
          ...async_bind,
          status: 'error',
          message: err.message,
        }
      })
    })
  },


  async bindAndShareCoupon() {
    let res = await this.bindCoupon();
    res && this.shareCoupon();
  },


  // 使用
  useCoupon() {
    let coupon = this.data.coupon;
    useCoupon(coupon);
  },


  // 分享
  async shareCoupon() {
    // 不是自己的先领取，再分享
    if (!this.data.isMine) {
      let result = await this.bindCoupon();
      if (!result) return;
    }

    let coupon = this.data.coupon,
        couponId = this.options.id;

    return request({
      url: '/api/weapp/coupon/transform-coupon',  // /h5/coupon/transformCoupon
      data: {
        type: coupon.couponType,
        couponId,
      }
    }).then(res => {
      console.log('share', res.data);
      if (res.statusCode !== 200) throw Error('请求接口失败');
      if (res.data.state.code) throw Error(res.data.state.msg);

      app._mineCouponsCache = {
        needRefresh: true
      }

      this.setData({
        isMine: false
      })

      console.log('分享成功');
      // wx.navigateBack();
      this.setData({
        async_bind: {
          message: '优惠券已被分享'
        }
      })

    }).catch(err => {
      wx.showToast({
        title: err.message,
        icon: 'loading',
      })
    })
  },


  onShareAppMessage(options) {
    console.log('分享')
    /**
     * 1.从菜单分享，保持原参数
     * 2.从按钮分享，配置当前分享者及请求分享接口
     */
    let path;
    if (options.from === 'menu') {
      path = deckUrl('/pages/coupon-details/coupon-details', {
        id: this.query.id,
        type: this.query.type,
        from: this.query.from || this.data.couponUserId
      });
    } else {
      path = deckUrl('/pages/coupon-details/coupon-details', {
        id: this.query.id,
        type: this.query.type,
        from: this.data.couponUserId || this.userId, // 未领取的分享，把自己当做分享者
      });
    }
    return {
      title: '领取优惠券',
      path: path,
      success: () => {
        if (this.data.couponUserId) {
          this.shareCoupon();
        } else {
          this.bindAndShareCoupon();
        }
      },
      fail: () => {
        wx.showToast({
          title: '分享失败',
          icon: 'loading',
          duration: 600
        })
      }
    }
  }
})