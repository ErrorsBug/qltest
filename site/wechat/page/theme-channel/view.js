var Handlebars = require('handlebars'),
    // loading = require('loading'),
    
    TabMenu = require('../../comp/tab-menu'),

    tpls = {
        channel: __inline('./tpl/channel.handlebars'),
        // topics: __inline('./tpl/topics.handlebars')
    };

require('hbarcompare');
require('hbarmoneyformat');
require('hbarimgformat');
require('../../comp/default-img/default-img');

var view = {
   updateChannels: function(reset, channels) {
        if (reset) {
            $('.channels').empty();
        }

        if (channels) {
            $('.channels').append(tpls.channel({
                channels: channels
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