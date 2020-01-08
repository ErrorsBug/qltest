import {getLocalStorage,setLocalStorage} from 'components/util'

const convertTime = (nowDate,Deadline) => {
    // 分割参数Deadline
    var _dateArr = Deadline.split(':');
    // 分别获取参数中对应的时、分、秒
    var hours = parseInt(_dateArr[0]);
    var minutes = parseInt(_dateArr[1]);
    var seconds = parseInt(_dateArr[2]);
    // 设置对应时分秒
    nowDate.setHours(hours); 
    nowDate.setMinutes(minutes); 
    nowDate.setSeconds(seconds);
    var distance = Date.parse(nowDate) - new Date().getTime()
    return distance/1000
}


// 需求：
// 1、每天首次点赞必显示提示语
// 2、当天后续每隔5次点赞，出现一次提示语
// 3、提示语从以下模板轮流取文案：
    // -生成长图海报，发给其他人看看吧~
    // -最大的认可就是分享哦！
    // -点这里可以生成长图海报
    // -喜欢这个想法就扩散出去吧！

/**
 * @desc:利用cookie有效性
 * 1、点赞后判断cookie中有没有有效值，如果没有说明是当天第一次点赞 （cookie 每天24:00:00失效）
 * 2、如果有，说明不是当天第一次点赞，根据cookie值判断当前点击次数是不是5的倍数
 * 3、点赞自己的，不需要显示提示语
 * @return:是否需要展示提示needShowTips，提示语tips
 */
const shareTipsList = [
    "生成长图海报，发给其他人看看吧",
    "最大的认可就是分享哦！",
    "点这里可以生成长图海报",
    "喜欢这个想法就扩散出去吧！"
]
const getTips = () => {
    let i = Math.floor(Math.random()*shareTipsList.length)
    return shareTipsList[i]
}

export function addLikeNum(isMine) {
    if(isMine){
        return [false,'']
    }
    let clickLikeNum = Number(getLocalStorage('clickLikeNum')) || 0
    let needShowTips = false
    let tips = ''

    clickLikeNum += 1

    if(clickLikeNum == 1 || clickLikeNum % 5 == 0){
        tips = getTips()
        needShowTips = true
    } else {
        needShowTips = false
    }
    let _expires = convertTime(new Date() , '24:00:00')
    setLocalStorage('clickLikeNum', clickLikeNum, _expires)
    
    return [needShowTips,tips]
}