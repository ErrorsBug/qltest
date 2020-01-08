import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';  
import { examIsJoin,getExamInfo,examQuestionList,saveExamResult} from '../../actions/exam';  
import { getStudentInfo ,initConfig} from '../../actions/home';   
import { userBindKaiFang } from "../../../actions/common";
import XiumiEditorH5 from 'components/xiumi-editor-h5/index';
import { locationTo,  htmlTransferGlobal ,getVal } from 'components/util';
import { getIsSubscribe, getQr } from "../../actions/common";
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils';
import PressHoc from 'components/press-hoc';
import { getUserInfo } from "../../actions/common";
import { createPortal } from 'react-dom';

@autobind
class CourseExam extends Component { 
    state = {  
        status:'',
        examInfo:{},
        playing:false,
        ufwExamQuestionDtoList:[],
        curIndex:'',
        curExamItem:{},
        saveList:[],
        qrcode:'',
        isSelect:false,
        optionList:[],
        curProcess:0
    }
    get withicon(){
        return getUrlParams('withicon','')
    }
    get examId(){
        return getUrlParams('examId','')
    }
    get rePlay(){
        return getUrlParams('rePlay','')
    }
    async componentDidMount() {  
        this.initData()
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-course-test-box');
    }
    async initData(){ 
        setTimeout(()=>{
            window.loading&&window.loading(true)  
        })
        const { status } = await examIsJoin({
            examId:this.examId
        }) 
        if(status=='Y'&&this.rePlay!='Y'){
            //判断是否关注
            //获取id，跳转结果
            this.initUniversityInfo()
            return
        }
        const { examInfo }=await getExamInfo({
            examId:this.examId
        }) 
        if(!examInfo){
            locationTo(`/wechat/page/university/course-exam-list`)
            return
        }
        if(examInfo.status=='N'||examInfo.status=='H'){
            window.loading&&window.loading(false)  
            window.toast(`该测评已过期，请参与其它测评`,2000)
            setTimeout(()=>{
                locationTo(`/wechat/page/university/course-exam-list`)
            },2000)
            return
        }
        let res = await this.props.getUserInfo();
        await this.setState({
            status:'N',
            examInfo,
            userInfo: getVal(res,'data.user',{})
        })
        this.initShare()
        setTimeout(()=>{
            window.loading&&window.loading(false)  
        })
 
    } 
    
