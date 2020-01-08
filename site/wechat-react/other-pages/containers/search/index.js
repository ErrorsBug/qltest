import React, { Component } from 'react';
import { autobind } from 'core-decorators'
import { withRouter } from 'react-router'

import Page from 'components/page'
import SearchBar from './components/search-bar'
import {getUrlParams} from 'components/url-utils'
import PubSub from 'pubsub-js'

import {
    logHandler,
    localhandler,
    getUrlWithQuery,
} from './common'

@withRouter
@autobind
class Search extends Component {

    state = {
        keyword: '',
    }

    get liveId () {
        return this.props.location.query.liveId;
    }
    get isUniversity () {
        return Object.is(getUrlParams('source', ''), 'university')
    }

    componentDidMount() {
        this.setKeyword()
        
        // 兼容直播间内搜索使用旧页面
        this.props.location.query.liveId &&
        // 绑定滚动区捕捉曝光日志
	    setTimeout(() => {
		    typeof _qla !== 'undefined' && _qla.bindVisibleScroll('bind-exposure');
	    }, 1000);
    }

    /* 在update方法中检查query的关键词字段是否变化，若有变化则重置query */
    componentDidUpdate(nextProps, nextState) {
        if (nextProps.location.query.keyword !== this.props.location.query.keyword) {
            this.setState({ keyword: this.props.location.query.keyword || '' })
        }
    }

    setKeyword() {
        const kw = this.props.location.query.keyword
        if (kw && kw !== this.state.keyword) {
            this.setState({ keyword: this.props.location.query.keyword})
        }
    }

    onKeywordChange(e) {
        PubSub.publish('keyword', e.target.value)
        this.setState({
            keyword: e.target.value,
        })
    }

    onInputKeyup(e) {
        /* 检测到按下回车键就开始搜索 */
        if (e.keyCode === 13) {
            this.doSearch()
            e.target.blur()
        }
    }

    async doSearch(keyword = this.state.keyword) {
        keyword = keyword.trim()
        if (!keyword) {
            return window.toast('你不说我怎么知道你要搜什么呢？', 1500)
        }

        /* update search history */
        localhandler.update(this.state.keyword, this.isUniversity ? 'UNIVERSITY_HISTORY' : '')
        // 最新版本：直播间搜索和珊瑚计划不属于C端来源;
        let liveId = getUrlParams('liveId');
        let source = getUrlParams('source');
        let tracePage = sessionStorage.getItem('trace_page') || '';

        // 如果等于coral则不覆盖
        if (tracePage != 'coral') {
            if (!liveId && source != 'coral') {
                logHandler.updateSource('self')
            } else {
                sessionStorage.removeItem('trace_page');
            }
        }
        this.props.router.replace(getUrlWithQuery({
            keyword,
        }))
    }

    clearInput() {
        this.setState({ keyword: '' })
        this.props.router.replace(getUrlWithQuery({
            keyword: undefined,
            type: undefined,
            filter: undefined,
            order: undefined,
        }))
    }

    render() {
        return (
            <Page title='搜索'>
                <div className='search-index-container'>
                    
                    <SearchBar
                        keyword={this.state.keyword}
                        onChange={this.onKeywordChange}
                        onClear={this.clearInput}
                        doSearch={this.doSearch}
                        onKeyUp={this.onInputKeyup}
                        liveId={this.liveId}
                    />

                    <main className="bind-exposure">
                        {
                            this.props.children
                        }
                    </main>
                </div>
            </Page>
        );
    }
}

export default Search;