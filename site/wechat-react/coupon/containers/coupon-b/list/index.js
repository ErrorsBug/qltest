import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import dayjs from 'dayjs'

import Page from 'components/page'
import { MiddleDialog } from 'components/dialog'
import Confirm from 'components/dialog/confirm'
import ScrollToLoad from 'components/scrollToLoad'
import { mul, locationTo, formatDate } from 'components/util'

import CouponItem from '../components/coupon-item'
import CreateForm from './components/create-form'

import {
    createCoupon,
    pushToCenter,
    setCouponShareStatus,
    getCouponList,
    deleteCoupon
} from '../../../actions/coupon'


@autobind
class CouponList extends Component {

    state = {
        modalVisible: false,
        datePickerVisible: false,
        isEdit: false,

        list: [],
        page: 1,
        size: 20,
        noMore: false,
        noneOne: false,

        money: '',
        minMoney: '',
        codeNum: '',
        overTime: null,
        remark: '',
        couponId:''
    }

    componentDidMount() {
        this.fetchList()
    }

    get liveId() {
        return this.props.router.params.liveId
    }

    get validForm() {
        const { money, minMoney, codeNum, overTime, remark } = this.state
        if (!money) {
            window.toast('请输入金额')
            return false
        }
        if (!/^\w+(\.\w{0,2})?$/.test(money)) {
            window.toast('请输入正确的金额')
            return false
        }
        if (parseFloat(money) > 50000 || parseFloat(money) <= 0) {
            window.toast('金额应小于50000并大于0')
            return false
        }
        if (codeNum && !/^[1-9]\w*$/.test(codeNum)) {
            window.toast('请输入正确的领取人数')
            return false
        }
        if (!codeNum) {
            window.toast('领取人数不能为空')
            return false
        }
        if (parseInt(codeNum) > 9999) {
            window.toast('领取人数不能超过9999')
            return false
        }
        if (overTime && overTime.valueOf() < this.props.sysTime) {
            window.toast('截止时间不能小于现在')
            return false
        }
        if (minMoney) {
            if (!/^\d+(\.\d{0,2})?$/.test(minMoney)) {
                window.toast('请输入正确的最低使用金额')
                return false
            }
            if (parseFloat(minMoney) > 50000 || parseFloat(minMoney) <= 0) {
                window.toast('最低使用金额应小于50000并大于0')
                return false
            }
        }
        if (remark && remark.length > 10) {
            window.toast('备注最多十个字')
            return false
        }
        return true
    }

    get isNoneChecked() {
        const list = this.state.list
        return !list.some(({ checked }) => checked)
    }

    async fetchList(next) {
        let { page, size, noMore, noneOne, list } = this.state
        const result = await this.props.getCouponList({
            liveId: this.liveId,
            businessType: 'live',
            businessId: this.liveId,
            page: {
                page,
                size
            },
        })
        const len = result.length

        if (len < size) {
            noMore = true
        }
        if (page === 1 && len === 0) {
            noneOne = true
            noMore = false
        }
        list = list.concat(result)
        page += 1
        this.setState({ list, noMore, noneOne, page }, () => { next && next() })
    }

    async createCoupon() {
        if (this.confirmLoading || !this.validForm) {
            return
        }
        this.confirmLoading = true
        const { money, minMoney, codeNum, overTime, remark, list } = this.state
        const result = await this.props.createCoupon({
            money: mul(money, 100),
            minMoney: mul(minMoney, 100),
            overTime: overTime ? dayjs(overTime).endOf('day').format('YYYY-MM-DD HH:mm:ss') : null,
            codeNum, remark,
            businessId: this.liveId,
            liveId: this.liveId,
            businessType: 'live',
            couponType: 'normal'
        })
        if (result.state.code === 0) {
            let minMoney = result.data.couponInfoDto.minMoney;
            minMoney  = minMoney;
            result.data.couponInfoDto.minMoney = minMoney;
            list.unshift(result.data.couponInfoDto)
            this.setState({
                modalVisible: false,
                list,
                money: '',
                codeNum: '',
                overTime: null,
                remark: '',
                noneOne: false,
            }, () => { this.confirmLoading = false })
        } else {
            window.toast(result.state.msg)
            this.confirmLoading = false
        }
    }

    async deleteCoupon() {
        // 显示loading
        window.loading(true)
        // 删除后的list和result
        const { list, result } = await this.getRestListAfterDel()
        if (result.state.code === 0) {
            this.setState({ list })
            if (Array.isArray(result.data.list) && result.data.list.length > 0) {
                window.toast('已被用户领取，不能删除')
            } else {
                window.toast('成功删除')
            }
        } else {
            window.toast(result.state.msg)
        }
        // 操作结束关闭loading
        window.loading(false)
    }

