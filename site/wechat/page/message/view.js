var Handlebars = require('handlebars'),
    // loading = require('loading'),
    nonePage = require('../../comp/none-page'),
    loading = require('loading'),
    tpls = {
        topics: __inline('./tpl/message-topic.handlebars'),
        channels: __inline('./tpl/message-channel.handlebars'),
        // topics: __inline('./tpl/topics.handlebars')
    };
require('hbardateformat');
require('hbarcompare');
require('hbarimgformat');
require('../../comp/default-img/default-img');

var view = {
    listViewInit: function (topics, channels, defaultTab) {
        this.loadingTopicObj=$('.topic-loading-next');
        this.loadingChannelObj=$('.channel-loading-next');
        this.showLoading('channel');

        if(topics&&topics.length<=0) {
            this.noneList('topic');
            this.hideLoading('topic');
        }
        if (channels && channels.length <= 0) {
            this.noneList('channel');
            this.hideLoading('channel');
        }
    //    var messages=this.dataFormate(messages);

        $('.channel-list').append(tpls.channels({
            channels: channels,
        }));
        $('.topic-list').append(tpls.topics({
            topics: topics,
        }));

        this.hideLoading('topic');
        this.hideLoading('channel');

        if (defaultTab === 'channel') {
            $('.channel-list-wrap').show();
            $('.topic-list-wrap').hide();
            this.setTitle('系列课留言表')
        } else if (defaultTab === 'topic') {
            $('.channel-list-wrap').hide();
            $('.topic-list-wrap').show();
            this.setTitle('话题留言表')
        }
    },
    setTitle:function(title){
        document.title=title;
    },
    noneList: function(type) {

        if (type === 'channel') {
            new nonePage({
                $el: $('.channel-list-wrap'),
                text: '暂无咨询记录',
            });
        } else if (type === 'topic') {
            new nonePage({
                $el: $('.topic-list-wrap'),
                text: '暂无咨询记录',
            });
        }
    },
    showLoading: function(type) {
        type === 'channel' ?
            this.loadingChannelObj.show() :
        type === 'topic' ?
            this.loadingTopicObj.show() : '';
    },
    hideLoading: function(type) {
        type === 'channel' ?
            this.loadingChannelObj.hide() :
        type === 'topic' ?
            this.loadingTopicObj.hide() : '';
    },
    updateTopicConsults: function(reset, topics) {
        // var messages=this.dataFormate(consults);
        $('.topic-list').append(tpls.topics({
            topics: topics,
        }));
    },
    updateChannelConsults: function(reset, channels) {
        // var messages=this.dataFormate(consults);
        $('.channel-list').append(tpls.channels({
            channels: channels,
        }));
    },
};

module.exports = view;
