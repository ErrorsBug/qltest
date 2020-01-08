import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CollectVisible from 'components/collect-visible';
import Page from 'components/page';
import BtnBar from "./components/btn-bar";
import { Confirm } from "components/dialog";
import CommentBox from './components/comment-box';
import ShortVideo from './components/short-video';
import PptSwiper from './components/ppt-swiper';
import ShareTipsBox from "./components/share-tips-box";
import OtherVideosBox from './components/other-videos-box';
import { locationTo, getVal, imgUrlFormat, isFromLiveCenter, getCookie } from "components/util";
import { share } from "components/wx-utils";

import { request, getQr , isServiceWhiteLive, getIsSubscribe } from 'common_actions/common';

import { fetchUserPower, getUserInfo, watermark, getStsAuth, getDomainUrl } from "../../actions/common";
import { getKnowledge, setStatNum, getWatchRecord } from "../../actions/short-knowledge";
import { getCampInfo, getChannelInfo, getTopicInfo, getLiveInfo, getActivityAppId } from '../../actions/connect-course';
import { fillParams } from 'components/url-utils';



let htmlDpr = 1;



class VideoShow extends Component {
    state = {
        showComment: false,
        showShareTips: false,
        knowledgeId: (this.props.location.query.id || this.props.location.query.knowledgeId),
        liveId: this.props.location.query.liveId,
        knowledgeInfo: this.props.initData || null,
        client: (this.props.powerEntity.allowMGLive ? 'B' : 'C'),
        sourseInfo: {},
        isSubscribe: true,
        qlchatQrcode: '',
        shareDesc: [
            '超有料的小视频，你来看看？',
            '别忍了，快看看',
            '我不信你能忍住不看！',
            '这个小视频有点意思',
            '我就说你会看的',
            '涨知识',
            '有才',
            '666，给老师送小红花',
        ],
        showPushBox: false,
        watchList: [],

        water: "cWxMaXZlL3Nob3J0L3ZpZGVvLXdhdGVyLnBuZw==", // 短知识的分享图片水印

        // 直播间其他短知识
        showOtherVideosBox: false,
        otherVideos: {
            status: '',
            data: undefined,
            page: {
                size: 10,
            },
        },

        distributionObj: { // 分销配置对象
            type: '',
        },

        isX5videofullscreen: false,
    }
    
    constructor(props) {
        super(props);
        if (!this.state.liveId && this.props.initData && this.props.initData.liveId) {
            this.state.liveId = this.props.initData.liveId + '';
        }
    }

    async componentDidMount(){
        if (this.props.location.query.officialKey || this.props.location.query.source === 'coral'){
            try {
                window.sessionStorage && sessionStorage.setItem('trace_page', 'coral');
            } catch (e) {}
        }

        this.getDomainUrl();
        
        if(!this.props.initData.id){
            await this.getPowerInfo();
            await this.getKnowledgeInfo();
        }else{
            this.getConnectCourse();
            this.initShare();
        }
        

        this.props.getUserInfo();
        
        this.initLiveData();
        this.courseVisitsNuming = false;
        this.initCodeShow();
        this.clearStroge();
        this.showGoodsNum = 0;
        this.getWatchRecord();
        this.getOtherVideos();

        // 获取htmlDpr
        const html = document.getElementsByTagName('html')[0];
        if (html) {
            htmlDpr = parseInt(html.getAttribute('data-dpr')) || 1;
            htmlDpr < 1 && (htmlDpr = 1);
        }
    }

    // 清除有声PPT页面和发布页面创建的session缓存
    clearStroge = () => {
        let strogeList = ['resourceList', 'totalSecond', 'audioList', 'initData', 'textContent']
        strogeList.forEach(i => {
            sessionStorage.removeItem(i)
        })
    }

    dangerHtml(content){
        if (content) {
            content = content.replace(/\</g, (m) => "&lt;");
            content = content.replace(/\>/g, (m) => "&gt;");
            content = content.replace(/(&lt;br(\/)?&gt;)/g, (m) => "\n");
        }

        return { __html: content }
    };

    onShowComment(){
        this.setState({
            showComment: true,
        });
    }
    onHideComment(){
        this.setState({
            showComment: false,
        });
    }

    onShowShareTips(){
        this.shareTips.show();
    }

