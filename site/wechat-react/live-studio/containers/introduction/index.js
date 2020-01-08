import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import { connect } from 'react-redux';
import classnames from 'classnames';
import Page from 'components/page'
import { doPay, getActiveTime, getAgreementVersion, getAgreementStatus, assignAgreement } from 'common_actions/common'
import { apiService } from "components/api-service";
import { MiddleDialog, Confirm } from 'components/dialog';
import { getLivePrice, getMyLive, liveInfo, initLiveFocus } from '../../actions/live';
import { getUserInfo } from '../../actions/common';
import { fetchIsAdminFlag } from '../../actions/live-studio';
import { locationTo,getVal, formatDate } from 'components/util';

import Header from './components/header';
import ChargeAllocation from './components/charge-allocation';
import OrgBenefits from './components/org-edition-benefits';
import CustomerList from './components/customer-list-wrap';
import SuccessDialog from './components/success-dialog';
import AgreementDialog from './components/agreement-dialog';
import ProtocolPage from './components/agreement-dialog/protocol';
import { get } from 'lodash';


import {
    fetchCouponInfo,
} from '../../actions/coupon'

@autobind
class Introduction extends Component {

    state = {
        // 页面title
        pageTitle: '服务升级',
        // 是否已经是专业版
        isLiveAdmin: false,
        // 专业版购买价格
        liveAdminBuy: 0,
        // 是否弹出咨询二维码
        showAdvisoryQr: false,
        // 展示专业版的服务协议
        showAgreement: false,
        // 是否同意专业版的服务协议
        isAgree: false,
        // 展示购买确认框
        showPurchaseConfirm: false,
        // 直播间名称
        liveName: '',
        // 是否弹出老用户邀新弹框
        showOldBeltNew: true,
        oldBeltNewIsEnd: true,
        liveList: [],
        chargeConfigs: [],
        primeCosts: [1599, 2599, 4999],
        selectId: 0,
        selectCharge: {},
        newLiveAdmin: false,
        showSuccessDialog: false,
        couponDiscount: 0,
        bindCodeId: '',
        // 显示协议
        showProtocol:false,
        // 是否同意过该版本协议，如果同意过，则不可以取消勾选
        agreeStatus: false,
        // 当前讲师协议版本
        agreementVersion: '',
    }

    

    get liveId() {
        return this.props.location.query.liveId || this.state.liveId;
    }

    componentDidMount = async () => {
        // 查询用户信息
        this.props.getUserInfo();
        let liveInfo;
        if(this.liveId){
            liveInfo = await this.props.liveInfo(this.liveId);
        }
        
        // 查询专业版价格信息和直播间名称
        Promise.all([this.props.getLivePrice(), this.props.getMyLive(), this.props.getActiveTime()]).then(([priceResult, liveResult, activityTime]) => {
            this.setState({
                liveAdminBuy: priceResult.data.liveAdminBuy,
                liveName: liveInfo && liveInfo.entity.name ||  liveResult.data.entityPo && liveResult.data.entityPo.name,
                logo: liveInfo && liveInfo.entity.logo ||  liveResult.data.entityPo && liveResult.data.entityPo.logo,
                liveId: this.liveId || liveResult.data.entityPo && liveResult.data.entityPo.id||'',
                oldBeltNewIsEnd: activityTime.data.isEnd
            }, async () => {
                this.checkLiveId();
                
                // 查询是否已经是专业版
                this.liveId && await fetchIsAdminFlag({ liveId: this.liveId })()
                .then(data => {
                    this.setState({
                        isLiveAdmin: data.data.isLiveAdmin === 'Y',
                        liveAdminOverDue: data.data.liveAdminOverDue,
                        newLiveAdmin:data.data.newLive === 'Y',
                    })
                    if(get(data, 'data.isLiveAdmin', '') === 'Y'){
                        this.getAgreementStatus();
                    }
                })
                .catch(err => {
                    console.error(err)
                });
                this.getLiveAdminChargeConfig();
                this.getCouponInfo();
            });
            
        });

        this.getMgrLiveList();

        
    }

     // 获取讲师协议状态
     getAgreementStatus = async()=> {
        // 获取讲师协议版本
        await getAgreementVersion().then(async(version) => {
            this.setState({agreementVersion: version})
            // 获取讲师协议同意状态
            const res = await getAgreementStatus({liveId: this.liveId,version})
            if(res.state.code === 0){
                let status = res.data && res.data.status
                if(status == 'Y'){
                    this.setState({
                        agreeStatus: true,
                        isAgree: true,
                    })
                }
            }
        },reject => {
            console.error(reject)
        })
    }


