import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux'

import Page from 'components/page'
import {Confirm} from 'components/dialog';
import ConfirmDialog from 'components/confirm-dialog'
import ImageUploader from './components/image-uploader'
import ChargeStyle from './components/charge-style'
import ChannelName from './components/channel-name'
import ChannelTag from './components/channel-tag'
import ChargeStandard from './components/charge-standard'
import OptimizeTipDialog from 'components/optimize-dialog'
import { autobind } from 'core-decorators';
import Detect from 'components/detect';
import { imgUrlFormat, locationTo, isNumberValid, validLegal } from 'components/util'
import { EditCourseBanner } from "../../components/edit-course-banner";
import Switch from "components/switch";
import { request } from 'common_actions/common'

import {
    addChannel,
    getChannelInfo,
    getChannelTags,
    getEditorSummary,
    channelIsRelay,
    getChannelOrTopicOptimize,
    setChannelTag,
} from '../../actions/live'
import { MiddleDialog } from '../../components/middle-dialog';
import { TemplateIntroComponent } from '../../components/template-intro-components';

@autobind
class CreateChannel extends Component {

    constructor (props) {
        super(props);
    }

    state = {
        // 系列课海报图
        channelImage: '',
        // 收费类型
        chargeStyle: 'absolutely',
        // 系列课名称
        channelName: '',
        // 系列课固定收费价格
        channelAbsolutelyPrice: '',
        // 系列课按时收费价格
        channelFlexiblePrice: '',
        // 开课节数
        courseNum: '',
        // 分销比例
        autoSharePercent: '',
        // 页面状态：editor(编辑页面) | base（基本创建页面）
        status: this.props.location.query.channelId ? 'editor' : 'base',
        // 系列课分类名称
        tagName: '',
        // 系列课分类id
        tagId: '',
        // 系列课描述
        channelDescription: '',
        // 直播间id
        liveId: '',
        // 系列课分类
        channelTagList: [],
        // 收费配置
        chargeConfigs: [{
            amount: 0,
            chargeMonths: 0,
            status: 'Y',
            discount: 0,
            discountStatus: 'N',
            groupNum: '',
        }],
        // 是否开启分享榜（默认开启）
        isOpenShareRank: 'Y',
        // 是否开启弹幕（默认关闭）
        isOpenBarrage: 'N',

        topicDesc: '',
        remarkDialog: false,
        // 是否隐藏提交按钮，用于安卓手机软键盘弹起时把提交按钮顶起，此时需要隐藏
        hideConfirmBtn: false,

        showUseIntro: false,
        // 是否开启请好友免费听
        isOpenInviteFree: 'N',
        // 该系列课是否为转载课
        isRelay: this.props.location.query.isRelay || 'N',
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
        // 模板使用介绍弹窗类型
        templateIntroType: '',
        // 保存分销的状态
        isOpenShare: 'N',
        tagValue: '',

    }

    data = {
		// 允许上传的图片格式
		imageFormatsAllow: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
		// 允许上传的图片的最大值
		imageMaxSize: 2,
		// 匹配整数的正则
		integerRegExp: /^\d+?$/,
    }

    get channelId () {
        return this.props.location.query.channelId;
    }
    get isCamp(){
        return this.props.location.query.isCamp || 'N';
    }

    componentDidMount(){
        if(this.state.status === 'editor'){
            this.initData()
            this.getEditorSummary()
            this.theChannelIsRelay()
            this.channelOptimize()
        }
        this.resizeAuto();

    }

    // 判断课程是否需要优化
    channelOptimize = async() => {
        const result = await getChannelOrTopicOptimize({
            businessId: this.props.location.query.channelId,
            type: 'channel',
        })
        if(result.state.code === 0){
            this.setState({
                descStatus: result.data.descStatus,
                headImageStatus: result.data.headImageStatus,
                nameStatus: result.data.nameStatus
            })
        }
    }

