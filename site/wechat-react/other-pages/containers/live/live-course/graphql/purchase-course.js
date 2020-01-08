import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const PURCHASE_COURSE = gql`
    query PurchaseCourse($liveId: String, $page: Int, $size: Int) {
        # 获取已购课程列表
        purchaseCourse (liveId: $liveId, page: $page, size: $size) {
            list {
                bussinessId
                type
                title
                pic
                money
                time
                learningCount
            }
        }
    }
`;

export default graphql(PURCHASE_COURSE, {
    name: 'purchaseCourse',
    props: ({ purchaseCourse, ...others }) => ({
        ...others,
        purchaseCourse,
        fetchNextPurchaseCourse(page, size, liveId) {
            return purchaseCourse.fetchMore({
                variables: {
                    page,
                    liveId,
                    size,
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                        return previousResult;
                    }
                    
                    let list = fetchMoreResult.purchaseCourse.list || [];
                    if (page == 1) {
                        list = fetchMoreResult.purchaseCourse.list.slice(3);
                    }

                    return {
                        ...previousResult,
                        purchaseCourse: {
                            list: [ ...previousResult.purchaseCourse.list, ...list ],
                        }
                    }
                }
            })
        },
    }),
    options: props => {
        return {
            variables: {
                liveId: props.router.params.liveId,
                page: 1,
                size: 3,
            },
            ssr: false
        }
    }
});
