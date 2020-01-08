import React, { Component } from 'react';
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import Page from 'components/page'
import { formatDate, locationTo, getVal } from 'components/util'
import { autobind, throttle } from 'core-decorators';
import Switch from 'components/switch';
import CodeItems from './components/code-items'
import ScrollToLoad from 'components/scrollToLoad';
import { BottomDialog, Confirm } from 'components/dialog';

import {
    getCouponList,
    setIsShowIntro,
    switchChannelCoupon,
    getIsShowIntro,
    getCouponStatus,
    setCouponShareStatus,
    isStaticCouponOpen,
    deleteUniversalCoupon,
    getCouponCount
} from '../../../actions/coupon';

@autobind
class CodeList extends Component {
    state = {
        // 优惠券列表
        couponList:[],
        showCode: false,
        noData: false,
        noMore: false,
        backBtnTitle:'返回',
        infoBarText:'',
        showCodeRoad: false,

        isStaticCouponOpen: false,

        actionSheetShow: false,
        actionSheetItems: [],

        isFixSelectCoupon: false,
        backTopShow: false,
        
        isOverdueStatus: 'N', // 是否过期
        orderBy: 'createTime', // 排序字段
        sort: 'DESC',
    }
    data = {
        page : 1,
        size : 20,
        cacheCouponList: {},
    }

    get liveId () {
        
    }

    get businessType () {
        if (this.props.params.type == 'vip') {
            return 'global-vip'
        } else {
            return this.props.params.type
        }
    }

    componentDidMount() {
        if (this.refs.scrollBox) {            
            this.scrollEl = findDOMNode(this.refs.scrollBox)
        }

        this.getCouponList();
        this.initCouponCount();
        this.initInfo();
        this.getIsShowIntro();
        this.getCouponStatus();
        this.isStaticCouponOpen();
    }

    isStaticCouponOpen = async () => {
        if (this.businessType == "topic") {
            let result = await this.props.isStaticCouponOpen({
                topicId: this.props.params.id
            })
            if (result.state.code == 0) {
                this.setState({
                    isStaticCouponOpen: result.data.status == 'Y' ? true : false
                })
            }
        }
    }

    initInfo() {
        let backBtnTitle = '';
        let infoBarText = '';
        switch (this.businessType) {
            case 'topic':
                backBtnTitle = '返回到直播介绍页';
                infoBarText = '获得优惠码的用户可享受本次付费话题优惠';
                break;
            case 'channel':
                backBtnTitle = '返回到系列课主页';
                infoBarText = '获得优惠码的用户可享受本次付费系列课优惠';
                break;
            case 'camp':
                backBtnTitle = '返回打卡主页';
                infoBarText = '获得优惠码的用户可享受本次付费打卡课优惠';
                break;
            case 'global-vip':
                backBtnTitle = '返回到直播间VIP服务';
                infoBarText = '获得优惠码的用户可享受本次付费直播间VIP优惠';

                break;
        }
        this.setState({
            // backBtnTitle,
            infoBarText
        })
    }

    getCacheCouponList () {
        const {
            isOverdueStatus, // 是否过期
            orderBy, // 排序字段
            sort
        } = this.state
        
        const {
            page,
            size,
            cacheCouponList
        } = this.data
        
        cacheCouponList[isOverdueStatus] || (cacheCouponList[isOverdueStatus] = {})
        cacheCouponList[isOverdueStatus][orderBy] || (cacheCouponList[isOverdueStatus][orderBy] = {})

        return cacheCouponList[isOverdueStatus][orderBy][sort] && cacheCouponList[isOverdueStatus][orderBy][sort].slice((page - 1) * size, page * size)
    }
    
