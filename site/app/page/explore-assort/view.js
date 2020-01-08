var Handlebars = require('handlebars');
var touchSlide = require('touchslide');
var loading = require('loading');

// var $container = $('#container');

var view = {
    appendList: function (data) {
    },

    updateBannerStatus: function () {
        if ($('#carousel li').length<1) {
            $('#carousel-container').attr('hidden', true);
            return;
        }
    },

    enableBannerSlide: function () {

        var that = this;
        var autoplay = true;
        var len = $('#carousel li').length;
        if (len == 1) { autoplay = false;}
        if (len >= 1) {
            that.initCarousel()
            setTimeout(function () {
                touchSlide({
                    slideCell: '#carousel-container',
                    mainCell: '#carousel',
                    titCell: '#tit',
                    effect: 'leftLoop',
                    autoPage: true,
                    autoPlay: autoplay,
                    delayTime: 300,
                    interTime: 4000,
                });
                that.initTit();
            }, 0);
        }
    },

    initCarousel: function () {
        var $caro = $('#carousel li img');
        $caro.each(function (index, item) {
            var src = $(item).attr('data-src');
            $(item).attr('src', src);
        });
    },

    initTit: function () {
        // var $caro = $('#carousel li img');
        // var $thumb = $('#tit li');

        // $thumb.each(function (index, item) {
        //     var url = $caro.eq(index + 1).attr('src');
        //     /* 替换图片裁剪路径*/
        //     url = url.replace(/\@[a-z0-9_]+/, '@30w_30h_1e_1c_2o');
        //     item.style.backgroundImage = 'url(' + url + ')';
        //     item.innerText = '';
        // });
        $('#tit').removeAttr('hidden');
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
