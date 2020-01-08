
import { api } from './common';

export const UNDATE_CHANNEL_INTRO_LIST = 'UNDATE_CHANNEL_INTRO_LIST';
export const CAMP_LIVE_SHARE_KEY = 'CAMP_LIVE_SHARE_KEY';



// 获取介绍内容
export function getChannelIntro (category,channelId) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            url: '/api/wechat/channel/get-channel-intro',
            body: {
                category,channelId
            }
        });
        
        let thisList = result;
        switch(category){
            case "desc" : 
                    thisList = result.data && result.data.descriptions && result.data.descriptions.desc || []
                    dispatch({
                        type: UNDATE_CHANNEL_INTRO_LIST,
                        channelIntroList: thisList
                    });
                break;
            case "videoDesc" : 
                    thisList = result.data && result.data.descriptions && result.data.descriptions.videoDesc || []
                break;
            case "lectuerInfo" : 
                    thisList = result.data && result.data.descriptions && result.data.descriptions.lectuerInfo || []
                    dispatch({
                        type: UNDATE_CHANNEL_INTRO_LIST,
                        channelIntroList: thisList
                    });
                break;
            case "suitable" : 
                    thisList = result.data && result.data.descriptions && result.data.descriptions.suitable || []
                    dispatch({
                        type: UNDATE_CHANNEL_INTRO_LIST,
                        channelIntroList: thisList
                    });
                break;
            case "gain" : 
                    thisList = result.data && result.data.descriptions && result.data.descriptions.gain || []
                    dispatch({
                        type: UNDATE_CHANNEL_INTRO_LIST,
                        channelIntroList: thisList
                    });
                break;
            case "campDesc" :
                    thisList = result.data && result.data.descriptions && result.data.descriptions.campDesc || []
                    dispatch({
                        type: UNDATE_CHANNEL_INTRO_LIST,
                        channelIntroList: thisList
                    });
                break;
        }
        

        return thisList
    }
};


export function saveChannelIntro (category,campId,profiles) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method:"POST",
            url: '/api/wechat/checkInCamp/saveCampIntro',
            body: {
                category,campId,profiles
            }
        });

 

        return result
    }
};

// 系列课直播间分销商shareky
export function initLshareKey(lshareKey) {
    return {
        type: CAMP_LIVE_SHARE_KEY,
        lshareKey,
    };
};

