import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'

import ScrollToLoad from 'components/scrollToLoad'

import TopicList from '../components/topic-list'
import ChannelList from '../components/channel-list'
import LiveList from '../components/live-list'

import {
    wordFilter,
    logHandler,
} from '../common'
import {
    searchTopic,
    searchChannel,
    searchLive,
    searchCamp
} from 'actions/search'
import CampList from '../components/camp-list';

const typeKeys = {
    topic: 'topics',
    channel: 'channels',
    live: 'entities'
}

@autobind
class SearchOne extends Component {
    state = {
        page: 1,
        size: 20,

        /**
        * 是否采用最小匹配比例
        *
        * 第一次是最大限度匹配，如果数量少于5条，就要降级，75%匹配。通过传值实现。
        * 有效取值: {string} Y|N
        * 列表接口请求第一次会返回，之后的请求需要带上这个参数
        */
        minimumShouldMatch: 'N',

        list: [],
        noMore: false,
        noneOne: false,

        type: '',
        keyword: '',
    }

    componentDidMount() {
        // 初始化状态和获取数据
        this.initAndFetch()
    }

    get liveId () {
        return this.props.location.query.liveId;
    }

    get ch() {
        return this.props.location.query.ch
    }

    /* 根据搜索类型和状态返回方法和参数 */
    get method() {
        const { page, size, minimumShouldMatch } = this.state
        const params = {
            page, size, minimumShouldMatch,
            keyword: wordFilter(this.state.keyword),
            isPersonShareCourse: this.props.location.query.source === 'coral' ? 'Y' : 'N',
            liveId: this.liveId
        }

        switch (this.state.type) {
            case 'topic':
                return searchTopic(params)
                break;
            case 'channel':
                return searchChannel(params)
                break;
            case 'live':
                return searchLive(params)
                break;
            case 'camp':
                return searchCamp(params)
            default:
                break;
        }
    }

    /* 根据类型筛选结果列表出来，没有就返回个空列表 */
    pickList(obj) {
        switch (this.state.type) {
            case 'topic':
                return obj.topics || []
                break;
            case 'channel':
                return obj.channels || []
                break;
            case 'live':
                return obj.entities || []
                break;
            case 'camp':
                return obj.camps || []
            default:
                break;
        }
    }

    async initAndFetch() {
        // 关键词和type放进state
        await this.setState({
            keyword: this.props.location.query.keyword,
            type: this.props.router.params.type,
            source: this.props.location.query.source,
        })

        this.fetchResult()
    }

    async fetchResult(next) {
        let result = await this.method

        let list = this.pickList(result);

        if (this.liveId) {
            list = list.map(item => {
                item.lshareKey = undefined;
                return item;
            })
        }

        if (this.state.page === 1 && logHandler.fromMore) {
            logHandler.fromMore = false
        } else {
            const type = !list.length ? 'fail' : 'success'
            logHandler.calllog(type, this.state.type, this.state.keyword, this.state.page)
        }

        /* 已经到最后一页 */
        if (result.page.page === result.page.totalPage) {
            this.setState({ noMore: true })
        }

        /* 更新列表数据和页码 */
        this.setState({
            list: this.state.list.concat(list),
            page: this.state.page + 1,
        })

        /* 更新最小匹配比例字段 */
        if (result.minimumShouldMatch) {
            this.setState({ minimumShouldMatch: result.minimumShouldMatch })
        }

        next && next()

        // 统计曝光
        setTimeout(() => {
            typeof _qla !== 'undefined' && _qla.collectVisible();
        }, 100);
    }


    render() {
        const { list, type, noMore, noneOne,keyword,source } = this.state

        return (
            <div>
                <ScrollToLoad
                    toBottomHeight={500}
                    noneOne={noneOne}
                    loadNext={this.fetchResult}
                    noMore={noMore}
                    className={'scroll-load-search-list'}
                >
                    {
                        type === 'camp' && list.length > 0 &&
                        <CampList
                            list={list}
                            showMore={false}
                            keyword={keyword}
                            ch={this.ch}
                        />
                    }
                    {
                        type === 'topic' && list.length > 0 &&
                        <TopicList
                            list={list}
                            showMore={false}
                            keyword={keyword}
                            ch={this.ch}
                        />
                    }

                    {
                        type === 'channel' && list.length > 0 &&
                        <ChannelList
                            list={list}
                            showMore={false}
                            keyword={keyword}
                            ch={this.ch}
                        />
                    }

                    {
                        type === 'live' && list.length > 0 &&
                        <LiveList
                            list={list}
                            showMore={false}
                            keyword={keyword}
                            ch={this.ch}
                        />
                    }
                </ScrollToLoad>
            </div>
        );
    }
}

export default SearchOne;