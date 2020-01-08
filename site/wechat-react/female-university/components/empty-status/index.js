import React from 'react'

const EmptyStatus = ({ url, text = 'TA还没进入大学哦' }) => (
    <div className="un-empty-status">
        <img src={url||"https://img.qlchat.com/qlLive/business/IV9SBGRT-OOFG-U2JR-1568166724111-FK2ORFJZAENA.png"}/>
        {text}
    </div>
)
export default EmptyStatus