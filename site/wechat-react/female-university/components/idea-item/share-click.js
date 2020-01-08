import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames'   
import { digitFormat } from '../../../components/util';
import {getCommunityCardBg} from '../../actions/flag';
import { ideaCards} from '../../components/idea-card'  
import PosterDialog from '../../components/poster-dialog/idea';   
import { createPortal } from 'react-dom';
import { share } from 'components/wx-utils';
import { fillParams } from 'components/url-utils';
import appSdk from 'components/app-sdk';

@autobind
export default class extends Component {
    state = { 
        likedUserNameList:[],
        isLike:'',
        isShowClick:false,
        clickText:'',
        processUrl:'', 
        isShowProcess: false, 
        isShowType:'',
        likedNum:0
    } 
    isload=false
     

    componentDidMount() {  
    }
    componentWillUnmount(){
         
    }  
    initShare() { 
        const params = { 
            wcl:'university_community_share',
            ideaId:this.props.id
        }
        const shareParams={
            title:this.props.text?.replace(/\n/g,'').slice(0,60),
            desc:'我在女子大学写了些想法，分享给你',
            timelineDesc:'我在女子大学写了些想法，分享给你',
            imgUrl:this.props.headImgUrl||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            shareUrl:fillParams(params,`${location.origin}/wechat/page/university/community-detail`,['']),
            successFn:  this.successFn
        } 
        share(shareParams)
        
        appSdk.shareConfig({
            title:shareParams.title,
            desc:shareParams.desc,
            thumbImage:shareParams.imgUrl,
            content:shareParams.shareUrl,
            success:this.successFn
        }) 
        
    }
    successFn(){
        // 分享成功日志 
        typeof _qla != 'undefined' && _qla('event', {
            category:`community-idea-card`,
            action:'success'
        });
    }
    
    async shareDay(date){ 
        
        const topBg=await getCommunityCardBg()   
        const  {...otherProps} =this.props  
        ideaCards({
            ...otherProps,topBg
        },(url)=>{ 
            this.setState({
                processUrl:url,
                isShowType:'idea'
            },()=>{
                this.showProcess() 
            })
        }) 
    }
    showProcess(){ 
        this.setState({
            isShowProcess: true,
        })
        this.initShare()
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    } 
    colseProcess(){ 
        this.setState({ 
            isShowProcess: false, 
            isShowType:''
        }) 
        this.props.initShare&&this.props.initShare()
    }    
    render() {
        const {   processUrl, isShowType, isShowProcess } = this.state
        const {id,userId,hideNum, shareNum, createTime, logName,logRegion,logPos} = this.props  
        return (
            <Fragment>
                
                <div className="iic-top">
                    <div 
                        data-log-name={ "想法分享" }
                        data-log-region={"un-community-idea-share"}
                        data-log-pos={ id } 
                        onClick={(e)=>{ this.shareDay(createTime)}}
                        className={`iic-item on-log on-visible`}>
                            <i className="iconfont iconfenxiang"  ></i> 
                            {!hideNum&&digitFormat(shareNum || 0) } 
                    </div> 
                </div> 
                {
                    createPortal(
                        <PosterDialog 
                            isShow={ isShowProcess } 
                            imgUrl={processUrl}
                            on={1}
                            close={ this.colseProcess }
                            className={isShowType}
                            children={
                                <div>
                                    <img src={processUrl}/>
                                </div>
                            }
                            />
                        ,document.getElementById('app'))
                }
                
            </Fragment>
        )
    }
}

