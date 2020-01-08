// 用了promise封装图片加载，大概是不能在node里面画的
var CampAchievementCard = (function() {
    function CampAchievementCard(userName) {
        this.CANVAS_HEIGHT = 842;
        this.CANVAS_WIDTH = 595;

        this.userName = userName

        var imgDataList = [
            {
                srcUrl: 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/MDJJQUDC-W1GE-KQ7A-1514544444238-5NMEKUYNMHGA.png',
                width: 595,
                height: 842,
            },
        ]

        console.log(this.userName);

        this.loadAllImage = this.prototype.loadAllImage
        this.loadImage = this.prototype.loadImage

        this.canvas = document.createElement('canvas');
        this.canvas.style.border = "none";
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;

        var that = this
        return this.loadAllImage(imgDataList).then(function(res) {
            var ctx = that.ctx
            ctx.drawImage(res[0], 0, 0, that.canvas.width, that.canvas.height);

            ctx.font = '32px ' + 'Source Han Sans CN';
            ctx.textBaseline = 'hanging'; 
            ctx.fillStyle = "#3f4863";
            ctx.fillText(that.userName, 298 - ctx.measureText(that.userName).width/2, 310);

            return that.canvas.toDataURL('image/jpeg', 0.9); 
        })

    }

    CampAchievementCard.prototype.loadImage = function(srcUrl, height, width) {
        var that = this
        return new Promise(function(resolve, reject) {
            var $image = new Image();
            $image.crossOrigin = 'Anonymous';
            if(height && width) {
                srcUrl += "?x-oss-process=image/resize,h_" + height + ",w_" + width + ",m_fill";
            }
            $image.onload = function() {
                resolve($image);
            };
            $image.onerror = function() {
                reject(new Error('Could not load image at ' + srcUrl));
            };
            $image.src = srcUrl;
        });
    }
    CampAchievementCard.prototype.loadAllImage = function(imgDataList) {
        var loadImagePromiseList = []
        imgDataList.forEach(function(item) {
            loadImagePromiseList.push(this.loadImage(item.srcUrl, item.height, item.width))
        }, this);
        return Promise.all(loadImagePromiseList)
    }

    return CampAchievementCard
})

module.exports = CampAchievementCard