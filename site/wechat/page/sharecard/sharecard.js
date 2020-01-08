require('zepto');
var dialog = require('dialog');

var topicShareCard = require('topicShareCard');
var channelShareCard = require('channelShareCard');
var campShareCard = require('campShareCard');
var liveShareCard = require('liveShareCard');
var generateCommonShareCard = require('./common-share-card');
var envi = require('envi');
var wxutil = require('wxutil');
var model = require('model');
var Upload = require('upload');
var toast = require('toast');
var urlUtils = require('urlutils');

var type = '';
var shareData = null;
var $fingerGuide = document.querySelector('#finger-guide');
var FINGER_GUIDE = 'FINGER_GUIDE';
var customBg = null;
var ClipboardJS = require('./clipboard.min.js');
var recommendExample = require('./recommend-example');
var topicTitle = '';
var guideIndex = 1;
// var shareKnowledge = false;


var recommendExample = require('./recommend-example');
var barrageData = require('../../comp/json/user.js');
// 背景图片缓存
window.bgMap = {};

var customCard = {
	init: function(data, type){
		if(this._inited) return;
		this._inited = true;
        this.data = data;
		this.type = type;
		this.touchTimer=null;
		this.isTouching=false;
		this.lshareKey = initData.LSHARE_KEY;
		this.qrshareUrl = this.data.shareUrl;
		// 课堂红包相关
		this.wcl = initData.wcl;
		this.redEnvelopeId = initData.redEnvelopeId;
		// 还未设置过自定义背景
		this.alreadySetUp = false;
		// 是否触发onChange方法（用于上传图片）
		this.triggerChange = false
		// 是否重置图片的宽高（由于不同手机分辨率导致）
		this.resetImgStyle = false
		if(initData.CUSTOM_BG && initData.CUSTOM_BG !== 'null'){
			this.currentBgUrl = initData.CUSTOM_BG;
			// 已经设置过自定义背景
			this.alreadySetUp = true;
		}
		this.shareCommentConfig = 'N';

		this.$thumbList = $('#thumb-list');

		this.$addCustomCardBtn = $('.add-custom');
		this.$image = $('.main-img');

		this.$customCardContainer = $('.custom-card-container');
		this.$customDefaultTip = this.$customCardContainer.find('.default-tip-wrap');
		this.$customTextTip = this.$customCardContainer.find('.tip');
		this.$customCard = this.$customCardContainer.find('.custom-card');
		this.$customCardEditBtn = $('.side-btn.edit');
		this.$customCardDeleteBtn = $('.side-btn.delete');

		this.$customOperationPanel = $('.custom-operation');
		this.$uploadBtn = this.$customOperationPanel.find('.upload-btn');
		this.$returnNormalCardBtn = this.$customOperationPanel.find('.return-btn');
		this.$confirmBtn = this.$customOperationPanel.find('.confirm-btn');

		this.$sideQrcodeBtn = $('.side-btn.qrcode');
		this.$tutorialBtn = $('.tutorial-btn');
		this.$shareTipBtn = $('.share-tip-btn');

		// 推荐语功能相关元素
		this.$setRecommend = $('.set-recommend');
		this.$getRecommend = $('.get-recommend');
		this.$shareText = $('.share-text');

		this.$setRecommendDialog = $('.set-recommend-dialog');
		this.$setRecommendDialogBg = $('.set-recommend-dialog .bg');
		this.$textarea = $('.set-recommend-dialog .textarea');
		this.$examplesBtn = $('.examples-btn');
		this.$examplesArea = $('.examples-area');
		this.$examplesContent = $('.examples-area .content');
		this.$setRecommendFill = $('.set-recommend-dialog .fill-in');
		this.$examplesReplace = $('.set-recommend-dialog .replace');
		this.$saveRecommend = $('.save-recommend');
		this.$copyRecommend = $('.copy-recommend');
		this.$wordNum = $('#word-num');
		this.$cReplaceOther = $('.replace-another');
		// 推荐语textArea的值
		this.recommendWord = '';
		// 后台存储的推荐语
		this.saveRecommendWord = $('#hidden-textarea').val();
		// C端推荐语
		this.CRecommendExample = recommendExample.CExample(topicTitle);
		// B端推荐语
		this.BRecommendExample = recommendExample.BExample(topicTitle);
		this.$CExamplesList = $('.c-examples-list');

		
		
		this.initSwiper();
		this.initClipboard();
		this.resizeAuto();
		this.initDialog();
		this.bindEvent();
		this.bindImgUpload();
		// 初始化弹幕
		console.log('[-==-=-=-=')
		this.initBarrage();
		// 诱导分享，先去掉
		// checkGuide(initData.POWER.allowMGLive);
		this.bindShareKey();
		this.initUserBindKaiFang();
		// 初始化C端推荐语
		this.initCRecommend();
		// 初始化评论状态
		this.getShareCommentStatus();

		this.initInviteCard();

	},
	initInviteCard: function() {
		var self = this;
		var isB = initData.POWER.allowMGLive;
		var courseIndexStatus = JSON.parse(initData.courseIndexStatus);
		var hasShortKnowledge = courseIndexStatus && courseIndexStatus.knowledgeStatus == 'Y';
		if (isB) {
			shareKnowledge = hasShortKnowledge;
		} else {
			shareKnowledge = hasShortKnowledge;
		}
	},
	resizeAuto: function(){
		if(!initData.POWER.allowMGLive){
			return;
		}
		var self = this;
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        // 安卓软键盘弹起的时候隐藏底部提示（安卓手机在软键盘弹起的时候会将页面文档高度挤压）
        if (isAndroid) {
            // 初始页面文档高度
			self.originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
            window.onresize = function(){
                // resize之后的页面文档高度
				var resizeHeight = document.documentElement.clientHeight|| document.body.clientHeight;
				if(resizeHeight < self.originalHeight){
					if(self.$examplesArea.hasClass('active')){
						self.resize = true;
					}
					self.$examplesArea.removeClass('active');
				}else {
					if(self.resize){
						self.$examplesArea.addClass('active');
						self.resize = false;
					}
				}
            }
        }
    },
	// 初始化粘贴板
	initClipboard: function(){
		var btn = document.querySelector('.copy-recommend');
		if(!btn){
			return;
		}
		var clipboard = new ClipboardJS(".copy-recommend");
		clipboard.on('success', function(e) {
			$.toast('复制成功', 1000, 'middle');
			e.clearSelection();
		});
	},
	// 初始化swiper
	initSwiper: function(){
		var self = this;
		self.$swiper = new Swiper(".swiper-container",{
			slidesPerView: "auto",
			centeredSlides: true,
			paginationClickable: true,
			preloadImages: true,
			pagination: '.swiper-pagination',
			paginationClickable: true,
			onSlideChangeStart: function(swiper){
				var currentThumbItem = self.$thumbList.find('.thumb-item').eq(swiper.activeIndex);
				currentThumbItem.get(0).scrollIntoView();
				if(currentThumbItem.data('draw')){
					currentThumbItem.addClass('active').siblings('.active').removeClass('active');
				} else {
					loading(false);
					currentThumbItem.trigger('click').data('draw', true);
				}
				if(self.currentBgUrl && swiper.activeIndex == 0) {
					self.showCustomCardOption();
				} else {
					self.hideCustomCardOption();
				}
			}
		})
		// 图片宽度大于容器宽度的72%
		if ($('.main-img').eq(0).width() > $('.share-card-container').width() * 0.72) {
			self.resetImgStyle = true;
			// 需要重置的样式
			var width = $('.share-card-container').width() * 0.72;
			var height = width / 0.563;
			// 图片宽度等于容器宽度的72%时，图片高度可能会超出容器高度，此时给个88%的固定值
			if(height > $('.share-card-container').height() * 0.88){
				height = $('.share-card-container').height() * 0.88;
				width = height * 0.563;
			}
			$('.main-img').each(function(){
				$(this).css({
					width: width,
					height: height
				})
			});
			self.resetWidth = width;
			self.resetHeight = height;
			self.$customCard.css({
				width: width,
				height: height
			});
			self.$customDefaultTip.css({
				width: width,
				height: height
			});
		}

	},
	initDialog: function(){
		var self = this;
		this.pureQrcodeDialog = $.dialog({
			title: '长按二维码保存',
			button: [],
			content:
			'<div class="qrcode-wrap">' +
			'<img src="' + this.qrshareUrl + '" alt="">' +
			'</div>' +
			'<div class="promotion-tip">适用于各渠道进行推广</div>' +
			'<div class="validity-tip">二维码有效期至：' + dateParserAfterThirtyDays(this.data.serverCurrentTime) + '（30天）</div>' +
			'<div class="remove-btn"></div>',
			cls: 'pure-qrcode-dialog'
		},false);
		setTimeout(function(){
			self.pureQrcodeDialog.element.find('.remove-btn').click(function(){
				self.pureQrcodeDialog.hide()
			});
		});
		this.tutorialDialog = $.dialog({
			title: '生成须知',
			button: ['确定'],
			content:
			'<img src="' + __uri('./img/dialog-icon.png') + '" alt="">' +
			'<div class="main-tip">' +
				'<div class="item">长按图片进行保存，发送给好友一起学习</div>' +
				'<div class="item">邀请卡二维码30天后将过期失效</div>' +
				'<div class="item">打卡训练营分成不包括契约金</div>' +
			'</div>',
			cls: 'tip-dialog'
		});
		this.shareTipDialog = $.dialog({
			title: '课代表规则',
			button: ['确定'],
			content:
			'<img src="' + __uri('./img/share-tip-img.png') + '" alt="">' +
			'<div class="main-tip">' +
				'<div class="item">每有一位朋友成功购买学习，你<br />将获得'+ this.data.shareEarningPercent +'%的奖励</div>' +
				'<div class="item">邀请卡二维码30天后将过期失效</div>' +
				'<div class="item">打卡训练营分成不包括契约金</div>' +
			'</div>',
			cls: 'tip-dialog'
		});
		this.deleteCustomConfirmDialog = $.dialog({
			title: '是否删除自定义邀请卡？',
			button: ['取消','确定'],
			cls: 'confirm-dialog',
			callback: function(index){
				if(index === 1){
					// 删除自定义邀请卡
					self.editExample({
						bgUrl: '',
						businessId: self.data.businessId,
						type: self.type,
						recommendWord: self.saveRecommendWord,
					}, 'deleteCustomBg');
				}
			}
		});
	},
	initCRecommend: function() {
		var self = this;
		console.log(self.$CExamplesList.length > 0);
		if(self.$CExamplesList.length > 0) {
			// 前端写死的推荐语案例
			var CRecommendExample = self.CRecommendExample;
			// 顺序拿写死的案例
			var htmlStr = '';
			for(var i = 0;i < CRecommendExample.length; i ++) {	
				htmlStr += `<li class="c-examples-item">${CRecommendExample[i]}</li>` ;
			}
			self.$CExamplesList.html(htmlStr) 
			$('.c-examples-item').click(function(e) {
				$('.c-examples-item').removeClass('active');
				$(this).addClass('active');

			})
			// 默认选中第一项
			$('.c-examples-item').eq(0).click();
		}
	},
	initBarrage: function() {
		var self = this;
		var btype = urlUtils.getUrlParams('type');
		var bid;
		if(btype === 'channel') {
			bid = urlUtils.getUrlParams('channelId');
		} else if (type === 'topic') {
			bid = urlUtils.getUrlParams('topicId');
		}
		else {
			return ;
		}
		$.ajax({
			url: '/api/wechat/transfer/h5/share/barrage',
			type: 'POST',
			dataType: 'json',
			data:{
				businessId: bid,
				businessType: btype
			},
			success:function(res) {
				if(res.state.code === 0) {
					var barrageList = res.data.barrageList;
					var liTemplate= "";
					if (barrageList.length < 3) {
						barrageList = barrageData;
					}
					var barrageCount = barrageList.length;
					for(var j = 0; j < barrageCount; j ++) {
						barrageList[j]['time'] = genShareTime();
					}
					var currentIndex = 0;
					liTemplate = ('<li class="barrage-item"><img class="avartar" src=' + barrageList[currentIndex].headImage + ' /><span class="name">') + barrageList[currentIndex].name + barrageList[currentIndex].time + ((barrageList[currentIndex].shareMoney !== undefined) ? ('获得了分享奖励金￥'+ barrageList[currentIndex].shareMoney) : '转发了课程') + '</span></li>';
					$('.barrage-list').addClass('prev').html(liTemplate);
					
					setInterval(function() {
						if(currentIndex >= barrageCount - 1) {
							currentIndex = 0;
						} else {
							currentIndex++;
						}
						$('.barrage-list').removeClass('prev').addClass('middle');
						setTimeout(function() {
							$('.barrage-list').removeClass('middle').addClass('next');
							setTimeout(function() {
								$('.barrage-list').html(('<li class="barrage-item"><img class="avartar" src=' + barrageList[currentIndex].headImage + ' /><span class="name">') + barrageList[currentIndex].name + barrageList[currentIndex].time + ((barrageList[currentIndex].shareMoney !== undefined) ? ('获得了分享奖励金￥'+ barrageList[currentIndex].shareMoney) : '转发了课程') + '</span></li>')
								$('.barrage-list').removeClass('next').addClass('prev');
							},1000)
						},2000);
						
					},4000);
				}
			},
			error: function(err) {
				console.log(err);
			}
		});
		return ;
	},
	bindEvent: function(){
		var self = this;
		this.$sideQrcodeBtn.click(function(){
			self.pureQrcodeDialog.show();
		});

		this.$thumbList.on('click','.thumb-item',function(){
			var $this = $(this);
			if($this.hasClass('active')){
				return;
			}
			$this.addClass('active').siblings('.active').removeClass('active');
			if($this.data('card')){
				// 有draw属性的表示已经画过，不用重新画
				if(!$this.data('draw')){
					genShareCard($this.data('card'), false, $this.data('style'));
				}
				// C端用户直接触发同等序号的pagination的点击事件
				if(!initData.POWER.allowMGLive) {
					window.sessionStorage.setItem('index', $this.index());
					$('.swiper-pagination').find('span').eq($this.index()).trigger('click');
					return;
				}

				// B端自定义添加的已经添加的情况(点击B端已经添加的自定义图片)
				if($this.hasClass('add-custom')){
					window.sessionStorage.setItem('index', 0);
					// 触发轮播图的pagination按钮点击
					$('.swiper-pagination').find('span').eq(0).trigger('click');
					self.showCustomCardOption();
				}else{
					window.sessionStorage.setItem('index', $this.index() - (self.currentBgUrl ? 0 : 1));
					// 触发轮播图的pagination按钮点击(如果有自定义的图片，则触发的是$this.index()的点击，没有自定义图片触发的是$this.index()-1的点击）
					$('.swiper-pagination').find('span').eq($this.index() - (self.currentBgUrl ? 0 : 1)).trigger('click');
					self.hideCustomCardOption();
				}
			}else{
				// 有draw属性的表示已经画过，不用重新画
				if(!$this.data('draw')){
					genCommenShareCard();
				}
				// C端用户直接触发同等序号的pagination的点击事件
				if(!initData.POWER.allowMGLive) {
					window.sessionStorage.setItem('index', $this.index());
					$('.swiper-pagination').find('span').eq($this.index()).trigger('click');
					return;
				}
				// 触发轮播图的pagination按钮点击(如果有自定义的图片，则触发的是$this.index()的点击，没有自定义图片触发的是$this.index()-1的点击）
				window.sessionStorage.setItem('index', $this.index() - (self.currentBgUrl ? 0 : 1));
				$('.swiper-pagination').find('span').eq($this.index() - (self.currentBgUrl ? 0 : 1)).trigger('click');
				self.hideCustomCardOption();
			}
		}).find('.thumb-item').eq(0).click().data('draw', true);

		this.$addCustomCardBtn.click(function(){
			if(!self.$addCustomCardBtn.hasClass('thumb-item')){
				self.activateCustomMode();
			}
			$('.bottom').addClass('custom-card-show');
		});
		this.$returnNormalCardBtn.click(function(){
			self.inactivateCustomMode();
			$('.bottom').removeClass('custom-card-show');
		});

		this.$confirmBtn.click(function(){
			// 如果是已经设置背景图，且重新上传了图片，此时应先删掉swiper中的第一个slide
			if(self.alreadySetUp && self.triggerChange){
				self.removeSwiperSlide()
			}
			self.inactivateCustomMode();
			if(self.customBgEdited){
				self.addSwiperSlide(self.$customCard.attr('src'));
				self.$addCustomCardBtn.data('card',self.currentBgUrl)
					.data('style','Z')
					.addClass('thumb-item')
					.removeClass('active')
					// .css('background-image','url(' + self.currentBgUrl+'?x-oss-process=image/resize,m_fill,limit_0,h_126,w_126' + ')')
					.trigger('click');
				// 新增自定义邀请卡
				self.editExample({
					bgUrl: self.currentBgUrl,
					businessId: self.data.businessId,
					type: self.type,
					recommendWord: self.saveRecommendWord,
				}, 'addCustomBg');
				// 已经设置过背景图
				self.alreadySetUp = true;
				// 提交之后重置triggerChange为false
				self.triggerChange = false;
			}
		});

		this.$tutorialBtn.click(function(){
			self.tutorialDialog.show();
		});
		this.$shareTipBtn.click(function(){
			self.shareTipDialog.show();
		});

		this.$customCardEditBtn.click(function(){
			self.activateCustomMode();
			self.updateCustomCard(self.currentBgUrl);
		});
		this.$customCardDeleteBtn.click(function(){
			self.deleteCustomConfirmDialog.show();
		});
        if (envi.isAndroid() || envi.isIOS()) {
			var self = this
			this.$image.each(function(){
				$(this).get(0).addEventListener('touchstart', self.startFn.bind(self), false);
			})
            document.addEventListener('touchend', this.endFn.bind(this), false);
			document.addEventListener('touchcancel', this.endFn.bind(this), false);
        } else {
			this.$image.each(function(){
				$(this).get(0).addEventListener('mousedown', self.mouseRightFn.bind(self), false);
			})
		}
		// B端设置推荐语按钮点击
		this.$setRecommend.click(function(){
			self.fetchExample(function(recommendWord){
				if(recommendWord){
					self.recommendWord = recommendWord;
					self.fillTextArea(recommendWord)
				}
				self.$setRecommendDialog.show();
			})
		});
		// 推荐语弹窗背景点击
		this.$setRecommendDialogBg.click(function(){
			self.$setRecommendDialog.hide();
		});
		$('.bottom-close').click(function() {
			self.$setRecommendDialog.hide();
		});
		// B端推荐语示例按钮点击
		this.$examplesBtn.click(function(){
			if(!self.$examplesArea.hasClass('active')){
				var $examplesAreaContent = self.$examplesArea.find('.examples-area-content');
				// 如果本身有案例，就不用再次填写
				if(!$examplesAreaContent.text()){
					var recommendWord = self.BRecommendExample[0];
					// 前端写死的推荐语案例序号
					self.recommendWordIndex = 1;
					self.recommendWord = recommendWord;
					self.$examplesArea.addClass('active').find('.examples-area-content').text(recommendWord);
				}else {
					self.$examplesArea.addClass('active').find('.examples-area-content')
				}
			}else {
				self.$examplesArea.removeClass('active');
			}
		});
		// B端推荐语保存按钮点击
		this.$saveRecommend.click(function(){
			if(self.$textarea.val().trim().length > 0){
				self.editExample({
					bgUrl: self.currentBgUrl,
					businessId: self.data.businessId,
					type: self.type,
					recommendWord: self.$textarea.val().trim()
				},'addRecommend')
			}else {
				$.toast('请输入推荐语', 1000, 'middle');
			}
		});
		// textarea绑定change事件
		this.$textarea.on('input propertychange',function(){
			self.fillTextArea($(this).val());
		});
		// B端填充到输入框按钮点击
		this.$setRecommendFill.click(function(){
			self.fillTextArea(self.recommendWord);
		});
		// B端换一个推荐语
		this.$examplesReplace.click(function(){
			// 前端写死的推荐语案例
			var BRecommendExample = self.BRecommendExample;
			// 顺序拿写死的案例
			if(self.recommendWordIndex <= BRecommendExample.length - 1){
				self.recommendWord = BRecommendExample[self.recommendWordIndex];
				++ self.recommendWordIndex;
			} else {
				self.recommendWord = BRecommendExample[0];
				self.recommendWordIndex = 1;
			}
			self.$examplesArea.find('.examples-area-content').text(self.recommendWord);
		});
		// C端获取推荐语
		this.$getRecommend.click(function(){
			self.fetchExample(function(recommendWord){
				if(!recommendWord){
					recommendWord = self.CRecommendExample[0];
					self.recommendWordIndex = 1;
				}else {
					// 如果接口请求回来有推荐语，则将推荐语存入第一条
					self.CRecommendExample.unshift(recommendWord)
					console.log(self.CRecommendExample)
				}
				self.recommendWordIndex = 1;
				self.recommendWord = recommendWord;
				$('#c-examples-area-content').text(recommendWord);
				self.$setRecommendDialog.show();
			})
		});
		this.$shareText.click(function(){
			self.fetchExample(function(recommendWord){
				if(!recommendWord){
					recommendWord = self.CRecommendExample[0];
					self.recommendWordIndex = 1;
				}else {
					// 如果接口请求回来有推荐语，则将推荐语存入第一条
					self.CRecommendExample.unshift(recommendWord)
					console.log(self.CRecommendExample)
				}
				self.recommendWordIndex = 1;
				self.recommendWord = recommendWord;
				$('#c-examples-area-content').text(recommendWord);
				self.$setRecommendDialog.show();
			})
		});
		// C端换一换推荐语
		this.$cReplaceOther.click(function(){
			var recommendWord = '';
			// 前端写死的推荐语案例
			var CRecommendExample = self.CRecommendExample;
			console.log('change', CRecommendExample);
			// 顺序拿写死的案例
			if(self.recommendWordIndex <= CRecommendExample.length - 1){
				recommendWord = CRecommendExample[self.recommendWordIndex];
				++ self.recommendWordIndex;
			} else {
				recommendWord = CRecommendExample[0];
				self.recommendWordIndex = 1;
			}
			self.recommendWord = recommendWord;
			$('#c-examples-area-content').text(recommendWord);
		});
	},

	// 获取推荐语示例
	fetchExample: function(cb){
		var self = this;
		model.fetch({
			type: "POST",
			url: '/api/wechat/share/getCustomShareInfo',
			data: {
				businessId: shareData.businessId,
				type: self.type
			},
			success: function(result){
				if(result.state.code === 0){
					cb(result.data.recommendWord);
				}
			}.bind(this),
			error: function(err){
				console.log(err);
			}
		});
	},

	// 新增/修改课程自定义邀请卡/课程语录信息
	editExample: function(data, type){
		var self = this;
		loading(true);
		model.fetch({
			type: "POST",
			url: '/api/wechat/share/addOrUpdateCustomShareInfo',
			data: data,
			success: function(result){
				// 新增自定义邀请卡回调函数
				if(type === 'addCustomBg'){
					if(result.state.code === 0){
						self.customBgEdited = false;
						$.toast('设置成功', 1000, 'middle');
					}else{
						$.toast(result.state.msg, 1000, 'middle');
					}
				// 删除自定义邀请卡回调函数
				} else if(type === 'deleteCustomBg'){
					if(result.state.code === 0){
						$.toast('删除成功',1000,'middle');
						self.removeSwiperSlide();
						self.$addCustomCardBtn.data('card','').removeClass('thumb-item').removeAttr('style');
						self.currentBgUrl = '';
						self.$customCard.hide();
						self.$customDefaultTip.show();
						self.$thumbList.find('.thumb-item').eq(0).click();
	
						self.$uploadBtn.removeClass('ed');
						self.$confirmBtn.removeClass('show');
						self.$customOperationPanel.find('.tip').show();
						self.$customTextTip.text('请上传您设计好的推广海报图片');
						// 将设置背景图状态改为false
						self.alreadySetUp = false;
					}else{
						$.toast(result.state.msg, 1000, 'middle');
					}
					loading(false);
				// 新增推荐语回调函数
				} else if(type === 'addRecommend'){
					if(result.state.code === 0){
						self.saveRecommendWord = self.$textarea.val().trim();
						$.toast('保存成功', 1000, 'middle');
						setTimeout(function(){
							self.$setRecommendDialog.hide();
						},1000);
					}
				}
				loading(false);
			},
			error: function(err){
				loading(false);
				console.log(err);
			}
		});
	},

	// 推荐语填充
	fillTextArea: function(value){
		var self = this;
		// 当推荐语长度大于140时截取140的长度
		if(value.length > 140) {
			value = value.slice(0, 140);
		}
		self.$textarea.val(value);
		self.$wordNum.html(value.length + '/<span>140</span>')
	},

	// swiper增加一个slide
	addSwiperSlide: function(customBg){
		var self = this;
		var height = self.resetImgStyle ? self.resetHeight + 'px' : '100%';
		var width = self.resetImgStyle ? self.resetWidth : $('.main-img').eq(0).height() * 0.563;
		self.$swiper.prependSlide('<div class="swiper-slide"><img id="image-Z" style="height: '+ height +';width: ' + width + 'px" class="main-img" src="' + customBg + '"></div>');
		self.$swiper.updateSlidesSize();
	},
	// swiper移除一个slide
	removeSwiperSlide: function(){
		var self = this;
		self.$swiper.removeSlide(0);
		self.$swiper.updateSlidesSize();
	},
	bindImgUpload: function(){
		var self = this;
		// if(envi.isWeixin()){
		//
		// }else{
			new Upload(self.$uploadBtn, {
				multiple: 'N',
				quota: 1,
				maxLength: 1,
				onComplete: function (imgUrl) {
					self.updateCustomCard(imgUrl);
				},
				onChange: function () {
					self.triggerChange = true;
					loading(true);
				},
				onError: function () {
					loading(false);
				},
				onAllComplete: function () {
					self.customBgEdited = true;
					loading(false);
				},
			});
		// }
	},
    initUserBindKaiFang: function() {
		var kfAppId = urlUtils.getUrlParams('kfAppId');
		var kfOpenId = urlUtils.getUrlParams('kfOpenId');

        if (kfAppId && kfOpenId) {
			$.ajax({
				url: '/api/wechat/live/userBindKaiFang',
				type: 'POST',
				dataType: 'json',
				data:{
					kfAppId: kfAppId,
					kfOpenId: kfOpenId
				}
			});
		}
    },
	activateCustomMode: function(){
		var self = this;
		self.$customCardContainer.addClass('show');
		self.$customOperationPanel.addClass('show');
		setTimeout(function(){
			if(!self.resetImgStyle){
				// self.$customCardContainer.find('.default-tip-wrap').width(self.$customCardContainer.find('.default-tip-wrap').height() * 0.563);
			}
			self.$customCardContainer.addClass('appear');
			self.$customOperationPanel.addClass('appear');
		},10);
	},
	inactivateCustomMode: function(){
		var self = this;
		self.$customCardContainer.removeClass('appear');
		self.$customOperationPanel.removeClass('appear');
		setTimeout(function(){
			self.$customCardContainer.removeClass('show');
			self.$customOperationPanel.removeClass('show');
		},300);
	},
	updateCustomCard: function(bgUrl){
		var self = this;
		self.currentBgUrl = bgUrl;
		var callback = function(card){
			self.$uploadBtn.addClass('ed');
			self.$confirmBtn.addClass('show');
			self.$customOperationPanel.find('.tip').hide();
			self.$customCard.attr('src',card).show();
			self.$customDefaultTip.hide();
			self.$customTextTip.text('请留意头像位置与二维码位置');
		}

		if (type === 'topic') {
			topicShareCard(bgUrl, self.data, callback, true, 'Z');
		} else if (type === 'channel') {
			channelShareCard(bgUrl, self.data, callback, true, 'Z');
		}else if(type === 'live'){
			liveShareCard(bgUrl, self.data, callback, true, 'Z');
		}else if(type == 'camp') {
            campShareCard(bgUrl, self.data, callback, true, 'Z');
        }
	},
	showCustomCardOption: function(){
		this.$customCardEditBtn.show();
		this.$customCardDeleteBtn.show();
	},
	hideCustomCardOption: function(){
		this.$customCardEditBtn.hide();
		this.$customCardDeleteBtn.hide();
	},
	bindShareKey: function(){
		if(this.lshareKey){
			$.post('/api/wechat/topic/bind-share-key',{
				liveId: initData.liveId,
				shareKey: this.lshareKey
			});
		}
	},
	startFn:function(e){
		var self = this;
		this.isTouching=true;
		var touchPicKey=$(".thumb-item").find(".active img").attr("src");
			touchPicKey=touchPicKey.split("/");
			touchPicKey=touchPicKey[touchPicKey.length-1];
		this.touchTimer = setTimeout(function(){
			var category = '';
			// 长按课程红包邀请卡
			// if(self.wcl === 'redEnvelope'){
			// 	category = 'hb-double_invite'
			// 	var params = {
			// 		redEnvelopeId: self.redEnvelopeId
			// 	};
			// 	model.fetch({
			// 		type: "POST",
			// 		url: '/api/wechat/topic/redEnvelopeShare',
			// 		data: params,
			// 		success: function (result) {
			// 			console.log(result)
			// 		}.bind(this),
			// 		error: function(err){
			// 			console.log(err);
			// 		}
			// 	});
			// }
			if(self.isTouching){
				self.calllog(self.type,touchPicKey,self.data.businessId,category);
			}
		},700);
		// this.touchTimer=setTimeout(()=>{
		// 	if(this.isTouching){
		// 		this.calllog(this.type,touchPicKey,this.data.businessId);
		// 	}
		// },700);
	},
	endFn:function(){
		if(this.isTouching){
			clearTimeout(this.touchTimer);
			this.isTouching= false;
		}
	},
	mouseRightFn:function (e){
		if(e.button===2){
			var touchPicKey=$(".thumb-item").find(".active img").attr("src");
			touchPicKey=touchPicKey.split("/");
			touchPicKey=touchPicKey[touchPicKey.length-1].split(".")[0];
			this.calllog(this.type,touchPicKey,this.data.businessId);
		}
	},
	/**
     * 记录每次长按邀请卡的操作，打印记录邀请卡名字及统计长按率
     *
     * 记录每次长按话题/系列课/直播间邀请卡的操作将会记录一条日志，
     * 表示当次搜索是有效搜索，且一次搜索结果只记录一次。一个临时处理方法便
     * 是每次搜索出结果，打印success日志时将validState设置为true，打过一次
     * valid日志后便设置为false，防止重复打日志
     *
     */

    /**
     * 打日志
     *
     * @param {string} type 邀请卡类型，有效值为 topic|channel|live|distr
     * @param {string} picKey  长按图片的标志
     */
    calllog: function(type, picKey,id,category) {
		console.log(id);
		console.log(picKey);
		console.log(type);
        window._qla && window._qla('event',{
            category: category || 'shareCardTouch',
            action: "success",
            business_type: type,
            business_name: picKey,
			business_id:id,
		})
		
		$.ajax({
			url: '/api/wechat/point/doAssignment',
			type: 'POST',
			dataType: 'json',
			data:{
                assignmentPoint: 'grow_share_course',
			}
		});
		// 分享评论开关关闭状态下不生成分享文案
		var self = this;
		this.getShareCommentStatus(function () {
			if(type === 'topic' && self.shareCommentConfig === 'Y') {
				var liveId = self.data.liveId;
				var topicId = urlUtils.getUrlParams('topicId');
				var userId = self.data.userId;
				$.ajax({
					url: '/api/wechat/topic/addShareComment',
					type: 'POST',
					dataType: 'json',
					data:{
						liveId: liveId,
						topicId: topicId,
						userId: userId
					}
				});
			}
		});
	},
	// 初始化分享文案开关
	getShareCommentStatus: function(callback) {
		if(type === 'topic') {
			var topicId = urlUtils.getUrlParams('topicId');
			$.ajax({
				url: '/api/wechat/transfer/h5/courseExtend/getShareCommentConfig',
				type: 'POST',
				dataType: 'json',
				data:{
					topicId: topicId
				},
				success: (function(res) {
					if(res.state.code === 0) {
						this.shareCommentConfig = res.data.flag;
						callback && callback();
					}
				}).bind(this),
				error: function(err) {
					console.log(err);
				}
			})
		}
	}
};