    async getKnowledgeInfo(){
        let result = await this.props.getKnowledge({
            id: this.state.knowledgeId,
            bOrC: this.state.client,
        });
        if(result.state && result.state.code === 0){
            const knowledgeInfo = result.data.dto || {};
            if (!this.state.liveId && knowledgeInfo.liveId) {
                this.state.liveId = knowledgeInfo.liveId + '';
            }
            this.setState({
                knowledgeInfo,
            },()=>{
                this.getConnectCourse();
                this.initShare();
            });
            
        }
        
    }

    async getConnectCourse(){
        let businessId = this.state.knowledgeInfo.businessId;
        let businessType = this.state.knowledgeInfo.businessType;
        let liveId;
        if(businessType ==='channel' || businessType ==='newCamp'){
            const result = await this.props.getChannelInfo(businessId);
            liveId = getVal(result,"data.channel.liveId");
            let sourseInfo = {
                name : getVal(result,"data.channel.name",''),
                headImage: getVal(result,"data.channel.headImage",''),
            };
            this.setState({
                sourseInfo,
            });
        }else if(businessType ==='camp'){
            const result = await this.props.getCampInfo(businessId);
            liveId = getVal(result,"data.liveCamp.liveId");
            let sourseInfo = {
                name : getVal(result,"data.liveCamp.name",''),
                headImage: getVal(result,"data.liveCamp.headImage",''),
            };
            this.setState({
                sourseInfo,
            });
        }else if(businessType ==='topic'){
            const result = await this.props.getTopicInfo(businessId);
            liveId = getVal(result,"data.topicPo.liveId");
            let sourseInfo = {
                name : getVal(result,"data.topicPo.topic",""),
                headImage: getVal(result,"data.topicPo.backgroundUrl",''),
            };
            this.setState({
                sourseInfo,
            });
        }

        getDistribution({
            businessType,
            businessId,
            liveId,
            userId: this.props.userInfo.userId || getCookie('userId'),
        }).then(res => {
            if (res) {
                console.log(res)
                this.setState({
                    distributionObj: res,
                }, () => {
                    this.initShare();
                })
            }
        })
    }

    goToConnectCourse(){
        let businessId = this.state.knowledgeInfo.businessId;
        let businessType = this.state.knowledgeInfo.businessType;
        const knowledgeId = this.state.knowledgeInfo.id
        if(this.state.client === 'B'){
            let params = ''
            if(businessId && businessType){
                params = `&selectId=${businessId}&selectType=${businessType}`
            }
            locationTo(`${this.state.domainUrl}wechat/page/short-knowledge/recommend?knowledgeId=${this.state.knowledgeId}&liveId=${this.state.liveId}${params}&fallback=${encodeURIComponent(location.href)}`);
            return
        }
        if(businessId){
            if(this.courseVisitsNuming){return false}
            this.setStatNum('courseVisitsNum','',()=>{
                
                this.courseVisitsNuming = true;
                let url;
                if(businessType ==='channel' || businessType ==='newCamp'){
                    url = `${this.state.domainUrl}wechat/page/channel-intro?channelId=${businessId}&knowledgeId=${knowledgeId}&wcl=ShortVideo`;
                }else if(businessType ==='camp'){
                    url = `${this.state.domainUrl}wechat/page/camp-detail?campId=${businessId}&knowledgeId=${knowledgeId}&wcl=ShortVideo`;
                }else if(businessType ==='topic'){
                    url = `${this.state.domainUrl}wechat/page/topic-intro?topicId=${businessId}&knowledgeId=${knowledgeId}&wcl=ShortVideo`;
                }

                // 带上链接上的分销参数
                url = fillParams(extractDistributionParams(this.props.location.query), url);

                locationTo(url);
            });
        }else if(this.state.knowledgeInfo.goodsDto && this.state.knowledgeInfo.goodsDto.goodsUrl){
            this.setStatNum('courseVisitsNum','',()=>{
                locationTo(this.state.knowledgeInfo.goodsDto.goodsUrl);
            });
        }
        
    }

    async getDomainUrl (){
        try {
            let result = await getDomainUrl({
                type: 'main'
            });
            if (result.state.code == 0) {
                this.setState({
                    domainUrl : result.data.domainUrl,
                })
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error)
        }
    }

    async getPowerInfo(){
        if (!this.state.liveId) return;
        await this.props.fetchUserPower({
            liveId: this.state.liveId,
        });
        this.setState({
            client: (this.props.powerEntity.allowMGLive ? 'B' : 'C'),
        });
    };

