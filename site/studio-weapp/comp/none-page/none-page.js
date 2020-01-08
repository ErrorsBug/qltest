// 空页面
/**
 *  
    nonePage(this,1,"暂无购买记录");// 自定义空页面

    nonePage(this,1,"暂无购买记录",__uri("../../pages/mine-buy/img/self.png"));//自定义图片目录放在文件夹内
 * 
 * 
 */

const picArray=[
    __uri("/comp/none-page/img/emptyPage.png"),//默认空页面样式
    __uri("/comp/none-page/img/ico-norecord2.png")
];
export const nonePage=(that,pic,text,selfimg)=>{
    let thispic =picArray[pic] ||picArray[0];
    let thistext=text||'暂无数据';
    if(selfimg&&selfimg!=""){
        thispic=selfimg;
    }
    that.setData({
        nonePage:{
            pic:thispic,
            text:thistext
        }
    });
};