    // 获取优惠券列表
    async getCouponList() {
        let couponList = this.getCacheCouponList()
        const {
            page,
            size
        } = this.data
        const {
            isOverdueStatus, // 是否过期
            orderBy, // 排序字段
            sort
        } = this.state

        if (!couponList || (page !== 1 && couponList.length === 0)) {
            if (!couponList) {
                this.data.cacheCouponList[isOverdueStatus][orderBy][sort] = []
            }
            let params = {
                liveId:this.props.power.liveId,
                businessId:this.props.params.id,
                businessType:this.businessType.replace('\-','_'), //因为后端的global_vip是下划线，前端地址global-vip都是中划线
                page: {
                    page: this.data.page,
                    size: this.data.size,
                }
            }
            if (this.businessType !== 'global-vip') {
                params = {
                    ...params,
                    overdueStatus: this.state.isOverdueStatus, // 是否过期
                    orderBy: this.state.orderBy, // 排序字段
                    sort: this.state.sort,
                }
            }
            couponList = await this.props.getCouponList(params);
            this.data.cacheCouponList[isOverdueStatus][orderBy][sort].push(...(couponList || []))
        }
        
        couponList = couponList || []
        const state = {
            couponList: page === 1 ? [...couponList] : [...this.state.couponList, ...couponList],
            isNoMore: couponList.length < size,
            noData: page === 1 && couponList.length === 0,
        }

        this.setState(state)
        return couponList;


    }

    async initCouponCount () {
        const couponCount = await this.props.getCouponCount({
            liveId:this.props.power.liveId,
            businessId:this.props.params.id,
            businessType:this.businessType.replace('\-','_'), //因为后端的global_vip是下划线，前端地址global-vip都是中划线
        })

        this.setState({
            couponCount
        })
    }

    // 设置优惠码是否显示在介绍页
    setIsShowIntro = (couponId, isShowIntro = 'Y') => {
        this.props.setIsShowIntro({
            couponId: couponId,
            businessId: this.props.params.id,
            businessType: this.businessType,
            liveId: this.props.power.liveId,
            isShowIntro
        }).then(res => {
            if (res.state.code == 0) {
                window.toast('设置成功')
            } else {
                window.toast('设置失败')
            }
            this.hideHelperHandle()
        }).catch(err => {
            console.error(err);
        })
    }

    getIsShowIntro = async (businessId = this.props.params.id, liveId = this.props.power.liveId) => {
        let result = await this.props.getIsShowIntro({
            businessId,
            liveId
        })
        this.setState({
            showCode: result.data.status == 'Y' ? true : false,
            selectedCouponId: result.data.couponId
        })
    }

    async loadNext(next) {
        this.data.page++;
        await this.getCouponList();
        next && next()
    }

    getCouponStatus = async () => {
        let result = await this.props.getCouponStatus({
            type: this.businessType.replace('\-','_'),//因为后端的global_vip是下划线，前端地址global-vip都是中划线
            businessId: this.props.params.id
        })
        if (result.state.code == 0) {
            this.setState({
                showCodeRoad: result.data.isCouponOpen == 'Y' ? true : false
            })
        }
    }

    changeShowCode() {
        let { showCode } = this.state;
        if (showCode) {
            if (this.state.selectedCouponId) {
                this.setIsShowIntro(this.state.selectedCouponId, 'N');
                this.setState({
                    showCode:!this.state.showCode
                })
            }
        } else {
            let {couponList} = this.state;
            let coupon = couponList.filter(item => (item.overTime >= this.props.sysTime || item.overTime == null) && (item.useNum < item.codeNum || !item.codeNum ));
            coupon = coupon.length > 0 ? coupon[0] : {id: null};
            if (coupon.id) {
                this.setIsShowIntro(coupon.id, 'Y');
                this.setState({
                    selectedCouponId: coupon.id
                })
                this.setState({
                    showCode:!this.state.showCode
                })
            }
        }
    }

    backLink(){
        let url = '';
        switch (this.businessType) {
            case 'topic':
                url = `/wechat/page/topic-intro?topicId=${this.props.params.id}`;
                break;
            case 'channel':
                url = `/wechat/page/channel-intro?channelId=${this.props.params.id}`;
                break;
            case 'camp':
                url = `/wechat/page/camp-detail?campId=${this.props.params.id}`;
                break;
            case 'global-vip':
                url = `/wechat/page/live-vip-details?liveId=${this.props.params.id}`;

                break;
        }
        locationTo(url);

    }

