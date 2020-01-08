import * as React from 'react';
import { connect } from 'react-redux';
import styles from './style.scss';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { DropDown } from "./components/drop-down";
import { locationTo } from "../../components/util";

import {
    updateFilterConditions,
    fetchCategoryList,
    searchCourse,
} from '../../actions/filter';

import { setLoginModalShow, updateNavCourseModule } from '../../actions/common';

import {
    fetchCourseList,
    updateCourseList,
} from '../../actions/course';
import { YorN } from '../../models/course.model';

export interface FilterPanelProps {
    updateFilterConditions: (params: any) => void;
    fetchCategoryList: () => any;
    searchCourse: (params: any) => any;
    fetchCourseList: (params: any) => any;
    updateCourseList: (params: any) => void;
    setLoginModalShow: (isShow: YorN) => void;
    userId: any;
    liveId: any;
    agentId: any;
    agentInfo: any;
    categorySelected: string;
}

const sortItemList = [
    {
         id: 1,
         sortBy: 'sales',
         sortOrder: 'asc',
         value: '按销量升序'
     }, {
        id: 2,
        sortBy: 'sales',
        sortOrder: 'desc',
        value: '按销量降序'
     }, {
        id: 3, 
        sortBy: 'price',
        sortOrder: 'asc',
        value: '按价格升序'
     }, {
        id: 4,
        sortBy: 'price',
        sortOrder: 'desc',
        value: '按价格降序'
     }, {
         id: 5,
         sortBy: 'endRate',
         sortOrder: 'asc',
         value: '按完播率升序'
     }, {
         id: 6,
         sortBy: 'endRate',
         sortOrder: 'desc',
         value: '按完播率降序'
     }, {
         id: 7,
         sortBy: 'reward',
         sortOrder: 'asc',
         value: '按打赏金额升序'
     }, {
         id: 8,
         sortBy: 'reward',
         sortOrder: 'desc',
         value: '按打赏金额降序'
     }
]
@autobind
class FilterPanel extends React.Component<FilterPanelProps, object> {
    state = {
        // 所有的课程分类
        categories: [
            {
                id: 'recommend',
                name: '推荐'
            },
            {
                id: 'all',
                name: '全部'
            },
        ],
        // 当前选择的课程分类
        categorySelected: 'recommend',
        // 排序指标
        sortBy: '',
        // 排序方式
        sortOrder: '',
        // 只查看转载的课程
        onlyViewRelayCourse: false,
        // 搜索文本
        searchText: '',
        // 是否置顶显示分类标签栏
        isFixedCategory: false,
        // 查看top10的活动课程
        viewTopTenCourses: false,
    }

    data = {
        // 页面区域元素
        mainContent: null,
        // 实际的分类标签区域元素
        actualCategoryList: null,
        // 用于置顶显示的分类标签区域元素
        fixedCategoryList: null,
        // 其他的页面滚动事件处理函数
        scrollHandler: null,
        // 查看top10的活动课程
        viewTopTenCourses: false,
    }

    /**
     * 获取知识通商城的分类列表数据
     */
    async fetchCategoryList(){
        const result = await this.props.fetchCategoryList();
        if (result.state.code === 0) {
            this.setState({
                categories: [...this.state.categories, ...result.data.tagList]
            });
        }
    }

    /**
     * 刷新课程列表
     */
    async refreshCourseList(){
        const { categorySelected, sortBy, sortOrder, onlyViewRelayCourse, searchText } = this.state;
        const data = await this.props.fetchCourseList({
            agentId: this.props.agentId || '',
            liveId: this.props.liveId,
            tagId: (categorySelected === 'all' || categorySelected === 'recommend') ? '' : categorySelected,
            isRecommend: categorySelected === 'recommend' ? 'Y' : 'N',
            orderBuyNumber: sortBy === 'sales' ? sortOrder : '',
            orderPrice: sortBy === 'price' ? sortOrder : '',
            orderReward: sortBy === 'reward' ? sortOrder : '',
            orderEndRate: sortBy === 'endRate' ? sortOrder: '',
            notRelayOnly: onlyViewRelayCourse ? 'Y' : 'N',
            channelName: searchText,
            pageNum: 1,
            pageSize: 20
        });
        if (data && data.channelList) {
            this.props.updateFilterConditions({
                page:2,
                noMore: data.channelList.length < 20
            })
            this.props.updateCourseList(data.channelList);
        }
    }

