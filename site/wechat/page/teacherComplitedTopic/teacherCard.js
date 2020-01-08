require('zepto');
var dialog = require('dialog');

var teacherTopicComplite = require('teacherTopicComplite');
var envi = require('envi');
var wxutil = require('wxutil');
var Upload = require('upload');
var toast = require('toast');
var Loading = require('loading');

var type = '';
var shareData = null;
var compliteData =null;
var $fingerGuide = document.querySelector('#finger-guide');
var FINGER_GUIDE = 'FINGER_GUIDE';
var customBg = null;
var stackblur=require("stackblur");
var loadobj = new Loading.AjaxLoading();

/**
 * [activity-woman description]
 * @type {Object}
 *
 * @require '../../components_modules/reset.css'
 * @require '../../components_modules/fonts/style.css'
 * @require '../../comp/default-img/default-img.css'
 * @require '../../comp/common-css/ql-common.css'
 * @require './teacherCard.css'
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
    bg =  JSON.parse(initData.SHARECARD_BG);
    compliteData = JSON.parse(initData.SHARE_PUSH_DATA);

    try {
        if (!shareData || shareData == 'null') {
            return;
        }
		shareData = JSON.parse(shareData);     
        
    } catch (error) {
        console.error(error);
    }
    if(bg.template==="TEACHER_1"){
        bg.shareCard=imgUrlFormat(shareData.headImgUrl,640,1138);
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
    teacherTopicComplite(bgUrl, shareData,compliteData, updateShareCard, reset, style,stackblur);//模糊：stackblur
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

function imgUrlFormat (url, width,height) {
    var formatStrQ="@64h_64w_1e_1c_2o",formatStrW="/64";
    if(width){
        formatStrQ="@"+width+"h_"+width+"w_1e_1c_2o";
        formatStrW="/"+width;
    }
    if( /(img\.qlchat\.com)/.test(url)){
        url =url.replace(/@.*/,"")+formatStrQ;
    }else if(/(wx\.qlogo\.cn\/mmopen)/.test(url)){
        url =url.replace(/(\/(0|132|64|96)$)/,formatStrW);
    };

    return url;
};