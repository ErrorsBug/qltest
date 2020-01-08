import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import Footer from '../../components/footer';
import CourseAlarm from './components/course-alarm-box';
import CourseList from './components/course-list';
import DatePickerAlarm from './components/date-picker-alarm';
import { getMyCourseList, getLastCourse, getMyCoursePlan, getStudentInfo, initConfig ,getExamCampList} from "../../actions/home";
import { getQr } from "../../actions/common";
import { getVal, locationTo } from 'components/util';
import { request, fetchSubscribeStatus } from 'common_actions/common';
import { userBindKaiFang } from "../../../actions/common";
import { getUrlParams } from 'components/url-utils';
import NoData from './components/no-data'
import UniversityHome from 'components/operate-menu/home'
import LearnCamp from './components/learn-camp'


//标题
const MclTitle=({title,tipText,link,region})=>{
    return  <div className="unlc-title">
        <div className="unlc-left">{title}</div>
        <div className={`unlc-right ${link?'to-arrow':''} on-log on-visible`} 
            data-log-name={tipText}
            data-log-region={region}
            data-log-pos={ 0 }
             onClick={()=>{link&&locationTo(link)}}>{tipText}</div>
    </div>
}

@autobind
class MyCourseList extends Component {
    state = {
        startTime:Date.now(),
        pageNum: 1,
        pageSize: 20,
        courseList: [],
        isNoMore: false,
        noData: false,
        lastCourse: {},
        coursePlan: {},
        showPickerAlarm: false,
        qrcode:'',
        isDisAbleScroll: false,
        alertStatus: 'Y',
        campList:[]
    }
    componentDidMount() {
        this.bindAppKaiFang();
       this.loadCampList();
       this.loadMyCourseList();
       this.initLastCourse();
       this.initCoursePlan();
        this.initUniversityInfo();

        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('tl-scroll-box');
    }

    async getRemindQr(){
        let qrResult = await this.props.getQr({
            channel: 'universityCourseAlert',
            liveId: this.state.liveId,
        });
        this.setState({
            qrcode: qrResult.data.qrUrl,
        });
    }

    async bindAppKaiFang(){
        const kfAppId = getUrlParams('kfAppId');
        const kfOpenId = getUrlParams('kfOpenId'); 
        if(kfOpenId && kfAppId){
            await this.props.userBindKaiFang({
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            });
        }
        
        
    }

    async initUniversityInfo(){
        //获取liveId
        let res = await initConfig({businessType:'UFW_CONFIG_KEY'});
        this.setState({
            liveId: getVal(res, 'UFW_LIVE_ID', ''),
            appId: getVal(res, 'UFW_APP_ID', ''),
        },async ()=>{
            //获取是否关注
            if(this.state.liveId){
                let result = await fetchSubscribeStatus({liveId: this.state.liveId, appId: this.state.appId});
                if(result && result.data && result.data.isFocusThree){
                    this.initStudentInfo();//已关注的，获取设置信息
                }else{
                    this.getRemindQr();//未关注，获取二维码
                }
            }
            
        });
    }

    loadNext(next) {
        this.loadMyCourseList(next);
        
    }
    //推荐的学习营
    async loadCampList(next){
        let {campList=[]} = await getExamCampList();
        this.setState({
            campList
        })
    }
    async loadMyCourseList(next){
        let result = await getMyCourseList({
            page: {
                page: this.state.pageNum,
                size: this.state.pageSize,
            }
        });
        let myCourseList = getVal(result, 'dataList', []);
        if(myCourseList.length >0){
            this.setState({
                courseList: [...this.state.courseList , ...myCourseList],
                pageNum: this.state.pageNum + 1,
            },()=>{
                next && next();
            });
            if(myCourseList.length<this.state.pageSize){
                this.setState({
                    isNoMore: true,
                });
            }
            
        }else{
            if(this.state.courseList.length<=0){
                this.setState({
                    noData: true,
                });
            }else{
                this.setState({
                    isNoMore: true,
                });
            }
            next && next();
        }
        
        
    }

    async initStudentInfo(){
        let result = await getStudentInfo();
        if(result.studentInfo && result.studentInfo.alertTimeStr){ //已设置
            this.setState({
                alertTimeStr: result.studentInfo.alertTimeStr,
                alertStatus: result.studentInfo.alertStatus,
                showPickerAlarm: this.props.location.query.showRemind ==='Y',
            },()=>{
                if(this.props.location.query.showRemind ==='Y'){
                    this.changeDisAbleScroll();
                }
            });
        }else{//未设置
            this.setState({
                showPickerAlarm: this.props.location.query.showRemind ==='Y',
            },()=>{
                if(this.props.location.query.showRemind ==='Y'){
                    this.changeDisAbleScroll();
                }
            });
        }
    }

