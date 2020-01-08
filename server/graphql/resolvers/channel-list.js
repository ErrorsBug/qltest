import { getChannelTags, getChannelList, getChangeChannelList } from '../../api/wechat/live';

export default {

    Query: {
        async channelTags({ req }, { liveId, type }) {
            const result = await getChannelTags({
                liveId,
                type,
            });

            return result.data && result.data.channelTagList;
        },
        
        async channelList({ req }, { liveId, tagId, isCamp, page, size }) {
            const result = await getChannelList({
                liveId,
                tagId,
                isCamp,
                page: {
                    page,
                    size,
                }
            },req);

            return result.data && result.data.liveChannels
        },

        async changeChannelList({ req }, { liveId, page, size }) {
            const result = await getChangeChannelList({
                liveId,
                page: {
                    page,
                    size,
                }
            });

            return result.data && result.data.channels
        }
    }
}
