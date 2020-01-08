import React, { useState, useCallback, useEffect } from 'react'
import ReplacementCard from '../replacement-card'
import { locationTo, formatDate } from 'components/util'
import classnames from 'classnames'
import { getCheckInPosterInfo } from '../../../../actions/camp'
import EditIdea from '../../../../components/edit-idea'
import Card from '../card'

// 处理日期
const weeks = ['日', '一', '二', '三', '四', '五', '六']
const handleDate = (date) => {
    const curDate = new Date(date);
    const week = curDate.getDay();
    const today = new Date();
    const params = {}
    params.month = curDate.getMonth() + 1;
    params.day = curDate.getDate(); 
    params.week = weeks[week]
    if(curDate.toDateString() == today.toDateString()){
        params.isToday = true
    } else if(curDate > today){
        params.isUnStart = true
    }
    return params
}

// 打卡状态显示
const checkStaus = ({ isToday, checkInStatus }) => {
    if(Object.is(checkInStatus, 'START')){
        return <p>开营典礼+目标创建</p>
    }
    if(Object.is(checkInStatus, 'END')){
        return <p>闭营典礼</p>
    }
    if(Object.is(checkInStatus, 'NO_NEED')){
        return <p>不用打卡</p>
    }
    if(Object.is(checkInStatus, 'ABSENCE')){
        return <p className="rep-card">点击补卡</p>
    }
    if(Object.is(checkInStatus, 'TO_CHECK')){
        const cls = classnames({
            'today': isToday
        })
        return <p className={ cls }>{ isToday ? '今日·待打卡' : '待打卡' }</p>
    }
    if(Object.is(checkInStatus, 'HAS_CHECK')){
        const cls = classnames('select', {
            'today': isToday
        })
        return <p className={ cls }></p>
    }
}

/**
 * 日历
 * @export
 * @returns
 */
export default function Calendar({ list, campId, periodId, couponInfo, userInfo, subjectInfo, getSubjectInfo, updateChange, isSignStaus }) {
    const [dataList, setDataList] = useState([])
    const [isShow, setIsShow] = useState(false)
    const [idx, setIdx] = useState(null)
    const [isIdea, setIsIdea] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const [isPoster, setIsPoster] = useState(false)
    const [posterInfo, setPosterInfo] = useState({})
    const [checkTime, setCheckTime] = useState('') // 补卡日期
    const [used, setUsed] = useState(couponInfo.used)
    useEffect(() => {
        setUsed(couponInfo.used)
    }, [couponInfo])
    // 处理打卡日历数据
    const handleData = () => {
        let isShowP = false;
        const newList = list.map((item, index) => {
            const params = handleDate(item.date)
            index == 0 && (params.checkInStatus = 'START')
            if(params.isToday){
                Object.is(item.checkInStatus, 'TO_CHECK') && setIsCheck(true) // 显示今天是否待打卡
                if(Object.is(item.checkInStatus, 'HAS_CHECK')) {  // 判断今天是否已打卡
                    isShowP = true
                }
                setIdx(index)
            }
            return {...item, ...params}
        })
        setDataList(newList)
        setIsPoster(isShowP) 
    }
    useEffect(() => {
        handleData();
    }, [list])
    // 点击某一天打卡日历
    const changeDate = useCallback(async({ isToday, isUnStart, checkInStatus, date}, index) => {
        if(!isSignStaus) {
            window.toast('还未报名当前学习营哟~')
            return false
        } 
        if(isUnStart) {
            window.toast('这一天还没到哦~', 3000)
        } else {
            // 补卡
            if(Object.is(checkInStatus, 'ABSENCE')){
                if(couponInfo.total == used) {
                    window.toast('您的补卡券已用完')
                } else {
                    window.loading(true)
                    await getSubjectInfo(new Date(date).getTime());
                    window.loading(false)
                    setIdx(index)
                    setIsShow(true)
                }
            }
            // 今日待补卡
            if(isToday && Object.is(checkInStatus, 'TO_CHECK')){
                setIsPoster(false) 
                setIdx(index)
            }
            // 已打卡
            if(Object.is(checkInStatus, 'HAS_CHECK')){
                setIsPoster(false) 
                await getPosterInfo(date)
                setIsPoster(true) 
                setIdx(index)
            }
        }
    }, [idx, couponInfo, posterInfo, isSignStaus])
    // 关闭补卡
    const onClose = useCallback(() => {
        setCheckTime('')
        setIdx(null)
        setIsShow(false)
    }, [isShow])
    // 确认补卡
    const onRepCard = useCallback(async () => {
        const time = new Date(dataList[idx].date).getTime()
        setCheckTime(time)
        // setIdx(null)
        setIsShow(false)
        setIsIdea(true)
    }, [isShow, isIdea])
    // 打卡
    const goCheckIn = useCallback(() => {
        if(isSignStaus) {
            setIsIdea(true)
        } else {
            window.toast('还未报名当前学习营哟~')
        }
    }, [isIdea, isSignStaus])
    // 获取某一天海报信息
    const getPosterInfo = async(time) => {
        const res = await getCheckInPosterInfo({ periodId: periodId, date: new Date(time).getTime()})
        setPosterInfo(res || {})
    }
    useEffect(() => {
        getPosterInfo(new Date().getTime());
    }, [periodId])
    // 写入补卡信息成功后调用
    const generatePoster = useCallback(async () => {
        await getPosterInfo(checkTime || new Date().getTime())
        setIsPoster(true) 
        dataList[idx] = { ...dataList[idx], checkInStatus: 'HAS_CHECK' }
        setDataList(dataList)
        setCheckTime('')
        // setIdx(null)
        setIsIdea(false)
        setIsShow(false)
        setUsed(used + 1)
    }, [dataList, idx, checkTime])
    return (
        <>
            <div className="oc-calendar-box">
                <div className="oc-calendar-head">学习营日程表</div>
                <div className="oc-calendar-table">
                    <ul className="oc-calendar-list">
                        { dataList.map((item, index) => {
                            const cls = classnames({
                                "unstart": item.isUnStart && !Object.is(item.checkInStatus, 'END'),
                                "current": (!isShow && index == idx) || (item.isToday && !isPoster)
                            })
                            return (
                                <li key={ index } className={ cls } onClick={ () => changeDate(item, index) }>
                                    <span>{ item.month }/{ item.day }</span>
                                    <h4>周{item.week}</h4>
                                    { checkStaus(item) }
                                </li>
                            )
                        }) }
                    </ul>
                </div>
            </div>
            { !!couponInfo.total && <div className="oc-coupon-num">您有{ couponInfo.total || 0 }张补卡券，已使用{ used || 0 }张</div> }
            { isCheck && !isPoster && !isShow && (
                <div className="oc-check-in">
                    <div>
                        <p>今天未打卡<span>（全勤有奖励哦~)</span></p>
                        <div className="oc-check-btn" onClick={ goCheckIn }>点击打卡</div>
                    </div>
                </div>
            ) }
            { isShow && <ReplacementCard onClose={ onClose } onRepCard={ onRepCard } /> }
            { isIdea && (
                <EditIdea 
                    name={ subjectInfo.topicName }
                    id={ subjectInfo.topicId}
                    periodId={ periodId }
                    campId={ campId }
                    checkTime={ checkTime }
                    generatePoster={ generatePoster }
                    handleShowEdit={ () => setIsIdea(false) }
                    editType={ 'check' } />
            ) }
            { isPoster && <Card updateChange={ updateChange } isCheck={isIdea } posterInfo={ posterInfo } userInfo={ userInfo } /> }
        </>
    )
}