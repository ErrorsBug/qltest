import React, { Fragment, useState, useCallback, useEffect } from 'react'
import EditAims from '../../../../components/edit-aims'
import TargetPosterBox from '../../../../components/show-target-poster'
import { getQr } from '../../../../actions/camp'
import { getCookie } from 'components/util';

/**
 * 小目标
 * @export
 * @returns
 */
export default function AimsPage({ targetTxt, isSelf, ...otherPage }) {
    const [isAims, setIsAims] = useState(false)
    const [txt, setTxt] = useState(targetTxt)
    const [isShare, setIsShare] = useState(false)
    const [qrUrl, setQrUrl] = useState('')
    // 更新小目标
    const updateTxt = useCallback((value) => {
        setTxt(value)
    }, [txt])
    // 获取二维码
    const saveQr = async () => {
        const url = await getQr(`https://ql.kxz100.com/wechat/page/university-albums?shareUserId=${ getCookie('userId') }&wcl=university_pm_poster_mygoal_dgy_200105`)
        setQrUrl(url)
    }
    useEffect(() => {
        saveQr();
    },[])
    return (
        <Fragment>
            <div className="eb-aims-page">
                <div>
                    <h4>{ isSelf ? '我' : 'TA' }的小目标</h4>
                    { txt ? (
                        <div className="eb-aims-txt " >
                            <pre className="iconfont iconyinhao">{ txt }</pre>
                        </div>
                    ) : (
                        <p>{ isSelf ? '据说敢把目标写出来，已经成功了一半....' : <>目标在她心中<br/>她选择了暂时保密哦~</> }</p>
                    ) }
                    { isSelf && (
                        <div className={ `eb-aims-btns ${ txt ? '' : 'center' }` }>
                            { txt && <div onClick={ (e) => { 
                                e.stopPropagation();
                                e.preventDefault();
                                setIsShare(true) } }>分享海报</div> }
                            <div onClick={ (e) => { 
                                e.stopPropagation();
                                e.preventDefault();
                                setIsAims(true) } } > { txt ? '修改小目标' : '写下小目标' }</div>
                        </div> 
                    ) }
                </div>
            </div>
            { isAims && <EditAims
                onClose={ (e) => { 
                    if(e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    setIsAims(false) } } 
                updateTxt={ updateTxt }
                isUpdate={ !!txt }
                text={ txt } 
                { ...otherPage } /> }
            { isShare && (
                <TargetPosterBox
                    onClose={ (e) => { 
                        e.stopPropagation();
                        e.preventDefault();
                        setIsShare(false) } } 
                    txt={ txt } 
                    qrUrl={ qrUrl }
                    {...otherPage } />
            )}
        </Fragment>
    )
}