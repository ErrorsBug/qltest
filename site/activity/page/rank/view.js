var Handlebars = require('handlebars');
var loading = require('loading');
var tpls = {
    list: __inline('./tpl/list.handlebars'),
};

require('hbarimgformat');
require('hbarcompare');
require('./helper');

var $container = $('#container');
var $topics = $('#topics');

var view = {
    updateTopics: function (data) {
        $topics.append(tpls.list({
            topics: data,
        }));
    },

    /* 显示loading样式*/
    showLoading: function () {
        if (!this.loadingObj) {
            this.loadingObj = new loading.AjaxLoading();
        }

        this.loadingObj.show();
    },

    /* 隐藏loading样式*/
    hideLoading: function () {
        if (this.loadingObj) {
            this.loadingObj.hide();
        }
    },
};

module.exports = view;
