import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getUserInfo, bindOfficialKey, getFollowQr } from '../../../actions/common';
import { coralThemeCardMaking } from './coral-theme-card';
import {
    getOneTheme,
} from '../../../actions/shop';

import {
    locationTo,
} from 'components/util';
import {
	fillParams
} from 'components/url-utils';
import { share, closeShare } from 'components/wx-utils';
import Page from 'components/page';
import { isIOS, isAndroid } from "components/envi";
// require('../../../../components/swiper/3.4.2/swiper.umd.js')

class ThemeCardPage extends Component {
    state = {
        theme:{},
        cardList:[],
        currentIndex: 0,
        showOne:true,
    }
    mainImages=[]

    componentDidMount(){
        
        this.initData();
    }
    async initData(){
        await this.props.getUserInfo();
        await this.getThemeInfo();
        await this.initQrcode();
        
        this.initShare();
        
        window.sessionStorage.setItem('index', 0);
        
        

        //自动绑定officialKey
        if(!this.props.myIdentity.identity && this.props.location.query.officialKey){
		    this.props.bindOfficialKey({
                officialKey: this.props.location.query.officialKey,
                subjectId: this.props.location.query.subjectId,
		    });
        }
        
        this.drawThemeCard(0);
        this.initCardSaveLog();
    }

    async initQrcode(){
        let qrcodeUrl =null;
        let qrCodeResult = null;
        let userId = this.props.myIdentity.identity?this.props.userInfo.userId:this.props.location.query.officialKey;
        qrCodeResult = await this.props.getFollowQr({channelCode:'personPartySubject', toUserId : this.props.location.query.subjectId ,userId : userId});
        if(qrCodeResult.state.code === 0){
            qrcodeUrl = qrCodeResult.data.qrUrl;
            this.setState({
                qrcodeUrl,
            });
        }
    }

    drawThemeCard (index){
        loading(true);
        let bgUrl = this.state.cardList[Number(index)].url;
        coralThemeCardMaking(bgUrl?bgUrl:"https://img.qlchat.com/qlLive/coral/share-card-bg_2.png",{qrcodeUrl: this.state.qrcodeUrl, headImg:this.props.userInfo.headImgUrl, userName:this.props.userInfo.name},this.updateShareCard.bind(this), true, "Z", 640, 1136);  
        
    }

    async getThemeInfo(){
        await this.props.getOneTheme({subjectId:this.props.location.query.subjectId});
        return new Promise((resolve, reject) => {
	        let theme = this.props.theme||{};
            if(theme.status !== 'Y'){//专题下架状态，三秒后跳转到商城首页
                window.toast('该专题已下架',3000);
                setTimeout(() => {
                    locationTo('/wechat/page/coral/shop');
                }, 3000);
                
            }
            let cardList = theme.inviteCardUrl.map((item,value)=>{
                return {
                    url: item,
                    drawed:false,
                }
            });
	        if(theme.title){
		        this.setState({
                    theme,
                    logKey: theme.inviteCardUrl,
                    cardList,
		        }, () => {
                    if(this.state.logKey.length>0){
                        this.initSwiper();
                    }
                    
			        resolve();
		        });
	        }
        });
    }

    initShare(){
        if(this.props.myIdentity.identity){
            this.initThemeCardShare();
        }else{
            this.initThemeShare();
        }
        
        
    }

    initThemeCardShare(){
        share({
		    title: `${this.props.userInfo.name}推荐 ${this.state.theme.title}`,
		    timelineTitle: `${this.props.userInfo.name}推荐 ${this.state.theme.title}`,
		    desc: `${this.state.theme.description||'买课省钱，卖课赚钱'}`,
		    timelineDesc: `${this.props.userInfo.name}推荐 ${this.state.theme.title}`, // 分享到朋友圈单独定制
		    imgUrl: 'https://img.qlchat.com/qlLive/activity/image/7JEKE2L2-44H5-3JHN-1562313091323-E8GJA3C8BYXE.png',
		    shareUrl: fillParams({
                officialKey: this.props.userInfo.userId
            }),
	    });
    }

