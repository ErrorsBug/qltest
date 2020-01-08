import React, { useState } from 'react'

function TipsAnimate({ name, isTips }) {
    const [ isShow, setIsShow ] = useState(isTips)
    if(!isShow) return null;
    function timer() {
        const h = new Date().getHours();
        const m = new Date().getMinutes();
        let hs = h + Number((m/60).toFixed(2));
        if((hs < 5) || (hs >= 23)) {
            return '夜深了，注意休息 💤'
        } else if((hs >= 5) && hs < 12) {
            return `早上好，${ name }☀️`
        } else if(hs >= 12 && hs < 13.5) {
            return `该午休了，${ name }☀💤`
        } else if(hs >= 13.5 && hs < 19) {
            return `下午好，${ name }☕️`
        } else if(hs >= 19 && hs < 23) {
            return `晚上好，${ name }🌙`
        }
    }
    return (
        <div>
            <div className="uni-tips-box" onAnimationEnd={ () => setIsShow(false) }>{ timer() }</div>
        </div>
    );
}

export default TipsAnimate