import React, { Component, Fragment, useEffect, useState, useRef, useCallback } from 'react'
import { autobind } from 'core-decorators' 
import { digitFormat } from '../../../components/util';
import {getCommunityCardBg} from '../../actions/flag';
import { getQr } from '../../components/idea-card'  
import { share } from 'components/wx-utils';
import { fillParams } from 'components/url-utils';
import appSdk from 'components/app-sdk';
import { isQlchat,isPc } from 'components/envi'
import PortalCom from '../portal-com'
import useH2C from '../../hook/html-canvas'
import useHtmlImage from '../../hook/html-image'
import PressHoc from 'components/press-hoc';
import { formatDate, imgUrlFormat } from 'components/util'; 
import Picture from 'ql-react-picture' 
import { ShowLink, ShowImg }   from '../tip-share-dialog'
import ErrorBoundary from 'components/error-boundary'
import { ideaCards} from '../../components/idea-card'  
import PosterDialog from '../../components/poster-dialog/idea';   
import { createPortal } from 'react-dom';

// 图片加载
const loadImg = (url) => {
    return new Promise((resolve, reject) => {
        var img = new Image()
        var objectURL = null
        if (url.match(/^data:(.*);base64,/) && window.URL && URL.createObjectURL) {
            objectURL = URL.createObjectURL(dataURL2blob(url))
            url = objectURL
        }
        img.onload = () => {
            objectURL && URL.revokeObjectURL(objectURL)
            resolve(img)
        }
        img.onerror = () => {
            reject(new Error('That image was not found.:' + url.length))
        }
        img.src = url
    })
}

// 递归图片
async function handleRecursive(list, i = 0) {
    const url = list[i].url;
    if(i === (list.length - 1)){
        return Promise.resolve()
    } else {
        await loadImg(url)
        handleRecursive(list, (i + 1))
    }
}

function ShareBox({ text, userName, headImgUrl, resourceList = [], topicDto = {}, createTime, selected ,colseProcess}) {
    const [ idx, setIdx ] = useState(-1)
    const [ img, setImg ] = useState('');
    const [ txt, setTxt ] = useState(text)
    const [ showTips,setShowTips] = useState(false)
    const nodeRef = useRef(null)
    const params = {
        scale: text.length < 1000 ? 1.5 : text.length > 3500 ? 0.7 : 1.2
    }
    if(isPc()){
        params.scale = 1.5;
    }
    const [ imageDom, loading, setDom ] = useH2C(params);
    const getQrImg = async() => {
        await loadImg(headImgUrl)
        await loadImg('https://img.qlchat.com/qlLive/activity/image/MF8J387E-F8VT-49E2-1575459705506-613N1L2Z51NY.png')
        if(!!resourceList && !!resourceList.length) {
            await handleRecursive(resourceList)
        }
        const url = await getQr(`${location.origin}/wechat/page/university/community-center`); 
        setImg(url)
        setTimeout(() => {
            setDom(nodeRef.current)
        },300)
    }
    useEffect(() => {
        window.loading(true, '正在加速你生产长图')
        getQrImg();
    }, [])
    useEffect(() => {
        if(!!imageDom) {
            if(Object.is(imageDom,'data:,')) {
                setTxt(`${text.splice(0,3500)}...`)
                setDom(nodeRef.current)
            } else {
                window.loading(false)
            }
        }
    },[imageDom])
    const clickTips = useCallback((e)=>{
        e.preventDefault();
        e.stopPropagation();
        setShowTips(true)
        setTimeout(()=>{
            setShowTips(false)
        },1500)
    },[showTips])
    const clickLink = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        idx != 0 && setIdx(0)
        setTimeout(()=>{
            setIdx(-1)
        },3000)
    },[idx])
    return (
        <>
            <PortalCom className="cm-share-yin" >
                { idx === 0 &&  <ShowLink text="好想法与好友分享"/>}
                { idx === 1 &&  <ShowImg />}
            </PortalCom>
            <PortalCom className="cm-share-portal">
                <div className="cm-share-min">
                    <div className="cm-share-cont" ref={ nodeRef }>
                        <div className="cm-share-head">
                            <img src="https://img.qlchat.com/qlLive/activity/image/MF8J387E-F8VT-49E2-1575459705506-613N1L2Z51NY.png" />
                        </div>
                        <div className="cm-share-info-container">
                            <div className="cm-share-info">
                                <div className={ `cm-share-user ${ Object.is(selected, 'Y') ? 'select' : '' }` }>
                                    <img src={ headImgUrl } alt=""/>
                                    <div className="cm-share-name">
                                        <p>{ userName }</p>
                                        { createTime && <span>{ formatDate(createTime,'yyyy/MM/dd hh:mm') }</span> }
                                    </div>
                                </div>
                                <div className="cm-share-decs">
                                    {/* <p dangerouslySetInnerHTML={{ __html: text?.replace(/\n/g,'<br/>') }}></p> */}
                                    <div className="cm-share-txt"><pre>{ txt }</pre></div>
                                    <div className="cm-share-imgs">
                                        { resourceList && !!resourceList.length && (
                                            resourceList.map((item, index) => (
                                                <Picture className="cm-share-img" key={ index } src={item.url} resize={{w:300,h:300}}/>
                                            ))
                                        ) }
                                    </div>
                                </div>
                                {topicDto && <div className="cm-share-camp">
                                    <div className="cm-camp-info">
                                        <div className="cm-camp-pic">
                                            <Picture src={topicDto.imgUrl} resize={{w:90,h:90}}/>
                                        </div>
                                        <div className="cm-camp-title">
                                            <p>{ topicDto.name }</p>
                                        <span><i>{ topicDto.userNum }次互动</i><i>{ topicDto.ideaNum }条想法</i></span>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                            <div className="cm-share-cord">
                                <div className="">
                                    <img src={ img } alt=""/>
                                    <p>长按扫码，查看更多内容</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PressHoc className="cm-share-cont cm-share-img" region="shara-changtu"> 
                        <img src={ imageDom } />
                    </PressHoc>
                </div>
            </PortalCom>
            <PortalCom className="cm-shrae-close">
                <span className="close-btn" onClick={(e) => {e.preventDefault();e.stopPropagation();colseProcess && colseProcess()}}></span>
            </PortalCom>
            <PortalCom className="cm-share-btns">
                <div className="container">
                    <div className="cm-share-btns-tips" onClick={(e)=>{clickTips(e)}}>
                        PS: 请长按图片保存，发送给好友
                        {showTips && <span>请长按上方海报保存哦</span>}
                    </div>
                    <div className="cm-share-btns-link" onClick={(e) => {clickLink(e)}}>
                        <i className="link-icon"></i>发送链接
                    </div>
                </div>
            </PortalCom>
        </>
    )
}

