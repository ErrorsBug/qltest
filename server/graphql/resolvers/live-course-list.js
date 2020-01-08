import { purchaseCourse, planCourse } from '../../api/wechat/live';

export default {
    Query: {
        // 获取已购列表
        async purchaseCourse ({ req }, { page, size=20, liveId }) {
            const userId = req.rSession.user.userId;
            const result = await purchaseCourse({
                page: {
                    page,
                    size,
                },
                liveId,
                userId,
            });
            if (result.state.code === 0) {
                return {
                    list: result.data.list || []
                }
            } else {
                return {list: []}
            }
        },

        // 获取未开播列表
        async planCourseList({ req }, { liveId, page, size }) {
            const userId = req.rSession.user.userId;
            const result = await planCourse({
                liveId,
                userId,
                page: {
                    page,
                    size,
                }
            });
            
            if (result.state.code === 0) {
                return result.data.list || []
            } else {
                return []
            }
        },
    }
}
