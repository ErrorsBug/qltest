import { 
    INIT_COURSE,
    SET_PAGE_NUM,
    EDIT_COURSE,
    EDIT_ALL_COURSE,
}from '../actions/excellent-course';
const init = {
    initCourse: [],
    isfetch: false,
    isShare: '',
    pageNum: 1,
    pageSize: 20,
};
export function excellentCourse (state = init, action) {
    switch (action.type) {
        case INIT_COURSE:
            const newList = action.data.courseList ? action.data.courseList : [];
            return { 
                ...state, 
                initCourse: [...state.initCourse, ...newList],
                isShare: action.data.isShare,
                isFetch: true,
            }
        case SET_PAGE_NUM:
            return { ...state, pageNum: action.pageNum };
        case EDIT_ALL_COURSE: 
            action.data.map((item,index) => {item.applyStatus = 'Y'})
            return {
                ...state,
                initCourse: action.data,
            }
        case EDIT_COURSE:
            action.data.find((item,index) => {
                if(item.businessId === action.id){
                    item.applyStatus = 'Y';
                }
            })
            return {
                ...state,
                initCourse: action.data,
            }
        default:
            return state;
    }
}