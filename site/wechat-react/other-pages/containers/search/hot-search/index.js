import React, { Component, Fragment } from 'react';
import { autobind } from 'core-decorators'
import PubSub from 'pubsub-js'
import {
    logHandler,
    localhandler,
    getUrlWithKeyword,
} from '../common'

import { isQlLive } from 'common_actions/common'

import { locationTo, addPv } from 'components/util';
import {getUrlParams} from 'components/url-utils'

import HotKeywords from '../hot-keywords';
import RecommendList from '../components/recommend-list'


@autobind
class HotSearch extends Component {

    state = {
        history: [],
        newHistory:[],
        currHistoryShowMoreType:'close',
        overflowIndex:-1,
        isQlLive: false,
        isLoading: false
    }
    get isUniversity () {
        return Object.is(getUrlParams('source', ''), 'university')
    }
    componentDidMount() {
        this.getIsQlLive();
        this.setState({
            history: localhandler.read(this.isUniversity ? 'UNIVERSITY_HISTORY' : ''),
        })
        // 统计曝光
        setTimeout(() => {
            typeof _qla !== 'undefined' && _qla.collectVisible();
        }, 10);
        addPv();
        if(this.isUniversity) {
            PubSub.subscribe('keyword', (msg, data) => {
                // console.log(data)
            })
        }
        this.handleHistoryShowMore()
    }
    
    componentWillUnmount() {
        if(this.isUniversity) { 
            PubSub.unsubscribe('keyword')
        }
    }
    componentDidUpdate(){
        if(this.state.newHistory.toString() != this.state.history.toString()){
            this.handleHistoryShowMore()
        }
    }

    get liveId () {
        return this.props.location.query.liveId;
    }

    async getIsQlLive() {
        if(this.liveId){
            const { isQlLive: isLive } = await isQlLive({ liveId: this.liveId })
            this.setState({
                isQlLive: !Object.is(isLive, 'Y'),
                isLoading: true
            })
        } else {
            this.setState({
                isLoading: true
            })
        }
        
    }

    clearHistory() {
        localhandler.write([])
        this.setState({ history: [] })
    }

    onClearClick() {
        window.simpleDialog({
            msg: '确定清空历史搜索？',
            onConfirm: () => {
                this.clearHistory()
            },
        })
    }

    doSearch(item, traceSource) {
        // 最新版本：直播间搜索和珊瑚计划不属于C端来源;
        let liveId = getUrlParams('liveId');
        let source = getUrlParams('source');
        let tracePage = sessionStorage.getItem('trace_page') || '';

        // 如果等于coral则不覆盖
        if (tracePage != 'coral') {
            if (!liveId && source != 'coral') {
                logHandler.updateSource(traceSource)
            } else {
                sessionStorage.removeItem('trace_page');
            }
        }
	    this.props.router.replace(getUrlWithKeyword(item))
    }

    handleHotWordClick(item) {
        setTimeout(() => {
            // 有url参数则按url跳转
            if (item.url) {
                locationTo(item.url);

            // 其它情况去到搜索结果页
            } else {
                this.doSearch(item.keyword, 'hot');
            }
        }, 100)
    }

