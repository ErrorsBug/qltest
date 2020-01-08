var Handlebars = require('handlebars');
var loading = require('loading');
var tpls = {
    list: __inline('./tpl/list.handlebars'),
};

require('hbarimgformat');
require('hbarcompare');

var $container = $('#container');
var $lives = $('#lives');

var view = {
    updateLives: function (data) {
        $lives.append(tpls.list({
            lives: data,
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

    /* 更新关注按钮样式*/
    updateFocusBtn: function (btn) {
        var status = btn.hasClass('on');
        var text = status ? '关注' : '已关注';
        btn.toggleClass('on');
        btn.text(text);
    },
};

module.exports = view;
