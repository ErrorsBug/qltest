import React, { Component } from 'react';
import { createPortal } from 'react-dom'
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad'; 
import FcdHead from './components/fcd-head'; 
import FcdList from './components/fcd-list'; 
import FcdMineCard from './components/fcd-mine-card'; 
import FcdBottom from './components/fcd-bottom';  
import FcdDialog from './components/fcd-dialog';
import FcdImg from './components/fcd-img'
import { BottomDialog } from 'components/dialog';
import ToggleContent from '../../components/toggle-content'  
import { universityFlag, universityFlagCardList, 
    flagHelpAdd ,flagHelpGet,universityflagGetflagCard,
    universityflagCardLike,getFlagCardBg,getUserFlagInfo,randomText } from '../../actions/flag';
import { 
    getMenuNode ,getStudentInfo } from '../../actions/home';
import { getUrlParams } from 'components/url-utils'; 
import { getVal, locationTo } from 'components/util'; 
import { getUserInfo } from "../../actions/common";
import AppEventHoc from '../../components/app-event' 
import HandleAppFunHoc from 'components/app-sdk-hoc'

@HandleAppFunHoc 
@AppEventHoc 
@autobind
class FlagCardDetail extends Component {
    state = {
        universityFlagData:{},
        flagCard:{},
        flagHelpListData:{},
        shareId:'', 
        upNumber:0, 
        flagZs:{},
        isShow:false,
        isHasShow:false,
        flagHelpStatus:'',
        userInfo:{},
        flagCardBg:'',
        UserFlagInfoDate:{}, 
        studentInfo:null
    }   
    
    page = {
        page: 1,
        size: 10,
    }
 

    componentDidMount() {
        this.initData(); 
        this.randomTextCopy=[...randomText] 
    } 

    get flagUserId(){
        return getUrlParams('userId','')
    }
    get cardId(){
        return getUrlParams('cardId','') 
    } 
    //初始化数据
    async initData() {
        const {flagCard} = this.props.flagCardData
        const flagBgUrl=await getFlagCardBg({
            fromUserId:this.flagUserId 
        }) 
        this.setState({ 
            flagCard,
            flagCardBg: flagBgUrl
        }) 
       
        const universityFlagData = await universityFlag({
            flagUserId: this.flagUserId 
        });  
         
        let { flagCardList = [] } = await universityFlagCardList({
            flagUserId: this.flagUserId,
            pay:'N',
            ...this.page
        });
        flagCardList=flagCardList.filter((item,index)=>{ 
            return item.id!=this.cardId
        })
        const {menuNode={}} = await getMenuNode({nodeCode:"QL_NZDX_FLAG_ZS"});

        this.getUserInfo();
        const studentInfoDate= await getStudentInfo();
        this.setState({
            universityFlagData, 
            flagCardList,
            flagZs:menuNode,
            studentInfo:studentInfoDate?.studentInfo||null
        })   
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('fcd-scroll-box');
    }   

    
    /**
     * 点赞
     */
    async addClick(cardId){  
        if(this.state.isShowClick)return false
        if(this.state.flagCard?.likeStatus!=='Y'){ 
            let addResult = await universityflagCardLike({
                cardId 
            });  
            if(addResult?.state?.code!=0){  
                return 
            } 
            const {flagCard} = await universityflagGetflagCard({
                cardId:this.cardId
            }); 
            this.setState({ 
                flagCard, 
            })  
        }

        if(this.randomTextCopy.length<=0){
            this.randomTextCopy=[...randomText]
        } 
         
        let i = Math.floor(Math.random()*this.randomTextCopy.length)
        let clickText=this.randomTextCopy[i]
        this.randomTextCopy.splice(i,1) 
       await this.setState({
            isShowClick:true,
            clickText ,
        } )
        setTimeout(()=>{
            this.setState({
                isShowClick:false
            })
        },2000)
    } 

    async fetchFlagHelpAdd(){
        const {flagHelpStatus,userInfo} =this.state
        if(flagHelpStatus !=='Y'){
            if(this.flagUserId ===userInfo.userId){
                window.toast('自己不能做见证人哦');
                this.btClose()
                return false;
            }else if(flagHelpStatus ==='E'){
                window.toast('大学校友无需见证哦');
                this.btClose()
                return false;
            }
            let addResult = await flagHelpAdd({
                flagUserId: this.flagUserId,
                userId: userInfo.userId, 
            });
            if(getVal(addResult,'state.code','')!== 0 ){
                return 
            }
            //见证成功！
            window.toast('见证成功！');
            await this.setState({
                flagHelpStatus: 'Y',
            } );
        }
        this.goToGetGift(); 
    }

    goToGetGift(){
        locationTo(`/wechat/page/join-university?userId=${this.flagUserId}&couponType=witness`);
    }
    
    async getUserInfo() {
        let res = await this.props.getUserInfo();
        this.setState({
            userInfo: getVal(res,'data.user',{}),
        },()=>{
            this.initFlagHelpGet();
        });
    }

