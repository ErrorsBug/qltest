import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page'
import { locationTo, getVal } from 'components/util'
import { autobind } from 'core-decorators';
import CodeItems from './components/code-items'
import ScrollToLoad from 'components/scrollToLoad';
import Confirm from 'components/dialog/confirm';
import SearchBar from './components/search-bar';

import {
    getCouponList,
    setIsShowIntro,
    getIsShowIntro,
    getCouponStatus,
    setCouponShareStatus,
    deleteUniversalCoupon
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

        keyword: ''
    }
    data = {
        page : 1,
        size : 20
    }

    get businessType () {
        if (this.props.params.type == 'vip') {
            return 'global-vip'
        } else {
            return this.props.params.type
        }
    }

    componentDidMount() {
        this.getCouponList();
        this.getIsShowIntro();
    }
    
    // 获取优惠券列表
    async getCouponList(keyword = this.state.keyword) {
        let couponList = await this.props.getCouponList({
            liveId:this.props.power.liveId,
            businessId:this.props.params.id,
            businessType:this.businessType.replace('\-','_'), //因为后端的global_vip是下划线，前端地址global-vip都是中划线
            remark: keyword,
            orderBy: 'overTime',
            sort: 'DESC',
            page: {
                page: this.data.page,
                size: this.data.size,
            }
        });

        const {
            page,
            size
        } = this.data

        couponList = couponList || []
        this.setState({
            couponList: page === 1 ? [...couponList] : [...this.state.couponList, ...couponList],
            isNoMore: couponList.length < size,
            noData: page === 1 && couponList.length === 0,
        })
        return couponList;


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
                url = `/live/channel/channelPage/${this.props.params.id}.htm`;
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
           
            this.setState({
                selectedCouponId: couponId !== selectedCouponId && selectedCouponId || '',
                couponList: _couponList,
                noData: _couponList.length === 0,
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
        console.log(123123)
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
            case 'global-vip':
                url = `/wechat/page/send-coupon/vip-batch?liveId=${item.liveId}&codeId=${item.id}`;

                break;
        }
        location.href = url;
    }
    
    onKeywordChange(e) {
        this.setState({
            keyword: e.target.value,
        })
    }
    
    onInputKeyup(e) {
        /* 检测到按下回车键就开始搜索 */
        if (e.keyCode === 13) {
            this.doSearch()
            e.target.blur()
        }
    }
    
    clearInput() {
        this.setState({ keyword: '' })
    }
    
    
    currKeyword = ''
    async doSearch(keyword = this.state.keyword) {
        keyword = keyword.trim()

        if (keyword === this.currKeyword) return
        this.currKeyword = keyword
        this.data.page = 1
        this.getCouponList()
    }

    render() {

        return (
            <Page title={'优惠码'} className='coupon-code-list-page flex-body coupon-search'>
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
                    onBtnClick={this.deleteCouponId}
                    confirmText='确定'
                    cancelText="取消"
                    className="helper"
                >
                    <div className="del-tips">{!this.state.isCouponReceive ? '确定删除优惠券吗？' : '删除后在学员端上对应的优惠券也一并删除，不可恢复。确定删除吗?'}</div>
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
                <div className="flex-other">
                    <SearchBar
                        ref={el => this.searchEl = el}
                        keyword={this.state.keyword}
                        onChange={this.onKeywordChange}
                        onClear={this.clearInput}
                        doSearch={this.doSearch}
                        onKeyUp={this.onInputKeyup}
                        allEmpty={true} // 允许空搜索
                    />
                </div>    
                <div className="flex-main-h">
                    <ScrollToLoad
                        className={"coupon-scroll-box"}
                        toBottomHeight={300}
                        // noneOne={this.state.noData}
                        loadNext={ this.loadNext }
                        noMore={!this.state.noData && this.state.isNoMore}
                    >
                        
                        {/* 优惠码列表 */}
                        {
                            this.state.couponList.length > 0 && (
                                <React.Fragment>
                                    <p className="search-title">搜索结果</p>
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
                                </React.Fragment>
                            )
                        }

                        {
                            this.state.noData && (
                                <div className="no-data">
                                    <div className="icon-no-data"></div>
                                    <p className="tips">什么都没有哦，换个关键词试试吧~</p>
                                </div>
                            )
                        }

                    </ScrollToLoad>    
                </div>
            </Page>
        );
    }
}

CodeList.propTypes = {
    
};

function mstp(state) {
    return {
        power: getVal(state, 'coupon.power', {}),
        sysTime: state.common.sysTime
    }
}

const matp = {
    getCouponList,
    setIsShowIntro,
    getIsShowIntro,
    setCouponShareStatus,
    deleteUniversalCoupon
}

export default connect(mstp, matp)(CodeList);