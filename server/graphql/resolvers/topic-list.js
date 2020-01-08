import { getTopicList } from '../../api/wechat/live';
import { hideTopic } from '../../api/wechat/topic';

export default {
    Query: {
        async topicList({ req }, { liveId, channelId, userId, queryData, style, page, size }) {
            if (!userId) {
                userId = req.rSession.user.userId
            }

            const result = await getTopicList({
                liveId,
                channelId,
                userId,
                queryData,
                style,
                page: {
                    page,
                    size
                }
            }, req);

            return result.data && result.data.liveTopics;
        }
    },

    Mutation: {
        async changeTopicHidden({ req }, { topicId, displayStatus }) {
            // 假的！我不做任何事的！假的，哈哈哈哈哈哈，前端做的，迟早要把graphql干掉，哈哈哈啊哈哈哈

            // const result = await hideTopic({
            //     topicId,
            //     status: displayStatus
            // })


            return null;
        }
    }
}