 
import QRCode from 'qrcode'
import { getCookie,formatDate } from 'components/util'; 
import { invitationCard } from './card-join'
import { successCard } from './card-success' 
import { daysCard } from './card-days' 

/**
 *邀请见证卡
 *
 * @export
 * @param {*} universityFlagData
 * @param {*} [flagHelpList=[]]
 * @param {*} cb
 */
export async function initMinCards(universityFlagData,flagHelpList=[],cb){  
    const {userHeadImg,desc,userName,cardTime} =universityFlagData 

    let data = {
        picUrl: userHeadImg||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png',
        name: userName,
        decs: desc,
        status: '我的见证人',
        day: cardTime+'天', 
        otherAvator:[ ]
    }
    for(let i=0;i<4;i++){
        if(flagHelpList[i]?.userHeadImg){
            data.otherAvator.push(flagHelpList[i]?.userHeadImg)
        }
    }
     data.qrUrl = await  getQr(`https://ql.kxz100.com/wechat/page/university/flag-show?wcl=university_share_wit&userId=${getCookie("userId")}`);  
    
    invitationCard("https://img.qlchat.com/qlLive/business/Y3ADA4JQ-2WZS-UXTY-1560411961620-HHS846899SPZ.png",data,(url)=> {
        typeof cb=='function'&&cb(url)
    }, 604, 888);
} 
/**
 *成就卡
 *
 * @export
 * @param {*} universityFlagData
 * @param {*} [flagHelpList=[]]
 * @param {*} cb
 */
export async function initSuccessCards(universityFlagData,flagHelpList=[],cb){  
    const {userHeadImg,desc,userName,cardTime,money} =universityFlagData 

    let data = {
        picUrl: userHeadImg ||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png',
        name: userName,
        decs: desc,
        status: '发起人',
        money: money,
        statusNext: '见证人',
        day: cardTime+'天', 
        otherAvator:[ ]
    } 
    for(let i=0;i<4;i++){
        if(flagHelpList[i]?.userHeadImg){
            data.otherAvator.push(flagHelpList[i]?.userHeadImg)
        }
    }
     data.qrUrl = await  getQr(`https://ql.kxz100.com/wechat/page/university/flag-show?wcl=university_share_clock_ach&userId=${getCookie("userId")}`);  
     successCard("https://img.qlchat.com/qlLive/business/E3LFEPDQ-KDGW-XVZH-1560411984343-HMLEGWGUMN16.png",data,(url)=> {
        typeof cb=='function'&&cb(url)
    }, 906, 1332); 
} 

    // 生成二维码
export async function getQr (url){ 
    const res=QRCode.toDataURL(url, {
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff" 
        })
        .then(url => {
            return url
        })
        .catch(err => {
            console.error(err)
        })     
    return res
} 


/**
 *每日打卡
 *
 * @export
 * @param {*} {universityFlagData,flagCardList,flagHelpListData,date}
 * @param {*} cb
 */
export async function  initDaysCards({universityFlagData,flagCardList,flagHelpListData,date,topBg,studentInfo},cb){ 
        
    const flagHelpList = flagHelpListData?.data?.flagHelpList || [] 
    const {userHeadImg,userName,cardDate} = universityFlagData 
    const card=flagCardList.find((item,index)=>{ 
        return  formatDate(parseFloat(item.cardDate)) ==  formatDate(parseFloat(date))
    }) 
    const time = (new Date()).getTime() 
    const cardTime= Math.ceil((time-studentInfo.createTime)/(1000*60*60*24))
    let dataDays = {
        picUrl: userHeadImg ||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png',
        cardTime:cardTime,
        name: userName,
        decs: card.desc,
        status: '我发起了30天学习挑战，刚写下学习心得',
        statusNext: '我的见证人', 
        otherAvator:[],
        topBg,
        logo:'https://img.qlchat.com/qlLive/business/SH7CL95E-983W-FSMV-1564132706804-FNCQP9LNPV46.png'
    } 
    dataDays.qrUrl = await getQr(`https://ql.kxz100.com/wechat/page/university/flag-card-detail?ch=hbldy&wcl=university_share_clock_con&cardId=${card.id}&userId=${getCookie("userId")}`); 
    daysCard("https://img.qlchat.com/qlLive/business/GS3RPGGV-JW93-2HSO-1565144264344-G4NUYNDTHFDR.png", dataDays,(url)=> {
        typeof cb=='function'&&cb(url)
    }, 750, 1116);
}



export function loadUrl(url, is_cors = true) {
    return new Promise((resolve, reject) => {
        var img = new Image()
        if (is_cors) img.crossOrigin = 'Anonymous';
        var objectURL = null
        if (url.match(/^data:(.*);base64,/) && window.URL && URL.createObjectURL) {
            objectURL = URL.createObjectURL(dataURL2blob(url))
            url = objectURL
        }
        img.onload = () => {
            objectURL && URL.revokeObjectURL(objectURL)
            resolve(img)
        }
        img.onerror = () => {
            reject(new Error('That image was not found.:' + url.length))
        }
        img.src = url
    })
}

export function dataURL2blob(dataURL) {
    let binaryString = atob(dataURL.split(',')[1]);
    let arrayBuffer = new ArrayBuffer(binaryString.length);
    let intArray = new Uint8Array(arrayBuffer);
    let mime = dataURL.split(',')[0].match(/:(.*?);/)[1]
    for (let i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i);
    }
    let data = [intArray];
    let result;
    try {
        result = new Blob(data, { type: mime });
    } catch (error) {
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if (error.name === 'TypeError' && window.BlobBuilder) {
            var builder = new BlobBuilder();
            builder.append(arrayBuffer);
            result = builder.getBlob(type);
        } else {
            throw new Error('没救了');
        }
    }
    return result;
}

export function multiTextWithLine(ctx, text, textObj, fontFamiry = "微软雅黑") {
    let { left, top, width, maxLine, lineHeight, font, color, bolder } = textObj;
    ctx.save();
    ctx.font = (bolder ? 'bold ' : '') + font + 'px ' + fontFamiry;
    ctx.fillStyle = color;
    var words = text.split('');
    var line = '';
    var lines = 1;
    for (var i = 0; i < words.length; i++) { 
        line += words[i];
        /* 文字内容全部取完，直接绘制文字*/
        if (i === words.length - 1) {
            ctx.fillText(line, left, top, width);
            break;
        }
        if (ctx.measureText(line).width >= width||words[i].indexOf('\n')>-1) {
            /* 已经到达最大行数，用省略号代替后面的部分*/
            if (lines === maxLine) {
                line = line.slice(0, line.length - 3) + '...';
            }
            ctx.fillText(line, left, top, width);
            if (lines === maxLine) {
                break;
            }
            line = words[i].indexOf('\n')>-1?'        ':'';
            top += lineHeight;
            lines += 1;
        }
    }
    ctx.restore();
};