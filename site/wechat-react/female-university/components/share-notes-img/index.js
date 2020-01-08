import React, { Fragment, useState, useEffect, useRef } from 'react'
import PortalCom from '../portal-com'
import useH2C from '../../hook/html-canvas'
import { isQlchat,isPc } from 'components/envi'
import PressHoc from 'components/press-hoc';
import Picture from 'ql-react-picture';
import ShowPosterLoading from '../show-poster-loading'
import { getQr } from '../../actions/camp'
import { getCookie } from 'components/util'
import './style.scss'


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
/**
 * 笔记图片
 * @export
 * @returns
 */
export default function ShareNotesImg({ shareInfo, onCloseShare }) {
    const [ img, setImg ] = useState('');
    const nodeRef = useRef(null)
    const { campName, title, checkInTime, keyContent, studyCampCheckInDto, studyCampCheckInIdeaRsp, type } = shareInfo;
    const info = studyCampCheckInDto || studyCampCheckInIdeaRsp || {}
    const imgList = info.resourceList || []
    const params = {
        scale: info.text?.length < 1000 ? 1.6 : info.text?.length > 3500 ? 1.2 : 1.3
    }
    if(isPc()){
        params.scale = 1.6;
    }
    const [ imageDom, loading, setDom ] = useH2C(params);
    const getQrImg = async () => {
        const wcl = Object.is(type, 'paper') ? 'university_pm_poster_paper_dgy_200105' : 'university_pm_poster_mydairy_dgy_200105'
        const url = await getQr(`https://ql.kxz100.com/wechat/page/university-albums?shareUserId=${ getCookie('userId') }&wcl=${wcl}`); 
        setImg(url)
        await loadImg(info.userHeadImg)
        if(!!imgList.length) {
            await handleRecursive(imgList)
        }
        setTimeout(() => {
            setDom(nodeRef.current)
        },800)
    }
    useEffect(() => {
        getQrImg();
    }, [imgList, info])
    useEffect(() => {
        if(!!imageDom) {
            if(Object.is(imageDom,'data:,')) {
                setTxt(`${text.slice(0,3500)}...`)
                setDom(nodeRef.current)
            }
        }
    },[imageDom])
    return (
        <Fragment>
            { !imageDom && <ShowPosterLoading decs="图片生成中" /> }
            <PortalCom className="share-botes-box">
                <div>
                    <div className="share-botes-cont" ref={nodeRef}>
                        <div className="share-botes-pic">
                            <Picture src={ info.userHeadImg || '' } resize={{ w: 160, h: 160 }} />
                        </div>
                        <h3>
                            { info?.userName?.length > 5 ? (<i>{ info?.userName?.slice(0,5) }...</i>) : info?.userName }
                            { Object.is(type, 'paper') ? <i>的毕业论文</i> : <i>的蜕变日记</i> }
                        </h3>
                        { Object.is(type, 'paper') && (
                            <div className="share-botes-decs">千聊女子大学 ·《
                                <i>{ campName }</i>
                            》</div>
                        ) }
                        { !Object.is(type, 'paper') && !!keyContent && (
                            <div className="share-botes-com">
                                <h4>今日学习重点</h4>
                                { keyContent.split('\n').map((item, index) => (
                                    <p key={ index }>{ item }</p>
                                )) }
                            </div>
                        ) }
                        <div className="share-botes-com">
                            { !Object.is(type, 'paper') && <h4>我的学习心得</h4>  }
                            <div className="share-botes-txt">
                                <pre>{ info?.text}</pre>
                            </div>
                            { imgList.map((item, index) => (
                                <Picture className="share-botes-img" key={ index } src={ item.url || '' } /> 
                            )) }
                        </div>
                        <div className="share-botes-ercode">
                            <div className="share-botes-info">
                                <p>我正在女子大学坚持学习，想知道我在学习什么吗？</p>
                                <span>长按扫码，查看我的学习报告</span>
                            </div>
                            <div className="share-botes-code">
                                <img src={ img } />
                            </div>
                        </div>
                    </div>
                    <PressHoc className="share-notes-img" region={ `camp-${ Object.is(type, 'paper') ? 'paper' : 'checkin' }-img` }>
                        <Picture src={ imageDom || '' } />  
                    </PressHoc>
                </div>
            </PortalCom>
            <PortalCom className="share-notes-btn">长按页面，保存笔记</PortalCom>
            <PortalCom className="share-notes-close" onClick={onCloseShare}><i className="iconfont iconxiaoshanchu"></i></PortalCom>
        </Fragment>
        
    )
}