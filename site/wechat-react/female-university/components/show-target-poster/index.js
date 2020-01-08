import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PortalCom from '../portal-com'
import useH2C from '../../hook/html-canvas'
import PressHoc from 'components/press-hoc';
import ShowPosterLoading from '../show-poster-loading'

/**
 * posterInfo:海报需要的信息
 */
function TargetPosterBox({campName, onClose, userInfo, txt, qrUrl}){
    const nodeRef = useRef(null)
    const [ imageDom, loading, setDom ] = useH2C({scale:2});
    useEffect(() =>{
        setTimeout(()=>{
            setDom(nodeRef.current)
        },300)
    },[])
    useEffect(() => {
        if(Object.is(imageDom,'data:,')) {
            setDom(nodeRef.current)
        } 
    }, [imageDom])
    return (
        <>
            { loading && <ShowPosterLoading decs="加载中" /> }
            {<PortalCom className="poster-target-container">
                <div>
                    <div className="poster-target-bg" onClick={ onClose }></div>
                    <PressHoc className="share-long-image" region="camp-aims-img">
                        <h4>创建成功</h4> 
                        <p>长按保存图片,发给朋友看看吧</p>
                        {!!imageDom && <img src={ imageDom } />}
                    </PressHoc>
                </div>
            </PortalCom>}
            <PortalCom className="poster-target-box">
                <div className="target-poseter-center" ref={ nodeRef }>
                    <img src={ require('./img/target-bg.png') } />
                    <div className="target-poseter-cont">
                        <div className="user-info">
                            <span className="pic"><img src={ userInfo.headImgUrl } alt=""/></span>
                            <span className="name">{ userInfo.userName }</span>
                        </div>
                        <h4>这是我的小目标</h4>
                        <div className="tp-camp-txt"><pre>{ txt }</pre></div>
                        <div className="tp-camp-name">来自 - { campName }</div>
                        <div className="qr-code">
                            <img src={ qrUrl } alt=""/>
                        </div>
                    </div>
                </div>
            </PortalCom>
        </>
    )
}

export default  TargetPosterBox