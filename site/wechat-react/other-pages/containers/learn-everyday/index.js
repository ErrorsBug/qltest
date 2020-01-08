import Page from 'components/page';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { locationTo, imgUrlFormat, timeBefore } from 'components/util';
import React, { Component } from 'react';
import { request } from 'common_actions/common';
import TopTabBar from 'components/learn-everyday-top-tab-bar';
import TabBar from 'components/tabbar';
import Empty from 'components/empty-page';
import SctollView from 'components/scroll-view';
import CollectVisible from 'components/collect-visible';
import QfuEnterBar from 'components/qfu-enter-bar'
import HorizontalScrolling from 'components/horizontal-scrolling'

//actions
import {getUserInfo} from '../../actions/common';
import {getUserLearnInfo, getUserFocusInfo, liveAlert, getLivecenterTags, saveUserTag} from 'actions/learn-everyday';

@autobind
class LearnEveryday extends Component {
    state = {
        // 今天日期(yyyymmdd)
        today: '',
        // 当前选择的日期(yyyymmdd)
        currentDate: '',
        // 当前显示的日期与周几
        currentDateString: '',
        // 最近五天日期列表
        dateList: [{},{},{},{},{}],
        // 是否正在查看学习记录
        checkRecord: false,
        // 用户信息
        userInfo: {},
        // 学习列表
        learnList: [],
        // 关注列表
        focusList: [],
        // 标签列表
        labelList: [],
        // 是否已经选择过课程分类
        hasSelected: false,
        // 是否已经保存标签设置
        hasSaved: false,
        // 选中的标签id列表
        tagIdList: [],
        // 猜你喜欢课程
        guestYouLikeCourseList: [],
        // 打卡记录
        viewRecord: {},
        // 是否可以请求底部导航条判断是否有每天学红点提示的接口
        canRequest: false,
        // 显示底部导航
        showBottomTabBar: (this.props.location.query.f == 'messages' || this.props.location.query.f == 'course') ? true : false,


        courseList: {
            status: '',
            data: undefined,
            page: {
                size: 10,
            }
        }
    }

