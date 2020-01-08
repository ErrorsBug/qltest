/**
 * [official-index description]
 * @type {Object}
 *
 * @require './index.css'
 */
var $ = require('./jquery');
var carouselPlugin = require('./carousel');
var $window = $(window);
var boundaryHeight = $window.height() * 0.7; // 边界高度

var index = {
    init: function() {
       carouselPlugin.initPlugin($); // initiate carousel plugin
       Caroursel.init($('.carousel-wrap')); // startup carousel plugin

       var anchorPoints = $('#anchor-points-sidebar').find('.anchor-point:not(.access-now-anchor)');
       anchorPoints.click(this.handleClickAnchorPoint.bind(null, anchorPoints));
        
       // 存储页面上各区域的高度分界点
       var sections = $('.anchor-section');
       var delimiters = [0];
       sections.each(function(index){
           var height = $(this).height() + delimiters[index];
           delimiters.push(height);
       });
       $window.scroll(this.handleActiveAnchorSwitch.bind(null, delimiters, anchorPoints));
    },
    // 页面导航按钮被点击时切换为高亮状态
    handleClickAnchorPoint: function(anchorPoints){
        anchorPoints.removeClass('active-anchor-point');
        $(this).addClass('active-anchor-point');
    },
    // 页面滚动时区域对应的导航按钮被设置为高亮状态
    handleActiveAnchorSwitch: function(delimiters, anchorPoints){
        var activeIndex = 0;
        var scrollTop = $window.scrollTop();
        for (var i = 1; i < delimiters.length; i++) {
            var upper = delimiters[i - 1];
            var lower = delimiters[i];
            if (scrollTop >= upper && scrollTop <= lower) {
                // 当页面区域的上边界越过边界高度时，切换高亮按钮
                if ((lower - scrollTop) <= boundaryHeight) {
                    activeIndex = i;
                } else {
                    activeIndex = i - 1;
                }
                anchorPoints.removeClass('active-anchor-point').eq(activeIndex).addClass('active-anchor-point');
                break;
            }
        }
    }
};

module.exports = index;