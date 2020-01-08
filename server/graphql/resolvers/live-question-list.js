import { whisperList } from '../../api/wechat/live';
import { purchaseCourse, planCourse } from '../../api/wechat/live';

export default {
    Query: {
        questionList: async ({ req }, { page, size, liveId }) => {
            const userId = req.rSession.user.userId;
            const result = await whisperList({
                liveId,
                userId,
            });

            if (result.state.code === 0) {
                return result.data.list || []
            } else {
                return []
            }
        },
    },
}