    /** 
     * 点击分类Tab 
     */
    async clickCategoryTab(e){
        const category = e.target.dataset.category;
        // 点击当前分类，不做任何操作
        if (category === this.state.categorySelected) 
        {
            return false;
        }
        const conditions = {
            categorySelected: category,
            searchText: '',
            sortBy: '',
            sortOrder: '',
            onlyViewRelayCourse: false,
            viewTopTenCourses: false,
            noMore: false
        };
        this.props.updateFilterConditions({
            ...conditions,
            page: 2
        });
        this.setState(conditions, () => {
            this.refreshCourseList();
        });
    }

    /** 
     * 切换是否只看未转载课程
     */
    toggleOnlyRelayCourse(){
        // 点击勾选前，如果未登录，弹窗扫码登录
        if (!this.state.onlyViewRelayCourse) {
            if (!this.props.userId) {
                this.props.setLoginModalShow('Y');
                return;
            }
        }
        this.setState({
            categorySelected: this.state.categorySelected || 'all',
            onlyViewRelayCourse: !this.state.onlyViewRelayCourse,
            viewTopTenCourses: false,
        }, async () => {
            this.props.updateFilterConditions({
                onlyViewRelayCourse: this.state.onlyViewRelayCourse,
                viewTopTenCourses: false,
                page: 2,
            });
            this.refreshCourseList();
        });
    }

    /** 
     * 搜索课程 
     */
    async searchCourse(){
        const { searchText } = this.state;
        if (!searchText) {
            return false;
        }
        const result = await this.props.searchCourse({
            agentId: this.props.agentId || '',
            liveId: this.props.liveId,
            channelName: this.state.searchText,
            pageSize: 20,
            pageNum: 1
        });
        if (result.state.code === 0) {
            const conditions = {
                categorySelected: 'all',
                sortBy: '',
                sortOrder: '',
                onlyViewRelayCourse: false,
                viewTopTenCourses: false,
                page: 2,
                noMore: result.data.channelList < 20
            }
            this.setState(conditions);
            this.props.updateFilterConditions(conditions);
            this.props.updateCourseList(result.data.channelList);
        }
    }

    /**
     * 监听搜索框的回车按键事件
     */
    handleKeyUp(e){
        if (e.keyCode === 13) {
            this.searchCourse();
        }
    }

    /**
     * 输入搜索关键字
     */
    inputSearchText(e){
        this.setState({
            searchText: e.target.value.trim()
        }, () => {
            this.props.updateFilterConditions({
                searchText: this.state.searchText
            });
        });
    }

    /** 
     * 对课程进行排序 
     */
    sortCourse(sortBy: string, e: Event){
        const target = e.currentTarget;
        const sortOrder = e.currentTarget.getAttribute('data-sort-by');
        const nextOrder = sortOrder == 'desc' ? 'asc' : 'desc';
        target.setAttribute('data-sort-by', nextOrder);
        this.setState({
            categorySelected: this.state.categorySelected || 'all',
            sortBy,
            sortOrder,
            viewTopTenCourses: false,
        }, () => {
            this.props.updateFilterConditions({
                sortBy,
                sortOrder,
                viewTopTenCourses: false,
                page: 2,
            });
            this.refreshCourseList();
        });
    }

    /**
     * banner收起后对课程进行排序
     */
    sortWithDropDown = (item: any) => {
        const {sortOrder, sortBy} = item;
        this.setState({
            categorySelected: this.state.categorySelected || 'all',
            sortBy,
            sortOrder,
            viewTopTenCourses: false,
        }, () => {
            this.props.updateFilterConditions({
                sortBy,
                sortOrder,
                viewTopTenCourses: false,
                page: 2,
            });
            this.refreshCourseList();
        });
    }

    /**
     * 获取排序选项的索引
     */
    getIdxFromSortOption = () => {
        const { sortBy, sortOrder } = this.state;
        let idx = sortItemList.findIndex((item) => {
            return item.sortBy == sortBy && item.sortOrder == sortOrder;
        })
        return idx > 0 ? idx : 0;
    }


