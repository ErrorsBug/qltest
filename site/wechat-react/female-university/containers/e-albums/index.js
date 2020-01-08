import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ReactSwiper from 'react-id-swiper'
import Music from './containers/music'
import Flower from './containers/flower'
import StartInfo from './containers/start-info'
import StartSchool from './containers/start-school'
import AggregateRead from './containers/aggregate-read'
import RecentDevelopments from './containers/recent-developments'
import University from './containers/university'
import Community from './containers/community'
import Antistop from './containers/antistop'
import LastPage from './containers/last-page'
import { getAlbumInfo, getLikeList, getAlbumLikeStatus, getStudentInfo } from '../../actions/camp'
import { locationTo, getCookie } from 'components/util'
import { getMenuNode } from '../../actions/home';
import { getUrlParams, fillParams } from 'components/url-utils';
import $ from 'jquery';

@autobind
class EAlbums extends Component {
    state = {
        userInfo: { },
        loading: true,
        nowPageNum: 0,
        likeList: [],
        pageOne: true,
        pageTwo: false,
        pageThree: false,
        pageFour: false,
        pageFive: false,
        pageSix: false,
        pageSeven: false,
        flower: true,
        pageState: [],
        headImgUrl:'',
        username: '',
        adObj: null,
        isSelf: true,
    }
    get urlParams() {
        return getUrlParams('','') || {}
    }
    //用户id
    get shareUserId() {
        return getUrlParams('shareUserId', '')
    }
    componentDidMount = async () => {
        this.getCampAd();
        await this.getStudentInfo()
        this.getAlbumLikeStatus()
        let result = await getAlbumInfo({ currentUserId: this.shareUserId }) || {};
        this.getLikeList()
        this.getAlbumInfo(result)
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 2000);
    }
    // 常驻广告位
    async getCampAd() {
        const { menuNode } = await getMenuNode({ nodeCode: 'QL_AD_ALBUMS_CHANGZHU' })
        this.setState({
            adObj: menuNode || {}
        })
    }
    //获取点赞列表
    getLikeList = async () => {
        // businessId: this.shareUserId
        const result = await getLikeList({ businessId: this.shareUserId, page: 1, size: 4, offset: 0 }) || {}
        let likeList = result.likeList
        this.setState({
            likeList
        })
    }
    //获取相册本身用户信息
    getStudentInfo = async () => {
        const userId = getCookie("userId");
        const isSelf = (!this.shareUserId || userId == this.shareUserId)
        const {studentInfo} = await getStudentInfo({studentId: this.shareUserId})
        let headImgUrl = studentInfo.headImgUrl
        this.setState({
            headImgUrl,
            username: studentInfo.userName,
            isSelf: isSelf
        })
    }
    //获取点赞状态
    getAlbumLikeStatus = async (key) => {
        const { likeStatusList } = await getAlbumLikeStatus({ businessId: this.shareUserId }) || {}
        let pageState = likeStatusList
        this.setState({
            pageState
        })
    }
    //点赞修改状态
    setPageState = (val) => {
        let pageState = val
        this.setState({
            pageState
        })
    }
    //获取用户信息
    getAlbumInfo = async (result) => {
        let enterTime = new Date(result.enterTime)
        const month = enterTime.getMonth() + 1;
        const date = enterTime.getDate();
        const userInfo = {
            year: result.year,
            month,
            date,
            classNo: result.classNo,
            enterDay: result.enterDay,
            classmateNum: result.classmateNum,
            bookNum: result.bookNum,
            courseNum: result.courseNum,
            listenNum: result.listenNum,
            noteWordNum: result.noteWordNum,
            subjectNum: result.subjectNum,
            interestSubject: result.interestSubject,
            recentCampSignUpNum: result.recentCampSignUpNum,
            recentCampName: result.recentCampName,
            campNum: result.campNum,
            otherCampName: result.otherCampName,
            likedNum: result.likedNum,
            ideaNum: result.ideaNum,
            Barrage: result.hotTopicDtos,
            beatPercent: `${Number(result.beatPercent * 100).toFixed(1)}%`,
            keyWord: result.keyWord,
            knowledgeNum: result.knowledgeNum,
            learnTime: result.learnTime
        }
        this.setState({
            userInfo,
        })
    }
    //获取当前页码
    nowPageNum = (num) => {
        let nowPageNum = num
        this.setState({
            nowPageNum
        })
    }
    //当前页显示
    pageBlock = (pageNum) => {
        let pageOne = false
        let pageTwo = false
        let pageThree = false
        let pageFour = false
        let pageFive = false
        let pageSix = false
        let pageSeven = false
        let flower = true
        pageNum == 0 ? pageOne = true : pageOne = false
        pageNum == 1 ? pageTwo = true : pageTwo = false
        pageNum == 2 ? pageThree = true : pageThree = false
        pageNum == 3 ? pageFour = true : pageFour = false
        pageNum == 4 ? pageFive = true : pageFive = false
        pageNum == 5 ? pageSix = true : pageSix = false
        if (pageNum >= 6) {
            pageSeven = true
            flower = false
        }
        this.setState({
            pageOne,
            pageTwo,
            pageThree,
            pageFour,
            pageFive,
            pageSix,
            pageSeven,
            flower
        })
    } 
    // 处理跳转链接
    handleLink() {
        const { adObj } = this.state;
        if(adObj && adObj.keyA) {
            const url = fillParams({ campId: adObj.keyA, ...this.urlParams }, `${location.origin}/wechat/page/university-experience-camp`)
            locationTo(url)
        }
    }
    render() {
        let nowPage = this
        const { pageOne, pageTwo, pageThree, pageFour, pageFive, pageSix, pageSeven, flower, adObj, isSelf,
            pageState, userInfo, music, loading, likeList, total, nowPageNum, headImgUrl, username } = this.state
        const opt = {
            direction: 'vertical',
            autoplay: false,
            effect: 'fade',
            on: {
                slideChangeTransitionStart: function () {
                    nowPage.nowPageNum(this.activeIndex)
                    if (this.activeIndex === 0) {
                        nowPage.pageBlock(this.activeIndex)
                    } else if (this.activeIndex === 1) {
                        nowPage.pageBlock(this.activeIndex)
                    } else if (this.activeIndex === 2) {
                        nowPage.pageBlock(this.activeIndex)
                    } else if (this.activeIndex === 3) {
                        nowPage.pageBlock(this.activeIndex)
                    } else if (this.activeIndex === 4) {
                        nowPage.pageBlock(this.activeIndex)
                    } else if (this.activeIndex === 5) {
                        nowPage.pageBlock(this.activeIndex)
                    } else if (this.activeIndex === 6) {
                        nowPage.pageBlock(this.activeIndex)
                    } else if (this.activeIndex === 7) {
                        nowPage.pageBlock(this.activeIndex)
                    }
                }
            }
        };

       
        return (
            <Page title={'电子相册'} className="e-photo-album">
                {/* <Cover /> */}
                <Music />
                {!loading && flower && <Flower headImgUrl={ headImgUrl } handleLink={ this.handleLink } isSelf={ isSelf } likeList={likeList} nowPageNum={nowPageNum} pageState={pageState} setPageState={this.setPageState} getLikeList={this.getLikeList}/>}
                {loading && <StartInfo username={username || ''} />}
                {!loading && <ReactSwiper {...opt} className="bgc">
                    <div>{pageOne && <StartSchool userInfo={userInfo} pageOne={pageOne} />}</div>
                    <div>{pageTwo && <AggregateRead userInfo={userInfo} pageTwo={pageTwo} />}</div>
                    <div>{pageThree && <RecentDevelopments userInfo={userInfo} pageThree={pageThree} />}</div>
                    <div>{pageFour && <University pageFour={pageFour} />}</div>
                    <div>{pageFive && <Community userInfo={userInfo} pageFive={pageFive} />}</div>
                    <div>{pageSix && <Antistop userInfo={userInfo} pageSix={pageSix} />}</div>
                    <div>{pageSeven && (
                        <LastPage 
                            likeList={likeList} 
                            pageState={pageState} 
                            nowPageNum={nowPageNum} 
                            handleLink={ this.handleLink } 
                            setPageState={this.setPageState} 
                            getLikeList={this.getLikeList} 
                            headImgUrl={headImgUrl}/>
                    )}</div>
                </ReactSwiper>}
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(EAlbums);