    swiperFun (){
        
    }

    async initLiveData(){
        await this.props.getLiveInfo(this.state.liveId);
        
        request.post({
            url: '/api/wechat/transfer/h5/live/getCountCourseNum',
            body: {
                liveId: this.state.liveId,
            }
        }).then(res => {
            let courseCount = 0;
            Object.values(res.data).forEach(item => {
                courseCount += item || 0;
            })
            this.setState({courseCount})
        }).catch(err => {
        })
    };

    async setStatNum(type,status,next){
        await this.props.setStatNum({
            type,
            knowledgeId: this.state.knowledgeId,
            status,
        });
        let knowledgeInfo = this.state.knowledgeInfo;
        if(type === 'liveNum'){
            knowledgeInfo.liveNum += 1;
        }else if(type === "courseVisitsNum"){
            knowledgeInfo.courseVisitsNum += 1;
        }else if(type === 'shareTime'){
            knowledgeInfo.shareNum +=1;
        }
        this.setState({
            knowledgeInfo,
        });
        next && next();
    }
    
    initShare(){
        let knowledgeInfo = this.state.knowledgeInfo;
        
        let shareUrl = fillParams(this.state.distributionObj && this.state.distributionObj.params || {}, location.href);

        this.shareOption = {
            title: '小视频：' + knowledgeInfo.name,
            desc: knowledgeInfo.introduction || this.state.shareDesc[Math.floor(Math.random()*8)],
            // imgUrl: knowledgeInfo.watermarkImg||'',
            imgUrl:  imgUrlFormat(knowledgeInfo.coverImage,`?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200`),
            shareUrl,
            successFn: () => {
                this.setStatNum('shareTime');
                window.toast('分享成功');
                this.calllog('ShortVideoShare');

                this.shareTips.hide();
            }
        };
        share(this.shareOption);
    }

    calllog (category) {
        typeof _qla !== 'undefined' && _qla('event',{
            category: category,
            action: "success",
            business_type: 'short-video',
            business_id: this.state.knowledgeId,
        })
    }
    
    async initCodeShow(){
        let result = await this.props.isServiceWhiteLive(this.state.liveId)
        let isSubscribe = true;
        let { isWhite, isBindThird } = result.data;
        
        if(isBindThird == 'Y'){
            let isSubscribeResult = await getIsSubscribe(this.state.liveId);
            let isFocusThree = getVal(isSubscribeResult,"data.isFocusThree");
            if(getVal(isSubscribeResult,"state.code","") === 0){
                if(!isFocusThree){
                    let qrcode = await this.props.getQr({
                        channel: 'shortKnowledge',
                        liveId: this.state.liveId,
                        showQl: 'N',
                        pubBusinessId: this.state.knowledgeId,
                    });
                    this.setState({
                        qlchatQrcode: getVal(qrcode,"data.qrUrl",''),
                    })
                }
                isSubscribe = isFocusThree;
            }
            this.setState({
                isSubscribe,
            })
        }else if(isWhite !== 'Y'){
            let getAppId = await this.props.getActivityAppId({type: 'shortKnowledge'});
            if(getAppId && getAppId.liveId && getAppId.appId){
                let isSubscribeResult = await getIsSubscribe(getAppId.liveId);
                let isFocusThree = getVal(isSubscribeResult,"data.isFocusThree");
                if(getVal(isSubscribeResult,"state.code","") === 0){
                    if(!isFocusThree){
                        let qrcode = await this.props.getQr({
                            channel: 'shortKnowledge',
                            liveId: this.state.liveId,
                            showQl: 'N',
                            appId: getAppId.appId,
                            pubBusinessId: this.state.knowledgeId,
                        });
                        this.setState({
                            qlchatQrcode: getVal(qrcode,"data.qrUrl",''),
                        })
                    }
                    isSubscribe = isFocusThree;
                    
                }
                this.setState({
                    isSubscribe,
                })
            }else{
                this.setState({
                    isSubscribe,
                })
            }
            
        }else{
            this.setState({
                isSubscribe,
            })
        }
        
    }

    qlchatQrcodeShow(){
        this.subscribeCode.show();
    }

    updateCommentNum(num){
        let knowledgeInfo = this.state.knowledgeInfo;
            knowledgeInfo.commentNum += num;
        this.setState({
            knowledgeInfo
        });
    }