    addLink(){
        let url = '';
        switch (this.businessType) {
            case 'topic':
                url = `/wechat/page/coupon-create/topic/${this.props.params.id}`;
                break;
            case 'channel':
                url = `/wechat/page/coupon-create/channel/${this.props.params.id}`;
                break;
            case 'camp':
                url = `/wechat/page/coupon-create/camp/${this.props.params.id}`;
                break;
            case 'global-vip':
                url = `/wechat/page/coupon-create/vip/${this.props.params.id}`;

                break;
        }
        locationTo(url);

    }

    selectCouponId = (type) => {
        if(type=="cancel")return
        let id =this.state.couponId 
        let { couponList } = this.state;
        let selectedCoupon = couponList.find(item => item.id == id);
        if (selectedCoupon.overTime && selectedCoupon.overTime < this.props.sysTime) {
            return ;
        }
        this.setState({
            selectedCouponId: id
        })
        this.setIsShowIntro(
            id,
            'Y',
        )
    }
    unselectCouponId = (e) => { 
        let id =e.currentTarget.dataset.id 
        let { couponList } = this.state;
        let selectedCoupon = couponList.find(item => item.id == id);
        if (selectedCoupon.overTime && selectedCoupon.overTime < this.props.sysTime) {
            return ;
        }
        this.setState({
            selectedCouponId: ""
        })
        this.setIsShowIntro(
            id,
            'N',
        )
    }
    deleteCouponId = async (type) => {
        if(type=="cancel")return

        const {couponId, selectedCouponId, couponList} = this.state

        const res = await this.props.deleteUniversalCoupon({
            liveId: this.props.power.liveId,
            couponIdList: [couponId]
        })
        if (res && res.data && res.data.list && res.data.list.length == 0) {
            window.toast('删除成功')
            const _couponList = couponList.filter(item => item.id != couponId)
            this.data.cacheCouponList = {} // 清空缓存
            this.setState({
                selectedCouponId: couponId !== selectedCouponId && selectedCouponId || '',
                couponList: _couponList,
                noData: _couponList.length === 0,
            }, () => {
                // 删除后 重新获取优惠券列表总数
                this.initCouponCount()
            })
            this.hideHelperHandle()
        } else {
            window.toast('删除失败')
        }
    }

    selectShareCouponId = (e) => {
        let id = e.currentTarget.dataset.id;
        let { couponList } = this.state;
        let selectedCoupon = couponList.find(item => item.id == id);
        if (selectedCoupon.overTime && selectedCoupon.overTime < this.props.sysTime) {
            return ;
        }
        this.setState({
            selectedCouponId: id
        })
        this.setIsShowIntro(
            id,
            'Y',
        )
    }
    
    showDeleteHandle = (e) => {
        let id = e.currentTarget.dataset.id;
        let { couponList } = this.state;
        let selectedCoupon = couponList.find(item => item.id == id);

        // 有人领取 && (永久有效 | 未过期)
        if (selectedCoupon.useNum > 0 && (!selectedCoupon.overTime || selectedCoupon.overTime > this.props.sysTime)) {
            window.toast('目前该优惠券尚未过期且已有用户领取，不可被删除')
            return
        }

        this.setState({
            couponId: id,
            isCouponReceive: selectedCoupon.useNum > 0
        }) 

        this.deleteConfirm.show()
    }
    showHelperHandle = (e) => {
        this.setState({
            couponId: e.currentTarget.dataset.id
        }) 
        this.helpConfirm.show()
    }
    showIArrowHandle= (e) => {
        this.setState({
            couponId: e.currentTarget.dataset.id
        }) 
        this.arrowConfirm.show()
    }
     // 是否允许课代表分享优惠券
     showInArrowHandle= async (type) => {
        
        if(type=="cancel")return
        let {couponId}=this.state
        let dataList = this.state.couponList 
        
        const result = await this.props.setCouponShareStatus({
            couponId: couponId,
            shareStatus: "Y"
        })


        if(result && result.state && result.state.code === 0 ) {
            dataList.map((item) => {
                if(item.id == couponId) {
                    item.shareStatus = "Y"
                }
            })
            this.setState({
                couponList: dataList
            })
            this.hideHelperHandle()
            window.toast("操作成功")
        } else {
            window.toast(result.state.msg || "操作失败，请稍后再试")
        } 
    }
    hideInArrowHandle= async (e) => {
        let couponId=  e.currentTarget.dataset.id
        let dataList = this.state.couponList 

        const result = await this.props.setCouponShareStatus({
            couponId:  couponId,
            shareStatus: "N"
        })


        dataList.map((item) => {
            if(item.id == couponId) {
                item.shareStatus = "N"
            } 
        })
        this.setState({
            couponList: dataList
        })
    }
    hideHelperHandle = () => {
        this.arrowConfirm.hide() 
        this.helpConfirm.hide()
        this.deleteConfirm.hide()
    }

    changeShowCodeRoad = async () => {
        let { showCodeRoad } = this.state;
        let result = await this.props.switchChannelCoupon({
            type: this.businessType.replace('\-','_'),//因为后端的global_vip是下划线，前端地址global-vip都是中划线
            businessId: this.props.params.id,
            status: showCodeRoad ? 'N' : 'Y'
        })
        if (result.state.code == 0) {
            this.setState({
                showCodeRoad: !showCodeRoad
            })
        }
    }

    toSearch () {
        this.props.router.push(`/wechat/page/coupon-code/search/${this.businessType}/${this.props.params.id}`)
    }

    showActionSheet (type) {
        let actionSheetItems = []
        if (type === 'type1') {
            actionSheetItems = [
                {
                    key: 'overdueStatus-N',
                    content: '未过期',
                    show: true,
                },
                {
                    key: 'overdueStatus-Y',
                    content: '已过期',
                    show: true,
                },
            ]
        } else if (type === 'type2') {
            actionSheetItems = [ 
                {
                    key: 'createTime-DESC',
                    content: '按创建时间降序',
                    show: true,
                },
                {
                    key: 'createTime-ASC',
                    content: '按创建时间升序',
                    show: true,
                },
                {
                    key: 'money-DESC',
                    content: '按价格降序',
                    show: true,
                },
                {
                    key: 'money-ASC',
                    content: '按价格升序',
                    show: true,
                },
            ]
        }

        this.setState({
            actionSheetShow: true,
            actionSheetItems
        })
    }

    hideActionSheet () {
        this.setState({
            actionSheetShow: false
        })
    }

    confimActionSheet (key) {
        const [type, order] = key.split('-')
        let state = {}
        if (type === 'overdueStatus') {
            this.setState({
                isOverdueStatus: order
            })
        } else {
            state = {
                orderBy: type,
                sort: order
            }
        }
        this.data.page = 1
        this.hideActionSheet()
        this.setState(state, () => {
            // 优惠券总数为0
            if (this.state.couponCount === undefined || this.state.couponCount > 0) {
                this.getCouponList()
            }
        })
    }
    
    updateShow(value) {
        if (value === this.state.backTopShow) {
            return false;
        }
        this.setState({
            backTopShow: value
        })
    }
    
    // 滚动事件
    @throttle(300)
    scrollToDo(e){
        if(!this.state.isFixSelectCoupon && this.refs.scrollBox.scrollTop >= (this.selectCouponItem.offsetTop + this.headrbar.clientHeight)){
            this.setState({ isFixSelectCoupon: true })
        }else if(this.state.isFixSelectCoupon && this.refs.scrollBox.scrollTop < (this.selectCouponItem.offsetTop + this.headrbar.clientHeight)){
            this.setState({ isFixSelectCoupon: false })
        }
        
        if (this.scrollEl) {
            // 超过一屏显示 返回顶部按钮
            if (this.scrollEl.scrollTop > this.scrollEl.clientHeight) {
                this.updateShow(true)
            } else {
                this.updateShow(false)
            }
        }
    }
    
    toDailyBtnTapHandle() {
        this.refs.scrollBox.scrollContainer.scrollTop = 0;
    }

