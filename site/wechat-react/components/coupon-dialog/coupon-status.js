export const couponStatus = [{
    value: 'unused',
    priority: 20,
    validate: (coupon) => {
        return !coupon.isBinded;
    }
},{
    value: 'binding',
    priority: 30,
    validate: (coupon) => {
        return coupon.afterStatus == 'binding'
    }
},{
    value: 'bindSuccess',
    priority: 40,
    validate: (coupon) => {
        return coupon.afterStatus == 'bindSuccess'
    }
},{
    value: 'bind',
    priority: 60,
    validate: (coupon) => {
        return coupon.isBinded;
    }
},{
    value: 'bind-overdue',
    priority: 90,
    validate: (coupon) => {
        return coupon.isBinded && coupon.isOverTime
    }
},{
    value: 'used-overdue',
    priority: 100,
    validate: (coupon) => {
        return coupon.isUsed && coupon.isOverTime
    }
},{
    value: 'bindOut',
    priority: 50,
    validate: (coupon) => {
        return coupon.isBindout || (coupon.codeNum == coupon.useNum);
    }
},{
    value: 'used',
    priority: 70,
    validate: (coupon) => {
        return coupon.isUsed;
    }
},{
    value: 'unused-overdue',
    priority: 80,
    validate: (coupon) => {
        return !coupon.isBinded && coupon.isOverTime
    }
}]

export const getCouponStatus = (coupon) => {
    let totalStatus = couponStatus.sort((l,r) => {
        return r.priority - l.priority;
    })
    for (let index = 0; index < totalStatus.length; index++) {
        if (totalStatus[index].validate(coupon)) return totalStatus[index].value;
    }
    return 'unused'
}