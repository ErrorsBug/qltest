import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators' 
import Detect from 'components/detect';
import { doPay } from 'common_actions/common'
import { fillParams } from 'components/url-utils';
import { locationTo } from 'components/util';

 
@autobind
class ClassInfo extends Component {
    pay () {  
        const urlData = JSON.parse(sessionStorage.getItem('urlData') || '{}') 
        const url = fillParams(urlData,window.location.href)
        const params = { 
            source:(Detect.os.weixin && (Detect.os.ios||Detect.os.android))?'h5':'web',
            ch: url,
            url: this.props.payUrl||'/api/wechat/transfer/baseApi/h5/pay/ufwActOrder',
            actId:this.props.actId||''                           
        }
        this.props.doPay({
            ...params,
            callback: (orderId) => {
                window.toast("成功支付")
                setTimeout(() => {
                    this.props.jumpUrl?locationTo(this.props.jumpUrl):location.reload()
                }, 1000);
            },
            onCancel: () => {
                 
            },
            onPayFree:() => {
                window.toast("成功支付")
                setTimeout(() => {
                    this.props.jumpUrl?locationTo(this.props.jumpUrl):location.reload()
                }, 1000);
            }
        })
    }
    render(){
        
        let {price,discountPrice,region} = this.props;
        price = parseFloat(price)||0
        discountPrice = parseFloat(discountPrice) 
        if(discountPrice>price){
            discountPrice=price
        } 
        if(discountPrice<0){
            discountPrice=0
        } 
        return (
            <div className={`un-pay-main`}>  
                <div className={`un-pay-item`}>  
                    <div className={`un-pay-title`}>原价</div>
                    <div className={`un-pay-money`}>￥{price}</div>
                </div>
                {
                    !isNaN( discountPrice )&&price>discountPrice&&
                    <div className={`un-pay-item`}>  
                        <div className={`un-pay-title`}>限时优惠</div>
                        <div className={`un-pay-money on`}>-￥{price-(discountPrice||0)}</div>
                    </div> 
                } 
                <div className={`un-pay-item un-pay-confirm`}>  
                    <div className={`un-pay-title`}>仅需支付</div>
                    <div className={`un-pay-money on`}>￥{  !isNaN( discountPrice )?discountPrice:price }</div>
                </div>

                <div className="un-pay-decs">购买课程后请添加班主任微信</div>
                <div className={`un-pay-btn on-log on-visible`}
                    data-log-name="立即支付"
                    data-log-region={region||"un-pay-info"}
                    data-log-pos="0"
                    onClick={this.pay}>  
                    立即支付
                </div>
            </div>
        )
    }
}



ClassInfo.propTypes = {

};

function mapStateToProps (state) {
    return {
        
    }
}

const mapActionToProps = {
    doPay 
}

module.exports = connect(mapStateToProps, mapActionToProps)(ClassInfo);