import {getUrlParams} from '../../../../../../comp/url-utils'
import { digitFormat } from '../../../../../../comp/util';

Component({
    properties: {
	    info: {
		    type: Object,
			value: null,
	    }
    },
    data: {
	    currentIndex: 0
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
	    changeBtnTapHandle (event) {
		    global.loggerService.click(event);
	    	const currentIndex = this.data.currentIndex < this.data.info.courses.length - 1 ? (this.data.currentIndex + 1) : 0;
	    	this.setData({ currentIndex });
        },
    },
    ready() {
    }
});