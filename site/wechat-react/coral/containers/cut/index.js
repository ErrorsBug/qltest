import React, { Component } from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import { MiddleDialog } from 'components/dialog';
import {
    getCutInfoRecord,
    getAssistCutList,
    assistCut,
    startCutRecord,
} from '../../actions/cut';
import Timer from './components/timer';
import { isQlchat, isAndroid, isIOS } from 'components/envi';

import { doPay } from 'common_actions/common'
import { 
    getSubscribeInfo , 
    getFollowQr , 
} from '../../actions/common';
    
import { 
    getDomainUrl,  
} from '../../../actions/common';

import { logPayTrace } from 'components/log-util';


import { locationTo ,formatMoney, dangerHtml, parseDangerHtml, imgUrlFormat } from 'components/util';
import { eventLog } from 'components/log-util';
import { cutCardMake } from './components/cut-card-make';
import { cutQrCode } from './components/draw-qr-code';
import { share, closeShare } from 'components/wx-utils';
import ScrollToLoad from 'components/scrollToLoad';


class Cut extends Component {

    state={
        showQlQRCodeDialog:false,//关注二维码弹框
        showCutTipDialog:false,//助力成功提示弹框
        showCutShareDialog:false,//砍价分享弹框
        showCutRuleDialog:false,//砍价规则弹框
        qlQRCodeUrl:'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQHE8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyV3NSSmN0dE1kUDIxTGZJWk5xMTkAAgTPX5ZaAwQAjScA',
        businessType:this.props.location.query.businessType,
        businessId:this.props.location.query.businessId,
        applyUserId:this.props.location.query.publicLink==='Y'? this.props.userInfo.userId : this.props.location.query.applyUserId,
        isAutoCut:this.props.location.query.isAutoCut,
        cutInfoData: this.props.cutInfoData,
        courseCutInfo:this.props.courseCutInfo,
        payMoney: formatMoney(this.props.cutInfoData.amount - this.props.cutInfoData.cutMoney),//支付钱数
        remainMoney: formatMoney(this.props.cutInfoData.amount - this.props.cutInfoData.minimumAmount - this.props.cutInfoData.cutMoney),//还可以砍的钱数
        thisCutMoney: '',
        assistCutList:[],


        applyRecordPage: 1,
        applyRecordSize: 20,
        isNoMore:false,
        isNoOne:false,
        cutCardUrl:'',
        isCuted: this.props.cutInfoData.isCut ==='Y',
    }

    

    componentDidMount(){
        
        this.initData();

        this.initEvent();
	}

    initData(){
        
        if(!this.props.cutInfoData.id){
            this.initCutInfoRecord();
        }
        

        if(this.props.cutInfoData.id){
            this.loadAssistCutList();
        }
        
        
        this.initCutCardMake();  
        this.initShare();

        this.initFocus();

        //访问日志
        this.pageLogPv();
        
        
    }



    async initEvent(){
        if(!this.props.cutInfoData.id&&this.state.applyUserId===this.props.userInfo.userId){//当没有发起砍价，并且是申请人本人时，调用砍价请求
            //发起砍价
            this.initstartCutRecord();
            //发起砍价成功事件日志
            eventLog({
                category: 'startCutPrice',
                action: 'success',
                business_id: this.state.businessId,
                business_type: this.state.businessType,
                applyrecord_id: this.props.userInfo.userId,
            });
        }

        
    }

    startFn (e) {
		var self = this;
		this.isTouching=true;
		this.touchTimer = setTimeout(function(){
			if(self.isTouching){
				eventLog({
                    category: 'cutPriceCardSave',
                    action: 'success',
                    business_id: self.state.businessId,
                    business_type: self.state.businessType,
                    applyrecord_id: self.props.userInfo.userId,
                });
			}
		},700);
		// this.touchTimer=setTimeout(()=>{
		// 	if(this.isTouching){
		// 		this.calllog(this.type,touchPicKey,this.data.businessId);
		// 	}
		// },700);
	}
	endFn (){
		if(this.isTouching){
			clearTimeout(this.touchTimer);
			this.isTouching= false;
		}
	}
	mouseRightFn (e){
		if(e.button===2){
			eventLog({
                category: 'cutPriceCardSave',
                action: 'success',
                business_id: this.state.businessId,
                business_type: this.state.businessType,
                applyrecord_id: this.props.userInfo.userId,
            });
		}
	}

