import React, {Component} from 'react';
import { connect } from 'react-redux';
import Swiper from 'react-swipe';
import { autobind } from 'core-decorators';
import Indicator from './components/swiper-indicator';
import CoralPushImgBox from './components/coral-push-img';
import CoralTabBar from 'components/coral-tabbar';
import CoralJoinBox from 'components/dialogs-colorful/coral-join';
import CategoryMenu from 'components/category-menu';
import ScrollToLoad from 'components/scrollToLoad';
import { AudioPlayer } from 'components/audio-player';
import ShopList from './components/shop-list';
import RankList from './components/rank-list';
import CoralPromoDialog from 'components/dialogs-colorful/coral-promo-dialog';

import {
    locationTo,
	formatMoney
} from 'components/util';
import {
	getUrlParams,
	fillParams
} from 'components/url-utils';
import Detect from 'components/detect';
import { Confirm } from 'components/dialog';
import { share, closeShare } from 'components/wx-utils'


// actions
import { bindOfficialKey, getUserInfo, getCoralProfitConfig } from '../../actions/common';
import { getMyIdentity } from '../../actions/mine';

import { 
    getShopCourseList, 
    getCoursetagList, 
    setJoinCollection,
    getShopBannerList,
    getShopRankList,
	getExcellentRankList,
    getShopRecommendList,
    getShopPushImg,
    getThemeIcon,
    getImgUrlConfig
 } from '../../actions/shop';


import Page from 'components/page';
const showGoodieBag = true;
let recomObj={};//this.data.recommendList
let normalObj={};//this.data.tagLoadObj

@autobind
class Shop extends Component {

    state={
        
        coralPushData:{},
        coralJoinVisible:!this.props.myIdentity.identity,
        coralPushImgVisible: false,
        imgPushData:{
            backgroundUrl:'https://img.qlchat.com/qlLive/topicHeaderPic/thp-4.jpg',
        },
        emptyPicIndex:1,
        categoryId: Number(this.props.location.query.tagId) || 0,
        tagLoadObj:{},

        pageRankNum:1,
        pageRankSize:10,

        rankCourseList:[],

        bannerList:[],
	    recommendList: {},
        activeBannerIndex:0,
        audioSrc:"",
        courseAudioIndex:0, //当前试听的课程索引
        currentAudioIndex:0, //当前课程试听的音频列表的播放的音频索引
        audioDuration:0, //当前试听已完成播放音频的累计时间/秒

        showCoralPromoDialog: false,
	    coralPromotionPanelNav: 'material',

        showGoToPlaying: false,//返回试听位置按钮是否显示
        tagListeningId: '',//normal音频正在播放的tagId，返回播放位置用到，播放逻辑也有用到
        themeIcons:[],
        maxNum:0,
        liSpan: '',

        bachelorRecommendProfit: 0,
        doctorRecommendProfit: 0,
        personShareBackgroundUrl: '',
        

        
    };

    data={
        recommendList:{},
        tagLoadObj: {},
        audioStatus: '',//语音状态
        audioListType: '',

        recommendTagListeningId:'',
    };

    

    componentDidMount(){
        this.initData();
    }

    initAudioEvent(){//语音初始化
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.on('play',(e)=>{
            this.audioPlayingTimer&&clearInterval(this.audioPlayingTimer);
            this.audioPlayingTimer = setInterval(()=>{
                if(this.audioPlayer.currentTime > 600 || this.state.audioDuration + this.audioPlayer.currentTime > 600){
                    console.log("超过10分钟！");
                    this.stopAudio();
                }else{
                    this.scrollArea=="Y"?
                    this.setState({
                        showGoToPlaying : true,
                    })
                    :
                    this.setState({
                        showGoToPlaying : false,
                    })
                }                
            },1000);
            
        });
        this.audioPlayer.on("ended", ()=>{
            console.log("现在播放了秒数："+Number(this.state.audioDuration+this.audioPlayer.duration));
            console.log(this.state.currentAudioIndex);
            this.audioPlayer.currentTime=0;
            this.setState({
                audioDuration: this.state.audioDuration + this.audioPlayer.duration,
                currentAudioIndex: ++this.state.currentAudioIndex,
            },()=>{
                console.log(this.state.currentAudioIndex);
                console.log("现在播放了秒数："+this.state.audioDuration);
                let recommendList = this.data.audioListType==='recommend'?[...recomObj[this.data.recommendTagListeningId].recommendList]:[];
                let courseListArray = this.data.audioListType==='normal'?[...normalObj[this.state.categoryId].courseListArray]:[];
                if(this.data.audioListType==='recommend'&&!!recommendList[this.state.courseAudioIndex].speakList[this.state.currentAudioIndex]){
                    this.playAudioArray(this.audioPlayer, recommendList[this.state.courseAudioIndex].speakList, this.state.currentAudioIndex, ()=>{
                        this.audioPlayer.play(this.state.audioSrc);
                    });
                }else if(this.data.audioListType==='normal'&&!!courseListArray[this.state.courseAudioIndex].speakList[this.state.currentAudioIndex]){
                    this.playAudioArray(this.audioPlayer, courseListArray[this.state.courseAudioIndex].speakList, this.state.currentAudioIndex, ()=>{
                        this.audioPlayer.play(this.state.audioSrc);
                    });
                }else{
                    this.stopAudio();
                }                        
            });           
        });
        this.audioPlayer.on("pause", (e) => {
            this.audioPlayingTimer&&clearInterval(this.audioPlayingTimer);
            this.setState({
                showGoToPlaying : false,
            });
        });
        this.audioPlayer.on("error", (e) => {
            console.error(e);
            this.startCheckPlaying(this.audioPlayer,this.data.audioListType);
        });
    }

