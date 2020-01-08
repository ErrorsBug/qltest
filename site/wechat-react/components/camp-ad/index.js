import React, { useState, useCallback, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { locationTo } from 'components/util';

function CampAd({ isNoData, keyE, keyI, keyJ, keyF }) {
    const [ hide, setHide ] = useState(true)
    const hideClick = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        setHide(false)
    }, [hide])
    return (
        <>
            { isNoData ? (
                <div className="buy-camp-ad max-btm">
                    <img src={ keyJ || '' } onClick={ () => {
                        locationTo(keyF)
                    } } alt=""/>
                </div>
            ) : (
                <CSSTransition
                    in={hide}
                    timeout={300}
                    classNames="buy-camp-animate"
                    unmountOnExit
                >
                    <div className="buy-camp-ad">
                        { Object.is(keyI, 'Y') && <span className="iconfont iconxiaoshanchu" onClick={ hideClick }></span> }
                        <img src={ keyE } onClick={ () => {
                            locationTo(keyF)
                        } } alt=""/>
                    </div>
                </CSSTransition>
            ) }
        </>
        
    )
}

export default CampAd