/**
 * @require './style.scss'
 */
module.exports = function (initData) {
    type = initData.TYPE;
	customBg = initData.CUSTOM_BG;
	userId = initData.userId;
	shareData = initData.SHARE_DATA;
	try {
		var sdObj = JSON.parse(shareData);
		sdObj.userId = userId;
		shareData = JSON.stringify(sdObj);
	} catch (error) {
	}

    try {
        if (!shareData || shareData == 'null') {
            return;
        }
		shareData = JSON.parse(shareData);
		// 初始化获取标题，用于自定义推荐语
		topicTitle = shareData.topicName || shareData.channelName || shareData.campName;

		var shareInfo = '';
		if (shareData.shareType == 'live') {
			shareInfo = 'lshareKey=' + shareData.sharekey;
		} else {
			shareInfo = 'shareKey=' + shareData.sharekey;
		}

        var shareConfig = {};
        if (type === 'camp') {

            shareConfig.imgUrl = shareData.campHeadImage;
        } else {
            shareConfig.imgUrl = shareData.headImgUrl;
        }
		if (type === 'topic') {

			shareConfig = initTopicShare(shareData);

        } else if (type === 'channel') {
            shareConfig.title = (shareData.sharekey ? '我推荐 - ' : '') + shareData.channelName;
            shareConfig.desc = shareData.description;
            shareConfig.timelineDesc = (shareData.sharekey ? '我推荐 - ' : '') + shareData.channelName;
            shareConfig.shareUrl = window.location.origin +'/live/channel/channelPage/' + shareData.businessId + '.htm?' + shareInfo;
        }else if(type === 'live'){
            shareConfig.title = (shareData.sharekey ? '我推荐 - ' : '') + shareData.liveName;
            shareConfig.desc = shareData.introduce;
            shareConfig.timelineDesc = (shareData.sharekey ? '我推荐 - ' : '') + shareData.liveName;
            shareConfig.shareUrl = window.location.origin +'/live/' + shareData.businessId + '.htm?' + shareInfo;
		}else if (type === 'camp') {
            shareConfig.title = (shareData.sharekey ? '我推荐 - ' : '') + shareData.campName;
            shareConfig.desc = shareData.description;
            shareConfig.timelineDesc = (shareData.sharekey ? '我推荐 - ' : '') + shareData.campName;
            shareConfig.shareUrl = window.location.origin +'/wechat/page/camp-detail?campId=' + shareData.businessId + '&'+ shareInfo;
		}

		var psKey = urlUtils.getUrlParams('psKey');
		if (isFromLiveCenter() && psKey && userId) {
			shareConfig.shareUrl = shareConfig.shareUrl + "&wcl=pshare&psKey=" + userId;
		}

		if(shareData.isDirectVisitCard === 'Y'){
			var shareDataUri = shareData.uri;
			var uriArr = shareDataUri.split('?');
			if(uriArr[1]){
				shareConfig.shareUrl += '&' + uriArr[1];
			}
			shareDataUri= uriArr[0];
			shareData.shareUrl = 'http://qr.topscan.com/api.php?text=' + encodeURIComponent(location.protocol + '//' + initData.ACTIVITY_DOMAIN + shareDataUri + '?target=' + encodeURIComponent(shareConfig.shareUrl));
		}

		shareData.serverCurrentTime=new Date().getTime();
        wxutil.share({
            title: shareConfig.title,
            desc: shareConfig.desc,
            timelineDesc: shareConfig.timelineDesc, // 分享到朋友圈单独定制
            imgUrl:shareConfig.imgUrl,
            shareUrl:shareConfig.shareUrl,
	        successFn: function(){
		        window._qla && window._qla('event',{
			        category: 'shareCardShareSuccess',
			        action: "success",
			        business_type: type,
			        business_id: shareData.businessId,
		        })
	        }
		});
		
    } catch (error) {
        console.error(error);
	}
	// 添加第三方公众号配置
	var thirdConf;
	try {
		
		var pj = JSON.parse(initData.thirdAppConf);
		thirdConf = pj;
	} catch (error) {
	}

	shareData.thirdAppConf = thirdConf;
	
	shareData.userId = userId;
	customCard.init(shareData, type || shareType);
};

