import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from "react-redux";
import { bindCouponByCode } from "../../actions/coupon";
import { locationTo, getVal } from 'components/util';
import { getTopicInfo } from 'actions/topic';
class CouponExchange extends Component {

    constructor (props) {
        super(props);
    }

    state = {
        couponCode: '',
        hideBtn:false,
    }

    componentDidMount() {
        this.getInfo();
    }

    getInfo() {
        let getTopicInfo = async ()=>{
            let result = await this.props.getTopicInfo(this.props.params.id);
        }
        switch (this.props.params.type) {
            case 'topic':
                getTopicInfo();    
                break;
            
        }
    }

    get businessId () {
        return this.props.params.id
    }

    get businessType () {
        let { type } = this.props.params;
        
        return type == 'global-vip' ? 'global_vip' : type;
    }

    changeCouponCode = (e) => {
        this.setState({
            couponCode: e.currentTarget.value
        })
    }

    bindCoupon = async () => {
        if (!this.state.couponCode) {
            window.toast('优惠码不能为空');
            return 
        }
        let result = await this.props.bindCouponByCode({
            businessId: this.businessId,
            businessType: this.businessType,
            couponCode: this.state.couponCode
        })
        if (result.state.code == 0) {
            window.toast('绑定成功！');
            setTimeout(() => {
                switch (this.businessType) {
                    case 'topic':
                        locationTo(`/wechat/page/topic-intro?topicId=${this.businessId}`);
                        break;
                    case 'channel':
                        locationTo(`/wechat/page/channel-intro?channelId=${this.businessId}`);
                        break;
                    case 'camp':
                        locationTo(`/wechat/page/camp-detail?campId=${this.businessId}`);
                        break;
                    case 'global_vip':
                        locationTo(`/wechat/page/live-vip-details?liveId=${this.businessId}`);
                        break;
                    default:
                        
                }
                
            }, 1000)
        } else {
            window.toast(result.state.msg);
        }
    }

    render () {
        return (
            <Page className="coupon-exchange">
                <div className="img-wrap">
                    <div className="img-inner">
                        <img className="img" src={require('./img/icon.png')} />
                    </div>
                </div>
                <div className="input-wrap">
                    <input className="coupon-code" value={this.state.couponCode} onChange={this.changeCouponCode} placeholder="请输入您的优惠码"/>
                </div>
                <div className="btn-wrap">
                    {
                        this.state.hideBtn ?
                        <button className="btn disable" >兑换并参加</button>
                        :
                        <button className="btn" onClick={this.bindCoupon}>兑换并参加</button>
                    }    
                </div>
            </Page>
        )
    }
}


const mapStateToProps = () => {
    return {

    }
}

const mapActionToProps = {
    bindCouponByCode,
    getTopicInfo
}

module.exports = connect(mapStateToProps, mapActionToProps)(CouponExchange);