import React, { useState, useEffect, useCallback } from 'react'
import PortalCom from '../portal-com';
import ReactSwiper from 'react-id-swiper'
import { setTarget, getRecommendTargetList, getQr, updateTarget } from '../../actions/camp'
import TargetPosterBox from '../show-target-poster'
import { getCookie } from 'components/util'
import Pubsub from 'pubsub-js'

const AimsItem = ({ onSelectTxt, idx, className, text }) => {
    return (
        <div className={ `cf-aims-item ${ className }` } onClick={ () => onSelectTxt(text, idx) }>
            <p>{ text }</p>
        </div>
    )
}


/**
 * 编辑目标
 * @export
 * @returns
 */
export default function EditAims({ onClose, periodId, campId, text = '', updateTxt, isUpdate, isQlchat, ...otherProps }){
    const [txt, setTxt] = useState(text)
    const [len, setLen] = useState(0)
    const [maxLen, setMaxLen] = useState(false)
    const [idx, setIdx] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [lists, setLists] = useState([])
    const [qrUrl, setQrUrl] = useState('')
    // 获取推荐小目标
    const getTargetList = async () => {
        const { targets } = await getRecommendTargetList({ campId });
        setLists(targets || [])
    }
    // 获取二维码
    const saveQr = async () => {
        const url = await getQr(`https://ql.kxz100.com/wechat/page/university-albums?shareUserId=${ getCookie('userId')}&wcl=university_pm_poster_mygoal_dgy_200105`)
        setQrUrl(url)
    }
    useEffect(() => {
        saveQr();
        getTargetList()
    }, [])
    const changeTxt = useCallback((e) => {
        const value = e.target.value;
        if(value.length === 150) {
            setMaxLen(true)
        } else {
            setMaxLen(false)
        }
        if(value.length > 150) {
            setMaxLen(true)
            window.toast('输入目标不能超过150个文字哟')
            return false
        }
        setTxt(value)
        setLen(value.length)
    }, [ txt ])
    // 保存
    const onPost = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const { result } = isUpdate ? await updateTarget({ campId, periodId, text: txt }) : await setTarget({ campId, periodId, text: txt });
        if(Object.is(result, 'Y')) {
            Pubsub.publish('createAims', 'Y')
            if(isQlchat) {
                updateTxt && updateTxt(txt)
                onClose()
            }else {
                setIsShow(true)
            }
        } else {
            window.toast('创建失败, 请稍后再试！')
        }
    }
    // 选择推荐文案
    const onSelectTxt = useCallback((value, index) => {
        setLen(value.length)
        setIdx(index)
        setTxt(value)
    }, [idx])
    // 关闭海报
    const onCloseA = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        updateTxt && updateTxt(txt)
        onClose()
        setIsShow(false)
    }, [txt])
    const opts = {
        slidesPerView: 1.4,
        spaceBetween: 16,
        // loop: true
    }
    return (
        <>
            <PortalCom className="cf-edit-aims">
                <div className="cf-edit-head">
                    <h4>写下你想达成的目标</h4>
                    <i className="iconfont iconxiaoshanchu" onClick={ onClose }></i>
                </div>
                <div className="cf-edit-txt">
                    <textarea value={ txt } placeholder="希望自己通过这一阶段的学习完成什么小目标呢？写下来吧！" onChange={ changeTxt }></textarea>
                    <span><i className={ maxLen ? 'red' : '' }>{ len }</i>/150</span>
                </div>
                { !!lists.length && (
                    <div className="cf-aims-list">
                        <h4>推荐小目标</h4>
                        <ReactSwiper { ...opts }>
                            { lists.slice(0,10).map((item, index) => (
                                <div key={ index }>
                                    <AimsItem 
                                        text={ item }
                                        onSelectTxt={ onSelectTxt } 
                                        className={ `${ idx === index ? 'action' : '' }` } 
                                        idx={ index } />
                                </div>
                            )) }
                        </ReactSwiper>
                    </div>
                ) }
            </PortalCom>
            <PortalCom className={ `cf-release-btn ${ len ? 'action' : '' }` } onClick={ onPost }>
                发布
            </PortalCom>
            { isShow && <TargetPosterBox txt={ txt } onClose={ onCloseA } qrUrl={ qrUrl } {...otherProps} /> }
        </>
    )
}