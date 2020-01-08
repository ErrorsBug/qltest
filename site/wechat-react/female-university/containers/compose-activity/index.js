import React, { Component, createRef} from 'react';
import Detect from 'components/detect';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams,fillParams } from 'components/url-utils';
import { userBindKaiFang } from "../../../actions/common"
import ImgComp from './components/img-comp'
import CourseItem from './components/course-item'
import BuyBtn from './components/buy-btn'
import CountComp from './components/count-comp'
import Purchased from './components/purchased'
import SelectedDialog from './components/selected-dialog'
import Ercode from './components/ercode'
import { getWithChildren, getMenuMapNode } from '../../actions/home';
import { getBuyStatus, getActivityPayMoney } from '../../actions/activity'
import { initConfig } from '../../actions/home';  
import { locationTo, getCookie } from 'components/util';
import { share } from 'components/wx-utils';
import HandleAppFunHoc from 'components/app-sdk-hoc'
import AppEventHoc from '../../components/app-event'
import {doPayForCard } from '../../actions/flag';
import Barrage from './components/barrage';
import TagNav from './components/tag-nav'

Number.prototype.mul = function (arg){   
    var m=0,s1=this.toString(),s2=arg.toString();   
    try{m+=s1.split(".")[1].length}catch(e){}   
    try{m+=s2.split(".")[1].length}catch(e){}   
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)   
} 


