/**
 * Created by dylanssg on 2018/1/29.
 */
Component({
	properties: {
		validDay: Number
	},
	methods: {
		onWrapperTap(){
			this.triggerEvent('onRuleIntroWrapperTap');
		},
		onContentTap(){

		}
	}
});