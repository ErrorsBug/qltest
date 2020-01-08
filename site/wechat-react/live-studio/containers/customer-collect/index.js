import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import { connect } from 'react-redux';
// components
import Page from 'components/page'
import {validLegal, getVal} from 'components/util'
import dayjs from 'dayjs'
import { isQlchat } from 'components/envi'

import {imgUrlFormat,locationTo } from 'components/util';

import Name from './components/name'
import DateItem from './components/date-item'
import PhoneNumber from './components/phone-number'
import Address from './components/address'
import NormalText from './components/normal-text'
import Sex from './components/sex'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import QRImg from 'components/qr-img';

import {
    regionSelect,
    saveStudentInfo,
    fetchFormFields,
    checkUser,
    getUserDetail,
} from '../../actions/collection'
import {
    getUserInfo
} from '../../actions/live'
import { sendValidCode, checkValidCode } from '../../actions/live-studio';


// actions
import {
    getChannelInfo,
    fetchFreeBuy,
} from 'actions/channel';

import {
    publicApply,
} from 'thousand_live_actions/thousand-live-common';
import Detect from "components/detect";

import {isWeixin} from 'components/envi'

@HandleAppFunHoc
@autobind
class CustomerCollect extends Component {

    state = {
        // 是否必填
        openStatus: "open",
        areaValue: [],
        areaLabel: [],
        areaArray: [],
        fields: [],
        // 用户信息
        user: {},
        // 页面标题
        title:'',

        step: 0, // 填写步骤
        qrUrl: '',
        loading: true,
        hasCheckPhone: false, // 是否需要校验手机号
        validCode: {}
    }

    data = {
        // 防止数据重复提交
        canSaveData : true,
    }

