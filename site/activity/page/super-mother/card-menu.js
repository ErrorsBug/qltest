require('zepto');
var Handlebars = require('handlebars');
var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');
var wxutil = require('wxutil');
var appSdk = require('appsdk');
var envi = require('envi');

// var tpls = {
//     listItem: __inline('./tpl/group-item.handlebars'),
// };

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './card-menu.scss'
 */

var standard = {
    init: function (initData) {
        this.initListeners()

        this.initGuide()
        this.initRoad(initData)
        this.initMedalGet(initData.topicList)
        this.initMedalListPopView()
        this.initShare()
    },
    initListeners: function () {
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

        $('body').on('click', '.pop-dialog', function(e) {
            $(this).hide() 
            if($(this).hasClass) {
                window.localStorage && window.localStorage.setItem("super_mother_guide", "Y")
            }
        });
        $('body').on('click', '.self-grow, .self-grow-tag', function(e) {
            $("#self-grow-pop").show();
        });
        $('body').on('click', '.marriage, .marriage-tag', function(e) {
            $("#marriage-pop").show();
        });
        $('body').on('click', '.easy-edu , .easy-edu-tag', function(e) {
            $("#easy-edu-pop").show();
        });


        $('body').on('click', '.medal.md1.done', function(e) {
            $("#sg-medal-pop").show();
        });
        $('body').on('click', '.medal.md2.done', function(e) {
            $("#mr-medal-pop").show();
        });
        $('body').on('click', '.medal.md3.done', function(e) {
            $("#edu-medal-pop").show();
        });




    },
    initGuide: function() {
        if(!window.localStorage.getItem('super_mother_guide')) {
            $("#guide").show()
        }
    },

    initRoad: function(initData) {
        var isAddNew = false;

        if(initData.topicList.length) {
            initData.topicList.forEach(function(item, index) {
                if(!isAddNew && item.startTime > initData.sysTime) {
                    isAddNew = true;
                    $('.sr' + (index + 1)).addClass("new")
                }
                if(item.status == 2) {
                    $('.sr' + (index + 1)).addClass("done")
                }
    
                $('body').on('click', '.sr' + (index + 1), function(e) {
                    setTimeout(function() {
                        location.href = '/wechat/page/activity/super-mother/card-list?index=' + index
                    }, 150);
                });
            });
        }

    },


    // 用localstorage 记录4个勋章是否展示过，没展示就直接展示
    //  Popview 表示是否自动弹出过该勋章弹窗
    //  GET 表示是否获得了该勋章
    medalListGet: [0,0,0,0],
    medalListPopView: [0,0,0,0], 
    initMedalGet: function(topicList) {
        var taskDoneCount = 0;

        if(!topicList.length) {
            return 
        }

        if (topicList[0].status == 2 && topicList[1].status == 2 && topicList[2].status == 2) {
            this.medalListGet[0] = 1;
        }
        if (topicList[3].status == 2 && topicList[4].status == 2 && topicList[5].status == 2) {
            this.medalListGet[1] = 1;
        }
        if (topicList[6].status == 2 && topicList[7].status == 2 && topicList[8].status == 2 && topicList[9].status == 2) {
            this.medalListGet[2] = 1;
        }

        this.medalListGet.forEach(function(item, index) {
            if(item) {
                taskDoneCount ++;
                if(taskDoneCount >= 3) {
                    this.medalListGet[3] = 1;
                }
                $('.md' + (index + 1)).addClass("done")
            }
        }, this);
    },
    initMedalListPopView: function() {
        var localData = localStorage.getItem("medalListPopView")
        if(localData) {
            this.medalListPopView = JSON.parse(localData)
        }
        console.log(this.medalListPopView);
        this.medalListGet.forEach(function(item, index) {
            if(item && !this.medalListPopView[index]) {
                console.log("show medal" + index);
                $(".mp" + (index + 1)).show();
                this.medalListPopView[index] = 1
            }
        }, this)
        localStorage.setItem("medalListPopView",JSON.stringify(this.medalListPopView))
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