    async initLinkData(){
        const task = [];
	    if(!this.props.userInfo.userId){
		    task.push(this.props.getUserInfo());
	    }
        if(this.props.myIdentity.identity === undefined){
	        task.push(this.props.getMyIdentity());
        }
	    return await Promise.all(task);
    }
    	
    async initData(){
        // Link过来的
        await this.initLinkData();
        // 获取配置的弹窗图片和中部横幅图片
        await this.props.getImgUrlConfig();

        await this.props.getCoursetagList(Number(this.props.location.query.tagId));
        
        setTimeout(() => {
            typeof _qla === 'undefined' || _qla.collectVisible();
        }, 0);

        this.getShopBannerList();
        this.getShopRankList();
        this.getShopRecommendList();
        this.initProfitConfig();
        this.props.myIdentity.identity && this.getShopPushImg();

	    await this.props.getCoursetagList(Number(this.props.location.query.tagId));
        this.props.tagList.map((item,index)=>{
            normalObj[item.id]={pageNum:0,noMore:false,noOne:false,courseListArray:[]};
        });
        this.setState({
            categoryId: Number(this.props.location.query.tagId) || this.props.tagList[0].id,
            tagLoadObj:normalObj,
        },()=>{
            this.loadCourseListFunc();
        });
        
	    this.initShare();
        let iconResult = await this.props.getThemeIcon();
        if(iconResult.state&&iconResult.state.code == 0){
            let liSpan='';
            let themeliSize = 25;
            let themeIconsLength = iconResult.data&&iconResult.data.list&&iconResult.data.list.length;
            let a=1;
            let maxNum=3;
            if(Number(themeIconsLength%3)===0){
                liSpan='size-there';
                themeliSize=(100/3).toFixed(2);
                a=Math.floor(themeIconsLength/3);
                maxNum=a*3;
            }else if(Number(themeIconsLength%4)===0||themeIconsLength>4){
                liSpan='size-four';
                themeliSize=(100/4).toFixed(2);
                a=Math.floor(themeIconsLength/4);
                maxNum=a*4;
            }
            
            this.setState({
                liSpan,
                themeliSize,
                maxNum,
                themeIcons: iconResult.data.list||[],
            });
        }

	    if(!this.props.myIdentity.identity && this.props.location.query.officialKey){
		    this.props.bindOfficialKey({
			    officialKey: this.props.location.query.officialKey
		    });
	    }


    }

    initShare(){
	    share({
		    title: `${this.props.userInfo.name}推荐千聊知识商城，百万好课，想学的都在这。`,
		    timelineTitle: `${this.props.userInfo.name}推荐千聊知识商城，百万好课，想学的都在这。`,
		    desc: '我在千聊为自己充电，一起来为大脑加餐吧！',
		    timelineDesc: `${this.props.userInfo.name}推荐千聊知识商城，百万好课，想学的都在这。`, // 分享到朋友圈单独定制
		    imgUrl: 'https://img.qlchat.com/qlLive/activity/image/7JEKE2L2-44H5-3JHN-1562313091323-E8GJA3C8BYXE.png',
		    shareUrl: fillParams({
                officialKey: this.props.userInfo.userId
            }),
	    });
    }

    initCoralShare(data) {
        let wxqltitle = data.businessName;
        let descript = data.description;
        let wxqlimgurl = data.businessImage;
        let friendstr = wxqltitle;
        let shareUrl = data.url||(data.businessType==="CHANNEL"?
            window.location.origin + "/live/channel/channelPage/"+data.businessId+".htm?"
            :
            window.location.origin+'/topic/details?topicId='+data.businessId+'&');

        wxqltitle = "我推荐-" + wxqltitle;
        friendstr = "我推荐-" + friendstr;
        if(!/(officialKey)/.test(shareUrl)){
            shareUrl = fillParams({officialKey:this.props.userInfo.userId},shareUrl);
        }
        shareUrl = fillParams({sourceNo:'link',pro_cl:'coral'},shareUrl);
        
        

        const { isSubscribe, isLiveAdmin } = this.props
        let onShareComplete = () => { console.log('share completed!')}
        share({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            timelineDesc: friendstr, // 分享到朋友圈单独定制
            imgUrl: wxqlimgurl,
            shareUrl: shareUrl,
            successFn: onShareComplete,
        });
    }

