require('zepto');
// require('zeptofix');
require('tapon');

var // fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    validator = require('validator'),
    Scrollload = require('scrollload_v3'),
    toast = require('toast'),
    
    // urlutils = require('urlutils'),
    // appSdk = require('appsdk'),
    Promise = require('promise'),
    hbarcompare = require('hbarcompare'),
    hbardefaultVal = require('hbardefaultVal'),
    utils = require('../../comp/common-js/ql-common'),

    view = require('./view'),
    conf = require('../conf');

/**
 * [index description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './message-list.css'
 */
var messageList = {
    initData: null,
    messages: null,
    nomoreConsult: false,
    consultId: null,
    init: function (initData) {
        this.pageType = utils.getQueryString('type');
        this.messages=initData.MESSAGES;
        this.topicId=initData.TOPIC_ID;
        this.consultPage=2;
        this.consultSize=20;
        view.listViewInit(this.messages);

        //点击事件
        this.eventInit();

        // 下拉加载更多功能开启
        this.enableScrollLoad();
    },
    eventInit:function(){
        var that=this;
        $(document).on("click",".on-consult-reply",function(){
            that.consultId=$(this).parents("dd").attr("attr-id");
            var name=$(this).parents("dd").find(".message-author").text();
            view.replyBoxShow(name);
        }).on("click",".message-reply-send",function(){
            var consultId=that.consultId;
            var consultContent=$(".replyContent").val();
            that.consultReply(consultId,consultContent,function(){
                view.replyInsert(consultId,consultContent);
                toast.toast('回复成功');
                view.replyBoxHide();
            });
        }).on("click",".replyBestInto",function(){
            that.consultId=$(this).parents("dd").attr("attr-id");
            //弹框
            view.initDialog("into",function(){
                that.consultBest(that.consultId,"publish");
            });
            
        }).on("click",".replyBestOut",function(){
            that.consultId=$(this).parents("dd").attr("attr-id");
            //弹框
            view.initDialog("out",function(){
                that.consultBest(that.consultId,"recall");
            });
            
        }).on("click",".message-reply-bg,.close-btn",function(){
            view.replyBoxHide();
        });

    },
        /**
     * 加载咨询
     * @param  {[type]} reset    [description]
     * @param  {[type]} finishFn [description]
     * @param  {[type]} errorFn  [description]
     * @return {[type]}          [description]
     */
    loadMessages: function(reset, loaded) {
        if (!loaded) {
            loaded = function () { };
        }

        var that = this,
            params = {
                topicId: this.topicId,
                type: this.pageType === 'topic' ? 'topic' : 'channel',
                page: this.consultPage,
                size: this.consultSize,
            };
           
        // if(that.nomoreConsult){
        //     view.hideLoading();
        //     view.nomoreContent();
        //     return;
        // };

        model.fetch({
            url: conf.api.consultList,
            data: params,
            success: function(res) {
                console.log(res);
                if (res && res.state && res.state.code === 200) {
                    console.log(res.data.data);
                    if (!res.data || !res.data.data||!res.data.data.consultList || !res.data.data.consultList.length ||
                        res.data.data.consultList.length < that.consultSize) {
                        that.nomoreConsult = true;
                        loaded(true);
                    }else{
                        loaded();
                        
                    }

                    view.updateConsults(reset,res.data&&res.data.data && res.data.data.consultList);



                    // view.listViewInit(this.messages);
                    //加载图片
                    setTimeout(lazyimg.loadimg, 50);

                    that.consultPage+= 1;

                    
                } else {
                    loaded();
                }
            },
            error: function() {
                loaded();
            }
        });
    },
    /**
     * 下拉加载更多
     * @return {[type]} [description]
     */
    enableScrollLoad: function() {
        var that = this;
        this.scroller = new Scrollload({
            $el: $('#container'),
            el_noMore: '.no-more',
            el_loading: '.loading-next',
            loadFun: function () {
                return new Promise(function (resolve, reject) {
                    that.loadMessages(false, resolve);
                });
            },
            toBottomHeight: 100
        });
    },
    consultReply:function(id,content,callback){
        var that = this;
        if(content==""||content==null){
            toast.toast('请输入回复');
            return;
        }else if(content.length>200){
            toast.toast('字数不能大于200字');
            return;
        };
        var params = {
                id: id,
                type: this.pageType === 'topic' ? 'topic' : 'channel',
                content: content,
            };
            
            console.log(that.nomoreConsult);
        

        model.fetch({
            url: conf.api.consultReply,
            data: params,
            type: "post",
            success: function(res) {
                
                if (res && res.state && res.state.code === 0) {
                    if(typeof callback=="function"){callback();};
                    
                }
            },
            error: function() {
                
            }
        });
        function loaded(isbol){
            that.nomoreConsult=isbol?false:true;
        };
    },
    consultBest:function(id,status){
        var that = this;
        var params = {
                id: id,
                type: this.pageType === 'topic' ? 'topic' : 'channel',
                status: status,
            };
          
        model.fetch({
            url: conf.api.consultBest,
            data: params,
            type:'post',
            success: function(res) {
                
                if (res && res.state && res.state.code === 0) {
                    view.statusChange(id,status);
                    toast.toast('操作成功');
                }
            },
            error: function() {
                
            }
        });
        function loaded(isbol){
            that.nomoreConsult=isbol?false:true;
        };
    },
    
};

module.exports = messageList;
