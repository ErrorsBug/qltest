require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');
var wxutil = require('wxutil');
var appSdk = require('appsdk');
var envi = require('envi');

var tpls = {
    taskBanner: __inline('./tpl/task.handlebars'),
    comment: __inline('./tpl/comment-list.handlebars'),
};

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './task.scss'
 */

var imgUrlFormat = function(url, formatStrQ, formatStrW) {
    
        formatStrQ = formatStrQ || "?x-oss-process=image/resize,m_fill,limit_0,h_64,w_64";
        formatStrW = formatStrW || "/64";
    
        if (/(img\.qlchat\.com)/.test(url)) {
            url = url.replace(/@.*/, "") + formatStrQ;
        } else if (/(wx\.qlogo\.cn\/mmopen)/.test(url)) {
            url = url.replace(/(\/(0|132|64|96)$)/, formatStrW);
        };
    
        return url;
    };
    
function formatDate(date, formatStr) {
    if (!date) {
        return '';
    }

    var format = formatStr || 'yyyy-MM-dd';

    if ('number' === typeof date || 'string' === typeof date) {
        date = new Date(+date);
    }

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;

};

var taskList = [
    {
        topicId: "2000000024800326",
        "task": "任务：针对自己内外在的不足之处，制定2个月的增值修炼计划", 
        "stars": 3
    }, 
    {
        topicId: "2000000024800326",
        "task": "任务：按照“三只青蛙”时间管理法，写出本周的三只青蛙", 
        "stars": 4
    }, 
    {
        topicId: "2000000024800326",
        "task": "任务：约好朋友吃饭聊天，用茜茜分享的方法当面夸赞ta的优点", 
        "stars": 5
    }, 
    {
        topicId: "2000000024800326",
        "task": "用“四面镜子”了解另一半，记录下你了解另一半的具体内容", 
        "stars": 3
    }, 
    {
        topicId: "2000000024800326",
        "task": "用撒娇的方式让老公请吃饭，记录下你是用什么语言成功地让他答应的", 
        "stars": 4
    }, 
    {
        topicId: "2000000024800326",
        "task": "记录下为老公做老公面后，他的反应及对这碗面的评价", 
        "stars": 5
    }, 
    {
        topicId: "2000000024800326",
        "task": "让孩子组织聚会，并在聚会上自我介绍，记录下你是如何引导孩子的", 
        "stars": 3
    }, 
    {
        topicId: "2000000024800326",
        "task": "带孩子去敬老院捐出零花钱，记录孩子在哪些方面做出了改变", 
        "stars": 4
    }, 
    {
        topicId: "2000000024800326",
        "task": "制作孩子的时间管理安排表，展示每天完成的效果", 
        "stars": 4
    }, 
    {
        topicId: "2000000024800326",
        "task": "让孩子说出自己眼中好爸妈的样子，反思记录自己的不足", 
        "stars": 5
    }
]

