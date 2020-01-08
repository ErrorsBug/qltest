import React from 'react' 
import { createPortal } from "react-dom"

const FloatRightTopBtn = ({onClick,region="", text="我的奖学金",img="https://img.qlchat.com/qlLive/business/OUWOWB9R-6CL8-T6IE-1573630177585-DOPJS2T9MPAD.png",className=""}) => {
    return createPortal(
        <div onClick={()=>{onClick&&onClick()}} 
            data-log-name={ text }
            data-log-region={region}
            data-log-pos={ 0 } 
            className={`float-right-top-btn  on-log on-visible ${className}`}>
            <img src={img}/><span>{text}</span>
        </div>,document.getElementById('app')
    )
}

export default FloatRightTopBtn