    async getRestListAfterDel() {
        // 需删除的listId
        let listIdToDelete = [],
            itemToDelete = {}    
        // 过滤
        let list = this.state.list
        list.filter((item, i) => {
            if (item.checked) {
                listIdToDelete.push(item.id)
                itemToDelete[i] = item
                delete list[i]
            }
        })
        // 服务器删除确认
        const result = await this.props.deleteCoupon({
            liveId: this.liveId,
            couponIdList: listIdToDelete
        })
        // 将已被领取的优惠券更新数据修改并送回list
        for (let key in itemToDelete) {
            Array.isArray(result.data.list) && result.data.list.forEach((item) => {
                if (itemToDelete[key].id === item.id) list[key] = item
            })
        }
        // 删除掉多余的数组项并返回
        return {
            list: list.filter((item) => {
                if (item) return item
            }),
            result
        }
    }

    confirmDeleteCoupon () { 
        window.confirmDialogPromise('确认删除？')
              .then(result => result && this.deleteCoupon())
    }

    showModal() {
        this.setState({ modalVisible: true })
    }

    onModalBtnClick(tab) {
        if (tab === 'confirm') {
            this.createCoupon()
        } else {
            this.setState({ modalVisible: false })
        }
        if (tab === 'cancel') {
            this.setState({ modalVisible: false })
        }
    }

    onMoneyChange(e) {
        this.setState({ money: e.target.value })
    }
    
    onMinMoneyChange(e) {
        this.setState({ minMoney: e.target.value })
    }

    onCodeNumChange(e) {
        this.setState({ codeNum: e.target.value })
    }

    onOverTimeClick(e) {
        this.setState({ datePickerVisible: true })
    }

    onRemarkChange(e) {
        this.setState({ remark: e.target.value })
    }

    onDatePickerSelect(e) {
        this.setState({
            datePickerVisible: false,
            overTime: e,
        })
    }

    clearMoney() {
        this.setState({ money: '' })
    }

    clearCodeNum() {
        this.setState({ codeNum: '' })
    }

    clearOverTime() {
        this.setState({
            overTime: null,
        })
    }

    clearRemark() {
        this.setState({ remark: '' })
    }


    onItemClick(couponId) {
        locationTo(`/wechat/page/coupon-manage/detail/${this.liveId}?couponId=${couponId}`)
    }

    onShareClick(couponId) {
        locationTo(`/wechat/page/coupon-manage/share/${this.liveId}?couponId=${couponId}&type=universal`)
    }
    // 是否在直播中心展示
    showInCenterHandle = async (type) => {
        
        if(type=="cancel")return
        let {couponId}=this.state
        let dataList = this.state.list 

        const result = await this.props.pushToCenter({
            couponId: couponId,
            status: "Y"
        })


        if(result && result.state && result.state.code === 0 ) {
            dataList.map((item) => {
                if(item.id == couponId) {
                    item.isCouponCenter = "Y"
                } else {
                    item.isCouponCenter = "N"
                }
            })
            this.setState({
                list: dataList
            })
            this.hideHelperHandle()
            window.toast("操作成功")
        } else {
            window.toast(result.state.msg || "操作失败，请稍后再试")
        }


    }
    
