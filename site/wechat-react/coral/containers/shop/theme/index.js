import React, {Component} from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import {
    locationTo,
    imgUrlFormat,
} from 'components/util';
import CoralPromoDialog from 'components/dialogs-colorful/coral-promo-dialog';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { share, closeShare } from 'components/wx-utils';
import ThemeList from '../components/theme-list';

import { getUserInfo, bindOfficialKey } from '../../../actions/common';
import {
    getOneTheme,
    getThemeList,
	setJoinCollection,
} from '../../../actions/shop';
import {
	fillParams
} from 'components/url-utils';

@autobind
class Theme extends Component {

    state={
        courseList:[],
        noMore:false,
        noOne:false,
        emptyPicIndex:1,

	    showCoralPromoDialog: false,
	    coralPromotionPanelNav: 'tutorial',
        coralPushData:{},

        coralJoinVisible: false,

        
        audioDuration: 0,
        currentAudioIndex: 0,
        courseAudioIndex:0,
        audioSrc: '',

        theme:{
            subjectName: '',
            title: '',
            picture: '',
            url: '',
            backgroundColor: 'fff',
            buttonColor: 'feb358',
            modelType: 'TWO',
        },//默认样式
        moduleIndex:0,
        moduleList:[],
    };

    data = {
	    pageNum: 1,
        pageSize: 20,
        
        modulePageSize: 10,
        
        audioStatus:'',
        audioListType: 'normal',
        
        hasModule: false,
    };

    componentDidMount(){
        this.initData();
    }
    async initData(){
        await this.getThemeInfo();
        if(this.data.hasModule){
            /** 有模块 */
            this.getThemeModuleList(1);
        }else{
            /** 没有模块 */
            this.getShopThemeList(1);
        }
        
	    
        await this.props.getUserInfo();
        this.initThemeShare();

        //自动绑定officialKey
        if(!this.props.myIdentity.identity && this.props.location.query.officialKey){
		    this.props.bindOfficialKey({
                officialKey: this.props.location.query.officialKey,
                subjectId: this.props.location.query.subjectId,
		    });
        }
        
    }

    async getThemeInfo(){
        await this.props.getOneTheme({subjectId:this.props.location.query.subjectId});
        let theme = this.props.theme||{};
        // this.props.themes && this.props.themes.map((item)=>{
        //     if(item.id==this.props.location.query.subjectId){
        //         theme = item
        //     }
        // });
        if(theme.status !== 'Y'){//专题下架状态，三秒后跳转到商城首页
            window.toast('该专题已下架',3000);
            setTimeout(() => {
                locationTo('/wechat/page/coral/shop');
            }, 3000);
            
        }
        this.data.hasModule = theme.moduleList && theme.moduleList.length>0;
        if(theme.title){
            this.setState({
                theme,
                moduleList: theme.moduleList,
            });
        }
    }
    
    async getShopThemeList (pageNum){
        const res = await this.props.getThemeList({
            subjectId:this.props.location.query.subjectId,
	        pageNum,
            pageSize: this.data.pageSize
        });
        if(res.state.code === 0){
            this.setState({
                courseList: [...this.state.courseList,...res.data.list]
            });
        }
        if(pageNum === 1 && (!res.data.list || !res.data.list.length)){
            this.setState({
                noOne:true,
            });
        }else if(res.data.list.length < this.data.pageSize){
            this.setState({
                noMore:true,
            });
        }
    }

    async getThemeModuleList (pageNum,next){
        let moduleList = this.state.moduleList;
        let currentModuleObj = moduleList[this.state.moduleIndex]||'';
        if(!currentModuleObj){
            //当新模块没有了，则所有课程都没有了
            
            this.setState({
                noMore:true,
            });
            next&&next();
            return false;
        }else if(!currentModuleObj.list){
            currentModuleObj.list = [];
        }
        const res = await this.props.getThemeList({
            subjectId:this.props.location.query.subjectId,
	        pageNum,
            pageSize: this.data.modulePageSize,
            moduleId: currentModuleObj&&currentModuleObj.id,
        });
        if(res.state.code === 0){
            currentModuleObj.loaded=true;
            if(res.data.list.length>0){
                currentModuleObj.list = [...currentModuleObj.list,...res.data.list];
                let moduleIndex = this.state.moduleIndex;
                moduleList[moduleIndex] = currentModuleObj;
                this.setState({
                    moduleList,
                });
                if(res.data.list.length<this.data.modulePageSize){
                    this.data.pageNum = 0;
                    this.setState({
                        moduleIndex: moduleIndex+1
                    },()=>{
                        next&&next();
                    });
                }else{
                    next&&next();
                }
                
            }else if(currentModuleObj.list.length<this.data.modulePageSize){
                this.data.pageNum = 0;
                this.setState({
                    moduleIndex: this.state.moduleIndex+1
                },()=>{
                    this.getThemeModuleList(++this.data.pageNum,next);
                });
            }else{
                this.setState({
                    moduleIndex: this.state.moduleIndex+1
                },()=>{
                    next&&next();
                });
                
            }
        }
        

    }