    componentDidMount(){
        this.getOtherInfo();

        this.getCourseList();

        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll({wrap: 'content-container'});
        }, 100)
    }

    getCourseList = (isContinue) => {
        if (/pending|end/.test(this.state.courseList.status)) return;

        const page = {
            ...this.state.courseList.page
        };
        page.page = isContinue && page.page ? page.page + 1 : 1;

        this.setState({
            courseList: {
                ...this.state.courseList,
                status: 'pending',
            }
        })

        request.post({
            url: '/api/wechat/transfer/h5/live/push/getUserLearnInfo',
            body: {
                page,
            }
        }).then(res => {
            let list = res.data.list || [];
            let viewRecord = res.data.viewRecord;

            if (viewRecord) {
                this.setState({
                    viewRecord,
                })
            }

            this.setState({
                courseList: {
                    ...this.state.courseList,
                    status: list.length < page.size ? 'end' : 'success',
                    data: isContinue ? (this.state.courseList.data || []).concat(list) : list,
                    page,
                },
            }, () => {
                setTimeout(() => {
                    typeof _qla != 'undefined' && _qla.collectVisible();
                }, 500)
            })

        }).catch(err => {
            console.error(err);
            window.toast(err.message);
            this.setState({
                courseList: {
                    ...this.state.courseList,
                    status: '',
                }
            })
        }).then(() => {
            // 列表为空时取猜你喜欢代替
            if (!this.state.courseList.data || !this.state.courseList.data.length) {
                this.getViewMore_guestYouLike();
            }
        })
    }

    // 获取用户信息
    async getUserInfo(){
        const result = await this.props.getUserInfo()
        if(result.state.code === 0){
            this.setState({userInfo: result.data.user})
        }
    }

    // 初始化数据信息
    async getInfo(date){
        Promise.all([
            getUserLearnInfo(date),
            this.getViewMore_guestYouLike()
        ]).then(result => {
            this.setState({
                canRequest: true,
                learnList: result[0].data && result[0].data.list || [],
                guestYouLikeCourseList: result[1].data && result[1].data.courseList || [],
                viewRecord: result[0].data && result[0].data.viewRecord || {}
            })
        }).catch(err => {console.error(err)})
    }

    // 初始化其他信息（关注列表，标签）
    async getOtherInfo(){
        let result = await Promise.all([getUserFocusInfo()])
        let focusList = result[0].data && result[0].data.list || [];
        let isShowFocusList = focusList.find(item => item.isAlert === 'N');
        
        isShowFocusList && this.setState({
            focusList,
        })
    }

    // 过滤标签列表（优先取被选中的分类，没有的话取二级标签中权重最高的那个）
    filterLabelList(tagList){
        if(tagList.length < 1){
            return {labelList: [], hasSelected: false}
        }
        let labelList = []//二级标签中权重最高的分类
        let selectList = []//被选中的分类
        tagList.forEach(item => {
            if(item.childenList && item.childenList.length > 0){
                item.childenList.forEach(i => {
                    if(i.select == 'Y'){
                        selectList.push(i)
                    }
                })
                labelList.push(item.childenList[0])
            }
        })
        // 优先取被选中的分类，没有的话取二级标签中权重最高的那个
        let obj = {}
        if(selectList.length > 0){
            obj.hasSelected = true
            obj.labelList = selectList
        }else {
            obj.hasSelected = false
            obj.labelList = labelList
        }
        return obj
    }

    // 初始化日期
    initDate(){
        let currentDay = new Date()
        currentDay.setHours(0)
        currentDay.setMinutes(0)
        currentDay.setSeconds(0)
        currentDay.setMilliseconds(0)
        let date = currentDay.getFullYear().toString() + (currentDay.getMonth() + 1).toString().padStart(2, '0') + currentDay.getDate().toString().padStart(2, '0')
        // 初始化每天学用户学习信息
        this.getInfo(date)
        // 日期列表，用于导航条
        let dateList = this.initDateList(date, currentDay)
        // 当前日期和周几，用于顶部日期
        let currentDateString = ''
        currentDateString = date.substring(4,6) + '月' + date.substring(6) + '日 ' + this.initWeek(currentDay).cWeek
        this.setState({currentDateString, dateList, currentDate: date, today: date})
    }

    // 初始化星期几
    initWeek(date){
        let eWeek = '',cWeek = ''
        switch(new Date(date).getDay()){
            case 0: eWeek = '周日'; cWeek = '星期天'; break;
            case 1: eWeek = '周一'; cWeek = '星期一'; break;
            case 2: eWeek = '周二'; cWeek = '星期二'; break;
            case 3: eWeek = '周三'; cWeek = '星期三'; break;
            case 4: eWeek = '周四'; cWeek = '星期四'; break;
            case 5: eWeek = '周五'; cWeek = '星期五'; break;
            case 6: eWeek = '周六'; cWeek = '星期六'; break;
        }
        return {eWeek,cWeek}
    }

    // 初始化日期列表
    initDateList(date, currentDay){
        return this.state.dateList.map((item, index) => {
            if(index == 0){
                return {
                    eDay: this.initWeek(currentDay).eWeek,
                    cWeek: this.initWeek(currentDay).cWeek,
                    cDay: '今天',
                    active: true,
                    date,
                }
            }else {
                let indexDate = new Date(currentDay.getTime() - 24 * 3600000 * index)
                let week = this.initWeek(indexDate)
                return {
                    eDay: week.eWeek,
                    cWeek: week.cWeek,
                    cDay: indexDate.getDate().toString().padStart(2, '0') + '日',
                    active: false,
                    date: indexDate.getFullYear().toString() + (indexDate.getMonth() + 1).toString().padStart(2, '0') + indexDate.getDate().toString().padStart(2, '0')
                }
            }
        })
    }

    // 获取猜你喜欢前三个课程
    getViewMore_guestYouLike = async () => {
        return await request({
            url: '/api/wechat/transfer/h5/live/center/popularCourse',
            method: 'POST',
            body: {
                page: {
                    page: 1,
                    size: 3,
                }
            }
        }).then(res => {
            this.setState({
                guestYouLikeCourseList: res.data.courseList || []
            })
        }).catch(err => {})
    }

    // 选择标签
    selectTag(i, hasSelected){
        // 如果已经设置过，则跳过
        if(hasSelected){
            return
        }
        let tagIdList = this.state.tagIdList
        let labelList = this.state.labelList
        if(i.select == 'Y'){
            let currentIndex = tagIdList.indexOf(i.id)
            if(currentIndex > -1){
                tagIdList.splice(currentIndex, 1)
            }
        }else if(i.select == 'N'){
            tagIdList.push(i.id)
        }
        labelList = labelList.map(t => {
            if(t.id == i.id){
                return {...t, select: i.select == 'Y' ? 'N' : 'Y'}
            }else {
                return t
            }
        })
        this.setState({tagIdList, labelList})
    }


    // 页面跳转
    jump(){
        locationTo('/wechat/page/recommend/user-like?wcl=DailyLearning')
    }

    // 日期切换
    async switchDate(item){
        // 连续两次点击同一个日期，不走后续操作
        if(item.date == this.state.currentDate){
            return
        }
        // 请求锁
        if(this.switchLock){
            return
        }
        this.switchLock = true
        let dateList = this.state.dateList.map(i => {
            if(i.date == item.date){
                return {...i, active: true}
            }else {
                return {...i, active: false}
            }
        })
        this.setState({
            currentDateString: item.date.substring(4,6) + '月' + item.date.substring(6) + '日 ' + item.cWeek,
            dateList,
        })
        try{
            const result = await getUserLearnInfo(item.date)
            if(result.state.code === 0){
                this.setState({
                    learnList: result.data && result.data.list || [],
                    currentDate: item.date,    
                })
                this.contentEle.scrollTop = 0
            }
        }catch(err) {
            console.error(err)
        }
        this.switchLock = false
    }

    // 查看学习记录
    checkLearnRecord(){
        this.setState({checkRecord: !this.state.checkRecord})
    }

    // 订阅操作
    async alertHandle(liveId){
        if(this.alerting){
            return
        }
        this.alerting = true
        // 直播间订阅并更新列表的订阅状态
        try {
            const result = await liveAlert(liveId)
            if(result.state.code === 0){
                let list = this.state.focusList.map(item => {
                    if(item.liveId == liveId){
                        return {...item,isAlert: result.data.isAlert ? 'Y' : 'N'}
                    }else {
                        return {...item}
                    }
                })
                this.setState({focusList: list})
                window.toast('订阅成功')
            }
        }catch(err) {
            console.error(err)
        }
        this.alerting = false
    }

    tabConfig = () =>{
        let config = [{
            href: '/wechat/page/learn-everyday',
            name: '订阅'
        }]
        let f = this.props.location.query.f
        if(f === 'messages'){
            config.push({
                href: '/wechat/page/messages',
                name: '消息',
            },{
                href: '/wechat/page/timeline',
                name: '动动态态',
            })
        } else if (f === 'course'){
            config = [
                {
                    value: '订阅',
                    href: '/wechat/page/learn-everyday?wcl=lc_course_dailylearning&f=course',
                    region: 'tag-menu',
                    pos: 'subscribe',
                },
                {
                    value: '最近学习',
                    href: '/wechat/page/mine/course?activeTag=recent',
                    region: 'tag-menu',
                    pos: 'recent',
                },
                {
                    value: '已购课程',
                    href: '/wechat/page/mine/course?activeTag=purchased',
                    region: 'tag-menu',
                    pos: 'purchased',
                },
                {
                    value: '我的体验营',
                    href: '/wechat/page/mine/course?activeTag=ufwCamp',
                    region: 'tag-menu',
                    pos: 'ufwCamp',
                },
                {
                    value: '我的听书',
                    href: '/wechat/page/mine/course?activeTag=books',
                    region: 'tag-menu',
                    pos: 'books',
                }
            ]
        } else if (f === 'focus'){
            config[0].name = '订阅的课程';
            config.push({
                href: '/wechat/page/timeline/mine-focus',
                name: '我的关注'
            })
        } else if (f === 'footPrint'){
            config[0].name = '订阅';
            config.push({
                href: '/wechat/page/mine/foot-print',
                name: '我的足迹'
            })
        }
        return config
    }

    tagClickHandle = (tabIdx) => {
        if(!tabIdx) return false
        const tabList = this.tabConfig();
        const key = tabList[tabIdx].pos
        const url = tabList[tabIdx].href
        if(Object.is(this.state.activeTag,key)) return false;
        this.props.router.push(url)
    }

    render(){
        let { checkRecord, focusList, viewRecord, showBottomTabBar, courseList } = this.state
        let f = this.props.location.query.f
        let tabConfig = this.tabConfig()
        let bottomTabbarActive = ''
        let from = this.props.location.query.f
        if(from == 'messages'){
            bottomTabbarActive = 'university'
        }else if(from == 'course'){
            bottomTabbarActive = 'discover'
        }
        
        let CourseRecommendDoms = [];

        let listData = courseList.data || [];
        listData.length || (listData = this.state.guestYouLikeCourseList);
        listData.forEach((item, index) => {
            CourseRecommendDoms.push(<CourseRecommend key={index} item = {item} index = {index}/>)
        })

        if (focusList && focusList.length > 0) {
            CourseRecommendDoms.splice(3, 0, <LiveStudioRecommend
                key="LiveStudioRecommend"
                focusList = {focusList}
                alertHandle = {this.alertHandle}
            />)
        }


        return (
            <Page title={'订阅'} className='live-learn-everyday-container'>
                {tabConfig.length > 1 &&
                    Object.is(f, 'course') ?
                    <HorizontalScrolling 
                        className="live-learn-tabs"
                        tagIdx={ 0 } lists={ tabConfig } changeTag={ this.tagClickHandle }
                    /> : (
                    <TopTabBar 
                        config = {tabConfig}
                        activeIndex = {0}
                        dontFetch = {true}
                    />
                    )
                }
                <SctollView
                    className={`content-container ${checkRecord ? ' learn-record' : ''}${showBottomTabBar ? ' bottom' : ''}`} ref={el => this.contentEle = el}
                    status={courseList.status}
                    onScrollBottom={() => this.getCourseList(true)}
                    isEmpty={CourseRecommendDoms.length === 0}
                >
                    {/* <QfuEnterBar
                        activeTag={'everyday'}
                    /> */}
                    <div className="top-area2">
                        <div className="title">学习记录</div>
                        <div className="desc">连续学习<span>{viewRecord.continuousDay}</span>天，累计学习<span>{viewRecord.totalDay}</span>天</div>
                    </div>
                    <div>
                        {CourseRecommendDoms}
                    </div>
                </SctollView>
                
                {showBottomTabBar ? 
                    <TabBar
                        activeTab = {bottomTabbarActive}
                        canRequest = {this.state.canRequest}
                        // isMineNew=''
                        // isMineNewSession={ true }
                    /> : null}
            </Page>
        )
    }
}

