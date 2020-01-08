import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Link } from 'react-router';
import styles from './style.scss';
import classnames from 'classnames';

import { Icon, Button, Layout, message } from 'antd';
import Banner from './components/banner';
import ModalHeader from './components/modal-header';
import CourseList from '../../components/course-list';
import FilterPanel from '../../components/filter-panel';
import CommonHeader from '../../components/common-header';
import ModalReprint from "../../components/modal-reprint";
import ModalFooter from './components/modal-footer';
import WechatInfo from './components/wechat-info';
import FansPortrait from './components/fans-portrait';
import TeamStatus from './components/team-status';
import HighBonusBanner from './components/high-bonus-banner';
import TopTen from './components/top-ten';
import RecommendList from './components/recommend-list';
import RecommendModule from "./components/recommend-module";
import Modal from '../../components/modal';
import { throttle } from "lodash";

import { fetchCourseList, updateCourseList, clearCourseList,setReprintInfo, setPromotionInfo } from '../../actions/course';
import { fetchTagsList, fetchPortraitInfo, fetchHasPortraitInfo, savePortraitInfo, fetchWechatCategoryList } from '../../actions/portrait';
import { setLiveInfo, setReprintModalShow,setPromotionModalShow, setLoginModalShow, updateNavCourseModule } from '../../actions/common';
import { updateFilterConditions,resetFilterConditions, fetchCategoryList } from '../../actions/filter'
import { locationTo } from '../../components/util';
import _ScrollToLoad from '../../components/scrollToLoad';
import { min } from 'moment';
import { isTemplateExpression } from 'typescript';
const ScrollToLoad = _ScrollToLoad as any

const step = ['wechat-info', 'fans-portrait', 'done'];

const getRemainHeight = (bottom, viewportHeight, elementHeight) => {
    if (bottom < 0 ) return 0;
    if (bottom - viewportHeight < 0) {
        return bottom;
    }
    if (bottom - viewportHeight > 0) {
        const diff = viewportHeight + elementHeight - bottom;
        return diff < 0 ? 0 : diff
    }
}

