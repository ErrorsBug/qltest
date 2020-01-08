import React, {Component} from 'react';
import { connect } from 'react-redux';
import { pushDistributionCardMaking } from './draw-push-card';
import { isIOS, isAndroid } from "components/envi";


import { share, closeShare } from 'components/wx-utils'

import Page from 'components/page';
import { getUserInfo, getFollowQr } from '../../../actions/common';
import { getBackgroundUrlList } from "../../../actions/gift";


class CoralShare extends Component {

	
	state={
        cardList:[],
        logKey:[],
        currentIndex:0,
        showOne:true,
    }
    mainImages=[]


    componentDidMount(){
        this.initData();
        
       
    }
    async initData(){
        await this.props.getUserInfo();
        let qrCodeResult = await this.props.getFollowQr({channelCode:'personPartyVipInviteCard',userId: this.props.userInfo.userId});
        let qrcodeUrl = qrCodeResult.data.qrUrl;
        this.setState({
            qrcodeUrl,
        });
        this.initShare();
        await this.getBgList();

        
        window.sessionStorage.setItem('index', 0);
        
        this.drawCardFunc(0);
        setTimeout(()=>{
            this.initCardSaveLog();
        },100);
    }

    async getBgList(){
        let result = await this.props.getBackgroundUrlList();
        if(result.state.code === 0){
            let cardList = result.data.dataList.map((item)=>{
                return {
                    url: item,
                    drawed:false,
                }
            });
            this.setState({
                logKey: result.data.dataList,
                cardList,
            },()=>{
                if(this.state.logKey.length>0){
                    this.initSwiper();
                }
            });
        }
        
    }

    initShare(){
        let isNl = "\n";
        share({
            title: `${this.props.userInfo.name}邀请您加入千聊官方课代表开启知识分享之旅`,
            desc: `买课省钱，卖课赚钱${isNl}点击立即加入`,
            imgUrl: this.props.giftBagData.backgroundUrl||"",
            shareUrl: `${window.location.origin}/wechat/page/coral/intro?officialKey=${this.props.userInfo.userId}`,
	        successFn: () => {
                window.toast("分享成功！");
                if(window._qla){
	                _qla('event', {
		                category: 'wechat_share',
		                action: 'success',
                        type: '99gift'
	                });
                }
            }
        });
    }

    drawCardFunc(index){
        let bgUrl = this.state.cardList[index].url;
        loading(true);
        pushDistributionCardMaking(bgUrl?bgUrl:"https://img.qlchat.com/qlLive/coral/share-card-bg_2.png",this.updateShareCard.bind(this), true, "A", 620, 930 ,this.state.qrcodeUrl);
    }

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
                    self.drawCardFunc(swiper.activeIndex);
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

    render() {
        return (
            <Page title="分享" className='coral-share-card'>
                <div>
                    <div className = "swiper-container" ref={(el)=>{this.swiperContainer = el}}>
                        <div className = "swiper-wrapper" id="swiper" style={{visibility: 'hidden'}}>
                            
                            {
                                this.state.cardList.length >0 && this.state.cardList.map((item,index)=>{
                                    return <div className = "swiper-slide" key={`swiper-${index}`}>
                                        <img id="image-temp" 
                                            data-card = {this.state.logKey[index]}
                                            className={`main-img on-visible`}
                                            ref={(el)=>{this.mainImages[index] = el}}
                                            data-log-name="珊瑚计划礼包邀请卡"
                                            data-log-region="visible-coral-share-card"
                                            data-log-pos="personPartyVipInviteCard"
                                            src = {item.url} />
                                    </div>
                                })
                            }
                            
                        </div>
                        <div className = "swiper-pagination"></div>
                    </div>
                    {
                        this.state.cardList[0]&& this.state.cardList[0].drawed && 
                        <div className = "tip">—— 长按图片，保存或发送给朋友 ——</div>
                    }
                    {   this.state.currentIndex !==0&& 
                        (this.state.currentIndex === this.state.cardList.length-1)&&
                        <div className = "check-more-tip-2" >已 经 到 底 了</div>
                    }
                </div>
                
                {   this.state.cardList.length>1 && this.state.currentIndex === 0 && this.state.showOne &&
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
        giftBagData: state.gift.giftBagData,
        myIdentity: state.mine.myIdentity||{},
    }
}

const mapActionToProps = {
    getUserInfo,
    getFollowQr,
    getBackgroundUrlList,
}

module.exports = connect(mapStateToProps, mapActionToProps)(CoralShare);
