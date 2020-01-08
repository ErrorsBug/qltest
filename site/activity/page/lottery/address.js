require('zepto');

var fastClick = require('fastclick');
// var urlUtils = require('urlutils');

var toast = require('toast');
var conf = require('../conf');
var dialog = require('dialog');


/**
 * @require '../../components_modules/reset.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './address.scss'
 */

var address = {
    init: function () {

        this.initData()
        this.initListeners()

    },
    initData: function() {
        var name = localStorage.getItem("book-address-name")
        var mobile = localStorage.getItem("book-address-mobile")
        var address = localStorage.getItem("book-address-address")

        if(name) {
            $('#name').val(name)
        }
        if(mobile) {
            $('#mobile').val(mobile)
        }
        if(address) {
            $('#address').val(address)
        }

    },

    initListeners: function () {
        var that = this;
        // 解决点击300ms延迟
        fastClick.attach(document.body);

        // 重置委拖事件，避免ios中点击失效
        $('body > *').on('click', function () { });


        $('body').on('click', '.submit-btn', function(e) {
            that.onSubmitBtnClick(e);
        });

        $('body').on('focus', '#address', function(e) {
            setTimeout(function() {       
                $('#container').scrollTop(1000000)
            }, 400);
        });


    },

    onSubmitBtnClick: function(e) {
        var that = this;

        var name = $('#name').val(),
            mobile = $('#mobile').val(),
            address = $('#address').val();

        if (this.isSubmiting) {
            return false;
        }

        if (!name) {
            toast.toast('请输入姓名', 1000, 'middle');
            return;
        }

        if (!mobile) {
            toast.toast('请输入手机号', 1000, 'middle');
            return;
        }

        if (!address) {
            toast.toast('请输入收货地址', 1000, 'middle');
            return;
        }

        if (name.length > 50) {
            toast.toast('姓名长度不能超过50', 1000, 'middle');
            return;
        }

        if (!/^1[0-9]{10}$/.test(mobile)) {
            toast.toast('请输入11位手机号码', 1000, 'middle');
            return;
        }

        if (address.length > 200) {
            toast.toast('收货地址长度不能超过200', 1000, 'middle');
            return;
        }


        // console.log(name, mobile, address);

        this.isSubmiting = true;


        $.ajax({
            type: 'GET',
            url: '/activity/api/lottery/address',
            data: {
                name: encodeURIComponent(name),
                mobile: mobile,
                address: encodeURIComponent(address)
            },
            // dataType: 'jsonp',
            success: function (res) {
                that.isSubmiting = false;
                res = JSON.parse(res)
                if (res.state && res.state.code === 0) {
                    localStorage.setItem("book-address-name", name)
                    localStorage.setItem("book-address-mobile", mobile)
                    localStorage.setItem("book-address-address", address)
                    toast.toast('提交成功', 1000, 'middle');

                    setTimeout(function() {
                        history.back()
                    }, 2000);

                } else {
                    toast.toast(res.state && res.state.msg || '保存失败，请稍后重试', 1000, 'middle');
                }
            },
            error: function (err) {
                that.isSubmiting = false;
                console.error(err);
                toast.toast('保存失败，请稍后重试', 1000, 'middle');
            },
        });
    }

}

module.exports = address;
