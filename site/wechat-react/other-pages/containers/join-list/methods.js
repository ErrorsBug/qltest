/*
 * @Author: shuwen.wang 
 * @Date: 2017-07-13 16:32:09 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-19 18:32:42
 */
import React from 'react';

/* 四种话题类型 */
export const TOPIC = 'TOPIC'
export const CHANNEL = 'CHANNEL'
export const VIP = 'VIP'
export const CUSTOMVIP = 'CUSTOMVIP'
export const CAMP = 'CAMP'

/* 根据类型匹配页面标题 */
export const titleMap = {
    TOPIC: '课程报名列表',
    CHANNEL: '系列课报名列表',
    VIP: 'VIP报名列表',
    CAMP: '训练营报名列表',
}


/**
 * 返回踢出确认框的内容
 * 
 * @export
 * @param {string} name 用户名
 */
export function genKickConfirmContent(name, status) {
    return (<section className='join-list-confirm-content'>
        {
            status === 'N' &&
            <p>踢出后，该用户将不能访问本话题。</p>
        }
        {
            status === 'N' &&
            <p>若用户已付款，请与用户自行协商退款问题。</p>
        }
        <em>确定将 {name} {status === 'Y' && '取消'}踢出？</em>
    </section>)
}

/**
 * 返回拉黑确认框的内容
 * 
 * @export
 * @param {string} name 用户名
 */
export function genBlackConfirmContent(name, status) {
    return <section className='join-list-confirm-content'>
        {
            status === 'N' &&
            <p>黑名单后，将拒绝该用户访问你的直播间</p>
        }
        <em>确定将 {name} {status === 'Y' && '取消'}加入黑名单？</em>
    </section>
}

/* 默认的用户头像地址 */
export const defaultUserPortrait = 'http://img.qlchat.com/qlLive/liveCommon/normalLogo.png'