export const CourseConsult = {
    path: "live/message/:liveId",
    getComponent: function(nextState, callback) {
        require.ensure([], require => {
            callback(null, require("../containers/course-consult").default);
        });
    }
};

export const ConsultManage = {
    path: "live/messageManage/:topicId",
    getComponent: function(nextState, callback) {
        require.ensure([], require => {
            callback(null, require("../containers/consult-manage").default);
        });
    }
};
