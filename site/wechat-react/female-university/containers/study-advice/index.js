import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import { createPortal } from 'react-dom'
import Page from 'components/page';  
import { getExamResult,examIsJoin,getExamInfo } from '../../actions/exam';   

import Picture from 'ql-react-picture'
import {
    locationTo,
    htmlTransferGlobal,
    getVal 
  } from 'components/util'; 
  import { share } from 'components/wx-utils';
  import { getUrlParams, fillParams } from 'components/url-utils';
  import JoinHoc from '../../components/join-dialog/join-hoc';
  import LearnInfo from './components/learn-info';
  import SaText from './components/sa-text'; 
  import { isQlchat } from 'components/envi'
  import appSdk from 'components/app-sdk'
  import { getIsSubscribe, getQr } from "../../actions/common";
  import { userBindKaiFang } from "../../../actions/common";
  import { getStudentInfo } from '../../actions/home';   
  import { getUserInfo } from "../../actions/common";
import MiddleDialog from 'components/dialog/middle-dialog';
import DialogPayment  from '../../components/dialog-payment';

//标题
const SaTitle=({title,tipText})=>{
    return <div className="sa-title-container">
       <div className="sa-title"> {title}</div>
       <div className="sat-tip">
           {
               tipText
           }
        </div> 
    </div>
}
//阶段标题
const SaStepTitle=({title,img})=>{
    return <div className="sa-step-title-container">
        <img src={img} />
        <div className="sa-step-title"> {title}</div> 
    </div>
}
//课程
const CourseItem = ({ courseId,headImgUrl, idx,learnNum, title, label,courseType, ...otherProps }) => {  
    return (
        <div className="sa-class-item on-log on-visible" 
            data-log-name={ title }
            data-log-region="un-sa-item"
            data-log-pos={ idx } >
            <div className="sa-pic">
                <Picture src={ headImgUrl  } resize={{w:172,h:196}}/>
            </div>
            <div className="sa-content">
                <h4>{ title||'' }</h4>
                <div className="sa-decs">{label||''}</div> 
                <LearnInfo 
                    idx={idx} 
                    courseType={ courseType }
                    courseId={ courseId }
                    id={ courseId } 
                    region="un-course-exam-join" 
                    { ...otherProps } /> 
            </div>
        </div>
    )
}

//一键添加
const SaAddBtn=({isStudent,showJoinDialog,...otherProps})=>{
    return ( 
        <div className="sa-add-btn">
            {
                !isStudent?
                <div className="saa-begin on-log on-visible" 
                    data-log-name={`一键全场解锁`}
                    data-log-region="un-add-all-lock"
                    data-log-pos="0" onClick={showJoinDialog}>一键全场解锁</div>
                :
                otherProps.delList.length==0?
                <div className={`saa-finish ${otherProps.isAddAll?'once':''}`}>已全部添加</div>
                :
                <div className="saa-begin on-log on-visible" 
                data-log-name={`一键添加`}
                data-log-region="un-add-all"
                data-log-pos="0" onClick={otherProps.addAll}>一键添加</div>
            }
        </div>
        )
}
//课程列表
const SaAddContainer=({isStudent,categoryList,...otherProps})=>{
    return ( 
        <div className="sa-add-container">
            {
                categoryList?.map((item,index)=>{
                    return ( 
                        <div key={index}> 
                            <SaStepTitle  
                                title={item.name}
                                img={
                                    index==0?
                                    `https://img.qlchat.com/qlLive/business/VUKF4OX6-IUNY-DUZY-1564386380741-GQ7YWO5YEOQ3.png`
                                    :index==1?
                                    `https://img.qlchat.com/qlLive/business/LD9OKJYE-AOOC-82J7-1564387261067-7BLO2BRLW1IT.png`
                                    :index==2?
                                    `https://img.qlchat.com/qlLive/business/GDUT7BXL-8AC7-69VQ-1564387292165-6YPOLJPD6NSE.png`
                                    :''
                                }
                            />
                            <div className='un-sa-list'>
                                { item?.courseList&&item?.courseList.length>0&&item?.courseList?.map((sub_item, sub_index) => (
                                        <CourseItem
                                            { ...sub_item }
                                            key={ sub_index }     
                                            idx={ sub_index } 
                                            isStudent={isStudent}
                                            {...otherProps}/>
                                    )) }
                            </div>
                        </div>
                    )
                })
            } 
        </div>
    )
}

