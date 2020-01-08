import request from '../../../../../../comp/request';
import { api } from '../../../../../../config';
import * as regeneratorRuntime from '../../../../../../comp/runtime';

Component({
    properties: {
	    info: {
		    type: Object,
		    value: null
	    }
    },
    data: {
    	icon: __inline('/pages/index/components/recommend-b/img/night-answer.png'),
    },
    methods: {
	    async courseItemTapHandle(e){
		    global.loggerService.click(e);
		    const course = e.currentTarget.dataset.course;

		    if(course.businessType === 'topic' && course.channelId){
			    wx.showLoading({
				    mask: true
			    });
				const res = await request({
					url: api.authFreeChannel,
					data: {
						channelId: course.channelId
					},
					method: 'POST',
					cache: false,
					expires: 60 * 5 // 5分钟
				}).then(res => res.data);
			    wx.hideLoading();
				if(res.state.code === 0){
					wx.navigateTo({
						url: `/pages/thousand-live/thousand-live?topicId=${course.businessId}`
					});
				}else{
					wx.showToast({
						title: res.state.msg || '报名失败，请稍后再试',
						success: _=> {
							setTimeout(_=> wx.hideToast(), 2000);
						}
					})
				}
		    }else{
			    const url = course.businessType === 'channel'
				    ?
				    `/pages/channel-index/channel-index?channelId=${course.businessId}`
				    :
				    `/pages/thousand-live/thousand-live?topicId=${course.businessId}`;

			    wx.navigateTo({
				    url
			    });
		    }

	    }
    },
    ready() {
    }
});