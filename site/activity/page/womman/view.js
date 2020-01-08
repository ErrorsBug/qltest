var Handlebars = require('handlebars'),
    loading = require('loading'),
    tpls = {
        tab: __inline('./tpl/tab_type.handlebars'),
        subject:__inline('./tpl/subject.handlebars'),
    };
    
require('hbarmoneyformat');
require('hbarimgformat');
require('hbarcompare');
require('hbardefaultVal');
// require('../../comp/default-img/default-img');

var view = {
    /**
     * 渲染话题列表tab
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T17:04:39+0800
     * @param    {[type]}                           reset [description]
     * @param    {[type]}                           lives [description]
     * @return   {[type]}                                 [description]
     */
    

    /**
     * 渲染tabbar
     */

    tabType:function(tabType){
        $("#tabBtnUl,#tabBtnUlFixed").html(tpls.tab({
            tabs:tabType
        }));
        
    },
    subjectPart:function(data){
        console.log(data);
        var data=this.dataFormate(data);
        $("#theme-middle").append(tpls.subject({
            data:data,
        }));
        console.log(data);
    },
    dataFormate:function(data){
         $.each(data,function(i,value1){
            $.each(value1.content,function(j,value2){
                var topicValue=value2.topics;
                $.each(topicValue,function(k,topic){
                    if(topic!=null){
                        if(topic.desMoney!= topic.money){
                            topic.isdes=true;
                        }else{
                            topic.isdes=false;
                        };
                        topic.desMoney=(topic.desMoney=="免费"||topic.desMoney<=0)? "免费":"￥"+topic.desMoney;
                        if(topic.desMoney=="免费"){topic.desStyle="isFree";};
                    };
                });
                var channelValue=value2.channels;
                $.each(channelValue,function(k,channel){
                    if(channel!=null){
                        channel.isfour=(k!=0&&(k%3)==0)? true:false;
                        if(channel.desMoney!= channel.money){
                            channel.isdes=true;
                        }else{
                            channel.isdes=false;
                        };
                        channel.desMoney=(channel.desMoney=="免费"||channel.desMoney<=0)? "免费":"￥"+channel.desMoney;
                        if(channel.desMoney=="免费"){channel.desStyle="isfree";};
                    };
                });
            });
        });
        return data;
    },
    tabStyle:function(){
        $("#tabBtnUlFixed").width($("#tabBtnUl").width());
    },

    showShareBtn: function() {
        $('.share-btn').removeClass('hidden');
    },
    /**
     * 显示loading样式
     * @return {[type]} [description]
     */
    showLoading: function() {
        if (!this.loadingObj) {
            this.loadingObj = new loading.AjaxLoading();
        }

        this.loadingObj.show();
    },

    /**
     * 隐藏loading样式
     * @return {[type]} [description]
     */
    hideLoading: function() {
        if (this.loadingObj) {
            this.loadingObj.hide();
        }
    }
};

module.exports = view;