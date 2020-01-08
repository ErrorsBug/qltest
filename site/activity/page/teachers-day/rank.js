require('zepto');
// require('tapon');

var Handlebars = require('handlebars');

var fastClick = require('fastclick');
var toast = require('toast');
var urlUtils = require('urlutils');
var conf = require('../../conf');

/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './rank.scss'
 */

var standard = {
    init: function (initData) {
        this.initListeners()
        this.informHandle(initData)
        this.timeHandle(initData)
        this.initRankList(initData)
    },

    informListIndex : 0,

    informHandle: function (initData) {


        var informList = []

        if(initData.rankList) {
            initData.rankList.map(function(item)  {
                informList.push("恭喜" + item.name + "冲上今日排行榜，当前排名:第"+ item.rank +"名")
            })
    
            $(".inform-text")[0].innerHTML = informList[0]
            $(".inform-text")[1].innerHTML = informList[1]
            var that = this
            // 通知的自动滚动
            setInterval(function() {
                if(that.informListIndex < informList.length -1) {
                    that.informListIndex ++;
                } else {
                    that.informListIndex = 0;
                }
                $("#inform-list")[0].style.transition = "all .5s ease-out"
                $("#inform-list")[0].style.top = "-100%"
    
                setTimeout(function() {
    
                    $("#inform-list")[0].style.transition = ""
                    $("#inform-list")[0].style.top = "0"
    
                    $(".inform-text")[0].innerHTML = informList[that.informListIndex]
                    if(that.informListIndex == informList.length - 1) {
                        $(".inform-text")[1].innerHTML = informList[0]
                    } else {
                        $(".inform-text")[1].innerHTML = informList[that.informListIndex + 1]
                    }
                }, 500);
            }, 4000);
        } else {
            $(".inform-con").hide()
            $(".current-rank")[0].innerHTML = '暂无排名'
            $(".distance")[0].innerHTML = "直播间暂未分类，<span class='go-chose-type'>选择直播间分类即可参与排名></span>"

            $(".shadow-btn").removeClass("push-rank").addClass("type-tip").removeClass("get-reword")
        }

    },

    timeHandle: function (initData) {
        // var that = this
        // var timeEnd = new Date('2017/9/15').getTime()

        // var timeLeft = (timeEnd - initData.sysTime) / 1000

        // var d_hours = parseInt(timeLeft / 3600)
        // var d_minutes = parseInt( (timeLeft - d_hours * 3600) / 60 )
        // var d_sec = parseInt(timeLeft - d_hours * 3600 - d_minutes * 60)

        // setInterval(function() {
        //     timeLeft--;
        //     d_hours = parseInt(timeLeft / 3600, 10)
        //     d_minutes = parseInt( (timeLeft - d_hours * 3600) / 60 )
        //     d_sec = parseInt(timeLeft - d_hours * 3600 - d_minutes * 60)

        //     $(".hours")[0].innerHTML = d_hours
        //     $(".minutes")[0].innerHTML = d_minutes
        //     $(".sec")[0].innerHTML = d_sec
        // }, 1000);


        
    },

    initRankList: function (initData) {

        if(initData.rankList) {
            var rankList = initData.rankList
            var myRank = initData.myRank
    
            function rankAssist(rank) {
                switch(rank) {
                    case 1:
                        return " rank1"
                    case 2:
                        return " rank2"
                    case 3: 
                        return " rank3"
                    default:
                        return ""
                }
            }
    
            for (var index = 0; index < rankList.length; index++) {
                var htmlString ='<div data-liveId='+ rankList[index].liveId +' class="rank-list-item'+ rankAssist(rankList[index].rank) +' ">' +
                                    '<div class="rank-con">' +
                                        '<div class="rank">' + rankList[index].rank + '</div>' +
                                    '</div>' +
                                    '<div class="name-con">' +
                                        '<div class="header"><img src="' + rankList[index].logoUrl + '@132w_132h_1e_1c_2o"></div>' +
                                        rankList[index].name +
                                    '</div>' +
                                    '<div class="active-value">' + rankList[index].score + '</div>' +
                                '</div>';
                
    
                $('#rank-list').append(htmlString)
            }
        } else {
            $('.rank-con').hide()
        }
        
    },

    initListeners: function () {
        var that = this;
        this.informList0 = $(".inform-text")[0]
        this.informList1 = $(".inform-text")[1]
        // 解决点击300ms延迟
        fastClick.attach(document.body);



        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        $('body').on('click', '.dialog-conform', function () {
            $('.dialog-back').hide();
        });
        $('body').on('click', '.dialog-back', function () {
            $('.dialog-back').hide();
        });
        $('body').on('click', '.get-reword', function () {
            $('.dialog-back').show();
        });


        $('body').on('click', '.type-tip', function () {
            $('.type-tip-dialog-back').show();
        });
        $('body').on('click', '.type-tip-dialog-back', function (e) {
            if(e.target.classList[0] == "type-tip-dialog-back") {
                $('.type-tip-dialog-back').hide();
            }
        });
        $('body').on('click', '.tip-dialog-conform', function () {
            setTimeout(function() {
                location.href = '/wechat/page/live/auth/' + location.search.slice(8)
            }, 150);
        });
        $('body').on('click', '.go-chose-type', function () {
            setTimeout(function() {
                location.href = '/wechat/page/live/auth/' + location.search.slice(8)
            }, 150);
        });



        $('body').on('click', '.push-rank', function () {
            setTimeout(function() {
                location.href = '/wechat/page/active-value/promote' + location.search
            }, 150);
        });

        $('body').on('click', '.click-to-sort', function () {
            setTimeout(function() {
                location.href = '/wechat/page/live/auth/' + location.search.slice(8)
            }, 150);
        });

        $('body').on('click', '.return-btn', function () {
            setTimeout(function() {
                location.href = '/wechat/page/active-value' + location.search
            }, 150);
        });

    }

}

module.exports = standard;