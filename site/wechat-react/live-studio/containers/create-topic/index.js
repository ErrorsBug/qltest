import React, { Component, Suspense } from 'react';
import Page from "components/page";
import { autobind } from 'core-decorators';
import { Confirm, MiddleDialog } from 'components/dialog';
import { request } from 'common_actions/common';
import { uploadImage, getStsAuth, fetchUserPower, getMyLiveEntity, getUserInfo } from "../../actions/common";
import { createNewTopic, getLiveTag, getIdentifyingCode, createLive } from "../../actions/live";
import Detect from "components/detect";
import DatePicker from 'components/date-picker';
import { formatDate, locationTo, validLegal, isNumberValid } from "components/util";
import dayjs from 'dayjs';
import Clipboard from 'clipboard';

import { connect } from 'react-redux';
import { isPc } from 'components/envi';
import { createPortal } from 'react-dom';
import ProtocolPage from 'components/protocol-page/index';
import LiveCategoryPicker from 'components/live-category-picker';

@autobind
class CreateTopic extends Component {
    state={
        liveId: this.props.location.query.liveId||'',
        channelId: this.props.location.query.channelId||'',
        topicId:this.props.location.query.topicId||'',
        campId:this.props.location.query.campId||'',

        // status的值===  base 基本信息填写；pay-type  付费类型填写；
        status: this.props.location.query.topicId ? 'editor' : 'base', //创建  base ； 编辑   editor
        payType:'public', //话题类型  public 公开； encrypt 加密； charge 支付；
        topicType: 'normal', // normal, ppt, audioGraphic, videoGraphic
        headUrl:'',
        topicName:'',
        //价格相关参数
        topicPrice:'',
        //自动分销相关参数
        autoSharePercent:'',
        //密码交互相关参数
        encryptAray:['','','','','',''],
        thisEncryInputNum: '',

        showSpeakerChangeDialog:false,
        showSpeakerIntroChangeDialog:false,
        showMimaDialog:false,
        showPercentTipsDialog:false,
        percentTag:[
            {percent:30,active:true},
            {percent:50,active:false},
        ],
        // 是否隐藏提交按钮，用于安卓手机软键盘弹起时把提交按钮顶起，此时需要隐藏
        hideConfirmBtn: false,
        showUseIntro: false,
        showExampleDialog: false,
        exampleType: '',

        /******* 创课前置相关 start *******/
        // 是否显示创建直播间弹窗
        showCreateLiveDialog: false, // 显示创建直播间弹窗
        currentStep: 0, // 当前步骤
        liveTags: undefined, 
        hotLiveTags: undefined, // 热门分类 
        selectedLiveTag: undefined,
        isCheckProtocol: false,
        countDown: 60, // 倒计时
        phoneNum: "", // 电话号码
        validCode: "", // 验证码
        phoneValid: false, // 电话是否合法
        isGettingValidCode: false,
        isCounting:  false,
        liveEntity: undefined
        /******* 创课前置相关 end *******/
    };

    
    data = {
        priceInput:'',
        encryptAray:['','','','','',''],
        timer: null
    }
    async componentDidMount(){
        this.resizeAuto();
        let self = this;
        //复制链接
		var clipboard = new Clipboard(".fuzhi");
		clipboard.on('success', function(e) {
            self.setState({showTypeTipDialog:false});
			window.toast('复制成功！');
		});
		clipboard.on('error', function(e) {
			window.toast('复制失败！请手动复制');
        });

        await this.props.getUserInfo();
        // 初始化创建直播间相关信息
        await this.getLiveEntity();
        this.initLiveTag();
        this.setDefaultInfo();

        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    resizeAuto(){
        // 安卓软键盘弹起的时候隐藏底部提示（安卓手机在软键盘弹起的时候会将页面文档高度挤压）
        if (Detect.os.android) {
            // 初始页面文档高度
            this.originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
            window.onresize = ()=>{
                // resize之后的页面文档高度
                let resizeHeight = document.documentElement.clientHeight|| document.body.clientHeight;
                if(resizeHeight < this.originalHeight){
                    this.setState({hideConfirmBtn: true})
                }else {
                    this.setState({hideConfirmBtn: false})
                }
            }
        }
    }

    // oss上传初始化
    initStsInfo() {
        if(!(Detect.os.weixin && Detect.os.ios)){
            const script = document.createElement('script');
            script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
            document.body.appendChild(script);
        }
    }

    //话题名称
    changeTopicName(e){
        this.setState({
            topicName: e.target.value,
        });
    }
    cleanTopicName(){
        this.setState({
            topicName: ''
        });
    }

    //时间选择
    updateStartTime(val){
        console.log('this val',val);
        this.setState({
            startTime: val.getTime(),
        });
    }

    //选择话题类型
    selectTopicType(type){
        if(type === 'interactive'|| type === 'record'){
            this.setState({
                typeTipsKey:type,
                showTypeTipDialog:true,
            });
            return false;
        }
        this.setState({
            topicType: type,
        });
    }


    nextClick(){
        if(!validLegal('text', '课程名称', this.state.topicName, 32)){
            return false;
        }else if(!this.state.startTime){
            toast('请选择开始时间');
            return false;
        }
        if(this.state.channelId === '' && this.state.campId === ''){
            this.setState({
                status:'pay-type',
            })
        }else{
            console.log("************************8");
            this.setState({
                payType : "charge" 
            })
            this.createConfirm(false);
        }
        
    }

    //选择付费类型
    selectPayType(type){
        
        this.setState({
            payType: type,
        },()=>{

            locationTo("#pageTypee");
            

            if(type === 'encrypt'){
                this.initChargeInput();
            }else if(type ==="charge"){
                this.initEncryptInput();
            }else if(type ==="public"){
                this.initChargeInput();
                this.initEncryptInput();
            }
            
        });
    }

    initChargeInput(){
        this.setState({
            topicPrice: '',
        });
        this.initPercentInput();
    }

    initPercentInput(){
        let percentTag = this.state.percentTag;
        percentTag[0].active = true;
        percentTag[1].active = false;
        this.setState({
            autoSharePercent: '',
            percentTag,
        });
    }

    initEncryptInput(){
        this.data.encryptAray = ['','','','','',''];
        this.setState({
            encryptAray: this.data.encryptAray,
            thisEncryInputNum: '',
        });
    }

    // 确认创建课程
    async createConfirm(isNotChannel,confirm,liveId){

        if(!validLegal('text', '课程名称', this.state.topicName, 32)){
            return false;
        }
        if(!this.state.startTime){
            toast('请选择开始时间');
            return false;
        }

        // 若没有有直播间,且不是创建直播间后创课
        if(!(this.state.liveEntity && this.state.liveEntity.entityPo) && !liveId) {

            if(!this.state.selectedLiveTag) {
                toast('请选择课程分类');
                return false;
            }

            this.setState({
                showCreateLiveDialog: true,
            });

            // 手动触发打曝光日志
            setTimeout(() => {
                typeof _qla != 'undefined' && _qla.collectVisible();
            }, 0);
            return;
        } 

        let password = '';
        let autoSharePercent = isNotChannel? '' : 0;
        //TODO  创建话题
        if(isNotChannel){//系列课话题的创建则不验证付费类型
            if(!confirm&& this.state.autoSharePercent!='' && Number(this.state.autoSharePercent) === 0){//验证是否充值自动分销比例
                //确认提示
                this.setState({
                    showPercentTipsDialog:true,
                });
                return false;
            }
            
            autoSharePercent =(this.state.autoSharePercent =='')? 30 : this.state.autoSharePercent;
            password = this.state.encryptAray.join("");
            if(this.state.payType ==="charge" && !validLegal('money', '课程价格', this.state.topicPrice, 50000, 1)){
                return false;
            }else if(this.state.payType ==="charge" && !isNumberValid(autoSharePercent.toString(), 0, 80,'分成比例')){
                return false;
            }else if(this.state.payType ==="encrypt" && password === ''){
                toast('请输入密码');
                this.setState({
                    thisEncryInputNum: this.state.thisEncryInputNum  || 0 ,
                });
                return false;
            }
        }
        console.log(isNotChannel);
        console.log(autoSharePercent);
        
        let result = await this.props.createNewTopic({
            liveId : this.state.liveId.length > 0 ? this.state.liveId : liveId,
            channelId: this.state.channelId,
            campId : this.state.campId,
            topic: this.state.topicName,
            startTime: this.state.startTime,
            style: this.state.topicType,
            type: this.state.channelId || this.state.campId ? 'charge' : this.state.payType,
            money: this.state.topicPrice * 100,
            password: password,
            isAutoShareOpen: autoSharePercent > 0 ? "Y" : "N",
            autoSharePercent: autoSharePercent,
            isNeedAuth:'Y',//目前逻辑是默认开启介绍页
            backgroundUrl: 'https://img.qlchat.com/qlLive/liveCommon/default-bg-cover-1908080' + (~~(Math.random() * 3 + 1)) + '.png',
        });
        
        if(result.state.code ===0 && result.data.liveTopicView){
            let topic = result.data.liveTopicView||{};
            toast('创建成功！');

            // 如果从创课前置入口进入
            if (this.props.location.query.fromCreateClass === 'Y') {
                // 若没有直播间
                if(this.state.liveEntity && (!this.state.liveEntity.entityPo)) {
                    // 未关注公众号
                    if( this.state.liveEntity.subscribe !== true) {
                        locationTo(`/wechat/page/create-live-adv-success?topicId=${topic.id}&liveId=${liveId}`);// 去成功页 
                        return ;
                    } else { // 已经关注公众号
                        locationTo(`/topic/details?topicId=${topic.id}&liveId=${liveId}`);//去上课页
                        return ;
                    }
                } else { // 若已有直播间
                    locationTo(`/topic/details?topicId=${topic.id}&liveId=${this.state.liveId}`);//去上课页
                    return ;
                }
            }

            locationTo("/wechat/page/topic-intro?topicId=" + topic.id);//去介绍页
            // locationTo('/wechat/page/topic-intro-edit?topicId='+ topic.id);//去编辑页
        }else{
            toast(result.state.msg);
        }
    }
    //修改话题名称
    changeName(e){
        this.setState({
            topicName: e.target.value,
        });
    }
    //点击设置密码
    changePassword(e){
        let value = e.target.value;
        if(value != "" && !/([0-9]|[a-z]|[A-Z])/.test(value.substring(value.length-1))){
            toast('请输入数字或英文字母');
            return false;
        }
        let passArray = value.split("");
        if( passArray.length > 6){
            return false;
        }
        
        for (let i = 0; i < passArray.length; i++) {
            const element = passArray[i];
            this.data.encryptAray[i] = element;
        }
        this.setState({
            encryptAray: this.data.encryptAray,
            thisEncryInputNum: passArray.length,
        });
    }

    deletePass(e){
        let key = e.key;
        let value = e.target.value;
        value = value.split("");
        let num = this.state.thisEncryInputNum; 
        if(key === 'Backspace'){
            num =value.length-1;
            this.data.encryptAray[num] = '';
        }
        console.log(num);
        this.setState({
            encryptAray: this.data.encryptAray,
            thisEncryInputNum: num,
        });
    }
    encryptFocus(e){
        let value = e.target.value;
        console.log(this.state.thisEncryInputNum);
        this.setState({
            thisEncryInputNum: this.state.thisEncryInputNum || value.length || 0 ,
        });
    }
    
    //修改价格
    changePrice(e){
        this.setState({
            topicPrice: e.target.value,
        });
    }

    //修改分成比例
    changePercent(e){
        let value = e.target.value||'';
        let percentTag = this.state.percentTag;
        if(value == 30 || value == ''){
            percentTag[0].active = true;
        }else if(value == 50){
            percentTag[1].active = true;
        }else{
            percentTag[0].active =false;
            percentTag[1].active =false;
        }
        
        this.setState({
            autoSharePercent: e.target.value,
            percentTag,
        });
    }
    hidePercentTips(type){
        if(type ==='confirm'){
            this.setState({
                showPercentTipsDialog:false,
            });
            this.initPercentInput();
        }else{
            this.createConfirm(true,true);
        }
        
    }
    clickPercentTag(percent,index){
        let percentObj = this.state.percentTag;
        percentObj.map((item,i)=>{
            if(index === i){
                item.active = true;
                
            }else{
                item.active = false;
            }
            return item
        });
        this.setState({
            percentTag: percentObj,
            autoSharePercent: percent,
        });
    }


    // PC添加新图片
    async updateBackground(event) {
        const file = event.target.files[0]
        event.target.value = '';
        try {
            const filePath = await this.props.uploadImage(file,"topicHead");
            if (filePath) {
                this.setState({
                    headUrl : filePath
                })
            }


        } catch (error) {
            console.log(error);
        }

    }

    showExample(e, type){
        e.stopPropagation();
        // let exampleUrl = '';
        // let exampleUrlType =type;
        // if(type === 'normal' ){
        //     exampleUrl = 'https://img.qlchat.com/qlLive/liveCommon/sample-normal.png';
        // }else if(type === 'ppt'){
        //     exampleUrl = 'https://img.qlchat.com/qlLive/liveCommon/sample-ppt.png';
        // }else if(type === 'audioGraphic'){
        //     exampleUrl = 'https://img.qlchat.com/qlLive/liveCommon/sample-mediaGraphic.png';
        // }else if(type === 'videoGraphic'){
        //     exampleUrl = 'https://img.qlchat.com/qlLive/liveCommon/sample-media.png';
        // }
        this.setState({
            showExampleDialog: true,
            exampleType: type,
        });
    }

    // 隐藏创建直播间弹窗
    hideCreateLiveDialog(){
        this.setState({
            showCreateLiveDialog: false,
            currentStep: 0,
            selectedLiveTag: undefined
        });
        
    }

    // 获取直播间类型列表
    async initLiveTag() {

        const hotLiveTagsRes = await request.post({
            url: "/api/wechat/transfer/h5/tag/hotLiveTags",
            body: {
                isGetParentName: 'Y'
            }
        });

        const res = await request.post({
            url: "/api/wechat/transfer/h5/tag/allLiveTags",
        });
        if(res.state.code === 0 && hotLiveTagsRes.state.code === 0) {
            this.setState({
                liveTags: res.data && res.data.allLiveTags,
                hotLiveTags: hotLiveTagsRes.data && hotLiveTagsRes.data.hotTags
            });
        }
    };





    // 示例图弹窗
    exampleDialogRender = () => {
        let type = this.state.exampleType
        if(type === 'normal' ){
            return (
                <div className="example-item">
                    <img src="https://img.qlchat.com/qlLive/liveCommon/create-normal-exam.png" alt=""/>
                </div>
            )
//             https://img.qlchat.com/qlLive/liveCommon/create-normal-example.png  <div className="tip">讲座模式</div>
// https://img.qlchat.com/qlLive/liveCommon/create-ppt-example.png    <div className="tip">幻灯片模式</div>
// https://img.qlchat.com/qlLive/liveCommon/create-audio-interactive-exam.png   <div className="tip">音频互动</div>
// https://img.qlchat.com/qlLive/liveCommon/create-audio-record-exam.png     <div className="tip">音频录播</div>
// https://img.qlchat.com/qlLive/liveCommon/create-video-record-exam.png    <div className="tip">视频录播</div>
// https://img.qlchat.com/qlLive/liveCommon/create-video-interactive-exam.png   <div className="tip">视频互动</div>
        }else if(type === 'ppt'){
            return (
                <div className="example-item">
                    <img src="https://img.qlchat.com/qlLive/liveCommon/create-ppt-exam.png" alt=""/>
                </div>
            )
        }else if(type === 'interactive'){
            return  <div className="exam-over-box">
                <div className="overflow-warp">
                    <div className="example-item">
                        <img src="https://img.qlchat.com/qlLive/liveCommon/create-video-interactive-exam.png" alt=""/>
                    </div>
                    <div className="example-item">
                        <img src="https://img.qlchat.com/qlLive/liveCommon/create-audio-interactive-exam.png" alt=""/>
                    </div>
                </div>
            </div>;
        }else if(type === 'record'){
            return <div className="exam-over-box">
                <div className="overflow-warp">
                    <div className="example-item">
                        <img src="https://img.qlchat.com/qlLive/liveCommon/create-video-record-exam.png" alt=""/>
                    </div>
                    <div className="example-item">
                        <img src="https://img.qlchat.com/qlLive/liveCommon/create-audio-record-exam.png" alt=""/>
                    </div>
                </div>
            </div>
        }
    }

    onBlur(e){
		window.scrollTo(0, document.body.scrollTop + 1);
		document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
    }
    
    // 下一步
    onNext() {
        if(!this.state.selectedLiveTag) return ;
        this.setState({currentStep: 1});
        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    onPhoneNumChange(e) {
        const val = e.target.value;
        if(validatePhoneNum(val) === true) {
            this.setState({
                phoneValid: true
            });
        } else {
            this.setState({
                phoneValid: false
            });
        }
        this.setState({
            phoneNum: val  
        })
    }
    onValidCodeChange(e) {
        const val = e.target.value;
        this.setState({
            validCode: val  
        })
    }

    // 勾选协议
    checkProtocol() {
        this.setState({
            isCheckProtocol: !this.state.isCheckProtocol
        })
    }

    // 获取验证码
    async getValidCode() {
        if((this.state.phoneValid && !this.state.isGettingValidCode && !this.state.isCounting)) {
            this.setState({
              isGettingValidCode: true  
            })
            const res = await this.props.getIdentifyingCode({
                phoneNum: this.state.phoneNum
            });
            this.setState({
                isGettingValidCode: false
            })
            if(res.state.code === 0) {
                this.setState({
                    isCounting: true
                });
                this.data.timer = setInterval(() => {
                    this.setState({countDown: this.state.countDown - 1}, () => {
                        if(this.state.countDown <= 0) {
                            clearInterval(this.data.timer);
                            this.setState({
                                isCounting: false,
                                countDown: 60
                            });
                        }
                    });
                }, 1000);
            } else {
                window.toast(res.state.msg);
            }
        }
    }

    // 创建直播间
    createLive() {
        if(!(this.state.phoneValid && this.state.validCode.length > 0 && this.state.isCheckProtocol)) return;

         // 创建直播间
        this.props
            .createLive({
                logo: "https://img.qlchat.com/qlLive/liveCommon/normalLogo.png",
                id: this.state.selectedLiveTag,
                introduce: "",
                name: "",
                phoneNum: this.state.phoneNum,
                createrDuty: 'teacher', // 固定写死讲师
                hasOfficialAccount: "N",
                officialAccount: "",
            })
            .then(result => {
                if (result && result.state && result.state.code === 0) {
                    const { live } = result.data;
                    console.log(live.liveEntityView.id);
                    
                    // 打印发送日志
                    window._qla && _qla('event', {
                        category: 'new_create_topic_success',
                        action: 'success'
                    });

                    this.createConfirm(true, undefined, live.liveEntityView.id);
                }
                
            }).catch(err => console.log(err));
    }

    async getLiveEntity() {
        const res = await this.props.getMyLiveEntity();
        if(res.state.code === 0) {
            this.setState({
                liveEntity: res.data
            })
            return res.data;
        }
    }

    // 设置单课默认信息
    setDefaultInfo() {
        // 若不存在liveId，既为创课前置
        // 且从入口页进入，需要设置默认值
        if(this.state.liveId === '' && this.props.location.query.fromCreateClass === 'Y') {
            this.setState({
                startTime: (dayjs(this.props.sysTime).add(20, 'minute').toDate()),
                topicName: `【${this.props.userInfo.name}】已创建了一门课程`
            })
        }

    }

    showProtocol() {
        this.setState({
            showProtocolDialog: true
        })
    }
    hideProtocol() {
        this.setState({
            showProtocolDialog: false
        })
    }

    render() {
        let date = new Date();
        return (
            <Page title="新建课程" className="create-topic">
            {/* 创建话题页面 */}
            {
                this.state.topicId === '' && //this.state.status ==="base"&&
                <div className="base-part">
                    <div className="create-topic-section info-form">           
                        <div className="topic-name info-input-wrap">
                            <div className="label">课程标题：</div>
                            <input className="on-log on-visible" data-log-region="Coursetitle" value={this.state.topicName} placeholder="请输入直播主题" onChange={this.changeTopicName} onBlur={this.onBlur} />
                            {/* {this.state.topicName && <i className="btn-delete" onClick={this.cleanTopicName}></i>} */}
                        </div>

                        <div className="info-input-wrap">
                            <p className="label">开始时间：</p> 
                            <DatePicker
                                mode="datetime"
                                value={dayjs(this.state.startTime)}
                                title={dayjs(this.state.startTime).format('YYYY/MM/DD HH:mm:ss').toString()}
                                onChange={this.updateStartTime}
                                minValue={dayjs(date).endOf('minute')}
                                maxValue={dayjs(date).add(6,'month').endOf('minute')}
                                style='create-top-time-picker'
                            >
                                    <div className={this.state.startTime?"topic-start-time on-log on-visible":"topic-start-time empty on-log on-visible"} data-log-region="Startingtime">
                        
                                        {
                                            this.state.startTime?
                                            <div className="placeholder">
                                                {dayjs(this.state.startTime).format('YYYY/MM/DD HH:mm:ss').toString()}
                                            </div>
                                            :
                                            <div className="title">开始时间</div>
                                        }
                                        <i className="icon_enter"></i>
                                    </div>
                            </DatePicker>
                        </div>

                        {
                            !(this.state.liveEntity && this.state.liveEntity.entityPo) && !this.state.liveId &&
                            <div className="info-input-wrap">
                                <div className="label">课程分类：</div>
                                <LiveCategoryPicker 
                                    className="value on-log on-visible"
                                    hotData={this.state.hotLiveTags}
                                    data={this.state.liveTags}
                                    labelKey={"name"}
                                    valueKey={"id"}
                                    // onCancel={}
                                    onChange={(val) => {this.setState({selectedLiveTag: val})}}
                                >
                                    <div className="on-log on-visible" data-log-region="sortingclasses">
                                        {getLiveTagName(this.state.liveTags, this.state.selectedLiveTag) || "请选择"}
                                        <i className="icon_enter"></i>
                                    </div>
                                </LiveCategoryPicker>
                            </div>
                        }

                    </div>
                        
                    <div className="create-topic-section">
                        <div className="header">
                            <p className="title">课程类型</p>
                        </div>
                        <div className="pay-type-part">
                            <div className="topic-type-list">
                                <div className={`selector ${this.state.topicType ==='normal'?"active":null} on-log on-visible`} data-log-region="Lecture" onClick={()=>this.selectTopicType('normal')}>
                                    <div className="type-icon normal"></div>
                                    <div>
                                        <div className="type">讲座形式</div>
                                        <div className="massage" >适用于语音为主的直播</div>
                                    </div>
                                    <div className="tip on-log on-visible" data-log-region="LectureQues" onClick={(e)=>this.showExample(e,'normal')}></div>
                                </div>
                                <div className={`selector ${this.state.topicType ==='ppt'?"active":null} on-log on-visible`} data-log-region="PPT" onClick={()=>this.selectTopicType('ppt')}>
                                    <div className="type-icon ppt"></div>
                                    <div>
                                        <div className="type">幻灯片形式</div>
                                        <div className="massage" >适用于图片较多的直播</div>
                                    </div>
                                    <div className="tip on-log on-visible" data-log-region="PPTQues" onClick={(e)=>this.showExample(e,'ppt')}></div>
                                </div>
                                <div className={`selector ${this.state.topicType ==='record'?"active":null} on-log on-visible`} data-log-region="Recording" onClick={()=>this.selectTopicType('record')}>
                                    <div className="type-icon record"></div>
                                    <div>
                                        <div className="type">音视频录播形式</div>
                                        <div className="massage" >适用于录制好的 音视频播放+图文展示</div>
                                    </div>
                                    <div className="tip on-log on-visible" data-log-region="RecordingQues" onClick={(e)=>this.showExample(e,'record')}></div>
                                </div>
                                <div className={`selector ${this.state.topicType ==='interactive'?"active":null} on-log on-visible`} data-log-region="interactive" onClick={()=>this.selectTopicType('interactive')}>
                                    <div className="type-icon interactive"></div>
                                    <div>
                                        <div className="type">音视频互动形式</div>
                                        <div className="massage" >适用于录制好的 音视频播放+语音互动模式</div>
                                    </div>
                                    <div className="tip on-log on-visible" data-log-region="interactiveQues" onClick={(e)=>this.showExample(e,'interactive')}></div>
                                </div>
                                
                            </div>
                          
                        </div>
                    </div>
                
                    <div className="create-topic-section">
                        <div className="header">
                            <p className="title">课程类型</p>
                        </div>
                          {/** 系列课或者训练营下的新建课程，没有选择收费类型 */}
                          { this.state.channelId === '' && this.state.campId === '' &&
                                <div className="pay-list">
                                    <a  name="pageTypee"></a>
                                    <div className={`public ${this.state.payType==="public"?"active":null} on-log`} data-log-region="free" onClick={()=>this.selectPayType('public')}>
                                        <div className="logo"></div>
                                        <div className="text">免费课</div>
                                    </div>
                                    <div className={`charge ${this.state.payType==="charge"?"active":null} on-log`} data-log-region="fee" onClick={()=>this.selectPayType('charge')}>
                                        <div className="logo"></div>
                                        <div className="text">收费课</div>
                                    </div>
                                    <div className={`encrypt ${this.state.payType==="encrypt"?"active":null} on-log`} data-log-region="password" onClick={()=>this.selectPayType('encrypt')}>
                                        <div className="logo"></div>
                                        <div className="text">加密课</div>
                                    </div>
                                </div>
                            }
                            {this.state.payType==="charge"&&<div className="type-content">
                                <div className="wrap">
                                    <div className="title">设置课程价格：</div>
                                    <input className="price-input" type="number" value={this.state.topicPrice} placeholder="最小金额1元" onChange={this.changePrice} onBlur={this.onBlur} ref={(input)=>{this.data.priceInput = input}}/>
                                </div>
                                <div className="wrap">
                                    <div className="title">
                                        设置分销比例：
                                        <div className="sub-title">分成比例0-80%</div>
                                    </div>
                                    <div className="percent-tag">
                                        {
                                            this.state.percentTag.map((item,index)=>{
                                                return <span className={`${item.active?'active':''} on-log`} data-log-region={`percent${item.percent}`} onClick={()=>this.clickPercentTag(item.percent,index)}>{item.percent}%</span>
                                            })
                                        }
                                    </div>
                                    <div className="percent-input">
                                        <div className="input-box"><input className="on-log" data-log-region="customize" value={this.state.autoSharePercent} type="number" placeholder="30" onChange={this.changePercent} onBlur={this.onBlur} /></div>

                                    </div>
                                </div>
                                <div className="tips">建议选择30%-50%的分销奖励，不但刺激用户分享课程，也能助您获得更大收益~</div>
                                
                            </div>}
                            {this.state.payType==="encrypt"&&<div className="type-content">
                                <div className="title">
                                    请输入密码
                                    <div className="sub-title">
                                    支持英文和数字，不能包含特殊符号
                                    </div>
                                </div>
                                <div className="encrypt-input-box">
                                    <input value={this.state.encryptAray.join("")} className="password-input"
                                        type="text" onChange={(e)=>this.changePassword(e)} 
                                        onFocus = {(e)=>this.encryptFocus(e)}
                                        onBlur={this.onBlur}
                                        onKeyUp = {(e)=>this.deletePass(e)} 
                                        />
                                    <div className="encrypt-box">
                                        {
                                            this.state.encryptAray.map((value,index)=>{
                                                return <div className={`${value?"input":"input empty"} ${this.state.thisEncryInputNum === index ? 'focus':null}`} 
                                                    onClick={()=>{this.encryptClick}}
                                                    key={`pass-input-${index}`}>
                                                    {value}
                                                </div>
                                            })
                                        }
                                        
                                    </div>
                                </div>
                                
                            </div>}
                    </div>
                </div> 
            }

            {
                this.state.topicId === '' && //this.state.status === "pay-type" &&
                <div className="pay-type-part">
                    
                    
                </div>
            }
            {
                <div className="confirm-bottom">
                    <div className = {["btn-confirm", this.props.location.query.fromCreateClass === 'Y' ? "on-log on-visible":null].join(' ')}
                      data-log-region="new_create_topic_btn"  onClick={()=>this.createConfirm(this.state.channelId === '' && this.state.campId === '')}>确定</div>
                </div>
                
                // !this.state.hideConfirmBtn ?
                // [
                //     this.state.status === "pay-type" &&<div className = "btn-confirm" onClick={()=>this.createConfirm(this.state.channelId === '' && this.state.campId === '')}>确定</div>,
                //     this.state.status === "base" &&<div className = "btn-confirm" onClick = {this.nextClick}>{this.state.channelId === ''&& this.state.campId === ''?'下一步':'确定'}</div>
                // ]: null
            }
                
                <MiddleDialog
                    show={this.state.showTypeTipDialog}
                    bghide
                    // titleTheme={'white'}
                    // buttons='confirm'  
                    // buttonTheme = "line"
                    className="type-tip-dialog"
                    // onBtnClick={()=>{this.setState({showTypeTipDialog:false});}}
                    onClose={()=>{this.setState({showTypeTipDialog:false});}}
                    // title={this.state.typeTipsKey === "audioGraphic" ? "音视频录播形式" : "音视频互动形式" }
                    >
                    <div className="tips" onClick={()=>{this.setState({showTypeTipDialog:false});}} >
                        该直播类型需要上传音视频文件。请先登录电脑端-千聊live管理后台； 
                        <div className="fuzhi" data-clipboard-text="http://v.qianliao.tv" onClick={(e)=>{e.stopPropagation()}}>
                            电脑端浏览器网址： <br/>
                            <span>v.qianliao.tv</span>(点击可复制)
                        </div>
                    </div>
                </MiddleDialog>
                {/* 课程类型示例 */}
                <MiddleDialog
                    show={this.state.showExampleDialog}
                    buttons='none'
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className={`example-dialog ${isPc()?'isPc':''}`}
                    onClose={()=>{this.setState({showExampleDialog:false});}}>
                        <div className="example-label">{this.exampleDialogRender()}</div>
                        <span className="close" onClick={()=>{this.setState({showExampleDialog:false});}}></span>
                </MiddleDialog>
                <MiddleDialog
                    show={this.state.showPercentTipsDialog}
                    buttons='cancel-confirm'  
                    buttonTheme = "line"
                    confirmText = '重新设置'
                    cancelText = '确定'
                    theme='empty'
                    bghide = {false}
                    titleTheme={'white'}
                    className="percent-confirm-dialog"
                    onBtnClick={this.hidePercentTips}
                    onClose = {this.hidePercentTips}
                    title="您确定要把分销奖励设为0%吗？"
                    >
                        <div className="tips">用户分享课程将没有奖励，不利于课程推广，您无法获得最大的课程收益~</div>
                </MiddleDialog>
                <MiddleDialog
                    show={this.state.showCreateLiveDialog}
                    buttons='none'  
                    buttonTheme = "line"
                    theme='empty'
                    bghide = {false}
                    titleTheme={'white'}
                    className="create-live-dialog"
                    onClose = {this.hideCreateLiveDialog}
                    >
                        <LiveDialogContent 
                            currentStep={this.state.currentStep} // 当前步骤
                            liveTags={this.state.liveTags} // 直播间标签列表
                            selectedLiveTag={this.state.selectedLiveTag} // 选中的LiveTag
                            isCheckProtocol={this.state.isCheckProtocol} // 是否勾选协议
                            checkProtocol={this.checkProtocol} // 勾选协议回调
                            phoneNum={this.state.phoneNum} // 电话号码
                            phoneValid={this.state.phoneValid} // 电话号码是否合法
                            isCounting={this.state.isCounting} // 是否正在验证码倒计时
                            countDown={this.state.countDown} // 倒计时
                            validCode={this.state.validCode}
                            isGettingValidCode={this.state.isGettingValidCode} // 是否正在获取验证码
                            onSelected={(tagId) => {this.setState({selectedLiveTag: tagId})}} // 选择liveTag回调
                            onNext={this.onNext} // 下一步
                            onPhoneNumChange={this.onPhoneNumChange} // 电话号码回调
                            onValidCodeChange={this.onValidCodeChange}
                            getValidCode={this.getValidCode} // 获取验证码回调
                            createLive={this.createLive}
                            onClose={this.hideCreateLiveDialog}
                            showProtocol={this.showProtocol}
                        ></LiveDialogContent>
                </MiddleDialog>
                {
                    this.state.showProtocolDialog &&
                    createPortal(
                        <MiddleDialog
                            show={true}
                            buttons='none'  
                            buttonTheme = "line"
                            theme='empty'
                            bghide = {false}
                            titleTheme={'white'}
                            className="create-live-dialog"
                        >
                                <div className="protocol-dialog create-topic">   
                                    <span className="close-btn" onClick={this.hideProtocol}>
                                        <img src={require('./img/close.png')} alt=""/>
                                    </span>
                                <ProtocolPage></ProtocolPage>
                                </div>
                        </MiddleDialog>,
                        document.querySelector('.portal-high')
                    )
                }
            </Page>
        );
    }
}

function mstp(state) {
    return {
        sysTime: state.common.sysTime,
        userInfo: state.common.userInfo && state.common.userInfo.user
    }
}

const matp = {
    fetchUserPower,
    uploadImage,
    getStsAuth,
    createNewTopic,
    getMyLiveEntity,
    getLiveTag,
    getIdentifyingCode,
    createLive,
    getUserInfo
}

export default connect(mstp, matp)(CreateTopic)

function LiveDialogContent(props) {
    return (
        <div className="live-dialog-content">
            <div className="header">
                输入手机号，完成创建
                <span className="close-btn" onClick={props.onClose}>
                    <img src={require('./img/close.png')} alt=""/>
                </span>
            </div>
            <div className="input-wrap">
                <div className="input-item">
                    <input className="on-log"
                        onBlur={() => {window.scrollTo(0, 0)}}
                        data-log-region="new_create_topic_vcode1" type="text" value={props.phoneNum} onChange={props.onPhoneNumChange} placeholder="输入手机号"/>
                </div>
                <div className="input-item valid-code">
                    <input 
                        value={props.validCode} 
                        onChange={props.onValidCodeChange} 
                        onBlur={() => {window.scrollTo(0, 0)}}
                        type="text" 
                        placeholder="输入验证码"/>
                    <div 
                        className={["valid-code-btn on-log", (props.phoneValid && !props.isGettingValidCode && !props.isCounting) ? null : 'disabled'].join(' ')}
                        data-log-region="new_create_topic_vcode"
                        onClick={props.getValidCode}
                    >
                        {props.isCounting === true ? (props.countDown + ' 重新获取') : '获取验证码'}
                    </div>
                </div>
            </div>
            <p className="check-protocol">
                <span className="on-log"
                    data-log-region="new_create_topic_agreement"
                onClick={props.checkProtocol}>
                    {props.isCheckProtocol ? 
                        <img src={require('./img/protocol-checked.png')} alt=""/>
                        :   
                        <img src={require('./img/protocol-check.png')} alt=""/>
                    }
                            勾选表示您同意
                </span>
                <span className="proto" onClick={props.showProtocol}>《千聊平台服务协议》</span>
            </p>
            <div 
                className={["bottom-btn on-log on-visible", !(props.phoneValid && props.validCode.length > 0 && props.isCheckProtocol) ? 'disabled' : null].join(' ')}
                data-log-region="new_create_builded"
                onClick={props.createLive}
            >
                完成创建
            </div>
        
        </div>
    )
} 

function validatePhoneNum(phone) {
    /* const reg = /^1[3456789]\d{9}$/ */
    return phone !== undefined && phone.length === 11;
}

function getLiveTagName(data, value) {
    if(data) {
        for(let i = 0; i < data.length ; i++) {
            if(data[i].children) {
                for(let j = 0; j < data[i].children.length; j++) {
                    if(data[i].children[j].id == value) {
                        return `${data[i].name}/${data[i].children[j].name}`;
                    }
                }
            }
        }
    }
}