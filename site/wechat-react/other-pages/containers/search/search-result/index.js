import React, { Component, Fragment } from 'react';
import classNames from 'classnames';

import ScrollView from 'components/scroll-view';
import HotKeywords from '../hot-keywords';
import { CommonCourseItemPlaceholder } from 'components/common-course-item';
import EmptyPage from 'components/empty-page';

import { request } from 'common_actions/common';
import { logHandler, localhandler, getUrlWithKeyword, getUrlWithQuery } from '../common'
import { addPv, formatMoney, digitFormat,locationTo } from 'components/util';
import { logAndDirect } from '../common';
import {getUrlParams} from 'components/url-utils'
import Picture from 'ql-react-picture';


// 默认翻页数目
const PAGE_SIZE = 10;

/**
 * 搜索课程的前两节优先显示官方课程
 * 课程为空且直播间不为空时，自动跳到直播间搜索结果
 */

class SearchResult extends Component {
    constructor(props) {
        super(props);
        const query = props.location.query || {};
        this.state.activeTypeIndex = query.type == 1 ? 1 : 0;
        this.state.activeFilterIndex = query.filter == 1 ? 1 : 0;
        if (this.state.activeFilterIndex === 1) {
            this.state.filterList[this.state.activeFilterIndex].order = query.order === 'ascending' ? 'ascending' : 'descending';
        }
    }

    state = {
        typeList: [
            {
                id: 'course',
                name: '课程',
            },
            {
                id: 'live',
                name: '直播间',
            },
        ],
        activeTypeIndex: 0,

        filterList: [
            {
                id: 'learningNum',
                name: '综合',
            },
            {
                id: 'authNum',
                name: '销量',
            },
            {
                id: 'money',
                name: '价格',
                order: 'ascending', // 升降序 ascending | descending
            },
        ],
        activeFilterIndex: 0,

        resultList_course: {
            status: '', // pending|success|end
            data: null,
        },

        resultList_live: {
            status: '',
            data: null,
        }
    }