    initShare() {
        const { examInfo,userInfo } = this.state 
        const params = {
            ch: "text",
            wcl:'university_share'
        }
        let title = `${userInfo.name}已完成测评，获得了专属课程推荐`;
        let desc = '赶紧点击生成自己的报告吧~';
        let shareUrl = fillParams(params,location.href,['rePlay'])    
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: examInfo.img||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            shareUrl: shareUrl
        });
    }
    //开始答题
    async startExam(){
        window.loading&&window.loading(true)  
        const { ufwExamQuestionDtoList }=await examQuestionList({
            examId:this.examId
        }) 
        await this.setState({
            ufwExamQuestionDtoList,
            playing:true
        }) 
        this.curExam()
        window.loading&&window.loading(false)  
    }
    /*
    *根据下标跳转
     */
    async curExam(index=0){  
        const {ufwExamQuestionDtoList} = this.state
        if(ufwExamQuestionDtoList[index]){ 
            if(!this.checkRelate(index)){ 
                if(!this.checkSave(index))return false 
                this.curExam(index+1)
                return false
            }
            const curExamItem=ufwExamQuestionDtoList[index]  
            await this.setState({
                curExamItem,
                curIndex:index
            })
             
            return 
        }

    }
    /**
     * 根据id跳转
     */
    jumpId(id){
        const {ufwExamQuestionDtoList} = this.state
        ufwExamQuestionDtoList.find((item,index)=>{
            if(item.id==id){ 
                this.curExam(index)
                return true
            }
        })
    }
    
    //选择
    selectExam(sub_index){
        const {ufwExamQuestionDtoList,curIndex} = this.state
        const curExamItem = ufwExamQuestionDtoList[curIndex]
        const {isSelect} = curExamItem.ufwExamOptionDtoList[sub_index]
        const list=curExamItem.ufwExamOptionDtoList.filter((item,index)=>{
            if(curExamItem.optionMost==1){
                item.isSelect='N' 
                return false
            }
            return item.isSelect=='Y'
        }) 
        if(isSelect=='Y'){
            let sort = curExamItem.ufwExamOptionDtoList[sub_index].sort
            curExamItem.ufwExamOptionDtoList[sub_index].isSelect='N'
            curExamItem.ufwExamOptionDtoList[sub_index].sort=0
            list.map((item,index)=>{
                if(item.sort>sort){
                    item.sort--
                }
            })
        }else{ 
            if(curExamItem.optionMost>1&&!this.checkItemMax(curExamItem))return false
            curExamItem.ufwExamOptionDtoList[sub_index].isSelect='Y'
            curExamItem.ufwExamOptionDtoList[sub_index].sort=list?(list.length+1):1
        }  
        const LastList=curExamItem.ufwExamOptionDtoList.filter((item,index)=>{
            return item.isSelect=='Y'
        })  
        this.setState({
            isSelect:!!LastList&&LastList?.length>=curExamItem.optionLeast
        })  
        this.curExam(curIndex) 

    }
    //上一题
    async curExamPre(index){ 
        const { ufwExamQuestionDtoList ,curIndex ,curProcess} = this.state
        const curExamItem = ufwExamQuestionDtoList[index]  
        const list=curExamItem.ufwExamOptionDtoList.filter((item,index)=>{
            return item.isSelect=='Y'
        })   
        ufwExamQuestionDtoList[curIndex].ufwExamOptionDtoList.map((item,index)=>{
            item.isSelect='N'
            item.sort=0
        })
        if(list?.length==0){ 
            this.curExamPre(index-1)
            return false
        }
        await this.setState({
            isSelect:true,
            curProcess:curProcess-1
        })  
        this.curExam(index)
    }
    //下一题
    async curExamNext(index){
        const {ufwExamQuestionDtoList ,curProcess} = this.state 
        const curExamItem = ufwExamQuestionDtoList[index] 
        if(!this.checkItem(curExamItem))return false 
        if(!this.checkJumpLink(curExamItem,curProcess))return false
        if(!this.checkSave(index))return false 
        await this.setState({
            isSelect:false,
            curProcess:curProcess+1
        })  
        this.curExam(index+1)
    }
    //保存
    async save(){  
        window.simpleDialog({
            title: null,
            msg: '当前题目已经是最后一题，确定?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '再想想~',
            className: 'exam-comfirm-dialog',
            onConfirm: async () => {
                window.loading&&window.loading(true)  
                const optionList=await this.initList() 
                const res=await saveExamResult({
                    examId:this.examId,
                    optionList
                })
                if(res?.state?.code==0){
                    this.initUniversityInfo()
                } 
            },
            onCancel: ()=>{ 
                this.setState({
                    isSelect:true
                }) 
            },
        }) 
    }
    checkSave(index){
        const {ufwExamQuestionDtoList} = this.state  
        if(index>=ufwExamQuestionDtoList.length-1){ 
            this.save()
            return false
        }  
        return true
    }
    async initList(){ 
        const {ufwExamQuestionDtoList} = this.state 
        const optionList=[]
        ufwExamQuestionDtoList.map((item,index)=>{
            item.ufwExamOptionDtoList.map((sub_item,sub_index)=>{
                if(sub_item.isSelect=='Y'){
                    optionList.push( {
                        id:sub_item.id,
                        questionId:sub_item.questionId,
                        sort:sub_item.sort
                    })
                } 
            }) 
        })  
        return optionList
    }
    //判断是否关联成立
    checkRelate(idx){
        const {ufwExamQuestionDtoList,saveList} = this.state  
        let hasIndex=true
        if(ufwExamQuestionDtoList[idx]?.relateOptionId){
            for(let i=0;i<idx;i++){
                ufwExamQuestionDtoList[i].ufwExamOptionDtoList.findIndex((item,index)=>{ 
                    if(item.id==ufwExamQuestionDtoList[idx].relateOptionId&&item.isSelect=='Y'){
                        hasIndex=false
                        return true
                    }
                })
            } 
            return !hasIndex
        }
        return true
    }
    //检查是否为空
    checkItem(curExamItem){  
        const list=curExamItem.ufwExamOptionDtoList.filter((item,index)=>{
            return item.isSelect=='Y'
        }) 
        if(list?.length<curExamItem.optionLeast){
            window.toast(`最少选${curExamItem.optionLeast||1}个哦`) 
            return false
        }  
        return true
    }
    
    //检查是否选择太多
    checkItemMax(curExamItem){  
        const list=curExamItem.ufwExamOptionDtoList.filter((item,index)=>{
            return item.isSelect=='Y'
        }) 
        if(list?.length>=curExamItem.optionMost){
            window.toast(`最多只能选${curExamItem.optionMost||1}个哦`) 
            return false
        } 
        return true
    }
    //检查是否跳题
    checkJumpLink(curExamItem,curProcess){  
        const isJump=curExamItem.ufwExamOptionDtoList.find((item,index)=>{
            if(item.isSelect=='Y'&&item.jumpQuestionId){ 
                this.jumpId(item.jumpQuestionId)
                this.setState({
                    isSelect:false,
                    curProcess:curProcess+1
                })  
                return true
            }
        })   
        return !isJump
    }
    //添加列表
    pushList(id){ 
        const {saveList} = this.state
        let i=0
        const hasIndex=saveList.findIndex((item,index)=>{
            i=index
            return item == id
        })
        if(hasIndex==-1){
            saveList.push(id)
        }else{
            saveList.splice(i,1)
        } 
 
    }
    
    
    async initUniversityInfo(){
        let res = await initConfig({businessType:'UFW_CONFIG_KEY'});
        this.setState({
            liveId: getVal(res, 'UFW_LIVE_ID', ''),
            appId: getVal(res, 'UFW_APP_ID', ''),
        },()=>{
            this.getNotiseQr();
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
        await this.bindAppKaiFang()  
        let subscribeResult = await this.props.getIsSubscribe({
            liveId: this.state.liveId,
            appId: this.state.appId
        }); 
        if(subscribeResult.data && subscribeResult.data.isFocusThree){  
            locationTo(fillParams({withicon:this.withicon,examId:this.examId},`${location.origin}/wechat/page/university-study-advice`,[])) 
            return
        } 
        let qrResult = await this.props.getQr({
            channel: 'universityCourseExam',
            pubBusinessId:this.examId,
            pubBusinessId2:this.withicon?1:0,
            liveId: this.state.liveId,
        });
        this.props.router.push(fillParams({},location.href,['rePlay'])  )
        this.setState({
            qrcode: (qrResult.data && qrResult.data.qrUrl) || '',
            status:'Y'
        });
        window.loading&&window.loading(false)  
    }
    //计算进度
    calProcess(curProcess,totalProcess){ 
        if(!totalProcess){ 
            return 0;
        }
        if(curProcess>=totalProcess){ 
            return (totalProcess-1)*100/totalProcess+'%' 
        }
        return curProcess*100/totalProcess+'%'
    }
    render(){
        const { status ,examInfo,playing,curExamItem={},curIndex,qrcode,isSelect ,curProcess } = this.state  
        return (
            <Page title={ examInfo.title||(status=='Y'?'查看课单':'') } className="un-course-test-box">
                {
                    status=='N'&&!playing&&
                    <div className="ct-start">
                        <div  className="ct-content-bg"> 
                            <XiumiEditorH5 content={ htmlTransferGlobal(examInfo?.adText) } /> 
                        </div> 
                        {
                            createPortal(
                                <div className="ct-btn-start on-log on-visible" 
                                    data-log-name={examInfo?.buttonText||'开始测验'}
                                    data-log-region="un-start-exam"
                                    data-log-pos="0" 
                                    onClick={this.startExam} style={{backgroundColor:examInfo?.buttonColor}}>{examInfo?.buttonText||'开始测验'}</div>
                                ,document.getElementById('app'))
                        }
                    </div>
                }
                {
                    status=='N'&&playing&&
                    <div  style={{backgroundImage:`url(${examInfo?.bg})` }} className="ct-playing">
                        {
                            curExamItem&& 
                            <div  className="ct-test-item on-visible" 
                                data-log-name={`大学测评-题目页-问题页-${curIndex+1}`}
                                data-log-region="un-play-exam"
                                data-log-pos={curIndex+1}  key={curExamItem.id}>
                                {
                                    examInfo?.questionNum&&
                                    <div className="ct-test-process">
                                        <span style={{width:this.calProcess(curProcess,examInfo?.questionNum),backgroundColor:examInfo?.themeColor }}></span>
                                    </div>
                                }
                                <div  className="ct-test-title">
                                    {curExamItem.content}
                                    <span  style={{color:examInfo?.themeColor}}>
                                        {
                                            curExamItem.optionLeast!=curExamItem.optionMost?
                                            (
                                                curExamItem?.questionType=='sort'||curExamItem?.questionType=='weightSort'?
                                                `（请选择${curExamItem.optionLeast}-${curExamItem.optionMost}项并排序)` 
                                                :
                                                `（请选择${curExamItem.optionLeast}-${curExamItem.optionMost}项)`
                                            )
                                            :
                                            `（请选择1项)`
                                        } 
                                    </span>
                                   
                                </div> 
                                <div className="ct-lists">
                                    {
                                        curExamItem?.ufwExamOptionDtoList?.length>0&&
                                        curExamItem?.ufwExamOptionDtoList.map((sub_item,sub_index)=>{

                                            return ( 
                                                <div className="ct-lists-item" key={sub_item.id}  onClick={()=>{this.selectExam(sub_index)}}>
                                                    {
                                                        sub_item.isSelect=='Y'? 
                                                            curExamItem?.questionType=='sort'||curExamItem?.questionType=='weightSort'?
                                                            <div  style={{backgroundColor:examInfo?.themeColor}} className={`ct-select sort`}>{sub_item.sort||''}</div>
                                                            :
                                                            <div  style={{backgroundColor:examInfo?.themeColor}} className={`ct-select on`}></div> 
                                                        :
                                                        <div className={`ct-select`}></div> 
                                                    }
                                                    
                                                    <div className="ct-wort">{sub_item.content}</div>
                                                </div>
                                            )
                                        })
                                    } 
                                </div>
                                <div className="ct-test-btn">
                                    {
                                        curIndex>0&&<div className="ct-btn ct-btn-pre on-log on-visible" 
                                        data-log-name={`大学测评-题目页-问题页-${curIndex+1}-上一题`}
                                        data-log-region="un-play-exam-prve"
                                        data-log-pos={curIndex+1} onClick={()=>this.curExamPre(curIndex-1)}>上一题</div>
                                    }
                                    <div className={`ct-btn ct-btn-next on on-log on-visible`} 
                                        data-log-name={`大学测评-题目页-问题页-${curIndex+1}-下一题`}
                                        data-log-region="un-play-exam-next"
                                        data-log-pos={curIndex+1} onClick={()=>this.curExamNext(curIndex)}  style={{backgroundColor: isSelect?examInfo?.themeColor:'#f7f7f7',color:isSelect?'#fff':'#999'}}>下一题</div>
                                </div>
                            </div>  
                        }
                    </div>
                }
                {
                    status=='Y'&&
                    <div className="ct-finish">
                        <div className="ct-finish-container on-visible" 
                            data-log-name={`关注页`}
                            data-log-region="un-play-exam-qrcode"
                            data-log-pos={curIndex+1}>
                                <PressHoc region="un-play-exam-qrcode-press">
                                    <img src={qrcode} /> 
                                </PressHoc>
                            
                        </div>
                    </div>
                }
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

module.exports = connect(mapStateToProps, mapActionToProps)(CourseExam);