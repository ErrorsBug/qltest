import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import Page from 'components/page'
import ScrollToLoad from 'components/scrollToLoad'
import { formatDate, imgUrlFormat, locationTo, formateToDay, timeAfterMixWeek } from 'components/util'
import { findDOMNode } from 'react-dom'
import { autobind } from 'core-decorators';
import { fixScroll } from 'components/fix-scroll';

import { BottomDialog } from 'components/dialog';

import Detect from 'components/detect';
import qrcode from './img/qrcode.png'

import CampAchievementCard from './join-card/join-card-painter'
import CampCourseCard from './course-card'

// 真正的action
import {
    getCampInfo,
    getCampCourseList,
    getCampCourse,
    getExceUserList,
    getUserInfo,
    setStuQuarterNum,
    markLearnTopic,
} from '../../actions/camp'


function mstp(state) {
    return {
        sysTime: state.common.sysTime,

        trainCampPo: state.camp.trainCampPo,
        recentCourse: state.camp.recentCourse,
    
        courseList: state.camp.courseList,
        courseNoMore: state.camp.courseNoMore,
        coursePage: state.camp.coursePage,

        stuQuarterNum: state.camp.stuQuarterNum,
    }
}

const matp = {
    getCampInfo,
    getCampCourseList,
    getCampCourse,
    getExceUserList,
    getUserInfo,
    setStuQuarterNum,
    markLearnTopic
}

@autobind
class Camp extends Component {

    constructor(props){
        super(props);
        this.campId = props.params.campId
    }

    state = {
        showQrCode: false,
        showCampCertificate: false,
        futureTimeLeft: 0,
        fs: 0,
        sutList: [],

        stuHistoryList: [],
        showHistoryList: false,

        // 入营证书卡的数据
        dataBase64: "",

        showCertificate: false,
    }
    data = {
        //是否禁用触摸
        isDisableMoveEvent: false,        
        initialTouchX: 0,
        initialTouchY: 0,
        initialDomLeft: 0,
        //初始滑动方向是否为垂直
        isVerticalMoveStart: true,
        //当前视图是否是第一张图
        isFirst: true,


    }
    componentDidMount() {
        this.initData()
        this.initTouchEvent()

        this.initStuList()
        
        this.initCard()
    }

    initCard = async () => {
        var time = 1515384000000
        var shownCard = localStorage.getItem('camp-certificate-shown')
        if(this.props.sysTime > time) {
            this.setState({
                showCertificate: true
            })
        }

        if (this.props.sysTime > time && !shownCard) {
            const userData = await this.props.getUserInfo();
            if (userData && userData.data.user && userData.data.user.name) {
                const cardDrawer = CampAchievementCard()
                const dataBase64 = await cardDrawer.call(cardDrawer, userData.data.user.name)
                this.setState({
                    dataBase64,
                    showCampCertificate: true,
                })
            }
        }
    }

    initStuList = async () => {
        let result;
        if(this.props.stuQuarterNum.current) {
            result = await this.props.getExceUserList(this.campId, this.props.stuQuarterNum.current)
        } else {
            result = await this.props.getExceUserList(this.campId)
        }
        if(this.props.stuQuarterNum.max || result.data && result.data.exceUsers) {
            var stuHistoryList = []
            if(this.props.stuQuarterNum.max || (result.data.exceUsers[0] && result.data.exceUsers[0].periodId)) {
                var campCount = this.props.stuQuarterNum.max || parseInt(result.data.exceUsers[0].periodId)
                for (let index = 1; index <= campCount; index++) {
                    stuHistoryList.push({
                        key: index,
                        content: '第' + index + '期',
                        show: true,
                    })
                }
                this.props.setStuQuarterNum({
                    current: result.data.exceUsers[0].periodId,
                    max: this.props.stuQuarterNum.max || result.data.exceUsers[0].periodId
                })
            }
            this.setState({ 
                sutList: result.data.exceUsers,
                stuHistoryList: stuHistoryList
            })
        }
    }

    tabStuList = async (key) => {
        this.setState({ 
            showHistoryList: false
        })
        const result = await this.props.getExceUserList(this.campId, key)
        console.log(result.data);
        if(result.data && result.data.exceUsers) {
            this.setState({ 
                sutList: result.data.exceUsers,
            })
        }
        this.props.setStuQuarterNum({
            current: key,
            max: this.props.stuQuarterNum.max
        })
    }

    initTouchEvent(){
        let touchDom = findDOMNode(this.refs.scrollWrap);
        touchDom.addEventListener('touchstart',this.touchStartHandler)
        touchDom.addEventListener('touchmove',this.touchMoveHandler)
        touchDom.addEventListener('touchend',this.touchEndHandler)
    }
    initData = async () => {

        let fs = Number(document.querySelector('html').style.fontSize.split('px')[0])
        this.setState({
            fs: fs,
        })

        if(!this.props.trainCampPo.id) {
            this.props.getCampInfo(this.campId)
        }
        if(!this.props.recentCourse.last || !this.props.recentCourse.future) {
            this.props.getCampCourse(this.campId)
        }
        if(this.props.courseList && this.props.courseList.length === 0) {
            await this.props.getCampCourseList(this.campId, {page: this.props.coursePage, size: 10})
            if (Detect.os.phone) {
                let touchDom = findDOMNode(this.refs.scrollWrap);        
                touchDom.classList.add('scroll-wrap-hidden');
            }
        }
    }