    async initFlagHelpGet(){
        let flagHelpStatus=''
        if(this.flagUserId ===this.state.userInfo.userId||this.state.studentInfo){
            flagHelpStatus = 'E' 
        }else{ 
            const result = await flagHelpGet({
                flagUserId: this.flagUserId,
                helpUserId: this.state.userInfo.userId,
            });
            flagHelpStatus = getVal(result,'data.status','');
        }
        await this.setState({
            flagHelpStatus, //见证状态：Y已见证；N未见证；E不可见证
        });
        
        if(flagHelpStatus=='Y'&&!this.state.studentInfo){
            const UserFlagInfoDate = await getUserFlagInfo({
                flagUserId: this.flagUserId,
            });
            this.setState({
                UserFlagInfoDate
            })
        }
        this.handleShowDialog();
        
    }
    
 
    btClose(){
        this.handleShowStaus(false);
    }

    // 处理弹窗显示
    handleShowDialog(){
        const scrolNode = document.querySelector('.fcd-scroll-box');
        const wH = document.body.clientHeight;
        const height = scrolNode.childNodes[0].clientHeight; // 获取所有滚动的高度;
        if(height <= wH){
            setTimeout(() => {
                this.handleShowStaus();
            },3000)
        } else {
            this.handleScroll(scrolNode, wH, height);
        }
    }
    // 处理滚动条显示
    handleScroll(scrolNode, wH, height) {
        const maxH = wH * 2
        const flag = maxH >= height;
        let h = 0;
        scrolNode.addEventListener('scroll',(e) => { 
            if(this.state.isHasShow) return false; 
            h = scrolNode.scrollTop + wH; 
            if(flag && (h >= height)) {
                this.handleShowStaus()
            } else if(h >= maxH) {
                this.handleShowStaus()
            }
        })
    }
    handleShowStaus(flag = true) {
        this.setState({
            isShow: flag,
            isHasShow:true
        })
    }
    render(){
        const { universityFlagData,
            flagCard,
            flagCardList,
            shareId, 
            flagZs,
            isShow,
            flagHelpStatus ,
            flagCardBg,
            isShowClick,
            UserFlagInfoDate,
            clickText,
            studentInfo} = this.state;
        const {onPress,isQlchat} = this.props 
       
        return (
            <Page title="学习笔记" className="flag-card-detail-page">
                <ScrollToLoad
                    className={`fcd-scroll-box`}
                    toBottomHeight={300} 
                    notShowLoaded={true}
                    disable={true} 
                    >
                    <FcdHead 
                        showWithdraw={this.showWithdraw}
                        initMinCards={this.initMinCards}
                        initSuccessCards={this.initSuccessCards}
                        showFail={this.showFail}
                        {...universityFlagData}
                        cardDate={flagCard.cardDate}
                        shareId={shareId}
                        flagCardBg={flagCardBg}/>  
                    <FcdMineCard {...flagCard} addClick={this.addClick} isShow={isShowClick} clickText={clickText}/>   
                    <FcdList 
                        {...universityFlagData} 
                        flagCardList={flagCardList}  
                        addClick={this.addClick}
                        fetchFlagHelpAdd={this.fetchFlagHelpAdd}
                        studentInfo={studentInfo}
                        />
                    <FcdBottom flagZs={flagZs} {...universityFlagData}/>
                </ScrollToLoad>  
                
                <BottomDialog
                    show={isShow}
                    bghide
                    theme='empty' 
                    titleTheme={'white'}
                    buttons={null}
                    close={true} 
                    className={`fcd-dialog`} >
                    <div className="fcd-d-close" onClick={this.btClose}></div>
                    <FcdImg userHeadImg={universityFlagData?.userHeadImg}/>
                    <div className="fcd-d-name">{ universityFlagData?.userName || '' }</div>
                    {
                         flagHelpStatus!="Y"&& <div className="fcd-tc-title">我在千聊女子大学定了目标</div>
                    } 
                    <ToggleContent  
                        maxLine={2}
                        children={ 
                            flagHelpStatus=="Y"?
                            `我已加入千聊女子大学${UserFlagInfoDate.joinDayNum||0}天，打卡${UserFlagInfoDate.cardNum||0}次，获得${UserFlagInfoDate.likeNum||0}个赞，在班级排名${UserFlagInfoDate.rank||0}。`
                            :
                            universityFlagData?.desc 
                        }
                    /> 
                    <div className="fcd-d-bottom">
                        <div className="fcd-d-text">
                                {
                                    flagHelpStatus=="Y"?
                                    '你愿意和我成为大学校友吗?'
                                    :
                                    '你愿意成为我的见证人吗？'
                                } 
                          </div>
                        <div className="fcd-d-btn  on-log on-visible" 
                            data-log-name='愿意弹窗'
                            data-log-region={`un-card-help-${flagHelpStatus=="Y"?'two':'one'}`}
                            data-log-pos="0" 
                            onClick={this.fetchFlagHelpAdd}>愿意</div>
                    </div>
                </BottomDialog>  
            </Page>
        )
    }
}
 

const mapStateToProps = (state) => { 
    return {
        flagCardData: state.home.flagCardData,
    }
};
const mapActionToProps = {
    getUserInfo,
};

module.exports = connect(mapStateToProps, mapActionToProps)(FlagCardDetail);