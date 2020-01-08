import log from '../../comp/log';
import { api } from '../../config';
import { linkTo, getVal, formatDate, imgUrlFormat,digitFormat } from '../../comp/util';

import request from '../../comp/request';
import * as regeneratorRuntime from '../../comp/runtime'

// import 'babel-polyfill';

const app = getApp();

const config = {
    data: {
        showMain: false,

        liveId: '',

        headImage: __uri('./img/live-head-img.png'),

        power: {},

        scrollTop: '',

        currentTab: 'topic',
        currentChannelTab: 0,

        tabItems: [
            {
                key: 'topic',
                name: '课程',
                active: true,
            },
            {
                key: 'channel',
                name: '系列课',
            },
            {
                key: 'timeline',
                name: '动态',
            }
        ],

        canFixedBar: false,

        initTab: [],

        topic: {
            list: [],
            page: 1,
            size: 10,
            noMore: false,
            isEmpty: false,
            loading: false,
        },

        channel: {
            list: [],
            page: 1,
            size: 10,
            noMore: false,
            isEmpty: false,
            loading: false,
        },

        timeline: {
            list: [],
            page: 1,
            size: 10,
            noMore: false,
            isEmpty: false,
            loading: false,
            lastTime: null,
        },

        channelTypes: {
            list: [],
            shouldGetData: true
        },

        // 关注数
        followNum: 0,
  
        // 直播间基本信息
        liveInfo: {},

        // 当前时间
        now: Date.now(),

        scrollHeight: 0,

        // 链接上带进来的别人的lsharekey
        lshareKeyOfThire: '',
        // 请求自己的分销关系自己的lsharekey
        lshareKeyOfMine: '',

         /*ios的判断，支付按钮隐藏*/
         system: app.globalData.system
    },

    initData(liveId) {
        request({
            url: api.initLiveIndex,
            data: {
                liveId
            },
        }).then(res => {
            if (!res.data) {
                throw new Error('服务错误');
            }

            let symbols = getVal(res, 'data.liveSymbol.symbolList',[]);
            let liveV = symbols.find(item => item.key == "livev");
            res.data.liveInfo.headerBgUrl = imgUrlFormat(res.data.liveInfo.headerBgUrl, '@390h_750w_1e_1c_2o')
            
            this.setData({
                showMain: true,
                isLiveV: !!liveV,
                ...res.data
            });

            wx.setNavigationBarTitle({
                title: res.data.liveInfo.name || '千聊',
            });

        }).catch(err => {

            console.error(err);
            // wx.redirectTo({
            //     url: '/pages/live-index/live-index?liveId=' + this.data.liveId
            // })
        });
    },

    onTabClick(e) {
        let key = e.detail.key;
        const { initTab } = this.data

        this.setData({
            tabItems: this.data.tabItems.map(item => {
                item.active = key == item.key
                return item;
            }),
            currentTab: key,
            // scrollTop: 0,
        });
        if (initTab.indexOf(key) < 0) {
            switch (key) {
                case 'topic':
                    this.fetchTopicList()
                    break;
                case 'channel':
                    this.fetchChannelList()
                    break;
                case 'timeline':
                    this.fetchTimelineList()
                    break;
            }
            initTab.push(key)
            this.setData(initTab)
        }
    },

    onPageScroll(e) {
        if (!this.headerHeight) {
            return;
        }

        if (e.detail.scrollTop >= this.headerHeight && !this.data.canFixedBar) {
            this.setData({
                canFixedBar: true
            });
        } else if (e.detail.scrollTop < this.headerHeight && this.data.canFixedBar) {
            this.setData({
                canFixedBar: false
            });
        }
    },

    adjustScrollHeight() {
        const systemInfo = wx.getSystemInfoSync();
        const pixelRatio = systemInfo.pixelRatio;
        const windowWidth = systemInfo.windowWidth;
        const windowHeight = systemInfo.windowHeight;
        this.setData({
            scrollHeight: windowHeight + 'px'
        });
    },

    onLoadData() {
        if (this.data.currentTab === 'topic') {
            this.fetchTopicList();
        }
        if (this.data.currentTab === 'channel') {
            this.fetchChannelList();
        }
        if (this.data.currentTab === 'timeline') {
            this.fetchTimelineList();
        }
    },

    // 获取直播间分销shareKey
    fetchShareQualify() {
        request({
            url: api.liveShareQualify,
            data: {
                caller: 'weapp',
                liveId: this.data.liveId,
            }
        }).then(result => {
            if (getVal(result, 'data.state.code') == 0 && getVal(result, 'data.data.shareQualify') != null) {
                this.setData({
                    lshareKeyOfMine: getVal(result, 'data.data.shareQualify.shareKey')
                });
            }
        });
    },

    // 绑定分销关系
    bindShare() {
        if (this.data.lshareKeyOfThire && this.data.lshareKeyOfThire != 'null') {
            request({
                url: api.bindLiveShare,
                method: 'POST',
                data: {
                    liveId: this.data.liveId,
                    shareKey: this.data.lshareKeyOfThire
                }
            }).then(resp => {
                if (getVal(resp, 'data.data.bind') === 'Y') {
                    // eventLog({
                    //     category: 'shareBind',
                    //     action:'success',
                    //     business_id: this.data.channelId,
                    //     business_type: 'channel',
                    // });
                }
            })
        }
    },

    async fetchTopicList() {
        if (this.data.topic.noMore || this.data.topic.loading) {
            return;
        }
        let { topic, liveId } = this.data
        let { page, size, list, noMore, isEmpty } = topic
        
        this.loading = true
        this.setData({ 'topic.loading': true })

        const params = {
            url: api.getLiveTopicList,
            data: {
                liveId,
                page,
                size,
            },
        }

        try {
            const result = await request(params)

            if (result.data.state.code == 0) {
                let topicList = result.data.data.topicList
                noMore = topicList.length < size;
                isEmpty = topicList.length === 0 && page === 1
                page++
                
                topicList = topicList.filter(item => item.displayStatus == 'Y')
                .map(item => {
                    item.browseNumStr = digitFormat(item.browseNum, 10000)
                    return item
                })
                
                list = list.concat(topicList)
                
                this.setData({
                    topic: {
                        ...topic,
                        list,
                        page,
                        size,
                        noMore,
                        isEmpty,
                    }
                })
            }
        } catch (error) {
            console.error('获课程列表失败：', error)
        } finally {
            this.loading = false;
            this.setData({ 'topic.loading': false });
        }
    },

    async fetchChannelList() {
        if (this.data.channel.loading || this.data.channel.noMore) {
            return;
        }

        let { channel, currentChannelTab, liveId} = this.data
        let { page, size, list, noMore, isEmpty, loading } = channel

        this.setData({ 'channel.loading': true })
        
        const params ={
            url: api.getChannelList,
            data: {
                liveId,
                tagId: currentChannelTab,
                page,
                size,
                isCamp: 'N',
                showDisplay: 'N'
            }
        }

        try {
            const result = await request(params)
            if (result.data.state.code == 0) {
                let channelList = result.data.data.liveChannels || [];
                noMore = channelList.length < size;
                isEmpty = channelList.length === 0 && page === 1
                page++
                
                channelList = channelList.filter(item => item.displayStatus == 'Y')
                list = list.concat(channelList)

                this.setData({
                    channel: {
                        ...channel,
                        list,
                        page,
                        size,
                        noMore,
                        isEmpty,
                    }
                })
            }
        } catch (error) {
            console.error('获取系列课列表失败：',error)

        } finally {
            this.loading = false;
            this.setData({ 'channel.loading': false });
        }
    },

    async fetchTimelineList() {
        if (this.data.timeline.loading || this.data.timeline.noMore) {
            return;
        }

        let { timeline, liveId,serverTime } = this.data
        let { page, size, list, noMore, isEmpty, loading,lastTime } = timeline

        this.setData({ 'timeline.loading': true })

        const params = {
            url: '/api/weapp/timeline/list',
            data: {
                liveId,
                beforeOrAfter: 'before',
                time: lastTime || serverTime,
                page,
                size,
            }
        }

        try {
            const result = await request(params)
            if (result.data.state.code == 0) {
                let timelineList = result.data.data.list || [];
                if (timelineList.length) {
                    lastTime = timelineList[timelineList.length - 1].createTime
                }
                noMore = timelineList.length < size;
                isEmpty = timelineList.length === 0 && page === 1
                page++

                list = list.concat(timelineList)

                this.setData({
                    timeline: {
                        ...timeline,
                        lastTime,
                        list,
                        page,
                        size,
                        noMore,
                        isEmpty,
                    }
                })
            }
        } catch (error) {
            console.error('获取动态列表失败：', error)

        } finally {
            this.loading = false;
            this.setData({ 'timeline.loading': false });
        }
    },

    fetchTypes() {
        if (!this.data.channelTypes.shouldGetData) {
            return Promise.resolve();
        }

        return request({
            url: api.getChannelTypes,
            data: {
                liveId: this.data.liveId
            }
        }).then(result => {
            let channelTypes = [];

            if (result.data.state.code == 0) {
                channelTypes = [{
                    id: 0,
                    name: '全部',
                }, ...result.data.data.channelTagList]

                this.setData({
                    channelTypes: {
                        list: channelTypes,
                        shouldGetData: false
                    },
                    currentChannelTab: channelTypes[0].id,
                })

                return channelTypes;
            } else {
                this.setData({
                    channelTypes: {
                        ...this.data.channelTypes,
                        ...{
                            shouldGetData: false
                        }
                    }
                })
            }

        }).catch(err => {
            app.hideLoading()
            this.setData({
                channelTypes: {
                    ...this.data.channelTypes,
                    ...{
                        shouldGetData: false
                    }
                }
            })
        });
    },

    async onLikeTap(e) {
        const id = e.detail.id
        const status = e.detail.status ? 'N' : 'Y'
        const {list} = this.data.timeline

        const result = await request({
            url: '/api/weapp/timeline/like',
            method: 'POST',
            data: {
                feedId: id,
                status,   
            }
        }) 

        if (result.data.state.code === 0) {
            list.find(item => {
                if (item.id === id) {
                    let like = item.liked
                    item.likeNum = like ? item.likeNum - 1 : item.likeNum + 1
                    item.liked = !like
                    
                    return true
                }
                return false
            })
            
            this.setData({ 'timeline.list': list })
        }
    },

    onLoad(option) {
        app.login().then(() => {
            global.loggerService.pv()

            // 初始化liveId
            this.setData({
                liveId: option.liveId,
                lshareKeyOfThire: option.lshareKey || '',
            });
            this.initData(this.data.liveId)

            // 获取分销数据
            this.fetchShareQualify();

            // 绑定分销关系
            this.bindShare();

            // 获取第一页数据
            this.fetchTopicList();

            // 设置窗体高度
            this.adjustScrollHeight();

            // 计算顶部高度
            this.calcHeaderHeight();

            // 页面pv日志
            log.pv({
                page: '直播间主页',
                url: this.getPageUrl(option)
            });
        });
    },

    calcHeaderHeight() {
        try {
            const res = wx.getSystemInfoSync();

            let rate = res.windowWidth / 750;

            this.headerHeight = 390 * rate;
        } catch (error) {
            console.error(error);
        }
    },

    getPageUrl(options) {
        return this.__route__ + '?liveId=' + options.liveId;
    },

    switchChannelTab(e) {
        this.setData({
            currentChannelTab: e.detail.id,
            channel: {
                ...this.data.channel,
                ...{
                    noMore: false,
                    loading: false,
                    page: 1
                }
            }
        });

        this.fetchChannelList()
    },

    linkToChannel(e) {
        const id = e.currentTarget.dataset.id;
        // linkTo.channelIndex(id, this.data.liveId)
        wx.redirectTo({
            url: `/pages/channel-index/channel-index?channelId=${id}`,
        })
    },

    onShareAppMessage() {
        return {
            title: this.data.liveInfo.name,
            imageUrl: this.data.liveInfo.headerBgUrl || this.data.headImage,
            desc: `${this.data.liveInfo.name}，值得我的推荐和你的关注`,
            path: `/pages/live-index/live-index?liveId=${this.data.liveId}&lshareKey=${this.data.lshareKeyOfMine}`
        };
    },

    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    }
}

Page(config);
