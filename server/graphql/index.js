import { buildSchema } from 'graphql'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import typeDefs from './types';
import resolvers from './resolvers';
import { mockServer, MockList } from 'graphql-tools';

const schema = makeExecutableSchema(
    {
        typeDefs,
        resolvers,
    }
)

// mockServer(schema, {
//     Query: () => ({
//         questionList: () => new MockList(20),
//         topicList: () => new MockList(20),
//     }),

//     TopicItem: () => ({
//         "id": "100000001000983",
//         "topic": "话题1",
//         "backgroundUrl": "https://img.qlchat.com/qlLive/topicHeaderPic/thp-4.jpg",
//         "planTime": null,
//         "authNum": 0,
//         "money": 0,
//         "browseNum": 1,
//         "channelId": null,
//         "isRelay": true,
//         "startTime": "1503542640000",
//         "status": "beginning",
//         "style": "normal",
//         "type": "public",
//         "isAuthTopic": null,
//         "beginTime": "2017/08/24 10:44",
//         "isSingleBuy": null,
//         "isAuditionOpen": null
//     }),

//     PurchaseCourseItem: () => ({
//         time: () => (~~(Math.random() * 10) % 2) === 1 ? +new Date : new Date('2016-10').getTime(),
//         pic: 'https://img.qlchat.com/qlLive/channelLogo/4JHWLSL5-3XZ4-7ATU-1484797147240-1WRRLCYIKQ8Q.jpg'
//     }),

//     PlanCourseItem: () => ({
//         planTime: () => (~~(Math.random() * 10) % 2) === 1 ? +new Date : new Date('2016-10').getTime(),
//         backgroundUrl: 'https://img.qlchat.com/qlLive/channelLogo/4JHWLSL5-3XZ4-7ATU-1484797147240-1WRRLCYIKQ8Q.jpg'
//     }),

//     QuestionItem: () => ({
//         headImgUrl: 'https://img.qlchat.com/qlLive/channelLogo/4JHWLSL5-3XZ4-7ATU-1484797147240-1WRRLCYIKQ8Q.jpg',
//         topicId: '100000794000117',
//         topic: 'hhhq',
//         id: '100000088000037',
//     }),

//     BannerItem: () => ({
//         type: oneOf(['topic', 'channel', 'vip', 'link', 'none']),
//         imgUrl: 'https://img.qlchat.com/qlLive/channelLogo/4JHWLSL5-3XZ4-7ATU-1484797147240-1WRRLCYIKQ8Q.jpg',
//         sortNum: oneOf([1,2,3,4,5,6,7,8])
//     }),

//     BannerList: () => ({
//         list: () => new MockList(8)
//     }),

//     LiveVipInfo: () => ({
//         isVip: 'Y',
//         expiryTime: +new Date,
//     }),

//     Power: () => ({
//         allowMGLive: false
//     }),

//     UserInfo: () => ({
//         headImgUrl: 'https://img.qlchat.com/qlLive/channelLogo/4JHWLSL5-3XZ4-7ATU-1484797147240-1WRRLCYIKQ8Q.jpg',
//         name: 'Dodomon',
//     })
// });

export default schema;

function oneOf (list) {
    const index = ~~(Math.random() * list.length);
    return list[index];
}
