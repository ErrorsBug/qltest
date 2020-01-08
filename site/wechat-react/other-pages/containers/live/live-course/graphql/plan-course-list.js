import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const PLAN_COURSE_LIST = gql`
    query PlanCourseList($liveId: String, $page: Int, $size: Int) {
        # 获取未开播话题列表
        planCourseList(liveId: $liveId, page: $page, size: $size) {
            id
            topic
            backgroundUrl
            browseNum
            startTime
            displayStatus
        }
    }
`;

export default graphql(PLAN_COURSE_LIST, {
    name: 'planCourseList',
    props: ({ planCourseList, ...others }) => ({
        ...others,
        planCourseList,
        fetchNextPlanCourse(page, size, liveId) {
            return planCourseList.fetchMore({
                variables: {
                    page,
                    liveId,
                    size,
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                        return previousResult;
                    }

                    return {
                        ...previousResult,
                        planCourseList: [ ...previousResult.planCourseList, ...fetchMoreResult.planCourseList ],
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
                size: 10,
            },
            ssr: false
        }
    }
});

