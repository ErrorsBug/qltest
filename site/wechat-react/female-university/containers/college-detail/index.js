import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind , throttle} from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import JoinDialog from '../../components/join-dialog';
import CourseItem from '../../components/course-item';
import JoinHoc from '../../components/join-dialog/join-hoc';
import Footer from '../../components/footer';
import CollegeInfo from './components/college-info';
import CateList from './components/cate-list';
import { getUrlParams, fillParams } from 'components/url-utils';
import { share } from 'components/wx-utils';
import { getCookie } from 'components/util';
import UserHoc from '../../components/user-hoc'
import { 
    getCollegeTag,
    getTagCourseList,
    getWithChildren } from '../../actions/home';
import { createPortal } from 'react-dom'
import AppEventHoc from '../../components/app-event'
import { pySort } from 'components/zh';
import CourseExamDialog from '../../components/course-exam-dialog';
import TeacherDialog from './components/teacher-dialog'

@AppEventHoc
@UserHoc
@JoinHoc
@autobind
class CollegeDetail extends Component {
    state = {
        collegeInfo: {},
        tags: [],
        isNoMore: false,
        lists: [],
        isLoading: false,
        scrolling:false
    }
    page = {
        size: 20,
        page: 1
    }
    isAway = false
    isLoading = false;
    get code(){
        return getUrlParams('nodeCode', '')
    }
    componentDidMount() {
        const unTabId = sessionStorage.getItem(this.code)
        this.initData(unTabId && Number(unTabId));
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('cl-scroll-box');
    }
    
    async initData(unTabId) {
        const [collegeObj, tagObj] = await Promise.all([
            getWithChildren({nodeCode: this.code, size: 100, page: 1}),
            getCollegeTag({code: this.code})
        ])
        const list = tagObj.dataList || [];
        const curId = list[0] && list[0].id || '';
        pySort(collegeObj?.menuNode?.children || [],'keyA') 
        this.setState({
            collegeInfo: collegeObj.menuNode || {},
            tags: list,
            curId: unTabId || curId,
        }, () => {
            this.initShare();
            if(!!curId){
                this.getTagCourseList(unTabId != curId);
            }
        })
    }
    // 根据标签ID获取课程数据
    async getTagCourseList(flag) {
        if(!this.state.curId) return false
        const { dataList = [] } = await getTagCourseList({ tagBId: this.state.curId, ...this.page });
        if(!!dataList){
            if(dataList.length >= 0 && dataList.length < this.page.size){
                this.setState({
                    isNoMore: true
                })
            } else {
                this.page.page += 1;
            }
            const lists = this.handleData(dataList);
            if(flag){
                this.setState({
                    lists: lists,
                    isLoading: false
                })
            } else {
                this.setState({
                    lists: [...this.state.lists, ...lists],
                    isLoading: false
                })
            }
        }
    }
    // 处理数据
    handleData(lists) {
        let isOnce = false;
        const path = this.props.location && this.props.location.pathname || '';
        let isPath = false;
        if(path){
            isPath = localStorage.getItem(path) === 'Y';
        }
        return lists.map((item, index) => {
            item.isJoin = Object.is(item.isJoin, 'Y');
            if(item.isJoin && !isOnce && !isPath && !!path){
                item.isOnce = true;
                isOnce=true;
                localStorage.setItem(path, 'Y')
            }
            return item;
        })
    }
    async loadNext(next) { 
        if(!this.state.isNoMore){ 
            await this.getTagCourseList();
        } 
        next && next();
    }
    // 切换三级标签
    getSelectCateData(id, scrollTop) {
        const scrolNode = document.querySelector('.cl-scroll-box');
        if(!scrolNode) return false
        this.page.page = 1;
        this.isLoading = true;
        sessionStorage.setItem(this.code, id)
        this.setState({
            curId: id,
            isNoMore: false,
            noData: false,
            isLoading: true,
        }, async () => {
            if(!!id){
                await this.getTagCourseList(true)
                scrolNode.scrollTop = scrollTop;
                this.isLoading = false
            }
        })
    }
    initShare() {
        const { collegeInfo } = this.state
        const { shareParams, shareConfig } = this.props;
        let title = `千聊女子大学${ collegeInfo.title }`;
        let desc = `${collegeInfo.keyD }`;
        let shareUrl = fillParams({ nodeCode : this.code, ...shareParams, wcl:'university_share' }, location.href,['couponCode'])
        // 微信分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: collegeInfo.keyE,
            shareUrl: shareUrl
        });
        // app分享
        shareConfig({
            content: shareUrl,
            title: title,
            desc: desc,
            thumbImage: collegeInfo.keyE,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        })
    }

    handleJump() {
        this.isAway = true
    }
    
    @throttle(300)
    onScrollHandle() { 
        this.setState({
            scrolling: true,
        });
        this.timer&&clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
            this.setState({
                scrolling: false,
            });
        }, 400)
 
    }

    render(){
        const { isNoMore, collegeInfo, tags, curId, lists, isLoading,scrolling } = this.state
        const { isShowDialog, close, joinPlan, ...otherProps } = this.props;
        return (
            <Page title={ collegeInfo.title } className={`cl-detail-box ${isShowDialog?'pointer-events-none':''}`}>
                <ScrollToLoad
                    className="cl-scroll-box"
                    toBottomHeight={300}
                    disable={ false }
                    loadNext={ this.loadNext }
                    scrollToDo={this.onScrollHandle}>
                    <CollegeInfo 
                        code={ this.code }
                        bgUrl={ collegeInfo.keyC }
                        badgeUrl={ collegeInfo.keyB }
                        title={ collegeInfo.title }
                        tutorLists={ collegeInfo.children || [] }
                        info={ collegeInfo.keyF }
                        decs={ collegeInfo.keyD }/>
                        
                    <div className={ `cl-detail-cont ${ isLoading ? 'loading' : '' }` }>
                        <h2>课程体系</h2>
                        <CateList 
                            tags={ tags || [] } 
                            curId={ curId } 
                            getSelectCateData={ this.getSelectCateData }/>
                        { lists.map((item, index) => (
                            <CourseItem
                                key={ index } 
                                idx={ index } 
                                { ...item } 
                                isShowCate
                                handleJump={ this.handleJump }
                                resize={{ w: 160, h: 202 }}
                                className="cl-detail-item"
                                { ...otherProps } />
                        )) }
                    </div>
                    { isNoMore && <Footer /> }
                </ScrollToLoad>
                    {
                        createPortal(
                            <JoinDialog 
                                isShowDialog={ isShowDialog } 
                                close={ close } 
                                joinPlan={joinPlan} />,
                                document.getElementById('app')
                            ) 
                    }
                    
                {
                    typeof document != 'undefined'  && createPortal(
                        <CourseExamDialog  nodeCode={"QL_PAGE_NZDX_XY"} nextCode={this.props.location.query.nodeCode}/>,
                            document.getElementById('app')
                        ) 
                } 
                <TeacherDialog {...collegeInfo} scrolling={scrolling}/>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    user: ''
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(CollegeDetail);