//底部浮窗
const SaBottom=({isStudent,reExam,showJoinDialog,joinArr,btText,btTextColor,btColor,btUrl})=>{
    const withicon = getUrlParams('withicon','') 
    const toList = ()=>{ 
        window.simpleDialog({
            title: null,
            msg: '确定选好课程了?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '再想想',
            className: 'my-study-advice-delete-dialog',
            onConfirm: async () => {
                handleGoPage()
                // 手动触发打点日志 
                typeof _qla != 'undefined' && _qla('click', {
                    region:'un-exam-to-list-confirm',
                });
                
            },
            onCancel: ()=>{
                // 手动触发打点日志 
                typeof _qla != 'undefined' && _qla('click', {
                    region:'un-exam-to-list-cancel',
                });
                 
            },
        }) 
    }
    
    // 跳转链接
    const handleGoPage = ()=>{  
        if(isQlchat()){
            appSdk.linkTo(`dl/university/my-course-list`)
        } else {
            locationTo('/wechat/page/university/my-course-list')
        }
    } 
    return (  
        !isStudent&&!isQlchat()&&!!withicon&&btText&&btUrl?
        <div className="sa-bottom withicon"> 
            <div className="sa-btn-icon-left on on-log on-visible" 
                data-log-name={btText}
                data-log-region="un-exam-to-experience"
                data-log-pos="0" 
                style={{
                    color:btTextColor,
                    backgroundColor:btColor
                }}
                onClick={()=>{btUrl&&locationTo(btUrl)}}>{btText}</div>  
            <div className="sa-btn-icon-right on on-log on-visible" 
                data-log-name={`加入女子大学，解锁所有特权`}
                data-log-region="un-exam-to-show-poster"
                data-log-pos="0" onClick={showJoinDialog}>加入女子大学解锁所有特权</div>  
        </div> 
        :
        !isStudent&&!isQlchat()?
        <div className="sa-bottom"> 
            <div className="sa-btn sa-btn-right on on-log on-visible" 
                data-log-name={`加入女子大学，解锁所有特权`}
                data-log-region="un-exam-to-show-poster"
                data-log-pos="0" onClick={showJoinDialog}>加入女子大学，解锁所有特权</div>  
        </div> 
        :
        <div className="sa-bottom"> 
            <div className="sa-btn sa-btn-left on-log on-visible" 
                    data-log-name={`重新测试`}
                    data-log-region="un-exam-again"
                    data-log-pos="0" onClick={reExam}>重新测试</div>
            {
                joinArr.length>0?
                <div className="sa-btn sa-btn-right on on-log on-visible" 
                data-log-name={`已选好，前往课表`}
                data-log-region="un-exam-to-list"
                data-log-pos="0" onClick={toList}>已选好，前往课表</div>      
                :
                <div className="sa-btn sa-btn-right">请选择课程</div>      
            }
        </div>
    )
}


@JoinHoc
@autobind
class StudyAdvice extends Component { 
    state = { 
        examResult: false,
        isAuto:false,
        isAll:true, 
        isAddAll:false,
        isFocus:false,
        isStudent:undefined,
        isShowJoinDialog:false,
        examInfo:{}
    }
    
    get withicon(){
        return getUrlParams('withicon','')
    } 
    get examId(){ 
        return getUrlParams('examId','')
    }
    async componentDidMount() { 
        this.bindAppKaiFang();
        setTimeout(()=>{
            window.loading&&window.loading(true)   
        })
        const { examResult } = await getExamResult({
            examId:this.examId
        }) 
        if(!examResult){  
            const { status } = await examIsJoin({
                examId:this.examId
            }) 
            if(status=='N'){ 
                locationTo(fillParams({withicon:this.withicon,examId:this.examId},`${location.origin}/wechat/page/university/course-exam`,[]))
                return
            }
            window.toast(`暂无数据`,2000) 
        }

        const {studentInfo} = await getStudentInfo()  
        const { examInfo }=await getExamInfo({
            examId:this.examId
        })  
        await this.setState({
            examInfo,
            examResult,
            isStudent: !!studentInfo?.classNo 
        })
        
        this.handerAddLL()
        setTimeout(()=>{
            window.loading&&window.loading(false)  
            this.initShare()  
            // 绑定非window的滚动层 
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-study-advice-box');
        })
    }
    
