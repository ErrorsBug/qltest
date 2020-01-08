
import { api } from './common';

export const UNDATE_CHANNEL_INTRO_LIST = 'UNDATE_CHANNEL_INTRO_LIST';




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
        }
        

        return thisList
    }
};


export function saveChannelIntro (category,channelId,profiles) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            method:"POST",
            url: '/api/wechat/channel/save-channel-intro',
            body: {
                category,channelId,profiles
            }
        });

 

        return result
    }
};



