import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom';
import { locationTo } from 'components/util';
import { getMenuNode } from '../../actions/home'

/**
 * @description: 分享有礼入口
 * @param {className} 
 * @return: 
 */ 
function CampGiftEntry({className='',campId,nodeCode,region}) {
    const [imgUrl,setImgUrl] = useState(false)
    const getNode = useCallback(
        async () => {
            const {menuNode} =await getMenuNode({nodeCode})
            setImgUrl(menuNode?.keyG)
        },
        [imgUrl],
    )
    useEffect(() => {
        getNode()
    }, [])
    return ( 
        createPortal(
            <div className={`experience-camp-gift-entry on-log on-visible ${className}`}  
                data-log-name='分享有礼入口'
                data-log-region={region||"experience-camp-gift-entry"}
                data-log-pos="0" 
                onClick={()=>{locationTo(`/wechat/page/experience-camp-invite?nodeCode=${nodeCode}`)}}>
                {imgUrl&&<img src={imgUrl}/>}
            </div>
            ,document.getElementById('app'))
    )
}

export default CampGiftEntry