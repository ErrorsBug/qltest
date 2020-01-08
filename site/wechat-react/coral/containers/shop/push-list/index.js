import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import {
	fillParams
} from 'components/url-utils';
import {
    locationTo,
    imgUrlFormat,
} from 'components/util';
import CoralPushBox from 'components/dialogs-colorful/coral-push-box';
import CoralJoinBox from 'components/dialogs-colorful/coral-join';
import CoralPromoDialog from 'components/dialogs-colorful/coral-promo-dialog';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { AudioPlayer } from 'components/audio-player';
import { share, closeShare } from 'components/wx-utils'
import ShopList from '../components/shop-list';

import { getUserInfo, getCoralProfitConfig } from '../../../actions/common';
import { getPushCourseList } from '../../../actions/shop';

let courseList=[];
@autobind
class CoralPushList extends Component {

    state={
        pageNum:0,
        pageSize:20,
        courseList:[],
        noMore:false,
        noOne:false,
        emptyPicIndex:1,

        showCoralPromoDialog:false,
        // coralPushVersible:false,
        coralPushData:{},

        coralJoinVisible: false,

        audioDuration: 0,
        currentAudioIndex: 0,
        courseAudioIndex:0,
        audioSrc: '',
    }

    data = {
        
        audioStatus:'',
        audioListType: 'normal',
        
    };