    componentDidMount() {
        this.searchRequest();

        addPv();
        typeof _qla === 'undefined' || _qla.bindVisibleScroll('result-container');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.query.keyword !== this.getActiveKeyword()) {
            setTimeout(() => {
                this.searchRequest();
            });
        }
    }

    render() {
        const activeResultList = this.getActiveResultList();

        return <div className="p-search-result">
            <div className="controller-container">
                <div className="type-list">
                {
                    this.state.typeList.map((item, index) => {
                        const cln = classNames('type-item on-log', {
                            active: index == this.state.activeTypeIndex,
                        });
                        if (item.id === 'live' && !this.canSearchLive()) return false
                        return <div key={index}
                            className={cln}
                            onClick={() => this.onClickType(index)}
                            data-log-region={`dimension-${item.id}`}
                        >
                            {item.name}
                        </div>
                    })
                }
                </div>

                {
                    // 课程维度才有这个过滤条件
                    this.state.activeTypeIndex == 0 &&
                    <div className="filter-list">
                    {
                        this.state.filterList.map((item, index) => {
                            if(!item.name){
                                return null
                            }
                            const cln = classNames('filter-item', item.id,
                                item.order ? `order-${item.order}` : '', {
                                active: index == this.state.activeFilterIndex,
                            });
                            return <div key={index}
                                className={cln}
                                onClick={() => this.onClickFilter(index)}
                            >
                                {item.name}
                            </div>
                        })
                    }
                    </div>
                }
            </div>

            <ScrollView
                className="result-container"
                onScrollBottom={() => this.searchRequest(true)}
            >
                {
                    activeResultList.data && activeResultList.data.length || activeResultList.status !== 'end' ?
                    this.renderResultList()
                    :
                    <Fragment>
                        <EmptyPage mini emptyMessage={`没相关${this.state.typeList[this.state.activeTypeIndex].name}哦，换个关键词试试吧~`} />
                        {
                            this.props.location.query.source !== 'coral' && !this.props.location.query.liveId ?
                            <HotKeywords title="大家都在搜" onClickItem={this.onClickKeywordItem}/> : false
                        }
                    </Fragment>
                }
                
            </ScrollView>
        </div>
    }

    renderResultList() {
        const type = this.getActiveType();
        const activeResultList = this.getActiveResultList();
        const data = activeResultList.data || [];

        // 渲染直播间列表
        if (type === 'live') {
            return data.length === 0 && activeResultList.status === 'pending'
                ?
                <div>
                    <LiveItemPlaceholder />
                    <LiveItemPlaceholder />
                    <LiveItemPlaceholder />
                </div>
                :
                <Fragment>
                    <div className="on-visible" key="result-live-list" data-log-region="result-live-list">
                    {
                        data.map((item, index) => {
                            return <div
                                key={`${activeResultList.keywordId}-${item.id}`}
                                className="live-item on-log on-visible"
                                data-log-region="result-live-item"
                                data-log-pos={index}
                                onClick={() => this.onClickResultItem('live', item.id, item.lshareKey)}
                            >
                                <div className="avatar">
                                    <div className="c-abs-pic-wrap">
                                        <Picture src={item.logo} placeholder={true} resize={{w:"80", h:"80"}}/>
                                    </div>
                                </div>
                                <div className="info">
                                    <div className="name" dangerouslySetInnerHTML={{__html: item.name}}></div>
                                    <div className="desc">{item.followNum}粉丝</div>
                                </div>
                                <div className="arrow icon_enter"></div>
                            </div>
                        })
                    }
                    </div>
                    <div className="co-load-status">
                        {   
                            activeResultList.status === 'pending' ? '加载中' :
                            activeResultList.status === 'end' ? '没有更多了' :
                            <div onClick={() => this.searchRequest(true)}>点击加载更多</div>
                        }
                    </div>
                </Fragment>
        }

        // 渲染课程列表
        let unofficialIndex = 0;

        return data.length === 0 && activeResultList.status === 'pending'
            ?
            <div>
                <CommonCourseItemPlaceholder />
                <CommonCourseItemPlaceholder />
                <CommonCourseItemPlaceholder />
            </div>
            :
            <Fragment>
                <div className="on-visible" key="result-course-list" data-log-region="result-course-list">
                {
                    data.map((item, index) => {
                        const cln = classNames('common-course-item on-log on-visible', {
                            "official-course": item.isQlchat === 'Y'
                        })
                        let remark = item.liveName;
                        if (String(item.speaker).indexOf('</em>') !== -1) {
                            remark = `主讲人：${item.speaker}`;
                        }

                        return <div
                            key={`${activeResultList.keywordId}-${index}`}
                            className={cln}
                            data-log-region={item.isQlchat === 'Y' ? "result-course-item-official" : "result-course-item"}
                            data-log-pos={item.isQlchat === 'Y' ? index : unofficialIndex++}
                            onClick={() => this.onClickResultItem(item.businessType, item.businessId, item.lshareKey, this.props.location.query.source)}
                        >
                            <div className="img-wrap">
                                <div className="poster">
                                    <div className="c-abs-pic-wrap">
                                        <Picture src={item.headImage} placeholder={true} resize={{w:"240", h:"148"}} />
                                    </div>    
                                </div>
                                <div className="learn-num">
                                    {digitFormat(item.learningNum || 0)}次学习
                                </div>
                            </div>
            
                            <div className="info">
                                <div className="c-flex-grow1">
                                    <div className="name" dangerouslySetInnerHTML={{__html: item.businessName}}></div>
                                    <div className="remark" dangerouslySetInnerHTML={{__html: remark}}></div>
                                </div>
            
                                <div className="other-info">
                                    <p>
                                        {
                                            item.businessType === 'channel' ?
                                            <span>{item.topicCount || 0}课</span> :
                                            <span>单课</span>
                                        }
                                    </p>
            
                                    {
                                        item.money > 0
                                        ?
                                        <div className="price">
                                            {
                                                item.discount == -1 ||
                                                (
                                                    item.discountStatus === 'K' &&
                                                    item.shareCutStartTime > item.currentTime &&
                                                    item.shareCutEndTime < item.currentTime
                                                ) 
                                                ?
                                                <span className="current">￥{formatMoney(item.money)}</span>
                                                :
                                                <span>
                                                    <span className="origin">¥{formatMoney(item.money)}</span>
                                                    <span className="current">¥{formatMoney(item.discount)}</span>
                                                </span>
                                            }
                                        </div>
                                        :
                                        <div className="price">
                                            <div className="free">免费</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    })
                }
                </div>
                <div className="co-load-status">
                    {   
                        activeResultList.status === 'pending' ? '加载中' :
                        activeResultList.status === 'end' ? '没有更多了' :
                        <span onClick={() => this.searchRequest(true)}>加载中</span>
                    }
                </div>
            </Fragment>
    }

    onClickKeywordItem = item => {
        if (item.url) {
            locationTo(item.url);
        } else {
            
            // 最新版本：直播间搜索和珊瑚计划不属于C端来源;
            let liveId = getUrlParams('liveId');
            let source = getUrlParams('source');
            let tracePage = sessionStorage.getItem('trace_page') || '';

            // 如果等于coral则不覆盖
            if (tracePage != 'coral') {
                if (!liveId && source != 'coral') {
                    logHandler.updateSource('hot')
                } else {
                    sessionStorage.removeItem('trace_page');
                }
            }
            this.props.router.replace(getUrlWithKeyword(item.keyword))
        }
    }

    onClickResultItem = (type, id, lshareKey, source) => {
        const keyword = this.getActiveKeyword();
        const ch = this.props.location.query.ch;

        logAndDirect(type, id, keyword, ch, lshareKey, source||'');
    };

    /**
     * 主请求逻辑
     */
    searchRequest = async isContinue => {
        const curResultList = this.getActiveResultList();
        if (curResultList.status === 'pending' || curResultList.status === 'end' && isContinue) return;

        const keyword = this.getActiveKeyword();
        if (!keyword) return;

        // 记录搜索历史
        localhandler.update(keyword);

        const curType = this.getActiveType();

        // 每次重新搜索都要刷结果列表序列号
        if (!isContinue) {
            if (curType === 'course') {
                this.resultListSeq_course++;
            } else if (curType === 'live') {
                this.resultListSeq_live++;
            }
        }

        // 记录当前搜索关键词id，请求返回后id不对应的放弃请求结果
        const curKeywordId = this.getActiveKeywordId();

        // 获取页数
        let pageNum = 1;
        if (isContinue && curResultList.data && curResultList.data.length) {
            pageNum = curResultList.page.page + 1;
        }

        let requestApi;

        this.setResultList(curType, {
            ...curResultList,
            status: 'pending'
        });

        /**
         * 查询直播间
         */
        if (curType === 'live') {
            requestApi = this.requset_getLiveList({keyword, pageNum})
                .then(res => {
                    const { entities = [], ...otherData } = res.data;

                    if (curKeywordId !== this.getActiveKeywordId()) return;

                    this.setResultList(curType, {
                        ...otherData,
                        keywordId: curKeywordId,
                        status: entities.length < PAGE_SIZE ? 'end' : 'success',
                        data: isContinue ? curResultList.data.concat(entities) : entities,
                    }, () => {
                        // 渲染列表完成后上报曝光
                        setTimeout(() => {
                            typeof _qla === 'undefined' || _qla.collectVisible({wrap: 'result-container'});
                        }, 50)
                    });
                })

        /**
         * 查询课程
         */
        } else {
            let resultData = [];

            // // 头两节先查官方直播间课程
            // if (pageNum === 1 && this.state.filterList[this.state.activeFilterIndex].id === 'learningNum') {
            //     await this.requset_getCourseList({
            //         keyword,
            //         pageSize: 2,
            //         isQlchat: 'Y',
            //     }).then(res => {
            //         resultData = res.data.dataList || [];
            //         resultData.forEach(item => item.isOfficial = true);
            //     }).catch(err => {
            //         console.log(err);
            //     })
            // }
            //
            // // 三，四节查精准课程
            // if (pageNum === 1 && this.state.filterList[this.state.activeFilterIndex].id === 'learningNum') {
            //     await this.requset_getCourseList({
            //         keyword,
            //         noOrderField: true,
            //         pageSize: 2,
            //     }).then(res => {
            //         resultData = [...resultData, ...res.data.dataList];
            //     }).catch(err => {
            //         console.log(err);
            //     })
            // }
            
            requestApi = this.requset_getCourseList({
                keyword,
                pageNum,
            }).then(async res => {
                let { dataList = [], ...otherData } = res.data;

                const status = dataList.length < PAGE_SIZE ? 'end' : 'success';

                // // 对前两节官方课进行除重，后端不肯干，唯有前端干
                // const repetitiveCourseIds = [];
                // (isContinue ? curResultList.data : resultData).some((item, index) => {
                //     if (index > 3) return true;
                //     repetitiveCourseIds.push(item.businessId);
                // });
                // if (repetitiveCourseIds.length) {
                //     const reg = new RegExp(repetitiveCourseIds.join('|'));
                //     dataList = dataList.filter(item => {
                //         return !reg.test(item.businessId);
                //     })
                // }

                if (isContinue) {
                    resultData = curResultList.data.concat(dataList);
                } else {
                    resultData = resultData.concat(dataList)
                }

                if (this.props.location.query.liveId) {
                    resultData.forEach(item => item.lshareKey = undefined);
                }

                if (curKeywordId !== this.getActiveKeywordId()) return;

                let hasLiveList = false;
                // 课程列表为空但直播间列表不为空时，跳到直播间列表
                if (pageNum === 1 && !resultData.length && this.canSearchLive()) {
                    // 该keywordId下已有请求结果就不请求了
                    if (this.getActiveKeywordId('live') !== this.getActiveResultList('live').keywordId) {
                        this.resultListSeq_live++;
                        const curKeywordId = this.getActiveKeywordId('live');

                        await this.requset_getLiveList({keyword})
                            .then(res => {
                                const { entities = [], ...otherData } = res.data;

                                if (curKeywordId !== this.getActiveKeywordId('live')) return true;

                                hasLiveList = !!entities.length;

                                hasLiveList && this.setState({
                                    activeTypeIndex: 1,
                                });

                                this.setResultList('live', {
                                    ...otherData,
                                    keywordId: curKeywordId,
                                    status: entities.length < PAGE_SIZE ? 'end' : 'success',
                                    data: entities,
                                }, () => {
                                    hasLiveList && setTimeout(() => {
                                        typeof _qla === 'undefined' || _qla.collectVisible({wrap: 'result-container'});
                                    }, 50)
                                });
                                
                            }).catch(err => {
                                console.log(err);
                            });
                    }
                }

                if (curKeywordId !== this.getActiveKeywordId('course')) return;

                if (!isContinue) this.scrollToTop();

                this.setResultList(curType, {
                    ...otherData,
                    keywordId: curKeywordId,
                    status,
                    data: resultData,
                    page: {
                        page: pageNum,
                        size: PAGE_SIZE,
                    },
                }, () => {
                    hasLiveList || setTimeout(() => {
                        typeof _qla === 'undefined' || _qla.collectVisible({wrap: 'result-container'});
                    }, 50)
                });
                
            })
        }

        // 错误处理
        requestApi
            .catch(err => {
                console.error(err);

                if (curKeywordId !== this.getActiveKeywordId()) return;
                window.toast(err.message);

                this.setResultList(curType, {
                    ...curResultList,
                    status: '',
                })
            })
    }

    // 结果列表序列号
    resultListSeq_course = 0
    resultListSeq_live = 0

    requset_getLiveList = ({keyword, pageNum = 1}) => {
        const body = {
            keyword,
            size: PAGE_SIZE,
            page: pageNum,
        };
        
        // if (pageNum > 1 && this.state.resultList_live.minimumShouldMatch) {
        //     body.minimumShouldMatch = this.state.resultList_live.minimumShouldMatch;
        // }

        body.isPersonShareCourse = this.props.location.query.source === 'coral' ? 'Y' : 'N';

        return request({
            url: '/api/wechat/search/live',
            method: 'GET',
            body,
            // sessionCache: true,
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);
            return res;
        })
    }

    requset_getCourseList = ({keyword, pageNum = 1, pageSize = PAGE_SIZE}) => {
        const body = {
            keyword,
            page: {
                page: pageNum,
                size: pageSize,
            },
        };

        // 继续加载需要加上之前请求的返回参数
        // if (pageNum > 1 && this.state.resultList_course.minimumShouldMatch) {
        //     body.minimumShouldMatch = this.state.resultList_course.minimumShouldMatch;
        // }

        // 维度参数
        const filter = this.state.filterList[this.state.activeFilterIndex];
        if (filter) {
            body.orderField = filter.id;
            if (filter.id === 'money') {
                body.asc = filter.order === 'ascending' ? 'Y' : 'N';
            }
        }

        // 是否个人分销商城课程
        body.isPersonShareCourse = this.props.location.query.source === 'coral' ? 'Y' : 'N';

        return request({
            url: '/api/wechat/search/course',
            method: 'POST',
            body,
            // sessionCache: true,
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);
            return res;
        })
    }
    
    getActiveKeyword = () => {
        return (this.props.location.query.keyword || '').trim();
    }

    getActiveType = (index = this.state.activeTypeIndex) => {
        return this.state.typeList[index].id;
    }

    getActiveResultList = (type = this.getActiveType()) => {
        if (type === 'live') {
            return this.state.resultList_live;
        } else {
            return this.state.resultList_course;
        }
    }

    setResultList = (type, newState, cb) => {
        if (!/course|live/.test(type)) return;
        this.setState({
            [`resultList_${type}`]: newState,
        }, () => {
            // console.log(`${type}`, this.state[`resultList_${type}`])
            typeof cb === 'function' && cb();
        });
    }

    getActiveKeywordId = (type = this.getActiveType(), keyword = this.getActiveKeyword()) => {
        if (type === 'course') {
            let filter = this.state.filterList[this.state.activeFilterIndex];
            return `${this.resultListSeq_course}_${filter.id}_${filter.order}_${keyword}`;
        } else if (type === 'live') {
            return `${this.resultListSeq_live}_${keyword}`;
        }
    }
    
    canSearchLive = () => {
        return this.props.location.query.source !== 'coral' && !this.props.location.query.liveId;
    }

    onClickFilter = index => {
        // 切换过滤器需要放弃本次请求结果，重置status
        const filter = this.state.filterList[index];

        if (this.state.activeFilterIndex == index) {
            // 价格维度支持切换升降序
            if (filter.order) {
                const filterList = [...this.state.filterList];
                const newOrder = filter.order === 'ascending' ? 'descending' : 'ascending';
                filterList[index] = {
                    ...filter,
                    order: newOrder,
                };
                // 切换排序日志
                typeof _qla === 'undefined' || _qla('click', {region: `filter-${filter.id}-${newOrder}`});

                const resultListName = `resultList_${this.getActiveType()}`;

                this.setState({
                    filterList,
                    [resultListName]: {
                        ...this.state[resultListName],
                        status: '',
                    }
                }, () => {
                    this.props.router.replace(getUrlWithQuery({order: newOrder}));
                    const activeResultList = this.getActiveResultList();
                    if (!activeResultList.data || activeResultList.keywordId !== this.getActiveKeywordId()) {
                        this.searchRequest();
                    }
                })
            }
        } else {
            typeof _qla === 'undefined' || _qla('click', {region: `filter-${filter.id}${filter.order ? `-${filter.order}` : ''}`});

            const resultListName = `resultList_${this.getActiveType()}`;

            this.setState({
                activeFilterIndex: index,
                [resultListName]: {
                    ...this.state[resultListName],
                    status: '',
                }
            }, () => {
                const newQuery = {
                    filter: index
                };
                index === 0 && (newQuery.order = undefined);
                this.props.router.replace(getUrlWithQuery(newQuery));
                const activeResultList = this.getActiveResultList();
                if (!activeResultList.data || activeResultList.keywordId !== this.getActiveKeywordId()) {
                    this.searchRequest();
                }
            })
        }
    }

    onClickType = index => {
        if (this.state.activeTypeIndex == index) return;

        this.scrollToTop();

        this.setState({
            activeTypeIndex: index,
        }, () => {
            this.props.router.replace(getUrlWithQuery({type: index}));
            // 切换tab后若列表为空，触发请求
            const activeResultList = this.getActiveResultList();
            if (!activeResultList.data || activeResultList.keywordId !== this.getActiveKeywordId()) {
                this.searchRequest();
            }
        })
    }

    scrollToTop = () => {
        const scrollWrap = document.getElementsByClassName('result-container')[0];
        scrollWrap && (scrollWrap.scrollTop = 0);
    }
}

export default SearchResult;




function LiveItemPlaceholder() {
    return <div className="live-item placeholder">
        <div className="avatar"></div>
        <div className="info">
            <div className="name"></div>
            <div className="desc"></div>
        </div>
    </div>
}