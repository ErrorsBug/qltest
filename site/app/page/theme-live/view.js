var Handlebars = require('handlebars'),
    loading = require('loading'),

    tpls = {
        live: __inline('./tpl/live.handlebars'),
        topic: __inline('./tpl/topic.handlebars')
    };

require('hbarcompare');
require('hbarimgformat');
require('hbarstatusshow');
require('hbarisbeginning');
require('hbarmoneyformat');
require('hbardateformat');
require('../../comp/default-img/default-img');

var view = {
   updateLives: function(reset, lives) {
        if (reset) {
            $('.lives').empty();
        }

        if (lives) {
            $('.lives').append(tpls.live({
                lives: lives
            }));
        }
   },

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

   updateTopics: function(topicsData) {
        for (var liveId in topicsData) {
            var $tar = $('.topics[data-liveId="' + liveId + '"]'),
                topics = topicsData[liveId];

            if (!topics || !topics.length) {
                $tar.addClass('hidden');
                continue;
            }

            $tar.html(tpls.topic({
                topics: topics
            }));
            $tar.removeClass('hidden');
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