// 课程推荐
const CourseRecommend = ({item,index}) => {
    const jumpToIntroPage = (i, index)=> {
        typeof _qla !== 'undefined' && _qla.click({
            region: 'item-block',
            pos: index + 1
        });

        let url = ''
        if(i.businessType == 'CHANNEL' || i.businessType == 'channel'){
            url = `/wechat/page/channel-intro?channelId=${i.businessId}&wcl=DailyLearning${i.pushId?`&pushTaskId=${i.pushId}`:''}`
        }else if(i.businessType == 'TOPIC' || i.businessType == 'topic'){
            url = `/wechat/page/topic-intro?topicId=${i.businessId}&wcl=DailyLearning${i.pushId?`&pushTaskId=${i.pushId}`:''}`
        }else if(i.businessType == 'CAMP' || i.businessType == 'camp'){
            url = `/wechat/page/camp-detail?campId=${i.businessId}&wcl=DailyLearning${i.pushId?`&pushTaskId=${i.pushId}`:''}`
        }
        locationTo(url)
    }
    let hot = item.browserNum || item.learningNum || 0
    let headImage = item.headImg || item.headImage
    return (
        <div className="course-recommend on-visible"
            data-log-region="item-block"
            data-log-pos={index + 1}
            data-log-business_type={item.businessType}
            data-log-business_id={item.businessId}
            key={`item-${index}`}
            onClick={()=>{jumpToIntroPage(item, index)}}>
            <div className="header" onClick={(e) => {
                e.stopPropagation();
                locationTo(`/wechat/page/live/${item.liveId}?wcl=DailyLearning`)
            }}>
                {item.liveLogo ? <img src={imgUrlFormat(item.liveLogo,'?x-oss-process=image/resize,m_fill,limit_0,h_60,w_60')} alt=""/> : null}
                <div className="name">{item.liveName}</div>
                <div className="date">{timeBefore(item.pushTime)}</div>
            </div>

            <div className="img-area"
                style={{backgroundImage: `url(${imgUrlFormat(headImage,'?x-oss-process=image/resize,m_fill,limit_0,h_383,w_610')})`}}
            >
                {
                    item.tagList && item.tagList.length > 0 ? 
                    <div className="label-group">
                        { item.tagList.map(i => (<span className="label">{i}</span>)) }
                    </div> : null
                }
            </div>
            <div className="info-area">
                <div className="course-title">
                    <div className="name">{item.title || item.businessName}</div>
                    <div className="learn">学习</div>
                </div>
                <div className="info">
                    <div className="list">
                        <span>课程热度：</span>
                        <p>{hot < 500 ? '新课' : `${hot}人已学`}</p>
                    </div>
                    {
                        item.recommend ? 
                        <div className="evaluate list">
                            <span>老师评价：</span>
                            <p>{item.recommend}</p>
                        </div> : null
                    }
                    {
                        item.crowd && item.crowd.length > 0 ? 
                        <div className="suitable list">
                            <span>适合人群：</span>
                            <p>{item.crowd.join('、')}</p>
                        </div> : null
                    }
                </div>
            </div>
        </div>
    )
}