@HandleAppFunHoc
@AppEventHoc
@autobind
class ComposeActivity extends Component {
    state = {
        courseObj: {},
        modelList: [],
        activityObj: {},
        totalPrice: 0,
        courseIds: [],
        courseList: [],
        status: '',
        isSelectDialog: false,
        discountObj: {},
        maxDisCount: {},
        nextIdx: 0,
        curDisCount: 0,
        buyMoney: 0,
        isQrCode: false,
        isBuy: false,
        tagNavList:[],
        currActiveNavIndex:0
    }
    courseTOList = []
    isLoading = false
    get nodeCode() {
        return getUrlParams('nodeCode', '')
    }
    async componentDidMount() { 
        try {
            await this.initConfig();
        } catch (error) {}
        this.initData();
        this.initBuyMoney();
        this.bindAppKaiFang();
        // 安卓回调
        this.props.onSuccess('onSuccess', () => {
            this.handlePaySuccess()
        })
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
    }
    async bindAppKaiFang(){
        const kfAppId = getUrlParams('kfAppId');
        const kfOpenId = getUrlParams('kfOpenId');
        if(kfOpenId && kfAppId){
            await this.props.userBindKaiFang({
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            });
        }
    }
    // 初始化购物车缓存
    initShappStore(courseObj) {
        const result = JSON.parse(localStorage.getItem(`shapping-${this.nodeCode}`)  || '[]');
        const lists = JSON.parse(localStorage.getItem(`lists-${this.nodeCode}`) || '[]')
        const values = [].concat.apply([], Object.values(courseObj))
        if(!lists.length) return false;
        let arr = [];
        let newPrice = 0;
        lists.map((item) => {
            const course = values.filter((course) => Object.is(course.channelId, item.id))[0] || {};
            arr.push(item.id)
            item.price = Number(course.keyB) || (Number(item.price) || 0)
            newPrice = Number(newPrice) + (Number(item.price) || 0)
            return item
        })
        const obj = this.handleKeys(arr.length)
        this.courseTOList = result
        this.setState({
            courseIds: arr,
            courseList: lists,
            totalPrice: Number(newPrice).toFixed(2),
            ...obj
        })
    }
    // 获取缓存
    initStore() {
        const isShowEr = localStorage.getItem(`once${this.nodeCode}`)
        return Object.is(isShowEr, "Y")
    }
    // 获取折扣配置
    async initConfig() {
        const { SHUANG11_RULE } = await initConfig({ businessType: "SHUANG11_RULE" });
        const obj = (SHUANG11_RULE && JSON.parse(SHUANG11_RULE)) || {};
        const keys = Object.keys(obj);
        const len = (keys.length - 1 >= 0) ? keys.length - 1 : 0;
        this.setState({
            discountObj: obj,
            curDisCount: obj[keys[0]] || 0,
            nextIdx: keys[0],
            maxDisCount: {
                len: keys[len] ,
                discount: obj[keys[len]] || 0
            }
        })
    }
    // 初始化数据
    async initData() {
        const {menuNode} = await getWithChildren({ nodeCode: this.nodeCode })
        if(!!menuNode) {
            const { children, keyK, keyL, ...other } = menuNode
            this.initStatus(keyK, keyL)
            const nodeCodeList = children.map((item) => item.nodeCode)
            const tagNav = children.map((item) => {return {value:item.title,id:item.id}})
            this.setState({
                activityObj: {...other},
                modelList: children,
                tagNavList:tagNav,
            }, () => {
                this.initShare();
                this.state.activityObj.keyM === 'Y' && this.scrollHandler();
            })
            const res = await getMenuMapNode({ nodeCodeList: nodeCodeList })
            this.setState({
                courseObj: res
            }, () => {
                this.initShappStore(res);
            })
        }
    }
    // 初始化活动状态
    initStatus(startTime, endTime) {
        const curTime = new Date().getTime()
        startTime = startTime && new Date(startTime).getTime() || ''
        endTime = endTime && new Date(endTime).getTime() || ''
        let status = ''
        const isOne = (!!endTime && !!startTime && curTime < endTime && curTime > startTime)
        const isT = (!!endTime && !startTime && curTime < endTime)
        const isF = (!endTime && !!startTime && curTime > startTime)
        if((!startTime && !endTime) || isOne || isT || isF) {
            status = 'ing'
        }
        if(!!startTime && curTime < startTime) {
            status = 'start'
        }
        if(!!endTime && curTime > endTime) {
            status = 'end'
        }
        this.setState({
            status
        })
    }
    // 获取购买金额记录
    async initBuyMoney() {
        const { money  } = await getActivityPayMoney({activityCode: this.nodeCode})
        const price = money || 0
        this.setState({
            buyMoney: (Number(money) / 100)
        })
    }
    // 购物车操作
    async onSelect(channelId, price, title, nodeCode, flag, callback) {
        const { status, courseIds, courseList, totalPrice } = this.state;
        if(flag && !courseIds.includes(channelId)) {
            const { isAuth } = await getBuyStatus({ channelId });
            callback && callback()
            if(!isAuth) {
                window.toast('网络异常')
                return false
            } 
            if(isAuth && Object.is(isAuth, 'Y')){
                window.toast('你已买该课，请勿重复购买')
                return false
            }
        }
        if(Object.is(status, 'start') || !status) {
            window.toast('活动尚未开始')
            return false
        }
        if(Object.is(status, 'end')) {
            window.toast('活动已结束')
            return false
        }
        let newPrice = 0;
        if(courseIds.includes(channelId)) {
            newPrice = (Number(totalPrice) - Number(price)).toFixed(2)
            newPrice = newPrice < 0 ? 0 : newPrice
            const arr = courseIds.filter((item) => (channelId != item))
            const lists = courseList.filter(item => (item.id !== channelId))
            this.courseTOList = this.courseTOList.filter(item => (item.courseId !== channelId))
            this.handleShappStore(lists)
            const obj = this.handleKeys(arr.length)
            this.setState({
                courseIds: arr,
                courseList: lists,
                totalPrice: newPrice,
                ...obj
            })
            return false
        }
        if(Object.is(status, 'ing')){
            price = price || 0
            newPrice = (Number(totalPrice) + Number(price)).toFixed(2)
            const arr = [...courseIds, channelId]
            const obj = this.handleKeys(arr.length)
            this.courseTOList = [...this.courseTOList, { nodeCode: nodeCode, courseId: channelId, courseType: 'channel'}]
            const lists = [...courseList, { id: channelId, title: title, price: price }]
            this.handleShappStore(lists)
            this.setState({
                courseIds: arr,
                courseList: lists,
                totalPrice: newPrice,
                ...obj
            })
        }
    }

    // 缓存购物车数据
    handleShappStore(lists) {
        localStorage.setItem(`shapping-${this.nodeCode}`, JSON.stringify(this.courseTOList))
        localStorage.setItem(`lists-${this.nodeCode}`, JSON.stringify(lists))
    }
    
