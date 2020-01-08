require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');
var wxutil = require('wxutil');
var envi = require('envi');


/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './card-list.scss'
 */

var tpls = {
    unOpenCard: __inline('./tpl/card-unopen.handlebars'),
    card: __inline('./tpl/normal-card.handlebars')
};

var taskList = [
    {
        "task": "任务：针对自己内外在的不足之处，制定2个月的增值修炼计划", 
        "stars": 3
    }, 
    {
        "task": "任务：按照“三只青蛙”时间管理法，写出本周的三只青蛙", 
        "stars": 4
    }, 
    {
        "task": "任务：约好朋友吃饭聊天，用茜茜分享的方法当面夸赞ta的优点", 
        "stars": 5
    }, 
    {
        "task": "用“四面镜子”了解另一半，记录下你了解另一半的具体内容", 
        "stars": 3
    }, 
    {
        "task": "用撒娇的方式让老公请吃饭，记录下你是用什么语言成功地让他答应的", 
        "stars": 4
    }, 
    {
        "task": "记录下为老公做老公面后，他的反应及对这碗面的评价", 
        "stars": 5
    }, 
    {
        "task": "让孩子组织聚会，并在聚会上自我介绍，记录下你是如何引导孩子的", 
        "stars": 3
    }, 
    {
        "task": "带孩子去敬老院捐出零花钱，记录孩子在哪些方面做出了改变", 
        "stars": 4
    }, 
    {
        "task": "制作孩子的时间管理安排表，展示每天完成的效果", 
        "stars": 4
    }, 
    {
        "task": "让孩子说出自己眼中好爸妈的样子，反思记录自己的不足", 
        "stars": 5
    }
]