    async initLastCourse (){
        let result = await getLastCourse();
        this.setState({
            lastCourse: result.course || {},
        });
    }

    async initCoursePlan(){
        let result = await getMyCoursePlan();
        this.setState({
            coursePlan: result.plan || {},
        });
    }


    showSetAlarm(){
        this.setState({
            showPickerAlarm: true,
        });
        this.changeDisAbleScroll();
    }
    hidePickerAlarm(){
        this.setState({
            showPickerAlarm: false,
        });
        this.changeDisAbleScroll();
    }

    changeAlarmInfoFunc(info){
        this.setState({
            alertTimeStr: info.alertTime,
            alertStatus: info.alertStatus,
        });
    }
    handleRemoveCourse(index){
        this.setState({
            lastCourse: this.state.courseList.splice(index,1),
            noData: this.state.courseList.length <= 0
        },() => {
            this.initCoursePlan();
        })
    }
    changeDisAbleScroll(){
        this.setState({
            isDisAbleScroll: !this.state.isDisAbleScroll,
        });
    }

    render(){
        const { noData, isNoMore, lastCourse, coursePlan, campList } = this.state
        return (
            <Page title="我的课程" className={ `my-course-list-page ${ noData ? 'no-data-box' : '' }` }>
                { noData && <NoData /> }
                { !noData && <ScrollToLoad
                    className={`tl-scroll-box ${this.state.isDisAbleScroll ? 'pointer-events-none':''}`}
                    toBottomHeight={300}
                    noneOne={noData}
                    loadNext={ this.loadNext }
                    noMore={isNoMore}
                    notShowLoaded={true}
                    >
                    {
                        campList?.length>0&&
                        <Fragment>
                            <MclTitle 
                                title={'推荐的学习营'}
                                tipText={'更多'}
                                link={'/wechat/page/university/learning-camp'}
                                region="un-my-course-more"
                                />
                            <LearnCamp campList={campList}/>
                        </Fragment>
                    }
                    
                    
                    <MclTitle 
                        title={'我的课表'}
                        tipText={'我的评测'}
                        link={'/wechat/page/university/course-exam-list'}
                        region="un-my-course-exam"
                        />
                    <CourseAlarm coursePlan ={coursePlan} alertTimeStr = {this.state.alertTimeStr} qrcode={this.state.qrcode} showSetAlarm={this.showSetAlarm} changeDisAbleScroll={this.changeDisAbleScroll}  />
                    <CourseList courseList = {this.state.courseList || []} handleRemoveCourse={ this.handleRemoveCourse } changeDisAbleScroll={this.changeDisAbleScroll}  />
                    {isNoMore && <Footer />}
                </ScrollToLoad> }
                {
                    lastCourse && lastCourse.businessId &&
                    <div className="last-learning" onClick={()=>{
                        lastCourse.businessType ==='topic'?
                            locationTo(`/topic/details?topicId=${lastCourse.businessId}&isUnHome=Y`)
                        :
                        (
                            lastCourse.businessType ==='book'?
                            locationTo(`/topic/details-listening?topicId=${lastCourse.businessId}&isUnHome=Y`):
                            locationTo(`/topic/details?topicId=${lastCourse.currentId}&isUnHome=Y`)
                        )
                    }}>
                        <img src={lastCourse.headImgUrl} alt="" />
                        <span className="info">
                            <var>最近播放</var>
                            <b>{  lastCourse.businessType === 'channel' ? lastCourse.currentCourseName : lastCourse.name}</b>
                        </span>
                        <span className="btn-learn" >继续学</span>
                    </div>
                }
                <UniversityHome className="un-my-course-home" isUnHome />
                <DatePickerAlarm isShow={this.state.showPickerAlarm} 
                onClose = {this.hidePickerAlarm}  
                alertTimeStr = {this.state.alertTimeStr} 
                alertStatus = {this.state.alertStatus}
                changeAlarmInfo = {this.changeAlarmInfoFunc}
                 />

            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    user: ''
});

const mapActionToProps = {
    getQr,
    userBindKaiFang
};

module.exports = connect(mapStateToProps, mapActionToProps)(MyCourseList);