@ErrorBoundary()
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
        if(isQlchat()) {
            const topBg=await getCommunityCardBg()   
            const  {...otherProps} =this.props  
            ideaCards({
                ...otherProps,topBg
            },(url)=>{ 
                this.setState({
                    processUrl:url,
                    isShowType:'idea'
                },()=>{
                    
                })
            }) 
        }
        this.showProcess() 
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
        const { processUrl, isShowType, isShowProcess } = this.state
        const {id,userId,hideNum, shareNum, createTime, content='',className,childHandleAppSecondary, ideaInfo, needShowTips, tips,tipsMiddle,wechatShare } = this.props 
        return (
            <Fragment>
                
                <div className="iic-top">
                    <div 
                        data-log-name={ "想法分享" }
                        data-log-region={"un-community-idea-share"}
                        data-log-pos={ id } 
                        onClick={(e)=>{e.stopPropagation(); e.preventDefault(); this.shareDay(createTime)}}
                        className={`iic-item on-log on-visible ${className}`}>
                            {wechatShare ? <i className="share-wechat-btn"></i> : <i className="iconfont iconfenxiang"  ></i>} 
                            {!hideNum&&digitFormat(shareNum || 0) } 
                            {content}
                    </div>
                    {
                        needShowTips && <div className={`${tipsMiddle ? 'tips-middle' : 'tips-left'} share-tips`}><i className="wechat-icon"></i>{tips}</div>
                    } 
                </div> 
                { isQlchat() ? (
                    createPortal(
                        <PosterDialog 
                            isShow={ isShowProcess } 
                            imgUrl={processUrl}
                            on={1}
                            close={ this.colseProcess }
                            className={isShowType}
                            childHandleAppSecondary={childHandleAppSecondary}
                            children={
                                <div>
                                    <img src={processUrl}/>
                                </div>
                            }
                            />
                        ,document.getElementById('app'))
                ) : (
                    isShowProcess && (
                        <ShareBox colseProcess={this.colseProcess} { ...ideaInfo } />
                     )
                ) }
            </Fragment>
        )
    }
}



