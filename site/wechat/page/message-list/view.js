var Handlebars = require('handlebars'),
    Dialog = require('dialog'),
    nonePage = require('../../comp/none-page'),
    loading = require('loading'),
    tpls = {
        messages: __inline('./tpl/message-dd.handlebars'),
        reply: __inline('./tpl/message-reply.handlebars'),
        dialog: __inline('./tpl/mgs-dialog.handlebars'),
    };
require('hbardateformat');
require('hbarcompare');
require('hbarimgformat');
require('../../comp/default-img/default-img');



var view = {
    dataFormate:function(messages){
         $.each(messages,function(index,value){   
            // value.isReply=value.isReply=="Y"? true :false;
            console.log(value.status);
            switch (value.status) {
                case 'publish':
                    value.isbest=true;
                    break;
                case 'recall':
                    value.isbest=false;
                    break;
                case 'delete':
                    
                    break;
                default:
                    break;
            }
        });
        return messages;
    },
    listViewInit : function  (messages){
        this.loadingObj=$(".loading-next");
        this.showLoading();
        if(messages.length<=0){
            this.noneList();
            this.hideLoading();
            return ;
        };
       var messages=this.dataFormate(messages);
       
       
        $(".message-list").append(tpls.messages({
            messages:messages,
        }));
        this.hideLoading();

        
    },
    noneList:function(){
        new nonePage({
            $el: $('#container .box'),
            text: '暂无咨询记录'
        });
    },
    showLoading:function(){
        this.loadingObj.show();
    },
    hideLoading: function() {
        this.loadingObj.hide();
    },
    nomoreContent:function(){
        $(".no-more").show();
    },
    updateConsults:function(reset,consults){
        var messages=this.dataFormate(consults);
        $(".message-list").append(tpls.messages({
            messages:messages,
        }));
        this.hideLoading();
    },
    replyBoxShow:function(name){
        $(".replyContent").attr("placeholder","回复："+name);
         $(".replyContent").val("");
         $(".message-reply-container").show();
    },
    replyBoxHide:function(){
        $(".message-reply-container").hide();
    },
    statusChange:function(id,status){
        if($(".consultDd[attr-id='"+id+"']").find(".message-btn-out").length>0){
            $(".consultDd[attr-id='"+id+"']").find(".replyBestOut").removeClass("message-btn-out replyBestOut").addClass("message-btn-into replyBestInto").html("移入精选");
        }else{
            $(".consultDd[attr-id='"+id+"']").find(".replyBestInto").removeClass("message-btn-into replyBestInto").addClass("message-btn-out replyBestOut").html("移出精选");
        };
        
    },
    replyInsert:function(id,content){
        var reply={
            replyContent:content,
            replyTime:new Date(),
        };
        $(".consultDd[attr-id='"+id+"']").find(".replyContentBox").html(tpls.reply(reply));
        $(".consultDd[attr-id='"+id+"']").find(".on-consult-reply").remove();
    },
    initDialog:function(status,backfunc){
        var msg='移入精选将会在介绍页显示';
        var msg1="确定要移入吗？";
        if(status === "out"){
             msg='移出精选将不会在介绍页显示';
             var msg1="确定要移出吗？";
        }
        this.consultDialog = new Dialog({
                hideTitle: true,
                button: ['取消', '确定'],
                content: tpls.dialog({
                    msg:msg,
                    msg1:msg1,
                }),
                callback: function (index) {
                    if (index == 1) {
                        if(typeof backfunc === "function"){
                            backfunc();
                        }
                    }
                },
                cls: 'consult-dialog-container',
            });
        this.consultDialog.show();
    },

    

    /**
     * 显示loading样式
     * @return {[type]} [description]
     */
    // showLoading: function() {
    //     if (!this.loadingObj) {
    //         this.loadingObj = new loading.AjaxLoading();
    //     }

    //     this.loadingObj.show();
    // },

    /**
     * 隐藏loading样式
     * @return {[type]} [description]
     */
    // hideLoading: function() {
    //     if (this.loadingObj) {
    //         this.loadingObj.hide();
    //     }
    // }
};

module.exports = view;