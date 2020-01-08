import { linkTo } from './util';

/**
 * 优惠券数组处理
 * @param {array}   list    优惠券数组
 * @param {string}  status  优惠券状态   bind:待使用,used:已使用,overdue:已过期
 * @param {string}  couponType    优惠券类型
 *    topic:课程
 *    channel:系列课
 *    vip:直播间vip
 *    live:直播间
 *    ding_zhi:平台券(设置系列课和单课，跨直播间使用)
 *    relayChannel:转载系列课优惠券
 */
export function couponListFilter({list = [], status, couponType}) {
  list.forEach(coupon => {

    if (status) {
      coupon.status = status;
    }

    if (!coupon.couponType) {
      coupon.couponType = couponType || coupon.type;
    }

    let title = '';
    switch (coupon.couponType) {
      case 'topic':
        title = `仅可购买课程《${coupon.name}》`;
        break;
      case 'channel':
        title = `仅可购买系列课《${coupon.name}》`;
        break;
      case 'live':
        title = `可在【${coupon.name}】直播间使用`;
        coupon.liveName = coupon.name;
        break;
      case 'vip':
        title = `仅可购买【${coupon.name}】VIP会员`;
        break;
      case 'ding_zhi':
        title = coupon.codeName;  // 定制券才有这个字段，活动券名称
        break;
      case 'relay_channel':
        title = `仅限系列课《${coupon.name}》使用`;
        break;
    }
    coupon.title = title;

    // 坑，overTime有些是时间戳，有些是日期字符串xx-xx-xx
    let _overTime = (new Date(coupon.overTime)).getTime();

    // 是否永久有效
    let isForever = (coupon.couponType == 'live' && !coupon.overTime) ||
        _overTime - Date.now() > 315360000000;
    coupon.isForever = isForever;

    // 是否即将过期
    let isOverTimeSoon = !isForever && coupon.status === 'bind' && _overTime - Date.now() < 259200000;
    coupon.isOverTimeSoon = isOverTimeSoon;

    let timeStr = '';
    if (!isForever) {
      // 针对自媒体转载系列课的定制券需要显示'2017/06/06至2017/06/08'的时间格式
      if (coupon.couponType === 'relay_channel') {
        let startTime = new Date(coupon.startTime);
        let overTime = new Date(coupon.overTime);
        timeStr = `${startTime.getFullYear()}/${startTime.getMonth() + 1}/${startTime.getDate()}至${overTime.getFullYear()}/${overTime.getMonth() + 1}/${overTime.getDate()}`;
      } else {
        let t = new Date(coupon.overTime)
        timeStr = t.getFullYear() + '/' + (t.getMonth() + 1) + '/' + t.getDate() + ' 前可使用';
      }
    }
    coupon.timeStr = timeStr;

    let moneyLen = String(coupon.money).length;
    let moneyStyle = moneyLen > 3 ? moneyLen > 5 ? 'sm' : 'md' : '';
    coupon.moneyStyle = moneyStyle;
  })
  
  return list;
}




export function useCoupon(coupon) {
  switch (coupon.couponType) {
    case 'topic':
      return linkTo.paymentDetails({
        type: 'topic',
        topicId: coupon.businessId
      });
    case 'channel':
      return linkTo.paymentDetails({
        type: 'channel',
        channelId: coupon.businessId
      });
    case 'vip':
      // TODO
      return linkTo.paymentDetails({
        type: 'channel',
        channelId: coupon.businessId
      });
    case 'live':
      return linkTo.liveIndex(coupon.businessId);
    case 'ding_zhi':
      return wx.redirectTo({
        url: '/pages/index/index'
      })
  }
}