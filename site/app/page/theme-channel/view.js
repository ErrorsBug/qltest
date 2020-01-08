var Handlebars = require('handlebars'),
    // loading = require('loading'),

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