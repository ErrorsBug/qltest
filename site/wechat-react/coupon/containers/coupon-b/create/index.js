import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import dayjs from 'dayjs'

import Page from 'components/page'
import { MiddleDialog } from 'components/dialog';
import DatePicker from 'components/date-picker'
import Input from './components/input';
import { validLegal, getVal, sortBy, formatMoney } from '../../../../components/util';
import { getIsLiveAdmin } from 'common_actions/live'
import {
    createCoupon,
    initCreateCouponInfo
} from '../../../actions/coupon';
import { getTopicInfo } from 'actions/topic';
import { getChannelInfo } from 'actions/channel';
import { vipChargeInfo } from 'actions/vip';
import { fetchCheckinCampDetail } from 'actions/profit';

import Validator from './strategy';

class CouponCreate extends Component {

    coupon = {
        money: '', //优惠金额
        codeNum: '', //生成数量
        memo: '', //备注
        overTime: '', //有效日期
    }
    data = {
        maxMoney:'',//最大金额
        
    }

    state = {
        datePicker: false, //是否弹出日期选择框；
        topicType: '',
        isLiveAdmin: false
    }

    canClick = true;

    componentWillMount = async () => {
        let type = this.props.params.couponType
        let channelId = '';
        let topicId = '';
        let campId = '';
        let liveId = '';
        switch(type) {
            case 'channel' :
                channelId = this.props.params.id
            break;
            case 'topic' :
                topicId = this.props.params.id
            break;
            case 'camp' :
                campId = this.props.params.id
            break;
            case 'vip' :
                liveId = this.props.liveId
            break;
        }
        const result = await this.props.getIsLiveAdmin({channelId, topicId, campId, liveId});
        // 是否是专业版 系列课 话题 vip 才能有9999
        if (result.state.code === 0 && result.data.isLiveAdmin) {
            this.setState({
                isLiveAdmin: true
            }, () => {
                let item = this.validatorRules.codeNum.find(item => item.id === 'isAdmin')
                item.strategy = 'maxNum:9999'
                item.errMsg = '数量不能大于9999个'
            })
        }
    }
    componentDidMount() {
        this.getMaxMoney();
    }

    // 获取最大配置价格，由于后端coupon不在同个项目，改为前端判断；
    getMaxMoney() {

        let getTopicPrice = async ()=>{
            let result = await this.props.getTopicInfo(this.props.params.id);
            let money = getVal(result, 'data.topicPo.money', '');
            if (money) {
                this.data.maxMoney = formatMoney(money,100);
            }
            if (result.data.topicPo.style.indexOf('Graphic') > -1) {
                this.setState({
                    topicType: 'graphic'
                })
            }
        }

        let getChannelPrice = async ()=>{
            let result = await this.props.getChannelInfo(this.props.params.id);
            let chargeConfigs = getVal(result, 'data.chargeConfigs', []);
            if (chargeConfigs.length) {
                chargeConfigs = chargeConfigs.sort(sortBy('amount',false));
                this.data.maxMoney = chargeConfigs[0].amount;
            }
        }
        let getVipPrice = async ()=>{
            let result = await this.props.vipChargeInfo(this.props.params.id);
            let chargeConfigs = getVal(result, 'data.vipChargeconfig', []);
            if (chargeConfigs.length) {
                chargeConfigs = chargeConfigs.sort(sortBy('amount',false));
                this.data.maxMoney = formatMoney(chargeConfigs[0].amount,100);
            }
        }
        
        let getCampPrice = async ()=>{
            let result = await this.props.fetchCheckinCampDetail(this.props.params.id);
            let money = getVal(result, 'data.liveCamp.price', '');
            if (money) {
                this.data.maxMoney = formatMoney(money,100);
            }
        }

        switch (this.props.params.couponType) {
            case 'vip':
                getVipPrice();    
                break;
            case 'topic':
                getTopicPrice();    
                break;
            case 'channel':
                getChannelPrice();    
                break;
            case 'camp':
                getCampPrice();    
                break;
            
        }

    }
    

    //表单验证规则
    validatorRules = {
        money: [{
            strategy: 'isNotEmpty',
            errMsg: '金额不能为空'
        },{
            strategy: 'isNumber',
            errMsg: '金额必须是数字'
        },{
            strategy: 'negative',
            errMsg: '金额不能是负数'
        },{
            strategy: 'biggerThan:0',
            errMsg: '金额必须大于0'
        },{
            strategy: 'maxNum:50000',
            errMsg: '金额不能大于50000'
        },{
            strategy: 'floatFix:2',
            errMsg: '金额最多只能有两位小数'
        }],
        codeNum: [{
            strategy: 'isNotEmpty',
            errMsg: '数量不能为空'
        },{
            strategy: 'isNumber',
            errMsg: '数量必须是数字'
        },{
            strategy: 'isFloat',
            errMsg: '数量必须是整数'
        },{
            strategy: 'negative',
            errMsg: '数量必须非负'
        },{
            strategy: 'biggerThan:0',
            errMsg: '数量必须大于0'
        },{
            strategy: 'maxNum:500',
            errMsg: '数量不能大于500个',
            id: 'isAdmin'
        }],
        memo: [{
            strategy: 'maxLength:10',
            errMsg: '备注不能超过10个字'
        }]
    }

