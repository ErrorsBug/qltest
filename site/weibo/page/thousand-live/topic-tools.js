require('zepto');
var model = require('model'),
    conf = require('../conf');

var topicTools = {

	moveToEnd:function(mainBox,isLoad){
		var windowHeight = mainBox[0].offsetHeight,
			pageHeight = mainBox.find(".scrollContentBox")[0].offsetHeight,
			isSrollY = mainBox.scrollTop();
		if(isLoad || (pageHeight - isSrollY - windowHeight)< 300 ){
			mainBox.scrollTop(isSrollY >10?pageHeight:pageHeight-windowHeight);
		}
	}




}
module.exports = topicTools;