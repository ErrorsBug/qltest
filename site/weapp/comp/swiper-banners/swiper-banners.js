import { linkTo } from '../util';

export const initSwiperBanners = (ctx, banners) => {
    ctx.handleSwiperBannerTap = (e) => {
        let curTarget = e.currentTarget,
            url = curTarget.dataset.url,
            type = curTarget.dataset.type,
            id;

        let reg = /\/(\w*)\.htm/,
            ids = url.match(reg);

        id = ids && ids.length > 1 && ids[1];

        let isActivity = [
            /topic\/details/,
            /topic\/details-video/,
            /topic\/details-audio-graphic/,
            /topic\/\d+\.htm/,
            /live\/channel\/channelPage\/\d+/,
            /wechat\/page\/live\/\d+/,
        ].every(item => !new RegExp(item).test(url))

        if (isActivity) {
            wx.showModal({
                title: '提示',
                content: '暂不支持该页面',
                showCancel: false
            });
            return;
        }

        switch(type) {
            case 'live':
                linkTo.liveIndex(id);
                // url = '/pages/live-index/live-index?liveId=' + id;
                break;
            case 'topic':
                linkTo.thousandLive(id);
                // url = '/pages/thousand-live/thousand-live?topicId=' + id;
                break;
            case 'channel':
                linkTo.channelIndex(id);
                // url = '/pages/channel-index/channel-index?channelId=' + id;
                break;
        }

        // if (url) {
        //     wx.navigateTo({
        //         url: url
        //     });
        // }
    };

    ctx.setData({
        banners
    });
};
