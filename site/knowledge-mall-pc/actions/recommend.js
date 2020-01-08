import { apiService } from "../components/api-service";

export const FETCH_MODULE_COURSE_LIST = 'FETCH_MODULE_LIST';

export const FETCH_RECOMMEND_MODULE = 'FETCH_RECOMMEND_MODULE';

export const FETCH_TOP_TEN_COURSE = 'FETCH_TOP_TEN_COURSE';

export const FETCH_HIGH_BONUS_ITEM = 'FETCH_HIGH_BONUS_ITEM';

export const UPDATE_RELAY = 'UPDATE_RELAY'

export function fetchModuleCourseList ({liveId =  "", agentId = ''}) {
    return async (dispatch) => {
        let res = await apiService.get({
            url: '/h5/knowledge/moduleList',
            body: {

            }
        })
        
        if (res.state.code == 0) {
            let {moduleList} = res.data;
            if (Array.isArray(moduleList)) {
                let moduleCourseList = await getModuleCourse({moduleList, liveId, agentId});
                dispatch({
                    type: FETCH_MODULE_COURSE_LIST,
                    moduleCourseList: {
                        list: moduleCourseList,
                    }
                })
            }

        } else {

        }
    }
}

const getModuleCourse = ({moduleList, liveId = '', agentId = ''}) => {
   
    function genPromise (moduleList) {
        return moduleList.map(item => {
            return apiService.post({
                url: '/h5/knowledge/moduleCourseList',
                body: {
                    liveId: liveId,
                    agentId: agentId,
                    moduleName: item.code,
                    page: {
                        page: 1
                    }
                }
            }).then(res => {
                if (res.state.code == 0) {
                    let list = res.data.moduleCourseList
                    list = list.map(course => {
                        course.title = item.title
                        return course;
                    })
                    item.courseList = Array.isArray(list) ? list: [];
                }
                return item;
            })
        })
    }

    return Promise.all(genPromise(moduleList))
}

export const updateRelay = (channelInfo, list) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_RELAY,
            payload: {
                channelInfo,
                list
            }
        })
    }
}

export const fetchRecomendModuleList = (function () {
    var atTheEnd = false;
    var page = 1;
    return function ({liveId = '', agentId = ''}) {
        return async (dispatch) => {
            let res = await apiService.post({
                url: '/h5/knowledge/recommendCourseList',
                body: {
                    liveId: liveId,
                    agentId: agentId,
                    page: {
                        page: atTheEnd ? page = 1 : page,
                        size: 8
                    }
                }
            });
            if (atTheEnd) {
                atTheEnd = false;
            }
            if (res.state.code == 0) {
                if (res.data.recommendList.length == 0 && page !=1) {
                    atTheEnd = false;
                    page = 1;
                    fetchRecomendModuleList({liveId, agentId});
                    return 
                }
    
                if (res.data.recommendList.length < 8) {
                    atTheEnd = true;
                }
    
                page = ++page;
    
                dispatch({
                    type: FETCH_RECOMMEND_MODULE,
                    recommendModule: {
                        ...res.data,
                        list: res.data.recommendList
                    }
                })
                
            }
        }
    }
}) ()

/**
 * 获取热销top10的课程
 * @param {string} liveId 当前选择的直播间的liveId
 * @param {string} agentId 一级代理商的agentId
 */
export function fetchTopTenCourses(liveId = '', agentId = '') {
    return async (dispatch) => {
        const result = await apiService.post({
            url: '/h5/knowledge/hotCourseList',
            body: {
                liveId,
                agentId,
                page: {
                    page: 1,
                    size: 10
                }
            },
            showError: true,
        });
        if (result.state.code == 0) {
            if (Array.isArray(result.data.hotCourseList) && result.data.hotCourseList.length > 0) {
                dispatch({
                    type: FETCH_TOP_TEN_COURSE,
                    topTenCourse: {
                        list: result.data.hotCourseList,
                    }
                })
            }
        }
    }
}