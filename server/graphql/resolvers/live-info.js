import { getLiveInfo } from '../../api/wechat/live';

export default {
    Query: {
        liveInfo: async ({ req }, { liveId }) => {
            const userId = req.rSession.user.userId;
            const result = await getLiveInfo({
                liveId,
                userId,
            });

            if (result.state.code === 0) {
                return result.data
            }
        },
    },
}
