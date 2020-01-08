// 用了promise封装图片加载，大概是不能在node里面画的
var CampAchievementCard = (function() {
    function CampAchievementCard(data, qrcode) {
        this.CANVAS_HEIGHT = 1200;
        this.CANVAS_WIDTH = 750;

        // this.bgSrc = 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/N8K9R31Y-B8YP-1JVL-1514274337466-HI1WBTOGUZ3W.png';
        // this.hexagonTitleSrc = 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/T91IK8ES-LFSO-NS2T-1514274325650-ITU19L9PZ1UU.png';
        // this.hexagonBgSrc = 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/P61OC8F1-BE5I-8YRT-1514274329801-D4U7QY6TG8YB.png';
        // this.resultBgSrc = 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/51KI9C48-N7MF-XUAU-1514274333878-JSG6J8EQZEI6.png'

        // this.data = {
        //     name: "阿鲁巴大将军",
        //     headImage: "https://img.qlchat.com/qlLive/adminImg/1KEWW22N-3VWQ-V47M-1514370829945-EE47WY2IMGMA.jpg",
        //     title: "https://img.qlchat.com/qlLive/followQRCode/topic-intro/T91IK8ES-LFSO-NS2T-1514274325650-ITU19L9PZ1UU.png",
        //     tag: '[{"tag": "标签1", "score": 1},{"tag": "标签2", "score": 3},{"tag": "标签3", "score": 3},{"tag": "标签4", "score": 4},{"tag": "标签5", "score": 3},{"tag": "标签6", "score": 3}]',
        //     exceNum: 3,
        //     score: 9.8,
        //     rank: 1,
        // }
        this.data = data
        this.qrcode = qrcode

        var tagList = []
        this.tagList = []
        try {
            tagList = JSON.parse(this.data.tag)
        } catch (error) {
            console.log(error);
        }

        for(var i = 0; i < 6; i++) {
            if(tagList[i] && tagList[i].tag && tagList[i].score) {
                this.tagList.push(tagList[i])
            }else {
                this.tagList.push({tag: "标签", score: 3})
            }
        }

        var imgDataList = [
            {
                srcUrl: 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/N8K9R31Y-B8YP-1JVL-1514274337466-HI1WBTOGUZ3W.png',
                width: 750,
                height: 1200,
            },
            {
                srcUrl: this.data.title || 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/T91IK8ES-LFSO-NS2T-1514274325650-ITU19L9PZ1UU.png',
                width: 311,
                height: 62,
            },
            {
                srcUrl: 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/22IHCEYD-H5FK-Z2LK-1514342814059-6SF9KF1BTQI1.png',
                width: 660,
                height: 709,
            },
            {
                srcUrl: 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/51KI9C48-N7MF-XUAU-1514274333878-JSG6J8EQZEI6.png',
                width: 712,
                height: 388,
            },
        ]
        if(this.data.headImage) {
            imgDataList.push({
                srcUrl: this.data.headImage,
                width: 120,
                height: 120,
            })
        } else {
            imgDataList.push({
                srcUrl: 'https://img.qlchat.com/qlLive/followQRCode/topic-intro/N8K9R31Y-B8YP-1JVL-1514274337466-HI1WBTOGUZ3W.png',
                width: 120,
                height: 120,
            })
        }



        var qrCodeData = {
            qrcodeBase64: this.qrcode,
            width: 100,
            height: 100,
        }


        this.loadAllImage = this.prototype.loadAllImage
        this.loadImage = this.prototype.loadImage
        this.createQrCodeImg = this.prototype.createQrCodeImg
        this.dowTextBob = this.prototype.dowTextBob
        this.hexagonPosition = this.prototype.hexagonPosition
        this.circleImage = this.prototype.circleImage


        this.canvas = document.createElement('canvas');
        this.canvas.style.border = "none";
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;

        var that = this
        return this.loadAllImage(imgDataList, qrCodeData).then(function(res) {
            var ctx = that.ctx

            console.log(res);

            // 按顺序 绘制5张图片
            ctx.drawImage(res[0], 0, 0, that.canvas.width, that.canvas.height);
            ctx.drawImage(res[2], 45, 45, 660, 709);
            ctx.drawImage(res[1], 220, 74, 311, 62);
            ctx.drawImage(res[3], 18, 730, 712, 388);


            ctx.drawImage(res[5], 310, 1010, 130, 130);
            
            ctx.font = '36px ' + 'Source Han Sans CN';
            ctx.textBaseline = 'hanging'; 
            ctx.fillStyle = "#666666";

            ctx.fillText(that.data.exceNum + "次", 148 - ctx.measureText(that.data.exceNum + "次").width / 2, 929)
            ctx.fillText(that.data.score + "分", 375 - ctx.measureText(that.data.score + "分").width / 2, 929)
            ctx.fillText("第" + that.data.rank + "名", 597 - ctx.measureText("第" + that.data.rank + "名").width / 2, 929)

            ctx.font = '20px ' + 'Source Han Sans CN';
            ctx.textBaseline = 'hanging'; 
            ctx.fillStyle = "#fff";
            ctx.fillText("长按识别加入训练营", 286, 1155);

            // 绘制六边形 开始
            ctx.save();
                ctx.beginPath()
                var pos = that.hexagonPosition(0, 4)
                ctx.moveTo(pos.x, pos.y);
                for (let index = 0; index < 7; index++) {
                    pos = that.hexagonPosition(index, 4)
                    ctx.lineTo(pos.x ,pos.y);
                }
                ctx.strokeStyle = '#fff'
                ctx.fillStyle = "rgba(255, 255, 255, .2)"
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath()
                pos = that.hexagonPosition(0, 4)
                ctx.moveTo(pos.x, pos.y);
                for (let index = 0; index < 7; index++) {
                    pos = that.hexagonPosition(index, 3)
                    ctx.lineTo(pos.x ,pos.y);
                }
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath()
                pos = that.hexagonPosition(0, 4)
                ctx.moveTo(pos.x, pos.y);
                for (let index = 0; index < 7; index++) {
                    pos = that.hexagonPosition(index, 2)
                    ctx.lineTo(pos.x ,pos.y);
                }
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath()
                pos = that.hexagonPosition(0, 4)
                ctx.moveTo(pos.x, pos.y);
                for (let index = 0; index < 7; index++) {
                    pos = that.hexagonPosition(index, 1)
                    ctx.lineTo(pos.x ,pos.y);
                }
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath()
                pos = that.hexagonPosition(0, 4)
                ctx.moveTo(pos.x, pos.y);
                pos = that.hexagonPosition(3, 4)
                ctx.lineTo(pos.x ,pos.y);
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath()
                pos = that.hexagonPosition(1, 4)
                ctx.moveTo(pos.x, pos.y);
                pos = that.hexagonPosition(4, 4)
                ctx.lineTo(pos.x ,pos.y);
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath()
                pos = that.hexagonPosition(2, 4)
                ctx.moveTo(pos.x, pos.y);
                pos = that.hexagonPosition(5, 4)
                ctx.lineTo(pos.x ,pos.y);
                ctx.stroke();
                ctx.closePath();
            ctx.restore();
            // 绘制六边形 结束

            // 画另一个六边形
            ctx.save();
                ctx.fillStyle = "rgba(255, 255, 255, .2)"
                ctx.beginPath()

                pos = that.hexagonPosition(0, that.tagList[0].score)
                ctx.moveTo(pos.x, pos.y);

                that.tagList.forEach(function(item, index) {
                    pos = that.hexagonPosition(index, item.score)
                    ctx.lineTo(pos.x ,pos.y);
                });

                ctx.fill();
            ctx.restore();

            // 画中间的头像
            ctx.save();
                ctx.beginPath()
                ctx.fillStyle = '#fff'
                ctx.arc (375, 446, 64, 0, 2 * Math.PI, false); 
                ctx.fill();
                ctx.closePath();
            ctx.restore();
            that.circleImage.call(that, res[4], 316, 387, 59)

            ctx.font = '24px ' + 'Source Han Sans CN';
            ctx.textBaseline = 'hanging'; 
            ctx.fillStyle = "#424242";
            
            
            
            // 画气泡
            that.tagList.forEach(function(item, index) {
                // 第三个气泡气泡方向往下
                if(index == 3) {
                    that.dowTextBob(index, item.score, item.tag,  item.score == 2 ? 'B' : 'T')
                } else {
                    that.dowTextBob(index, item.score, item.tag, 'T')
                }
            });
            
            ctx.fillText(that.data.name, 375 - ctx.measureText(that.data.name).width/2, 527);
            


            return that.canvas.toDataURL('image/jpeg', 0.9); 
        })

    }

    CampAchievementCard.prototype.dowTextBob = function (sort, rank, text, direction) {
        rank = rank || 1
        text = text || ""
        // 如果 direction 参数为"B" 那标签会往下伸展 默认往上
        direction = direction || "T"
        var ctx = this.ctx

        var originX = 375
        var originY = 446
        var distance = 60

        var dotX = distance * rank * Math.sin(Math.PI / 3 * sort) + originX
        var dotY = - distance * rank * Math.cos(Math.PI / 3 * sort) + originY

        ctx.save();

        ctx.font = '22px ' + 'Source Han Sans CN';
        ctx.textBaseline = 'hanging'; 
        var textWidth = ctx.measureText(text)
        var rectWidth = 30 + textWidth.width
        var rectHeight = 40
        var rectPosX = dotX - rectWidth / 2 + 3
        var rectPosY = dotY - 55

        if(direction == "T") {
            roundedRect(ctx, rectPosX, rectPosY, rectWidth, 40, 4)
        } else {
            roundedRect(ctx, rectPosX, rectPosY + 69, rectWidth, 40, 4)
        }

        ctx.beginPath();
        ctx.fillStyle = "#fff"
        ctx.shadowColor = "RGBA(255,255,255,1)";
        ctx.shadowBlur = 10;
        ctx.arc ( dotX, dotY, 8, 0, 2 * Math.PI, false); 
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ef5670"

        if(direction == "T") {
            ctx.fillText(text, rectPosX + 15, rectPosY + 11)
        } else {
            ctx.fillText(text, rectPosX + 15, rectPosY + 80)
        }

        ctx.restore();

        function roundedRect(ctx,x,y,width,height,radius){
            ctx.beginPath();
            ctx.moveTo(x,y+radius);
            ctx.lineTo(x,y+height-radius);
            ctx.quadraticCurveTo(x,y+height,x+radius,y+height);

            // ctx.lineTo(x+17-radius,y+height);
            // ctx.lineTo(x+22-radius,y+height + 7);
            // ctx.lineTo(x+27-radius,y+height);
            // ctx.lineTo(x+width-radius,y+height);

            ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
            ctx.lineTo(x+width,y+radius);
            ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
            ctx.lineTo(x+radius,y);
            ctx.quadraticCurveTo(x,y,x,y+radius);
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fill();
            ctx.closePath();
        }
    }

    

    // 以六边形的中心为原点，传入第几条边与在这个边所占的长度，返回顶点坐标
    // 第0条边为竖起来的第一条，顺时针递增
    CampAchievementCard.prototype.hexagonPosition = function(sort, rank) {
        var originX = 375
        var originY = 446
        var distance = 60
        rank = rank || 1
        var x = distance * rank * Math.sin(Math.PI / 3 * sort)
        var y = distance * rank * Math.cos(Math.PI / 3 * sort)
        return {x:x + originX , y: -y + originY}
    }

    CampAchievementCard.prototype.circleImage = function (image, distX, distY, radius) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(distX + radius, distY + radius, radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.clip();
        this.ctx.drawImage(image, distX, distY, radius * 2, radius * 2);
        this.ctx.beginPath();
        this.ctx.arc(distX, distY, radius, 0, Math.PI * 2, true);
        this.ctx.clip();
        this.ctx.closePath();
        this.ctx.restore();
    };

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

    CampAchievementCard.prototype.loadAllImage = function(imgDataList, qrCodeData) {
        var loadImagePromiseList = []
        imgDataList.forEach(function(item) {
            loadImagePromiseList.push(this.loadImage(item.srcUrl, item.height, item.width))
        }, this);

        console.log(qrCodeData);
        if(qrCodeData) {
            loadImagePromiseList.push(this.createQrCodeImg(qrCodeData.qrcodeBase64, qrCodeData.height, qrCodeData.width))
        }
        return Promise.all(loadImagePromiseList)
    }
    CampAchievementCard.prototype.createQrCodeImg = function(dataBase64, height, width) {
        // qrcodejs2 组件在node端会报错，所以在客户端里面按需引入的形式来加载
        // return require.ensure([], function(require) {
        //     var QRCode = require('qrcodejs2')
        //     var $image = new Image();
        //     var qrcode = new QRCode($image, {
        //         text: linkUrl,
        //         width: width,
        //         height: height,
        //         colorDark : "#000000",
        //         colorLight : "#ffffff",
        //         correctLevel : QRCode.CorrectLevel.L
        //     });
        //     return $image.getElementsByTagName("img")[0]
        // });
        var that = this
        return new Promise(function(resolve, reject) {
            var $image = new Image();
            $image.onload = function() {
                resolve($image);
            };
            $image.onerror = function() {
                reject(new Error('Could not load image at ' + dataBase64));
            };
            $image.src = dataBase64;
        });
    }




    return CampAchievementCard
})

module.exports = CampAchievementCard