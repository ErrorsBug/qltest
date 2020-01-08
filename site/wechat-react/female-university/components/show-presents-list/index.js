import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PortalCom from '../portal-com'
import { formatMoney } from 'components/util'
/**
 * info:礼物清单参数
 */
function PresentsList({ info, closeFun, ruleInfo = {} }) {

    const { checkIn, fullAttendance, cash, surrounds } = ruleInfo
    return (
        <>
            {<PortalCom className="presents-list-container">
                <div className="presents-detail">
                    {closeFun && <div date-desc="点击关闭" className="close-btn" onClick={closeFun}></div>}
                    <div className="title">
                        <h4>礼包清单</h4>
                        <p>认真学习坚持打卡，还能拿大奖！</p>
                    </div>
                    <div className="each-item">
                        { !!checkIn && (
                            <>
                                <h5>每日打卡</h5>
                                <p>每日完成打卡，可领取{(checkIn / 24).toFixed(2)}天大学时长</p>
                            </>
                        ) }
                        { !!fullAttendance && (
                            <>
                                <h5>全勤打卡学员可获得</h5>
                                <p>
                                    结业证书电子版<br />
                                    额外再送{(fullAttendance / 24).toFixed(2)}天大学时长
                                </p>
                            </>
                        ) }
                        { (!!surrounds?.length || !!cash?.length) && <h5>高人气学员可获得</h5> }
                        { surrounds && surrounds.map((item, idx) => (
                                <p key={idx} className='popularity-award-top'>影响力前{item.topN}名，获得{item.text}</p>
                            ))
                        }
                        {cash && cash.map((item, index) => (
                            <p key={index} className='popularity-award'>影响力第{item.position}名，额外奖励￥{formatMoney(item.cash)}元</p>
                        ))}
                    </div>
                    <div className="tips">
                        自古学霸收获多，所有奖励可叠加!
                    </div>
                </div>
                <div className="presents-bottom-box"></div>
            </PortalCom>}
        </>
    )
}

export default PresentsList