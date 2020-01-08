import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import { locationTo, updatePageData, imgUrlFormat, formatDate, getVal } from 'components/util';
import { get } from 'lodash';
import ScrollToLoad from 'components/scrollToLoad';
import { autobind } from 'core-decorators';

import { share, appShare } from 'components/wx-utils';

import CouponItem from './components/coupon-item';
import QfuCoupon from './components/qfu-coupon';
import MyCoupon from './components/my-coupon';
import TyepItem from './components/type-item';
import CollectVisible from 'components/collect-visible';
import { isQlchat } from 'components/envi'

import {
    getCouponListV2,
    receiveCoupon,
    bindCoupon,
    getActCouponSingle,
    queryCouponListByType,
    receiveMediaCoupon
} from '../../actions/coupon'

import { isLiveAdmin } from 'common_actions/common'
import { fetchCategoryList } from 'common_actions/coupon'


function mapStateToProps(state) {
    return {
        sysTime: state.common.sysTime
    }
}

const mapDispatchToProps = {
    getCouponListV2,
    receiveCoupon,
    bindCoupon,
    getActCouponSingle,
    receiveMediaCoupon,
	queryCouponListByType,
    isLiveAdmin,
    fetchCategoryList,
};

@autobind
class CouponCenter extends Component {

    state = {
	    noMore: false,
        noData: false,
        //
        couponList: null,
        couponPage: 1,
        couponNoMore: false,

	    navType: 'await',

        isLiveAdmin: null,
        categoryList:[],
        couponCurrentId:'',

    };

    data = {
        pageSize: 20
    };

    constructor(props) {
        super(props)
    }

    componentWillMount(){
	    if(this.props.location.pathname.match('mine/coupon-list')){
    		this.setState({
			    navType: 'mine'
		    })
	    }
    }

    componentDidMount () {
        this.loadMoreCoupon();
        this.getIsLiveAdmin();
        this.getCategoryList();
	    this.listContainerRef.style.height = this.listContainerRef.clientHeight + 'px';
    }

    componentDidUpdate(prevProps){
    	if(prevProps.route.path !== this.props.route.path){
		    // 手动打PV
		    if(typeof _qla !== 'undefined'){
			    _qla('pv');
		    }
	    }
    }


    // 获取优惠券列表分类
    async getCategoryList() {
        let list = await this.props.fetchCategoryList();

        if (list) {
            this.setState({
                categoryList: list.filter(item => {
                    return item.parentId == '0'
                }),
            })
        }

    }

    async getIsLiveAdmin(){
	    if(this.props.location.query.liveId){
		    const liveAdminRes = await this.props.isLiveAdmin(this.props.location.query.liveId);
		    const isLiveAdmin = get(liveAdminRes, 'data.isLiveAdmin', 'N');
		    const liveLevel = get(liveAdminRes, 'data.liveLevel', '');
		    this.setState({
			    isLiveAdmin,
			    liveLevel,
		    })
	    }else{
	    	this.setState({
			    isLiveAdmin: 'N'
		    })
	    }
    }

	async loadMoreCoupon (next) {
        let {
            couponList,
            couponPage,
            couponNoMore
        } = this.state

        const { pageSize } = this.data
        let dataList = couponList || []

        if (!couponNoMore) {
            const result = await this.props.getCouponListV2({
                tagId:this.state.couponCurrentId,
                page: {
                    size: pageSize,
                    page: couponPage
                }
            }, couponPage === 1)

            const state = {
                couponList: dataList.concat(result || []),
                couponPage: couponPage + 1,
                couponNoMore: !result || result.length === 0
            }
            
            this.setState(state, () => {
                next && next()
            })
        }

    }

    changeTagLoad(id) {
        this.setState({
            couponCurrentId: id,
            couponPage: 1,
            couponNoMore: false,
            couponList:[],
        }, () => {
            this.loadMoreCoupon();
            
            setTimeout(() => {
                typeof _qla !== 'undefined' && _qla.collectVisible()
            }, 300)
        })
    }



