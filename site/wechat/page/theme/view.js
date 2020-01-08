var Handlebars = require('handlebars'),
    // loading = require('loading'),

    TabMenu = require('../../comp/tab-menu'),

    tpls = {
        theme: __inline('./tpl/theme.handlebars'),
        // topics: __inline('./tpl/topics.handlebars')
    };

require('hbarimgformat');
require('../../comp/default-img/default-img');

var view = {
    updateTheme: function(reset, themes) {
        if (reset) {
            $('.themes').empty();
        }

        if (themes) {
            $('.themes').append(tpls.theme({
                themes: themes
            }));
        }
    },

    renderTabMenu: function() {
        // 显示页面底部菜单
        new TabMenu({
            $el: $('body'),
            active: 'theme'
        });
    },

    /**
     * 显示loading样式
     * @return {[type]} [description]
     */
    // showLoading: function() {
    //     if (!this.loadingObj) {
    //         this.loadingObj = new loading.AjaxLoading();
    //     }

    //     this.loadingObj.show();
    // },

    /**
     * 隐藏loading样式
     * @return {[type]} [description]
     */
    // hideLoading: function() {
    //     if (this.loadingObj) {
    //         this.loadingObj.hide();
    //     }
    // }
};

module.exports = view;
