import { api } from '../../config';
import request from '../../comp/request';
import { linkTo } from '../../comp/util';
import { couponListFilter, useCoupon } from '../../comp/coupon-util';

const app = getApp();


Page({
  data: {
    catePri: [
      {
        id: 'bind',
        name: '未使用',
        numKey: 'unUseCoupon', // 用于获取总券数
      },
      {
        id: 'used',
        name: '已使用',
        numKey: 'usedCoupon',
      },
      {
        id: 'overdue',
        name: '已过期',
        numKey: 'overTimeCoupon',
      }
    ],
    catePriActiveIndex: 0,

    cateSec: [
      {
        id: 'channel',
        name: '系列课优惠券',
        numKey: 'channelNum', // 用于获取总券数
      },
      {
        id: 'topic',
        name: '课程优惠券',
        numKey: 'topicNum',
      },
      {
        id: 'vip',
        name: 'VIP优惠券',
        numKey: 'vipNum',
      },
      {
        id: 'live',
        name: '通用券',
        numKey: 'universalNum',
      },
      {
        id: 'ding_zhi',
        name: '平台活动券',
        numKey: 'promotionNum',
      }
      // relay_channel小程序不支持
    ],
    cateSecActiveIndex: 0,

    couponListCache: {}, // 列表数据缓存
    activeDataId: null,
    activeData: null,
    system: app.globalData.system,

  },


  onLoad() {
    app.login().then(() => {
      global.loggerService.pv()

      this.getCouponCount();

      app._mineCouponsCache = {
        needRefresh: false
      }
    })
  },


  onShow() {
    // 有对优惠券做过操作后的返回需要刷新
    if (app._mineCouponsCache && app._mineCouponsCache.needRefresh) {
      this.setData({
        couponListCache: {}
      })
      this.getCouponCount()
    }
  },


  /**
   * 点击优惠券
   */
  onTapCouponItemUse(e) {
    let { status, index } = e.currentTarget.dataset;
    if (status !== 'bind') return;

    let coupon = this.data.activeData.data[index];
    if (/vip/.test(coupon.couponType)) return wx.showToast({icon: 'loading', title: '暂不支持本类券'})

    useCoupon(coupon);
  },


  onTapCouponItem(e) {
    let { status, index } = e.currentTarget.dataset;
    if (status !== 'bind') return;

    let coupon = this.data.activeData.data[index],
        couponId = coupon.couponId;

    if (/ding_zhi/.test(coupon.couponType)) return this.onTapCouponItemUse(e)

    if (/vip/.test(coupon.couponType)) return wx.showToast({icon: 'loading', title: '暂不支持本类券'}) 

    if (/live/.test(coupon.couponType)) {
      couponId = coupon.couponRefId;
    }

    app._couponDetailsCache = coupon;
    
    linkTo.couponDetails({
      id: couponId,
      type: coupon.couponType,
    });
  },


  // 点击主分类
  onTapCatePri(e) {
    let index = e.currentTarget.dataset.index;
    let { catePri, catePriActiveIndex, cateSec } = this.data;
    if (catePriActiveIndex == index) return;

    let catePriItem = catePri[index],
        cateSecIndex = 0;

    // 有券的cateSec
    for (let i in cateSec) {
      if (catePriItem[cateSec[i].numKey] > 0) {
        cateSecIndex = i;
        break;
      }
    }

    this.changeCateActive(index, cateSecIndex);
  },


  // 点击次分类
  onTapCateSec(e) {
    let index = e.currentTarget.dataset.index;
    let { cateSecActiveIndex } = this.data;
    if (cateSecActiveIndex == index) return;

    this.changeCateActive(undefined, index)
  },


  getCouponCount() {
    /**
     * /h5/live/queryCouponCount
     * liveId可选，专业版查询通用券用到
     */
    return request({
      url: '/api/weapp/mine/coupon-count'
    }).then(res => {
      if (res.statusCode !== 200) throw Error("接口请求失败");
      if (res.data.state.code) throw Error(res.data.state.msg);
      
      res = res.data.data;
      let { catePri, cateSec } = this.data,
          catePriActiveIndex, cateSecActiveIndex;

      catePri = [...catePri];

      for (let i in catePri) {
        let catePriItem = catePri[i],
            resItem = res[catePriItem.numKey];
        if (resItem) {
          let totalNum = 0; // 总未读数
          for (let j in cateSec) {
            let cateSecItem = cateSec[j];
            totalNum += resItem[cateSecItem.numKey] || 0;

            // 计算首次显示的分类，取第一个不为空的tab
            if (cateSecActiveIndex === undefined && resItem[cateSecItem.numKey] > 0) {
              catePriActiveIndex = i;
              cateSecActiveIndex = j;
            }
          }
          catePri[i] = Object.assign({}, catePriItem, resItem, {totalNum})
        }
      }
      
      this.setData({
        catePri,
      })

      if (cateSecActiveIndex !== undefined) {
        this.changeCateActive(catePriActiveIndex, cateSecActiveIndex);
      }

    }).catch(err => {
      console.log(err)
    })
  },


  /**
   * 获取优惠券列表
   * @param {boolean} isContinue 是否为分页请求
   */
  getCouponListByCouponType(isContinue = false) {
    let { catePri, catePriActiveIndex, cateSec, cateSecActiveIndex, couponListCache } = this.data;
    
    let status = catePri[catePriActiveIndex].id,
        couponType = cateSec[cateSecActiveIndex].id,
        cacheId = `${status},${couponType}`,
        cache = couponListCache[cacheId],
        cateSecItemNum = catePri[catePriActiveIndex][cateSec[cateSecActiveIndex].numKey] || 0; // 当前复合分类的总优惠券数目

    // 非分页请求，缓存里曾经获取过数据，直接显示缓存的
    if ((cache && cache.data !== null && !isContinue) || 
        (cache && cache.status === 'pending')) {
      this.updateCache(cacheId, cache);
      return; 
    }

    if (!cache) {
      // 创建异步数据对象
      cache = {
        status: '', // pending|success|error
        data: null,
        message: '',
        page: 1,
        size: 10,  // 默认翻页配置
      };
    } else {
      cache = {...cache};
    }

    // 请求状态
    cache.status = 'pending';
    
    this.updateCache(cacheId, cache);

    /**
     * /h5/live/queryCouponListByType
     * liveId可选，专业版查询通用券用到
     */
    return request({
      url: '/api/weapp/mine/coupon-list-by-type',
      data: {
        status, // 使用状态：bind:待使用，used:已使用，overdu:已过期
        type: couponType,
        page: isContinue ? cache.page + 1 : cache.page,
        size: cache.size,
      }
    }).then(res => {
      if (res.statusCode !== 200) throw Error("接口请求失败");
      if (res.data.state.code) throw Error(res.data.state.msg);

      let couponList = res.data.data.resultList || [];

      couponList = couponListFilter({
        list: couponList,
        status,
        couponType,
      })

      if (isContinue) {
        cache.data = cache.data.concat(couponList);
        cache.page++;
      } else {
        cache.data = couponList;
      }
      
      cache.status = cache.data.length >= cateSecItemNum ? 'end' : 'success';

    }).catch(err => {
      console.log(err)
      cache.status = 'error';

    }).then(() => {
      this.updateCache(cacheId, cache);
    })
  },


  getCouponListByCouponType_continue() {
    this.getCouponListByCouponType(true);
  },


  changeCateActive(priIndex, secIndex) {
    let { catePri, catePriActiveIndex, cateSec, cateSecActiveIndex, couponListCache } = this.data;

    priIndex === undefined && (priIndex = catePriActiveIndex);
    secIndex === undefined && (secIndex = cateSecActiveIndex);

    let status = catePri[priIndex].id,
        couponType = cateSec[secIndex].id,
        cacheId = `${status},${couponType}`;

    this.setData({
      catePriActiveIndex: priIndex,
      cateSecActiveIndex: secIndex,
      activeDataId: cacheId,
    });

    this.getCouponListByCouponType();
  },


  // 更新缓存状态
  updateCache(id, data) {
    let { couponListCache, activeDataId } = this.data,
        _data = couponListCache[id];

    _data = Object.assign({}, _data, data);

    this.setData({
      couponListCache: {
        ...couponListCache,
        [id]: _data
      }
    })

    // 更新数据为当前显示数据时，刷新
    if (id == activeDataId) {
      this.setData({
        activeData: _data
      })
    }
  },


  onTapCouponCenter() {
    linkTo.webpage('/wechat/page/coupon-center');
  }
})