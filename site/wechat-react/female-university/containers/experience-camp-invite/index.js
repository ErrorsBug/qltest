import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';  
import { share } from 'components/wx-utils';
import { fillParams ,getUrlParams } from 'components/url-utils'; 
import { createPortal } from 'react-dom'; 
import { getMyInvite } from '../../actions/experience';   
import DialogInvitePoster from './components/diaplog-invite-poster'
import ScrollToLoad from 'components/scrollToLoad';
import InviteRank from './components/invite-rank'
import { locationTo } from 'components/util';

@autobind
class ExperienceCampInvite extends Component { 
    state = { 
        isShow: true,
        isSure: false, 
        clientHeight:'auto',
        board:{}
    } 
    get campId(){ 
        return this.props.inviteNodeCodeData?.keyA
    }
    get nodeCode(){
        return getUrlParams('nodeCode')
    }
    async componentDidMount() {
        this.initData() 
        this.initShare()
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('experience-camp-invite-scroll-box');
    } 
    async initData(){  
        const { board } = await getMyInvite({
            campId: this.campId,
        })  
        this.setState({
            board
        })  
    } 
    
    // 初始化分享
    initShare() {
        const { inviteNodeCodeData } = this.props 
        let shareUrl = fillParams({},location.href,['inviteKey']) 
        if(inviteNodeCodeData&&inviteNodeCodeData.keyD) {
            share({
                title: inviteNodeCodeData.keyD,
                timelineTitle: inviteNodeCodeData.keyD,
                desc: inviteNodeCodeData.keyE||'',
                timelineDesc: inviteNodeCodeData.keyE||'',
                imgUrl: inviteNodeCodeData.keyF || 'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
                shareUrl: shareUrl
            });
        }
    }
  
    scrollTop(){
        this.refs.inviteContainer&&this.refs.inviteContainer.scrollIntoView()
    }
    
    @throttle(300)
    onScrollHandle() {  
        const isShowScrollTop=this.refs.scrollContainer?.scrollTop>800
        if(isShowScrollTop===this.state.isShowScrollTop){
            return 
        }
        this.setState({
            isShowScrollTop 
        }) 
    }
    render(){
        const {  board,isShowScrollTop } = this.state
        const { inviteNodeCodeData, inviteNodeCodeObj={} } = this.props 
        if(!inviteNodeCodeData||!inviteNodeCodeObj)return false 
        typeof _qla != 'undefined' && _qla.collectVisible();
        return (
            <Page title={ inviteNodeCodeData.title || '' } className="experience-camp-invite"> 
                <ScrollToLoad
                    ref="scrollContainer"
                    className={`experience-camp-invite-scroll-box`}
                    toBottomHeight={300}
                    scrollToDo={this.onScrollHandle}
                    loadNext={ this.loadNext }>
                    <div className="experience-camp-invite-container" style={{background:inviteNodeCodeData.keyB}} ref="inviteContainer">
                        {
                            inviteNodeCodeData.children?.map((item,index)=>{
                                //图片区域
                                if(item.keyA=='IMG'&&inviteNodeCodeObj[item.nodeCode]){
                                    return (
                                        <section className="experience-camp-invite-section1" key={ index }>
                                            {
                                                inviteNodeCodeObj[item.nodeCode].map((sub_item,sub_index)=>{
                                                    return (
                                                        <img src={sub_item.keyA} key={sub_index}/>
                                                    )
                                                })
                                            } 
                                        </section>
                                    )
                                }
                                //礼包区域
                                if(item.keyA=='GIFT'&&inviteNodeCodeObj[item.nodeCode]){
                                    return (
                                        <section className="experience-camp-invite-section3" key={ index }>
                                            <div className="experience-camp-invite-section3-container">
                                                <div  className="section3-title">已成功邀请{board?.count||0}人好友报名</div>
                                                <div  className="section3-step">
                                                    {
                                                        inviteNodeCodeObj[item.nodeCode].map((sub_item,sub_index)=>{
                                                            if(sub_index>2)return false
                                                            return (
                                                                <div className={`section3-step${sub_index}`} key={sub_index}>
                                                                    <div className="section3-content">
                                                                        {
                                                                            parseFloat(board?.count)>=sub_item.keyC?
                                                                            <img src={sub_item.keyB} onClick={()=>{sub_item.keyD&&locationTo(sub_item.keyD)}}/>
                                                                            :
                                                                            <img src={sub_item.keyA} onClick={()=>{window.toast('暂无解锁，快去邀请好友吧')}}/>
                                                                        }
                                                                        <div  className="section3-step-num">邀请<span>{sub_item.keyC}</span>人奖励</div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }  
                                                </div>
                                                <div  className="section3-bottom">温馨提示：奖品名额有限，请尽快解锁</div>
                                            </div>
                                        </section>
                                    )
                                }
                                //排行榜区域
                                if(item.keyA=='LB'){
                                    return (
                                        <section className="experience-camp-invite-section2" key={ index }>
                                            <InviteRank boardItem={board} campId={this.campId}/>
                                        </section>
                                    )
                                }
                            })
                        } 
                    </div>
                </ScrollToLoad> 
                {
                    createPortal(
                        <DialogInvitePoster {...inviteNodeCodeData}  campId={this.campId}/> 
                        ,document.getElementById('app'))
                } 
                {
                    isShowScrollTop&&createPortal(
                        <div onClick={this.scrollTop} 
                            className="experience-camp-invite-scroll on-log on-visible" 
                            data-log-name={'返回顶部'}
                            data-log-region={'experience-camp-invite-scroll'}
                            data-log-pos={0}  
                            style={{color:inviteNodeCodeData.keyB}}><i className="iconfont iconxingzhuang1"></i></div> 
                        ,document.getElementById('app'))
                } 
            </Page> 
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
    inviteNodeCodeData: state.experience.inviteNodeCodeData,
    inviteNodeCodeObj: state.experience.inviteNodeCodeObj,
});

const mapActionToProps = {  
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceCampInvite);