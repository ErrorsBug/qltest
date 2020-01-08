import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Page from 'components/page'
import { locationTo, formatDate } from 'components/util'
import { autobind } from 'core-decorators';
import Switch from 'components/switch';
import ScrollToLoad from 'components/scrollToLoad';
import CodeItems from './components/code-items'
import { getQlchatVersion} from 'components/envi';
import CouponBottomActionSheet from './components/bottom-sheet'
import {
    getCouponUseList,
    getCouponDetail,
    addCouponCode
} from '../../../actions/coupon';


@autobind
class CodeInfo extends Component {
    state = {
        showCode: false,
        couponList: [],
        couponInfoDto: {},
        noData: false,
        noMore: false,
        status: '', // 空：全部 未使用：unused,已领取：bind
        showCouponBottom: false,
    }

    data = {
        page : 1,
        size : 20,
    }

    componentDidMount() {
        this.getCouponDetail();
        this.getCouponUseList();
    }
    
    // 获取优惠券详情
    async getCouponDetail() {
        let couponInfoDto = await this.props.getCouponDetail({
            couponId: this.props.params.codeId,
        });
        if (couponInfoDto) {
            this.setState({
                couponInfoDto
            })

        } 
        return couponInfoDto;
    }
    // 获取优惠券列表
    async getCouponUseList() {
        let couponList = await this.props.getCouponUseList({
            couponId: this.props.params.codeId,
            page: {
                page: this.data.page,
                size: this.data.size,  
            },
            status: this.state.status
            
        });
        if (couponList.length) {
            this.setState({
                couponList: [...this.state.couponList, ...couponList]
            })
        } else {
            this.setState({
                isNoMore: this.data.page != 1,
                noData: this.data.page == 1,
            })
        }
        return couponList;
    }

    async loadNext(next) {

        this.data.page++;
        await this.getCouponUseList();
        next && next()
    }

    changeShowCode() {
        this.setState({
            showCode:!this.state.showCode
        })
    }

    sendCouponBatch() {
        let url = '';
        if (getQlchatVersion()) {
            switch (this.props.params.type) {
                case 'topic':
                    url = `/wechat/page/get-coupon-topic-batch/${this.state.couponInfoDto.belongId}?codeId=${this.props.params.codeId}`;
                    break;
                case 'channel':
                    url = `/wechat/page/get-coupon-channel-batch/${this.state.couponInfoDto.belongId}?codeId=${this.props.params.codeId}`;
                    break;
                case 'global-vip':
                    url = `/wechat/page/get-coupon-vip-batch/${this.state.couponInfoDto.belongId}?codeId=${this.props.params.codeId}`;
    
                    break;
            }
			let shareTitle = this.state.couponInfoDto.businessName;
            let shareUrl = encodeURIComponent(window.location.origin+url);
            let shareImgUrl = encodeURIComponent('https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png');
            let content = encodeURIComponent("点击即可领取优惠码。");
            locationTo(`qlchat://dl/share/link?title=${shareTitle}&content=${content}&shareUrl=${shareUrl}&thumbImageUrl=${shareImgUrl}`);

        } else {
            switch (this.props.params.type) {
                case 'topic':
                    url = `/wechat/page/send-coupon/topic-batch?topicId=${this.state.couponInfoDto.belongId}&codeId=${this.props.params.codeId}&liveId=${this.state.couponInfoDto.liveId}`;
                    break;
                case 'channel':
                    url = `/wechat/page/send-coupon/channel-batch?channelId=${this.state.couponInfoDto.belongId}&codeId=${this.props.params.codeId}&liveId=${this.state.couponInfoDto.liveId}`;
                    break;
                case 'global-vip':
                    url = `/wechat/page/send-coupon/vip-batch?liveId=${this.state.couponInfoDto.liveId}&codeId=${this.props.params.codeId}`;
    
                    break;
            }
            locationTo(url);
        }
        
        
    }

    // 获取邀请卡
    getCard() {
        let url = `/wechat/page/coupon-card?businessType=${this.props.params.type}&businessId=${this.state.couponInfoDto.belongId}&codeId=${this.props.params.codeId}`;
        
        locationTo(url);
        
    }

