var TouchSlide = require('touchslide'),
    loading = require('loading'),
    ActionSheet = require('actionsheet'),
    Dialog = require('dialog'),
    Handlebars = require('handlebars'),
    tpls = {
        topics: __inline('./tpl/topic-list.handlebars'),
        intro: __inline('./tpl/channel-intro.handlebars'),
        options: __inline('./tpl/pay-sheet.handlebars'),
        memberDialog: __inline('./tpl/member-dialog.handlebars'),
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
    updateTopics: function(reset, topics) {
        var $topicsList = $('#list');
        if (reset) {
            $topicsList.empty();
        }

        if (topics.length === 0) {
            return;
        }

        $topicsList.append(tpls.topics({
            topics: topics,
        }));
    },

    /**
     * 渲染系列课列表tab
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
    },

    /**
     * 设置单节购买的完毕了
     */
    setSinglePayment: function (topicId) {
        $('.topic-item[data-topic-id="' + topicId + '"] .payment-status').empty().html('<span class="paid-btn">您已购买此节课</span>');
    },

    /**
     * 设置单节购买的购买中状态
     */
    setInSelectResult: function (topicId) {
        $('.topic-item[data-topic-id="' + topicId + '"] .payment-status').empty().html('<span class="paid-btn">订单处理中...</span>');
    },

    /**
     * 打开底部弹框
     */
    showOptions: function (chargeConfigs) {
        if (!this.options) {
            this.options = new ActionSheet({
                content: tpls.options({
                    chargeConfigs: chargeConfigs,
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

    showMemberDialog: function (date) {
        if (!this.memberDialog) {
            this.memberDialog = new Dialog({
                hideTitle: true,
                button: false,
                content: tpls.memberDialog({date: date}),
                cls: 'member-dialog-container',
            });
        }

        this.memberDialog.show();
    },

    hideMemberDialog: function () {
        this.memberDialog.hide();
    },
};

module.exports = view;
