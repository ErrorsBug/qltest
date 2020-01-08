import React,{ Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Page from 'components/page';
import { autobind } from 'core-decorators';
import { locationTo } from '../../../components/util';

//action
import {
    getMyAnswer,
    getUserInfo,
} from '../../actions/camp';

function mstp(state){
    return {

    }
}

const matp = {
    getMyAnswer,
    getUserInfo,
}

@autobind
class preparationTestResult extends Component {

    state = {
        myAnswer: [],
        myGrade: '',
        height: 1334,
        font: 'Source Han Sans CN',
        trainQrData: "",
        userInfo: {},
        imgData: "",
    }

    data = {
        line: 0,
        whiteHeight: 0,
        img:[
            'https://img.qlchat.com/qlLive/temp/UZZYSBD1-O5X9-FK1H-1514274843297-LCIC5ZAZF7EI.png',
            'https://img.qlchat.com/qlLive/temp/73WN6MUV-1WOM-A4L1-1514339529546-MPI3JI4ODI2X.png',
            'https://img.qlchat.com/qlLive/temp/LRS1I8BL-SBUR-CT6W-1514187496825-3NZO5PCWNRKH.png',
            'https://img.qlchat.com/qlLive/temp/G38J4ALV-MDNS-14Q8-1514277091175-GWYNR56919IW.png',
        ],
        heightArr: []
    }

    componentDidMount = async() =>{
        const userData = await this.props.getUserInfo();
        if(userData.state.code == 0){
            this.setState({
                userInfo: userData.data.user
            }, () => {
                let img = this.data.img;
                img.push(this.state.userInfo.headImgUrl);
            })
        }
        const resultData = await this.props.getMyAnswer(this.props.location.query.topicId);
        if(resultData.state.code == 0){
            this.setState({
                myAnswer: resultData.data.preparations,
                myGrade: resultData.data.grade,
                trainQrData: resultData.data.trainQrData,
            },()=>{
                this.getGradeImgUrl()
            })
        }

        // 数据全部加载完再初始化canvas
        this.initCanvas()
    }
    initCanvas(){
        this.canvas = document.querySelector('#test-bg');
        this.ctx = this.canvas.getContext('2d');
        //获取高度
        this.setHeight();
        this.ctx.fillStyle = 'rgb(254,181,191)';

        //绘制白底
        this.ctx.save();
        this.ctx.shadowBlur=18;
        this.ctx.shadowColor='rgba(64,50,25,0.23)';
        this.ctx.shadowOffsetX=0;
        this.ctx.shadowOffsetY=7;
        this.roundedRect(this.ctx,45,124,660,this.state.whiteHeight,10,'rgb(247,246,249)',true);
        this.ctx.restore();

        //绘制红边
        this.roundedRect(this.ctx,70,492,610,this.state.whiteHeight-400,10,'rgb(254,181,191)',false);

        //绘制个人信息框
        this.roundedRect(this.ctx,216,460,320,60,36,'rgb(255,227,155)',true);

        //加载图片
        this.loadAllImg()
    }

    // 获取评级图标url
    getGradeImgUrl(){
        let grade = this.state.myGrade;
        let gradeImgUrl;
        let img = this.data.img;
        switch(grade){
            case 'A+': gradeImgUrl = 'https://img.qlchat.com/qlLive/temp/QFUB9NJX-8DNA-MALO-1514341055934-8E5VIK5HM63A.png';
                       break;
            case 'A':  gradeImgUrl = 'https://img.qlchat.com/qlLive/temp/X3F8KHIO-AF6T-BG7K-1514341061570-6VIXRJJ3G3D4.png';
                       break; 
            case 'B':  gradeImgUrl = 'https://img.qlchat.com/qlLive/temp/2BO19Q2J-1AX9-TQEX-1514341061570-CD4MKNB9M4F1.png';
                       break;
            case 'C':  gradeImgUrl = 'https://img.qlchat.com/qlLive/temp/6XK3VO5Z-1GZX-QATO-1514341061569-V74ZDNGSWZNM.png';
                       break;
        }
        img.push(gradeImgUrl);
        this.data.img = img;
    }
    
    // 绘制文字
    drawWord(size,color,txt,x,y){
        this.ctx.save();
        this.ctx.font = size + 'px ' + this.state.font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(txt, x, y);
    }

    // 画二维码
    createQrCodeImg(linkUrl, height, width) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                resolve(img);
            };
            img.src = that.state.trainQrData;
        });
    }

    // 异步加载图片
    loadImageAsync(url) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.setAttribute("crossOrigin",'Anonymous')
            img.onload = function () {
                resolve(img);
            };
            img.src = url;
        });
    }

    //图片全部加载完毕再绘制
    loadAllImg(){
        const promiseArr = [];
        this.data.img.map((item)=>{
            promiseArr.push(this.loadImageAsync(this.imageProxy(item)))
        });
        promiseArr.push(this.createQrCodeImg("sssssssss",100,100))
        Promise.all(promiseArr).then((res)=>{
            this.ctx.drawImage(res[0], 70, 130, 620, 220);//课前小测验
            this.ctx.drawImage(res[1], 0, this.state.height-366, 750, 366);//底图
            this.ctx.drawImage(res[2], 0, 0, 750, 336);//顶图
            this.ctx.drawImage(res[3], 190, 360, 370,40);//180变美训练营
            this.circleImage(res[4], 235, 470, 20);// 头像
            this.ctx.drawImage(res[5], 530, 430, 140,100);//评级  
            this.ctx.drawImage(res[6], 300, this.state.height - 220, 150, 150);// 二维码
            
            this.drawWord(20,'rgb(255,255,255)', '扫码加入训练营吧', 375, this.state.height - 40);
            this.drawWord(24,'rgb(102,102,102)','第 一 课 时 课 前 测 试',370,430);

            // 绘制用户名
            let name = this.state.userInfo.name;
            if(name.length > 5){
                name = name.substring(0, 5) + '...'
            }
            this.drawWord(22,'rgb(189,104,28)',name, 350,498);
            this.drawWord(22,'rgb(189,104,28)','完成测验', 475,498);
            
            //绘制答案细节
            this.drawDetail(90,560)

            this.setState({
                imgData: this.canvas.toDataURL('image/png')
            })
        })
    }

    drawDetail(startX,startY){
        let x = startX,
            y = startY;
        this.state.myAnswer.map((item,index)=>{
            /**标题序号 */
            this.drawIndex(x + 14, y + 14, index + 1 + '');
            /**标题 */
            this.drawTitle(x + 38, y + 21, item.title)
            /**答案框 */
            this.roundedRect(this.ctx, x, y + this.data.heightArr[index] - 90 , 572, 60, 30, 'rgb(255,167,178)',true);
            /**答案 */
            this.drawAnswer(item.answer, x + 30, y + this.data.heightArr[index] - 60, 520);
            y += this.data.heightArr[index];
        })
    }

    /**绘制题号 */
    drawIndex(x,y,index){
        let color = 'rgb(239,86,112)';
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.arc(x,y,14,0,Math.PI*2,true); 
        this.ctx.fill();

        this.ctx.font = '24px ' + this.state.font;
        this.ctx.fillStyle = 'rgb(255,255,255)';
        this.ctx.textBaseline="middle";
        this.ctx.fillText(index,x,y);
        this.ctx.closePath();
        this.ctx.restore();
    }

    /**绘制题目 */
    drawTitle(x,y,text){
        this.ctx.save();
        this.ctx.font = '24px ' + this.state.font + ' bold';
        this.ctx.fillStyle = 'rgb(66,66,66)';
        this.ctx.textAlign = 'left';
        let words = text.split('');
        let line = '';
        for (let i = 0; i < words.length; i++) {
            line += words[i];
            /* 文字内容全部取完，直接绘制文字*/
            if (i === words.length - 1) {
                this.ctx.fillText(line, x, y, 490);
                break;
            }
            if (this.ctx.measureText(line).width >= 490) {
                this.ctx.fillText(line, x, y, 490);
                line = '';
                y += 40;
            }
        }
        this.ctx.restore();
    }

    /**绘制答案 */
    drawAnswer(text, x, y, width) {
        this.ctx.save();
        this.ctx.font = '22px ' + this.state.font ;
        this.ctx.fillStyle = 'rgb(255,255,255)';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline="middle";
        let words = text.split('');
        let line = '正确答案：';
        for (let i = 0; i < words.length; i++) {
            line += words[i];
            /* 文字内容全部取完，直接绘制文字*/
            if (i === words.length - 1) {
                this.ctx.fillText(line, x, y, width);
                break;
            }
            if (this.ctx.measureText(line).width >= width) {
                /* 超出用省略号代替后面的部分*/
                line = line.slice(0, line.length - 2) + '...';
                this.ctx.fillText(line, x, y, width);
                break;
            }
        }
        this.ctx.restore();
    }

    circleImage(image, distX, distY, radius) {
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

    // 计算并设置canvas真实高度
    setHeight(){
        this.state.myAnswer.map((item)=>{
            this.fetchHeight(this.ctx,item.title,490,40);
        });
        let line = this.data.line,
            index = this.state.myAnswer.length,
            height;
        height = 40 * line + 110 * index + 120 + 368 + 124 + 244;
        this.setState({
            height: height,
            whiteHeight: 40 * line + 110 * index + 120 + 368,
        },()=>{
            this.ctx.fillStyle='rgb(254,181,191)';
            this.ctx.fillRect(0,0,750,this.state.height);
        });
    }

    //绘制圆角矩形
    roundedRect(ctx,x,y,width,height,radius,color,bool){
        ctx.beginPath();
        ctx.moveTo(x,y+radius);
        ctx.lineTo(x,y+height-radius);
        ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
        ctx.lineTo(x+width-radius,y+height);
        ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
        ctx.lineTo(x+width,y+radius);
        ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
        ctx.lineTo(x+radius,y);
        ctx.quadraticCurveTo(x,y,x,y+radius);
        if(bool){
            ctx.fillStyle = color;
            ctx.fill();
        }else{
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }

    drawDashLine = (ctx,x1, y1, x2, y2, interval = 5) => {
        ctx.strokeStyle = '#f36';
        let isHorizontal = true; 
        if (x1 == x2) { 
            isHorizontal = false; 
        } 
        let len = isHorizontal ? x2 - x1 : y2 - y1; 
        ctx.moveTo(x1, y1); 
        let progress = 0; 
        while (len > progress) { 
            progress += interval; 
            if (progress > len) {
                 progress = len; 
            } 
            if (isHorizontal) { 
                ctx.moveTo(x1 + progress, y1); 
                ctx.arc(x1 + progress, y1, 1, 0, Math.PI * 2, true); 
                ctx.fill(); 
            } else { 
                ctx.moveTo(x1, y1 + progress); 
                ctx.arc(x1, y1 + progress, 1, 0, Math.PI * 2, true); 
                ctx.fill(); 
            } 
        }
    }

    imageProxy (url) {
        return '/api/wechat/image-proxy?url=' + encodeURIComponent(url);
    }
    /**计算每题的高度 */
    fetchHeight(ctx,text,width,lineHeight){
        this.ctx.font = '24px ' + this.state.font;
        let line = Math.ceil(ctx.measureText(text).width/width);
        this.data.heightArr.push(line*lineHeight + 110)
        this.data.line += line;
    }

    render(){
        return (
            <Page title={`课前小测验`} className='preparation-test-result-container'>
                <canvas 
                    id="test-bg"
                    width="750"
                    height={this.state.height}
                ></canvas>

                <img src={this.state.imgData}/>
            </Page>
        )
    }
}

export default connect(mstp, matp)(preparationTestResult);