    renderEmpty () {
        return (
            <div className="coupon-list-empty">
                <img src="//img.qlchat.com/qlLive/liveCommon/empty-page-no-coupon.png" alt=""/>
                <p className="desc">还没有领取优惠券哦</p>
            </div>
        )
    }

    collectVisibleList = () => {
		setTimeout(() => {
			typeof _qla !== 'undefined' && _qla.bindVisibleScroll({wrap: 'scroll-box'})
		}, 200)
	}

    renderCouponList () {
        const { couponList } = this.state

        if (!couponList || couponList.length === 0) {
            return this.renderEmpty()
        }

        return (
            <CollectVisible componentDidMount={this.collectVisibleList}>
            <ScrollToLoad
                className={`scroll-box`}
                toBottomHeight={500}
                loadNext={this.loadMoreCoupon}
                noMore={this.state.couponNoMore}
            >
                { !isQlchat() && <QfuCoupon  show = {this.state.couponCurrentId == ''} /> }
                {
                    couponList.map((item, index) => <CouponItem data={ item } 
                                                                index={ index } 
                                                                key={`coupon-list-item-${index}`} 
                                                                liveBindCoupon={ this.props.receiveCoupon } 
                                                                bindCoupon={ this.props.bindCoupon }
                                                                bindActivityCoupon={ this.props.getActCouponSingle }
                                                                bindReceiveCoupon={this.props.receiveMediaCoupon} 
                                                                />)
                }
            </ScrollToLoad>
            </CollectVisible>
        )

    }

    renderHolder (count) {
        const holderList = []
        for (let index = 0; index < count; index++) {
            holderList.push(
                <CouponItem index={ index } key={`coupon-list-item-${index}`} />
            )
        }
        return holderList
    }

	navChangeHandle(e){
        const navType = e.target.dataset.type;
        if(navType !== this.state.navType){
        	if(navType === 'mine'){
		        this.props.router.push('/wechat/page/mine/coupon-list');
	        }else{
		        this.props.router.push('/wechat/page/coupon-center');
	        }
            this.setState({
	            navType
            }, () => {
                setTimeout(() => {
                    typeof _qla !== 'undefined' && _qla.collectVisible()
                }, 300)
            });
        }
    }

	linkToAwait(){
		this.props.router.push('/wechat/page/coupon-center');
		this.setState({
			navType: 'await'
		});
	}

    render() {

        return (
            <Page title={this.state.navType === 'await' ? '领券中心' : '我的优惠券'} className='coupon-center-page-v2'>
	            {
		            this.state.isLiveAdmin && this.state.isLiveAdmin === 'N' &&
		            <div className="coupon-center-nav">
			            <div className={`nav-item${this.state.navType === 'await' ? ' current' : ''}`} onClick={this.navChangeHandle} data-type="await">待领优惠券</div>
			            <div className={`nav-item${this.state.navType === 'mine' ? ' current' : ''}`} onClick={this.navChangeHandle} data-type="mine">我的优惠券</div>
		            </div>
	            }
                <div className={`list-container${this.props.route.path.match('mine/coupon-list') ? ' pos-2' : ''}`}
                     ref={r => this.listContainerRef = r}
                >
                    <div className="list-container-col">
                        <TyepItem
                           dataList = {this.state.categoryList}
                           currentId = {this.state.couponCurrentId}
                           changeTagLoad = {this.changeTagLoad}
                        />
	                    {
		                    this.state.couponList ? this.renderCouponList() : this.renderHolder(6)
	                    }
                    </div>
                    <div className="list-container-col">
	                    {
	                    	// 获取到是否专业版再渲染我的优惠券
	                    	this.state.isLiveAdmin &&
		                    <MyCoupon
			                    linkToAwait={this.linkToAwait}
			                    isLiveAdmin={this.state.isLiveAdmin}
			                    liveLevel={this.state.liveLevel}
		                        liveId={this.props.location.query.liveId}
		                    />
	                    }
                    </div>
                </div>
            </Page>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CouponCenter);