    /* 获取我的管理直播间 */
    async getMgrLiveList() {
        const mrList = apiService.post({
            url: '/h5/live/findLiveEntity',
            body: {
                type: 'manager',
                page: {
                    page: 1,
                    size:99999,
                }
            },
        });
        const myList = apiService.post({
            url: '/h5/live/findLiveEntity',
            body: {
                type: 'creater',
                page: {
                    page: 1,
                    size:99999,
                }
            },
        });

        Promise.all([mrList, myList]).then(([mr,ce]) => {
            let liveList = [...getVal(ce, 'data.liveEntityPos', []), ...getVal(mr, 'data.liveEntityPos', [])]
            this.setState({
                liveList
            })
        })

    }


    /* 获取收费配置 */
    async getLiveAdminChargeConfig() {
        const result = await apiService.post({
            url: '/h5/live/getLiveAdminChargeConfig',
            body: {
                liveId: this.liveId
            },
        });
        let chargeConfigs = getVal(result, 'data.chargeConfigs');
        chargeConfigs = chargeConfigs.map((item,idx) => {
            item.primeCost = this.state.primeCosts[idx];
            return item;
        })
        if (!this.state.newLiveAdmin) {
            chargeConfigs = chargeConfigs.filter(item => {
                return item.id != "100000001"
            }).reverse();
        }
        if (chargeConfigs.length) {
            this.setState({
                chargeConfigs,
                selectId: chargeConfigs[0].id,
                selectCharge:chargeConfigs[0]
            })
            
        }
        

    }

    switchChargeId(item) {
        this.setState({
            selectId: item.id,
            selectCharge:item
        })
    }


    // 展示业务咨询二维码
    showQrModal(){
        this.setState({
            showAdvisoryQr: true
        })
    }

    // 关闭业务咨询二维码
    closeQrModal(){
        this.setState({
            showAdvisoryQr: false
        })
    }

    // 关闭业务咨询二维码
    toggleOldBeltNew(){
        this.setState({
            showOldBeltNew: !this.state.showOldBeltNew
        })
    }

    goOldBeltNew () {
        window.location.href = 'https://ygkc.qianliao.tv/activity/page/old-belt-new?liveId=' + this.state.liveId
    }

    // 展示专业版服务协议
    displayAgreement(){
        this.setState({
            showAgreement: true,
            // showPurchaseConfirm: false,
            // pageTitle: '服务协议'
        })
    }

    // 关闭专业版服务协议
    hideAgreement(){
        this.setState({
            showAgreement: false,
            // showPurchaseConfirm: true,
            // pageTitle: '服务升级'
        })
    }

    // 展示专业版购买确认框
    displayPurchaseConfirm(){
        this.refs['purchase-confirm-dialog'].show();
        this.setState({
            // isAgree: true,
            showPurchaseConfirm: true
        })
    }

    // 关闭专业版购买确认框
    hidePurchaseConfirm(){
        this.refs['purchase-confirm-dialog'].hide();
        this.setState({
            showPurchaseConfirm: false
        })
    }

    // 切换服务协议复选框的勾选状态
    toggleAgreeStatus(){
        // 如果已经同意过，则不给修改
        if(this.state.agreeStatus){
            return
        }
        this.setState({
            isAgree: !this.state.isAgree
        });

    }

    // 处理购买确认框的点击事件
    async hookConfirmClick(buttonTag){
        // 点击购买确认框的“确认按钮”
        if (buttonTag === 'confirm') {
            const {isAgree} = this.state;
            // 只有已经勾选同意专业版服务协议才发起购买请求
            if (isAgree) {
                // 关闭确认框
                this.hidePurchaseConfirm();
                await this.props.doPay({
                    type: 'LIVEADMIN',
                    liveId: this.liveId,
                    total_fee: 1024,
                    chargeConfigId:this.state.selectId,
                    ch: this.props.location.query.salerId || '',
                    groupId: this.state.bindCodeId||'',
                    callback: async() => {
                        // 同意讲师协议
                        if(!this.state.agreeStatus){
                            await getAgreementVersion().then(async(version) => {
                                await assignAgreement({liveId: this.liveId,version})
                            },reject => {
                                console.error(reject)
                            })
                        }
                        this.setState({
                            agreeStatus: true,
                            showSuccessDialog:true
                        })
                    }
                });
                // 添加埋点 
                let {chargeConfigs, selectId, newLiveAdmin} = this.state
                let selectItem = chargeConfigs.find(item => item.id == selectId)
                if (window._qla) {
                    window._qla('click', {
                        region: `${newLiveAdmin ? 'upgrade' : 'renew'}`,
                        pos: selectItem && selectItem.year
                    });
                }
            }
        } else {
            this.setState({
                showPurchaseConfirm: false
            })
        }
    }


    checkLiveId() {
        let liveId = this.liveId;
        if (!liveId) {
            locationTo(`/wechat/page/backstage`);
        }
    }

