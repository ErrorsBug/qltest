export const ThousandLive = {
    path: '/topic/details',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-thousand-live/thousand-live'));
        });
    }
};
export const ThousandLiveVideo = {
    path: '/topic/details-video',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-thousand-live/thousand-live-video'));
        });
    }
};

export const TheLive = {
    path: '/topic/details-live',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-thousand-live/the-live'));
        });
    }
};

export const TopicListening = {
    path: '/topic/details-listening',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-listening'));
        });
    }
};

export const TopicDocs = {
    path: '/wechat/page/topic-docs',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-docs'));
        });
    }
}

export const GuestList = {
    path: '/wechat/page/guest-list',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/guest-list'));
        })
    }
}

export const TabletAudio = {
    path: '/wechat/page/tablet-audio',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/tablet-audio'));
        })
    }
}

export const TopicManuscript = {
    path: '/wechat/page/topic-manuscript',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/topic-manuscript'));
        })
    }
}

export const GuideLiveShare = {
    path: '/wechat/page/live-share',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/guide'));
        })
    }
}

export const InvitationLive = {
    path: '/wechat/page/live-invitation',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/send-invitation'));
        })
    }
}

// 课程数据卡
export const CourseDataCard = {
    path: '/wechat/page/course-data-card/:topicId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/course-data-card').default);
        })
    }
}