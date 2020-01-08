import React, { Component } from 'react';
import { createPortal } from 'react-dom'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import CenterTitle from '../../components/center-line-title';
import ReactSwiper from 'react-id-swiper' 
import {  
    universityFlagAdd, 
    flagHelpList, 
    universityFlag, 
    flagHelpGet,
    flagHelpAdd ,
    universityFlagCardList
} from '../../actions/flag';
import { 
    getMenuNode,
    listChildren  } from '../../actions/home';
import { getUserInfo } from "../../actions/common";
import { getVal, locationTo, imgUrlFormat, formatDate } from 'components/util';
import { request } from 'common_actions/common';
import { falgShareProgress,falgShareSuccess } from '../../components/flag-share';  
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit';
import { caseList } from  "../../actions/flag"  

const FlagItem = ({ keyA, keyB, keyC, keyD, title, index }) => {
    return <div className="un-flag-item" key={`item-${index}`}>
        <div className="un-flag-head">
            <div className="un-flag-img"><img src={imgUrlFormat(keyA || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200','/0')} /></div>
            <div className="un-flag-info">
                <div className="name elli">{title}</div>
                <div className="work elli">{keyB} </div>
            </div>
            <div className="un-flag-city">来自{keyD}</div>
        </div>
        <div className="un-flag-decs">{keyC}</div>
    </div>
}

 
@autobind
class FlagAdd extends Component {
    state = {
        value:'',
        friends: [],
        helpIndex: 0,
        preHelpIndex: 0,
        flagInfo:{},
        userInfo:{},
        flagHelpStatus:'',
        flagHelpList: [],
        showGiftPost: false,
        flagCouponAmount:0,
        giftpic: '',
        isToggle:false,
        flagCardList:[],
        flagGift:{},
        flagZs:{},
        flagDiy:{},
    }  
    timer=null
    componentDidMount(){  
        this.initData();
        // this.getConfig(); 
        document.querySelector('.flag-show-gift-dialog')&&limitScrollBoundary(document.querySelector('.flag-show-gift-dialog'))
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-flag-show-box');
    }
    // 初始化获取数
    async initData(){
        this.initFlagInfo();
        this.getUserInfo();
        this.getCardList();
        this.initGetHelpList();
        this.getFlagNode()
        
        this.initUniversityFriends();
    }  
   

    async fetchFlagHelpAdd(isGift){
        if(this.state.flagHelpStatus ==='Y' ||this.state.flagInfo.status ==='success'||this.state.flagInfo.status ==='pay'){
            this.goToGetGift(isGift);
        }else{
            if(this.props.location.query.userId ===this.state.userInfo.userId){
                window.toast('自己不能做见证人哦');
                setTimeout(()=>{
                    locationTo('/wechat/page/flag-home');
                },600) 
                return false;
            }else if(this.state.flagHelpStatus ==='E'){
                window.toast('大学校友不需要帮忙见证哦');
                setTimeout(()=>{
                    locationTo('/wechat/page/university/home');
                },600) 
                return false;
            }
            let addResult = await flagHelpAdd({
                flagUserId: this.props.location.query.userId,
                userId: this.state.userInfo.userId, 
            });
            if(getVal(addResult,'state.code','')=== 0 ){
                //见证成功！
                window.toast('见证成功！');
                setTimeout(()=>{
                    this.setState({
                        flagHelpStatus: 'Y',
                    },()=>{
                        this.goToGetGift(isGift);
                        this.initFlagInfo();
                        this.initGetHelpList();
                    });
                },1000) 
                
            }
        }
    }

    goToGetGift(isGift){
        let giftBool = typeof isGift === 'boolean' && isGift;
        if(giftBool && this.state.giftLink){
            locationTo(this.state.giftLink);
        }else if(giftBool&&this.state.giftpic){ //点击见证按钮，弹出礼包，引导到外部公众号。 ps：产品晗晗
            this.setState({
                showGiftPost: true,
            });
        }else{
            locationTo(`/wechat/page/join-university?userId=${this.props.location.query.userId}&couponType=witness`);
        }
    }

    async getUserInfo() {
        let res = await this.props.getUserInfo();
        this.setState({
            userInfo: getVal(res,'data.user',{}),
        },()=>{
            this.initFlagHelpGet();
        });
    }

    async getCardList() {
        
        const { flagCardList = [] } = await universityFlagCardList({
            flagUserId:this.props.location.query.userId,
        });
        this.setState({
            flagCardList
        })
    }
    async getFlagNode() {
        
        const {dataList} = await listChildren({nodeCode:"QL_NZDX_FLAG"});
        dataList.map((item,index)=>{
            if(item.nodeCode=='QL_NZDX_FLAG_GIFT'){
                if(item.keyB){
                    let link = item.keyB;
                    this.setState({giftLink: link})
                }else{
                    let pic = item.keyA;
                    this.setState({giftpic: pic})
                }
                this.setState({
                    flagGift:item
                })
            }
            if(item.nodeCode=='QL_NZDX_FLAG_ZS'){
                this.setState({
                    flagZs:item
                })
            }
            if(item.nodeCode=='QL_NZDX_FLAG_DIY'){
                this.setState({
                    flagDiy:item
                })
            }
        }) 
    }
    async initFlagHelpGet(){
        if(this.props.location.query.userId ===this.state.userInfo.userId){
            this.setState({
                flagHelpStatus: 'E',
            });
            return false;
        }
        const result = await flagHelpGet({
            flagUserId: this.props.location.query.userId,
            // helpUserId: this.state.userInfo.userId,
        });
        let flagHelpStatus = getVal(result,'data.status','');
        this.setState({
            flagHelpStatus, //见证状态：Y已见证；N未见证；E不可见证
        });
    }

    async initFlagInfo(){
        let result = await universityFlag({
            flagUserId: this.props.location.query.userId,
        });
        this.setState({
            flagInfo: result,
        },()=>{
            this.initShare()
        });
    }

    initShare(){
        
        const {flagInfo} =this.state  
        if(flagInfo.status=='success'||flagInfo.status=='pay'){
            falgShareSuccess({
                userId:this.props.location.query.userId,
                successFn:  this.successFn
            });
            return
        }
        falgShareProgress({
            userId:this.props.location.query.userId,
            successFn:  this.successFn
        });
    }
    successFn(){ 
        this.initShare()
        // 分享成功日志 
        typeof _qla != 'undefined' && _qla('event', {
            category:'flag-show',
            action:`success`
        });
    }
    async initGetHelpList(){ 
        
        if(!this.timer){ 
            this.timer=setInterval(()=>{
                let thisHelpIndex = this.state.helpIndex;
                if( thisHelpIndex >= this.state.flagHelpList.length -1 ){
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
                
            },1500)
        }
        let result = await flagHelpList({flagUserId: this.props.location.query.userId });
        let resultList = getVal(result,'data.flagHelpList',[]);
        if(resultList.length >0){
            this.setState({
                flagHelpList: [...resultList],
            });
        } 
    }
    
    async initUniversityFriends(){
        await request({
            url: '/api/wechat/transfer/baseApi/h5/menu/node/listChildren',
            method: 'POST',
            body: {
                nodeCode: 'QL_NZDX_FLAG_FRIENDS',
                page:{
                    page:1,
                    size:30,
                }
            }
        }).then(res => {
            let friends = getVal(res, 'data.dataList', []);
            
            this.setState({
                friends:[...friends,...friends,...friends]
            }) 
            
		}).catch(err => {
			console.log(err);
        })
    } 
    
    onClickViewPic(index, source){
        let sourceArray = source.map((item,i)=>{
            return item.url;
        });
        window.showImageViewer(sourceArray[index],sourceArray);
    }
    
    render(){
        const { flagInfo, userInfo, flagHelpStatus ,isToggle ,flagHelpList,flagCardList,flagGift,flagZs,flagDiy} =this.state 
        const opt = {
            // freeMode:true,
            loop: true,
            spaceBetween: 40,
            speed: 10000,
            freeMode : true,
            freeModeMomentumVelocityRatio : 0.18,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                reverseDirection:false,
            },  
        }  
        return (
            <Page title="期待你的见证" className={`un-flag-show-box ${this.state.showGiftPost ?'pointer-events-none':''}`}>
                <section className={`scroll-content-container`}>
                    <div className="fs-top">
                        <div className="fs-avator">
                            <img src={imgUrlFormat(flagInfo.userHeadImg || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200','/0')} />
                        </div>
                        <div className="fs-right-path">
                            <div className="fs-name">
                                {flagInfo.userName||''}
                            </div>
                            <div className="fs-desc">
                                <span className="help-name">{userInfo.userId == flagInfo.userId ? '': userInfo.name+','}</span>我在千聊女子大学参加30天学习活动，以下是我的小目标
                            </div>
                        </div>
                    </div>
                    <div className="fs-flag">
                        <div className={`fs-title ${flagInfo.status ==='success'||flagInfo.status ==='pay'? 'success':''}`}></div>
                        <div className="fs-content">{flagInfo.desc || ''}</div>
                    </div>
                    {
                        flagCardList.length>0&&
                        <div> 
                            <CenterTitle title={`我的最新打卡日记`}/>                
                            <div className="fs-flag-card">
                                <div className="fs-time">{formatDate(flagCardList[0].cardDate,'yyyy.MM.dd')}</div>
                                <div className="fs-content">{flagCardList[0].desc || ''}</div> 
                                {
                                    flagCardList[0].resource?.length>0&&
                                    <div className="fhl-d-img">
                                        {
                                            flagCardList[0].resource.map((item_sub,index_sub)=>{
                                                return <img src={imgUrlFormat(item_sub.url, '?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200','/0')} key={index_sub} onClick={()=>this.onClickViewPic(index_sub,flagCardList[0].resource)}/>
                                            })
                                        }
                                    </div>   
                                } 
                                <div className="fs-join-btn" onClick={this.fetchFlagHelpAdd}>加入大学，看更多日记</div>
                                <div className="fs-top-bg"></div>
                                <div className="fs-top-bg right"></div>
                            </div>    
                    
                        </div>
                    }            
                    { 
                        flagHelpList&&flagHelpList.length>0 &&
                        <div className="fs-people">
                            <CenterTitle title={`${flagInfo.helpNum||0}人正在见证我实现目标`}/>
                            <div className={`fs-list`}>
                                { flagHelpList.map((item,index)=>{ 
                                    if((!isToggle)&&index>12&&flagHelpList.length>14){
                                        return false
                                    }
                                    return <img key={index} src={(item.userHeadImg|| 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')}/>
                                })}
                                { 
                                    flagHelpList.length>14&&!isToggle&& <img onClick={()=>{this.setState({isToggle:true})}} src="https://img.qlchat.com/qlLive/business/PV4WCFWD-YWFF-YSWG-1561970917081-6QTOL4ACJR62.png" />
                                }
                                {
                                    isToggle&&<img  onClick={()=>{this.setState({isToggle:false})}} src="https://img.qlchat.com/qlLive/business/1NDML565-HLMI-IHGW-1561970913116-LS8FAXBVRG5R.png" />
                                }
                                <div className="fs-list-text">
                                    {
                                         <div className="fs-scroll-tip">
                                            <div className="fs-item">
                                            {this.state.flagHelpList.map((item,index)=>{
                                                return <span key={index}
                                                    className={`${index === this.state.preHelpIndex? 'pre':''} ${index === this.state.helpIndex? 'current':''}`}
                                                >   
                                                {item.userName}：{caseList[parseFloat(item.desc)-1] }
                                                </span>
                                            })}
                                                
                                            </div>
                                            
                                        </div>
                                    }
                                </div>
                            </div> 
                        </div> 
                    }
                    <CenterTitle title={`我在上的大学，推荐给你`}/>
                    <div className="fs-intro on-log on-visible" 
                        data-log-name='招生简章'
                        data-log-region="un-flag-show-picture"
                        data-log-pos="0"
                        onClick={this.fetchFlagHelpAdd}>
                        <img src={flagZs.keyA}/>
                    </div>
                    {
                        flagDiy.keyA&&
                        <div className="fs-intro on-log on-visible" 
                            data-log-name='自定义'
                            data-log-region="un-flag-show-diy"
                            data-log-pos="0"
                            onClick={()=>{flagDiy.keyB&&locationTo(flagDiy.keyB)}}>
                            <img src={flagDiy.keyA}/>
                        </div>
                    }
                    {
                        (this.state.friends.length>0) && 
                        <div className="fs-school">
                            <CenterTitle title={`${flagInfo.userName|| ''}的校友`}/>
                            <div className="un-flag-swiper start-animation">  
                                { !!this.state.friends.length && (
                                    <ReactSwiper { ...opt }>
                                        { this.state.friends.map((item, index) => (
                                            <div key={index}>
                                                <FlagItem {...item} index={index} />
                                            </div>
                                        )) }
                                    </ReactSwiper>
                                ) }
                                    
                            
                            </div>
                        </div>
                    }
                    
                    <div className="fs-bottom" onClick={this.fetchFlagHelpAdd}>
                        <img src="https://img.qlchat.com/qlLive/business/J1RT1QR4-DOIJ-AZXW-1558937484227-G3QNT3U1YT7H.png"/>
                    </div>
                    <div className="fs-btn on-log on-visible" 
                        data-log-name='立即见证'
                        data-log-region="un-flag-show-helper"
                        data-log-pos="0"
                        onClick={()=>this.fetchFlagHelpAdd(true)}>
                        { 
                            flagHelpStatus ==='Y' ||flagInfo.status ==='success'||flagInfo.status ==='pay' ? 
                                `感谢支持，点击领福利`
                                :flagGift.keyC}</div>
                </section>
                {
                    this.state.showGiftPost && createPortal(
                        <div className="flag-show-gift-dialog">
                            <div className="pic-box">
                                <div className="btn-close" onClick={()=>this.setState({showGiftPost:false})}></div>
                                <img src={this.state.giftpic} />
                            </div>
                        </div>,
                            document.getElementById('app')
                        )  
                }
                
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    getUserInfo,
};

module.exports = connect(mapStateToProps, mapActionToProps)(FlagAdd);