import { initCard } from './card' 
 
export const inviteCard = ({keyC,name,headImgUrl,shareUrl})=>{
    return new Promise((resolve,reject)=>{
        initCard({
            cardWidth:750, 
            cardHeight:1334,
            success:(url)=>{
                resolve(url) 
            }, 
            moduleList:[
                {
                    cate:'background',
                    type:'img',
                    value:keyC||'',
                    params:{
                        top: 0,
                        left: 0,
                        width: 750,
                        height: 1334,
                    }
                }, 
                {
                    cate:'avator',
                    type:'img',
                    value:headImgUrl||"https://img.qlchat.com/qlLive/liveCommon/normalLogo.png",
                    params:{
                        top: 32,
                        left: 32,
                        width: 80,
                        height: 80,
                        isClip:true,x: 32, y: 32, w: 80, h: 80, r: 40
                    }
                },
                {
                    cate:'name',
                    type:'text',
                    value:name||'',
                    params:{
                        top: 35,
                        left: 136,
                        width: 600,
                        font: 28,
                        lineHeight: 40,
                        color: "rgba(255,255,255,1)",
                        textAlign: "left",
                        maxLine:1,
                    }
                },
                {
                    cate:'intro',
                    type:'text',
                    value:"已加入，邀你一起学习",
                    params:{
                        top: 79,
                        left: 136,
                        width: 600,
                        font: 22,
                        lineHeight: 32,
                        color: "rgba(255,255,255,0.5)",
                        textAlign: "left",
                        maxLine:1,
                    }
                },
                {
                    cate:'qrcode',
                    type:'qrcode',
                    value:shareUrl||'',
                    params:{
                        top: 1134,
                        left: 528,
                        width: 180,
                        height: 180,
                        isClip:true,x: 528, y: 1134, w: 180, h: 180, r: 12
                    }
                }, 
            ]
        })
    })
}