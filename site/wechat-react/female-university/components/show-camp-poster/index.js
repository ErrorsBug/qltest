import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PortalCom from '../portal-com'
import PressHoc from 'components/press-hoc';
import ShowPosterLoading from '../show-poster-loading'
import { locationTo, getCookie } from 'components/util';
import { initCard } from './card'
import { getQr } from '../../actions/camp'

/**
 * posterInfo:海报需要的信息
 */
function CampPosterBox({action, bgUrl, goldenSentence, noteCount, progress, userName, campName, headImgUrl, day, campId, author, periodId, hidePoster, isCheck }){
    const [url, setUrl] = useState('')
    const [h, setH] = useState(0)
    const nodeRef = useRef(null)
    // 初始化画卡
    const initData = async () => {
        const qrUrl = await getQr(`https://ql.kxz100.com/wechat/page/university-albums?shareUserId=${ getCookie('userId') }&wcl=university_pm_poster_everyday_dgy_200105`)
        const opts = {
            day: day || '1',
            dayName: '天',
            golden: `     ${ goldenSentence }`,
            goldenName: `—— ${  author }`,
            userName: userName || "",
            headImg: headImgUrl || '',
            campName: (campName?.length > 20 ? `${ campName.slice(0,20)}...`: campName) || '', 
            noteCount: `${ noteCount || '0' }篇`,
            progress: `${(Number(progress || 0) * 100).toFixed(1)}%`,
            action: `${ (Number(action || 0) * 100).toFixed(1) }%`,
            qrUrl: qrUrl
        }
        initCard(bgUrl, opts, (url) => {
            const width = nodeRef.current.clientWidth;
            const h = (width/1500) * 2660;
            setH(h)
            setUrl(url)
        }, 1500, 3248)
    }
    useEffect(() =>{
        initData();
    },[url, bgUrl])
    const handleLink = useCallback(() => {
        if(hidePoster) {
            hidePoster()
        } else {
            locationTo(`/wechat/page/university/popularity-rank?campId=${ campId }&periodId=${ periodId }`) 
        }
    }, [])
    return (
        <>
            {!url && <ShowPosterLoading isCheck={ isCheck } />}
            {<PortalCom className="poster-produce-container">
                <div>
                    <div className="poster-produce-bg" onClick={ handleLink }></div>
                    <PressHoc className="share-long-image " region="camp-everyday-img"> 
                        <div ref={ nodeRef } style={ {height: `${ h }px`} }>
                            {url && <img src={ url } />}
                        </div>
                    </PressHoc> 
                    <h4>长按保存你的成就海报</h4>
                    <p>同学们都已把海报打卡到朋友圈啦~</p>
                </div>
            </PortalCom>}
        </>
    )
}
export default CampPosterBox