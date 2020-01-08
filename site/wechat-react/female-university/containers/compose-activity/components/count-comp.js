import React, { useState, useEffect } from 'react' 
import PortalCom from '../../../components/portal-com';
import countdownHoc from '../../../hoc/countdown'

const Count = ({ m, s, sm }) => {
    return (
        <p><i> { m }</i>:<i>{ s }</i>:<i>{ sm }</i></p>
    )
}
const CountHoc = countdownHoc(Count)
function CountComp({ nodeCode, courseIds, maxDisCount, nextIdx, discountObj }) {
    const [endTime, setEndTime] = useState(0)
    const countTime = () => {
        let campTime = localStorage.getItem(`compose${ nodeCode }`);
        const time = 15 * 60 * 1000;
        const sysTime = new Date().getTime()
        if(campTime && ((Number(campTime) + time) > sysTime)) {
            campTime = campTime;
        } else {
            campTime = sysTime;
            localStorage.setItem(`compose${ nodeCode }`, campTime);
        }
        const endTime = (Number(campTime) + time)
        setEndTime(endTime)
    }
    useEffect(() => {
        countTime()
    },[endTime])

    const isMax = courseIds.length >= maxDisCount.len
    return (
        <PortalCom className="cp-countdown-box">
            { !!endTime && <>{ isMax ? '已享最高' : `还差${ (nextIdx - courseIds.length) || 0 }门课` }<span>{ (Number(discountObj[(isMax ? maxDisCount.len : nextIdx)]) * 10) || 0 }</span>折优惠（优惠倒计时<CountHoc changeEnd={ countTime } endTime={ endTime } />）</> }
        </PortalCom>
    )
}

export default CountComp