    addCouponCode = async () => {
        window.loading(true)
        let result = await this.props.addCouponCode({
            couponId:this.props.params.codeId,
            liveId:this.state.couponInfoDto.liveId,
        })
        if (result) {
            this.setState({
                couponList: [].concat(this.state.couponList).concat(result.couponList),
                noData: false,
                couponInfoDto: {
                    ...this.state.couponInfoDto,
                    handCodeNum: this.state.couponInfoDto.codeNum
                }
            }, () => {
                window.loading(false)
                // 请求回来之后还需要继续请求 需要修改页数
                if (this.state.couponList.length < this.state.couponInfoDto.codeNum) {
                    this.data.page = this.state.couponList.length / 20
                    this.setState({
                        isNoMore: false
                    })
                }
            })
        }
    }

    get isOverTime(){
        return this.state.couponInfoDto.overTime && this.state.couponInfoDto.overTime < this.props.sysTime;
    }

    changeStatus(status) {
        this.data.page = 1
        this.setState({
            status,
            isNoMore: false,
            noData: false,
            couponList: [],
        }, () => {
            this.getCouponUseList();
        })
    }

    confirmAddCouponCode = () => {
        window.confirmDialog('确定生成优惠码？', this.addCouponCode)
    }

    scrollToDo = (e) => {
        let codeList = document.querySelector('div.webkitBox');
        let codeListTop = codeList.getBoundingClientRect().top;
        let title = document.querySelector('dt.webkitBox');
        if (codeListTop <= 0) {
            if (title.className.indexOf('fixTop') == -1) {
                title.className = title.className + ' fixTop';
            }
        } else {
            title.className = title.className.replace(' fixTop', '');
        }
    }
    
    handleShowCouponBottom() {
        this.setState({
            showCouponBottom: !this.state.showCouponBottom,
        })
    }

    moneySize (money) {
        if (!money) return 'money';
        money = String(money)
        console.log('money.length:', money);
        let dpr = document.querySelector('html').dataset.dpr;
        if (window.innerHeight/dpr <= 320) {
            if (money.length >=5 ) {
                return 'ml-money';
            } else {
                return 'm-money'
            }
        } else {
            if (money.length >=5 ) {
                return 'l-money';
            } else {
                return 'money'
            }
        }
    }

    getCouponPaper = () => { 
        switch (this.props.params.type) {
            case 'topic':
                return 'topic'
            case 'channel':
                return 'channel';
            case 'camp':
                return 'camp';
            case 'global-vip':
                return 'vip';
        }
    }

    getCouponBackground = () => {
        switch (this.props.params.type) {
            case 'topic':
                return 'background-topic'
            case 'channel':
                return 'background-channel';
            case 'global-vip':
                return 'background-vip';
        }
    }

