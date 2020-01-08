require('zepto');
// require('zeptofix');
require('tapon');

var fastClick = require('fastclick'),
    lazyimg = require('lazyimg'),
    model = require('model'),
    validator = require('validator'),
    Scrollload = require('scrollload_v3'),
    toast = require('toast'),
    appSdk = require('appsdk'),
    envi = require('envi'),
    wxutil = require('wxutil'),
    urlutils = require('urlutils'),

    view = require('./view'),
    conf = require('../conf');

/**
 * [activity-woman description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './womman.css'
 */


var activityData = {
    tabType:null,
    topic:null,
    channel:null,
    scrollTop:0,
    indexF:0,
    headHeight:0,
    newData:[],
    shareOption: {
        title: '3.8女性知识节，遇见更好的自己',
        content: '爱自己就为自己加点料，魅力折扣金等你拆',
        shareUrl: urlutils.fillParams({

        }, window.location.href, ['ch']),
        thumbImageUrl: 'https://img.qlchat.com/qlLive/activity/woman_sharelogo.png'
    },
    init: function (initData) {
        this.tabType=initData.TABTYPE;
        this.topic=initData.TOPIC;
        this.channel=initData.CHANNEL;
        this.tabTypeInit(this.tabType);




        // 事件初始化
        this.initListeners();

        this.scrollTheme();
        //显示专场，类型，话题，系列课等
        this.themePart();

        //图片懒加载
        setTimeout(lazyimg.loadimg, 50);
        lazyimg.bindScrollEvts($("#container"));




        // 是否显示分享按钮
        this.shareBtnShow();

        // 分享定制
        wxutil.share({
            title: this.shareOption.title,
            desc: this.shareOption.content,
            imgUrl: this.shareOption.thumbImageUrl,
            link: this.shareOption.shareUrl,
            successFn: function() {
                if (typeof _qla != 'undefined') {
                    _qla('event', {
                        category: 'wechat_share',
                        action:'success'
                    });
                }
            }
        });

    },
    scrollTheme:function(){
        var self=this;
        this.headHeight=$(".theme-header").offset().height+15;
        $("#container").scroll(function(e){
            /*滚动到一定给位置，控制显示隐藏tab条*/
            if(e.target.scrollTop>=this.headHeight){
                $("#tabBtnUlFixed").show();
            }else{
                $("#tabBtnUlFixed").hide();
            }
            /*滚动到一定给位置，切换tab*/
            var $themeArray=$(".theme-type");
            for(var i=0;i<$themeArray.length;i++){
                if(i===0&&e.target.scrollTop<$themeArray[i+1].offsetTop){
                    self.tabTypeShow(self.tabType,i);
                }else if((i+1>$themeArray.length-1)&&e.target.scrollTop>=$themeArray[i].offsetTop-$("#tabBtnUlFixed li").height()){
                    self.tabTypeShow(self.tabType,i);
                }else if((i+1<=$themeArray.length-1)&&e.target.scrollTop>=$themeArray[i].offsetTop-$("#tabBtnUlFixed li").height()&&e.target.scrollTop<$themeArray[i+1].offsetTop){
                    self.tabTypeShow(self.tabType,i);
                }

            }
            this.indexF=$("#tabBtnUlFixed .active").index();

        }.bind(this));
    },
    /**
     * 事件定义
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-15T14:44:01+0800
     * @return   {[type]}                           [description]
     */
    initListeners: function() {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function() {});

        // 分享按钮击事件
        $('body').on('click', '.share-btn', function(e) {
            that.openAppShare();
        });

        // 话题点击事件
        $('body').on("click",".topic-ul-li", function(e) {
            that.onItemClick(e);
        });

        // 频道点击事件
        $('body').on("click",".channel-ul-li", function(e) {
            that.onItemClick(e);
        });

        //tab点击切换
        $('body').on("click",".tabBtn",function(e){
            that.tabClick(e);
        });

    },
    //滚动特定位置切换tab重置显示
    tabTypeShow:function (tabtypeObj,index) {
        var thisindex=index||0;
        $.each(tabtypeObj,function(i,v){
             v.active=thisindex==i? true:false;
        }.bind(this));
        view.tabType(tabtypeObj);
        view.tabStyle();
    },
    //tab初始化
    tabTypeInit:function (tabtypeObj) {
        $.each(tabtypeObj,function(i,v){
            this.newData.splice(v.index,0,v);
            // this.newData.push(v);
        }.bind(this));
        view.tabType(tabtypeObj);
    },
    tabClick:function(e){
        var $tar = $(e.currentTarget);
        if(!$tar.hasClass("active")){
            var lastIndex=this.indexF;
            var tabIndex=$tar.index();
            this.indexF=tabIndex;
            this.themeChange(tabIndex,lastIndex);
        }

    },
    themeChange:function(tabIndex,lastIndex){
        this.scrollTop=Number($(".theme-type").eq(tabIndex)[0].offsetTop-$("#tabBtnUlFixed li").height());
        if(lastIndex==0&&tabIndex>lastIndex&&$("#container").width()<=557){
            console.log($(".theme-type-img-box").eq(0).height()/4);
            this.scrollTop=this.scrollTop-$(".theme-type-img-box").eq(0).height()/4;
        }
        $("#container").scrollTop(this.scrollTop);

    },
    themePart:function(thistab){
        this.topicList();
        this.channelList();
        view.subjectPart(this.newData);
    },
    topicList:function(){
        $.each(this.topic,function(i,v){
            if(v.tabType==3){
                v.tabType=1;
            }else if(v.tabType==1){
                v.tabType=2;
            }else if(v.tabType==2){
                v.tabType=3;
            }

            var tabIndex=v.tabType-1;
            var typeIndex=v.typeSecond-1;
            if(this.newData[tabIndex]&&this.newData[tabIndex].content[typeIndex]){
                this.newData[tabIndex].content[typeIndex].topics.push(v);
            }
        }.bind(this));
        // console.log("topic:"+JSON.stringify(this.topic));
    },
    channelList:function(){
        $.each(this.channel,function(i,v){
            if(v.tabType==3){
                v.tabType=1;
            }else if(v.tabType==1){
                v.tabType=2;
            }else if(v.tabType==2){
                v.tabType=3;
            }
            var tabIndex=v.tabType-1;
            var typeIndex=v.typeSecond-1;
            if(this.newData[tabIndex]&&this.newData[tabIndex].content[typeIndex]){
                this.newData[tabIndex].content[typeIndex].channels.push(v);
            }

        }.bind(this));
        // console.log("channel:"+JSON.stringify(this.channel));
    },

    onItemClick: function(e) {
        var $tar = $(e.currentTarget),
            type = $tar.attr('data-type'),
            id = $tar.attr('data-id'),
            shareKey=$tar.attr('data-key'),
            lshareKey=$tar.attr('data-lkey'),
            url,
            url_params;
            if(shareKey!=""){
                url_params='shareKey='+shareKey;
            }else if(lshareKey!=""){
                url_params='lshareKey='+lshareKey;
            }


        // app环境
        if (envi.getQlchatVersion()) {
            switch (type) {
                case 'topic':
                    this.fetchTypeAndRedirect(id,url_params);
                    return;
                case 'channel':
                    setTimeout(function () {
                        url = 'dl/live/channel/homepage?channelId=' + id;

                        if(url_params){
                            url+='&'+url_params;
                        }

                        appSdk.linkTo(url);
                    }, 100);
                    break;
            }

        // h5环境
        } else {
            switch(type) {
                case 'topic':
                    url = '/topic/' + id + '.htm';
                    if(url_params){
                        url+='?'+url_params;
                    }

                    break;
                case 'channel':
                    url = '/live/channel/channelPage/' + id + '.htm';
                    if(url_params){
                        url+='?'+url_params;
                    }
                    break;
            }

            setTimeout(function() {
                window.location.href = url;
            }, 100);
        }
    },

    fetchTypeAndRedirect: function(topicId,urlParams) {
        var that = this,
            thisUrlParams="",
            params = {
                topicId: topicId
            };
            if(urlParams!=null&&urlParams!=''){
               thisUrlParams= '&'+urlParams;
            }
        if (that.fetchTypeRedirectLocked) {
            return;
        }

        this.fetchTypeRedirectLocked = true;

        view.showLoading();

        model.fetch({
            url: conf.api.liveRedirect,
            data: params,
            success: function(res) {
                view.hideLoading();
                that.fetchTypeRedirectLocked = false;
                if (res && res.state && res.state.code === 0) {
                    switch(res.data.type) {
                        case 'introduce':
                            appSdk.linkTo('dl/live/topic/introduce?topicId=' + res.data.content+thisUrlParams);
                            break;
                        case 'channel':
                            appSdk.linkTo('dl/live/channel/homepage?channelId=' + res.data.content);
                            break;
                        case 'topic':
                            appSdk.linkTo('dl/live/topic?topicId=' + res.data.content+thisUrlParams);
                            break;
                    }
                }
            },
            error: function() {
                that.fetchTypeRedirectLocked = false;
                view.hideLoading();
            }
        });
    },

    shareBtnShow: function() {
        var ver = envi.getQlchatVersion();

        // 是app且版本号大于300，显示分享按钮
        if (ver && ver >= 300) {
            view.showShareBtn();
        }
    },
    openAppShare: function() {

        this.shareOption.shareUrl = this.shareOption.shareUrl.replace(/http[s]{0,1}\:\/\/m\.qlchat\.com/, 'http://v' + (Math.random() * 9).toFixed(0) + '.qianliao.tv');
        appSdk.share(this.shareOption);
    }

};


module.exports = activityData;