    // 判断是否是转载课
    theChannelIsRelay = async () => {
        // 链接上有就不用再请求一次
        if(this.props.location.query.isRelay){
            return
        }
        const result = await channelIsRelay({channelId: this.props.location.query.channelId})
        if(result.state.code === 0){
            this.setState({
                isRelay: result.data && result.data.result || 'N'
            })
        }
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

    // 初始化系列课信息
    async initData(){
        const result = await getChannelInfo(this.props.location.query.channelId)
        if(result.state.code === 0){
            let currentChargeConfig = []
            const channelInfo = result.data.channel
            const chargeConfigs = result.data.chargeConfigs
            let channelAbsolutelyPrice = '', channelFlexiblePrice = ''
            // 固定收费
            if(channelInfo.chargeType === 'absolutely'){
                channelAbsolutelyPrice = chargeConfigs[0].amount.toString()
            // 按时收费
            }else if(channelInfo.chargeType === 'flexible'){
                chargeConfigs.map((item)=>{
                    channelFlexiblePrice += '￥' + item.amount + '/' + item.chargeMonths + '月 '
                })

            }
            // 收费配置
            let config = Object.keys(this.state.chargeConfigs[0])
            chargeConfigs.map((item) => {
                let obj = {}
                config.forEach(i => {
                    obj[`${i}`] = item[`${i}`]
                })
                currentChargeConfig.push(obj)
            })

            const res = await request({
                url: '/api/wechat/transfer/h5/courseExtend/getCourseConfig',
                method: 'POST',
                body: {
                    businessType: 'channel',
                    businessId: this.props.location.query.channelId,
                    function: 'intro_barrage_switch'
                }
            })

            const isOpenBarrage = res?.data?.flag || 'N'

            this.setState({
                chargeStyle: channelInfo.chargeType,
                channelName: channelInfo.name,
                channelImage: channelInfo.headImage,
                channelDescription: channelInfo.description,
                courseNum: channelInfo.planCount || '',
                autoSharePercent: channelInfo.isOpenShare === 'N' ? '0' : channelInfo.autoSharePercent,
                liveId: channelInfo.liveId,
                isOpenShareRank: channelInfo.isOpenShareRank,
                isOpenBarrage,
                tagId: channelInfo.tagId || '',
                tagName: channelInfo.tagName || '',
                chargeConfigs: currentChargeConfig,
                channelFlexiblePrice,
                channelAbsolutelyPrice,
                isOpenInviteFree: channelInfo.isOpenInviteFree,
                isOpenShare: channelInfo.isOpenShare
            })
        }
    }

    async getEditorSummary(){
        let result = await getEditorSummary(this.props.location.query.channelId, 'channel');
        if (result.state.code == 0) {
            this.setState({
                topicDesc: result.data.content
            })
        }
    }

    /**
	 * 图片上传后的回调
	 * @param {*string} imageUrl
	 */
	uploadImageCallback(imageUrl) {
		this.setState({
			channelImage: imageUrl
		});
    }

    // 选择收费类型
    selectChargeStyle(style){
        if(style === 'absolutely'){
            let chargeConfigs = [];
            chargeConfigs.push(this.state.chargeConfigs[0]);
            chargeConfigs[0].amount = this.state.channelAbsolutelyPrice;
            this.setState({
                chargeConfigs,
            });
        }
        this.setState({
            chargeStyle: style
        })
    }

    // 填写系列课名称
    fillChannelName(content){
        this.setState({
            channelName: content
        })
    }

    // 填写价格
    priceInput(e){
        const value = e.target.value.trim();
        let chargeConfigs = [];
        chargeConfigs.push(this.state.chargeConfigs[0]);
		if (value == Number(value)) {
			const decimal = value.split('.')[1];
			if (decimal && decimal.length > 2) {
				return false;
			} else {
                chargeConfigs[0].amount = value;
				this.setState({
                    channelAbsolutelyPrice: value,
                    chargeConfigs,
				});
			}
		}
    }

    // 填写开课节数
    courseNumInput(e){
        this.setState({
            courseNum: e.target.value.trim()
        });
    }

    // 填写分销比例
    autoSharePercentInput(e){
        this.setState({
            autoSharePercent: e.target.value.trim()
        })
    }

    // 重新设置分销比例
    confirmEleClick(tag){
        this.confirmEle.hide()
        // 点击弹窗右边的按钮
        if(tag === 'confirm'){
            this.marketIngInput.select();
        }
        // 点击弹窗左边的按钮
        if(tag === 'cancel'){
            this.confirmChannelMes()
        }
    }

    // 分享榜开关
    switchShareRankClick(){
        let isOpenShareRank = this.state.isOpenShareRank
        if(isOpenShareRank == 'N'){
            isOpenShareRank = 'Y'
        }else {
            isOpenShareRank = 'N'
        }
        this.setState({isOpenShareRank})
    }

    // 弹幕开关
    switchBarrageClick () {
        let isOpenBarrage = this.state.isOpenBarrage
        if(isOpenBarrage == 'N'){
            isOpenBarrage = 'Y'
        }else {
            isOpenBarrage = 'N'
        }
        this.setState({isOpenBarrage})
    }

    // 请好友免费听开关
    switchInviteFreeClick(){
        let isOpenInviteFree = this.state.isOpenInviteFree
        if(isOpenInviteFree == 'N'){
            isOpenInviteFree = 'Y'
        }else {
            isOpenInviteFree = 'N'
        }
        this.setState({isOpenInviteFree})
    }

    // 填写收费标准
    chargeStandardClick(){
        if(this.state.isRelay == 'Y'){
            window.toast('转载课不能修改价格')
            return
        }
        this.chargeStandardEle.show()
    }

    // 系列课分类选择
    selectChannelTag(tagId, tagName){
        this.setState({tagId, tagName})
    }

    // 系列课付费类型选择
    chargeStyleClick(){
        if(this.state.status === 'base'){
            this.chargeStyleEle.show()
        }
    }

    // 系列课分类
    async channelSortClick(){
        if(!this.fetchChannelTags){
            const result = await getChannelTags({
                liveId: this.state.liveId,
                type: 'all'
            })
            if(result.state.code === 0){
                this.fetchChannelTags = true;
                // if(!result.data.channelTagList.length){
                //     window.toast('暂无系列课分类！')
                // }else {
                    this.setState({
                        channelTagList: result.data.channelTagList
                    })
                    this.channelTagEle.show()
                // }
            }
        }else{
            this.channelTagEle.show()
        }
    }

    // 保存收费标准
    saveChargeStandard(chargeConfigs){
        let channelFlexiblePrice = ''
        chargeConfigs.map((item)=>{
            channelFlexiblePrice += '￥' + item.amount + '/' + item.chargeMonths + '月 '
        })
        this.setState({channelFlexiblePrice, chargeConfigs})
    }

    discountTip(discountStatus){
        if(discountStatus === 'K'){
            return '砍价'
        }
        if(discountStatus === 'P' || discountStatus === 'GP'){
            return '拼课'
        }
        if(discountStatus === 'Y'){
            return '特价优惠'
        }
		if(discountStatus === 'UNLOCK'){
			return '解锁活动'
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

    // 提交系列课信息
    confirmClick(){
        if (this.updating) return ;
        const {
            status,
            channelImage,
            channelName,
            chargeStyle,
            chargeConfigs,
            channelFlexiblePrice,
            channelAbsolutelyPrice,
            courseNum,
            tagId,
            autoSharePercent,
            isOpenShareRank,
        } = this.state;
        // 系列课名称必填，40以内
        if(!validLegal('text', '系列课名称', channelName, 40)){
			return;
        }
        /**
         * 固定收费：编辑页面discountStatus不等于N的时候门票价格不能低于折扣价
         */
        if(chargeStyle === 'absolutely'){

            if(status === 'editor' && chargeConfigs[0].discountStatus !== 'N'){
                if(Number(channelAbsolutelyPrice) < chargeConfigs[0].discount){
                    window.toast(`门票价格不能低于${this.discountTip(chargeConfigs[0].discountStatus)}价格`)
                    return
                }
                if (/^(89|8\.9|0\.89|64|6\.4|0\.64|89\.64|64\.89|1989\.64)$/.test(chargeConfigs[0].discount)) {
                    // 永久防止敏感信息
                    window.toast('活动金额错误，请输入其他金额')
                    return false;
                }
            }
            // 固定收费课程价格必填，0或者1-50000
            if(Number(channelAbsolutelyPrice) && !validLegal('money', '课程价格', channelAbsolutelyPrice, 50000, 1)){
                return;
            }

        }else if(chargeStyle === 'flexible'){
            if(!channelFlexiblePrice){
                window.toast('请输入价格')
                return
            }
        }
        if(status === 'editor' && !courseNum && Object.is(this.isCamp, 'Y')){
            window.toast('请输入开课节数');
            return
        }
        // 开课数量非必填，填了的话就必须是1-9999的数
        if(courseNum && !isNumberValid(courseNum, 1, 9999, "开课的节数")){
            return;
        }
        // 新建系列课页面分销比例必填，0-80
        // if(status === 'base' && !isNumberValid(autoSharePercent, 0, 80, "分销比例")){
        //     return;
        // }
        // 新建系列课页面分销比例是0的时候需要弹窗确认(弹窗最多弹一次))
        // if(autoSharePercent === '0' && !this.lock && status === 'base'){
        //     this.lock = true
        //     this.confirmEle.show()
        //     return
        // }
        console.log(this.state.chargeConfigs)
        this.confirmChannelMes()
    }

    // 点击系列课介绍
    channelIntro(){
        if (this.state.topicDesc) {
            this.setState({
                remarkDialog: true
            })
        } else {
            locationTo(`/wechat/page/channel-intro-list/${this.props.location.query.channelId}`)
        }
    }

    // 提交系列课信息
    async confirmChannelMes(){
        const {
            status,
            channelImage,
            channelName,
            chargeStyle,
            chargeConfigs,
            channelFlexiblePrice,
            channelAbsolutelyPrice,
            liveId,
            courseNum,
            tagId,
            autoSharePercent,
            isOpenShareRank,
            isOpenInviteFree,
            isOpenShare,
            isOpenBarrage
        } = this.state
        let tempIsOpenShare = 'N'
        // 如果是拉人返现 需要判断
        if (isOpenShare == 'BOTH') {
            tempIsOpenShare = isOpenShare
        } else if (isOpenShare == 'IR') {
            tempIsOpenShare = isOpenShare
        } else {
            tempIsOpenShare = autoSharePercent == 0 ? 'N' : 'Y'
        }
        this.updating = true;
        const result = await addChannel({
            liveChannelPo: {
                id: this.props.location.query.channelId,
                name: channelName,
                chargeType: chargeStyle,
                headImage: channelImage || 'https://img.qlchat.com/qlLive/liveCommon/default-bg-cover-1908080' + (~~(Math.random() * 3 + 1)) + '.png',
                liveId: this.props.location.query.liveId || liveId,
                isOpenShare: tempIsOpenShare,
                planCount: Number(courseNum),
                tagId,
                autoSharePercent,
                isOpenShareRank,
                chargeConfigs,
                // 新建的时候默认开启为Y
                isOpenInviteFree: status === 'base' ? 'Y' : isOpenInviteFree,
            },
            source: 'h5'
        })
        await request({
            url: '/api/wechat/transfer/h5/courseExtend/saveCourseConfig',
            method: 'POST',
            body: {
                businessType: 'channel',
                businessId: this.props.location.query.channelId,
                function: 'intro_barrage_switch',
                flag: isOpenBarrage
            }
        })
        // 新建成功后，跳转到对应的系列课介绍页面
        if(result.state.code === 0){
            if(status === 'editor'){
                window.toast('编辑成功')
                locationTo(`/wechat/page/channel-intro?channelId=${result.data.channelId}`)
            }
            if(status === 'base'){
                window.toast('新建成功')
                if(chargeStyle ==='absolutely' && Number(chargeConfigs[0].amount) <= 0){
                    locationTo(`/wechat/page/channel-intro?channelId=${result.data.channelId}`)
                }else{
                    locationTo(`/wechat/page/channel-market-seting?channelId=${result.data.channelId}`)
                }
                // locationTo(`/wechat/page/channel-intro?channelId=${result.data.channelId}`)
                // locationTo(`/wechat/page/channel-market-seting?channelId=${result.data.channelId}`)
            }
        }
        setTimeout(() => {
            this.updating = false;
        },151)
    }

    // 显示优化示例弹窗
    showOptimizeDialog(type){
        this.setState({
            showOptimizeDialog: true,
            optimizePoint: type
        })
    }

    exampleClick = (e, type) => {
        e.stopPropagation()
        this.showOptimizeDialog(type)
    }

    onBlur(e){
		window.scrollTo(0, document.body.scrollTop + 1);
		document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
    }

    changeTagValue(e){
        this.setState({
            tagValue: e.target.value || '',
        });
    }
    async confirmCreateTagClick(type){
        if(type === 'confirm' ){
            if(this.state.tagValue === ""){
                this.createType.hide();
                return false;
            }else if(this.state.tagValue.length > 10){
                window.toast('分类名称字数不能大于10')
                return false;
            }
            //新建分类
            let result = await setChannelTag({
                liveId: this.state.liveId,
                name: this.state.tagValue,
            });

            if(result.state.code ===0){
                window.toast('保存成功')
                let taglist = this.state.channelTagList;
                taglist.push(result.data);
                this.setState({
                    channelTagList: taglist
                });
                this.createType.hide();
            }else{
                window.toast(result.state.msg);
            }

        }
    }

    showCreateType(){
        this.createType.show();
    }

    render() {
        const {
			imageFormatsAllow,
			imageMaxSize,
        } = this.data;
        const {
            channelImage,
            chargeStyle,
            channelName,
            channelAbsolutelyPrice,
            channelFlexiblePrice,
            courseNum,
            autoSharePercent,
            status,
            isOpenShareRank,
            isOpenBarrage,
            tagId,
            tagName,
            channelTagList,
            chargeConfigs,
            hideConfirmBtn,
            isOpenInviteFree,
            liveId,
        } = this.state
        return (
            <Page title={status === 'editor' ? '编辑系列课' : '新建系列课'} className="create-channel-container">
                <MiddleDialog show={this.state.showUseIntro} onClose={() => {
                    this.setState({
                        showUseIntro: false
                    })
                }}>
                    <TemplateIntroComponent
                        onCopyURL={() => {
                            window._qla && window._qla('click', {
                                region: 'CopyAddress',
                                pos: 'channel-introduction'
                            })
                        }}
                        type = {this.state.templateIntroType}
                        hide = {()=>{this.setState({showUseIntro: false})}}
                        onClickIntro={() => {
                            window._qla && window._qla('click', {
                                region: 'ViewTutorial',
                                pos: 'channel-introduction'
                            })
                        }}
                    />
                </MiddleDialog>
                <div className="create-channel-content">
                    {
                        this.channelId ?  <section className="channel-post-uploader-container">
                            <ImageUploader
                                customClass="channel-post-uploader"
                                tip="上传系列课海报"
                                callback={this.uploadImageCallback}
                                formatsAllow={imageFormatsAllow}
                                maxSize={imageMaxSize}
                                previewImageUrl={channelImage}
                                optimize = {this.state.headImageStatus == 'Y'}
                                openExample = {this.showOptimizeDialog.bind(this, 'courseHeadImage')}
                                exampleClick = { this.exampleClick.bind(this) }
                                showStyleTips = { () => {
                                    window._qla && window._qla('click', {
                                        region: 'DetailsClick',
                                        pos: 'channel-introduction'
                                    })
                                    this.setState({
                                        showUseIntro: true,
                                        templateIntroType: 'headImage'
                                    })
                                }}
                            />
                        </section>:null
                    }

                    {this.channelId ? <div className="channel-intro-upload" onClick={this.channelIntro}>
                        <span className={`label${this.state.descStatus == 'Y' ? ' optimize-tip-pao' : ''}`}>系列课介绍<i className="example on-log" data-log-region="channel_introduce_example" onClick={(e)=>{this.exampleClick(e, 'courseSummary')}}>示例</i></span>

                        <div className="optimize-tip">
                            <span className="style-tips" onClick = {(e) => {
                                e.stopPropagation()
                                this.setState({
                                    showUseIntro: true,
                                    templateIntroType: 'courseIntro'
                                })
                            }}>课程介绍模板</span>
                            ，提高购买转化率，点示例查看
                        </div>

                    </div>:null
                    }
                    {
                        // this.channelId ? <EditCourseBanner
                        //     type = "courseIntro"
                        //     onDetails={() => {
                        //         this.setState({
                        //             showUseIntro: true,
                        //             templateIntroType: 'courseIntro'
                        //         })
                        //     }}
                        // />:null
                    }


                    <section className="channel-detail-editor-container">
                        <div className={`channel-name detail`} onClick={()=>{this.channelNameEle.show(this.state.channelName)}}>
                            <span className={`detail-name${this.state.nameStatus == 'Y' ? ' optimize-tip-pao' : ''}`}>系列课名称<i className="btn-example on-log" data-log-region="channel_title_example" onClick={(e)=>{this.exampleClick(e, 'courseTitle')}}>示例</i></span>

                            { channelName ? <div className="detail-content">{channelName}</div> : <div className="detail-replace">请输入系列课名称</div> }
                        </div>
                        <div className={`charge-style detail`} onClick={this.chargeStyleClick}>
                            <span className="detail-name">收费类型</span>
                            <div className="detail-content">{chargeStyle === 'absolutely' ? '固定收费' : (chargeStyle === 'flexible' ? '按时收费' : '')}</div>
                            { this.state.status === 'base' && <span className="icon_enter"></span> }
                        </div>
                        {
                            // 按时收费显示收费标准这一栏，固定收费显示价格这一栏 ${status === 'base' ? 'necessary' : ''}
                            chargeStyle === 'flexible' ?
                            <div className={`charge-standard detail`} onClick={this.chargeStandardClick}>
                                <span className="detail-name" >收费标准</span>
                                <div className="detail-content">{channelFlexiblePrice}</div>
                                {/* <span className="icon_enter"></span> */}
                            </div>:
                            <div className={`price detail`}>
                                <span className="detail-name">价格（元）</span>
                                <div className="input-container">
                                    <input type="number" onBlur={this.onBlur} className="price-input" placeholder="请输入系列课价格" readOnly = {this.props.location.query.isRelay === 'Y'} onChange={this.priceInput} value={channelAbsolutelyPrice}/>
                                </div>
                            </div>
                        }
                        {
                            status === 'base' && this.channelId  ?[
                                <div className="course-num detail">
                                    <span className="detail-name">排课计划</span>
                                    <div className="input-container">
                                        <input type="number" className="course-num-input" placeholder="填写具体开课节数" value={courseNum} onChange={this.courseNumInput} onBlur={this.onBlur} />
                                    </div>
                                    <span className="unit">节</span>
                                </div>,
                                <div className="marketing-contianer">
                                    <div className="marketing-title">营销</div>
                                    <div className="detail necessary">
                                        <span className="detail-name">设置分销比例</span>
                                        <div className="input-container">
                                            <input
                                                ref = {el => this.marketIngInput = el}
                                                type="number"
                                                className="marketing-input"
                                                placeholder="分成比例(0-80)"
                                                value={autoSharePercent}
                                                onChange={this.autoSharePercentInput}
                                                onBlur={this.onBlur}
                                            />
                                        </div>
                                        <span className="percentage">%</span>
                                    </div>
                                    <div className="marketing-tip">数据显示，30%-50%的分销奖励可以刺激用户分享课程，帮助您获得更大收益~</div>
                                </div>
                            ] : null
                        }
                    </section>
                    {
                        status === 'editor' ?
                        <section className="channel-detail-editor-container">
                            <div className="course-num detail">
                                <span className="detail-name">排课计划（节）</span>
                                <div className="input-container">
                                    <input type="number" className="course-num-input" placeholder="填写具体开课节数" value={courseNum} onChange={this.courseNumInput} onBlur={this.onBlur} />
                                </div>
                            </div>

                            <div className="channel-sort detail" onClick={this.channelSortClick}>
                                <span className="detail-name">系列课分类</span>
                                <div className="detail-content">{tagName || '未设置'}</div>
                                <span className="icon_enter"></span>
                            </div>
                            <div className="channel-sequence detail" onClick={()=>{locationTo(`/wechat/page/channel-topic-sort/${this.props.location.query.channelId}`)}}>
                                <span className="detail-name">课程排序</span>
                                <div className="detail-content"></div>
                                <span className="icon_enter"></span>
                            </div>
                        </section>:null
                    }
                    {
                        status === 'editor' ?
                        <section className="channel-detail-editor-container interval">
                            <div className="share-rank detail" onClick={this.switchShareRankClick}>
                                <div className="detail-name">
                                    分享榜
                                    <div className="share-rank-tip">开启后，分享排行榜会展示在课程简介中，刺激用户把课程分享给好友，提高成交量。</div>
                                </div>
                                <Switch className="bonus-switcher" active={isOpenShareRank == 'Y'} onChange={this.switchShareRankClick} />
                            </div>

                        </section>:null
                    }
                    {
                        status === 'editor' ?
                        <section className="channel-detail-editor-container interval">
                            <div className="share-rank detail" onClick={this.switchBarrageClick}>
                                <div className="detail-name">
                                    动态弹幕<i className="btn-example on-log" data-log-region="channel_title_example" onClick={(e)=>{this.exampleClick(e, 'courseBarrage')}}>示例</i>
                                    <div className="share-rank-tip">开启后，会在课程介绍展示报名动态，营造热销氛围，刺激用户下单。</div>
                                </div>
                                <Switch className="bonus-switcher" active={isOpenBarrage == 'Y'} onChange={this.switchBarrageClick} />
                            </div>

                        </section>:null
                    }
                    {
                        status === 'editor' && chargeStyle === 'absolutely' && Number(channelAbsolutelyPrice) > 0 ?
                        <section className="channel-detail-editor-container ">
                            <div className="invite-free detail" onClick={this.switchInviteFreeClick}>
                                <div className="detail-name">
                                    请好友免费听
                                    <div className="invite-free-tip">开启后，用户购买后可以把系列课内话题分享给好友免费听，每位好友最多领2节。</div>
                                </div>
                                <Switch className="bonus-switcher" active={isOpenInviteFree == 'Y'} onChange={this.switchInviteFreeClick} />
                            </div>
                        </section>:null
                    }
                </div>
                {/* {
                    !hideConfirmBtn ?
                    <div className={`confirmBtn ${status}`} onClick={this.confirmClick}>确定</div>:null
                } */}
                <div className="create-channel-btn">
                    <div className={`confirmBtn ${status}`} onClick={this.confirmClick}>确定</div>
                </div>
                <Confirm
                    ref = {el => this.confirmEle = el}
                    className='distribution-confirm'
                    title = '您确定要把分销奖励设为0%吗？'
                    cancelText = '确定'
                    confirmText = '重新设置'
                    bghide = {true}
                    onBtnClick = {this.confirmEleClick}
                >
                    <div className="content">用户分享课程将没有奖励，不利于课程推广，您无法获得最大的课程收益~</div>
                </Confirm>
                <Confirm
                    ref = {el => this.createType = el}
                    className='create-type-confirm'
                    title = '请输入新建分类名称'
                    cancelText = '取消'
                    confirmText = '确定'
                    bghide = {true}
                    onBtnClick = {this.confirmCreateTagClick}
                >
                    <div className="content"><input value={this.state.tagValue} placeholder="请输入名称" onChange={this.changeTagValue} onBlur={this.onBlur} /></div>
                </Confirm>

                <ChargeStyle
                    ref = {el => this.chargeStyleEle = el}
                    selectChargeStyle = {this.selectChargeStyle}
                />
                <ChannelName
                    ref = {el => this.channelNameEle = el}
                    fillChannelName = {this.fillChannelName}
                />
                <ChannelTag
                    ref = {el => this.channelTagEle = el}
                    channelTagList = {channelTagList}
                    selectChannelTag = {this.selectChannelTag}
                    tagId = {tagId}
                    liveId = {liveId}
                    showCreateType = {this.showCreateType}
                />
                <ChargeStandard
                    ref = {el => this.chargeStandardEle = el}
                    chargeConfigs = {chargeConfigs}
                    saveChargeStandard = {this.saveChargeStandard}
                />
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
        );
    }
}

function msp(state) {
    return {

    }
}

const map = {

}

export default connect(msp, map)(CreateChannel);
