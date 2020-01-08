import * as regeneratorRuntime from '../../comp/runtime'
import request from '../../comp/request';
import { api } from '../../config';
import { linkTo, imgUrlFormat, formatMoney, getVal, fillParams, orderInAnotherWeapp } from '../../comp/util';
import order from '../../comp/order';
import { couponListFilter } from '../../comp/coupon-util';
const app = getApp();

/**
 * 页面参数
 * type         付款类型（必须）  channel|topic 
 * channelId    
 * topicId
 */


Page({
  data: {
    liveId: null,
    channelId: null,
    topicId: null,

    businessType: null,   // 业务类型
    businessId: null,     // 业务id
    businessInfo: null,   // 业务信息（后组装，只将有用信息放到里面）

    chargeConfigs: [],
    activeChargeIndex: 0,
    showWinSelectCharge: false,
    
    canUseCoupon: true,   // 能否使用优惠券
    async_couponList: {   // 优惠券异步对象
      status: '',
      data: null,
      message: '',
    },
    activeCoupon: null,
    couponPrice: 0,

    originalPrice: 0,     // 原价
    finalPrice: 0,        // 最终价
    system: app.globalData.system,
  },

  /*
   * 页面参数
   * shareKey
   * lshareKey
   */
  query: {},

  // 渠道
  _ch: '',

  onLoad(options) {
    app.login().then(() => {
      this.query = options;
      this._ch = options.ch || options.wcl;

      // _actId用于标识页面实例唯一性
      if (this.query._actId) {
        this._actId = this.query._actId;
        if (app._paymentDetailsResultCache && app._paymentDetailsResultCache._actId == this.query._actId) {
          // 标记：支付成功后返回上一页还是直接跳到相应页
          this._paySuccessGoBack = true;
          this._paymentDetailsResultCache = {...app._paymentDetailsResultCache};
        }
      } else {
        this._actId = Math.random();
      }

      if (options.type === 'topic') {
        this.setData({
          topicId: options.topicId,
          businessType: 'topic',
          businessId: options.topicId
        })
        this.fetchTopicInfo();

      } else if (options.type === 'channel') {
        this.setData({
          channelId: options.channelId,
          businessType: 'channel',
          businessId: options.channelId
        })
        this.fetchChannelInfo()
        
      } else if (options.type === 'vip') { 
        this.setData({
          liveId: options.liveId,
          businessType: 'vip',
          businessId: options.liveId
        })
        this.initVipInfo()
      } else {
        wx.showToast({
          icon: 'loading',
          title: '未支持付款类型',
        })
      }
    }).catch(err=>{console.error(err)})
  },


  onShow() {
    // 检测从选择优惠券返回事件
    let couponCache = app._paymentDetailsCouponCache;
    app._paymentDetailsCouponCache = null;
    
    if (couponCache && couponCache._actId == this._actId) {
      this.setData({
        async_couponList: {
          ...this.data.async_couponList,
          data: couponCache.data
        },
        activeCoupon: couponCache.activeCoupon,
      });

      this.updatePriceInfo();
    }
  },


  fetchTopicInfo() {
    /**
     * 接口map
     * topicView        /h5/topic/get             课程信息
     *      topicPo         课程对象信息
     *      topicExtenPo    扩展信息
     *      createUser
     * profile          /h5/topic/profileList     课程介绍信息列表
     * isAuth           /h5/topic/topicAuth       课程授权信息，是否已报名
     * power            /h5/user/power            用户权限
     */
    app.showLoading();

    let main = request({
      url: api.introTopicInit,
      data: { 
        topicId: this.query.topicId
      },
    }).then(res => {
      if (res.statusCode !== 200) throw Error('请求接口失败');
      app.hideLoading();
      
      let { topicView } = res.data,
          { topicPo } = topicView;

      // 原价
      let originalPrice = fixPrice(topicPo.money / 100);

      // 组装价格配置
      let chargeConfigs = [{
        amount: originalPrice,
        chargeStr: `原价：￥${originalPrice}`,
      }]

      let businessInfo = {
        img: imgUrlFormat(topicPo.backgroundUrl, "?x-oss-process=image/resize,m_fill,limit_0,h_150,w_240"),
        name: topicPo.topic,
        desc: [
          `课程类型：课程`,
          `来自直播间：${topicPo.liveName}`,
        ],
        originalPriceStr: chargeConfigs[0].chargeStr,
        createBy: topicPo.createBy,
      }

      this.setData({
        liveId: topicPo.liveId,
        businessInfo,
        originalPrice,
        chargeConfigs
      });

      this.updatePriceInfo();

    }).catch(err => {
      app.hideLoading();
      console.log(err);

      wx.showModal({
        title: '付款信息获取失败',
        content: err.message,
        showCancel: false,
      })
    })

    Promise.all([
      main,
      this.getCouponList()
    ]).then(res => {
      let couponList = res[1]
      this.getCouponListThen(couponList)
    })
  },
  

  fetchChannelInfo() {
    /**
     * 接口map
     * channnelInfo     /h5/channel/info            系列课信息
     *      channel         系列课对象
     *      chargeConfigs   收费配置列表（后端有对价格排序）
     *      createUser      创建用户信息
     * ticketMoney      chargeConfigs首项amount
     * userList         /h5/channel/payUser         系列课付费用户列表
     *      payUserCount    付费总数
     * desc             /h5/channel/getDesc         系列课描述列表
     *      descriptions
     * topicList        /h5/topic/list              课程列表
     * getMarket        /h5/channel/getDiscountType 系列课营销推广信息
     *      discountStatus  营销推广类型：Y特价优惠,P免费拼团,GP付费拼团,N无
     *      money           系列课原价（固定收费）
     *      discount        金额
     * power            /h5/user/power              用户权限
     * vipInfo          /h5/vip/get                 用户vip信息
     *      isOpenVip       直播间是否打开VIPY or N
     *      isVip           是否直播间VIPY or N
     */
    app.showLoading();

    let main = request({
      url: api.getChannelIndex,
      data: {
        channelId: this.query.channelId
      }
    }).then(res => {
      if (res.statusCode !== 200) throw Error('请求接口失败');
      app.hideLoading();

      let { channelInfo, ticketMoney } = res.data,
          { channel, chargeConfigs } = channelInfo,
          activeChargeIndex = 0;

      let businessInfo = {
        img: `${channel.headImage || '//img.qlchat.com/qlLive/liveCommon/liveHead.png'}@148h_240w_1e_1c_2o`,
        name: channel.name,
        desc: [
          `课程类型：系列课|共${channel.topicCount}节课`,
          `来自直播间：${channel.liveName}`,
        ]
      }

      // 过滤无效配置
      chargeConfigs = chargeConfigs.filter(item => item.status === 'Y');

      chargeConfigs.forEach(item => {
        if (item.discountStatus === 'Y') {
          item.chargeStr = `特价优惠：￥${item.discount}`
        } else {
          item.chargeStr = item.chargeMonths > 0 ? 
            `原价：￥${item.amount}/${item.chargeMonths}个月` :
            `原价：￥${item.amount}`;
        }
      })

      let activeCharge = chargeConfigs[activeChargeIndex];

      this.setData({
        chargeConfigs,
        activeChargeIndex,
      })

      let originalPrice = this.getCurPrice();

      businessInfo.originalPriceStr = chargeConfigs[activeChargeIndex].chargeStr;

      this.setData({
        liveId: channel.liveId,
        businessInfo,
        originalPrice,
      });

      this.updatePriceInfo();

    }).catch(err => {
      app.hideLoading();
      console.log(err);

      wx.showModal({
        title: '付款信息获取失败',
        content: err.message,
        showCancel: false,
      })
    })

    Promise.all([
      main,
      this.getCouponList()
    ]).then(res => {
      let couponList = res[1]
      this.getCouponListThen(couponList)
    })
  },

  async initVipInfo() {
    app.showLoading()

    try {
      const [liveData, vipData,couponList] = await Promise.all([
        this.fetchLiveInfo(),
        this.fetchVipCharge(),
        this.getCouponList(),
      ])
      
      let liveInfo = getVal(liveData, 'data.data.entity')
      let chargeConfigs = getVal(vipData, 'data.data.vipChargeconfig', [])

      chargeConfigs = chargeConfigs
        .filter(item => item.status === 'Y')
        .map(item => {
          let chargeStr = `￥${formatMoney(item.amount)}/${item.chargeMonths}个月`
          let amount = formatMoney(item.amount)
          return {
            ...item,
            chargeStr,
            amount,
          }
        })

      let activeChargeIndex = 0
      let originalPrice = chargeConfigs[0].amount
      
      this.setData({
        businessInfo: liveInfo,
        originalPrice,
        chargeConfigs,
        activeChargeIndex,
      })  
      
      this.getCouponListThen(couponList)
      this.updatePriceInfo();
    } catch (error) {
      console.error('初始化vip信息失败: ',error)
    } finally {
      app.hideLoading()
    }
  },

  async fetchLiveInfo() {
    const { liveId } = this.data
    const result = await request({
      url:'/api/studio-weapp/live/info',
      data: { liveId },
    })

    return result
    // const liveInfo = getVal(result, 'data.data.entity') 
    
    // this.setData({ businessInfo: liveInfo })
  },

  async fetchVipCharge() {
    const { liveId } = this.data

    const result = await request({
      url: '/api/studio-weapp/live/vip/charge-info',
      data: { liveId },
    })

    return result
    // this.setData({ vipInfo: getVal(result, 'data.data', {}) })
  },

  /**
   * 修改配置后调用，更新最终价格信息
   */
  updatePriceInfo() {
    let { activeCoupon } = this.data;

    let couponPrice = 0,
        finalPrice = this.getCurPrice();

    console.log('当前原价:', finalPrice);

    if (activeCoupon) {
      console.log('当前优惠:', activeCoupon.money, activeCoupon);
      couponPrice = activeCoupon.money;
      finalPrice = fixPrice(finalPrice - couponPrice);
      finalPrice < 0 && (finalPrice = 0);
    }

    this.setData({
      couponPrice,
      finalPrice
    })
  },

    
  /**
   * 获取当前charge的价格，根据是否打折有差异
   */
  getCurPrice() {
    let { chargeConfigs, activeChargeIndex } = this.data,
        result = 0;

    if (chargeConfigs) {
      let activeCharge = chargeConfigs[activeChargeIndex];

      if (activeCharge) {
        // 是否为折扣价格
        result = activeCharge.discountStatus === 'Y' ? activeCharge.discount : activeCharge.amount;
      }
    }

    return result;
  },


  tapSelectCharge() {
    this.setData({
      showWinSelectCharge: true
    })
  },


  cancelSelectCoupon() {
    this.setData({
      showWinSelectCharge: false
    })
  },


  tapChargeItem(e) {
    let index = e.currentTarget.dataset.index;

    let { chargeConfigs, activeCoupon } = this.data,
        activeCharge = chargeConfigs[index];

    this.setData({
      activeChargeIndex: index,
      activeCoupon,
      showWinSelectCharge: false
    });

    this.selectOptimizedCoupon();
    this.updatePriceInfo();
  },


  async getCouponList() {
    this.setData({async_couponList: {
      status: 'pending'
    }})

    let { businessType, businessId } = this.data;

    if (this.query.activityCode) {
      await global.commonService.bindActivityCode(businessType, businessId, this.query.activityCode)
        .then(res => {
          console.log('activityCode', res.data)
        })
        .catch(err => {
          console.error('activityCode', err)
        })
    }
    
    return request({
      url: '/api/studio-weapp/mine/coupon-list', // /h5/coupon/myCouponList
      data: {
        businessType,
        businessId
      }
    }).then(res => {
      if (res.statusCode !== 200) throw Error('请求接口失败');
      if (res.data.state.code) throw Error(res.data.state.msg);

      let couponList = res.data.data.couponList || [];
      return couponList;

    }).catch(err => {
      console.log(err)
      this.setData({async_couponList: {
        status: 'error',
        message: err.message || '获取优惠券失败'
      }})
    })
  },


  getCouponListThen(couponList) {
    if (!couponList) return; // catch时的情况

    // 从大到小排序
    couponList = couponList.sort((l, r) => {
      return l.money < r.money ? 1 : -1;
    });

    // 设置name字段
    let name = this.data.businessInfo.name;
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
    })

    this.selectOptimizedCoupon();
    this.updatePriceInfo();
  },


  tapSelectCoupon() {
    /**
     * 跳选择优惠券页前
     * 1.过滤可用优惠券
     * 2.保存优惠券信息，randomId签名
     */
    let { async_couponList, activeCoupon } = this.data,
        couponList = async_couponList.data || [],
        curPrice = this.getCurPrice(),
        _actId = this._actId;

    let cache = {
      _actId,
      data: couponList,
      activeCoupon,
      name: this.data.businessInfo.name,
    }

    // 保存缓存
    app._paymentDetailsCouponCache = cache;

    linkTo.couponSelect({
      type: this.data.businessType,
      channelId: this.data.channelId,
      topicId: this.data.topicId,
      liveId: this.data.liveId,
      curPrice: this.getCurPrice(),
      _actId
    });
  },


  selectOptimizedCoupon() {
    /**
     * 默认为用户选择课程券/系列课券中金额最大的
     * 若无，选择通用券中金额最大的
     * 若无，选择平台活动券中金额最大的
     * 
     * couponType topic=课程优惠券，channel=系列课优惠券，vip=VIP优惠券，live=直播间通用券，ding_zhi=定制券
     */
    let { canUseCoupon, async_couponList } = this.data;
    if (!canUseCoupon) return;
    let couponList = async_couponList.data;
    if (!couponList || !couponList.length) return;
    
    let curPrice = this.getCurPrice(),
        couponListMap = {},
        activeCoupon;

    // 分类
    couponList.forEach(coupon => {
      // 过滤不符合最低使用价格的
      if (coupon.minMoney && coupon.minMoney > curPrice) return

      couponListMap[coupon.couponType] || (couponListMap[coupon.couponType] = [])
      couponListMap[coupon.couponType].push(coupon)
    })

    const selectCoupon = list => {
      if (!activeCoupon && list && list.length) {
        activeCoupon = list[0]
      }
    }

    selectCoupon(couponListMap.topic)
    selectCoupon(couponListMap.channel)
    selectCoupon(couponListMap.live)
    selectCoupon(couponListMap.ding_zhi)

    this.setData({
      activeCoupon
    });
  },


  pay() {
    let businessType = this.data.businessType;

    if (businessType === 'channel') {
      this.payChannel();
    } else if (businessType === 'topic') {
      this.payTopic();
    } else if (businessType === 'vip'){
      this.payVip();
    }
  },


  payChannel() {
    let { liveId, chargeConfigs, activeChargeIndex, activeCoupon, finalPrice, channelId } = this.data,
      activeCharge = chargeConfigs[activeChargeIndex],
      total_fee = finalPrice * 100;

    let data = {
      type: 'CHANNEL',
      total_fee,
      source: 'wxapp',
      liveId: liveId,
      channelId,
      ifboth: 'Y',
      chargeConfigId: activeCharge.id,
      shareKey: this.query.shareKey || '',
      ch: this._ch || '',
    };

    if (activeCoupon) {
      data.couponId = activeCoupon.couponId;
      data.couponType = activeCoupon.couponType;
    }

    console.log(data);

    let successCallback = () => {        
      app.hideLoading()
      global.loggerService.event({
        category: 'pay',
        action: 'success',
        payType: 'CHANNEL',
        money: total_fee
      })

      if (this._paySuccessGoBack) {
        app._paymentDetailsResultCache = {...this._paymentDetailsResultCache, hasPay: true}
        wx.navigateBack()
      } else {
        wx.redirectTo({
          url: `/pages/channel-index/channel-index?channelId=${this.data.channelId}&topicId=${this.data.topicId || ''}`,
        })
      }
    }

    order({
      data,
      success: () => {
        successCallback();
      },
      payComplete: () => {
        app.showLoading();
        setTimeout(this.payResult, 6000);
      },
      payFree: () => {
        successCallback();
      }
    });
  },


  payTopic() {
    let { businessInfo, activeCoupon, finalPrice } = this.data,
        { createBy } = businessInfo,
        total_fee = finalPrice * 100;

    let data = {
      toUserId: createBy,
      source: 'wxapp',
      topicId: this.query.topicId,
      total_fee,
      type: 'COURSE_FEE',
      ifboth: 'Y',
      shareKey: this.query.shareKey || '',
      ch: this._ch || '',
    };

    if (activeCoupon) {
      data.couponId = activeCoupon.couponId;
      data.couponType = activeCoupon.couponType;
    }

    console.log(data);

    const successCallback = () => {
      app.hideLoading()
      global.loggerService.event({
        category: 'pay',
        action: 'success',
        payType: 'COURSE_FEE',
        money: total_fee
      })

      if (this._paySuccessGoBack) {
        app._paymentDetailsResultCache = {...this._paymentDetailsResultCache, hasPay: true}
        wx.navigateBack()
      } else {
        wx.redirectTo({
          url: '/pages/intro-topic/intro-topic?topicId=' + this.data.topicId,
        })
      }
    }

    order({
      data,
      success: () => {
        successCallback();
      },
      payComplete: () => {
        app.showLoading();
        setTimeout(this.payResult, 6000);
      },
      payFree: () => {
        successCallback();
      }
    });
  },

  payVip() {
    try {
      const { businessInfo, chargeConfigs,activeChargeIndex, activeCoupon, finalPrice } = this.data
      const  { createBy } = businessInfo
      const total_fee = finalPrice * 100
      const activeCharge = chargeConfigs[activeChargeIndex]
  
      const params = {
        toUserId: businessInfo.createBy,
        source: 'web',
        liveId: businessInfo.id,
        total_fee,
        chargeConfigId: activeCharge.id,
        type: 'LIVEVIP',
        ifboth: 'Y',
        shareKey: this.query.shareKey || '',
        ch: this._ch || '',
      }
  
      if (activeCoupon) {
        params.couponId = activeCoupon.couponId;
        params.couponType = activeCoupon.couponType;
      }
  
      orderInAnotherWeapp(params, '/pages/index/index')
      // let url = fillParams(params, '__H5_PREFIX/wechat/page/studio-weapp-pay');
      // linkTo.webpage(url);
    } catch (error) {
      console.error('发起vip支付失败: ', error)
    }  
  },
})



/**
 * 转化为最多两位小数的价格数字
 */
function fixPrice(num) {
  return Math.round(num * 100) / 100;
}