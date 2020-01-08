import {
    INIT_RECOMMEND_COURSE_LIST,
    INIT_RECOMMEND_BANNER_LIST,
    SET_RECOMMEND_COURSE_PAGE_OFFSET,
    FETCH_RECOMMEND_COURSE_LIST,
    INIT_RECOMMEND_CATEGORY_LIST,
    RECOMMEND_CATEGORY_CHANGE,
    RECOMMEND_SHOW_FLAG,
    IS_MINE_NEW,
    INIT_TWO_LEVEL_TAG,
    INIT_HOT_LIVE_LIST,
    UPDATE_ARTICLES,
    UPDATE_HOTTAG_TAGS,
    UPDATE_HOTTAG_COURSE,
    SHOW_HOTTAG_SECTION,
    UPDATE_COURSE_CURINDEX,
    CLEAR_HOT_TAG_COURSE_LIST,
    CLEAR_HOTTAG_TAGS,
    INSERT_RECOMMEND_COURSE_LIST_TO_TOP,
    INIT_ICON_LIST,
    INIT_CAPSULE_ICON,
    NIGHT_ANSWER_INFO,
    NIGHT_ANSWER_IF_REQUEST,
    IS_EVEN,
    INIT_INDEX_DATA,
} from '../actions/recommend'

const initState = {
    indexData: [],
    banners: [],
    categoryId: 0,
    courseData: {},
    courseOffset: 0,
    coursePageSize: 20,
    categoryList: [],
    isShowFlag:{},
    isMineNew:{},
    twoLevelAllTags: [],
    hotLives: [],
    articles: [],
    hotTags: [],
    hotTagList: [],
    showHotTag:false,
    iconList: [],
    capsuleIcon: {},
    appOpenId: '',
    nightShowInfo: {},
    nightAnswerIfRuquest: false,
    isEven: false
};

export function recommend(state = initState, action) {
    switch (action.type) {
        case INIT_INDEX_DATA:
            return { ...state, indexData: action.data};
        case INIT_RECOMMEND_COURSE_LIST:
            // let initList = action.courseList || [];
            // initList = initList.filter(item => item.displayStatus != 'N');
            // console.log(initList);

            return { ...state, courseData: {...courseData, [action.categoryId]: action.courseList}};
        case FETCH_RECOMMEND_COURSE_LIST:
            let courseData = {...state.courseData};
            courseData[action.categoryId] = courseData[action.categoryId] || [];
            courseData[action.categoryId] = [...courseData[action.categoryId], ...action.courseList];
            return { ...state, courseData: courseData};
        case INSERT_RECOMMEND_COURSE_LIST_TO_TOP:
            let courseData1 = {...state.courseData};
            courseData1[action.categoryId] = courseData1[action.categoryId] || [];
            courseData1[action.categoryId] = [...action.courseList, ...courseData1[action.categoryId]];
            return { ...state, courseData: courseData1};
        case INIT_RECOMMEND_BANNER_LIST:
            return { ...state, banners: action.banners};
        case NIGHT_ANSWER_INFO:
            return { ...state, nightShowInfo: action.info};
        case NIGHT_ANSWER_IF_REQUEST:
            return { ...state,nightAnswerIfRuquest: true};
        case SET_RECOMMEND_COURSE_PAGE_OFFSET:
            return { ...state, courseOffset: action.courseOffset};
        case INIT_RECOMMEND_CATEGORY_LIST:
            return {...state, categoryList: [{id: 0, name: '推荐'}, ...action.categoryList]};
        case RECOMMEND_CATEGORY_CHANGE:
            return {...state, categoryId: action.categoryId};
        case RECOMMEND_SHOW_FLAG:
            return {
                ...state,
                isShowFlag: action.showFlag
            };
        case IS_MINE_NEW:
            return {
                ...state,
                isMineNew: action.isMineNew
            };
        case INIT_TWO_LEVEL_TAG:
            return {
                ...state,
                twoLevelAllTags: action.allTags
            };
        case INIT_HOT_LIVE_LIST:
            return {
                ...state,
                hotLives: action.hotLives,
            }
        case UPDATE_ARTICLES:
            return {
                ...state,
                articles: action.data,
            }
        case UPDATE_HOTTAG_TAGS:
            return {
                ...state,
                hotTags: action.tags,
                hotTagList: action.courses
            }
        case UPDATE_HOTTAG_COURSE:
            return {
                ...state,
                hotTagList: state.hotTagList.map((item, index) => {
                    if (item.tagId === action.data.tagId) {
                        return {
                            ...item,
                            ...action.data,
                            page: action.data.page + 1,
                            courses: item.courses.concat(action.data.courses),
                            noMore: action.data.courses.length < item.size,
                        }
                    }
                    return item
                })
            }
        case SHOW_HOTTAG_SECTION:
            return {
                ...state,
                showHotTag: true,
            }
        case UPDATE_COURSE_CURINDEX:
            return {
                ...state,
                hotTagList: state.hotTagList.map((item, index) => {
                    if (item.tagId === action.data.tagId) {
                        return {
                            ...item,
                            curIndex: action.data.curIndex,
                        }
                    }
                    return item
                })
            }
        case CLEAR_HOT_TAG_COURSE_LIST:
            return {
                ...state,
                hotTagList:[],
            }
        case CLEAR_HOTTAG_TAGS:
            return {
                ...state,
                hotTags: [],
            }
        case INIT_ICON_LIST:
            return {
                ...state,
                iconList: action.iconList,
            }
        case INIT_CAPSULE_ICON:
            return {
                ...state,
                capsuleIcon: action.capsuleIcon,
                appOpenId: action.appOpenId,
            }
        case IS_EVEN :
            return {
                ...state,
                isEven: action.flag
            }
        default:
            return state;
    }
}
