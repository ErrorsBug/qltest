import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const LIVE_INFO = gql`
    query LiveInfo($liveId: String) {
        # 直播间信息
        liveInfo(liveId: $liveId) {
            entity {
                name
                introduce
                logo
            }
        }
    }
`;

export default graphql(LIVE_INFO, {
    name: 'liveInfo',
    options: props => {
        return {
            variables: {
                liveId: props.router.params.liveId,
            },
            ssr: false
        }
    }
});
