import React, { useState, useCallback, useRef, useEffect, useMemo, Fragment } from 'react'
import PortalCom from '../portal-com'
import useH2C from '../../hook/html-canvas'
import PressHoc from 'components/press-hoc';
import { formatDate, getCookie } from 'components/util';
import { getQr } from '../../actions/camp'


function PosterAnimer({ className = '', learnTime, classmateNum, endTime, userName }) {
    return (
        <div className={ `graduation-poster-center ${className}` }>
            <h3><img src={ require('./img/icon-01.png') } alt=""/></h3>
            <div className="envelope">
                <div className="content">
                    <h4>{ userName }：
                        { className && <i></i> }
                    </h4>
                    <p>
                        经过<span>{ learnTime || 0 }分钟</span>的学习，和<span>{ classmateNum || 0 }位</span>大学同学朝夕相处，恭喜您又挑战了自我，完成阶段的蜕变~
                    </p>
                    <div className="sign-name">
                        <span>
                            女子大学教务<br/>
                            { formatDate(endTime, 'yyyy.MM.dd') }
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}


/**
 * 毕业典礼
 * @param {*} { className = '' }
 * @returns
 */
function GraduationPoster({isBtn, learnInfo, endTime, receiveAnAward, onClose, userName }){
    const nodeRef = useRef(null)
    const [qrUrl, setQrUrl] = useState('')
    const [ imageDom, loading, setDom ] = useH2C({scale:2});
    const initData = async() => {
        const url = await getQr(`https://ql.kxz100.com/wechat/page/university-albums?shareUserId=${ getCookie('userId') }&wcl=university_pm_poster_graduation_dgy_200105`)
        setQrUrl(url)
        setTimeout(() => {
            setDom(nodeRef.current)
        },100)
    }
    useEffect(() => {
        initData();
    }, [])
    return (
        <Fragment>
            <PortalCom className="graduation-poster-container">
                <div className="gp-content" ref={ nodeRef }>
                    <PosterAnimer { ...learnInfo } userName={ userName } endTime={ endTime } />
                    <div className="gp-ercode">
                        <div>
                            <img src={ qrUrl } />
                            <p>长按扫码，和我一起开始蜕变</p>
                        </div>
                    </div>
                </div>
            </PortalCom>
            <PortalCom className="gp-content-animate">
                <div className="gp-content-cont">
                    <PosterAnimer className="animate" userName={ userName } endTime={ endTime } { ...learnInfo }/>
                </div>
                <PressHoc className="share-long-image" region="camp-graduation-img"> 
                    {imageDom && <img src={ imageDom } />}
                </PressHoc>
            </PortalCom>
            { imageDom && (
                <>
                    { isBtn ? (
                        <PortalCom className="gp-content-btn" onClick={ receiveAnAward }>
                            <span className="icon-dian">点击去领奖</span>
                        </PortalCom>
                    ) : (
                        <PortalCom className="gp-content-close" onClick={ onClose }><i className="iconfont iconxiaoshanchu"></i></PortalCom> 
                    ) }
                </>
            ) }
        </Fragment>
    )
}

export default GraduationPoster