    // 保留直播间vip 使用旧样式
    renderLiveVip = () => {
        return (
            <Page title={'优惠码'} className='coupon-code-list-page flex-body'>
                <Confirm
                    ref={ref => this.helpConfirm = ref}
                    title="确定选择这张吗?"
                    onBtnClick={this.selectCouponId}
                    confirmText='确定'
                    cancelText="取消"
                    className="helper"
                >
                    <div>介绍页只支持显示一张优惠券，请老师择优选择</div>
                </Confirm>
                <Confirm
                    ref={ref => this.arrowConfirm = ref}
                    title=""
                    onBtnClick={this.showInArrowHandle}
                    confirmText='确定'
                    cancelText="取消"
                    className="helper"
                >
                    <div style={{paddingTop:'30px'}}>
                        <p>（1）勾选后，该优惠券可被课代表分享传播；   </p>
                        <p>（2）课代表转发该优惠券，好友领取并购买课程，课代表可获得分成；  </p> 
                        <p>（3）课代表包括：直播间课代表、课程授权课代表、自动分销课代表 </p> 
                    </div>
                </Confirm>
                <div className="flex-other header">
                    <span className="btn-back icon_back on-log" 
                        data-log-region="coupon-code"
                        data-log-pos="back"
                    onClick={this.backLink} >{this.state.backBtnTitle}</span>
                </div>    
                <div className="flex-main-h">
                    <ScrollToLoad
                        className={"coupon-scroll-box"}
                        toBottomHeight={300}
                        noneOne={this.state.noData}
                        loadNext={ this.loadNext }
                        noMore={this.state.isNoMore}
                    >
                        <div className="info-bar">{this.state.infoBarText}</div>
                        <ul className="control-box">
                            <li>
                                <div className="flex-box">
                                    <div className="label">显示优惠码通道</div>
                                </div>
                                <div className="other-box">
                                    <Switch
                                        className = "show-code-switch on-log"
                                        size = 'md'
                                        active={this.state.showCodeRoad}
                                        onChange={this.changeShowCodeRoad}
                                        dataLog={{
                                            region: 'coupon-code',
                                            pos: this.state.showCodeRoad ? 'dispaly-tunnel-true': 'dispaly-tunnel-false'
                                        }}
                                    />
                                </div>
                            </li>
                            <div className="info">关闭显示优惠码通道，则{this.businessType == 'channel'?'系列课首页':'vip页面'}优惠码入口会对听众隐藏。</div>
                        </ul> 

                        {/* 优惠码列表 */}
                        <CodeItems
                            couponList = {this.state.couponList}
                            showCouponCode={this.state.showCode}
                            selectedCouponId={this.state.selectedCouponId}
                            selectCouponId={this.selectCouponId}
                            unselectCouponId={this.unselectCouponId}
                            selectShareCouponId={this.selectShareCouponId} 
                            type={this.props.params.type}
                            showIArrowHandle={this.showIArrowHandle}
                            hideInArrowHandle={this.hideInArrowHandle}
                            showHelperHandle={this.showHelperHandle}
                            hideHelperHandle={this.hideHelperHandle}
                        />

                    </ScrollToLoad>    
                    
                </div>
                <div className="flex-other">
                    {/* <div className="btn-add-coupon-wrap">
                        <div className="btn-add-coupon" onClick={this.addLink}>
                            <div className="icon-plus_RE"></div>
                        添加优惠码</div>
                    </div> */}
                    <img className="btn-bottom on-log" 
                        data-log-region="coupon-code"
                        data-log-pos="add"
                        onClick={this.addLink}
                    src={require('./img/btn-bottom.png')} />
                </div>
            </Page>
        );
    }

    get currCouponObj () {
        const {
            selectedCouponId,
            couponList
        } = this.state

        // 如果有选中优惠券
        if (selectedCouponId) {
            // 删除缓存后则从当前列表中取
            const coupon = this.data.cacheCouponList['N'] ? 
                this.data.cacheCouponList['N']['createTime']['DESC'].find(coupon => coupon.id == this.state.selectedCouponId)
                :
                couponList.find(coupon => coupon.id == this.state.selectedCouponId)
            // 该优惠券未过期
            if (!coupon || (coupon.overTime && coupon.overTime < this.props.sysTime)) return false
            return coupon
        }

        return false
    }

    get pageTitle() {
        let title = '';
        switch (this.businessType) {
            case 'channel':
                return  `系列课优惠券《${this.props.channelInfo.name}》`;
            case 'topic':
                return  `话题优惠券《${this.props.topicInfo.topic}》`;
            case 'camp':
                return  `打卡优惠券《${this.props.campInfo.name}》`;
        }
    }