	async initProfitConfig(){
        const res = await this.props.getCoralProfitConfig();
        if(res.state.code === 0){
            this.setState({
	            bachelorRecommendProfit: res.data.xRecommendCoursePercent,
                doctorRecommendProfit: res.data.bRecommendCoursePercent,
                personShareBackgroundUrl: res.data.personShareBackgroundUrl||'',
            })
        }
    }
    
    
    async getShopRankList(){
        let result=await this.props.getShopRankList({
            pageNum: 1,
            pageSize: 10
        });
        const rankList = result.data && result.data.list && result.data.list || [];
        this.setState({
            rankCourseList: rankList,
        })
    }
    async getShopBannerList(){
        const res = await this.props.getShopBannerList();
        if(res.state.code === 0){
            this.setState({
	            bannerList: res.data.list || []
            })
            this.bannersFlag = this.bannersFlag || 1;//banner的swiper组件需要传值，别删掉
            this.bannersFlag += 1;
        }
    }
    async getShopRecommendList(){
	    const res = await this.props.getShopRecommendList();
	    if(res.state.code === 0){
            
            recomObj = res.data.list||{};
		    this.setState({
			    recommendList: res.data.list || []
		    });
        }
        this.initAudioEvent();
    }

    //请求课程列表
    async loadCourseListFunc(next){
        const tagId=this.state.categoryId;
        normalObj[tagId].pageNum++;
        await this.props.getShopCourseList(tagId,normalObj[tagId].pageNum,10);
        normalObj[tagId].courseListArray=[...normalObj[tagId].courseListArray,...this.props.courseList];

        if(normalObj[tagId].courseListArray.length>0&&this.props.courseList.length<10){
            normalObj[tagId].noMore=true;
        }
        if(normalObj[tagId].courseListArray.length<=0&&normalObj[tagId].pageNum==1){
            if(this.props.courseList.length<=0){
            normalObj[tagId].noOne=true;
            }
        }
        this.setState({
            tagLoadObj:normalObj,
        },function(){
            next&&next();
        });
        
    }

    async getShopPushImg(){
        let result=await this.props.getShopPushImg();
        if(result.state.code === 0){
		    this.setState({
                imgPushData: {...result.data},
                coralPushImgVisible: !this.state.coralJoinVisible&&!!result.data.url&&(window.localStorage.getItem("coral-img-pushed") <= new Date().getTime()),
		    });
        }
    }