    closeOwnRecommend(){
        this.setState({
            showPushBox: false,
        });
    }

    showGoods(){
        const knowledgeInfo = this.state.knowledgeInfo;
        if(this.showGoodsNum<=0 && (knowledgeInfo.goodsDto && knowledgeInfo.goodsDto.goodesAuditStatus !=='noPass' ) || knowledgeInfo.businessId ){//&& knowledgeInfo.goodsDto.goodesAuditStatus ==='pass'
            this.showGoodsNum++;
            this.setState({
                showPushBox: true,
            });
        }
    }

    async getWatchRecord(){
        let result = await this.props.getWatchRecord({ knowledgeId: this.state.knowledgeId });
        if(result.state&& result.state.code === 0 ){
            this.setState({
                watchList: getVal(result,"data.list",[])
            });
        }

    }

    // 获取直播间其他视频
    getOtherVideos = isContinue => {
        if (/pending|end/.test(this.state.otherVideos.status)) return;

        const page = {
            ...this.state.otherVideos.page
        };
        page.page = isContinue && page.page ? page.page + 1 : 1;

        this.setState({
            otherVideos: {
                ...this.state.otherVideos,
                status: 'pending',
            }
        })

        request.post({
            url: '/api/wechat/short/videoList',
            body: {
                liveId: this.state.liveId,
                bOrC: this.state.client,
                page,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            let list = res.data.list || [];

            this.setState({
                otherVideos: {
                    ...this.state.otherVideos,
                    status: list.length < page.size ? 'end' : 'success',
                    data: isContinue ? (this.state.otherVideos.data || []).concat(list) : list,
                    page,
                }
            })
        }).catch(err => {
            console.error(err);
            window.toast(err.message);
            this.setState({
                otherVideos: {
                    ...this.state.otherVideos,
                    status: '',
                }
            })
        })
    }

    goToOtherKnowledge = id => {
        locationTo(`/wechat/page/short-knowledge/video-show?knowledgeId=${id}&liveId=${this.state.liveId}`);
    }

    showOtherVideosBox = () => {
        if (!this.state.showOtherVideosBox && this.state.otherVideos.data && this.state.otherVideos.data.length > 1) {
            this.setState({showOtherVideosBox: true});
            typeof _qla !== 'undefined' && _qla.click({
                region: 'short-knowledge',
                pos: 'up',
            });
        }
    }

    touchStartBtnWipeUp = (e) => {
        this._btnWipeUpTouchStart = {
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
        }
    }

    touchEndBtnWipeUp = (e) => {
        const pre = this._btnWipeUpTouchStart;
        if (!pre) return;
        this._btnWipeUpTouchStart = undefined;

        const cur = {
            clientX: e.changedTouches[0].clientX,
            clientY: e.changedTouches[0].clientY,
        }

        if (cur.clientY < pre.clientY - 150 * htmlDpr) {
            this.showOtherVideosBox();
        }
    }

    render() {
        const { knowledgeInfo, client, courseCount, sourseInfo } = this.state;
        const { liveInfo } = this.props;
        const hasOtherVideos = this.state.otherVideos.data && this.state.otherVideos.data.length > 1;
        const touchListeners = hasOtherVideos ? {
            onTouchStart: this.touchStartBtnWipeUp,
            onTouchEnd: this.touchEndBtnWipeUp,
        } : null

        return (
            <Page title={knowledgeInfo.name||'短知识'} className={`video-show${this.state.isX5videofullscreen ? ' x5videofullscreen' : ''}`} 
                {...touchListeners}
            >
                
                {
                    knowledgeInfo.auditStatus === 'pass' && knowledgeInfo.transcodStatus === 'transcoded' && knowledgeInfo.type === 'ppt' && 
                    <PptSwiper resourceList={knowledgeInfo.resourceList} 
                        musicUrl={knowledgeInfo.musicUrl} 
                        swiperFun = {this.swiperFun.bind(this)} 
                        setStatNum = {this.setStatNum.bind(this)}
                        dangerHtml= {this.dangerHtml.bind(this)}
                        playNum = {knowledgeInfo.playNum|| 0}
                        watchList = {this.state.watchList}
                        showGoods = {this.showGoods.bind(this)} />
                }
                {
                    knowledgeInfo.auditStatus === 'pass' && knowledgeInfo.transcodStatus === 'transcoded' && knowledgeInfo.type === 'shortVideo' &&
                        <ShortVideo resourceList={knowledgeInfo.resourceList} 
                        setStatNum = {this.setStatNum.bind(this)} 
                        coverImage = {knowledgeInfo.coverImage||''}
                        playNum = {knowledgeInfo.playNum|| 0}
                        showGoods = {this.showGoods.bind(this)}
                        watchList = {this.state.watchList}
                        onx5videoenterfullscreen={() => this.setState({isX5videofullscreen: true})}
                        onx5videoexitfullscreen={() => this.setState({isX5videofullscreen: false})}
                         />
                }
                {
                    knowledgeInfo.transcodStatus === 'transcoding'?
                    <div className="transcoding-bg">{knowledgeInfo.type === 'ppt'?'音频':'视频'}合成中...</div>
                    :knowledgeInfo.auditStatus !== 'pass'?
                    <div className="transcoding-bg">{knowledgeInfo.type === 'ppt'?'音频':'视频'}审核中...</div>
                    :null
                }
                    
                    <div className="bottom">
                        { (courseCount > 0||knowledgeInfo.goodsDto) && client ==='B' && <div className="num">{knowledgeInfo.courseVisitsNum || 0}人访问推荐课程</div>}
                        { ((courseCount > 0||knowledgeInfo.goodsDto) && !( !(knowledgeInfo.businessId||(knowledgeInfo.goodsDto && knowledgeInfo.goodsDto.goodesAuditStatus !=='noPass')) && client ==='C' ) ) &&
                            <CollectVisible>
                                <div className="recommend on-visible on-log" 
                                    data-log-region="class" 
                                    data-log-pos={knowledgeInfo.businessId || knowledgeInfo.goodsDto ?"2":'1'}
                                    >
                                    {
                                        this.state.showPushBox ?
                                        <div className="own-recommend">
                                            <div className="icon_close2" onClick={this.closeOwnRecommend.bind(this)}></div>
                                            <div className="top">作者推荐</div>
                                            <div className="info">
                                                <div className="head"><img src = { knowledgeInfo.businessId ? sourseInfo.headImage : knowledgeInfo.goodsDto.goodsImageUrl} /></div>
                                                <div className= "name">{imgUrlFormat(knowledgeInfo.businessId ? sourseInfo.name : knowledgeInfo.goodsDto.goodsName,`?x-oss-process=image/resize,m_fill,limit_0,w_200,h_125`)}</div>
                                            </div>
                                            <CollectVisible>
                                                <div className="btn-look on-log on-visible" 
                                                    data-log-region="class"
                                                    data-log-pos="3"
                                                    onClick={this.goToConnectCourse.bind(this)}>去看一下</div>
                                            </CollectVisible>
                                        </div>
                                        :
                                        (
                                            (client ==='B' || (client ==='C' && (knowledgeInfo.goodsDto && knowledgeInfo.goodsDto.goodesAuditStatus !=='noPass')||knowledgeInfo.businessId )) &&
                                            <span onClick={this.goToConnectCourse.bind(this)}>
                                                <i className="learn-topic elli-text"  >作者推荐:{ knowledgeInfo.businessId ? sourseInfo.name : (knowledgeInfo.goodsDto&&knowledgeInfo.goodsDto.goodsName? knowledgeInfo.goodsDto.goodsName:'你还没有设置推广内容')}</i>
                                                <i className="icon_enter"></i>
                                            </span>
                                        )
                                        
                                    }
                                    
                                </div>
                            </CollectVisible>
                        }
                        
                        <div className="title">{knowledgeInfo.name}</div>
                        { client ==='B' && <div className="btn-share-qun on-log" 
                            data-log-region="short-knowledge"
                            data-log-pos="share"
                            data-log-name="分享"  
                            onClick={this.onShowShareTips.bind(this)}>
                            <span>分享到群<i className="count">{knowledgeInfo.shareNum}人已分享</i> </span>
                            </div>}

                        {
                            hasOtherVideos &&
                            <CollectVisible>
                                <div className="btn-wipe-up on-visible"
                                    data-log-region="short-knowledge"
                                    data-log-pos="up"
                                    onClick={this.showOtherVideosBox}
                                >上滑观看更多视频<i className="icon_up"></i></div>
                            </CollectVisible>
                        }
                    </div>
                    
                    {
                        this.state.liveId &&
                    <BtnBar client={client} 
                        liveId={this.state.liveId} 
                        knowledgeId = {this.state.knowledgeId}
                        commentNum = {knowledgeInfo.commentNum||0}
                        shareNum = {knowledgeInfo.shareNum || 0}
                        onShowComment={this.onShowComment.bind(this)} 
                        onShowShareTips={this.onShowShareTips.bind(this)}
                        setStatNum = {this.setStatNum.bind(this)}
                        userInfo={this.props.userInfo}
                        liveNum = {knowledgeInfo.liveNum || 0}
                        isSubscribe = {this.state.isSubscribe}
                        qlchatQrcode = {this.state.qlchatQrcode}
                        qlchatQrcodeShow = {this.qlchatQrcodeShow.bind(this)}
                        courseCount = {courseCount}
                        calllog ={this.calllog.bind(this)}
                        domainUrl = {this.state.domainUrl}
                        auditStatus= {knowledgeInfo.auditStatus}
                        transcodStatus= {knowledgeInfo.transcodStatus}
                        liveImg = {this.props.liveInfo && this.props.liveInfo.entity && this.props.liveInfo.entity.logo}   />
                    }

                    <CommentBox show={this.state.showComment} 
                        client={client} 
                        onHideComment = {this.onHideComment.bind(this)} 
                        setStatNum = {this.setStatNum.bind(this)}
                        knowledgeId= {this.state.knowledgeId}
                        liveId={this.state.liveId}
                        userInfo={this.props.userInfo}
                        commentNum = {knowledgeInfo.commentNum||0}
                        dangerHtml= {this.dangerHtml.bind(this)}
                        updateCommentNum = {this.updateCommentNum.bind(this)} />

                    <ShareTipsBox
                        ref={(el)=>{this.shareTips=el}}
                        distributionObj={this.state.distributionObj}
                    />
                    <CollectVisible>
                        <Confirm 
                            title="进入公众号，查看更多视频"
                            buttons='none'
                            close={true}
                            ref = {(el)=>{this.subscribeCode = el}}
                            className="qlchat-qrcode-box"
                            >
                            <img src={this.state.qlchatQrcode} />
                            <div className="tips on-visible" 
                                data-log-region="video-show-qrcode" >长按识别二维码</div>
                        </Confirm>
                    </CollectVisible>

                    {
                        this.state.showOtherVideosBox &&
                        <OtherVideosBox
                            {...this.state.otherVideos}
                            getData={this.getOtherVideos}
                            currentId={this.state.knowledgeId}
                            goToOtherKnowledge={this.goToOtherKnowledge}
                            onClose={() => this.setState({showOtherVideosBox: false})}
                            qlchatQrcode={this.state.qlchatQrcode}
                        />
                    }

                    {
                        liveInfo.entityExtend && liveInfo.entityExtend.knowledgeStatus === 'Y' && // 直播间同意上榜
                        <CollectVisible>
                            <div className="btn-hot-recommend on-log on-visible"
                                data-log-region="topRecommended"
                                onClick={() => locationTo(`/wechat/page/short-knowledge/hot-recommend?knowledgeId=${this.state.knowledgeId}`)}>热门推荐</div>
                        </CollectVisible>
                    }
            </Page>
        );
    }
}

function msp(state) {
    return {
        powerEntity: state.common.power||{},
        userInfo : state.common.userInfo.user || {},
        liveInfo: state.connectCourse.liveInfo || {},
        topicInfo: state.connectCourse.topicInfo || {},
        channelInfo: state.connectCourse.channelInfo || {},
        campInfo: state.connectCourse.campInfo || {},
        initData: state.shortKnowledge.initData || null,
    }
}

const map = {
    getKnowledge,
    getCampInfo, 
    getChannelInfo, 
    getTopicInfo ,
    fetchUserPower,
    getUserInfo,
    setStatNum,
    getLiveInfo,
    isServiceWhiteLive,
    getActivityAppId,
    getQr,
    watermark,
    getStsAuth,
    getWatchRecord,
}

export default connect(msp, map)(VideoShow);



/**
 * 判断当前课适用什么分销
 * 
 * @author jiajun.li 20190423 汇总分销逻辑地狱
 * 
 * @return {object|undefined} result
 *      @return {object} result.type 分销类型，暂时只定义了拉人返inviteReturn
 *      @return {object} result.params 加到url上参数
 */
async function getDistribution({
    businessType,
    businessId,
    userId,
    liveId,
}) {
    if (!businessType || !businessId) return;
    const result = {
        type: '',
        params: {},
        sharePercent: undefined, // 统一分成比例字段
        data: {}, // 其他数据字段
    };
    const params = result.params;

    const trace_page = window.sessionStorage && window.sessionStorage.getItem('trace_page');

    // 平台分销：课程为非官方课程，且，所在直播间开启千聊推荐，且，用户访问来源是直播中心
    if (isFromLiveCenter()) {
        const isOfficialLive = liveId && await request.post({
            url: '/api/wechat/transfer/h5/live/isQlLive',
            body: {
                liveId,
            }
        }).then(res => {
            return res.data.isQlLive === 'Y'
        }).catch(err => {
            console.warn(err)
        })

        if (!isOfficialLive) {
            const isOpenPsQualify = liveId && await request.post({
                url: '/api/wechat/transfer/h5/platformShare/getQualify',
                body: {
                    liveId,
                }
            }).then(res => {
                return res.data.platformShareQualifyPo.status === 'Y'
            }).catch(err => {
                console.warn(err)
            })

            if (isOpenPsQualify) {
                const psQualify = await request.post({
                    url: '/api/wechat/transfer/h5/platformShare/getShareRate',
                    body: {
                        businessType: businessType.toUpperCase(),
                        businessId,
                    }
                }).then(res => {
                    return res.data
                }).catch(err => {
                    console.warn(err)
                })
                if (psQualify && psQualify.shareRate > 0) {
                    params.psKey = userId;
                    result.sharePercent = psQualify.shareRate;
                    return result;
                }
            }
        }
    }

    // 课程上架了珊瑚，且用户为珊瑚会员，且是珊瑚来源
    if (trace_page === 'coral') {
        const coral = await request.post({
            url: '/api/wechat/transfer/h5/personShare/getPersonCourseInfo',
            body: {
                businessId,
                businessType,
            }
        }).then(res => {
            return res.data
        }).catch(err => {
            console.warn(err)
        })

        if (coral && coral.isPersonCourse === 'Y' && coral.sharePercent) {
            params.officialKey = userId;
            result.sharePercent = coral.sharePercent;
            return result;
        }
    }

    // 课代表
    const qualify = await (businessType === 'camp' && liveId ?
        request.post({
            url: '/api/wechat/transfer/h5/share/getMyQualify',
            body: {
                businessType: 'live',
                businessId: liveId,
                isAutoApply: 'Y',
            }
        })
        :
        request.post({
            url: '/api/wechat/transfer/h5/share/getMyQualify',
            body: {
                businessType,
                businessId,
                isAutoApply: 'Y',
            }
        })
    ).then(res => {
        return res.data.shareQualifyInfo
    }).catch(err => {
        console.warn(err)
    })
    if (qualify && qualify.status === 'Y' && qualify.joinType === 'auth' && /live|channel|topic/.test(qualify.type || '') && qualify.shareKey) {
        result.sharePercent = qualify.shareEarningPercent;
        if (qualify.type === 'live') {
            params.lshareKey = qualify.shareKey;
            return result;
        } else {
            params.shareKey = qualify.shareKey;
            return result;
        }
    }

    // 拉人返
    const inviteReturn = businessType !== 'camp' && await request.post({
        url: '/api/wechat/transfer/h5/invite/return/inviteReturnInfo',
        body: {
            businessId,
            businessType,
        }
    }).then(res => {
        return res.data
    }).catch(err => {
        console.warn(err)
    })
    if (inviteReturn && inviteReturn.hasMission === 'Y' && inviteReturn.missionDetail) {
        result.type = 'inviteReturn';
        result.data = inviteReturn;
        params.missionId = inviteReturn.missionDetail.missionId;
        return result;
    }

    // 自动分销
    if (qualify && qualify.status === 'Y' && qualify.joinType === 'auto' && qualify.shareKey) {
        params.shareKey = qualify.shareKey;
        result.sharePercent = qualify.shareEarningPercent;
        return result;
    }
}




function extractDistributionParams(obj) {
    const result = {};
    const map = ['officialKey', 'shareKey', 'lshareKey', 'psKey'];
    for (let k in obj) {
        if (map.indexOf(k) >= 0) {
            result[k] = obj[k];
        }
    }
    return result;
}