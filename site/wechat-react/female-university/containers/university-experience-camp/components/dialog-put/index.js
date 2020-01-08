import React, { Component, Fragment } from 'react';
import { autobind } from 'core-decorators';
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom';
import CanvasImg from '../../../../components/canvas-img'
import { fillParams, getUrlParams } from 'components/url-utils';
import { getCookie, formatMoney } from 'components/util';
import { getBaseUserInfo } from '../../../../actions/common'
import ClipBoard from 'clipboard';

@autobind
class UniPayBtnMain extends Component {
    state = {
        curIndex:0
    }
    get campId(){
        return getUrlParams('campId')
    } 
    get shareKey(){
        return getCookie('userId')
    } 
    get shareUrl(){ 
        return fillParams({campId:this.campId,shareKey:this.shareKey,wcl:"share_1130441"},'https://ql.kxz100.com/wechat/page/university-experience-camp')
    }
    componentDidMount() { 
        this.initClipBoard();
    }
    initClipBoard(){ 
        let clipboard = new ClipBoard('#copy-cate');
        clipboard.on('success', function(e) {
            window.toast('复制成功！');
             // 手动触发打点日志 
            typeof _qla != 'undefined' && _qla('click', {
                region:'experience-camp-activity-cate-copy',
            });
        });  
        clipboard.on('error', function(e) { 
            window.toast('复制失败！请手动复制');
        });
    }

    componentWillUnmount() {
       
    }
    async click(){
        if(this.props.distributionStatus!=='Y'){
            window.toast('活动未开启');
            return 
        }
        // 手动触发打点日志 
        typeof _qla != 'undefined' && _qla('click', {
            region:'experience-camp-activity-cate',
        });
        this.setState({
            isShowCate:true
        })
    }
    async createPoster(){
        const {user} = await getBaseUserInfo()
        
        // 手动触发打点日志 
        typeof _qla != 'undefined' && _qla('click', {
            region:'experience-camp-activity-poster',
        });
        this.setState({
            isShowCate:false,
            isShowPoster:true,
            user
        })
    }
    close(){
        this.setState({ 
            isShowCate:false,
            isShowPoster:false,
        }) 
    }
    changeIndex(){
        const {curIndex}=this.state
        const {recommendedCopyList=[]} = this.props
        this.setState({
            curIndex:curIndex>=(recommendedCopyList.length-1)?0:(curIndex+1)
        })
    }
    cardSuccess(){
        this.setState({
            isCardSuccess:true
        })
    }
    render() {
        const { isShowCate=false,isShowPoster=false,user={},curIndex,isCardSuccess } = this.state
        const { className='',scholarship,recommendedCopyList=[],invitationCardUrl,children } = this.props;
        if(recommendedCopyList?.length<=0)return false
        return (
            <Fragment>
                <div className={className} onClick={this.click}>
                    {children}
                </div>
                {
                    createPortal(
                        <MiddleDialog
                            show={isShowCate }
                            onClose={this.close}
                            className="experience-camp-activity-cate">
                            {
                                createPortal(
                                    <div className="experience-camp-activity-cate-money">
                                        <div className="activity-cate-money-title">预计收益</div>
                                        <div className="activity-cate-money-num"><span>￥</span>{formatMoney(scholarship)}</div>
                                    </div>
                                    ,document.getElementById('app'))
                            }
                            <div className="activity-cate-title">复制文案，生成海报后邀请好友学习</div>
                            <div className="activity-cate-main">
                                <div className="activity-cate-main-title">—— 朋友圈推荐语 ——</div>
                                <div className="activity-cate-main-content">{recommendedCopyList[curIndex].content}</div>
                                <div className="activity-cate-main-bottom">
                                    {
                                        recommendedCopyList.length>1&&
                                        <div className="activity-cate-main-bottom-btn on-log on-visible" 
                                            data-log-name={ "换一换" }
                                            data-log-region="experience-camp-activity-cate-change"
                                            data-log-pos={ 0 }
                                            onClick={this.changeIndex}> 换一换</div>
                                    }
                                    <div className="activity-cate-main-bottom-btn right"
                                        id="copy-cate" 
                                        onClick={this.initClipBoard} 
                                        data-clipboard-text={recommendedCopyList[curIndex].content}> 复制文案</div>
                                </div>
                            </div>
                            <div className="activity-cate-create" onClick={this.createPoster}> 生成专属海报</div>
                        </MiddleDialog>
                        ,document.getElementById('app'))
                }
                {
                    user?.name&&invitationCardUrl&&createPortal(
                        <MiddleDialog
                            show={isShowPoster }
                            onClose={this.close}
                            className="experience-camp-activity-poster">
                            <div className="activity-poster-img">
                                <CanvasImg 
                                    region="experience-camp-activity-poster-press"
                                    cardWidth={750} 
                                    cardHeight={1334} 
                                    success={this.cardSuccess}
                                    moduleList={[
                                        {
                                            cate:'background',
                                            type:'img',
                                            value:invitationCardUrl,
                                            params:{
                                                top: 0,
                                                left: 0,
                                                width: 750,
                                                height: 1334,
                                            }
                                        }, 
                                        {
                                            cate:'avator',
                                            type:'img',
                                            value:user?.headImgUrl||"https://img.qlchat.com/qlLive/liveCommon/normalLogo.png",
                                            params:{
                                                top: 32,
                                                left: 32,
                                                width: 80,
                                                height: 80,
                                                isClip:true,x: 32, y: 32, w: 80, h: 80, r: 40
                                            }
                                        },
                                        {
                                            cate:'name',
                                            type:'text',
                                            value:user?.name,
                                            params:{
                                                top: 35,
                                                left: 136,
                                                width: 600,
                                                font: 28,
                                                lineHeight: 40,
                                                color: "rgba(255,255,255,1)",
                                                textAlign: "left",
                                                maxLine:1,
                                            }
                                        },
                                        {
                                            cate:'intro',
                                            type:'text',
                                            value:"我在学习中，邀请你一起",
                                            params:{
                                                top: 79,
                                                left: 136,
                                                width: 600,
                                                font: 22,
                                                lineHeight: 32,
                                                color: "rgba(255,255,255,0.5)",
                                                textAlign: "left",
                                                maxLine:1,
                                            }
                                        },
                                        {
                                            cate:'qrcode',
                                            type:'qrcode',
                                            value:this.shareUrl,
                                            params:{
                                                top: 1134,
                                                left: 528,
                                                width: 180,
                                                height: 180,
                                                isClip:true,x: 528, y: 1134, w: 180, h: 180, r: 12
                                            }
                                        }, 
                                    ]}/>
                            </div>
                            {
                                isCardSuccess&&<div className="activity-poster-title">长按图片保存或发送给好友~</div>
                            }
                        </MiddleDialog>
                        ,document.getElementById('app'))
                }
            </Fragment>
        );
    }
}
 

export default UniPayBtnMain;