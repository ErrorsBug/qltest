import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { locationTo, imgUrlFormat, formatMoney, digitFormat } from 'components/util';
import openApp from 'components/open-app';
import detect from 'components/detect';

@autobind
class CouponItem extends Component{
    state={
        isGet: this.props.data && this.props.data.isGet
    }
    
    //领取优惠券
    async receiveCoupon(){
        const {data} = this.props

		let result = ''
		if (data.couponType === 'ding_zhi' || data.couponType === 'app') {
            result = await this.props.bindActivityCoupon({
                promotionId: data.couponId,
                sourcePage: 'courseCenter',
				sourceChannel: detect.browser.qlchat ? 'app' : 'h5',
            })
		} else if (data.couponType === 'relay_channel') {
            result = await this.props.bindReceiveCoupon({codeId: data.couponId})
        } else {
            result = await this.props.bindCoupon({
                businessId: data.businessId, 
                businessType: data.couponType, 
                couponId: data.couponId
            })
		}

        if(result?.state?.code === 0){
            if (data.couponType === 'app') {
                window.toast('领取成功，将跳转去APP使用');
            } else {
                window.toast('领取成功');
            }
            this.setState({ isGet: 'Y' })
            this.jump()
        } else if(result?.state?.msg){
			window.toast(result.state.msg || '网络出错，请稍后再试');
		}
    }
    
    redirect(e){
        // 是否已领取
        if (this?.state?.isGet === 'Y') {
            this.jump()
        } else {
            this.receiveCoupon()
        }
    }

    jump () {
        const { data } = this.props
        const type = data.type
        const id = data.businessId
        const liveId = data.liveId
        const key = data.lshareKey
        // 是否允许跳转
        if (data.isShow === 'N') {
            window.toast('该课程已失效');
            return false
        }

        let url;
        if (type === 'live') {
            url = `/wechat/page/live/${liveId}${key?'?lshareKey='+key:''}`
        } else if(type === 'channel'){
            url = `/wechat/page/channel-intro?channelId=${id}&couponId=${data.couponId}${key?'&lshareKey='+key:''}`,
                        `/pages/channel-index/channel-index?channelId=${id}${key?'&lshareKey='+key:''}`
        }else if(type === 'topic'){
            url = `/wechat/page/topic-intro?topicId=${id}&couponId=${data.couponId}${key?'&lshareKey='+key:''}`,
                        `/pages/intro-topic/intro-topic?topicId=${id}${key?'&lshareKey='+key:''}`
        }

        if (data.couponType === 'app' && !detect.browser.qlchat) {
            openApp({
                h5: url,
                ct: 'appzhuanshu',
                ckey: 'CK1422980938180',
            });
        } else {
            locationTo(url)
        }
    }

    renderHolderItem() {
        return (
            <div className="coupon-list-item holder"
                 >
                <div className="item-content">
                    <div className="poster-box">
                        <div className="poster">
                        </div>
                        <p className="popularity"></p>
                    </div>
                    <div className="channel-info">
                        <div className="title">
                            <p className="animation-short"></p>
                            <p className="animation-long"></p>
                        </div>
                        <div className="statistics">
                        </div>
                    </div>
                </div>
                <div className="coupon-info">
                    <div className="price"></div>
                    <div className="get-coupon-btn"></div> 
                </div>
            </div>
        )
    }


    render(){
        const { data, index } = this.props

        return data ? (
            <div className="coupon-list-item on-log on-visible"
                 data-log-region="coupon-center"
                 data-log-pos={ index }
                 data-log-live_id={data.liveId}
                 data-log-business_id={data.businessId}
                 data-log-business_type={data.couponType}
                 data-lsharekey={data.lshareKey}
                 onClick={this.redirect}
                 >
                <div className="item-content">
                    <div className="poster-box">
                        <div className="poster">
                            <img src={ data.logo } alt=""/>
                        </div>
                        {
                            data.authNum?
                                <p className="popularity">{digitFormat(data.authNum, 10000)}次学习</p>
                            :null
                        }
                    </div>
                    <div className="channel-info">
                        <div className="title">{ data.businessName }</div>
                        <div className="statistics">
                            {
                                data.discount === -1
                                ?
                                <p className="discount">￥{formatMoney(data.amount)}</p>
                                :
                                <p className="discount">
                                    <span className="original">¥{formatMoney(data.amount)}</span>
                                    <span>¥{formatMoney(data.discount)}</span>
                                </p>
                            }
                        </div>
                    </div>
                </div>
                <div className="coupon-info">
                    <div className={`price ${data.isReceiveOver === 'Y' ? "disable" : ''}`}><i className="sign">￥</i>{ formatMoney(data.couponMoney) }</div>
                    {
                        this.state.isGet === 'Y' ?
                        <div className="get-coupon-btn use">立即使用</div> :
                        data.isReceiveOver === 'Y' ? 
                        <div className="get-coupon-btn disable">已领完</div> :
                        <div className="get-coupon-btn">领取使用</div> 
                    }
                    {
                        data.couponType === 'app' &&
                        <div className="label-app-type"></div>
                    }
                </div>
            </div>
        ) : this.renderHolderItem()
    }
}
export default CouponItem;