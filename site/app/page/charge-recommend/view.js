var Handlebars = require('handlebars'),
    loading = require('loading'),

    tpls = {
        courseList: __inline('./tpl/course-list.handlebars'),
        // topics: __inline('./tpl/topics.handlebars')
    };

require('hbarimgformat');
require('hbarcompare');
require('hbardigitformat');
require('../../comp/default-img/default-img');

var view = {
   updateCourse: function(reset, courses) {
        if (reset) {
            $('.course-list').empty();
        }

        if (courses) {
            $('.course-list').append(tpls.courseList({
                courses: courses,
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
    },
};

module.exports = view;
