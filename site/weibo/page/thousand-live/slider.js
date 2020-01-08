var envi = require('envi');

var silder = {
	/**
	 * @function 构造方法
	 * 
	 * @param {{id:number, src:string}[]} dataArray - 初始化数据
	 * @param {string} selector - jquery选择器 
	 * @param {number} animTime - 动画时长
	 * @param {number} autoSlideDelay - 自动播放延迟
	 * @param {boolean} isLoop - 是否允许循环滚动
	 */
	init:function (dataArray, selector,imgSize, animTime, autoSlideDelay,isLoop) {
		/**
		 *@state hasInitial {boolean} - 是否已经初始化 
		 *@state animating {boolean} - 是否正在执行滑动动画
		 *
		 *@var isLoop {boolean} - 是否可以循环滚动 
		 *@var selector {string} - 父元素选择表达式
		 *@var diff {number} - 手势滑动距离
		 *@var curSlide {number} - 当前slide的序号
		 *@var numOfSlides {number} - 当前slide的数量
		 *@var startTime　{number} - 滑动事件开始时间
		 *@var endTime {number} - 滑动事件结束时间
		 *@var animTime {number} - 动画效果时长
		 *@var autoSlideDelay {number} - 自动播放延迟时间
		 *@var $sliderContainer {jqueryObject} - slider的父容器
		 *@var imgSize {string} - 图片尺寸 
		 *
		 *@array slideId {string[]} - 存储id的数组
		 *@array slideFileId {string[]} - 存储fileId的数组
		 *@array slideData {string[]} - 存储src的数组
		 */
		this.hasInitial = false;
		this.animating = false;

		this.isLoop = isLoop || false;
		this.selector = selector;
		this.diff = 0;
		this.curSlide = 0;
		this.numOfSlides = 0;
		this.startTime = 0;
		this.endTime = 0;
		this.animTime = animTime || 300;
		this.autoSlideDelay = autoSlideDelay || 3000;
		this.$sliderContainer = $(selector);
		this.imgSize = imgSize || "";

		this.slideId = [];
		this.slideFileId = [];
		this.slideData = [];

		// 将初始化数据放入数组		
		for (var i = 0; i < dataArray.length; i++) {
			this.slideId.push(dataArray[i].id);
			this.slideData.push(dataArray[i].url);
			this.slideFileId.push(dataArray[i].fileId);
		}


		this.initSlide();
		
	},
	
	returnSlideNum : function () {
		return this.numOfSlides;
	},
	changeSlideIndex : function () {
		var indexBrand = $('.ppt-window .btn-ppt-index');
		var index = this.$sliderContainer.find('.slide[data-id].active').index();
		var allNum=this.$sliderContainer.find('.slide[data-id]').length;
		if (index < 1) {
			index = 1;
		}
		indexBrand.html(String(index)+"<var>/"+allNum+"</var>");
	},
	changeSlides : function (instant) {
		if (!instant) {
			this.animating = true;
			this.$slider.addClass('animating');
			this.$slider.css('top');
			this.$slider.find('.slide').removeClass('active');
			this.$slider.find('.slide-' + this.curSlide).addClass('active');

			var self = this;
			setTimeout(function () {
				self.$slider.removeClass('animating');
				self.animating = false;
			}, this.animTime);
		};
		window.clearTimeout(this.autoSlideTimeout);
		this.$slider.css('transform', 'translate3d(' + -this.curSlide * 100 + '%,0,0)');
		this.$slideBGs.css('transform', 'translate3d(' + this.curSlide * 50 + '%,0,0)');
		var _self = this;
		setTimeout(function () {
			if (_self.curSlide === _self.numOfSlides + 1) {
				_self.$slideBGs.css('transition', 'none').css('-webkit-transition', 'none');
				_self.$slider.css('transform', 'translate3d(-100%,0,0)');
				_self.$slideBGs.css('transform', 'translate3d(50%,0,0)');
				_self.$slider.find('.slide').removeClass('active');
				_self.$slider.find('.slide-1').addClass('active');
				setTimeout(function () {
					_self.$slideBGs.css('transition', 'transform .5s').css('-webkit-transition', '-webkit-transform .5s');
				}, 100);
				_self.curSlide = 1;
			}
			if (_self.curSlide === 0) {
				_self.$slideBGs.css('transition', 'none').css('-webkit-transition', 'none');
				_self.$slider.css('transform', 'translate3d(' + -(_self.numOfSlides ) * 100 + '%,0,0)');
				_self.$slideBGs.css('transform', 'translate3d(' + (_self.numOfSlides ) * 50 + '%,0,0)');
				_self.$slider.find('.slide').removeClass('active');
				_self.$slider.find('.slide-' + _self.numOfSlides).addClass('active');
				setTimeout(function () {
					_self.$slideBGs.css('transition', 'transform .5s').css('-webkit-transition', '-webkit-transform .5s');
				}, 100);
				_self.curSlide = _self.numOfSlides;
			}
		}, 400);
		this.changeSlideIndex();
		this.diff = 0;
		if(this.autoSlideDelay > 0){
			this.autoSlide();
		};
		return;
	},
	navigateLeft : function () {
		if (this.animating) {
			return;
		}
		if (this.curSlide === 1 && this.isLoop === false) {
			this.curSlide = 1;
			this.changeSlides();
			return;
		}
		if (this.curSlide > 0) {
			this.curSlide--;
			this.changeSlides();
			return;
		}
		return;
	},
    navigateRight : function () {
		if (this.animating) {
			return;
		}
		if (this.curSlide === this.numOfSlides && this.isLoop === false) {
			this.curSlide = this.numOfSlides;
			this.changeSlides();
			return;
		}
		if (this.curSlide < this.numOfSlides + 1) {
			this.curSlide++;
			this.changeSlides();
			return;
		}
		return;
	},
    jumpToSlide : function (index) {
		if (index < 1 || index > this.numOfSlides) {
			return;
		}
		this.curSlide = index;
		this.changeSlides();
	},
    addSlide : function (id, src,fileId) {
		this.createSlideItem(id, src,fileId);
	},
    removeSlide : function (index) {

		if (index < 1 || index > this.numOfSlides) {
			return;
		}

				
		
		if (this.curSlide === this.numOfSlides) {
			this.curSlide--;
			this.changeSlides();
		}		

//		if (this.numOfSlides <= 2) {
//			$('.slide:first-child,.slide:last-child,.slide:nth-child(' + (index + 1) + ')').remove();
//			this.numOfSlides--;
//			this.refreshSlide();
//			return;
//		}

		var $slideToRemove = this.$slider.find('.slide:nth-child(' + (index + 1) + ')');		
		
		var dataId = $slideToRemove.data('id'); 		
		var dataFileId = $slideToRemove.data('fileid');
		var dataSrc = $slideToRemove.find('img').attr('src');

		var indexOfArray = this.slideId.indexOf(String(dataId));

		this.slideData.splice(indexOfArray, 1);
		this.slideId.splice(indexOfArray, 1);
		this.slideFileId.splice(indexOfArray, 1);	

		for (var i = index; i < this.numOfSlides; i++) {
			var src = this.$slider.find('.slide:nth-child(' + (i + 2) + ') img').attr('src');
			var id = this.$slider.find('.slide:nth-child(' + (i + 2) + ')').attr('data-id');
			var fileId = this.$slider.find('.slide:nth-child(' + (i + 2) + ')').attr('data-fileId');
			this.$slider.find('.slide:nth-child(' + (i + 1) + ') img').attr('src', src);
			this.$slider.find('.slide:nth-child(' + (i + 1) + ')').attr('data-id', id);
			this.$slider.find('.slide:nth-child(' + (i + 1) + ')').attr('data-fileId', fileId);
		
		}
		this.$slider.find('.slide:nth-child(' + (this.numOfSlides + 2) + ')').remove();
		this.numOfSlides--;

		this.refreshSlide();
	},
    initSlide : function () {
		if (this.slideData.length === 0) {
			$('.btn-cancel-ppt,.btn-ppt-index').hide();
			return;
		}
		this.hasInitial = true;
		var $sliderCon = this.$sliderContainer.find('.slider-container');
		if ($sliderCon.length>0) {
			$sliderCon.remove();
		}
		var appendString = "\n        <div class=\"slider-container\" id=\"ppt-slider\">\n            <div class=\"slider\">\n            </div>\n        </div>";
		if (!(envi.isAndroid() || envi.isIOS())) {
			appendString+='<span class=\"icon-back\" ></span><span class=\"icon-enter\" ></span>'
		}
		this.$sliderContainer.append(appendString);
		this.$slider = this.$sliderContainer.find('.slider');
		var slideBefore = "<div class=\"slide slide-0\" style=\"left:0;\">\n                    <a href=\"javascript:;\" class=\"slide-bg\" style=\"left:0;\">\n                        <img src=\"\">\n                    </a>\n                </div>";
		var slideAfter = "<div class=\"slide slide-" + (this.slideData.length + 1) + "\" style=\"left:" + (this.slideData.length + 1) * 100 + "%;\">\n                    <a href=\"javascript:;\" class=\"slide-bg\" style=\"left:" + -(this.slideData.length + 1) * 50 + "%;\">\n                        <img src=\"\">\n                    </a>\n                </div>";
		this.$slider.append(slideBefore);
		this.$slider.append(slideAfter);
		for (var i = 0; i < this.slideData.length; i++) {
			var id = this.slideId[i];
			var src = this.slideData[i];
			var fileId = this.slideFileId[i];
			this.createSlideItem(id, src,fileId);
		}
		
		this.bindSlideEvent();
		return;
	},
    createSlideItem : function (id, src,fileId) {
		var self = this;
		if (this.slideData.indexOf(src) < 0) {
			this.slideId.push(id);
			this.slideData.push(src);
			this.slideFileId.push(fileId);
		}

		if (this.hasInitial === false) {
			this.initSlide();
			return;
		}
		
		var slide = "<div class=\"slide slide-" + (this.numOfSlides + 1) + "\" data-id=\"" + id + "\" data-fileid=\"" + fileId + "\" style=\"left:" + (this.numOfSlides + 1) * 100 + "%;\">\n                    <a href=\"javascript:;\" class=\"slide-bg\" style=\"left:" + (-(this.numOfSlides + 1) * 50) + "%\">\n                        <img src=\"" + src + self.imgSize + "\">\n                    </a>\n                </div>";

		var $slideLast = this.$slider.find('.slide:last-child');
		$slideLast.removeClass('slide-' + (this.numOfSlides + 1)).addClass('slide-' + (this.numOfSlides + 2));
		$slideLast.before(slide);
		// this.$slider.find('.slide:last-child').removeClass('slide-' + (this.numOfSlides + 1)).addClass('slide-' + (this.numOfSlides + 2)).before(slide);
		this.numOfSlides++;

		this.refreshSlide();
		//this.curSlide = this.numOfSlides;
		//this.changeSlides();
		if(this.autoSlideDelay > 0){
			this.autoSlide();
		};
	},
    refreshSlide : function () {
		this.$slideBGs = this.$slider.find('.slide-bg');
		var firstObjSrc = this.slideData[0];
		var lastObjSrc = this.slideData[this.slideData.length - 1];
		this.$slider.find('.slide:last-child').removeAttr('data-id').removeAttr('data-fileid')
			.css('left', '' + (this.numOfSlides + 1) * 100 + '%')
			.find('.slide-bg').css('left', '' + -(this.numOfSlides + 1) * 50 + '%')
			.find('img').attr('src', firstObjSrc+ this.imgSize);
		this.$slider.find('.slide:first-child').find('img').attr('src', lastObjSrc+ this.imgSize);
		if (this.slideData.length === 0) {
			this.$sliderContainer.find('.slider-container').html('');
			this.hasInitial = false;
			$('.btn-cancel-ppt,.btn-ppt-index').hide();
		} else {
			$('.btn-cancel-ppt,.btn-ppt-index').show();
		}
	},
    autoSlide : function () {
		var self = this;
		this.autoSlideTimeout = setTimeout(function () {
			self.curSlide++;
			if (self.curSlide > (self.numOfSlides + 1)) {
				self.curSlide = 1;
			}
			self.changeSlides();
		}, self.autoSlideDelay);

	},
    bindSlideEvent : function () {
		var _self = this;
		var $prevBtn = this.$sliderContainer.find('.icon-back');
		var $nextBtn = this.$sliderContainer.find('.icon-enter');
		if ($prevBtn.length > 0) {
			$prevBtn.click(function () {
				_self.navigateLeft();
			});
			$nextBtn.click(function () {
				_self.navigateRight();
			});
		}

		$(document).on('touchstart', String(_self.selector)+' .slider', function (e) {
			_self.startTime = Date.now();
			if (_self.animating) {
				return;
			}
			window.clearTimeout(_self.autoSlideTimeout);
			var startX = e.pageX || e.originalEvent.touches[0].pageX, winW = $(window).width();
			_self.diff = 0;
			$(document).on('touchmove', String(_self.selector)+' .slider', function (e) {
				// e.preventDefault();
				var x = e.pageX || e.originalEvent.touches[0].pageX;
				_self.diff = (startX - x) / winW * 70;
				if ((!_self.curSlide && _self.diff < 0) || (_self.curSlide === _self.numOfSlides && _self.diff > 0)) {
					_self.diff /= 2;
				}
				_self.$slider.css('transform', 'translate3d(' + (-_self.curSlide * 100 - _self.diff) + '%,0,0)');
				_self.$slideBGs.css('transform', 'translate3d(' + (_self.curSlide * 50 + _self.diff / 2) + '%,0,0)');
			});
		});
		$(document).on('touchend', String(_self.selector)+' .slider', function (e) {
			_self.endTime = Date.now();
			if (_self.animating) {
				return;
			}
			$(document).off('touchmove', String(_self.selector)+' .slider');
			var touchDuration = _self.endTime - _self.startTime;
			if (touchDuration < 500) {
				if (_self.diff <= -4) {
					_self.navigateLeft();
					return;
				}
				if (_self.diff >= 4) {
					_self.navigateRight();
					return;
				}
			}
			if (touchDuration > 1200) {
				if (_self.diff > -50 && _self.diff < 50) {
					_self.changeSlides();
					return;
				}
			}
			if (!_self.diff) {
				_self.changeSlides(true);
				return;
			}
			if (_self.diff > -20 && _self.diff < 20) {
				_self.changeSlides();
				return;
			}
			if (_self.diff <= -20) {
				_self.navigateLeft();
				return;
			}
			if (_self.diff >= 20) {
				_self.navigateRight();
				return;
			}
		});
	}

}


module.exports = silder;