var Handlebars = require('handlebars');
var toast = require('toast');
module.exports = {
    //页面顶部闪烁字体
    ficker: function(){
        var fickerList = $('.ficker');
        var fickerOpa = [{direction: 1},{direction: 1},{direction: 1},{direction: 1}];
        var len = fickerList.length;
        setInterval(function(){
            for(var i=0; i < len; i++) {
                var list = fickerList.eq(i),
                    opa = Number(list.css('opacity')) * 100;
                if(opa + fickerOpa[i].direction > 100){
                    fickerOpa[i].direction = -1;
                }
                if(opa + fickerOpa[i].direction  <= 0){
                    fickerOpa[i].direction = 1;
                }
                list.css('opacity',(opa + fickerOpa[i].direction)/100);
            }
        },20);
    },
    //存储滚动条高度
    setScroll: function(){
        var scrollTop = $('#activity-container').scrollTop();
        sessionStorage.setItem('scroll',scrollTop);
    },
    //获取原先滚动条高度
    getScroll: function(){
        var scrollTop = sessionStorage.getItem('scroll');
        scrollTop = scrollTop ? scrollTop : 0;
        $('#activity-container').scrollTop(scrollTop);
    },
    getCoupon: function(e){
        $(e.currentTarget).removeClass('none').addClass('bind').text('立即使用');
    },
    //点击立即使用回滚到相应位置
    useQuickly: function(e){
        var type = Number($(e.currentTarget).parents('li').attr('data-type')).toFixed(1),
            tar = document.querySelector('#activity-container');
            dpr = Number($('html').attr('data-dpr'));
        var ele = document.querySelector(".title[data-type='" + type + "']");
        if(ele){
            var top = ele.offsetTop-20;
            var interval = setInterval(function(){
                if(tar.scrollTop < top){
                    tar.scrollTop += 20;
                    if(tar.scrollHeight === tar.offsetHeight + tar.scrollTop){//滚动到底部
                        clearInterval(interval);
                    }
                }
                else {
                    clearInterval(interval);
                }
            },6/dpr);
        }else{
            toast.toast('暂无此优惠券使用范围',500,'middle');
        }
    }
}