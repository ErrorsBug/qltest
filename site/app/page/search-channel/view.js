var loading = require('loading');
var Handlebars = require('handlebars');

var tpls = {
    list: __inline('./tpls/list.handlebars'),
};

require('hbardateformat');
require('hbarcompare');
require('./helper');

var $list = $('.channels')

var view = {

    // 更新列表
    updateList: function (data) {
        $list.append(tpls.list({channels: data}))
    },

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
}

module.exports = view;