    // //点击生成优惠券
    onGenerateCoupon = async () => {
        if (!this.canClick) {
            return ;
        }
        this.canClick = false;
        let { couponType } = this.props.params;
        let {money, codeNum, memo, overTime} = this.coupon;
        let validator = new Validator();
        //添加验证规则
        ['money', 'codeNum', 'memo'].forEach((item) => {
            validator.addMultipleRules(this.coupon[item], this.validatorRules[item])
        })

        
        let result = validator.start();

        // 判断是否大于收费配置
        if (this.data.maxMoney && this.data.maxMoney < money) {
            result = `金额不能大于${this.props.params.couponType == 'topic' ? '课程价格' : '收费配置价格'}`;
        }
        if (/^(89|8\.9|0\.89|64|6\.4|0\.64|89\.64|64\.89|1989\.64|8964)$/.test(Number(money))) {
            // 永久防止敏感信息
            window.toast('金额错误，请输入其他金额');
            this.canClick = true;
            return false;
        }

        if (result) {
            this.canClick = true;
            window.toast(result)
        } else {
            let { id } = this.props.params;
            let time = overTime ? dayjs(overTime).format('YYYY-MM-DD') + ' 00:00:00' : overTime;
            let type = couponType == 'vip'? 'global_vip' : couponType;
            let result = await this.props.createCoupon({
                liveId: this.props.liveId,
                businessId: id,
                money: (money * 100).toFixed(0),
                codeNum,
                overTime: time,
                remark: memo,
                businessType: type,
                couponType: 'normal'
            })
            if (result.state && result.state.code == 0) {
                window.toast('添加优惠券成功！')
                setTimeout(() => {
                    location.href = `/wechat/page/coupon-code/list/${couponType == 'vip'? 'global-vip' : couponType}/${id}`;
                }, 1000);
            } else {
                window.toast(result.state.msg)
                this.canClick = true;
            }
            
        }
    }

    canNotAddCoupon = () => {
        window.toast('音视频录播课程暂不支持添加优惠券！')
    }
    

    render () {
        let {modalVisible, modalType, money, codeNum, memo, overTime, isLiveAdmin} = this.state;
        let { couponType } = this.props.params;
        return (
            <Page title={'优惠券设置'}>
                <div className="coupon-create-panel">
                    <div className="cells">
                        <div className="cells__label">
                            优惠金额(元)
                        </div>
                        <div className="cells__bd">
                            <Input className="cells__bd_input" type="text" placeholder="请填写优惠金额" onChange={(e)=> {this.coupon.money = e.currentTarget.value}}/>
                        </div>
                    </div>
                    <DatePicker
                        mode='date'
                        title="选择时间"
                        style="normal-time-picker"
                        minValue={dayjs(this.props.initCreateCouponInfo.currentTimeStamp)}
                        onChange={(e)=>{ 
                            let overTime = dayjs(e).format('YYYY-MM-DD').toString(); 
                            this.coupon.overTime = overTime;
                            this.setState({
                                overTime: overTime
                            })
                        }}>
                        <div className="cells_hasline">
                            <div className="cells__label">
                                有效时间
                            </div>
                            <div className={"cells__bd" + (overTime ? '' : ' placeholder')}>
                                {overTime ? overTime : '优惠券使用截止时间，不填则永久使用'}
                            </div>
                        </div>
                    </DatePicker>
                    <div className="cells">
                        <div className="cells__label">
                            生成数量(个)
                        </div>
                        <div className="cells__bd">
                            <Input className="cells__bd_input" type="text" placeholder={`每次生成数量最多${isLiveAdmin? '9999' : '500'}`} onChange={(e)=> {this.coupon.codeNum = e.currentTarget.value}}/>
                        </div>
                    </div>
                    <div className="cells">
                        <div className="cells__label">
                            备注(非必填项)
                        </div>
                        <div className="cells__bd">
                            <Input className="cells__bd_input" type="text" placeholder="请输入备注，非必填项" onChange={(e)=> {this.coupon.memo = e.currentTarget.value}}/>
                        </div>
                    </div>
                    <div className="coupon-tip-once">
                        同一批优惠券1个用户只能领一次
                    </div>
                    <div className="coupon-create-btn-area">
                        {
                             <a href="javascript:" className={"coupon-create-btn"} onClick={this.onGenerateCoupon}>
                                确定
                            </a>

                        }
                    </div>
                </div>
            </Page>
        );
    }
}

CouponCreate.propTypes = {

};

function mstp(state) {
    return {
        initCreateCouponInfo: state.coupon.initCreateCouponInfo,
        liveId: state.coupon.power.liveId
    }
}

const matp = {
    createCoupon,
    getTopicInfo,
    getChannelInfo,
    vipChargeInfo,
    getIsLiveAdmin,
    fetchCheckinCampDetail
}

export default connect(mstp, matp)(CouponCreate);
