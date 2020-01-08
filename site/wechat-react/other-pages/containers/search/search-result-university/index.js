import React, { Component, Fragment } from 'react';
import classNames from 'classnames';

import ScrollView from 'components/scroll-view';
import HotKeywords from '../hot-keywords';
import { CommonCourseItemPlaceholder } from 'components/common-course-item';
import EmptyPage from 'components/empty-page';

import { request } from 'common_actions/common';
import { logHandler, localhandler, getUrlWithKeyword, getUrlWithQuery } from '../common'
import { addPv, formatMoney, digitFormat,locationTo } from 'components/util'; 
import {getUrlParams} from 'components/url-utils' 
import CourseItem from '../../../../female-university/components/course-item' 
import JoinHoc from '../../../../female-university/components/join-dialog/join-hoc'; 
import BooksItem from '../../../../female-university/components/books-item';   
import  '../../../../female-university/components/books-item/style.scss';   
import  '../../../../female-university/components/course-item/style.scss';   
import  '../../../../female-university/components/study-plan-btn/style.scss';   
import  '../../../../female-university/components/learn-info/style.scss';   
import {studentCourseMap,universitySearch} from '../../../../female-university/actions/home';    
// 默认翻页数目
const PAGE_SIZE = 10;

/**
 * 搜索课程的前两节优先显示官方课程
 * 课程为空且直播间不为空时，自动跳到直播间搜索结果
 */

@JoinHoc 
class SearchResultUniversity extends Component {
    constructor(props) {
        super(props);
        const query = props.location.query || {};
        this.state.activeTypeIndex = query.type == 1 ? 1 : 0; 
    }

    state = {
        typeList: [
            {
                id: 'course',
                name: '课程',
            },
            {
                id: 'book',
                name: '听书',
            },
        ],
        activeTypeIndex: 0, 

        resultList_course: {
            status: '', // pending|success|end
            data: null,
        },

        resultList_book: {
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
        return <div className="p-search-result-university">
            <div className="controller-container">
                <div className="type-list">
                {
                    this.state.typeList.map((item, index) => {
                        const cln = classNames('type-item on-log', {
                            active: index == this.state.activeTypeIndex,
                        }); 
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
                        <HotKeywords isUniversity title="大家都在搜" onClickItem={this.onClickKeywordItem}/>  
                    </Fragment>
                }
                
            </ScrollView>
        </div>
    }

    renderResultList() {
        const type = this.getActiveType();
        const activeResultList = this.getActiveResultList();
        const data = activeResultList.data || [];
        const {  ...otherProps } = this.props;

        // 渲染直播间列表
        if (type === 'book') { 
            return data.length === 0 && activeResultList.status === 'pending'
                ?
                <div>
                    <LiveItemPlaceholder />
                    <LiveItemPlaceholder />
                    <LiveItemPlaceholder />
                </div>
                :
                <Fragment>
                    <div className="result-book-list on-visible" key="result-book-list" data-log-region="result-book-list">
                    <BooksItem lists={data} isHideNum={true} isOne isShowItemCate { ...otherProps }/>
                    </div>
                    <div className="co-load-status">
                        {   
                            activeResultList.status === 'pending' ? '加载中' :
                            activeResultList.status === 'end' ? '暂无更多数据' :
                            <div onClick={() => this.searchRequest(true)}>点击加载更多</div>
                        }
                    </div>  
                </Fragment>
        }
 

        return data.length === 0 && activeResultList.status === 'pending'
            ?
            <div>
                <CommonCourseItemPlaceholder />
                <CommonCourseItemPlaceholder />
                <CommonCourseItemPlaceholder />
            </div>
            :
            <Fragment>
                <div className="result-course-list on-visible" key="result-course-list" data-log-region="result-course-list">
                {
                    data.map((item, index) => { 
                        return (
                            <CourseItem className="search-course-item" resize={{w:192,h:244}} key={index} idx={index} {...item}  isShowItemCate {  ...otherProps }/>
                        )
                        
                    })
                }
                </div>
                <div className="co-load-status">
                    {   
                        activeResultList.status === 'pending' ? '加载中' :
                        activeResultList.status === 'end' ? '暂无更多数据' :
                        <span onClick={() => this.searchRequest(true)}>加载中</span>
                    }
                </div>
            </Fragment>
    }

    onClickKeywordItem = item => {
        if (item.url) {
            locationTo(item.url);
        } else { 
            this.props.router.replace(getUrlWithKeyword(item.keyword))
        }
    }
 

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
            } else if (curType === 'book') {
                this.resultListSeq_book++;
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
         * 查询课程
         */
        let resultData = [];

        
        
        requestApi = this.requset_getCourseList({
            keyword,
            courseType:curType,
            pageNum,
        }).then(async res => { 
            let { courses = [], ...otherData } = res.data;
            
            await this.handleData(courses || []);

            const status = courses.length < PAGE_SIZE ? 'end' : 'success'; 

            if (isContinue) {
                resultData = curResultList.data.concat(courses);
            } else {
                resultData = resultData.concat(courses)
            } 

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
            });
            
        }) 

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
    resultListSeq_book = 0
 

    requset_getCourseList = ({keyword,courseType, pageNum = 1, pageSize = PAGE_SIZE}) => {
        const body = {
            keyword,
            courseType,
            page: {
                page: pageNum,
                size: pageSize,
            },
        }; 
        return  universitySearch({...body}) 
         
    }
    
    // 处理数据
    handleData = (lists) => { 
        return lists.map((item, index) => {
            item.isJoin = Object.is(item.isJoin, 'Y'); 
            return item;
        })
    }
    getActiveKeyword = () => {
        return (this.props.location.query.keyword || '').trim();
    }

    getActiveType = (index = this.state.activeTypeIndex) => {
        return this.state.typeList[index].id;
    }

    getActiveResultList = (type = this.getActiveType()) => {
        if (type === 'book') {
            return this.state.resultList_book;
        } else {
            return this.state.resultList_course;
        }
    }

    setResultList = (type, newState, cb) => {
        if (!/course|book/.test(type)) return;
        this.setState({
            [`resultList_${type}`]: newState,
        }, () => { 
            typeof cb === 'function' && cb();
        });
    }

    getActiveKeywordId = (type = this.getActiveType(), keyword = this.getActiveKeyword()) => {
        if (type === 'course') { 
            return `${this.resultListSeq_course}_${keyword}`;
        } else if (type === 'book') {
            return `${this.resultListSeq_book}_${keyword}`;
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

export default SearchResultUniversity;




function LiveItemPlaceholder() {
    return <div className="live-item placeholder">
        <div className="avatar"></div>
        <div className="info">
            <div className="name"></div>
            <div className="desc"></div>
        </div>
    </div>
}