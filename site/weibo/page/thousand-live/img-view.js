var model = require('model');
var envi = require('envi');

var imgView ={
    viewImageByBrowser:function ($image) {
		var imgTemp,
			imgFristW = 500,
			imgViesW, imgViesH, imgScale,
			maLeft, maTop,
			moveLeft = 0, moveTop = 0,
			minImgW = 100, maxImgW = 1600;

        var $imgVW = $(".img-view-window img");

		function viewImageWheelInit() {
			$(document).on("mousewheel DOMMouseScroll", function (e) {
				if ($(".img-view-window img").length > 0) {
					var delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
						(e.detail && (e.detail > 0 ? -1 : 1));              // firefox
					if (delta > 0) {
						imgViesW = imgViesW + 100;
					} else if (delta < 0) {
						imgViesW = imgViesW - 100;
					}
					imgSize();
				}
			});
		}

		function viewImagePinchInit() {

			$(imgTemp).css('transition-duration', '0').css('webkit-transition-duration', '0');

			var scaling = false;
			var distance = 0;

			$(document).on('touchstart', '#imgViewWin', function (e) {

				if (e.originalEvent.touches.length === 1) {
					oneTouchStart(e);
				};

				if (e.originalEvent.touches.length === 2) {
					scaling = true;
					pinchStart(e);
				};
				return;
			});

			var touchStartTime;
			function oneTouchStart(e) {
				e.preventDefault();
				e.stopPropagation();
				touchStartTime = Date.now();
				var target = e.originalEvent.target;

				$(document).on('touchend', '#imgViewWin', function (e) {
					e.preventDefault();
					e.stopPropagation();
					$('#imgViewWin').off('touchmove');
					var touchEndTime = Date.now();
					var duration = touchEndTime - touchStartTime;
					if (duration < 200 && ($('.ivwBg')[0] === target || $('.img-view-window .btn-closed')[0] === target)) {
						$("#imgViewWin img").remove();
						$("#imgViewWin").hide();
					}
				})
			}

			function getDistance(e) {
				if( !e.originalEvent ){
					return;
				}
				var distX = e.originalEvent.touches[0].pageX - e.originalEvent.touches[1].pageX;
				var distY = e.originalEvent.touches[0].pageY - e.originalEvent.touches[1].pageY;
				var distance = Math.sqrt(distX * distX + distY * distY);

				return distance;
			}

			function pinchStart(e) {

				distance = getDistance(e);

				$(document).on('touchmove', '#imgViewWin', function (e) {
					if (scaling) {
						pinchMove(e);
					}
					return;
				});
			}

			function pinchMove(e) {

				var dist = getDistance(e);
				var moveDist = dist - distance;

				imgViesW += moveDist;
				imgSize();
				distance = dist;

				$(document).on('touchend', '#imgViewWin', function (e) {
					var e = e.originalEvent;
					scaling = false;
					pinchEnd(e);
					return;
				});
				return;
			}

			function pinchEnd(e) {
				distance = 0;
				$(document).off('touchmove', '#imgViewWin');
				return;
			}

		}

		function viewImageMoveInit() {
			$(document).on("mousedown", ".img-view-window img", function (eventd) {
				eventd.preventDefault();
				var msx = eventd.clientX;
				var msy = eventd.clientY;
				$(document).on("mousemove", function (eventm) {
					eventm.preventDefault();
					var mex = eventm.clientX;
					var mey = eventm.clientY;
                    var iLeft = $(".img-view-window img").css("left");
                    var iTop = $(".img-view-window img").css("top");
                    iLeft = Number(iLeft.replace(/(px|rem)/,""));
                    iTop = Number(iTop.replace(/(px|rem)/,""));
					$(".img-view-window img").css({
						"left": (iLeft + mex - msx),
						"top": (iTop + mey - msy)
					});
					msx = mex;
					msy = mey;
				});
			});

			$(document).mouseup(function () {
				$(this).unbind("mousemove");
			});
		}


		function viewImageCloseInit() {
			$(document).on("click", "#imgViewWin .ivwBg,.img-view-window .btn-closed", function () {
				$("#imgViewWin img").remove();
				$("#imgViewWin").hide();
			});
		}

		function viewImageInit() {
			if (envi.isAndroid() || envi.isIOS()) {
				viewImagePinchInit();
			};
			viewImageMoveInit();
			viewImageWheelInit();
			viewImageCloseInit();
		}

		function imgSize() {
			if (imgViesW < minImgW) {
				imgViesW = minImgW;
			} else if (imgViesW > maxImgW) {
				imgViesW = maxImgW;
			}
			imgViesH = parseInt(imgViesW / imgScale);

			imgTemp.width = imgViesW;
			imgTemp.height = imgViesH;

			$(imgTemp).css("margin-left", -(parseInt(imgViesW / 2)) + "px").css("margin-top", -(parseInt(imgViesH / 2)) + "px");

		}

		function viewBigImg(thisImg) {

			imgTemp = new Image();
			imgTemp.onload = function () {
				if (imgTemp.width > imgFristW) {
					imgViesW = imgFristW;
				} else {
					imgViesW = imgTemp.width;
				}
				if (imgTemp.width < 100) {
					minImgW = imgTemp.width;
				} else {
					minImgW = 100;
				}
				imgScale = imgTemp.width / imgTemp.height;
				imgSize();
				$("#imgViewWin").append(imgTemp).show();
			};

			var imageSrc = thisImg.attr("src");
			var srcNoCut= imageSrc.replace(/@.*/, "@1600w_1l_2o")			
			var srcGif= srcNoCut.replace(/.gif(@.*)/, '.gif');
			
			imgTemp.src = srcGif;

			viewImageInit();			
		};

		viewBigImg($image);

	}


}

module.exports = imgView;