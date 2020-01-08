import React, { Fragment } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import Cell from './components/cell';
import { MiddleDialog } from 'components/dialog';
import { imgUrlFormat, formatMoney, validLegal } from 'components/util';
import Detect from 'components/detect';
import DatePicker from 'components/date-picker';
import dayjs from 'dayjs';
import Clipboard from 'clipboard';
import { eventLog } from 'components/log-util';
import ConfirmDialog from '../../../components/confirm-dialog'
import { EditCourseBanner } from "../../components/edit-course-banner";
import { MiddleDialog as MiddleDialog2 } from "../../components/middle-dialog";
import { TemplateIntroComponent } from "../../components/template-intro-components";
import OptimizeTipDialog from 'components/optimize-dialog'
import { request } from 'common_actions/common'
import Switch from "components/switch";

import {
    getTopicSimple,
    updateValue,
    setShareStatus,
    setIsNeedAuth,
    updateTopic,
    getPassword,
    getChannelOrTopicOptimize
} from '../../actions/topic-intro-edit';

import {
    uploadImage,
} from '../../actions/common';

import {
    getEditorSummary,
} from '../../actions/editor';

class TopicIntroEdit extends React.Component {
    state = {
        middleDialog: false,
        encryptAray:["","","","","",""],
        thisEncryInputNum:'',
        topicDesc: '',
        showUseIntro: false,
        // 模板使用介绍弹窗类型
        templateIntroType: '',
        // 概要是否需要优化
        descStatus: 'N',
        // 头图是否需要优化
        headImageStatus: 'N',
        // 标题是否需要优化
        nameStatus: 'N',
        // 优化点
        optimizePoint: '',
        // 显示优化弹窗
        showOptimizeDialog: false,
        //是否开启弹幕
        isOpenBarrage: 'N'
    }
    data = {
        encryptAray:["","","","","",""],
        passwordInput: new Array(6),
        percentChangeEnable:true,
        showPwdBox: this.props.location.query.showPwdBox,
    }

    middleInput = ''

    async componentDidMount () {
        await this.props.getTopicSimple(this.props.location.query.topicId);
        
        const res = await request({
            url: '/api/wechat/transfer/h5/courseExtend/getCourseConfig',
            method: 'POST',
            body: {
                businessType: 'topic',
                businessId: this.props.location.query.topicId,
                function: 'intro_barrage_switch'
            }
        })

        this.setState({
            topicPrice : this.props.topicInfo.money?formatMoney(this.props.topicInfo.money):'',
            isOpenBarrage: res?.data?.flag || 'N'
        });
        if(this.props.topicInfo.type == 'encrypt'){
            this.props.getPassword(this.props.location.query.topicId);
        }
        
        this.initStsInfo();
        this.getEditorSummary();
        this.copyDefine();

        // 如果query中带有showPwdBox参数，则自动弹出密码更改对话框
        if (this.data.showPwdBox === 'Y') {
            this.showMimaDialog();
        }
        this.topicOptimize()
        console.log(this.props.topicInfo)
    }

    // 判断课程是否需要优化
    topicOptimize = async() => {
        const result = await getChannelOrTopicOptimize({
            businessId: this.props.location.query.topicId,
            type: 'topic',
        })
        if(result.state.code === 0){
            this.setState({
                descStatus: result.data.descStatus,
                headImageStatus: result.data.headImageStatus,
                nameStatus: result.data.nameStatus
            })
        }
    }

    copyDefine(){
        //复制定制
        var clipboard = new Clipboard(".fuzhi");
        clipboard.on('success', function(e) {
            window.toast('已复制课程链接');
        });
        clipboard.on('error', function(e) {
            window.toast('复制失败！请进入详情页点击右上角复制');
		});
    }

    initStsInfo() {
        const script = document.createElement('script');
        script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
        document.body.appendChild(script);
    }

    showMiddleDialog = ({title, content, placeholder, key}) => {
        return () => {
            this.setState({
                middleDialog: {
                    title,
                    content,
                    placeholder,
                    key
                }
            },()=>{
                    this.middleInput.focus();
            })
        }
    }

