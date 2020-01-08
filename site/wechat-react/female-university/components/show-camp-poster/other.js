import React, { useState,  useRef, useEffect } from 'react'
import PressHoc from 'components/press-hoc';
import ShowPosterLoading from '../show-poster-loading'
import { initCard } from './card'
import { getQr } from '../../actions/camp'
import { getCookie } from 'components/util';

/**
 * posterInfo:海报需要的信息
 */
function CampPosterBox({action, bgUrl, goldenSentence, noteCount, progress, userName, campName, headImgUrl, day, author, updateChange, isCheck }){
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
            isCheck && updateChange && updateChange();
        }, 1500, 3248)
    }
    useEffect(() =>{
        if(bgUrl) {
            initData();
        }
    },[url, bgUrl])
    return (
        <>
            {!url && <ShowPosterLoading decs="加载中" />}
            <PressHoc className="share-long-image " region="camp-everyday-img"> 
                <div ref={ nodeRef } style={ {height: `${ h }px`} }>
                    {url && <img src={ url } />}
                </div>
            </PressHoc> 
        </>
    )
}
export default CampPosterBox