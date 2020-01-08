 
import QRCode from 'qrcode'
import { getCookie,formatDate } from 'components/util'; 
import { cardCommunity } from './card-community' 
import { cardIdea } from './card-idea' 

/**
 *社区首页
 *
 * @export
 * @param {*} universityFlagData
 * @param {*} [flagHelpList=[]]
 * @param {*} cb
 */
export async function communityCards({userId,headImgUrl,userName,verified,userTagList=[],hobby},cb){   

    let data = {
        picUrl: headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png',
        name: userName,
        decs: hobby,
        status: verified, 
        cateList:userTagList,
        vlogo:'https://img.qlchat.com/qlLive/business/1UKY8IVL-O57B-GLBQ-1567760386625-2QTAQ4UJ4DSO.png'
    } 
     data.qrUrl = await getQr(`${location.origin}/wechat/page/university/community-home?studentId=${userId}`); 
     
     cardCommunity("https://img.qlchat.com/qlLive/business/X5OP2BC7-DQRK-4YGX-1569206406359-8F9VPSJH5AJL.png",data,(url)=> {
        typeof cb=='function'&&cb(url)
    }, 1125, 1653);
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
 *想法
 *
 * @export
 * @param {*} {universityFlagData,flagCardList,flagHelpListData,date}
 * @param {*} cb
 */
export async function  ideaCards({id,headImgUrl,topBg,userName,text},cb){  
    let dataDays = {
        picUrl: headImgUrl ||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png', 
        name: userName,   
        topBg,
        text,
        logo:'https://img.qlchat.com/qlLive/business/8C9IW1Z7-46LQ-H3ZZ-1567751581205-UI6A3BBYQHUE.png'
    } 
    dataDays.qrUrl = await getQr(`${location.origin}/wechat/page/university/community-detail?ideaId=${id}`);  
    cardIdea("https://img.qlchat.com/qlLive/business/ZXOQYA26-CKC9-G6TB-1569206402480-6T8WEDJYF42B.png", dataDays,(url)=> {
        typeof cb=='function'&&cb(url)
    }, 1125, 1653);
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