    // 更改分类
    handleCategoryClick(categoryId, isSubMenuItem, e) {
        if (isSubMenuItem&&isSubMenuItem.preventDefault) {
            e = isSubMenuItem;
            isSubMenuItem = false;
        }
        

        if (categoryId != this.state.categoryId) {
            // 打印分类pv日志
            this.categoryPvLog();

            // 更改分类
            this.setState({
                categoryId,
            },()=>{
                if(this.data.audioStatus === 'playing'&&this.state.tagListeningId !== this.state.categoryId){
                    this.scrollArea = "Y";
                }else{
                    this.scrollArea = "N"; 
                }
                setTimeout(()=>{
                    if(this.state.tagLoadObj[categoryId].pageNum<1){
                        this.loadCourseListFunc();
                    }
                    window.history.pushState('forward', '知识分享商城', '/wechat/page/coral/shop?tagId='+categoryId);
                    this.initShare();
                },400)
            });
        }
    }
    categoryPvLog() {
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla('pv', {

            });
        }, 0);
    }

    async showCoralPromoDialog(data, nav){

	    this.setState({
		    showCoralPromoDialog: true,
		    coralPromotionPanelNav: nav || 'tutorial',
		    coralPushData:data,
	    },function(){
		    this.initCoralShare(data);
	    });

    }

    async setCoralPushJoin(course,tagId,index){
        //加入推广，并弹开推广弹框
        if(!this.props.myIdentity.identity){
            this.setState({
                coralJoinVisible:!this.props.myIdentity.identity
            })
        }else{
            console.log("join:");
            const result = await this.props.setJoinCollection(this.props.userInfo.userId,course.id,course.businessId,course.businessType);
            if(result.state.code === 0){
                window.toast('已成功加入推广列表',3000);
                normalObj[tagId].courseListArray[index].shared = true;
                this.setState({
                    tagLoadObj:normalObj,
                });
            }
            this.showCoralPromoDialog(course);
        }
    }

    onCloseJoinBox(){
        if(!!this.props.myIdentity.identity){
            window.localStorage.removeItem("coralJoinBoxShow");
        }
        this.setState({
            coralJoinVisible:false,
        });
    }

    onJoinFunc(){
        this.props.location.query.officialKey?
        locationTo("/wechat/page/coral/intro?officialKey="+this.props.location.query.officialKey)
        :
        locationTo("/wechat/page/coral/intro")
    }

    onClosePushImgBox() {
        // let nowTime=(new Date().getTime()+3600000*24);//一天后的推广图片
        // window.localStorage.setItem("coral-img-pushed",nowTime);
        this.setState({
            coralPushImgVisible:false,
        })
    }

    onSwiped(index) {
        this.setState({
            activeBannerIndex: index
        });

        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    handleIdicatorItemClick(e, index) {
        if (this.refs && this.refs.swiperObj && this.refs.swiperObj.swipe) {
            this.refs.swiperObj.swipe.slide(index, 50);
        }
    }

    bannerClickHandle(url){
        if(this.props.userInfo.userId){
            locationTo(fillParams({
                officialKey: this.props.userInfo.userId
            }, url))
        }else{
	        locationTo(url);
        }
    }

    // 获取banner展示el
    getRecommendHeaderBannerEl() {
        return (
            <div className='recommend-header'>
            <Swiper
                ref="swiperObj"
                className='recommend-swiper'
                key={this.bannersFlag}
                swipeOptions={{ auto: 5000, callback: this.onSwiped.bind(this) }} >
                {
                    this.state.bannerList.map((item, index) => (
                        <div
                            key={`recommend-swiper-item${index}`}
                            data-url={`${item.url}`}
                            onClick={() => this.bannerClickHandle(item.url)}
                            className='recommend-swiper-item on-log'
                            data-log-region="banner"
                            data-log-pos={"banner" + index+1}
                            data-log-business_id={item.mainId}
                            data-log-name={item.topic}
                            data-log-business_type={item.type}
                        >
                            <span style={{ backgroundImage: `url(${item.backgroundUrl}@290h_750w_1e_1c_2o)` }}></span>
                        </div>
                    ))
                }
            </Swiper>

            <Indicator
                size={this.state.bannerList.length}
                activeIndex={this.state.activeBannerIndex}
                onItemClick={this.handleIdicatorItemClick.bind(this)}>
            </Indicator>
        </div>
        );
    }

	async recommendListJoinBtnClickHandle(e,data,i,tagIndex){
        e.stopPropagation();
		//加入推广，并弹开推广弹框
        if(!this.props.myIdentity.identity){
            this.setState({
                coralJoinVisible:!this.props.myIdentity.identity
            })
        }else{
            console.log("join:");
            const res = await this.props.setJoinCollection(this.props.userInfo.userId,data.id,data.businessId,data.businessType);
            if(res.state.code === 0){
                let recommendList = [...this.state.recommendList];
                recommendList[tagIndex].recommendList[i].shared = true;//推荐列表中加入推广
                this.setState({
                    recommendList
                });
            }
            this.showCoralPromoDialog(data);
        }
        
    }

    playAudioArray (audio, speakList, audioIndex, callback) {
            this.setState({
                audioSrc : speakList[audioIndex]
            },()=>{
                
                callback&&callback();
                
            })        
    }

    async playAudioFunc(arrayobj,otherObj,index,type,recommendTagListeningId){
        if(type!==this.data.audioListType||index!==this.state.courseAudioIndex||this.state.categoryId!==this.state.tagListeningId||this.data.recommendTagListeningId !== recommendTagListeningId){
            if(this.state.categoryId!==this.state.tagListeningId){
                
                if(this.data.audioListType&&type!==this.data.audioListType){
                    if(type== 'normal'){
                        this.changeListAudioStatus(otherObj,index,'recommend',true,this.data.recommendTagListeningId);
                    }else if(type== 'recommend'){
                        this.changeListAudioStatus(otherObj,index,'normal',true);
                        this.data.recommendTagListeningId = recommendTagListeningId;
                    }
                    this.setState({
                        tagListeningId: this.state.categoryId,
                    });
                }else{
                    if(this.state.tagListeningId!==''){
                        let initOldAudioArray = normalObj[this.state.tagListeningId].courseListArray;
                        this.changeListAudioStatus(initOldAudioArray,this.state.courseAudioIndex,'normal',true);
                    }
                        this.setState({
                            tagListeningId: this.state.categoryId,
                        });
                        this.data.recommendTagListeningId = recommendTagListeningId;
                }
            }else
            if(type!==this.data.audioListType){
                if(type== 'normal'){
                    this.changeListAudioStatus(otherObj,index,'recommend',true,this.data.recommendTagListeningId);
                }else if(type== 'recommend'){
                    this.changeListAudioStatus(otherObj,index,'normal',true);
                    this.data.recommendTagListeningId = recommendTagListeningId;
                }
            }else
            if(recommendTagListeningId!==""&&this.data.recommendTagListeningId !== recommendTagListeningId){//推荐列表的不同tag下列表语音
                if(this.data.recommendTagListeningId!==''){
                    let initOldAudioArray = recomObj[this.data.recommendTagListeningId].recommendList;
                    this.changeListAudioStatus(initOldAudioArray,this.state.courseAudioIndex,'recommend',true,this.data.recommendTagListeningId);
                }
                    this.data.recommendTagListeningId = recommendTagListeningId;
            }
            let recommendList = [...recomObj[((recommendTagListeningId||this.data.recommendTagListeningId)||0)].recommendList];
            let courseListArray = [...normalObj[this.state.categoryId].courseListArray];

            arrayobj=(type== 'normal')?courseListArray:recommendList;
            this.playAudioArray( this.audioPlayer, arrayobj[index].speakList, 0, ()=>{                
                arrayobj = this.changeListAudioStatus(arrayobj,index,type,false);
                if(type== 'normal'){
                    normalObj[this.state.categoryId].courseListArray=arrayobj;
                    this.setState({
                        tagLoadObj: normalObj,
                        recommendList:recomObj,
                                                
                    });

                }else if(type== 'recommend'){
                    recomObj[this.data.recommendTagListeningId].recommendList=arrayobj;
                    this.setState({
                        tagLoadObj: normalObj,
                        recommendList: recomObj,                       
                    });
                }

                this.setState({
                    currentAudioIndex: 0,
                    courseAudioIndex:index,
                    audioDuration:0,
                });

                this.data.audioStatus = 'playing';
                this.data.audioListType = type;
                this.audioPlayer.play(this.state.audioSrc);
            });
        }else{
            this.playAudioArray( this.audioPlayer, arrayobj[index].speakList, this.state.currentAudioIndex, ()=>{
                arrayobj[index].audioStatus='playing';
                this.data.audioStatus = 'playing';
                this.data.audioListType = type;
                
                if(type== 'normal'){
                    normalObj[this.state.categoryId].courseListArray=arrayobj;
                    this.setState({
                        tagLoadObj: normalObj,
                    });
                }else if(type== 'recommend'){
                    recomObj[this.data.recommendTagListeningId].recommendList=arrayobj;
                    this.setState({
                        recommendList: recomObj,
                                                
                    });
                }
                let thisCurrentTime=this.audioPlayer.currentTime;
                this.audioPlayer.play(this.state.audioSrc);
                this.audioPlayer.currentTime = thisCurrentTime;
                
            });
        }
        this.startCheckPlaying(this.audioPlayer,type);
    }

    changeListAudioStatus(arrayobj,index,type,reset,recommendTagListeningId){
        if(reset){
            arrayobj.map((item,i)=>{
                item.audioStatus='pause';
                return item;
            });
            if(type==="recommend"){
                recomObj[recommendTagListeningId].recommendList = arrayobj;
            }else if(type==="normal"){
                normalObj[this.state.tagListeningId].courseListArray = arrayobj;
            }
            
        }else{
            arrayobj.map((item,i)=>{
                if(index==i){
                    item.audioStatus='playing'; 
                }else{
                    item.audioStatus='pause';
                }
                return item;
            });
            return arrayobj;
        }
        
        
    }

    onListenAudioPlay(e,index,type,recommendtagIndex){
        e.stopPropagation();
        let recommendList = [...recomObj[((recommendtagIndex||this.data.recommendTagListeningId)||0)].recommendList];
        let courseListArray = [...normalObj[this.state.categoryId].courseListArray];
            if(type=='normal'&&courseListArray[index].speakList&&courseListArray[index].speakList.length>0){
                this.playAudioFunc(courseListArray,recommendList,index,type,"");
            }else
            if(type=='recommend'&&recommendList[index].speakList&&recommendList[index].speakList.length>0){
                this.playAudioFunc(recommendList,courseListArray,index,type,recommendtagIndex);
            }else{
                window.toast("暂无试听音频");
            }
            
    }
    onListenAudioPause(e,index,type){
        e.stopPropagation();
        if(type == 'recommend'){
            let recommendList = [...recomObj[this.data.recommendTagListeningId].recommendList];
            recommendList[index].audioStatus='pause';
            recomObj[this.data.recommendTagListeningId].recommendList = recommendList;
            this.setState({
                recommendList: recomObj,
            });
        }else if(type == 'normal'){
            let courseListArray = [...normalObj[this.state.categoryId].courseListArray];
            courseListArray[index].audioStatus='pause';
            normalObj[this.state.categoryId].courseListArray = courseListArray;
            this.setState({
                tagLoadObj: normalObj,
            });
        }
        this.data.audioStatus = 'pause';
        this.audioPlayer.pause();
    }

        /**
     * 开始检查音频卡住计时器
     *
     * @param {any} e
     * @memberof Audio
     */
    startCheckPlaying(audio,type){
        this.clearCheckPlaying();
        let recommendList = this.data.recommendTagListeningId!==''?[...recomObj[this.data.recommendTagListeningId].recommendList]:[];
        let courseListArray = [...normalObj[this.state.categoryId].courseListArray];
        this.checkPlaying = setInterval(()=>{
            // 监听音频播放秒数是否变动，没有变动则加0.1秒再尝试播放
            let currentTime = audio.currentTime;
            if(this.lastCurrentTime == currentTime){
                currentTime += 0.1;
                this.setState({
                    currentTime: currentTime
                });
                audio.currentTime = currentTime;

                // 加loading  
                if(type=="normal"){
                    courseListArray[this.state.courseAudioIndex].audioStatus='loading';
                }else if(type== 'recommend'&&recommendList.length>0){

                    recommendList[this.state.courseAudioIndex].audioStatus='loading';
                }           
                
            }else{
                // 去掉loading
                if(type=="normal"){
                    courseListArray[this.state.courseAudioIndex].audioStatus='playing';
                }else if(type== 'recommend'&&recommendList.length>0){
                    recommendList[this.state.courseAudioIndex].audioStatus='playing';
                } 
                
                
            }
            normalObj[this.state.categoryId].courseListArray = courseListArray;
            if(this.data.recommendTagListeningId!==""){
                recomObj[this.data.recommendTagListeningId].recommendList = recommendList;
            } 
            this.setState({
                recommendList: recomObj,
                tagLoadObj: normalObj,
            });

            this.lastCurrentTime = currentTime;

            if((type=="normal"&&courseListArray[this.state.courseAudioIndex].audioStatus == 'playing')||(type=="recommend"&&recommendList[this.state.courseAudioIndex].audioStatus == 'playing')){
                this.clearCheckPlaying();
            }
        },2000);
    };


    /**
     * 清除检查音频卡住计时器
     *
     * @param {any} e
     * @memberof Audio
     */
    clearCheckPlaying(){
        this.setState({
            isAudioLoading: false,
        });
        this.checkPlaying && clearInterval(this.checkPlaying);
    };

    stopAudio(){
        this.audioPlayingTimer&&clearInterval(this.audioPlayingTimer);        
        this.audioPlayer.pause();
        // this.audioPlayer.currentTime=0;
        if(this.data.audioListType=="normal"){
            let courseListArray = [...normalObj[this.state.categoryId].courseListArray];
            courseListArray[this.state.courseAudioIndex].audioStatus='pause';
            normalObj[this.state.categoryId].courseListArray=courseListArray;
            this.setState({
                tagLoadObj: normalObj,
            })
        }else if(this.data.audioListType== 'recommend'){
            let recommendList = [...recomObj[this.data.recommendTagListeningId].recommendList];
            recommendList[this.state.courseAudioIndex].audioStatus='pause';
            recomObj[this.data.recommendTagListeningId].recommendList=recommendList;
            this.setState({
                recommendList: recomObj,
            })
        }
        this.setState({
            audioDuration: 0,
            currentAudioIndex: 0,
            showGoToPlaying : false,
        })
    }


	async materialBtnClickHandle(data){
        if(!this.props.myIdentity.identity){
            this.setState({
                coralJoinVisible:!this.props.myIdentity.identity
            })
        }else{
			this.showCoralPromoDialog(data, 'material');
        }
    }

    onCoralPromoDialogClose(e){
	    this.setState({
		    showCoralPromoDialog: false
	    });
	    this.initShare();
    }

	switchCoralPromotionPanelNav(type){
        this.setState({
            coralPromotionPanelNav: type
        })
    }

	pageOnScroll(){
        if (this.data.audioStatus === 'playing') {
            let playingDom = this.data.audioListType=="normal"?document.querySelector(`.shopListItem-${this.state.tagListeningId}-${this.state.courseAudioIndex}`):this[`recommendListItem-${this.data.recommendTagListeningId}-${this.state.courseAudioIndex}`];
            let scrollDom = document.querySelector(".shop-list-scroll");
			if (!playingDom) {
				return;
            }
            
			let selfHeight = playingDom.clientHeight;
            let selfTop = playingDom.offsetTop;
            let bodyHeight = document.body.clientHeight;
			if (scrollDom.scrollTop > (selfTop + selfHeight-50) || scrollDom.scrollTop < selfTop+selfHeight-bodyHeight+50  ) {
                this.scrollArea = "Y";
			}else{
                this.scrollArea = "N";
            }

		}
        this.setState({
            showGoToPlaying : false,            
        });
    }

    async goToPlaying(){
        await this.handleCategoryClick(Number(this.state.tagListeningId));
            setTimeout(()=>{
                let scrollDom = document.querySelector(".shop-list-scroll");
                let playingDom = this.data.audioListType=="normal"?document.querySelector(`.shopListItem-${this.state.tagListeningId}-${this.state.courseAudioIndex}`):this[`recommendListItem-${this.data.recommendTagListeningId}-${this.state.courseAudioIndex}`];
                if (!playingDom) {
                    return;
                }
                let selfHeight = playingDom.clientHeight;
                let selfTop = playingDom.offsetTop;
                scrollDom.scrollTop = selfTop;
                this.setState({
                    weightShow: true,
                },()=>{
                  setTimeout(()=>{
                    this.setState({
                        weightShow: false,
                    })
                  },1500);  
                });

            },200)
        
        // });
        
    }

	recommendTagMoreBtnClickHandle(index){
	    const recommendList = [...this.state.recommendList];
		recommendList[index].release = true;
		this.setState({
			recommendList
        })
    }

    render() {
        return (
            <Page title={`珊瑚优课精选`} className='coral-distribution-shop'>
                <div className="search-box">
                    <div className="content" onClick={() => locationTo('/wechat/page/search?source=coral')}>搜索话题/系列课/直播间</div>
                </div>
                <div className="shop-top">
                    <CategoryMenu
                        className={showGoodieBag ? "type-bar" : "type-bar-0"}
                        items={this.props.tagList}
                        activeId={this.state.categoryId}
                        onItemClick={this.handleCategoryClick.bind(this)}
                        autoScroll={false}
                    />
                </div>
                    
	            <div className="shop-content">
                    <div className="shop-list" onScroll={this.pageOnScroll}>
                        {/* 滚动加载列表 */}
                        {
                            this.state.tagLoadObj&&
                            this.state.tagLoadObj[this.state.categoryId]&&
                            <ScrollToLoad
                                className='shop-list-scroll'
                                ref='shopListScroll'
                                toBottomHeight={1000}
                                loadNext={this.loadCourseListFunc.bind(this)}
                                noneOne={this.props.tagList[0].id !== this.state.categoryId&&this.state.tagLoadObj[this.state.categoryId].noOne}
                                noMore={this.state.tagLoadObj[this.state.categoryId].noMore}
                                emptyPicIndex={this.state.emptyPicIndex}
                            >
                            {
                                this.props.tagList[0].id == this.state.categoryId &&
                                this.getRecommendHeaderBannerEl()
                            }

                            {
                                this.props.tagList[0].id == this.state.categoryId &&this.state.themeIcons.length>=3&&this.state.liSpan&&
                                <div className="theme-section">
                                    <ul className={this.state.liSpan}>
                                    {
                                        this.state.themeIcons.map((theme,index)=>{                                        
                                            if((index+1)<=this.state.maxNum){
                                                return (
                                                    <li 
                                                        className="on-log"
                                                        data-log-region="sh-store"
                                                        data-log-pos={index + 1}
                                                        data-log-name="图标"
                                                        style={{width:`${this.state.themeliSize}%`}} 
                                                        onClick={()=>{
                                                            locationTo(theme.url)
                                                        }}
                                                        key={`theme-list-${index}`}
                                                    >
                                                        <img src={`${theme.picture}`}/>
                                                        <span className="elli">{theme.iconName}</span>
                                                    </li>
                                                );
                                            }else{
                                                return null;
                                            }                                     
                                            
                                        })
                                    }
                                    </ul>
                                </div>
                            }

                            {
                                // this.props.tagList[0].id == this.state.categoryId &&
                                // (
                                //     this.props.myIdentity.identity
                                //     ?
                                //     <div 
                                //         className="btn-gift-guide_1 on-log on-visible" 
                                //         data-log-name="胶囊图标-会员"
                                //         data-log-region="sh-store"
                                //         data-log-pos="capsule"
                                //         onClick={()=>locationTo("/wechat/page/coral/share?officialKey="+this.props.userInfo.userId)}
                                //     ></div>                                
                                //     :
                                //     // 非会员
                                //     <img 
                                //         className="btn-gift-guide_2 on-log on-visible" 
                                //         data-log-name="胶囊图标-会员"
                                //         data-log-region="sh-store"
                                //         data-log-pos="capsule"
                                //         src={this.props.chartletUrl.middleJoinUrl} 
                                //         onClick={()=>locationTo(`/wechat/page/coral/intro${this.props.location.query.officialKey?'?officialKey='+this.props.location.query.officialKey:''}`)} 
                                //     />
                                    
                                // )
                            }

                            {
                                this.props.tagList[0].id == this.state.categoryId && !!this.state.rankCourseList.length &&
                                <RankList
                                    rankCourseList={this.state.rankCourseList}
                                    bachelorRecommendProfit ={this.state.bachelorRecommendProfit}
                                />
                            }
                            {
                                this.props.tagList[0].id == this.state.categoryId && !!this.state.recommendList.length &&
                                this.state.recommendList.map((tag, tagIndex) => (
                                    <div className="today-recommand-section" key={tagIndex}>
		                                {/*<div className="section-title today-title"><span>优课精选</span></div>*/}
                                        {
	                                        tag.bannerBackgroundUrl &&
                                            <div className="tag-banner" onClick={e => locationTo(tag.bannerUrl)}>
                                                <img src={tag.bannerBackgroundUrl + '@750w_1e_1c_2o'} alt=""/>
                                            </div>
                                        }
                                        {
	                                        tag.tagName &&
                                            <div className="tag-title">
		                                        {
			                                        tag.tagName.split('').map((l, i) => (
                                                        <span key={i}>
                                                        {l}
					                                        {
						                                        i < tag.tagName.length - 1 &&
                                                                <i>/</i>
					                                        }
                                                    </span>
			                                        ))
		                                        }
                                                <div className="ball"></div>
                                            </div>
                                        }
                                        {
	                                        tag.recommendList && !!tag.recommendList.length &&
                                            <ul className="today-ul">
		                                        {
			                                        tag.recommendList.map((item,index)=>{
				                                        if(!tag.release && index > 2){
					                                        return false;
				                                        }
				                                        return (
                                                            <li key={index} ref={(el) => {this[`recommendListItem-${tagIndex}-${index}`] = el}}>
                                                                <div 
                                                                    className="pic on-log"
                                                                    data-log-name="优课精选-课程点击"
                                                                    data-log-region="sh-store"
                                                                    data-log-pos="courseclick" 
                                                                    onClick={e => locationTo(item.url)}
                                                                >
							                                        {
								                                        item.tag=== 'HEAVY'?
                                                                            <i className="today-biao1"></i>
									                                        :
									                                        (
										                                        item.tag === 'HOT'?
                                                                                    <i className="today-biao2"></i>
											                                        :
											                                        (
												                                        item.tag === 'FINE'?
                                                                                            <i className="today-biao3"></i>
													                                        :null
											                                        )
									                                        )
							                                        }
                                                                    <img src={`${item.backgroundUrl}@290h_750w_1e_1c_2o`} />
                                                                </div>
                                                                <div className="name elli-text" onClick={e => locationTo(item.url)}>{item.businessName}</div>
                                                                <div className="info">
                                                                    <span className="study-time">{item.learningNum}次学习</span>
                                                                    <span className="price">售价:￥{item.isAuditionOpen !== 'Y'?formatMoney((item.amount || item.money)):0}</span>
                                                                    <div className="profit">￥{item.isAuditionOpen !== 'Y'?formatMoney((item.amount || item.money) * ((item.percent || this.state.bachelorRecommendProfit) / 100)):0}</div>
                                                                </div>
                                                                <div className={`options ${!this.props.myIdentity.identity ? 'shop-hide' : ''}`}>
							                                        {
								                                        item.audioStatus=='playing' ?
                                                                            <div className={this.state.weightShow?"pause-btn weightShow":"pause-btn"} onClick={(e)=>this.onListenAudioPause(e,index,"recommend")}>暂停试听<var className="audio-percent">{Number((this.state.audioDuration + this.audioPlayer.currentTime)/item.totalSeconds*100).toFixed(0)}%</var></div>
									                                        :
									                                        (
										                                        item.audioStatus =='loading' ?
                                                                                    <div className="audition-loading">正在加载</div>
											                                        :
                                                                                    <div 
                                                                                        className="audition-btn on-log" 
                                                                                        data-log-name="立即试听"
                                                                                        data-log-region="course-bottom"
                                                                                        data-log-pos="listen-recently"
                                                                                        onClick={e => this.onListenAudioPlay(e,index,"recommend",tagIndex)}
                                                                                    >立即试听</div>
									                                        )

							                                        }
                                                                    <div className="material-btn" onClick={this.materialBtnClickHandle.bind(this,item)}>推广素材</div>
							                                        {
								                                        item.shared ?
                                                                            <div className="sale-btn" onClick={e => this.showCoralPromoDialog(item)}>立即推广</div>
									                                        :
                                                                            <div 
                                                                                className="join-btn on-log" 
                                                                                data-log-name="加入推广"
                                                                                data-log-region="course-bottom"
                                                                                data-log-pos="join"
                                                                                onClick={e => this.recommendListJoinBtnClickHandle(e,item,index,tagIndex)}
                                                                            >加入推广</div>
							                                        }
                                                                </div>
                                                            </li>
				                                        )
			                                        })
		                                        }
                                            </ul>
                                        }
                                        {
                                            !tag.release && tag.recommendList && tag.recommendList.length > 3 &&
                                            <div
                                                className="more-btn on-log" 
                                                data-log-name="优课精选-更多"
                                                data-log-region="sh-store"
                                                data-log-pos="more"
                                                onClick={this.recommendTagMoreBtnClickHandle.bind(this, tagIndex)}
                                            >更多 <div className="arrow icon_down"></div></div>
                                        }
                                    </div>
                                ))
                            }

                            {this.props.tagList[0].id == this.state.categoryId?<div className="section-title best-title">精品推荐</div>:null}

                            {
                                this.state.tagLoadObj[this.state.categoryId]&&
                                this.state.tagLoadObj[this.state.categoryId].courseListArray&&
                                this.state.tagLoadObj[this.state.categoryId].courseListArray.length>0&&
                                <ShopList
                                    tagId={this.state.categoryId}
                                    shopList={this.state.tagLoadObj[this.state.categoryId].courseListArray}
                                    showCoralPromoDialog={this.showCoralPromoDialog}
                                    setCoralPushJoin={this.setCoralPushJoin}
                                    officialKey={this.props.userInfo.userId}
                                    onListenAudioPause= {this.onListenAudioPause}
                                    onListenAudioPlay= {this.onListenAudioPlay}
                                    playedDuration = {this.data.audioStatus === 'playing'?Number(this.state.audioDuration + this.audioPlayer.currentTime):0}
                                    weightShow = {this.state.weightShow}
                                    bachelorRecommendProfit ={this.state.bachelorRecommendProfit}
                                    identity={this.props.myIdentity.identity}
                                />
                                
                            }

                            {/* <audio id="audioSelector" src={this.state.audioSrc}></audio> */}
                            </ScrollToLoad>
                        }        
                    </div>
                    {/* <div 
                        className="into-btn on-log" 
                        data-log-name="培训群"
                        data-log-region="sh-store"
                        data-log-pos="pxq"
                        onClick={()=>locationTo("http://qlkthb.zf.qianliao.net/wechat/page/activity/wcGroup/qrCode?id=2000000453668208")}
                    ></div> */}
                    
				</div>
                <div className="shop-bottom">
                    <CoralTabBar className="coral-bottom"  activeTab="coral-shop" />
                </div>

                <div className={`back-to-playing-btn${this.state.showGoToPlaying ? ' show' : ''}`} onClick={this.goToPlaying}>返回试听位置</div>

                {/* <CoralJoinBox
                    show={this.state.coralJoinVisible}
                    onClose={this.onCloseJoinBox.bind(this)}
                    onJoin={this.onJoinFunc.bind(this)}
                    isCoralJoin={!this.props.myIdentity.identity}
                    headImgUrl={this.props.userInfo.headImgUrl}
                    memberBounceUrl={this.props.chartletUrl.memberBounceUrl}
                /> */}

                <CoralPromoDialog
                    show={this.state.showCoralPromoDialog}
                    close={this.onCoralPromoDialogClose}
                    nav={this.state.coralPromotionPanelNav}
                    switchNav={this.switchCoralPromotionPanelNav}

                    courseData={this.state.coralPushData}
                    officialKey={this.props.userInfo.userId}
                    userInfo = {this.props.userInfo}
                />

                <CoralPushImgBox 
                    show={this.state.coralPushImgVisible}
                    onClose={this.onClosePushImgBox.bind(this)}
                    pushData={this.state.imgPushData||{}}
                />
                
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        myIdentity: state.mine.myIdentity || {},
        courseList: state.shop.courseList,
        tagList: state.shop.tagList,
        userInfo: state.common.userInfo,
        bannerList: state.shop.bannerList || [],
        chartletUrl: state.shop.chartletUrl || {}
    }
}

const mapActionToProps = {
	getMyIdentity,  
	getUserInfo,
    getShopCourseList,
    getCoursetagList,
    setJoinCollection,
    getShopBannerList,
    getShopRankList,
	getExcellentRankList,
    getShopRecommendList,
    getShopPushImg,
    bindOfficialKey,
    getThemeIcon,
    getCoralProfitConfig,
    getImgUrlConfig
};

module.exports = connect(mapStateToProps, mapActionToProps)(Shop);