    /**
     * 置顶固定显示分类标签栏
     */
    fixCategoryList() {
        const { isFixedCategory } = this.state;
        const rect = this.data.actualCategoryList.getBoundingClientRect();
        if (rect.top <= 0 && !isFixedCategory) {
            this.setState({
                isFixedCategory: true
            })
        } else if (rect.top >= 0 && isFixedCategory) {
            this.setState({
                isFixedCategory: false
            })
        }
    }

    // 查看热销Top10活动课程
    viewTopTenCourses() {
        const conditions = {
            categorySelected: '',
            sortBy: '',
            sortOrder: '',
            onlyViewRelayCourse: false,
            searchText: '',
            viewTopTenCourses: true,
        };
        this.setState(conditions);
        this.props.updateFilterConditions({
            ...conditions,
            page: 1,
        });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.categorySelected == 'recommend' || nextProps.categorySelected == 'all') {
            this.setState({
                categorySelected: nextProps.categorySelected
            })
        }
    }

    // 页面滚动事件处理函数
    handleScroll(e) {
        if (typeof this.data.scrollHandler === 'function') {
            this.data.scrollHandler(e);
        }
        this.fixCategoryList();
    }

    componentDidMount(){
        // this.fetchCategoryList();
        this.data.mainContent = document.querySelector('.scroll-container');
        this.data.actualCategoryList = document.querySelector('.filter-panel-container .category-list-wrapper');
        this.data.scrollHandler = this.data.mainContent.onscroll;
        this.data.mainContent.onscroll = this.handleScroll;
    }

    goToBack () {
        if (!this.props.userInfo.userId) {
            this.props.setLoginModalShow('Y')
            e.preventDefault();
            return
        }

        locationTo('/pc/knowledge-mall/manage')
    }

    render(){
        const categoryBar = <div className={classNames({"category-list-wrapper": true, [styles.filterPanelCategory]: true})}>
                                <ul className={styles.categoryList}>
                                {
                                    this.state.categories.concat(this.props.categoryList).map((category, index) => {
                                        return (
                                            <li className={classNames({
                                                [styles.categorySelected]: this.state.categorySelected === category.id
                                            })} key={index} data-category={category.id} onClick={this.clickCategoryTab}>{category.name}</li>
                                        )
                                    })
                                }
                                </ul>
                            </div>;
        return (
            <div className="filter-panel-container">
                {/* <h1 className={styles.title} id="boutique-courses"><img src={require('./img/icon_title_left.png')} /><span>精品好课</span><img src={require('./img/icon_title_right.png')} /></h1> */}
                { categoryBar }

                {
                    this.state.categorySelected == 'recommend' ? null :
                    <div className={styles.filterPanelSortSearch}>
                    <div className={styles.sort}>
                        <i>排序:</i>
                        <span className={styles.sortButton} onClick={this.sortCourse.bind(this, 'sales')} data-sort-by="desc">
                            <span className={classNames({
                                [styles.activeSortBy]: this.state.sortBy === 'sales'
                            })}>按销量</span>
                            <span className={styles.sortBtn}>
                                <i className={classNames({
                                    [styles.triangleTop]: true,
                                    [styles.activeSortBtn]: this.state.sortBy === 'sales' && this.state.sortOrder === 'asc'
                                })}></i>
                                <i className={classNames({
                                    [styles.triangleBottom]: true,
                                    [styles.activeSortBtn]: this.state.sortBy === 'sales' && this.state.sortOrder === 'desc'
                                })}></i>
                            </span>
                        </span>
                        <span className={styles.sortButton} onClick={this.sortCourse.bind(this, 'price')} data-sort-by="desc">
                            <span className={classNames({
                                [styles.activeSortBy]: this.state.sortBy === 'price'
                            })}>按价格</span>
                            <span className={styles.sortBtn}>
                                <i className={classNames({
                                    [styles.triangleTop]: true,
                                    [styles.activeSortBtn]: this.state.sortBy === 'price' && this.state.sortOrder === 'asc'
                                })}></i>
                                <i className={classNames({
                                    [styles.triangleBottom]: true,
                                    [styles.activeSortBtn]: this.state.sortBy === 'price' && this.state.sortOrder === 'desc'
                                })}></i>
                            </span>
                        </span>
                        <span className={styles.sortButton} onClick={this.sortCourse.bind(this, 'endRate')} data-sort-by="desc">
                            <span className={classNames({
                                [styles.activeSortBy]: this.state.sortBy === 'endRate'
                            })}>完播率</span>
                            <span className={styles.sortBtn}>
                                <i className={classNames({
                                    [styles.triangleTop]: true,
                                    [styles.activeSortBtn]: this.state.sortBy === 'endRate' && this.state.sortOrder === 'asc'
                                })}></i>
                                <i className={classNames({
                                    [styles.triangleBottom]: true,
                                    [styles.activeSortBtn]: this.state.sortBy === 'endRate' && this.state.sortOrder === 'desc'
                                })}></i>
                            </span>
                        </span>
                        <span className={styles.sortButton} onClick={this.sortCourse.bind(this, 'reward')} data-sort-by="desc">
                            <span className={classNames({
                                [styles.activeSortBy]: this.state.sortBy === 'reward'
                            })}>打赏金额</span>
                            <span className={styles.sortBtn}>
                                <i className={classNames({
                                    [styles.triangleTop]: true,
                                    [styles.activeSortBtn]: this.state.sortBy === 'reward' && this.state.sortOrder === 'asc'
                                })}></i>
                                <i className={classNames({
                                    [styles.triangleBottom]: true,
                                    [styles.activeSortBtn]: this.state.sortBy === 'reward' && this.state.sortOrder === 'desc'
                                })}></i>
                            </span>
                        </span>
                        <span onClick={this.toggleOnlyRelayCourse}>
                            <span className={classNames({
                                [styles.onlyRelayCheckBox]: !this.state.onlyViewRelayCourse,
                                [styles.onlyRelayCheckBoxChecked]: this.state.onlyViewRelayCourse
                            })}></span>
                            <span className={classNames({
                                [styles.onlyRelayCheckLabel]: !this.state.onlyViewRelayCourse,
                                [styles.onlyRelayCheckLabelChecked]: this.state.onlyViewRelayCourse
                            })}>只看未转载课程</span>
                        </span>
                        {/* <div className={classNames({
                            [styles.topTenBtn]: true,
                            [styles.activeTopTenBtn]: this.state.viewTopTenCourses,
                        })} onClick={this.viewTopTenCourses}>热销Top10</div> */}
                    </div>
                </div>
                }
                { this.state.isFixedCategory && <div className={styles.fixedCategoryBar} style={{width: `${this.data.actualCategoryList.offsetWidth}px`}}>
                <div className={styles.headerContainerWrap}>
                    <div className={styles.headerContainer} >
                        <div className={styles.left}>
                            <div className={styles.logo}></div>
                            <div className={styles.title}>
                                <div className={styles.text}>{this.props.agentInfo.isExist == 'Y' ? this.props.agentInfo.agentName : '知识通商城'}</div>
                                <div className={styles.sologan}>传播智慧，高分成，高转化</div>
                            </div>
                            <div className={styles.searchBox}>
                                <input type="text" className={styles.searchText} placeholder="课程标题/关键词搜索" value={this.state.searchText} onChange={this.inputSearchText} onKeyUp={this.handleKeyUp} />
                                <i className={styles.searchIcon} onClick={this.searchCourse}></i>
                            </div>
                        </div>
                        <div className={styles.right}>
                            {
                                this.props.categorySelected != 'recommend' ? <DropDown onSelect={this.sortWithDropDown} itemList={sortItemList} currentItemIdx={this.getIdxFromSortOption()}/> :null
                            }
                        </div>
                        <div className={styles.final}>
                            <a href="javascript:void(0)" className={styles.backStageBtn} onClick={this.goToBack}>进入分销后台</a>
                        </div>
                    </div>
                        { categoryBar }
                    </div>
                </div>
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    liveId: state.common.liveInfo.liveId,
    userInfo: state.common.userInfo,
    userId: state.common.userInfo.userId,
    agentId: state.common.agentInfo.agentId,
    agentInfo: state.common.agentInfo,
    categorySelected: state.updateFilterConditions.categorySelected,
    categoryList: state.updateFilterConditions.categoryList
});

const mapActionToProps = {
    fetchCategoryList,
    fetchCourseList,
    updateFilterConditions,
    updateCourseList,
    searchCourse,
    setLoginModalShow,
}

export default connect(mapStateToProps, mapActionToProps)(FilterPanel);