    // 系列课 和 话题 使用新的样式
    render() {
        if (this.businessType === 'global-vip') {
            return this.renderLiveVip()
        }

        const currCouponObj = this.currCouponObj
        // 优惠券（含过期）不为空 且未过期列表为空
        const isCouponAllOver = this.state.isOverdueStatus === 'N' && this.state.couponCount > 0 && this.state.couponList.length === 0

        // 总数大于 0 & 当前筛选条件为 已过期 & 数据为空
        const isDisable = this.state.couponCount > 0 && this.state.isOverdueStatus === 'Y' && this.state.noData

        return (
            <Page title={this.pageTitle} className='coupon-code-list-page flex-body'>
                <Confirm
                    ref={ref => this.helpConfirm = ref}
                    title="确定选择这张吗?"
                    onBtnClick={this.selectCouponId}
                    confirmText='确定'
                    cancelText="取消"
                    className="helper"
                >
                    <div>介绍页只支持显示一张优惠券，请老师择优选择</div>
                    
                </Confirm>
                <Confirm
                    ref={ref => this.deleteConfirm = ref}
                    title={!this.state.isCouponReceive ? '确定删除优惠券吗？' : '删除后在学员端上对应的优惠券也一并删除，不可恢复。确定删除吗?'}
                    onBtnClick={this.deleteCouponId}
                    confirmText='确定'
                    cancelText="取消"
                    className="helper"
                >
                </Confirm>
                <Confirm
                    ref={ref => this.arrowConfirm = ref}
                    title=""
                    onBtnClick={this.showInArrowHandle}
                    confirmText='确定'
                    cancelText="取消"
                    className="helper"
                >
                    <div style={{paddingTop:'30px'}}>
                        <p>（1）勾选后，该优惠券可被课代表分享传播；   </p>
                        <p>（2）课代表转发该优惠券，好友领取并购买课程，课代表可获得分成；  </p> 
                        <p>（3）课代表包括：直播间课代表、课程授权课代表、自动分销课代表 </p> 
                    </div>
                    
                </Confirm>
                
                <div className="flex-other header" ref={el => this.headrbar = el}>
                    <span className="btn-back icon_back on-log" 
                        data-log-region="coupon-code"
                        data-log-pos="back"
                    onClick={this.backLink} >{this.state.backBtnTitle}</span>

                    <span className="search-btn icon-search" onClick={this.toSearch}></span>

                    
                    {
                        this.state.isFixSelectCoupon && (
                            <div className="control-box fixed-coupon">
                                <li>
                                    <div className="flex-box">
                                        <div className="label">当前优惠券显示在介绍页</div>
                                    </div>
                                    {
                                        !currCouponObj && 
                                        <div className="other-box">
                                            <p className="gray">当前还没有选择优惠券</p>
                                        </div>
                                    }
                                </li>
                                {
                                    currCouponObj &&  <SelectCoupon item={currCouponObj} type={this.businessType} />
                                }
                            </div>
                        )
                    }
                </div>
                <div className="flex-main-h">
                    <ScrollToLoad
                        ref="scrollBox"
                        className={"coupon-scroll-box"}
                        toBottomHeight={300}
                        noneOne={this.state.noData && !(this.state.couponCount > 0)}
                        loadNext={ this.loadNext }
                        scrollToDo = {this.scrollToDo}
                        emptyMessage="你还没有优惠券，先创建一个吧"
                        disable={isDisable}
                        noMore={!this.state.noData && this.state.isNoMore}
                    >
                        <ul className="control-box">
                            {
                                (/(topic)/.test(this.businessType))?
                                <li className="fix-coupon">
                                    <div className="other-box"><span className="label">固定优惠码</span></div>
                                    <div className="flex-box"><span className="btn-goto-static on-log" data-log-region="coupon-code" data-log-pos="static-code" onClick={()=>{ locationTo(`/wechat/page/static-coupon/${this.props.params.id}`)}}>{this.state.isStaticCouponOpen ? '已开启' : '已关闭'}<i className='icon_enter'></i></span></div>
                                </li>
                                :null       
                            }    
                            {
                                (/(channel|global\-vip)/.test(this.businessType))?
                                <React.Fragment>
                                    <li>
                                        <div className="flex-box">
                                            <div className="label">显示优惠码通道</div>
                                        </div>
                                        <div className="other-box">
                                            <Switch
                                                className = "show-code-switch on-log"
                                                size = 'md'
                                                active={this.state.showCodeRoad}
                                                onChange={this.changeShowCodeRoad}
                                                dataLog={{
                                                    region: 'coupon-code',
                                                    pos: this.state.showCodeRoad ? 'dispaly-tunnel-true': 'dispaly-tunnel-false'
                                                }}
                                            />
                                        </div>
                                    </li>
                                    <div className="info">关闭显示优惠码通道，则系列课首页优惠码入口会对听众隐藏。</div>
                                </React.Fragment>
                                :null    
                            }    
                            
                            <li ref={el => this.selectCouponItem = el}>
                                <div className="flex-box">
                                    <div className="label">当前优惠券显示在介绍页</div>
                                </div>
                                {
                                    !currCouponObj && 
                                    <div className="other-box">
                                        <p className="gray">当前还没有选择优惠券</p>
                                    </div>
                                }
                            </li>
                            {
                                currCouponObj &&  <SelectCoupon item={currCouponObj} type={this.businessType} />
                            }
                            
                        </ul> 

                        <div className="coupon-list-title">
                            <div className="title">
                                <p>优惠券列表</p>
                            </div>
                            <div className="order-btn">
                                <p onClick={() => { this.showActionSheet('type1') }}>{this.state.isOverdueStatus === 'N' ? '未过期' : '已过期'}<i className="icon-enter"></i></p>
                                <p onClick={() => { this.showActionSheet('type2') }}>按{this.state.orderBy === 'createTime' ? `创建时间` : '价格'}{this.state.sort === 'ASC' ? '升序' : '降序'}<i className="icon-enter"></i></p>
                            </div>
                        </div>

                        { isCouponAllOver && <p className="coupon-over-all">您的优惠券全已过期，点击底部添加新的优惠券吧</p> }

                        {/* 优惠码列表 */}
                        <CodeItems
                            couponList = {this.state.couponList}
                            showCouponCode={this.state.showCode}
                            selectedCouponId={this.state.selectedCouponId}
                            selectCouponId={this.selectCouponId}
                            unselectCouponId={this.unselectCouponId}
                            deleteCouponId={this.showDeleteHandle}
                            selectShareCouponId={this.selectShareCouponId} 
                            type={this.props.params.type}
                            showIArrowHandle={this.showIArrowHandle}
                            hideInArrowHandle={this.hideInArrowHandle}
                            showHelperHandle={this.showHelperHandle}
                            hideHelperHandle={this.hideHelperHandle}
                            
                            
                        />

                    </ScrollToLoad>
                    
                    {
                        this.state.backTopShow &&
                        <div className="to-daily-btn" onClick={this.toDailyBtnTapHandle}></div>
                    }
                    
                </div>
                <div className="flex-other">
                    {/* <div className="btn-add-coupon-wrap">
                        <div className="btn-add-coupon" onClick={this.addLink}>
                            <div className="icon-plus_RE"></div>
                        添加优惠码</div>
                    </div> */}
                    <img className="btn-bottom on-log" 
                        data-log-region="coupon-code"
                        data-log-pos="add"
                        onClick={this.addLink}
                    src={require('./img/btn-bottom.png')} />
                </div>
                
                <BottomDialog
                    show={this.state.actionSheetShow}
                    theme={ 'list' }
                    items={this.state.actionSheetItems}
                    close={ true }
                    onClose={this.hideActionSheet}
                    onItemClick={this.confimActionSheet}
                />
            </Page>
        );
    }
}

