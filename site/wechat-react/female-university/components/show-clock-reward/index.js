import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import PortalCom from '../portal-com'

/**
  参数：
    rewardName : 奖励名称
    styleObj:外框样式
    headLogo:头部的logo 可选：money popular present time
    children:子节点内容,子节点样式自定义
    clickFunc:点击"马上领取"触发方法
    <ShowClockReward rewardName="每日打卡奖励" styleObj={{'backgroundColor':'#FF9C01'}} headLogo="popular" clickFunc={() => {}}>
        <p className="name">大学时长</p>
        <p className="content">24小时</p>
    </ShowClockReward>
 */

function ClockReward(props){
    const {rewardName = '' , styleObj = {}, headLogo = 'money',clickFunc,footerTxt, type = ''} = props
    return (
        <>
            <PortalCom className="clock-reward-container" >
                <div data-desc="底层光线" className="light"></div>
                <div data-desc="头部logo" className={`head-logo ${headLogo}`}></div>
                <div className="clock-reward-center" style={styleObj}>
                    <h4>
                        <span>{rewardName}</span>
                    </h4>
                    <div className="reward">
                        {/* {子内容} */}
                        {props.children}
                    </div>
                    <p className="deadline-tips">{ footerTxt }</p>
                    <div className="get-present on-log on-visible" onClick={() => clickFunc(type)}>马上领取</div>
                </div>
            </PortalCom>
        </>
  );
}
export default ClockReward