// 新建打卡训练营
export const newCamp = {
    path: 'check-in-camp/new-camp/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/new-camp').default);
        });
    }
};

// 编辑训练营
export const editCamp = {
    path: 'check-in-camp/edit-camp/:campId/:liveId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/new-camp').default);
        });
    }
}

// 编辑训练营简介
export const campIntroEdit = {
    path: 'check-in-camp/camp-intro-edit/:campId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/camp-intro-edit'));
        });
    }
}

// 训练营详情页面
export const campDetail = {
    path: 'camp-detail',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/camp-detail').default);
        });
    }
};

// 新建小图文
export const littleGraphicCreate = {
    path: 'check-in-camp/create-little-graphic/:liveId/:campId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/little-graphic-create').default);
        });
    }
};
// 小图文详情页
export const littleGraphicDetail = {
    path: 'detail-little-graphic',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/little-graphic-detail').default);
        });
    }
};


// C端 - 我的打卡列表
export const joinList = {
    path: 'check-in-camp/join-list',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/my-join-list').default);
        });
    }
}

// 查看自己的训练营打卡排行榜(需登录)
export const checkInRanking = {
    path: 'check-in-camp/check-in-ranking/:campId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/check-in-ranking').default);
        });
    }
}

// 查看分享的训练营打卡排行榜(从分享链接进入，无需登录)
export const checkInRankingShared = {
    path: 'check-in-camp/check-in-ranking/:campId/:shareUser',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/check-in-ranking').default);
        });
    }
}

// 我的打卡日记
export const checkInDiary = {
    path: 'check-in-camp/check-in-diary/:campId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/check-in-diary').default);
        });
    }
}


// 我的打卡日记
export const checkInUserManage = {
    path: 'check-in-camp/user-manage/:campId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/user-manage').default);
        });
    }
}