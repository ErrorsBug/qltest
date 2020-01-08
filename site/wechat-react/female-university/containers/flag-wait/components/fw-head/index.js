import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';  
import { imgUrlFormat } from 'components/util';
 
@autobind
export default class extends PureComponent{
    state = {  
        preHelpIndex:0,
        helpIndex:0,
        flagList:[ ],
    }
    componentDidMount = () => {
        this.initData()
    }; 
    initData(){
        setInterval(()=>{
            let thisHelpIndex = this.state.helpIndex;
            const { flagList   } = this.props;
            if(flagList){
                var flagListCopy=[...flagList,...flagList,...flagList]
            }
            if( thisHelpIndex >= flagListCopy.length-1 ){  
                this.setState({
                    preHelpIndex: thisHelpIndex,
                    helpIndex: 0,
                });
            }else{
                this.setState({
                    preHelpIndex: thisHelpIndex,
                    helpIndex: thisHelpIndex +1,
                });
            }
            
        },2000)
    } 
    render() { 
        const { isShowRule   } = this.state;
        const { flagList ,flagHelpList  } = this.props;
        const randomCase=[
            "3分钟前挑战成功",
            "已坚持18天",
            "已领取120元奖学金",
            "刚刚创建个人挑战目标",
            "坚持学习6天了",
            "刚获得25元奖学金",
        ]
        if(flagList){
            if(sessionStorage.flagListCopy){
                var flagListCopy=JSON.parse( sessionStorage.flagListCopy )
            }else{
                var flagListCopy=[...flagList,...flagList,...flagList]
                flagListCopy.map((item,index)=>{
                    let i= Math.floor(Math.random()*6)
                    item.intro=`${item.userName?.slice(0,3)}**${randomCase[i]}`
                })
                sessionStorage.setItem('flagListCopy',JSON.stringify(flagListCopy) ) 
            }
        }

        return (
            <Fragment>
               <div className="fw-head">
                    <span className="fw-rule on-log on-visible"
                        data-log-name='规则'
                        data-log-region="un-flag-rule"
                        data-log-pos="0"
                        onClick={this.props.showRule}>规则</span>
                    <div className="fw-step"><img src="https://img.qlchat.com/qlLive/business/XUDSR9PN-A552-T1OU-1560840616877-IVA1O35GGKOM.png"/></div>
                    <div className="fw-title">请3位姐妹帮点，目标即生效</div>
                    <div className="fw-intro">3位好友点击见证，你即可获得<span>15元奖学金</span></div>
                    <div className="fw-inveite-list">
                        {
                            Array.from({length:3}).map((item,index)=>{
                                return <img key={index} src={
                                        flagHelpList[index]?
                                            (flagHelpList[index].userHeadImg||"https://img.qlchat.com/qlLive/liveCommon/normalLogo.png")
                                        :"https://img.qlchat.com/qlLive/business/DMWIPILH-1QWY-DSJZ-1559028838088-YS9GVZ8HC4TS.png"
                                        }/>
                            })
                        } 
                    </div>
                    <div className="fw-btn-container">
                        <div className="fw-btn on-log on-visible" 
                            data-log-name='马上寻找见证人'
                            data-log-region="un-flag-mine-invite"
                            data-log-pos="0"
                            onClick={this.props.initMinCards}>马上寻找见证人</div>
                     </div>
                    <div className="fs-scroll-tip">
                            <div className="fs-item">
                            {flagList && flagListCopy.map((item,index)=>{
                                return <div 
                                    key={index}
                                    className={`${index === this.state.preHelpIndex? 'pre':''} ${index === this.state.helpIndex? 'current':''}`}
                                >
                                   <img src={imgUrlFormat(item.userHeadImg || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200','/0')}/> {item.intro }
                                </div>
                            })}
                                
                            </div>
                            
                        </div>
                </div>  
               
            </Fragment>
        )
    }
}
