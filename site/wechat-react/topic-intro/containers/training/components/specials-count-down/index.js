import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { apiService } from 'components/api-service';
import { autobind } from 'core-decorators';
import classnames from 'classnames'

import {getVal,formatCountdown} from 'components/util';
import { updateDiscountExtendPo } from '../../../../actions/channel'
import errorCatch from 'components/error-boundary'
import {getSysTime} from 'common_actions/common'

@errorCatch()
@autobind
class SpecialsCountDown extends Component {
    state = {
        discountExtendPo: {},
        leftTime: 0,
        showCountdown:false,
        sysTime:0,
    }
    
    componentWillReceiveProps (nextProps) {
        if (this.startIntval) clearInterval(this.startIntval);
        if (this.intval) clearInterval(this.intval);

        this.getDiscountExtend(nextProps.marketingInfo);
    }

    componentDidMount () {
        this.getDiscountExtend(this.props.marketingInfo);
    }

    componentDidUpdate(prevProps) {
        if (this.props.chargeConfigs.length > 0 && prevProps.chargeConfigs != this.props.chargeConfigs) {
            this.updateDiscount();
        }
    }

    async getSysTime() {
        let result = await this.props.getSysTime();
        let sysTime = getVal(result, 'data.sysTime');
        this.setState({
            sysTime
        })
    }

    get sysTime() {
        return this.state.sysTime || this.props.sysTime;
    }
    
    async getDiscountExtend(marketingInfo) {
        let leftTime = 0,leftStartTime =0;
        const discountExtendPo = getVal(marketingInfo, 'discountExtendPo') || {}
            
        if(!!discountExtendPo.endTime){
            leftTime = discountExtendPo.endTime || 0;
            leftStartTime = discountExtendPo.startTime || 0;
        } else {
            leftTime = marketingInfo.endTime;
            leftStartTime = marketingInfo.startTime;
        }

        if (!!leftTime) {
            await this.getSysTime();
        }

        this.setState({
            discountExtendPo,
            leftTime: leftTime - this.sysTime,
            leftStartTime: leftStartTime - this.sysTime,
        }, () => {
            this.props.updateDiscountExtendPo(discountExtendPo)
            this.setIntStartTime();
            this.setIntEndTime();
            this.updateDiscount();
        })
    }

    setIntStartTime() {
        if (this.state.leftStartTime > 0) {
            let leftStartTime = (this.state.leftStartTime/1000).toFixed(0);
            this.startIntval = setInterval(() => {
                if (leftStartTime > 0) {
                    leftStartTime = leftStartTime - 1;
                    if (leftStartTime < 0) {
                        leftStartTime = 0;
                    }
                    
                    this.setState({
                        leftStartTime
                    })
                } else {
                    clearInterval(this.startIntval);
                    this.setState({
                        showCountdown:true,
                    }, () => {
                        this.updateDiscount();
                    })
                }
            },1000)
        }
    }
    setIntEndTime() {
        if (this.state.leftTime > 0) {
            let leftTime = (this.state.leftTime / 1000).toFixed(0);
            
            if (this.state.leftStartTime <= 0) {
                this.setState({
                    showCountdown:true,
                    leftTime
                }, () => {
                    this.updateDiscount();
                })
            }
            this.intval = setInterval(() => {
                if (leftTime > 0) {
                    leftTime = leftTime - 1;
                    if (leftTime < 0) {
                        leftTime = 0;
                    }
                    this.setState({
                        leftTime
                    })
                } else {
                    clearInterval(this.intval);
                    this.setState({
                        showCountdown:false,
                    }, () => {
                        this.updateDiscount();
                    })
                }
            },1000)
        }
    }