    async loadNext(next){
        if(this.data.hasModule){
            /** 有模块 */
            await this.getThemeModuleList(++this.data.pageNum,next);
            // next();
        }else{
            /** 没有模块 */
            await this.getShopThemeList(++this.data.pageNum);
            next();
        }
        
        
    }

    initThemeShare(){
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
        this.initThemeShare();
	}

	switchCoralPromotionPanelNav(type){
		this.setState({
			coralPromotionPanelNav: type
		})
    }
   
    render() {
        return (
            <Page title={this.state.theme.title} className='coral-theme-list'>
                <div className="theme-list" style={{background:`#${this.state.theme.backgroundColor||'fff'}`}}>
                    {this.props.myIdentity.identity&&this.state.theme.isShowShareCard ==='Y'&&
                    <div 
                        className={'btn-coral on-log'} 
                        data-log-name="邀请卡入口"
                        data-log-region="pos=special-invite-btn"
                        onClick={()=>{locationTo(`/wechat/page/coral/shop/theme-card?subjectId=${this.props.location.query.subjectId}&officialKey=${this.props.userInfo.userId}&btn=Y`)}}
                    >
                        <div className="main">
                            <i className="icon-coral"></i>
                            <span className="content">
                                {/* 分享 | 赚<var>{formatMoney(topicInfo.money * coral.percent / 100)}</var>元 */}
                                生成邀请卡
                            </span>
                        </div>
                    </div>
                    }
                    {/* 滚动加载列表 */}
                    <ScrollToLoad
                        className='theme-list-scroll'
                        toBottomHeight={1000}
                        loadNext={this.loadNext}
                        noneOne={this.state.noOne}
                        noMore={this.state.noMore}
                        emptyPicIndex={this.state.emptyPicIndex}
                        notShowLoaded = {true}
                        
                    >
                    <span className="theme-head-pic"><img src={this.state.theme.picture} /></span>

                    {/** 有模块 */
                        this.state.moduleList&&!!this.state.moduleList.length&&this.state.moduleList.map((item,index)=>{
                            return (
                                <div key={`module-${index}`}>
                                {
                                    item.loaded && item.moduleImage && <div className="module-title" onClick={()=>{if(item.jumpUrl)locationTo(item.jumpUrl)}}><img src={item.moduleImage} /></div>
                                }
                                {
                                    item.list&&!!item.list.length&&
                                    <ThemeList
                                        shopList = {item.list}
                                        showCoralPromoDialog = {this.showCoralPromoDialog}
                                        setCoralPushJoin = {this.setCoralPushJoin}
                                        officialKey={this.props.userInfo.userId}
                                        stylemodule={this.state.theme.modelType === 'TWO'?"style_2":"style_1"}
                                        buttonColor={`#${this.state.theme.buttonColor||'feb358'}`}
                                        buttonText={this.state.theme.buttonWord}
                                        pButtonText={this.state.theme.pButtonWord}
                                        isCoralJoin={this.props.myIdentity.identity}        
                                    />
                                }
                                </div>
                            )
                        })
                    }

                    {/** 没有模块 */
                        !!this.state.courseList.length &&
                        <ThemeList
                            shopList={this.state.courseList}
                            showCoralPromoDialog = {this.showCoralPromoDialog}
                            setCoralPushJoin = {this.setCoralPushJoin}
                            officialKey={this.props.userInfo.userId}
                            stylemodule={this.state.theme.modelType === 'TWO'?"style_2":"style_1"}
                            buttonColor={`#${this.state.theme.buttonColor||'feb358'}`}
                            buttonText={this.state.theme.buttonWord}
                            pButtonText={this.state.theme.pButtonWord}
                            isCoralJoin={this.props.myIdentity.identity}        
                        />
                        
                    }
                    
                    
                    {
                        (this.state.noOne||this.state.noMore)&&this.state.theme.floorPicture&& <div className="bottom-pic"><img src={this.state.theme.floorPicture} /></div>
                    }
                    </ScrollToLoad>
                </div>

                <CoralPromoDialog
                    show={this.state.showCoralPromoDialog}
                    close={this.onCoralPromoDialogClose}
                    nav={this.state.coralPromotionPanelNav}
                    switchNav={this.switchCoralPromotionPanelNav}
                    courseData={this.state.coralPushData}
                    officialKey={this.props.userInfo.userId}
                    userInfo = {this.props.userInfo}
                />
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        theme: state.shop.theme,
        courseList: state.shop.themeList,
        userInfo: state.common.userInfo,
        myIdentity: state.mine.myIdentity || {},
    }
}

const mapActionToProps = {
    getOneTheme,
    getUserInfo,
    bindOfficialKey,
	setJoinCollection,
	getThemeList,
};

module.exports = connect(mapStateToProps, mapActionToProps)(Theme);