    initThemeShare(){
	    share({
		    title: `${this.props.userInfo.name}推荐 ${this.state.theme.title}`,
		    timelineTitle: `${this.props.userInfo.name}推荐 ${this.state.theme.title}`,
		    desc: `${this.state.theme.description||'买课省钱，卖课赚钱'}`,
		    timelineDesc: `${this.props.userInfo.name}推荐 ${this.state.theme.title}`, // 分享到朋友圈单独定制
		    imgUrl: 'https://img.qlchat.com/qlLive/activity/image/7JEKE2L2-44H5-3JHN-1562313091323-E8GJA3C8BYXE.png',
		    shareUrl: fillParams({
                officialKey: this.props.userInfo.userId,
                subjectId: this.props.location.query.subjectId,
            },window.location.origin+'coral/shop/theme'),
	    });
    }

    // async initSwiperFile(){
    //     await this.initSwiperScript();
        
    // }

    /**
     * 更新邀请卡
     *
     * @param {any} imgData
     */
    updateShareCard (imgData) {
        var image = document.querySelectorAll('#swiper .swiper-slide')[Number(window.sessionStorage.getItem('index'))].querySelector('img');
        image.src = imgData;
                
        let cardList = this.state.cardList;
        if(!cardList[Number(window.sessionStorage.getItem('index'))].drawed){
            cardList[Number(window.sessionStorage.getItem('index'))] = { url:imgData, drawed:true};
        }
        
        
        this.setState({
            cardList,
        });
        image.onload = function () {
            image.style.display = 'block';
            loading(false);
            // 防止初始加载swiper时出现晃动
            document.querySelector('#swiper').style.visibility = 'visible';
        }

    }

    async initSwiper(){
        await require.ensure([], (require) => {
            // 此处引用详细路径是因为该插件会优先选用ES6文件，编译会报错。
            this.swiper = require('../../../../components/swiper/3.4.2/swiper.umd.js');
            
        }, 'swiper');
        var self = this;
		self.$swiper = new Swiper(".swiper-container",{
			slidesPerView: "auto",
			centeredSlides: true,
			paginationClickable: true,
			preloadImages: true,
			pagination: '.swiper-pagination',
			paginationClickable: true,
			onSlideChangeStart: function(swiper){
                if(!self.state.cardList[swiper.activeIndex].drawed){
                    self.drawThemeCard(swiper.activeIndex);
                }
                window.sessionStorage.setItem('index', swiper.activeIndex);
                self.setState({
                    currentIndex: swiper.activeIndex,
                    showOne:false,
                });
            },
            onTouchMove: function(swiper, event){
                if(self.state.currentIndex !== 0 &&self.state.currentIndex === self.state.cardList.length-1){
                    document.querySelector('.check-more-tip-2').style.right = (0 -30 - swiper.touches.diff/3)+'px';
                    document.querySelector('.check-more-tip-2').style.transition = 'right 0s';
                }
            },
            onTransitionStart: function(swiper){
                if(self.state.currentIndex !== 0 &&self.state.currentIndex === self.state.cardList.length-1){
                    document.querySelector('.check-more-tip-2').style.right = '-50px';
                    document.querySelector('.check-more-tip-2').style.transition = 'right 0.6s';
                }
            }
		})
		// 图片宽度大于容器宽度的72%
		if (this.mainImages[0].width > this.swiperContainer.width * 0.72) {
			self.resetImgStyle = true;
			// 需要重置的样式
			var width = this.swiperContainer.width * 0.72;
			var height = width / 0.563;
			// 图片宽度等于容器宽度的72%时，图片高度可能会超出容器高度，此时给个88%的固定值
			if(height > this.swiperContainer.height * 0.88){
				height = this.swiperContainer.height * 0.88;
				width = height * 0.563;
			}
			this.mainImages.map(function(item,index){
				item.css({
					width: width,
					height: height
				})
			});
			self.resetWidth = width;
			self.resetHeight = height;
			self.$customCard.css({
				width: width,
				height: height
			});
			self.$customDefaultTip.css({
				width: width,
				height: height
			});
		}
    }

    // initSwiperScript(){
    //     let that = this;
    //     that.initSwiper();
    // }

