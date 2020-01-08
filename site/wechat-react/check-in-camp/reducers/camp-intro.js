import {
   UNDATE_CHANNEL_INTRO_LIST,
   CAMP_LIVE_SHARE_KEY,
} from '../actions/camp-intro-edit'

const initState = {
    introList:[],
};

export function channelIntro (state = initState, action) {
    switch (action.type) {

        case UNDATE_CHANNEL_INTRO_LIST:
            return { 
                ...state,
                introList: [...action.channelIntroList],
            };
        case CAMP_LIVE_SHARE_KEY:
            return { 
                ...state,
                lshareKey: [...action.lshareKey],
            };

        default:
            return state;
    }
}