var standard = {

    topicId: 0,
    cIndex: -1,

    // isBuy   Y: 已经购买  N: 未购买
    isBuy: "Y",

    // joinStatus (1:未参加 ，2:已参加)
    joinStatus: 0, 
    userId: 0,
    formUserId: 0,

    content: "",
    commentList: [],

    // 分页逻辑参数
    page: 1,
    hasMore: true,
    isLoadding: false,
    

    init: function (initData) {
        this.initializeData(initData)
        this.renderBanner(initData)
        this.initCommentRender()

        this.initListeners()
        // this.initHandlebarList()
        this.initShare()
    },

    initializeData: function(initData) {

        this.topicId = urlUtils.getUrlParams("topicId")
        this.cIndex = parseInt(urlUtils.getUrlParams("index")) 
        this.userId = initData.userId

        if(this.cIndex < 0 && this.cIndex > 10) {
            toast.toast("index有误",1000,"middle")
        }

        var formUserId = urlUtils.getUrlParams("formUserId")
        if(formUserId) {
            this.formUserId = formUserId
        }
        // this.isBuy = "N"
        this.isBuy = initData.isBuy
        this.joinStatus = initData.topicTaskInfo.status,
        this.taskInfo = initData.topicTaskInfo
        this.content = initData.userComment.content

        this.pushCommentData(initData.commentList)
        console.log(this);
    },

    pushCommentData: function(commentList) {
        if(commentList.length) {
            commentList.forEach(function(item, idx) {
                this.commentList.push({
                    content: item.content,
                    createTime: formatDate(item.createTime),
                    headImgUrl: imgUrlFormat(item.headImgUrl),
                    id: item.id,
                    isLike: item.isLike == "Y" ? true : false,
                    likeNum: item.likeNum,
                    topicId: item.topicId,
                    userName: item.userName,
                })
            }, this);
        }
        this.page ++ ;
        if(commentList.length < 10) {
            this.hasMore = false
        }
    },

    addCommentRender: function(commentList) {
        $(".comment-list").append(tpls.comment({
            commentList: commentList
        }))
    },

    fetchComment: function() {
        var that = this
        that.isLoadding = true
        if(that.hasMore) {
            $.ajax({
                type: 'GET',
                url: '/api/wechat/activity/yeyiqian/assignment/list-get',
                timeout: 10000,
                data: {
                    topicId: that.topicId,
                    page: {
                        page: that.page,
                        size: 10
                    }
                },
                success: function (res) {
                    res = JSON.parse(res)
                    if(res && res.data) {
                        console.log(res.data.dataList);
                        that.pushCommentData(res.data.dataList)
                        var commentList = []
                        res.data.dataList.forEach(function(item, idx) {
                            commentList.push({
                                content: item.content,
                                createTime: formatDate(item.createTime),
                                headImgUrl: imgUrlFormat(item.headImgUrl),
                                id: item.id,
                                isLike: item.isLike == "Y" ? true : false,
                                likeNum: item.likeNum,
                                topicId: item.topicId,
                                userName: item.userName,
                            })
                        }, this);

                        that.addCommentRender(commentList)
                        that.isLoadding = false
                    } 
                },
                error: function (err) {
                    that.isLoadding = false
                    console.error(err);
                    toast.toast(err, 1000, 'middle');
                },
            });
        }

    },

    renderBanner: function(initData) {  
        var that = this
        var showInput = false
        if(this.isBuy == 'Y' && this.joinStatus == 0 && !this.formUserId) {
            showInput = true
        }
        var checkTask = false
        if(this.isBuy == 'Y') {
            checkTask = true
        }

        if(this.joinStatus == 0) {
            var isJoind = false
        } else {
            var isJoind = true
        }

        $(".banner-con").html(tpls.taskBanner({
            title: that.taskInfo.topic,
            showInput: showInput,
            task: taskList[that.cIndex].task,
            content: that.content,
            backgroundUrl: that.taskInfo.backgroundUrl,
            checkTask: checkTask,
            isJoind: isJoind,
        }))
    },

    initCommentRender: function(initData) {
        var that = this

        console.log(that.commentList);
        $(".comment-list").html(tpls.comment({
            commentList: that.commentList
        }))
    },

    initListeners: function () {
        var that = this
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

        $('body').on('input onpropertychange', '#mta', function () {
            $(".num var").html($(this).val().length)
        });

        $('body').on('click', '.dialog-conform', function () {
            $('.dialog-back').hide();
        });


        $('body').on('click', '.like', function () {
            var id = $(this).data("id")
            var $var =  $(this).find("var")


            var likeNum = parseInt($var.html()) + 1
            $var.html(likeNum)
            $(this).find(".like-icon").addClass("liked-icon").removeClass("like-icon")
            $(this).addClass("liked").removeClass("like")

            $.ajax({
                type: 'GET',
                url: '/api/wechat/activity/yeyiqian/assignment/like',
                timeout: 10000,
                data: {
                    assignmentId: id,
                },
                success: function (res) {

                    res = JSON.parse(res) 
                    if(res.state.code == 0) {

                    } else {
                        toast.toast(res.state.msg, 1000, "middle")
                    }


                },
                error: function (err) {
                    that.isLoadding = false
                    console.error(err);
                    toast.toast("点赞失败，请稍后再试", 1000, 'middle');
                },
            });
        });

        $('body').on('click', '#btn-submit', function () {
            var content = $("#mta").val()
            console.log(content.length);
            console.log(content);

            if(content.length < 10) {
                toast.toast("最少10个字", 1000, 'middle');
                return 
            }

            if(content.length > 300) {
                toast.toast("最多不能超过300字", 1000, 'middle');
                return 
            }
            
            $.ajax({
                type: 'GET',
                url: '/api/wechat/activity/yeyiqian/assignment/save',
                timeout: 10000,
                data: {
                    topicId: that.topicId,
                    content: content
                },
                success: function (res) {
                    setTimeout(function() {
                        location.reload() 
                    }, 150);
                },
                error: function (err) {
                    that.isLoadding = false
                    console.error(err);
                    toast.toast("任务提交失败，请稍后再试", 1000, 'middle');
                },
            });

            if (window._qla) {
                window._qla('click', {
                    name: "提交任务",
                    region: "btn-submit",
                });
            }

        });

        $('body').on('click', '#btn-check-task', function () {
            if(that.formUserId) {
                if(that.isBuy == "N") {
                    setTimeout(function() {
                        location.href = "http://hd1.qianliao.net/wechat/page/activity/super-mother?ch=ACTIVITY"
                    }, 150);

                    if (window._qla) {
                        window._qla('click', {
                            name: "任务详情页-立即参与",
                            region: "btn-join-now",
                        });
                    }
                } else {
                    if(that.joinStatus == 1) {
                        setTimeout(function() {
                            location.href = "/wechat/page/activity/super-mother/task?topicId=" + that.topicId + "&index=" + that.cIndex 
                        }, 150);
                    } 
                    if(that.joinStatus == 2) {
                        setTimeout(function() {
                            location.href = "/wechat/page/activity/super-mother/card-list?index=" + that.cIndex 
                        }, 150);
                    }
                }
            } else {
                if(that.joinStatus == 1) {
                    setTimeout(function() {
                        location.href = "/wechat/page/activity/super-mother/card-list?index=" + that.cIndex 
                    }, 150);
                } 
                if(that.joinStatus == 2) {
                    setTimeout(function() {
                        location.href = "/wechat/page/activity/super-mother/card-list?index=" + that.cIndex 
                    }, 150);
                }
            }

        });

        $(".main-container").scroll(function() {
            var $this = $(this)
            // console.log($this[0].scrollHeight - $this.height() - $this.scrollTop());

            if(!that.isLoadding && that.hasMore && $this[0].scrollHeight - $this.height() - $this.scrollTop() < 200) {
                that.fetchComment()
            }

        })

    },

    shareOption: {
        title: '我参与了叶一茜的幸福人生改变计划，一起学习还能赢取大奖！',
        des: '点击赢取价值¥1996的迪士尼家庭套票！',
        imgUrl: 'https://img.qlchat.com/qlLive/followQRCode/UB6XP3ND-J8PT-VRGU-1509108859400-92CE94Y21J8K.jpg'
    },
    initShare: function() {

        var url = location.href
        url = urlUtils.fillParams({formUserId: this.userId}, url)

        console.log(url);

        wxutil.share({
            title: this.shareOption.title,
            desc: this.shareOption.des,
            imgUrl: this.shareOption.imgUrl,
            shareUrl: url,
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

}

module.exports = standard;