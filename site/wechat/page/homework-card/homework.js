require('zepto');
var HomeworkCard = require('homeworkCard');
var conf = require('../conf');
var model = require('model');
var toast = require('toast');


var $img = $("#homeworkCard") 
var $qrcode = $("#qrcode")
var $returnBtn = $(".return-btn")

/**
 * [index description]
 * @type {Object}
 * @require './homework-card.scss'
 */

var homework = {
    homeworkInfo: {
        info: {},
        qrcode: document.getElementById('qrcode')
    },

    init: function () {
        this.idHandel();
        this.getHomeWorkInfoById(this.homeworkInfo.id,this);
    },

    btnHandel: function(liveId) {
        $returnBtn.click(function(){
            location.href = "/wechat/page/homework/manage?liveId=" + liveId;
        })
    },

    idHandel: function () {
        if (window.location.search && window.location.search.indexOf("id") === 1) {
            this.homeworkInfo.id = window.location.search.substr(4, 7)
        } else {
            toast.toast("参数错误")
            setTimeout(function() {
                history.back();
            }, 1000);
        }
    },

    getHomeWorkInfoById: function (id,that) {
        model.post(conf.api.getHomeworkInfoById, {
            id: id
        }, function (res) {
            // res ={"homeworkInfo":{"id":"1500013484631968","state":{"code":0,"msg":"操作成功"},"data":{"headImgUrl":"https://img.qlchat.com/qlLive/channelLogo/UWKTNOVU-OKI9-IOAM-1499052199621-131DOX5JWYQU.jpg","createTime":1500012153000,"liveName":"上善莫若喝水","status":"show","liveId":530000007079562,"createBy":90000112074092,"id":1000454,"content":"海客谈瀛洲，烟涛微茫信难求；越人语天姥，云霞明灭或可睹。天姥连天向天横，势拔五岳掩赤城。天台四万八千丈，对此欲倒东南倾。我欲因之梦吴越，一夜飞度镜湖月。湖月照我影，送我至剡溪。谢公宿处今尚在，渌水荡漾清猿啼。脚著谢公屐，身登青云梯。半壁见海日，空中闻天鸡。千岩万转路不定，迷花倚石忽已暝。熊咆龙吟殷岩泉，栗深林兮惊层巅。云青青兮欲雨，水澹澹兮生烟。列缺霹雳，丘峦崩摧。洞天石扉，訇然中开。青冥浩荡不见底，日月照耀金银台。霓为衣兮风为马，云之君兮纷纷而来下。虎鼓瑟兮鸾回车，仙之人兮列如麻。忽魂悸以魄动，恍惊起而长嗟。惟觉时之枕席，失向来之烟霞。世间行乐亦如此，古来万事东流水。别君去兮何时还？且放白鹿青崖间。须行即骑访名山。安能摧眉折腰事权贵，使我不得开心颜！","title":"默写《梦游天姥吟留别》默写《梦游天姥吟留别》默写《梦游天姥吟留别》","answerCount":0,"audioList":[],"liveLogo":"https://img.qlchat.com/qlLive/liveLogo/Q2DM6CKE-V7Y6-9GAK-1473749622976-R54DRW6LAOJL.jpg","topicId":210000527025990,"target":"topic","userName":"上善莫若喝水","topicName":"vue很流行，但你未必真懂啊"},"etag":null}}
            if(res.homeworkInfo.state.code === 0) {
                if(res.homeworkInfo.data.id) {
                    new QRCode(that.homeworkInfo.qrcode, {
                        text: location.origin + '/wechat/page/homework/details?type=qrcode&id=' + that.homeworkInfo.id,
                        width: 128,
                        height: 128,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.L
                    });

                    setTimeout(function() {
                        that.createCard(res.homeworkInfo.data);
                        that.btnHandel(res.homeworkInfo.data.liveId);
                    }, 100);

                } else {
                    toast.toast("无效的ID")
                    setTimeout(function () {
                        history.back();
                    }, 1000);
                }
            } else {
                toast.toast(res.homeworkInfo.state.msg)
            }
        }, function (err) {
            toast.toast(err.homeworkInfo.state.msg)
        }
        );
    },



    createCard: function (data) {
        var trueTitle = "";
        trueTitle = data.title.replace("&lt;","<")
        trueTitle = trueTitle.replace("&gt;",">")

        var content = data.content

        if (data.type === 'exam') {
            content = '共计' + (data.exam && data.exam.questionList || []).length + '道作业题，想来挑战下吗？';
        } else if (data.type === 'question') {
            content = '共计' + (data.questionList || []).length + '道作业题，想来挑战下吗？';
        }

        var card = new HomeworkCard({
            logo: data.liveLogo,
            qrcodeUrl: $qrcode.find("img").attr("src"),
            name: data.liveName,
            title: trueTitle,
            desc: content,
            contentType: data.contentType
        },
        "https://img.qlchat.com/qlLive/card/homework-card-01.png",
        function(imgdata) {
            $img.attr("src",imgdata);
        })
    },

};


module.exports = homework;