    initCardSaveLog(){
        var self = this
        if (isAndroid() || isIOS()) {
			this.mainImages.map(function(item,index){
				item.addEventListener('touchstart', self.startFn.bind(self), false);
			})
            document.addEventListener('touchend', this.endFn.bind(this), false);
			document.addEventListener('touchcancel', this.endFn.bind(this), false);
        } else {
			this.mainImages.map(function(item,index){
				item.addEventListener('mousedown', self.mouseRightFn.bind(self), false);
			})
		}
    }

    startFn (e){
		var self = this;
        this.isTouching=true;
		var touchPicKey=this.state.logKey[this.state.currentIndex];
			touchPicKey=touchPicKey.split("/");
            touchPicKey=touchPicKey[touchPicKey.length-1];
		this.touchTimer = setTimeout(function(){
			if(self.isTouching){
				self.calllog(touchPicKey);
			}
		},700);
	}
	endFn (){
		if(this.isTouching){
			clearTimeout(this.touchTimer);
			this.isTouching= false;
		}
	}
	mouseRightFn (e){
		if(e.button===2){
			var touchPicKey=this.state.logKey[this.state.currentIndex];
			touchPicKey=touchPicKey.split("/");
			touchPicKey=touchPicKey[touchPicKey.length-1].split(".")[0];
			this.calllog(touchPicKey);
		}
	}
	/**
     * 记录每次长按邀请卡的操作，打印记录邀请卡名字及统计长按率
     *
     * 记录每次长按话题/系列课/直播间邀请卡的操作将会记录一条日志，
     * 表示当次搜索是有效搜索，且一次搜索结果只记录一次。一个临时处理方法便
     * 是每次搜索出结果，打印success日志时将validState设置为true，打过一次
     * valid日志后便设置为false，防止重复打日志
     *
     */

    /**
     * 打日志
     *
     * @param {string} type 邀请卡类型，有效值为 topic|channel|live|distr
     * @param {string} picKey  长按图片的标志
     */
    calllog (picKey) {
        window._qla && window._qla('event',{
            category: 'shareCardTouch',
            action: "success",
            business_name: picKey,
		})
    }

    render() {
        return (
            <Page title={this.state.theme.title} className='coral-theme-card'>
                <div className={this.props.location.query.btn=='Y'?"share":"shared"}>
                    <div className = "swiper-container"  ref={(el)=>{this.swiperContainer = el}}>
                        <div className = "swiper-wrapper" id="swiper" style={{visibility: 'hidden'}}>
                            {
                                this.state.cardList.length >0 && this.state.cardList.map((item,index)=>{
                                    return <div className = "swiper-slide" key={`swiper-${index}`}>
                                        <img id="image-temp" 
                                            data-card ={this.state.theme.inviteCardUrl[index]}
                                            className={`main-img on-visible`}
                                            ref={(el)=>{this.mainImages[index] = el}}
                                            data-log-name="珊瑚计划专题邀请卡"
                                            data-log-region="visible-coral-theme-card"
                                            data-log-pos="personPartyThemeInviteCard"
                                            src = {item.url} />
                                    </div>
                                })
                            }
                            
                        </div>
                        <div className = "swiper-pagination"></div>
                    </div>
                    {
                        this.props.location.query.btn=='Y'&& 
                        this.state.cardList.length >0 && 
                        this.state.cardList[0]&& this.state.cardList[0].drawed && 
                        <div className = "tips">—— 长按图片，保存或发送给朋友 ——</div>
                    }
                    
                    {
                        this.state.currentIndex !== 0 && 
                        this.state.currentIndex === (this.state.cardList.length-1) &&
                        <div className = "check-more-tip-2">已 经 到 底 了</div>
                    }
                </div>
                {   this.state.cardList.length>1 && this.state.currentIndex ===0 && this.state.showOne &&
                    this.state.cardList[0]&& this.state.cardList[0].drawed && 
                    <div className = "check-more-tip">
                        <span>向 左 滑 动 查 看 更 多</span>
                    </div>
                }
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        userInfo: state.common.userInfo,
        theme: state.shop.theme,
        myIdentity: state.mine.myIdentity || {},
    }
}

const mapActionToProps = {
    getUserInfo,
    bindOfficialKey,
    getOneTheme,
    getFollowQr,
};

module.exports = connect(mapStateToProps, mapActionToProps)(ThemeCardPage);