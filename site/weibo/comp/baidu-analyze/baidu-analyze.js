
// 百度统计
function addBaiduStatistic() {
	window._hmt = window._hmt || [];
	var hm = document.createElement('script');
	hm.src = '//hm.baidu.com/hm.js?9f8c5d323a26421cb966b5e405d629c3';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(hm, s);
};

module.exports.addBaiduStatistic = addBaiduStatistic;
