/**
 * Created by dylanssg on 2018/1/29.
 */
import * as regeneratorRuntime from '../../../../comp/runtime';
import {
	BonusesService,
} from '../../../../service/bonuses.service';

Component({
	properties: {
		// 用户是否已发起过红包团，Y-已发起，N-未发起
		isCreateGroup: String,
		// 课程是否参与活动，Y-是，N-否
		isActCourse: String,
		// 当前课程活动配置id
		confId: String,
		// 是否已经获得拆红包的券
		hadRedpackCoupon: Boolean,
	},
	data: {
		redEnvelopeSrc: __uri('./img/red-envelope.png'),
		// channelId: '{{channelId}}',
		// displayType: false,
		// status: ''
		// bigEntryWrapAnimation: {},
		// smallEntryAnimation: {}
	},
	ready(){
		// this.bonusesService = new BonusesService();
		/* 初始化群分享红包状态信息*/
		// this.initGroupBonuses();
		// this.bigEntryWrapAnimation = wx.createAnimation({
		// 	duration: 1000,
		// });
		// this.smallEntryAnimation = wx.createAnimation({
		// 	duration: 1000,
		// });
		// this.smallEntryAnimation.opacity(0).step();
		// this.setData({
		// 	smallEntryAnimation: this.smallEntryAnimation.export()
		// });
	},
	methods: {
		// /*初始化群分享红包状态信息 */
		// async initGroupBonuses(){
		// 	const res = await this.bonusesService.fetchCourseConfig(this.data.channelId);
		// 	if( res.couponAmount && res.status !== 'accept'){
		// 		//accept:已领取，expiry:已过期 ，ing:进行中 ，unJoin:未参加
		// 		this.setData({
		// 			status: res.status
		// 		});
		// 		if(res.status === 'unJoin' || res.status === 'expiry'){
		// 			this.setData({
		// 				displayType: 'big'
		// 			});
		// 		}else if(res.status === 'ing'){
		// 			this.setData({
		// 				displayType: 'small'
		// 			});
		// 		}
		// 	}
		// },
		// async openRedEnvelope(){
		// 	const res = await this.bonusesService.fetchJoinShare(this.data.channelId);
		// 	if(res.state.code === 0){
		// 		wx.redirectTo({
		// 			url: `/pages/channel-bonuses/channel-bonuses?channelId=${this.data.channelId}`
		// 		})
		// 	}else{
		// 		wx.showToast({ title: res.state.msg || '打开红包失败，请稍后再试' })
		// 	}
		// },
		// // waitAnimating(animation){
		// // 	return new Promise((resolve, reject) => {
		// // 		try{
		// // 			setTimeout(_=> {
		// // 				resolve();
		// // 			},animation.option.transition.duration || 0);
		// // 		}catch(err){
		// // 			reject(err)
		// // 		}
		// // 	});
		// // },
		// // async shrinkRedEnvelope(){
		// // 	this.bigEntryWrapAnimation.opacity(0).step();
		// // 	this.smallEntryAnimation.opacity(1).step();
		// // 	this.setData({
		// // 		bigEntryWrapAnimation: this.bigEntryWrapAnimation.export(),
		// // 		smallEntryAnimation: this.smallEntryAnimation.export()
		// // 	});
		// // 	await this.waitAnimating(this.bigEntryWrapAnimation);
		// // 	this.setData({
		// // 		displayType: 'small'
		// // 	});
		// // },
		// onWrapperTap(){
		// 	// this.shrinkRedEnvelope();
		// 	this.setData({
		// 		displayType: 'small'
		// 	});
		// },

		onMainBodyTap() {
			wx.redirectTo({
				url: `/pages/channel-bonuses/channel-bonuses?confId=${this.data.confId}`
			})
			// if (this.data.status === 'ing'){
			// 	wx.redirectTo({
			// 		url: `/pages/channel-bonuses/channel-bonuses?channelId=${this.data.channelId}`
			// 	})
			// } else {
			// 	this.openRedEnvelope();
			// }
		},

		onSmallEntryTap() {
			wx.redirectTo({
				url: `/pages/channel-bonuses/channel-bonuses?confId=${this.data.confId}`
			})

			// if(this.data.status === 'ing'){
			// 	wx.redirectTo({
			// 		url: `/pages/channel-bonuses/channel-bonuses?channelId=${this.data.channelId}`
			// 	})
			// } else {
			// 	this.setData({
			// 		displayType: 'big'
			// 	});
			// }
		},
		onFormSubmit(e) {
			this.triggerEvent('updateFormId', { formId: e.detail.formId })
		},
	}
});