    async initCutInfoRecord(){
        await this.props.getCutInfoRecord({
            businessId:this.state.businessId,
            applyUserId:this.state.applyUserId,
        });
        this.setState({
            cutInfoData: this.props.cutInfoData,
            remainMoney: formatMoney(this.props.cutInfoData.amount - this.props.cutInfoData.minimumAmount - this.props.cutInfoData.cutMoney),
            payMoney: formatMoney(this.props.cutInfoData.amount - this.props.cutInfoData.cutMoney),
            assistCutList:[],
            applyRecordPage: 1,
            applyRecordSize: 20,
            isNoMore:false,
        });
        if(this.props.cutInfoData.id){
            this.initCutCardMake();  
            this.loadAssistCutList();
        }
    };

    async initFocus(){
           
        //关注二维码弹框初始化
        await this.props.getSubscribeInfo();
        if(!this.props.subscribe.subscribe){
            let codeResult = await this.props.getFollowQr({
                channelCode : "shareCut" , 
                channelId : this.state.businessType ==="CHANNEL"? this.state.businessId:'' , 
                topicId : this.state.businessType ==="TOPIC"? this.state.businessId:'' ,
                liveId: this.props.courseCutInfo.liveId,
                toUserId: this.state.applyUserId,
                showQl : 'Y' , 
                showLoading : false, });

                cutQrCode('https://img.qlchat.com/qlLive/liveCommon/cut-qr-bg.jpg',{
                    qrCodeUrl:codeResult.data.qrUrl||'',
                },(url)=>{
                    this.setState({
                        qlQRCodeUrl : url,
                        // showQlQRCodeDialog : true,
                    });
                }, true, "A", 600, 300);
            
            
        }else if(!this.state.isCuted&&this.state.isAutoCut=='Y'){
            this.cutHelpClick();
        }
    };

    initShare(){//初始化分享
        let shareData={
		    title: `${this.props.userInfo.name}:就差你一刀了，快来一起砍价听好课吧`,
		    timelineTitle: `${this.props.userInfo.name}:就差你一刀了，快来一起砍价听好课吧`,
		    desc: '我正在砍价听好课，一起来玩啊',
		    timelineDesc: `${this.props.userInfo.name}:就差你一刀了，快来一起砍价听好课吧`, // 分享到朋友圈单独定制
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/cut-share-pic.jpg',
            shareUrl: `${this.state.domainUrl}activity/page/cut-price?businessType=${this.state.businessType}&businessId=${this.state.businessId}&applyUserId=${this.state.applyUserId}`,
            successFn: this.onShareComplete,
		    // shareUrl: fillParams({
            //     businessId: this.state.businessId,
            //     businessType: this.state.businessType,
            //     applyUserId:this.state.applyUserId,//砍价发起人
            // }),
	    };
        if(this.props.location.query.publicLink==='Y'){
            shareData.shareUrl = window.location.href.replace('&publicLink=Y', `&applyUserId=${this.state.applyUserId}`);
        }
	    share(shareData);
    }