    getEditorSummary = async () => {
        let result = await this.props.getEditorSummary(this.props.location.query.topicId, 'topic');
        if (result.state.code == 0) {
            this.setState({
                topicDesc: result.data.content
            })
        }
    }

    middleDialogClick = (op) => {
        
        if (op === 'cancel') {
            this.setState({
                middleDialog: false
            })
        } else {

            switch (this.state.middleDialog.key) {
                case 'speaker':
                    if (this.middleInput.value.length && !validLegal('text', '主讲人', this.middleInput.value, 32)) return false;
                    break;
                case 'guestIntr':
                    if (this.middleInput.value.length && !validLegal('text', '主讲人介绍', this.middleInput.value, 200)) return false;
                    break;
            }

            this.props.updateValue({
                key: this.state.middleDialog.key,
                value: this.middleInput.value||''
            })
            this.setState({
                middleDialog: false
            })
            
        }
    }

    closeMiddleDialog = () => {
        this.setState({
            middleDialog: false
        })
    }

    setIsNeedAuth = () => {
        this.props.setIsNeedAuth(this.props.location.query.topicId, this.props.topicInfo.isNeedAuth === 'Y' ? 'N' :'Y');
        eventLog({
            category: this.props.topicInfo.isNeedAuth === 'Y' ? 'edit-isNeedAuth-N' : 'edit-isNeedAuth-Y',
            action:'success',
            business_id: this.data.topicId,
            business_type: 'topic',
        });
    }

    setShareStatus = async  () => {
        if(this.data.percentChangeEnable){
            this.data.percentChangeEnable = false;
            let result = await this.props.setShareStatus(this.props.location.query.topicId, this.props.topicInfo.isShareOpen === 'Y' ? 'N' :'Y');
            if(result.state.code === 0){
                this.data.percentChangeEnable = true;
            }
            
        }
        
    }

    // 弹幕开关
    switchBarrageClick = async () => {
        let isOpenBarrage = this.state.isOpenBarrage
        if(isOpenBarrage == 'N'){
            isOpenBarrage = 'Y'
        }else {
            isOpenBarrage = 'N'
        }
        
        const res = await request({
            url: '/api/wechat/transfer/h5/courseExtend/saveCourseConfig',
            method: 'POST',
            body: {
                businessType: 'topic',
                businessId: this.props.location.query.topicId,
                function: 'intro_barrage_switch',
                flag: isOpenBarrage
            }
        })
        if (res && res.state && res.state.code == 0) {
            this.setState({isOpenBarrage})
        }
    }

    updateTopic = async () => {
        let result = await this.props.updateTopic({ ...this.props.topicInfo, isAutoShareOpen: this.props.topicInfo.isAutoshareOpen }); // 需要兼容大写 后端需要大写
        if (result.state) {
            window.toast(result.state.msg)
        }
        if (result.state && result.state.code === 0) {
            setTimeout(() => {
                location.href = `/wechat/page/topic-intro?topicId=${this.props.topicInfo.id}`
            }, 300);
        }
    }

    uploadImage = async (e) => {
        const file = e.target.files[0];
        let backgroundUrl = await this.props.uploadImage(file, 'topicBackground');
        if (backgroundUrl) {
            this.props.updateValue({key: 'backgroundUrl', value: backgroundUrl})
        };
    }

    updateStartTime = (e) => {
        this.props.updateValue({key: 'startTime', value: dayjs(e).unix()*1000})
    }
    updateEndTime = (e) => {
        this.props.updateValue({key: 'endTime', value: dayjs(e).unix()*1000})
    }

    updateRemark = async () => {
        if (this.state.topicDesc) {
            this.setState({
                remarkDialog: true
            })
        } else {
            let result = await this.props.updateTopic(this.props.topicInfo);
            if (result.state && result.state.code === 0) {
                window.toast(result.state.msg)
                setTimeout(() => {
                    location.href = `/live/topic/profile/jump.htm?topicId=${this.props.topicInfo.id}&type=image`
                }, 300);
            }
        }
    }

    updateRemarkByH5 = async () => {  
        this.setState({
            remarkDialog: false
        })
    }