CodeList.propTypes = {
    
};

function mstp(state) {
    return {
        power: getVal(state, 'coupon.power', {}),
        sysTime: state.common.sysTime,
        channelInfo: getVal(state, 'coupon.channel.channelInfo', {}),
        topicInfo: getVal(state, 'coupon.topic.topicInfo.topicPo', {}),
        campInfo: getVal(state, 'coupon.camp.campInfo.liveCamp', {}),
    }
}

const matp = {
    getCouponList,
    setIsShowIntro,
    switchChannelCoupon,
    getIsShowIntro,
    getCouponStatus,
    setCouponShareStatus,
    isStaticCouponOpen,
    deleteUniversalCoupon,
    getCouponCount
}

export default connect(mstp, matp)(CodeList);

@autobind
class SelectCoupon extends Component {
    
    isShowShareBtn = (item) => {
        if (item.overTime && item.overTime < Date.now()) {
            return false
        }
        if (item.codeNum !== null && item.useNum == item.codeNum) {
            return false
        }
        return true;
    }

    gotoshare = (item) => {
        let url = '';
        switch (this.props.type) {
            case 'topic':
                url = `/wechat/page/send-coupon/topic-batch?topicId=${item.belongId}&codeId=${item.id}&liveId=${item.liveId}`;
                break;
            case 'channel':
                url = `/wechat/page/send-coupon/channel-batch?channelId=${item.belongId}&codeId=${item.id}&liveId=${item.liveId}`;
                break;
            case 'camp':
                url = `/wechat/page/send-coupon/camp-batch?campId=${item.belongId}&codeId=${item.id}&liveId=${item.liveId}`;
                break;
            case 'global-vip':
                url = `/wechat/page/send-coupon/vip-batch?liveId=${item.liveId}&codeId=${item.id}`;

                break;
        }
        location.href = url;
    }

