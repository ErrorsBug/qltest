var Handlebars = require('handlebars');
var tpls = {
    course: __inline('./tpl/course.handlebars')
};
require('hbarimgformat');
require('hbarcompare');
module.exports = {
    tabSwitch: function(e) {
        var that = this;
        var now = new Date().getDate();
        var hour = new Date().getHours();
        $(e.currentTarget).addClass('active').siblings().removeClass('active');
        var day = Number($(e.currentTarget).attr("data-time"));
        $('.panicbuy-list[data-time="'+day+'"]').show().siblings().hide();
        if(now === day){
            if(hour <12) {
                $('.panicbuy-list[data-time="'+day+'"]').addClass('coming');
                this.operation(day);
            }else{
                $('.panicbuy-list[data-time="'+day+'"]').removeClass('coming');
            }
        }else if(now < day) {
            $('.panicbuy-list[data-time="'+day+'"]').addClass('coming');
            this.operation(day);
        }else{
            $('.panicbuy-list[data-time="'+day+'"]').removeClass('coming');
        }
    },
    initDate: function() {
        var that = this;
        var list = [8,9,10,11],t=false;
        for(var i = 0;i< 4;i++){
            if(new Date().getDate() === list[i]){
                $('.panicbuy-area li[data-time="'+ list[i] +'"]').addClass('active');
                $('.panicbuy-list[data-time="'+list[i]+'"]').show();
                if(new Date().getHours() < 12){
                    $('.panicbuy-list[data-time="'+list[i]+'"]').addClass('coming');
                    this.operation(list[i]);
                }
                t = true;
                break;
            }
        }
        if(!t){
            $('.panicbuy-area li[data-time="8"]').addClass('active');
            $('.panicbuy-list[data-time="8"]').show();
            $('.panicbuy-list[data-time="8"]').addClass('coming');
            var day = 8;
            this.operation(day);
        }
    },
    //倒计时
    countDown: function(date,selector){
        var time = {
            zero: function(n){
                var n = parseInt(n, 10);
                if(n > 0){
                    if(n <= 9){
                        n = "0" + n;	
                    }
                    return String(n);
                }else{
                    return "00";	
                }
            },
            calc: function(){
                // date = date || Date.UTC(2017,10,4);
                var future = new Date(date),
                    now = new Date();
                var dur = Math.round((future.getTime() - now.getTime()) / 1000) + future.getTimezoneOffset() * 60, 
                    pms = {
                        sec: "00",
                        mini: "00",
                        hour: "00"
                    };
                if (dur > 0){
                    pms.sec = time.zero(dur % 60);
                    pms.mini = Math.floor((dur / 60)) > 0? time.zero(Math.floor((dur / 60)) % 60) : "00";
                    pms.hour = Math.floor((dur / 3600)) > 0? time.zero(Math.floor(dur / 3600)) : "00";
                }
                return pms;
            },
            show: function(){
                if(selector.sec){
                    selector.sec.innerHTML = time.calc().sec;
                }
                if(selector.mini){
                    selector.mini.innerHTML = time.calc().mini;
                }
                if(selector.hour){
                    selector.hour.innerHTML = time.calc().hour;
                }
                if(time.calc().hour=== '00'&& time.calc().mini=== '00'&& time.calc().sec === '00'){
                    selector.area.classList = 'panicbuy-list';
                }
                setTimeout(time.show,1000);
            }
        };
        time.show();
    },
    operation: function(day){
        var that = this;
        var selector = {
            sec: document.querySelector('.panicbuy-list[data-time="'+day+'"] .s'),
            mini: document.querySelector('.panicbuy-list[data-time="'+day+'"] .m'),
            hour: document.querySelector('.panicbuy-list[data-time="'+day+'"] .h'),
            area: document.querySelector('.panicbuy-list[data-time="'+day+'"]')
        };
        that.countDown(Date.UTC(2017,10,day,12),selector);
    },
    scrollEvent: function(){
        var container = document.querySelector('.container'),
            items = document.querySelectorAll('.item');
        container.addEventListener('scroll',function(e){
            var scrollTop = container.scrollTop+200;
            for(var i = 0,len = items.length;i<len;i++){
                if(i<len-1){
                    if(scrollTop >= items[i].offsetTop && scrollTop <= items[i+1].offsetTop){
                        $('.bottom li').eq(i).addClass('active').siblings().removeClass('active');
                    }
                }else{
                    if(scrollTop >= items[i].offsetTop){
                        $('.bottom li').eq(i).addClass('active').siblings().removeClass('active');
                    }
                }
            }
        })
    },
    updateCourse: function(data){
        if(data.length > 0){
            var groupCode = data[0].groupCode;
            var $course = $('.item[data-code="'+ groupCode +'"] ul');
            $course.append(tpls.course({
                course: data
            }));
        }
    }
}