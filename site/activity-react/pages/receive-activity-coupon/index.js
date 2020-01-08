import * as React from 'react';
import { render, findDOMNode } from 'react-dom';
import Page from '../../components/page';
import api from '../../utils/api';
import { formatMoney, locationTo, formatDate } from '../../utils/util';
import * as urlUtils from '../../utils/url-utils'
import * as envi from '../../utils/envi';
import * as ui from '../../utils/ui';
import './style.scss';

class ReceiveActivityCoupon extends React.Component { 
    constructor(props) {
        super(props);
        this.initData = window.INIT_DATA
    }

    data = {
        courseUrl : ""
    }

    componentDidMount() {
        this.initCourseUrl()
    }

    initCourseUrl = () => {
        const url = decodeURIComponent(urlUtils.getUrlParams("courseUrl")) 
        this.data.courseUrl = url
    }

    getCouponBtnHandle = async () => {
        const result = await api('/api/wechat/channel/activityCode/bind', {
            method: 'GET',
            body: {
                businessType: "channel",
                businessId: urlUtils.getUrlParams('channelId'),
                promotionId: urlUtils.getUrlParams('activityCode'),
            }
        })
        const courseUrl = this.data.courseUrl

        if((result && result.data && result.data.code) || result.state.code == 1000006) {
            ui.toast("领取成功")
            setTimeout(() => {
                window.location.href = this.data.courseUrl
            }, 300)
        } else {
            ui.toast(result.state.msg || "操作失败，请稍后再试")
        }
    }

    render(){
        const couponInfo = this.initData.couponInfo
        const channelInfo = this.initData.channelInfo

        return(
            <Page title="领取活动券" className='receive-activity-coupon'> 
                <div className="coupon">
                    <div className="money">{formatMoney(couponInfo.money)}</div>
                    <div className="cou-des">系列课优惠券</div>
                    <div className="time">{formatDate(couponInfo.startDate)} 到 {formatDate(couponInfo.endDate)}</div>
                    <div className="course-pre">适用课程</div>
                    <div className="course-name">{channelInfo.name}</div>
                    <div className="get-now-btn" onClick={this.getCouponBtnHandle}>马上领取</div>
                </div>

                <div className='des'>进入<em>个人中心</em>-<em>我的优惠券</em>-<em>平台活动券</em>下查看</div>
            </Page>
        )
    }
}


render(<ReceiveActivityCoupon />, document.getElementById('app'))
