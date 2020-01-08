import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';  
import { share } from 'components/wx-utils';
import { fillParams ,getUrlParams } from 'components/url-utils';
import BarrageActivity from './components/barrage-activity';
import { createPortal } from 'react-dom'; 
import PortalCom from '../../components/portal-com';
import { formatDate, locationTo } from 'components/util';
import { doPay } from 'common_actions/common' 
import { getWxConfig } from '../../actions/common'; 
import FloatRightTopBtn from '../../components/float-right-top-btn'
import { getDistributeConfig,getIntentionCamp,getDistributePermission } from '../../actions/experience';   
import DialogPut from './components/dialog-put'
import { MiddleDialog } from 'components/dialog';
 
@autobind
class UniversityExperienceCampActivity extends Component { 
    state = { 
        isShow: true,
        isSure: false, 
    }
    
    get campId(){ 
        return getUrlParams('campId', '')
    }

    async componentDidMount() {
        this.initData()
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-experience-scroll');
    } 
    async initData(){ 
        const { config } = await getDistributeConfig({
            campId: this.campId,
            type:"INTENTION"
        }) 
        const { camp={} } = await getIntentionCamp({
            campId: this.campId,
        }) 
        
        let type=camp.campType=='ufw_camp'?'INTENTION_UFW':'INTENTION_FINANCING'
        const {permission} = await getDistributePermission({type}) 
        this.setState({
            campConfig:config,
            campObj:camp,
            permission
        })
        this.initShare(config)
    } 
    
    // 初始化分享
    initShare(campConfig) {
        let shareUrl = fillParams({},location.href,['shareKey']) 
        if(campConfig&&campConfig.shareTitle) {
            share({
                title: campConfig.shareTitle,
                timelineTitle: campConfig.shareTitle,
                desc: campConfig.shareSubtitle,
                timelineDesc: campConfig.shareSubtitle,
                imgUrl: campConfig.shareImgUrl || 'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
                shareUrl: shareUrl
            });
        }
    }
 
    close(){
        this.setState({
            isShowJoin:false, 
        })

    }
    toScholarship(){
        const { permission,campObj } = this.state
        if(permission?.distributePermission=='Y'){
            // 手动触发打点日志 
            typeof _qla != 'undefined' && _qla('click', {
                    region:'experience-camp-activity-scholarship',
            });
            let url=fillParams({type:campObj.campType=='ufw_camp'?'intention':'financial'}, `/wechat/page/experience-camp-scholarship`)
            locationTo(url)
        }else{
            this.toPut()
        }
    }
    toPut(){
        // 手动触发打点日志 
        typeof _qla != 'undefined' && _qla('click', {
                region:'experience-camp-activity-show-join',
        });
        this.setState({
            isShowJoin:true, 
        })
    }
    render(){
        const { campConfig,campObj,permission,isShowJoin=false } = this.state 
        if(!campConfig) return null;
        return (
            <Page title={ campConfig.title || '' } className="uni-camp-box">
                <FloatRightTopBtn region={"experience-camp-activity-scholarship"} onClick={this.toScholarship}/>
                <section className="un-experience-scroll">
                    { campConfig.backgroundResourceList && campConfig.backgroundResourceList.length && (
                        <div className="uec-main"> 
                            <div className="uec-list">
                                {
                                    campConfig.backgroundResourceList.map((item,index)=>{
                                        return(
                                            <div className="uec-item on-log on-visible" 
                                                data-log-name={ "图片" }
                                                data-log-region="experience-camp-activity-img"
                                                data-log-pos={ index }
                                                key={index+1} onClick={ () => {
                                                item.jumpUrl && locationTo(item.jumpUrl)
                                            } }>
                                                <img src={item?.content} /> 
                                            </div> 
                                        )
                                    })
                                }
                            </div>
                        </div> 
                    ) }
                </section>
                
                {
                    createPortal(
                        <MiddleDialog
                            show={isShowJoin }
                            onClose={this.close}
                            className="experience-camp-activity-dialog-box">
                            <div onClick={ this.close } className="activity-dialog-close iconfont iconxiaoshanchu"></div>
                            <div className="activity-dialog-cont">
                                <h4>你需要先加入{campObj.title}才能获得推广资格哦</h4>
                                <div className="gw-btn on-log on-visible" 
                                    data-log-name={ "去加入" }
                                    data-log-region="experience-camp-activity-join"
                                    data-log-pos={ 0 } 
                                    onClick={()=>{locationTo(fillParams(this.props.location.query,`/wechat/page/university-experience-camp`,[]) ) }}>去加入</div>
                            </div>
                        </MiddleDialog>
                        ,document.getElementById('app'))
                }
                {
                    createPortal(
                        <BarrageActivity  
                            className={'jion-experience-page-status-center'}
                            actId={ this.campId }
                            scholarship={campConfig?.scholarship}
                            campType={campObj?.campType}
                        />
                        ,document.getElementById('app'))
                }  
                <PortalCom className={ `uni-pay-btn-put` }>
                    {
                        permission?.distributePermission=='Y'?
                        <DialogPut {...campObj} {...campConfig} className="uni-pay-btn uni-pay-red">立即推广</DialogPut> 
                        :<div onClick={this.toPut} className="uni-pay-btn uni-pay-red">立即推广</div> 
                    }
                </PortalCom>
                 
            </Page> 
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = { 
    doPay,
    getWxConfig
};

module.exports = connect(mapStateToProps, mapActionToProps)(UniversityExperienceCampActivity);