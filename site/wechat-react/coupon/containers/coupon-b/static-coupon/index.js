import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from 'components/switch';
import Page from 'components/page';
import { locationTo, getVal } from 'components/util';
import ScrollToLoad from "components/scrollToLoad";

import {
    isStaticCouponOpen,
    addOrUpdateStaticCoupon,
    getCouponUseList,
    queryCouponUseCount
} from '../../../actions/coupon';

class StaticCoupon extends Component {

    state = {
        staticCoupon: {},
        modifyCode: false,
        isStaticCouponOpen: false,
        userList: [],
        page: 1,
        count: null
    }

    pageSize = 60;

    tmpCode = null;

    couponId = null;

    get topicId () {
        return this.props.params.topicId
    }

    async componentDidMount () {
        await this.getIsStaticCouponOpen();
        this.getCouponUseList();
        this.getCouponUseCount();
    }

    getCouponUseCount = () => {
        this.props.queryCouponUseCount({
            couponId: this.couponId
        }).then(res => {
            if (res.state.code == 0) {
                this.setState({
                    count: res.data.count
                })
            }
        })
    }

    getCouponUseList = async (next) => {
        let result = await this.props.getCouponUseList({
            couponId: this.couponId,
            page: {
                page: this.state.page,
                size: this.pageSize
            }
        })
        if (result) {
            this.setState({
                page: this.state.page + 1,
                userList: this.state.userList.concat(result),
                noMore: result.length < this.pageSize,
            })
        }
        next && next();
    }

    getIsStaticCouponOpen = async () => {
        let result = await this.props.isStaticCouponOpen({
            topicId: this.topicId
        })
        if (result.state.code == 0) {
            this.couponId = getVal(result, 'data.staticCoupon.id');
            this.setState({
                isStaticCouponOpen: result.data.status == 'Y' ? true : false,
                staticCoupon: result.data.staticCoupon || {}
            })
        }
    }

    modifyStaticCouponOpen = async () => {
        let {isStaticCouponOpen} = this.state;
        // if (!this.serverOpen) {
        //     this.setState({
        //         isStaticCouponOpen: !isStaticCouponOpen
        //     })
        //     return ;
        // }
        
        let result = await this.props.addOrUpdateStaticCoupon({
            topicId: this.topicId,
            status: isStaticCouponOpen ? 'N' : 'Y',
        })
        if (result.state.code == 0) {
            window.toast('设置成功')
            this.setState({
                isStaticCouponOpen: !isStaticCouponOpen,
                staticCoupon: result.data.coupon || this.state.staticCoupon
            })
        } else {
            window.toast('设置失败')
        }
    }

    cancelCode = () => {
        this.setState({
            modifyCode: false
        })
    }

    saveCode = async () => {
        let result = await this.props.addOrUpdateStaticCoupon({
            topicId: this.topicId,
            couponCode: this.tmpCode,
            status: 'Y'
        })
        if (result.state.code == 0) {
            window.toast('设置成功');
            this.setState({
                modifyCode: false,
                staticCoupon: {
                    ...this.state.staticCoupon,
                    couponCode: this.tmpCode
                }
            })
        } else {
            window.toast('设置失败')
        }
    }

    render () {
        let {staticCoupon} = this.state;
        return (
            <Page title="固定优惠码" className="static-coupon-container">
                <ScrollToLoad
                    noMore={this.state.noMore}
                    loadNext={this.getCouponUseList}
                >
                <div className="flex-item">
                    <div className="left">
                        <div className="header">
                            固定优惠码
                        </div>
                        <div className="sub-header">
                        开启后会生成优惠码链接和优惠码，关闭则失效
                        </div>
                    </div>
                    <div className="right">
                        <Switch
                            className = "show-code-switch on-log"
                            size = 'md'
                            dataLog={{
                                region: 'static-coupon',
                                pos: this.state.isStaticCouponOpen ? 'display-true' : 'display-false'
                            }}
                            active={this.state.isStaticCouponOpen}
                            onChange={this.modifyStaticCouponOpen}
                        ></Switch>
                    </div>
                </div>
                {
                    this.state.isStaticCouponOpen ? 
                    <React.Fragment>
                    <div className="flex-item">
                        <div className="left">
                            <div className="header">
                                优惠金额
                            </div>
                        </div>
                        <div className="right">
                            <span className="money">Y {staticCoupon.money}</span> <span className="not-modify">暂不支持修改</span>
                        </div>
                    </div>
                    <div className="flex-item">
                        <div className="left">
                            <div className="header">
                                优惠码链接 <span>(长按复制链接)</span>
                            </div>
                            <div className="sub-header" id="codeLink">
                                {`${location.origin}/wechat/page/static-coupon-link?topicId=${this.topicId}&couponCode=${staticCoupon.couponCode}`}
                            </div>
                        </div>
                        <div className="right">

                        </div>
                    </div>
                    <div className="flex-item">
                        <div className="left">
                            <div className="header">
                                优惠码
                            </div>
                        </div>
                        <div className="right">
                            <input defaultValue={staticCoupon.couponCode} disabled={!this.state.modifyCode} onChange={(e) => {
                                this.tmpCode = e.currentTarget.value
                            }}/>
                            {
                                this.state.modifyCode ? <React.Fragment>
                                    <div className="btn btn-cancel" onClick={this.cancelCode}>取消</div>
                                    <div className="btn btn-confirm" onClick={this.saveCode}>保存</div>
                                </React.Fragment> :
                                <div className="btn btn-confirm" onClick={() => {
                                    this.setState({
                                        modifyCode: true
                                    })
                                }}>修改</div>
                            }
                        </div>
                    </div></React.Fragment> : null   
                }
                {
                    this.state.userList.length > 0 ? 
                    <div className="user-panel">
                        <div className="header">
                            已通过固定优惠码进来的用户（{this.state.count}人）
                        </div>  
                        <div className="body">
                            {
                                this.state.userList.map((item, idx) => {
                                    return (
                                    <div className="user-wrap">
                                        <div className="user" key={item.id}>
                                            <img className="user-avatar" src={(item.userHeadImage || 'http://img.qlchat.com/qlLive/liveCommon/normalLogo.png') + '?x-oss-process=image/resize,m_lfit,h_100,w_100'} />
                                            <div className="user-name">
                                                {item.userName}
                                            </div>
                                        </div>
                                    </div>
                                    )
                                })
                            }
                        </div>
                    </div> : null
                }
                </ScrollToLoad>
            </Page>
        )
    }
}

function mstp(state) {
    return {
        power: getVal(state, 'coupon.power', {})
    }
}

const matp = {
    isStaticCouponOpen,
    addOrUpdateStaticCoupon,
    getCouponUseList,
    queryCouponUseCount
}

export default connect(mstp, matp)(StaticCoupon);