    cardGoToHomework = (homeworkIdList, isReply, topicId) => {
        if(isReply === 'Y') {
            window.toast("答疑课不用预习和写作业哦")
        } else {
            if(homeworkIdList && homeworkIdList[0]) {
                locationTo(`/wechat/page/homework/details?id=${homeworkIdList[0]}&topicId=${topicId}`)
            } else {
                window.toast("该课程暂无课后作业")
            }
        }
    }
    cardGoToPretest = (topicId, isReply) => {
        if(isReply === 'Y') {
            window.toast("答疑课不用预习和写作业哦")
        } else {
            locationTo('/wechat/page/camp-preview?topicId=' + topicId)
        }
    }


    showQrCodePop = () => {
        this.setState({
            showQrCode: true
        })
    }
    hideQrCodePop = (e) => {
        if(e.target.className === 'qrCode-back') {
            this.setState({
                showQrCode: false
            })
        }
    }

    showCampCertificate = async () => {
        if (this.state.dataBase64) {
            this.setState({
                showCampCertificate: true
            })
        } else {
            const userData = await this.props.getUserInfo();
            if (userData && userData.data.user && userData.data.user.name) {
                const cardDrawer = CampAchievementCard()
                const dataBase64 = await cardDrawer.call(cardDrawer, userData.data.user.name)
                this.setState({
                    dataBase64,
                    showCampCertificate: true,
                })
            }
        }
    }
    
    hideCampCertificate = (e) => {
        if(e.target.className !== 'camp-certificate') {
            this.setState({
                showCampCertificate: false
            })
            localStorage.setItem('camp-certificate-shown', 'Y')
        }
    }

    touchStartHandler(e){
        let tar = e.targetTouches[0];
        this.data.initialTouchX = tar.pageX;
        this.data.initialTouchY = tar.pageY;
        let touchDom = findDOMNode(this.refs.scrollWrap);        
        touchDom.classList.add('scroll-wrap-hidden');
    }
    touchMoveHandler(e){
        if(!this.data.isDisableMoveEvent){
            let currentX = e.targetTouches[0].pageX,
                currentY = e.targetTouches[0].pageY,
                moveX = currentX - this.data.initialTouchX,
                moveY = currentY - this.data.initialTouchY,
                moveDom = findDOMNode(this.refs.scrollWrap);
            // X轴上滑动
            if(Math.abs(moveX) > Math.abs(moveY)){
                if(this.data.isFirst){
                    if(moveX < 0){
                        let position = moveX/this.state.fs;
                        if(position > -9.1) {
                            moveDom.style.transform = 'translate3d(' + moveX + 'px,0,0)'
                            e.preventDefault()
                        }           
                    }
                }
                else{
                    if(moveX > 0){
                        let position = -9.1*this.state.fs + moveX;                       
                        if(position < 0){                           
                            moveDom.style.transform = 'translate3d(' + position + 'px,0,0)'
                            e.preventDefault()
                        }           
                    }
                }
                this.data.isVerticalMoveStart = false
            }else {
                // 初始滑动方向为垂直则禁用滑动
                if(this.data.isVerticalMoveStart){                
                    this.data.isDisableMoveEvent = true
                }else {
                    e.preventDefault()
                }
            }
        }
    }
    touchEndHandler(e){
        let currentX = e.changedTouches[0].pageX;
        let moveDom = findDOMNode(this.refs.scrollWrap);
        //防止点击事件触发滑动效果
        if(!this.data.isDisableMoveEvent && currentX && Math.abs(currentX - this.data.initialTouchX) > 5){
            let moveX = (currentX - this.data.initialTouchX)/this.state.fs;
            if(moveX < -0.8){
                this.moveAnimation(true)
            }else if(moveX > 0.8){
                this.moveAnimation(false)
            }else {
                this.moveAnimation(-9.1*this.state.fs)
            }
        }
        this.data.isVerticalMoveStart = true;
        setTimeout(()=>{
            moveDom.style.transition = '';
            this.data.isDisableMoveEvent = false
        },250)
    }
    moveAnimation(flag){
        //动画中禁用touch事件
        this.data.isDisableMoveEvent = true
        let moveDom = findDOMNode(this.refs.scrollWrap);
        moveDom.style.transition = 'transform ease .25s';
        if(typeof flag === "boolean"){
            if(flag){
                moveDom.style.transform = 'translate3d(' + -9.1*this.state.fs + 'px,0,0)'
                this.data.isFirst = false
            }
            else {
                moveDom.style.transform = 'translate3d(0,0,0)'
                this.data.isFirst = true              
            }
        }else {
            moveDom.style.transform = 'translate3d(' + flag + 'px,0,0)'
        }
    }