    handleHistoryShowMore(){
        let historyList = [...this.state.history]
        let mainBox = document.querySelector('#main-box')
        let childBox = document.querySelector('#main-content')
        let hiddenBtn = document.querySelector('#showmore-btn-hidden')
        let historyItemList = document.querySelectorAll('.history-item')
        if(!mainBox || !childBox || ! hiddenBtn || !historyItemList.length){
            return null
        }
        let mainBoxWidth = mainBox.clientWidth * 2
        let allChildWidth = 0
        let isOverflow = false
        let overflowIndex = -1
        let marginRight = this.getStyle(historyItemList[0],'marginRight').split('px')[0] - 0
        let hiddenBtnWidth = hiddenBtn.clientWidth
        for(let i = 0 ; i < historyItemList.length ; i++){
            let itemWidth =  marginRight + historyItemList[i].clientWidth
            allChildWidth += itemWidth
            if(allChildWidth + (marginRight + hiddenBtnWidth) > mainBoxWidth){
                isOverflow = true
                overflowIndex = i
                break;
            }
        }
        if(isOverflow){
            historyList.splice(overflowIndex-1,0,{btnItemFlag:true})
            this.setState({
                newHistory:historyList,
                history:historyList,
                currHistoryShowMoreType:'close',
                overflowIndex:overflowIndex
            })
        }else{
            let mainboxCls = mainBox.getAttribute('class')
            mainboxCls = mainboxCls.replace('height-limit','')
            mainBox.setAttribute('class',mainboxCls)
        }
    }
    showMore(){
        let mainbox = document.querySelector('#main-box')
        let mainboxCls = mainbox.getAttribute('class')
        mainboxCls = mainboxCls.replace('height-limit','')
        mainbox.setAttribute('class',mainboxCls)
        const { history ,overflowIndex} = this.state
        let tempList = [...history]
        let btnItem = tempList.splice(overflowIndex-1,1)
        tempList = tempList.concat(btnItem)
        this.setState({
            newHistory:tempList,
            history:tempList,
            currHistoryShowMoreType:'show',
        })
        
    }
    showLess(){
        let mainbox = document.querySelector('#main-box')
        let mainboxCls = mainbox.getAttribute('class')
        mainboxCls += ' height-limit'
        mainbox.setAttribute('class',mainboxCls)
        const { history ,overflowIndex} = this.state
        let tempList = [...history]
        let btnItem = tempList.pop()
        tempList.splice(overflowIndex-1,0,btnItem)
        this.setState({
            newHistory:tempList,
            history:tempList,
            currHistoryShowMoreType:'close',
        })

    }
    //获取dom元素样式
    getStyle(element, attr) {
      if(element.currentStyle) {
        return element.currentStyle[attr];
      } else {
        return getComputedStyle(element, false)[attr];
      }
    }

    render() {
        const { history , currHistoryShowMoreType, isQlLive, isLoading } = this.state
        return (
            <Fragment>
                <div>
                    {
                        this.props.location.query.source !== 'coral' && !this.liveId ?
                        <HotKeywords 
                            onClickItem={this.handleHotWordClick}
                            isUniversity={ this.isUniversity }
                        /> : null
                    }
                    { ((this.isUniversity && history.length > 0) || (!this.isUniversity && history.length > 0)) && (
                        <div className="hot-and-history history-search">
                            <h1>
                                历史搜索
                                {
                                    history.length > 0 &&
                                    <span className='delete on-log on-visible'
                                        data-log-region="clean-history"
                                        onClick={this.onClearClick}></span>
                                }
                            </h1>
                            <div id="main-box" className={'main height-limit ' + (history.length ? 'on-visible' : '')} data-log-region="history-list">
                                <div id="main-content" className="main-content">
                                {
                                    history.length ? history.map((item, index) => {
                                        if(item.btnItemFlag && currHistoryShowMoreType == 'close'){
                                            return <Fragment><div key={`history-${index}`} id="showmore-btn" onClick={this.showMore} className="not-too-long on-log showmore-btn show-block iconfont iconCombinedShape"></div><br/></Fragment>
                                        }else if(item.btnItemFlag && currHistoryShowMoreType == 'show'){
                                            return <div key={`history-${index}`} id="showmore-btn" onClick={this.showLess} className="not-too-long on-log showmore-btn show-block iconfont iconicon-test"></div>
                                        }else{
                                            return <div data-index={index} className='history-item not-too-long on-log' key={`history-${index}`}
                                                data-log-region="history-item"
                                                onClick={() => { this.doSearch(item,'history') }}><span>{item}</span></div>
                                        }
                                        })
                                        : <p>暂无搜索记录</p>
                                }
                                </div>
                                <div id="showmore-btn-hidden" className="showmore-btn-hidden"></div>
                            </div>
                        </div>
                    ) }
                    { isLoading && !isQlLive && <RecommendList query={this.props.location.query}/> }
                </div>
                {/* <div className="search-result-box">
                    <div className="search-result-head">
                        <span>搜索“<em>{ '结果' }</em>”相关内容</span>
                    </div>
                    { Array.from({ length: 20 }).map((_, index) => (
                        <div key={ index } className="search-result-item"><em>结果</em>搜索（实时联想）备份</div>
                    )) }
                    <div className="search-result-more">女大会不断上新课哟</div>
                </div> */}
            </Fragment>
            
        );
    }
}


HotSearch.propTypes = {

};

export default HotSearch;
