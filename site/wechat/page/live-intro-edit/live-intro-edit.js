require('zepto');
// zeptofix
require('tapon');

var fastClick = require('fastclick');
var model = require('model');
var toast = require('toast');
var envi = require('envi');
var view = require('view');
var Upload = require('upload');


var view = require('./view');
var conf = require('../conf');

/**
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require './live-intro-edit.scss'
 */

var liveIntroEdit = {
    /*初始化*/
    init: function () {
        this.initListeners();
    },

    imageTodelete: null,
    localUrls: [],

    /* 初始化事件绑定*/
    initListeners: function () {
        var that = this;

        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });

        $('body').on('click', '.text-content p', that.toEdit);
        $('body').on('blur', '.text-content textarea', that.toRead);
        $('body').on('click', '.content-desc .icon-cross', that.toDelete);
        $('body').on('click', '.content-desc .icon-triangle-up', that.moveup);
        $('body').on('click', '.content-desc .icon-triangle-down', that.movedown);

        $('#deleteIntroImage .tlbtn_confirm').click(that.doDelete.bind(that));
        $('#deleteIntroImage .tlbtn_cancel').click(view.hideDeleteBox);

        $('#save-profile').click(that.save)
        $('#cancel').click(that.cancel);

        this.bindImageUpload();

    },

    remainCount: function () {
        return 6 - $('#content-desc li').length;
    },

    toEdit: function (e) {
        var $con = $(this).parents('.text-content');
        var $area = $con.find('textarea');

        $con.addClass('editing');
        $area.focus();
    },

    toRead: function (e) {
        var $con = $(this).parents('.text-content');
        var $p = $con.find('p');
        var val = $(this).val().trim();

        $p.text(val);

        if (val !== '') {
            $con.removeClass('editing');
        } else {
            $(this).val('');
        }
    },

    toDelete: function (e) {
        var index = $(this).parents('li').index();
        liveIntroEdit.imageToDelete = index;
        view.showDeleteBox();
    },

    moveup: function (e) {
        var $cur = $(this).parents('li');
        var index = $cur.index();
        var len = $('#content-desc li').length;
        if (index === 0) {
            return;
        }
        var $prev = $cur.prev();
        var curNum = $cur.find('img').attr('attr-sortnum');
        var prevNum = $prev.find('img').attr('attr-sortnum');
        if (curNum !== undefined && prevNum !== undefined) {
            $cur.find('img').attr('attr-sortnum', prevNum);
            $prev.find('img').attr('attr-sortnum', curNum);
        }
        $prev.before($cur);
    },

    movedown: function (e) {
        var $cur = $(this).parents('li');
        var index = $cur.index();
        var len = $('#content-desc li').length;
        if (index === (len - 1)) {
            return;
        }
        var $next = $cur.next();
        var curNum = $cur.find('img').attr('attr-sortnum');
        var nextNum = $next.find('img').attr('attr-sortnum');
        if (curNum !== undefined && nextNum !== undefined) {
            $cur.find('img').attr('attr-sortnum', nextNum);
            $next.find('img').attr('attr-sortnum', curNum);
        }
        $next.after($cur);
    },

    doDelete: function (e) {
        var $cur = $('#content-desc li').eq(liveIntroEdit.imageToDelete);
        $cur.remove();
        $('#deleteIntroImage').hide();
        uploadHandler._settings.maxLength = this.remainCount();
    },
    hideDeleteBox: function (e) {
        $('#deleteIntroImage').hide();
    },
    bindImageUpload: function () {
        var that = this;

        if (envi.isAndroid() || envi.isIOS()) {
            that.bindWechatUpload()
        } else {
            if ($('#upload-desc-image').length > 0) {
                that.bindPCUpload();
            }
        }
    },

    bindPCUpload: function () {
        var that = this;
        window.uploadHandler = new Upload($("#upload-desc-image"), {
            folder: "live/intro",
            multiple: 'Y',
            quota: 6,
            maxLength: that.remainCount(),
            onComplete: function (imgUrl) {
                that.renderImage(imgUrl, false);
            },
            onChange: function () {
                view.showLoading()

            },
            onError: function () {
                view.hideLoading()
            },
            onAllComplete: function () {
                view.hideLoading()
                uploadHandler._settings.maxLength = that.remainCount();
            },
        })
    },

    bindWechatUpload: function () {
        var that = this;
        $('#upload-desc-image').click(uploadImage)

        function uploadImage() {
            if (that.remainCount() <= 0) {
                toast.toast('最多上传6张图片');
                return;
            }

            wx.chooseImage({
                count: that.remainCount(),
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    that.localUrls = res.localIds;
                    wxImageUpload();
                },
                cancel: function (res) {
                    view.hideLoading()
                }
            });
        }

        function wxImageUpload() {

            var len = that.localUrls.length;

            if (len === 0) {
                view.hideLoading()
                return;
            }
            view.showLoading()


            var localUrl = that.localUrls.shift()
            wxUpload(localUrl);

            function wxUpload(localUrl) {
                wx.uploadImage({
                    localId: localUrl,
                    isShowProgressTips: 0,
                    success: function (res) {
                        that.renderImage(localUrl, true, res.serverId);
                        wxImageUpload();
                    },
                    fail: function (res) {
                        toast.toast('部分图片上传失败，请重新选择');
                    }
                });
            }
        }
    },

    renderImage: function (url, isResId, serverId) {
        var that = this;

        var type = 'url';
        var serStr = '';
        if (isResId) {
            type = 'resId';
            serStr = ' attr-serverid="' + serverId + '" ';
        }
        var template = '<li><i class="icon-cross"></i><span>' +
            '<img attr-type="' + type + '" ' + serStr + ' src="' + url + '" alt="">' +
            '</span><div class="text-content editing">' +
            '<p></p><textarea maxlength="1000" col="50" placeholder="填写说明"></textarea>' +
            '</div><i class="icon-triangle-up"></i><i class="icon-triangle-down"></i></li>'

        if (that.remainCount() > 0) {
            $('#content-desc').append(template);
        }
    },

    cancel: function () {
        location.href = '/wechat/page/live-setting?liveId=' + LIVE_ID;
    },


    saveLock: false,
    save: function () {
        if (this.saveLock) { return };
        this.saveLock = true;
        var that = this;
        view.showLoading();

        function getData() {
            var profiles = [];
            var introduce = $('#topic-sum').val().trim();

            $('#content-desc li img').each(function (index, elem) {
                var obj = {};
                if ($(this).attr('attr-serverid')) {
                    obj.resourceId = $(this).attr('attr-serverid');
                } else {
                    obj.url = $(this).attr('src');
                }
                obj.msg = $(this).parents('li').find('.text-content textarea').val().trim();
                obj.type = 'image';
                obj.sortNum = index + 1;

                profiles.push(obj);
            })

            return {
                liveId: LIVE_ID,
                introduce: introduce,
                profiles: profiles,
            }
        }

        var opt = {
            url: conf.api.saveLiveProfile,
            data: getData(),
            type: 'POST',
            success: function (res) {
                if (res && res.state && res.state.code === 0) {
                    toast.toast('保存成功');
                    location.href = '/wechat/page/live-setting?liveId=' + LIVE_ID;
                } else {
                    toast.toast(res.state.msg);
                }
            },
            error: function (res) {
                if (res && res.state && res.state.code === 0) {
                    toast.toast(res.state.msg);
                }
            },
            complete: function () {
                that.saveLock = false;
                view.hideLoading();
            },
        }

        model.fetch(opt);
    },
}

module.exports = liveIntroEdit;