    componentDidMount(){
        this.initData();
        this.initAudioEvent();

        setTimeout(() => {
            if (typeof _qla === 'undefined') return;
            _qla.collectVisible();
            _qla.bindVisibleScroll('shop-list-scroll');
        }, 300);
    }
    initData(){
        this.loadPushCourseList();
        this.props.getUserInfo();
        this.initProfitConfig();
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

    initAudioEvent(){
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
            courseList = [...this.state.courseList];
            console.log("现在播放了秒数："+Number(this.state.audioDuration+this.audioPlayer.duration));
            console.log(this.state.currentAudioIndex);
            this.audioPlayer.currentTime=0;
            this.setState({
                audioDuration: this.state.audioDuration + this.audioPlayer.duration,
                currentAudioIndex: ++this.state.currentAudioIndex,
            },()=>{
                console.log(this.state.currentAudioIndex);
                console.log("现在播放了秒数："+this.state.audioDuration);
                if(!!courseList[this.state.courseAudioIndex].speakList[this.state.currentAudioIndex]){
                    this.playAudioArray(this.audioPlayer, courseList[this.state.courseAudioIndex].speakList, this.state.currentAudioIndex, ()=>{
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
            this.startCheckPlaying(this.audioPlayer);
        });
    }

    async loadPushCourseList(next){
        let pageNum=++this.state.pageNum;
        await this.props.getPushCourseList(pageNum,this.state.pageSize);
        if(this.props.courseList.length<=0){
            this.setState({
                noOne:true,
            });
        }else if(this.props.courseList.length>0&&this.props.courseList.length<(pageNum*this.state.pageSize)){
            this.setState({
                noMore:true,
            });
        }
        this.setState({
            courseList:this.props.courseList,
            pageNum,
        },function(){
            next&&next();
        });
        
    }

    // onCoralPush(data){
    //     if(!this.props.myIdentity.identity){
    //         this.setState({
    //             coralJoinVisible:!this.props.myIdentity.identity
    //         })
    //         return false;
    //     }
    //     this.setCoralPushData(data);
    // }

    async showCoralPromoDialog(data, nav){
        
	    this.setState({
		    showCoralPromoDialog: true,
		    coralPromotionPanelNav: nav || 'tutorial',
		    coralPushData:data,
	    },function(){
		    this.initShare(data);
	    });

    }

    onCoralPromoDialogClose(e){
	    this.setState({
		    showCoralPromoDialog: false
	    });
	    closeShare();
    }

    switchCoralPromotionPanelNav(type){
		this.setState({
			coralPromotionPanelNav: type
		})
    }


    async setCoralPushJoin(course){
        if(!this.props.myIdentity.identity){
            this.setState({
                coralJoinVisible:!this.props.myIdentity.identity
            })
            return false;
        }
        //加入推广，并弹开推广弹框
        console.log("join:");
        await this.props.setJoinCollection(this.props.userInfo.userId,course.id);
        this.showCoralPromoDialog(course);
    }

    onClosePushBox(){
        this.setState({
            coralPushVersible:false,
        });
        closeShare();
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

    async initShare(data) {
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

        const { isSubscribe, isLiveAdmin } = this.props;
        let onShareComplete = () => { console.log('share completed!')};
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


/******************试听功能方法***************/
    playAudioArray (audio, speakList, audioIndex, callback) {
        this.setState({
            audioSrc : speakList[audioIndex]
        },()=>{
            
            callback&&callback();
            
        })        
    }

    playAudioFunc(arrayobj,index){
        if(index!=this.state.courseAudioIndex){
            this.playAudioArray( this.audioPlayer, arrayobj[index].speakList, 0, ()=>{
                
                arrayobj = this.changeListAudioStatus(arrayobj,index,false);
                this.setState({
                    courseList:arrayobj,                                                
                });

                this.setState({
                    currentAudioIndex: 0,
                    courseAudioIndex:index,
                    audioDuration:0,
                });
                this.audioPlayer.play(this.state.audioSrc);
            });
        }else{
            this.playAudioArray( this.audioPlayer, arrayobj[index].speakList, this.state.currentAudioIndex, ()=>{
                arrayobj[index].audioStatus='playing';
                this.data.audioStatus = 'playing';                
                this.setState({
                    courseList:arrayobj,
                });
                let thisCurrentTime=this.audioPlayer.currentTime;
                this.audioPlayer.play(this.state.audioSrc);
                this.audioPlayer.currentTime = thisCurrentTime;
                
            });
        }
        this.startCheckPlaying(this.audioPlayer);
    }

    changeListAudioStatus(arrayobj,index,reset){
        if(reset){
            arrayobj.map((item,i)=>{
                item.audioStatus='pause';
                this.data.audioStatus = 'pause';
                return item;
            });
        }else{
            arrayobj.map((item,i)=>{
                if(index==i){
                    item.audioStatus='playing'; 
                    this.data.audioStatus = 'playing';
                }else{
                    item.audioStatus='pause';
                }
                return item;
            });
        }
        return arrayobj;
    }

    onListenAudioPlay(e,index,type){
        e.stopPropagation();
        console.log(type);
        courseList = [...this.state.courseList];
        this.setState({
            tagListeningId: this.state.categoryId,
        },()=>{
            if(type=='normal'&&courseList[index].speakList&&courseList[index].speakList.length>0){
                this.playAudioFunc(courseList,index);
            }else{
                window.toast("暂无试听音频");
            }
            
        });
    }
    onListenAudioPause(e,index,type){
        e.stopPropagation();
            courseList = [...this.state.courseList];
            courseList[index].audioStatus='pause';
            courseList[index].playing = false;
            this.setState({
                courseList
            });
        this.data.audioStatus = 'pause';
        this.audioPlayer.pause();
    }

        /**
     * 开始检查音频卡住计时器
     *
     * @param {any} e
     * @memberof Audio
     */
    startCheckPlaying(audio){
        this.clearCheckPlaying();
        courseList = [...this.state.courseList];
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
                

                    courseList[this.state.courseAudioIndex].audioStatus='loading';
                    courseList[this.state.courseAudioIndex].playing = false;
                    
                
            }else{
                // 去掉loading
                    courseList[this.state.courseAudioIndex].audioStatus='playing';
                    courseList[this.state.courseAudioIndex].playing = false;
                
                
            }
            this.setState({
                courseList,
            });

            this.lastCurrentTime = currentTime;

            if(courseList[this.state.courseAudioIndex].audioStatus == 'playing'){
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
        courseList = [...this.state.courseList];
        this.audioPlayer.pause();
        courseList[this.state.courseAudioIndex].audioStatus='pause';
        this.setState({
            courseList,
            audioDuration: 0,
            currentAudioIndex: 0,
            showGoToPlaying : false,
        })
    }



/******************试听功能方法***************/


    render() {
        return (
            <Page title="推广列表" className='coral-push-list'>
                <div className="shop-list">
                    {/* 滚动加载列表 */}
                    <ScrollToLoad
                        className='shop-list-scroll'
                        toBottomHeight={1000}
                        loadNext={this.loadPushCourseList}
                        noneOne={this.state.noOne}
                        noMore={this.state.noMore}
                        emptyPicIndex={this.state.emptyPicIndex}
                    >
                    {
                        this.state.courseList&&
                        this.state.courseList.length>0&&
                        <ShopList
                            shopList={this.state.courseList}
                            showCoralPromoDialog={this.showCoralPromoDialog}
                            setCoralPushJoin = {this.setCoralPushJoin}  
                            isPushList ={true} 
                            officialKey={this.props.userInfo.userId}
                            onListenAudioPause= {this.onListenAudioPause}
                            onListenAudioPlay= {this.onListenAudioPlay}
                            playedDuration = {this.data.audioStatus === 'playing'&&Number(this.state.audioDuration + this.audioPlayer.currentTime)}
                            bachelorRecommendProfit ={this.state.bachelorRecommendProfit}     
                        />
                        
                    }
                    </ScrollToLoad>
                </div>
                {
                    this.state.coralPushVersible&&
				    <CoralPushBox 
                        datas={this.state.coralPushData} 
                        officialKey={this.props.userInfo.userId}
                        onClose={this.onClosePushBox}/>
                }

                <CoralPromoDialog
                    show={this.state.showCoralPromoDialog}
                    close={this.onCoralPromoDialogClose}
                    nav={this.state.coralPromotionPanelNav}
                    switchNav={this.switchCoralPromotionPanelNav}

                    courseData={this.state.coralPushData}
                    officialKey={this.props.userInfo.userId}
                    userInfo = {this.props.userInfo}
                />

                <CoralJoinBox
                    show={this.state.coralJoinVisible}
                    onClose={this.onCloseJoinBox}
                    onJoin={this.onJoinFunc}
                    isCoralJoin={!this.props.myIdentity.identity}
                    headImgUrl={this.props.userInfo.headImgUrl}
                />
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        courseList: state.shop.coursePushList,
        userInfo: state.common.userInfo,
        myIdentity: state.mine.myIdentity||{},
    }
}

const mapActionToProps = {
    getPushCourseList,
    getUserInfo,
    getCoralProfitConfig,
}

module.exports = connect(mapStateToProps, mapActionToProps)(CoralPushList);