    // 处理打折数据
    handleKeys(len) {
        const { discountObj, maxDisCount } = this.state;
        const keys = Object.keys(discountObj);
        let idx = 0;
        for(let i = 0; i < keys.length; i++) {
            if(keys[i] > len) {
                idx = i 
                break
            }
        }
        const prevIdx = (idx - 1) >= 0 ? idx - 1 : 0;
        const key = Number(maxDisCount.len) <= len ? maxDisCount.len : keys[prevIdx]
        const discount = discountObj[key]
        return { nextIdx: keys[idx], curDisCount: discount }
    }
    // 显示购物车
    showShapping() {
        const { courseIds } = this.state;
        if(!!courseIds.length) {
            this.setState({
                isSelectDialog: true
            })
        }
    }
    // 隐藏购物车
    hideSelect() {
        this.setState({
            isSelectDialog: false
        })
    }
    // 分享
    initShare() {
        const { activityObj } =this.state
        let params={wcl:'compose-activity',nodeCode:this.nodeCode}
        params.userId=getCookie('userId')
        let shareUrl = fillParams(params,`${location.origin}/wechat/page/compose-activity`,[])
        share({
            title: activityObj.keyE,
            timelineTitle: activityObj.keyE,
            desc: activityObj.keyF,
            timelineDesc: activityObj.keyF,
            imgUrl: activityObj.keyG || 'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            shareUrl: shareUrl
        });
        // app分享
        this.props.shareConfig({
            content: shareUrl,
            title: activityObj.keyE,
            desc: activityObj.keyF,
            thumbImage: activityObj.keyG,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        })
    }
    // 支付
    async pay() {  
        const { activityObj } = this.state
        const urlData = JSON.parse(sessionStorage.getItem('urlCampData') || '{}') 
        urlData.wcl='activity-zuhe'
        const url = fillParams(urlData,window.location.href)
        const params = { 
            source: (Detect.os.weixin && (Detect.os.ios||Detect.os.android))?'h5':'web',
            ch: url,
            url: '/api/wechat/transfer/baseApi/h5/pay/combineCourseOrder',
            activityCode: this.nodeCode,
            courseTOList: this.courseTOList
        }
        if(this.props.isQlchat){
            await this.props.handleAppSdkFun('resign', {  
                cardDate: '', 
                all: JSON.stringify(params),
                callback: (res) => {
                    this.handlePaySuccess();
                }
            }) 
        } else {
            window.loading(true)
            if(this.isLoading) return false
            this.isLoading = true
            try {
                await this.props.doPayForCard({
                    orderDto: params, 
                    callback:()=>{
                        window.toast("成功支付")
                        this.handlePaySuccess()
                    }, 
                    onCancel: () => {},
                    onPayFree:() => {
                        window.toast("成功支付")
                        setTimeout(() => {
                            locationTo(activityObj.keyJ)
                        }, 1000);
                    }
                })
            } catch (error) {}
        }
        window.loading(false)
        this.isLoading = false
    }
    // 处理支付成功跳转
    handlePaySuccess() {
        const { activityObj, buyMoney, totalPrice, curDisCount } = this.state
        const isShow = this.initStore();
        const price = (totalPrice * Number(curDisCount)).toFixed(2) || 0
        const flag = (Number(price) + Number(buyMoney)) >= Number(activityObj.keyH) 
        localStorage.removeItem(`shapping-${this.nodeCode}`)
        localStorage.removeItem(`lists-${this.nodeCode}`)
        const obj = this.handleKeys(0)
        this.courseTOList = []
        this.setState({
            courseIds: [],
            courseList: [],
            totalPrice: 0,
            isBuy: true,
            ...obj
        })
        if(flag && !isShow) {
            localStorage.setItem(`once${this.nodeCode}`, 'Y')
            this.setState({
                isQrCode: true
            })
        } else {
            if(!this.props.isQlchat) {
                window.toast('已成功购买，点击已购即可学习')
            }
        }
    }
    // 关闭
    close() {
        this.setState({
            isQrCode: false
        })
    }
    handleTabChange(index){
        if(index != this.state.currActiveNavIndex){
            this.section.scrollTo({
                left:0,
                top:this[`cp-model-item-${index}`].offsetTop - document.querySelector('.roll-down-box').offsetHeight,
                behavior: 'smooth'
            })
            this.setState({
                currActiveNavIndex:index,
            })
        }
    }
    scrollHandler(){
        const {modelList} = this.state
        const navBox = document.querySelector('.roll-down-box')
        const barrageBox = document.querySelector('.jion-page-barrages')
        if(!navBox){
            return null
        }
        const navHeight = navBox.offsetHeight
        this.section.addEventListener('scroll',() => {
            if(barrageBox){
                const navPos = navBox.getBoundingClientRect()
                if(navPos.y <= 5){
                    barrageBox.setAttribute('style',`top:${navHeight + 40}px;`)
                }else{
                    barrageBox.setAttribute('style',null)
                }
            }
        })
        const moveHandle = (e) => {
            for(let i = 0 ; i < modelList.length ; i++){
                const {y} = this[`cp-model-item-${i}`].getBoundingClientRect()
                if(y <= (navHeight + 100) && y > (-navHeight - 100)){
                    this.setState({
                        currActiveNavIndex:i
                    })
                    break;
                }
            }
        }
        this.section.addEventListener('touchmove',moveHandle ,false)
        this.section.addEventListener('mousewheel',moveHandle ,false)
    }

