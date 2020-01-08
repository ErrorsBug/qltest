import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators'; 
import Footer from '../../../../components/footer';
import CardItem from '../../../../components/card-item';
import { formatMoney, locationTo ,formatDate, imgUrlFormat} from 'components/util';
import { caseList } from  "../../../../actions/flag" 

@autobind
export default class extends PureComponent{
    state = { 
        activeIndex:0
    }
    componentDidMount = () => {
    }; 
    componentDidUpdate = (preProps)=>{
        if(preProps.flagCardList != this.props.flagCardList){
            if(this.props.flagCardList.length==0){
                this.setState({
                    activeIndex:1
                })
            }
        }
    } 
    activeChange(i){
        this.setState({activeIndex:i})
    }
    sumMoney(flagList){ 
        let sum =0;
        flagList.map((item,index)=>{
            sum+=parseFloat(item.money)
        })
        return sum
    }
    
    //是否今天
    isToday(str) {
        if (new Date(str).toDateString() === new Date().toDateString()) {
            return true
        }  
        return false
    } 

    onClickViewPic(index, source){
        let sourceArray = source.map((item,i)=>{
            return item.url;
        });
        window.showImageViewer(sourceArray[index],sourceArray);
    }
    addClick(){
         
    }

    render() { 
        const { flagList=[] ,flagCardList=[] ,cardDate ,cardStatus,isOther} = this.props 
        const { activeIndex   } = this.state;
        const time =(new Date() ).getTime() 
        return (
            <Fragment>
               <div className="fh-list"> 
                    <div className={`fhl-content ${!(time<cardDate||cardStatus=='N')?"none":""}`}>
                        <div className="fhl-tab">
                            <div  
                                data-log-name='学习笔记'
                                data-log-region="un-flag-mine-learn"
                                data-log-pos="0"
                                onClick={()=>{this.activeChange(0)}} className={`on-log on-visible fhl-item${activeIndex==0?" on":""}`} >
                            学习笔记
                            </div>
                            <div 
                                data-log-name='我的见证人'
                                data-log-region="un-flag-mine-helper"
                                data-log-pos="0"
                                onClick={()=>{this.activeChange(1)}} className={`on-log on-visible fhl-item${activeIndex==1?" on":""}`} >
                            {isOther?'TA':'我'}的见证人
                            </div>
                        </div>  
                        {
                            activeIndex==0&&flagCardList&&flagCardList.length>0&&
                            <div className="fhl-details">
                                {
                                    flagCardList.map((item,index)=>{
                                        return <CardItem
                                            key={index}
                                            {...item}
                                            shareDay={this.props.shareDay}
                                            isHideTime={true}
                                            addClick={this.addClick}
                                            logName={`小目标`}
                                            logRegion={`home-card`}
                                            logPos={(index+1)||1}
                                        /> 
                                    })
                                } 
                            </div>   
                        }
                        {
                            activeIndex==1&&flagList&&flagList.length>0&&
                            <div className="fhl-invite">
                                <div className="fhli-head">
                                    <div className="fhli-num">共{flagList.length}位见证人</div>
                                    <div className="fhli-money">助攻{formatMoney(this.sumMoney(flagList)||0)}元</div>
                                </div>
                                <div className="fhli-list">
                                    {
                                        flagList.map((item,index)=>{
                                            return <div className="fhli-item" key={index}>
                                                <div className="fhli-avator">
                                                    <img src={imgUrlFormat(item.userHeadImg||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200','/0')} />
                                                </div>
                                                <div className="fhli-right-path">
                                                    <div className="fhli-top">
                                                        <div className="fhli-name">{item.userName}</div>
                                                        <div className="fhli-money">+{formatMoney(item.money||0)}元</div>
                                                    </div>
                                                        <div className="fhli-intro">{caseList[parseFloat(item.desc)-1]}</div>
                                                </div>
                                            </div>
                                        })
                                    }
                                   
                                    
                                </div>
                            </div>   
                        } 
                    </div>
                </div> 
            </Fragment>
        )
    }
}
