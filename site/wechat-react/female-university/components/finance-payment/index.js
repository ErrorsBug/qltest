import React, { PureComponent,Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import { BottomDialog } from 'components/dialog';
import { formatCountdown, getVal, locationTo,formatDate,sortBy, getCookie, formatMoney } from 'components/util';
import Detect from 'components/detect';
import { request, doPay } from 'common_actions/common'
import { bindCoupon,getCouponInfo,fetchCouponListAction } from 'common_actions/coupon'
import RedEnvelope from './red-envelope'
import { getUrlParams, fillParams } from 'components/url-utils'; 
import AppEventHoc from '../app-event';
import CouponLoad from '../coupon-load';
import {getShareMoney} from '../../actions/experience';


@AppEventHoc
@withStyles(styles)
@autobind
class FinancePayment extends PureComponent {

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
        redMoney:0,
    }

    data = {
        
    }

    isLoading = false;
    isOnceClick = false;
    get ch(){
        return getUrlParams('ch', '')
    }
    get campId(){
        return getUrlParams('campId', '')
    }

    async componentDidMount() {
        const { isQlchat } = this.props;
        this.setState({
            portalDom:document.querySelector('.portal-middle')
        })   
        await this.initConfig();
        await this.initCouponInfo();
        
    }
 

    updateCharge() {
        let chargeConfig = this.state.chargeConfig;
        this.props.updateCharge && this.props.updateCharge(this.totalPrice);
    }


    // 初始化优惠券相关信息
    async initCouponInfo() {
        await this.fetchCouponListAction();
        this.initInvaCoupon();
        await this.setState({
            couponList:[...this.data.couponList,this.data.financeCouponArr['share'+this.campId]]
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
            businessType: 'f_camp',
            businessId:this.campId,
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
        let financeCouponArr = localStorage.getItem('financeCouponArr')||'{}';
        financeCouponArr = JSON.parse(financeCouponArr);

        if (financeCouponArr.witness) {
            financeCouponArr.witness = this.setCouponInfo(financeCouponArr.witness)
            // 过期不可使用
            if (financeCouponArr.witness.overTime && financeCouponArr.witness.overTime < time) {
                delete financeCouponArr.witness;
            }
        }
        if (financeCouponArr['share'+this.campId]) {
            //financeCouponArr['share'+this.campId] = this.setCouponInfo(financeCouponArr['share'+this.campId])
            // 过期不可使用
            if (financeCouponArr['share'+this.campId].overTime && financeCouponArr['share'+this.campId].overTime < time
                ||financeCouponArr['share'+this.campId].campId!=this.campId
                || (getUrlParams('userId')&&!this.state.isShareUser) ) {
                delete financeCouponArr['share'+this.campId];
            }
        }
        if (financeCouponArr.pingmin) {
            financeCouponArr.pingmin = this.setCouponInfo(financeCouponArr.pingmin)
            // 平民券只有地址携带pingmin 才能使用
            if (getUrlParams('pingmin')) {
                delete financeCouponArr.pingmin;
            }
        } 
        // 缓存里所有虚拟优惠券
        this.data.financeCouponArr = financeCouponArr;
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
            case 'share': couponType = 'UFW_SHARE_COUPON_AMOUNT'; break;
        };
        
        /**
         * 1. 如果没有领取过
         * 2. 如果领取的不是同一个人
         * 3. 领取过但已过期
         * 4. 金额不一样
         * 5. 训练营不一样
         */ 
        let saveShareType=urlType+this.campId
        if ((urlType && !!couponType && !this.data.financeCouponArr[saveShareType])
            || (userId && this.data.financeCouponArr[saveShareType]?.userId !== userId)
            || (urlType=='share' && this.data.financeCouponArr[saveShareType]?.money != this.state.redMoney)
            || (urlType=='share' && this.data.financeCouponArr[saveShareType]?.campId != this.campId)
            || (this.data?.financeCouponArr[saveShareType] &&this.data.financeCouponArr[saveShareType].overTime && this.data.financeCouponArr[saveShareType].overTime < time)
        ) {

            // 如果分销用户或者flag用户不符合 
            if (!( (urlType == 'share' && !this.state.isShareUser)
            )) {
                if(!!couponType){
                    let urlCouponItem = {
                        title,
                        userId, 
                        time: urlType === 'pingmin' ? '' :this.props.sysTime,
                        overTime: urlType === 'pingmin' ? '' :this.props.sysTime + oneDay,
                        useRefId: '',
                        key:urlType+this.campId,
                        remark:this.props.name,
                        campId:this.campId
                    } 
                    urlCouponArr.push(this.setCouponInfo(urlCouponItem)) 
                }
            }

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
            //如果没有已领取的优惠券 或者 待领取的优惠券比现有得优惠券金额大 或者分销优惠券 则可领取
            if (!couponInfo?.money || (unCouponInfo.key==('share'+this.campId)&&!this.state.couponList[0]?.couponId)|| (unCouponInfo.money && unCouponInfo.money >= couponInfo.money)) {
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
            money:this.state.redMoney
        }
    }

    
    // 获取收费配置
    async initConfig() {
        const shareUserId = getUrlParams('userId')
        const campId = getUrlParams('campId')
        if(shareUserId&&campId){ 
            const data= await getShareMoney({shareUserId,campId})
            await this.setState({
                isShareUser: data?.isShareUser==='Y' ,
                redMoney:formatMoney(data?.redMoney) 
            }) 
        }
        return true 
    } 


    // 通知后端虚拟优惠券过期时间
    async fetchInvaCoupon(overTime){
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/financial/camp/setCouponTimeout',
            method: 'POST',
            body: {
                campId: this.campId,
                shareUserId: getUrlParams('userId'),
                expireTime: overTime,
            }
        }).catch(err => {
			console.log(err);
		})
    }

    // 绑定所有可领取的优惠券
    async bindCoupon() {
        let codeCoupon = this.data.urlCouponArr.find(item => !item.key);
        if (codeCoupon) {
            let couponId = getUrlParams('couponId')
            let params = {
                businessType: 'f_camp',
                businessId:this.campId
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
                this.data.financeCouponArr[item.key] = item;
            }
            if (item.overTime) {
                // 通知后端过期时间
                this.fetchInvaCoupon(item.overTime);
            }
            
        });
        localStorage.setItem('financeCouponArr', JSON.stringify(this.data.financeCouponArr))
        

        this.setState({
            showCoupon:false,
            couponList:[...this.data.couponList,this.data.financeCouponArr['share'+this.campId]]
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
     * @memberof FinancePayment
     */
    initCountDown() {
        let financeSale = localStorage.getItem('financeSale');
        let countTime = 1000 * 60 * 15;
        if (!financeSale || this.props.sysTime - financeSale > countTime) {
            localStorage.setItem('financeSale',this.props.sysTime);
            financeSale = this.props.sysTime;
        }
        let leftTime = countTime - (this.props.sysTime - financeSale);
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
        leftTime = (leftTime / 100).toFixed(0);
        if (leftTime > 0) {
            if (this.intVal) {
                clearInterval(this.intVal);
            }
            this.intVal = setInterval(() => {
                if (leftTime <= 0) { 
                    localStorage.removeItem('financeSale');
                    clearInterval(this.intVal);
                    this.initCountDown()
                    return;
                }
                let d,h,m,s,t;
                d = Math.floor(leftTime/10/60/60/24);
                h = Math.floor(leftTime/10/60/60%24);
                m = Math.floor(leftTime/10/60%60);
                s = Math.floor(leftTime/10%60);
                t = Math.floor(leftTime%10);
                h = h<10 ? "0"+h : h;
                m = m<10 ? "0"+m : m;
                s = s<10 ? "0"+s : s;

 
                leftTime =  leftTime - 1;
                this.setState({
                    leftTime: `${d>0?`${d}天 `:''}${h}:${m}:${s}:${t}`
                })
                this.props.updatTime && this.props.updatTime({d,h,m,s,t});
    
            },100)
        } else {
            clearInterval(this.intVal);
        }
    }

    pay() {
        const { isQlchat } = this.props;
        let couponUserRefId = ''; 
        let shareUserId = ''; 
        let couponInfo = this.state.couponInfo;
        if (couponInfo?.useRefId) {
            couponUserRefId = couponInfo.useRefId;
        }
        if (couponInfo?.key === 'share'+this.campId 
            || (getUrlParams('couponType') == 'share'&&couponInfo?.campId==this.campId) 
            || (getUrlParams('couponType') == 'share'&&couponInfo?.useRefId) 
            || (this.state.isShareUser && !couponInfo?.couponType)) {
            // 使用了分销优惠券或者地址有分销优惠券
            shareUserId = couponInfo.userId || getUrlParams('userId');
        }
        if (couponInfo?.key === 'witness') {
            flagUserId = couponInfo.userId;
        }
        const { isCollege, isCourses, isDou, isExam } = this.props;
        const urlData = JSON.parse(sessionStorage.getItem('urlData') || '{}') 
        if(isDou) {
            urlData.secondbuy="doudi"
        } 
        const url = fillParams(urlData,window.location.href)
        const params = {
            shareUserId,
            couponUserRefId,
            financialId:this.campId,
            source:(Detect.os.weixin && (Detect.os.ios||Detect.os.android))?'h5':'web',
            ch: url,
            url: '/api/wechat/transfer/baseApi/h5/pay/financialCampOrder',
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
                        locationTo(`/wechat/page/experience-finance-card?campId=${this.campId}`)
                    }, 1000);
                },
                onCancel: () => { 
                    if(!/(experience\-finance\-bottom)/.test(window.location.href)){
                        let url = `/wechat/page/experience-finance-bottom?campId=${this.campId}`
                        if(this.ch){
                            url = `${ url }?ch=${this.ch}`
                        } 
                        locationTo(url)
                    } 
                },
                onPayFree:() => {
                    window.toast("成功支付")
                    setTimeout(() => {
                        locationTo(`/wechat/page/experience-finance-card?campId=${this.campId}`)
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
 
        let amount = this.props.bestPrice 

        if (this.state.couponInfo) {
            // 如果有优惠券
            amount = amount - (this.state.couponInfo.money*100)
        }

        if (amount < 0) {
            amount = 0;
        }

        return  formatMoney(amount);
    }

    
    render() {
        if (!this.state.portalDom) {
            return null
        }
        const { couponInfo, chargeConfig} = this.state

        const {price,bestPrice,region} = this.props
        return (
            <Fragment>
                <div onClick={this.toggle} className="finance-payment on-log on-visible" 
                    data-log-region={region+'-paybtn'}
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
                            className={`${styles['finance-page-dialog-payment']}`}
                            onClose={this.toggle}>
                            <div className={`${styles['main']}`}> 
                                <div className={`${styles['header']}`}>
                                    { 
                                        <Fragment> 
                                            <span className={`${styles["title"]}`}>优惠倒计时</span>
                                            <span className={`${styles["countdown"]}`}>{this.state.leftTime}</span>
                                        </Fragment>
                                    }
                                    <span className={`${styles["btn-close"]} icon_cross`}  onClick={this.toggle}></span>
                                </div>
                                <div className={`${styles["price-detail"]}`}>
                                    <ul className={`${styles["price-list"]}`}>
                                        <li>
                                            <span className={`${styles["title"]}`}>原价</span>
                                            <span className={`${styles["price"]}`}>￥{formatMoney(price>bestPrice?price:bestPrice)}</span>
                                        </li>
                                        { price>bestPrice && (
                                            <li>
                                                <span className={`${styles["title"]}`}>限时优惠</span>
                                                <span className={`${styles["price"]} ${styles["sale"]}`}>-￥{formatMoney(price-bestPrice)}</span>
                                            </li>
                                        ) }
                                        {   
                                            couponInfo?.money ?
                                            <li>
                                                <span className={`${styles["coupon"]}`}>
                                                    <b>优惠券</b>
                                                    <var>{formatDate(couponInfo.overTime,'MM月dd日')}到期</var>
                                                </span>
                                                <span className={`${styles["price"]}  ${styles["sale"]}`}>-￥{couponInfo.money|| 0}</span>
                                            </li>
                                            :null
                                        }
                                    </ul>
                                    <div className={`${styles["total-box"]}`}>
                                        <span className={`${styles["title"]}`}>仅需支付</span>
                                        <span className={`${styles["price"]}`}>￥{this.totalPrice}</span>
                                    </div>
                                </div>
                                <div className={`${styles["safe-tips"]}`}><img src={require('./img/icon-safe.png')}/>已为你保障支付安全</div>
                                <div className={`${styles["bottom-buttons"]}`}>
                                    <div className={`${styles["button-pay"]} on-log on-visible`}
                                        data-log-name="安全支付"
                                        data-log-region={region+'-paying'}
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
                                leftTime={this.state.leftTime}
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

FinancePayment.propTypes = {

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

module.exports = connect(mapStateToProps, mapActionToProps)(FinancePayment);