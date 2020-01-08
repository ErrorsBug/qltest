import React, { Component } from 'react'
import { request, doPay } from 'common_actions/common'
import { imgUrlFormat } from '../../../components/util';
import classNames from 'classnames'

export default class extends Component {
    state = {
        userInfo:null,
        myUserInfo: null,
    }
    componentDidMount(){
        this.getUserInfo();
    }

    async getUserInfo() {
        if (this.props.couponInfo.userId) {
            let userId = this.props.couponInfo.userId
            await request({
                url: '/api/wechat/transfer/baseApi/h5/user/get',
                method: 'POST',
                body: {
                    otherUserId:userId
                }
            }).then(res => {
                this.setState({
                    userInfo:res?.data?.user
                })
    
            }).catch(err => {
                console.log(err);
            })
            if(this.props.couponInfo.couponType ==='UFW_SHARE_FLAG_COUPON_AMOUNT'||this.props.couponInfo.couponType ==='UFW_MEMBER_COUPON_AMOUNT'){
                await request({
                    url: '/api/wechat/transfer/baseApi/h5/user/get',
                    method: 'POST',
                }).then(res => {
                    this.setState({
                        myUserInfo:res?.data?.user
                    })
        
                }).catch(err => {
                    console.log(err);
                })
            }
        }
    }


    render() {
        const { close, couponInfo={}, invitaUserInfo } = this.props;
        return (
            <div className="fun-red-envelope-box on-visible" 
                data-log-region="un-red-show"
                data-log-pos="0">
                <div onClick={ close }>
                    <div className="close-btn" onClick={ close }></div>
                    { 
                        (!this.props.isOutLink && this.state.userInfo && this.state.myUserInfo && couponInfo.couponType ==='UFW_SHARE_FLAG_COUPON_AMOUNT') 
                        && 
                        <div className="witness-header">
                            <img src={ this.state.userInfo.headImgUrl} />
                            <div className="witness-message">
                                <span className="name">{ this.state.userInfo.name||'lili'}</span>
                                <div className="tips">{this.state.myUserInfo.name} : 感谢你当我的见证人 送你一张大学的门票优惠券!</div>
                            </div>
                        </div>
                    }
                    { 
                        (this.state.userInfo && this.state.myUserInfo && couponInfo.couponType ==='UFW_MEMBER_COUPON_AMOUNT') 
                        && 
                        <div className="witness-header">
                            <img src="https://img.qlchat.com/qlLive/liveCommon/normalLogo.png" />
                            <div className="witness-message">
                                <span className="name">千聊</span>
                                <div className="tips">亲爱的千聊会员，感谢你一路以来的支持，特意送你一张大学的优惠券</div>
                            </div>
                        </div>
                    }
                    
                    <div className={classNames("red-envelope-cont",{vip:couponInfo?.couponType=='UFW_MEMBER_COUPON_AMOUNT'})}>
                        <div className="red-envelope-money">{ couponInfo.money }</div>
                        {
                            couponInfo?.title?
                            <p>{couponInfo.title}</p>
                            :
                            <p>距过期还剩: { this.props.leftTime }{}</p>
                        }
                        <div className="red-envelope-btn" onClick={ (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.props.bind()
                        } }></div>
                    </div>
                    {
                        !!invitaUserInfo || (this.state.userInfo && couponInfo.couponType ==='')?
                        <div className="red-envelope-user">
                            <img src={ imgUrlFormat((!!invitaUserInfo ? invitaUserInfo.createByHeadImgUrl : this.state.userInfo.headImgUrl))} />
                            <p><span>{ !!invitaUserInfo ? invitaUserInfo.createByName : this.state.userInfo.name}</span>送你红包</p>
                            </div>
                        :null
                    }
                </div>
            </div>
        )
    }
}