import { getVipInfo } from '../../api/wechat/live';

export default {

    Query: {
        async liveVipInfo({ req }, { liveId }) {
            const userId = req.rSession.user.userId;

            const result = await getVipInfo({
                userId,
                liveId,
            });

            if (result.state.code == 0) {
                return result.data;
            }
        }
    }
}