    pageLogPv(){
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla('pv', {

            });
        }, 0);
    }

    onShareComplete(){
        //分享成功时间日志
        eventLog({
            category: 'cutPriceShare',
            action: 'success',
            business_id: this.state.businessId,
            business_type: this.state.businessType,
        });
    }

    async initstartCutRecord(){//发起砍价方法
        let result = await this.props.startCutRecord({
            userId:this.props.userInfo.userId,
            businessId:this.state.businessId,
        });
        if(result.state&&result.state.code === 0){
            setTimeout(() => {
                this.initCutInfoRecord();
            }, 200);
        }
        
        

    }

    reStartCutRecord(){
        this.initstartCutRecord();
        
        //重新发起砍价成功事件日志
        eventLog({
            category: 'restartCutPrice',
            action: 'success',
            business_id: this.state.businessId,
            business_type: this.state.businessType,
            applyrecord_id: this.props.userInfo.userId,
        });
    }

    async initCutCardMake(){
        let domainResult= await this.props.getDomainUrl({
            type:'shareCut',
        });
        console.log(domainResult);
        this.setState({
            domainUrl : domainResult.data.domainUrl,
        },()=>{
            console.log(domainResult.data.domainUrl);
        
            cutCardMake(this.props.cutInfoData.cardUrl,{
                userName: this.props.userInfo.name,
                headImgUrl: this.props.userInfo.headImgUrl,
                businessId: this.state.businessId,
                businessType: this.state.businessType,
                userId: this.props.userInfo.userId,//用户
                applyUserId:this.state.applyUserId,//砍价发起人
                domainUrl: domainResult.data.domainUrl,
            },this.setImgFunc.bind(this), true, "A", 640, 1136);
        });
        

        
    }

    setImgFunc(url){
        this.setState({
            cutCardUrl : url,
        });
    }

    async loadAssistCutList(next){
        if(this.state.isNoMore){
            next&& next();
            return false;
        }
        let { applyRecordPage, applyRecordSize} = this.state;
        let result = await this.props.getAssistCutList({
            applyRecordId:this.props.cutInfoData.id,
            pageNum: applyRecordPage,
            pageSize: applyRecordSize,
        });
        if(result.state.code === 0){
            next&& next();
        }
        if(result.data.list&&result.data.list.length < applyRecordSize){
            this.setState({
                isNoMore:true,
            })
        }else{

        }
        this.setState({
            assistCutList : [...this.state.assistCutList,...result.data.list],
            applyRecordPage: ++applyRecordPage,
        });
    }

    closeQlQRCodeDialog(){
        this.setState({
            showQlQRCodeDialog:false,
        })
    }
    closeCutTipDialog(){
        this.setState({
            showCutTipDialog:false,
        })
    }
    closeCutShareDialog(){
        this.setState({
            showCutShareDialog:false,
        })
    }

    

    showCutShareTip(){
        this.setState({
            showCutShareDialog:true,
        },()=>{
            this.$image=document.getElementById('image');
            if (isAndroid() || isIOS()) {
                this.$image.addEventListener('touchstart', this.startFn.bind(this), false);
                // document.addEventListener('touchmove', this.moveFn, false);
                document.addEventListener('touchend', this.endFn.bind(this), false);
                document.addEventListener('touchcancel', this.endFn.bind(this), false);
            } else {
                this.$image.addEventListener('mousedown', this.mouseRightFn.bind(this), false);
            }
        })

        //喊好友继续砍按钮的点击日志
        eventLog({
            category: 'cutPriceFindHelp',
            action: 'success',
            business_id: this.state.businessId,
            business_type: this.state.businessType,
            applyrecord_id: this.state.applyUserId,
            user_id : this.props.userInfo.userId,
        }); 
        
    };

    closeCutRuleDialog(){
        this.setState({
            showCutRuleDialog:false,
        })
    };

    showCutRule(){
        this.setState({
            showCutRuleDialog:true,
        })
    };

    //帮好友砍价助力
    async cutHelpClick(){
        if(this.props.subscribe.subscribe){
            let result = await this.props.assistCut({
                applyRecordId : this.props.cutInfoData.id,
            });
            if(result.state.code === 0){

            //好友砍价助力成功事件日志
                eventLog({
                    category: 'cutPriceHelp',
                    action: 'success',
                    business_id: this.state.businessId,
                    business_type: this.state.businessType,
                    applyrecord_id: this.state.applyUserId,
                    user_id : this.props.userInfo.userId,
                }); 

                this.setState({
                    remainMoney: formatMoney(result.data.remainMoney),
                    thisCutMoney: formatMoney(result.data.cutMoney),
                    showCutTipDialog: true,
                    isCuted:true,
                    assistCutList:[],
                    applyRecordPage: 1,
                    applyRecordSize: 20,
                    isNoMore:false,
                })
                setTimeout(()=>{
                    this.loadAssistCutList();
                },200)
                
            }
        }else{
            this.setState({
                showQlQRCodeDialog : true,
            });
        }
    }

    //好友自己发起砍价听
    friendCutStart(){
        eventLog({
            category: 'friendSelfCut',
            action: 'success',
            business_id: this.state.businessId,
            business_type: this.state.businessType,
            applyrecord_id: this.state.applyUserId,
        });
        setTimeout(() => {
            locationTo(`/activity/page/cut-price?businessType=${this.state.businessType.toUpperCase()}&businessId=${this.state.businessId}&applyUserId=${this.props.userInfo.userId}`)
        }, 200);
    }

    //倒计时
    onTimerFinish(){

        console.log("倒计时结束");
    }

    buyCourse(){
        this.doPay();
    }

    onCancelPayment(){
        eventLog({
            category: 'cancelPayText',
            action: 'sucess',
        });
    }

    onSuccessPayment(){
        if(this.state.businessType==='CHANNEL'){
            locationTo('/live/channel/channelPage/'+ this.state.businessId +'.htm');
        }else{
            locationTo('/topic/details?topicId=' + this.state.businessId);
        }
        
    }

    doPay(){
		const channelId = this.state.businessId || "";
		
		this.props.doPay({
			liveId: 0,
			channelId: this.state.businessType === 'CHANNEL'? this.state.businessId:'',
			topicId: this.state.businessType === 'TOPIC'? this.state.businessId:'',
            total_fee: this.state.payMoney,
            payType: 'share_cut',
			type: this.state.businessType,
            topicId: '0',
            chargeConfigId: this.props.cutInfoData.chargeConfigId,
			callback: async (orderId) => {

				logPayTrace({
					id: this.state.businessId,
					type: 'share_cut',
                });
                this.onSuccessPayment();
                           //分享成功时间日志
                // eventLog({
                //     category: 'CUT_PRICE_HELP',
                //     action: 'success',
                //     business_id: this.state.businessId,
                //     business_type: this.state.businessType,
                //     applyrecord_id: this.state.applyUserId,
                //     user_id : this.props.userInfo.userId,
                // }); 


            },
            onPayFree: (result) => {
                window.toast('报名成功');

	            eventLog({
		            category: 'shareCutPayFree',
		            action: 'success',
		            business_id: this.state.businessId,
		            business_type: this.state.businessType,
                    business_pay_type: this.state.businessType,
                    applyrecord_id: this.state.applyUserId,
                });

                this.onSuccessPayment();
            },
            onCancel: this.onCancelPayment
		});
	}


    render() {
        return (
            <Page title="砍价听好课" className='coral-cut'>
                <ScrollToLoad
                    ref="scrollBox"
                    className={`scroll-box`}
                    toBottomHeight={200}
                    loadNext={this.loadAssistCutList.bind(this)}
                    >
                <div className="top"><div className="btn-rule icon_ask2" onClick={()=>{this.showCutRule()}}>活动规则</div></div>
                <div className="cut-course-info">
                    <div className="head">
                        <img src={imgUrlFormat(this.state.cutInfoData.applyUserHeadImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','@64h_64w_1e_1c_2o')} alt=""/>
                    </div>
                    <div className="user-name">{this.state.cutInfoData.applyUserName}</div>
                    <div className="message">“我在千聊发现一门好课，快来帮我砍价吧！”</div>
                    <div className="course" onClick={()=>{this.onSuccessPayment()}}>
                        <div className="course-img">
                            <img src={imgUrlFormat(this.state.cutInfoData.businessHeadImage||'https://img.qlchat.com/qlLive/liveCommon/channelNormal.png','@300h_480w_1e_1c_2o')} alt=""/>
                        </div>                        
                        <div className="course-right">
                            <div className="name elli-text">{this.state.cutInfoData.businessName}</div>
                            <div className="detail">
                                <div className="price">￥{formatMoney(this.state.cutInfoData.amount)}</div>
                                <div className="num">{this.state.cutInfoData.totalApplyCount||0} 人已砍价</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="cut-status">
                    {
                        this.state.applyUserId===this.props.userInfo.userId?
                        (
                            this.state.cutInfoData.personNum <= this.state.cutInfoData.cutNum?
                            <div className="tips">砍价成功</div>
                            :
                            (
                                this.state.cutInfoData.expiryTime<= (new Date().getTime())?                                
                                <div className="tips">砍价失败</div>
                                :
                                <div className="tips">砍了<var>￥{formatMoney(this.props.cutInfoData.cutMoney)}</var>，还差<var>{this.state.remainMoney||0}</var>元</div>
                            )
                        ):
                        (
                            this.state.cutInfoData.personNum <= this.state.cutInfoData.cutNum?
                            <div className="tips">好友已成功砍价听好课</div>
                            :
                            (
                                this.state.cutInfoData.expiryTime<= (new Date().getTime())?
                                <div className="tips">好友已砍价失败</div>
                                :
                                (
                                    this.state.isCuted?
                                    <div className="tips">已帮好友砍价</div>
                                    :
                                    <div className="tips">砍了<var>￥{formatMoney(this.props.cutInfoData.cutMoney)}</var>，还差<var>{this.state.remainMoney||0}元</var></div>
                                )
                            )
                            
                        )
                        
                    }
                    
                    

                    {
                        this.state.applyUserId===this.props.userInfo.userId?
                        (
                            this.state.cutInfoData.personNum <= this.state.cutInfoData.cutNum?
                            (
                                this.state.payMoney<=0?
                                <div className="btn" onClick={()=>{this.buyCourse()}}>免费听课</div>
                                :
                                <div className="btn" onClick={()=>{this.buyCourse()}}>立即享<var>¥ {this.state.payMoney}</var>超值购买</div>
                            )
                            :
                            (
                                this.state.cutInfoData.expiryTime<= (new Date().getTime())?                                
                                <div className="btn"  onClick={()=>{this.reStartCutRecord()}}>立即重新砍价听好课</div>
                                :
                                <div>
                                    <div className="btn" onClick={()=>{this.showCutShareTip()}} >喊好友继续砍</div>  
                                    <div className="btn-second" onClick={()=>{this.buyCourse()}}>立即享<var>¥ {this.state.payMoney}</var>超值购买</div>  
                                </div>
                            )
                        )
                        :
                        (
                            this.state.cutInfoData.personNum <= this.state.cutInfoData.cutNum||this.state.cutInfoData.expiryTime<= (new Date().getTime())?
                            <div className="btn" onClick={()=>this.friendCutStart()}>我也要砍价听</div>
                            :
                            (
                                this.state.isCuted?
                                <div className="btn" onClick={()=>this.friendCutStart()}>我也要砍价听</div>
                                :
                                <div className="btn" onClick={()=>{this.cutHelpClick()}}>帮好友砍一刀</div>
                            )
                            
                            
                        )
                        

                    }  

                    {
                        this.state.cutInfoData.personNum > this.state.cutInfoData.cutNum&&this.state.cutInfoData.expiryTime - (new Date().getTime())>0?
                        <div className ="time-tip">
                            还剩
                            <Timer second={ this.state.cutInfoData.expiryTime - (new Date().getTime()) } notSecond={true} onFinish={ this.onTimerFinish.bind(this) } ></Timer>
                            结束，快来砍价吧~
                        </div>
                        :null
                    }

                     

                               
                </div>
                
                <div className="cut-list">
                    <div className="title"><div>砍价榜</div></div>
                    {
                        this.state.assistCutList.map((item,index)=>{
                            return (
                                <div className="cut-list-li" key={`cut-index-${index}`}>
                                    <div className="cut-list-img"><img src={item.headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png'} /></div>
                                    <div className="cut-list-middle"> 
                                        <div className="name elli">{item.userName.substring(0,15)}</div>
                                        <div>{item.remark||''}</div>
                                    </div>
                                    <div className="price">
                                        <div className="dao"></div>
                                        砍掉{formatMoney(item.cutMoney||0)}元
                                    </div>
                                </div>
                            );
                        })
                    }

                </div>
                </ScrollToLoad>
                <MiddleDialog
                    show={this.state.showQlQRCodeDialog}
                    className="qlqrcode-dialog"
                    bghide={true}
                    onClose={this.closeQlQRCodeDialog.bind(this)}
                    close={true}
                >
                    <div className="content">
                        <div className="qrcode">
                            <img src={this.state.qlQRCodeUrl}
                                className={`on-visible`}
                                data-log-name="发起砍价的关注二维码引导"
                                data-log-region="visible-cut-focus"
                                data-log-pos="shareCut"  alt=""/>
                        </div>
                    </div>
                </MiddleDialog>
                <MiddleDialog
                    show={this.state.showCutTipDialog}
                    className="cut-tip-dialog"
                    bghide={true}
                    onClose={this.closeCutTipDialog.bind(this)}
                    close={true}
                >
                    <div className="content">
                        <div className="message">
                            <div className="message_1">帮 <span className="message_name">{this.state.cutInfoData.applyUserName}</span> 砍了{this.state.thisCutMoney||0}元</div>
                            {
                                this.state.cutInfoData.minimumAmount<=0?
                                <div className="message_2">还差<span className="message_price">{this.state.remainMoney||0}</span>元，好友就可以0元免费听课了哦~</div>
                                :
                                <div className="message_2">还差<span className="message_price">{this.state.remainMoney||0}</span>元，好友就可以享超低价听课了哦~</div>
                            
                            }
                            

                            <div className="btn" onClick={()=>this.friendCutStart()}>我也要砍价听好课</div>
                        </div>
                        
                    </div>
                </MiddleDialog>
                <MiddleDialog
                    show={this.state.showCutShareDialog}
                    className="cut-share-dialog"
                    bghide={true}
                    onClose={this.closeCutShareDialog.bind(this)}
                >
                    <div className="content">
                        <span className="tip" style={{fontWeight:600}}>还差<var>{this.state.remainMoney||0}</var>元，赶快分享给好友吧！</span>
                        <span className="tip" >或长按下方图片发送给好友</span>
                        <img src={this.state.cutCardUrl} id="image" />
                        
                    </div>
                </MiddleDialog>
                <MiddleDialog
                    show={this.state.showCutRuleDialog}
                    className="cut-rule-dialog"
                    bghide={true}
                    onClose={this.closeCutRuleDialog.bind(this)}
                    close={true}
                >
                    <div className="content">
                        <div className="rule-title">活动规则</div>
                        <div className="rule-box">
                            <div className="rule"  dangerouslySetInnerHTML={parseDangerHtml(this.props.courseCutInfo.remark)}></div>                            
                        </div>
                    </div>
                </MiddleDialog>
            </Page>
        );
    }
}
function mapStateToProps(state){
    return {
        cutInfoData: state.cut.cutInfoData||{},
        userInfo: state.common.userInfo,
        courseCutInfo: state.cut.courseCutInfo.info,
        subscribe: state.common.subscribe,
    }
}

const mapActionToProps = {
    getCutInfoRecord,
    getAssistCutList,
    assistCut,
    startCutRecord,
    getSubscribeInfo,
    getFollowQr,
    doPay,
    getDomainUrl,
}

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(Cut);