var standard = {

    cIndex: 1,
    topicList: [],
    isBuy: 0,

    init: function (initData) {

        this.initPageData(initData)
        this.initListeners(initData)
        // this.initHandlebarList()


        this.renderCard(initData)

        this.initShare()
    },


    initPageData: function(initData) {
        this.cIndex = parseInt(urlUtils.getUrlParams("index")) 
        // this.isBuy = 1;
        this.isBuy = initData.topicList && initData.topicList.isBuy;
        var topicList = initData.topicList && initData.topicList.dataList

        if(topicList.length) {
            topicList.forEach(function(item, idx) {
                this.topicList.push({
                    topicId: item.topicId,
                    imgUrl: item.backgroundUrl,
                    topic: item.topic,
                    startTime: item.startTime,
                    // status   1： 未参与 2：已参与
                    status: 1,
                    status: item.status,
                    partIn: item.partIn,
                    stars: taskList[idx].stars,
                    task: taskList[idx].task,
                })
            }, this);
        }

        console.log(this.topicList);
        console.log(this.cIndex);
        console.log(this.isBuy);
    },

    renderCard: function (initData) {
        var cIndex = this.cIndex;
        if(typeof cIndex != "number" ) {
            $(".handlebar-container").html(tpls.unOpenCard())
            return 
        }
        var carItem = this.topicList[cIndex];
        var sysTime = initData.sysTime;

        // handlebar渲染，把星星数变成数组
        if(typeof carItem.stars == "number") {
            var tempStarList = []
            for (var i = 0; i < carItem.stars; i++) {
                tempStarList.push({})
            }
            carItem.stars = tempStarList
        }

        if(this.isBuy) {
            if(this.topicList[this.cIndex].status == 1) {
                carItem.isBuy = "btn-join-now"
            } 
            if(this.topicList[this.cIndex].status == 2) {
                carItem.isBuy = "btn-check"
            } 
        } else {
            carItem.isBuy = "btn-activity"
        }

        carItem.sessionNum = "s" + (cIndex + 1)

        if(cIndex < 0 || cIndex > 9 || carItem.startTime > sysTime) {
            $(".handlebar-container").html(tpls.unOpenCard(carItem))
            return 
        } 
        $(".handlebar-container").html(tpls.card(carItem))

    },

    initListeners: function (initData) {
        var that = this;

        //* 各种兼容处理 *//
        // 解决点击300ms延迟
        fastClick.attach(document.body);
        // 解决IOS漏底问题
        function disableScroll(event) {
            if (!event.canScroll) {
                event.preventDefault();
            }
        }
        function overscroll(el) {
            if (el) {
                el.addEventListener('touchstart', function (){
                    const top = el.scrollTop;
                    const totalScroll = el.scrollHeight;
                    const currentScroll = top + el.offsetHeight;
                    if (top === 0) {
                        el.scrollTop = 1;
                    } else if (currentScroll === totalScroll) {
                        el.scrollTop = top - 1;
                    }
                });

                el.addEventListener('touchmove', function(event) {
                    if (el.offsetHeight < el.scrollHeight) event.canScroll = true;
                });
            }
        }
        function fixScroll(selector) {
            const elSelectot = selector || '';
            overscroll(document.querySelector(selector));
            document.body.addEventListener('touchmove', disableScroll);
        }
        fixScroll('.main-container');
        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });
        //* 各种兼容处理 *//

        $('body').on('click', '.dialog-conform', function () {
            $('.dialog-back').hide();
        });

        $('body').on('click', '.btn-to-menu', function () {
            setTimeout(function() {
                location.href = "/wechat/page/activity/super-mother/card-menu"
            }, 150);
        });
        $('body').on('click', '.btn-check, .btn-join-now', function () {
            setTimeout(function() {
                location.href = "/wechat/page/activity/super-mother/task?topicId=" + that.topicList[that.cIndex].topicId + "&index=" + that.cIndex
            }, 150);

            if (window._qla) {
                window._qla('click', {
                    name: "已购买-参与评论",
                    region: "btn-join-now",
                });
            }
        });
        $('body').on('click', '.btn-activity', function () {
            setTimeout(function() {
                location.href = "http://hd1.qianliao.net/wechat/page/activity/super-mother?ch=ACTIVITY"
            }, 150);

            if (window._qla) {
                window._qla('click', {
                    name: "未购买-参与活动",
                    region: "btn-join-now",
                });
            }
        });


        // 假装是个单页应用的各种页面状态操作
        $('body').on('click', '.before', function () {
            if(that.cIndex > 0) {
                that.cIndex --;
                history.pushState(that.cIndex, 'newtitle ' + that.cIndex, '/wechat/page/activity/super-mother/card-list?index=' + that.cIndex)
                that.renderCard(initData)
            } else {
                toast.toast("已经到第一个课程啦",1000, "middle")
            }
        });
        $('body').on('click', '.next', function () {
            if(that.cIndex < 9) {
                that.cIndex ++;
                history.pushState(that.cIndex, 'newtitle ' + that.cIndex, '/wechat/page/activity/super-mother/card-list?index=' + that.cIndex)
                that.renderCard(initData)
            } else {
                toast.toast("已经到最后一个课程啦",1000, "middle")
            }
        });
        window.addEventListener('popstate', function(e) {
            if (e.state) {
                //侦测是用户触发的后退操作, dosomething
                //这里刷新当前url
                this.location.reload();
            }
        }, false);

    },





    shareOption: {
        title: '我参与了叶一茜的幸福人生改变计划，一起学习还能赢取大奖！',
        des: '点击赢取价值¥1996的迪士尼家庭套票！',
        shareUrl: '',
        imgUrl: 'https://img.qlchat.com/qlLive/followQRCode/UB6XP3ND-J8PT-VRGU-1509108859400-92CE94Y21J8K.jpg'
    },
    initShare: function() {
        wxutil.share({
            title: this.shareOption.title,
            desc: this.shareOption.des,
            imgUrl: this.shareOption.imgUrl,
            shareUrl: location.href,
            successFn: function() {
                if (window._qla) {
                    window._qla('event', {
                        category: 'wechat_share',
                        action:'success'
                    });
                }
            }
        });
    }

}

module.exports = standard;