// 直播间订阅推荐
const LiveStudioRecommend = ({focusList,alertHandle}) => (
    <CollectVisible>
    <div className="live-studio-recommend same-top">
        <div className="header">
            猜你感兴趣
            <span onClick={()=>{locationTo('/wechat/page/timeline/mine-focus?wcl=DailyLearning')}}>管理<i className="icon_enter"></i></span>
        </div>
        <div className="live-studio">
            {
                focusList.map((item, index) => (
                    <div className="item" key={`i-${index}`}>
                        <img src={item.liveLogo} alt="" onClick={()=>{locationTo(`/wechat/page/live/${item.liveId}?wcl=DailyLearning`)}}/>
                        <div className="name" onClick={()=>{locationTo(`/wechat/page/live/${item.liveId}?wcl=DailyLearning`)}}>{item.liveName}</div>
                        {
                            item.isAlert === 'Y' ? 
                            <div className="have-subscribe">已订阅</div>:
                            <div className="subscribe on-log on-visible"
                                data-log-region="subscribe"
                                data-log-pos={index + 1}
                                onClick={()=>{alertHandle(item.liveId)}}>+订阅</div>
                        }
                    </div>
                ))
            }
        </div>
    </div>
    </CollectVisible>
)

function mapStateToProps (state) {
    return {
        
    }
}

const mapActionToProps = {
    getUserInfo
}

export default connect(mapStateToProps, mapActionToProps)(LearnEveryday);