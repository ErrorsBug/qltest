import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Link } from 'react-router'
import Page from 'components/page';
import BottomBar from './components/bottom-bar';
import PortalCom from '../../components/portal-com';
import { getTagCourseList, getWithChildren, getListCourseByTag, getStudentInfo , getUniversityStaticInfo} from '../../actions/home'
import { getUrlParams, fillParams } from 'components/url-utils';
import Picture from 'ql-react-picture';
import { userBindKaiFang, getSysTime } from "../../../actions/common";
import DoubleRotate from '../../components/double-rotate'
import { locationTo, getCookie } from 'components/util';
import { share } from 'components/wx-utils'; 

@autobind
class JoinUniversityCourses extends Component {
    state = {
        collegeList: [],
        keyE: [],
        totalCourse: 0,
        totalPrice: 0,
        idx: Number(getUrlParams('idx', '') || 0),
        curList: [],
        userInfo: null,
        isShowMaxTop: false,
        staticInfoObj:{}
    }
     

    componentDidMount() {
        this.initUserInfo();
        this.initData();
        this.bindAppKaiFang();
        this.handleScroll();
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('join-university-courses-page');
    }
    initShare() {  
        const params = { 
            wcl:'university_share', 
        }
        if(!Object.is(this.state.userInfo?.shareType, 'LEVEL_F')){
            params.userId=getCookie('userId')
        }
        let title = '千聊女子大学课单';
        let desc = '在吗，这里有一份超赞的大学课单，点击进来看看？';
        let shareUrl = fillParams(params,location.origin+location.pathname) 
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: 'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            shareUrl: shareUrl
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

    async initUserInfo(){
        const { data } =  await this.props.getSysTime();
        const { studentInfo } = await getStudentInfo();
        let isBuy = (!!data && !!studentInfo && data.sysTime < studentInfo.expireTime);
        this.setState({
            userInfo: isBuy ? studentInfo : {}
        },()=>{ 
            this.initShare();
        })
    }
    async initData() {
        const [staticInfoRes, collegeObj, courseObj ] = await Promise.all([
            getUniversityStaticInfo(),
            getWithChildren({nodeCode:"QL_NZDX_SY_XY"}),
            getTagCourseList({ page: 1, size: 1 })
        ])
        const collegeChildren = collegeObj?.menuNode?.children?.find((item,idx)=>{ 
            if(item.nodeCode==getUrlParams('nodeCode','')){
                this.setState({
                    idx
                })
                return true
            }
        })   
        const { nodeCode = '', keyE = '' } = collegeChildren || collegeObj?.menuNode?.children[this.state.idx] || {};
        this.handleCourse(nodeCode);  
        this.setState({
            staticInfoObj:staticInfoRes?.staticInfo ||{},
            collegeList: collegeObj?.menuNode?.children || [],
            totalCourse: courseObj.total || 0,
            totalPrice: collegeObj?.menuNode?.keyB || 0, 
            keyE: keyE && keyE.split('/') || []
        }, () => {
            this.box.style.height = this.scroll.getBoundingClientRect().height + 'px'
        })
    }
    onClickInstitute(idx, code){
        const { collegeList } = this.state;
        const { keyE = '' } = collegeList[idx]
        this.handleCourse(code);
        this.setState({
            idx: idx,
            keyE: keyE && keyE.split('/') || []
        })
    }
    async handleCourse(code) {
        const { dataList } = await getListCourseByTag({ page: 1,size: 100, code: code });
        this.setState({
            curList: dataList || []
        })
    }

    handleScroll() {
        const scrolNode = document.querySelector('.right-flex');
        scrolNode.addEventListener('scroll',(e) => {
            const { top, height } = this.box.getBoundingClientRect();
            if(top > 0){
                this.scroll.classList.remove('scroll')
                if(this.state.isShowMaxTop){
                    this.setState({
                        isShowMaxTop: false
                    })
                }
            } else {
                this.scroll.classList.add('scroll')
                if(!this.state.isShowMaxTop){
                    this.setState({
                        isShowMaxTop: true
                    })
                }
            }
        })
    }
    courseClick({topicId,channelId,courseId,courseType}){
        let url = '';
        if(!!topicId || Object.is(courseType, 'topic')) {
            url = `/wechat/page/topic-intro?topicId=${ topicId || courseId }&isUnHome=Y` 
        } else {
            url = `/wechat/page/channel-intro?channelId=${ channelId || courseId }&isUnHome=Y`
        }
        locationTo(url) 
    }
    render(){
        const { collegeList, totalCourse, totalPrice, idx, curList, keyE, userInfo, isShowMaxTop ,staticInfoObj} = this.state;
        return (
            <Page title="女子大学课单" className="flex-body join-university-courses-page">
                <PortalCom className={ `join-university-back ${ isShowMaxTop ? 'top' : '' }` }>
                    <div className="join-university-link on-log"
                        data-log-name="课单"
                        data-log-region="un-course-back"
                        data-log-pos="0"
                        onClick={ () => {
                            const url = !!userInfo && !!userInfo.userId ? '/wechat/page/university/home' : '/wechat/page/join-university'
                            locationTo(url)
                        } } >
                            <DoubleRotate 
                                frontImg={'https://img.qlchat.com/qlLive/business/KW2H5ZDB-SGBW-KTL2-1562638603965-G867Q7AD85SJ.png'}
                                backImg={'https://img.qlchat.com/qlLive/business/OTD45PE9-Q26I-UF6R-1562638599406-P45XWAI5C25F.png'}
                                />
                    </div>
                </PortalCom>
                <div className="flex-main-box">
                    <div className="right-flex">
                        <div className="juc-top">
                            <div className="juc-all-course">
                                <div className="juc-item">
                                    <div className="juc-num">{staticInfoObj.collegeNum||0}<span>个</span></div>
                                    <div className="juc-title">学院</div>
                                </div>
                                <div className="juc-item">
                                    <div className="juc-num">{staticInfoObj.subjectNum||0}<span>门</span></div>
                                    <div className="juc-title">学科</div>
                                </div>
                                <div className="juc-item">
                                    <div className="juc-num">{staticInfoObj.courseNum||0}<span>门</span></div>
                                    <div className="juc-title">累计课程</div>
                                </div>
                                <div className="juc-item">
                                    <div className="juc-num">{staticInfoObj.newCourseNum||0}<span>门</span></div>
                                    <div className="juc-title">近30天已更新</div>
                                </div>
                            </div>
                        </div>  
                        <div className="juc-main"> 
                            <div ref={ r => this.box = r }>
                                <div className="institute-lise-ul" ref={ r => this.scroll = r }>
                                    {
                                        collegeList.map((item,index)=>{
                                            return <div className="lise-item" key={`institute-${index}`} >
                                                <div 
                                                    className={ `lise-li ${index === idx ? 'active' : ''}` } 
                                                    onClick={()=>this.onClickInstitute(index, item.nodeCode)}>
                                                    {item.title}
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div> 
                            {
                                curList.map((item,index)=>{
                                    return (
                                        !!item.courseList && !!item.courseList.length &&
                                        (<div className="course-type-box" key={ index }>
                                            <div className="type-title">{item.name}</div>
                                            <ul key={`course-type-${index}`}>
                                                {
                                                    item.courseList && item.courseList.map((cos,idx)=>{
                                                        return (
                                                            <li key={`course-${idx}`}
                                                                data-log-name={ `课单列表` }
                                                                data-log-region="un-join-courses-lists"
                                                                data-log-pos={ idx }
                                                                onClick={()=>this.courseClick({...cos})}> 
                                                                <Picture className="un-join-img" src={cos.headImgUrl} resize={{ w: 108, h: 136 }} />
                                                                <div className="right-path">
                                                                    <div className="title">{cos.title}</div>
                                                                    <div className="intro">{cos.teacher?`${cos.teacher}-`:``}{cos.label}</div>
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>)
                                    )
                                })
                            }
                        </div>
                    </div>
                    
                </div>
                { !!userInfo && !userInfo.userId && (
                    <div className="flex-other jion-bottom">
                        <BottomBar courseNum = {totalCourse} price= { totalPrice } keyE={ keyE }  />            
                    </div>
                ) }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    userBindKaiFang,
    getSysTime
};

module.exports = connect(mapStateToProps, mapActionToProps)(JoinUniversityCourses);