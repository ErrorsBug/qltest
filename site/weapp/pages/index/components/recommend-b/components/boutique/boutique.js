import {getUrlParams} from '../../../../../../comp/url-utils'

Component({
    properties: {
		infos: {
			type: Object,
			value: {},
		}
    },
    data: {
    },
    methods: {
	    courseItemTapHandle(e){
		    global.loggerService.click(e);
	    	const course = e.currentTarget.dataset.course;
			let shareKey = getUrlParams('shareKey',course.url)
            let lshareKey = getUrlParams('lshareKey',course.url)
		    const url = course.businessType === 'channel'
			    ?
			    `/pages/channel-index/channel-index?channelId=${course.businessId}${shareKey ? '&shareKey=' + shareKey : ''}${lshareKey ? '&lshareKey=' + lshareKey : ''}`
			    :
			    `/pages/thousand-live/thousand-live?topicId=${course.businessId}${shareKey ? '&shareKey=' + shareKey : ''}${lshareKey ? '&lshareKey=' + lshareKey : ''}`;

		    wx.navigateTo({
			    url
		    });
		},
	    getMoreBtnTapHandle(e) {
		    global.loggerService.click(e);
		    this.triggerEvent('getMoreBtnTapHandle', e.currentTarget.dataset);
	    },
    },
    ready() {
    }
});