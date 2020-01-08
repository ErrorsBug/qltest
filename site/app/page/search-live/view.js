var loading = require('loading');
var Handlebars = require('handlebars');

var tpls = {
    list: __inline('./tpls/list.handlebars'),
};

require('hbardateformat');
require('hbarcompare');
require('./helper');

var $list = $('.lives')

var view = {

    // 更新列表
    updateList: function (data) {
        $list.append(tpls.list({lives: this.authorMap(data)}))
    },

    /* 转换直播间搜索结果 */
    authorMap:function(list) {
        return list.map(function(item){
            item.isAuthor = window.AUTHORITY_LIST.indexOf(item.id) > -1;
            return item;
        })
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
