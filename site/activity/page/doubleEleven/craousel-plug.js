function initCarousel($, selectQuery, mainContainerQuery) {

    var $this = $(selectQuery)
    var $mainContainer = $(mainContainerQuery)


    var height = 264
    var width = 617
    var padding = 20

    var styleList = [
        { left: (padding * 0 / 75) + "rem"                   , top: "20%", "z-index": 1, opacity: .4, width: (width * 0.6 / 75) + "rem", height: (height * 0.6 / 75) + "rem",  },
        { left: (padding * 1 / 75) + "rem"                   , top: "10%", "z-index": 2, opacity: .9, width: (width * 0.8 / 75) + "rem", height: (height * 0.6 / 75) + "rem",  },
        { left: (padding * 2 / 75) + "rem"                   , top: "0; ", "z-index": 3, opacity:  1, width: (width * 1.0 / 75) + "rem", height: (height * 0.6 / 75) + "rem",  },
        { left: ((padding * 3 + width * 0.2) / 75) + "rem"   , top: "10%", "z-index": 2, opacity: .9, width: (width * 0.8 / 75) + "rem", height: (height * 0.6 / 75) + "rem",  },
        { left: ((padding * 4  + width * 0.4) / 75) + "rem"  , top: "20%", "z-index": 1, opacity: .4, width: (width * 0.6 / 75) + "rem", height: (height * 0.6 / 75) + "rem",  },
    ]

    var $itemWrap = $this.find(".poster-list")
    $itemWrap.css({ width: ((width + padding * 4) / 75) + "rem"})

    var $itemList = $this.find(".poster-item")
    var $swiperList = $this.find(".swiper-item")

    // 渲染方法
    function render(itemList, swiperList) {
        itemList.forEach(function(item, index) {
            // item.animate(styleList[index])
            item.css(styleList[index])
            if(item.hasClass("p3")) {
                swiperList[index].siblings(".swiper-item").removeClass("active")
                swiperList[index].addClass("active")
            }
        })
    }   

    // 初始化swiper对象数组 和 poster 对象数组
    var itemList = []
    var swiperList = []
    // 初始化画板
    $itemList.each(function (index, item) {
        itemList.push($(this))
    })
    // 初始化swiper
    $swiperList.each(function (index, item) {
        var self = $(this)
        swiperList.push(self)
        self.on("click", function() {
            while(!itemList[index].hasClass("p1")) {
                itemList.push(itemList.shift())
            }
            render(itemList, swiperList)
        })
    })

    // 初始化CSS
    itemList.forEach(function(item, index) {
        item.css(styleList[index])
        setTimeout(function() {
            item.css({ transition: "all .5s ease-out"})
        }, 150)
        if(item.hasClass("p1")) {
            swiperList[index].siblings(".swiper-item").removeClass("active")
            swiperList[index].addClass("active")
        }
    })

    var touchStartX = 0;
    var touchStart = false;
    var rended = false;

    $itemWrap.on('touchstart',touch, false)
    $itemWrap.on('touchmove',touch, false)
    $itemWrap.on('touchend',touch, false)

    var intercalId = setInterval(function() {
        itemList.push(itemList.shift())
        itemList.forEach(function(item, index) {
            item.css(styleList[index])
            if(item.hasClass("p1")) {
                swiperList[index].siblings(".swiper-item").removeClass("active")
                swiperList[index].addClass("active")
            }
        })
    }, 3000);

    $mainContainer.on('touchstart',function(e) {
        if(intercalId) {
            clearInterval(intercalId)
            console.log("清除计时器" + intercalId);
            intercalId = false
        }
    }, false)
    $mainContainer.on('touchend',function() {
        var a = $('.poster-container')[0].offsetTop;
        var b = $mainContainer[0].scrollTop;

        if(a > b && intercalId === false) {
            intercalId = setInterval(function() {
                itemList.push(itemList.shift())
                itemList.forEach(function(item, index) {
                    item.css(styleList[index])
                    if(item.hasClass("p1")) {
                        swiperList[index].siblings(".swiper-item").removeClass("active")
                        swiperList[index].addClass("active")
                    }
                })
            }, 3000);
            console.log("恢复计时器" + intercalId);
        }
    }, false)

    function touch(event) {
        switch(event.type){  
            case "touchstart":  
                touchStartX = event.touches[0].clientX
                touchStart = true
                console.log("con touchstart");
                clearInterval(intercalId)

                break;  
            case "touchend":
                touchStart = false
                rended =false

                intercalId = setInterval(function() {
                    itemList.push(itemList.shift())
                    itemList.forEach(function(item, index) {
                        item.css(styleList[index])
                        if(item.hasClass("p1")) {
                            swiperList[index].siblings(".swiper-item").removeClass("active")
                            swiperList[index].addClass("active")
                        }
                    })
                }, 3000);


                break;  
            case "touchmove":   
                event.preventDefault()
                if(!rended && event.touches[0].clientX - touchStartX > 30) {
                    rended = true
                    itemList.unshift(itemList.pop())
                    render(itemList, swiperList)
                }
                if(!rended && touchStartX - event.touches[0].clientX  > 30) {
                    rended = true
                    itemList.push(itemList.shift())
                    render(itemList, swiperList)
                }
                break;  
        }  
    }

    function mainContainerTouch(event) {

    }


}

module.exports = {
    initCarousel: initCarousel
};