    render () {
        const {item} = this.props
        return (
            <div className="select-coupon">
                <div className="coupon-info">
                    <div className="money">
                        <p><span className="unit">¥</span><span className="content">{item.money}</span></p>
                        
                        <div className="operate-box code-item-flex">
                            {
                                this.isShowShareBtn(item) ?
                                <div className={"share-btn"} onClick={() => {
                                    this.gotoshare(item);
                                }}>
                                            
                                <svg height="100%" width="100%" version="1.1" viewBox="0 0 136 60">
                                    <defs/>
                                    <g id="Page-1" fill="none" stroke="none" strokeWidth="1">
                                        <g id="系列" transform="translate(-555.000000, -800.000000)">
                                            <g id="Group-8" transform="translate(555.000000, 800.000000)">
                                                <g id="Group-14">
                                                    <g id="分享系列-copy" transform="translate(20.000000, 12.000000)"/>
                                                    <g id="分享系列" transform="translate(20.000000, 12.000000)"/>
                                                    <rect height="60" id="Rectangle-7" width="136" fill="#F63556" rx="30" x="0" y="2.27373675e-13"/>
                                                    <rect height="36" id="Rectangle-2" width="36" x="20" y="12"/>
                                                    <path id="Rectangle" d="M52,30.7744502 L52,40 C52,42.209139 50.209139,44 48,44 L28,44 C25.790861,44 24,42.209139 24,40 L24,20 C24,17.790861 25.790861,16 28,16 L34.3876825,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                    <path id="Path-2" d="M46,16 L52.0373881,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                    <path id="Path-2" d="M52,16 L52,22.0373881" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                    <path id="Path-3" d="M34,33.4676769 L50.4676769,17" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                    <rect height="36" id="Rectangle-2" width="36" x="20" y="12"/>
                                                    <path id="Rectangle" d="M52,30.7744502 L52,40 C52,42.209139 50.209139,44 48,44 L28,44 C25.790861,44 24,42.209139 24,40 L24,20 C24,17.790861 25.790861,16 28,16 L34.3876825,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                    <path id="Path-2" d="M46,16 L52.0373881,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                    <path id="Path-2" d="M52,16 L52,22.0373881" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                    <path id="Path-3" d="M34,33.4676769 L50.4676769,17" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                    <text id="分享" fill="#FFFFFF" fontFamily="PingFangSC-Medium, PingFang SC" fontSize="26">
                                                        <tspan x="62.0714282" y="40">分享</tspan>
                                                    </text>
                                                </g>
                                                <g id="Group-12"/>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                </div> : null
                            }
                        </div>
                    </div>
                    <div>
                        <p>
                            <span className="label">到期时间：</span>
                            <span className="content">{item.overTime ? formatDate(item.overTime, 'yyyy-MM-dd hh:mm:ss') : '永久有效'}</span>
                        </p>
                        <p>
                            <span className="label">数量：</span>
                            <span className="content">{(item.codeNum ? item.codeNum - item.useNum : '无限制' )+ '/' + (item.codeNum || '无限制')}</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}