import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import Page from 'components/page';
import { locationTo , validLegal , isNumberValid ,formatDate, formatMoney, getVal, htmlTransferGlobal } from 'components/util';
import { autobind } from 'core-decorators';
import Switch from 'components/switch';
import DatePicker from 'components/date-picker';
import Picker from 'components/picker';
import Confirm from 'components/dialog/confirm';
import { MiddleDialog} from 'components/dialog';

//action 
import {getChannelMarket, saveChannelMarket } from '../../actions/channel-market';
import { fetchAndUpdateSysTime } from '../../actions/common';
import { getChannelInfo } from '../../actions/channel';
import { isFunctionWhite, isLiveAdmin} from 'common_actions/common';
import { changeChannelAutoDistributionSet,saveChannelAutoDistributionSet,channelAutoDistributionInfo } from '../../actions/channel-distribution';

@autobind
class ChannelMarketSeting extends Component {
    objTempData = {}
    state={
        marketType:(this.props.marketInfo.discountStatus==='N' || this.props.marketInfo.discountStatus=="P" || this.props.marketInfo.discountStatus=="GP" || this.props.marketInfo.discountStatus=="K") ? 'Y' : this.props.marketInfo.discountStatus,
        marketMoney:this.props.marketInfo.discountStatus=="P"||this.props.marketInfo.discountStatus=="GP"?this.props.marketInfo.discount:"",
        marketCount:this.props.marketInfo.discountStatus=="P"||this.props.marketInfo.discountStatus=="GP"?this.props.marketInfo.groupNum:'',
        marketTMoney:this.props.marketInfo.discountStatus=="Y"?this.props.marketInfo.discount:"",

	    leaderFreeSwitchActive: this.props.marketInfo.discountStatus === 'P',
	    simulationStatusActive: this.props.marketInfo.simulationStatus === 'Y', // 模拟拼课


        marketCutCount: this.props.marketInfo.discountStatus=="K"?this.props.marketInfo.personNum:'',
        marketCutMoney: this.props.marketInfo.discountStatus=="K"?formatMoney(this.props.marketInfo.minimumAmount):'',
        joinTime: [''+ (this.props.marketInfo.groupHour || 24)],
        joinTimeValue: '',
        joinTimeArr: [],
        startTime : this.props.marketInfo.discountStatus=="Y"? (getVal(this.props,'marketInfo.discountExtendPo.startTime','')? new Date(getVal(this.props,'marketInfo.discountExtendPo.startTime')):''):this.props.marketInfo.startTime? new Date(this.props.marketInfo.startTime):new Date(),
        endTime: this.props.marketInfo.discountStatus=="Y"? (getVal(this.props,'marketInfo.discountExtendPo.endTime','') ? new Date(getVal(this.props,'marketInfo.discountExtendPo.endTime')):'' ):this.props.marketInfo.endTime ? new Date(this.props.marketInfo.endTime) : '',
        discountTag: htmlTransferGlobal(getVal(this.props,'marketInfo.discountExtendPo.discountTag','')),
        limitNum: getVal(this.props,'marketInfo.discountExtendPo.limitNum',''),
        soldNum: getVal(this.props,'marketInfo.discountExtendPo.soldNum',''),
        
        showDialogs:false,
        isFunctionWhite: false,
        // 是否专业版
        isLiveAdmin:false,
    };

