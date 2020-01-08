import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import Picture from 'ql-react-picture'
import classnames from 'classnames'
import { autobind } from 'core-decorators'
import { locationTo, formatMoney } from 'components/util' 
import PublicTitleImprove from '../../../../components/public-title-improve'
import ReactSwiper from 'react-id-swiper'
import { universityFlag, universityFlagList,flagHelpList } from '../../../../actions/flag'
import { getWithChildren } from '../../../../actions/home'
import PosterDialog from '../../../../components/poster-dialog'; 
import { initMinCards,initSuccessCards } from '../../../../components/poster-card'
import { formatDate, imgUrlFormat} from 'components/util'; 
import { falgShareProgress,falgShareSuccess } from '../../../../components/flag-share';
import { getUrlParams } from 'components/url-utils';

const FlagItem = ({ money, cardTime, userName, userHeadImg,status, desc,jobType ,showFlagSuccess,cardDate}) => {
    const time =(new Date() ).getTime() 
    const date= Math.ceil((time-cardDate)/(1000*60*60*24))
    return <div className="un-flag-item on-log on-visible" >
        {
            jobType=='mine'&&<span className="un-flag-btn-success" onClick={(e)=>showFlagSuccess(e)}>去炫耀</span>
        }
        <div className="un-flag-head">
            <div className="un-flag-img"><img src={ imgUrlFormat(userHeadImg || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_130,w_130','/0') } /></div>
            <div className="un-flag-info">
                <span className="user-name">{ jobType=='mine'?"我":userName }</span>
                {
                    (status=='success'||status=='pay')?
                    <p>挑战成功 | 获得{"￥"+formatMoney(money) }</p>
                    :
                    <p>奖学金￥{ formatMoney(money) } {date>0?`| 已坚持${ date }天`:''}</p>
                }
            </div>
        </div>
        <div className="un-home-flag-decs">
            <div className="un-flag-decs">{ desc }</div>
        </div> 
    </div>
}

const showTxt = (status, money, cardTime, helpNum ,cardDate,time) => { 
    const date= Math.ceil((time-cardDate)/(1000*60*60*24))
    if(Object.is(status, 'join') ){
        money = money > 1500 ? money:1500
        return `待领取${ formatMoney(money) }元`
    }
    if(Object.is(status, 'process') || Object.is(status, 'success')){
        return `奖学金￥${ formatMoney(money) }  ${date>0?`| 第${ date }天`:''}`
    }
    if(Object.is(status, 'fail')){
        return `${ helpNum }位见证人 | 已结束`
    }
}

const showBtnTxt = (status, money,cardStatus,cardDate) => {
    const time =(new Date() ).getTime() 
    if(time<cardDate){
        return  '明天开始打卡'
    } 
    if(Object.is(status, 'process')){
        return Object.is(cardStatus, 'N')? '点击打卡': '已打卡'
    } 
    if(Object.is(status, 'fail')){
        return `待领奖学金￥${formatMoney(money)}`
    }
    return '寻找见证人'
}

// 打卡状态
const PunchStatus = ({ status, userHeadImg, money, cardTime,cardDate, helpNum, cardStatus, cardClick, falgClick }) => {
    const time =(new Date() ).getTime() 
    const cls = classnames('punch-status-btn on-log on-on-visible', {
        'begin':time<cardDate,
        'unchecked': Object.is(status, 'process') && Object.is(cardStatus, 'N'),
        'punched': Object.is(status, 'process') && Object.is(cardStatus, 'Y'),
        'pending': Object.is(status, 'fail'),
    })
    return (
        <div className="punch-status-box" >
            <div className="punch-status-cont">
                <div 
                    className="punch-status on-log on-visible" 
                    data-log-name={`我的小目标`}
                    data-log-region={ `un-flag-mine` }
                    data-log-pos={`0`}
                    onClick={falgClick}>
                    <div className="punch-status-pic">
                        <img src="https://img.qlchat.com/qlLive/business/DRQYTYHM-CPXC-9HGS-1559359323524-MUWN92WJWRS1.png" />
                    </div>
                    <div className="punch-status-info">
                        <h4><span>我的小目标</span></h4>
                        <p>{ showTxt(status, money,cardTime, helpNum,cardDate,time ) }</p>
                        <p></p>
                    </div>
                </div>
                
                <div
                    onClick={cardClick}
                     className={ cls }
                    data-log-name={ showBtnTxt(status,money,cardStatus,cardDate) }
                    data-log-region={ `un-flag-${ status }` }
                    data-log-pos="0">
                    { showBtnTxt(status,money,cardStatus,cardDate) }</div>
            </div>
        </div>
    )
}

@autobind
export default class extends Component {
    state = {
        flagAll: {},
        flagBg: {},
        flagInfo: {},
        lists: [],
        flagHelpListData:{},
        isShowProcess:false,
        processUrl:'',
        isShowType:'',
        isLoading: false
    }
    endTime = 1574870399000;
    get curTime(){
        return getUrlParams("endTime", "") || Date.now()
    }
    componentDidMount() {
        this.initData();
    }
    async initData() {
        const [ flagBg, flagObj,flagHelpListData, obj ] = await Promise.all([
            getWithChildren({ nodeCode: 'QL_NZDX_SY_FLAG_BG' }),
            universityFlag({cardDate: formatDate(new Date()) }),
            flagHelpList(),
            universityFlagList({ page: 1,size: 15, order: 'prize',indexPage:'Y' })
        ])
        this.setState({
            flagAll: flagBg?.menuNode || {},
            flagBg: flagBg?.menuNode?.children[0] || {},
            flagInfo: flagObj || {},
            flagHelpListData:flagHelpListData||{},
            lists: obj.flagList || [],
            isLoading: true
        })
    }

    handleTargetBtn() {
        locationTo(`/wechat/page/flag-list`)
    }
    handleMoreLink() {
        locationTo(`/wechat/page/flag-list`)
    }
    cardClick(){
        const {flagInfo,flagHelpListData } = this.state;
        const time =(new Date() ).getTime()
        if(Object.is(flagInfo.status, 'join')){ 
            initMinCards(flagInfo,flagHelpListData?.data?.flagHelpList,(url)=>{ 
                this.setState({
                    processUrl:url,
                    isShowType:'pd-init'
                },()=>{
                    this.showProcess()
                })
            })
        }
        if(time<flagInfo.cardDate){
            return
        }
        if(Object.is(flagInfo.status, 'process') && Object.is(flagInfo.cardStatus, 'N')){
            locationTo(`/wechat/page/university/flag-publish`)
        }

        if(Object.is(flagInfo.status, 'fail')){
            locationTo(`/wechat/page/flag-home`)
        }
    }
    falgClick(){
        const {flagInfo } = this.state;
        if(Object.is(flagInfo.status, 'join')){
            locationTo(`/wechat/page/university/flag-wait`)
        }else{
            locationTo(`/wechat/page/flag-home`)            
        }
    }
    showProcess(){
        
        this.setState({
            isShowProcess: true,
        })
        this.initShare()
    } 
    initShare(){
        const {flagInfo} =this.state 
        if(flagInfo.status=='success'||flagInfo.status=='pay'){
            falgShareSuccess({ 
                successFn:  this.successFn
            }) 
            return
        }
        falgShareProgress({ 
            successFn: this.successFn
        }) 

    }
    successFn(){
        this.setState({ 
            isShowProcess:false,
            processUrl:'',
            isShowType:''
        })
        this.initShare()
    }
    colseProcess(){
        this.setState({ 
            isShowProcess: false,
        }) 
    } 
    showFlagSuccess(e){
        e.stopPropagation();
         
        
        const {flagInfo,flagHelpListData } = this.state;
        initSuccessCards(flagInfo,flagHelpListData?.data?.flagHelpList,(url)=>{ 
            this.setState({
                processUrl:url,
                isShowType:'pd-success'
            },()=>{
                this.showProcess()
            })
        })
    }
    render() {
        let opt = { 
            loop: true,  
            spaceBetween: 0, 
            observer: true,
        }
        const { flagInfo, lists, flagBg , flagHelpListData, isShowProcess,processUrl,isShowType ,flagAll, isLoading} = this.state;
        if(!isLoading || ((!flagInfo.status && isLoading) && Number(this.curTime) >= Number(this.endTime))) return null;
        if(lists?.length>0&&flagInfo?.userId){
            let i = lists.findIndex(item => item.userId == flagInfo.userId)
            if(i>-1){ 
                lists.splice(i, 1)
                if(flagInfo?.status=='success'||flagInfo?.status=='pay'){
                    flagInfo.jobType='mine'
                    lists.unshift(flagInfo)
                }
            }
        } 
        const { btm  } = this.props;
        return <div className="un-flag-box" style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
            { this.props.isTitle && (
                <PublicTitleImprove
                    className='un-flag-title on-log on-visible'
                    data-log-name={`他们的小目标_更多`}
                    data-log-region={ `un-flag-other-more` }
                    data-log-pos={`0`}
                    title={ flagAll.title } 
                    moreTxt={(flagInfo?.status=='success'||flagInfo?.status=='pay')?"更多":""}
                    decs={flagAll.keyA}
                    handleMoreLink={ this.handleMoreLink } />
            ) }
            { !flagInfo.status && (
                <div className="un-flag-poster on-log on-visible" 
                    data-log-name='flag活动'
                    data-log-region="un-flag-active"
                    data-log-pos="0"
                    onClick={ this.handleTargetBtn }>
                        {/* <img src={ flagBg.keyA || ''} /> */}
                    <Picture src={ flagBg.keyA || ''}  />
                </div>
            ) }
            { flagInfo.status&&(flagInfo.status!='success'&&flagInfo.status!='pay') && <PunchStatus { ...flagInfo } cardClick={this.cardClick} falgClick={this.falgClick} flagHelpListData={flagHelpListData}/> }
            <div className="un-flag-other">
                {
                    !(flagInfo?.status=='success'||flagInfo?.status=='pay')&&
                    <div className="un-flag-other-title"> 
                        <div className="text">同学的小目标</div>  
                        <div className="more on-log on-visible" 
                            data-log-name='更多'
                            data-log-region="un-flag-more"
                            data-log-pos="0" onClick={ this.handleMoreLink }>更多</div> 
                    </div>
                }
                
                <div className="un-flag-swiper">
                    { !!lists.length && (
                        <ReactSwiper {...opt}>
                            { lists.map((item, index) => (
                                <div 
                                    data-i={ index }
                                    onClick={ 
                                        ()=>{
                                            item.jobType=='mine'?
                                            locationTo(`/wechat/page/flag-home`)       
                                            :
                                            locationTo(`/wechat/page/flag-list`)     
                                        }  }
                                    className="on-log on-visible"
                                    data-log-name={`他们的小目标`}
                                    data-log-region={ `un-flag-other` }
                                    data-log-index={index}
                                    data-log-pos={`0`}
                                    key={index}>
                                    <FlagItem 
                                        showFlagSuccess={this.showFlagSuccess}
                                        {...item} />
                                </div>
                            )) }
                        </ReactSwiper> 
                    ) }
                </div>
            </div>
            {
                typeof document != 'undefined' && createPortal(
                    <PosterDialog 
                        isShow={ isShowProcess } 
                        imgUrl={processUrl}
                        on={2}
                        hideBtn={false}
                        close={ this.colseProcess }
                        className={isShowType} 
                        children={
                            <img src={processUrl}/>
                        } 
                        />,
                        document.getElementById('app')
                    ) 
            }
            
        </div>
    }
}