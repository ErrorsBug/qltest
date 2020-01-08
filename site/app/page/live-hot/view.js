var Handlebars = require('handlebars'),
    // TouchSlide = require('touchslide'),
    loading = require('loading'),

    tpls = {
        live: __inline('./tpl/live.handlebars')
    };

require('hbarimgformat');
require('../../comp/default-img/default-img');

var view = {
    /**
     * 渲染直播间数据
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T17:04:39+0800
     * @param    {[type]}                           reset [description]
     * @param    {[type]}                           lives [description]
     * @return   {[type]}                                 [description]
     */
    updateLives: function(reset, lives) {
        var $livesList = $('.lives-list ul');

        if (reset) {
            $livesList.empty();
        }

        $livesList.append(tpls.live({
            lives: lives
        }));
    },
    /**
     * banner图片启用轮播
     * @return {[type]} [description]
     */
    // enableBannerSlide: function () {
    //     if ($('#banner-list li').length > 1) {
    //         TouchSlide({
    //             slideCell: '#banners',
    //             mainCell: '#banner-list',
    //             titCell: '#page-tip',
    //             effect: 'leftLoop',
    //             autoPage: true,
    //             autoPlay: true,
    //             delayTime: 300,
    //             interTime: 4000
    //         });
    //     }
    // },

    /**
     * 更新直播关注状态
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T16:40:01+0800
     * @param    {[type]}                           liveId [description]
     * @return   {[type]}                                  [description]
     */
    liveFocused: function(liveId, flag) {
        
        var $statusBtn = $('.status-btn[data-id="' + liveId + '"]'),
            $status = $statusBtn.find('.status');

        console.log($status);

        if (flag === 'Y') {
            $status.addClass('followed');
            $statusBtn.find('span').html('已关注');
        } else {
            $status.removeClass('followed');
            $statusBtn.find('span').html('关注');
        }
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