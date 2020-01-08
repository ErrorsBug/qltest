// 空页面
/**
 *  
    nonePage(this,1,"暂无购买记录");// 自定义空页面

    nonePage(this,1,"暂无购买记录",__uri("../../pages/mine-buy/img/self.png"));//自定义图片目录放在文件夹内
 * 
 * 
 */
 var Handlebars = require('handlebars'),
    
    tpl = {
        nonepage: __inline('./none-page.handlebars')
    };

/**
 * 页面底部导航菜单栏
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-30T18:01:59+0800
 * @param    {[type]}                           options [description]
 *
 * @require ./none-page.css
 */

const picArray=[
    __uri("/comp/none-page/img/emptyPage.png"),//默认空页面样式
    __uri("/comp/none-page/img/ico-norecord2.png")
];
var nonePage = function (options) {
    this.opts = $.extend({
        pic: picArray[0],
        $el: $('body'),
        text: '暂无数据'
    }, options);
    console.log(tpl.nonepage(this.opts));
    this.opts.$el.append(tpl.nonepage(this.opts));
    
};
module.exports = nonePage;