    gotoCourseHandle = async (style, topicId) => {
        await this.props.markLearnTopic(topicId)
        
        if (style == "video") {
            locationTo('/topic/details-video?topicId=' + topicId)
        } else {
            locationTo('/topic/details?topicId=' + topicId)
        }
    }

    showHistoryList = () => {
        this.setState({
            showHistoryList: true
        })
    }
    hideHistoryList = () => {
        this.setState({
            showHistoryList: false
        })
    }

    render() {
        const trainCampPo = this.props.trainCampPo

        const recentCourse = this.props.recentCourse

        const renderBannerWrap = (recentCourse) => {

            return (    
                <div className="scroll-wrap" ref="scrollWrap">
                    {
                        recentCourse[0] && <CampCourseCard 
                            courseItem={recentCourse[0]}
                            unopenFunc={this.unopenFunc}
                            sysTime={this.props.sysTime}
                            cardGoToHomework={this.cardGoToHomework}
                            cardGoToPretest={this.cardGoToPretest}
                            gotoCourseHandle={this.gotoCourseHandle}
                        />
                    }
                    {
                        recentCourse[1] && <CampCourseCard 
                            courseItem={recentCourse[1]}
                            unopenFunc={this.unopenFunc}
                            sysTime={this.props.sysTime}
                            cardGoToHomework={this.cardGoToHomework}
                            cardGoToPretest={this.cardGoToPretest}
                            gotoCourseHandle={this.gotoCourseHandle}
                        />
                    }
                </div>
            )
        }

        return (
            <Page title={trainCampPo.name} className='camp-page'>
                <div className="header">
                    <div className="left">
                        <div className="icon-list"></div>
                        <div className="des">学习进度</div>
                        <div className="process"> <var className='cur'>{trainCampPo.learnTopicNum || 0}</var>/<var>{trainCampPo.topicNum}</var> </div>
                        {this.state.showCertificate &&  <div className="certificate" onClick={this.showCampCertificate}></div>}
                    </div>
                    <div className="right">
                        <div className="con" onClick={() => {locationTo('/wechat/page/camp-history?campId=' + this.campId)}}><div className="icon-history"></div> <div className="des">历史</div></div>
                        <div 
                            className="con on-log" 
                            onClick={this.showQrCodePop}
                            data-log-reagin="camp"
                            data-log-name="join-camp-wx-group"
                        >
                        <div className="icon-group"></div> <div className="des">入群</div></div>
                    </div>
                </div>

                

                <div className="main-con" ref="campContainer">
                    <div className="course-con">
                        {renderBannerWrap(recentCourse)}
                    </div>

                    <div className="student-con">
                        <h1 className="title-con">
                            <div className="title">优秀学员</div>
                            <div className="his-session" onClick={this.showHistoryList}> 第{this.props.stuQuarterNum.current === 0 ? 1 : this.props.stuQuarterNum.current}期 <span className="icon_enter"></span></div>
                        </h1>
                        {
                            !!this.state.sutList.length && <div className="stu-list-wrap">
                                {
                                    this.state.sutList.map((item, index) => (
                                        <div className="stu-item" key={"excu-stu-" + item.id} onClick={() => {this.props.router.push('/wechat/page/camp-achievement-card?id=' + item.id)}}>
                                            <img className='head-img' src={imgUrlFormat(item.headImage, '?x-oss-process=image/resize,m_fill,limit_0,h_128,w_128', '/128')} alt="" />
                                            <div className="name">{item.name}</div>
                                        </div>
                                    )) 
                                }
                            </div>
                        }
                        {
                            !this.state.sutList.length && <div className="stu-empty">
                                <div className="stu-empty-img"></div>
                                <p className="empty-title">虚位以待</p>
                                <p className="empty-des">热爱学习的人理应得到聚光灯下的赞美</p>
                            </div>
                        }
                        
                    </div>
                </div>

                {
                    this.state.showQrCode && <div className='qrCode-back' onClick={this.hideQrCodePop}>
                        <div className="qrCode-con">
                            <img className='qr-img' src={qrcode}  alt=""/>
                            <div className="qr-des"> 1.扫码添加千聊小管家 <br/> 2.添加好友后，在对话聊天框中回复 <var>【变美】</var>加入训练营社群，随时随地为你答疑解惑 </div>
                        </div>
                    </div>
                }

                {
                    this.state.showCampCertificate && <div className="camp-certificate-bg" onClick={this.hideCampCertificate}>
                        <div className="icon_cancel"></div>
                        <img className='camp-certificate' src={this.state.dataBase64} alt=""/>
                    </div>
                }


                <BottomDialog
                    show={this.state.showHistoryList}
                    theme={'scroll'}
                    title={'往期优秀学员'}
                    titleLabel={"训练营"}
                    items={this.state.stuHistoryList}
                    close={true}
                    onClose={this.hideHistoryList}
                    onItemClick={this.tabStuList}
                >
                </BottomDialog>
            </Page>
        );
    }
}



export default connect(mstp, matp)(Camp);