/**
 * 格格式输出日期串
 * @param date      {Number/Date}   要格式化的日期
 * @param formatStr {String}        格式串(yMdHmsqS)
 * @returns {*|string}
 */
function formatDate(date, formatStr) {
	if (!date) {
		return '';
	}

	var format = formatStr || 'yyyy-MM-dd';

	if ('number' === typeof date || 'string' === typeof date) {
		date = new Date(+date);
	}

	var map = {
		"M": date.getMonth() + 1, //月份
		"d": date.getDate(), //日
		"h": date.getHours(), //小时
		"m": date.getMinutes(), //分
		"s": date.getSeconds(), //秒
		"q": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
		var v = map[t];
		if (v !== undefined) {
			if (all.length > 1) {
				v = '0' + v;
				v = v.substr(v.length - 2);
			}
			return v;
		} else if (t === 'y') {
			return (date.getFullYear() + '').substr(4 - all.length);
		}
		return all;
	});
	return format;

};

/**
 * 话题分享
 *
 * @param {any} shareData
 * @returns
 */
function initTopicShare(shareData){
	var wxqltitle = shareData.topicName;
	var descript = shareData.liveName;
	var wxqlimgurl = shareData.backgroundUrl||"https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png";
	var friendstr = wxqltitle;
	var shareUrl = window.location.origin + '/topic/' + shareData.businessId + '.htm';
	var isNl = "\n";
	var currentTimeMillis = Date.now();

	if(shareData.status == "ended"){
		descript+=isNl+"点击查看回放";
	}else if( Number(shareData.startTime) > currentTimeMillis){

		descript+=isNl+"时间:"+formatDate(shareData.startTime,'MM月dd日hh:mm')+isNl+"点击设置开播提醒";
	}else{
		descript+="正在直播"+isNl+"点击链接即可参加";
	};

	if(/^(audioGraphic|videoGraphic)$/.test(shareData.style)){
		descript= '点击链接即可参加';
		friendstr = shareData.topicName;
		wxqlimgurl = shareData.style == 'audioGraphic'?'https://img.qlchat.com/qlLive/liveCommon/audio-graphic-topic.jpg':'https://img.qlchat.com/qlLive/liveCommon/video-graphic-topic.jpg';
	}

	if (shareData.sharekey) {
		if (shareData.shareType == 'live') {
			shareInfo = 'lshareKey=' + shareData.sharekey;
		} else {
			shareInfo = 'shareKey=' + shareData.sharekey;
		}
		wxqltitle = "我推荐-" + wxqltitle;
		friendstr = "我推荐-" + friendstr;
		shareUrl = shareUrl + '?' + shareInfo;
		if (shareData.missionId) {
			shareUrl += "&missionId=" + shareData.missionId
		}
	}

	var shareMsg = {
		title: wxqltitle,
		timelineTitle: friendstr,
		desc: descript,
		timelineDesc: friendstr, // 分享到朋友圈单独定制
		imgUrl: wxqlimgurl,
		shareUrl: shareUrl,
	};
	return shareMsg;

}