@autobind
class MallIndex extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    get liveId(){
        return this.props.liveInfo.liveId || '';
    }
    
    data = {
        // 微信号规则
        wechatAccountPattern: /^[a-zA-Z][a-zA-Z\d_\-]{5,19}$/,
        // 手机号基础规则
        mobilePhonePattern: /^1\d{10}$/,
        // 是否处于请求状态
        pending: false
    }
    
    state = {
        showModal: 'N',
        showReprintSuccessModal: 'N',
        currentDialog: 'wechat-info',
        showNavigation: false,
        navigateTransition: {

        }
    }

    componentDidMount() {
        this.fetchCourseList(this.props.liveInfo.liveId, this.props.agentInfo.agentId);
        const clientHeight = document.documentElement.clientHeight;
        const contentContainer = document.querySelector('.scroll-container');
        const scrollHandler = contentContainer.onscroll;
        contentContainer.onscroll = (e) => {
            if (typeof scrollHandler === 'function') {
                scrollHandler(e);
            }
            // 页面滚动距离大于浏览器高度的二分之一时，显示右侧导航
            if ((contentContainer.scrollTop / clientHeight) >= 0.5) {
                !this.state.showNavigation && this.setState({showNavigation: true});
            } else {
                this.state.showNavigation && this.setState({showNavigation: false});
            }
        }
        this.handleScroll();
        this.fetchCategoryList();
        this.genNavigator();
        this.viewTopTenCourses();
        this.setCss()
    }

    setCss () {
        let css = `
            .course-module {
                margin: 40px auto;
            }
        `
        let style = document.createElement('style');
        style.innerHTML = css;
        let head = document.head;
        head.appendChild(style);
    }

    fetchCategoryList = () =>  {
        this.props.fetchCategoryList()
    }

    handleScroll () {
        let scrollContainer = document.querySelector('.scroll-container');
        scrollContainer.addEventListener('scroll', throttle((e) => {
            let modules = document.querySelectorAll('.course-module');
            let height = window.innerHeight;

            let modulesMap = Array.from(modules).map((item, idx) => {
                let position = item.getBoundingClientRect();
                return {
                    height: getRemainHeight(position.bottom, window.innerHeight, item.clientHeight),
                    name: item.dataset.name
                }
            })

            let max = 0, maxIdx = 0;
            for (let idx in modulesMap) {
                if (modulesMap[idx].height > max) {
                    max = modulesMap[idx].height;
                    maxIdx = Number(idx)
                } 
            }

            this.setState({
                navigateTransition: modulesMap.reduce((prev, cur, curIdx) => {
                    prev[cur.name] = curIdx == maxIdx ? true : false;
                    return prev
                }, {})
            })
        }, 100))
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.liveInfo.liveId != nextProps.liveInfo.liveId || this.props.agentInfo.agentId != nextProps.agentInfo.agentId) {
            this.props.fetchHasPortraitInfo(nextProps.liveInfo.liveId);
            this.props.clearCourseList();
            this.props.resetFilterConditions()
            setTimeout(() => {
                this.fetchCourseList(nextProps.liveInfo.liveId, nextProps.agentInfo.agentId, true);
            }, 0)
        }
        if (nextProps.userInfo.userId) {
            if (this.props.hasPortraitInfo && !nextProps.hasPortraitInfo && this.state.showModal != 'Y') {
                this.props.fetchWechatCategoryList();
                this.props.fetchTagsList('fans_personas', nextProps.liveInfo.liveId);
                this.setState({
                    showModal: 'Y'
                });
                return;
            }
        }
    }

    // fetchingCourse = false
    async fetchCourseList(liveId, agentId?, isInit?) {
        // if (this.fetchingCourse) { return }
        // this.fetchingCourse = true

        try {
            const {
                categorySelected,
                sortBy,
                sortOrder,
                onlyViewRelayCourse,
                searchText,
                page,
                size,
            } = this.props

            let { channelList } = await this.props.fetchCourseList({
                agentId: agentId || '',
                liveId: liveId,
                tagId: categorySelected === 'all' || categorySelected === 'recommend' ? '' : categorySelected,
                isRecommend: categorySelected === 'recommend' ? 'Y' : 'N',
                orderBuyNumber: sortBy === 'sales' ? sortOrder : '',
                orderPrice: sortBy === 'price' ? sortOrder : '',
                orderReward: sortBy === 'reward' ? sortOrder : '',
                orderEndRate: sortBy === 'endRate' ? sortOrder : '',
                notRelayOnly: onlyViewRelayCourse ? 'Y' : 'N',
                channelName: searchText,
                pageNum: isInit ? 1 : page,
                pageSize: size,
            })

            this.props.updateFilterConditions({
                page: page + 1,
                noMore: channelList.length < size,
            })
            const list = isInit ? channelList : this.props.courseList.concat(channelList)
            this.props.updateCourseList(list)
        } catch (error) {
            console.error('获取课程列表失败: ', error)
        } finally {
            // this.fetchingCourse = false
        }
    }

    uiModalChoose = () => {
        if (this.state.currentDialog === 'wechat-info') {
            return (
                <WechatInfo wechatInfo={{...this.props.wechatInfo}}/>
            )
        }
        if (this.state.currentDialog === 'fans-portrait') {
            return (
                <FansPortrait fansTags={[...this.props.fansTags]} fansRemark={this.props.fansRemark} tagsSelected={[...this.props.tagsSelected]}/>
            )
        }
        if (this.state.currentDialog === 'done') {
            return null
        }
    }

    nextStep = async () => {
        let { currentDialog } = this.state;
        if (currentDialog == 'wechat-info') {
            if (!this.checkWechatInfo()) {
                return ;
            } 
        }

        if (currentDialog == 'fans-portrait') {
            if (!this.checkFansTag()) {
                return ;
            }
            await this.saveUserPortrait();
        }
        this.setState({
            currentDialog: step[step.indexOf(currentDialog) + 1]
        })
    }

    closeDialog = () => {
        this.setState({
            showModal: 'N'
        })
    }

    continue = () => {
        locationTo(['/pc/knowledge-mall/user-portrait']);
    }

    goKnowledge = () => {
        locationTo(['/pc/knowledge-mall/index']);
    }

    checkWechatInfo = () => {
        const {account, phone, name, followers, category, allCategories, contacts} = this.props.wechatInfo;
        // 验证微信号的合理性
        if (account && !this.data.wechatAccountPattern.test(account)) {
            message.error('请填写一个合理的微信号哦~');
            return false;
        }
        // 验证手机号码的合理性
        if (phone && !this.data.mobilePhonePattern.test(phone)) {
            message.error('请填写一个合理的手机号码哦~');
            return false;
        }
        return true;
    }

    checkFansTag = () => {
        // 验证是否有选择粉丝画像的标签
        let hasSelectedFansTags = false;
        const fansTags = this.props.fansTags;
        const tagsSelected = this.props.tagsSelected;
        for (let i = 0; i < fansTags.length; i++) {
            const tagsList = fansTags[i].items;
            for (let j = 0; j < tagsList.length; j++) {
                if (tagsSelected.indexOf(String(tagsList[j].itemId)) > -1) {
                    hasSelectedFansTags = true;
                    break;
                }
            }
            if (hasSelectedFansTags) {
                break;
            }
        }
        if (!hasSelectedFansTags) {
            message.error('请完善粉丝画像信息');
            return false;
        }
        return true;
    }

    saveUserPortrait = async () => {
        if (this.data.pending) {
            return false;
        } else {
            this.data.pending = true;
        }
        const {account, phone, name, followers, category, allCategories, contacts} = this.props.wechatInfo;
        const result = await this.props.savePortraitInfo({
            liveId: this.liveId,
            itemIds: this.props.tagsSelected.join(','),
            diyRemark: this.props.fansRemark,
            activePlatforms: [...this.props.activePlatforms],
            wxopenInfo: {
                appName: name,
                appAccount: account,
                appFansNum: followers,
                appCategory: category,
                linkman: contacts,
                mobile: phone
            }
        });
        if (result.state.code === 0) {
            message.success('用户画像保存成功');
            if (!this.liveId) {
                const {liveId, liveName, headImg, nickName} = result.data;
                this.props.setLiveInfo({liveId, liveName, headImg, nickName});
            }
        }
        this.data.pending = false;
    }
    
    closeReprintSuccessModal() {
        this.setState({ showReprintSuccessModal: 'N'})
    }

    showReprintSuccessModal() {
        this.setState({ showReprintSuccessModal: 'Y'})
    }

    async loadNext(next) {
        if (this.props.categorySelected == 'recommend') return;
        await this.fetchCourseList(this.props.liveInfo.liveId, this.props.agentInfo.agentId)
        next && next()
    }

    navigate = (e) => {
        let {name} = e.currentTarget.dataset
        if (this.props.categorySelected != 'recommend') {
            this.props.updateFilterConditions({
                categorySelected: 'recommend'
            })
            setTimeout(() => {
                location.href = `#${name}`
            }, 500)
            return 
        }
        location.href = `#${name}`
    }

    /** 
     * 点击分类Tab 
     */
    // async clickCategoryTab(e){
    //     const category = e.target.dataset.category;
    //     // 点击当前分类，不做任何操作
    //     if (category === this.state.categorySelected) 
    //     {
    //         return false;
    //     }
    //     const conditions = {
    //         categorySelected: category,
    //         searchText: '',
    //         sortBy: '',
    //         sortOrder: '',
    //         onlyViewRelayCourse: false,
    //         viewTopTenCourses: false,
    //         noMore: false
    //     };
    //     this.props.updateFilterConditions({
    //         ...conditions,
    //         page: 2
    //     });
    //     this.setState(conditions, () => {
    //         this.refreshCourseList();
    //     });
    //     if (conditions.categorySelected == 'recommend') {
    //         this.props.updateNavCourseModule([])
    //     }
    // }

    genNavigator () {
        var counter = 0;
        var intervalId = setInterval(() => {
            try {
                if (this.props.categorySelected == 'recommend') {
                    let navs = Array.from(document.querySelectorAll('.course-module')).map(item => {
                        return item.dataset.name;
                    })

                    counter ++;

                    if (counter == 10) {
                        clearInterval(intervalId)
                    }
    
                    this.props.updateNavCourseModule(navs);
    
                }      
            } catch(e) {
                console.error(e)
            }

        }, 300)
    }

    // 查看热销Top10活动课程
    viewTopTenCourses() {
        const conditions = {
            categorySelected: 'recommend',
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

    goToBack () {
        if (!this.props.userInfo.userId) {
            this.props.setLoginModalShow('Y')
            e.preventDefault();
            return
        }

        locationTo('/pc/knowledge-mall/manage')
    }

    render() {
        const { search } = this.props.location
        let { navigateTransition } = this.state;
        return (
            <ScrollToLoad
                className="scroll-container"
                disable={this.props.viewTopTenCourses}
                toBottomHeight={0}
                loadNext={this.loadNext}
                noMore={this.props.noMore}
            >
            <div className={styles.pageContainer} id="top">
                
                    <CommonHeader curTabId="index" />
                    <Banner />
                    <FilterPanel />
                    {
                        this.props.categorySelected !== 'recommend' ? 
                            <CourseList
                                list={this.props.courseList}
                                agentInfo={this.props.agentInfo}
                                userIdentity={this.props.userIdentity}
                                setReprintInfo={this.props.setReprintInfo}
                                setReprintModalShow={this.props.setReprintModalShow}
                                setPromotionModalShow={this.props.setPromotionModalShow}
                                setPromotionInfo={this.props.setPromotionInfo}
                                liveId={this.props.liveInfo.liveId}
                                setLoginModalShow={this.props.setLoginModalShow}
                            />
                        : <Fragment>
                            <RecommendList />
                            {
                                this.props.liveInfo.liveId ? <RecommendModule /> : null
                            }
                            {
                                !this.props.agentInfo.agentId ?
                                <HighBonusBanner 
                                    agentInfo={this.props.agentInfo}
                                    userIdentity={this.props.userIdentity}
                                    setReprintInfo={this.props.setReprintInfo}
                                    setReprintModalShow={this.props.setReprintModalShow}
                                    setPromotionModalShow={this.props.setPromotionModalShow}
                                    setPromotionInfo={this.props.setPromotionInfo}
                                    liveId={this.props.liveInfo.liveId}
                                    setLoginModalShow={this.props.setLoginModalShow}
                                /> : null
                            }
                            {
                                
                                <TopTen 
                                    userIdentity={this.props.userIdentity}
                                    setReprintInfo={this.props.setReprintInfo}
                                    setReprintModalShow={this.props.setReprintModalShow}
                                    setPromotionModalShow={this.props.setPromotionModalShow}
                                    setPromotionInfo={this.props.setPromotionInfo}
                                    setLoginModalShow={this.props.setLoginModalShow}
                                />
                            }
                        </Fragment>   
                    }
                
                <Modal
                    show={this.state.showModal}
                    onClose={() => {}}
                    className=""
                >
                    { this.state.currentDialog !== 'done' ?  
                        <ModalHeader /> :
                        <div className={styles.successInfo}>
                            <div className={styles.successInfoImg}>
                                <img className={styles.successIcon} src={require('./assets/success.png')} alt=""/>
                            </div>
                            <div className={styles.successInfoMsg}>
                                恭喜，画像描绘成功！
                            </div>
                            <div className={styles.successInfoPrompt}>
                                您可以从【我的画像】进入，对个人信息进行补充或修改。
                            </div>
                        </div>
                    }
                    <div style={{maxWidth: '720px', maxHeight: '400px', overflowY: 'auto'}}>
                        {this.uiModalChoose()}
                    </div>

                    {
                        this.state.currentDialog !== 'done' ?
                        <ModalFooter
                            nextStep={this.nextStep}
                            pass={this.closeDialog}
                        ></ModalFooter> :
                        <div className={styles.footer}>
                            <div className={styles.cont} onClick={this.continue}>继续完善画像</div>
                            <div className={styles.knowledge} onClick={this.goKnowledge}>进入知识商城</div>
                        </div>
                    }
                </Modal>
                <ModalReprint showReprintSuccessModal={this.showReprintSuccessModal}/>
                <Modal
                    show={this.state.showReprintSuccessModal}
                    onClose={this.closeReprintSuccessModal}
                    className={styles.reprintSuccessModal}
                >
                    <div className={styles.reprintSuccessModalContent}>  
                        <img className={styles.reprintSuccessIcon} src={require('./assets/success.png')} alt=""/>
                        <div className={styles.reprintSuccessInfoMsg}>转载成功</div>
                        <div className={styles.reprintSuccessInfoPrompt}>该课已转到你的知识店铺，请多多推广</div>
                        <div className={styles.reprintFooter}>
                            <Link to={'/pc/knowledge-mall/manage' + search} className={styles.cont} onClick={this.closeReprintSuccessModal}>查看转载课</Link>
                            <div className={styles.knowledge} onClick={this.closeReprintSuccessModal}>继续选课</div>
                        </div>
                    </div>
                </Modal>

                {/* 页面右侧导航 */}
                {
                    <div className={styles.navigator}>
                        {
                            this.props.moduleList.map(item => {
                                return (
                                    <div key={item} data-name={item} onClick={this.navigate} className={classnames(this.state.navigateTransition[item] ? styles.active : '')}>
                                        <span>
                                        {item.length > 5 ? `${item.substr(0, 3)}
${item.substr(3,3)}` : 
                                        `${item.substr(0,2)}
${item.substr(2)}`}
                                    </span>
                                    </div>
                                )
                            })
                        }
                        <div className={styles.salesBack} onClick={this.goToBack}><span>分销后台</span></div>
                        <div><a href="#top" className={styles.backTop}>顶部</a></div>
                    </div>
                }
            </div>
                     
            </ScrollToLoad>    
        );
    }
}

function mapStateToProps(state) {
    return {
        courseList: state.course.courseList,
        userIdentity: state.common.userIdentity,
        agentInfo: state.common.agentInfo,
        userInfo: state.common.userInfo,
        liveInfo: state.common.liveInfo,
        hasPortraitInfo: state.portrait.hasPortraitInfo,
        wechatInfo: state.portrait.wechatInfo,
        fansTags: state.portrait.fansTags,
        teamTags: state.portrait.teamTags,
        tagsSelected: state.portrait.tagsSelected,
        fansRemark: state.portrait.fansRemark,
        activePlatforms: state.portrait.activePlatforms,
        activeCategoryId: state.updateFilterConditions.activeCategoryId,
        sortBy: state.updateFilterConditions.sortBy,
        sortOrder: state.updateFilterConditions.sortOrder,
        onlyViewRelayCourse: state.updateFilterConditions.onlyViewRelayCourse,
        searchText: state.updateFilterConditions.searchText,
        page: state.updateFilterConditions.page,
        size: state.updateFilterConditions.size,
        noMore: state.updateFilterConditions.noMore,
        categorySelected: state.updateFilterConditions.categorySelected,
        viewTopTenCourses: state.updateFilterConditions.viewTopTenCourses,
        moduleList: state.common.moduleList,
        categoryList: state.updateFilterConditions.categoryList,
    }
}

const mapActionToProps = {
    fetchCourseList,
    updateCourseList,
    clearCourseList,
    fetchHasPortraitInfo,
    fetchTagsList,
    fetchPortraitInfo,
    savePortraitInfo,
    setLiveInfo,
    setReprintInfo,
    setReprintModalShow,
    setPromotionModalShow,
    setPromotionInfo,
    setLoginModalShow,
    fetchWechatCategoryList,
    updateFilterConditions,
    resetFilterConditions,
    updateNavCourseModule,
    fetchCategoryList
}

export default connect(mapStateToProps, mapActionToProps)(MallIndex)
