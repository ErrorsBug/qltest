var Handlebars = require('handlebars'),
    loading = require('loading'),

    tpls = {
        topic: __inline('./tpl/topic.handlebars'),
        // topics: __inline('./tpl/topics.handlebars')
    };

require('hbarcompare');
require('hbarimgformat');
require('hbarstatusshow');
require('hbarisbeginning');
require('hbardigitformat');
require('hbarmoneyformat');
require('../../comp/default-img/default-img');

var view = {
   updateTopics: function(reset, topics) {
        if (reset) {
            $('.topic-list').empty();
        }

        if (topics) {
            $('.topic-list').append(tpls.topic({
                topics: topics
            }));
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