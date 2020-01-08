import {getUrlParams} from '../../../../../../comp/url-utils'
import { timeAfterMixWeek, formatDate } from '../../../../../../comp/util';

Component({
    properties: {
	    infos: {
		    type: Object,
		    value: {}
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
	    moreBtnTapHandle (event) {
	    	const i = event.currentTarget.dataset.index;
	    	const infos = this.data.infos;
	    	if(!infos.courses[i].startTimeParsed){
			    const startTime = infos.courses[i].startTime;
			    let startTimeParsed = null;
			    if(infos.courses[i].businessType === 'channel'){
			    	if(startTime){
					    startTimeParsed = timeAfterMixWeek(startTime) + '开课第' + (infos.courses[i].topicNum + 1) + '节';
				    }else{
			    		if(infos.courses[i].topicNum < infos.courses[i].planCount){
						    startTimeParsed = '等待更新';
					    }else{
						    startTimeParsed = '更新完结';
					    }
				    }
			    }else{
				    startTimeParsed = formatDate(startTime, 'yyyy-MM-dd');
			    }
			    infos.courses[i].startTimeParsed = startTimeParsed;
		    }

		    infos.courses[i].showDetails = true;
	    	this.setData({infos});
        },
	    detailsPanelTapHandle(event){
		    const i = event.currentTarget.dataset.index;
		    const infos = this.data.infos;
		    infos.courses[i].showDetails = false;
		    this.setData({infos});
	    },
	    getMoreBtnTapHandle(e) {
		    global.loggerService.click(e);
		    this.triggerEvent('getMoreBtnTapHandle', e.currentTarget.dataset);
	    },
    },
    ready() {

    }
});