/* 检查是否展示过引导图*/
function checkGuide(isB) {
	try {
		var ls = window.localStorage.getItem(FINGER_GUIDE)
		if (!ls) {
			bindFingerGuideClick(isB)
			$fingerGuide.classList.remove('hide')
		}
	} catch (error) {
		console.log(error)
	}
}

/* 给引导图绑定点击事件*/
function bindFingerGuideClick(isB) {
	$fingerGuide.addEventListener('click', function (e) {
		// B端引导
		if(isB){
			$fingerGuide.classList.add('hide');
		// C端引导
		}else {
			if(guideIndex > 2){
				$fingerGuide.classList.add('hide');
			}else {
				$($fingerGuide).find('.part').each(function(index, item){
					if(index == guideIndex){
						$(item).removeClass('hide');
					}else {
						$(item).addClass('hide');
					}
				})
				++ guideIndex;
			}
		}
	})
	try {
		window.localStorage.setItem(FINGER_GUIDE, 'Y')
	} catch (error) {
		console.error(error)
	}
}

function loading (isShow) {
	var l = document.getElementById('loading');

	if (isShow) {
		l.classList.remove('hidden');
	} else {
		l.classList.add('hidden');
	}
}

/**
 * 根据不同的query参数生成不同的邀请卡
 *
 * @param {any} index
 * @param {boolean} reset 是否重置卡的内容
 * @param {any} style    排版编号（A\B\C），Z代表自定义
 *
 */