    get getShowDiscount() {
        return (this.props.chargeConfigs.length && (this.props.chargeConfigs[0].discountStatus === 'Y') &&
            // 不属于以下任何一种情况则显示 
            !(
                // 如果有设置数量，且数量为0（则不显示）
                (this.state.discountExtendPo.limitNum && this.state.discountExtendPo.limitNum - this.state.discountExtendPo.soldNum <= 0)
                ||
                // 如果有设置活动时间，且不在活动时间期间（则不显示）
                (this.state.discountExtendPo.endTime && !this.state.showCountdown)
                || 
                // 如果倒计时结束了
                this.state.leftTime <= 0 
            )
        ) 
    }
    updateDiscount() {
        this.props.updateDiscountExtendPo({
            ...this.state.discountExtendPo,
            showDiscount:this.getShowDiscount,
            isK: this.getIsK
        })
    }
    // 砍价
    get getIsK(){
        const { marketingInfo } = this.props;
        return ((marketingInfo && Object.is(marketingInfo.discountStatus, 'K')) &&
            !(
                // 如果倒计时结束了
                this.state.leftTime <= 0 
            )
        ) 
    }
    // 特价
    specialPrice(){
        const { marketingInfo = {}, isY = false } = this.props;
        const cls = classnames('right', {
           'special-price': (Object.is(marketingInfo.discountStatus, 'Y') || isY) && !this.state.discountExtendPo.endTime
        })
        return cls;
    }
    // 倒计时
    getCountDown(){
        const data = formatCountdown(this.state.leftTime,'d天hh时mm分ss秒', true);
        return (<span className="count-down-box">
            <i>{ data.d }</i> 天
            <i>{ data.h }</i> 时
            <i>{ data.m }</i> 分
            <i>{ data.s }</i> 秒
        </span>) 
    }
    rightComp(){
        const { marketingInfo = {}, isY = false } = this.props;
        const isGroup = Object.is(marketingInfo.discountStatus, 'P') || Object.is(marketingInfo.discountStatus, 'GP');
        if(this.state.discountExtendPo.endTime || (!!marketingInfo.endTime)){
            if(Object.is(marketingInfo.discountStatus, 'Y') || Object.is(marketingInfo.discountStatus, 'K') || isY){
                return (
                    <Fragment>
                        <span className="date-title">距结束仅剩</span>
                        <span className="date">{this.getCountDown()}</span>
                    </Fragment>    
                )
            } 
        } else if(isGroup){
            return (
                <span className="group-comp">
                    <var className="group-numb">邀请<i>{ Number(marketingInfo.groupNum) || 0 }</i>人拼团</var>
                    <var className="group-dec">{ (marketingInfo.discountStatus === 'GP' && marketingInfo.discount != 0 )? '即可低价听课' : '即可免费听课' }</var>
                </span>
            )
        }
        return null
    }

    // 获取促销价格
    fetchSalePrice(){
        const { marketingInfo = {}, channelId, chargeConfigs} = this.props;
        let salePrice = (channelId && this.getShowDiscount ) ? chargeConfigs[0].discount : marketingInfo.discount;
        return salePrice
    }

    render() {
        const { marketingInfo = {}, channelId, chargeConfigs, isBought = false } = this.props;
        const isGroup = Object.is(marketingInfo.discountStatus, 'P') || Object.is(marketingInfo.discountStatus, 'GP');
        let salePrice = this.fetchSalePrice()
        // 默认限时特价
        const cls = classnames('specials-count-down',{
            'no-time':!this.state.discountExtendPo.endTime,
            'specials-k': Object.is(marketingInfo.discountStatus, 'K'), // 砍价
            'specials-p': isGroup, // 拼团
        })

        return (
            (!isBought && (this.getShowDiscount || isGroup || this.getIsK))?
            <div className={ cls }>
                <span className={`sale`}><i>￥</i>{salePrice}</span>
                <ul className="price-box">
                    <li>
                        <var className="price">￥{this.props.chargeConfigs[0].amount || 0}</var> 
                        {
                            (this.state.discountExtendPo.limitNum && !isGroup) ?
                            <var className='left-num'>| 仅限{this.state.discountExtendPo.limitNum - this.state.discountExtendPo.soldNum}份</var>
                            :
                            null    
                        }
                    </li>
                    {/* <li><var className="title">{this.state.discountExtendPo.discountTag||'限时特价'}</var></li> */}
                    <li><var className="title">{ isGroup ? `${ marketingInfo.groupNum || 0 }人团` : Object.is(marketingInfo.discountStatus, 'K') ? '限时砍价' : `${(this.state.discountExtendPo && !!this.state.discountExtendPo.discountTag ?this.state.discountExtendPo.discountTag : '限时特价' ) }` }</var></li>
                </ul>
                <span className={ this.specialPrice() }>{ this.rightComp() }</span>
            </div>
            : this.props.children ?
                this.props.children 
            :null    

        );
    }
}


function mapStateToProps(state) {
    return {
        sysTime: getVal(state, 'common.sysTime',''),
    }
}

const mapActionToProps = {
    updateDiscountExtendPo,
    getSysTime
};

module.exports = connect(mapStateToProps, mapActionToProps, null, { withRef: true })(SpecialsCountDown);