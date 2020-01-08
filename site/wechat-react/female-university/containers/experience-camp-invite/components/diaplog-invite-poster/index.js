import React, { Component, Fragment } from 'react';
import { autobind } from 'core-decorators';
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom';
import CanvasImg from '../../../../components/canvas-img'
import { fillParams, getUrlParams } from 'components/url-utils';
import { getCookie } from 'components/util';
import { getBaseUserInfo } from '../../../../actions/common'
import Picture from 'ql-react-picture'

@autobind
class UniPayBtnMain extends Component {
    state = {
        curIndex:0
    } 
    get inviteKey(){
        return getCookie('userId')
    } 
    get shareUrl(){ 
        let url = fillParams({campId:this.props.campId,inviteKey:this.inviteKey,wcl:'share_1130443'},`https://ql.kxz100.com/wechat/page/university-experience-camp`)
        return url
    }
    componentDidMount() {  
    } 

    componentWillUnmount() {
       
    } 
    async createPoster(){
        window.toast('正在为你生成海报，稍等哟~',50000)
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
        window.toast('',10)
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
        window.toast('',10)
        this.setState({
            isCardSuccess:true
        })
    }
    render() {
        const { isShowPoster=false,user={},isCardSuccess=false } = this.state
        const { keyC, keyH, keyI } = this.props;
        return (
            <Fragment>
                <div className="diaplog-invite-poster">
                    {
                        keyI=='Y'?
                        <div className="diaplog-invite-poster-play on-log on-visible" 
                            data-log-name={'生成海报'}
                            data-log-region={'diaplog-invite-poster-play'}
                            data-log-pos={this.props.campId}
                            onClick={this.createPoster}>
                            <img src={keyH}/>
                        </div> 
                        :
                        <div className="diaplog-invite-poster-finish">
                            <div className="diaplog-invite-poster-finish-btn">活动已结束</div>
                        </div> 
                    }
                </div> 
                {
                    user?.name&&createPortal(
                        <MiddleDialog
                            show={isShowPoster }
                            onClose={this.close}
                            className="experience-camp-activity-poster">
                            <div className="activity-poster-img">
                                <CanvasImg 
                                    region="diaplog-invite-poster-press"
                                    cardWidth={750} 
                                    cardHeight={1334} 
                                    success={this.cardSuccess}
                                    moduleList={[
                                        {
                                            cate:'background',
                                            type:'img',
                                            value:keyC,
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
                                                bolder: 'bold',
                                            }
                                        },
                                        {
                                            cate:'intro',
                                            type:'text',
                                            value:"已加入，邀你一起学习",
                                            params:{
                                                top: 79,
                                                left: 136,
                                                width: 600,
                                                font: 22,
                                                lineHeight: 32,
                                                color: "rgba(255,255,255,0.8)",
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
                                isCardSuccess&&<div className="activity-poster-title">长按海报保存并发送给朋友吧~</div>
                            }
                        </MiddleDialog>
                        ,document.getElementById('app'))
                }
            </Fragment>
        );
    }
}
 

export default UniPayBtnMain;