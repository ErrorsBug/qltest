import { api } from "./common";
export const APPEND_TOPIC_SORT_LIST = "APPEND_TOPIC_SORT_LIST";
export const APPEND_TOPIC_SORT_LIST_PAGE = "APPEND_TOPIC_SORT_LIST_PAGE";
export const CHANGE_TOPIC_SORT_WEIGHT = "CHANGE_TOPIC_SORT_WEIGHT";

export function saveTopicSort(liveId) {
  return async (dispatch, getStore) => {
    var dataArray = [];
    const channelTopics = getStore().topicListSort.topicList.map(item => {
      return {
        id: item.id,
        topicWeight: +item.topicWeight
      };
    });
    const result = await api({
      dispatch,
      getStore,
      url: "/api/wechat/topic/doSetTopicsSort",
      body: {
        liveId,
        topics: channelTopics
      },
      method: "POST"
    });

    return result;
  };
}

function ge(topicId, weight, getStore) {
  var cList = getStore().topicListSort.topicList;

  var result = cList.map(topic => {
    if (topic.id == topicId) {
      topic.topicWeight = weight;
    }
    return topic;
  });
  return result;
}

export function changeTopicSort(topicId, weight) {
  return async (dispatch, getStore) => {
    var result = await ge(topicId, weight, getStore);
    dispatch({
      type: CHANGE_TOPIC_SORT_WEIGHT,
      topicList: result || []
    });
  };
}

// 获取我的系列课话题排序列表
export function getTopicSort(liveId, page, size) {
  return async (dispatch, getStore) => {
    const result = await api({
      dispatch,
      getStore,
      showLoading: page == 1,
      url: "/api/wechat/topic/getTopicForSort",
      method: "POST",
      body: {
        liveId,
        page,
        size
      }
    });

    dispatch({
      type: APPEND_TOPIC_SORT_LIST,
      topicList: (result.data && result.data.topicList) || []
    });
    dispatch({
      type: APPEND_TOPIC_SORT_LIST_PAGE,
      topicPageNum: page + 1
    });

    return result;
  };
}
