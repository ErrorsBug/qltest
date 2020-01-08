import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import Footer from '../../components/footer';
import CourseItem from './components/course-item';
import CourseBoughtItem from './components/course-bought-item';
import HeadImg from '../../components/head-img';
import { listStudyCamp,listSignUp } from '../../actions/home';
import { share } from 'components/wx-utils';
import { fillParams } from 'components/url-utils';
import { getCookie, getVal, locationTo } from 'components/util';
import UserHoc from '../../components/user-hoc'
import UniversityHome from 'components/operate-menu/home'
import AppEventHoc from '../../components/app-event'
import TabNav from '../../components/tab-nav'
import HandleAppFunHoc from 'components/app-sdk-hoc'

@HandleAppFunHoc
@AppEventHoc
@UserHoc
@autobind
class LearningCamp extends Component {
    state = { 
        isNoMore: false,
        lists: [],
        isNoMoreSignUp: false,
        listsSignUp: [],
        tabIdx:0
    }
    page = {
        page: 1,
        size: 20
    }
    pageSignUp = {
        page: 1,
        size: 20
    }
    isLoading = false;
    async componentDidMount() {
        await this.initData();
        this.initSignUp()
        this.initShare();
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('ln-scroll-box');
    }
    async initData() {
        const { dataList = [] } = await listStudyCamp(this.page);
        if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
            this.setState({
                isNoMore: true
            })
        } else {
            this.page.page += 1;
        }
        this.setState({
            lists: [...this.state.lists, ...dataList]
        })
    }
    async initSignUp() {
        const { dataList = [] } = await listSignUp(this.pageSignUp);
        if(!!dataList && dataList.length >=0 && dataList.length < this.pageSignUp.size){
            this.setState({
                isNoMoreSignUp: true
            })
        } else {
            this.pageSignUp.page += 1;
        }
        this.setState({
            listsSignUp: [...this.state.listsSignUp, ...dataList]
        })
    }
    async loadNext(next) {
        const { isNoMore, isNoMoreSignUp, tabIdx} = this.state;
        if(this.isLoading || (isNoMore&&tabIdx==0)||(tabIdx==1&&isNoMoreSignUp)) return false;
        this.isLoading = true;
        if(tabIdx==0){
            await this.initData();
        }else{
            await this.initSignUp();
        }
        this.isLoading = false
        next && next();
    }
    initShare() {
        const { shareParams, shareConfig } = this.props;
        let title = '千聊女子大学';
        let desc = '优秀的人带学，和同频好友抱团成长。来看看女子大学的社团吧~';
        let shareUrl = fillParams({...shareParams , wcl:'university_share'}, location.href,['couponCode'])
        let imgUrl = 'https://img.qlchat.com/qlLive/business/AXNRY3KE-9IB4-QOS5-1559616232368-GS8RNFIJKSUW.png'
        // h5 分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });

        // app分享
        shareConfig({
            content: shareUrl,
            title: title,
            desc: desc,
            thumbImage: imgUrl,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        })
    }
    // Tab的变化
    async changeTab(idx) { 
        if(idx==this.state.tabIdx)return false
        await this.setState({tabIdx: idx}) 
        // 手动触发打曝光日志
        typeof _qla != 'undefined' && _qla.collectVisible();
        return true
    }
    
    toGroup(groupUrl,campId){
        if(!this.props.isQlchat){ 
            locationTo(groupUrl);
            return
        }
        if(this.props.handleAppSdkFun){
            this.props.handleAppSdkFun('sendSubscribeMessage', {
                sendSubscribeMessage: 'join_learning_camp',
                campId,
                callback: (res) => {
                    console.log(res)
                }
            })
        }
    }
    render() {
        const { isNoMore, lists ,isNoMoreSignUp, listsSignUp ,tabIdx} = this.state;
        const { isQlchat } = this.props
        return (
            <Page title="千聊学习营" className="ln-camp-box">
                <ScrollToLoad 
                    className={"ln-scroll-box ch-scroll-box"}
                    toBottomHeight={300}
                    disable={ (isNoMore&&tabIdx==0) }
                    noneOne={(tabIdx==1&&listsSignUp?.length==0)}
                    emptyMessage={tabIdx==1?"暂无报名记录":"暂无记录"}
                    loadNext={ this.loadNext }>
                    <HeadImg url={ require('./img/camp_pic_top.png') }/>
                    <TabNav 
                        tabs={[`9大学习营`,`报名记录`]} 
                        changeTab={this.changeTab} 
                        tabIdx={tabIdx}
                        logs={'community-detail-tab-nav'}/>    
                    {
                        tabIdx==0&&
                        <div className="ln-camp-cont">
                            { lists.map((item, index) => (
                                <CourseItem { ...item } idx={index} key={ index } sysTime={this.props.sysTime}/>
                            )) }
                        </div>
                    }   
                    {
                        tabIdx==1&&
                        <div className="ln-camp-bought-cont">
                            { listsSignUp.map((item, index) => (
                                <CourseBoughtItem { ...item } idx={index} key={ index } toGroup={this.toGroup}/>
                            )) }
                        </div>
                    }
                    { 
                        ((isNoMore&&tabIdx==0)||(isNoMoreSignUp&&tabIdx==1&&listsSignUp?.length>0)) && 
                        <Footer /> 
                    }
                </ScrollToLoad>
                { !isQlchat && <UniversityHome isUnHome /> }
            </Page>
        );
    }
}

const mapStateToProps = (state) => ({
    sysTime: getVal(state,'common.sysTime'),
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(LearningCamp);