/**
 * Created by qingxia.zhai on 2017/8/2.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { isQlchat, isAndroid, isIOS } from 'components/envi';
import ScrollToLoad from 'components/scrollToLoad';
import { BottomDialog, Confirm } from 'components/dialog';
import ClearingList from './components/clearing-list';
import DetailList from './components/detail-list';
import { locationTo } from 'components/util';
import DatePicker from 'components/date-picker';
import dayjs from 'dayjs';
import { formatDate ,formatMoney  } from 'components/util';
import detect from 'components/detect';
import classNames from 'classnames';

import {
	isQlLive
} from '../../../actions/common';

import { 
    getSeparateClearingList,
    getSeparateDetailList,
    getProfitRecordCount,
    getTransferRecordCount,
    setGuestSeparateEndTime,
    overSeparate, 
    guestSeparateClearing,	
    acceptTimePercentPlease,
    updateIsAutoTransfer,
	isExistAuditRecord
} from '../../../actions/guest-separate';
import Switch from 'components/switch';

class IncomeDetail extends Component {

    state={
        tabType:this.props.location.query.type,
        businessType:this.props.location.query.channelId? "channel" : (this.props.location.query.campId? "camp" : "topic"),
        businessId: this.props.location.query.channelId || this.props.location.query.campId || this.props.location.query.topicId,
        guestId:this.props.location.query.guestId,
        channelId:this.props.location.query.channelId,
        topicId:this.props.location.query.topicId,
        campId:this.props.location.query.campId,
        separateEndTime:this.props.guestInfo.expiryTime&&this.props.guestInfo.expiryTime<(new Date().getTime())? "" : this.props.guestInfo.expiryTime,
        authorizeTime: formatDate(this.props.guestInfo.authorizeTime,'yyyy年MM月dd日 hh:mm:ss'),
        isMLive:this.props.power.allowMGLive,
        isManager:'Y',
        percent:this.props.guestInfo.sharePercent,    
        separateStatus:this.props.guestInfo.expiryTime&&this.props.guestInfo.expiryTime<(new Date().getTime())?"N":"Y",
        detailType:'normal',
        pageNumDetail:1,
        pageNumLiveDetail:1,
        pageNumClearing:1,
        isNoMoreFlowDetail:false,
        isNoMoreFlowLiveDetail:false,
        isNoMoreFlowClearing:false,
        isNoFlowDetail:false,
        isNoFlowLiveDetail:false,
        isNoFlowClearing:false,
        pageSize:20,


        
        clearingMoney:formatMoney(this.props.sumShareMoney.pendingMoney),
        clearingRemark:"",
        isRecovery:"N",
        autoClearing:this.props.guestInfo.isAutoTransfer=="Y" ? true:false,
        userId:this.props.userInfo&&this.props.userInfo.userId,

        autoNextClearing:false,
	    // 是否官方直播间
	    isQlLive: '',
	    // 是否存在嘉宾转账待审核的记录
	    isExistAuditRecord: false,

        /* 收益明细和发放记录数目 */
        totalProfitCount: 0,
        normalProfitCount: 0,
        normalProfitMoney: 0,
        relayChannelProfitCount: 0,
        relayChannelProfitMoney: 0,
        totalTransferCount: 0,
    };

    // data = {
	//     pageNumDetail:1,
	//     pageNumClearing:1,
    // };

    componentDidMount() {
        this.initData();
        this.initEvent();
        this.getIsQlLive();
        this.fetchRecordCount()

        this.loadDetailList();
        if(this.state.businessType === 'channel'){
            this.loadDetailList(() => { }, 'relay_channel')
        }
        this.loadClearingList();
        
	}

    initData(){
        this.setState({
            isManager:this.props.params.mtype==="manage"?"Y":"N",
            separateStatus:this.props.guestInfo.expiryTime&&this.props.guestInfo.expiryTime<(new Date().getTime())?"N":"Y",
            separateEndTime:this.props.guestInfo.expiryTime&&this.props.guestInfo.expiryTime<(new Date().getTime())? "" : this.props.guestInfo.expiryTime,
            authorizeTime: formatDate(this.props.guestInfo.authorizeTime,'yyyy年MM月dd日 hh:mm:ss'),
            percent:this.props.guestInfo.sharePercent,
        });

    }

    /* 获取收益明细和发放记录的数目 */
    async fetchRecordCount() {
        try {
            const { guestId, businessId, businessType } = this.state
            const [profitRes, transferRes] = await Promise.all([
                this.props.getProfitRecordCount({ guestId, businessId, businessType }),
                this.props.getTransferRecordCount({ guestId, businessId, businessType }),
            ])

            console.log(profitRes, transferRes)
            const {
                totalProfitCount,
                normalProfitCount,
                normalProfitMoney,
                relayChannelProfitCount,
                relayChannelProfitMoney,
            } = profitRes
            const totalTransferCount = transferRes.totalTransferCount
            this.setState({
                totalProfitCount,
                normalProfitCount,
                normalProfitMoney,
                relayChannelProfitCount,
                relayChannelProfitMoney,
                totalTransferCount,
            })
        } catch (error) {
            console.error('获取收益明细和发放记录的数目失败: ', error)
        }
    }

    initEvent(){
        this.onChangeListTab(this.state.tabType);
    }

    async getIsQlLive(){
        const res = await this.props.isQlLive(this.props.power.liveId);
        if(res.state.code === 0 && res.data){
            this.setState({
                isQlLive: res.data.isQlLive === 'Y'
            });
            if(res.data.isQlLive === 'Y'){
                this.getIsExistAuditRecord();
            }
        }
    }

    async getIsExistAuditRecord(){
	    const res = await this.props.isExistAuditRecord(this.props.power.liveId);
	    if(res.state.code === 0 && res.data){
		    this.setState({
			    isExistAuditRecord: res.data.isExist === 'Y'
		    })
	    }
    }

    onChangeListTab(thistype){
        this.setState({
            tabType:thistype,
        });
        // this.loadList(thistype);

    }

    get listNoneOne() {
        const {
            isNoFlowClearing,
            isNoFlowDetail,
            isNoFlowLiveDetail,

            tabType,
            detailType,
        } = this.state
        
        return tabType === 'clearing'
            ? isNoFlowClearing
            : detailType === 'normal'
                ? isNoFlowLiveDetail
                : isNoFlowDetail
    }

    get listNoMore() {
        const {
            isNoMoreFlowClearing,
            isNoMoreFlowDetail,
            isNoMoreFlowLiveDetail,

            tabType,
            detailType,
        } = this.state
        
        return tabType === 'clearing'
            ? isNoMoreFlowClearing
            : detailType === 'normal'
                ? isNoMoreFlowLiveDetail
                : isNoMoreFlowDetail
    }

    //加载明细列表
    loadList(type){
        if(type=="detail"){
            this.loadDetailList();
        }else{
            this.loadClearingList();
        }
    }
    
    async loadDetailList(next, type){
        let {
            guestId,
            pageNumDetail,
            pageNumLiveDetail,
            pageSize,
            topicId,
            channelId,
            campId,
            detailType,
        } = this.state;
        detailType = type ? type : detailType

        const pageNum = detailType === 'normal' ? pageNumLiveDetail : pageNumDetail 
        let result= await this.props.getSeparateDetailList({
            guestId,
            pageNum,
            pageSize,
            topicId,
            channelId,
            campId,
            source: detailType,
        });

        if(result.state.code===0){
            const { list } = result.data

            if (list.length < pageSize) {
                if (pageNum === 1) {
                    /* 没有数据 */
                    detailType === 'normal' 
                        ? this.setState({ isNoFlowLiveDetail: true })
                        : this.setState({ isNoFlowDetail: true })
                } else {
                    /* 没有更多数据 */
                    detailType === 'normal'
                        ? this.setState({ isNoMoreFlowLiveDetail: true })
                        : this.setState({ isNoMoreFlowDetail: true })
                }
            }
            
            detailType === 'normal'
                ? pageNumLiveDetail += 1
                : pageNumDetail += 1

            this.setState({
                pageNumLiveDetail,
                pageNumDetail,
            }, () => { next && next(); });
        }
    }
    async loadClearingList(next){
        const { guestId, pageNumClearing, pageSize, topicId, channelId, campId } =this.state;
        let result= await this.props.getSeparateClearingList({
            guestId,
            pageNum : pageNumClearing,
            pageSize : pageSize,
            topicId,
            channelId,
            campId,
        });
        if(result.state.code===0){

            
            if(this.state.pageNumClearing==1&&result.data.list.length<=0){
                this.setState({
                    isNoFlowClearing:true,
                })
            }
            if(result.data.list.length<=0&&this.props.clearingList.length>0){
                this.setState({
                    isNoMoreFlowClearing:true,
                })
            }

            this.setState({
                pageNumClearing:pageNumClearing + 1,
            },()=>{
                next && next();
            });

	        
            
            
            
            
        }
    }



    onChangePercent(){
        this.refs.setPercentDialog.show();
        // locationTo(`/wechat/page/guest-separate/percent-please?id=${this.props.guestInfo.id}&channelId=${this.state.channelId}`)
    }

    onChangeTime(){
        this.refs.setOverTimeDialog.show();
    }

    onOverSeparate(){
        this.refs.overSeparateDialog.show();
    }

    onOpenSeparate(){
        this.refs.setOverTimeDialog.show();
        this.setState({
            isRecovery:"Y",
        });
    }


    waitClearingTips(){
        this.refs.waitTipsDialog.show();
        
        // window.confirmDialog('还未发放给分成嘉宾的分成收益，需要直播间手动发放。',"","","什么是待发放？","confirm",{
        //         confirmText: '知道了',
        //         titleTheme: "white",
        // });
    }



    //时间选择
    onEndDateSelect(val){
        this.setState({
            separateEndTime:val.getTime(),
        });
    }

    async onSetOverTimeConfirm(type){
        if(type=="confirm"){
            let result= await this.props.setGuestSeparateEndTime(this.state.guestId,this.state.channelId,this.state.topicId,this.state.campId,this.state.separateEndTime,this.state.isRecovery);
            if(result.state.code==0){
                this.refs.setOverTimeDialog.hide();
                this.setState({
                    separateStatus:"Y",
                });
            }else{
                window.toast(result.state.msg);
            }
        }
        
    }

    //发放
    onClearingDialog(){
        if(this.state.isExistAuditRecord){
            window.toast('存在嘉宾转账待审核的记录');
        }else{
	        this.refs.clearingDialog.show();
        }
    }

    onChangeClearingMoneyInput(e){
        if(Number(e.currentTarget.value)>formatMoney(this.props.sumShareMoney.pendingMoney)){
            window.toast("实际结算金额不能大于待发放金额");
        }else{
            this.setState({
                clearingMoney:e.currentTarget.value,
            });
        }
        
    }
    onChangeClearingRemarkInput(e){
        if(e.currentTarget.value.length>20){
            window.toast("备注应小于20字");
        }else{
            this.setState({
                clearingRemark:e.currentTarget.value,
            });
        }
        
    }

    onClearingConfirmDialog(type){
        if(type=="confirm"){
            if(this.state.autoNextClearing&&Number(this.state.clearingMoney)==0){
                window.toast("发放金额需不等于0元");
            }else if(Number(this.state.clearingMoney)>0&&Number(this.state.clearingMoney)<1){
                window.toast("发放金额需大于1元或等于0元");
            }else if (Number(this.state.clearingMoney)<0){
                window.toast("发放金额不能小于0");
            }else if(Number(this.state.clearingMoney)<formatMoney(this.props.sumShareMoney.pendingMoney)&&this.state.clearingRemark==""){
                window.toast("请填写备注");
            }else{
                this.refs.clearingConfirmAgain.show();
            }
        };
    }

    OpenOrCloseAutoNext(){
        this.setState({
            autoNextClearing: !this.state.autoNextClearing,
        })
    }

    //自动发放
    OpenOrCloseAuto(){
        this.refs.clearingAutoConfirmAgain.show();
    }
    onChangeAutoConfirm(type){
        if(type=="confirm"){
            if(this.state.autoClearing){
                this.changeAutoClearing("N",()=>{
                    this.setState({
                        autoClearing:false,
                    });
                });
                
            }else {
                this.changeAutoClearing("Y",()=>{
                    this.setState({
                        autoClearing:true,
                    });
                });
                    
            }
            this.refs.clearingAutoConfirmAgain.hide();
        };
    }

    async changeAutoClearing(isopen,callback){
        const params={
            guestId:this.state.guestId,
            channelId:this.state.channelId,
            topicId:this.state.topicId,
            campId:this.state.campId,
            isAutoTransfer:isopen,
            userId:this.state.userId,
        };
        let result = await this.props.updateIsAutoTransfer(params);
        if(result.state.code===0){
            callback&&callback();
        }else{
            window.toast(result.state.msg);
            return false;
        }
    }

    autoClearingTips(){
        this.refs.autoClearingTipsDialog.show();
    }

    async onClearingConfirm(type){
        if(type=="confirm"){
            let clearingParams={
                liveId:this.props.power.liveId,
                transferMoney:Number((this.state.clearingMoney||0)*100).toFixed(0),
                dueMoney:this.props.sumShareMoney.pendingMoney,
                dealtMoney: this.props.sumShareMoney.dealtMoney,
                expectingMoney: this.props.sumShareMoney.expectingMoney,
                remark:this.state.clearingRemark,
                channelId:this.state.channelId,
                topicId:this.state.topicId,
                guestId:this.state.guestId,
                campId: this.state.campId,
                // beginGuestProfitRecordId:this.props.sumShareMoney.beginGuestProfitRecordId,
                // lastGuestProfitRecordId:this.props.sumShareMoney.lastGuestProfitRecordId,//string	记录ID
                isWhole:this.state.autoNextClearing?"N":"Y",
            }
            let result= await this.props.guestSeparateClearing(clearingParams);
            if(result.state.code==0){
                this.refs.clearingConfirmAgain.hide();
                this.refs.clearingDialog.hide();

            }else{
                window.toast(result.state.msg);
            }
        }else{
            this.refs.clearingConfirmAgain.hide();
        }
    }

    //终止分成
    async onOverSeparateConfirm(type){
        if(type=="confirm"){
            const { guestId, channelId, topicId, campId } = this.state;
            let result= await this.props.overSeparate({guestId, channelId, topicId, campId});
            if(result.state.code==0){
                window.toast("已结束该嘉宾分成");
                this.refs.overSeparateDialog.hide();
                this.setState({
                    separateStatus:"N",
                });
            }
        }
        
    }

    //修改分成比例
    async onChangePercentConfirm(type){
        if(type=="confirm"){
            if(this.state.percent!=""){
                if(Number(this.state.percent)<=0){
                    window.toast("嘉宾分成比例需大于0");
                    return false;
                }
                let nowDate=new Date().getTime();
                let timeparams={
                    guestId: this.state.guestId,
                    type:this.state.businessType,
                    timeStamp:nowDate,
                    sharePercent:Number(this.state.percent),
                }
                //缓存
                let result= await this.props.acceptTimePercentPlease(timeparams);
                if(result.state.code==0){
                    this.refs.setPercentDialog.hide();
                    if(this.state.businessType==="channel"){
                        locationTo(`/wechat/page/guest-separate/percent-please?id=${this.state.guestId}&channelId=${this.state.channelId}&time=${nowDate}&newPercent=${Number(this.state.percent)}`);  
                    }else if(this.state.businessType ==='camp'){
                        locationTo(`/wechat/page/guest-separate/percent-please?id=${this.state.guestId}&campId=${this.state.campId}&time=${nowDate}&newPercent=${Number(this.state.percent)}`);                          
                    }else{
                        locationTo(`/wechat/page/guest-separate/percent-please?id=${this.state.guestId}&topicId=${this.state.topicId}&time=${nowDate}&newPercent=${Number(this.state.percent)}`);  
                    }
                }else{
                    window.toast(result.state.msg);
                    return false;
                }
                
            }else{
                window.toast("请填写嘉宾分成比例");
                return false;
            }
            
        }

    }
    onChangePercentInput(e){
        if(e.currentTarget.value==""){
            this.setState({
                percent: 0,
            });
        }
        if(!/[0-9\.]/.test(Number(e.target.value))){
            e.target.value = this.state.percent;
			window.toast('请输入数字');
			return;
        }else if(100-Number(this.props.assignedPercent)+Number(this.props.guestInfo.sharePercent) >= e.currentTarget.value){
            this.setState({
                percent: e.currentTarget.value,
            });
        }else{
            window.toast("比例不能大于最大可设置比例："+(100-Number(this.props.assignedPercent)+Number(this.props.guestInfo.sharePercent))+"%");
        }
        
    }

    //投诉确认跳转
    onComplainConfirm(type){
        if(type=="confirm"){
            locationTo(`/wechat/page/complain-reason?channelId=${this.state.channelId}&sort=guest&link=${typeof location != 'undefined' && encodeURIComponent(location.href)}`);
        };
    }

    detailSourseChange(source){
        this.setState({ detailType: source }, () => {
            if(source === 'relay_channel' && this.state.pageNumDetail === 1) {
                this.loadDetailList()
            }    
        });
        
    }

    render() {
        let date = new Date();

        const {
            totalProfitCount,
            normalProfitCount,
            normalProfitMoney,
            relayChannelProfitCount,
            relayChannelProfitMoney,
            totalTransferCount,

            tabType,
            detailType,
            businessType,
            businessId,
        } = this.state
        return (
            <Page title="嘉宾分成收益明细" className="separate-detail-page">
                <ScrollToLoad
                    className="scroll-box"
                    toBottomHeight={500}
                    noneOne={this.listNoneOne}
                    noMore={this.listNoMore} 
                    loadNext={ this.state.tabType=="detail"?this.loadDetailList.bind(this): this.loadClearingList.bind(this) }
                    hideNoMorePic= {true}>
        
                <section className="detail-state">
                    {
                        this.state.isManager!=='Y'?
                        <span className="complain-btn" onClick={()=>{this.refs.complainConfirm.show();}}>投诉</span>
                        :null
                    }
                    {
                        this.state.isMLive&&this.state.isManager=='Y'?
                        <div className="str-1"> <span>待发放（元）</span><i className="icon_ask2" onClick={this.waitClearingTips.bind(this)}></i> </div>
                        :
                        <div className="str-m-1"> <span>已发放（元）</span></div>
                    }
                    {
                        this.state.isMLive&&this.state.isManager=='Y'?
                        <div> <b className="str-2">{formatMoney(this.props.sumShareMoney.pendingMoney||"0")}</b> </div>
                        :
                        <div> <b className="str-m-2">{formatMoney(this.props.sumShareMoney.dealtMoney||"0")}</b> </div>
                    }
                    
                    <div className={`${this.state.isMLive&&this.state.isManager=='Y'?"str-3":"str-m-3"}`}>{this.state.businessType=="channel"?"系列课":(this.state.businessType =='camp'?"训练营":"课程")}分成产生的收益，会在7天后计入待发放金额</div>
                    {
                        this.state.isMLive&&this.state.isManager=='Y'?
                        <div className="separate-set">
                            <div className={this.state.autoClearing?"center":""}>
                                {
                                    this.state.separateStatus==="Y"?
                                    <span className="control-btn" onClick={this.onOverSeparate.bind(this)}>终止分成</span>
                                    :
                                    <span className="control-btn" onClick={this.onOpenSeparate.bind(this)}>恢复分成</span>
                                }                                
                            </div>
                            <div>
                                {
                                    !this.state.autoClearing?
                                    (
                                        this.props.sumShareMoney.pendingMoney!=""?
                                        <span className="clearing-btn" onClick={this.onClearingDialog.bind(this)}>给嘉宾发放收益</span>
                                        :
                                        <span className="clearing-btn">暂无待发放收益</span>
                                    )
                                    :null
                                }
                            </div>
                        </div>
                        :
                        null
                    }
                    
                </section>
                <section className="money-box">
                    <span>
                        嘉宾预计收益（元）
                        <var>{formatMoney(this.props.sumShareMoney.expectingMoney||"0")}</var>
                    </span>
                    {
                        this.state.isMLive&&this.state.isManager=='Y'?
                        <span>
                            已发放（元）
                            <var>{formatMoney(this.props.sumShareMoney.dealtMoney||"0")}</var>
                        </span>
                        :
                        <span>
                            待发放（元）<i className="icon_ask2" onClick={this.waitClearingTips.bind(this)}></i>
                            <var>{formatMoney(this.props.sumShareMoney.pendingMoney||"0")}</var>
                        </span>   
                    }
                </section>
                <section className="separate-info">
                    <div>
                        <span>分成比例：</span><var>{this.props.guestInfo.sharePercent}%</var>
                        {
                            this.state.isMLive&&this.state.isManager=='Y'&&this.state.separateStatus==="Y"&&
                            <span className="update-btn" onClick={this.onChangePercent.bind(this)}>修改</span>
                        }
                    </div>
                    <div>
                        <span>分成状态：</span><var>{this.state.separateStatus==="Y"?"分成中":"已结束"}</var>
                    </div>
                    <div>
                        <span>授权时间：</span><var>{formatDate(this.props.guestInfo.authorizeTime,'yyyy年MM月dd日 hh:mm:ss')}</var>
                    </div>
                    <div>
                        <span>分成结束时间：</span>
                        {
                            this.props.guestInfo.expiryTime?
                            <var>{formatDate(this.props.guestInfo.expiryTime,'yyyy年MM月dd日 hh:mm:ss')}</var>
                            :<var>无</var>
                        }
                        
                        {
                            this.state.isMLive&&this.state.isManager=='Y'&&this.state.separateStatus==="Y"&&
                            <span className="update-btn" onClick={this.onChangeTime.bind(this)}>{this.props.guestInfo.expiryTime?"修改":"设置"}</span>
                        }
                    </div>
                    
                </section>
                {
                    this.state.isMLive&&this.state.isManager=='Y'&&
                    <section>
                        <div className="auto-clearging-btn">
                            <span>自动发放嘉宾分成收益</span>
                            <i className="icon_ask2" onClick={this.autoClearingTips.bind(this)}></i>
                            <Switch
                            // Switch是开关状态
                            active={this.state.autoClearing}
                            // switch的大小'lg', 'md', 'sm'
                            size='md'

                            // 改变状态时调用 
                            onChange={this.OpenOrCloseAuto.bind(this)}

                            // 自定义样式
                            className='btn-switch-autoShare'
                            />                        
                        </div>
                    </section>
                }
                
                <section>
                    <div className="separate-channel" onClick={()=>{this.state.businessType==="channel"?locationTo("/live/channel/channelPage/"+this.state.channelId+".htm"):(this.state.businessType =='camp'?locationTo("/wechat/page/camp-detail?campId="+this.state.campId):locationTo("/topic/details?topicId="+this.state.topicId))}}>
                        <span className="back-btn">查看课程<i className="icon_enter"></i></span>
                        <span className="channel-name elli">{this.state.channelId?this.props.guestInfo.channelName:(this.state.campId?this.props.guestInfo.campName:this.props.guestInfo.topicName)}</span>
                        
                    </div>
                </section>
                <section className="income-list">
                    <div className="detail-tab">
                        <div onClick={()=>{this.onChangeListTab("detail")}}>
                            <span className={`${this.state.tabType == "detail" ? "active" : null}`}>分成收益明细 <span>（{totalProfitCount}）</span></span>
                        </div>
                        <div onClick={()=>{this.onChangeListTab("clearing")}}>
                            <span className={`${this.state.tabType == "clearing" ? "active" : null} `}>发放记录 <span>（{totalTransferCount}）</span></span>
                        </div>                  
                    </div>

                    {
                        businessType === 'channel' &&
                        tabType === 'detail' &&
                        <div className='secondary-tab'>
                            <span className={classNames({'active':detailType==='normal'})} onClick={() => { this.detailSourseChange('normal') }}>直播间成交(<var>{normalProfitCount}</var>)</span>
                            <span className={classNames({ 'active': detailType ==='relay_channel'})} onClick={() => { this.detailSourseChange('relay_channel') }}>知识通成交(<var>{relayChannelProfitCount}</var>)</span>
                            {
                                detailType === 'normal' &&    
                                    <div className="tips">此处展示该课程通过除“知识通”以外的销售渠道产生的所有归属于嘉宾的分成交易明细，当前收益共计<var>{formatMoney(normalProfitMoney)}元</var></div>
                            }
                            {
                                detailType === 'relay_channel' &&
                                    <div className="tips">此处展示该课程通过“知识通”销售渠道产生的所有归属于嘉宾的分成交易明细，当前收益共计<var>{formatMoney(relayChannelProfitMoney)}元</var></div>
                            }    
                        </div>
                    }
                        
                    {
                        this.state.tabType == "clearing"
                        ?
                        <div className="list-clearing">
                            <ClearingList item={this.props.clearingList}/>                            
                        </div>
                        :
                        (
                            this.state.detailType ==='normal'?
                            <div className={classNames('list-detail', {active: this.state.detailType === 'normal' })}>
                                <DetailList item={this.props.detailLiveList} businessType={this.state.businessType}/>                                                                                                                                                                                                                                                 
                            </div>
                            :
                            <div className={classNames('list-detail', { active: this.state.detailType === 'relay_channel' })}>
                                <DetailList item={this.props.detailList} businessType={this.state.businessType}/>                                                                     
                            </div>
                        )
                    }
                </section>

                

                </ScrollToLoad>
                <Confirm
                    className="clearing-tips-dialog"
                    ref='waitTipsDialog'
                    title={`什么是待发放？`}
                    titleTheme='white'
                    buttonTheme='line'
                    cancelText= '知道了'
                    show={ false }                                 // 是否显示弹框
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel'                       // 按钮配置 
                >
                    <div>还未发放给分成嘉宾的分成收益，需要直播间发放。</div>
                </Confirm>

                
                <Confirm
                    className={`${isAndroid()?"clearing-confirm-dialog android":"clearing-confirm-dialog"}`}
                    ref='clearingDialog'
                    title={`嘉宾收益发放`}
                    titleTheme='white'
                    buttonTheme='line'
                    show={ false }                                 // 是否显示弹框
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel-confirm'                       // 按钮配置
                    onBtnClick={ this.onClearingConfirmDialog.bind(this) }   
                >
                    <div>
                        <span className="input-box"><input type="text" value={this.state.clearingMoney} onChange={this.onChangeClearingMoneyInput.bind(this)}/> <i>元</i></span>
                        <span>当前最多可给嘉宾发放<var>{formatMoney(this.props.sumShareMoney.pendingMoney)}</var>元，本次实际发放<var>{this.state.clearingMoney}</var>元
                        。</span>
                        <span>结算后，嘉宾即可获得发放收益。</span>
                        <br/><span>提醒：发放金额需大于1元或等于0元，若线下发放收益，则此处可输入0元。</span>
                        <div className="clear-next-box">
                            <span>剩余金额计入下一期发放</span>
                            <Switch
                            // Switch是开关状态
                            active={this.state.autoNextClearing}
                            // switch的大小'lg', 'md', 'sm'
                            size='md'

                            // 改变状态时调用 
                            onChange={this.OpenOrCloseAutoNext.bind(this)}

                            // 自定义样式
                            className='btn-switch-autoNext'
                            />
                        </div>

                        <span>开启则剩余{(formatMoney(this.props.sumShareMoney.pendingMoney)-Number(this.state.clearingMoney)).toFixed(2)}元未发放金额将计入下一期发放，未开启则剩余金额不会再发放给嘉宾</span>

                        <br/><span>钱包余额：{formatMoney(this.props.sumShareMoney.liveBalance||0)}元</span>
                        <span className="input-box"><input type="text" placeholder="添加备注（20字以内）" onChange={this.onChangeClearingRemarkInput.bind(this)}/></span>
                    </div>
                </Confirm>
                <Confirm
                    className="clearing-confirm-dialog"
                    ref='clearingConfirmAgain'
                    title={`是否确认发放?`}
                    titleTheme='white'
                    buttonTheme='line'
                    confirmText={this.state.isQlLive ? '提交财务审核' : '确定发放'}
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel-confirm'                       // 按钮配置  
                    onBtnClick={ this.onClearingConfirm.bind(this) }
                >
                    <div>
                        本次实际发放{this.state.clearingMoney}元，剩余{(formatMoney(this.props.sumShareMoney.pendingMoney)-this.state.clearingMoney).toFixed(2)}元未发放金额将{this.state.autoNextClearing?"下次":"不会"}再发放给嘉宾。<br/>
                        {
                            this.state.clearingRemark!=""&&"备注："+this.state.clearingRemark
                        }
                    </div>
                </Confirm>
                <Confirm
                    className="auto-confirm-dialog"
                    ref='clearingAutoConfirmAgain'
                    title={`${this.state.autoClearing?"确认关闭自动发放嘉宾收益？":"确认开启自动发放嘉宾收益？"}`}
                    titleTheme='white'
                    buttonTheme='line'
                    confirmText= '确定'
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel-confirm'                       // 按钮配置  
                    onBtnClick={ this.onChangeAutoConfirm.bind(this) }
                >
                    <div>
                        {
                            this.state.autoClearing?
                            "关闭自动发放嘉宾收益后，则需您手动在此页面进行给嘉宾发放。"
                            :<span className="tips-style1">请确认合作老师为可信任的合作关系，开启自动发放收益后，系统将会每天自动结算老师的收益，中途也可修改为手动发放模式。<br/></span> 
                        }
                        {
                            this.state.autoClearing?null: "请勿提前提现所有金额，否则导致无法自动分成。"
                        }

                        
                    </div>
                </Confirm>
                <Confirm
                    className="clearing-tips-dialog"
                    ref='autoClearingTipsDialog'
                    title={`自动发放嘉宾分成收益？`}
                    titleTheme='white'
                    buttonTheme='line'
                    cancelText= '知道了'
                    show={ false }                                 // 是否显示弹框
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel'                       // 按钮配置 
                >
                    <div>开启自动发放分成后，将会有系统自动给嘉宾发放收益，请勿提前提现直播间收益，否则将导致无法自动分成。</div>
                </Confirm>
                <Confirm
                    className="clearing-confirm-dialog"
                    ref='complainConfirm'
                    title={`确定投诉直播间?`}
                    titleTheme='white'
                    buttonTheme='line'
                    confirmText= '确定投诉'
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel-confirm'                       // 按钮配置  
                    onBtnClick={ this.onComplainConfirm.bind(this) }
                >
                    <div>
                        若遇到合作问题，请先与您合作的直播间进行沟通，避免产生误会。
                    </div>
                </Confirm>
                <Confirm
                    className="clearing-confirm-dialog"
                    ref='overSeparateDialog'
                    title={`是否终止该嘉宾分成收益？`}
                    titleTheme='white'
                    buttonTheme='line'
                    confirmText= '终止'
                    show={ false }                                 // 是否显示弹框
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel-confirm'                       // 按钮配置
                    onBtnClick={ this.onOverSeparateConfirm.bind(this) }  
                >
                    <ul>
                        <li>1.终止后嘉宾将失去本{this.state.businessType=="channel"?"系列课":(this.state.businessType =='camp'?"训练营":"课程")}入场券收益分成资格。</li>
                        <li>2.该操作会导致嘉宾分成关系终止，请与嘉宾协商后再进行操作。</li>
                    </ul>
                </Confirm>

                <Confirm
                    className="clearing-confirm-dialog"
                    ref='setPercentDialog'
                    title={`修改分成比例`}
                    titleTheme='white'
                    buttonTheme='line'
                    show={ false }                                 // 是否显示弹框
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel-confirm'                       // 按钮配置
                    onBtnClick={ this.onChangePercentConfirm.bind(this) }   
                >
                    <div>
                        <span className="input-box"><input type="text" value={this.state.percent} onChange={this.onChangePercentInput.bind(this)}/> <i>%</i></span>
                        {this.state.percent!=""&&<span>你将获得{this.state.businessType=="channel"?"系列课":(this.state.businessType =='camp'?"训练营":"课程")}入场券利润的<var>{100-Number(this.props.assignedPercent)+Number(this.props.guestInfo.sharePercent)-this.state.percent}%</var></span>}
                        {this.state.percent!=""&&<i className="icon_ask2" onClick={()=>{this.refs.setPercentTipsDialog.show()}}></i>}
                    </div>
                </Confirm>
                <Confirm
                    className="clearing-tips-dialog"
                    ref='setPercentTipsDialog'
                    title={`嘉宾分成比例说明`}
                    titleTheme='white'
                    buttonTheme='line'
                    cancelText= '知道了'
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel'                       // 按钮配置
                >
                    <ul>
                        <li>1.普通订单：订单收入扣除渠道成本（微信手续费<var>0.6%</var>），剩余为课程净收入，此嘉宾分净收入的<var>{this.state.percent}%</var>，其他嘉宾分净收入的<var>{Number(this.props.assignedPercent)-Number(this.props.guestInfo.sharePercent)}%</var>，直播间（你）分净收入的<var>{100-Number(this.props.assignedPercent)+Number(this.props.guestInfo.sharePercent)-Number(this.state.percent)}%</var>。</li>
                        <li>2.分销订单：订单收入扣除渠道成本（课代表分成及微信手续费<var>0.6%</var>），剩余为课程净收入，此嘉宾分净收入的<var>{this.state.percent}%</var>，其他嘉宾分净收入的<var>{Number(this.props.assignedPercent)-Number(this.props.guestInfo.sharePercent)}%</var>，直播间（你）分净收入的<var>{100-Number(this.props.assignedPercent)+Number(this.props.guestInfo.sharePercent)-Number(this.state.percent)}%</var>。</li>
                    </ul>
                </Confirm>


                <Confirm
                    className="clearing-confirm-dialog"
                    ref='setOverTimeDialog'
                    title={`${this.state.separateStatus=="Y"?"修改":"设置"}分成结束时间`}
                    titleTheme='white'
                    buttonTheme='line'
                    show={ false }                                 // 是否显示弹框
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    buttons='cancel-confirm'                       // 按钮配置
                    onBtnClick={ this.onSetOverTimeConfirm.bind(this) }   
                >
                    <div>
                    <DatePicker mode="datetime"
                        title="结束时间" 
                        minValue={dayjs(new Date(date.getFullYear(),date.getMonth(),date.getDate()+1))}
                        value={this.state.separateStatus=="Y"&&this.props.guestInfo.expiryTime? dayjs(this.props.guestInfo.expiryTime) : dayjs(new Date(date.getFullYear(),date.getMonth(),date.getDate()+1))}
                        style="normal-time-picker"
                        barClassName="input"
                        onChange={this.onEndDateSelect.bind(this)}
                        >
                        <span className="input-box">
                            <var className="timePickBox">{this.state.separateEndTime?formatDate(this.state.separateEndTime,'yyyy-MM-dd hh:mm'):"请选择时间"}</var>
                        </span>
                    </DatePicker>
                        
                        <span>不设置时间则不会自动结束分成，需手动终止</span>
                    </div>
                </Confirm>
                
            </Page>
        );
    }
}
function mapStateToProps(state){
    return{
        userInfo: state.common.userInfo,
        guestInfo: state.guestSeparate.guestInfo,
        sumShareMoney: state.guestSeparate.sumShareMoney,
        assignedPercent: state.guestSeparate.assignedPercent,
        power: state.common.power,
        clearingList: state.guestSeparate.clearingList,
        detailList: state.guestSeparate.detailList,
        detailLiveList: state.guestSeparate.detailLiveList,
    }
}

const mapDispatchToProps ={
    getSeparateClearingList,
    getSeparateDetailList,
    getProfitRecordCount,
    getTransferRecordCount,
    setGuestSeparateEndTime,
    overSeparate,
    guestSeparateClearing,
    acceptTimePercentPlease,
    updateIsAutoTransfer,
	isQlLive,
	isExistAuditRecord
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(IncomeDetail);