    componentDidMount() {
        this.getRegionProvince();
        this.getUserInfo();
        // this.checkUser();
        this.getTypeInfo();
        this.fetchFormFields();

        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    /**
     * 获取表单设置
     * 
     * @memberof CustomerCollect
     */
    async fetchFormFields() {
        let result = await this.props.fetchFormFields({ liveId: this.liveId, configId: this.configId });
        if (result.state && result.state.code == 0) {
            await this.setState({
                fields:result.data.config.fields,
                openStatus:result.data.config.openStatus,
                title:result.data.config.title,
                qrUrl: this.props.location.query.qrUrl ? decodeURIComponent(this.props.location.query.qrUrl) : '',
            }, () => {
                this.getUserDetail();
            })
        }
        
    }
    
    async getUserInfo() {
        let result = await this.props.getUserInfo();
        if (result && result.user) {
            this.setState({
                user:result.user
            })
        }
    }

    get liveId () {
        return this.props.router.params.liveId
    }

    get configId () {
        return this.props.location.query.configId
    }

    get scene () {
        return this.props.location.query.scene
    }

    /**
     *
     *获取学生填写信息
     * @memberof CustomerCollect
     */
    async getUserDetail() {
        let result = await this.props.getUserDetail({ liveId: this.liveId, configId: this.configId });
        let infoData = getVal(result, 'data.infoData', {});
        let fields = this.state.fields.map((item) => {
            if (item.fieldName == 'addressData') {
                item.content = infoData['address'];
            }else if (item.fieldName =='birthday' ) {
                item.content = infoData['birthday'] && dayjs(infoData['birthday']).format('YYYY-MM-DD') || ''
            }else if (infoData[item.fieldName]) {
                item.content = infoData[item.fieldName];
            }
            return item;
        });

        
        let newValue = getVal(result, 'data.infoData.provinceId', '') ? [getVal(result, 'data.infoData.provinceId', ''), getVal(result, 'data.infoData.cityId', '')] : [];
        let areaLabel = getVal(result, 'data.infoData.province', '') ? [getVal(result, 'data.infoData.province', ''), getVal(result, 'data.infoData.city', '')] : [];
        
        let states = {
            fields,
            loading: false
        }
        if (newValue.length) {
            this.getRegionCity(newValue[0])
            states.areaValue = newValue;
            states.areaLabel = areaLabel;
        }
        this.setState(states)
    }

    async getUserInfo() {
        let result = await this.props.getUserInfo();
        if (result && result.user) {
            this.setState({
                user:result.user
            })
        }
    }


    async getTypeInfo() {
        let type = this.props.location.query.type;
        switch (type) {
            case 'channel-cut':
            case 'channel':
                let result = await this.props.getChannelInfo(this.props.location.query.channelId);
                if (result.data && result.data.chargeConfigs){
                    this.setState({
                        channel:result.data
                    })
                }
                break;
        }
    }

    /**
     * 判断是否填过表单，如果填过就调回页面，防止重复填写表单
     * 
     * @memberof CustomerCollect
     */
    async checkUser() {
        let businessType = (this.props.location.query.type||'').replace(/(topic\-channel)|(channel\-cut)/gi,'channel');
        let businessId = this.props.location.query.channelId || this.props.location.query.topicId || this.props.location.query.vipId;
        let result = await this.props.checkUser({ liveId: this.props.router.params.liveId ,businessType:businessType,businessId:businessId});
        if (result.state && result.state.code == 0) {
            if (result.data.status != 'Y') {
                this.passToPay();
            }
            
        }
    }


    /**
     * 
     * 初始化城市数据
     * @memberof CustomerCollect
     */
    async getRegionProvince() {
        let provinceResult = await this.props.regionSelect({ pid: '' });
        if (provinceResult.state && provinceResult.state.code == 0) {
            let areaArray = provinceResult.data.regions.map(item => {
                return {
                    label: item.name,
                    value: String(item.id),
                    children:[{label: '', value: '0'}]
                }
            })
            this.setState({
                areaArray,
            }, async () => {
                let city = await this.getRegionCity(this.state.areaArray[0].value);
                let areaValue = [String(areaArray[0].value), String(city.data.regions[0].id)];
                if (city.data) {
                    this.setState({
                        areaValue: areaValue,
                    })
                }
            })


        }

    }

    /**
     * 获取市级列表
     * 
     * @param {any} id 
     * @returns 
     * @memberof CustomerCollect
     */
    async getRegionCity(id) {
        let cityResult = await this.props.regionSelect({ pid: id });

        if (cityResult.state && cityResult.state.code == 0) {
            let cityArray = cityResult.data.regions.map(item => {
                return {
                    label: item.name,
                    value: String(item.id),
                }
            })

            let areaArray = this.state.areaArray.map((item) => {
                if (id == item.value) {
                    return {
                        ...item,
                        children:cityArray||[...item.children,...cityArray]
                    }
                } else {
                    return item
                }
            })
            this.setState({
                areaArray:[...areaArray]
            })
        }
        return cityResult;
    }



    /**
     * 确定选择城市
     * 
     * @param {any} newValue 
     * @memberof CustomerCollect
     */
    addressHandleChange(newValue) {
        let provinceId = newValue[0];
        let provinceData = this.state.areaArray.filter(item => item.value == provinceId);
        let cityId = newValue[1];
        let cityData = provinceData[0].children.filter(item => item.value == cityId);

        this.setState({
            areaValue: newValue,
            areaLabel: [provinceData[0].label, cityData[0].label ||'']
        });
    }
    /**
     * 选择城市时更新数据
     * 
     * @param {any} newValue 
     * @memberof CustomerCollect
     */
    addressHandlePickerChange(newValue) {
        let provinceId = newValue[0];
        let provinceData = this.state.areaArray.filter(item => item.value == provinceId);
        if (newValue[0] != this.state.areaValue[0] && provinceData[0].children.length < 2) {
            this.getRegionCity(newValue[0]);
        }
    }   

    /**
     * 更新填写数据
     * 
     * @param {any} index 
     * @param {any} content 
     * @memberof CustomerCollect
     */
    changeData(index,content) {
        let fields = this.state.fields;
        fields[index].content = content;
        this.setState({
            fields
        })
    }




    /**
     * 跳过并支付
     * 
     * @memberof CustomerCollect
     */
    passToPay(passType = 'pass') {

        // app 内嵌
        if (isQlchat()) {
            this.props.handleAppSdkFun('checkFormAction', {
                action: passType,
            })
            return
        }

        let type = this.props.location.query.type;
        let scene = this.props.location.query.scene;
        let refer = document.referrer && document.referrer || '';
        scene === 'buyBefore' && (refer += '&autopay=Y')
        if ( passType == 'save' && type != 'channel-cut'){
            sessionStorage.setItem("saveCollect", this.configId);
        }
        sessionStorage.setItem("passCollect", this.configId);

        // 如果传过来的是跳转链接
        if (this.props.location.query.jumpUrl) {
            locationTo(decodeURIComponent(this.props.location.query.jumpUrl))
            return
        }

        switch (type) {
            case 'vip':
                if (/(live\/whisper\/vip\.htm)/.test(refer)){
                    locationTo(refer);
                } else {
                    // locationTo(`/live/whisper/vip.htm?liveId=${this.props.router.params.liveId}`);
                    locationTo(`/wechat/page/live-vip-details?liveId=${this.props.router.params.liveId}${scene === 'buyBefore' ? '&autopay=Y' : ''}`);
                }
                break;
            case 'customVip':
                locationTo(`/wechat/page/live-vip-details?liveId=${this.props.router.params.liveId}&id=${this.props.location.query.vipId}${scene === 'buyBefore' ? '&autopay=Y' : ''}`);
                break;
            case 'topic-channel':
            case 'topic':
                this.gotoTopicHandle();    
                break;
            case 'channel':
                this.gotoChannelHandle();
                break;
            case 'camp':
                locationTo(`/wechat/page/camp-detail?campId=${this.props.location.query.campId}${scene === 'buyBefore' ? '&autopay=Y' : ''}`);
                break;
            case 'channel-cut':
                this.gotoChannelCutHandle();
                break;

        }
    }

    /**
     * 
     * 回到系列课处理
     * @memberof CustomerCollect
     */
    async gotoChannelHandle() {
        let scene = this.props.location.query.scene;
        let refer = document.referrer && document.referrer || '';
        scene === 'buyBefore' && this.props.location.query.discount !== 'P' && (refer += '&autopay=Y')
        
        // 如果是免费系列课，则跳转前自动报名
        if (this.props.location.query.auth == 'Y') {
            let id = (this.state.channel && this.state.channel.chargeConfigs) ? this.state.channel.chargeConfigs[0].id : '';
            const sourceNo = this.props.location.query.sourceNo ? this.props.location.query.sourceNo : "qldefault";
            await this.props.fetchFreeBuy(id, sourceNo, this.props.location.query.channelId, this.props.location.query.couponId, 'channel');
        }
        
        if (/(\/topic\/)|(topic\-intro)/.test(refer)) {
            // 可能是话题里的支付系列课。
            locationTo(refer)
        }else if (/(channel\-intro)/.test(refer)) {
            locationTo(refer);
        } else {
	        locationTo(`/wechat/page/channel-intro?channelId=${this.props.location.query.channelId}${scene === 'buyBefore' && this.props.location.query.discount !== 'P' ? '&autopay=Y' : ''}`);
        }
    }
    /**
     * 
     * 回到系列课处理
     * @memberof CustomerCollect
     */
    async gotoChannelCutHandle() {
        locationTo(`${this.props.location.query.shareCutDomain}activity/page/cut-price?businessType=CHANNEL&businessId=${this.props.location.query.channelId}&applyUserId=${this.state.user.userId}`);
    }
    /**
     * 
     * 回到话题处理
     * @memberof CustomerCollect
     */
    async gotoTopicHandle() {
        let scene = this.props.location.query.scene;
        let refer = document.referrer && document.referrer || '';
        scene === 'buyBefore' && (refer += '&autopay=Y')

        // 如果是免费话题，则自动报名再跳转
        if (/(\/topic\/)|(topic\-intro)/.test(refer)){
           locationTo(refer);
        } else {
           locationTo(`/wechat/page/topic-intro?topicId=${this.props.location.query.topicId}${scene === 'buyBefore' ? '&autopay=Y' : ''}`);
        }  
    }

    /**
     * 检查表单提交
     * 
     * @returns 
     * @memberof CustomerCollect
     */
    async checkData() {
        let isPass = true;
        for (let item of this.state.fields) {
            let content = item.content || '';
            if (item.isRequired == 'Y' || (item.isRequired != 'Y' && content != '')) {
                switch (item.fieldName) {
                    case 'name': 
                        if (!validLegal('name', '姓名', content, 20)) {
                            return false;
                        }  
                            
                        break;
                    case 'mobile': 
                        if (!validLegal('phoneNum', '手机号码', content)) {
                            return false;
                        }
                        // 填写了手机号 且手机号与默认值不符 须走校验流程
                        if (content && this.state.hasCheckPhone) {
                            const {messageId, code} = this.state.validCode
                            if (!code) {
                                window.toast('请输入验证码')
                                return false
                            }
                            
                            const res = await this.props.checkValidCode({
                                phoneNum: content,
                                ...this.state.validCode
                            })

                            if (res && res.state) {
                                if (res.state.code != 0) {
                                    window.toast(res.state.msg)
                                    return false
                                }
                            } else {
                                window.toast('网络异常，请重新尝试')
                                return false
                            }
                        }
                            
                        break;
                    case 'addressData': 
                        if (this.state.areaLabel.length < 2) {
                            window.toast('请选择地址区域');
                            return false;
                        }    
                        if (!validLegal('text', '详细地址', content)) {
                            return false;
                        }  
                            
                        break;
                    case 'birthday': 
                            if (!validLegal('text', '生日', content)) {
                                return false;
                            }    
                        break;
                    case 'wechat': 
                            if (!validLegal('wxAccount', '微信号', content)) {
                                return false;
                            }    
                        break;
                    case 'email': 
                            if (!validLegal('email', '邮箱', content)) {
                                return false;
                            }    
                        break;
                    
                    default:
                        if (!validLegal('text', item.fieldValue, content, 50)) {
                            return false;
                        }  
                        break;
                }    
                
            }
        }

        return isPass;
        
    }

    /**
     * 
     * 提交表单
     * @returns 
     * @memberof CustomerCollect
     */
    async saveInfoData(saveSuccessHandle) {
        if (!this.data.canSaveData) {
            return;
        }

        this.data.canSaveData = false;

        let dataPass = await this.checkData();
        let addressData = {};
        let sourceType = '';
        if (dataPass) {
            let infoData = this.state.fields.reduce((pre, cur, index) => {
                if (cur.fieldName != 'addressData') {
                    return {
                        ...pre,
                        [cur.fieldName]: cur.content
                    }
                } else {
                    addressData.detail = cur.content;
                    return pre;
                }
                 
            }, {});

    
            switch (this.props.location.query.type) {
                case 'vip':
                    sourceType = 'VIP';
                    break;
                case 'customVip':
                    sourceType = 'CUSTOMVIP';
                    break;
                case 'topic-channel':
                    sourceType = 'TOPICINCHANNEL';
                    break;
                case 'topic':
                    sourceType = 'TOPIC';
                    break;
                case 'channel-cut':
                case 'channel':
                    sourceType = 'CHANNEL';    
                    break;
                case 'url':
                    sourceType = 'URL';    
                    break;
                case 'camp':
                    sourceType = 'CAMP';
                    break;
    
            }

            if (sourceType) {
                infoData.sourceType = sourceType
            }

            infoData = {
                ...infoData,
                liveId: this.props.router.params.liveId,
                sourceId:this.props.location.query.topicId || this.props.location.query.channelId || this.props.location.query.vipId || this.props.location.query.campId,
                configId: this.configId,
            }

            if (Object.keys(addressData).length > 0) {
                addressData = {
                    ...addressData,
                    province:this.state.areaLabel[0],
                    provinceId:this.state.areaValue[0],
                    city:this.state.areaLabel[1],
                    cityId:this.state.areaValue[1],
                }
            }

            let result = await this.props.saveStudentInfo({ infoData: infoData, address: addressData });

            if (result.state && result.state.code == 0){
                // 保存后处理
                saveSuccessHandle && saveSuccessHandle()
            } else if (result.state) {
                window.toast(result.state.msg)
            }
        } else {
            this.data.canSaveData = true;
        }
    }

    onInputFocus(e){
        let ui = typeof window == 'undefined' ? '' : (navigator.userAgent || '');
        if (Detect.os.phone && !ui.match(/11_\d/)) {
            const intoViewDom = e.target?.parentElement?.parentElement || '';
            if (intoViewDom) { // 不要自动滚动
                setTimeout(() => {
                    intoViewDom.scrollIntoViewIfNeeded(false);//自动滚动到视窗内
                }, 450)
            }
        }
    }

    setStep = (step) => {
        return () => {
            this.setState({
                step
            }, () => {
                setTimeout(() => {
                    typeof _qla != 'undefined' && _qla.collectVisible()
                }, 0);
            })
        }
    }

    // 保存课程后回调
    btnClickEvent = (func = () => {}) => {
        return () => {
            this.saveInfoData(func)
        }
    }
    
    closeWebPage () {
        if (isWeixin()) {
            wx && wx.closeWindow()
        } else {
            window.opener = null;      
            window.open('', '_self', '');     
            window.close();     
        }
    }
    
    goLive () {
        locationTo(`/wechat/page/live/${this.liveId}`)
    }

    renderBottom () {

        const {
            type,
            scene, // 课程前置 or 课程后置
        } = this.props.location.query
        const {
            qrUrl
        } = this.state

        const elArr = []

        if (type === 'url') { // 来源为复制表单链接
            elArr.push(
                <div className="btn btn-send-pay on-log on-visible" data-log-region="h5-formlist-submit" onClick={this.btnClickEvent(this.setStep(3))}>提交</div> // 保存后展示 成功状态
            )
        } else if (qrUrl) { // 有需要展示的二维码
            elArr.push(
                this.state.openStatus == 'close' ? <div className="btn btn-pass-pay on-log on-visible" data-log-region="h5-formlist-cancelbtn" onClick={this.setStep(2)}>跳过</div> : null,  // 展示 二维码
                <div className="btn btn-send-pay on-log on-visible" data-log-region="h5-formlist-submit" onClick={this.btnClickEvent(this.setStep(2))}>下一步</div> // 保存后展示 二维码
            )
        } else if (scene === 'buyBefore') { // 课程前置
            elArr.push(
                this.state.openStatus == 'close' ? <div className="btn btn-pass-pay on-log on-visible" data-log-region="h5-formlist-cancelbtn" onClick={()=>{this.passToPay()}}>跳过</div> : null,
                <div className="btn btn-send-pay on-log on-visible" data-log-region="h5-formlist-submit" onClick={this.btnClickEvent(() => {this.passToPay('save')})}>{`提交并${this.props.location.query.auth == 'Y' ? '报名':'付款'}`}</div>
            )
        } else {
            elArr.push(
                this.state.openStatus == 'close' ? <div className="btn btn-pass-pay on-log on-visible" data-log-region="h5-formlist-cancelbtn" onClick={()=>{this.passToPay()}}>跳过</div> : null,
                <div className="btn btn-send-pay on-log on-visible" data-log-region="h5-formlist-submit" onClick={this.btnClickEvent(() => {this.passToPay('save')})}>提交</div>
            )
        }

        return (
            <div className="flex-other bottom-container">
                {elArr}
            </div>
        )
    }
    
    // 是否需要校验手机号
    onChangeCheckBtn (isOpen) {
        this.setState({
            hasCheckPhone: isOpen
        })
    }

    // 手机校验信息
    changeValidCode (validCode) {
        this.setState({
            validCode
        })
    }

    render() {

        const {
            step = 0,
            qrUrl,
            fields,
            loading
        } = this.state

        // 步骤3
        if (step == 3) {
            return (
                <Page title={this.state.title||'完善信息'} className='flex-body customer-collect-container'>
                    <div className="success-content">
                        <i className="icon-success"></i>
                        <p className="tips">恭喜你~提交成功~</p>
                        <div className="close-btn on-log on-visible" data-log-region="h5-formlist-livebtn" onClick={this.goLive}>回到直播间</div>
                    </div>
                </Page>
            )
        }

        // 步骤2
        if (step == 2) {
            return (
                <Page title={this.state.title||'完善信息'} className='flex-body customer-collect-container'>
                    <div className="flex-main-s">
                        <div className="step-view step-2"></div>
                        <div className="user-info">
                            <QRImg 
                                src={imgUrlFormat(this.state.user.headImgUrl||'','?x-oss-process=image/resize,h_100,w_100,m_fill','/132')}
                                traceData={this.props.location.query.qrChannel}
                                className="head"
                                channel={this.props.location.query.qrChannel}
                                appId={this.props.location.query.appIndex}
                                />
                            <span className='info'>
                                <b>你好，{this.state.user.name ||''}，恭喜你报名成功～<br/>
                                请扫描下方二维码，获取听课链接</b>
                            </span>
                        </div>
                        <div className="qr-content">
                            <div className="qr-box">
                                <img src={qrUrl} alt=""/>
                            </div>
                            <p className="tips">长按识别二维码，关注公众号听课</p>
                            <p className="tips-2">（请务必扫码关注，否则无法听课）</p>
                        </div>
                    </div>
                </Page>
            )
        }

        return (
            <Page title={this.state.title||'完善信息'} className='flex-body customer-collect-container'>
                <div className="flex-main-s">
                    {
                        qrUrl ? <div className="step-view step-1"></div> : null
                    }
                    <div className="user-info">
                        <img className='head' src={imgUrlFormat(this.state.user.headImgUrl||'','?x-oss-process=image/resize,h_100,w_100,m_fill','/132')} alt=""/>
                        <span className='info'>
                            <b>你好，{this.state.user.name ||''}</b>
                            <i>请完善你的信息，让我们更好的服务你</i>
                        </span>
                    </div>

                    <ul className='data-ul'>
                        {
                            !loading && fields && fields.length > 0 && fields.map((item,index) => {
                                switch (item.fieldName){
                                    case 'name':
                                        return <Name
                                            item = {item}
                                            index = {index}
                                            key = {`data-li-${index}`}
                                            onFocus={this.onInputFocus}
                                            changeData={this.changeData}
                                        />;
                                    case 'mobile':
                                        return <PhoneNumber
                                            item={item}
                                            index = {index}
                                            sendValidCode={this.props.sendValidCode}
                                            validCode={this.state.validCode}
                                            onChangeCheckBtn={this.onChangeCheckBtn}
                                            onFocus={this.onInputFocus}
                                            changeValidCode={this.changeValidCode}
                                            changeData={this.changeData}
                                            key={`data-li-${index}`}
                                        />;
                                    case 'addressData':
                                        return <Address
                                            item = {item}  
                                            index = {index}
                                            key={`data-li-${index}`}
                                            areaArray = {this.state.areaArray}
                                            areaValue = {this.state.areaValue}
                                            areaLabel = {this.state.areaLabel}
                                            changeData={this.changeData}
                                            onFocus={this.onInputFocus}
                                            addressHandleChange={this.addressHandleChange}
                                            addressHandlePickerChange={this.addressHandlePickerChange}
                                        />;
                                    case 'birthday':
                                        return <DateItem
                                            item = {item}  
                                            index = {index}
                                            key={`data-li-${index}`}
                                            changeData={this.changeData}
                                        />;
                                    case 'sex':
                                        return <Sex
                                            item = {item}  
                                            index = {index}
                                            placeHolder="请选择性别"
                                            key={`data-li-${index}`}
                                            changeData={this.changeData}
                                        />;
                                    default:
                                        return <NormalText
                                            item = {item}
                                            index = {index}
                                            changeData={this.changeData}
                                            onFocus={this.onInputFocus}
                                            key={`data-li-${index}`}
                                        />;
                                        
                                }
                            })
                        }
                    </ul> 
                    
                </div>

                {
                    this.renderBottom()
                }
            </Page>
        );
    }
}

CustomerCollect.propTypes = {

};

function mapStateToProps(state){
    return {
        
    }
}

const mapActionToProps = {
    regionSelect,
    fetchFormFields,
    saveStudentInfo,
    checkUser,
    getUserInfo,
    getChannelInfo,
    fetchFreeBuy,
    publicApply,
    getUserDetail,
    sendValidCode, 
    checkValidCode
}

export default connect(mapStateToProps, mapActionToProps)(CustomerCollect);