    render(){
        const { activityObj, courseObj, modelList, totalPrice, courseIds, status, isSelectDialog, courseList, 
            isBuy, maxDisCount, curDisCount, nextIdx, discountObj, isQrCode, buyMoney,currActiveNavIndex } = this.state
        return (
            <Page title={ activityObj.title } className="cp-activity-box" >
                <section ref={r => this.section = r} className="scroll-content-container on-visible" 
                    data-log-name={ activityObj.title  }
                    data-log-region="cp-activity-box"
                    data-log-pos="1" 
                    style={{ background: activityObj.keyD }}>
                    { !!activityObj.keyA && <ImgComp url={ activityObj.keyA || '#EB2D14' } /> }
                    {activityObj.keyM === 'Y' && <TagNav tagNavList={ this.state.tagNavList } changeTag={this.handleTabChange} tagIdx={currActiveNavIndex} listStyle={{backgroundColor:activityObj.keyN || '#781616'}} pStyle={{backgroundColor:activityObj.keyO || '#e97a3c'}}/>}
                    { modelList.map((item, index) => {
                        const lists = courseObj[item.nodeCode] || []
                        return (
                            <div ref={(r) => {this[`cp-model-item-${index}`] = r}} id={`cp-model-item-${index}`} className="cp-model-item" key={ index }>
                                { item.keyA && <ImgComp url={ item.keyA } /> }
                                { lists.map((course, index) => (
                                    <CourseItem 
                                        key={ index } 
                                        ti={ activityObj.keyC } 
                                        nodeCode={ item.nodeCode }
                                        courseIds={ courseIds } 
                                        maxDisCount={ maxDisCount } 
                                        onSelect={ this.onSelect } 
                                        {...course} />
                                )) }
                            </div>
                        )
                    }) }
                    { !!activityObj.keyB && <ImgComp url={ activityObj.keyB } /> }
                </section>     
                {activityObj.id && <Barrage activityId={activityObj.id}/>}
                <BuyBtn 
                    pay={ this.pay }
                    courseIds={ courseIds } 
                    status={ status } 
                    courseList={ courseList } 
                    totalPrice={ totalPrice } 
                    showShapping={ this.showShapping } 
                    curDisCount={ curDisCount } />
                { Object.is(status, 'ing') && (
                    <CountComp 
                        courseIds={ courseIds } 
                        maxDisCount={ maxDisCount } 
                        nextIdx={ nextIdx } 
                        discountObj={ discountObj } 
                        nodeCode={ this.nodeCode } />
                ) }
                { ((!!buyMoney && buyMoney != 0 )|| isBuy) && <Purchased isQlchat={ this.props.isQlchat } className={ !Object.is(status, 'ing') ? 'btm' : '' } /> }
                { isSelectDialog && (
                    <SelectedDialog 
                        courseList={ courseList } 
                        hideSelect={ this.hideSelect } 
                        curDisCount={ curDisCount }
                        removeSelect={ this.onSelect } />
                ) }
                { isQrCode && <Ercode linkUrl={ activityObj.keyJ } close={ this.close } url={ activityObj.keyI } /> }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    userBindKaiFang,
    doPayForCard
};

module.exports = connect(mapStateToProps, mapActionToProps)(ComposeActivity);