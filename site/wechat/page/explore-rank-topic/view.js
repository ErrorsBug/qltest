var Handlebars = require('handlebars');
var loading = require('loading');
var tpls = {
    list: __inline('./tpl/list.handlebars'),
    period: __inline('./tpl/period.handlebars')
};

require('hbarimgformat');
require('hbarcompare');
require('hbardigitformat');
require('./helper');

var $container = $('#container');
var $topics = $('#topics');
var $timeSelect = $('#time-select');

var view = {
    updateTopics: function (data) {
        var period = $('#timeline').text().split('至')[0],
            tab = $('.tab-item.active').attr('data-type');
        $topics.append(tpls.list({
            topics: data,
            reset: false,
            period: period,
            tab: tab
        }));
    },
    /* 切换榜单列表*/
    switchTopics: function (data){
        var period = $('#timeline').text().split('至')[0],
            tab = $('.tab-item.active').attr('data-type');
        $topics.empty().append(tpls.list({
            topics: data,
            reset: true,
            period: period,
            tab: tab
        }));
    },
    /* 切换时间周期列表*/
    switchPeriod: function (data){
        $timeSelect.empty().append(tpls.period({
            dates: data,
            reset: true
        }));
    },
    /*刷新前后重置type和period状态 */
    resetProp: function(){
        var search = window.location.search.split('?')[1];
        var type,period;
        if(search){//获取刷新前的type和period
            var list = search.split('&');
            for(var i=0,len=list.length;i<len;i++){
                var item = list[i].split('=');
                if(item[0] === 'type'){
                    type = item[1];
                }
                if(item[0] === 'period'){
                    period = item[1];
                }
            }
        }
        type = type?type:'new';
        period = period?decodeURI(period):$('.timelist:first-child').find('span').text();
        if(type === 'total'){
            $('#container').addClass('total');
        }
        $('#timeline').text(period);

        //设置刷新后相应的type和period的active状态
        $('.tab-item[data-type="'+ type +'"]').addClass('active');
        var arr = $('.timelist');
        for(var i=0,len=arr.length;i<len;i++){
            if(arr.eq(i).find('span').text() === period){
                arr[i].classList.add('active');
                break;
            }
        }
    },

    /*tab切换操作 */
    tabClick: function(e){
        var $tar = $(e.currentTarget);
        var type = $tar.attr('data-type');
        var url = window.location.href.split('?')[0]+'?type='+type;
        history.replaceState(null,type,url);
        $tar.addClass('active').siblings().removeClass('active');
        //总榜没有周期选择
        if(type === 'total') {
            $('#container').addClass('total');
        }else {
            $('#container').removeClass('total');
        }
        $('#topic-container').scrollTop(0);
    },

    /*周期选择操作 */
    periodClick: function(e){
        var $tar = $(e.currentTarget);
        var type = $('.tab-item.active').attr('data-type');//当前type
        var text = $tar.find('span').text();
        var url = window.location.href.split('?')[0]+'?type='+type+'&period='+text;
        history.replaceState(null,type,url);
        $tar.addClass('active').siblings().removeClass('active');
        $('#timeline').text(text);
        $('#topic-container').scrollTop(0);
    },

    /*周期选择框的隐藏 */
    generalSetting: function(){
        $('.time-pop').removeClass('show').addClass('hide');
        $('#timeline').removeClass('sel');
    },
    
    /*事件操作 */
    otherEvent: function(){
        var that = this;
        // 周期选择框弹出
        $('body').on('click','#timeline', function(e){
            var $tar = $(e.currentTarget);
            $tar.toggleClass('sel');
            if($tar.hasClass('sel')){
                $('.time-pop').removeClass('hide').addClass('show');
            }else{
                $('.time-pop').removeClass('show').addClass('hide');
            }
        });
        // 周期选择框隐藏
        $('body').on('click','.pop-black', function(e){
            that.generalSetting();
        });
        //提示框弹出
        $('body').on('click','#tip',function(){
            that.popTip();
            $('.tip-pop').show();
        });
        //提示框隐藏
        $('body').on('click','#ok',function(){
            $('.tip-pop').hide();
        });
    },

    /* 显示loading样式*/
    showLoading: function () {
        if (!this.loadingObj) {
            this.loadingObj = new loading.AjaxLoading();
        }

        this.loadingObj.show();
    },

    /* 隐藏loading样式*/
    hideLoading: function () {
        if (this.loadingObj) {
            this.loadingObj.hide();
        }
    },

    /*提示框内容 */
    popTip: function(){
        var type = $('.tab-item.active').attr('data-type');
        var title = $('.tip-pop .title');
        var tipContent = $('.tip-pop .tip-content');
        switch(type){
            case 'new': title.text('新榜');
                        tipContent.text('一天内上升热度最快的100个新课(1周内开课)');
                        break;
            case 'day': title.text('日榜');
                        tipContent.text('一天内上升热度最快的100个课程');
                        break;
            case 'week': title.text('周榜');
                         tipContent.text('一周内上升热度最快的100个课程');
                         break;
            case 'month': title.text('月榜');
                          tipContent.text('一月内上升热度最快的100个课程');
                          break;
            case 'total': title.text('总榜');
                          tipContent.text('累计学习人数最多的100个课程');
        }
    }
};

module.exports = view;
