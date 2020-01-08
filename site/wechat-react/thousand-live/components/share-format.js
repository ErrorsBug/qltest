export const shareBgWaterMark = (url,index) => {
    let urlArr = {
        plan:'cWxMaXZlL2FjdGl2aXR5L2ltYWdlL05RNlM4R1JSLTVBRUstMUxOTi0xNTY1NjAwNTM5MjkxLU1GQTJFMjVXQUE2Wi5wbmc=',
        start:'cWxMaXZlL2FjdGl2aXR5L2ltYWdlL003UDY3SFU3LUNIWEMtNTJHOC0xNTY1NjAwNTUzMTc3LVoxR0ZWNFdWWjZFRS5wbmc=',
        end:'cWxMaXZlL2FjdGl2aXR5L2ltYWdlL1ZKWFNOWFExLVZXNkUtUkxINi0xNTY1NjAwNTQ0MjAzLU1DWlpJUlVJOUtSSS5wbmc=',
        study:'cWxMaXZlL2FjdGl2aXR5L2ltYWdlL081VE5KS0tMLVpRTkMtQkc5My0xNTY1NjAwNTQ5MDU0LUhNNUFOQUtKVFhFWS5wbmc=',
        
    }

    let shareUrl = `${url.replace(/(\?.*)/, "") }?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100/watermark,image_${urlArr[index]},g_sw,x_0,y_0`;

    return shareUrl;
}