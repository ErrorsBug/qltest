var Handlebars = require('handlebars');
    
    tpl = {
        tabMenu: __inline('./tab-menu.handlebars')
    };

/**
 * 页面底部导航菜单栏
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-30T18:01:59+0800
 * @param    {[type]}                           options [description]
 *
 * @require ./tab-menu.css
 */
var TabMenu = function (options) {
    this.opts = $.extend({
        $el: $('body'),
        active: 'index'
    }, options);

    var actives = ['index', 'theme', 'mine'];

    for (var i = 0, len = actives.length; i < len; i++) {
        if (actives[i] === this.opts.active) {
            this.opts['active_' + actives[i]] = true;
        }
    }

    this.render();

    this.bindEvents();
};

TabMenu.prototype.render = function() {
    this.opts.$el.append(tpl.tabMenu(this.opts));
};

TabMenu.prototype.bindEvents = function() {
    this.opts.$el.on('click', '.co-tab-menu .co-menu', function(e) {
        this.onTabClick(e);
    }.bind(this));
};

TabMenu.prototype.onTabClick = function(e) {
    var $tar = $(e.currentTarget),
        isActive = $tar.hasClass('active'),
        url = $tar.attr('data-url');

    if (!isActive) {
        setTimeout(function() {
            window.location.href = url;
        }, 100);
    }
};

module.exports = TabMenu;