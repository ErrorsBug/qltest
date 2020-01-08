import React, { Component, Fragment } from 'react'
import { request, doPay } from 'common_actions/common'
import { imgUrlFormat } from '../../../components/util';
import classNames from 'classnames'
import { getUrlParams } from '../../../components/url-utils';

export default class extends Component {
    state = {
        userInfo:null,
        myUserInfo: null,
    }
    get campId(){
        return getUrlParams('campId')
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
            // if(this.props.couponInfo.couponType ==='UFW_SHARE_COUPON_AMOUNT'){
            //     await request({
            //         url: '/api/wechat/transfer/baseApi/h5/user/get',
            //         method: 'POST',
            //     }).then(res => {
            //         this.setState({
            //             myUserInfo:res?.data?.user
            //         })
        
            //     }).catch(err => {
            //         console.log(err);
            //     })
            // }
        }
    }


    render() {
        const { close, couponInfo={} } = this.props;
        return (
            <div className="finance-red-envelope-box on-visible" 
                data-log-region="un-red-show"
                data-log-pos="0">
                <div onClick={ close }>
                   
                    <div className="finance-red-top">
                        { 
                            this.state.userInfo&& couponInfo.key=='share'+this.campId?
                            <Fragment>
                                <div className="witness-header">
                                    <img src={ this.state.userInfo.headImgUrl} />
                                    <div className="witness-message">
                                        <span className="name">{ this.state.userInfo.name||'lili'}</span>
                                        <div className="tips">送你一张优惠券，快来跟我一起学习吧！ 爱学习的人运气总不会差〜</div>
                                    </div>
                                </div>
                                <div className="close-btn" onClick={ close }></div> 
                            </Fragment>
                            :
                            <div className="close-btn-right" onClick={ close }></div> 
                        }
                        
                     </div>
                    <div className={classNames("red-envelope-cont")}>
                        <div className="red-envelope-money">{ couponInfo.money }</div>
                        <div className="red-envelope-title">{couponInfo.remark}</div>
                        {
                            <p>距过期还剩: { this.props.leftTime }{}</p>
                        }
                        <div className="red-envelope-btn" onClick={ (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.props.bind()
                        } }></div>
                    </div> 
                </div>
            </div>
        )
    }
}