    goToPc = () => {
        this.setState({
            remarkDialog: false
        })
    }

    notChangeTime = () => {
        if (this.props.topicInfo.isRelayChannel == 'Y') {
            window.toast('转载的课程不支持修改时间')
        }
    }

    //修改话题名称
    changeName(e){
        this.props.updateValue({key: 'topic', value: e.target.value })
    }
    //修改价格
    async changePrice(e){
        let priceValue = e.target.value||'';
        await this.props.updateValue({key: 'money', value: Math.round(priceValue*100)})
        this.setState({
            topicPrice: priceValue,
        });
    }

    //修改密码
    showMimaDialog(){//显示修改密码弹框，同时清空对话框内容让用户重新输入密码
        this.data.encryptAray = ["","","","","",""];
        this.setState({
            showMimaDialog:true,
            thisEncryInputNum: '',
            encryptAray:["","","","","",""],
        });
    }
    hidePasswordBox(){
        this.setState({
            showMimaDialog:false,
        });
    }
    mimaBoxConfirm(){
        let password = this.state.encryptAray;
        if (!validLegal('password','课程密码',password.join(""), 6)) return false;
        this.props.updateValue({
            key: 'password',
            value: password.join("")||''
        })
        this.setState({
            showMimaDialog:false,
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
            num = (value.length-1>=0)?value.length-1: index;
            this.data.encryptAray[num] = '';
        }
        this.setState({
            encryptAray: this.data.encryptAray,
            thisEncryInputNum: num,
        });
    }

    // 显示优化示例弹窗
    showOptimizeDialog(type){
        this.setState({
            showOptimizeDialog: true,
            optimizePoint: type
        })
    }
    
    encryptFocus(e){
        this.setState({
            thisEncryInputNum: this.state.thisEncryInputNum || 0 ,
        });
    }

    render () {
        let isChannelAndIsSingleBuy = this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy == 'N'
        return (
            <Page className="topic-intro-edit" title="介绍页编辑">
                <MiddleDialog2 show={this.state.showUseIntro} onClose={() => {
                    this.setState({
                        showUseIntro: false
                    })
                }}>
                    <TemplateIntroComponent 
                        onCopyURL={() => {
                            window._qla && window._qla("click", {
                                region: 'CopyAddress',
                                pos: 'topic-edit'
                            })
                        }}
                        type = {this.state.templateIntroType}
                        hide = {()=>{this.setState({showUseIntro: false})}}
                        onClickIntro={() => {
                            window._qla && window._qla('click', {
                                region: 'ViewTutorial',
                                pos: 'topic-edit'
                            })
                        }}
                    />
                </MiddleDialog2>
                
                <div className="edit-box">
                    <div className="cell-group dont-need-margin-bottom">
                        <Cell
                            label="设置头图"
                            className="cell-with-image"
                            optimizeTip = {this.state.headImageStatus == 'Y' && !isChannelAndIsSingleBuy}
                            labelTip = {this.state.headImageStatus == 'Y' && !isChannelAndIsSingleBuy ? '当前默认封面，建议上传新的' : ''}
                            showOptimizeDialog = {this.showOptimizeDialog.bind(this, 'courseHeadImage')}
                            needExample = {true}
                            exampleRegionLog = "topic_cover_example"
                        >
                            <div className="right-row">
                                <label className="file-wrap">
                                    {
                                        this.props.topicInfo.backgroundUrl ? 
                                        <div className="background-image-url" style={{backgroundImage: `url(${imgUrlFormat(this.props.topicInfo.backgroundUrl)})`}}></div> 
                                        :
                                        <div className="placeholder">800*500</div>
                                    }
                                    <input type="file" className="file" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp" onChange={this.uploadImage}/>
                                </label>
                            </div>
                        </Cell>
                    </div>
                    <EditCourseBanner 
                        type = "headImage"
                        onDetails={() => {
                            window._qla && window._qla('click', {
                                region: "DetailsClick",
                                pos: 'topic-edit'
                            })
                            this.setState({
                                showUseIntro: true,
                                templateIntroType: 'headImage'
                            })
                        }}
                    />
                    <div className="cell-group">
                        <Cell
                            label="主题名称"
                            optimizeTip = {this.state.nameStatus == 'Y' && !isChannelAndIsSingleBuy}
                            needExample = {true}
                            exampleRegionLog = "topic_title_example"
                            showOptimizeDialog = {this.showOptimizeDialog.bind(this, 'courseTitle')}
                        >
                            <div className="right-row">
                                <input value={this.props.topicInfo.topic}
                                    placeholder="请输入主题名称"
                                    onChange={this.changeName.bind(this)} />
                            </div>
                        </Cell>
                        <Cell
                            label="开始时间"
                        >   
                            {
                                (this.props.topicInfo.status === 'beginning' && this.props.topicInfo.startTime > this.props.sysTime && this.props.topicInfo.isRelay != 'Y' && this.props.topicInfo.isRelayChannel != 'Y')? 
                                <DatePicker
                                    mode="datetime"
                                    value={dayjs(this.props.topicInfo.startTime)}
                                    title={dayjs(this.props.topicInfo.startTime).format('YYYY/MM/DD HH:mm:ss').toString()}
                                    onChange={this.updateStartTime}
                                    minValue={dayjs(this.props.sytTime).endOf('minute')}
                                    maxValue={dayjs(this.props.sytTime).add(6,'month').endOf('minute')}
                                    style='edit-top-time-picker'
                                >
                                    <div className="right-row">
                                        <div className="placeholder">
                                            {dayjs(this.props.topicInfo.startTime).format('YYYY/MM/DD HH:mm:ss').toString()}
                                        </div>
                                    </div>
                                </DatePicker>
                                :
                                <div className="right-row" onClick={this.notChangeTime}>
                                    <div className="placeholder">
                                        {dayjs(this.props.topicInfo.startTime).format('YYYY/MM/DD HH:mm:ss').toString()}
                                    </div>
                                </div>
                            }
                        </Cell>
                        {
                            /^(audio|video)$/.test(this.props.topicInfo.style) ? 
                            <Cell
                                label="结束时间"
                            >   
                                {
                                    (this.props.topicInfo.status === 'beginning' && this.props.topicInfo.endTime && this.props.topicInfo.isRelay !='Y' && this.props.topicInfo.isRelayChannel != 'Y')? 
                                    <DatePicker
                                        mode="datetime"
                                        value={dayjs(this.props.topicInfo.endTime)}
                                        title={dayjs(this.props.topicInfo.endTime).format('YYYY/MM/DD HH:mm:ss').toString()}
                                        onChange={this.updateEndTime}
                                        minValue={dayjs(this.props.topicInfo.startTime).endOf('minute')}
                                        maxValue={dayjs(this.props.topicInfo.startTime).add(6,'month').endOf('minute')}
                                        style='edit-top-time-picker'
                                    >
                                        <div className="right-row">
                                            <div className="placeholder">
                                                {dayjs(this.props.topicInfo.endTime).format('YYYY/MM/DD HH:mm:ss').toString()}
                                            </div>
                                        </div>
                                    </DatePicker>
                                    :
                                    <div className="right-row" onClick={this.notChangeTime}>
                                        <div className="placeholder">
                                            {dayjs(this.props.topicInfo.endTime).format('YYYY/MM/DD HH:mm:ss').toString()}
                                        </div>
                                    </div>
                                }
                            </Cell>
                            :null    
                        }
                        {
                            this.props.topicInfo.type == 'encrypt' ? 
                            <Cell
                                label="密码修改"
                            >
                                <div className="right-row" onClick={()=>{this.showMimaDialog()}}>
                                    <div className="placeholder">{this.props.topicInfo.password}</div>
                                </div>
                            </Cell>
                            : null
                        }
                        {/* 
                            1. 付费单课或者系列课单节购买课程 
                            2. 不是转播课程
                        */}
                        {
                            (this.props.topicInfo.type == 'charge' && this.props.topicInfo.isRelay !='Y' && ( (!this.props.topicInfo.channelId && !this.props.topicInfo.campId) || this.props.topicInfo.isSingleBuy == 'Y') ) ? 
                            <Cell
                                label="设置价格"
                            >
                                <div className="right-row">
                                    <input value={this.state.topicPrice}
                                        type="number" 
                                        placeholder={"请输入门票价格"}
                                        onChange={this.changePrice.bind(this)} />
                                </div>
                            </Cell>
                            : null
                        }
                        
                    </div>
                    <div className="cell-group dont-need-margin-bottom">
                        <Cell
                            label="填写主讲人"
                        >
                            <div className="right-row" onClick={this.showMiddleDialog({
                                title: '填写主讲人',
                                placeholder: '请填写主讲人名称，多个主讲人或嘉宾请用空格隔开',
                                content: this.props.topicInfo.speaker,
                                key: 'speaker'
                            })}>
                                <div className="placeholder">{this.props.topicInfo.speaker || '未设置'}</div>
                            </div>
                        </Cell>
                        <Cell
                            label="主讲人介绍"
                        >
                            <div className="right-row" onClick={this.showMiddleDialog({
                                title: '主讲人或嘉宾介绍',
                                content: this.props.topicInfo.guestIntr,
                                placeholder: '请填写主讲人或嘉宾介绍',
                                key: 'guestIntr'
                            })}>
                                <div className="placeholder">
                                    {this.props.topicInfo.guestIntr || '未设置'}
                                </div>
                            </div>
                        </Cell>
                        <Cell
                            label="课程概要"
                            optimizeTip = {this.state.descStatus == 'Y' && !isChannelAndIsSingleBuy}
                            needExample = {true}
                            exampleRegionLog = "topic_introduce_example"
                            showOptimizeDialog = {this.showOptimizeDialog.bind(this, 'courseSummary')}
                        >
                            <div className="right-row summary" onClick={this.updateRemark}>
                                <div className="placeholder">{this.props.topicInfo.remark}</div>
                            </div>
                        </Cell>
                        <EditCourseBanner 
                            type = "courseIntro"
                            onDetails={() => {
                                this.setState({
                                    showUseIntro: true,
                                    templateIntroType: 'courseIntro'
                                })
                            }}
                        />
                    </div>
                    {
                        //非系列课内 -- 先注释，产品也不知道为什么系列课不允许设置
                        // !this.props.topicInfo.channelId &&
                        !this.props.topicInfo.campId?
                        <Fragment>
                            <div className="cell-group">
                                <Cell
                                    label="分享榜"
                                >
                                    <Switch className="bonus-switcher" active={this.props.topicInfo.isShareOpen == 'Y'} onChange={this.setShareStatus} />
                                </Cell>
                            </div>
                            <div className="tips">开启后，分享排行榜会展示在课程简介中，刺激用户把课程分享给好友，提高成交量。</div>
                        </Fragment>
                         :
                        null
                    }

                    {
                        !isChannelAndIsSingleBuy ? 
                        <Fragment>
                            <div className="cell-group course-barrage">
                                <Cell
                                    label="动态弹幕"
                                    needExample = {true}
                                    exampleRegionLog = "topic_barrage_example"
                                    showOptimizeDialog = {this.showOptimizeDialog.bind(this, 'courseBarrage')}
                                >
                                    <Switch className="bonus-switcher" active={this.state.isOpenBarrage == 'Y'} onChange={this.switchBarrageClick} />
                                </Cell>
                            </div>
                            <div className="tips">开启后，会在课程介绍展示报名动态，营造热销氛围，刺激用户下单。</div>
                        </Fragment> : null
                    }
                    
                    {
                        this.props.topicInfo.type == 'public' &&
                    <div className="cell-group">
                        <Cell
                            label="开启介绍页"
                        >
                            <Switch className="bonus-switcher" active={this.props.topicInfo.isNeedAuth == 'Y'} onChange={this.setIsNeedAuth} />
                        </Cell>
                    </div>
                    }
                    
                    {/* <div className="cell-group">
                        <Cell
                                label="微信站外导流（qq,微博等）"
                            >
                            <div className="btn-copy fuzhi" data-clipboard-text={`${window.location.origin}/topic/details?topicId=${this.props.topicInfo.id}`}> 复制课程链接</div>
                        </Cell>
                    </div>
                    <div className="tips">只适用于单节免费课，用户可以通过该链接直接听课，无须报名。</div> */}
                </div>
                <div className="btn-container">
                    <div className="submit-btn" onClick={this.updateTopic}>确认</div>
                </div>
                <MiddleDialog
                    show={!!this.state.middleDialog}
                    title={this.state.middleDialog.title}
                    onBtnClick={this.middleDialogClick}
                    onClose={this.closeMiddleDialog}
                    className ="speaker-change-dialog"
                >   
                    <div className="btn-complite" onClick={this.middleDialogClick}>完成</div>
                    <div className="box">
                        <textarea className="middle-input" defaultValue={this.state.middleDialog.content} placeholder={this.state.middleDialog.placeholder} ref={(input) => {
                            this.middleInput = input
                        }}
                        >
                        </textarea>
                    </div>
                </MiddleDialog>

                <MiddleDialog
                    show={this.state.showSpeakerChangeDialog}
                    buttons='none'
                    bghide
                    className="speaker-change-dialog"
                    onClose={() => {}}
                    title='填写主讲人'>
                    <div className="btn-complite" onClick={this.speakerBoxConfirm}>完成</div>
                    <div className="box">
                        <textArea placeholder="请填写主讲人名称。多个主讲人或者嘉宾请用空格隔开"
                            onChange={this.changeSpeaker}
                        >{this.state.topicSpeakerInput||''}</textArea>
                    </div>
                </MiddleDialog>
                <MiddleDialog
                    show={this.state.showSpeakerIntroChangeDialog}
                    buttons='none'
                    bghide
                    className="speaker-change-dialog"
                    onClose={() => {}}
                    title='填写主讲人介绍'>
                    <div className="btn-complite" onClick={this.speakerIntroBoxConfirm}>完成</div>
                    <div className="box">
                        <textArea placeholder="请填写主讲人介绍。"
                            onChange={this.changeSpeakerIntro}
                        >{this.state.topicSpeakerIntroInput||''}</textArea>
                    </div>
                </MiddleDialog>
                <MiddleDialog
                    show={this.state.showMimaDialog}
                    buttons='none'
                    bghide
                    id="speaker-change-dialog"
                    className="speaker-change-dialog"
                    onClose={this.hidePasswordBox.bind(this)}
                    title="请输入新密码">
                    <div className="btn-complite" onClick={this.mimaBoxConfirm.bind(this)}>完成</div>
                    <div className="encrypt-input-box">
                        <input value={this.state.encryptAray.join("")} className="password-input"
                            type="text" onChange={(e)=>this.changePassword(e)}
                            ref={(input)=>{this.data.passwordInput=input}}
                            onFocus = {(e)=>this.encryptFocus(e)}
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
                </MiddleDialog>
                {
                    this.state.remarkDialog ? 
                    <ConfirmDialog
                        headerText="课程概要"
                        onClose={() => { this.setState({
                            remarkDialog: false
                        })}}
                        confirmText="复制地址"
                        cancelText="我知道了"
                        onConfirm={this.goToPc}
                        onCancel={this.updateRemarkByH5}
                    >   
                        <div>此介绍含有富文本模版内容，请到千聊电脑端管理后台进行编辑</div>
                        <div>访问地址：<a style={{color: '#4A8DE3'}} href="http://pc.qlchat.com">http://pc.qlchat.com</a></div>
                    </ConfirmDialog> : null
                }
                <OptimizeTipDialog 
                    showOptimizeDialog = {this.state.showOptimizeDialog}
                    optimizePoint = {this.state.optimizePoint}
                    hide = {()=>{this.setState({showOptimizeDialog: false})}}
                />
            </Page>
        )
    }
}

function mapStateToProps (state) {
    return {
        topicInfo: state.topicIntroEdit.topicInfo,
        sysTime: state.common.sysTime
    }
}

const mapActionToProps = {
    getTopicSimple,
    updateValue,
    setShareStatus,
    setIsNeedAuth,
    updateTopic,
    uploadImage,
    getEditorSummary,
    getPassword
}

module.exports = connect(mapStateToProps, mapActionToProps)(TopicIntroEdit); 