function genShareCard (bgUrl, reset, style) {
	console.log(style);
	loading(true);
	if (type == 'topic') {
		genTopicShareCard(bgUrl, reset, style);
	} else if (type == 'channel') {
		genChannelShareCard(bgUrl, reset, style);
	}else if(type == 'live'){
		genLiveShareCard(bgUrl, reset, style);
    }else if(type == 'camp') {
        genCampShareCard(bgUrl, reset, style);
    }
    
}

/**
 * 生成话题邀请卡
 *
 */
function genTopicShareCard (bgUrl, reset, style) {
	topicShareCard(bgUrl, shareData, updateShareCard, reset, style);
}

/**
 * 生成系列课邀请卡
 *
 */
function genChannelShareCard (bgUrl, reset ,style) {
	channelShareCard(bgUrl, shareData, updateShareCard, reset, style);
}

/**
 * 生成训练营邀请卡
 *
 */
function genCampShareCard (bgUrl, reset ,style) {
	campShareCard(bgUrl, shareData, updateShareCard, reset, style);
}


/**
 * 生成直播间邀请卡
 *
 */
function genLiveShareCard (bgUrl, reset ,style) {
	liveShareCard(bgUrl, shareData, updateShareCard, reset, style);
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
	var image = document.querySelectorAll('#swiper .swiper-slide')[Number(window.sessionStorage.getItem('index'))].querySelector('img');
	image.src = imgData;

	image.onload = function () {
		image.style.display = 'block';
		loading(false);
		// 防止初始加载swiper时出现晃动
		document.querySelector('#swiper').style.visibility = 'visible';
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


function isFromLiveCenter() {
    if(typeof sessionStorage != 'undefined') {
        return /recommend|subscribe-period-time|timeline|mine|charge-recommend|rank-topic|livecenter|search/.test(window.sessionStorage.getItem('trace_page'))
    }else{
        return false;
    }
} 

function genShareTime() {
	var map = [
		'2秒前',
		'3秒前',
		'1秒前',
		'10秒前',
		'1分钟前',
		'3分钟前'
	];
	return (map[Math.floor(Math.random()*6)] + '');
}