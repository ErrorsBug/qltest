import React, { Fragment, useRef, useEffect, useState } from 'react'
import PortalCom from '../portal-com'
import useH2C from '../../hook/html-canvas'
import PressHoc from 'components/press-hoc';
import { formatDate, getCookie } from 'components/util'
import { getQr } from '../../actions/camp'
import ShowPosterLoading from '../show-poster-loading'

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

/**
 * 毕业证书
 * @export
 * @param {*} { endTime, rewardAwardBtn, type, userName, campName }
 * @returns
 */
export default function ShareCertificate({ endTime, rewardAwardBtn, type, userName, campName, isShowReward, bgUrl }) {
    const nodeRef = useRef(null)
    const [qrUrl, setQrUrl] = useState('')
    const [imageDom, loading, setDom] = useH2C({scale:2});
    const initData = async () => {
        await loadImg(bgUrl)
        const url = await getQr(`https://ql.kxz100.com/wechat/page/university-albums?shareUserId=${ getCookie('userId')}&wcl=university_pm_poster_certificate_dgy_200105`)
        setQrUrl(url)
        setTimeout(() => {
            setDom(nodeRef.current)
        },400)
    }
    useEffect(() =>{
        if(bgUrl) {
            initData();
        }
    },[bgUrl])
    return (
        <Fragment>
            { !imageDom && <ShowPosterLoading decs="加载中" /> }
            <PortalCom className="sc-caert-box">
                <div ref={ nodeRef }>
                    <img src={ bgUrl || '' } alt=""/>
                    <div className="sc-caert-info">
                        <div className="sc-caert-user">
                            <h4>{ userName }</h4>
                            <p>在千聊女子大学《{ campName }》中，坚持学习打卡，特发此状，以资鼓励</p>
                        </div>
                        <div className="sc-caert-footer">
                            <img src={ qrUrl } alt=""/>
                            <div className="sc-caert-decs">
                                <span>女子大学教务处</span>
                                <span>{ formatDate(endTime, 'yyyy.MM.dd') }</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PortalCom>
            <PortalCom className="sc-caert-card">
                <div>
                    <PressHoc className="sc-caert-img" region="camp-certificate-img">
                        <img src={ imageDom } alt=""/>
                    </PressHoc>
                    <p>长按保存你的证书吧~</p>
                    <div className="sc-caert-btn" onClick={ () => rewardAwardBtn(type) }>{ isShowReward ? '返回' : '已保存，领取下个奖励' }</div>
                </div>
            </PortalCom>
        </Fragment>
        
    )
}