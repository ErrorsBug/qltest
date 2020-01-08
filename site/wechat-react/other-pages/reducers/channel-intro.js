import {
   UNDATE_CHANNEL_INTRO_LIST,
} from '../actions/channel-intro-edit'

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


        default:
            return state;
    }
}