    hideInCenterHandle = async (couponId) => {
        let dataList = this.state.list 

        const result = await this.props.pushToCenter({
            couponId: couponId,
            status: "N"
        })


        dataList.map((item) => {
            if(item.id == couponId) {
                item.isCouponCenter = "N"
            } else {
                item.isCouponCenter = item.isCouponCenter
            }
        })
        this.setState({
            list: dataList
        })
    }
    // 是否允许课代表分享优惠券
    showInArrowHandle= async (type) => {
        
        if(type=="cancel")return
        let {couponId}=this.state
        let dataList = this.state.list 
        
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
                list: dataList
            })
            this.hideHelperHandle()
            window.toast("操作成功")
        } else {
            window.toast(result.state.msg || "操作失败，请稍后再试")
        } 
    }
    hideInArrowHandle= async (couponId) => {
        let dataList = this.state.list 

        const result = await this.props.setCouponShareStatus({
            couponId: couponId,
            shareStatus: "N"
        })


        dataList.map((item) => {
            if(item.id == couponId) {
                item.shareStatus = "N"
            } 
        })
        this.setState({
            list: dataList
        })
    }
    showHelperHandle = (couponId) => {
        this.setState({
            couponId: couponId
        }) 
        this.helpConfirm.show()
    }
    showIArrowHandle= (couponId) => {
        this.setState({
            couponId: couponId
        }) 
        this.arrowConfirm.show()
    }
    hideHelperHandle = () => {
        this.arrowConfirm.hide()
        this.helpConfirm.hide()
    }

    onEditCoupon = () => {
        const isEdit = this.state.isEdit
        this.setState({isEdit: !isEdit})
    }

    editCheckCoupon = (listIndex, useNum) => {
        if (useNum > 0) {
            window.toast('已被领取，不可勾选')
            return
        }
        const list = this.state.list
        // 修改选中状态
        list[listIndex].checked = !list[listIndex].checked
        this.setState({ list })
    }

    render() {
        const {
            modalVisible, datePickerVisible, 
            list, noMore, noneOne, isEdit, 
            money, minMoney, codeNum, overTime, remark,
        } = this.state
        return (
            <Page title={'优惠券'}>

                <Confirm
                    ref={ref => this.helpConfirm = ref}
                    title="确定选择这张吗?"
                    onBtnClick={this.showInCenterHandle}
                    confirmText='确定'
                    cancelText="取消"
                    className="helper"
                >
                    <div>领券中心只支持显示1张直播间通用券，请老师择优选择</div>
                    
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
                        <p>（1）勾选后，该优惠券可被“直播间课代表”分享传播；   </p>
                        <p>（2）课代表转发该优惠券，好友领取并购买课程，课代表可获得分成； </p> 
                    </div>
                    
                </Confirm>


                <div className='coupon-b-list-container'>
                    <div className="list-container">
                        <ScrollToLoad
                            loadNext={this.fetchList}
                            toBottomHeigh={600}
                            noMore={noMore}
                        >
                            {
                                list.map((item, index) =>
                                    <CouponItem
                                        key={`coupon-item-${index}`}
                                        index={index}
                                        {...item}
                                        showInCenter={item.isCouponCenter === "Y" ? true : false}
                                        shareStatus={item.shareStatus === "Y" ? true : false}
                                        sysTime={this.props.sysTime}
                                        onItemClick={this.onItemClick}
                                        onShareClick={this.onShareClick}
                                        showInCenterHandle={this.showInCenterHandle}
                                        hideInCenterHandle={this.hideInCenterHandle} 
                                        showHelperHandle={this.showHelperHandle}
                                        showIArrowHandle={this.showIArrowHandle}
                                        hideInArrowHandle={this.hideInArrowHandle}
                                        isEdit={isEdit}
                                        editCheckCoupon={this.editCheckCoupon}
                                    />
                                )
                            }
                        </ScrollToLoad>
                    </div>
                    {
                        noneOne &&
                        <div className='empty-list'>
                            <div className='none-item'></div>
                            <p>还没有直播间通用优惠券</p>
                        </div>
                    }
                    <footer>
                        {
                            isEdit ? 
                            <div  className={(this.isNoneChecked ? '' : 'delete-nouse')}>
                                <button 
                                    className="cancel-btn"
                                    onClick={this.onEditCoupon}
                                >取消</button>
                                <span></span>
                                <button 
                                    className={'delete-btn '}
                                    onClick={this.confirmDeleteCoupon}
                                    disabled={this.isNoneChecked}
                                >删除</button>
                            </div> : 
                            <button 
                                className="edit-btn"
                                onClick={() => {
                                    this.onEditCoupon()
                                }}
                            >编辑</button>
                        }
                        {
                            isEdit||
                            <button 
                                className="add-coupon-btn" 
                                onClick={this.showModal}
                            >添加直播间通用券</button>
                        }
                    </footer>
                </div>

                <MiddleDialog
                    show={modalVisible}
                    bghide
                    theme='empty'
                    title='添加直播间通用券'
                    titleTheme='white'
                    buttons='cancel-confirm'
                    buttonTheme='line'
                    onBtnClick={this.onModalBtnClick}
                    close={false}
                    onClose={() => { }}
                    className='create-live-coupon-modal'
                >
                    <div className="create-coupon-tip-once">
                        同一批优惠券1个用户只能领一次
                    </div>
                    <CreateForm
                        money={money}
                        minMoney={minMoney}
                        codeNum={codeNum}
                        overTime={overTime}
                        remark={remark}

                        onMoneyChange={this.onMoneyChange}
                        onMinMoneyChange={this.onMinMoneyChange}
                        onCodeNumChange={this.onCodeNumChange}
                        onRemarkChange={this.onRemarkChange}
                        onDatePickerSelect={this.onDatePickerSelect}

                        clearMoney={this.clearMoney}
                        clearCodeNum={this.clearCodeNum}
                        clearOverTime={this.clearOverTime}
                        clearRemark={this.clearRemark}
                    />
                </MiddleDialog>

            </Page>
        );
    }
}

CouponList.propTypes = {

};

function mstp(state) {
    return {
        sysTime: state.common.sysTime,
    }
}

const matp = {
    createCoupon,
    pushToCenter,
    setCouponShareStatus,
    getCouponList,
    deleteCoupon
}

export default connect(mstp, matp)(CouponList);
