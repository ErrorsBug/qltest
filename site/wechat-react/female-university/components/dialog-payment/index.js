import React, { PureComponent,Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import { BottomDialog } from 'components/dialog';
import { formatCountdown, getVal, locationTo,formatDate,sortBy, getCookie } from 'components/util';
import Detect from 'components/detect';
import { request, doPay } from 'common_actions/common'
import { bindCoupon,getCouponInfo,fetchCouponListAction } from 'common_actions/coupon'
import RedEnvelope from '../red-envelope'
import { getUrlParams, fillParams } from 'components/url-utils';
import {flagShareTypeGet,} from '../../actions/flag';
import AppEventHoc from '../app-event';
import CouponLoad from '../coupon-load';
import { userCardRefInfo } from '../../actions/family'
import CountComp from './count-comp'

@AppEventHoc
@withStyles(styles)
@autobind
class DialogPayment extends PureComponent {

    state = {
        portalDom:null,
        isShow: false,
        leftTime: '',
        // 有没有邀请优惠券
        hasInvaCoupon:false,
        chargeConfig: {},
        showCoupon: false,
        couponInfo:null,
        isOutLink: false,  //是否是外链跳转到该页面，领见证红包
        unCouponInfo: null,
        isFlagUser: false, 
        isShareUser: false,
        isCouponLoad: false,
        couponList: [],
        isFamilyCard: false,
        invitaUserInfo: null
    }

    data = {
        
    }

    isLoading = false;
    isOnceClick = false;
    get ch(){
        return getUrlParams('ch', '')
    }

    async componentDidMount() {
        const { isQlchat } = this.props;
        this.setState({
            portalDom:document.querySelector('.portal-middle')
        })
        await this.userCardRefInfo();
        await this.flagShareType();
        await this.initConfig();
        if(!isQlchat){
            await this.getBuyedVip();
        }
        await this.initCouponInfo();
    }

    // 亲友卡红包弹窗
    async userCardRefInfo() {
        const { status, cardInfo } = await userCardRefInfo();
        this.setState({
            isFamilyCard: Object.is(status, 'Y'),
            invitaUserInfo: cardInfo || null,
        })
    }

    // 获取收费配置
    async initConfig() {
        await request({
            url: '/api/wechat/transfer/baseApi/h5/system/getConfigMap',
            method: 'POST',
            body: {
                businessType:'UFW_CONFIG_KEY'
            }
        }).then(res => {
            let chargeConfig = getVal(res, 'data', {});
            for (let key of Object.keys(chargeConfig)) {
                let val = Number(chargeConfig[key]);
                if (!Object.is(val,NaN)){
                    chargeConfig[key] = val;
                }
            }
            this.setState({
                chargeConfig
            }, () => {
                this.updateCharge();
            })
		}).catch(err => {
			console.log(err);
		})
    }

    updateCharge() {
        let chargeConfig = this.state.chargeConfig;
        this.props.updateCharge && this.props.updateCharge({...chargeConfig,totalPrice:this.totalPrice});
    }


    // 初始化优惠券相关信息
    async initCouponInfo() {
        await this.fetchCouponListAction();
        this.initInvaCoupon();
        await this.setState({
            couponList:[...this.data.couponList,...(Object.values(this.data.invaCouponArr))]
        }, async () => {
            this.updateCurCoupon(); // 此处不能删除!!!!!!!!!!!!!!!
            await this.initUrlCoupon();
            this.updateCurCoupon(); // 此处不能删除!!!!!!!!!!!!!!!
        })
    }

    // 获取优惠券信息
    async getCouponInfo() {
        const { couponList } = this.data;
        let couponId = getUrlParams('couponId')
        let params = {}
        if(couponId) {
            params.code = couponId;
            params.receiveType = 'batch'
        } else {
            params.code = getUrlParams('couponCode');
        }
        if (params.code) {
            let result = await this.props.getCouponInfo(params);
            let couponInfo = getVal(result, 'data.CouponInfoDto', {});
            couponInfo.isBatch = Object.is(params.receiveType, 'batch')
            let flag = Object.is(params.receiveType, 'batch') && (!couponInfo.codeNum || (!!couponInfo.codeNum && couponInfo.useNum < couponInfo.codeNum )) 
            if(flag){
                const idx = couponList.findIndex((item) => couponInfo.useRefId === item.useRefId)
                if(idx > -1){
                    flag = false;
                }
            }
            if(couponInfo && (flag || couponInfo.useStatus == 'unused') && couponInfo.overTime > this.props.sysTime){
                return {
                    ...couponInfo,
                    couponId:getUrlParams('couponId'),
                    code: getUrlParams('couponCode')
                };
            }
           return null
        } else {
            return null;
        }
    }


    // 获取我的优惠券
    async fetchCouponListAction() {
        let result = await this.props.fetchCouponListAction({
            businessType: 'UFW',
            businessId:1,
            liveId:1
        })
        let couponList = getVal(result, 'data.couponList', []);
        this.data.couponList = couponList;
        // 消除加载中按钮
        this.isLoading = true;
        this.changeCouponLoad && this.changeCouponLoad(false);
    }


    // 初始化已领取的虚拟优惠券
    initInvaCoupon() {
        let time = this.props.sysTime;
        let invaCouponArr = localStorage.getItem('invaCouponArr')||'{}';
        invaCouponArr = JSON.parse(invaCouponArr);
        if (invaCouponArr.witness) {
            invaCouponArr.witness = this.setCouponInfo(invaCouponArr.witness)
            // 过期不可使用
            if (invaCouponArr.witness.overTime && invaCouponArr.witness.overTime < time) {
                delete invaCouponArr.witness;
            }
        }
        if (invaCouponArr.share) {
            invaCouponArr.share = this.setCouponInfo(invaCouponArr.share)
            // 过期不可使用
            if (invaCouponArr.share.overTime && invaCouponArr.share.overTime < time) {
                delete invaCouponArr.share;
            }
        }
        if (invaCouponArr.pingmin) {
            invaCouponArr.pingmin = this.setCouponInfo(invaCouponArr.pingmin)
            // 平民券只有地址携带pingmin 才能使用
            if (getUrlParams('pingmin')) {
                delete invaCouponArr.pingmin;
            }
        }
        if (invaCouponArr.vip) {
            invaCouponArr.vip = this.setCouponInfo(invaCouponArr.vip)
        }
        if (invaCouponArr.card) {
            invaCouponArr.card = this.setCouponInfo(invaCouponArr.card)
        }
        // 缓存里所有虚拟优惠券
        this.data.invaCouponArr = invaCouponArr;
    }


    // 判断是否有可领取的优惠券
    async initUrlCoupon() {
        let urlCouponArr = [];
        let userId = getUrlParams('userId');
        let urlType = getUrlParams('couponType');
        let time = this.props.sysTime;
        let oneDay = 86400000;
        let title = '';
        

        /*
        * 特殊需求
        * 某些推送不想显示推荐者信息
        */
        if(userId === '120000266607480'){
            this.setState({
                isOutLink: true,
            });
        }


        /**************************** 
         * 
         *  地址带有虚拟优惠券判断
         * 
         * ***************************/ 
        let couponType = '';
        switch (urlType) {
            case 'witness': couponType = 'UFW_SHARE_FLAG_COUPON_AMOUNT'; break;
            case 'share': couponType = 'UFW_SHARE_COUPON_AMOUNT'; break;
            case 'pingmin': couponType = 'UFW_NORMAL_COUPON_AMOUNT'; title = '  ';  break;
        };
        

        /**
         * 1. 如果没有领取过
         * 2. 如果领取的不是同一个人
         * 3. 领取过但已过期
         */
        if ((urlType && !!couponType && !this.data.invaCouponArr[urlType])
            || (userId && this.data.invaCouponArr[urlType]?.userId !== userId)
            || (this.data?.invaCouponArr[urlType] &&this.data.invaCouponArr[urlType].overTime && this.data.invaCouponArr[urlType].overTime < time)
        ) {

            // 如果分销用户或者flag用户不符合
            if (!(
                (urlType == 'witness' && !this.state.isFlagUser)
                ||(urlType == 'share' && !this.state.isShareUser)
            )) {
                if(!!couponType){
                    let urlCouponItem = {
                        title,
                        userId, 
                        couponType,
                        time: urlType === 'pingmin' ? '' :this.props.sysTime,
                        overTime: urlType === 'pingmin' ? '' :this.props.sysTime + oneDay,
                        useRefId: '',
                        key:urlType
                    }
                    urlCouponArr.push(this.setCouponInfo(urlCouponItem)) 
                }
            }

        }
        /**************************** 
         * 
         *  亲友卡
         * 
         * ***************************/ 
        if(this.state.isFamilyCard && !this.data?.invaCouponArr['card']){
            let vipCouponItem = {
                title:'大学体验卡专享福利',
                couponType: 'UFW_CARD_COUPON_AMOUNT',
                useRefId: '',
                key:'card'
            }
            urlCouponArr.push(this.setCouponInfo(vipCouponItem))
        }

        /**************************** 
         * 
         *  vip优惠券判断
         * 
         * ***************************/ 

        if (this.state.isBuyedVip && !this.data.invaCouponArr['vip']) {
            let vipCouponItem = {
                title:'千聊会员专享',
                couponType:'UFW_MEMBER_COUPON_AMOUNT',
                // time:this.props.sysTime,
                useRefId: '',
                key:'vip'
            }
            urlCouponArr.push(this.setCouponInfo(vipCouponItem))
        }


         /**************************** 
         * 
         *  判断是否有可以领取的真实优惠券
         * 
         * ***************************/ 
        let codeCouponItem = await this.getCouponInfo();
        if (codeCouponItem) {
            urlCouponArr.push(codeCouponItem)
        }


        // 降序排序 获取最大的优惠券
        urlCouponArr = urlCouponArr.sort(sortBy('money',false))

        // 所有待领取的优惠券
        this.data.urlCouponArr = urlCouponArr;
        if (urlCouponArr.length > 0) {
            let unCouponInfo = urlCouponArr[0];
            let couponInfo = this.state.couponInfo;
            //如果没有已领取的优惠券 或者 待领取的优惠券比现有得优惠券金额大 则可领取
            if (!couponInfo?.money || (unCouponInfo.money && unCouponInfo.money >= couponInfo.money)) {
                this.setState({
                    showCoupon:true,
                    unCouponInfo,
                });
                
            }
        }
    }

    // 优惠券信息格式化
    setCouponInfo(coupon) {
        return {
            ...coupon,
            money:this.state.chargeConfig[coupon.couponType]
        }
    }


    async flagShareType(){
        const userId = getUrlParams('userId')
        if(!!userId) {
            let result = await flagShareTypeGet({
                studentId: userId,
            });
            this.setState({
                isFlagUser: result.data?.flag ==='Y', 
                isShareUser: result.data?.shareType !=='LEVEL_F' && result.data?.shareType !=='N' ,
            });
        }
    }
    //是否付费过千聊会员，会员已经过期也算
    async getBuyedVip(){
        await request({
            url: '/api/wechat/transfer/baseApi/h5/member/hasPay',
            method: 'POST',
            body: {
                
            }
        }).then(result => {
            this.setState({
                isBuyedVip: result.data?.status ==='Y' 
            });
            if(result.data?.status ==='N' ){ 
                let hasInvaCoupon=localStorage?.hasInvaCoupon?JSON.parse(localStorage?.hasInvaCoupon):''
                if(hasInvaCoupon&&hasInvaCoupon.couponType=='vip'){ 
                    localStorage.removeItem('hasInvaCoupon')
                }
            }
        })  
        
    }


    // 通知后端虚拟优惠券过期时间
    async fetchInvaCoupon(key){
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/woman/university/setCouponTimeout',
            method: 'POST',
            body: {
                couponType: key,
                shareUserId: getUrlParams('userId'),
            }
        }).catch(err => {
			console.log(err);
		})
    }

    // 绑定所有可领取的优惠券
    async bindCoupon() {
        let codeCoupon = this.data.urlCouponArr.find(item => !item.key);
        localStorage.removeItem("guideTime");
        if (codeCoupon) {
            let couponId = getUrlParams('couponId')
            let params = {
                businessType: 'UFW',
                businessId:1
            }
            if(couponId) {
                params.code = couponId;
                params.receiveType = 'batch'
            } else {
                params.code = getUrlParams('couponCode');
            }
            if (params.code) {
                let result = await this.props.bindCoupon(params)
                if (result?.state?.code == '0') {
                    let couponData = result?.data?.couponData;
                    let useRefId = result?.data?.useRefId || '';
                    let couponItem = { useRefId: codeCoupon.useRefId || useRefId, ...couponData };
                    this.data.couponList.push(couponItem);
                }else if(result?.state?.msg) {
                    window.toast(result ?.state ?.msg)
                }
            }
        }

        // 遍历领取虚拟优惠券
        this.data.urlCouponArr.forEach(async item => {
            if (item.key) {
                this.data.invaCouponArr[item.key] = item;
            }
            if (item.overTime) {
                // 通知后端过期时间
                this.fetchInvaCoupon(item.key);
            }
            
        });
        localStorage.setItem('invaCouponArr', JSON.stringify(this.data.invaCouponArr))
        

        this.setState({
            showCoupon:false,
            couponList:[...this.data.couponList,...(Object.values(this.data.invaCouponArr))]
        }, () => {
            this.updateCurCoupon();
        })
        window.toast('领取成功');



    }

    // 更新选中的优惠券
    updateCurCoupon() {
        let couponList = this.state.couponList;
        couponList = couponList.sort(sortBy('money', false))
        this.setState({
            couponList,
            couponInfo: couponList[0],
        }, () => {
            this.initCountDown();
            this.updateCharge();
            
        })
    }


    toggle() {
        if(this.isLoading){
            this.setState({
                isShow:!this.state.isShow
            })
        } else {
            this.isOnceClick = true;
            this.changeCouponLoad && this.changeCouponLoad(true);
        }
    }
    

    // 正在加载优惠券提示
    changeCouponLoad(flag) {
        this.setState({
            isCouponLoad: flag
        })
    }
    
    /**
     * 循环限时优惠15分钟
     * 如果有优惠券，则计算优惠券倒计时 
     *
     * @memberof DialogPayment
     */
    initCountDown() {
        let universitySale = localStorage.getItem('universitySale');
        let countTime = 1000 * 60 * 15;
        if (!universitySale || this.props.sysTime - universitySale > countTime) {
            localStorage.setItem('universitySale',this.props.sysTime);
            universitySale = this.props.sysTime;
        }
        let leftTime = countTime - (this.props.sysTime - universitySale);
        if(this.state.unCouponInfo){
            if(!!this.state.unCouponInfo?.key) {
                leftTime = 86400000 - (this.props.sysTime - this.state.unCouponInfo.time);
            } else {
                leftTime = this.state.unCouponInfo.overTime - this.props.sysTime;
            }
        } else if(!!this.state.couponInfo?.key) {
            leftTime = 86400000 - (this.props.sysTime - this.state.couponInfo.time);
        } else if(this.state?.couponInfo) {
            let overTime = this.state?.couponInfo?.overTime;
            leftTime = overTime - this.props.sysTime;
        }
        leftTime = (leftTime / 1000).toFixed(0);
        if (leftTime > 0) {
            if (this.intVal) {
                clearInterval(this.intVal);
            }
            this.intVal = setInterval(() => {
                let formatStr = (~~(leftTime / (3600 * 24))) > 0 ? 'd天 hh:mm:ss' : 'hh:mm:ss';
                if (leftTime <= 0) {
                    this.setState({
                        leftTime: formatCountdown(0, formatStr)
                    })
                    this.props.updatTime && this.props.updatTime(formatCountdown(0, formatStr));
                    clearInterval(this.intVal);
                    return;
                }
                
                leftTime =  leftTime - 1;
                this.setState({
                    leftTime: formatCountdown(leftTime, formatStr)
                })
                this.props.updatTime && this.props.updatTime(formatCountdown(leftTime, formatStr));
    
            },1000)
        } else {
            clearInterval(this.intVal);
        }
    }

    pay() {
        const { isQlchat } = this.props;
        let couponUserRefId = '';
        let shareUserId = '';
        let flagUserId = '';
        let couponInfo = this.state.couponInfo;
        if (couponInfo?.useRefId) {
            couponUserRefId = couponInfo.useRefId;
        }
        if (couponInfo?.key === 'share' || getUrlParams('couponType') == 'share' || (this.state.isShareUser && !couponInfo?.couponType)) {
            // 使用了分销优惠券或者地址有分销优惠券
            shareUserId = couponInfo?.userId || getUrlParams('userId');
        }
        if (couponInfo?.key === 'witness') {
            flagUserId = couponInfo.userId;
        }
        const { isCollege, isCourses, isDou, isExam } = this.props;
        const urlData = JSON.parse(sessionStorage.getItem('urlData') || '{}')
        if(isCollege){
            urlData.secondbuy = getUrlParams('nodeCode')
        }
        if(isCourses){
            urlData.secondbuy = 'kebiao'
        }
        if(isDou) {
            urlData.secondbuy="doudi"
        }
        if(isExam) {
            urlData.secondbuy="text"
        }
        const url = fillParams(urlData,window.location.href)
        const params = {
            shareUserId,
            flagUserId,
            couponUserRefId,
            giftFlag: 'true',
            couponType:couponInfo?.couponType||'',
            source:(Detect.os.weixin && (Detect.os.ios||Detect.os.android))?'h5':'web',
            ch: url,
            url: '/api/wechat/transfer/baseApi/h5/pay/ufwOrder',
        }
        if(isQlchat){
            this.props.pay({
                ...params,
            	success: () => {
                    window.toast("成功支付")  
                },
                fail: (err) => {
                    console.error('qlchat pay err:', err);
                }
            })
        } else {
            this.props.doPay({
                ...params,
                callback: (orderId) => {
                    window.toast("成功支付")
                    setTimeout(() => {
                        locationTo('/wechat/page/join-university-success')
                    }, 1000);
                },
                onCancel: () => {
                    if(!isCollege){
                        if(!/(join\-university\-countdown)/.test(window.location.href)){
                            let url = '/wechat/page/join-university-countdown'
                            if(this.ch){
                                url = `${ url }?ch=${this.ch}`
                            }
                            locationTo(url)
                        }
                    }
                },
                onPayFree:() => {
                    window.toast("成功支付")
                    setTimeout(() => {
                        locationTo('/wechat/page/join-university-success')
                    }, 1000);
                }
            })
        }
    }

    // 点击任何地方都帮用户领取，暂不需要
    // hideCoupon() {
    //     this.setState({
    //         showCoupon:false
    //     })
    // }

    // 获取总价
    get totalPrice() {
        if (!this.state.chargeConfig) {
            return 0;
        }

        // 原价-折扣
        let amount = this.state.chargeConfig.UFW_TICKET_AMOUNT - (this.state.chargeConfig.UFW_TICKET_DISCOUNT_AMOUNT || 0);

        if (this.state.couponInfo) {
            // 如果有优惠券
            amount = amount - this.state.couponInfo.money
        }

        if (amount < 0) {
            amount = 0;
        }

        return amount.toFixed(2);
    }

    
    render() {
        if (!this.state.portalDom) {
            return null
        }
        const { couponInfo, chargeConfig, invitaUserInfo} = this.state
        return (
            <Fragment>
                <div onClick={this.toggle} className="on-log on-visible" 
                    data-log-region="un-pay-btn"
                    data-log-pos="0">
                    {this.props.children}
                </div>
                    { this.state.isCouponLoad &&  <CouponLoad/>}
                

                {
                    createPortal(       
                        <BottomDialog
                            show={this.state.isShow}
                            theme='empty'
                            bghide
                            titleTheme={'white'}
                            buttons={null}
                            close={true}
                            title="优惠倒计时"
                            className={`${styles['jion-page-dialog-payment']}`}
                            onClose={this.toggle}>
                            <div className={`${styles['main']}`}> 
                                <div className={`${styles['header']}`}>
                                    <Fragment> 
                                        <span className={`${styles["title"]}`}>优惠倒计时</span>
                                        <span className={`${styles["countdown"]}`}><CountComp /></span>
                                    </Fragment>
                                    <span className={`${styles["btn-close"]} icon_cross`}  onClick={this.toggle}></span>
                                </div>
                                <div className={`${styles["price-detail"]}`}>
                                    <ul className={`${styles["price-list"]}`}>
                                        <li>
                                            <span className={`${styles["title"]}`}>原学费</span>
                                            <span className={`${styles["price"]}`}>￥{chargeConfig.UFW_TICKET_AMOUNT|| 0}</span>
                                        </li>
                                        { !!chargeConfig.UFW_TICKET_DISCOUNT_AMOUNT && (
                                            <li>
                                                <span className={`${styles["title"]}`}>限时优惠</span>
                                                <span className={`${styles["price"]} ${styles["sale"]}`}>-￥{chargeConfig.UFW_TICKET_DISCOUNT_AMOUNT|| 0}</span>
                                            </li>
                                        ) }
                                        {   
                                            couponInfo?.money ?
                                            (couponInfo.key?
                                            <li>
                                                <span className={`${styles["coupon"]}`}>
                                                    <b>优惠券</b>
                                                    {
                                                        couponInfo.couponType=='UFW_MEMBER_COUPON_AMOUNT'?
                                                        <var>千聊会员专享</var>
                                                        :
                                                        <var>{ couponInfo.overTime ? `${ formatDate(couponInfo.overTime,'MM月dd日') }到期`: '即将过期' }</var>
                                                    }
                                                </span>
                                                <span className={`${styles["price"]}  ${styles["sale"]}`}>-￥{chargeConfig[couponInfo?.couponType]|| 0}</span>
                                            </li>
                                            :
                                            <li>
                                                <span className={`${styles["coupon"]}`}>
                                                    <b>优惠券</b>
                                                    <var>社群团购福利</var>
                                                </span>
                                                <span className={`${styles["price"]}  ${styles["sale"]}`}>-￥{couponInfo.money|| 0}</span>
                                            </li>)
                                            :null
                                        }
                                    </ul>
                                    <div className={`${styles["total-box"]}`}>
                                        <span className={`${styles["title"]}`}>仅需支付</span>
                                        <span className={`${styles["price"]}`}>￥{this.totalPrice}/年</span>
                                    </div>
                                </div>
                                <div className={`${styles["safe-tips"]}`}><img src={require('./img/icon-safe.png')}/>已为你保障支付安全</div>
                                <div className={`${styles["bottom-buttons"]}`}>
                                    <div className={`${styles["button-pay"]} on-log on-visible`}
                                        data-log-name="安全支付"
                                        data-log-region="un-pay-btn"
                                        data-log-pos="0"
                                        onClick={this.pay}>安全支付</div>
                                </div>
                            </div>
                        </BottomDialog>
                        ,this.state.portalDom
                    )
                }
                {
                    this.state.showCoupon ?
                        createPortal(       
                            <RedEnvelope
                                close={this.bindCoupon}
                                bind={this.bindCoupon}
                                couponInfo={this.state.unCouponInfo}
                                invitaUserInfo={ invitaUserInfo }
                                leftTime={ <CountComp /> }
                                isOutLink={this.state.isOutLink}
                            /> 
                        ,this.state.portalDom
                    )
                    :null
                }
            </Fragment>
        );
    }
}

DialogPayment.propTypes = {

};

function mapStateToProps (state) {
    return {
        sysTime:getVal(state,'common.sysTime'),
    }
}

const mapActionToProps = {
    doPay,
    bindCoupon,
    getCouponInfo,
    fetchCouponListAction,
}

module.exports = connect(mapStateToProps, mapActionToProps)(DialogPayment);