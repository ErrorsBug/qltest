

var likesMsg ={
	// 点赞
	init: function(ids, maxZan) {
		/** 
		 * ids {Array<number>} 泡泡id列表 
		 */
		this.ids = ids ? ids : [];

		/**
		 * maxZan {number} 变成金句的临界值
		 */
		this.maxZan = maxZan ? maxZan : 50;
		
		$.ajax({
			url: CtxPath + "/interact/speak/likesList.htm",
			method: "POST",
			contentType: "application/json",
			data: {
				speakIds: this.ids.join(',')
			},
			success: function (result) {
				if (result.statusCode == 200) {
					result.data.forEach(function (item) {
						zan.updateZan(item.speakId, item.likesNum, item.isLikes);
					});
				}
			}
		});
	},

	/**
	 * 设置变成金句的临界值
	 * 
	 * @param max {number} 临界值
	 */
	setMax: function (max) {
		this.maxZan = max;
	},

	/**
	 * addIds 添加id
	 * @param ids: Array<number>|number 需要添加进条目列表的id
	 */
	addIds:function (ids) {
		if (ids instanceof Array) {
			this.ids = noRepeatArray(this.ids.cancat(ids));
		} else if (typeof ids === "number") {
			if (!isContained(this.ids, ids)) {
				this.ids.push(ids);
			}
		} else {
			throw new Error("请传入正确的id：Array<number>|number ");
		}
	},

	/**
	 * 点赞
	 * 
	 * @param id {number} 泡泡ID
	 */
	doZan:function (id) {
		var $tagDom = $(".zan[data-id=" + id + "]");

		if ($tagDom.hasClass("active")) {
			return;
		}

		$.ajax({
			url: CtxPath + "/interact/speak/likes.htm",
			data: {
				speakId: id,
				topicId: window.topicId
			},
			success: function (result) {
				if (result.statusCode == 200) {
					zan.updateZan(id, Number(result.data.likesNum), true);
				}
			}
		});
	},

	/**
	 * 更新点赞数
	 * 
	 * @param id {number} 泡泡ID
	 * @param count {number} 点赞数
	 * @param isActive {boolean} 是否被当前用户点赞过，如果不传则保持原样
	 */
	updateZan: function (id, count, isActive) {
		var $tagDom = $(".zan[data-id=" + id + "]");
		var $bubble = $tagDom.parent(".bubble_content");
		
		if (isActive === true) {
			$tagDom.addClass("active");
		} else if (isActive === false) {
			$tagDom.removeClass("active");
		}

		if (count >= this.maxZan) {
			$bubble.addClass("had_zan");
		} else {
			$bubble.removeClass("had_zan");
		}

		$tagDom.find(".count").text(count === 0 ? "" : count);
	},

	// !(function() {
	// 	window.zan = new Zan();
	// 	zan.setMax(Number(window.likeLimit));
	// 	$(document).on("click", ".zan", function (e) {
	// 		var event = e || window.event;
	// 		var id = $(this).attr("data-id");

	// 		window.zan.doZan(id);

	// 		e.stopPropagation();
	// 	});
	// })();


	
}