    render() {
        let couponInfoDto = this.state.couponInfoDto;
        return (
            <Page title={'优惠码明细'} className='coupon-code-info-page flex-body'>  
                <div className="flex-main-h">
                    <ScrollToLoad
                        scrollToDo={this.scrollToDo}
                        className={"code-scroll-box"}
                        toBottomHeight={300}
                        noneOne={this.state.noData}
                        loadNext={ this.loadNext }
                        noMore={this.state.isNoMore}
                        footer={
                           (this.state.status !== 'bind' && couponInfoDto.useNum < couponInfoDto.codeNum && couponInfoDto.handCodeNum ==  (couponInfoDto.codeNum >= 100 ? '100' : '0') && !this.isOverTime)?
                            <div className="build-code-bar">
                                    <div className="btn-build" onClick={this.confirmAddCouponCode}>生成优惠码</div>
                                <div className="tips">一次性批量生成优惠码，可一对一发放，支持优惠码通道兑换使用</div>
                            </div>
                            :null    
                        }
                    > 
                        <div className={"coupon-code-info-box " + this.getCouponBackground()}>
                            <div className="flex-other header" style={{
                                background: 'transparent',
                                textAlign: 'left'
                            }}>
                                <span className="btn-back icon_back on-log"
                                    data-log-region="coupon-info"
                                    data-log-pos="back"
                                onClick={() => { locationTo(`/wechat/page/coupon-code/list/${this.props.params.type}/${couponInfoDto.belongId||couponInfoDto.liveId}`)}} >
                                    返回
                                </span>
                            </div> 
                            <div className={'coupon-paper ' + this.getCouponPaper()}>
                                <div className="left">
                                    <span className={this.moneySize(couponInfoDto.money)}>
                                        ￥<var>{couponInfoDto.money||0}</var>
                                    </span>
                                </div>
                                <div className="middle">
                                <svg width="3px" height="100%" viewBox="0 0 3 142" style={{stroke: 'currentColor'}}>
                                    <defs></defs>
                                    <g id="Page-1" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.300000012" stroke-dasharray="16.53000068664551,14.5600004196167">
                                        <g id="显示全部" transform="translate(-338.000000, -250.000000)" stroke-width="2">
                                            <g id="Group-6" transform="translate(0.000000, 114.000000)">
                                                <g id="Group-9" transform="translate(50.000000, 105.000000)">
                                                    <path d="M289.379139,31.2086093 L289.379139,172.370422" id="Path-2"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                </div>
                                <div className="right">
                                    <div className="right-inner">
                                        <div className="code-status">已生成优惠码</div>
                                        <div className="count">{couponInfoDto.codeNum ? `${couponInfoDto.codeNum - couponInfoDto.useNum}/${couponInfoDto.codeNum}` :'无限'}</div>
                                        <div className="tips">有效期 {couponInfoDto.overTime ? formatDate(couponInfoDto.overTime,'yyyy-MM-dd hh:mm:ss') : '永久有效'}</div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="coupon-type-bar">
                                <span className="label">优惠码类型</span>
                                <span className={`radio-box ${couponInfoDto.spreadType == 'qr'?'on':''}`}>二维码</span>
                                <span className={`radio-box ${couponInfoDto.spreadType == 'normal'?'on':''}`}>卡券</span>
                            </div>
                            <div className="info">
                                二维码形式优惠券会在用户领取后1天，且未使用优惠券时下发提醒，提高核销率，增加订单
                            </div> */}
                        </div>   

                        <CodeItems 
                            couponList = {this.state.couponList}
                            isOverTime = {this.isOverTime}
                            overTime = {this.state.couponInfoDto.overTime}
                            businessName = {couponInfoDto.businessName}
                            status = {this.state.status}
                            toggle={this.handleShowCouponBottom}
                            liveId={this.state.couponInfoDto.liveId}
                        />
                        

                    </ScrollToLoad>
                      
                </div>
                <CouponBottomActionSheet 
                    show={ this.state.showCouponBottom }
                    status={ this.state.status }
                    hide={ this.handleShowCouponBottom }
                    changeStatus={ this.changeStatus }
                /> 
                {
                    ((!couponInfoDto.codeNum || couponInfoDto.codeNum - couponInfoDto.useNum > 1 ) && !this.isOverTime)?
                    <div className="flex-other code-page-bottom">
                        <div className="btn-add-coupon on-log"
                        data-log-region="coupon-info"
                        data-log-pos="group-send"
                        onClick={this.sendCouponBatch}    
                        >
                            点击群发
                                {/* {couponInfoDto.codeNum ?
                                <span className="s-two">(还剩{couponInfoDto.codeNum - couponInfoDto.useNum}个)</span> 
                                : null
                                } */}
                        </div>
                        {
                            (/(topic|channel)/.test(this.props.params.type))?
                            <React.Fragment>
                                <div className="gutter"></div>
                                <div className="get-coupon-card on-log"
                                    data-log-region="coupon-info"
                                    data-log-pos="invite-card"
                                    onClick={this.getCard}    
                                >生成优惠券邀请卡</div>
                            </React.Fragment>
                            :null
                        }
                    </div>: null
                }
            </Page>
        );
    }
}

CodeInfo.propTypes = {

};

function mstp(state) {
    return {
        sysTime:state.common.sysTime
    }
}

const matp = {
    getCouponUseList,
    getCouponDetail,
    addCouponCode
}

export default connect(mstp, matp)(CodeInfo);