    async onPaymentClick() {
        const { isLiveAdmin, isAgree } = this.state;
        if (!isAgree) {
            window.toast('请确认您已阅读并同意服务协议!');
        } else {
            this.displayPurchaseConfirm();
        }
    }

    async getCouponInfo() {
        if (this.props.location.query.couponId) {
            let result = await this.props.fetchCouponInfo({
                couponId: this.props.location.query.couponId,
                liveId: this.liveId 
            })

            let isbind = getVal(result, 'data.isBindCode', '');
            if (isbind == 'Y') {
                this.setState({
                    couponDiscount:getVal(result, 'data.couponCode.discount', 0),
                    bindCodeId:getVal(result, 'data.bindCodeId', 0)
                })
            }
        }
        
    }

    get getCount() {
        if (this.state.couponDiscount) {
            if (this.state.selectCharge.amount > this.state.couponDiscount) {
                return Number((Math.round((this.state.selectCharge.amount - this.state.couponDiscount) * 100) / 100).toFixed(2));
            } else {
                return 0;
            }
        } else {
            return this.state.selectCharge.amount;
        }
    }

    toggleProtocol() {
        this.setState({
            showProtocol:!this.state.showProtocol
        })
    }

    render() {
        const { isLiveAdmin, liveAdminOverDue, liveAdminBuy, showAdvisoryQr, showOldBeltNew, oldBeltNewIsEnd, pageTitle, showAgreement, isAgree, showPurchaseConfirm, liveName, logo, liveList, chargeConfigs, selectId, selectCharge, newLiveAdmin} = this.state;
        const { name, headImgUrl } = this.props.userInfo;
        return (
            <Page title={pageTitle}
                className={'introduction-container flex-body'}
            >
                <div className="flex-main-s">
                    <Header
                        logo={logo}
                        liveName={liveName}
                        isLiveAdmin={isLiveAdmin}
                        liveAdminOverDue={liveAdminOverDue}
                        liveList={liveList}
                        selectedId={this.liveId}
                    />
                
                    <div className="middle-container">
                        {/* 收费配置 */}
                        <ChargeAllocation
                            chargeConfigs = {chargeConfigs}
                            selectId = {selectId}
                            switchChargeId = {this.switchChargeId}
                            newLiveAdmin = {newLiveAdmin}
                        />

                        {/* 专业版介绍 */}
                        <div className="org-edition-intro">
                            <span className="title-bar">
                                <h1 className="org-tip">专业版</h1>
                                <span className="btn-info-link" onClick={()=>{locationTo('https://mp.weixin.qq.com/s/4uCGbGLTPcpjOyFdHLjA9Q')}}>更多详细介绍<i className='icon_enter'></i></span>
                            </span>    
                            <p>千聊专业版通过工具赋能,为企业、自媒体以及讲师个人提供知识变现一站式工具服务,满足<i>品牌打造、内容承载营销、推广用户转化、社群运营和数据分析</i>六大核心需求,强力支援你的知识变现事业。</p>
                        </div> 

                        <OrgBenefits />
                        

                        <CustomerList/>
                        
                        
                        {/* 购买须知 */}
                        <div className="purchase-tips-wrap">
                            <h1 className="org-tip">购买须知</h1>
                            <div className="purchase-tips">
                                <div className="purchase-tip">
                                    <div className="number-icon">1</div>
                                    <div className="purchase-tip-text">成功支付后即时开通专业版，续费则自动顺延，届时不续费则将切换回基础版。</div>
                                </div>
                                <div className="purchase-tip">
                                    <div className="number-icon">2</div>
                                    <div className="purchase-tip-text">开通后请尽快对接服务号，以便更好地运营您的专业版直播间。</div>
                                </div>
                                <div className="purchase-tip">
                                    <div className="number-icon">3</div>
                                    <div className="purchase-tip-text">此产品属于虚拟产品服务，不支持退款，购买前有疑问欢迎咨询我们。</div>
                                </div>
                                <div className="purchase-tip">
                                    <div className="number-icon">4</div>
                                    <div className="purchase-tip-text">如需开发票，请关注公众号“千聊知识店铺”，回复“发票”。</div>
                                </div>
                            </div>
                        </div>
                        {/* 消费协议勾选 */}
                        <div className="agreement-checked">
                            <label htmlFor="agree-checkbox" className="agree-label">
                                <span className = {`fake-checkbox${isAgree ? ' fake-checkbox-checked' : ''}`} onClick={this.toggleAgreeStatus}></span>
                                <span className="label-text">
                                    我已阅读<a href="javascript:void(0)" className="agreement-link" onClick={this.displayAgreement}>《千聊专业版服务协议》</a>和<a href="javascript:void(0)" className="agreement-link" onClick={this.toggleProtocol}>《千聊平台服务协议》</a>并同意购买.并保证严格按照协议执行。
                                </span>
                            </label>
                        </div>
                    </div>
                </div>   

                <div className="flex-other">
                    {/* 购买按钮 */}
                    {
                        <div className="purchase-button-container">
                            <div className="advisory-button" onClick={this.showQrModal}>
                                <i className="advisory-icon"></i>
                                <div>咨询</div>
                            </div>
                            <button 
                                type="button" 
                                className={`purchase-button${this.state.couponDiscount?' has-coupon':''}`}
                                onClick={this.onPaymentClick}>
                                {
                                    isLiveAdmin?'立即续费':'立即开通'
                                }
                                {
                                    this.state.couponDiscount ?
                                    <span className='coupon-info'>优惠券￥{this.state.couponDiscount||0} (券后￥{this.getCount}/{this.state.selectCharge.year})</span>  
                                    :null  
                                }
                                
                            </button>

                            {
                                !oldBeltNewIsEnd && (
                                    <span className='old-belt-new-small' onClick={ this.goOldBeltNew }></span>
                                )
                            }

                        </div>
                    }
                
                </div>


                {/* 客服咨询二维码 */}
                <MiddleDialog 
                    show={showAdvisoryQr}
                    buttons='none'
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className="introduction-org-dialog"
                    onClose={() => {}}
                    title=''>
                    <div className="advisory-qr-wrap">
                        <img className="advisory-qr" src={require('./imgs/advisory_qr.jpg')} alt="独立专业版咨询二维码" />
                        <p>长按识别二维码添加我们微信</p>
                        <p>实时在线为您答疑</p>
                        <div className="id-close-modal" onClick={this.closeQrModal}></div>
                    </div>
                </MiddleDialog>
                {/* 老用户邀新 */}
                {
                    !oldBeltNewIsEnd && (
                        <MiddleDialog
                            show={showOldBeltNew}
                            buttons='none'
                            theme='empty'
                            bghide
                            titleTheme={'white'}
                            className="introduction-org-dialog"
                            onClose={() => {}}
                            title=''>
                            <div className="old-belt-new-dialog">
                                <img onClick={ this.goOldBeltNew} src={require('./imgs/old-belt-new.png')} alt="老用户邀新活动图" />
                                <div className="id-close-modal" onClick={this.toggleOldBeltNew}></div>
                            </div>
                        </MiddleDialog>
                    )
                }
                {/* 专业版购买确认弹框 */}
                <Confirm
                    className={classnames("purchase-confirm", {
                        "agree-not-checked": !isAgree
                    })}
                    title="购买确认"
                    onBtnClick={this.hookConfirmClick}
                    bghide={false}
                    ref="purchase-confirm-dialog">
                    <ul className="purchase-confirm-container">
                        <li><span className="tip">生效直播间：</span><span className='content'>{liveName}</span></li>
                        <li><span className="tip">升级时长：</span><span className='content'>{this.state.selectCharge.year}</span></li>
                        <li><span className="tip">版本有效期：</span><span className='content'>{formatDate(selectCharge.newExpirTime)}</span></li>
                        <li><span className="tip">原价</span><span className='content'>{this.state.selectCharge.primeCost}</span></li>
                        <li><span className="tip">优惠：</span><span className='content favourable'>{this.state.newLiveAdmin?'新':'老'}用户专享优惠￥{this.state.selectCharge.primeCost-this.state.selectCharge.amount}元</span></li>
                        {
                            this.state.couponDiscount ?
                                <li><span className='content favourable'>优惠券￥{this.state.couponDiscount}元</span></li>
                            :null    
                                
                        }
                        <li><span className="tip">应付：</span><span className='content'>￥{this.getCount}元</span></li>
                    </ul>    
                </Confirm>
                
                {
                    this.state.showSuccessDialog?
                        <SuccessDialog />
                    :null    
                }


                {/* 专业版服务法律协议 */}
                <AgreementDialog
                    showAgreement = {showAgreement}
                    liveAdminBuy = {liveAdminBuy}
                    hideAgreement = {this.hideAgreement}
                
                />
                {/* 讲师协议 */}
                <ProtocolPage
                    showProtocol = {this.state.showProtocol}
                    toggleProtocol = {this.toggleProtocol}
                
                />

                

            </Page>
        );
    }
}

Introduction.propTypes = {

}

function mapStateToProps(state) {
    return {
        userInfo: state.common.userInfo.user,
    }
}

const mapActionToProps = {
    doPay,
    getActiveTime,
    getUserInfo,
    getLivePrice,
    getMyLive,
    liveInfo,
    fetchCouponInfo,
}

export default connect(mapStateToProps, mapActionToProps)(Introduction);
