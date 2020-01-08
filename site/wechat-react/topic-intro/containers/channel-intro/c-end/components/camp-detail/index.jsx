import React from 'react'
import { formatDate } from 'components/util'
const arrDays = ['周一','周二','周三','周四','周五','周六','周日']

const handleDays = (days) => {
  if(!!days){
    const setDays = new Set([...days.split(',')]);
    return [...arrDays].filter((_,index) => setDays.has(String(index+1))).join('、');
  }
};

const CampDetail = ({ periodPo:{ startTime,days,alertTimeStr }, planCount, isNewCamp }) => (
  <div className="camp-detail-box">
    <h3>训练营须知</h3>
    <p>1. 本期训练营共有<span>{ planCount }</span>节课；</p>
    <p>2. 购买即报名，报名后即可预学课程和作业，训练营服务会在<span>{ startTime && formatDate(startTime, 'MM月dd日') }</span>开始；</p>
    <p>3. 在开营前要加入到班级群，跟着老师一起学习更有效；</p>
    {
      isNewCamp !== 'Y' && <p>4. 学习计划是<span>{ handleDays(days) }</span>一起学，上课日会在当天<span>08:00</span>发学习通知，不需要可自行取消通知。</p>
    }
    
  </div>
)

export default CampDetail