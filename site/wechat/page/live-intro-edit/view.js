var loading = require('loading');

var view = {

    /**
     * 显示loading样式
     * @return {[type]} [description]
     */
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

    showDeleteBox: function () {
        $('#deleteIntroImage').show();
    },

    hideDeleteBox: function () {
        $('#deleteIntroImage').hide();
    },
}

module.exports = view;