    componentWillMount() {
        let joinTimeArr = []
        for(let i = 0.5; i <= 48; i = i + 0.5) {
            joinTimeArr.push({
                value: `${i}`,
                label: `${i}小时`
            })
        }
        this.setState({
            joinTimeArr
        })
    }
    async componentDidMount() {
        const channelId = this.props.location.query.channelId;
        if(channelId){
            // this.initMarkSetting();
            let res = await this.props.getChannelInfo(channelId);
            let liveId = res.data.channel.liveId;
            // 添加逻辑 如果是训练营的系列课 不要显示拼团 产品：欧亚铭
            if (res.data.channel.isCamp == 'Y') {
                this.setState({
                    isFunctionWhite: false
                })
            } else {
                let data = await isFunctionWhite(liveId, 'channel_group');
                this.setState({ isFunctionWhite: data.isWhite == 'Y' });
            }
            this.getLiveAdmin(liveId)
        }

        this.initSysTime();
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0)
    }

    async initSysTime(){
        await this.props.fetchAndUpdateSysTime();
    }


    async initMarkSetting(){
        let result=await this.props.getChannelMarket(this.props.location.query.channelId);
            this.setState({
                marketType: (this.props.marketInfo.discountStatus==='N')?'P':this.props.marketInfo.discountStatus,
                marketMoney: this.props.marketInfo.discountStatus=="P"||this.props.marketInfo.discountStatus=="GP"?this.props.marketInfo.discount:"",
                marketCount: this.props.marketInfo.discountStatus=="P"||this.props.marketInfo.discountStatus=="GP"?this.props.marketInfo.groupNum:'',
                marketTMoney: this.props.marketInfo.discountStatus=="Y"?this.props.marketInfo.discount:"",
                leaderFreeSwitchActive: this.props.marketInfo.discountStatus === 'P',
                simulationStatusActive: this.props.marketInfo.simulationStatus === 'Y'
            });
    }

    async getLiveAdmin(liveId) {
        let result = await this.props.isLiveAdmin(liveId);
        let isLiveAdmin = getVal(result, 'data.isLiveAdmin', '');
        this.setState({
            isLiveAdmin: isLiveAdmin === 'Y',
        })
    }

    async chooseMarketType(type){
        if( this.state.marketType === type ){
            type = 'N';
        }
        switch (type) {
            case 'P':this.setState({marketType:"P"});break;
            case 'Y':this.setState({marketType:"Y"});break;
            case 'K':this.setState({marketType:"K"});break;
            case 'N':this.setState({marketType:"N"});break;
        }
    }

    async notUseMarket(){
        if(this.props.marketInfo.discountStatus !=='N'){
            await this.chooseMarketType("N");
            this.saveChannelMarket();
        }else{
            locationTo("/live/channel/channelPage/"+this.props.location.query.channelId+".htm");
        }
    }

    async saveChannelMarket(){
        let { marketType, 
            leaderFreeSwitchActive, 
            simulationStatusActive, 
            marketMoney, 
            marketTMoney, 
            marketCount, 
            marketCutCount, 
            marketCutMoney, 
            startTime, 
            endTime,
            joinTime,
            soldNum,
            limitNum,
            discountTag
        } = this.state
        let channelId = this.props.location.query.channelId,
            type = (marketType === 'GP' || marketType === 'P') ? (leaderFreeSwitchActive ? 'P' : 'GP') : marketType,
            money= type==="P"||type==="GP" ? marketMoney.toString():marketTMoney.toString(),
            count= type==="P"||type==="GP" ? marketCount.toString():"";
        let cutNum = marketCutCount||0;
        let cutMoney = marketCutMoney.toString()||0;
        let cutStartTime = startTime?startTime.getTime():'';
        let cutEndTime = endTime?endTime.getTime():'';
        let fecthBol=true;

        switch (type) {
            case 'K':
                fecthBol=isNumberValid(cutNum,3,99,"砍价人数")&&
                    validLegal("money", "砍价最低价", cutMoney, this.props.marketInfo.money, 0)&&
                    validLegal("time", "结束时间", cutEndTime.toString());
                break;
            case 'GP':
            case 'P':
            	if(money >= this.props.marketInfo.money){
		            fecthBol = false;
		            window.toast('拼课价必须小于原价');
		            break;
	            }
            	fecthBol = validLegal("money", "拼课价", money, this.props.marketInfo.money, 0.01) && isNumberValid(count,2,50,"拼课人数");break;
            case 'Y':
                fecthBol = validLegal("money", "特价优惠价", money, this.props.marketInfo.money, 1) &&
                    (discountTag == '' || validLegal("text", "活动标签", discountTag, 5, 2));
                if (fecthBol && limitNum !== '') {
                    if ( limitNum <= 0) {
                        fecthBol = false;
                        window.toast('活动限量不能小于或等于0');
                        
                    } else if (soldNum > limitNum) {
                        fecthBol = false;
                        window.toast('活动限量不能小于已购限量');
                    }
                }
                if (fecthBol && cutStartTime && cutEndTime && cutStartTime>cutEndTime) {
                    fecthBol = false;
                    window.toast('开始时间不能小于活动时间');
                    
                }

                break;
        }

        this.objTempData = {
            fecthBol,
            channelId,
            type,
            money,
            count,
            cutMoney,
            cutNum,
            cutStartTime,
            cutEndTime,
            groupHour: joinTime[0],
            simulationStatus: simulationStatusActive ? 'Y' : 'N',
            limitNum,
            discountTag
        }
        // 拼团还需要判断 团长免费  模拟拼课 是否出错
        if (type == 'P' && leaderFreeSwitchActive && simulationStatusActive && fecthBol) {
            this.refs.freeConfirm.show()
            return
        }
        this.handleSaveChannelMarket()
    }


    async handleSaveChannelMarket() {
        let { fecthBol,
            channelId,
            type,
            money,
            count,
            cutMoney,
            cutNum,
            cutStartTime,
            cutEndTime,
            groupHour,
            simulationStatus,
            limitNum,
            discountTag
         } = this.objTempData

        if(fecthBol){
            if (type == 'K' && !cutStartTime) {
                cutStartTime = Date.now();
            }
	        let result = await this.props.saveChannelMarket({
                channelId,
                discountType: type,
                discount : money, 
                groupNum: count,
                minimumAmount: cutMoney,
                personNum: cutNum,
                startTime: cutStartTime,
                endTime: cutEndTime,
                groupHour,
                simulationStatus,
                limitNum: limitNum,
                discountTag: discountTag,
            });
	        if(result.state.code===0){
                window.toast("保存成功！");
                locationTo("/live/channel/channelPage/"+channelId+".htm");
	        }else{
		        window.toast(result.state.msg);
            }
        }
    }

    changeMarketCutMoney(e){
        this.setState({
            marketCutMoney:e.currentTarget.value,
        })

    }

    changeMarketCutCount(e){
        this.setState({
            marketCutCount:e.currentTarget.value,
        })
    }
    changeMarketCutTime(e){
        
    }

    changeMarketMoney(e){
        this.state.marketType=="P"||this.state.marketType=="GP"?
        this.setState({
            marketMoney:e.currentTarget.value,
        })
        :
        this.setState({
            marketTMoney:e.currentTarget.value,
        });

    }

    changeMarketCount(e){
        this.setState({
            marketCount:e.currentTarget.value,
        });
    }

	leaderFreeSwitchChangeHandle(){
		this.setState({
			leaderFreeSwitchActive: !this.state.leaderFreeSwitchActive
		})
	}
	simulationSwitchChangeHandle(){
		this.setState({
			simulationStatusActive: !this.state.simulationStatusActive
		})
	}

    changeDiscountTag(e){
        this.setState({
            discountTag:e.currentTarget.value,
        })

    }
    changeLimitNum(e){
        this.setState({
            limitNum:e.currentTarget.value,
        })

    }



    /**
     * 选择砍价的开始日期
     * @param {*Date} date 
     */
    // onStartDateSelect(date){
    //     this.setState({
    //         startTime: new Date(formatDate(date.getTime(), 'yyyy/MM/dd hh:mm:ss'))
    //     }, this.endDateLinkage);
        
    // }
    //改动开始时间，超过了结束时间，结束时间联动
    endDateLinkage(){
        if(this.state.endTime&&this.state.endTime<this.state.startTime){
            this.setState({
                endTime: this.state.startTime,
            });
        }
    };

    /**
     * 选择砍价的结束日期
     * @param {*date} date 
     */
    onEndDateSelect(date){
        this.setState({
            endTime: date?new Date(formatDate(date.getTime(), 'yyyy/MM/dd hh:mm:ss')):''
        });
    }
    /**
     * 选择拼团有效时间
     */
    selectJoinHandle (newValue) {
        let joinTimeValue = this.state.joinTimeArr.find(item => item.value == newValue[0]).label
        this.setState({
            joinTimeValue,
            joinTime: newValue
        })
    }

    onFreeBtnClick(type) {
        this.refs.freeConfirm.hide()
        if (type == 'confirm') {
            this.handleSaveChannelMarket()
        }
    }
    handleQuestion() {
        this.refs.likeConfirm.show()
    }
    onLikeBtnClick() {
        this.refs.likeConfirm.hide()
    }
    /**
     * 选择砍价的开始日期
     * @param {*date} date 
     */
    onStartDateSelect(date){
        this.setState({
            startTime: date?new Date(formatDate(date.getTime(), 'yyyy/MM/dd hh:mm:ss')):''
        });
    }



    switchDialog() {
        this.setState({
            showDialogs:!this.state.showDialogs
        })
    }


    render() {

        const { // 砍价活动开始日期
            startTime,
            // 砍价活动结束日期
            endTime, 
        } = this.state;
        // 开始日期至少从当天开始
        const today = new Date(formatDate(this.props.sysTime, 'yyyy/MM/dd hh:mm:ss'));
        const minStartDate = dayjs(new Date(formatDate(this.props.sysTime, 'yyyy/MM/dd hh:mm:ss')).getTime());
        // 结束日期的选择范围至少从开始日期的当天开始
        let minEndDay;
        // 砍价活动的周期最多为999天
        let endDay;
        // 默认选中的开始日期和结束日期
        let defaultStartDay;
        if (startTime) {
            minEndDay = new Date(startTime.getTime());
            endDay = new Date(startTime.getTime() + 24 * 60 * 60 * 1000 * 998);
            defaultStartDay = startTime;
        } else {
            minEndDay = new Date(today.getTime());
            endDay = new Date(today.getTime() + 24 * 60 * 60 * 1000 * 998);
            defaultStartDay = today;
        }
        const defaultStartDate = dayjs(defaultStartDay);
        let defaultEndDate;
        if (endTime) {
            const defaultEndDay = endTime;
            defaultEndDate = dayjs(defaultEndDay);
        }
        const minEndDate = dayjs(minEndDay);
        const maxEndDate = dayjs(endDay);
        
        return (
            <Page title="课程促销" className='market-type-set'>
                <div className="market-main">
                    <div className="money-tip">请选择促销类型，现原价为 {this.props.marketInfo.money} 元</div>
                    <dl className='market-type-box'>
                        <div className="market-type-select">
                            <div  className={`btn-market-type te ${this.state.marketType === 'Y'?"active":""}`} onClick={()=>{this.chooseMarketType("Y");}} >
                                特价优惠
                                <i>提高成交率</i>
                            </div>
                            {/*微信禁止拼课了*/}
                            {
                                (this.state.isFunctionWhite || this.state.isLiveAdmin ) &&
                                    <div  className={`btn-market-type cut ${this.state.marketType === 'K'?"active":""}`} onClick={()=>{this.chooseMarketType("K");}} >
                                        砍价
                                        <i>推广神器</i>
                                    </div>
                            }
                            {
                                (this.state.isFunctionWhite || this.state.isLiveAdmin ) &&
                                    <div className={`btn-market-type pin ${this.state.marketType === 'P' || this.state.marketType === 'GP'?"active":""}`}  onClick={()=>{this.chooseMarketType("P");}}>
                                        
                                        拼课
                                        <i>多人拼单享优惠</i>
                                    </div>
                            }
                        </div>
                        <dd  className={`input-box ${this.state.marketType==="K"?'active':''}`}>
                            
                            <label>
                                <i className="edit-title must">设置砍价人数</i>
                                <input type="number" placeholder="请输入砍价上限人数" value={this.state.marketCutCount} onChange={this.changeMarketCutCount.bind(this)}/>
                            </label>

                            <label>
                                <i className="edit-title must">设置砍价后价格（元）</i> 
                                <input type="number" placeholder="请输入砍后价"  className="money-input"  value={this.state.marketCutMoney} onChange={this.changeMarketCutMoney.bind(this)}/>
                            </label>
                            <label>   
                            <i className="edit-title must">设置结束时间</i> 
                                <DatePicker mode="datetime"
                                    title="结束时间" 
                                    minValue={minEndDate} 
                                    maxValue={maxEndDate} 
                                    value={defaultEndDate}
                                    style="market-t-time-picker"
                                    barClassName="date-picker"
                                    onChange={this.onEndDateSelect.bind(this)}
                                    >
                                    
                                    <span className="cut-start-time-input-box " style={{cursor: 'pointer'}}>
                                        
                                    {
                                        endTime ?
                                            <i className="value">{formatDate(endTime,'yyyy-MM-dd hh:mm:ss')}</i>
                                        :
                                            <i className="value placeholder">请选择结束时间(必填)</i>
                                    }
                                        <i className="icon_enter"></i>
                                    </span>
                                </DatePicker>
                            </label>
                            <div className='bottom-tip'>  
                                <div className="tip">
                                    1. 达到设定的砍价人数，用户即可享受砍后价； 
                                </div>
                                <div className="tip">
                                    2. 砍后价最低可填0，即可砍到免费； 
                                </div>
                                <div className="tip">
                                    3. 活动结束，未达标的用户砍价失败。
                                </div>
                            </div>  
                        </dd>
                        
                        <dd className={`input-box on-log on-visible ${this.state.marketType==="P"||this.state.marketType==="GP"?'active':''}`}
                            data-log-name="拼课设置访问数"
                            data-log-region="ping-setting"
                            data-log-pos="origin"
                        >
                            {
                                this.state.isFunctionWhite &&
                                <div className="group-notice">
                                    <div className="subtitle">拼课须知</div>
                                    <div className="flow">
                                        ①开团或购买拼课
                                        <div className="arrow"></div>
                                        ②分享拼课给好友
                                        <div className="arrow"></div>
                                        ③进入听课
                                    </div>
                                </div>
                            }
                            <label>
                                <i className="edit-title must">拼课人数</i> 
                                <input type="number" placeholder="请输入拼课人数" value={this.state.marketCount} onChange={this.changeMarketCount.bind(this)}/>
                            </label>
                            <label>
                                <i className="edit-title must">设置拼课价（元）</i> 
                                <input type="number" placeholder="请输入拼课价格"  className="money-input" value={this.state.marketMoney} onChange={(e)=>{this.changeMarketMoney(e)}}/>
                            </label>  
                            <div className="check-wrap">
                                <span className="label-title">团长免费</span> 
                                <Switch className="bonus-switcher" active={this.state.leaderFreeSwitchActive} onChange={this.leaderFreeSwitchChangeHandle} />
                            </div>   
                            <div className="check-wrap date-picker-wrap">
                                <div className="label-title">
                                    <div className="">拼课团有效时长</div>
                                    <div className="label-title-tip">
                                        在拼课有效期内未成团，则拼团失败
                                    </div>
                                </div> 
                                <Picker
                                    col={1}
                                    data={this.state.joinTimeArr}
                                    value={this.state.joinTime}
                                    title="请选择时间"
                                    onChange={this.selectJoinHandle}
                                >
                                    <div className='select-tag'>
                                    {this.state.joinTimeValue || (this.props.marketInfo.groupHour ? this.props.marketInfo.groupHour: 24) + '小时'}
                                        <i className='icon_enter'></i>
                                    </div>
                                </Picker>
                            </div> 
                            <div className="check-wrap flex-coloum">
                                <div className="flex-justrify-between">
                                    <div className="label-title moni-style" onClick={this.handleQuestion}>
                                        模拟拼课 
                                        <img src={require('./img/question.png')} className=""></img>
                                    </div>
                                    <Switch className="bonus-switcher" active={this.state.simulationStatusActive} onChange={this.simulationSwitchChangeHandle} />
                                </div>
                                <div className="label-title-tip">
                                    开启模拟拼课后，有效期内未达到拼课人数的拼课团，系统将投放”模拟用户“保证拼课成功。拼课成功后，直播间获得真实拼课的对应课程收入。
                                </div>
                            </div>
                            <div className='padding-tip'>  
                                <div className="tip">
                                    1. 团长包含在拼课人数内； 
                                </div>
                                <div className="tip">
                                    2. 拼课价需低于课程原价； 
                                </div>
                                <div className="tip">
                                    3. 开启团长免费后，团长可免费开团，邀请好友满团才可获得免费听课资格；
                                </div>
                                <div className="tip">
                                    4. 拼课成功后学员支付费用才能到账，失败则原路返还给用户。
                                </div>
                            </div>
                        </dd>

                        {/* 特价 */}
                        <dd className={`input-box ${this.state.marketType==="Y"?'active':''}`}>
                            <label>
                                <i className="edit-title must">设置优惠价格（元）</i> 
                                <input type="number" placeholder="请输入特价优惠价格" className="money-input" value={this.state.marketTMoney} onChange={this.changeMarketMoney.bind(this)}/>
                            </label>
                            <label>
                                <i className="edit-title">设置优惠开始时间</i> 
                                <DatePicker mode="datetime"
                                    title="开始时间" 
                                    minValue={dayjs(this.props.sysTime)} 
                                    maxValue={maxEndDate} 
                                    value={defaultStartDate}
                                    style="market-t-time-picker"
                                    barClassName="date-picker"
                                    onChange={this.onStartDateSelect.bind(this)}
                                    >
                                    
                                    <span className="cut-start-time-input-box " style={{cursor: 'pointer'}}>
                                        
                                    {
                                        startTime ?
                                            <i className="value">{formatDate(startTime,'yyyy-MM-dd hh:mm:ss')}</i>
                                        :
                                            <i className="value placeholder">请选择开始时间</i>
                                    }
                                    {
                                        startTime ?
                                            <span className="btn-del-date" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                this.onStartDateSelect(false);
                                            }}></span>
                                            : null
                                    }  
                                    </span>
                                </DatePicker>
                                
                            </label>
                            <label>
                                <i className="edit-title">设置优惠结束时间</i> 
                                <DatePicker mode="datetime"
                                    title="结束时间" 
                                    minValue={defaultStartDate} 
                                    maxValue={maxEndDate} 
                                    value={defaultEndDate}
                                    style="market-t-time-picker"
                                    barClassName="date-picker"
                                    onChange={this.onEndDateSelect.bind(this)}
                                    >
                                    
                                    <span className="cut-start-time-input-box " style={{cursor: 'pointer'}}>
                                        
                                    {
                                        endTime ?
                                            <i className="value">{formatDate(endTime,'yyyy-MM-dd hh:mm:ss')}</i>
                                        :
                                            <i className="value placeholder">请选择结束时间</i>
                                    }
                                    {
                                        endTime ?
                                            <span className="btn-del-date" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                this.onEndDateSelect(false);
                                            }}></span>
                                            : null
                                    } 
                                    </span>
                                </DatePicker>
                                
                            </label>

                            <label>
                                <i className="edit-title">活动限量</i> 
                                <span className="msg-left">活动时间内，仅限量特价出售，限量售馨后，恢复原价，不填写不限量。</span>
                                <div className="number-input-box">
                                    <input type="number" placeholder="请输入限量个数" className="money-input" value={this.state.limitNum} onChange={this.changeLimitNum.bind(this)}/>
                                    <span className="msg-span-one">已售：{this.state.soldNum||0}/{this.state.limitNum||0}</span>
                                </div>
                            </label>


                            <label>
                                <i className="edit-title">活动标签 <span className="msg-btn" onClick={this.switchDialog}>示例</span> </i> 
                                <input  placeholder="限时特价" className="money-input" value={this.state.discountTag} onChange={this.changeDiscountTag.bind(this)}/>
                            </label>
                            
                            
                        </dd>
                        
                    </dl>
                </div>
                <div className="bottom-confirm">
                    <a className="btn-save-market" href="javascript:;"  onClick={this.saveChannelMarket}>保存</a>
                    <div className="back-noselect"><span className="btn-not-select" onClick={this.notUseMarket} >暂不使用促销</span></div>
                </div>
                    
                <Confirm
                    ref='freeConfirm'
                    title='确定同时开启【团长免费】和【模拟拼课】吗'
                    content=''
                    buttons='cancel-confirm'
                    onBtnClick={ this.onFreeBtnClick }
                >
                    <div className="confirm-free-tip">同时开启两个开关，团长一定能免费听课哦。</div>
                </Confirm>
                <Confirm
                    ref='likeConfirm'
                    buttons='cancel'
                    onBtnClick={ this.onLikeBtnClick }
                    cancelText='关闭'
                >
                    <div className="confirm-like-wrap">
                        <div className="confirm-like-title">
                            模拟拼课介绍
                        </div>
                        <div className="confirm-like-step">
                            <div className="confirm-step-item">
                                <img src={require('./img/pin.png')}/>
                                <div className="step-word">开启拼课</div>
                                <span className="red-line"></span>
                            </div>
                            <div className="confirm-step-item">
                                <img src={require('./img/group.png')}/>
                                <div className="step-word">
                                    <div>学员参与</div>
                                    <div>等待成团</div>
                                </div>
                                <span className="red-line"></span>
                            </div>
                            <div className="confirm-step-item">
                                <img src={require('./img/money.png')} />
                                <div className="step-word">
                                    <div>模拟拼课</div>
                                    <div>收益到账</div>
                                </div>
                            </div>
                        </div>
                        <div className="confirm-like-main">
                            <div className="confirm-like-tip">
                                模拟拼课是保障拼课成团率的一种手段。 开启模拟拼课后，拼课有效期内未达到拼课人数的团，系统将投放”模拟用户“保证拼课成功。
                            </div>
                            <img src={require('./img/list.png')} className="confirm-like-img"/>
                            <div className="confirm-like-tip">
                                *拼课详情中的匿名用户即为系统投放的模拟用户
                            </div>
                        </div>
                    </div>
                </Confirm>
                <MiddleDialog
                    show={this.state.showDialogs}
                    buttons='cancel'
                    theme='empty'
                    cancelText='确认'
                    bghide
                    titleTheme={'white'}
                    buttonTheme='line'
                    className="sale-tips-dialog"
                    title='活动标签'
                    onClose={this.switchDialog}
                    onBtnClick={this.switchDialog}
                >
                    <img className='tips-img' src={require('./img/tips.png')} />
                    <div className='tips-info' ref="qr-canvas">
                        注：可根据不同活动名称修改活动标签，例：双十一特惠，知识节大促等
                    </div>
                </MiddleDialog>
            </Page>
        );
    }
}

function mapStateToProps (state) {

    return {
        sysTime: state.common.sysTime,
        marketInfo:getVal(state,'channelMarket.channelMarketInfo',{}),
        setInfo:state.channelDistribution.channelAutoDistributionInfo&&state.channelDistribution.channelAutoDistributionInfo.data||[],
    }
}

const mapActionToProps = {
    getChannelMarket,
    saveChannelMarket,
    fetchAndUpdateSysTime,
    getChannelInfo,
    channelAutoDistributionInfo,
    changeChannelAutoDistributionSet,
    saveChannelAutoDistributionSet,
    isLiveAdmin,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelMarketSeting);