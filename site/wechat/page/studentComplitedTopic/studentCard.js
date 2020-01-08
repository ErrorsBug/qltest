require('zepto');
var dialog = require('dialog');

var studentTopicComplite = require('studentTopicComplite');
var envi = require('envi');
var wxutil = require('wxutil');
var Upload = require('upload');
var toast = require('toast');
var Loading = require('loading');

var type = '';
var shareData = null;
var shareStudentInfo=null;
var $fingerGuide = document.querySelector('#finger-guide');
var FINGER_GUIDE = 'FINGER_GUIDE';
var customBg = null;
var loadobj = new Loading.AjaxLoading();



/**
 * [activity-woman description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './studentCard.css'
 */

// 背景图片缓存
window.bgMap = {};

// var customCard = {
// 	init: function(data, type){
// 		if(this._inited) return;
// 		this._inited = true;

// 		this.data = data;
// 		this.type = type;
// 	},
// };

/**
 * @require './style.css'
 */
module.exports = function (initData) {
    type = initData.TYPE;
    shareData = initData.SHARE_DATA;
    shareStudentInfo = JSON.parse(initData.SHARE_STUDENT);
    bg =  JSON.parse(initData.SHARECARD_BG);

    try {
        if (!shareData || shareData == 'null') {
            return;
        }
		shareData = JSON.parse(shareData);     

    } catch (error) {
        console.error(error);
    }
    
    shareData.shareUrl = initData.SHARE_COMPLITE_QR;
    loadobj.show();
    genCompliteShareCard(bg.shareCard, false, bg.template);
};



/**
 * 生成直播间邀请卡
 *
 */
function genCompliteShareCard (bgUrl, reset ,style) {
    studentTopicComplite(bgUrl, shareData , shareStudentInfo , updateShareCard, reset, style);
}

/**
 * 生成最后一个选项的卡
 * 
 */
function genCommenShareCard () {
    generateCommonShareCard(shareData.shareUrl, updateShareCard);
}

/**
 * 更新邀请卡
 * 
 * @param {any} imgData 
 */
function updateShareCard (imgData) {
    var image = document.getElementById('image')
    image.src = imgData;

    image.onload = function () {
        loadobj.hide();
        image.style.display = 'block';
    }

}

/**
 * 获取30天后日期
 *
 * @param {number} currentTime
 */
function dateParserAfterThirtyDays(currentTime){
	var date = new Date(currentTime + 30 * 24 * 60 * 60 * 1000);
	return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}
