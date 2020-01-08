var Handlebars = require('handlebars'),
    // TouchSlide = require('touchslide'),
    loading = require('loading'),
    ActionSheet = require('actionsheet'),
    Dialog = require('dialog'),

    tpls = {
        topics: __inline('./tpl/topic-list.handlebars'),
        channels: __inline('./tpl/channel-list.handlebars'),
        intro: __inline('./tpl/live-intro.handlebars'),
        options: __inline('./tpl/option-sheet.handlebars'),
        liveV: __inline('./tpl/live-v-dialog.handlebars'),
        liveT: __inline('./tpl/live-t-dialog.handlebars'),
    };

require('hbarimgformat');
require('../../comp/default-img/default-img');

var view = {
    showEmptyList: function () {
        $('#empty-list').show();
    },

    hideEmptyList: function () {
        $('#empty-list').hide();
    },

    showEmptyIntro: function () {
        $('#empty-intro').show();
    },

    hideEmptyIntro: function () {
        $('#empty-intro').hide();
    },

    /**
     * 渲染话题列表tab
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T17:04:39+0800
     * @param    {[type]}                           reset [description]
     * @param    {[type]}                           lives [description]
     * @return   {[type]}                                 [description]
     */
    updateTopics: function (reset, topics) {
        var $topicsList = $('#list');

        if (reset) {
            $topicsList.empty();
        }

        $topicsList.append(tpls.topics({
            topics: topics,
        }));
    },

    /**
     * 渲染系列课列表tab
     */
    updateChannels: function (reset, channels) {
        var $topicsList = $('#list');

        if (reset) {
            $topicsList.empty();
        }

        $topicsList.append(tpls.channels({
            channels: channels,
        }));
    },

    /**
     * 渲染直播间介绍tab
     */
    updateIntro: function (reset, intro) {
        var $topicsList = $('#list');

        if (reset) {
            $topicsList.empty();
        }

        $topicsList.append(tpls.intro({
            intro: intro,
        }));
    },

    /**
     * 更新直播关注状态
     * @Author   fisher<wangjiang.fly.1989@163.com>
     * @DateTime 2016-11-16T16:40:01+0800
     * @param    {[type]}                           liveId [description]
     * @return   {[type]}                                  [description]
     */
    liveFocused: function (liveId, flag) {
        var $statusBtn = $('.status-btn[data-id="' + liveId + '"]'),
            $status = $statusBtn.find('.status');

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
    showLoading: function () {
        if (!this.loadingObj) {
            this.loadingObj = new loading.AjaxLoading();
        }

        this.loadingObj.show();
    },

    /**
     * 隐藏loading样式
     * @return {[type]} [description]
     */
    hideLoading: function () {
        if (this.loadingObj) {
            this.loadingObj.hide();
        }
    },

    /**
     * 改变按钮状态
     */
    updateBtnStatus: function (attentionStatus, noticeStatus, attentionNum) {
        if (noticeStatus) {
            $('#notice').text('关闭通知');
        } else {
            $('#notice').text('开启通知');
        }

        if (attentionNum || attentionNum === 0) {
            $('#attention-num').html(attentionNum);
        }

        if (attentionStatus) {
            $('#attention').text('取消关注');
        } else {
            $('#attention').text('关注直播间');
        }

        $('#attention').data('isatt', attentionStatus);
        $('#notice').data('notice', noticeStatus);
    },

    /**
     * 打开底部弹框
     */
    showOptions: function (type) {
        if (!this.options) {
            this.options = new ActionSheet({
                content: tpls.options({
                    type: type,
                }),
                onMaskClick: function () {
                    this.options.hide();
                }.bind(this),
            }, true);
        } else {
            this.options.show();
        }
    },

    /**
     * 关闭底部弹框
     */
    hideOptions: function () {
        if (this.options) {
            this.options.hide();
        }
    },

    /**
     * 显示加V说明弹框
     */
    showLiveVDialog: function (detail, datetime) {
        if (!this.liveVDialog) {
            this.liveVDialog = new Dialog({
                title: false,
                content: tpls.liveV({ detail: detail, datetime: datetime }),
            });
        }

        this.liveVDialog.show();
    },

    /**
     * 显示加T说明弹框
     */
    showLiveTDialog: function () {
        if (!this.liveTDialog) {
            this.liveTDialog = new Dialog({
                title: false,
                content: tpls.liveT(),
            });
        }

        this.liveTDialog.show();
    },
};

module.exports = view;