    async initShare() {
        const res = await this.props.getUserInfo();
        const userInfo= getVal(res,'data.user',{})
        const { examInfo }= this.state
        const params = {
            ch: "text",
            wcl:'university_share',
            withicon:this.withicon
        }
        let title = `${userInfo.name}已完成测评，获得了专属课程推荐`;
        let desc = '赶紧点击生成自己的报告吧~';
        let shareUrl = fillParams(params,`${location.origin}/wechat/page/university/course-exam?examId=${this.examId}`)   
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: examInfo?.img||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
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
    async getNotiseQr(){
        setTimeout(()=>{
            window.loading&&window.loading(true)  
        })
        let subscribeResult = await this.props.getIsSubscribe();
        if(subscribeResult.data && subscribeResult.data.isFocusThree){  
            this.setState({
                isFocus:true
            })  
            return
        } 
        locationTo(`/wechat/page/university/course-exam?examId=${this.examId}`)  
    }
    handerAddLL(){
        const {categoryList=[]}=this.state.examResult||{}
        categoryList?.map((item,index)=>{
            item.courseList?.map((sub_item,sub_index)=>{
                if(sub_item.isJoin=='N'){
                    this.props.delList.push({
                        businessId:sub_item.courseId,
                        businessType:sub_item.courseType
                    })
                }
                if(sub_item.isJoin=='Y'){
                    this.props.joinArr.push(sub_item.courseId) 
                }
            })
        }) 
        this.setState({
            examResult:this.state.examResult
        })
    }
    
    reExam = ()=>{
        window.simpleDialog({
            title: null,
            msg: '确定重新测试吗?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '点错了',
            className: 'my-study-advice-delete-dialog',
            onConfirm: async () => {
                locationTo(fillParams({withicon:this.withicon,examId:this.examId,rePlay:'Y'},`${location.origin}/wechat/page/university/course-exam`,[]))
                // 手动触发打点日志 
                typeof _qla != 'undefined' && _qla('click', {
                        region:'un-exam-again-confirm',
                }); 
            },
            onCancel: ()=>{
                // 手动触发打点日志 
                typeof _qla != 'undefined' && _qla('click', {
                        region:'un-exam-again-cancel',
                });
                 
            },
        }) 
    }
    
    joinTip  (){
        window.simpleDialog({
            title: null,
            msg: '加入女子大学，解锁更多测评特权',
            buttons: 'cancel-confirm',
            confirmText: '查看所有特权',
            cancelText: '',
            className: 'my-study-advice-join-tip',
            onConfirm: async () => {
                this.showJoinDialog()
                // 手动触发打点日志 
                typeof _qla != 'undefined' && _qla('click', {
                        region:'un-exam-again-confirm',
                });  
            },
            onCancel: ()=>{
                // 手动触发打点日志 
                typeof _qla != 'undefined' && _qla('click', {
                        region:'un-exam-again-cancel',
                });
                 
            },
        }) 
    }
    showJoinDialog(){
        this.setState({
            isShowJoinDialog:true
        })
    }
    close(){
        this.setState({
            isShowJoinDialog:false
        })
    }
    render(){
        const { examResult ,  isStudent,isShowJoinDialog ,examInfo } = this.state
        const { ...otherProps } = this.props     
        return (
            <Page title={ `学习建议` } className="un-study-advice-box">
                <div className="sa-main">
                    <div className="sa-top-img">
                        <Picture src={ examResult?.img||''  } resize={{w:750,h:320}}/> 
                    </div>
                    <div className="sa-text"> 
                        <div className="sa-status success"></div>
                        <SaTitle 
                            title="学习建议"
                            tipText={
                                <div> 
                                    根据你的测试结果 <br/>
                                    建议你在后面的学习中，重点学习以下方面知识
                                </div>
                            }/>
                        
                        <SaText {...examResult}/>

                    </div>
                    {
                        examResult?.categoryList&&examResult?.categoryList?.length>0&&
                        <div className="sa-add-course"> 
                            <SaTitle title="专属课程表"
                                tipText={
                                    <div> 
                                        班主任已为你推荐专属课单，选择符合你预期的课程吧
                                    </div>
                                }/>
                            <SaAddBtn isStudent={isStudent} showJoinDialog={this.showJoinDialog} {...otherProps}/>
                            <SaAddContainer  isStudent={isStudent} showJoinDialog={this.showJoinDialog} {...otherProps}  {...examResult}/>
                            
                            {
                                !isStudent&&
                                <div className="un-other-bottom">
                                    <span className="un-ob-repaly on-log on-visible" 
                                        data-log-name={`重新测试`}
                                        data-log-region="un-exam-again"
                                        data-log-pos="0"  onClick={this.joinTip}>重新测试</span> 
                                    <span className="un-ob-line">|</span>
                                    <span className="un-ob-intro on-log on-visible" 
                                        data-log-name={`查看女子大学完整介绍`}
                                        data-log-region="un-exam-to-join"
                                        data-log-pos="0"  onClick={()=>{locationTo(`/wechat/page/join-university?ch=text`)}}>查看女子大学完整介绍</span>
                                </div>
                            }
                        </div>
                    }    
                </div>
                {
                    isStudent!==undefined&&<SaBottom {...examInfo} isStudent={isStudent} {...otherProps} reExam={this.reExam} showJoinDialog={this.showJoinDialog}/>
                } 
                <MiddleDialog
                    show={isShowJoinDialog  }
                    onClose={this.close}
                    className="sa-join-dialog"
                    >
                        <span className="sa-join-close" onClick={this.close}></span>
                        {
                            !isQlchat()?
                            <div className="sa-join-dialog-container"> 
                                <DialogPayment
                                    isExam={ true }
                                >
                                    <div className="sa-join-btn"></div>
                                </DialogPayment>
                            </div>
                            :
                            <div className="sa-join-dialog-container sa-app"></div>
                        }
                       
                        
                    </MiddleDialog>
                                
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    getQr,
    getIsSubscribe, 
    userBindKaiFang,
    getUserInfo
};
 
module.exports = connect(mapStateToProps, mapActionToProps)(StudyAdvice);