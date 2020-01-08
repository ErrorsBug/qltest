import { setStorageSync, getStorageSync } from './util';

// 话题播放历史查询key值
const __topicPlayHiskey = 'topic_play_his';

// 存储话题播放历史最大条数
const __maxTopicPlayHisNUm = 10;

/**
 * 获取最后一次话题播放的本地存储信息
 * @type {[type]}
 */
export const getLastTopicPlayInfo = () => {
    let hisTopicPlayInfoList = getStorageSync(__topicPlayHiskey) || [];

    if (hisTopicPlayInfoList.length) {
        return hisTopicPlayInfoList[hisTopicPlayInfoList.length - 1];
    }

    return;
}

/**
 * 根据话题id查找历史播放信息
 * @param  {[type]} topicId [description]
 * @return {[type]}         [description]
 */
export const getHisTopicPlayInfo = (topicId) => {

    let hisTopicPlayInfoList = getStorageSync(__topicPlayHiskey) || [];
    let topicPlayInfo;

    for (var i = hisTopicPlayInfoList.length - 1; i >= 0; i--) {
        if (topicId == hisTopicPlayInfoList[i].topicId) {
            topicPlayInfo = hisTopicPlayInfoList[i];
            break;
        }
    }

    return topicPlayInfo;
}

/**
 * 将话题的播放信息存储到本地
 * @type {[type]}
 */
export const saveTopicPlayInfoToHis = (topicPlayInfo) => {

    let info = {
        topicId: topicPlayInfo.topicId,
        second: topicPlayInfo.second,
        title: topicPlayInfo.title,
        audioId: topicPlayInfo.audioId,
        audioCreateTime: topicPlayInfo.audioCreateTime,
        backgroundImgUrl: topicPlayInfo.backgroundImgUrl,
    }

    let hisTopicPlayInfoList = getStorageSync(__topicPlayHiskey) || [];

    // 删除旧的记录
    for (var i = hisTopicPlayInfoList.length - 1; i >= 0; i--) {
        if (info.topicId == hisTopicPlayInfoList[i].topicId) {
            hisTopicPlayInfoList.splice(i, 1);
            break;
        }
    }

    if (info.topicId) {
        hisTopicPlayInfoList.push(info);
    } else {
        console.error('保存历史出错，缺少topicId');
        return false;
    }

    while (hisTopicPlayInfoList.length > __maxTopicPlayHisNUm) {
        hisTopicPlayInfoList.shift();
    }

    setStorageSync(__topicPlayHiskey, hisTopicPlayInfoList);
}
