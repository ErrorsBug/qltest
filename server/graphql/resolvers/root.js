import { getPower } from '../../api/wechat/live';

export default {
    Query: {
        // 获取权限
        async power({ req }, { liveId, topicId, channelId }) {
            const userId = req.rSession.user.userId;

            const result = await getPower({
                userId,
                liveId,
                topicId,
                channelId,
            })

            if (result.power.state.code == 0) {
                return result.power.data.powerEntity;
            }
        },

        // 获取当前用户信息
        curUserInfo({ req }) {
            return {
                ...req.rSession.user
            }
        }
    }
}