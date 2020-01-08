 
import {fillParams, getUrlParams } from 'components/url-utils'; 
import { getCookie,formatDate } from 'components/util';
import { share } from 'components/wx-utils';
import {  initConfig } from '../../actions/home';
import appSdk from 'components/app-sdk';

export async function  falgShareProgress(opts={}) {  
    if(!sessionStorage?.UFW_SHARE_FLAG_COUPON_AMOUNT){
        const {UFW_SHARE_FLAG_COUPON_AMOUNT}=await initConfig({businessType:'UFW_CONFIG_KEY'}) 
        sessionStorage.setItem('UFW_SHARE_FLAG_COUPON_AMOUNT',UFW_SHARE_FLAG_COUPON_AMOUNT)
    } 
    let i = Math.floor(Math.random()*5)
    let num = Math.floor(Math.random()*60)+40
    let descList = [ 
        {title:'只有你能帮我，我自己都不行！来当我的见证人吧',desc:'接受邀请>>'},
        {title:'你人这么好，愿意来当我的见证人吗？',desc:'接受邀请>>'},
        {title:`[有人@我]邀请你来做我的见证人，特制${sessionStorage?.UFW_SHARE_FLAG_COUPON_AMOUNT}元专属券给你！`,desc:'点击领取>>'},
        {title:`你被${num}位好友推选为【最想一起学习的人】，来当我的见证人吧！`,desc:'点击查看>>'},
        {title:`在吗？我发起了30天挑战，做我的见证人，领${sessionStorage?.UFW_SHARE_FLAG_COUPON_AMOUNT}元红包！`,desc:'点击领取>>'},
    ] 
    let shareUrl = fillParams({},`${location.origin}/wechat/page/university/flag-show?userId=${opts.userId||getCookie("userId")}&wcl=university_share`)
    opts.shareUrl = opts.shareUrl?fillParams({wcl:'university_share'},opts.shareUrl):''
     
    share({
        title:opts.title|| descList[i].title,
        timelineTitle: opts.title||descList[i].title,
        desc: opts.desc||descList[i].desc,
        timelineDesc:opts.desc|| descList[i].desc,
        imgUrl: opts.imgUrl||'https://img.qlchat.com/qlLive/liveCommon/nzdx.png',
        shareUrl:opts.shareUrl|| shareUrl,
        successFn:opts.successFn
    });
    appSdk.shareConfig({
        title:opts.title|| descList[i].title, 
        desc: opts.desc||descList[i].desc, 
        thumbImage: opts.imgUrl||'https://img.qlchat.com/qlLive/liveCommon/nzdx.png',
        content:opts.shareUrl|| shareUrl,
        success:opts.successFn
    }) 
}

export async function  falgShareSuccess(opts={}) {   
    let i = Math.floor(Math.random()*5)
    let num = Math.floor(Math.random()*60)+40
    let descList = [ 
        {title:'你不在的这段时间，我完成了一件大事...',desc:'点击查看>>'},
        {title:'在吗？学习还能得160奖学金',desc:'点击领取>>>'},
        {title:`[Hi，我完成了30天学习挑战，你敢来吗？`,desc:'接受挑战>>'},
        {title:`你被${num}位好友推选为【最想一起学习的人】，不一起来吗？`,desc:'接受邀请>>'},
        {title:`如何边学习边赚钱？这个方法我只告诉你...`,desc:'点击查看>>'},
    ]  
    let shareUrl = fillParams({},`${location.origin}/wechat/page/university/flag-show?userId=${opts.userId||getCookie("userId")}&wcl=university_share`)
    opts.shareUrl = opts.shareUrl?fillParams({wcl:'university_share'},opts.shareUrl):''
     
    share({
        title:opts.title|| descList[i].title,
        timelineTitle: opts.title||descList[i].title,
        desc: opts.desc||descList[i].desc,
        timelineDesc:opts.desc|| descList[i].desc,
        imgUrl: opts.imgUrl||'https://img.qlchat.com/qlLive/liveCommon/nzdx.png',
        shareUrl:opts.shareUrl|| shareUrl,
        successFn:opts.successFn
    });
    appSdk.shareConfig({
        title:opts.title|| descList[i].title, 
        desc: opts.desc||descList[i].desc, 
        thumbImage: opts.imgUrl||'https://img.qlchat.com/qlLive/liveCommon/nzdx.png',
        content:opts.shareUrl|| shareUrl,
        success:opts.successFn
    }) 
}