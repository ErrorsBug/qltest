import React, { Component, Fragment } from 'react';
import { autobind  } from 'core-decorators';
import PressHoc from 'components/press-hoc';  
import {  
    getWithChildren } from '../../actions/home';
import { locationTo } from 'components/util'; 
import Picture from 'ql-react-picture'

@autobind
export default class extends Component{
    state={
        isShow:false,
        curItem:{}
    }
    componentDidMount(){ 
        setTimeout(()=>{
            this.getPicture()
        },300)
    }
    async getPicture(){

        const data= await getWithChildren({ nodeCode:this.props.nodeCode }) 
        const time=(new Date()).getTime() 
        if(data?.menuNode?.children){ 
            data?.menuNode?.children.find((item,index)=>{
                if(!this.props.nextCode||this.props.nextCode==item.keyC){ 
                    //大于开始时间
                    let startTime=item.keyG?time>(new Date(item.keyG)).getTime() :true
                    //小于结束时间
                    let endTime=item.keyH?time<(new Date(item.keyH)).getTime() :true
                    if(startTime  && endTime&&item.keyB ){
                        if(item.keyE=='minute'){
                            let localExamDialogTime=localStorage.localExamDialogTime?JSON.parse(localStorage.localExamDialogTime):{} 
                            if(!localExamDialogTime||!localExamDialogTime[item.nodeCode]||(time-localExamDialogTime[item.nodeCode])>item.keyF*(1000*60)){ 
                                this.setState({
                                    isShow:true,
                                    curItem:item
                                },()=>{
                                    localExamDialogTime[item.nodeCode]=time
                                    localStorage.localExamDialogTime=JSON.stringify(localExamDialogTime)
                                })
                            }
                        }
                        if(item.keyE=='session'){
                            let localExamDialogNum=localStorage.localExamDialogNum?JSON.parse(localStorage.localExamDialogNum):{}
                            let sessionExamDialogNum=sessionStorage.examDialogNum?JSON.parse(sessionStorage.examDialogNum):{} 
                            if(!sessionExamDialogNum||!sessionExamDialogNum[item.nodeCode]){
                                sessionExamDialogNum[item.nodeCode]='Y'
                                localExamDialogNum[item.nodeCode]=localExamDialogNum[item.nodeCode]?parseFloat(localExamDialogNum[item.nodeCode])+1:1 
                                sessionStorage.examDialogNum=JSON.stringify(sessionExamDialogNum)
                                localStorage.localExamDialogNum=JSON.stringify(localExamDialogNum)  
                                if(item.keyF<=1||localExamDialogNum[item.nodeCode]%item.keyF==1)
                                {
                                    this.setState({
                                        isShow:true,
                                        curItem:item
                                    },()=>{
                                        
                                    })
                            }
                            }
                        } 
                        return true
                    }
                
                }
            })
        }
    }
    render() {
        const { isShow,curItem } = this.state 
        const { close, url,  className = '', onPress, isQlchat,region } = this.props; 
        return (
            <Fragment>
                 {isShow&&<div className={ `course-test-dialog-box on-visible ${ className }` }>
                    <div className="course-exam-dialog-img"> 
                        <div className="course-exam-dialog-pic">
                            
                            <div className="on-log on-visible"
                                data-log-name={curItem?.title}
                                data-log-region={region}
                                data-log-pos="0"
                                onClick={ ()=>{curItem?.keyD&&locationTo(curItem?.keyD)} }>
                                <Picture src={  curItem?.keyB  } resize={{w:650,h:880}}/>
                            </div>  
                            <div className="btn-course-exam-dialog-close on-log on-visible"
                                data-log-name={curItem?.title}
                                data-log-region={region+'-close'}
                                 onClick={ ()=>{this.setState({isShow:false})} }></div>
                        </div>
                    </div>
                </div>}
            </Fragment>
            
        )
    } 
}
