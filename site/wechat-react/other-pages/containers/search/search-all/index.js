import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'

import EmptyPage from 'components/empty-page'

import TopicList from '../components/topic-list'
import ChannelList from '../components/channel-list'
import LiveList from '../components/live-list'
import CampList from '../components/camp-list'

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
import { addPv } from 'components/util';
import channel from 'components/dialogs-colorful/push-dialogs/channel';

function showMoreOrNot(key, obj) {
    let totalPage = obj[key] && obj[key].length;
    try {
        return obj.page.page !== totalPage
    } catch (error) {
        console.error(error)
        return false
    }
}

@autobind
class SearchAll extends Component {

    state = {
        topics: [],
        channels: [],
        lives: {},
        camps: {},

        keyword: '',
        source:'self',
        loaded: false,
    }

    get params() {
        return {
            page: 1,
            size: 3,
            keyword: wordFilter(this.state.keyword),
            isPersonShareCourse: this.props.location.query.source === 'coral' ? 'Y' : 'N',
            liveId: this.liveId
        }
    }

    get ch() {
        return this.props.location.query.ch
    }

    get liveId () {
        return this.props.location.query.liveId;
    }

    componentDidMount() {
        this.fetchResult(true);
        
        addPv();
    }

    /* 在update方法中检查query的关键词字段是否变化，若有变化则需重新请求数据 */
    componentDidUpdate(nextProps, nextState) {
        if (nextProps.location.query.keyword !== this.props.location.query.keyword) {
            this.fetchResult()
        }
    }

    async fetchResult(isFirstReqest) {
        await this.setState({
            keyword: this.props.location.query.keyword,
            source: this.props.location.query.source || '',
        })

        const tasks = [
	        searchTopic(this.params),
	        searchChannel(this.params),
        ]

        if(this.props.location.query.source !== 'coral' && !this.liveId){
            tasks.push(searchLive(this.params));
        } else {
            tasks.push(Promise.resolve())
        }

        if (this.liveId) {
            tasks.push(searchCamp(this.params));
        } else {
            tasks.push(Promise.resolve());
        }

        let [topics, channels, lives, camps] = await Promise.all(tasks)

        if (!topics.topics && !channels.channels && (lives && !lives.entities)) {
            logHandler.calllog('fail', 'all', this.state.keyword, this.state.source)
        } else {
            logHandler.calllog('success', 'all', this.state.keyword, this.state.source)
        }

        if (this.liveId) {
            if (topics.topics) {
                topics.topics = topics.topics.map(item => {
                    item.lshareKey = undefined;
                    return item;
                })
            }
            if (channels.channels) {
                channels.channels = channels.channels.map(item => {
                    item.lshareKey = undefined;
                    return item;
                })
            }
        }

        this.setState({
            topics, channels, lives: lives || {}, camps,
            loaded: true,
        }, () => {
            
            // 统计曝光
            setTimeout(() => {
                typeof _qla !== 'undefined' && _qla.collectVisible();
            }, 10);
        })
    }

    /* 点击更多按钮操作 */
    iWantMore(type) {
        logHandler.fromMore = true
	    const source = this.props.location.query.source;
	    this.props.router.replace(`/wechat/page/search/${type}?${this.liveId ? `liveId=${this.liveId}&` : ''}keyword=${this.state.keyword}${source ? '&source=' + source : ''}${this.ch ? '&ch=' + this.ch : ''}`)
    }

    render() {
        const { topics, channels, lives, keyword, source, camps } = this.state

        const hasTopic = topics.topics && topics.topics.length > 0
        const hasChannel = channels.channels && channels.channels.length > 0
        const hasLive = lives.entities && lives.entities.length > 0
        const hasCamp = camps && camps.camps && camps.camps.length > 0;

        return (
            <div className='combine-result'>
                {
                    hasCamp && 
                    <CampList
                        list={camps.camps.filter((item, idx) => {
                            return idx < 3
                        })}
                        showMore={showMoreOrNot('camps', camps)}
                        iWantMore={this.iWantMore}
                        keyword={keyword}
                        ch={this.ch}
                    />
                }
                {
                    hasTopic &&
                    <TopicList
                        list={topics.topics.filter((item, idx) => {
                            return idx < 3
                        })}
                        showMore={showMoreOrNot('topics', topics)}
                        iWantMore={this.iWantMore}
                        keyword={keyword}
                        ch={this.ch}
                        source={source}
                    />
                }
                {
                    hasChannel &&
                    <ChannelList
                        list={channels.channels.filter((item, idx) => {
                            return idx < 3
                        })}
                        showMore={showMoreOrNot('channels', channels)}
                        iWantMore={this.iWantMore}
                        keyword={keyword}
                        ch={this.ch}
                        source={source}
                    />
                }
                {
                    hasLive &&
                    <LiveList
                        list={lives.entities.filter((item, idx) => {
                            return idx < 3
                        })}
                        showMore={showMoreOrNot('lives', lives)}
                        iWantMore={this.iWantMore}
                        keyword={keyword}
                        ch={this.ch}
                    />
                }
                {
                    !hasTopic && !hasChannel && !hasLive && !hasCamp && this.state.loaded &&
                    <div className="no-content">
                        <EmptyPage show={true} />
                    </div>
                }
            </div>
        );
    }
}




import SearchResult from '../search-result';
import SearchResultUniversity from '../search-result-university';


export default function (props) { 
    if (props.location.query.source==='university') {
        return <SearchResultUniversity {...props}/>
    } else if (props.location.query.liveId) {
        return <SearchAll {...props}/>
    } else {
        return <SearchResult {...props}/>
    }
};


